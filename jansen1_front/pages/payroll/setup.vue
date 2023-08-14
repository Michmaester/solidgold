<template>
	<div>

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">

			<h3 class="has-text-header">Employees</h3>

			<div class="flex items-center">

			</div>

		</div>

		<div class="grid grid-cols-8 gap-4 p-4 has-background-pageheader">

			<div class="col-span-8 wrapper-h bg-white">

				<div class="text-sm p-2">

					<div class="flex">

						<b-field label="Last Name" custom-class="font-semibold text-xs no-mb-labels" class="w-64 text-xs mr-1">
							<b-input type="primary" size="is-small" v-model="filterCustomer" @input="FilterByName"></b-input>
						</b-field>

						<b-field label="First Name" custom-class="font-semibold text-xs no-mb-labels" class="w-64 text-xs mr-1">
							<b-input type="primary" size="is-small" v-model="filterAddress" @input="FilterByAddress"></b-input>
						</b-field>

					</div>

					<b-table :striped="true" sticky-header height="200" :narrowed="true" :hoverable="true" :loading="loading" :selected.sync="selectedCustomer" @select="SelectedCustomer" :data="customers">

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

					</b-table>
				</div>

				<div class="mt-6">
					<b-tabs type="is-boxed" size="is-small" v-model="selected_tab">

						<b-tab-item label="Basic Info" class="wrapper-h-tab">
							<div class="w-full text-sm p-2 grid grid-cols-8 gap-4">
								<div class="col-span-4">
									<b-field horizontal label="Last Name" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="First Name" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="Middle Name" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="Address" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded></b-input>
									</b-field>
									<b-field horizontal label="Civil Status" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="Contact No." custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="Spouse" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded></b-input>
									</b-field>
								</div>
								<div class="col-span-4">
									<b-field horizontal label="Educational Attainment" custom-class="font-semibold text-xs w-48">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded></b-input>
									</b-field>
									<b-field horizontal label="Emergency Contact Person" custom-class="font-semibold text-xs w-48">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded></b-input>
									</b-field>
									<b-field horizontal label="Blood Type" custom-class="font-semibold text-xs w-48">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded></b-input>
									</b-field>

									<p>Childrens</p>
									<b-table :striped="true" sticky-header height="200" :narrowed="true" :hoverable="true" :loading="loading" :selected.sync="selectedCustomer" @select="SelectedCustomer" :data="customers">

										<b-table-column label="Name" v-slot="props">
											{{ props.row.customer_id }}
										</b-table-column>

										<b-table-column label="Aged" v-slot="props">
											{{ props.row.customer_ref }}
										</b-table-column>

									</b-table>
								</div>
							</div>
						</b-tab-item>

						<b-tab-item label="Work Info" class="wrapper-h-tab">
							<div class="w-full text-sm p-2 grid grid-cols-8 gap-4">
								<div class="col-span-4">
									<b-field horizontal label="SSS Number" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="PHIC Number" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="HDMF Number" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="TIN Number" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded class="w-48"></b-input>
									</b-field>
								</div>
								<div class="col-span-4">
									<b-field horizontal label="Daily Rate" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="Hourly Rate" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="Date Started" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="Branch Assistant" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded class="w-48"></b-input>
									</b-field>
								</div>
							</div>
						</b-tab-item>

						<b-tab-item label="Loan" class="wrapper-h-tab">
							<div class="w-full text-sm p-2 grid grid-cols-8 gap-4">
								<div class="col-span-4">
									<b-field horizontal label="Loan Type" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="Loan Amount" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded class="w-48"></b-input>
									</b-field>

									<b-field horizontal label="Total Loans" custom-class="font-semibold text-xs w-24" class="mt-6">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="Total Payment" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="Balance" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="employee.last_name" expanded class="w-48"></b-input>
									</b-field>

								</div>
								<div class="col-span-4">

									<p>Loans</p>
									<b-table :striped="true" sticky-header height="200" :narrowed="true" :hoverable="true" :loading="loading" :selected.sync="selectedCustomer" @select="SelectedCustomer" :data="customers">

										<b-table-column label="Name" v-slot="props">
											{{ props.row.customer_id }}
										</b-table-column>

										<b-table-column label="Aged" v-slot="props">
											{{ props.row.customer_ref }}
										</b-table-column>

									</b-table>
								</div>
							</div>
						</b-tab-item>

						<b-tab-item label="13th Month" class="wrapper-h-tab">
							<div class="w-full text-sm p-2">
								<b-table :striped="true" sticky-header height="200" :narrowed="true" :hoverable="true" :loading="loading" :selected.sync="selectedCustomer" @select="SelectedCustomer" :data="customers">

									<b-table-column label="Employee Name" v-slot="props">
										{{ props.row.customer_id }}
									</b-table-column>

									<b-table-column label="Jan" v-slot="props">
										{{ props.row.customer_ref }}
									</b-table-column>

									<b-table-column label="Feb" v-slot="props">
										{{ props.row.customer_ref }}
									</b-table-column>

									<b-table-column label="Mar" v-slot="props">
										{{ props.row.customer_ref }}
									</b-table-column>

									<b-table-column label="Apr" v-slot="props">
										{{ props.row.customer_ref }}
									</b-table-column>

									<b-table-column label="May" v-slot="props">
										{{ props.row.customer_ref }}
									</b-table-column>

									<b-table-column label="Jun" v-slot="props">
										{{ props.row.customer_ref }}
									</b-table-column>

									<b-table-column label="Jul" v-slot="props">
										{{ props.row.customer_ref }}
									</b-table-column>

									<b-table-column label="Aug" v-slot="props">
										{{ props.row.customer_ref }}
									</b-table-column>

									<b-table-column label="Sep" v-slot="props">
										{{ props.row.customer_ref }}
									</b-table-column>

									<b-table-column label="Oct" v-slot="props">
										{{ props.row.customer_ref }}
									</b-table-column>

									<b-table-column label="Nov" v-slot="props">
										{{ props.row.customer_ref }}
									</b-table-column>

									<b-table-column label="Dec" v-slot="props">
										{{ props.row.customer_ref }}
									</b-table-column>

								</b-table>
							</div>
						</b-tab-item>

					</b-tabs>
				</div>

			</div>

		</div>

	</div>
