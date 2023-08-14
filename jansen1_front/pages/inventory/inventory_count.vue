<template>
	<div>

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">

			<h3 class="has-text-header">Inventory Count</h3>
			<div class="flex items-center">
				<b-button type="is-primary" icon-left="plus" class="is-small text-white">New</b-button>
				<b-button type="is-primary" icon-left="playlist-edit" class="is-small ml-1">Edit</b-button>
			</div>

		</div>

		<div class="grid grid-cols-8 gap-4 p-4">

		</div>

	</div>
</template>

<script>
	import axios from 'axios'

	export default {
		components: {},
		meta: {
			module: 'invcount'
		},
		data() {
			return {}
		},

		methods: {}
	}
</script>

<style>
</style>
