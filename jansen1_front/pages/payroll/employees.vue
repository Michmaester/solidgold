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

					<b-table :striped="true" sticky-header height="200" :narrowed="true" :hoverable="true" :loading="loading" paginated backend-pagination :pagination-rounded="true" pagination-size="is-small" :total="totalDataCount" :per-page="pageSize" @page-change="onPageChange" backend-sorting :default-sort-direction="defaultSortOrder" :default-sort="[sortField, sortOrder]" @sort="onSort" sort-icon="arrow-up" sort-icon-size="is-small" :pagination-simple="false" :pagination-position="'top'" :selected.sync="selectedEmployee" @select="SelectedEmployee" :data="employees">

						<template slot="top-left">
							<div class="flex">

								<b-field label="Last Name" custom-class="font-semibold text-xs no-mb-labels" class="w-30 text-xs mr-1">
									<b-input type="primary" size="is-small" v-model="filterLastName" @input="FilterByLastName"></b-input>
								</b-field>

								<b-field label="First Name" custom-class="font-semibold text-xs no-mb-labels" class="w-30 text-xs mr-1">
									<b-input type="primary" size="is-small" v-model="filterFirstName" @input="FilterByFirstName"></b-input>
								</b-field>

							</div>
						</template>

						<b-table-column label="Emp. ID" v-slot="props">
							{{ props.row.emp_id }}
						</b-table-column>

						<b-table-column label="Name" v-slot="props">
							{{ props.row.first_name + ' ' + props.row.middle_name + ' ' + props.row.last_name }}
						</b-table-column>

						<b-table-column label="Status" v-slot="props">
							{{ props.row.status }}
						</b-table-column>

					</b-table>
				</div>

				<div class="flex items-center space-x-1">
					<b-button type="is-primary" size="is-small" icon-left="plus" @click="AddEmployee">Add</b-button>
					<b-button type="is-primary" size="is-small" icon-left="updated" @click="UpdateEmployee">Update</b-button>
				</div>

				<div class="mt-6" v-if="!$isObjEmpty(selectedEmployee)">

					<b-tabs type="is-boxed" size="is-small">

						<b-tab-item label="Basic Info" class="wrapper-h-tab">

							<div class="w-full text-sm p-2 grid grid-cols-8 gap-4">
								<div class="col-span-4">
									<b-field horizontal label="Last Name" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="selEmpDetails.last_name" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="First Name" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="selEmpDetails.first_name" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="Middle Name" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="selEmpDetails.middle_name" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="Address" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="selEmpDetails.address" expanded></b-input>
									</b-field>
									<b-field horizontal label="Civil Status" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="selEmpDetails.civil_status" expanded class="w-48"></b-input>
									</b-field>
									<!-- <b-field horizontal label="Contact No." custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="selectedEmployee.last_name" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="Spouse" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="selectedEmployee.last_name" expanded></b-input>
									</b-field> -->
								</div>
								<!-- <div class="col-span-4">
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
									<b-table :striped="true" sticky-header height="200" :narrowed="true" :hoverable="true" :data="selectedEmployee.empDependents">

										<b-table-column label="Name" v-slot="props">
											{{ props.row.child_name }}
										</b-table-column>

									</b-table>
								</div> -->
							</div>
						</b-tab-item>

						<b-tab-item label="Work Info" class="wrapper-h-tab">

							<div class="w-full text-sm p-2 grid grid-cols-8 gap-4">
								<div class="col-span-4">
									<b-field horizontal label="SSS Number" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="selEmpInfo.sss_no" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="PHIC Number" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="selEmpInfo.philhealth_no" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="HDMF Number" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="selEmpInfo.pagibig_no" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="TIN Number" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="selEmpInfo.tin" expanded class="w-48"></b-input>
									</b-field>
								</div>
								<div class="col-span-4">
									<b-field horizontal label="Daily Rate" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="selEmpInfo.daily_rate" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="Hourly Rate" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="selEmpInfo.hourly_rate" expanded class="w-48"></b-input>
									</b-field>
									<!-- <b-field horizontal label="Date Started" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="selEmpInfo.last_name" expanded class="w-48"></b-input>
									</b-field>
									<b-field horizontal label="Branch Assistant" custom-class="font-semibold text-xs w-24">
										<b-input type="primary" size="is-small" v-model="selEmpInfo.last_name" expanded class="w-48"></b-input>
									</b-field> -->
								</div>
							</div>
						</b-tab-item>

						<!-- <b-tab-item v-if="selEmpLoans != null" label="Loan" class="wrapper-h-tab">
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
									<b-table :striped="true" sticky-header height="200" :narrowed="true" :hoverable="true" :loading="loading" :selected.sync="selectedEmployee" @select="SelectedEmployee" :data="employees">

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
								<b-table :striped="true" sticky-header height="200" :narrowed="true" :hoverable="true" :loading="loading" :selected.sync="selectedEmployee" @select="SelectedEmployee" :data="employees">

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
						</b-tab-item> -->

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
				// allemployees: 'partners/getAllemployees',
			})
		},

		watch: {},

		data() {
			return {
				employees: [],

				selectedEmployee: {},
				selEmpDetails: {
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
					blood_type: null
				},
				selEmpInfo: {
					sss_no: null,
					phic_no: null,
					hdmf_no: null,
					tin_no: null,
					daily_rate: null,
					hourly_rate: null,
					date_started: null,
					branch_assitant: null
				},
				selEmpDependents: [],
				selEmpLoans: [],

				totalDataCount: 0,
				loading: false,
				sortField: 'id',
				sortOrder: 'desc',
				defaultSortOrder: 'desc',
				page: 1,
				pageSize: 10,

				//filters
				filters: [],
				filterLastName: null,
				filterFirstName: null,

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
				},

				selected_tab: 0
			}
		},

		methods: {
			...mapActions({
				//Getemployees: 'partners/Getemployees',
				GetEmployees: 'pms/GetEmployees'
			}),

			...mapMutations({}),

			async TestFetch() {
				await this.GetEmployees()
			},

			SelectedEmployee(data) {
				//console.log(this.selectedEmployee)
				console.log('emplyoyee is seleced')

				console.log(data)

				this.selectedEmployee = data

				if (data.empDetails) {
					this.selEmpDetails = data.empDetails
				} else {
					this.selEmpDetails = {}
				}

				if (data.empInfo) {
					this.selEmpInfo = data.empInfo
				} else {
					this.selEmpInfo = {}
				}

				// this.selEmpInfo = this.selectedEmployee.empInfo
				// this.selEmpDependents = this.selectedEmployee.empDependants
				// this.selEmpLoans = this.selectedEmployee.loans
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

				const employees = await this.GetEmployees(params)

				this.employees = []
				this.employees = employees.data.results
				this.totalDataCount = employees.data.total

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

				this.filters.push({ field: 'last_name', value: this.filterLastName, type: 'like' })
				this.filters.push({ field: 'first_name', value: this.filterFirstName, type: 'like' })
				// this.filters.push({ field: 'customer_ref', value: this.filterRef, type: 'like' })
				// this.filters.push({ field: 'address', value: this.filterAddress, type: 'like' })

				this.LoadAsyncData()
			},

			FilterByLastName() {
				this.searchDebounce(this)
			},

			FilterByFirstName() {
				this.searchDebounce(this)
			},

			searchDebounce: debounce((vm) => {
				vm.onFilterData()
			}, 500),

			AddEmployee() {
				console.log(this.selEmpDetails)
				console.log(this.selEmpInfo)
			},

			UpdateEmployee() {
				console.log(this.selEmpDetails)
				console.log(this.selEmpInfo)
			}
		},

		mounted() {
			this.LoadAsyncData()
			//this.GetAllemployees()
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
