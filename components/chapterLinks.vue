<template>
	<div class="chapters">
		<NuxtLink
			v-for="chapter in max && little ? chapters.slice(0, max) : chapters"
			:key="chapter.href"
			:to="chapter.href"
		>
			<!-- COLUMNS ? -->
			<span class="text-white">{{ chapter.name }}</span>
			<span v-if="chapter.infos" class="px-1 ml-4 shadow rounded-xl text-sm text-gray-800 bg-pink-300">
				{{ chapter.infos }}
			</span>
			<span v-if="chapter.date" class="float-right">{{ chapter.date }}</span>
		</NuxtLink>

		<div
			v-if="max && chapters.length > max"
			@click="little = !little"
			class="text-pink-300 text-center cursor-pointer"
		>
			{{ little ? '⮟' : '⮝' }}
		</div>
	</div>
</template>

<script>
export default {
	props: {
		chapters: {
			type: Array,
			default: []
		},

		max: {
			type: Number,
			default: null
		}
	},

	data() {
		return { little: true };
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
