<template>
	<div class="flex flex-col">

		<div class="p-4 page-subheader">
			<b-button type="is-primary" icon-left="printer" class="is-small text-white" @click="PrintPage">Print Document</b-button>
		</div>

		<div v-if="printdocData" class="p-4">

			<table class="w-full">
				<tbody>
					<tr>
						<td colspan="5" class="px-3 py-2">
							<div v-if="printdocData.docMeta.branch_code === 'SG'" class="leading-none">
								<h2 class="font-bold text-base">SOLIDGOLD MULTI RESOURCE CORP.</h2>
								<p>Brgy. Our Lady of Lourdes, Jaro Iloilo City</p>
								<p>Phone No. Tel Nos. 320-2563 Fax No. Fax 509-0880</p>
							</div>
							<div v-if="printdocData.docMeta.branch_code === 'EG'" class="leading-none">
								<h2 class="font-bold text-base">EVERGOLD BUILDER SALES CENTER</h2>
								<p>Quezon St., Iloilo City</p>
								<p>Phone No. Tel Nos. 320-2563 Fax No. Fax 509-0880</p>
							</div>
							<div v-if="printdocData.docMeta.branch_code === 'GM'" class="leading-none">
								<h2 class="font-bold text-base">GOLDMASTER HOME CREATION</h2>
								<p>Guzman St., Mandurriao Iloilo City</p>
								<p>Phone No. Tel Nos. 321-0281 Fax No. Fax 321-5230</p>
							</div>
							<div v-if="printdocData.docMeta.branch_code === 'HM'">
								<h2 class="font-bold text-base">Homemaster Iloilo Specialist Inc.</h2>
								<p>Jalandoni St. Jaro, Iloilo</p>
								<p>033-321-1778</p>
							</div>
							<div v-if="printdocData.docMeta.branch_code === 'ATG'">
								<h2 class="font-bold text-base">All Things Green by Homemaster</h2>
								<p>Mandurriao, Iloilo City</p>
								<p>-</p>
							</div>
						</td>
					</tr>
					<tr>
						<td colspan="4">
							<h2 class="font-bold text-3xl text-center">{{ printdocData.docMeta.docName }} </h2>
						</td>
						<td class="align-middle">
							<p class="text-center font-bold text-lg">{{ printdocData.result.voucher.cheque_voucher_no }}</p>
						</td>
					</tr>
					<tr>
						<td>
							<h3 class="py-2 ml-2">Payable To:</h3>
						</td>
						<td colspan="4" class="align-middle">
							<h2 class="font-bold text-base ml-2">{{ printdocData.result.voucher.supplier.name }}</h2>
						</td>
					</tr>

					<tr>
						<td class="py-1">
							<h2 class="font-bold text-base ml-2">Date</h2>
						</td>
						<td colspan="3" class="align-middle">
							<h2 class="font-bold text-base text-center">Description</h2>
						</td>
						<td class="align-middle">
							<h2 class="font-bold text-base text-center">Amount</h2>
						</td>
					</tr>

					<tr>
						<td class="align-middle">
							<p class="ml-2">{{ $formatDateByFormat(printdocData.result.voucher.created_at,'DD-MMM-YYYY') }}</p>
						</td>
						<td colspan="3" class="px-3">

							<p v-for="(po,idx) in printdocData.result.po_details" :key="idx">
								{{ po.po_number }} - {{ po.paid_amount }} - {{ po.payment_status }}
							</p>
							<!-- <p>sdfgdsfg</p>
							<p>sdfgdsfg</p> -->
						</td>
						<td class="align-middle">
							<p class="font-bold text-2xl text-center">{{ $formatAmount(printdocData.result.voucher.cheque_amount) }}</p>
						</td>
					</tr>

					<tr>
						<td></td>
						<td colspan="3" class="align-middle">
							<h2 class="font-bold text-xl text-center uppercase">Total Amount</h2>
						</td>
						<td></td>
					</tr>

					<tr>
						<td colspan="2" class="align-middle">
							<h2 class="font-bold text-base text-center italic">Details</h2>
						</td>
						<td>
							<h2 class="font-bold text-base ml-2">Prepared By:</h2>
						</td>
						<td>
							<h2 class="font-bold text-base ml-2">Checked By:</h2>
						</td>
						<td>
							<h2 class="font-bold text-base ml-2">Approved By:</h2>
						</td>
					</tr>
					<tr>
						<td>
							<h2 class="font-bold text-base ml-2">Bank Name</h2>
						</td>
						<td>
							<p class="ml-2">{{ printdocData.result.voucher.cheque_bank }}</p>
						</td>
						<td rowspan="4"></td>
						<td rowspan="4"></td>
						<td rowspan="4"></td>
					</tr>
					<tr>
						<td>
							<h2 class="text-base ml-2">Date</h2>
						</td>
						<td>
							<p class="ml-2">{{ printdocData.result.voucher.cheque_date }}</p>
						</td>
					</tr>
					<tr>
						<td>
							<h2 class="text-base ml-2">Cheque No.</h2>
						</td>
						<td>
							<p class="ml-2">{{ printdocData.result.voucher.cheque_no }}</p>
						</td>
					</tr>
					<tr>
						<td colspan="2">
							<h2 class="text-base ml-2">Received By:</h2>
						</td>
					</tr>
					<tr>
						<td colspan="5">
							<h2 class="text-base ml-2">Explanation:</h2>
						</td>
					</tr>
				</tbody>
			</table>

			<!-- <div class="flex justify-between text-sm border-b border-gray-400">
				<div class="flex">
					<div class="leading-tight">
						<h2 class="font-bold text-base">{{ printdocData.docMeta.docName }}</h2>
						<p>Payment Date : {{ $formatDateByFormat(printdocData.result.payment_date,'MMM-DD-YYYY HH:mm:ss') }}</p>
					</div>
				</div>
			</div>

			<div class="text-sm my-4 flex items-center justify-between">
				<div class="mr-6 w-2/3">
					<p class="underline text-lg"><span class="font-semibold mr-2">Supplier</span>{{ printdocData.result.supplier.name }}</p>
					<p><span class="font-semibold mr-2">Date on Cheque</span> {{ printdocData.result.cheque_date }}</p>
					<p><span class="font-semibold mr-2">Bank</span>{{ printdocData.result.cheque_bank }}</p>
					<p><span class="font-semibold mr-2">Cheque No.</span>{{ printdocData.result.cheque_no }}</p>
					<p><span class="font-semibold mr-2">Name on Cheque</span>{{ printdocData.result.cheque_name }}</p>
				</div>

				<div class="border border-gray-400 p-4 my-2 w-1/3">
					<p>Amount</p>
					<p class="font-bold text-2xl">{{ $formatAmountCurrency(printdocData.result.payment_amount) }}</p>
				</div>

			</div>

			<div v-if="printdocData.docMeta.isFooterVisible" class="my-4">
				<div class="flex">
					<div v-for="(item,idx) in printdocData.docMeta.footerItems" :key="idx" class="pr-4">
						<span class="text-xs">{{ item.label }}</span>
						<span v-if="item.isBlankLine" class="block font-semibold">_______________________</span>
						<span v-else class="block font-semibold">{{ GetObjectPropData(printdocData.result, item.field) }}</span>
					</div>
				</div>
			</div> -->

		</div>

	</div>
