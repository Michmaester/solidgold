<template>
	<div>

		<div v-if="reportdata.report_meta.show_toolbar">
			<b-button type="is-primary" icon-left="plus" class="is-small text-white" @click="GeneratePdf">PDF</b-button>
		</div>

		<div id="report-doc-wrapper">

			<!-- head -->
			<div class="flex w-full">
				<div class="w-1/2">
					<p>Company : {{ reportdata.report_meta.company }}</p>
					<p>Branch : {{ reportdata.report_meta.branch }}</p>
					<p>Address : {{ reportdata.report_meta.address }}</p>
				</div>

				<div class="w-1/2">
					<p>Report Title : {{ reportdata.report_meta.title }}</p>
					<p>Description : {{ reportdata.report_meta.desc }}</p>
					<p>Date period : {{ reportdata.report_meta.date_filter }}</p>
					<p>Generated : {{ reportdata.report_meta.generation_date }}</p>
				</div>

			</div>

			<!-- data -->

			<!-- generate data base on columns and data -->

			<table class="table-auto w-full">
				<thead>
					<tr>
						<th v-for="(item,idx) in columns" :key="idx" class="px-4 py-2">
							{{ item.label }}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(data,idx) in datas" :key="idx">
						<template v-for="(col,col_idx) in columns">
							<td class="border px-4 py-2" :key="col_idx">{{ data[col.field] }}</td>
						</template>
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<th v-for="(item,idx) in columns" :key="idx" class="px-4 py-2">
							<span v-if="item.totals">Total {{ item.label }} : </span>{{ item.total }}
						</th>
					</tr>
				</tfoot>
			</table>

		</div>

	</div>
</template>

<script>
	import { mapActions, mapMutations, mapGetters } from 'vuex'

	import { jsPDF } from 'jspdf'
	import dayjs from 'dayjs'

	export default {
		props: {
			reportdata: Object
		},

		data() {
			return {
				reportMeta: this.reportdata.report_meta,
				columns: this.reportdata.columns,
				datas: this.reportdata.datas
			}
		},

		methods: {
			...mapActions({
				RequestGeneratePdf: 'GeneratePdf'
			}),
			...mapMutations({
				setIsLoading: 'setIsLoading'
			}),

			async GeneratePdf() {
				// this.setIsLoading(true)

				// var self = this

				// let doc = new jsPDF('p', 'pt', 'a4')

				let arr = [this.reportMeta.branch, this.reportMeta.title, dayjs().format('YYYY-MM-DD-HHmmss')]
				let filename = arr.join('-') + '.pdf'

				// var report = document.getElementById('report-doc-wrapper')
				// let srcwidth = document.getElementById('report-doc-wrapper').scrollWidth

				// doc.html(report, {
				// 	callback: function (doc) {
				// 		doc.save(filename)
				// 		self.setIsLoading(false)
				// 		//doc.output("dataurlnewwindow");
				// 	},
				// 	margin: [20, 20, 20, 20],
				// 	html2canvas: {
				// 		scale: 595.26 / srcwidth, //595.26 is the width of A4 page
				// 		scrollY: 0
				// 	},
				// 	x: 10,
				// 	y: 10
				// })

				//var report = document.documentElement.innerHTML
				var report = null

				// var report = document.getElementById('report-doc-wrapper')
				// console.log(report.innerHTML)

				const payload = {
					report: report,
					meta: {
						filename: filename
					}
				}

				const res = await this.RequestGeneratePdf(payload)

				console.log(res)
			}
		},

		mounted() {},

		created() {
			for (let index = 0; index < this.columns.length; index++) {
				const element = this.columns[index]

				if (this.columns[index].totals) {
					//true then calculate
					var total = parseFloat(this.$calculateTotals(this.datas, this.columns[index].field))
					this.columns[index]['total'] = total
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>