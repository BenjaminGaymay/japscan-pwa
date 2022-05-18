<template>
	<div class="mx-auto flex h-screen max-w-screen-md flex-wrap items-center justify-center gap-x-6 text-white">
		<Loader v-if="loading" />

		<template v-else-if="next && img">
			<div></div>

			<NuxtLink :to="next">
				<img :src="img" />
			</NuxtLink>

			<div class="self-end py-7">Page {{ pages }}</div>
		</template>
	</div>
</template>

<script>
import { get, keys } from 'idb-keyval';

export default {
	data() {
		return { loading: true, img: null, next: null, pages: null };
	},

	async mounted() {
		window.addEventListener('keyup', this.handleKeypress);

		const uri = `/lecture-en-ligne/${this.$route.params.manga}/${this.$route.params.chapter}/${
			this.$route.params.page || ''
		}`;

		const localData = await get(`[page]${uri}`);
		if (!localData) return;

		this.img = localData.img;
		this.next = localData.next
			? localData.next.replace('/lecture-en-ligne/', '/lecture-hors-ligne/')
			: '/telechargements';
		const chapter = localData.chapterName;

		localStorage.setItem(
			`[history]${this.$route.params.manga}`,
			JSON.stringify({
				uri,
				date: new Date(),
				chapter,
				page: this.$route.params.page || 1
			})
		);
		this.loading = false;

		const pages = (await keys()).filter(e =>
			e.startsWith(`[page]/lecture-en-ligne/${this.$route.params.manga}/${this.$route.params.chapter}`)
		);

		const pageIndex = this.$route.params.page ? this.$route.params.page.split('.')[0] : 1;
		this.pages = `${pageIndex}/${pages.length}`;
	},

	beforeDestroy() {
		window.removeEventListener('keyup', this.handleKeypress);
	},

	methods: {
		handleKeypress(e) {
			if (e.key == 'ArrowRight' && this.next) this.$router.push(this.next);
			else if (e.key == 'ArrowLeft' && this.$route.params.page) this.$router.go(-1);
		}
	}
};
</script>

<style lang="scss" scoped>
img {
	margin: auto;

	max-height: 100vh;
	height: auto;
	width: 100%;
}
</style>
