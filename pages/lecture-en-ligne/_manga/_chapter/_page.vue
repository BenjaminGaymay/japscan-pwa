<template>
	<div class="w-full">
		<NuxtLink :to="next">
			<img :src="img" />
		</NuxtLink>
	</div>
</template>

<script>
export default {
	data() {
		return { img: null, next: null };
	},

	async asyncData({ params, $axios }) {
		const response = await $axios.get('/api/page', {
			params: {
				uri: `/lecture-en-ligne/${params.manga}/${params.chapter}/${params.page || ''}`
			}
		});

		if (response.status === 200 || response.status === 304) {
			response.data.img = `/api/${response.data.img}`;

			return response.data;
		}

		return { img: null, next: null };
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
