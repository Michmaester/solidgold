<template>
	<div>

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">

			<h3 class="has-text-header">Payments</h3>

			<div class="flex items-center">
				<b-button :disabled="selected_purchase_payment.id == null || selected_purchase_payment.payment_status == 'Paid'" type="is-primary" icon-left="plus" class="is-small text-white mr-1" @click="ShowPayment('supplier')">Supplier Payment</b-button>
				<b-button :disabled="selected_purchase_payment.id == null || selected_purchase_payment.payment_status == 'Paid'" type="is-primary" icon-left="plus" class="is-small text-white" @click="ShowPayment('po')">PO List Payment</b-button>
			</div>

		</div>

		<div class="grid grid-cols-8 gap-4 p-4 has-background-pageheader">

			<div class="col-span-8 wrapper-h bg-white">

				<!-- main table -->
				<div class="text-sm p-2">
					<b-table :striped="true" :narrowed="true" :hoverable="true" :loading="loading" paginated backend-pagination :pagination-rounded="true" pagination-size="is-small" :total="totalDataCount" :per-page="pageSize" @page-change="onPageChange" backend-sorting :default-sort-direction="defaultSortOrder" :default-sort="[sortField, sortOrder]" @sort="onSort" sort-icon="arrow-up" sort-icon-size="is-small" :pagination-simple="false" :pagination-position="'top'" :selected.sync="selected_purchase_payment" @select="SelectedPurchasePayment" :data="purchaseReceives">

						<b-table-column field="po_number" label="Purchase No." v-slot="props" sortable>
							<p class="cursor-pointer underline font-bold hover:text-blue-500" @click="ShowDetailsModal(props.row)">{{ props.row.po_number }}</p>
						</b-table-column>
						<b-table-column label="Date" v-slot="props">
							{{ props.row.dateCreated }}
						</b-table-column>

						<b-table-column label="Supplier" v-slot="props">
							{{ props.row.supplier.name }}
						</b-table-column>

						<b-table-column label="Amount" v-slot="props">
							{{ $formatAmountCurrency(props.row.receive_total_amount) }}
						</b-table-column>

						<b-table-column label="Balance" v-slot="props">
							{{ $formatAmountCurrency(props.row.balance_amount) }}
						</b-table-column>

						<b-table-column label="Status" v-slot="props">
							{{ props.row.status }}
						</b-table-column>

						<b-table-column label="Payment" v-slot="props">
							<!-- {{ props.row.payment_status }} -->
							<p :class="$RenderColorStatus(props.row.payment_status,'text')">
								{{ props.row.payment_status }}
							</p>
						</b-table-column>

						<template slot="top-left">
							<div class="flex">

								<b-field label="PO No." custom-class="font-semibold text-xs no-mb-labels" class="w-40 text-xs mr-1">
									<b-input type="primary" size="is-small" v-model="filterPO" @input="FilterByPO"></b-input>
								</b-field>

								<b-field label="Payment Status" custom-class="font-semibold text-xs no-mb-labels" class="w-40 text-xs mr-1">
									<b-input type="primary" size="is-small" v-model="filterPaymentStatus" @input="FilterByPaymentStatus"></b-input>
								</b-field>

								<client-only placeholder="Loading...">
									<b-field label="Suppliers" custom-class="font-semibold text-xs no-mb-labels" class="text-xs mr-1" style="width:300px;">
										<v-select :options="suppliers" label="name" v-model="filterSupplier" :reduce="supplier => supplier.supplier_id" @input="FilterBySupplier" />
									</b-field>
								</client-only>

							</div>
						</template>

					</b-table>
				</div>

			</div>

		</div>

		<b-modal :active.sync="isModalDetailsShow" has-modal-card trap-focus :width="1000" @close="CloseDetailsModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1000px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-bold text-white">Purchase Payment Details</p>
					<div>
						<a href="#" @click.prevent="CloseDetailsModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>
				<header class="px-5 py-2 has-background-pageheader border-b border-gray-200">
					<div class="flex items-center justify-between">

						<div class="flex">
							<p class="mr-6">Purchase Order No. : <span class="font-bold">{{ selected_purchase_payment.po_number }}</span></p>
							<p>Payment Status : <span class="font-bold">{{ selected_purchase_payment.payment_status }}</span></p>
						</div>

						<b-button :disabled="selected_purchase_payment.payment_status == 'Paid'" type="is-success" icon-left="checkbox-multiple-marked" class="is-small mr-1 font-bold px-6" @click="ShowPayment('po')">Create Payment</b-button>

					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div v-if="selected_purchase_payment.po_type == null" class="my-4 text-sm">

						<p class="mt-4 font-bold text-sm bg-gray-200 p-2">Items</p>

						<b-table :striped="true" :narrowed="true" sort-icon="arrow-up" sort-icon-size="is-small" :data="selected_purchase_payment_items">
							<b-table-column v-slot="props" field="" label="Product">
								<div class="flex flex-col leading-tight">
									<p><span class="font-semibold text-red-500 mr-2">{{ props.row.product.product_code }}</span>{{ props.row.product.name }}</p>
									<p>{{ props.row.product.description }} - {{ props.row.product.brand.brandname }} - {{ props.row.product.unit.item_unit }}</p>
								</div>
							</b-table-column>

							<b-table-column v-slot="props" field="" label="PO Qty">
								{{ $formatAmount(props.row.qty,0) }}
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Received Qty">
								{{ $formatAmount(props.row.receive_qty,0) }}
							</b-table-column>

						</b-table>

						<p class="mt-6 font-bold text-sm bg-gray-200 p-2">Payment Record</p>

						<b-table :striped="true" :narrowed="true" :data="form_purchaseorder_payments">

							<b-table-column v-slot="props" label="Type" class="cell-valign-middle">
								{{ props.row.payment_type }}
							</b-table-column>

							<b-table-column v-slot="props" label="Amount">
								{{ $formatAmount(props.row.payment_amount) }}
							</b-table-column>

							<b-table-column v-slot="props" label="Status">
								{{ props.row.status }}
							</b-table-column>

						</b-table>

					</div>

					<div v-else>

						<div class="bg-yellow-200 p-2 my-2 flex justify-between items-center">
							<div>
								<p>
									<b-icon icon="alert-circle-check-outline" size="is-small" class="mr-2"></b-icon>This is a Non-Trade purchase order.
								</p>
							</div>

						</div>
						<div>

							<b-table :bordered="false" :striped="true" :narrowed="true" :hoverable="true" :loading="false" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="10" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :data="selected_purchase_payment_items">

								<b-table-column v-slot="props" field="" label="Product">
									<div class="flex flex-col leading-tight">
										<p><span class="font-semibold text-red-500 mr-2">{{ props.row.nt_item }}</span></p>
										<p>{{ props.row.nt_item_description }}</p>
									</div>
								</b-table-column>

								<b-table-column v-slot="props" field="" label="Qty">
									{{ $formatAmount(props.row.qty,0) }}
								</b-table-column>

								<b-table-column v-slot="props" field="" label="Actual Price">
									{{ $formatAmount(props.row.actual_price) }}
								</b-table-column>

								<b-table-column v-slot="props" field="" label="Total Amnount">
									{{ $formatAmount(props.row.total_item_amount) }}
								</b-table-column>

							</b-table>

							<p class="mt-6 font-bold text-sm bg-gray-200 p-2">Payment Record</p>

							<b-table :striped="true" :narrowed="true" :data="form_purchaseorder_payments">

								<b-table-column v-slot="props" label="Type" class="cell-valign-middle">
									{{ props.row.payment_type }}
								</b-table-column>

								<b-table-column v-slot="props" label="Amount">
									{{$formatAmount( props.row.payment_amount) }}
								</b-table-column>

								<b-table-column v-slot="props" label="Status">
									{{ props.row.status }}
								</b-table-column>

							</b-table>
						</div>

					</div>

				</section>
				<!-- <footer class="modal-card-foot p-3">

					<b-button type="is-secondary" size="is-small">Clear</b-button>
				</footer> -->

			</div>
		</b-modal>

		<b-modal :active.sync="isModalPaymentShow" has-modal-card trap-focus :width="1200" @close="ClosePaymentModal" :destroy-on-hide="false">
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

						<div v-if="!isPaymentForPO" class="flex items-center">
							<b-radio v-model="supplier_payment_type" name="po_priority" native-value="po_priority">PO Priority</b-radio>
							<b-radio v-model="supplier_payment_type" name="po_choices" native-value="po_choices">PO Choices</b-radio>
						</div>

						<p v-if="!isPaymentForPO" class="ml-6 font-bold">Total Amount Tendered : <span class="has-text-primary">{{ $formatAmountCurrency(payment_tmp_total_amount_tendered) }}</span></p>

						<p v-if="isPaymentForPO" class="font-bold">Total Amount Tendered : <span class="has-text-primary">{{ $formatAmountCurrency(payment_tmp_total_amount_tendered) }}</span></p>

					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div class="flex w-full">
						<div class="w-full">
							<div>

								<div v-if="!isPaymentForPO" class="flex">
									<b-field label="Supplier" custom-class="text-sm" class="mr-6">
										<p class="text-sm has-text-primary font-bold">{{ selected_supplier.name }}</p>
									</b-field>
									<b-field v-if="supplier_payment_type === 'po_choices'" label="Selected Total Amount" custom-class="text-sm" class="mr-6">
										<p class="text-sm has-text-primary font-bold">{{ $formatAmountCurrency($calculateTotals(checked_supplierPos,'balance_amount')) }}</p>
									</b-field>
								</div>

								<div v-if="isPaymentForPO" class="text-sm">

									<div class="flex mb-4 border-b border-gray-200">
										<b-field label="Purchase Amount" custom-class="text-sm" class="mr-6">
											<!-- <p class="text-lg has-text-primary font-bold">{{ $formatAmountCurrency(selected_po.total_amount) }}</p> -->
											<p class="text-lg has-text-primary font-bold">{{ $formatAmountCurrency(selected_po.receive_total_amount) }}</p>
										</b-field>
										<b-field label="Balance" custom-class="text-sm">
											<p class="text-lg has-text-primary font-bold">{{  $formatAmountCurrency(selected_po.balance_amount) }}</p>
										</b-field>
									</div>

									<div class="flex mt-4 flex-wrap">
										<b-field label="Supplier" custom-class="text-sm" class="mr-6">
											<p class="text-sm has-text-primary font-bold">{{ selected_po.supplier.name }}</p>
										</b-field>
										<b-field label="PO No." custom-class="text-sm" class="mr-6">
											<p class="text-sm has-text-primary font-bold">{{ selected_po.po_number }}</p>
										</b-field>
										<b-field label="Date" custom-class="text-sm" class="">
											<p class="text-sm">{{ selected_po.date_created }}</p>
										</b-field>
									</div>
								</div>

							</div>
							<div v-if="!isPaymentForPO" class="mt-6 text-sm">
								<b-table :bordered="false" :striped="true" :narrowed="true" :hoverable="true" :loading="false" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="10" current-page.sync="1" :pagination-simple="true" :pagination-position="'top'" pagination-size="is-small" :checked-rows.sync="checked_supplierPos" :checkable="supplier_payment_type == 'po_choices'" :checkbox-position="'right'" @check="SupplierPoChecked" :data="supplierPOs">
									<template slot="top-left">
										<h3 class="font-bold">List of Purchase Orders</h3>
									</template>

									<b-table-column v-slot="props" label="Date">
										{{ $formatDateByFormat(props.row.date_created,'YYYY-MM-DD') }}
									</b-table-column>

									<b-table-column v-slot="props" label="PO No.">
										{{ props.row.po_number }}
									</b-table-column>

									<b-table-column v-slot="props" label="Total Amount">
										{{ $formatAmount(props.row.total_amount) }}
									</b-table-column>

									<b-table-column v-slot="props" label="Receive Total Amount">
										{{ $formatAmount(props.row.receive_total_amount) }}
									</b-table-column>

									<b-table-column v-slot="props" label="Balance">
										{{ $formatAmount(props.row.balance_amount) }}
									</b-table-column>

									<b-table-column v-slot="props" label="Payment">
										<p :class="$RenderColorStatus(props.row.payment_status, 'text')">{{ props.row.payment_status }}</p>
									</b-table-column>

								</b-table>
							</div>
						</div>

						<div class="w-2/3 ml-4">
							<b-tabs type="is-toggle" size="is-small" expanded v-model="activePaymentTab">
								<b-tab-item label="Cash" value="Cash" icon="cash" class="p-4">
									<ValidationObserver v-slot="{ invalid }">
										<b-field label="Amount" custom-class="text-xs">
											<ValidationProvider name="Amount" rules="required|decimal|is_not:0" v-slot="{ errors }">
												<b-input size="is-small" type="text" v-model="form_paytype_cash.amount"></b-input>
												<span class="validation-error">{{ errors[0] }}</span>
											</ValidationProvider>
										</b-field>

										<b-button :disabled="invalid  || tmpPayments.length > 0" type="is-primary" icon-left="plus" class="is-small text-white mr-1" expanded @click="AddTmpPaymentCash">Add Payment</b-button>
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
					<b-button type="is-primary" size="is-small" icon-left="send-check" @click="SubmitPayment">Submit Purchase Payment</b-button>
				</footer>
			</div>
		</b-modal>

	</div>
