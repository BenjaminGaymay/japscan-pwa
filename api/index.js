const express = require('express');
const moment = require('moment');
const fetch = require('node-fetch');

const cloudscraper = require('cloudscraper');

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const fs = require('fs');

const app = express();

String.prototype.tryMatch = function (regex, index = 1) {
	try {
		return this.toString().match(regex)[index].trim();
	} catch {
		return null;
	}
};

function clearString(string) {
	return string
		.replace(/(\n|\t)/g, ' ')
		.replace(/&#(?:x([\da-f]+)|(\d+));/gi, (_, hex, dec) => String.fromCharCode(dec || +('0x' + hex)));
}

async function start() {
	const browser = await puppeteer.launch({
		executablePath: '/usr/bin/google-chrome'

		// executablePath: '/usr/bin/chromium-browser',
		// args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
	});

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
			0: [
				/id=\"tab-1\".*?>(.+?)<div class=\"tab-pane container \" id=\"tab-2\">/,
				/<span data-id=\"1\".*?>(.+?)<span data-id=\"2\"/
			],
			1: [
				/id=\"tab-2\".*?>(.+?)<div class=\"tab-pane container \" id=\"tab-3\">/,
				/<span data-id=\"2\".*?>(.+?)<span data-id=\"3\"/
			],
			2: [
				/id=\"tab-3\".*?>(.+?)<div class=\"tab-pane container \" id=\"tab-4\">/,
				/<span data-id=\"3\".*?>(.+?)<span data-id=\"4\"/
			],
			3: [
				/id=\"tab-4\".*?>(.+?)<div class=\"tab-pane container \" id=\"tab-5\">/,
				/<span data-id=\"4\".*?>(.+?)<span data-id=\"5\"/
			],
			4: [
				/id=\"tab-5\".*?>(.+?)<div class=\"tab-pane container \" id=\"tab-6\">/,
				/<span data-id=\"5\".*?>(.+?)<span data-id=\"6\"/
			],
			5: [
				/id=\"tab-6\".*?>(.+?)<div class=\"tab-pane container \" id=\"tab-7\">/,
				/<span data-id=\"6\".*?>(.+?)<span data-id=\"7\"/
			],
			6: [
				/id=\"tab-7\".*?>(.+?)<div class=\"tab-pane container \" id=\"tab-8\">/,
				/<span data-id=\"7\".*?>(.+?)<span data-id=\"5\"/
			],
			7: [/id=\"tab-8\".*?>(.+)/, /<span data-id=\"8\".*?>(.+)/]
		};

		try {
			const response = await cloudscraper.get('https://japscan.se');
			const uncluttered = clearString(response);

			let choosenDay;

			try {
				choosenDay = uncluttered.match(req.query.day ? days[req.query.day][0] : days[0][0])[1];
			} catch {
				console.log(req.query.day ? days[req.query.day][1] : days[0][1]);
				fs.writeFileSync('a.html', uncluttered);
				choosenDay = uncluttered.match(req.query.day ? days[req.query.day][1] : days[0][1])[1];
				fs.writeFileSync('regexed', choosenDay);
			}

			const mangaOfTheDay = [...choosenDay.match(/<h3 class=\"text-truncate.*?>.*?<\/div>/gm)];
			const parsed = mangaOfTheDay.map(e => ({
				href: e.tryMatch(/href=\"(\/manga\/.+?)\"/),
				name: e.tryMatch(/href=\"\/manga\/.+?\">(.*?)<\/a>/),
				hot: e.match(/<span class=\"badge badge-pill badge-danger align-text-top\">Hot<\/span>/) ? true : false,
				chapters: [
					...e.matchAll(/href=\"(\/lecture-en-ligne\/.+?)\">(.*?)<\/a>.*?((<span.*?>(.+?)<\/span>)|(<\/p>))/g)
				].map(c => ({
					href: c[1],
					name: c[2],
					infos: c[5] || ''
				}))
			}));

			res.send(parsed);
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	});

	app.get('/manga', async (req, res) => {
		try {
			const response = await cloudscraper.get(`https://japscan.se${req.query.uri}/`);
			const uncluttered = clearString(response);

			const title = uncluttered.tryMatch(/<h1>(.+?)<\/h1>/);
			const imgURL = uncluttered.tryMatch(/<img .+? src=\"(.+?)\" alt=\"\">/);
			const date = uncluttered.tryMatch(/Date Sortie:<\/span>(.+?)<\/p>/);
			const status = uncluttered.tryMatch(/Statut:<\/span>(.+?)<\/p>/);
			const type = uncluttered.tryMatch(/Type\(s\):<\/span>(.+?)<\/p>/);
			const genre = uncluttered.tryMatch(/Genre\(s\):<\/span>(.+?)<\/p>/);
			const author = uncluttered.tryMatch(/Auteur\(s\):<\/span>(.+?)<\/p>/);
			const volumes = uncluttered.tryMatch(/Volumes VF:<\/span>(.+?)<\/p>/);
			const anime = uncluttered.tryMatch(/Adaptation En Animé:<\/span>(.+?)<\/p>/);
			const synopsis = uncluttered.tryMatch(
				/<p class=\"list-group-item list-group-item-primary text-justify\">(.+?)<\/p>/
			);

			const chapters = [
				...uncluttered.matchAll(
					/<div class=\"chapters_list text-truncate\">.*?<span.*?>(.+?)<.*?href=\"(.+?)\".*?>(.+?)((<span.*?>(.+?)<\/span>)|(<\/a>))/g
				)
			].map(c => ({
				date: c[1].trim(),
				href: c[2].trim(),
				name: c[3].trim(),
				infos: c[6] || ''
			}));

			const files = fs.readdirSync('assets/img');
			const imgName = imgURL.split('/mangas/')[1];

			if (!files.includes(imgName)) {
				const imgResponse = await fetch(`https://japscan.se${imgURL}`);
				const buffer = await imgResponse.buffer();

				fs.writeFileSync(`assets/img/${imgName}`, buffer);
			}

			res.send({
				infos: {
					title,
					img: `/img/${imgName}`,
					date,
					status,
					type,
					genre,
					author,
					volumes,
					anime,
					synopsis
				},

				chapters
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	});

	app.get('/page', async (req, res) => {
		const page = await browser.newPage();
		pageTimeout = setTimeout(() => (page && !page.isClosed() ? page.close() : () => ({})), 15000);
		let sended = false;

		let [, , manga, chapter, nb] = req.query.uri.split('/');
		let next = null;

		nb = !nb ? 1 : parseInt(nb);

		await page.setRequestInterception(true);
		page.on('request', request => {
			const url = request.url();
			const filters = [
				'japscan.ws',
				'japscan.se',
				'cdnjs.cloudflare.com',
				'cdn.statically.io',
				'ajax.cloudflare.com'
			];

			const shouldPass = filters.some(urlPart => url.includes(urlPart));

			if (shouldPass) request.continue();
			else request.abort();
		});

		page.on('response', async response => {
			clearTimeout(pageTimeout);

			if (response.url().match(/^https:\/\/www.japscan\.\w+/) && response.url().includes(req.query.uri)) {
				next = (await response.text()).tryMatch(/data-next-link=\"(.+?)\"/);
				const files = fs.readdirSync('assets/img');

				for (let file of files) {
					if (file.startsWith(`${manga}-${chapter}-${nb}.`) && !sended) {
						sended = true;
						res.send({ img: `img/${file}`, next });
					}
				}
			}

			if (response.url().match(/https:\/\/cdn\.statically\.io\/img\/c\.japscan\..+/)) {
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

			pageTimeout = setTimeout(() => (page && !page.isClosed() ? page.close() : () => ({})), 15000);
		});

		await page.goto(`https://japscan.se${req.query.uri}`);
	});

	setInterval(() => {
		const now = moment();

		fs.readdir('assets/img', (err, files) => {
			for (file of files) {
				const stats = fs.statSync(`assets/img/${file}`);

				if (now - moment(stats.birthtime) > 60000) {
					fs.unlink(`assets/img/${file}`, () => ({}));
				}
			}
		});
	}, 120000);
}

start();

module.exports = { path: '/api', handler: app };
