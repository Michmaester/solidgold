<template>
	<div>

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">

			<h3 class="has-text-header">Job Orders</h3>

			<div>
				<b-button type="is-success" icon-left="plus" class="is-small text-white" @click="CreateJobOrder">Create Job Order</b-button>
				<b-button :disabled="selected_joborder.id == null || selected_joborder.status == 'Completed'" type="is-success" icon-left="playlist-edit" class="is-small text-white" @click="EditJobOrder">Edit</b-button>
				<b-button :disabled="checked_job_orders.length <= 0 || !$checkPropValueEqual(checked_job_orders, 'status', 'Created')" type="is-success" icon-left="check" class="is-small text-white" @click="MakeCompleted">Completed</b-button>
			</div>

		</div>

		<div class="grid grid-cols-8 gap-4 p-4 has-background-pageheader">

			<div class="col-span-8 wrapper-h bg-white flex">

				<div class="text-sm p-2 w-full">
					<b-table :striped="true" :narrowed="true" :hoverable="true" :loading="loading" paginated backend-pagination :pagination-rounded="true" pagination-size="is-small" :total="totalDataCount" :per-page="pageSize" @page-change="onPageChange" backend-sorting :default-sort-direction="defaultSortOrder" :default-sort="[sortField, sortOrder]" @sort="onSort" sort-icon="arrow-up" sort-icon-size="is-small" :pagination-simple="false" :pagination-position="'top'" :checked-rows.sync="checked_job_orders" :is-row-checkable="row => row.status != 'Completed'" checkable :checkbox-position="'right'" @check="RowWasChecked" :selected.sync="selected_joborder" @select="SelectedJobOrder" :data="jobOrders">

						<template slot="top-left">
							<div class="flex">

								<b-field label="Customer" custom-class="font-semibold text-xs no-mb-labels" class="w-64 text-xs mr-1">
									<v-select :options="customers" label="name" @input="SelectedFilterCustomer" :reduce="customer => customer.customer_id" />
								</b-field>

								<b-field label="Job Order No." custom-class="font-semibold text-xs no-mb-labels" class="w-48 text-xs mr-1">
									<v-select :options="jobOrders" label="job_order_no" @input="SelectedFilterJobOrder" :reduce="jo => jo.job_order_no" />
								</b-field>

							</div>
						</template>

						<b-table-column label="Job Order No." field="job_order_no" v-slot="props" sortable>
							<p class="cursor-pointer underline font-bold hover:text-blue-500" @click="ShowDetailsModal">{{ props.row.job_order_no }}</p>
						</b-table-column>

						<b-table-column label="Customer" v-slot="props">
							{{ props.row.customer.name }}
						</b-table-column>

						<b-table-column label="Created" field="jo_created" v-slot="props" sortable>
							{{ props.row.jo_created }}
						</b-table-column>

						<b-table-column label="Completed" v-slot="props">
							{{ props.row.jo_completed }}
						</b-table-column>

						<b-table-column label="Status" v-slot="props">
							{{ props.row.status }}
						</b-table-column>

					</b-table>
				</div>

			</div>

		</div>

		<b-modal :active.sync="isModalDetailsShow" has-modal-card trap-focus :width="1000" @close="CloseDetailsModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1000px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-semibold text-white">Job Order Details</p>
				</header>
				<section class="modal-card-body app-modal-form">

					<div class="flex">
						<div class="w-1/2">
							<p class="font-bold">Job Order No. : <span class="font-normal underline">{{ selected_joborder.job_order_no }}</span></p>
							<p class="font-bold">Created : <span class="font-normal">{{ selected_joborder.jo_created }}</span></p>
							<p v-if="selected_joborder.customer != null" class="font-bold">Customer : <span class="font-normal">{{ selected_joborder.customer.name }}</span></p>
						</div>
						<div class="w-1/2">

						</div>
					</div>

					<div class="text-sm mb-6">

						<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="10" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :data="selected_jo_items">

							<b-table-column label="Item" v-slot="props">
								{{ props.row.product.name }}
							</b-table-column>

							<b-table-column label="Quantity" v-slot="props">
								{{ props.row.quantity }}
							</b-table-column>

						</b-table>
					</div>

				</section>

			</div>
		</b-modal>

		<b-modal :active.sync="isModalJobOrderFormShow" has-modal-card trap-focus :width="1000" @close="CloseJobOrderFormModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1000px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-semibold text-white">Job Order Form</p>
					<div>
						<a href="#" @click.prevent="CloseJobOrderFormModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div class="flex">
						<b-field label="Job Order" custom-class="text-xs" class="mr-2">
							<b-input size="is-small" type="text" v-model="form_job_order.job_order_no"></b-input>
						</b-field>

						<b-field label="Customer" custom-class="text-xs" class="w-64 text-xs mr-2">
							<v-select :options="customers" label="name" v-model="form_job_order.customer" />
						</b-field>

						<b-field label="Date" custom-class="text-xs" class="mr-2">
							<b-input size="is-small" type="text" v-model="form_job_order.jo_created"></b-input>
						</b-field>

						<b-field label="Remarks" custom-class="text-xs" class="mr-2">
							<b-input size="is-small" type="text" v-model="form_job_order.remarks"></b-input>
						</b-field>
					</div>

					<div class="text-xs">

						<h3 class="font-bold text-lg">Order Items</h3>

						<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :data="form_job_order_items">

							<b-table-column label="Item" v-slot="props">
								<v-select :appendToBody="true" :options="products" label="name" v-model="props.row.item" />
							</b-table-column>

							<b-table-column label="Quantity" v-slot="props" width="200">
								<b-numberinput min="0" v-model="props.row.quantity" size="is-small" controls-position="compact" expanded></b-numberinput>
							</b-table-column>

							<b-table-column label="Action" v-slot="props" width="100">
								<b-button type="is-danger" icon-left="close" class="is-small text-white" @click="RemoveItemRow(props)"></b-button>
							</b-table-column>

						</b-table>

						<!-- add button -->
						<b-button type="is-primary" icon-left="plus" class="is-small text-white" @click="AddItemRow">Add Item</b-button>
					</div>

					<div class="pb-24">

					</div>

				</section>
				<footer class="modal-card-foot px-5 py-3">
					<b-button v-if="isFormCreate" type="is-primary" icon-left="plus" class="is-small text-white" @click="SubmitJobOrderForm">Submit Job Order</b-button>
					<b-button v-if="!isFormCreate" type="is-primary" icon-left="plus" class="is-small text-white" @click="UpdateJobOrderForm">Update Job Order</b-button>
					<b-button type="is-secondary" size="is-small">Clear</b-button>
				</footer>

			</div>
		</b-modal>

	</div>
