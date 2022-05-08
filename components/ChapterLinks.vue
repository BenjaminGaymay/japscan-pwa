<template>
	<div class="chapters">
		<div v-if="dlStatus" class="loader-box fixed inset-0">
			<Loader />

			<div class="absolute top-2/3 left-1/2 -translate-x-1/2 transform text-center text-2xl font-semibold">
				{{ dlStatus }}
			</div>
		</div>

		<div
			v-for="chapter in max && little ? chapters.slice(0, max) : chapters"
			:key="chapter.href"
			class="chapter-link"
		>
			<NuxtLink
				:to="
					!dlChapters.includes(chapter.name)
						? chapter.href
						: chapter.href.replace('/lecture-en-ligne/', '/lecture-hors-ligne/')
				"
			>
				<div class="chapter-link-item mr-4 overflow-hidden overflow-ellipsis whitespace-nowrap capitalize">
					{{ chapter.name }}
				</div>
			</NuxtLink>

			<div
				class="chapter-link-infos mr-4 overflow-hidden overflow-ellipsis whitespace-nowrap rounded-xl bg-pink-300 px-1 text-sm text-gray-800 shadow"
				v-if="chapter.infos"
			>
				{{ chapter.infos }}
			</div>

			<div class="ml-auto overflow-hidden overflow-ellipsis whitespace-nowrap text-pink-300" v-if="chapter.date">
				{{ getDateInFrench(chapter.date) }}
			</div>

			<div v-if="!isMounted" class="ml-4 pt-1">
				<svg width="17px" height="17px" viewBox="0 0 100 100">
					<g fill="#F9A8D4">
						<g transform="translate(2.000000, 2.000000)">
							<path
								d="M48,96 C74.509668,96 96,74.509668 96,48 C96,21.490332 74.509668,0 48,0 C21.490332,0 0,21.490332 0,48 C0,74.509668 21.490332,96 48,96 Z"
							></path>
						</g>
					</g>
				</svg>
			</div>

			<div
				v-else-if="!dlChapters.includes(chapter.name)"
				class="dl ml-4 cursor-pointer pt-1"
				@click="dlChapter(chapter.name, chapter.href)"
			>
				<svg width="17px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
					<path
						d="M120.95739,82.11254a6.95115,6.95115,0,0,0-8.90605,4.16184l-3.72153,10.2512a2.90051,2.90051,0,0,1-2.72006,1.90414H22.39291a2.906,2.906,0,0,1-2.72322-1.906l-3.721-10.24932a6.95117,6.95117,0,0,0-13.06789,4.744L6.6026,101.26995a16.85123,16.85123,0,0,0,15.79031,11.06192h83.21683a16.843,16.843,0,0,0,15.78847-11.064l3.721-10.24948A6.95114,6.95114,0,0,0,120.95739,82.11254Z"
					/>
					<path
						d="M87.66688,66.17821V47.43306l-.01966-.02953-16.83785,11.53v-36.456a6.80941,6.80941,0,1,0-13.61881,0V58.86275L40.45609,47.40353l-.123.17955v18.5238L64.05163,82.348Z"
					/>
				</svg>
			</div>

			<div v-else class="ml-4 pt-1">
				<svg v-if="!removable" width="17px" height="17px" viewBox="0 0 100 100">
					<g stroke="none" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<g transform="translate(2.000000, 2.000000)" stroke="rgb(147, 197, 253)" stroke-width="8">
							<path
								d="M48,96 C74.509668,96 96,74.509668 96,48 C96,21.490332 74.509668,0 48,0 C21.490332,0 0,21.490332 0,48 C0,74.509668 21.490332,96 48,96 Z"
							></path>
							<polyline
								points="27.7058857 47.0210276 42.0345786 61.4826208 67.9945661 35.4382535"
							></polyline>
						</g>
					</g>
				</svg>

				<svg
					v-else
					class="blue-hover cursor-pointer"
					xmlns="http://www.w3.org/2000/svg"
					fill="#F9A8D4"
					width="17px"
					height="17px"
					viewBox="0 0 92 92"
					@click="removeChapter(chapter.name)"
				>
					<path
						d="M70.7,64.3c1.8,1.8,1.8,4.6,0,6.4c-0.9,0.9-2,1.3-3.2,1.3c-1.2,0-2.3-0.4-3.2-1.3L46,52.4L27.7,70.7
	c-0.9,0.9-2,1.3-3.2,1.3s-2.3-0.4-3.2-1.3c-1.8-1.8-1.8-4.6,0-6.4L39.6,46L21.3,27.7c-1.8-1.8-1.8-4.6,0-6.4c1.8-1.8,4.6-1.8,6.4,0
	L46,39.6l18.3-18.3c1.8-1.8,4.6-1.8,6.4,0c1.8,1.8,1.8,4.6,0,6.4L52.4,46L70.7,64.3z"
					/>
				</svg>
			</div>
		</div>

		<div v-if="max && chapters.length > max" @click="little = !little" class="cursor-pointer">
			<svg
				class="m-auto transform"
				:class="{ 'rotate-90': little, '-rotate-90': !little }"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				x="0px"
				y="0px"
				viewBox="0 0 448.011 448.011"
				xml:space="preserve"
				fill="#F9A8D4"
				width="15px"
			>
				<path
					d="M438.731,209.463l-416-192c-6.624-3.008-14.528-1.216-19.136,4.48c-4.64,5.696-4.8,13.792-0.384,19.648l136.8,182.4
			l-136.8,182.4c-4.416,5.856-4.256,13.984,0.352,19.648c3.104,3.872,7.744,5.952,12.448,5.952c2.272,0,4.544-0.48,6.688-1.472
			l416-192c5.696-2.624,9.312-8.288,9.312-14.528S444.395,212.087,438.731,209.463z"
				/>
			</svg>
		</div>
	</div>
