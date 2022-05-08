import express from 'express';
import moment from 'moment';
import fetch from 'node-fetch';

const app = express();

import {
	HOME_DAYS,
	HOME_MANGA_CHAPTER,
	HOME_MANGA_HREF,
	HOME_MANGA_ISHOT,
	HOME_MANGA_NAME,
	HOME_MANGA_OF_DAY
} from './regex/home.js';

import {
	CHAPTER_DATE,
	CHAPTER_HREF_NAME,
	CHAPTER_INFOS,
	MANGA_AUTHOR,
	MANGA_CHAPTERS,
	MANGA_DATE,
	MANGA_GENRE,
	MANGA_IMG,
	MANGA_ISANIME,
	MANGA_STATUS,
	MANGA_SYNOPSIS,
	MANGA_TITLE,
	MANGA_TYPE,
	MANGA_VOLUME
} from './regex/manga.js';
import { clearString } from './strings.js';
import { CYPHER, CYPHER_REGEX } from './cypher.js';

const cache = {
	timestamp: null,
	page: null
};

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
			decodeURIComponent(req.originalUrl),
			Math.round(elapsedTimeInMs),
			res.statusCode
		);
	});

	next();
});

app.get('/', async (req, res) => {
	try {
		let uncluttered;

		if (!cache.timestamp || new Date().getTime() - cache.timestamp > 300000) {
			const response = await fetch('https://www.japscan.se');
			const text = await response.text();

			uncluttered = clearString(text);

			cache.timestamp = new Date().getTime();
			cache.page = uncluttered;
		} else uncluttered = cache.page;

		let chosenDay;

		try {
			chosenDay = uncluttered.match(req.query.day ? HOME_DAYS[req.query.day][0] : HOME_DAYS[0][0])[1];
		} catch {
			cache.timestamp = null;
			cache.page = null;

			chosenDay = uncluttered.match(req.query.day ? HOME_DAYS[req.query.day][1] : HOME_DAYS[0][1])[1];
		}

		const mangaOfTheDay = [...chosenDay.match(HOME_MANGA_OF_DAY)];
		const parsed = mangaOfTheDay.map(e => ({
			href: e.tryMatch(HOME_MANGA_HREF),
			name: e.tryMatch(HOME_MANGA_NAME),
			hot: e.match(HOME_MANGA_ISHOT) ? true : false,
			chapters: [...e.matchAll(HOME_MANGA_CHAPTER)].map(c => ({
				href: c[1],
				name: c[2],
				infos: c[5] || ''
			}))
		}));

		res.send(parsed);
	} catch (error) {
		cache.timestamp = null;
		cache.page = null;

		res.send(error);
	}
});

app.get('/manga', async (req, res) => {
	try {
		const response = await fetch(`https://japscan.se${req.query.uri}/`);
		const text = await response.text();

		const uncluttered = clearString(text);

		const title = uncluttered.tryMatch(MANGA_TITLE);
		const imgURL = uncluttered.tryMatch(MANGA_IMG);
		const date = uncluttered.tryMatch(MANGA_DATE);
		const status = uncluttered.tryMatch(MANGA_STATUS);
		const type = uncluttered.tryMatch(MANGA_TYPE);
		const genre = uncluttered.tryMatch(MANGA_GENRE);
		const author = uncluttered.tryMatch(MANGA_AUTHOR);
		const volumes = uncluttered.tryMatch(MANGA_VOLUME);
		const anime = uncluttered.tryMatch(MANGA_ISANIME);
		const synopsis = uncluttered.tryMatch(MANGA_SYNOPSIS);

		const chapters = [...uncluttered.matchAll(MANGA_CHAPTERS)].map(c => {
			const date = c[0].match(CHAPTER_DATE);
			const [, href, name] = c[0].match(CHAPTER_HREF_NAME);
			const infos = name.match(CHAPTER_INFOS);

			return {
				href: href.trim(),
				name: name.split('<span')[0].trim(),
				date: date ? date[1].trim() : '',
				infos: infos ? infos[1] : ''
			};
		});

		res.send({
			infos: {
				title,
				img: `https://japscan.ws${imgURL}`,
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

async function getPage(url, tries = 0) {
	try {
		const response = await fetch(url);
		const text = await response.text();

		const img = text.tryMatch(/data-src=\"https:\/\/c\.japscan\.ws\/(.+?)"/);
		const [uri, ext] = img.split('.');

		const next = text.tryMatch(/data-next-link=\"(.+?)\"/);
		const chapterName = text.tryMatch(/<h1.+?>(.+?)<\/h1/);

		const decoded = uri.replace(CYPHER_REGEX, c => CYPHER[c]);

		return { img: `https://cdn.statically.io/img/c.japscan.ws/f=auto,w=600/${decoded}.${ext}`, next, chapterName };
	} catch (e) {
		console.log('error', e);
		if (tries > 2) return { img: null, next: null, chapterName: null };
		return getPage(url, tries + 1);
	}
}

app.get('/page', async (req, res) => {
	const response = await getPage(`https://japscan.se${req.query.uri}`);
	res.send(response);
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

app.get('/dl/chapter', async (req, res) => {
	const [, , manga, chapter] = req.query.uri.split('/');
	const pages = [];

	let nextPage = req.query.uri;

	do {
		const { img, next } = await getPage(`https://japscan.se${nextPage}`);

		pages.push({ uri: nextPage, img });
		nextPage = next;
	} while (nextPage.split(manga)[1].split('/')[1] === chapter);

	res.send(pages);
});

export default { path: '/api', handler: app };
