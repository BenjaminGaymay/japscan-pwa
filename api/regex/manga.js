export const MANGA_TITLE = /<h1>(.+?)<\/h1>/;
export const MANGA_IMG = /<img .+? src=\"(.+?)\" alt=\"\">/;
export const MANGA_DATE = /Date Sortie:<\/span>(.+?)<\/p>/;
export const MANGA_STATUS = /Statut:<\/span>(.+?)<\/p>/;
export const MANGA_TYPE = /Type\(s\):<\/span>(.+?)<\/p>/;
export const MANGA_GENRE = /Genre\(s\):<\/span>(.+?)<\/p>/;
export const MANGA_AUTHOR = /Auteur\(s\):<\/span>(.+?)<\/p>/;
export const MANGA_VOLUME = /Volumes VF:<\/span>(.+?)<\/p>/;
export const MANGA_ISANIME = /Adaptation En Animé:<\/span>(.+?)<\/p>/;
export const MANGA_SYNOPSIS = /<p class=\"list-group-item list-group-item-primary text-justify\">(.+?)<\/p>/;

export const MANGA_CHAPTERS = /<div class=\"chapters_list.*?\">(.+?)<\/div>/g;
export const CHAPTER_DATE = /<span class=\"float-right\">(.+?)<\/span>/;
export const CHAPTER_HREF_NAME = /<a.*?href=\"(.+?)\".*?>(.+?)<\/a>/;
export const CHAPTER_INFOS = /<span.*?>(.+?)<\/span>/;
