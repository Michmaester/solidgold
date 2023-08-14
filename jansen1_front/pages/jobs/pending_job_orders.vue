<template>
	<div>

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">

			<h3 class="has-text-header">Testing</h3>

			<!-- <div>
				<b-button type="is-primary" icon-left="plus" class="is-small text-white" @click="Testing">testing</b-button>
				<b-button type="is-primary" icon-left="plus" class="is-small text-white" @click="ShowPrintDoc">Show Print Doc</b-button>
				<b-button type="is-primary" icon-left="plus" class="is-small text-white" @click="Print">Print</b-button>
			</div> -->

		</div>

		<div class="grid grid-cols-8 gap-4 p-4 has-background-pageheader">

			<div class="col-span-8 wrapper-h bg-white flex">

				<p>nothing here.</p>

			</div>

		</div>

		<!-- <div class="p-4">
			<PrintDoc v-if="isReportShow" :reportdata="reportdata" />
		</div> -->

	</div>
</template>

<script>
	import { mapActions, mapMutations, mapGetters } from 'vuex'
	import simplebar from 'simplebar-vue'
	import dayjs from 'dayjs'
	import PrintDoc from '@/components/PrintDoc'

	export default {
		components: {
			simplebar,
			PrintDoc
		},

		meta: {
			module: 'jos-pending'
		},

		computed: mapGetters({
			customers: 'partners/getCustomers',
			purchaseOrders: 'purchases/getPurchaseOrders'
		}),

		data() {
			return {
				reportdata: {},
				isReportShow: false
			}
		},

		methods: {
			...mapActions({
				TestingAxios: 'Testing',
				GetCustomers: 'partners/GetCustomers',
				GetPurchaseOrders: 'purchases/GetPurchaseOrders'
			}),

			...mapMutations({
				// PushAddSalesOrder: 'sales/add'
			}),

			async Testing() {
				await this.TestingAxios()
			},

			async ShowPrintDoc() {
				// let columns = [
				// 	{ field: 'id', label: 'ID' },
				// 	{ field: 'prod', label: 'Product' },
				// 	{ field: 'desc', label: 'Description' },
				// 	{ field: 'amount', label: 'Amount' },
				// 	{ field: 'discount', label: 'Discount' }
				// ]

				// let totals = ['amount', 'discount']

				// let datas = [
				// 	{ id: '1', prod: 'Inte i5 Proc', desc: 'i5 Processsor', amount: '220.00', discount: '1' },
				// 	{ id: '2', prod: 'Inte i3 Proc', desc: 'i3 Processsor', amount: '20.00', discount: '3.3' },
				// 	{ id: '3', prod: 'Inte i7 Proc', desc: 'i7 Processsor', amount: '1,220.60', discount: '1.5' }
				// ]

				var res = await this.GetPurchaseOrders()

				console.log(res)

				let columns = [
					{ field: 'po_number', label: 'PO' },
					{ field: 'status', label: 'Status' },
					{ field: 'total_amount', label: 'Total Amount', totals: true },
					{ field: 'payment_status', label: 'Payment Status' },
					{ field: 'receive_total_amount', label: 'Receive Amount', totals: true }
				]

				let datas = res

				// let datas = [
				// 	{ id: '1', prod: 'Inte i5 Proc', desc: 'i5 Processsor', amount: '220.00', discount: '1' },
				// 	{ id: '2', prod: 'Inte i3 Proc', desc: 'i3 Processsor', amount: '20.00', discount: '3.3' },
				// 	{ id: '3', prod: 'Inte i7 Proc', desc: 'i7 Processsor', amount: '1,220.60', discount: '1.5' }
				// ]

				let report_meta = {
					title: 'Test Report',
					desc: 'Test report description',
					date_filter: 'Aug 01, 2020 to Oct 02, 2020',
					generation_date: dayjs().format('MM-DD-YYYY HH:mm:ss'),
					company: 'SolidGold',
					branch: 'Branch1',
					address: 'Testing address, we display it very long',
					show_toolbar: true
				}

				this.reportdata = {
					report_meta: report_meta,
					columns: columns,
					datas: datas
				}

				this.isReportShow = true
			},

			Print() {
				window.print()
			}
		},

		mounted() {
			this.GetCustomers()
		}
	}
</script>

<style scoped>
	.wrapper-h {
		height: calc(100vh - 125px);
	}
</style>
