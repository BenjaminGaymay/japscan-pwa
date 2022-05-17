<template>
	<div v-touch:swipe.left="() => toggleMenu(false)" v-touch:swipe.right="() => toggleMenu(true)" class="min-h-screen">
		<!-- <div
        class="h-safe-area-inset-top"
        :class="{
            'bg-black': !transparent
                        || (transparent && scrollTop > 0)
        }"
    ></div> -->

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
	meta: [
		{ name: 'viewport', content: 'width=device-width; initial-scale=1; viewport-fit=cover' },
		{ name: 'mobile-web-app-capable', content: 'yes' },
		{ name: 'apple-mobile-web-app-capable', content: 'yes' }
		// { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
	],

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

/* .root {
	padding-top: env(safe-area-inset-top);
} */
</style>
