<template>
	<div v-if="infos" class="m-auto max-w-screen-md text-white">
		<h1 class="mt-6 mb-12 text-center text-5xl">{{ infos.title }}</h1>

		<div class="flex gap-6 px-3">
			<div>
				<img class="picture" :src="infos.img" />
			</div>

			<div class="infos">
				<div v-if="infos.date"><span class="text-pink-300"> Date : </span> {{ infos.date }}</div>
				<div v-if="infos.status"><span class="text-pink-300"> Statut : </span> {{ infos.status }}</div>
				<div v-if="infos.type"><span class="text-pink-300"> Type : </span> {{ infos.type }}</div>
				<div v-if="infos.genre">
					<span class="text-pink-300"> Genre{{ infos.genre.split(',').length > 1 ? 's' : '' }} : </span>
					{{ infos.genre }}
				</div>
				<div v-if="infos.author">
					<span class="text-pink-300">Auteur{{ infos.author.split(',').length > 1 ? 's' : '' }} : </span>
					{{ infos.author }}
				</div>
				<div v-if="infos.volumes"><span class="text-pink-300">Volumes : </span> {{ infos.volumes }}</div>
				<div v-if="infos.anime"><span class="text-pink-300">Animé : </span> {{ infos.anime }}</div>
			</div>
		</div>

		<fieldset class="my-6 mx-1" v-if="infos.synopsis">
			<legend class="ml-3 text-pink-300 px-1">Synopsis</legend>
			<p class="text-sm px-3 py-1 text-justify">
				{{ infos.synopsis }}
			</p>
		</fieldset>

		<fieldset class="chapters-list my-6 mx-1" v-if="chapters">
			<legend class="ml-3 text-blue-300 px-1">Chapitres</legend>
			<p class="px-3 py-1">
				<ChapterLinks :chapters="chapters" />
			</p>
		</fieldset>

		<ScrollToTop />
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
.picture {
	width: 250px;
	min-width: 250px;

	@media (max-width: 1000px) {
		min-width: 170px;
		width: 170px;
	}
}

.infos {
	div {
		margin-top: 0.5rem;
	}
}

fieldset {
	border: 1px solid pink;
	border-radius: 8px;
}

.chapters-list {
	border: 1px solid rgb(147, 197, 253);
}
</style>
