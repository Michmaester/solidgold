<template>
	<div>

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">

			<h3 class="has-text-header">Partners - Customers</h3>

			<div class="flex items-center">

				<!-- <b-button type="is-primary" icon-left="printer" class="is-small px-4 mr-1" @click="Print">Print Statement</b-button> -->

				<b-dropdown aria-role="list" position="is-bottom-left">
					<b-button class="button is-primary" size="is-small" slot="trigger" slot-scope="{ active }">
						<span>Actions</span>
						<b-icon size="is-small" :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
					</b-button>

					<b-dropdown-item aria-role="listitem" @click="CreateCustomer" class="flex items-center">
						<b-icon icon="plus" size="is-small" class="mr-2"></b-icon>
						<span>New Customer</span>
					</b-dropdown-item>
					<b-dropdown-item aria-role="listitem" :disabled="selectedCustomer.id == null" @click="EditCustomer" class="flex items-center">
						<b-icon icon="playlist-edit" size="is-small" class="mr-2"></b-icon>
						<span>Edit Customer</span>
					</b-dropdown-item>
					<hr class="dropdown-divider">
					<b-dropdown-item aria-role="listitem" :disabled="selectedCustomer.id == null" @click="OpenCustomerDetailsModal(props.row)" class="flex items-center">
						<b-icon icon="eye-settings-outline" size="is-small" class="mr-2"></b-icon>
						<span>View Information</span>
					</b-dropdown-item>
				</b-dropdown>

			</div>

		</div>

		<div class="grid grid-cols-8 gap-4 p-4 has-background-pageheader">

			<div class="col-span-8 wrapper-h bg-white">

				<div class="text-sm p-2">

					<b-table :striped="true" :narrowed="true" :hoverable="true" :loading="loading" paginated backend-pagination :pagination-rounded="true" pagination-size="is-small" :total="totalDataCount" :per-page="pageSize" @page-change="onPageChange" backend-sorting :default-sort-direction="defaultSortOrder" :default-sort="[sortField, sortOrder]" @sort="onSort" sort-icon="arrow-up" sort-icon-size="is-small" :pagination-simple="false" :pagination-position="'top'" :selected.sync="selectedCustomer" @select="SelectedCustomer" :data="customers">

						<b-table-column label="Code" v-slot="props">
							{{ props.row.customer_id }}
						</b-table-column>

						<b-table-column label="Ref" v-slot="props">
							{{ props.row.customer_ref }}
						</b-table-column>

						<b-table-column label="Customer" v-slot="props">
							<p class="cursor-pointer underline font-bold hover:text-blue-500" @click="OpenCustomerDetailsModal(props.row)">{{ props.row.name }}</p>
						</b-table-column>

						<b-table-column label="Address" v-slot="props">
							{{ props.row.address }}
						</b-table-column>

						<b-table-column label="Email" v-slot="props">
							{{ props.row.email }}
						</b-table-column>

						<b-table-column label="Status" v-slot="props">
							{{ props.row.status }}
						</b-table-column>

						<template slot="top-left">
							<div class="flex">

								<b-field label="Customer Name" custom-class="font-semibold text-xs no-mb-labels" class="w-64 text-xs mr-1">
									<b-input type="primary" size="is-small" v-model="filterCustomer" @input="FilterByName"></b-input>
								</b-field>

								<b-field label="Reference" custom-class="font-semibold text-xs no-mb-labels" class="w-24 text-xs mr-1">
									<b-input type="primary" size="is-small" v-model="filterRef" @input="FilterByRef"></b-input>
								</b-field>

								<b-field label="Address" custom-class="font-semibold text-xs no-mb-labels" class="w-64 text-xs mr-1">
									<b-input type="primary" size="is-small" v-model="filterAddress" @input="FilterByAddress"></b-input>
								</b-field>

							</div>
						</template>

					</b-table>
				</div>

			</div>

		</div>

		<b-modal :active.sync="isModalShow" has-modal-card full-screen :can-cancel="['escape']" custom-class="full-modal">

			<div class="modal-card-head flex items-center justify-between has-background-primary p-4">
				<div class="leading-tight">
					<p class="text-xl font-bold uppercase">{{ selectedCustomer.name }}</p>
					<p class="text-xs">{{ selectedCustomer.address }}</p>
				</div>

				<div class="flex">
					<b-button type="is-primary" icon-left="printer" class="is-small px-4 mr-1" @click="Print">Print Statement</b-button>
					<b-button class="button is-light mr-2" size="is-small" @click="EditCustomer">Edit Customer</b-button>
					<a href="#" @click.prevent="CloseModal">
						<b-icon icon="close" size="is-medium" class="hover:text-red-500"></b-icon>
					</a>
				</div>
			</div>

			<div class="modal-content">

				<div class="flex w-full">
					<div class="p-4 bg-white flex w-1/2">

						<div class="w-1/2 mr-2">

							<div class="leading-tight mb-4">
								<p class="font-bold uppercase text-gray-700">Contact Person</p>
								<span>{{ selectedCustomer.contact_person || 'N/A' }}</span>
							</div>

							<div class="leading-tight mb-4">
								<p class="font-bold uppercase text-gray-700">Contact Nos.</p>
								<div class="flex flex-col">
									<span>{{ selectedCustomer.mobile1 }}</span>
									<span>{{ selectedCustomer.mobile2 }}</span>
									<span>{{ selectedCustomer.landline }}</span>
								</div>
							</div>

							<div class="leading-tight mb-4">
								<p class="font-bold uppercase text-gray-700">Ship to Address</p>
								<span>{{ selectedCustomer.ship_to_address || 'N/A' }}</span>
							</div>

							<div class="leading-tight mb-4">
								<p class="font-bold uppercase text-gray-700">Billing to Address</p>
								<span>{{ selectedCustomer.bill_to_address || 'N/A' }}</span>
							</div>

							<div class="leading-tight mb-4">
								<p class="font-bold uppercase text-gray-700">Status</p>
								<span>{{ selectedCustomer.status }}</span>
							</div>

							<div class="leading-tight mb-4">
								<p class="font-bold uppercase text-gray-700">Notes</p>
								<span>{{ selectedCustomer.notes || 'N/A' }}</span>
							</div>

						</div>

						<div class="w-1/2">

							<div class="leading-tight mb-4">
								<p class="font-bold uppercase text-gray-700">Email</p>
								<span>{{ selectedCustomer.email || 'N/A' }}</span>
							</div>

							<div class="leading-tight mb-4">
								<p class="font-bold uppercase text-gray-700">Tax Identification No.</p>
								<span>{{ selectedCustomer.tin_number || 'N/A' }}</span>
							</div>

							<div class="leading-tight mb-4">
								<p class="font-bold uppercase text-gray-700">Payment Terms</p>
								<span>{{ selectedCustomer.payment_terms || 'N/A' }}</span>
							</div>

							<div class="leading-tight mb-4">
								<p class="font-bold uppercase text-gray-700">Sales Type</p>
								<span>{{ selectedCustomer.sales_type || 'N/A' }}</span>
							</div>

						</div>

					</div>

					<div class="p-4 has-background-pageheader w-1/2 content-height">

						<b-tabs type="is-boxed">

							<b-tab-item label="Invoices">

								<!-- Sales Invoices of the selected customer -->
								<div class="w-full text-sm p-2">
									<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="20" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :checked-rows.sync="checked_customerinvoices" checkable :checkbox-position="'right'" :data="tmpCustomerSalesInvoices">

										<template slot="top-left">
											<div class="flex">

												<b-field label="Filter" custom-class="font-semibold text-xs no-mb-labels" class="w-64 text-xs mr-1">
													<b-select type="primary" size="is-small" v-model="customerInvoicesFilter" @input="FilterCustomerInvoices">
														<option value="all">All</option>
														<option value="paid">Paid</option>
														<option value="unpaid">Unpaid</option>
														<option value="unpaid-partial">Unpaid/Partial</option>
													</b-select>
												</b-field>

											</div>
										</template>

										<b-table-column label="Invoice" v-slot="props">
											{{ props.row.invoice_no }}
										</b-table-column>
										<b-table-column label="Date" v-slot="props">
											{{ props.row.dateTransaction }}
										</b-table-column>
										<b-table-column label="Type" v-slot="props">
											{{ props.row.transaction_type }}
										</b-table-column>
										<b-table-column label="Amount" v-slot="props">
											{{ props.row.total_amount_due }}
										</b-table-column>
										<b-table-column label="Status" v-slot="props">
											{{ props.row.status }}
										</b-table-column>
										<b-table-column label="Payment" v-slot="props">
											{{ props.row.payment_status }}
										</b-table-column>

									</b-table>
								</div>
							</b-tab-item>

							<b-tab-item label="Deliveries">

								<!-- Sales Deliveries for the selected customer -->
								<div class="w-full text-sm p-2">
									<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="20" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :data="customerSalesDeliveries">

										<b-table-column label="Invoice" v-slot="props">
											{{ props.row.dr_no }}
										</b-table-column>
										<b-table-column label="Requested Delv Date" v-slot="props">
											{{ props.row.dateDeliveryRequested }}
										</b-table-column>

										<b-table-column label="Status" v-slot="props">
											{{ props.row.status }}
										</b-table-column>

										<b-table-column label="Fee" v-slot="props">
											{{ props.row.delivery_fee }}
										</b-table-column>

										<b-table-column label="Notes" v-slot="props">
											{{ props.row.delivery_notes }}
										</b-table-column>

									</b-table>
								</div>
							</b-tab-item>

							<b-tab-item label="Payments">

								<!-- Sales Payments of the selected customer -->
								<div class="w-full text-sm p-2">
									<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="20" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :data="customerSalesPayments">

										<b-table-column label="Invoice" v-slot="props">
											{{ props.row.sales_transaction.invoice_no }}
										</b-table-column>

										<b-table-column label="Type" v-slot="props">
											{{ props.row.sales_transaction.invoice_type }}
										</b-table-column>

										<b-table-column label="Payment Status" v-slot="props">
											{{ props.row.sales_transaction.payment_status }}
										</b-table-column>

									</b-table>
								</div>
							</b-tab-item>

							<!-- Atachments of the selected customer -->
							<b-tab-item label="Attachments">
								<div class="w-full text-sm p-2">
									<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="20" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :data="selected_cust_attachments">

										<b-table-column label="File Type" v-slot="props">
											{{ props.row.attach_file_type }}
										</b-table-column>

										<b-table-column label="Location" v-slot="props">
											{{ props.row.attach_file_location }}
										</b-table-column>

										<b-table-column label="Created" v-slot="props">
											{{ props.row.created_at }}
										</b-table-column>

									</b-table>
								</div>
							</b-tab-item>

						</b-tabs>
					</div>
				</div>

			</div>

		</b-modal>

		<b-modal :active.sync="isModalCustomerFormShow" has-modal-card trap-focus :width="1100" @close="CloseCustomerFormModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1100px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-semibold text-white">Customer Form</p>
					<div>
						<a href="#" @click.prevent="CloseCustomerFormModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div>

						<div class="flex">

							<b-field label="Customer Name" custom-class="text-xs" class="mr-2" style="width:400px">
								<b-input size='is-small' type="text" v-model="form_customer.name"></b-input>
							</b-field>

							<b-field label="Customer Ref" custom-class="text-xs" class="w-32">
								<b-input size='is-small' type="text" v-model="form_customer.customer_ref"></b-input>
							</b-field>

						</div>

						<div>

							<b-field label="Address" custom-class="text-xs">
								<b-input size='is-small' type="text" v-model="form_customer.address"></b-input>
							</b-field>

							<b-field label="ShipTo" custom-class="text-xs">
								<b-input size='is-small' type="text" v-model="form_customer.ship_to_address"></b-input>
							</b-field>

							<b-field label="BillTo" custom-class="text-xs">
								<b-input size='is-small' type="text" v-model="form_customer.bill_to_address"></b-input>
							</b-field>

						</div>

					</div>

					<div class="flex">

						<b-field label="Contact Person" custom-class="text-xs">
							<b-input size='is-small' type="text" v-model="form_customer.contact_person"></b-input>
						</b-field>

						<b-field label="Mobile 1" custom-class="text-xs" class="mr-4">
							<b-input size='is-small' type="text" v-model="form_customer.mobile1"></b-input>
						</b-field>

						<b-field label="Mobile 2" custom-class="text-xs" class="mr-4">
							<b-input size='is-small' type="text" v-model="form_customer.mobile2"></b-input>
						</b-field>

						<b-field label="Landline" custom-class="text-xs">
							<b-input size='is-small' type="text" v-model="form_customer.landline"></b-input>
						</b-field>

					</div>

					<div class="flex">

						<b-field label="Email" custom-class="text-xs">
							<b-input size='is-small' type="text" class="w-64" v-model="form_customer.email"></b-input>
						</b-field>

						<b-field label="Tax ID" custom-class="text-xs">
							<b-input size='is-small' type="text" class="w-64" v-model="form_customer.tin_number"></b-input>
						</b-field>

						<b-field label="Payment Terms" custom-class="text-xs">
							<b-input size='is-small' type="text" class="w-64" v-model="form_customer.payment_terms"></b-input>
						</b-field>

						<b-field label="Sales Type" custom-class="text-xs">
							<!-- <b-input size='is-small' type="text" class="w-64" v-model="form_customer.sales_type"></b-input> -->
							<b-select size='is-small' placeholder="Select a salestype" required v-model="form_customer.sales_type">
								<option value="Retail">Retail</option>
								<option value="Wholesale">Wholesale</option>
							</b-select>
						</b-field>

					</div>

					<div class="flex">

						<b-field label="Status" custom-class="text-xs">
							<b-checkbox size="is-small" v-model="form_customer.bool_status">Active Customer</b-checkbox>
						</b-field>

						<b-field label="Note" custom-class="text-xs">
							<b-input size='is-small' type="text" class="w-64" v-model="form_customer.notes"></b-input>
						</b-field>

					</div>

					<p class="py-4">sddfg</p>
					<p class="py-4">sddfg</p>
					<p class="py-4">sddfg</p>
					<p class="py-4">sddfg</p>
					<p class="py-4">sddfg</p>
					<p class="py-4">sddfg</p>
					<p class="py-4">sddfg</p>
					<p class="py-4">sddfg</p>

				</section>
				<footer class="modal-card-foot px-5 py-3">
					<b-button v-if="isFormCreate" type="is-primary" icon-left="content-save-outline" class="is-small text-white" @click="SaveForm">Save</b-button>
					<b-button v-if="!isFormCreate" type="is-warning" icon-left="update" class="is-small text-white" @click="UpdateForm">Update</b-button>
					<b-button type="is-secondary" size="is-small" @click="ClearForm">Clear</b-button>
				</footer>

			</div>
		</b-modal>

	</div>
