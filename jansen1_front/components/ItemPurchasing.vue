<template>
	<div class="item hover:bg-gray-300">
		<div class="flex">
			<div class="leading-tight w-full">
				<p class="font-semibold">{{ source.name }}</p>
				<p class="text-sm"><span class="rounded-sm bg-yellow-300 px-1 text-xs mr-2">{{ source.category.name }}</span>{{ source.description }}</p>
			</div>
			<div class="w-48 text-xs text-right">
				<p>Retail : {{ source.price.retail }}</p>
				<p>Whole : {{ source.price.wholesale }}</p>
			</div>
			<div v-if="source.brand" class="w-32 text-xs text-center align-middle">{{ source.brand.brandname }}</div>
			<p v-if="source.unit" class="w-24 text-xs text-center">{{ source.unit.item_unit }}</p>
			<div>
				<b-checkbox v-model="checkbox" @change="onItemClick(source)"></b-checkbox>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'item',
		props: {
			source: {
				type: Object,
				default() {
					return {}
				}
			},
			onItemClick: {
				type: Function
			}
		},
		data() {
			return {
				checkbox: false
			}
		},
		methods: {
			ItemSelected(data) {
				console.log(data)
				this.$emit('clicked', data)
			}
		}
	}
</script>

<style scoped>
	.item {
		display: flex;
		flex-direction: column;
		border-bottom: 1px solid lightgrey;
		padding: 0.5em;
	}
</style>
