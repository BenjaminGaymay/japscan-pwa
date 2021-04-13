<template>
	<div v-if="show" class="scrollTop" @click="scrollToTop">🡹</div>
</template>

<script>
export default {
	computed: {
		show() {
			if (!process.client) return false;
			return window.innerWidth > 1000;
		}
	},

	methods: {
		scrollToTop() {
			window.scrollTo(0, 0);
		}
	}
};
</script>

<style lang="scss" scoped>
.scrollTop {
	position: fixed;
	bottom: 3rem;
	right: 25%;

	background-color: rgb(249, 168, 212);
	width: 50px;
	height: 50px;
	line-height: 46px;
	border-radius: 30px;

	color: white;
	cursor: pointer;

	text-align: center;
	font-size: 1.6em;
}
</style>
