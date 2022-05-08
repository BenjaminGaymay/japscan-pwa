export const HOME_DAYS = {
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

export const HOME_MANGA_OF_DAY = /<h3 class=\"text-truncate.*?>.*?<\/div>/gm;
export const HOME_MANGA_HREF = /href=\"(\/manga\/.+?)\"/;
export const HOME_MANGA_NAME = /href=\"\/manga\/.+?\">(.*?)<\/a>/;
export const HOME_MANGA_ISHOT = /<span class=\"badge badge-pill badge-danger align-text-top\">Hot<\/span>/;
export const HOME_MANGA_CHAPTER =
	/href=\"(\/lecture-en-ligne\/.+?)\">(.*?)<\/a>.*?((<span.*?>(.+?)<\/span>)|(<\/p>)|(<\/div))/g;
