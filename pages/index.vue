<template>
	<div class="m-auto max-w-screen-md">
		<DaySelector :day="selected" @change="refresh($event)" />

		<Loader v-if="loading" />

		<MangaList v-else :mangas="mangas" />

		<ScrollToTop />

		<DaySelector v-if="!loading" :day="selected" @change="refresh($event)" />
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

	created() {
		this.selected = parseInt(this.$route.query.page) || 0;
		this.refresh(this.selected);
	},

	watch: {
		'$route.query.page'(value) {
			if (value != this.selected) this.refresh(parseInt(value));
		}
	},

	methods: {
		refresh(day) {
			this.loading = true;
			this.selected = day;
			this.$router.push({ path: '/', query: { page: day } });

			this.$axios.get('/scans/api/', { params: { day } }).then(response => {
				if (response.status === 200 || response.status === 304) this.mangas = response.data;
				this.loading = false;
			});
		}
	}
};
</script>
