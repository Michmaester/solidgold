<template>
	<div>
		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">
			<h3 class="has-text-header">Return & Exchange</h3>
			<div class="flex items-center">
				<b-button type="is-primary" icon-left="plus" class="is-small text-white" @click="CreateNewSalesReturn">New Sales Return</b-button>
				<b-button type="is-primary" icon-left="printer" class="is-small px-4 ml-1" @click="Print">Print</b-button>
			</div>
		</div>

		<div class="grid grid-cols-8 gap-4 p-4">
			<div class="col-span-8">
				<b-tabs type="is-boxed" size="is-small" v-model="selected_tab">
					<b-tab-item label="Sales Returns" class="wrapper-h-tab">
						<template slot="header">
							<div class="px-6 flex items-center">
								<b-icon icon="transfer"></b-icon>
								<span class="font-semibold">Sales Returns</span>
							</div>
						</template>
						<div class="w-full text-sm p-2">

							<b-table :striped="true" :narrowed="true" :hoverable="true" :loading="loading" paginated backend-pagination :pagination-rounded="false" pagination-size="is-small" :total="totalDataCount" :per-page="pageSize" @page-change="onPageChange" backend-sorting :default-sort-direction="defaultSortOrder" :default-sort="[sortField, sortOrder]" @sort="onSort" sort-icon="arrow-up" sort-icon-size="is-small" :pagination-simple="false" :pagination-position="'top'" :selected.sync="selected_salesreturn" @select="SelectedSalesReturn" :data="salesReturns">
								<template slot="top-left">
									<div class="flex">

										<client-only>

											<b-field label="Date" custom-class="text-xs no-mb-labels font-semibold" class="w-40 mr-1">
												<b-datepicker v-model="filterDate" icon="calendar-month-outline" @input="FilterByDate" size="is-small" trap-focus>
													<p v-if="filterDate != null" class="control">
														<b-button type="is-danger" size="is-small" @click="FilterByDate(null)" icon-left="close">Clear</b-button>
													</p>
												</b-datepicker>
											</b-field>

											<b-field label="Invoice No." custom-class="font-semibold text-xs no-mb-labels" class="w-40 text-xs mr-1">
												<b-input type="primary" size="is-small" v-model="filterInvoice" @input="FilterByInvoice"></b-input>
											</b-field>

											<b-field label="Customers" custom-class="font-semibold text-xs no-mb-labels" class="text-xs mr-1" style="width:300px;">
												<v-select :options="customers" label="name" v-model="filterCustomer" :reduce="customer => customer.customer_id" @input="FilterByCustomer" />
											</b-field>

										</client-only>

									</div>
								</template>

								<b-table-column field="sales_return_code" label="Return Code" v-slot="props">
									<p class="cursor-pointer underline font-bold hover:text-blue-500" @click="ShowDetailsModal">{{ props.row.sales_return_code }}</p>
								</b-table-column>
								<b-table-column field="invoice_no" label="Invoice No." v-slot="props">
									{{ props.row.invoice_no }}
								</b-table-column>
								<b-table-column field="return_date" label="Return Date" v-slot="props">
									{{ props.row.return_date }}
								</b-table-column>
								<b-table-column field="customer.name" label="Customer" v-slot="props">
									{{ props.row.customer.name }}
								</b-table-column>

								<b-table-column field="customer.name" label="Ret. Amt." v-slot="props">
									{{ $formatAmount(props.row.total_returned_amount) }}
								</b-table-column>

								<b-table-column field="customer.name" label="Rep. Amt." v-slot="props">
									{{ $formatAmount(props.row.total_replaced_amount) }}
								</b-table-column>

								<b-table-column field="balance_replacement_amount" label="Balance Rep. Amt." v-slot="props">
									{{ $formatAmount(props.row.balance_replacement_amount) }}
								</b-table-column>
								<b-table-column field="cash_tend" label="Cash Tend" v-slot="props">
									{{ props.row.cash_tend }}
								</b-table-column>
								<b-table-column label="Status" v-slot="props">
									{{ props.row.status }}
								</b-table-column>
								<b-table-column label="Type" v-slot="props">
									{{ props.row.type }}
								</b-table-column>

							</b-table>
						</div>
					</b-tab-item>

					<b-tab-item label="Form" class="wrapper-h-tab">
						<template slot="header">
							<div class="px-6 flex items-center">
								<b-icon icon="format-columns"></b-icon>
								<span class="font-semibold">Form</span>
							</div>
						</template>
						<div class="flex flex-col w-full text-xs p-2">

							<div class="bg-gray-700 p-4 flex justify-between items-center">
								<div class="flex items-center text-sm text-white">
									<b-radio :disabled="isDisableSrTypeSelection" v-model="sr_type" class="hover:text-white mr-4" name="return_exchange" native-value="return_exchange">Return with Exchange</b-radio>
									<b-radio :disabled="isDisableSrTypeSelection" v-model="sr_type" class="hover:text-white mr-4" name="return_exchange_incomplete" native-value="return_exchange_incomplete">Return + Exchange(Next)</b-radio>
									<b-radio :disabled="isDisableSrTypeSelection" v-model="sr_type" class="hover:text-white mr-4" name="return" native-value="return">Return Only</b-radio>
								</div>
								<div>
									<b-button v-if="isFormCreate" :disabled="!isAllowSubmitSalesReturn" type="is-success" icon-left="plus" class="is-small text-white px-4" @click="SubmitSalesReturn">Submit Sales Return</b-button>
									<b-button v-if="!isFormCreate" :disabled="!isAllowSubmitSalesReturn" type="is-success" icon-left="plus" class="is-small text-white px-4" @click="ConfirmUpdateSalesReturn">Update Sales Return</b-button>
								</div>
							</div>
							<div class="flex">

								<div class="w-2/3 p-2 bg-gray-200 flex">

									<client-only>
										<b-field label="Invoice No." custom-class="font-semibold text-xs no-mb-labels" class="w-40 text-xs mr-3">
											<v-select :disabled="isSelectInvoiceDisabled" :options="salesInvoices" label="invoice_no" v-model="selected_invoice" @input="SelectedInvoice" :reduce="invoice => invoice.invoice_no" />
										</b-field>
									</client-only>

									<div v-if="form_sales_return.invoice_no != null">
										<p class="font-bold">Customer Name : {{ form_sales_return.customer_name }}</p>
										<p>Return total : {{ $formatAmountCurrency(return_items_total_amount) }}</p>
										<p>Replace total : {{ $formatAmountCurrency(replace_items_total_amount) }}</p>
									</div>
								</div>

								<div class="w-1/3 flex bg-gray-400 p-2">
									<b-field label="Sales Return #" custom-class="text-xs" class="mr-2">
										<b-input disabled size="is-small" type="text" class="w-32" value="System Generated"></b-input>
									</b-field>

									<b-field label="Balance" custom-class="text-xs" class="w-32 mr-2">
										<b-input disabled size="is-small" type="text" v-model="form_sales_return.balance_replacement_amount"></b-input>
									</b-field>

									<b-field label="Cash Tend" custom-class="text-xs" class="w-32 mr-2">
										<b-input :disabled="!isNeedCashTend" size="is-small" type="text" v-model="form_sales_return.cash_tend" @input="CashTendValueChange"></b-input>
									</b-field>

								</div>

							</div>

							<div class="flex flex-col w-full mt-4">
								<!-- <div class="flex flex-col mr-2"> -->

								<div class="flex">
									<h4 class="text-sm font-bold has-text-primary">Items Available for Return</h4>
								</div>
								<div class="w-full">
									<b-table :bordered="false" :striped="true" sticky-header :narrowed="true" :hoverable="true" :loading="false" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="false" :per-page="10" current-page.sync="1" :pagination-simple="true" :pagination-position="'top'" pagination-size="is-small" :data="form_return_items">
										<template slot="top-left">

										</template>

										<b-table-column v-slot="props" field="product_name" label="Product" width="400" class="cell-valign-middle">
											<div class="flex flex-col mb-2 leading-tight">
												<p class="text-sm"><span class="font-bold text-red-500 mr-2">{{ props.row.product_code }}</span> {{ props.row.product_name }}</p>
												<p class="text-xs">{{ props.row.product_description }} / {{ props.row.brand }}</p>
											</div>
										</b-table-column>

										<b-table-column v-slot="props" field="unit" label="Unit" class="cell-valign-middle">
											{{ props.row.unit }}
										</b-table-column>
										<b-table-column v-slot="props" field="price_per_unit" label="Price per Unit" width="100" class="cell-valign-middle">
											{{ props.row.price_per_unit }}
										</b-table-column>

										<b-table-column v-slot="props" field="trans_quantity" label="Quantity" class="cell-valign-middle">
											{{ props.row.trans_quantity }}
										</b-table-column>

										<b-table-column v-slot="props" field="" label="Qty. To Return" width="150">
											<b-field>
												<b-numberinput min="0" :max="props.row.trans_quantity" v-model="props.row.return_quantity" size="is-small" controls-position="compact" expanded @input="ReturnItemQuantityChange(props)"></b-numberinput>
											</b-field>
										</b-table-column>

										<b-table-column v-slot="props" field="return_item_total_amount" label="Return Total" class="cell-valign-middle">
											{{ props.row.return_item_total_amount }}
										</b-table-column>
									</b-table>
								</div>

								<div class="w-full mt-4">
									<div class="flex items-center">
										<h4 class="text-sm font-bold has-text-primary">Items to Replace</h4>
										<b-button class="is-primary ml-4" size="is-small" icon-left="plus" @click="AddItemsRow">Add</b-button>
									</div>
									<b-table :bordered="false" :striped="true" height="250" sticky-header :narrowed="true" :hoverable="true" :loading="false" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="false" :per-page="10" current-page.sync="1" :pagination-simple="true" :pagination-position="'top'" pagination-size="is-small" :data="form_replace_items">
										<template slot="top-left">

										</template>

										<b-table-column v-slot="props" field="name" label="Product" width="400" class="cell-valign-middle">
											<!-- <client-only>
												<b-field>
													<v-select :options="products" label="name" maxHeight="100px" v-model="props.row.product" @input="ReplaceProductSelected(props)" />
												</b-field>
											</client-only> -->
											<client-only placeholder="Loading...">
												<b-field custom-class="font-semibold text-xs no-mb-labels" class="text-xs" style="width:400px;">

													<v-select label="name" :filterable="false" :appendToBody="true" :options="productOptions" @search="onProductSearch" v-model="props.row.product" @input="ReplaceProductSelected(props)">
														<template slot="no-options">
															type Code/Name to search products..
														</template>
														<template slot="option" slot-scope="option">
															<div class="flex flex-col mb-2 leading-tight">
																<p class="text-sm"><span class="font-bold text-red-500 mr-2">{{ option.product_code }}</span> {{ option.name }}</p>
																<p v-if="option.brand && option.unit" class="text-xs">{{ option.description }} / {{ option.brand.brandname }} / {{ option.unit.item_unit }}</p>
															</div>
														</template>
														<template slot="selected-option" slot-scope="option">
															<div class="selected d-center">
																<p>{{ option.product_code }}-{{ option.name }}-{{ option.description }}</p>
															</div>
														</template>
													</v-select>
												</b-field>
											</client-only>
										</b-table-column>

										<b-table-column v-slot="props" field="unit" label="Unit" class="cell-valign-middle">
											<b-input disabled size="is-small" type="is-primary" expanded :value="props.row.unit"></b-input>
										</b-table-column>

										<b-table-column v-slot="props" field="price_per_unit" label="Price per Unit" width="100" class="cell-valign-middle">
											<b-field>
												<b-input disabled size="is-small" type="is-primary" expanded :value="props.row.price_per_unit"></b-input>
											</b-field>
										</b-table-column>

										<b-table-column v-slot="props" field="replace_quantity" label="Quantity" class="cell-valign-middle" width="150">
											<b-field>
												<b-numberinput min="0" :max="props.row.stock_onhand" size="is-small" controls-position="compact" expanded v-model="props.row.replace_quantity" @input="ReplaceItemQuantityChange(props)"></b-numberinput>
											</b-field>
										</b-table-column>

										<b-table-column v-slot="props" field="item_total_amount" label="Replace Total" class="cell-valign-middle">
											<b-field>

												<b-input disabled size="is-small" type="is-primary" expanded :value="props.row.replace_item_total_amount"></b-input>
											</b-field>
										</b-table-column>

										<b-table-column v-slot="props" field="" label="Action">
											<b-field>
												<b-button class="is-danger" size="is-small" icon-left="trash-can-outline" @click="RemoveItemsRow(props.index)"></b-button>
											</b-field>
										</b-table-column>
									</b-table>
								</div>

								<!-- </div> -->
							</div>
						</div>
					</b-tab-item>
				</b-tabs>
			</div>
		</div>

		<b-modal :active.sync="isModalDetailsShow" has-modal-card trap-focus :width="1000" @close="CloseDetailsModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1000px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-semibold text-white">Sales Return Details</p>
					<div>
						<a href="#" @click.prevent="CloseDetailsModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div class="flex flex-col text-sm">
						<div class="flex items-center justify-between mb-6">
							<div class="w-2/4">
								<p class="font-bold">Sales Return No. : <span class="font-normal underline">{{ selected_salesreturn.sales_return_code }}</span></p>
								<p class="font-bold">Date : <span class="font-normal">{{ $formatDateByFormat(selected_salesreturn.return_date,'MMM-DD-YYYY @ HH:mm:ss') }}</span></p>
								<p class="font-bold">Customer : <span class="font-normal">{{ selected_salesreturn.customer_name }}</span></p>
							</div>

							<div class="w-1/4">
								<p class="font-bold">Invoice No. : <span class="font-normal">{{ selected_salesreturn.invoice_no }}</span></p>
								<p class="font-bold">Type : <span class="font-normal">{{ selected_salesreturn.type }}</span></p>
								<p class="font-bold">Status : <span class="font-normal">{{ selected_salesreturn.status }}</span></p>
							</div>

							<div class="w-1/4">
								<p class="font-bold">Total Returned : <span class="font-normal">{{ $formatAmountCurrency(selected_salesreturn.total_returned_amount) }}</span></p>
								<p class="font-bold">Total Replaced : <span class="font-normal">{{ $formatAmountCurrency(selected_salesreturn.total_replaced_amount) }}</span></p>
								<b-button v-show="selected_salesreturn.status === 'INCOMPLETE'" type="is-primary" icon-left="playlist-edit" size="is-small" @click="EditSalesReturn">Edit Sales Return/Exchange</b-button>
							</div>

						</div>

						<b-table :striped="true" sticky-header :narrowed="true" sort-icon="arrow-up" sort-icon-size="is-small" :data="selected_detail_items">

							<b-table-column v-slot="props" label="Product" class="cell-valign-middle">
								<div class="flex flex-col leading-tight">
									<p><span class="font-semibold text-red-500 mr-2">{{ props.row.product.product_code }}</span>{{ props.row.product.name }}</p>
									<p>{{ props.row.product.description }} - {{ props.row.product.brand.brandname }} - {{ props.row.product.unit.item_unit }}</p>
								</div>
							</b-table-column>

							<b-table-column v-slot="props" label="Quantity" class="cell-valign-middle">
								{{ props.row.quantity }}
							</b-table-column>
							<b-table-column v-slot="props" label="Price per Unit" class="cell-valign-middle">
								{{ props.row.price_per_unit }}
							</b-table-column>
							<b-table-column v-slot="props" label="Replace" class="cell-valign-middle">
								<p v-if="props.row.is_replace == 1">Yes</p>
							</b-table-column>

						</b-table>
					</div>

				</section>

			</div>
		</b-modal>
	</div>
