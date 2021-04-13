<template>
	<div class="chapters">
		<NuxtLink
			v-for="chapter in max && little ? chapters.slice(0, max) : chapters"
			:key="chapter.href"
			:to="chapter.href"
		>
			<div class="chapter-link">
				<!-- COLUMNS ? -->
				<span>{{ chapter.name }}</span>
				<span v-if="chapter.infos" class="px-1 ml-4 shadow rounded-xl text-sm text-gray-800 bg-pink-300">
					{{ chapter.infos }}
				</span>
				<span v-if="chapter.date" class="float-right text-pink-300">{{ chapter.date }}</span>
			</div>
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
.chapter-link {
	color: white;
	&:hover {
		border-radius: 8px;
		// background-color: red;
		color: rgb(249, 168, 212);
	}
}
</style>
