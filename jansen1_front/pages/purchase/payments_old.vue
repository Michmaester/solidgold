<template>
	<div>

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">

			<h3 class="has-text-header">Payments</h3>
			<div class="flex items-center">
				<b-button :disabled="selected_purchase_payment.id == null || selected_purchase_payment.payment_status == 'Paid'" type="is-success" icon-left="plus" class="is-small text-white" @click="ShowPaymentModal">Create PO Payment</b-button>

				<!-- <b-button type="is-primary" icon-left="plus" class="is-small text-white" @click="TestPush">Push</b-button> -->
			</div>

		</div>

		<div class="grid grid-cols-8 gap-4 p-4 has-background-pageheader">

			<div class="col-span-8 wrapper-h bg-white">

				<!-- main table -->
				<div class="text-sm p-2">
					<b-table :striped="true" :narrowed="true" :hoverable="true" :loading="loading" paginated backend-pagination :pagination-rounded="true" pagination-size="is-small" :total="totalDataCount" :per-page="pageSize" @page-change="onPageChange" backend-sorting :default-sort-direction="defaultSortOrder" :default-sort="[sortField, sortOrder]" @sort="onSort" sort-icon="arrow-up" sort-icon-size="is-small" :pagination-simple="false" :pagination-position="'top'" :selected.sync="selected_purchase_payment" @select="SelectedPurchasePayment" :data="purchaseReceives">

						<b-table-column field="po_number" label="Purchase No." v-slot="props" sortable>
							<p class="cursor-pointer underline font-bold hover:text-blue-500" @click="ShowDetailsModal">{{ props.row.po_number }}</p>
						</b-table-column>
						<b-table-column label="Date" v-slot="props">
							{{ props.row.dateCreated }}
						</b-table-column>

						<b-table-column label="Supplier" v-slot="props">
							{{ props.row.supplier.name }}
						</b-table-column>

						<!-- 

							Important to change thsi tho receieve total amount
						 -->

						<b-table-column label="Amount" v-slot="props">
							{{ $formatAmountCurrency(props.row.total_amount) }}
						</b-table-column>

						<b-table-column label="Balance" v-slot="props">
							{{ $formatAmountCurrency(props.row.total_amount - $calculateTotals(props.row.payments,'payment_amount')) }}
						</b-table-column>

						<b-table-column label="Status" v-slot="props">
							{{ props.row.status }}
						</b-table-column>

						<b-table-column label="Payment" v-slot="props">
							{{ props.row.payment_status }}
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

						<b-button :disabled="selected_purchase_payment.payment_status == 'Paid'" type="is-success" icon-left="checkbox-multiple-marked" class="is-small mr-1 font-bold px-6" @click="ShowPaymentModal">Create Payment</b-button>

					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div class="my-4 text-sm">

						<p class="mt-4 font-bold text-sm">Items</p>

						<b-table :striped="true" :narrowed="true" sort-icon="arrow-up" sort-icon-size="is-small" :data="selected_purchase_payment_items">
							<b-table-column v-slot="props" field="" label="Product">
								<div class="flex flex-col leading-tight">
									<p><span class="font-semibold text-red-500 mr-2">{{ props.row.product.product_code }}</span>{{ props.row.product.name }}</p>
									<p>{{ props.row.product.description }} - {{ props.row.product.brand.brandname }} - {{ props.row.product.unit.item_unit }}</p>
								</div>
							</b-table-column>

							<b-table-column v-slot="props" field="" label="PO Qty">
								{{ props.row.qty }}
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Received Qty">
								{{ props.row.receive_qty }}
							</b-table-column>

						</b-table>

						<p class="mt-4 font-bold text-sm">Payment Record</p>

						<b-table :striped="true" :narrowed="true" :data="form_purchaseorder_payments">

							<b-table-column v-slot="props" label="Type" class="cell-valign-middle">
								{{ props.row.payment_type }}
							</b-table-column>

							<b-table-column v-slot="props" label="Amount">
								{{ props.row.payment_amount }}
							</b-table-column>

							<b-table-column v-slot="props" label="Status">
								{{ props.row.status }}
							</b-table-column>

						</b-table>

					</div>

				</section>
				<!-- <footer class="modal-card-foot p-3">

					<b-button type="is-secondary" size="is-small">Clear</b-button>
				</footer> -->

			</div>
		</b-modal>

		<b-modal :active.sync="isModalPaymentShow" has-modal-card trap-focus :width="1100" @close="ClosePaymentModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1100px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-bold text-white">Payment Purchase Order</p>
					<div>
						<a href="#" @click.prevent="ClosePaymentModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>

				<header class="px-5 py-2 has-background-pageheader border-b border-gray-200">
					<div class="flex items-center justify-between">

						<div class="my-2 w-1/4 mr-16">
							<p class="font-bold text-xl">{{ selected_purchase_payment.po_number }}</p>
						</div>
						<div class="flex w-full">

							<div class="w-1/3 leading-tight">
								<h4 class="leading-tight text-sm">PO Amount</h4>
								<p class="text-xl font-bold">{{ $formatAmountCurrency(selected_purchase_payment.total_amount) }}</p>
							</div>

							<div class="w-1/3 leading-tight">
								<h4 class="text-sm">Receive Amount</h4>
								<p class="text-xl font-bold">{{ $formatAmountCurrency(selected_purchase_payment.receive_total_amount) }}</p>
							</div>

							<div class="w-1/3 leading-tight">
								<h4 class="text-sm">Balance Amount</h4>
								<p class="text-xl font-bold text-green-500">{{ $formatAmountCurrency(po_balance_topay) }}</p>
							</div>

						</div>

					</div>
				</header>

				<section class="modal-card-body app-modal-form">

					<div class="flex">

						<div class="w-2/3 mr-4">

							<div class="my-2">

								<b-table :striped="true" :narrowed="true" :data="form_purchaseorder_payments">

									<b-table-column v-slot="props" label="Type" class="cell-valign-middle">
										{{ props.row.payment_type }}
									</b-table-column>

									<b-table-column v-slot="props" label="Amount">
										{{ props.row.payment_amount }}
									</b-table-column>

									<b-table-column v-slot="props" label="Status">
										{{ props.row.status }}
									</b-table-column>

									<b-table-column v-slot="props" field="" label="Action">
										<b-button :disabled="props.row.is_new == 0" type="is-danger" size="is-small" icon-left="close" @click="RemovePaymentRow(props)"></b-button>
									</b-table-column>

								</b-table>

							</div>

						</div>

						<div class="my-2 p-4 bg-gray-200 w-1/3">

							<p class="font-bold">Select Payment Type</p>

							<div class="my-2">

								<b-field>
									<b-radio-button size="is-small" expanded v-model="form_purchaseorder_payment.payment_type" native-value="CASH" type="is-primary" @input="ChangePaymentType">
										<span>Cash</span>
									</b-radio-button>

									<b-radio-button size="is-small" expanded v-model="form_purchaseorder_payment.payment_type" native-value="CHEQUE" type="is-primary" @input="ChangePaymentType">
										<span>Cheque</span>
									</b-radio-button>
								</b-field>

							</div>

							<div>

								<b-field label="Cash Amount" custom-class="text-xs">
									<b-input :disabled="form_purchaseorder_payment.payment_type != 'CASH'" size='is-small' type="text" v-model="form_purchaseorder_payment.cash_amount" @input="CheckIsPaymentAllowed"></b-input>
								</b-field>

								<div class="flex">
									<b-field label="Cheque Amount" custom-class="text-xs" class="w-30 mr-1">
										<b-input :disabled="form_purchaseorder_payment.payment_type != 'CHEQUE'" size='is-small' type="text" v-model="form_purchaseorder_payment.cheque_amount" @input="CheckIsPaymentAllowed"></b-input>
									</b-field>
									<b-field label="Cheque Bank" custom-class="text-xs" class="text-xs w-full">
										<v-select :disabled="form_purchaseorder_payment.payment_type != 'CHEQUE'" :options="banks" label="name" maxHeight="100px" @input="SelectedPaymentChequeBank" />
									</b-field>
								</div>

								<div class="flex">

									<b-field label="Cheque Date" custom-class="text-xs" class="w-30 mr-1">
										<b-input :disabled="form_purchaseorder_payment.payment_type != 'CHEQUE'" size='is-small' type="text" v-model="form_purchaseorder_payment.cheque_date"></b-input>
									</b-field>
									<b-field label="Cheque Name" custom-class="text-xs" class="text-xs w-full">
										<b-input :disabled="form_purchaseorder_payment.payment_type != 'CHEQUE'" size='is-small' type="text" v-model="form_purchaseorder_payment.cheque_name"></b-input>
									</b-field>

								</div>

								<b-button :disabled="!isPaymentAllowed" type="is-success" icon-left="plus" class="is-small text-white py-4" @click="AddPaymentRow" expanded>Add this Payment</b-button>

							</div>

						</div>

					</div>

				</section>
				<footer class="modal-card-foot px-5 py-3">
					<b-button type="is-primary" icon-left="plus" class="is-small text-white px-4" @click="SubmitPurchasePayment">Submit Payment</b-button>
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
			banks: 'masterdatas/getBanks'
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

				isPaymentAllowed: false
			}
		},

		methods: {
			...mapActions({
				GetPurchasePayments: 'payments/GetPurchasePayments',
				GetPOReceived: 'purchases/GetPOReceived',
				GetSuppliers: 'partners/GetSuppliers',
				GetBanks: 'masterdatas/GetBanks',

				InsertPurchasePayment: 'purchases/InsertPurchasePayment'
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

			ShowDetailsModal() {
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

			ClosePaymentModal() {
				this.isModalPaymentShow = false
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

				const pos = await this.GetPOReceived({ type: 'Received', params: params })

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