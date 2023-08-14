<template>
	<div class="flex flex-col">

		<div class="p-4 page-subheader flex items-center">
			<b-button :disabled="isNotifyOpenInvoice" type="is-primary" icon-left="printer" class="is-small text-white" @click="PrintPage">Print Document</b-button>
			<p v-if="isNotifyOpenInvoice" class="text-sm text-red-600 font-semibold ml-4">Please apply credit payment from your returns to an open sales invoice before printing.</p>
		</div>

		<div v-if="printdocData" class="p-4">

			<div class="flex justify-between text-xs">

				<div class="text-left leading-none">

					<div v-if="printdocData.docMeta.branch_code === 'SG'">
						<h2 class="font-bold text-base">SOLIDGOLD MULTI RESOURCE CORP.</h2>
						<p>Brgy. Our Lady of Lourdes, Jaro Iloilo City</p>
						<p>Phone No. Tel Nos. 320-2563 Fax No. Fax 509-0880</p>
					</div>
					<div v-if="printdocData.docMeta.branch_code === 'EG'">
						<h2 class="font-bold text-base">EVERGOLD BUILDER SALES CENTER</h2>
						<p>Quezon St., Iloilo City</p>
						<p>Phone No. Tel Nos. 320-2563 Fax No. Fax 509-0880</p>
					</div>
					<div v-if="printdocData.docMeta.branch_code === 'GM'">
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

				</div>

				<div class="flex">
					<div class="text-right leading-none">
						<h2 class="font-bold text-base">{{ printdocData.docMeta.docName }} </h2>
						<p>Date : {{ printdocData.docMeta.generatedDate }}</p>
					</div>
				</div>
			</div>

			<div class="mt-4 leading-none text-xs">
				<p><span class="font-bold">Deliver To :</span> {{ printdocData.docMeta.customer.name }}</p>
				<p><span class="font-bold">Address :</span> {{ printdocData.docMeta.customer.address }}</p>
			</div>

			<div class="mt-4">
				<h5 class="text-base font-bold">Open Invoices</h5>
				<table class="table w-full text-xs printing-table">
					<thead>
						<th v-for="(field,idx) in printdocData.docMeta.fields" :key="idx">
							{{ field.label }}
						</th>
					</thead>
					<tbody>
						<tr v-for="(item,idx) in printdocData.result" :key="idx">

							<td v-for="(field,i) in printdocData.docMeta.fields" :key="i">
								<span v-if="field.isAmount">{{ $formatAmount(GetObjectPropData(item,field.field)) }}</span>
								<span v-else>{{ GetObjectPropData(item,field.field) }}</span>
							</td>

						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td v-for="(field,i) in printdocData.docMeta.fields" :key="i">
								<span v-if="field.isTotal" class="font-bold">{{ $formatAmountCurrency($calculateTotals(printdocData.result,field.field)) }}</span>
							</td>
						</tr>
					</tfoot>
				</table>
			</div>

			<!-- <div v-if="printdocData.docMeta.otherDatas.credit_memos.length > 0" class="mt-2">
				<h5 class="text-base font-bold">Credit Memos</h5>
				<table class="table w-full text-xs printing-table">
					<thead>
						<th>Credit Memo No.</th>
						<th>Date</th>
						<th>Doc Ref.</th>
						<th>Credit Amount</th>
						<th>Credit Balance</th>
					</thead>
					<tbody>
						<tr v-for="(item,idx) in printdocData.docMeta.otherDatas.credit_memos" :key="idx">
							<td><span>{{ item.crm_no }}</span></td>
							<td><span>{{ item.credit_datetime }}</span></td>
							<td><span>{{ item.sr_no }}</span></td>
							<td><span>{{ item.credit_amount }}</span></td>
							<td><span>{{ item.credit_balance }}</span></td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td><span class="font-bold">{{ $formatAmountCurrency(printdocData.docMeta.otherDatas.credit_memo_totals) }}</span></td>
						</tr>
					</tfoot>
				</table>
			</div> -->

			<div v-if="printdocData.docMeta.otherDatas.sales_returns.length > 0" class="mt-4">
				<h5 class="text-base font-bold">Returns</h5>
				<table class="table w-full text-xs printing-table">
					<thead>
						<th>Return No.</th>
						<th>Invoice No.</th>
						<th>Date</th>
						<th>Credit</th>
						<th>Applied</th>
						<th>Balance</th>
					</thead>
					<tbody>
						<tr v-for="(item,idx) in printdocData.docMeta.otherDatas.sales_returns" :key="idx">
							<td><span>{{ item.sales_return_code }}</span></td>
							<td><span>{{ item.invoice_no }}</span></td>
							<td><span>{{ item.return_date }}</span></td>
							<td><span>{{ item.credit_amount }}</span></td>
							<td><span>{{ item.applied_amount }}</span></td>
							<td><span>{{ item.credit_balance }}</span></td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td><span class="font-bold">{{ $formatAmountCurrency(printdocData.docMeta.otherDatas.sales_returns_totals) }}</span></td>
						</tr>
					</tfoot>
				</table>
			</div>

			<div class="mt-6 flex justify-end">
				<div class="py-2 px-6 border border-gray-400 text-center">
					<p>Balance</p>
					<span class="block font-bold text-xl">{{ $formatAmountCurrency(printdocData.docMeta.otherDatas.actual_remaining_balance) }}</span>
				</div>
			</div>

			<div class="my-6 text-xs">
				<p><span class="font-bold">AGREEMENT</span> : Received in trust the merchandize specified above and in consideration hereof the undersigned hereby
					agree to hold said merchandize in storage as the property of the TRUSTOR, with the liberty to sell the same for
					cash for the TRUSTEE'S ACCOUNT and to hand the portion of the proceeds from the sale of the merchandize as
					represented by the TRUSTOR'S billing price for the merchandize received or to return the said merchandize in
					good and salable condition within 15 days from the date of the delivery if not sold or consumed. Any violation
					of this agreement is a criminal offense and any controversy or litigation, venue shall be in Iloilo City.
					Received the above merchandize in good order and condition.</p>
			</div>

			<div v-if="printdocData.docMeta.isFooterVisible" class="mt-2">
				<div class="flex">
					<div v-for="(item,idx) in printdocData.docMeta.footerItems" :key="idx" class="pr-4">
						<span class="text-xs">{{ item.label }}</span>
						<span v-if="item.isBlankLine" class="block font-semibold mb-0">_______________________</span>
						<span v-else class="block font-semibold">{{ GetObjectPropData(printdocData.result, item.field) }}</span>
						<span class="text-xs">Printed Name above Signature</span>
					</div>
				</div>
			</div>

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

				isDataAvailable: false,
				isNotifyOpenInvoice: false
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
				console.log('testing')
				const res = await this.GetPrintDoc(params)
				//console.log(res.data)
				if (res.status === 'ok') {
					this.printdocData = res.data
					this.isDataAvailable = true

					this.isNotifyOpenInvoice = this.printdocData.docMeta.otherDatas.notifyOpenInvoice
				}
			}
		},

		mounted() {
			//get the query params
			//make an object
			//axios query to the route
			//wait for the result

			let query = this.$route.query
			let params = JSON.parse(query.params)

			//console.log(params)

			this.GetDocumentData(params)
		}
	}
</script>

<style scoped>
	.wrapper-h {
		height: calc(100vh - 125px);
	}
</style>