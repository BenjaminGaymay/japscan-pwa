<template>
	<div class="list px-6">
		<div class="manga" v-for="manga in mangas" :key="manga.href">
			<NuxtLink class="manga-name text-2xl text-white" :class="{ 'manga-name-hot': manga.hot }" :to="manga.href">
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
			// border-bottom: 1px solid white;
			margin-bottom: 1.5rem;
		}

		// &::after {
		// 		content: '';
		// 		background: white;
		// 		position: absolute;
		// 		bottom: 0;
		// 		left: 0;
		// 		height: 1px;
		// 		width: 50%;
		// 		margin: auto;
		// 		transform: translateX(50%);
		// 	}

		&-name {
			font-weight: bold;

			&-hot::after {
				content: ' ';
				display: inline-block;
				background-color: #00ff00;
				height: 15px;
				width: 15px;
				border-radius: 15px;
			}
		}
	}
}
</style>
