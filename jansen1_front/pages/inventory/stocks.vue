<template>
	<div>

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">

			<h3 class="has-text-header">Stocks</h3>
			<div>
				<b-button type="is-primary" icon-left="update" class="is-small text-white" @click="BulkStockUpdate">Bulk Stock Update</b-button>
				<b-button :disabled="selected_stock.stock_id == null" type="is-primary" icon-left="playlist-edit" class="is-small px-4" @click="ShowReBalance">Edit Stock</b-button>
				<b-button type="is-primary" icon-left="printer" class="is-small px-4" @click="Print">Print</b-button>
			</div>
		</div>

		<div class="grid grid-cols-8 gap-4 p-4 has-background-pageheader">

			<div class="col-span-8 wrapper-h bg-white">

				<!-- main table -->
				<div class="text-sm p-2">

					<b-table :striped="true" :narrowed="true" :hoverable="true" :loading="loading" paginated backend-pagination :pagination-rounded="true" pagination-size="is-small" :total="totalDataCount" :per-page="pageSize" @page-change="onPageChange" backend-sorting :default-sort-direction="defaultSortOrder" :default-sort="[sortField, sortOrder]" @sort="onSort" sort-icon="arrow-up" sort-icon-size="is-small" :pagination-simple="false" :pagination-position="'top'" :selected.sync="selected_stock" @select="SelectedStock" :data="stocks">

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

						<b-table-column v-slot="props" label="On-Hand" width="100">
							<b-input size='is-small' type="text" v-model="props.row.onhand_qty"></b-input>
						</b-table-column>

						<b-table-column v-slot="props" label="Last">
							{{ props.row.last_qty }}
						</b-table-column>

						<b-table-column v-slot="props" label="On-Hand Date">
							{{ props.row.dateOnHandQty }}
						</b-table-column>

						<!-- <b-table-column v-slot="props" label="Last Date">
							{{ props.row.dateLastQty }}
						</b-table-column> -->

						<b-table-column v-slot="props" label="On-PO">
							{{ props.row.po_qty }}
						</b-table-column>

						<b-table-column v-slot="props" label="Restock">
							{{ props.row.restocking_threshold }}
						</b-table-column>

						<b-table-column v-slot="props" label="Branch">
							{{ props.row.branch_code }}
						</b-table-column>

					</b-table>
				</div>

			</div>

		</div>

		<b-modal :active.sync="isModalShow" has-modal-card trap-focus :width="500" @close="CloseRebalanceModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 400px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-semibold text-white">Rebalance Form</p>
					<div>
						<a href="#" @click.prevent="CloseRebalanceModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div class="flex">

						<b-field label="Quantity" custom-class="text-xs" class="mr-2 w-64">
							<b-numberinput size='is-small' min="0" controls-position="compact" v-model="form_stock.onhand_qty"></b-numberinput>
						</b-field>

						<!-- <b-field label="Select a date" custom-class="text-xs" class="w-full">
							<b-datepicker @input="DateSelected" v-model="selected" placeholder="Click to select..." icon="calendar-today" size="is-small" position="is-top-left" :append-to-body="true" trap-focus>
							</b-datepicker>
						</b-field> -->

					</div>

					<div class="flex">
						<b-field label="Restock Threshold" custom-class="text-xs" class="mr-2 w-64">
							<b-numberinput size='is-small' min="0" controls-position="compact" v-model="form_stock.restocking_threshold"></b-numberinput>
						</b-field>
					</div>

				</section>
				<footer class="modal-card-foot p-5">
					<b-button type="is-primary" size="is-small" @click="SaveRebalanceStockForm" icon-left="content-save">Rebalance</b-button>
					<b-button type="is-primary" size="is-small" @click="SaveRestockingThresholdForm" icon-left="content-save">Update Restocking Threshold</b-button>

				</footer>

			</div>
		</b-modal>

	</div>
</template>

<script>
	import { mapActions, mapMutations, mapGetters } from 'vuex'
	import dayjs from 'dayjs'
	import { debounce } from 'lodash'

	export default {
		components: {},
		meta: {
			module: 'stocks'
		},
		computed: {
			...mapGetters({
				// allProdNames: 'stocks/getAllProdNames',
				// allProdCodes: 'stocks/getAllProdCodes',
				allCategories: 'masterdatas/getCategories'
			})
		},

		data() {
			return {
				stocks: [],
				totalDataCount: 0,
				loading: false,
				sortField: 'date_onhand_qty',
				sortOrder: 'desc',
				defaultSortOrder: 'desc',
				page: 1,
				pageSize: 15,

				filters: [],
				optionNames: [],
				optionCodes: [],

				filterName: null,
				filterCode: null,
				filterCategory: null,
				filterDesc: null,

				selected_stock: {},
				selected: new Date(),

				form_stock: {
					stock_id: null,
					onhand_qty: null,
					restocking_threshold: null
				},

				isModalShow: false
			}
		},

		methods: {
			...mapActions({
				GetStocks: 'stocks/GetStocks',
				SetRebalanceOnhandQty: 'stocks/SetRebalanceOnhandQty',
				SetRestockingThresholdQty: 'stocks/SetRestockingThresholdQty',

				BulkUpdateStockOnhandQty: 'stocks/BulkUpdateStockOnhandQty',

				SearchProductsByName: 'products/SearchProductsByName',
				SearchProductsByCode: 'products/SearchProductsByCode',

				GetCategories: 'masterdatas/GetCategories'
			}),

			...mapMutations({}),

			SelectedStock(data) {
				this.selected_stock = data
			},

			ShowReBalance() {
				this.isModalShow = true

				this.form_stock.stock_id = this.selected_stock.stock_id
				this.form_stock.onhand_qty = this.selected_stock.onhand_qty
				this.form_stock.restocking_threshold = this.selected_stock.restocking_threshold || 0
			},

			CloseRebalanceModal() {
				this.isModalShow = false
			},

			async SaveRebalanceStockForm() {
				const res = await this.SetRebalanceOnhandQty(this.form_stock)
				if (res.status == 'ok') {
					this.CloseRebalanceModal()
					this.LoadAsyncData()
				}
			},

			async SaveRestockingThresholdForm() {
				const res = await this.SetRestockingThresholdQty(this.form_stock)
				if (res.status == 'ok') {
					this.CloseRebalanceModal()
				}
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

				const stocks = await this.GetStocks(params)

				this.stocks = []
				this.stocks = this.$clearReactive(stocks.data.results)
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
					type: 'List_Filtered_Stocks',
					branch_code: this.$store.state.selectedBranch.branch_code,
					filters: printFilters
				}

				let json = JSON.stringify(obj)

				window.open('/printing/listdoc?params=' + json, '_blank', 'location=yes,height=768,width=800,scrollbars=yes,status=yes')
			},

			async BulkStockUpdate() {
				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>Update</b> this Stocks? This action cannot be undone.',
					confirmText: 'Bulk Update Stocks',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					const stockItems = this.stocks.map((item) => {
						return {
							stock_id: item.stock_id,
							onhand_qty: parseInt(item.onhand_qty)
						}
					})

					const res = await this.BulkUpdateStockOnhandQty(stockItems)
					if (res.status === 'ok') {
						this.LoadAsyncData()
					}
				}
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
