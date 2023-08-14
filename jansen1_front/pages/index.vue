<template>
	<div>

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">
			<h3 class="has-text-header">Dashboard</h3>

			<div v-check="'view-statistics'" class="flex items-center">
				<b-button type="is-primary" size="is-small" @click="FetchNewData" class="mr-1" icon-left="refresh"></b-button>

				<b-field>
					<b-select size="is-small" v-model="selected_branchcode" @input="FetchNewData">
						<option v-for="branch in branches" :key="branch.branch_code" :value="branch.branch_code">
							{{ branch.name }}
						</option>

					</b-select>
				</b-field>

			</div>
		</div>

		<div v-check="'view-statistics'">
			<simplebar class="page-wrapper" data-simplebar-auto-hide="false">

				<div class="grid grid-cols-8 gap-6 p-4 mt-4">

					<div class="col-span-2 p-2 shadow-lg rounded-sm bg-white p-2 leading-tight flex items-center">
						<span class="w-12 px-2">
							<svg xmlns="http://www.w3.org/2000/svg" class="menu-icon fill-current text-gray-500" viewBox="0 0 24 24">
								<path d="M2 17h20v4H2v-4M6.25 7H9V6H6V3h8v3h-3v1h6.8c1 0 2 1 2.2 2l.5 7h-17l.55-7c0-1 1-2 2.2-2M13 9v2h5V9h-5M6 9v1h2V9H6m3 0v1h2V9H9m-3 2v1h2v-1H6m3 0v1h2v-1H9m-3 2v1h2v-1H6m3 0v1h2v-1H9M7 4v1h6V4H7z" />
							</svg>
						</span>

						<div>
							<h4 class="font-normal px-2 text-sm uppercase">Sales Today</h4>
							<p class="px-2 font-bold text-xl">{{ $formatAmountCurrency(todaysData.today.sales.totals) }}</p>
						</div>

					</div>

					<div class="col-span-2 p-2 shadow-lg rounded-sm bg-white p-2 leading-tight flex items-center">
						<span class="w-12 px-2">
							<svg xmlns="http://www.w3.org/2000/svg" class="menu-icon fill-current text-gray-500" viewBox="0 0 24 24">
								<path d="M3 11h12v2H3m0 5v-2h18v2M3 6h6v2H3z" />
							</svg>
						</span>

						<div>
							<h4 class="font-normal px-2 text-sm uppercase">Invoices</h4>
							<p class="px-2 font-bold text-xl">{{ todaysData.today.sales.counts }}</p>
						</div>

					</div>

					<div class="col-span-2 p-2 shadow-lg rounded-sm bg-white p-2 leading-tight flex items-center">
						<span class="w-12 px-2">
							<svg xmlns="http://www.w3.org/2000/svg" class="menu-icon fill-current text-gray-500" viewBox="0 0 24 24">
								<path d="M2 3h17a2 2 0 012 2v4h-2V5H2v14h17v-4h2v4a2 2 0 01-2 2H2a2 2 0 01-2-2V5a2 2 0 012-2m15 12v-2h7v-2h-7V9l-4 3 4 3M4 13h7v-2H4v2m0-4h7V7H4v2m0 8h4v-2H4v2z" />
							</svg>
						</span>

						<div>
							<h4 class="font-normal px-2 text-sm uppercase">Purchases Today</h4>
							<p class="px-2 font-bold text-xl">{{ $formatAmountCurrency(todaysData.today.purchases.totals) }}</p>
						</div>

					</div>

					<div class="col-span-2 p-2 shadow-lg rounded-sm bg-white p-2 leading-tight flex items-center">
						<span class="w-12 px-2">
							<svg xmlns="http://www.w3.org/2000/svg" class="menu-icon fill-current text-gray-500" viewBox="0 0 24 24">
								<path d="M3 11h12v2H3m0 5v-2h18v2M3 6h6v2H3z" />
							</svg>
						</span>

						<div>
							<h4 class="font-normal px-2 text-sm uppercase">Purchase Orders</h4>
							<p class="px-2 font-bold text-xl">{{ todaysData.today.purchases.counts }}</p>
						</div>

					</div>

				</div>

				<div v-if="isRoleAdmin" class="grid grid-cols-8 gap-6 p-4">

					<div class="col-span-4 p-2">
						<h4 class="font-bold px-2">Monthly Sales</h4>
						<client-only placeholder="Loading...">
							<apexchart height='300' type="line" :options="salesChartOptions" :series="salesSeries"></apexchart>
						</client-only>

					</div>

					<div class="col-span-4 p-2">
						<h4 class="font-bold px-2">Monthly Purchases</h4>
						<client-only placeholder="Loading...">
							<apexchart height='300' type="line" :options="purchaseChartOptions" :series="purchaseSeries"></apexchart>
						</client-only>
					</div>

				</div>

				<div class="grid grid-cols-6 gap-4 p-4">

					<div class="col-span-2 shadow-lg rounded-sm bg-white">
						<div class="leading-tight mb-4 has-background-primary p-2 rounded-t-sm">
							<h4 class="font-normal px-2">Inventory Restocking</h4>
							<p class="font-bold px-2">Total Items : {{ todaysData.restocks.counts }}</p>
						</div>
						<ul class="px-2">
							<li class="flex items-center text-sm font-semibold has-text-primary">
								<p class="my-1 mx-2 w-full">Name</p>
								<p class="my-1 mx-2 w-10">OnHand</p>
								<p class="my-1 mx-2 w-16">Ordered</p>
								<p class="my-1 mx-2 w-10">Qty.</p>
							</li>
							<li v-for="(item,idx) in todaysData.restocks.items" :key="idx" class="flex items-center text-sm border-b border-gray-100 hover:bg-gray-100">

								<p class="my-1 mx-2 w-full">{{ item.product }}</p>
								<p class="my-1 mx-2 w-10">{{ item.onhand_qty }}</p>
								<p class="my-1 mx-2 w-16">{{ item.ordered_status }}</p>
								<p class="my-1 mx-2 w-10">{{ item.ordered_qty }}</p>

							</li>
						</ul>
						<div v-if="todaysData.restocks.counts >= 15" class="flex rounded-sm bg-yellow-200 m-4 p-4 justify-around">
							<p>Displaying only 15 items.</p>
							<nuxt-link :to="'inventory/stocks'" class="text-blue-400 font-semibold">See more here</nuxt-link>
						</div>
					</div>

					<div class="col-span-2 shadow-lg rounded-sm bg-white">
						<div class="leading-tight mb-4 has-background-primary p-2 rounded-t-sm">
							<h4 class="font-normal px-2">Accounts Receivables</h4>
							<p class="font-bold px-2">Totals : {{ $formatAmountCurrency(todaysData.receivables.totals) }}</p>
						</div>
						<ul class="px-2">
							<li class="flex items-center text-sm font-semibold has-text-primary">
								<p class="my-1 mx-2 w-full">Customer</p>
								<p class="my-1 mx-2 w-32">Amount</p>
								<p class="my-1 mx-2 w-48">Due Date</p>
							</li>

							<li v-for="(item,idx) in todaysData.receivables.items" :key="idx" class="flex items-center text-sm border-b border-gray-100 hover:bg-gray-100">

								<p class="my-1 mx-2 w-full">{{ item.customer }}</p>
								<p class="my-1 mx-2 w-32">{{ $formatAmount(item.amount) }}</p>
								<p class="my-1 mx-2 w-48">{{ $formatDateByFormat(item.due_date,'MMM DD, YYYY') }}</p>

							</li>

						</ul>
					</div>

					<div class="col-span-2 shadow-lg rounded-sm bg-white">
						<div class="leading-tight mb-4 has-background-primary p-2 rounded-t-sm">
							<h4 class="font-normal px-2">Accounts Payable</h4>
							<p class="font-bold px-2">Totals : {{ $formatAmountCurrency(todaysData.payables.totals) }}</p>
						</div>

						<ul class="px-2">
							<li class="flex items-center text-sm font-semibold has-text-primary">
								<p class="my-1 mx-2 w-full">Supplier</p>
								<p class="my-1 mx-2 w-32">Amount</p>
								<p class="my-1 mx-2 w-48">Due Date</p>
							</li>

							<li v-for="(item,idx) in todaysData.payables.items" :key="idx" class="flex items-center text-sm border-b border-gray-100 hover:bg-gray-100">

								<p class="my-1 mx-2 w-full">{{ item.supplier }}</p>
								<p class="my-1 mx-2 w-32">{{ $formatAmount(item.amount) }}</p>
								<p class="my-1 mx-2 w-48">{{ $formatDateByFormat(item.due_date,'MMM DD, YYYY') }}</p>

							</li>

						</ul>
					</div>

				</div>
			</simplebar>
		</div>

	</div>
