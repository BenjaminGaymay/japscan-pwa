<template>
	<div class="m-auto max-w-screen-md">
		<div class="flex">
			<span v-for="index in 7" :key="index" @click="refresh(index - 1)">{{ index - 1 }}</span>
		</div>

		<MangaList :mangas="mangas" />
	</div>
</template>

<script>
export default {
	data() {
		return {
			days: ["Aujourd'hui", 'Hier'],
			selected: 0,
			mangas: []
		};
	},

	mounted() {
		this.refresh(this.selected);
	},

	methods: {
		refresh(day) {
			this.selected = day;

			this.$axios.get('/api/', { params: { day } }).then(response => {
				if (response.status === 200 || response.status === 304) this.mangas = response.data;
			});
		}
	}
};
</script>
