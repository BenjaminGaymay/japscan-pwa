<template>
	<div class="m-auto max-w-screen-md">
		<div class="grid grid-cols-3 justify-center justify-items-center items-center text-center my-6 align-middle">
			<div v-if="selected > 0" @click="refresh(selected - 1)" class="m-auto cursor-pointer select-none">
				<svg
					class="transform rotate-180"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					x="0px"
					y="0px"
					viewBox="0 0 448.011 448.011"
					xml:space="preserve"
					fill="#F9A8D4"
					width="20px"
				>
					<path
						d="M438.731,209.463l-416-192c-6.624-3.008-14.528-1.216-19.136,4.48c-4.64,5.696-4.8,13.792-0.384,19.648l136.8,182.4
			l-136.8,182.4c-4.416,5.856-4.256,13.984,0.352,19.648c3.104,3.872,7.744,5.952,12.448,5.952c2.272,0,4.544-0.48,6.688-1.472
			l416-192c5.696-2.624,9.312-8.288,9.312-14.528S444.395,212.087,438.731,209.463z"
					/>
				</svg>
			</div>
			<div class="col-start-2 capitalize text-3xl lg:text-5xl text-white">{{ dayName }}</div>
			<div v-if="selected < 7" @click="refresh(selected + 1)" class="m-auto cursor-pointer select-none">
				<svg
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					x="0px"
					y="0px"
					viewBox="0 0 448.011 448.011"
					xml:space="preserve"
					fill="#F9A8D4"
					width="20px"
				>
					<path
						d="M438.731,209.463l-416-192c-6.624-3.008-14.528-1.216-19.136,4.48c-4.64,5.696-4.8,13.792-0.384,19.648l136.8,182.4
			l-136.8,182.4c-4.416,5.856-4.256,13.984,0.352,19.648c3.104,3.872,7.744,5.952,12.448,5.952c2.272,0,4.544-0.48,6.688-1.472
			l416-192c5.696-2.624,9.312-8.288,9.312-14.528S444.395,212.087,438.731,209.463z"
					/>
				</svg>
			</div>
		</div>

		<Loader v-if="loading" />

		<MangaList v-else :mangas="mangas" />

		<ScrollToTop />
	</div>
</template>

<script>
export default {
	data() {
		return {
			loading: false,
			selected: null,
			mangas: []
		};
	},

	mounted() {
		this.selected = parseInt(this.$route.query.page) || 0;
		this.refresh(this.selected);
	},

	watch: {
		'$route.query.page'(value) {
			if (value != this.selected) this.refresh(parseInt(value));
		}
	},

	computed: {
		dayName() {
			switch (this.selected) {
				case null:
					return '';
				case 0:
					return "Aujourd'hui";
				case 1:
					return 'Hier';
				case 7:
					return 'Plus anciens';
				default:
					const date = new Date();
					date.setDate(date.getDate() - this.selected);

					return date.toLocaleDateString('fr-FR', { weekday: 'long' });
			}
		}
	},

	methods: {
		refresh(day) {
			this.loading = true;
			this.selected = day;
			this.$router.push({ path: '/', query: { page: day } });

			this.$axios.get('/api/', { params: { day } }).then(response => {
				if (response.status === 200 || response.status === 304) this.mangas = response.data;
				this.loading = false;
			});
		}
	}
};
</script>
