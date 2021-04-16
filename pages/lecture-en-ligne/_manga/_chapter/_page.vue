<template>
	<div class="m-auto max-w-screen-md text-white pt-6">
		<Loader v-if="loading" />

		<NuxtLink v-else-if="next && img" :to="next">
			<img :src="img" />
		</NuxtLink>
	</div>
</template>

<script>
export default {
	data() {
		return { loading: true, img: null, next: null };
	},

	mounted() {
		window.addEventListener('keyup', this.handleKeypress);

		this.$axios
			.get('/scans/api/page', {
				params: {
					uri: `/lecture-en-ligne/${this.$route.params.manga}/${this.$route.params.chapter}/${
						this.$route.params.page || ''
					}`
				}
			})
			.then(response => {
				if (response.status === 200 || response.status === 304) {
					this.img = `/scans/api/${response.data.img}`;

					this.next = response.data.next;
				}

				this.loading = false;
			});
	},

	beforeDestroy() {
		window.removeEventListener('keyup', this.handleKeypress);
	},

	methods: {
		handleKeypress(e) {
			if (e.key == 'ArrowRight' && this.next) {
				this.$router.push(this.next);
			} else if (e.key == 'ArrowLeft' && this.$route.params.page) {
				this.$router.go(-1);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
img {
	margin: auto;
	height: auto;
	width: 100%;
}
</style>
