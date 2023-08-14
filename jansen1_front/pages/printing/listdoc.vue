<template>
	<div class="flex flex-col">

		<div class="p-4 page-subheader">
			<b-button type="is-primary" icon-left="printer" class="is-small text-white" @click="PrintPage">Print Document</b-button>
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
						<p>Generated Date : {{ printdocData.docMeta.generatedDate }}</p>
					</div>
				</div>
			</div>

			<div class="mt-4">
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

			<div v-if="printdocData.docMeta.isFooterVisible" class="mt-2">
				<div class="flex">
					<div v-for="(item,idx) in printdocData.docMeta.footerItems" :key="idx" class="pr-4">
						<span class="text-xs">{{ item.label }}</span>
						<span v-if="item.isBlankLine" class="block font-semibold">_______________________</span>
						<span v-else class="block font-semibold">{{ GetObjectPropData(printdocData.result, item.field) }}</span>
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
			let params = JSON.parse(query.params)

			this.GetDocumentData(params)
		}
	}
</script>

<style scoped>
	.wrapper-h {
		height: calc(100vh - 125px);
	}
</style>