</template>

<script>
	import { mapActions, mapMutations, mapGetters } from 'vuex'
	import { debounce } from 'lodash'
	import dayjs from 'dayjs'

	export default {
		components: {},
		meta: {
			module: 'return-exchange'
		},

		computed: {
			...mapGetters({
				customers: 'partners/getCustomers',

				// salesReturns: 'sales/getSalesReturns',
				salesInvoices: 'sales/getSalesInvoices',
				salesTransaction: 'sales/getSalesTransaction',

				products: 'products/getProducts'
			})
		},

		watch: {
			salesTransaction(newValue, oldValue) {
				this.sales_transaction = newValue
			}
		},

		data() {
			return {
				tbl_invoiceitems_columns: [
					{ field: 'product.name', label: 'Product' },
					{ field: 'qty', label: 'Qty' },
					{ field: 'unit', label: 'Unit' },
					{ field: 'price_per_unit', label: 'Price Per Unit' }
				],

				tbl_salesreturns_columns: [
					{
						field: 'sales_return_code',
						label: 'Return Code',
						width: '150',
						sortable: true
					},
					{ field: 'invoice_no', label: 'Invoice No.' },
					{ field: 'return_date', label: 'Return Date' },
					{ field: 'customer', label: 'Customer' },
					{ field: 'balance_replacement_amount', label: 'Balance Rep. Amount' },
					{ field: 'cash_tend', label: 'Cash Tend' }
				],

				selected_salesreturn: {},
				selected_detail_items: [],
				selected_invoice: null,

				invoiceItems: [],
				checked_tobe_returned_items: [],

				salesReturns: [],
				totalDataCount: 0,
				loading: false,
				sortField: 'id',
				sortOrder: 'desc',
				defaultSortOrder: 'desc',
				page: 1,
				pageSize: 10,

				filters: [],

				filterDate: null,
				filterInvoice: null,
				filterCustomer: null,

				form_return_items: [],
				form_replace_items: [],

				productOptions: [],

				return_items_total_amount: 0,
				replace_items_total_amount: 0,

				form_sales_return: {
					sales_return_code: null,
					invoice_no: null,
					return_date: null,
					customer_id: null,
					customer_name: null,

					balance_replacement_amount: 0,
					total_returned_amount: 0,
					total_replaced_amount: 0,
					returned_replace_diff_amount: 0,
					cash_tend: null,
					branch_code: this.$store.state.selectedBranch.branch_code
				},

				isAllowSubmitSalesReturn: false,
				isNeedCashTend: false,
				isModalDetailsShow: false,

				selected_tab: 0,

				sales_transaction: {},

				isSelectInvoiceDisabled: false,

				isFormCreate: true,

				sr_type: 'return_exchange',
				isDisableSrTypeSelection: false
			}
		},

		methods: {
			...mapActions({
				GetCustomers: 'partners/GetCustomers',

				GetSalesReturns: 'sales/GetSalesReturns',
				GetSalesInvoices: 'sales/GetSalesInvoices',
				GetSalesTransaction: 'sales/GetSalesTransaction',
				GetProducts: 'products/GetProducts',
				GetSingleProduct: 'products/GetSingleProduct',

				InsertSalesReturn: 'sales/InsertSalesReturn',
				UpdateSalesReturn: 'sales/UpdateSalesReturn',

				GetProductStock: 'products/GetProductStock',

				SearchProductsByCode: 'products/SearchProductsByCode'
			}),

			...mapMutations({}),

			SelectedSalesReturn(data) {
				this.selected_salesreturn = data
				this.selected_detail_items = data.items
			},

			CreateNewSalesReturn() {
				this.isDisableSrTypeSelection = false
				this.isFormCreate = true
				this.isAllowSubmitSalesReturn = false
				this.isSelectInvoiceDisabled = false
				this.selected_tab = 1
				this.sr_type = 'return_exchange'
				this.ClearSalesReturnForm()
			},

			ClearSalesReturnForm() {
				this.$setObjectPropNull(this.form_sales_return, null)
				this.form_return_items = []
				this.form_replace_items = []

				this.selected_invoice = null
			},

			async SelectedInvoice(data) {
				if (data) {
					this.isAllowSubmitSalesReturn = false

					const res = await this.GetSalesTransaction(data)
					this.invoiceItems = res.trans_items

					this.form_sales_return.customer_id = res.customer.customer_id
					this.form_sales_return.customer_name = res.customer.name
					this.form_sales_return.invoice_no = res.invoice_no

					// map it

					this.form_return_items = this.invoiceItems.map((item) => {
						return {
							product_id: item.product_id,
							product_name: item.product.name,
							product_code: item.product.product_code,
							product_description: item.product.description,
							unit: item.unit,
							brand: item.product.brand.brandname,
							price_per_unit: item.price_per_unit,
							trans_quantity: item.qty,
							return_item_total_amount: 0,
							return_quantity: 0
						}
					})
				}
			},

			AddItemsRow() {
				var item = {
					product: null,
					product_id: null,
					product_name: null,
					unit: null,
					price_per_unit: null,
					replace_quantity: null,
					replace_item_total_amount: null,
					stock_onhand: 0
				}

				this.form_replace_items.push(item)
			},

			RemoveItemsRow(index) {
				this.form_replace_items.splice(index, 1)
			},

			async ReplaceProductSelected(data) {
				let product = data.row.product
				var idx = data.index

				if (product) {
					const product_stock = await this.GetProductStock({ product_id: product.product_id })

					this.form_replace_items[idx].product_id = product.product_id
					this.form_replace_items[idx].product_name = product.name
					this.form_replace_items[idx].unit = product.unit.item_unit
					this.form_replace_items[idx].price_per_unit = product.price.retail
					this.form_replace_items[idx].stock_onhand = product_stock.onhand_qty
				} else {
					this.RemoveItemsRow(idx)
				}
			},

			ReturnItemQuantityChange(data) {
				//calculate item total amount
				let idx = data.index
				let return_item_total_amount = parseFloat(data.row.return_quantity) * parseFloat(data.row.price_per_unit)
				this.form_return_items[idx].return_item_total_amount = return_item_total_amount.toFixed(2)
				this.return_items_total_amount = this.$calculateTotals(this.form_return_items, 'return_item_total_amount')
				this.CalculateSalesReturnBalance()
			},

			ReplaceItemQuantityChange(data) {
				//calculate item total amount
				var idx = data.index
				var replace_item_total_amount = data.row.replace_quantity * data.row.price_per_unit
				this.form_replace_items[idx].replace_item_total_amount = replace_item_total_amount
				this.replace_items_total_amount = this.$calculateTotals(this.form_replace_items, 'replace_item_total_amount')

				this.CalculateSalesReturnBalance()
			},

			CalculateSalesReturnBalance() {
				if (parseFloat(this.return_items_total_amount) < parseFloat(this.replace_items_total_amount)) {
					this.isNeedCashTend = true
					this.isAllowSubmitSalesReturn = false
					// calculate balance
					this.form_sales_return.balance_replacement_amount = Math.abs(this.return_items_total_amount - this.replace_items_total_amount)
				} else {
					this.isAllowSubmitSalesReturn = true
					this.isNeedCashTend = false
					this.form_sales_return.balance_replacement_amount = 0
					// this.form_sales_return.balance_replacement_amount = Math.abs(this.return_items_total_amount - this.replace_items_total_amount)
					this.form_sales_return.returned_replace_diff_amount = parseFloat(this.return_items_total_amount) - parseFloat(this.replace_items_total_amount)
				}

				this.form_sales_return.total_returned_amount = this.return_items_total_amount
				this.form_sales_return.total_replaced_amount = this.replace_items_total_amount
			},

			async SubmitSalesReturn() {
				let tag = null
				let message = null

				//Added for other types of the process

				//check the sr_type

				if (this.sr_type === 'return_exchange') {
					if (this.form_replace_items.length <= 0 || this.form_sales_return.length <= 0) {
						//prompt error
						this.$buefy.dialog.alert({
							title: 'Error',
							message: 'You are performing a complete <b>Return with Exchange</b>. Check [return items] and [replace items] should be complete.',
							type: 'is-danger',
							hasIcon: true
						})

						return true
					} else {
						//proceed with the process
					}
				}

				// //Check if this will be a complete return + exchange

				switch (this.sr_type) {
					case 'return_exchange':
						tag = 'COMPLETE'
						message = 'Are you sure you want to <b>Add</b> this Sales Return/Exchange? This action cannot be undone. Kindly double check the details before confirming.'
						break

					case 'return_exchange_incomplete':
						tag = 'INCOMPLETE'
						message =
							'You are performing an <b>INCOMPLETE Return and Exchange</b>. Are you sure you want to proceed and mark it as <b class="text-red-400">INCOMPLETE</b> ? <br/> This action cannot be undone. Kindly double check the details before confirming.'
						break

					case 'return':
						tag = 'RETURN_ONLY'
						message = 'You are performing a <b>RETURN ONLY</b>. Are you sure you want to proceed? This action cannot be undone. Kindly double check the details before confirming.'
						break

					default:
						break
				}

				const payload = {
					sales_return: this.form_sales_return,
					returns: this.form_return_items,
					replaces: this.form_replace_items,
					tag: tag
				}

				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: message,
					confirmText: 'Confirm Action',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					const res = await this.InsertSalesReturn(payload)
					if (res.status == 'ok') {
						this.ClearSalesReturnForm()
						this.selected_tab = 0
						this.LoadAsyncData()
					}
				}
			},

			async ConfirmUpdateSalesReturn() {
				let tag = null
				let message = null

				//Check if this will be a complete return + exchange

				if (this.form_replace_items.length <= 0 || this.form_sales_return.length <= 0) {
					//incomplete details
					tag = 'INCOMPLETE'
					message =
						'Weve detected that this Return/Exchange cannot be completed. Are you sure you want to proceed and mark it as <b class="text-red-400">INCOMPLETE</b> ? <br/> This action cannot be undone. Kindly double check the details before confirming.'
				} else {
					tag = 'COMPLETE'
					message = 'Are you sure you want to <b>Update</b> this Sales Return/Exchange? This action cannot be undone. Kindly double check the details before confirming.'
				}

				const payload = {
					sales_return: this.form_sales_return,
					returns: this.form_return_items,
					replaces: this.form_replace_items,
					tag: tag
				}

				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: message,
					confirmText: 'Confirm Action',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					const res = await this.UpdateSalesReturn(payload)
					if (res.status == 'ok') {
						this.ClearSalesReturnForm()
						this.selected_tab = 0
						this.LoadAsyncData()
					}
				}
			},

			ShowDetailsModal() {
				this.isModalDetailsShow = true
			},

			CloseDetailsModal() {
				this.isModalDetailsShow = false
			},

			CashTendValueChange() {
				var tend = this.form_sales_return.cash_tend
				var balance = this.form_sales_return.balance_replacement_amount
				if (parseFloat(tend) >= parseFloat(balance)) {
					this.isAllowSubmitSalesReturn = true
				} else {
					this.isAllowSubmitSalesReturn = false
				}
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

				const returns = await this.GetSalesReturns(params)

				this.salesReturns = []
				this.salesReturns = returns.data.results
				this.totalDataCount = returns.data.total

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

				let formattedDate = null
				if (this.filterDate) {
					formattedDate = dayjs(this.filterDate).format('YYYY-MM-DD')
				}

				this.filters.push({ field: 'return_date', value: formattedDate, type: 'like' })
				this.filters.push({ field: 'invoice_no', value: this.filterInvoice, type: 'like' })
				this.filters.push({ field: 'customer_id', value: this.filterCustomer, type: '=' })

				this.LoadAsyncData()
			},

			FilterByInvoice(value) {
				this.searchDebounce(this)
			},

			FilterByDate(value) {
				this.filterDate = value
				this.searchDebounce(this)
			},

			FilterByCustomer(value) {
				this.searchDebounce(this)
			},

			searchDebounce: debounce((vm) => {
				vm.onFilterData()
			}, 500),

			async EditSalesReturn() {
				this.isDisableSrTypeSelection = true
				this.isFormCreate = false
				this.selected_tab = 1
				this.sr_type = 'return_exchange_incomplete'

				// put the invoice in the select + disable it
				this.selected_invoice = this.selected_salesreturn.invoice_no
				this.isSelectInvoiceDisabled = true

				this.form_sales_return.invoice_no = this.selected_salesreturn.invoice_no
				this.form_sales_return.customer_id = this.selected_salesreturn.customer_id
				this.form_sales_return.customer_name = this.selected_salesreturn.customer_name

				this.form_sales_return.return_date = this.selected_salesreturn.return_date
				this.form_sales_return.sales_return_code = this.selected_salesreturn.sales_return_code

				//mapped and query product details
				let initMappedReturnItems = await Promise.all(
					this.selected_detail_items.map(async (item) => {
						return {
							product_id: item.product_id,
							price_per_unit: item.price_per_unit,
							trans_quantity: item.invoice_quantity,
							product: await this.GetSingleProduct({ product_id: item.product_id }),
							return_item_total_amount: parseInt(item.quantity) * parseInt(item.price_per_unit),
							return_quantity: item.quantity
						}
					})
				)

				let finalMappedReturnItems = initMappedReturnItems.map((item, index) => {
					return {
						index: index,
						product_id: item.product_id,
						product_name: item.product.name,
						product_code: item.product.product_code,
						product_description: item.product.description,
						unit: item.product.unit.item_unit,
						brand: item.product.brand.brandname,
						price_per_unit: item.price_per_unit,
						trans_quantity: item.trans_quantity,
						return_item_total_amount: parseFloat(item.return_item_total_amount).toFixed(2),
						return_quantity: item.return_quantity
					}
				})

				this.form_return_items = finalMappedReturnItems

				//trigger per row calculation
				finalMappedReturnItems.forEach((el) => {
					let data = {
						index: el.index,
						row: {
							return_quantity: el.return_quantity,
							price_per_unit: el.price_per_unit
						}
					}
					this.ReturnItemQuantityChange(data)
				})

				this.CalculateSalesReturnBalance()

				this.CloseDetailsModal()
			},

			onProductSearch(searchterm, loading) {
				if (searchterm.length) {
					loading(true)
					this.searchProduct(loading, searchterm, this)
				}
			},
			searchProduct: debounce(async (loading, searchterm, vm) => {
				vm.productOptions = await vm.SearchProductsByCode({ searchterm: searchterm, searchtype: 'mixed' })
				loading(false)
			}, 500),

			Print() {
				let obj = {
					type: 'Sales_Return',
					branch_code: this.$store.state.selectedBranch.branch_code,
					ref_field: 'sales_return_code',
					ref_no: this.selected_salesreturn.sales_return_code
				}

				let urlParams = new URLSearchParams(obj).toString()

				window.open('/printing/singledoc?' + urlParams, '_blank', 'location=yes,height=768,width=800,scrollbars=yes,status=yes')
			}
		},

		mounted() {
			this.GetCustomers()

			this.GetSalesInvoices()
			this.GetProducts()

			this.LoadAsyncData()

			if (this.$route.params.action === 'new') this.CreateNewSalesReturn()
		}
	}
</script>

<style scoped>
	.wrapper-h {
		height: calc(100vh - 125px);
	}

	.wrapper-h-tab {
		height: calc(100vh - 170px);
	}
</style>
