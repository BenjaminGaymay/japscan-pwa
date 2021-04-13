<template>
	<div v-touch:swipe.left="() => toggleMenu(false)" v-touch:swipe.right="() => toggleMenu(true)">
		<div v-if="big" @click="$router.push('/')">Menu</div>
		<div v-else-if="menu" @click="$router.push('/')">ptit menu</div>
		<Nuxt />
	</div>
</template>

<script>
export default {
	data() {
		return { big: true, menu: false };
	},

	created() {
		if (process.client) this.big = window.innerWidth > 1000;
	},

	methods: {
		toggleMenu(show) {
			console.log('aaa');
			this.menu = show;
		}
	}
};
</script>

<style>
body {
	background-color: rgb(37, 37, 37);
	font-family: sans-serif, 'Acme';
}
</style>