</template>

<script>
	import { mapMutations, mapGetters, mapActions } from 'vuex'
	import { debounce } from 'lodash'

	export default {
		name: 'EmployeesPage',

		components: {},
		meta: {
			module: 'payroll'
		},

		computed: {
			...mapGetters({
				// allCustomers: 'partners/getAllCustomers',
			})
		},

		watch: {},

		data() {
			return {
				employee: {
					// basic info

					last_name: null,
					first_name: null,
					middle_name: null,
					address: null,
					civil_status: null,
					contact_number: null,
					spouse: null,
					childrens: [],
					educational_attainment: null,
					contact_person_incase_emergency: null,
					blood_type: null,

					//work info

					sss_no: null,
					phic_no: null,
					hdmf_no: null,
					tin_no: null,
					daily_rate: null,
					hourly_rate: null,
					date_started: null,
					branch_assitant: null,

					//loans

					type_of_loan: null,
					loan_amount: null,
					total_loans: null,
					total_payment: null,
					balance: null,
					loans: [],

					// 13th month
					thirteenth_month: {
						jan: null,
						feb: null,
						mar: null,
						apr: null,
						may: null,
						jun: null,
						jul: null,
						aug: null,
						sep: null,
						oct: null,
						nov: null,
						dec: null,
						total_pay: null
					}
				}

				// tbl_customers_columns: [
				// 	{ field: 'name', label: 'Branch Code', width: '150', sortable: true },
				// 	{ field: 'contact_person', label: 'Company Name', width: '150', sortable: true },
				// 	{ field: 'address', label: 'Address', width: '40' },
				// 	{ field: 'mobile1', label: 'Mobile1', width: '40' },
				// 	{ field: 'landline', label: 'Landline', width: '40' },
				// 	{ field: 'email', label: 'Email', width: '40' },
				// 	{ field: 'status', label: 'Status', width: '40' }
				// ],
				// customers: [],
				// totalDataCount: 0,
				// loading: false,
				// sortField: 'id',
				// sortOrder: 'desc',
				// defaultSortOrder: 'desc',
				// page: 1,
				// pageSize: 15,
				// filters: [],
				// filterCustomer: null,
				// filterRef: null,
				// filterAddress: null,
				// selectedCustomer: {},
				// selected_cust_attachments: [],
				// tmp_customers: [],
				// form_customer: {
				// 	id: null,
				// 	customer_ref: null,
				// 	name: null,
				// 	contact_person: null,
				// 	address: null,
				// 	ship_to_address: null,
				// 	bill_to_address: null,
				// 	mobile1: null,
				// 	mobile2: null,
				// 	landline: null,
				// 	email: null,
				// 	tin_number: null,
				// 	sales_type: null,
				// 	payment_terms: null,
				// 	notes: null,
				// 	status: null,
				// 	bool_status: false
				// },
				// isFormCreate: false,
				// isModalShow: false,
				// isFormSidebarShow: false,
				// isModalCustomerFormShow: false,
				// checked_customerinvoices: [],
				// customerInvoicesFilter: 'all',
				// tmpCustomerSalesInvoices: []
			}
		},

		methods: {
			...mapActions({
				//GetCustomers: 'partners/GetCustomers',
			}),

			...mapMutations({})

			// async LoadAsyncData() {
			// 	const params = {
			// 		sort_by: this.sortField,
			// 		sort_order: this.sortOrder,
			// 		page: this.page,
			// 		pageSize: this.pageSize,
			// 		filters: this.filters || []
			// 	}

			// 	this.loading = true

			// 	const customers = await this.GetCustomers(params)

			// 	this.customers = []
			// 	this.customers = customers.data.results
			// 	this.totalDataCount = customers.data.total

			// 	this.loading = false
			// },

			// onPageChange(page) {
			// 	this.page = page
			// 	this.LoadAsyncData()
			// },

			// onSort(field, order) {
			// 	this.sortField = field
			// 	this.sortOrder = order
			// 	this.LoadAsyncData()
			// },

			// onFilterData() {
			// 	this.filters = []

			// 	this.filters.push({ field: 'name', value: this.filterCustomer, type: 'like' })
			// 	this.filters.push({ field: 'customer_ref', value: this.filterRef, type: 'like' })
			// 	this.filters.push({ field: 'address', value: this.filterAddress, type: 'like' })

			// 	this.LoadAsyncData()
			// },

			// FilterByName() {
			// 	this.searchDebounce(this)
			// },

			// FilterByRef() {
			// 	this.searchDebounce(this)
			// },

			// FilterByAddress() {
			// 	this.searchDebounce(this)
			// },

			// searchDebounce: debounce((vm) => {
			// 	vm.onFilterData()
			// }, 500),

			// Print() {
			// 	let cInvoices = this.checked_customerinvoices.map((item) => {
			// 		return item.invoice_no
			// 	})

			// 	this.checked_customerinvoices = []

			// 	console.log(cInvoices)

			// 	let printFilters = []

			// 	let obj = {
			// 		type: 'Account_Statement_Customer',
			// 		branch_code: this.$store.state.selectedBranch.branch_code,
			// 		filters: printFilters,
			// 		ref_field: 'customer_id',
			// 		ref_no: this.selectedCustomer.customer_id,
			// 		items: cInvoices
			// 	}

			// 	let json = JSON.stringify(obj)

			// 	window.open('/printing/accountstatement?params=' + json, '_blank', 'location=yes,height=768,width=800,scrollbars=yes,status=yes')

			// 	//console.log(cInvoices)
			// },
		},

		mounted() {
			//this.LoadAsyncData()
			//this.GetAllCustomers()
		}
	}
</script>

<style scoped>
	.content-height {
		height: calc(100vh - 68px);
	}

	.wrapper-h-tab {
		height: calc(100vh - 270px);
	}
</style>