</template>

<script>
	import { mapMutations, mapGetters, mapActions } from 'vuex'
	import { debounce } from 'lodash'

	export default {
		name: 'CustomersPage',

		components: {},
		meta: {
			module: 'customers'
		},

		computed: {
			...mapGetters({
				allCustomers: 'partners/getAllCustomers',
				customerSalesInvoices: 'partners/getCustomerSalesInvoices',
				customerSalesDeliveries: 'partners/getCustomerSalesDeliveries',
				customerSalesPayments: 'partners/getCustomerSalesPayments'
			})
		},

		watch: {
			customerSalesInvoices(newValue, oldValue) {
				this.tmpCustomerSalesInvoices = this.$clearReactive(newValue)
			}
		},

		data() {
			return {
				// tbl_customers_columns: [
				// 	{ field: 'name', label: 'Branch Code', width: '150', sortable: true },
				// 	{ field: 'contact_person', label: 'Company Name', width: '150', sortable: true },
				// 	{ field: 'address', label: 'Address', width: '40' },
				// 	{ field: 'mobile1', label: 'Mobile1', width: '40' },
				// 	{ field: 'landline', label: 'Landline', width: '40' },
				// 	{ field: 'email', label: 'Email', width: '40' },
				// 	{ field: 'status', label: 'Status', width: '40' }
				// ],

				customers: [],
				totalDataCount: 0,
				loading: false,
				sortField: 'id',
				sortOrder: 'desc',
				defaultSortOrder: 'desc',
				page: 1,
				pageSize: 15,

				filters: [],
				filterCustomer: null,
				filterRef: null,
				filterAddress: null,

				selectedCustomer: {},
				selected_cust_attachments: [],

				tmp_customers: [],

				form_customer: {
					id: null,
					customer_ref: null,
					name: null,
					contact_person: null,
					address: null,
					ship_to_address: null,
					bill_to_address: null,
					mobile1: null,
					mobile2: null,
					landline: null,
					email: null,
					tin_number: null,
					sales_type: null,
					payment_terms: null,
					notes: null,
					status: null,
					bool_status: false
				},

				isFormCreate: false,

				isModalShow: false,
				isFormSidebarShow: false,
				isModalCustomerFormShow: false,

				checked_customerinvoices: [],

				customerInvoicesFilter: 'all',

				tmpCustomerSalesInvoices: []
			}
		},

		methods: {
			...mapActions({
				GetCustomers: 'partners/GetCustomers',
				GetAllCustomers: 'partners/GetAllCustomers',

				GetCustomerSalesInvoices: 'partners/GetCustomerSalesInvoices',
				GetCustomerSalesDeliveries: 'partners/GetCustomerSalesDeliveries',
				GetCustomerSalesPayments: 'partners/GetCustomerSalesPayments',

				InsertCustomer: 'partners/InsertCustomer',
				UpdateCustomer: 'partners/UpdateCustomer'
			}),

			...mapMutations({}),

			SelectedCustomer(data) {
				this.selectedCustomer = data
				this.selected_cust_attachments = data.attachments
			},

			async OpenCustomerDetailsModal(data) {
				this.selectedCustomer = data

				this.isModalShow = true

				await this.GetCustomerSalesInvoices(this.selectedCustomer)
				await this.GetCustomerSalesDeliveries(this.selectedCustomer)
				await this.GetCustomerSalesPayments(this.selectedCustomer)
			},

			CloseModal() {
				this.isModalShow = false
			},

			CreateCustomer() {
				this.isFormCreate = true
				this.$setObjectPropNull(this.form_customer, null)
				this.isModalCustomerFormShow = true
			},

			EditCustomer() {
				this.isFormCreate = false
				this.form_customer = this.$clearReactive(this.selectedCustomer)

				if (this.form_customer.status == 'Active') {
					this.form_customer['bool_status'] = true
				} else {
					this.form_customer['bool_status'] = false
				}
				this.isModalCustomerFormShow = true
			},

			ClearForm() {
				this.$setObjectPropNull(this.form_customer, null)
			},

			async SaveForm() {
				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>Add</b> this customer? This action cannot be undone. Kindly double check the details before confirming.',
					confirmText: 'Confirm Action',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					const res = await this.InsertCustomer(this.form_customer)

					if (res.status === 'ok') {
						this.ClearForm()
						this.isModalCustomerFormShow = false
						this.LoadAsyncData()
					}
				}
			},

			async UpdateForm() {
				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>Update</b> this customer? This action cannot be undone. Kindly double check the details before confirming.',
					confirmText: 'Confirm Action',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					const res = await this.UpdateCustomer(this.form_customer)

					if (res.status === 'ok') {
						this.ClearForm()
						this.isModalCustomerFormShow = false
						this.LoadAsyncData()
					}
				}
			},

			ShowDetailsModal() {
				this.isModalCustomerFormShow = true
			},

			CloseCustomerFormModal() {
				this.isModalCustomerFormShow = false
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

				const customers = await this.GetCustomers(params)

				this.customers = []
				this.customers = customers.data.results
				this.totalDataCount = customers.data.total

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

				this.filters.push({ field: 'name', value: this.filterCustomer, type: 'like' })
				this.filters.push({ field: 'customer_ref', value: this.filterRef, type: 'like' })
				this.filters.push({ field: 'address', value: this.filterAddress, type: 'like' })

				this.LoadAsyncData()
			},

			FilterByName() {
				this.searchDebounce(this)
			},

			FilterByRef() {
				this.searchDebounce(this)
			},

			FilterByAddress() {
				this.searchDebounce(this)
			},

			searchDebounce: debounce((vm) => {
				vm.onFilterData()
			}, 500),

			Print() {
				let cInvoices = this.checked_customerinvoices.map((item) => {
					return item.invoice_no
				})

				this.checked_customerinvoices = []

				// console.log(cInvoices)

				let printFilters = []

				let obj = {
					type: 'Account_Statement_Customer',
					branch_code: this.$store.state.selectedBranch.branch_code,
					filters: printFilters,
					ref_field: 'customer_id',
					ref_no: this.selectedCustomer.customer_id,
					items: cInvoices
				}

				let json = JSON.stringify(obj)

				window.open('/printing/accountstatement?params=' + json, '_blank', 'location=yes,height=768,width=800,scrollbars=yes,status=yes')

				//console.log(cInvoices)
			},

			FilterCustomerInvoices() {
				let filterResults = []

				switch (this.customerInvoicesFilter) {
					case 'all':
						//filter
						filterResults = this.$clearReactive(this.customerSalesInvoices)
						break

					case 'paid':
						//filter
						filterResults = this.customerSalesInvoices.filter((item) => {
							return item.payment_status === 'Paid'
						})
						break

					case 'unpaid':
						//filter
						filterResults = this.customerSalesInvoices.filter((item) => {
							return item.payment_status === 'Unpaid'
						})
						break

					case 'unpaid-partial':
						//filter
						filterResults = this.customerSalesInvoices.filter((item) => {
							return item.payment_status === 'Unpaid' || item.payment_status === 'Partial'
						})
						break
				}

				this.tmpCustomerSalesInvoices = filterResults
			}
		},

		mounted() {
			this.LoadAsyncData()
			//this.GetAllCustomers()
		}
	}
</script>

<style scoped>
	.content-height {
		height: calc(100vh - 68px);
	}
</style>
