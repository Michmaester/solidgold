<template>
	<div>

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">

			<h3 class="has-text-header">Stock-Ins</h3>
			<div>
				<b-button type="is-primary" icon-left="printer" class="is-small px-4" @click="Print">Print</b-button>
				<!-- <b-field label="Select a date" custom-class="text-xs"> -->
				<!-- <b-datepicker v-model="selected" placeholder="Click to select..." icon="calendar-today" size="is-small" position="is-bottom-left" :date-formatter="DateFormatter" trap-focus>
				</b-datepicker> -->
				<!-- </b-field> -->
			</div>

		</div>

		<div class="grid grid-cols-8 gap-4 p-4 has-background-pageheader">

			<div class="col-span-8 wrapper-h bg-white">

				<!-- main table -->
				<div class="text-sm p-2">

					<b-table :striped="true" :narrowed="true" :hoverable="true" :loading="loading" paginated backend-pagination :pagination-rounded="true" pagination-size="is-small" :total="totalDataCount" :per-page="pageSize" @page-change="onPageChange" backend-sorting :default-sort-direction="defaultSortOrder" :default-sort="[sortField, sortOrder]" @sort="onSort" sort-icon="arrow-up" sort-icon-size="is-small" :pagination-simple="false" :pagination-position="'top'" ::selected.sync="selected_stockin" @select="SelectedStockIns" :data="stockIns">

						<template slot="top-left">
							<div class="flex">

								<client-only placeholder="Loading...">

									<b-field label="Code" custom-class="font-semibold text-xs no-mb-labels" class="w-40 text-xs mr-1 w-32">
										<b-input type="primary" size="is-small" v-model="filterCode" @input="FilterByCode"></b-input>
									</b-field>

									<b-field label="Name" custom-class="font-semibold text-xs no-mb-labels" class="text-xs mr-1 w-48">
										<b-input type="primary" size="is-small" v-model="filterName" @input="FilterByName"></b-input>
									</b-field>

									<b-field label="Description" custom-class="font-semibold text-xs no-mb-labels" class="text-xs mr-1 w-48">
										<b-input type="primary" size="is-small" v-model="filterDesc" @input="FilterByDesc"></b-input>
									</b-field>

									<b-field label="Category" custom-class="font-semibold text-xs no-mb-labels" class="w-40 text-xs mr-1">
										<v-select :options="allCategories" label="name" v-model="filterCategory" :reduce="category => category.id" @input="FilterByCategory" />
									</b-field>

								</client-only>

							</div>
						</template>

						<b-table-column v-slot="props" label="Code">
							<p class="font-bold">{{ props.row.product_code }}</p>
						</b-table-column>

						<b-table-column v-slot="props" label="Product">
							{{ props.row.product_name }}
						</b-table-column>

						<b-table-column v-slot="props" label="Description">
							{{ props.row.product_description }}
						</b-table-column>

						<b-table-column v-slot="props" label="Brand">
							{{ props.row.brandname }}
						</b-table-column>

						<b-table-column v-slot="props" label="Unit">
							{{ props.row.item_unit }}
						</b-table-column>

						<b-table-column v-slot="props" label="Qty.">
							<span class="font-bold">{{ props.row.qty }}</span>
						</b-table-column>

						<b-table-column v-slot="props" label="Reference">
							<span class="underline font-bold">{{ props.row.ref_field_value }}</span>
						</b-table-column>

						<b-table-column v-slot="props" label="Date In">
							{{ props.row.dateStockin }}
						</b-table-column>

						<b-table-column v-slot="props" label="Branch">
							{{ props.row.branch_code }}
						</b-table-column>

					</b-table>
				</div>

			</div>

		</div>

	</div>
</template>

<script>
	import { mapActions, mapMutations, mapGetters } from 'vuex'
	import dayjs from 'dayjs'
	import { debounce } from 'lodash'

	export default {
		components: {},
		meta: {
			module: 'stockins'
		},

		computed: {
			...mapGetters({
				allCategories: 'masterdatas/getCategories'
			})
		},

		data() {
			return {
				stockIns: [],
				totalDataCount: 0,
				loading: false,
				sortField: 'stockin_id',
				sortOrder: 'desc',
				defaultSortOrder: 'desc',
				page: 1,
				pageSize: 10,

				filters: [],

				filterName: null,
				filterCode: null,
				filterCategory: null,
				filterDesc: null,

				selected_stockin: {},
				selected: new Date(),

				form_rebalance: {
					stock_id: null,
					onhand_qty: null
				},

				isModalShow: false
			}
		},

		methods: {
			...mapActions({
				// GetStocks: 'stocks/GetStocks',
				// GetStockOuts: 'stocks/GetStockOuts',
				GetStockIns: 'stocks/GetStockIns',

				GetCategories: 'masterdatas/GetCategories'
			}),

			...mapMutations({}),

			SelectedStockIns(data) {
				this.selected_stockin = data
			},

			ShowReBalance() {
				this.isModalShow = true

				this.form_rebalance.stock_id = this.selected_stock.stock_id
				this.form_rebalance.onhand_qty = null
			},

			CloseRebalanceModal() {
				this.isModalShow = false
			},

			async SaveRebalanceStockForm() {
				const res = await this.SetRebalanceOnhandQty(this.form_rebalance)
				if (res.status == 'ok') {
					this.CloseRebalanceModal()
				}
			},

			DateFormatter(dt) {
				return dayjs(dt).format('MMM-DD-YYYY')
			},

			async LoadAsyncData() {
				const params = {
					sort_by: this.sortField,
					sort_order: this.sortOrder,
					page: this.page,
					pageSize: this.pageSize,
					filters: this.filters || []
				}

				this.loading = true

				const stocks = await this.GetStockIns(params)

				this.stockIns = []
				this.stockIns = stocks.data.results
				this.totalDataCount = stocks.data.total

				this.loading = false
			},

			onPageChange(page) {
				this.page = page
				this.LoadAsyncData()
			},

			onSort(field, order) {
				this.sortField = field
				this.sortOrder = order
				this.LoadAsyncData()
			},

			onFilterData() {
				this.filters = []

				this.filters.push({ field: 'product.name', value: this.filterName, type: 'like' })
				this.filters.push({ field: 'product.product_code', value: this.filterCode, type: 'like' })
				this.filters.push({ field: 'product.category_ref_id', value: this.filterCategory, type: '=' })
				this.filters.push({ field: 'product.description', value: this.filterDesc, type: 'like' })

				this.LoadAsyncData()
			},

			FilterByName(value) {
				this.searchDebounce(this)
			},

			FilterByCode(value) {
				this.searchDebounce(this)
			},

			FilterByCategory(value) {
				this.onFilterData()
			},

			FilterByDesc(value) {
				this.searchDebounce(this)
			},

			searchDebounce: debounce((vm) => {
				vm.onFilterData()
			}, 500),

			Print() {
				let printFilters = []

				printFilters.push({ field: 'product.category_ref_id', value: this.filterCategory, type: '=' })
				printFilters.push({ field: 'product.product_code', value: this.filterCode, type: 'like' })

				let obj = {
					type: 'List_Filtered_StockIns',
					branch_code: this.$store.state.selectedBranch.branch_code,
					filters: printFilters
				}

				let json = JSON.stringify(obj)

				window.open('/printing/listdoc?params=' + json, '_blank', 'location=yes,height=768,width=800,scrollbars=yes,status=yes')
			}
		},

		mounted() {
			this.LoadAsyncData()
			this.GetCategories()
		}
	}
</script>

<style scoped>
	.wrapper-h {
		height: calc(100vh - 125px);
	}
</style>
