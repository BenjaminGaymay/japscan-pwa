<template>
	<div class="m-auto max-w-screen-md text-white">
		<fieldset class="chapters-list my-6 mx-1" v-if="history">
			<legend class="ml-3 px-1 text-blue-300">Historique</legend>

			<p class="px-3 py-1">
				<client-only>
					<ChapterLinks :chapters="history" />
				</client-only>
			</p>
		</fieldset>
	</div>
</template>

<script>
import ChapterLinks from '../components/ChapterLinks.vue';

export default {
	components: { ChapterLinks },
	data() {
		return {
			history: []
		};
	},

	mounted() {
		this.history = Object.keys(localStorage)
			.filter(e => e.startsWith('[history]'))
			.map(e => {
				const { uri, date, chapter } = JSON.parse(localStorage.getItem(e));
				return { name: chapter, href: uri, date };
			})
			.sort((a, b) => new Date(b.date) - new Date(a.date));
	}
};
</script>

<style lang="scss" scoped>
fieldset {
	border: 1px solid rgb(249, 168, 212);
	border-radius: 8px;
}

.chapters-list {
	border: 1px solid rgb(147, 197, 253);
}
</style>
