<template>
	<div>
		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">
			<h3 class="has-text-header">Deliveries</h3>

			<div class="flex items-center">

				<b-button :disabled="selected_salesdelivery.id == null || selected_salesdelivery.status != 'In-Transit'" type="is-primary" icon-left="plus" class="is-small text-white mr-1" @click="ShowDeliveryModal">Delivery</b-button>

				<b-dropdown aria-role="list" position="is-bottom-left">
					<b-button type="is-primary" size="is-small" slot="trigger" slot-scope="{ active }">
						<b-icon size="is-small" icon="update"></b-icon>
						<span>Update Delivery Status</span>
						<b-icon size="is-small" :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
					</b-button>

					<b-dropdown-item :disabled="checked_salesdeliveries.length <= 0" class="text-xs" aria-role="listitem" @click="MakeStatusPending">Make Pending</b-dropdown-item>
					<b-dropdown-item :disabled="checked_salesdeliveries.length <= 0" class="text-xs" aria-role="listitem" @click="MakeStatusInTransit">Make In-Transit</b-dropdown-item>
				</b-dropdown>

				<b-button type="is-primary" icon-left="printer" class="is-small px-4 ml-1" @click="Print">Print</b-button>
			</div>
		</div>

		<div class="grid grid-cols-8 gap-4 p-4 has-background-pageheader">
			<div class="col-span-8 wrapper-h bg-white">
				<!-- main table -->
				<div class="text-sm p-2">

					<b-table :striped="true" :narrowed="true" :hoverable="true" :loading="loading" paginated backend-pagination :pagination-rounded="true" pagination-size="is-small" :total="totalDataCount" :per-page="pageSize" @page-change="onPageChange" backend-sorting :default-sort-direction="defaultSortOrder" :default-sort="[sortField, sortOrder]" @sort="onSort" sort-icon="arrow-up" sort-icon-size="is-small" :pagination-simple="false" :pagination-position="'top'" :checked-rows.sync="checked_salesdeliveries" :is-row-checkable="row => row.status != 'Delivered'" checkable :checkbox-position="'right'" @check="RowWasChecked" :selected.sync="selected_salesdelivery" @select="SelectedSalesDelivery" :data="salesDeliveries">

						<template slot="top-left">
							<div class="flex">

								<b-field label="Delivery Ref." custom-class="font-semibold text-xs no-mb-labels" class="w-40 text-xs mr-1">
									<b-input type="primary" size="is-small" v-model="filterDeliveryRef" @input="FilterByDeliveryRef"></b-input>
								</b-field>

								<b-field label="Status" custom-class="font-semibold text-xs no-mb-labels" class="w-40 text-xs mr-1">
									<b-input type="primary" size="is-small" v-model="filterStatus" @input="FilterByStatus"></b-input>
								</b-field>

							</div>
						</template>

						<b-table-column field="dr_no" label="Delivery No" v-slot="props">
							<p class="cursor-pointer underline font-bold hover:text-blue-500" @click="ShowDetailsModal">{{ props.row.dr_no }}</p>
						</b-table-column>
						<b-table-column field="sales_trans.customer.name" label="Customer" v-slot="props">
							{{ props.row.sales_trans.customer.name }}
						</b-table-column>
						<b-table-column field="dateDeliveryRequested" label="Requested Delivery Date" v-slot="props">
							{{ props.row.dateDeliveryRequested }}
						</b-table-column>
						<b-table-column label="Delivery Notes" v-slot="props">
							{{ props.row.delivery_notes }}
						</b-table-column>
						<b-table-column field="status" label="Status" v-slot="props">
							<p :class="$RenderColorStatus(props.row.status, 'text')">
								{{ props.row.status }}
							</p>
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

					<div class="flex flex-col text-sm">
						<div class="flex">
							<div class="w-1/2">
								<p class="mb-2 font-bold">Delivery no : {{ selected_salesdelivery.dr_no }}</p>
								<!-- <p v-if="selected_salesdelivery.id != 'null'">Customer : {{ selected_salesdelivery.sales_trans.customer.name }}</p> -->
								<p :class="$RenderColorStatus(selected_salesdelivery.status, 'text')">Status : {{ selected_salesdelivery.status }}</p>
							</div>
							<div class="w-1/2">
								<p class="mb-2 font-bold">Invoice no : {{ selected_salesdelivery.invoice_no }}</p>
								<p>Requested Delivery Date : {{ selected_salesdelivery.dateDeliveryRequested }}</p>
								<p>Delivery Note : {{ selected_salesdelivery.delivery_notes }}</p>
							</div>
						</div>
						<div v-if="delivery_items.length > 0">
							<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="10" current-page.sync="1" :pagination-simple="true" :pagination-position="'top'" pagination-size="is-small" :data="delivery_items">

								<b-table-column v-slot="props" field="" label="Product">
									<div class="flex flex-col leading-tight">
										<p><span class="font-semibold text-red-500 mr-2">{{ props.row.product.product_code }}</span>{{ props.row.product.name }}</p>
										<p>{{ props.row.product.description }} - {{ props.row.product.brand.brandname }} - {{ props.row.product.unit }}</p>
									</div>
								</b-table-column>

								<b-table-column v-slot="props" label="Description">
									{{ props.row.product.description }}
								</b-table-column>
								<b-table-column v-slot="props" label="Unit">
									{{ props.row.unit }}
								</b-table-column>
								<b-table-column v-slot="props" label="Qty">
									{{ $formatAmount(props.row.qty,0) }}
								</b-table-column>
								<b-table-column v-slot="props" label="Price Per Unit">
									{{ $formatAmount(props.row.price_per_unit) }}
								</b-table-column>

							</b-table>
						</div>
					</div>

				</section>
				<footer class="modal-card-foot p-3">

					<b-button type="is-secondary" size="is-small">Clear</b-button>
				</footer>

			</div>
		</b-modal>

		<b-modal :active.sync="isModalDeliveryShow" has-modal-card trap-focus :width="1000" @close="CloseDeliveryModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1000px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-semibold text-white">Sales Delivery Form</p>
					<div>
						<a href="#" @click.prevent="CloseDeliveryModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div class="flex flex-col text-sm">
						<div class="flex">
							<div class="w-1/2">
								<p class="mb-2 font-bold">Delivery no : {{ selected_salesdelivery.dr_no }}</p>
							</div>
							<div class="w-1/2">
								<p class="mb-2 font-bold">Invoice no : {{ selected_salesdelivery.invoice_no }}</p>
								<p>Requested Delivery Date : {{ selected_salesdelivery.dateDeliveryRequested }}</p>
								<p>Delivery Note : {{ selected_salesdelivery.delivery_notes }}</p>
							</div>
						</div>
						<div>
							<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="10" current-page.sync="1" :pagination-simple="true" :pagination-position="'top'" pagination-size="is-small" :data="form_salesdelivery_items">

								<!-- <b-table-column v-slot="props" label="Product">
									<div class="leading-tight">
										<p>{{ props.row.product.name }}</p>
										<p>{{ props.row.product.description }}</p>
									</div>

								</b-table-column> -->

								<b-table-column v-slot="props" field="" label="Product">
									<div class="flex flex-col leading-tight">
										<p><span class="font-semibold text-red-500 mr-2">{{ props.row.product.product_code }}</span>{{ props.row.product.name }}</p>
										<p>{{ props.row.product.description }} - {{ props.row.product.brand.brandname }} - {{ props.row.product.unit }}</p>
									</div>
								</b-table-column>

								<b-table-column v-slot="props" label="Brand">
									{{ props.row.product.brand.brandname }}
								</b-table-column>

								<b-table-column v-slot="props" label="Unit">
									{{ props.row.unit }}
								</b-table-column>

								<b-table-column v-slot="props" label="Price Per Unit">
									{{ props.row.price_per_unit }}
								</b-table-column>

								<b-table-column v-slot="props" label="Ordered Qty">
									{{ props.row.ordered_qty }}
								</b-table-column>

								<b-table-column v-slot="props" label="Delivered Qty">
									<b-field>
										<b-numberinput :min="props.row.old_delivered_qty" v-model="props.row.delivered_qty" size="is-small" controls-position="compact" expanded></b-numberinput>
									</b-field>
								</b-table-column>

							</b-table>
						</div>
					</div>

				</section>
				<footer class="modal-card-foot p-3">
					<b-button type="is-primary" icon-left="plus" class="is-small text-white mr-1" @click="SubmitConfirmSalesDelivery">Submit & Confirm Delivery</b-button>
					<b-button type="is-secondary" size="is-small">Clear</b-button>
				</footer>

			</div>
		</b-modal>
	</div>
