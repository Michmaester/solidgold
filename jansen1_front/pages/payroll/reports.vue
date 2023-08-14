<template>
	<div>

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200 page-subheader">

			<h3 class="has-text-header">Payroll Reports</h3>
			<div class="flex items-center">
				<b-button type="is-primary" size="is-small" icon-left="clipboard-text-play-outline" class="mr-1" expanded @click="PreviewReport">Preview Report</b-button>
				<b-button :disabled="generatedReport.url == null" type="is-primary" icon-left="file-pdf" class="is-small text-white mr-1" @click="GenerateReportPdf">Generate PDF</b-button>
				<!-- <b-button type="is-primary" icon-left="printer" class="is-small text-white" @click="PrintReport">Print</b-button> -->
			</div>

		</div>

		<div class="flex">

			<div class="w-1/3 p-4 border-r border-gray-200" style="height:100vh" id="report-sidebar-wrapper">
				<div>
					<b-field label="Report Module" custom-class="text-xs no-mb-labels font-semibold">
						<b-select expanded size="is-small" v-model="selected_reptmodule" @input="SelectedReportModule">
							<option v-for="(item,idx) in rept_modules" :key="idx" :value="item">
								{{ item.name }}
							</option>
						</b-select>
					</b-field>
					<b-field label="Report Template" custom-class="text-xs no-mb-labels font-semibold">
						<b-select :disabled="reportTemplates.length <= 0" expanded size="is-small" v-model="selected_repttemplate" @input="SelectedReportTemplate">
							<option v-for="(item,idx) in reportTemplates" :key="idx" :value="item">
								{{ item.name }}
							</option>
						</b-select>
					</b-field>
					<div class="field">
						<b-switch v-model="pdfPageOrientation" true-value="landscape" false-value="portrait" size="is-small">PDF Page ( Landscape )</b-switch>
					</div>
				</div>

				<div>

					<h4 class="mt-2 py-1 has-text-primary font-bold">
						<b-icon icon="filter-variant" size="is-small">
						</b-icon>
						Filters
					</h4>

					<div>

						<b-field v-if="isFilterDate" label="Date Period" custom-class="text-xs no-mb-labels font-semibold">
							<b-datepicker v-model="reptFilterDates" @input="DateSelected" range icon="calendar-month-outline" size="is-small" :date-formatter="DateFormatter" trap-focus>
							</b-datepicker>
						</b-field>

						<!-- <b-field label="Payment Type" custom-class="text-xs no-mb-labels font-semibold">
							<b-select expanded size="is-small">
								<option value="sales">Cash</option>
								<option value="purchase">Charge</option>
							</b-select>
						</b-field> -->

						<b-field v-if="isFilterCustomer" label="Customers" custom-class="font-semibold text-xs no-mb-labels" class="w-full text-xs">
							<v-select :options="customers" label="name" :reduce="customer => customer.customer_id" v-model="filters.customer" />
						</b-field>

						<b-field v-if="isFilterSupplier" label="Suppliers" custom-class="font-semibold text-xs no-mb-labels" class="w-full text-xs">
							<v-select :options="suppliers" label="name" :reduce="supplier => supplier.supplier_id" v-model="filters.supplier" />
						</b-field>

						<b-field v-if="isFilterInvoiceNo" label="Invoice No." custom-class="font-semibold text-xs no-mb-labels" class="w-full text-xs">
							<v-select :options="invoices" label="invoice_no" :reduce="invoice => invoice.invoice_no" v-model="filters.invoice_no" />
						</b-field>

						<b-field v-if="isFilterPONo" label="PO No." custom-class="font-semibold text-xs no-mb-labels" class="w-full text-xs">
							<v-select :options="purchases" label="po_number" :reduce="po => po.po_number" v-model="filters.po_number" />
						</b-field>

						<b-field v-if="isFilterCategory" label="Category" custom-class="font-semibold text-xs no-mb-labels" class="w-full text-xs">
							<v-select :options="categories" label="name" :reduce="category => category.id" v-model="filters.category" />
						</b-field>

						<b-field v-if="isFilterRequestingBranch" label="Requesting Branch" custom-class="font-semibold text-xs no-mb-labels" class="w-full text-xs">
							<v-select :disabled="isDisableReqBranch" :options="branches" label="name" :reduce="branch => branch.code" v-model="filters.request_branch" />
						</b-field>

						<b-field v-if="isFilterFulfillingBranch" label="Fulfilling Branch" custom-class="font-semibold text-xs no-mb-labels" class="w-full text-xs">
							<v-select :disabled="isDisableFulBranch" :options="branches" label="name" :reduce="branch => branch.code" v-model="filters.fulfilled_branch" />
						</b-field>

						<b-button type="is-primary" size="is-small" icon-left="clipboard-text-play-outline" expanded @click="PreviewReport">Preview Report</b-button>
					</div>

				</div>
			</div>

			<div id="report-doc-wrapper" class="w-full bg-gray-300 p-2">
				<iframe width="100%" style="height:calc(100vh - 125px); overflow-y:scroll;" :src="generatedReport.url" frameborder="0" class="shadow bg-white" />
			</div>

		</div>

	</div>
