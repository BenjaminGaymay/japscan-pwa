<template>
	<div class="m-auto max-w-screen-md text-white">
		<fieldset class="chapters-list my-6 mx-1" v-if="chapters">
			<legend class="ml-3 px-1 text-blue-300">Téléchargements</legend>

			<p class="px-3 py-1">
				<ChapterLinks :chapters="chapters" :removable="true" />
			</p>
		</fieldset>
	</div>
</template>

<script>
import { keys, getMany } from 'idb-keyval';

export default {
	data() {
		return {
			chapters: null
		};
	},

	async mounted() {
		const dbKeys = await keys();
		if (!dbKeys) return;

		const chapterNames = dbKeys.filter(e => e.startsWith('[chapter]'));
		const chapters = await getMany(chapterNames);

		this.chapters = chapters
			.map(e => JSON.parse(e))
			.map((e, i) => ({
				name: chapterNames[i].replace('[chapter]', ''),
				href: e[0].uri
			}))
			.sort((a, b) => b - a);
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
