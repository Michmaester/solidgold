<template>
	<div>
		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">
			<h3 class="has-text-header">Transactions</h3>
			<div>
				<b-button type="is-primary" icon-left="printer" class="is-small px-4 ml-1" @click="Print">Print</b-button>
			</div>
		</div>

		<div class="grid grid-cols-8 gap-4 p-4 has-background-pageheader">
			<div class="col-span-8 wrapper-h bg-white">
				<!-- main table -->
				<div class="text-sm p-2">

					<b-table :striped="true" :narrowed="true" :hoverable="true" :loading="loading" paginated backend-pagination :pagination-rounded="true" pagination-size="is-small" :total="totalDataCount" :per-page="pageSize" @page-change="onPageChange" backend-sorting :default-sort-direction="defaultSortOrder" :default-sort="[sortField, sortOrder]" @sort="onSort" sort-icon="arrow-up" sort-icon-size="is-small" :pagination-simple="false" :pagination-position="'top'" :selected.sync="selected_salestrans" @select="SelectedSalesTrans" :data="salesTransactions">
						<template slot="top-left">
							<div class="flex">

								<b-field label="Date" custom-class="text-xs no-mb-labels font-semibold" class="w-40 mr-1">
									<b-datepicker v-model="filterDate" icon="calendar-month-outline" @input="FilterByDate" size="is-small" trap-focus>
										<p v-if="filterDate != null" class="control">
											<b-button type="is-danger" size="is-small" @click="FilterByDate(null)" icon-left="close">Clear</b-button>
										</p>
									</b-datepicker>
								</b-field>

								<b-field label="Invoice No." custom-class="font-semibold text-xs no-mb-labels" class="w-40 text-xs mr-1">
									<b-input type="primary" size="is-small" v-model="filterInvoice" @input="FilterByInvoice"></b-input>
								</b-field>

								<b-field label="Customers" custom-class="font-semibold text-xs no-mb-labels" class="text-xs mr-1" style="width:300px;">
									<v-select :options="customers" label="name" v-model="filterCustomer" :reduce="customer => customer.customer_id" @input="FilterByCustomer" />
								</b-field>

							</div>
						</template>

						<b-table-column field="invoice_no" label="Invoice No." v-slot="props" sortable>
							<p class="cursor-pointer underline font-bold hover:text-blue-500" @click="ShowDetailsModal">{{ props.row.invoice_no }}</p>
						</b-table-column>

						<b-table-column field="transaction_date" label="Trans. Date" v-slot="props" sortable>
							{{ props.row.dateTransaction }}
						</b-table-column>

						<b-table-column field="customer.name" label="Customer" v-slot="props">
							{{ props.row.customer.name }}
						</b-table-column>

						<b-table-column field="transaction_type" label="Type" v-slot="props">
							<p :class="$RenderColorStatus(props.row.transaction_type, 'text')">
								{{ props.row.transaction_type }}
							</p>
						</b-table-column>

						<b-table-column field="total_amount_due" label="Total Amount" v-slot="props">
							{{ $formatAmountCurrency(props.row.total_amount_due) }}
						</b-table-column>

						<b-table-column field="total_amount_tendered" label="Total Tendered" v-slot="props">
							{{ $formatAmountCurrency(props.row.total_amount_tendered) }}
						</b-table-column>

					</b-table>

				</div>
			</div>
		</div>

		<b-modal :active.sync="isModalDetailsShow" has-modal-card trap-focus :width="1000" @close="CloseDetailsModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1000px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-semibold text-white">Sales Transaction Details</p>
					<div>
						<a href="#" @click.prevent="CloseDetailsModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div class="flex">
						<div class="w-1/2">
							<p class="font-bold">Invoice No. : <span class="font-normal underline">{{ selected_salestrans.invoice_no }}</span></p>
							<p class="font-bold">Transaction Date : <span class="font-normal">{{ selected_salestrans.dateTransaction }}</span></p>
							<p class="font-bold">Type : <span class="font-normal">{{ selected_salestrans.transaction_type }}</span></p>
						</div>
						<div class="w-1/2">
							<p class="font-bold">Total Amount: <span class="font-normal">{{ $formatAmountCurrency(selected_salestrans.total_amount_due) }}</span></p>
							<p class="font-bold">Payment : <span class="font-normal">{{ selected_salestrans.payment_status }}</span></p>
							<p class="font-bold" v-if="selected_salestrans.customer != null">Customer : <span class="font-normal">{{ selected_salestrans.customer.name || null }}</span></p>

						</div>

					</div>

					<div v-if="selected_salestrans.delivery" class="bg-yellow-300 p-2 my-2">
						<h3>This invoice has a delivery.</h3>
						<p class="font-bold">Delivery Ref. : <span class="font-normal underline">{{ selected_salestrans.delivery.dr_no }}</span></p>
						<p class="font-bold">Notes : <span class="font-normal">{{ selected_salestrans.delivery.delivery_notes }}</span></p>
					</div>

					<div class="text-sm">

						<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="10" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :data="sales_trans_items">

							<b-table-column v-slot="props" field="" label="Product">
								<div class="flex flex-col leading-tight">
									<p><span class="font-semibold text-red-500 mr-2">{{ props.row.product.product_code }}</span>{{ props.row.product.name }}</p>
									<p>{{ props.row.product.description }} - {{ props.row.product.brand.brandname }} - {{ props.row.product.unit }}</p>
								</div>
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Description">
								{{ props.row.product.description }}
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Brand">
								{{ props.row.product.brand.brandname }}
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Quantity">
								{{ props.row.qty }}
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Price Per unit">
								{{ $formatAmount(props.row.price_per_unit) }}
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Unit">
								{{ props.row.unit }}
							</b-table-column>

							<!-- {
								field: 'product.name',
								label: 'Product',
								width: '150',
								sortable: true
							},
							{ field: 'product.description', label: 'Description' },
							{ field: 'product.brand.brandname', label: 'Brand' },
							{ field: 'qty', label: 'Quantity', width: '100' },
							{ field: 'price_per_unit', label: 'Price Per unit', width: '100' },
							{ field: 'unit', label: 'Unit', width: '100' } -->

						</b-table>
					</div>

				</section>

			</div>
		</b-modal>
	</div>
