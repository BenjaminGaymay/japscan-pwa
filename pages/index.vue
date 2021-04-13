<template>
	<div class="m-auto max-w-screen-md">
		<div class="grid grid-cols-3 justify-center justify-items-center items-center text-center my-6">
			<div
				v-if="selected > 0"
				@click="refresh(selected - 1)"
				class="text-3xl text-pink-300 align-middle cursor-pointer"
			>
				⮜
			</div>
			<div class="col-start-2 capitalize text-5xl text-white">{{ dayName }}</div>
			<div
				v-if="selected < 7"
				@click="refresh(selected + 1)"
				class="text-3xl text-pink-300 align-middle cursor-pointer"
			>
				⮞
			</div>
		</div>

		<MangaList :mangas="mangas" />

		<ScrollToTop />
	</div>
</template>

<script>
export default {
	data() {
		return {
			selected: null,
			mangas: []
		};
	},

	mounted() {
		this.selected = parseInt(this.$route.query.page) || 0;
		this.refresh(this.selected);
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
			this.selected = day;
			this.$router.push({ path: '/', query: { page: day } });

			this.$axios.get('/api/', { params: { day } }).then(response => {
				if (response.status === 200 || response.status === 304) this.mangas = response.data;
			});
		}
	}
};
</script>
