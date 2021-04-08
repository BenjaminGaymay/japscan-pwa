const express = require('express');
const moment = require('moment');

const cloudflareScraper = require('cloudflare-scraper');

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const fs = require('fs');

(async () => {
	const browser = await puppeteer.launch({
		executablePath: '/usr/bin/google-chrome'
	});
	// headless: false

	const app = express();

	app.use(express.static('assets'));

	app.use((req, res, next) => {
		const startHrTime = process.hrtime();

		res.on('finish', () => {
			const elapsedHrTime = process.hrtime(startHrTime);
			const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

			console.log(
				'[%s] %s %s : %fms - %s',
				moment().format('HH:mm DD MMM YYYY'),
				req.method,
				req.originalUrl,
				Math.round(elapsedTimeInMs),
				res.statusCode
			);
		});

		next();
	});

	app.get('/', async (req, res) => {
		const days = {
			0: /id=\"tab-1\">(.+?)<div class=\"tab-pane container \" id=\"tab-2\">/,
			1: /id=\"tab-2\">(.+?)<div class=\"tab-pane container \" id=\"tab-3\">/,
			2: /id=\"tab-3\">(.+?)<div class=\"tab-pane container \" id=\"tab-4\">/,
			3: /id=\"tab-4\">(.+?)<div class=\"tab-pane container \" id=\"tab-5\">/,
			4: /id=\"tab-5\">(.+?)<div class=\"tab-pane container \" id=\"tab-6\">/,
			5: /id=\"tab-6\">(.+?)<div class=\"tab-pane container \" id=\"tab-7\">/,
			6: /id=\"tab-7\">(.+?)<div class=\"tab-pane container \" id=\"tab-8\">/,
			7: /id=\"tab-8\">(.+?)$/
		};

		try {
			const response = await cloudflareScraper.get('https://japscan.se');
			const uncluttered = response.replace(/(\n|\t)/g, ' ');
			const choosenDay = uncluttered.match(req.query.day ? days[req.query.day] : days[0])[1];

			const mangaOfTheDay = [...choosenDay.match(/<h3 class=\"text-truncate\">.*?<\/div>/gm)];
			const parsed = mangaOfTheDay.map(e => ({
				href: e.match(/href=\"(\/manga\/.+?)\"/)[1],
				name: e.match(/href=\"\/manga\/.+?\">(.*?)<\/a>/)[1],
				hot: e.match(/<span class=\"badge badge-pill badge-danger align-text-top\">Hot<\/span>/) ? true : false,
				chapters: [...e.matchAll(/href=\"(\/lecture-en-ligne\/.+?)\">(.*?)<\/a>/g)].map(c => ({
					href: c[1],
					name: c[2]
				}))
			}));

			res.send(parsed);
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	});

	app.get('/page', async (req, res) => {
		const page = await browser.newPage();
		pageTimeout = setTimeout(() => (page && !page.isClosed() ? page.close() : () => ({})), 5000);
		let sended = false;

		let [, , manga, chapter, nb] = req.query.uri.split('/');
		let next = null;

		nb = !nb ? 1 : parseInt(nb);

		await page.setRequestInterception(true);
		page.on('request', request => {
			const url = request.url();
			const filters = [
				'japscan.se',
				'cdnjs.cloudflare.com',
				'cdn.statically.io',
				'ajax.cloudflare.com',
				'fonts.googleapis.com'
			];

			const shouldPass = filters.some(urlPart => url.includes(urlPart));

			if (shouldPass) request.continue();
			else request.abort();
		});

		page.on('response', async response => {
			clearTimeout(pageTimeout);

			if (response.url().match(/^https:\/\/www.japscan\.se/) && response.url().includes(req.query.uri)) {
				next = (await response.text()).match(/data-next-link=\"(.+?)\"/)[1];
				const files = fs.readdirSync('assets/img');

				for (let file of files) {
					if (file.startsWith(`${manga}-${chapter}-${nb}.`) && !sended) {
						sended = true;
						res.send({ img: `img/${file}`, next });
					}
				}
			}

			if (response.url().match(/https:\/\/cdn\.statically\.io\/img\/c\.japscan\.se.+/)) {
				const matches = /.*\.(jpg|png|svg|gif)$/.exec(response.url());
				if (matches && matches.length === 2) {
					const extension = matches[1];
					const buffer = await response.buffer();

					fs.writeFileSync(`assets/img/${manga}-${chapter}-${nb}.${extension}`, buffer, 'base64');

					if (!sended) {
						try {
							sended = true;
							res.send({ img: `img/${manga}-${chapter}-${nb}.${extension}`, next });
						} catch {}
					}

					nb += 1;
				}
			}

			pageTimeout = setTimeout(() => (page && !page.isClosed() ? page.close() : () => ({})), 5000);
		});

		await page.goto(`https://japscan.se${req.query.uri}`);
	});

	app.listen(3001);
})();
