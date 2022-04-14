const express = require('express');
const moment = require('moment');
const fetch = require('node-fetch');

const cloudscraper = require('cloudscraper');

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const fs = require('fs');
const jimp = require('jimp');

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

const cache = {
	timestamp: null,
	page: null
};

async function start() {
	// const browser = await puppeteer.launch({
	// 	executablePath: '/usr/bin/google-chrome'
	// headless: false

	// executablePath: '/usr/bin/chromium-browser',
	// args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
	// });

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
				/<span data-id=\"7\".*?>(.+?)<span data-id=\"8\"/
			],
			7: [/id=\"tab-8\".*?>(.+)/, /<span data-id=\"8\".*?>(.+)/]
		};

		try {
			let uncluttered;

			if (!cache.timestamp || new Date().getTime() - cache.timestamp > 300000) {
				const response = await cloudscraper.get('https://japscan.se');
				uncluttered = clearString(response);

				cache.timestamp = new Date().getTime();
				cache.page = uncluttered;
			} else uncluttered = cache.page;

			let choosenDay;

			try {
				choosenDay = uncluttered.match(req.query.day ? days[req.query.day][0] : days[0][0])[1];
				fs.writeFileSync('ok.html', uncluttered);
			} catch {
				cache.timestamp = null;
				cache.page = null;

				choosenDay = uncluttered.match(req.query.day ? days[req.query.day][1] : days[0][1])[1];
				console.log(req.query.day ? days[req.query.day][1] : days[0][1]);
				fs.writeFileSync('error.html', uncluttered);
				fs.writeFileSync('regexed', choosenDay);
			}

			const mangaOfTheDay = [...choosenDay.match(/<h3 class=\"text-truncate.*?>.*?<\/div>/gm)];
			const parsed = mangaOfTheDay.map(e => ({
				href: e.tryMatch(/href=\"(\/manga\/.+?)\"/),
				name: e.tryMatch(/href=\"\/manga\/.+?\">(.*?)<\/a>/),
				hot: e.match(/<span class=\"badge badge-pill badge-danger align-text-top\">Hot<\/span>/) ? true : false,
				chapters: [
					...e.matchAll(
						/href=\"(\/lecture-en-ligne\/.+?)\">(.*?)<\/a>.*?((<span.*?>(.+?)<\/span>)|(<\/p>)|(<\/div))/g
					)
				].map(c => ({
					href: c[1],
					name: c[2],
					infos: c[5] || ''
				}))
			}));

			res.send(parsed);
		} catch (error) {
			cache.timestamp = null;
			cache.page = null;

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

			// const chapters = [
			// 	...uncluttered.matchAll(
			// 		/<div class=\"chapters_list.*?\">.*?<span.*?>(.+?)<.*?href=\"(.+?)\".*?>(.+?)((<span.*?>(.+?)<\/span>)|(<\/a>))/g
			// 	)
			// ].map(c => {
			// 	return {
			// 		href: c[2].trim(),
			// 		name: c[3].trim(),
			// 		date: c[1].trim(),
			// 		infos: c[6] || ''
			// 	};
			// });

			const chapters = [...uncluttered.matchAll(/<div class=\"chapters_list.*?\">(.+?)<\/div>/g)].map(c => {
				const date = c[0].match(/<span class=\"float-right\">(.+?)<\/span>/);
				const [, href, name] = c[0].match(/<a.*?href=\"(.+?)\".*?>(.+?)<\/a>/);
				const infos = name.match(/<span.*?>(.+?)<\/span>/);

				return {
					href: href.trim(),
					name: name.split('<span')[0].trim(),
					date: date ? date[1].trim() : '',
					infos: infos ? infos[1] : ''
				};
			});

			if (chapters.length === 0) fs.writeFileSync('error.html', uncluttered);

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
		const browser = await puppeteer.launch({
			executablePath: '/usr/bin/google-chrome'
			// headless: false

			// executablePath: '/usr/bin/chromium-browser',
			// args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
		});

		const page = await browser.newPage();
		browserTimeout = setTimeout(() => (browser ? browser.close() : () => ({})), 15000);
		let sended = false;

		let [, , manga, chapter, nb] = req.query.uri.split('/');
		let next = null;
		let chapterName = null;

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
			clearTimeout(browserTimeout);

			if (response.url().match(/^https:\/\/www.japscan\.\w+/) && response.url().includes(req.query.uri)) {
				const text = await response.text();
				next = text.tryMatch(/data-next-link=\"(.+?)\"/);
				chapterName = text.tryMatch(/<h1.+?>(.+?)<\/h1/);

				const files = fs.readdirSync('assets/img');

				// on skip des pages, faut revoir
				// pourquoi faire une loop et pas direct send si le fichier existe ?
				for (let file of files) {
					if (file.startsWith(`${manga}-${chapter}-${nb}.`) && !sended) {
						sended = true;
						res.send({ img: `img/${file}`, next, chapterName });
						// send + tot (mais il faut recuperer le next)
					}
				}
			}

			if (response.url().match(/https:\/\/cdn\.statically\.io\/img\/c\.japscan\..+/)) {
				const matches = /.*\.(jpg|png|svg|gif)$/.exec(response.url());
				if (matches && matches.length === 2) {
					const extension = matches[1];
					const buffer = await response.buffer();

					const img = await jimp.read(buffer);
					img.resize(800, jimp.AUTO).quality(60).write(`assets/img/${manga}-${chapter}-${nb}.${extension}`);

					// fs.writeFileSync(`assets/img/${manga}-${chapter}-${nb}.${extension}`, buffer, 'base64');

					if (!sended) {
						try {
							sended = true;
							res.send({ img: `img/${manga}-${chapter}-${nb}.${extension}`, next, chapterName });
						} catch {}
					}

					nb += 1;
				}
			}

			browserTimeout = setTimeout(() => (browser ? browser.close() : () => ({})), 15000);
		});

		await page.goto(`https://japscan.se${req.query.uri}`);
	});

	app.get('/search/:query', async (req, res) => {
		const query = req.params.query.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

		try {
			const params = new URLSearchParams();
			params.append('search', query);

			const response = await fetch('https://www.japscan.ws/live-search/', {
				method: 'POST',
				headers: { 'X-Requested-With': 'XMLHttpRequest' },
				body: params
			});

			const data = await response.json();

			return res.send(data);
		} catch (err) {
			console.log(`${err.name}: ${err.message}`);
		}

		res.sendStatus(200);
	});

	app.get('/empty', async (req, res) => {
		res.sendStatus(200);
	});

	app.get('/dl/chapter', async (req, res) => {
		const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome' });

		const [, , manga, chapter] = req.query.uri.split('/');
		const pages = [{ uri: req.query.uri }];

		const page = await browser.newPage();
		await page.setRequestInterception(true);

		page.on('request', request => {
			const url = request.url();
			const filters = ['japscan.ws', 'japscan.se', 'cdnjs.cloudflare.com', 'ajax.cloudflare.com'];

			const shouldPass = filters.some(urlPart => url.includes(urlPart));

			if (shouldPass) request.continue();
			else request.abort();
		});

		const getURIs = new Promise(resolve => {
			page.on('response', async response => {
				if (response.url().match(/^https:\/\/www.japscan\.\w+/) && response.url().includes(req.query.uri)) {
					const text = await response.text().catch(e => void e);
					if (!text) return;

					next = text.tryMatch(/data-next-link=\"(.+?)\"/);
					chapterName = text.tryMatch(/<h1.+?>(.+?)<\/h1/);

					if (next.split(manga)[1].split('/')[1] != chapter) return resolve();

					pages.push({ uri: next, img: 'error.png' });
					page.goto(`https://japscan.se${next}`).catch(e => void e);
				}
			});
		});

		await page.goto(`https://japscan.se${req.query.uri}`);
		await getURIs;

		await page.close();

		const iPage = await browser.newPage();
		await iPage.setRequestInterception(true);

		let index = 0;

		iPage.on('request', request => {
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

		const cache = { url: null, timeout: null };
		const getImgs = new Promise(resolve => {
			let exitTimeout = setTimeout(resolve, 15000);

			// il faudrait p-e faire une page par lien plutot que le goto (et une promise a chaque fois pour faire des retry)
			iPage.on('response', async response => {
				if (response.url().match(/https:\/\/cdn\.statically\.io\/img\/c\.japscan\..+/)) {
					const matches = /.*\.(jpg|png|svg|gif)$/.exec(response.url());
					if (matches && matches.length === 2) {
						clearTimeout(cache.timeout);

						const extension = matches[1];

						const buffer = await response.buffer().catch(e => void e);
						if (!buffer) throw 'Error';

						index += 1;

						const img = await jimp.read(buffer);
						img.resize(800, jimp.AUTO)
							.quality(60)
							.write(`assets/img/${manga}-${chapter}-${index}.${extension}`);

						pages[index - 1].img = `img/${manga}-${chapter}-${index}.${extension}`;

						if (index >= pages.length) return resolve();

						cache.timeout = setTimeout(() => {
							if (!pages[index]) return;
							const uri = `https://japscan.se${pages[index].uri}`;

							if (uri !== cache.uri) {
								cache.uri = uri;

								clearTimeout(exitTimeout);
								iPage.goto(uri).catch(e => void e);
								exitTimeout = setTimeout(resolve, 15000);
							}
						}, 100);
					}
				}
			});
		});

		await iPage.goto(`https://japscan.se${pages[index].uri}`);
		await getImgs;

		browser.close();

		console.log(pages);

		res.send(pages);
	});

	// setInterval(() => {
	// 	const now = moment();

	// 	fs.readdir('assets/img', (err, files) => {
	// 		for (file of files) {
	// 			const stats = fs.statSync(`assets/img/${file}`);

	// 			if (now - moment(stats.birthtime) > 60000) {
	// 				fs.unlink(`assets/img/${file}`, () => ({}));
	// 			}
	// 		}
	// 	});
	// }, 120000);
}

start();

module.exports = { path: '/api', handler: app };