</template>

<script>
	import { mapActions, mapMutations, mapGetters } from 'vuex'
	import dayjs from 'dayjs'
	import { saveAs } from 'file-saver'

	export default {
		components: {},
		computed: {
			...mapGetters({
				selectedBranch: 'getSelectedBranch',
				customers: 'partners/getCustomers',
				suppliers: 'partners/getSuppliers',
				invoices: 'sales/getSalesInvoices',
				purchases: 'purchases/getPurchaseOrders',
				categories: 'masterdatas/getCategories'
			})
		},
		data() {
			return {
				report: {
					name: null,
					dateperiod: null,
					generated: null
				},

				selected_reptmodule: {},
				selected_repttemplate: {},
				reportTemplates: [],

				isDisableReqBranch: false,
				isDisableFulBranch: false,

				generatedReport: {},

				branches: [
					{ code: 'SG', name: 'Solidgold' },
					{ code: 'EG', name: 'Evergold' },
					{ code: 'GM', name: 'Goldmaster' },
					{ code: 'HM', name: 'Homemaster' }
				],

				pdfPageOrientation: null,

				rept_modules: [
					{ name: 'Sales', code: 'sales', desc: 'Sales module reporting' },
					{ name: 'Purchase', code: 'purchase', desc: 'Purchase module reporting' },
					{ name: 'Stocks', code: 'stocks', desc: 'Stocks module reporting' },
					{ name: 'Admin', code: 'admin', desc: 'Admin module reporting' }
				],

				rept_templates: [
					/* Date filter is default to all reports */

					/* Sales */

					{
						code: 'sales',
						name: 'Sales by Customer Summary',
						rept_code: 'sales-by-customer-summary',
						rept_tpl: 'sales_by_customer_summary',
						filters: ['date', 'customer'],
						orientation: 'portrait'
					},
					{
						code: 'sales',
						name: 'Sales by Product Category Summary',
						rept_code: 'sales-by-item-group-summary',
						rept_tpl: 'sales_by_item_category_summary',
						filters: ['category'],
						orientation: 'portrait'
					},
					{
						code: 'sales',
						name: 'Sales by Customer Detailed',
						rept_code: 'sales-by-item-group-detailed',
						rept_tpl: 'sales_by_customer_detailed',
						filters: ['date', 'customer'],
						orientation: 'portrait'
					},

					{ code: 'sales', name: 'Sales with Discount', rept_code: 'sales-with-discount', rept_tpl: 'sales_with_discount', filters: ['date', 'customer'], orientation: 'portrait' },
					{ code: 'sales', name: 'Sales Account Receivables', rept_code: 'sales-account-receivables', rept_tpl: 'account_receivables', filters: ['customer'], orientation: 'portrait' },
					{ code: 'sales', name: 'Profit and Loss Summary', rept_code: 'profit-and-loss-summary', rept_tpl: 'profit_loss_summary', filters: ['date'], orientation: 'portrait' },
					{ code: 'sales', name: 'Profit and Loss Detailed', rept_code: 'profit-and-loss-detailed', rept_tpl: 'profit_loss_detailed', filters: ['date', 'customer', 'invoice'], orientation: 'portrait' },

					{ code: 'sales', name: 'Charge Account Report', rept_code: 'charge-account-report', rept_tpl: 'charge_account_report', filters: ['date', 'customer', 'invoice'], orientation: 'portrait' },
					{ code: 'sales', name: 'Charge Payment Report', rept_code: 'charge-payment-report', rept_tpl: 'charge_payment_report', filters: ['date', 'customer', 'invoice'], orientation: 'portrait' },
					{ code: 'sales', name: 'Sales Return Report', rept_code: 'sales-return-report', rept_tpl: 'sales_return_report', filters: ['date', 'customer', 'invoice'], orientation: 'portrait' },

					/* Purchase */

					{
						code: 'purchase',
						name: 'Purchase Order By Supplier Summary',
						rept_code: 'purchase-order-by-supplier-summary',
						rept_tpl: 'po_by_supplier_summary',
						filters: ['date', 'supplier'],
						orientation: 'portrait'
					},
					{
						code: 'purchase',
						name: 'Purchase Order by Supplier Detailed Summary',
						rept_code: 'purchase-order-by-supplier-detailed-summary',
						rept_tpl: 'po_by_supplier_detailed_summary',
						filters: ['date', 'supplier'],
						orientation: 'portrait'
					},

					{
						code: 'purchase',
						name: 'Purchase Order by Item Detailed',
						rept_code: 'purchase-order-by-item-detailed-summary',
						rept_tpl: 'po_by_item_detailed',
						filters: ['date', 'category'],
						orientation: 'portrait'
					},
					{ code: 'purchase', name: 'Open Purchase Order Summary', rept_code: 'open-purchase-order-summary', rept_tpl: 'open_po_summary', filters: ['date', 'supplier'], orientation: 'portrait' },
					{ code: 'purchase', name: 'Purchase Account Payables', rept_code: 'purchase-payables-summary', rept_tpl: 'account_payables', filters: ['supplier'], orientation: 'portrait' },

					/* Inventory */

					{ code: 'stocks', name: 'Low Quantity Items', rept_code: 'low-quantity-items', rept_tpl: 'low_quantity_items', filters: ['category'], orientation: 'portrait' },
					{
						code: 'stocks',
						name: 'Total Warehouse Stocks Summary',
						rept_code: 'total-warehouse-stocks-summary',
						rept_tpl: 'total_warehouse_stock_summary',
						filters: ['date', 'category', 'product_code'],
						orientation: 'portrait'
					},
					{ code: 'stocks', name: 'Inventory Detailed Summary', rept_code: 'inventory-detailed-summary', rept_tpl: 'inventory_detailed_summary', filters: ['category'], orientation: 'portrait' },

					{
						code: 'stocks',
						name: 'Stock Transfer - Incoming',
						rept_code: 'stock-transfer',
						rept_tpl: 'stock_transfer',
						filters: ['date', 'request_branch', 'fulfilled_branch'],
						orientation: 'portrait'
					},

					{
						code: 'stocks',
						name: 'Stock Transfer - Outgoing',
						rept_code: 'stock-transfer-outgoing',
						rept_tpl: 'stock_transfer_outgoing',
						filters: ['date', 'request_branch', 'fulfilled_branch'],
						orientation: 'portrait'
					},

					/* Admin */

					{ code: 'admin', name: 'User Logs', rept_code: 'user-logs', rept_tpl: 'user_logs', filters: ['date'], orientation: 'portrait' }
				],

				reptFilterDates: [],

				filters: {
					dateperiod: [],
					customer: null,
					supplier: null,
					invoice_no: null,
					po_number: null,
					category: null,
					request_branch: null,
					fulfilled_branch: null
				},

				// customer
				// date
				// category
				// supplier
				// product code
				// requester (branch)
				// fulfilled
				// invoice

				isFilterDate: false,
				isFilterCustomer: false,
				isFilterSupplier: false,
				isFilterInvoiceNo: false,
				isFilterPONo: false,
				isFilterCategory: false,
				isFilterRequestingBranch: false,
				isFilterFulfillingBranch: false,

				pdf_url: null
			}
		},

		methods: {
			...mapActions({
				GenerateReport: 'GenerateReport',
				GeneratePdf: 'GeneratePdf',

				GetCustomers: 'partners/GetCustomers',
				GetSuppliers: 'partners/GetSuppliers',
				GetPurchaseOrders: 'purchases/GetPurchaseOrders',

				GetInvoices: 'sales/GetSalesInvoices',
				GetPurchases: 'purchases/GetPurchaseOrders',

				GetCategories: 'masterdatas/GetCategories'
			}),

			...mapMutations({
				// PushAddSalesOrder: 'sales/add'
			}),

			DateFormatter(dates) {
				//array of dates
				var date1 = dayjs(dates[0]).format('MMM-DD-YYYY')
				var date2 = dayjs(dates[1]).format('MMM-DD-YYYY')
				return date1 + ' to ' + date2
			},

			DateSelected() {
				this.filters.dateperiod = []
				this.filters.dateperiod.push(dayjs(this.reptFilterDates[0]).format('YYYY-MM-DD'))
				this.filters.dateperiod.push(dayjs(this.reptFilterDates[1]).format('YYYY-MM-DD'))
			},

			SelectedReportModule() {
				this.reportTemplates = this.rept_templates.filter((item) => {
					return item.code == this.selected_reptmodule.code
				})
			},

			SelectedReportTemplate() {
				let filters = this.selected_repttemplate.filters

				//read the filters
				this.isFilterDate = filters.includes('date')
				this.isFilterCustomer = filters.includes('customer')
				this.isFilterSupplier = filters.includes('supplier')
				this.isFilterInvoiceNo = filters.includes('invoice_no')
				this.isFilterPONo = filters.includes('po_number')
				this.isFilterCategory = filters.includes('category')
				this.isFilterRequestingBranch = filters.includes('request_branch')
				this.isFilterFulfillingBranch = filters.includes('fulfilled_branch')

				// init the date period
				this.DateSelected()

				//read the default orientation
				this.pdfPageOrientation = this.selected_repttemplate.orientation

				//check branches

				//console.log(this.isFilterRequestingBranch);
				if (this.selected_repttemplate.rept_code === 'stock-transfer') {
					this.filters.request_branch = this.selectedBranch.branch_code
					this.isDisableReqBranch = true
				} else {
					this.filters.request_branch = null
					this.isDisableReqBranch = false
				}

				//console.log(this.isFilterRequestingBranch);
				if (this.selected_repttemplate.rept_code === 'stock-transfer-outgoing') {
					this.filters.fulfilled_branch = this.selectedBranch.branch_code
					this.isDisableFulBranch = true
				} else {
					this.filters.fulfilled_branch = null
					this.isDisableFulBranch = false
				}
			},

			async PreviewReport() {
				// normalized the filters
				const filters = {}
				let report_dateperiod = dayjs().format('MMM-DD-YYYY')
				if (this.filters.dateperiod.length > 0) {
					// check if the date is the same, if yes then send 1 only
					if (this.filters.dateperiod[0] === this.filters.dateperiod[1]) {
						report_dateperiod = dayjs(this.filters.dateperiod[0]).format('MMM-DD-YYYY')
						//filters['date'] = [this.filters.dateperiod[0]]
						filters['date'] = this.filters.dateperiod
					} else {
						report_dateperiod = dayjs(this.filters.dateperiod[0]).format('MMM-DD-YYYY') + ' to ' + dayjs(this.filters.dateperiod[1]).format('MMM-DD-YYYY')
						filters['date'] = this.filters.dateperiod
					}
				}

				if (this.isFilterCustomer && this.filters.customer) {
					filters['customer'] = this.filters.customer
				}

				if (this.isFilterSupplier && this.filters.supplier) {
					filters['supplier'] = this.filters.supplier
				}

				if (this.isFilterInvoiceNo && this.filters.invoice_no) {
					filters['invoice_no'] = this.filters.invoice_no
				}

				if (this.isFilterPONo && this.filters.po_number) {
					filters['po_number'] = this.filters.po_number
				}

				if (this.isFilterCategory && this.filters.category) {
					filters['category'] = this.filters.category
				}

				if (this.isFilterRequestingBranch && this.filters.request_branch) {
					filters['request_branch'] = this.filters.request_branch
				}

				if (this.isFilterFulfillingBranch && this.filters.fulfilled_branch) {
					filters['fulfilled_branch'] = this.filters.fulfilled_branch
				}

				const payload = {
					rept_title: this.selected_repttemplate.name,
					rept_code: this.selected_repttemplate.rept_code,
					rept_tpl: this.selected_repttemplate.rept_tpl,
					branch: this.selectedBranch,
					report_dateperiod: report_dateperiod,
					filters: filters
				}

				const result = await this.GenerateReport(payload)
				if (result.status === 'ok') {
					this.generatedReport = result.data
				}
			},

			// PrintReport() {
			// 	window.print()
			// },

			async GenerateReportPdf() {
				const payload = {
					filename: this.generatedReport.filename,
					orientation: this.pdfPageOrientation
				}
				const result = await this.GeneratePdf(payload)

				this.pdf_url = result.data.url
				window.open(this.pdf_url, '_blank', 'location=yes,height=768,width=800,scrollbars=yes,status=yes')

				//saveAs(result.data.url)
			}
		},
		mounted() {
			this.GetCustomers()
			this.GetSuppliers()
			this.GetInvoices()
			this.GetPurchases()
			this.GetCategories()
		}
	}
</script>

<style>
</style>
