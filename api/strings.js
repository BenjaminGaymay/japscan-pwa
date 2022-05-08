import { decode } from 'html-entities';

String.prototype.tryMatch = function (regex, index = 1) {
	try {
		return this.toString().match(regex)[index].trim();
	} catch {
		return null;
	}
};

export function clearString(string) {
	return decode(string)
		.replace(/(\n|\t)/g, ' ')
		.replace(/&#(?:x([\da-f]+)|(\d+));/gi, (_, hex, dec) => String.fromCharCode(dec || +('0x' + hex)));
}