</template>

<script>
	import { mapActions, mapMutations, mapGetters } from 'vuex'
	import simplebar from 'simplebar-vue'
	import dayjs from 'dayjs'
	import { debounce } from 'lodash'

	export default {
		meta: {
			module: 'transactions'
		},
		components: {
			simplebar
		},

		computed: mapGetters({
			customers: 'partners/getCustomers',

			salesTransactionItems: 'sales/getSalesTransactionItems',
			salesInvoices: 'sales/getSalesInvoices'
		}),

		watch: {},

		data() {
			return {
				tbl_salestrans_items_columns: [
					// { field: 'order_no', label: 'Sales Order', width: '150', sortable: true },
					{
						field: 'product.name',
						label: 'Product',
						width: '150',
						sortable: true
					},
					{ field: 'product.description', label: 'Description' },
					{ field: 'product.brand.brandname', label: 'Brand' },
					{ field: 'qty', label: 'Quantity', width: '100' },
					{ field: 'price_per_unit', label: 'Price Per unit', width: '100' },
					{ field: 'unit', label: 'Unit', width: '100' }
				],

				selected_salestrans: {},
				sales_trans_items: [],

				form_salesorder: {
					customer_id: null,
					user_id: null,
					sales_type: null,
					order_date: null,
					order_no: null,
					status: null,
					customer_name: null,
					customer_address: null,
					is_printed: null
				},

				form_salesorder_items: [
					{
						product_id: null,
						quantity: null,
						sale_price: null
					}
				],

				selectedOptions: [],

				isFormCreate: false,
				isModalShow: false,

				isModalDetailsShow: false,

				salesTransactions: [],
				totalDataCount: 0,
				loading: false,
				sortField: 'id',
				sortOrder: 'desc',
				defaultSortOrder: 'desc',
				page: 1,
				pageSize: 10,

				filters: [],

				filterDate: null,
				filterInvoice: null,
				filterCustomer: null
			}
		},

		methods: {
			...mapActions({
				GetCustomers: 'partners/GetCustomers',

				GetSalesTransactions: 'sales/GetSalesTransactions',
				GetSalesTransactionItems: 'sales/GetSalesTransactionItems',
				GetSalesInvoices: 'sales/GetSalesInvoices'
			}),

			...mapMutations({}),

			SelectedSalesTrans(data) {
				this.selected_salestrans = data
				this.sales_trans_items = data.trans_items
			},

			ShowDetailsModal() {
				this.isModalDetailsShow = true
			},

			CloseDetailsModal() {
				this.isModalDetailsShow = false
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

				const transactions = await this.GetSalesTransactions(params)

				this.salesTransactions = []
				this.salesTransactions = transactions.data.results
				this.totalDataCount = transactions.data.total

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

				let formattedDate = null
				if (this.filterDate) {
					formattedDate = dayjs(this.filterDate).format('YYYY-MM-DD')
				}

				this.filters.push({ field: 'transaction_date', value: formattedDate, type: 'like' })
				this.filters.push({ field: 'invoice_no', value: this.filterInvoice, type: 'like' })
				this.filters.push({ field: 'customer_id', value: this.filterCustomer, type: '=' })

				this.LoadAsyncData()
			},

			FilterByInvoice(value) {
				this.searchDebounce(this)
			},

			FilterByDate(value) {
				this.filterDate = value
				this.searchDebounce(this)
			},

			FilterByCustomer(value) {
				this.searchDebounce(this)
			},

			searchDebounce: debounce((vm) => {
				vm.onFilterData()
			}, 500),

			Print() {
				let printFilters = []

				let formattedDate = null
				if (this.filterDate) {
					formattedDate = dayjs(this.filterDate).format('YYYY-MM-DD')
				}

				printFilters.push({ field: 'transaction_date', value: formattedDate, type: 'like' })
				printFilters.push({ field: 'customer_id', value: this.filterCustomer, type: '=' })

				let obj = {
					type: 'List_Sales_Transactions',
					branch_code: this.$store.state.selectedBranch.branch_code,
					filters: printFilters
				}

				let json = JSON.stringify(obj)

				window.open('/printing/listdoc?params=' + json, '_blank', 'location=yes,height=768,width=800,scrollbars=yes,status=yes')
			}
		},

		mounted() {
			//this.GetSalesTransactions()
			this.GetCustomers()
			this.GetSalesInvoices()

			this.LoadAsyncData()
		}
	}
</script>

<style scoped>
	.wrapper-h {
		height: calc(100vh - 125px);
	}
</style>