</template>

<script>
	import { mapActions, mapMutations, mapGetters } from 'vuex'
	import dayjs from 'dayjs'
	import simplebar from 'simplebar-vue'

	export default {
		name: 'HomePage',

		components: {
			simplebar
		},

		computed: mapGetters({
			branches: 'masterdatas/getBranches',
			selectedBranch: 'getSelectedBranch',
			dashCharts: 'dashboard/getDashCharts',
			dashData: 'dashboard/getDashData'
		}),

		data() {
			return {
				selected_branchcode: null,

				isRoleAdmin: false,

				salesChartOptions: {
					chart: {
						toolbar: { show: false },
						zoom: { enabled: false }
					},
					dataLabels: { enabled: false },
					stroke: {
						width: 3,
						curve: 'smooth'
					},
					markers: {
						size: 0
					},
					xaxis: {
						categories: [],

						tickAmount: 5
					},
					yaxis: {
						labels: {
							//added formatter 20210425
							formatter: function (value) {
								if (value >= 1000000000) {
									return (value / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G'
								}
								if (value >= 1000000) {
									return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
								}
								if (value >= 1000) {
									return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
								}
								return value
							}
						}
					},

					legend: {
						position: 'top',
						horizontalAlign: 'right',
						floating: true,
						offsetY: 0,
						offsetX: 0
					},
					theme: {
						palette: 'palette4'
					},
					grid: {
						xaxis: {
							lines: {
								show: false
							}
						},
						yaxis: {
							lines: {
								show: false
							}
						}
					}
				},

				purchaseChartOptions: {
					chart: {
						id: 'monthly-purchase-chart',
						toolbar: { show: false },
						zoom: { enabled: false }
					},
					dataLabels: {
						enabled: false
					},
					stroke: {
						width: 3,
						curve: 'smooth'
					},
					markers: {
						size: 0
					},
					xaxis: {
						categories: [],
						tickAmount: 10
					},
					yaxis: {
						labels: {
							//added formatter 20210425
							formatter: function (value) {
								if (value >= 1000000000) {
									return (value / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G'
								}
								if (value >= 1000000) {
									return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
								}
								if (value >= 1000) {
									return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
								}
								return value
							}
						}
					},
					legend: {
						position: 'top',
						horizontalAlign: 'right',
						floating: true,
						offsetY: 0,
						offsetX: 0
					},
					theme: {
						palette: 'palette4'
					},
					grid: {
						xaxis: {
							lines: {
								show: false
							}
						},
						yaxis: {
							lines: {
								show: false
							}
						}
					}
				},

				salesSeries: [],
				purchaseSeries: [],

				todaysData: {
					today: {
						sales: { totals: 0, counts: 0 },
						purchases: { totals: 0, counts: 0 }
					},
					restocks: {
						items: [],
						counts: 0
					},
					receivables: {
						items: [],
						totals: 0,
						counts: 0
					},
					payables: {
						items: [],
						totals: 0,
						counts: 0
					}
				}
			}
		},

		methods: {
			...mapActions({
				GetBranches: 'masterdatas/GetBranches',

				GetDashMonthlyCharts: 'dashboard/GetDashMonthlyCharts',
				GetDashboardDatas: 'dashboard/GetDashboardDatas'
			}),

			nFormatter(num) {
				if (num >= 1000000000) {
					return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G'
				}
				if (num >= 1000000) {
					return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
				}
				if (num >= 1000) {
					return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
				}
				return num
			},

			GetDataByBranch() {
				const branch_code = this.selected_branchcode

				//get the sales
				//get the purchase

				//get the inventory
				//get accounts receivables
				//get accounts payable
			},

			async FetchNewData() {
				const payload = {
					branch_code: this.selected_branchcode
				}

				const result = await this.GetDashboardDatas(payload)
				this.todaysData = result.data

				//if admin?
				if (this.$auth.$state.user.role === 'Administrator') {
					this.GetMonthlyData()
					this.isRoleAdmin = true
				} else {
					//its a normal user,use the selected branch only
					this.isRoleAdmin = false
				}
			},

			async GetMonthlyData() {
				const result = await this.GetDashMonthlyCharts()

				let categories = result.data.sg.map((item) => {
					return dayjs(item.date).format('MMM-DD')
				})

				let stotals_sg = result.data.sg.map((item) => {
					return item.sales_totals
				})

				let stotals_gm = result.data.gm.map((item) => {
					return item.sales_totals
				})

				let stotals_eg = result.data.eg.map((item) => {
					return item.sales_totals
				})

				let stotals_hm = result.data.hm.map((item) => {
					return item.sales_totals
				})

				let stotals_atg = result.data.atg.map((item) => {
					return item.sales_totals
				})

				let ptotals_sg = result.data.sg.map((item) => {
					return item.po_totals
				})

				let ptotals_gm = result.data.gm.map((item) => {
					return item.po_totals
				})

				let ptotals_eg = result.data.eg.map((item) => {
					return item.po_totals
				})

				let ptotals_hm = result.data.hm.map((item) => {
					return item.po_totals
				})

				let ptotals_atg = result.data.atg.map((item) => {
					return item.po_totals
				})

				this.salesChartOptions = {
					...this.salesChartOptions,
					...{
						xaxis: {
							categories: categories,
							tickAmount: 10
						}
					}
				}

				this.purchaseChartOptions = {
					...this.purchaseChartOptions,
					...{
						xaxis: {
							categories: categories,
							tickAmount: 10
						}
					}
				}

				this.salesSeries = [
					{
						type: 'line',
						name: 'Solidgold',
						data: stotals_sg
					},
					{
						type: 'line',
						name: 'Goldmaster',
						data: stotals_gm
					},
					{
						type: 'line',
						name: 'Evergold',
						data: stotals_eg
					},
					{
						type: 'line',
						name: 'Homemaster',
						data: stotals_hm
					},
					{
						type: 'line',
						name: 'All Things Green',
						data: stotals_atg
					}
				]

				this.purchaseSeries = [
					{
						type: 'line',
						name: 'Solidgold',
						data: ptotals_sg
					},
					{
						type: 'line',
						name: 'Goldmaster',
						data: ptotals_gm
					},
					{
						type: 'line',
						name: 'Evergold',
						data: ptotals_eg
					},
					{
						type: 'line',
						name: 'Homemaster',
						data: ptotals_hm
					},
					{
						type: 'line',
						name: 'All Things Green',
						data: ptotals_atg
					}
				]

				// const max = 90
				// const min = 20

				// let data1 = []
				// let data2 = []

				// for (let index = 0; index < this.salesChartOptions.xaxis.categories.length; index++) {
				// 	data1.push(Math.floor(Math.random() * (max - min + 1)) + min)
				// 	data2.push(Math.floor(Math.random() * (max - min + 1)) + min)
				// }

				// this.salesSeries = [
				// 	{
				// 		name: 'Previous Month',
				// 		data: data1
				// 	},
				// 	{
				// 		name: 'Current Month',
				// 		data: data2
				// 	}
				// ]
			}
		},

		async mounted() {
			this.GetBranches()
			this.selected_branchcode = this.selectedBranch.branch_code

			// fetch initialy today data using the selected branch
			const result = await this.GetDashboardDatas()
			this.todaysData = result.data

			// read the use loggedin role

			//if admin
			// display all

			//if not then display selected branch only

			if (this.$auth.$state.user.role === 'Administrator') {
				this.GetMonthlyData()
				this.isRoleAdmin = true
			} else {
				//its a normal user,use the selected branch only
				this.isRoleAdmin = false
			}
		}
	}
</script>


<style scoped>
	.wrapper-h {
		height: calc(100vh - 250px);
	}
	.page-wrapper {
		height: calc(100vh - 100px);
	}
</style>
