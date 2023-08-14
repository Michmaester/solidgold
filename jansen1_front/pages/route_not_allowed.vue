<template>
	<section class="section">
		<p>Route Not Alowed</p>

		<button @click="RedirectHome">Click to Return</button>

	</section>
</template>

<script>
	export default {
		name: 'NotAllowed',
		meta: {
			module: ''
		},

		methods: {
			RedirectHome() {
				this.$router.push('/')
				//return redirect('/')
			}
		},

		components: {},

		mounted() {}
	}
</script>
