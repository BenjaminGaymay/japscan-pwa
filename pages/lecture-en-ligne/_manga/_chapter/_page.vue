<template>
	<div class="w-full">
		<NuxtLink v-if="next && img" :to="next">
			<img :src="img" />
		</NuxtLink>
	</div>
</template>

<script>
export default {
	data() {
		return { img: null, next: null };
	},

	mounted() {
		this.$axios
			.get('/api/page', {
				params: {
					uri: `/lecture-en-ligne/${this.$route.params.manga}/${this.$route.params.chapter}/${
						this.$route.params.page || ''
					}`
				}
			})
			.then(response => {
				if (response.status === 200 || response.status === 304) {
					this.img = `/api/${response.data.img}`;

					this.next = response.data.next;
				}
			});
	}
};
</script>

<style lang="scss" scoped>
img {
	margin: auto;
	height: 100vh;
	width: auto;
}
</style>
