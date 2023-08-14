<template>
	<div>
		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">
			<h3 class="has-text-header">Invoices Stubs</h3>
			<div class="flex items-center">

			</div>
		</div>

		<div class="grid grid-cols-8 gap-4 p-4 has-background-pageheader">
			<div class="col-span-8 wrapper-h bg-white">

				<div class="text-sm p-2">

					<b-table :striped="true" :narrowed="true" :hoverable="true" :loading="loading" paginated backend-pagination :pagination-rounded="true" pagination-size="is-small" :total="totalDataCount" :per-page="pageSize" @page-change="onPageChange" backend-sorting :default-sort-direction="defaultSortOrder" :default-sort="[sortField, sortOrder]" @sort="onSort" sort-icon="arrow-up" sort-icon-size="is-small" :pagination-simple="false" :pagination-position="'top'" :selected.sync="selected_invoice_stub" @select="SelectedInvoiceStub" :data="invoiceStubs">

						<template slot="top-left">
							<div class="flex">

								<client-only placeholder="Loading...">
									<b-field custom-class="font-semibold text-xs no-mb-labels" class="text-xs" style="width:400px;">

										<v-select placeholder="search invoice no" label="invoice_no" :filterable="false" :appendToBody="true" :options="invoiceOptions" @search="onInvoiceSearch" v-model="filterInvoiceNo" :reduce="invoice => invoice.invoice_no" @input="FilterByInvoiceNo">
											<template slot="no-options">
												type INVOICE NO to search..
											</template>
											<template slot="option" slot-scope="option">
												<div class="flex flex-col mb-2 leading-tight">
													<p class="text-sm"><span class="font-bold text-red-500 mr-2">{{ option.invoice_no }}</span> {{ option.transaction_date }}</p>
													<p v-if="option.customer" class="text-xs">{{ option.customer.name }}</p>
												</div>
											</template>
											<template slot="selected-option" slot-scope="option">
												<div class="selected d-center">
													<p>{{ option.invoice_no }}</p>
												</div>
											</template>
										</v-select>
									</b-field>
								</client-only>
								<b-button :disabled="!isNoInvoiceStubs" type="is-primary" icon-left="plus" class="is-small text-white ml-2" @click="CreateInvoiceStub(null )">Create Invoice Stub</b-button>
							</div>
						</template>

						<b-table-column v-slot="props" label="Invoice">
							<p class="font-bold underline cursor-pointer" @click="ShowStubDetails">{{ props.row.invoice_no }}</p>
						</b-table-column>

						<b-table-column v-slot="props" label="Customer">
							{{ props.row.invoice.customer.name }}
						</b-table-column>

						<b-table-column v-slot="props" label="Datetime">
							{{ props.row.generated_datetime }}
						</b-table-column>

						<b-table-column v-slot="props" label="Status">
							{{ props.row.status}}
						</b-table-column>

						<b-table-column v-slot="props" label="Total Qty">
							{{ props.row.total_items_qty }}
						</b-table-column>

						<b-table-column v-slot="props" label="Balance">
							{{ props.row.balance_qty }}
						</b-table-column>

						<b-table-column v-slot="props" label="Remarks">
							{{ props.row.remarks }}
						</b-table-column>

					</b-table>
				</div>
			</div>
		</div>

		<b-modal :active.sync="isModalDetailsShow" has-modal-card trap-focus :width="1000" @close="CloseDetailsModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1000px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-semibold text-white">Invoice Stub Details</p>
					<div>
						<a href="#" @click.prevent="CloseDetailsModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div class="flex flex-col text-sm">

						<div v-if="selected_invoice_stub !== null && selected_invoice_stub.status === 'Completed'" class="bg-green-200 p-2 my-2 flex justify-between items-center">
							<div>
								<p class="font-bold">Invoice No. : <span class="font-normal underline">{{ selected_invoice_stub.invoice_no }}</span></p>
								<p v-if="selected_invoice_stub.invoice.customer" class="font-bold">Customer : <span class="font-normal">{{ selected_invoice_stub.invoice.customer.name }}</span></p>
							</div>
							<p class="text-3xl font-bold w-48">
								<b-icon icon="alert-circle-check-outline" size="is-small"></b-icon> {{ selected_invoice_stub.status }}
							</p>
						</div>

						<div v-if="selected_invoice_stub !== null && selected_invoice_stub.status === 'Partial'" class="bg-yellow-300 p-2 my-2 flex justify-between items-center">
							<div>
								<p class="font-bold">Invoice No. : <span class="font-normal underline">{{ selected_invoice_stub.invoice_no }}</span></p>
								<p v-if="selected_invoice_stub.invoice.customer" class="font-bold">Customer : <span class="font-normal">{{ selected_invoice_stub.invoice.customer.name }}</span></p>
							</div>
							<p class="text-3xl font-bold w-48">
								<b-icon icon="alert-circle-check-outline" size="is-small"></b-icon> {{ selected_invoice_stub.status }}
							</p>
						</div>

						<div class="w-32">
							<b-button v-if="selected_invoice_stub !== null && selected_invoice_stub.status !== 'Completed'" type="is-primary" icon-left="plus" class="is-small text-white" @click="CreateInvoiceStub(selected_invoice_stub)">Add Stub Detail</b-button>
						</div>

					</div>
					<div class="flex mt-4 text-sm">
						<div class="w-full">
							<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :data="selected_invoice_stub_details">

								<b-table-column v-slot="props" label="Control No.">
									<p class="font-bold">{{ props.row.control_no }}</p>
								</b-table-column>

								<b-table-column v-slot="props" label="Date">
									{{ props.row.action_datetime }}
								</b-table-column>

								<b-table-column v-slot="props" label="Qty">
									{{ props.row.qty }}
								</b-table-column>

								<b-table-column v-slot="props" label="Balance">
									{{ props.row.balance }}
								</b-table-column>

								<b-table-column v-slot="props" label="Remarks">
									{{ props.row.remarks }}
								</b-table-column>

							</b-table>
						</div>

					</div>
				</section>
			</div>
		</b-modal>

		<b-modal :active.sync="isModalFormShow" has-modal-card trap-focus :width="1000" @close="CloseFormModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1000px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-semibold text-white">Invoice Stub Form</p>
					<div>
						<a href="#" @click.prevent="CloseFormModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div class="flex">

						<div class="flex flex-col w-1/2">
							<h1 class="font-bold text-lg">Invoice Stub</h1>

							<b-field label="Invoice No." custom-class="font-semibold text-xs no-mb-labels" class="w-48 text-xs mr-1 w-32">
								<b-input disabled type="primary" size="is-small" v-model="form_invoice_stub.invoice_no"></b-input>
							</b-field>

							<div class="w-1/2 flex">
								<b-field label="Total Quantity" custom-class="font-semibold text-xs no-mb-labels" class="w-1/2 text-xs mr-1 w-32">
									<b-input disabled type="primary" size="is-small" v-model="form_invoice_stub.total_items_qty"></b-input>
								</b-field>

								<b-field label="Balance Quantity" custom-class="font-semibold text-xs no-mb-labels" class="w-1/2 text-xs mr-1 w-32">
									<b-input disabled type="primary" size="is-small" v-model="form_invoice_stub.balance_qty"></b-input>
								</b-field>
							</div>
						</div>

						<div class="w-1/2">
							<h1 class="font-bold text-lg">Stub Detail</h1>
							<b-field label="Quantity" custom-class="font-semibold text-xs no-mb-labels" class="w-48 text-xs mr-1 w-32">
								<b-numberinput size='is-small' min="0" :max="form_invoice_stub.balance_qty" controls-position="compact" v-model="form_invoice_stub_detail.qty"></b-numberinput>
								<!-- <b-input type="primary" size="is-small" v-model="form_invoice_stub_detail.qty"></b-input> -->
							</b-field>
							<b-field label="Remarks" custom-class="font-semibold text-xs no-mb-labels" class="w-full text-xs mr-1 w-32">
								<b-input type="primary" size="is-small" v-model="form_invoice_stub_detail.remarks"></b-input>
							</b-field>
						</div>

					</div>
					<div class="flex mt-4 text-sm">
						<div class="w-full">
							<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :data="form_existing_invoice_stub_details">

								<b-table-column v-slot="props" label="Control No.">
									<p class="font-bold">{{ props.row.control_no }}</p>
								</b-table-column>

								<b-table-column v-slot="props" label="Date">
									{{ props.row.action_datetime }}
								</b-table-column>

								<b-table-column v-slot="props" label="Qty">
									{{ props.row.qty }}
								</b-table-column>

								<b-table-column v-slot="props" label="Balance">
									{{ props.row.balance }}
								</b-table-column>

								<b-table-column v-slot="props" label="Remarks">
									{{ props.row.remarks }}
								</b-table-column>

							</b-table>
						</div>

					</div>
				</section>
				<footer class="modal-card-foot px-5 py-3">
					<b-button v-if="isFormCreate" type="is-primary" size="is-small" @click="SubmitInvoiceStub" icon-left="content-save">Submit</b-button>
					<b-button v-if="!isFormCreate" type="is-primary" size="is-small" @click="AddInvoiceStubDetail" icon-left="content-save">Add Details</b-button>
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
			module: 'transactions'
		},

		computed: {
			...mapGetters({})
		},

		data() {
			return {
				invoiceStubs: [],
				totalDataCount: 0,
				loading: false,
				sortField: 'id',
				sortOrder: 'desc',
				defaultSortOrder: 'desc',
				page: 1,
				pageSize: 10,

				filters: [],

				filterInvoiceNo: null,

				selected_invoice_stub: null,
				selected_invoice_stub_details: [],

				isModalDetailsShow: false,
				isModalFormShow: false,

				invoiceOptions: [],
				isNoInvoiceStubs: false,
				isSearchInvoice: false,

				form_invoice_stub: {},
				form_invoice_stub_detail: {},
				form_existing_invoice_stub_details: [],

				isFormCreate: true
			}
		},

		methods: {
			...mapActions({
				GetInvoiceStubs: 'sales/GetInvoiceStubs',
				SearchInvoicesByInvoiceNo: 'sales/SearchInvoicesByInvoiceNo',

				InsertInvoiceStub: 'sales/InsertInvoiceStub',
				InsertInvoiceStubDetails: 'sales/InsertInvoiceStubDetails',

				GetSingleInvoice: 'sales/GetSingleInvoice'
			}),

			...mapMutations({}),

			SelectedInvoiceStub(data) {
				this.selected_invoice_stub = data
				this.selected_invoice_stub_details = data.stub_details
			},

			ShowStubDetails() {
				this.isModalDetailsShow = true
			},

			CloseDetailsModal() {
				this.isModalDetailsShow = false
			},

			async CreateInvoiceStub(data) {
				if (data) {
					//means this is an existing stub that need to be updated/added details
					this.isFormCreate = false

					this.form_invoice_stub.id = data.id
					this.form_invoice_stub.invoice_no = data.invoice_no
					this.form_invoice_stub.total_items_qty = data.total_items_qty
					this.form_invoice_stub.balance_qty = data.balance_qty
					this.form_invoice_stub.remarks = data.remarks

					//add details
					this.form_invoice_stub_detail.qty = data.balance_qty
					this.form_invoice_stub_detail.remarks = null

					//list the existing
					this.form_existing_invoice_stub_details = data.stub_details
				} else {
					this.isFormCreate = true

					//query the selected invoice
					let existing_invoice = await this.GetSingleInvoice({ invoice_no: this.filterInvoiceNo })

					// new
					let total_items_qty = parseInt(this.$calculateTotals(existing_invoice.data.trans_items, 'qty'))

					this.form_invoice_stub.invoice_no = existing_invoice.data.invoice_no
					this.form_invoice_stub.total_items_qty = total_items_qty
					this.form_invoice_stub.balance_qty = total_items_qty
					this.form_invoice_stub.remarks = null

					this.form_invoice_stub_detail.qty = total_items_qty
					this.form_invoice_stub_detail.remarks = null

					this.form_existing_invoice_stub_details = []
				}

				this.isModalFormShow = true
			},

			CloseFormModal() {
				this.isModalFormShow = false
			},

			async SubmitInvoiceStub() {
				//check qty first

				if (parseInt(this.form_invoice_stub_detail.qty) > parseInt(this.form_invoice_stub.balance_qty)) {
					//error
					this.$buefy.dialog.alert({
						title: 'Error',
						message: '<b>Quantity</b> is higher than the remaining balance.',
						confirmText: 'Okay'
					})
				} else {
					const { result, dialog } = await this.$buefy.dialog.confirm({
						message: 'Are you sure you want to <b>Submit</b> this Invoice Stub? This action cannot be undone.',
						confirmText: 'Confirm',
						type: 'is-danger',
						hasIcon: true,
						closeOnConfirm: true
					})

					if (result) {
						const payload = {
							invoice_stub: this.form_invoice_stub,
							invoice_stub_details: this.form_invoice_stub_detail
						}

						const res = await this.InsertInvoiceStub(payload)
						if (res.status === 'ok') {
							this.CloseFormModal()
							this.CloseDetailsModal()
							this.LoadAsyncData()
						}
					}
				}
			},

			async AddInvoiceStubDetail() {
				if (parseInt(this.form_invoice_stub_detail.qty) > parseInt(this.form_invoice_stub.balance_qty)) {
					//error
					this.$buefy.dialog.alert({
						title: 'Error',
						message: '<b>Quantity</b> is higher than the remaining balance.',
						confirmText: 'Okay'
					})
				} else {
					const { result, dialog } = await this.$buefy.dialog.confirm({
						message: 'Are you sure you want to <b>Add</b> this Invoice Stub Detail? This action cannot be undone.',
						confirmText: 'Confirm',
						type: 'is-danger',
						hasIcon: true,
						closeOnConfirm: true
					})

					if (result) {
						const payload = {
							invoice_stub: this.form_invoice_stub,
							invoice_stub_details: this.form_invoice_stub_detail
						}

						const res = await this.InsertInvoiceStubDetails(payload)
						if (res.status === 'ok') {
							this.CloseFormModal()
							this.CloseDetailsModal()
							this.LoadAsyncData()
						}
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

				const invoicestubs = await this.GetInvoiceStubs(params)

				this.invoiceStubs = []
				this.invoiceStubs = invoicestubs.data.results
				this.totalDataCount = invoicestubs.data.total

				this.loading = false

				if (this.isSearchInvoice) {
					//check wether the filtered_invoice has result
					//if no the enabled the create button
					//if have then do nothing

					if (this.filterInvoiceNo && this.invoiceStubs.length > 0) {
						//do nothing
						this.isNoInvoiceStubs = false
					} else if (this.filterInvoiceNo && this.invoiceStubs.length <= 0) {
						//display button
						this.isNoInvoiceStubs = true
					} else {
						//do not display button
						this.isNoInvoiceStubs = false
					}
					this.isSearchInvoice = false
				}
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

				this.filters.push({ field: 'invoice_no', value: this.filterInvoiceNo, type: '=' })

				this.LoadAsyncData()
			},

			onInvoiceSearch(searchterm, loading) {
				if (searchterm.length) {
					loading(true)
					this.searchInvoice(loading, searchterm, this)
				}
			},
			searchInvoice: debounce(async (loading, searchterm, vm) => {
				vm.invoiceOptions = await vm.SearchInvoicesByInvoiceNo({ searchterm: searchterm })
				loading(false)
			}, 500),

			FilterByInvoiceNo(data) {
				this.filterInvoiceNo = data

				this.isSearchInvoice = true
				this.onFilterData()
			}
		},

		mounted() {
			this.LoadAsyncData()
		}
	}
</script>

<style scoped>
	.wrapper-h {
		height: calc(100vh - 125px);
	}
</style>
