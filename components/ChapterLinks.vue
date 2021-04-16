<template>
	<div class="chapters">
		<NuxtLink
			v-for="chapter in max && little ? chapters.slice(0, max) : chapters"
			:key="chapter.href"
			:to="chapter.href"
		>
			<div class="chapter-link">
				<div class="mr-4 overflow-ellipsis overflow-hidden whitespace-nowrap">
					{{ chapter.name }}
				</div>
				<div
					class="chapter-link-infos px-1 mr-4 shadow rounded-xl text-sm text-gray-800 bg-pink-300"
					v-if="chapter.infos"
				>
					{{ chapter.infos }}
				</div>
				<div class="text-pink-300 ml-auto whitespace-nowrap">
					{{ chapter.date }}
				</div>
			</div>
		</NuxtLink>

		<div v-if="max && chapters.length > max" @click="little = !little" class="cursor-pointer">
			<svg
				class="transform m-auto"
				:class="{ 'rotate-90': little, '-rotate-90': !little }"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				x="0px"
				y="0px"
				viewBox="0 0 448.011 448.011"
				xml:space="preserve"
				fill="#F9A8D4"
				width="15px"
			>
				<path
					d="M438.731,209.463l-416-192c-6.624-3.008-14.528-1.216-19.136,4.48c-4.64,5.696-4.8,13.792-0.384,19.648l136.8,182.4
			l-136.8,182.4c-4.416,5.856-4.256,13.984,0.352,19.648c3.104,3.872,7.744,5.952,12.448,5.952c2.272,0,4.544-0.48,6.688-1.472
			l416-192c5.696-2.624,9.312-8.288,9.312-14.528S444.395,212.087,438.731,209.463z"
				/>
			</svg>
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
	max-width: min(100vw - 2rem, 768px - 2rem);
}

.chapter-link {
	color: white;
	&:hover {
		border-radius: 8px;
		color: rgb(249, 168, 212);
	}

	display: flex;
	flex-direction: row;
	justify-content: space-between;
	position: relative;
	box-sizing: content-box;
	width: 100%;

	&-infos {
		line-height: 1.5rem;
	}
}
</style>
