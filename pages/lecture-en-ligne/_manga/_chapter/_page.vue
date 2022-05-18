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
export default {
	head() {
		return {
			link: [{ rel: 'preload', as: 'image', href: this.nextImg }]
		};
	},

	data() {
		return { loading: true, img: null, next: null, nextImg: null, pages: null };
	},

	mounted() {
		window.addEventListener('keyup', this.handleKeypress);

		const uri = `/lecture-en-ligne/${this.$route.params.manga}/${this.$route.params.chapter}/${
			this.$route.params.page || ''
		}`;

		this.$axios.get('/api/page', { params: { uri } }).then(response => {
			if (response.status === 200 || response.status === 304) {
				this.img = response.data.img;

				this.next = response.data.next;
				this.nextImg = response.data.nextImg;

				const pageIndex = this.$route.params.page ? this.$route.params.page.split('.')[0] : 1;
				this.pages = `${pageIndex}/${response.data.pages}`;

				const chapter = response.data.chapterName;

				localStorage.setItem(
					`[history]${this.$route.params.manga}`,
					JSON.stringify({
						uri,
						date: new Date(),
						chapter,
						page: this.$route.params.page || 1
					})
				);
			}

			this.loading = false;
		});
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