</template>

<script>
	import { mapActions, mapMutations, mapGetters } from 'vuex'
	import dayjs from 'dayjs'
	import { debounce } from 'lodash'

	export default {
		components: {},
		meta: {
			module: 'po-payments'
		},

		computed: mapGetters({
			//purchasePayments: 'payments/getPurchasePayments',
			//purchaseReceived: 'purchases/getPurchaseReceived',
			suppliers: 'partners/getSuppliers',
			banks: 'masterdatas/getBanks',

			supplierPOs: 'partners/getSupplierPos'
		}),

		watch: {
			purchaseReceived(newValue) {
				this.tmp_purchaseReceived = newValue
			}
		},

		data() {
			return {
				// tbl_payments_columns: [
				// 	{ field: 'po.po_number', label: 'PO No.', width: '80', sortable: true },
				// 	{ field: 'po_amount', label: 'Amount' },
				// 	{ field: 'payment_type', label: 'Payment Type' },
				// 	{ field: 'paymentDate', label: 'Payment Date' },
				// 	{ field: 'cash_amount', label: 'Cash Amount' },
				// 	{ field: 'cheque_amount', label: 'Cheque Amount' },
				// 	{ field: 'cheque_bank', label: 'Cheque Bank' },
				// 	{ field: 'cheque_name', label: 'Name' },
				// 	{ field: 'chequeDate', label: 'Cheque Date' }
				// ],

				// tbl_purchasepayment_items_columns: [
				// 	{ field: 'product.name', label: 'Product', width: '80', sortable: true },
				// 	{ field: 'qty', label: 'PO Qty', width: '80' },
				// 	{ field: 'receive_qty', label: 'Receive Qty', width: '80' }
				// ],

				purchaseReceives: [],
				totalDataCount: 0,
				loading: false,
				sortField: 'id',
				sortOrder: 'desc',
				defaultSortOrder: 'desc',
				page: 1,
				pageSize: 15,

				filters: [],

				filterPO: null,
				filterPaymentStatus: null,
				filterSupplier: null,

				selected_purchase_payment: {},

				selected_purchase_payment_items: [],
				po_balance_topay: 0,

				form_purchaseorder_payments: [],

				form_purchaseorder_payment: {
					payment_type: 'NOPAYMENT',
					cash_amount: null,
					cheque_bank: null,
					cheque_name: null,
					cheque_amount: null,
					cheque_date: dayjs().format('YYYY-MM-DD'),
					bank_id: null,
					payment_status: null
				},

				isModalDetailsShow: false,
				isModalPaymentShow: false,

				isPaymentAllowed: false,

				tmp_SupplierPayments: [],
				supplier_payment_type: 'po_priority',
				isPaymentForPO: false,

				checked_supplierPos: [],
				selected_po: {},
				selected_supplier: {},
				selected_supplier_pos: [],
				payment_tmp_total_amount_tendered: null,

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

				tmpPayments: [],
				paymentslist: [],
				activePaymentTab: 0
			}
		},

		methods: {
			...mapActions({
				GetPurchasePayments: 'payments/GetPurchasePayments',
				GetPOReceived: 'purchases/GetPOReceived',
				GetSuppliers: 'partners/GetSuppliers',
				GetBanks: 'masterdatas/GetBanks',

				InsertPurchasePayment: 'purchases/InsertPurchasePayment',

				GetSupplierPos: 'partners/GetSupplierPos',

				SubmitPurchaseOrderPayment: 'payments/SubmitPurchaseOrderPayment',
				SubmitSupplierPurchaseOrderPayment: 'payments/SubmitSupplierPurchaseOrderPayment',
				GetPOReadyForPayment: 'purchases/GetPOReadyForPayment'
			}),

			...mapMutations({}),

			AddPaymentRow() {
				// calculate something here

				let payment_amount = this.form_purchaseorder_payment.cash_amount || this.form_purchaseorder_payment.cheque_amount
				let cash_amount = null
				let cheque_amount = null
				let status = null

				if (this.form_purchaseorder_payment.payment_type === 'CASH') {
					cash_amount = this.$convertStringToFloat(this.form_purchaseorder_payment.cash_amount).toFixed(2)
					cheque_amount = null
				} else {
					cheque_amount = this.$convertStringToFloat(this.form_purchaseorder_payment.cheque_amount).toFixed(2)
					cash_amount = null
				}

				if (parseFloat(payment_amount.replace(/,/g, '')) >= parseFloat(this.po_balance_topay)) {
					status = 'Full'
				}

				if (parseFloat(payment_amount.replace(/,/g, '')) < parseFloat(this.po_balance_topay)) {
					status = 'Partial'
				}

				this.form_purchaseorder_payment['payment_amount'] = this.$convertStringToFloat(payment_amount).toFixed(2)
				this.form_purchaseorder_payment['cash_amount'] = cash_amount
				this.form_purchaseorder_payment['cheque_amount'] = cheque_amount
				this.form_purchaseorder_payment['is_new'] = 1
				this.form_purchaseorder_payment['status'] = status

				this.form_purchaseorder_payments.push(this.$clearReactive(this.form_purchaseorder_payment))
				this.RecalculateTotals()

				this.ChangePaymentType()
			},

			RemovePaymentRow(data) {
				var idx = data.index

				this.form_purchaseorder_payments.splice(idx, 1)
				this.RecalculateTotals()

				this.ChangePaymentType()
			},

			ChangePaymentType() {
				if (this.form_purchaseorder_payment.payment_type == 'CASH') {
					this.form_purchaseorder_payment.cash_amount = this.$formatAmount(this.po_balance_topay)

					this.form_purchaseorder_payment.cheque_amount = null
					this.form_purchaseorder_payment.cheque_bank = null
					this.form_purchaseorder_payment.cheque_name = null
					this.form_purchaseorder_payment.cheque_date = null
					this.form_purchaseorder_payment.cheque_bank_id = null
				} else {
					this.form_purchaseorder_payment.cheque_amount = this.$formatAmount(this.po_balance_topay)
					this.form_purchaseorder_payment.cheque_date = dayjs().format('YYYY-MM-DD')
					this.form_purchaseorder_payment.cash_amount = null
				}

				this.CheckIsPaymentAllowed()
			},

			SelectedPurchasePayment(data) {
				this.selected_purchase_payment = data
				// console.log(this.selected_purchase_payment.po.po_items)

				this.selected_purchase_payment_items = this.selected_purchase_payment.po_items

				this.selected_supplier = this.selected_purchase_payment.supplier
				this.selected_po = this.selected_purchase_payment

				this.form_purchaseorder_payments = data.payments.map((item) => {
					return {
						payment_type: item.payment_type,
						cash_amount: item.cash_amount,
						cheque_bank: item.cheque_bank,
						cheque_name: item.cheque_name,
						cheque_amount: item.cheque_amount,
						cheque_date: item.cheque_date,
						cheque_bank_id: item.cheque_bank_id,
						status: item.status,
						payment_amount: item.payment_amount,
						is_new: 0
					}
				})

				this.RecalculateTotals()
			},

			RecalculateTotals() {
				this.po_balance_topay = parseFloat(this.selected_purchase_payment.receive_total_amount) - parseFloat(this.$calculateTotals(this.form_purchaseorder_payments, 'payment_amount'))

				if (this.po_balance_topay <= 0) {
					this.isPaymentAllowed = false
				} else {
					this.isPaymentAllowed = true
				}
			},

			CheckIsPaymentAllowed() {
				// check the restriction
				let payment_amount = this.form_purchaseorder_payment.cash_amount || this.form_purchaseorder_payment.cheque_amount
				if (this.po_balance_topay <= 0 && payment_amount <= 0) {
					this.isPaymentAllowed = false
				} else {
					this.isPaymentAllowed = true
				}
			},

			SelectedFilterPONo() {},

			SelectedFilterSupplier() {},

			ShowDetailsModal(data) {
				this.isModalDetailsShow = true
			},

			CloseDetailsModal() {
				this.isModalDetailsShow = false
			},

			ShowPaymentModal() {
				// // map items to form
				// this.form_receive_items = this.selected_po_items.map((item) => {
				// 	return {
				// 		product: item.product,
				// 		// not final -----> needs to be check
				// 		price: item.actual_price,
				// 		po_quantity: item.qty,
				// 		receive_quantity: item.receive_qty || 0,
				// 		receive_total_amount: item.receive_total_amount || 0
				// 	}
				// })
				this.isModalPaymentShow = true
			},

			async ShowPayment(mode) {
				//console.log(this.selected_purchase_payment)

				//clear first
				this.tmpPayments = []
				this.checked_supplierPos = []
				this.payment_tmp_total_amount_tendered = 0
				this.supplier_payment_type = 'po_priority'

				if (mode == 'supplier') {
					//get the customer invoices
					this.isPaymentForPO = false
					const res = await this.GetSupplierPos({ supplier_id: this.selected_purchase_payment.supplier_id })
				} else {
					//list the invoice
					this.isPaymentForPO = true
				}

				this.isModalPaymentShow = true
			},

			ClosePaymentModal() {
				this.isModalPaymentShow = false
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

			ResetTmpPayments() {
				this.tmpPayments = []

				//reset
				this.form_paytype_cheque.cheque_no = null
				this.form_paytype_cheque.amount = null
				this.form_paytype_cheque.bank = null
				this.form_paytype_cheque.cheque_date = null
				this.form_paytype_cheque.cheque_name = null

				this.form_paytype_cash.amount = null

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
						message: 'Are you sure, you want to perform a <b>Purchase Payment</b>. Please double check the details before you confirm.<br/>This action cannot be undone.',
						confirmText: 'Confirm Purchase Payment',
						type: 'is-danger',
						hasIcon: true,
						closeOnConfirm: true
					})

					if (result) {
						if (this.isPaymentForPO) {
							var payload = {
								po: this.selected_po,
								payments: this.tmpPayments
							}

							var res = await this.SubmitPurchaseOrderPayment(payload)
							if (res.status === 'ok') {
								this.ClosePaymentModal()
								this.LoadAsyncData()
							}
						} else {
							var payload = {
								supplier: this.selected_supplier,
								supplier_payment_type: this.supplier_payment_type,
								po_choices: this.checked_supplierPos,
								payments: this.tmpPayments
							}

							var res = await this.SubmitSupplierPurchaseOrderPayment(payload)
							if (res.status == 'ok') {
								this.ClosePaymentModal()
								this.LoadAsyncData()
							}
						}
					}
				}
			},

			// const payload = {
			// 		purchase_order: this.selected_purchase_payment,
			// 		purchase_payments: this.form_purchaseorder_payments
			// 	}

			// 	const res = await this.InsertPurchasePayment(payload)
			// 	if (res.status == 'ok') {
			// 		this.CloseDetailsModal()
			// 		this.ClosePaymentModal()
			// 		this.LoadAsyncData()
			//	}

			SupplierPoChecked(data) {
				//console.log(data)
			},

			TestPush() {
				//this.$router.push({ name: 'purchase-orders', params: { po_number: 'PO100003124232' } })
			},

			SelectedPaymentChequeBank(data) {
				if (data) {
					this.form_purchaseorder_payment.cheque_bank = data
				}
			},

			async SubmitPurchasePayment() {
				const payload = {
					purchase_order: this.selected_purchase_payment,
					purchase_payments: this.form_purchaseorder_payments
				}

				const res = await this.InsertPurchasePayment(payload)
				if (res.status == 'ok') {
					this.CloseDetailsModal()
					this.ClosePaymentModal()
					this.LoadAsyncData()
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

				const pos = await this.GetPOReadyForPayment({ params: params })

				this.purchaseReceives = []
				this.purchaseReceives = pos.data.results
				this.totalDataCount = pos.data.total

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
				this.filters.push({ field: 'po_number', value: this.filterPO, type: 'like' })
				this.filters.push({ field: 'payment_status', value: this.filterPaymentStatus, type: 'like' })
				this.filters.push({ field: 'supplier_id', value: this.filterSupplier, type: '=' })

				this.LoadAsyncData()
			},

			FilterByPO(value) {
				this.searchDebounce(this)
			},

			FilterByPaymentStatus(value) {
				this.searchDebounce(this)
			},

			FilterBySupplier(value) {
				this.searchDebounce(this)
			},

			searchDebounce: debounce((vm) => {
				vm.onFilterData()
			}, 500)

			// DateFormatter(dates) {
			// 	//array of dates
			// 	var date1 = dayjs(dates[0]).format('DD/MM/YYYY').toString()
			// 	console.log(date1)
			// 	return date1 + 'rrr'
			// }
		},

		mounted() {
			//this.GetPurchasePayments()
			// this.GetPOReceived('Received')

			this.LoadAsyncData()
			this.GetSuppliers()
			this.GetBanks()
		}
	}
</script>

<style scoped>
	.wrapper-h {
		height: calc(100vh - 125px);
	}
</style>