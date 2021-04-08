<template>
	<div class="container">
		<div class="manga" v-for="manga in mangas" :key="manga.href">
			<a class="manga-name" :href="manga.href">{{ manga.name }}</a>

			<div class="manga-chapters">
				<NuxtLink v-for="chapter in manga.chapters" :key="chapter.href" :to="chapter.href">
					{{ chapter.name }}
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			mangas: []
		};
	},

	async mounted() {
		const response = await this.$axios.get('/api/', { params: { day: '0' } });

		if (response.status === 200 || response.status === 304) this.mangas = response.data;
	}
};
</script>

<style lang="scss" scoped>
.manga {
	border: 1px solid black;

	&:not(:last-child) {
		margin-bottom: 15px;
	}

	&-name {
		font-weight: bold;
	}

	&-chapters {
		transform: translateX(25px);
		a {
			display: block;
		}
	}
}
</style>
