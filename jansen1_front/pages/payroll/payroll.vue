<template>
	<div>

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">

			<h3 class="has-text-header">Payroll</h3>

			<div class="flex items-center">
				<b-button type="is-primary" size="is-small">Generate Payroll</b-button>
			</div>

		</div>

		<div class="grid grid-cols-8 gap-4 p-4 has-background-pageheader">

			<div class="col-span-8 wrapper-h bg-white">

				<div class="text-sm p-2">

					<div class="flex">

						<!-- <b-field label="Cut-off Period" custom-class="font-semibold text-xs no-mb-labels" class="w-40 text-xs mr-1">
							<b-datepicker placeholder="Select Cut-off Period" type="primary" size="is-small" v-model="filterCutoffPeriod" @input="FilterByCutoffPeriod" range>
							</b-datepicker>
						</b-field> -->

						<!-- <b-field label="Cut-off Date Start" custom-class="font-semibold text-xs no-mb-labels" class="w-30 text-xs mr-1">
							<b-input type="primary" size="is-small" v-model="filterCutoffDateStart" @input="FilterByCutoffStart"></b-input>
						</b-field>

						<b-field label="Cut-off Date End" custom-class="font-semibold text-xs no-mb-labels" class="w-30 text-xs mr-1">
							<b-input type="primary" size="is-small" v-model="filterCutoffDateEnd" @input="FilterByCutoffEnd"></b-input>
						</b-field> -->

						<b-field label="Lastname" custom-class="font-semibold text-xs no-mb-labels" class="w-30 text-xs mr-1 ml-2">
							<b-input type="primary" size="is-small" v-model="filterEmpLastName" @input="FilterByLastName"></b-input>
						</b-field>

						<b-field label="Firstname" custom-class="font-semibold text-xs no-mb-labels" class="w-30 text-xs mr-1">
							<b-input type="primary" size="is-small" v-model="filterEmpFirstName" @input="FilterByFirstName"></b-input>
						</b-field>

					</div>

				</div>

				<div>

					<div class="w-full text-sm p-2">

						<b-table :striped="true" sticky-header height="600" :narrowed="true" :hoverable="true" :loading="loading" :data="payrolls">

							<b-table-column label="Employee Name" v-slot="props">
								{{ props.row.emp_full }}
							</b-table-column>

							<b-table-column label="Basic/Hour" v-slot="props">
								{{ props.row.basic_per_hour }}
							</b-table-column>

							<b-table-column label="Total Work Hours" v-slot="props">
								{{ props.row.total_working_hours }}
							</b-table-column>

							<b-table-column label="Gross Pay" v-slot="props">
								{{ props.row.gross_pay }}
							</b-table-column>

							<b-table-column label="Loans" v-slot="props">
								{{ props.row.loans }}
							</b-table-column>

							<b-table-column label="SSS" v-slot="props">
								{{ props.row.sss }}
							</b-table-column>

							<b-table-column label="PHIC" v-slot="props">
								{{ props.row.phic }}
							</b-table-column>

							<b-table-column label="HDMF" v-slot="props">
								{{ props.row.hdmf }}
							</b-table-column>

							<b-table-column label="Net Pay" v-slot="props">
								{{ props.row.net_pay }}
							</b-table-column>

						</b-table>

					</div>

				</div>

			</div>

		</div>

	</div>
</template>

<script>
	import { mapMutations, mapGetters, mapActions } from 'vuex'
	import { debounce } from 'lodash'

	export default {
		name: 'TimekeepingPage',

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
				dtrs: [],
				payrolls: [],

				employees: [],
				selectedEmployee: {},
				selEmpDetails: {},
				selEmpInfo: {},
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
				filterEmpLastName: null,
				filterEmpFirstName: null,
				filterCutoffDateStart: null,
				filterCutoffDateEnd: null,
				filterCutoffPeriod: null,

				selectionsForFixing: []
			}
		},

		methods: {
			...mapActions({
				GetDailyTimeRecords: 'pms/GetDailyTimeRecords',
				FixDailyTimeLogs: 'pms/FixDailyTimeLogs',
				GetPayrolls: 'pms/GetPayrolls'
			}),

			...mapMutations({}),

			async LoadAsyncData() {
				const params = {
					sort_by: this.sortField,
					sort_order: this.sortOrder,
					page: this.page,
					pageSize: this.pageSize,
					filters: this.filters || []
				}

				this.loading = true

				const payrolls = await this.GetPayrolls(params)

				this.payrolls = []
				this.payrolls = payrolls.data
				//this.totalDataCount = dtrs.data.total

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

				this.filters.push({ field: 'last_name', value: this.filterEmpLastName, type: 'like' })
				this.filters.push({ field: 'first_name', value: this.filterEmpFirstName, type: 'like' })
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

			FilterByCutoffPeriod() {
				this.searchDebounce(this)
			},

			// FilterByCutoffStart() {
			// 	this.searchDebounce(this)
			// },

			// FilterByCutoffEnd() {
			// 	this.searchDebounce(this)
			// },

			searchDebounce: debounce((vm) => {
				vm.onFilterData()
			}, 500),

			CheckBoxChange() {
				//console.log(this.selectionsForFixing)
			},

			async FixDtlSelections() {},

			CheckRenderCell(data) {
				//console.log(data)
				let cellClass = null

				//console.log(props.row.dtlEmpty)

				if (data) {
					cellClass = 'text-red-600 font-bold'
				}

				return cellClass
			}
		},

		mounted() {
			this.LoadAsyncData()
		}
	}
</script>

<style scoped>
	.content-height {
		height: calc(100vh - 68px);
	}

	.wrapper-h {
		height: calc(100vh - 270px);
	}
</style>