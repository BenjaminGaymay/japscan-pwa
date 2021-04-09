<template>
	<div v-if="infos" class="w-full">
		<h1>{{ infos.title }}</h1>

		<img :src="infos.img" />

		<div>
			<div>Date : {{ infos.date }}</div>
			<div>Statut : {{ infos.status }}</div>
			<div>Type : {{ infos.type }}</div>
			<div>Genre : {{ infos.genre }}</div>
			<div>Auteur{{ infos.author.split(',') > 1 ? 's' : '' }} : {{ infos.author }}</div>
			<div v-if="infos.volumes">Volumes : {{ infos.volumes }}</div>
			<div>Animé : {{ infos.anime }}</div>
		</div>

		<p>
			{{ infos.synopsis }}
		</p>

		<ChapterLinks :chapters="chapters" />
	</div>
</template>

<script>
export default {
	data() {
		return { infos: null, chapters: [] };
	},

	mounted() {
		this.$axios
			.get('/api/manga', {
				params: {
					uri: `/manga/${this.$route.params.manga}`
				}
			})
			.then(response => {
				if (response.status === 200 || response.status === 304) {
					this.infos = response.data.infos;
					this.infos.img = `/api/${this.infos.img}`;
					this.chapters = response.data.chapters;
				}
			});
	}
};
</script>

<style lang="scss" scoped>
.chapters {
	a {
		display: block;
	}
}
</style>
