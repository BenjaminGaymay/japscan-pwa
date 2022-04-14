<template>
	<div class="list px-6">
		<div class="manga" v-for="manga in mangas" :key="manga.href">
			<NuxtLink
				class="manga-name text-xl text-blue-300 md:text-2xl"
				:class="{ 'manga-name-hot': manga.hot }"
				:to="manga.href">
				{{ manga.name }}
			</NuxtLink>

			<ChapterLinks class="ml-8 mt-1" :chapters="manga.chapters" :max="3" />
		</div>
	</div>
</template>

<script>
export default {
	props: {
		mangas: {
			type: Array,
			default: []
		}
	}
};
</script>

<style lang="scss" scoped>
.list {
	background-color: #383838;
	padding-top: 1.5rem;

	.manga {
		padding-bottom: 1.5rem;

		&:not(:last-child) {
			margin-bottom: 1.5rem;
		}

		&-name {
			font-weight: bold;

			&-hot::before {
				content: ' ';
				display: inline-block;
				background-color: rgb(249, 168, 212);
				height: 15px;
				width: 15px;
				border-radius: 15px;
			}
		}
	}
}
</style>