</template>

<script>
	import { mapActions, mapMutations, mapGetters } from 'vuex'
	import dayjs from 'dayjs'

	export default {
		components: {},
		meta: {
			module: 'jos'
		},

		computed: {
			...mapGetters({
				// jobOrders: 'jobs/getJobOrders',
				customers: 'partners/getCustomers',
				products: 'products/getProducts'
				// purchaseOrders: 'purchases/getPurchaseOrders'
			})
		},

		data() {
			return {
				jobOrders: [],
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
				filterCustomer: null,

				form_job_order: {
					job_order_no: null,
					customer: null,
					customer_id: null,
					remarks: null,
					jo_created: null,
					jo_completed: null,
					status: null
				},

				tmp_jobOrders: [],

				selected_joborder: {},
				selected_jo_items: [],

				checked_job_orders: [],

				form_job_order_items: [],

				// use object for the items array
				// items: {
				// 	item_no: null,
				// 	item: null,
				// 	quantity: null
				// },

				isFormCreate: false,
				isModalDetailsShow: false,
				isModalJobOrderFormShow: false
			}
		},

		methods: {
			...mapActions({
				GetJobOrders: 'jobs/GetJobOrders',
				GetCustomers: 'partners/GetCustomers',
				GetProducts: 'products/GetProducts',

				InsertJobOrder: 'jobs/InsertJobOrder',
				UpdateJobOrder: 'jobs/UpdateJobOrder',

				UpdateJobOrdersStatus: 'jobs/UpdateJobOrdersStatus'
			}),

			...mapMutations({
				// PushAddSalesOrder: 'sales/add'
			}),

			AddItemRow() {
				let item = {
					item_no: null,
					quantity: 0
				}
				this.form_job_order_items.push(item)
			},

			RemoveItemRow(data) {
				var idx = data.index

				this.form_job_order_items.splice(idx, 1)
			},

			SelectedJobOrder(data) {
				console.log(data)

				this.selected_joborder = data
				this.selected_jo_items = data.items
			},

			CreateJobOrder() {
				this.isFormCreate = true
				this.$setObjectPropNull(this.form_job_order, null)
				this.isModalJobOrderFormShow = true
			},

			EditJobOrder() {
				this.isFormCreate = false

				this.form_job_order = this.$clearReactive(this.selected_joborder)
				this.form_job_order_items = this.$clearReactive(this.selected_jo_items)

				this.isModalJobOrderFormShow = true
			},

			ShowDetailsModal() {
				this.isModalDetailsShow = true
			},

			CloseDetailsModal() {
				this.isModalDetailsShow = false
			},

			ShowJobOrderFormModal() {
				this.isModalJobOrderFormShow = true
			},

			CloseJobOrderFormModal() {
				this.isModalJobOrderFormShow = false
			},

			async SubmitJobOrderForm() {
				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>submit</b> this Job Order? This action cannot be undone.',
					confirmText: 'Confirm Action',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					const payload = {
						jo: this.form_job_order,
						jo_items: this.form_job_order_items
					}

					const res = await this.InsertJobOrder(payload)
					if (res.status === 'ok') {
						this.CloseJobOrderFormModal()
					}
				}
			},

			async UpdateJobOrderForm() {
				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>update</b> this Job Order? This action cannot be undone.',
					confirmText: 'Confirm Action',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					const payload = {
						jo: this.form_job_order,
						jo_items: this.form_job_order_items
					}

					const res = await this.UpdateJobOrder(payload)
					if (res.status === 'ok') {
						this.CloseJobOrderFormModal()
					}
				}
			},

			RowWasChecked() {},

			async MakeCompleted() {
				if (this.$checkPropValueEqual(this.checked_job_orders, 'status', 'Created')) {
					const { result, dialog } = await this.$buefy.dialog.confirm({
						message: 'Are you sure you want to mark as <b>Completed</b> the selected Job Orders? This action cannot be undone.',
						confirmText: 'Confirm Action',
						type: 'is-danger',
						hasIcon: true,
						closeOnConfirm: true
					})

					if (result) {
						var payload = {
							job_orders: this.checked_job_orders.map((item) => {
								return item.job_order_no
							}),
							status: 'Completed'
						}

						let res = await this.UpdateJobOrdersStatus(payload)
						console.log(res)

						this.checked_job_orders = []
						//data = array
						//this.UpdateJobOrdersStatus(payload)
					}
				}
			},

			// filters

			SelectedFilterCustomer(data) {
				if (data) {
					this.tmp_jobOrders = this.jobOrders.filter((item) => {
						return item.customer_id == data
					})
				} else {
					this.tmp_jobOrders = this.jobOrders
				}
			},

			SelectedFilterJobOrder(data) {
				if (data) {
					this.tmp_jobOrders = this.jobOrders.filter((item) => {
						return item.job_order_no == data
					})
				} else {
					this.tmp_jobOrders = this.jobOrders
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

				const jos = await this.GetJobOrders(params)

				this.jobOrders = []
				this.jobOrders = jos.data.results
				this.totalDataCount = jos.data.total

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

				// this.filters.push({ field: 'transaction_date', value: formattedDate, type: 'like' })
				// this.filters.push({ field: 'invoice_no', value: this.filterInvoice, type: '=' })
				// this.filters.push({ field: 'customer_id', value: this.filterCustomer, type: '=' })

				this.LoadAsyncData()
			}
		},

		mounted() {
			this.LoadAsyncData()
			this.GetCustomers()
			this.GetProducts()
		}
	}
</script>

<style scoped>
	.wrapper-h {
		height: calc(100vh - 125px);
	}
</style>
