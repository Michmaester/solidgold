<template>
	<div>
		<p>printpage</p>
		<b-button type="is-primary" @click="PdfGen">PDF</b-button>

		<div class="bg-gray-400">
			<div id="report-wrapper" v-html="content">
			</div>
		</div>

		<!-- {{ testdata }} -->
		<!-- <PrintDoc v-if="isReportShow" :reportdata="reportdata" /> -->
	</div>
</template>

<script>
	import PrintDoc from '@/components/PrintDoc'
	import { mapActions, mapMutations, mapGetters } from 'vuex'

	export default {
		layout: 'print',
		name: 'PrintPage',
		auth: false,

		components: {
			PrintDoc
		},

		data() {
			return {
				reportdata: {},
				isReportShow: false,
				testdata: null,

				content: `<!DOCTYPE html>
								<html lang="en">
								<head>
									<meta charset="UTF-8">
									<meta name="viewport" content="width=device-width, initial-scale=1.0">
									<title>Document</title>
									<style>
										.table{

										}
									</style>
								</head>
								<body>
									<table class="table-auto w-full">
										<thead>
											<tr>
												<th class="px-4 py-2">Title</th>
												<th class="px-4 py-2">Author</th>
												<th class="px-4 py-2">Views</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td class="border px-4 py-2">Intro to CSS</td>
												<td class="border px-4 py-2">Adam</td>
												<td class="border px-4 py-2">858</td>
											</tr>
											<tr class="bg-gray-100">
												<td class="border px-4 py-2">A Long and Winding Tour of the History of UI Frameworks and Tools and the Impact on Design</td>
												<td class="border px-4 py-2">Adam</td>
												<td class="border px-4 py-2">112</td>
											</tr>
											<tr>
												<td class="border px-4 py-2">Intro to JavaScript</td>
												<td class="border px-4 py-2">Chris</td>
												<td class="border px-4 py-2">1,280</td>
											</tr>
										</tbody>
									</table>
									
								</body>
								</html>`,
				content2: 'testing again'
			}
		},

		methods: {
			...mapActions({
				RequestGeneratePdf: 'GeneratePdf'
			}),

			async PdfGen() {
				//get the document id

				// var report = document.documentElement.innerHTML
				// var report = null

				var report = document.getElementById('report-wrapper')
				//console.log(report.innerHTML)
				const payload = {
					report: report.innerHTML
				}

				const res = await this.RequestGeneratePdf(payload)
			}
		},

		mounted() {
			this.reportdata = this.$route.query.reportdata
		}
	}
</script>


<style scoped>
</style>
