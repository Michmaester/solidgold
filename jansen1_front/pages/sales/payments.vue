<template>
	<div>
		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">
			<h3 class="has-text-header">Payments</h3>
			<div class="flex items-center">

				<b-button :disabled="selected_invoice.id == null || selected_invoice.payment_status == 'Paid'" type="is-primary" icon-left="plus" class="is-small text-white mr-1" @click="ShowPayment('customer')">Customer Payment</b-button>
				<b-button :disabled="selected_invoice.id == null || selected_invoice.payment_status == 'Paid'" type="is-primary" icon-left="plus" class="is-small text-white" @click="ShowPayment('invoice')">Invoice Payment</b-button>
				<b-button type="is-primary" icon-left="printer" class="is-small px-4 ml-1" @click="Print">Print</b-button>
			</div>
		</div>

		<div class="grid grid-cols-8 gap-4 p-4 has-background-pageheader">
			<div class="col-span-8 wrapper-h bg-white">

				<div class="text-sm p-2">

					<b-table :striped="true" :narrowed="true" :hoverable="true" :loading="loading" paginated backend-pagination :pagination-rounded="true" pagination-size="is-small" :total="totalDataCount" :per-page="pageSize" @page-change="onPageChange" backend-sorting :default-sort-direction="defaultSortOrder" :default-sort="[sortField, sortOrder]" @sort="onSort" sort-icon="arrow-up" sort-icon-size="is-small" :pagination-simple="false" :pagination-position="'top'" :selected.sync="selected_payment" @select="SelectedPayment" :data="salesPayments">

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

									<b-field label="Payment Status" custom-class="font-semibold text-xs no-mb-labels" class="w-40 text-xs mr-1">
										<b-input type="primary" size="is-small" v-model="filterPaymentStatus" @input="FilterByPaymentStatus"></b-input>
									</b-field>

									<b-field label="Customers" custom-class="font-semibold text-xs no-mb-labels" class="text-xs mr-1" style="width:300px;">
										<v-select :options="customers" label="name" v-model="filterCustomer" :reduce="customer => customer.customer_id" @input="FilterByCustomer" />
									</b-field>

								</client-only>

							</div>
						</template>

						<b-table-column v-slot="props" field="sales_transaction.invoice_no" label="Invoice No">
							<p class="cursor-pointer underline font-bold hover:text-blue-500" @click="ShowDetailsModal">{{ props.row.invoice_no }}</p>
						</b-table-column>

						<b-table-column v-slot="props" field="sales_transaction.customer.name" label="Customer">
							<a @click="ShowCustomerRecord(props.row)" class="underline font-bold">
								{{ props.row.customer.name }}
							</a>
						</b-table-column>

						<b-table-column v-slot="props" field="sales_transaction.dateTransaction" label="Date">
							{{ props.row.dateTransaction }}
						</b-table-column>

						<b-table-column v-slot="props" field="sales_transaction.transaction_type" label="Type">
							<p :class="$RenderColorStatus(props.row.transaction_type,'text')">
								{{ props.row.transaction_type }}
							</p>
						</b-table-column>

						<b-table-column v-slot="props" field="sales_transaction.total_amount_due" label="Amount Due">
							{{ $formatAmount(props.row.total_amount_due) }}
						</b-table-column>

						<b-table-column v-slot="props" field="sales_transaction.total_amount_tendered" label="Amount Paid">
							{{ $formatAmount(props.row.total_amount_tendered) }}
						</b-table-column>

						<b-table-column v-slot="props" field="sales_transaction.balance_amount" label="Balance">
							{{ $formatAmount(props.row.balance_amount) }}
						</b-table-column>

						<b-table-column v-slot="props" field="sales_transaction.payment_status" label="Payment">
							<p :class="$RenderColorStatus(props.row.payment_status,'text')">
								{{ props.row.payment_status }}
							</p>
						</b-table-column>

					</b-table>
				</div>
			</div>
		</div>

		<b-modal :active.sync="isModalPaymentFormShow" has-modal-card trap-focus :width="1200" @close="ClosePaymentModal" :destroy-on-hide="false">
			<div class="modal-card" style="width:1200px;min-height:500px">
				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-semibold text-white">Payment Form</p>
					<div>
						<a href="#" @click.prevent="ClosePaymentModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>
				<header class="px-5 py-2 has-background-pageheader border-b border-gray-200">
					<div class="flex items-center justify-start text-lg">

						<div v-if="!isPaymentForInvoice" class="flex items-center">
							<b-radio v-model="customer_payment_type" name="invoice_priority" native-value="invoice_priority">Invoice Priority</b-radio>
							<b-radio v-model="customer_payment_type" name="invoice_choices" native-value="invoice_choices">Invoice Choices</b-radio>
						</div>

						<p v-if="!isPaymentForInvoice" class="ml-6 font-bold">Total Amount Tendered : <span class="has-text-primary">{{ $formatAmountCurrency(payment_tmp_total_amount_tendered) }}</span></p>

						<p v-if="isPaymentForInvoice" class="font-bold">Total Amount Tendered : <span class="has-text-primary">{{ $formatAmountCurrency(payment_tmp_total_amount_tendered) }}</span></p>

					</div>
				</header>
				<section class="modal-card-body app-modal-form">
					<!-- <div>
						
					</div> -->
					<div class="flex w-full">
						<div class="w-full">
							<div>

								<div v-if="!isPaymentForInvoice" class="flex">
									<b-field label="Customer Name" custom-class="text-sm" class="mr-6">
										<p class="text-sm has-text-primary font-bold">{{ selected_customer.name }}</p>
									</b-field>
									<b-field v-if="customer_payment_type === 'invoice_choices'" label="Selected Total Amount" custom-class="text-sm" class="mr-6">
										<p class="text-sm has-text-primary font-bold">{{ $formatAmountCurrency($calculateTotals(checked_custinvoices,'balance_amount')) }}</p>
									</b-field>
								</div>

								<div v-if="isPaymentForInvoice" class="text-sm">

									<div class="flex mb-4 border-b border-gray-200">
										<b-field label="Amount Due" custom-class="text-sm" class="mr-6">
											<p class="text-lg has-text-primary font-bold">{{ $formatAmountCurrency(selected_invoice.total_amount_due) }}</p>
										</b-field>
										<b-field label="Balance" custom-class="text-sm">
											<p class="text-lg has-text-primary font-bold">{{  $formatAmountCurrency(selected_invoice.balance_amount) }}</p>
										</b-field>
									</div>

									<div class="flex mt-4 flex-wrap">
										<b-field label="Customer Name" custom-class="text-sm" class="mr-6">
											<p class="text-sm has-text-primary font-bold">{{ selected_invoice.customer.name }}</p>
										</b-field>
										<b-field label="Type" custom-class="text-sm" class="mr-6">
											<p class="text-sm">{{ selected_invoice.transaction_type }}</p>
										</b-field>

										<b-field label="Invoice" custom-class="text-sm" class="mr-6">
											<p class="text-sm has-text-primary font-bold">{{ selected_invoice.invoice_no }}</p>
										</b-field>
										<b-field label="Date" custom-class="text-sm" class="">
											<p class="text-sm">{{ selected_invoice.dateTransaction }}</p>
										</b-field>
									</div>
								</div>
							</div>
							<div v-if="!isPaymentForInvoice" class="mt-6 text-sm">
								<b-table :bordered="false" :striped="true" :narrowed="true" :hoverable="true" :loading="false" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="10" current-page.sync="1" :pagination-simple="true" :pagination-position="'top'" pagination-size="is-small" :checked-rows.sync="checked_custinvoices" :checkable="customer_payment_type == 'invoice_choices'" :checkbox-position="'right'" @check="CustomerInvoiceChecked" :data="customerInvoices">
									<template slot="top-left">
										<h3 class="font-bold text-sm">List of Invoices</h3>
									</template>

									<b-table-column v-slot="props" label="Date">
										{{ props.row.invoice_no }}
									</b-table-column>

									<b-table-column v-slot="props" label="Amount Due">
										{{ $formatAmount(props.row.total_amount_due) }}
									</b-table-column>

									<b-table-column v-slot="props" label="Amount Paid">
										{{ $formatAmount(props.row.total_amount_tendered) }}
									</b-table-column>

									<b-table-column v-slot="props" label="Balance">
										{{ $formatAmount(props.row.balance_amount) }}
									</b-table-column>

									<b-table-column v-slot="props" label="Payment">
										<p :class="$RenderColorStatus(props.row.payment_status, 'text')">{{ props.row.payment_status }}</p>
									</b-table-column>

									<b-table-column v-slot="props" label="Type">
										<p :class="$RenderColorStatus(props.row.transaction_type, 'text')">{{ props.row.transaction_type }}</p>
									</b-table-column>

								</b-table>
							</div>
							<div class="mt-6 text-sm">

								<!-- 
									:checked-rows.sync="checkCustomerSalesReturnForApplication" checkable checkbox-position="right" :is-row-checkable="(row) => checkCustomerSalesReturnForApplication.length == 0 && row."
								 -->

								<div class="flex items-center justify-between">
									<h3 class="font-bold text-sm mr-4">List of Returns</h3>
									<!-- <p class="font-bold text-red-500 mr-4">Total : {{ this.$calculateTotals(this.customerSalesReturns,'credit_balance') }}</p> -->
									<b-button type="is-primary" size="is-small" @click="SalesReturnUseForPayment" icon-left="arrow-right">Use for Payment</b-button>
								</div>

								<b-table height="150" :bordered="false" :selected.sync="selectedCustomerSalesReturnForApplication" sticky-header :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :data="customerSalesReturns">

									<b-table-column v-slot="props" label="Return No.">
										{{ props.row.sales_return_code }}
									</b-table-column>

									<b-table-column v-slot="props" label="Date">
										{{ props.row.return_date }}
									</b-table-column>

									<b-table-column v-slot="props" label="Ref">
										{{ props.row.invoice_no }}
									</b-table-column>

									<b-table-column v-slot="props" label="Amount">
										{{ $formatAmount(props.row.credit_amount) }}
									</b-table-column>

									<b-table-column v-slot="props" label="Applied Amount">
										{{ $formatAmount(props.row.applied_amount) }}
									</b-table-column>

									<b-table-column v-slot="props" label="Balance">
										{{ $formatAmount(props.row.credit_balance) }}
									</b-table-column>

								</b-table>
							</div>
						</div>

						<div class="w-2/3 ml-4 text-sm">
							<b-tabs type="is-toggle" size="is-small" expanded v-model="activePaymentTab">
								<b-tab-item label="Cash" value="Cash" icon="cash" class="p-4">
									<ValidationObserver v-slot="{ invalid }">
										<b-field label="Amount" custom-class="text-xs">
											<ValidationProvider name="Amount" rules="required|decimal|is_not:0" v-slot="{ errors }">
												<b-input size="is-small" type="text" v-model="form_paytype_cash.amount"></b-input>
												<span class="validation-error">{{ errors[0] }}</span>
											</ValidationProvider>
										</b-field>

										<b-button :disabled="invalid || tmpPayments.length > 0" type="is-primary" icon-left="plus" class="is-small text-white mr-1" expanded @click="AddTmpPaymentCash">Add Payment</b-button>
									</ValidationObserver>
								</b-tab-item>

								<b-tab-item label="Cheque" value="Cheque" icon="checkbook" class="p-4">

									<ValidationObserver v-slot="{ invalid }">

										<div class="flex">
											<b-field label="Bank" custom-class="text-xs" class="w-1/2 mr-2">
												<ValidationProvider name="Bank" rules="required" v-slot="{ errors }">
													<b-select placeholder="Select bank" size="is-small" expanded v-model="form_paytype_cheque.bank">
														<option v-for="bank in banks" :value="{ id: bank.id, name: bank.name }" :key="bank.id">
															{{ bank.name }}
														</option>
													</b-select>
													<span class="validation-error">{{ errors[0] }}</span>
												</ValidationProvider>
											</b-field>

											<b-field label="Cheque Date" custom-class="text-xs" class="w-1/2">
												<ValidationProvider name="Cheque Date" rules="required" v-slot="{ errors }">
													<b-datepicker v-model="form_paytype_cheque.cheque_date" append-to-body icon="calendar-month-outline" size="is-small" trap-focus></b-datepicker>
													<span class="validation-error">{{ errors[0] }}</span>
												</ValidationProvider>
											</b-field>
										</div>

										<b-field label="Name on Cheque" custom-class="text-xs">
											<ValidationProvider name="Name on Cheque" rules="required" v-slot="{ errors }">
												<b-input size="is-small" type="text" v-model="form_paytype_cheque.cheque_name"></b-input>
												<span class="validation-error">{{ errors[0] }}</span>
											</ValidationProvider>
										</b-field>

										<div class="flex">
											<b-field label="Amount" custom-class="text-xs" class="w-1/2 mr-2">
												<ValidationProvider name="Amount" rules="required|decimal|is_not:0" v-slot="{ errors }">
													<b-input size="is-small" type="text" v-model="form_paytype_cheque.amount"></b-input>
													<span class="validation-error">{{ errors[0] }}</span>
												</ValidationProvider>
											</b-field>
											<b-field label="Cheque No." custom-class="text-xs" class="w-1/2">
												<ValidationProvider name="Cheque No." rules="required" v-slot="{ errors }">
													<b-input size="is-small" type="text" v-model="form_paytype_cheque.cheque_no"></b-input>
													<span class="validation-error">{{ errors[0] }}</span>
												</ValidationProvider>
											</b-field>
										</div>

										<b-button :disabled="invalid || tmpPayments.length > 0" type="is-primary" icon-left="plus" class="is-small text-white mr-1" expanded @click="AddTmpPaymentCheque">Add Payment</b-button>

									</ValidationObserver>
								</b-tab-item>

								<!-- <b-tab-item label="Bank Deposit" value="BankDeposit" icon="bank-transfer" class="p-4">
									<div class="flex">
										<b-field label="Bank" custom-class="text-xs" class="w-1/2 mr-2">
											<b-select placeholder="Select bank" size="is-small" expanded v-model="form_paytype_deposit.bank">
												<option v-for="bank in banks" :value="{ id: bank.id, name: bank.name }" :key="bank.id">
													{{ bank.name }}
												</option>
											</b-select>
										</b-field>

										<b-field label="Reference No." custom-class="text-xs" class="w-1/2">
											<b-input size="is-small" type="text" v-model="form_paytype_deposit.ref_no"></b-input>
										</b-field>
									</div>

									<b-field label="Amount" custom-class="text-xs">
										<b-input size="is-small" type="text" v-model="form_paytype_deposit.amount"></b-input>
									</b-field>

									<b-button type="is-primary" icon-left="plus" class="is-small text-white mr-1" expanded @click="AddTmpPaymentDeposit">Add Payment</b-button>
								</b-tab-item> -->
							</b-tabs>

							<b-table :bordered="false" :striped="true" :narrowed="true" :hoverable="true" :loading="false" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="10" current-page.sync="1" :pagination-simple="true" :pagination-position="'top'" pagination-size="is-small" :data="tmpPayments" :columns="tbl_tmppayments">
								<template slot="top-left">
									<b-button v-show="tmpPayments.length >= 0" type="is-danger" icon-left="close" class="is-small text-white" @click="ResetTmpPayments">Reset</b-button>
								</template>
							</b-table>
						</div>
					</div>
				</section>
				<footer class="modal-card-foot p-5">
					<b-button type="is-primary" size="is-small" icon-left="send-check" @click="SubmitPayment">Submit Sales Payment</b-button>
				</footer>
			</div>
		</b-modal>

		<b-modal :active.sync="isModalDetailsShow" has-modal-card trap-focus :width="1000" @close="CloseDetailsModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1000px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-semibold text-white">Sales Transaction Details</p>
					<div>
						<a href="#" @click.prevent="CloseDetailsModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div class="flex flex-col text-sm">
						<div v-if="selected_invoice.payment_status === 'Paid'" class="bg-green-200 p-2 my-2 flex justify-between items-center">
							<div>
								<p class="font-bold">Invoice No. : <span class="font-normal underline">{{ selected_invoice.invoice_no }}</span></p>
								<p v-if="selected_invoice.customer" class="font-bold">Customer : <span class="font-normal">{{ selected_invoice.customer.name }}</span></p>
							</div>
							<p class="text-3xl font-bold w-32">
								<b-icon icon="alert-circle-check-outline" size="is-small"></b-icon> {{ selected_invoice.payment_status }}
							</p>
						</div>

						<div v-if="selected_invoice.payment_status !== 'Paid'" class="bg-yellow-300 p-2 my-2 flex justify-between items-center">
							<div>
								<p class="font-bold">Invoice No. : <span class="font-normal underline">{{ selected_invoice.invoice_no }}</span></p>
								<p v-if="selected_invoice.customer" class="font-bold">Customer : <span class="font-normal">{{ selected_invoice.customer.name }}</span></p>
							</div>
							<p class="text-3xl font-bold w-32">
								<b-icon icon="alert-circle-outline" size="is-small"></b-icon> {{ selected_invoice.payment_status }}
							</p>
						</div>
					</div>
					<div class="flex mt-4 text-sm">
						<div class="w-full">
							<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :selected.sync="selected_payment_list" @select="SelectedPaymentList" :data="paymentslist">

								<b-table-column v-slot="props" label="Payment Type">
									{{ props.row.type }}
								</b-table-column>

								<b-table-column v-slot="props" label="Amount">
									{{ $formatAmountCurrency(props.row.amount) }}
								</b-table-column>

								<b-table-column v-slot="props" label="Payment Datetime">
									{{ props.row.datetime }}
								</b-table-column>

							</b-table>
						</div>
						<div class="w-2/3 bg-white ml-4">
							<p class="p-2 bg-gray-200 font-semibold">Payment Detail</p>

							<div class="p-2">
								<div v-if="selected_payment_list.type == 'Cash'">
									<p>Amount : {{ selected_payment_list.details.amount }}</p>
								</div>

								<div v-if="selected_payment_list.type == 'Card'">
									<p>Amount : {{ selected_payment_list.details.amount }}</p>
									<p>Card No : {{ selected_payment_list.details.card_no }}</p>
									<p>Expiration :{{ selected_payment_list.details.expiration_date }}</p>
									<p>Account Name :{{ selected_payment_list.details.account_name }}</p>
									<p>Confirmation Code :{{ selected_payment_list.details.confirmation_code }}</p>
									<p>Bank : {{ selected_payment_list.details.bank_id }}</p>
								</div>

								<div v-if="selected_payment_list.type == 'Charge'">
									<p>Amount : {{ selected_payment_list.details.amount }}</p>
									<p>Charge Date :{{ selected_payment_list.details.charge_date }}</p>
									<p>Customer :{{ selected_payment_list.details.customer_id }}</p>
								</div>

								<div v-if="selected_payment_list.type == 'Cheque'">
									<p>Amount : {{ selected_payment_list.details.amount }}</p>
									<p>Cheque Name :{{ selected_payment_list.details.cheque_name }}</p>
									<p>Cheque No :{{ selected_payment_list.details.cheque_no }}</p>
									<p>Cheque Date :{{ selected_payment_list.details.cheque_date }}</p>
									<p>Cheque Type : {{ selected_payment_list.details.type }}</p>
									<p>Cheque Bank :{{ selected_payment_list.details.bank_id }}</p>
								</div>

								<div v-if="selected_payment_list.type == 'GiftCheque'">
									<p>Amount : {{ selected_payment_list.details.amount }}</p>
									<p>Name : {{ selected_payment_list.details.name }}</p>
									<p>Serial No :{{ selected_payment_list.details.serial_no }}</p>
								</div>

								<div v-if="selected_payment_list.type == 'Return'">
									<p>Amount : {{ selected_payment_list.details.amount }}</p>
									<p>Sales Return Code : {{ selected_payment_list.details.ref_no }}</p>
								</div>
							</div>
						</div>
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
			module: 'sales-payments'
		},

		computed: {
			...mapGetters({
				banks: 'masterdatas/getBanks',

				customers: 'partners/getCustomers',
				salesInvoices: 'sales/getSalesInvoices',

				customerInvoices: 'partners/getCustomerInvoices'
			})
		},

		data() {
			return {
				tbl_tmppayments: [
					{ field: 'type', label: 'Type', sortable: true },
					{ field: 'amount', label: 'Amount', sortable: true }
				],

				tbl_paymentlist_columns: [
					{ field: 'type', label: 'Payment Type' },
					{ field: 'amount', label: 'Amount' },
					{ field: 'datetime', label: 'Datetime' }
				],

				form_paytype_cash: {
					type: 'CASH',
					amount: null
				},

				form_paytype_cheque: {
					type: 'CHEQUE',
					amount: null,
					bank: null,
					cheque_no: null,
					cheque_date: null,
					cheque_name: null
				},

				form_paytype_deposit: {
					type: 'DEPOSIT',
					amount: null,
					bank: null,
					ref_no: null
				},

				salesPayments: [],
				totalDataCount: 0,
				loading: false,
				sortField: 'id',
				sortOrder: 'desc',
				defaultSortOrder: 'desc',
				page: 1,
				pageSize: 15,

				filters: [],

				filterDate: null,
				filterPaymentStatus: null,
				filterCustomer: null,

				tmp_SalesPayments: [],
				customer_payment_type: 'invoice_priority',

				payment_tmp_total_amount_tendered: 0,

				selected_payment: {},
				selected_payment_list: {},

				selected_invoice: {},
				selected_customer: {},
				selected_customer_invoices: [],

				tmpPayments: [],

				checked_custinvoices: [],

				paymentslist: [],
				activePaymentTab: 0,
				isPaymentForInvoice: false,

				isFormPaymentCreate: false,
				isModalPaymentFormShow: false,

				isModalDetailsShow: false,

				customerSalesReturns: [],
				checkCustomerSalesReturnForApplication: [],
				selectedCustomerSalesReturnForApplication: null
			}
		},

		methods: {
			...mapActions({
				GetSalesPayments: 'payments/GetSalesPayments',
				GetCustomers: 'partners/GetCustomers',
				GetSalesInvoices: 'sales/GetSalesInvoices',
				GetBanks: 'masterdatas/GetBanks',

				GetCustomerInvoices: 'partners/GetCustomerInvoices',

				SubmitInvoicePayment: 'payments/SubmitInvoicePayment',
				SubmitCustomerInvoicePayment: 'payments/SubmitCustomerInvoicePayment',

				GetSalesPaymentsFilter: 'payments/GetSalesPaymentsFilter',

				GetCustomerSalesReturnCredits: 'partners/GetCustomerSalesReturnCredits'
			}),

			...mapMutations({}),

			ShowDetailsModal(data) {
				console.log(data)
			},

			SelectedPayment(data) {
				this.selected_payment_list = {}
				this.selected_payment = data.payment_tender
				this.CheckPaymentsList()

				this.selected_invoice = data
				this.selected_customer = data.customer
			},

			CheckPaymentsList() {
				var cash = this.selected_payment.payment_cash.map((item) => {
					return {
						type: 'Cash',
						payment_id: item.payment_id,
						amount: item.amount,
						datetime: item.paytrans_date,
						details: item
					}
				})

				var card = this.selected_payment.payment_card.map((item) => {
					return {
						type: 'Card',
						payment_id: item.payment_id,
						amount: item.amount,
						datetime: item.paytrans_date,
						details: item
					}
				})

				var charge = this.selected_payment.payment_charge.map((item) => {
					return {
						type: 'Charge',
						payment_id: item.payment_id,
						amount: item.amount,
						datetime: item.paytrans_date,
						details: item
					}
				})

				var cheque = this.selected_payment.payment_cheque.map((item) => {
					return {
						type: 'Cheque',
						payment_id: item.payment_id,
						amount: item.amount,
						datetime: item.paytrans_date,
						details: item
					}
				})

				var giftcheque = this.selected_payment.payment_giftcheque.map((item) => {
					return {
						type: 'GiftCheque',
						payment_id: item.payment_id,
						amount: item.amount,
						datetime: item.paytrans_date,
						details: item
					}
				})

				let returns = this.selected_payment.payment_return.map((item) => {
					return {
						type: 'Return',
						payment_id: item.payment_id,
						amount: item.amount,
						datetime: item.paytrans_date,
						details: item
					}
				})

				this.paymentslist = [...cash, ...card, ...charge, ...cheque, ...giftcheque, ...returns]
			},

			SelectedPaymentList(data) {
				// console.log(data)
				//this.selected_payment_list = data.payment_tender
				//console.log(this.selected_payment_list)
			},

			async ShowPayment(mode) {
				//clear first
				this.tmpPayments = []
				this.checked_custinvoices = []
				this.payment_tmp_total_amount_tendered = 0
				this.customer_payment_type = 'invoice_priority'

				if (mode == 'customer') {
					//get the customer invoices
					this.isPaymentForInvoice = false
					const res = await this.GetCustomerInvoices(this.selected_customer)
				} else {
					//list the invoice
					this.isPaymentForInvoice = true
				}

				//credit memos / sales returns
				this.customerSalesReturns = await this.GetCustomerSalesReturnCredits(this.selected_customer)

				this.isModalPaymentFormShow = true
			},

			ClosePaymentModal() {
				this.isModalPaymentFormShow = false
			},

			ShowCustomerRecord(row) {
				let customer = row.customer
				console.log(customer.customer_id)
			},

			AddTmpPaymentCash() {
				var payment = {
					type: this.form_paytype_cash.type,
					amount: this.form_paytype_cash.amount
				}
				this.tmpPayments.push(payment)

				//reset
				this.form_paytype_cash.amount = null

				this.payment_tmp_total_amount_tendered = this.$calculateTotals(this.tmpPayments, 'amount')
			},

			AddTmpPaymentCheque() {
				var payment = {
					type: this.form_paytype_cheque.type,
					amount: this.form_paytype_cheque.amount,
					cheque_bank: this.form_paytype_cheque.bank,
					cheque_no: this.form_paytype_cheque.cheque_no,
					cheque_date: dayjs(this.form_paytype_cheque.cheque_date).format('MM/DD/YYYY'),
					cheque_name: this.form_paytype_cheque.cheque_name
				}
				this.tmpPayments.push(payment)

				//reset
				this.form_paytype_cheque.cheque_no = null
				this.form_paytype_cheque.amount = null
				this.form_paytype_cheque.bank = null
				this.form_paytype_cheque.cheque_date = null
				this.form_paytype_cheque.cheque_name = null

				this.payment_tmp_total_amount_tendered = this.$calculateTotals(this.tmpPayments, 'amount')
			},

			AddTmpPaymentDeposit() {
				var payment = {
					type: this.form_paytype_deposit.type,
					amount: this.form_paytype_deposit.amount,
					deposit_bank: this.form_paytype_deposit.bank,
					deposit_ref_no: this.form_paytype_deposit.ref_no
				}
				this.tmpPayments.push(payment)

				//reset
				this.form_paytype_deposit.amount = null
				this.form_paytype_deposit.bank = null
				this.form_paytype_deposit.ref_no = null

				this.payment_tmp_total_amount_tendered = this.$calculateTotals(this.tmpPayments, 'amount')
			},

			ResetTmpPayments() {
				this.tmpPayments = []

				//reset
				this.form_paytype_cheque.cheque_no = null
				this.form_paytype_cheque.amount = null
				this.form_paytype_cheque.bank = null
				this.form_paytype_cheque.cheque_date = null
				this.form_paytype_cheque.cheque_name = null

				this.form_paytype_cash.amount = null

				this.form_paytype_deposit.amount = null
				this.form_paytype_deposit.bank = null
				this.form_paytype_deposit.ref_no = null

				this.payment_tmp_total_amount_tendered = this.$calculateTotals(this.tmpPayments, 'amount')
			},

			async SubmitPayment() {
				// Check if paymentlist is not empty + or zero
				let totalled_payment_amount = this.$calculateTotals(this.tmpPayments, 'amount')

				if (this.tmpPayments.length <= 0 || totalled_payment_amount <= 0) {
					//error
					this.$buefy.dialog.alert({
						message: 'No payment provided.<br /> Please correct the information and try again.',
						type: 'is-danger',
						hasIcon: true,
						icon: 'alert-circle',
						iconPack: 'mdi',
						ariaRole: 'alertdialog',
						ariaModal: true
					})
				} else {
					const { result, dialog } = await this.$buefy.dialog.confirm({
						message: 'Are you sure, you want to perform a <b>Sales Payment</b>. Please double check the details before you confirm.<br/>This action cannot be undone.',
						confirmText: 'Confirm Sales Payment',
						type: 'is-danger',
						hasIcon: true,
						closeOnConfirm: true
					})

					if (result) {
						if (this.isPaymentForInvoice) {
							var payload = {
								transaction: this.selected_invoice,
								payments: this.tmpPayments
							}
							//console.log(payload)

							var res = await this.SubmitInvoicePayment(payload)
							if (res.status == 'ok') {
								this.ClosePaymentModal()
								this.LoadAsyncData()
							}
						} else {
							var payload = {
								customer: this.selected_customer,
								customer_payment_type: this.customer_payment_type,
								invoice_choices: this.checked_custinvoices,
								payments: this.tmpPayments
							}
							//console.log(payload)

							var res = await this.SubmitCustomerInvoicePayment(payload)
							if (res.status == 'ok') {
								this.ClosePaymentModal()
								this.LoadAsyncData()
							}
						}
					}
				}
			},

			SalesReturnUseForPayment() {
				// check if null then do not function
				if (this.selectedCustomerSalesReturnForApplication) {
					// get the credit balance
					let credit_balance = this.selectedCustomerSalesReturnForApplication.credit_balance
					let ref_no = this.selectedCustomerSalesReturnForApplication.sales_return_code

					// we creck if there is already a sales return
					let isHaveSalesReturn = this.tmpPayments.filter((item) => {
						return item.type === 'RETURN'
					})

					if (isHaveSalesReturn.length <= 0) {
						let payment = {
							type: 'RETURN',
							amount: credit_balance,
							ref_no: ref_no
						}
						this.tmpPayments.push(payment)
						this.payment_tmp_total_amount_tendered = this.$calculateTotals(this.tmpPayments, 'amount')
					}
				}

				// -------> Currently we disabled this
				//check if there is credit memo already
				// let isHaveCreditMemo = this.tmpPayments.filter((item) => {
				// 	return item.type === 'CREDIT MEMO'
				// })
				// if (isHaveCreditMemo.length > 0) {
				// } else {
				// 	if (this.customerCreditMemos.length > 0) {
				// 		let creditMemosTotals = this.$calculateTotals(this.customerCreditMemos, 'credit_balance')
				// 		let payment = {
				// 			type: 'CREDIT MEMO',
				// 			amount: creditMemosTotals
				// 		}
				// 		this.tmpPayments.push(payment)
				// 		this.payment_tmp_total_amount_tendered = this.$calculateTotals(this.tmpPayments, 'amount')
				// 	}
				// }
			},

			CustomerInvoiceChecked(data) {
				console.log(data)
			},

			ShowDetailsModal() {
				this.isModalDetailsShow = true
			},

			CloseDetailsModal() {
				this.isModalDetailsShow = false
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

				const payments = await this.GetSalesPayments(params)

				this.salesPayments = []
				this.salesPayments = payments.data.results
				this.totalDataCount = payments.data.total

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

				this.filters.push({ field: 'transaction_date', value: formattedDate, type: 'like' })
				this.filters.push({ field: 'payment_status', value: this.filterPaymentStatus, type: 'like' })
				this.filters.push({ field: 'customer_id', value: this.filterCustomer, type: '=' })

				this.LoadAsyncData()
			},

			FilterByDate(value) {
				this.filterDate = value
				this.searchDebounce(this)
			},

			FilterByPaymentStatus(value) {
				this.searchDebounce(this)
			},

			FilterByCustomer(value) {
				this.searchDebounce(this)
			},

			searchDebounce: debounce((vm) => {
				vm.onFilterData()
			}, 500),

			Print() {
				let obj = {
					type: 'Sales_Payment',
					branch_code: this.$store.state.selectedBranch.branch_code,
					ref_field: 'invoice_no',
					ref_no: this.selected_payment.invoice_no
				}

				let urlParams = new URLSearchParams(obj).toString()

				window.open('/printing/singledoc?' + urlParams, '_blank', 'location=yes,height=768,width=800,scrollbars=yes,status=yes')
			}
		},

		mounted() {
			this.LoadAsyncData()
			this.GetCustomers()
			this.GetSalesInvoices()
			this.GetBanks()
		}
	}
</script>

<style scoped>
	.wrapper-h {
		height: calc(100vh - 125px);
	}
</style>