</template>

<script>
	import { mapActions, mapMutations, mapGetters } from 'vuex'
	import { debounce } from 'lodash'

	export default {
		components: {},
		meta: {
			module: 'deliveries'
		},
		computed: mapGetters({
			//salesDeliveries: 'sales/getSalesDeliveries'
			customers: 'partners/getCustomers'
		}),

		data() {
			return {
				tbl_salesdelivery_items_columns: [
					{
						field: 'product.name',
						label: 'Product',
						width: '150',
						sortable: true
					},
					{ field: 'product.description', label: 'Description' },
					{ field: 'unit', label: 'Unit' },
					{ field: 'qty', label: 'Quantity' },
					{ field: 'price_per_unit', label: 'Price Per Unit' }
				],

				delivery_items: [],

				salesDeliveries: [],
				totalDataCount: 0,
				loading: false,
				sortField: 'id',
				sortOrder: 'desc',
				defaultSortOrder: 'desc',
				page: 1,
				pageSize: 10,

				filters: [],

				filterDeliveryRef: null,
				filterStatus: null,

				selected_salesdelivery: {},
				selected_salesdelivery_item: {},
				checked_salesdeliveries: [],

				form_salesdelivery_items: [],

				isModalDetailsShow: false,
				isModalDeliveryShow: false
			}
		},

		methods: {
			...mapActions({
				GetSalesDeliveries: 'sales/GetSalesDeliveries',
				GetCustomers: 'partners/GetCustomers',

				UpdateDeliveryStatus: 'sales/UpdateDeliveryStatus',
				ConfirmSalesDelivery: 'sales/ConfirmSalesDelivery'
			}),

			...mapMutations({}),

			RowWasChecked(data) {
				var statuses = data.map((item) => {
					return item.status
				})
				var testing = statuses.every((item) => item === statuses[0])
			},

			TestUncheck() {
				this.checked_salesdeliveries = []
			},

			SelectedSalesDelivery(data) {
				this.selected_salesdelivery = data
				this.delivery_items = data.sales_trans.trans_items
			},

			MakeStatusPending() {
				var statuses = this.checked_salesdeliveries.map((item) => {
					return item.status
				})
				var res = statuses.every((item) => item === statuses[0])
				if (res) {
					//allow

					this.UpdateDeliveriesStatus('Pending')
				} else {
					//error
				}
			},

			MakeStatusInTransit() {
				// accept pending status only

				var statuses = this.checked_salesdeliveries.map((item) => {
					return item.status
				})
				var res = statuses.every((item) => item === statuses[0])
				if (res) {
					//allow

					this.UpdateDeliveriesStatus('In-Transit')
				} else {
					//error
				}
			},

			MakeStatusDelivered() {
				var statuses = this.checked_salesdeliveries.map((item) => {
					return item.status
				})
				var res = statuses.every((item) => item === statuses[0])
				if (res) {
					//allow

					this.UpdateDeliveriesStatus('Delivered')
				} else {
					//error
				}
			},

			async UpdateDeliveriesStatus(status) {
				const delivery_nos = this.checked_salesdeliveries.map((item) => {
					return item.dr_no
				})
				var payload = {
					delivery_nos: delivery_nos,
					status: status
				}

				const res = await this.UpdateDeliveryStatus(payload)
				if (res.status === 'ok') {
					this.LoadAsyncData()
					this.checked_salesdeliveries = []
				}
			},

			ShowDetailsModal() {
				this.isModalDetailsShow = true
			},

			CloseDetailsModal() {
				this.isModalDetailsShow = false
			},

			ShowDeliveryModal() {
				this.form_salesdelivery_items = this.delivery_items.map((item) => {
					return {
						id: item.id,
						invoice_no: this.selected_salesdelivery.invoice_no,
						product: item.product,
						product_id: item.product_id,
						unit: item.unit,
						price_per_unit: item.price_per_unit,
						ordered_qty: item.qty,
						delivered_qty: item.old_delivered_qty || item.qty, // needed to make the qty automatically encoded, can be change
						old_delivered_qty: item.delivered_qty || 0
					}
				})

				this.isModalDeliveryShow = true
			},

			CloseDeliveryModal() {
				this.isModalDeliveryShow = false
			},

			async SubmitConfirmSalesDelivery() {
				const payload = {
					sales_delivery: this.selected_salesdelivery,
					items: this.form_salesdelivery_items
				}

				const res = await this.ConfirmSalesDelivery(payload)
				if (res.status === 'ok') {
					this.CloseDeliveryModal()
					this.LoadAsyncData()
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

				const deliveries = await this.GetSalesDeliveries(params)

				this.salesDeliveries = []
				this.salesDeliveries = deliveries.data.results
				this.totalDataCount = deliveries.data.total

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

				// let formattedDate = null
				// if (this.filterDate) {
				// 	formattedDate = dayjs(this.filterDate).format('YYYY-MM-DD')
				// }

				this.filters.push({ field: 'dr_no', value: this.filterDeliveryRef, type: 'like' })
				this.filters.push({ field: 'status', value: this.filterStatus, type: 'like' })

				this.LoadAsyncData()
			},

			FilterByDeliveryRef() {
				this.searchDebounce(this)
			},

			FilterByStatus() {
				this.searchDebounce(this)
			},

			searchDebounce: debounce((vm) => {
				vm.onFilterData()
			}, 500),

			Print() {
				let obj = {
					type: 'Sales_Delivery',
					branch_code: this.$store.state.selectedBranch.branch_code,
					ref_field: 'dr_no',
					ref_no: this.selected_salesdelivery.dr_no
				}

				let urlParams = new URLSearchParams(obj).toString()

				window.open('/printing/singledoc?' + urlParams, '_blank', 'location=yes,height=768,width=800,scrollbars=yes,status=yes')
			}
		},

		mounted() {
			this.LoadAsyncData()
			this.GetCustomers()
		}
	}
</script>

<style scoped>
	.wrapper-h {
		height: calc(100vh - 125px);
	}
</style>