</template>

<script>
	import { mapActions, mapMutations, mapGetters } from 'vuex'
	import _ from 'lodash'

	export default {
		name: 'Print1Page',
		layout: 'print',
		auth: 'false',

		components: {},
		computed: {
			...mapGetters({})
		},

		data() {
			return {
				// printdocData: {
				// 	docMeta: {
				// 		docName: null,
				// 		listProp: null,
				// 		fields: []
				// 	},
				// 	result: []
				// },

				printdocData: null,

				isDataAvailable: false
			}
		},

		methods: {
			...mapActions({
				GetPrintDoc: 'GetPrintDoc'
			}),

			...mapMutations({}),

			GetObjectPropData(obj, prop) {
				return _.get(obj, prop)
			},

			PrintPage() {
				window.print()
			},

			async GetDocumentData(params) {
				const res = await this.GetPrintDoc(params)
				if (res.status === 'ok') {
					this.printdocData = res.data
					this.isDataAvailable = true
				}
			}
		},

		mounted() {
			//get the query params
			//make an object
			//axios query to the route
			//wait for the result

			let query = this.$route.query
			let queryObj = {
				type: query.type,
				branch_code: query.branch_code,
				ref_field: query.ref_field,
				ref_no: query.ref_no
			}

			this.GetDocumentData(queryObj)
		}
	}
</script>

<style scoped>
	.wrapper-h {
		height: calc(100vh - 125px);
	}

	table,
	td,
	th {
		border: 1px solid #595959;
		border-collapse: collapse;
	}
	td,
	th {
		padding: 3px;
		width: 30px;
		height: 25px;
	}
	th {
		background: #f0e6cc;
	}
	.even {
		background: #fbf8f0;
	}
	.odd {
		background: #fefcf9;
	}
</style>