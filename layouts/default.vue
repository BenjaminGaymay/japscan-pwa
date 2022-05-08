<template>
	<div v-touch:swipe.left="() => toggleMenu(false)" v-touch:swipe.right="() => toggleMenu(true)" class="min-h-screen">
		<div v-if="big">
			<Menu />
		</div>

		<div v-else-if="menu">
			<Menu v-model="menu" />
		</div>

		<Nuxt />
	</div>
</template>

<script>
export default {
	data() {
		return { big: false, menu: false };
	},

	created() {
		if (process.client) this.big = window.innerWidth > 1024;
	},

	methods: {
		toggleMenu(show) {
			this.menu = show;
		}
	}
};
</script>

<style>
body {
	background-color: #252525;
	font-family: 'Droid Sans', sans-serif;
}

html,
body,
#__nuxt,
#__layout {
	max-width: 100vw;
	max-height: 100vh;

	overflow-x: hidden;
	overscroll-behavior-y: contain;
}
</style>
