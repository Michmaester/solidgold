<template>
	<div>

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">

			<h3 class="has-text-header">Partners - Suppliers</h3>
			<!-- <div class="flex items-center">
				<b-button type="is-primary" icon-left="plus" class="is-small text-white" @click="CreateSupplier">New</b-button>
				<b-button type="is-primary" icon-left="playlist-edit" class="is-small ml-1" @click="EditSupplier">Edit</b-button>
				<b-button :disabled="selectedSupplier.id == null" type="is-info" icon-left="eye-settings-outline" class="is-small ml-1" @click="OpenSupplierDetailsModal">View Information</b-button>
			</div> -->

			<div class="flex items-center">

				<b-dropdown aria-role="list" position="is-bottom-left">
					<b-button class="button is-primary" size="is-small" slot="trigger" slot-scope="{ active }">
						<span>Actions</span>
						<b-icon size="is-small" :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
					</b-button>

					<b-dropdown-item aria-role="listitem" @click="CreateSupplier" class="flex items-center">
						<b-icon icon="plus" size="is-small" class="mr-2"></b-icon>
						<span>New Supplier</span>
					</b-dropdown-item>
					<b-dropdown-item aria-role="listitem" :disabled="selectedSupplier.id == null" @click="EditSupplier" class="flex items-center">
						<b-icon icon="playlist-edit" size="is-small" class="mr-2"></b-icon>
						<span>Edit Supplier</span>
					</b-dropdown-item>
					<hr class="dropdown-divider">
					<b-dropdown-item aria-role="listitem" :disabled="selectedSupplier.id == null" @click="OpenSupplierDetailsModal" class="flex items-center">
						<b-icon icon="eye-settings-outline" size="is-small" class="mr-2"></b-icon>
						<span>View Information</span>
					</b-dropdown-item>
				</b-dropdown>

			</div>

		</div>

		<div class="p-4">

			<div class="w-full text-sm">
				<b-table :striped="true" :narrowed="true" :hoverable="true" :loading="loading" paginated backend-pagination :pagination-rounded="true" pagination-size="is-small" :total="totalDataCount" :per-page="pageSize" @page-change="onPageChange" backend-sorting :default-sort-direction="defaultSortOrder" :default-sort="[sortField, sortOrder]" @sort="onSort" sort-icon="arrow-up" sort-icon-size="is-small" :pagination-simple="false" :pagination-position="'top'" :selected.sync="selectedSupplier" @select="SelectedSupplier" :data="tmp_suppliers">

					<b-table-column label="Code" field="supplier_id" v-slot="props" sortable>
						{{ props.row.supplier_id }}
					</b-table-column>

					<b-table-column label="Supplier" field="name" v-slot="props" sortable>
						<p class="cursor-pointer underline font-bold hover:text-blue-500" @click="OpenSupplierDetailsModal(props.row)">{{ props.row.name }}</p>
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
							<!-- <client-only placeholder="Loading...">

								<b-field label="Search Supplier" custom-class="font-semibold text-xs no-mb-labels" class="w-64 text-xs mr-1">
									<v-select :options="allSuppliers" label="name" v-model="filterSupplier" :reduce="supplier => supplier.supplier_id" />
								</b-field>

							</client-only> -->

							<b-field label="Supplier Name" custom-class="font-semibold text-xs no-mb-labels" class="w-64 text-xs mr-1">
								<b-input type="primary" size="is-small" v-model="filterSupplier" @input="FilterBySupplier"></b-input>
							</b-field>

							<b-field label="Address" custom-class="font-semibold text-xs no-mb-labels" class="w-64 text-xs mr-1">
								<b-input type="primary" size="is-small" v-model="filterAddress" @input="FilterByAddress"></b-input>
							</b-field>

						</div>
					</template>

				</b-table>
			</div>

		</div>

		<b-modal :active.sync="isModalShow" has-modal-card full-screen :can-cancel="['escape']" custom-class="full-modal">

			<div class="modal-card-head flex items-center justify-between has-background-primary p-5">
				<div class="leading-tight">
					<p class="text-base font-bold uppercase">{{ selectedSupplier.name }}</p>
					<p class="text-xs">{{ selectedSupplier.address }}</p>
				</div>

				<div class="flex">
					<b-button type="is-primary" icon-left="printer" class="is-small px-4 mr-1" @click="Print">Print Statement</b-button>
					<b-button class="button is-light mr-2" size="is-small" @click="EditSupplier">Edit Supplier</b-button>
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
								<span>{{ selectedSupplier.contact_person || 'N/A' }}</span>
							</div>

							<div class="leading-tight mb-4">
								<p class="font-bold uppercase text-gray-700">Contact Nos.</p>
								<div class="flex flex-col">
									<span>{{ selectedSupplier.mobile1 }}</span>
									<span>{{ selectedSupplier.mobile2 }}</span>
									<span>{{ selectedSupplier.landline }}</span>
								</div>
							</div>

							<div class="leading-tight mb-4">
								<p class="font-bold uppercase text-gray-700">Ship to Address</p>
								<span>{{ selectedSupplier.ship_to_address || 'N/A' }}</span>
							</div>

							<div class="leading-tight mb-4">
								<p class="font-bold uppercase text-gray-700">Billing to Address</p>
								<span>{{ selectedSupplier.bill_to_address || 'N/A' }}</span>
							</div>

							<div class="leading-tight mb-4">
								<p class="font-bold uppercase text-gray-700">Status</p>
								<span>{{ selectedSupplier.status }}</span>
							</div>

							<div class="leading-tight mb-4">
								<p class="font-bold uppercase text-gray-700">Notes</p>
								<span>{{ selectedSupplier.notes || 'N/A' }}</span>
							</div>

						</div>

						<div class="w-1/2">

							<div class="leading-tight mb-4">
								<p class="font-bold uppercase text-gray-700">Email</p>
								<span>{{ selectedSupplier.email || 'N/A' }}</span>
							</div>

							<div class="leading-tight mb-4">
								<p class="font-bold uppercase text-gray-700">Tax Identification No.</p>
								<span>{{ selectedSupplier.tin_number || 'N/A' }}</span>
							</div>

							<div class="leading-tight mb-4">
								<p class="font-bold uppercase text-gray-700">Payment Terms</p>
								<span>{{ selectedSupplier.payment_terms || 'N/A' }}</span>
							</div>

							<div class="leading-tight mb-4">
								<p class="font-bold uppercase text-gray-700">Sales Type</p>
								<span>{{ selectedSupplier.sales_type || 'N/A' }}</span>
							</div>

						</div>

					</div>

					<div class="p-4 has-background-pageheader w-1/2 content-height">

						<b-tabs type="is-boxed">

							<b-tab-item label="Orders">

								<!-- Sales Invoices of the selected customer -->
								<div class="w-full text-sm p-2">
									<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="20" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :checked-rows.sync="checked_supplierpos" checkable :checkbox-position="'right'" :data="tmpSupplierPurchaseOrders">

										<template slot="top-left">
											<div class="flex">

												<b-field label="Filter" custom-class="font-semibold text-xs no-mb-labels" class="w-64 text-xs mr-1">
													<b-select type="primary" size="is-small" v-model="supplierPurchaseOrdersFilter" @input="FilterSupplierPurchaseOrders">
														<option value="all">All</option>
														<option value="paid">Paid</option>
														<option value="unpaid">Unpaid</option>
														<option value="unpaid-partial">Unpaid/Partial</option>
													</b-select>
												</b-field>

											</div>
										</template>

										<b-table-column label="PO Number" v-slot="props">
											{{ props.row.po_number }}
										</b-table-column>
										<b-table-column label="Date" v-slot="props">
											{{ props.row.dateCreated }}
										</b-table-column>
										<b-table-column label="Total Amount" v-slot="props">
											{{ props.row.total_amount }}
										</b-table-column>
										<b-table-column label="Status" v-slot="props">
											{{ props.row.status }}
										</b-table-column>
										<b-table-column label="Payment Status" v-slot="props">
											{{ props.row.payment_status }}
										</b-table-column>

									</b-table>
								</div>
							</b-tab-item>

							<b-tab-item label="Received Items">

								<!-- Sales Deliveries for the selected customer -->
								<div class="w-full text-sm p-2">
									<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="20" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :data="supplierPurchaseReceives">

										<b-table-column label="PO Number" v-slot="props">
											{{ props.row.po_number }}
										</b-table-column>
										<b-table-column label="Date" v-slot="props">
											{{ props.row.dateCreated }}
										</b-table-column>

										<b-table-column label="Total Amount" v-slot="props">
											{{ props.row.total_amount }}
										</b-table-column>

										<b-table-column label="Total Receive Amount" v-slot="props">
											{{ props.row.receive_total_amount }}
										</b-table-column>

										<b-table-column label="Status" v-slot="props">
											{{ props.row.status }}
										</b-table-column>

									</b-table>
								</div>
							</b-tab-item>

							<b-tab-item label="Payments">

								<!-- Sales Payments of the selected customer -->
								<div class="w-full text-sm p-2">
									<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="20" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :data="supplierPurchasePayments">

										<b-table-column label="PO Number" v-slot="props">
											{{ props.row.po_number }}
										</b-table-column>

										<b-table-column label="Date" v-slot="props">
											{{ props.row.dateCreated }}
										</b-table-column>

										<b-table-column label="Status" v-slot="props">
											{{ props.row.status }}
										</b-table-column>

										<b-table-column label="Payment Status" v-slot="props">
											{{ props.row.payment_status }}
										</b-table-column>

									</b-table>
								</div>
							</b-tab-item>

							<!-- Atachments of the selected customer -->
							<b-tab-item label="Attachments">
								<div class="w-full text-sm p-2">
									<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="20" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :data="selected_supp_attachments">

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

		<b-modal :active.sync="isModalSupplierFormShow" has-modal-card trap-focus :width="1100" @close="CloseSupplierFormModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1100px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-semibold text-white">Supplier Form</p>
					<div>
						<a href="#" @click.prevent="CloseSupplierFormModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div>

						<b-field label="Supplier Name" custom-class="text-xs">
							<b-input size='is-small' type="text" v-model="form_supplier.name"></b-input>
						</b-field>

						<div>

							<b-field label="Address" custom-class="text-xs">
								<b-input size='is-small' type="text" v-model="form_supplier.address"></b-input>
							</b-field>

							<b-field label="ShipTo" custom-class="text-xs">
								<b-input size='is-small' type="text" v-model="form_supplier.ship_to_address"></b-input>
							</b-field>

							<b-field label="BillTo" custom-class="text-xs">
								<b-input size='is-small' type="text" v-model="form_supplier.bill_to_address"></b-input>
							</b-field>

						</div>

					</div>

					<div class="flex">

						<b-field label="Contact Person" custom-class="text-xs">
							<b-input size='is-small' type="text" v-model="form_supplier.contact_person"></b-input>
						</b-field>

						<b-field label="Mobile 1" custom-class="text-xs" class="mr-4">
							<b-input size='is-small' type="text" v-model="form_supplier.mobile1"></b-input>
						</b-field>

						<b-field label="Mobile 2" custom-class="text-xs" class="mr-4">
							<b-input size='is-small' type="text" v-model="form_supplier.mobile2"></b-input>
						</b-field>

						<b-field label="Landline" custom-class="text-xs">
							<b-input size='is-small' type="text" v-model="form_supplier.landline"></b-input>
						</b-field>

					</div>

					<div class="flex">

						<b-field label="Email" custom-class="text-xs">
							<b-input size='is-small' type="text" class="w-64" v-model="form_supplier.email"></b-input>
						</b-field>

						<b-field label="Tax ID" custom-class="text-xs">
							<b-input size='is-small' type="text" class="w-64" v-model="form_supplier.tin_number"></b-input>
						</b-field>

						<b-field label="Payment Terms" custom-class="text-xs">
							<b-input size='is-small' type="text" class="w-64" v-model="form_supplier.payment_terms"></b-input>
						</b-field>

						<b-field label="Sales Type" custom-class="text-xs">
							<b-input size='is-small' type="text" class="w-64" v-model="form_supplier.sales_type"></b-input>
							<!-- <b-select size='is-small' placeholder="Select a salestype" required v-model="form_customer.sales_type">
								<option value="retail">Retail</option>
								<option value="wholesale">Wholesale</option>
							</b-select> -->
						</b-field>

					</div>

					<div class="flex">

						<b-field label="Status" custom-class="text-xs">
							<b-checkbox size="is-small" v-model="form_supplier.bool_status">Active Supplier</b-checkbox>
						</b-field>

						<b-field label="Note" custom-class="text-xs">
							<b-input size='is-small' type="text" class="w-64" v-model="form_supplier.notes"></b-input>
						</b-field>

					</div>

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
		name: 'SuppliersPage',

		components: {},
		meta: {
			module: 'suppliers'
		},

		computed: {
			...mapGetters({
				allSuppliers: 'partners/getAllSuppliers',
				supplierPurchaseOrders: 'partners/getSupplierPurchaseOrders',
				supplierPurchaseReceives: 'partners/getSupplierPurchaseReceives',
				supplierPurchasePayments: 'partners/getSupplierPurchasePayments'
			})
		},

		watch: {
			suppliers(newValue) {
				this.tmp_suppliers = newValue
			},

			supplierPurchaseOrders(newValue, oldValue) {
				this.tmpSupplierPurchaseOrders = this.$clearReactive(newValue)
			}
		},

		data() {
			return {
				tbl_suppliers_columns: [
					{ field: 'name', label: 'Branch Code', width: '150', sortable: true },
					{ field: 'contact_person', label: 'Company Name', width: '150', sortable: true },
					{ field: 'address', label: 'Address', width: '40' },
					{ field: 'mobile1', label: 'Mobile1', width: '40' },
					{ field: 'mobile2', label: 'Mobile2', width: '40' },
					{ field: 'landline', label: 'Landline', width: '40' },
					{ field: 'email', label: 'Email', width: '40' },
					{ field: 'fax', label: 'Fax', width: '40' },
					{ field: 'status', label: 'Status', width: '40' }
				],

				suppliers: [],
				totalDataCount: 0,
				loading: false,
				sortField: 'id',
				sortOrder: 'desc',
				defaultSortOrder: 'desc',
				page: 1,
				pageSize: 15,

				filters: [],
				filterSupplier: null,
				filterAddress: null,

				tmp_suppliers: [],

				selectedSupplier: {},
				selected_supp_attachments: [],

				filter: {
					supplier: null
				},

				form_supplier: {
					id: null,
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
				isModalSupplierFormShow: false,

				checked_supplierpos: [],
				supplierPurchaseOrdersFilter: 'all',

				tmpSupplierPurchaseOrders: []
			}
		},

		methods: {
			...mapActions({
				GetSuppliers: 'partners/GetSuppliers',
				GetAllSuppliers: 'partners/GetAllSuppliers',

				GetSupplierPurchaseOrders: 'partners/GetSupplierPurchaseOrders',
				GetSupplierPurchaseReceives: 'partners/GetSupplierPurchaseReceives',
				GetSupplierPurchasePayments: 'partners/GetSupplierPurchasePayments',

				InsertSupplier: 'partners/InsertSupplier',
				UpdateSupplier: 'partners/UpdateSupplier'
			}),

			...mapMutations({}),

			SelectedSupplier(data) {
				this.selectedSupplier = data
				this.selected_supp_attachments = data.attachments
			},

			SelectedFilterSupplier(data) {
				if (data) {
					this.tmp_suppliers = this.suppliers.filter((item) => {
						return item.supplier_id == data.supplier_id
					})
				} else {
					this.tmp_suppliers = this.suppliers
				}
			},

			async OpenSupplierDetailsModal(data) {
				this.selectedSupplier = data
				//get the selected supplier first
				this.isModalShow = true

				//console.log(this.selectedSupplier)

				await this.GetSupplierPurchaseOrders(this.selectedSupplier)
				await this.GetSupplierPurchaseReceives(this.selectedSupplier)
				await this.GetSupplierPurchasePayments(this.selectedSupplier)
			},

			CloseModal() {
				this.isModalShow = false
			},

			CreateSupplier() {
				this.isFormCreate = true
				this.$setObjectPropNull(this.form_supplier, null)
				this.isModalSupplierFormShow = true
			},

			EditSupplier() {
				this.isFormCreate = false
				this.form_supplier = this.$clearReactive(this.selectedSupplier)

				if (this.form_supplier.status == 'Active') {
					this.form_supplier['bool_status'] = true
				} else {
					this.form_supplier['bool_status'] = false
				}
				this.isModalSupplierFormShow = true
			},

			ClearForm() {
				this.$setObjectPropNull(this.form_supplier, null)
			},

			ShowSupplierFormModal() {
				this.isModalSupplierFormShow = true
			},

			CloseSupplierFormModal() {
				this.isModalSupplierFormShow = false
			},

			async SaveForm() {
				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>Add</b> this supplier? This action cannot be undone. Kindly double check the details before confirming.',
					confirmText: 'Confirm Action',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					const res = await this.InsertSupplier(this.form_supplier)

					if (res.status === 'ok') {
						this.ClearForm()
						this.isModalSupplierFormShow = false
						this.LoadAsyncData()
					}
				}
			},

			async UpdateForm() {
				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>Update</b> this supplier? This action cannot be undone. Kindly double check the details before confirming.',
					confirmText: 'Confirm Action',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					const res = await this.UpdateSupplier(this.form_supplier)

					if (res.status === 'ok') {
						this.ClearForm()
						this.isModalSupplierFormShow = false
						this.LoadAsyncData()
					}
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

				const suppliers = await this.GetSuppliers(params)

				this.suppliers = []
				this.suppliers = suppliers.data.results
				this.totalDataCount = suppliers.data.total

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
				this.filters.push({ field: 'name', value: this.filterSupplier, type: 'like' })
				this.filters.push({ field: 'address', value: this.filterAddress, type: 'like' })

				this.LoadAsyncData()
			},

			FilterBySupplier() {
				this.searchDebounce(this)
			},

			FilterByAddress() {
				this.searchDebounce(this)
			},

			searchDebounce: debounce((vm) => {
				vm.onFilterData()
			}, 500),

			FilterSupplierPurchaseOrders() {
				let filterResults = []

				switch (this.supplierPurchaseOrdersFilter) {
					case 'all':
						//filter
						filterResults = this.$clearReactive(this.supplierPurchaseOrders)
						break

					case 'paid':
						//filter
						filterResults = this.supplierPurchaseOrders.filter((item) => {
							return item.payment_status === 'Paid'
						})
						break

					case 'unpaid':
						//filter
						filterResults = this.supplierPurchaseOrders.filter((item) => {
							return item.payment_status === 'Unpaid'
						})
						break

					case 'unpaid-partial':
						//filter
						filterResults = this.supplierPurchaseOrders.filter((item) => {
							return item.payment_status === 'Unpaid' || item.payment_status === 'Partial'
						})
						break
				}

				this.tmpSupplierPurchaseOrders = filterResults
			},

			Print() {
				let sPurchaseOrders = this.checked_supplierpos.map((item) => {
					return item.po_number
				})

				this.checked_supplierpos = []

				//console.log(sPurchaseOrders)

				let printFilters = []

				let obj = {
					type: 'Account_Statement_Supplier',
					branch_code: this.$store.state.selectedBranch.branch_code,
					filters: printFilters,
					ref_field: 'supplier_id',
					ref_no: this.selectedSupplier.supplier_id,
					items: sPurchaseOrders
				}

				//console.log(obj)

				let json = JSON.stringify(obj)

				window.open('/printing/accountstatement_supplier?params=' + json, '_blank', 'location=yes,height=768,width=800,scrollbars=yes,status=yes')

				//console.log(cInvoices)
			}
		},

		mounted() {
			this.LoadAsyncData()
			this.GetAllSuppliers()
		}
	}
</script>

<style scoped>
</style>
