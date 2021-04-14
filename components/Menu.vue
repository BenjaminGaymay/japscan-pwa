<template>
	<div class="text-white select-none">
		<div v-if="open" class="page fixed" @click="open = !open"></div>

		<div class="menu fixed" :class="{ 'menu-visible': open }">
			<div
				class="menu-burger text-5xl cursor-pointer mt-2 ml-2"
				:class="{ 'menu-burger-open': open }"
				@click="open = !open"
			>
				<svg
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					x="0px"
					y="0px"
					width="50px"
					height="50px"
					viewBox="0 0 124 124"
					xml:space="preserve"
				>
					<path d="M112,6H12C5.4,6,0,11.4,0,18s5.4,12,12,12h100c6.6,0,12-5.4,12-12S118.6,6,112,6z" />
					<path
						d="M112,50H12C5.4,50,0,55.4,0,62c0,6.6,5.4,12,12,12h100c6.6,0,12-5.4,12-12C124,55.4,118.6,50,112,50z"
					/>
					<path d="M112,94H12c-6.6,0-12,5.4-12,12s5.4,12,12,12h100c6.6,0,12-5.4,12-12S118.6,94,112,94z" />
				</svg>
			</div>

			<div class="menu-infos mt-6" v-if="open">
				<NuxtLink :to="{ path: '/', query: { page: 0 }, force: true }" @click.native="open = false">
					<div class="mx-3 link"><span>―</span> Sorties du jour</div>
				</NuxtLink>

				<NuxtLink :to="`/manga/${mangaPage}`" v-if="mangaPage" @click.native="open = false">
					<div class="mx-3 link mt-2"><span>―</span> Fiche du manga</div>
				</NuxtLink>

				<div
					class="menu-infos-nav absolute bottom-6 flex text-2xl justify-between w-full px-3 gap-8 align-middle"
				>
					<div class="flex-grow">
						<svg
							version="1.1"
							id="Layer_1"
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink"
							x="0px"
							y="0px"
							viewBox="0 0 438.542 438.542"
							xml:space="preserve"
							@click="refresh"
							class="cursor-pointer refresh"
						>
							<path
								d="M427.408,19.697c-7.803-3.23-14.463-1.902-19.986,3.999l-37.116,36.834C349.94,41.305,326.672,26.412,300.5,15.848
		C274.328,5.285,247.251,0.003,219.271,0.003c-29.692,0-58.052,5.808-85.08,17.417c-27.03,11.61-50.347,27.215-69.951,46.82
		c-19.605,19.607-35.214,42.921-46.824,69.949C5.807,161.219,0,189.575,0,219.271c0,29.687,5.807,58.05,17.417,85.079
		c11.613,27.031,27.218,50.347,46.824,69.952c19.604,19.599,42.921,35.207,69.951,46.818c27.028,11.611,55.388,17.419,85.08,17.419
		c32.736,0,63.865-6.899,93.363-20.7c29.5-13.795,54.625-33.26,75.377-58.386c1.52-1.903,2.234-4.045,2.136-6.424
		c-0.089-2.378-0.999-4.329-2.711-5.852l-39.108-39.399c-2.101-1.711-4.473-2.566-7.139-2.566c-3.045,0.38-5.232,1.526-6.566,3.429
		c-13.895,18.086-30.93,32.072-51.107,41.977c-20.173,9.894-41.586,14.839-64.237,14.839c-19.792,0-38.684-3.854-56.671-11.564
		c-17.989-7.706-33.551-18.127-46.682-31.261c-13.13-13.135-23.551-28.691-31.261-46.682c-7.708-17.987-11.563-36.874-11.563-56.671
		c0-19.795,3.858-38.691,11.563-56.674c7.707-17.985,18.127-33.547,31.261-46.678c13.135-13.134,28.693-23.555,46.682-31.265
		c17.983-7.707,36.879-11.563,56.671-11.563c38.259,0,71.475,13.039,99.646,39.116l-39.409,39.394
		c-5.903,5.711-7.231,12.279-4.001,19.701c3.241,7.614,8.856,11.42,16.854,11.42h127.906c4.949,0,9.23-1.807,12.848-5.424
		c3.613-3.616,5.42-7.898,5.42-12.847V36.55C438.542,28.558,434.84,22.943,427.408,19.697z"
							/>
						</svg>
					</div>
					<div>
						<svg
							version="1.1"
							id="Layer_1"
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink"
							x="0px"
							y="0px"
							viewBox="0 0 492 492"
							xml:space="preserve"
							@click="previous"
							class="cursor-pointer"
						>
							<path
								d="M464.344,207.418l0.768,0.168H135.888l103.496-103.724c5.068-5.064,7.848-11.924,7.848-19.124
			c0-7.2-2.78-14.012-7.848-19.088L223.28,49.538c-5.064-5.064-11.812-7.864-19.008-7.864c-7.2,0-13.952,2.78-19.016,7.844
			L7.844,226.914C2.76,231.998-0.02,238.77,0,245.974c-0.02,7.244,2.76,14.02,7.844,19.096l177.412,177.412
			c5.064,5.06,11.812,7.844,19.016,7.844c7.196,0,13.944-2.788,19.008-7.844l16.104-16.112c5.068-5.056,7.848-11.808,7.848-19.008
			c0-7.196-2.78-13.592-7.848-18.652L134.72,284.406h329.992c14.828,0,27.288-12.78,27.288-27.6v-22.788
			C492,219.198,479.172,207.418,464.344,207.418z"
							/>
						</svg>
					</div>
					<div>
						<svg
							version="1.1"
							id="Layer_1"
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink"
							x="0px"
							y="0px"
							viewBox="0 0 492.004 492.004"
							xml:space="preserve"
							@click="next"
							class="cursor-pointer"
						>
							<path
								d="M484.14,226.886L306.46,49.202c-5.072-5.072-11.832-7.856-19.04-7.856c-7.216,0-13.972,2.788-19.044,7.856l-16.132,16.136
			c-5.068,5.064-7.86,11.828-7.86,19.04c0,7.208,2.792,14.2,7.86,19.264L355.9,207.526H26.58C11.732,207.526,0,219.15,0,234.002
			v22.812c0,14.852,11.732,27.648,26.58,27.648h330.496L252.248,388.926c-5.068,5.072-7.86,11.652-7.86,18.864
			c0,7.204,2.792,13.88,7.86,18.948l16.132,16.084c5.072,5.072,11.828,7.836,19.044,7.836c7.208,0,13.968-2.8,19.04-7.872
			l177.68-177.68c5.084-5.088,7.88-11.88,7.86-19.1C492.02,238.762,489.228,231.966,484.14,226.886z"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return { open: this.value };
	},

	watch: {
		open(value) {
			this.$emit('input', value);
		}
	},

	computed: {
		path() {
			return this.$route.path;
		},

		mangaPage() {
			const path = this.$route.path;
			return path.startsWith('/lecture-en-ligne/') ? path.split('/')[2] : null;
		}
	},

	methods: {
		previous() {
			this.$router.go(-1);
		},

		refresh() {
			window.location.reload();
		},

		next() {
			this.$router.go(1);
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	z-index: 50;

	top: 0;
	left: 0;
	width: 100%;
	height: 100%;

	background-color: rgba($color: #000000, $alpha: 0.5);
}

.menu {
	z-index: 60;
	top: 0;
	left: 0;

	&-visible {
		max-width: 300px;
		width: 30vh;
		height: 100%;

		border-right: 1px solid rgb(249, 168, 212);
		border-top-right-radius: 15px;
		border-bottom-right-radius: 15px;

		background-color: rgb(37, 37, 37);
	}

	&-burger {
		text-align: center;
		line-height: 50px;
		width: 50px;
		height: 50px;

		fill: rgb(249, 168, 212);

		@media (max-width: 1024px) {
			fill: rgb(147, 197, 253);
		}

		&:hover {
			svg {
				fill: rgb(147, 197, 253);
			}
		}

		&-open {
			transform: rotateZ(90deg);
		}
	}

	&-infos {
		.link {
			padding: 5px 0;

			span {
				margin-right: 0.75rem;
				color: rgb(249, 168, 212);
			}

			&:hover {
				color: rgb(147, 197, 253);

				span {
					margin-right: 1rem;
				}
			}
		}

		&-nav {
			div {
				svg {
					width: 20px;
					height: 20px;
					fill: rgb(249, 168, 212);

					@media (max-width: 1024px) {
						&:not(.refresh) {
							fill: rgb(147, 197, 253);
						}
					}

					&:hover {
						fill: rgb(147, 197, 253);
					}
				}
			}
		}
	}
}
</style>