</template>

<script>
import { delMany, get, set } from 'idb-keyval';
import Loader from './Loader.vue';

export default {
	components: { Loader },
	props: {
		chapters: {
			type: Array,
			default: []
		},

		max: {
			type: Number,
			default: null
		},

		removable: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			isMounted: false,

			little: true,
			dlStatus: null,
			dlChapters: []
		};
	},

	async mounted() {
		for (const chapter of this.chapters) {
			if (await get(`[chapter]${chapter.name}`)) this.dlChapters.push(chapter.name);
		}

		this.isMounted = true;
	},

	methods: {
		getDateInFrench(date) {
			const fullDate = new Date(date).toLocaleString('fr-FR', {
				month: 'short',
				year: 'numeric',
				day: 'numeric'
			});

			const [day, month, year] = fullDate.split(' ');

			return `${day} ${month} ${year}`;
		},

		async dlChapter(name, uri) {
			this.dlStatus = 'Chargement du chapitre';
			const response = await this.$axios.get('/api/dl/chapter', { params: { uri } });

			if (response) {
				const pages = response.data;

				await set(`[chapter]${name}`, JSON.stringify(pages));
				this.dlChapters.push(name);

				await this.dlPages(pages, name);
			}

			this.dlStatus = null;
		},

		async dlPages(pages, chapter) {
			let i = 0;

			for (const { uri, img } of pages) {
				this.dlStatus = `Téléchargement de la page ${i + 1}/${pages.length}`;

				const page = new Image();
				page.crossOrigin = 'anonymous';

				const promise = new Promise(resolve => {
					page.addEventListener('load', async () => {
						const canvas = document.createElement('canvas');
						canvas.width = page.width;
						canvas.height = page.height;

						const ctx = canvas.getContext('2d');
						ctx.drawImage(page, 0, 0);

						const dataURL = canvas.toDataURL('image/png');
						await set(`[page]${uri}`, {
							img: dataURL,
							next: i + 1 < pages.length ? pages[i + 1].uri : null,
							chapterName: chapter
						});
						resolve();
					});
				});

				page.src = img;
				await promise;

				i += 1;
			}
		},

		async removeChapter(name) {
			this.dlStatus = 'Suppression du chapitre';
			const chapter = await get(`[chapter]${name}`);
			if (!chapter) return (this.dlStatus = null);

			const pages = JSON.parse(chapter).map(e => `[page]${e.uri}`);
			await delMany([pages, `[chapter]${name}`]);

			setTimeout(() => {
				this.dlChapters = this.dlChapters.filter(e => e !== name);
				this.dlStatus = null;
			}, 300);
		}
	}
};
</script>

<style lang="scss" scoped>
.loader-box {
	z-index: 100;
	background: rgba(0, 0, 0, 0.8);
	color: rgb(249, 168, 212);
}

.chapters {
	max-width: min(100vw - 2rem, 768px - 2rem);
}

.chapter-link {
	color: white;

	&-item:hover {
		border-radius: 8px;
		color: rgb(249, 168, 212);
	}

	display: flex;
	flex-direction: row;
	justify-content: space-between;
	position: relative;
	box-sizing: content-box;
	width: 100%;

	& > * {
		min-width: 0;
	}

	&-infos {
		line-height: 1.5rem;
	}
}

.dl > svg {
	& {
		fill: rgb(147, 197, 253);
	}

	&:hover path {
		fill: rgb(249, 168, 212);
	}
}

.blue-hover:hover {
	fill: rgb(147, 197, 253);
}
</style>
