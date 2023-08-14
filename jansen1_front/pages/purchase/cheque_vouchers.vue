<template>
	<div>

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">

			<h3 class="has-text-header">Cheque Vouchers</h3>
			<b-button type="is-primary" icon-left="printer" class="is-small text-white" @click="Print">Print</b-button>
		</div>

		<div class="grid grid-cols-8 gap-4 p-4 has-background-pageheader">

			<div class="col-span-8 wrapper-h bg-white">

				<!-- main table -->
				<div class="text-sm p-2">
					<b-table :striped="true" :narrowed="true" :hoverable="true" :loading="loading" paginated backend-pagination :pagination-rounded="true" pagination-size="is-small" :total="totalDataCount" :per-page="pageSize" @page-change="onPageChange" backend-sorting :default-sort-direction="defaultSortOrder" :default-sort="[sortField, sortOrder]" @sort="onSort" sort-icon="arrow-up" sort-icon-size="is-small" :pagination-simple="false" :pagination-position="'top'" :selected.sync="selected_voucher" @select="SelectedVoucher" :data="chequeVouchers">

						<b-table-column label="Voucher no." v-slot="props">
							{{ props.row.cheque_voucher_no }}
						</b-table-column>

						<b-table-column label="Date" v-slot="props">
							{{ $formatDateByFormat(props.row.created_at,'MMM-DD-YYYY HH:mm:ss') }}
						</b-table-column>

						<b-table-column label="Amount" v-slot="props">
							{{ $formatAmountCurrency(props.row.cheque_amount) }}
						</b-table-column>

						<b-table-column label="Bank" v-slot="props">
							{{ props.row.cheque_bank }}
						</b-table-column>

						<b-table-column label="Name" v-slot="props">
							{{ props.row.cheque_name }}
						</b-table-column>

						<b-table-column label="Cheque No." v-slot="props">
							{{ props.row.cheque_no }}
						</b-table-column>

						<b-table-column label="Cheque Date" v-slot="props">
							{{ props.row.cheque_date }}
						</b-table-column>

						<!-- <template slot="top-left">
							<div class="flex">

								<b-field label="PO No." custom-class="font-semibold text-xs no-mb-labels" class="w-40 text-xs mr-1">
									<b-input type="primary" size="is-small" v-model="filterPO" @input="FilterByPO"></b-input>
								</b-field>

								<client-only placeholder="Loading...">
									<b-field label="Suppliers" custom-class="font-semibold text-xs no-mb-labels" class="w-64 text-xs mr-1" style="width:300px;">
										<v-select :options="suppliers" label="name" v-model="filterSupplier" :reduce="supplier => supplier.supplier_id" @input="FilterBySupplier" />
									</b-field>
								</client-only>

							</div>
						</template> -->

					</b-table>
				</div>

			</div>

		</div>

		<!-- <b-modal :active.sync="isModalDetailsShow" has-modal-card trap-focus :width="1000" @close="CloseDetailsModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1000px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-bold text-white">Purchase Order Details</p>
					<div>
						<a href="#" @click.prevent="CloseDetailsModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>

				<header class="px-5 py-2 has-background-pageheader border-b border-gray-200">
					<div class="flex items-center justify-end">

						<b-button :disabled="selected_purchase_order.status === 'Close' || selected_purchase_order.status === 'Received'" type="is-success" icon-left="checkbox-multiple-marked" class="is-small mr-1 font-bold px-6" @click="ShowReceiveModal">Receive Purchase Order</b-button>

					</div>
				</header>

				<section class="modal-card-body app-modal-form">

					<div class="flex">
						<div class="w-1/2">
							<p>Purchase Order No. <span class="font-bold">{{ selected_purchase_order.po_number }}</span></p>
							<p>PO Date <span class="font-bold">{{ selected_purchase_order.dateCreated }}</span></p>
						</div>
						<div class="w-1/2">
							<p>Total Amount <span class="font-bold">{{ selected_purchase_order.total_amount }}</span></p>
							<p v-if="selected_purchase_order.supplier_id != null">Supplier <span class="font-bold">{{ selected_purchase_order.supplier.name }}</span></p>
						</div>

					</div>

					<div class="my-4 text-sm">

						<b-table :striped="true" :narrowed="true" sort-icon="arrow-up" sort-icon-size="is-small" :data="selected_po_items">

							<b-table-column v-slot="props" field="" label="Product">
								<div class="flex flex-col leading-tight">
									<p><span class="font-semibold text-red-500 mr-2">{{ props.row.product.product_code }}</span>{{ props.row.product.name }}</p>
									<p>{{ props.row.product.description }} - {{ props.row.product.brand.brandname }} - {{ props.row.product.unit.item_unit }}</p>
								</div>
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Cost">
								{{ props.row.actual_price }}
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Quoted">
								{{ props.row.quotation_price }}
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Qty">
								{{ props.row.qty }}
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Item Total">
								{{ props.row.total_item_amount }}
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Receive Qty">
								{{ props.row.receive_qty }}
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Receive Total">
								{{ props.row.receive_total_amount }}
							</b-table-column>

							

						</b-table>

					</div>

				</section>

			</div>
		</b-modal> -->

	</div>
</template>

<script>
	import { mapActions, mapMutations, mapGetters } from 'vuex'
	import dayjs from 'dayjs'
	import { debounce } from 'lodash'

	export default {
		components: {},
		meta: {
			module: 'cheque-vouchers'
		},

		computed: {
			...mapGetters({
				suppliers: 'partners/getSuppliers'
			})
		},

		data() {
			return {
				tbl_purchaseorder_items_columns: [
					{ field: 'product.name', label: 'Product', width: '150' },
					{ field: 'qty', label: 'PO Qty', width: '40' },
					{ field: 'actual_price', label: 'Actual Price', width: '40' },
					{ field: 'total_item_amount', label: 'PO Total Amount', width: '40' },
					{ field: 'receive_qty', label: 'Receive Qty', width: '40' }
				],

				chequeVouchers: [],
				totalDataCount: 0,
				loading: false,
				sortField: 'id',
				sortOrder: 'desc',
				defaultSortOrder: 'desc',
				page: 1,
				pageSize: 10,

				filters: [],

				filterPO: null,
				filterSupplier: null,

				selected_voucher: {},
				selected_po_items: [],

				form_receive_items: [],

				isModalDetailsShow: false,
				isModalReceiveShow: false
			}
		},

		methods: {
			...mapActions({
				GetChequeVouchers: 'payments/GetChequeVouchers'
			}),

			...mapMutations({}),

			SelectedVoucher(data) {
				this.selected_voucher = data
			},

			ShowDetailsModal() {
				this.isModalDetailsShow = true
			},

			CloseDetailsModal() {
				this.isModalDetailsShow = false
			},

			ShowReceiveModal() {
				// map items to form
				this.form_receive_items = this.selected_po_items.map((item) => {
					return {
						id: item.id,
						product: item.product,
						// not final -----> needs to be check
						price: item.actual_price,
						quotation_price: item.quotation_price,
						po_quantity: item.qty,
						autotransfer_quantity: 0,

						receive_quantity: item.receive_qty || 0,
						//receive_quantity: item.qty || 0,

						old_receive_quantity: item.receive_qty || 0,
						receive_total_amount: item.receive_total_amount || 0,
						receive_item_status: this.CheckItemReceiveStatus(item)
					}
				})
				this.isModalReceiveShow = true
			},

			SelectedItemToAutoTransfer(props) {
				if (props.row.auto_transfer_to_branch !== null) {
					this.form_receive_items[props.index].autotransfer_quantity = props.row.receive_quantity
				} else {
					this.form_receive_items[props.index].autotransfer_quantity = 0
				}
			},

			CloseReceiveModal() {
				this.isModalReceiveShow = false
			},

			CalculateItemTotals(data) {
				//calculate item total amount
				var idx = data.index

				var item_total_amount = data.row.price * data.row.receive_quantity
				this.form_receive_items[idx].receive_total_amount = item_total_amount.toFixed('2')

				//update the receive item status

				var item_status = null
				if (data.row.po_quantity == data.row.receive_quantity) {
					item_status = 'Fullfilled'
				}

				if (data.row.po_quantity < data.row.receive_quantity) {
					item_status = 'Over'
				}

				if (data.row.po_quantity > data.row.receive_quantity && data.row.receive_quantity != 0) {
					item_status = 'Partial'
				}

				this.form_receive_items[idx].receive_item_status = item_status
			},

			CheckItemReceiveStatus(data) {
				var item_status = null
				if (data.qty == data.receive_qty) {
					item_status = 'Fullfilled'
				}

				if (data.qty < data.receive_qty) {
					item_status = 'Over'
				}

				if (data.qty > data.receive_qty && data.receive_qty != 0) {
					item_status = 'Partial'
				}

				return item_status
			},

			Print() {
				alert('print')
			},

			async SavePurchaseReceiveForm() {
				//detect if there are any auto transfer.
				let message = null

				const checkAutoTransfer = this.form_receive_items.filter((item) => {
					return item.auto_transfer_to_branch
				})

				if (checkAutoTransfer.length > 0) {
					//have auto transfer
					message = 'You have selected some items to be <b>AUTO TRANSFERRED</b> to selected branch. Please double check the details before you confirm.<br/>This action cannot be undone.'
				} else {
					//no auto transfer
					message = 'Are you sure you want to <b>RECEIVE</b> this PO items? Please double check the details before you confirm.<br/>This action cannot be undone.'
				}

				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: message,
					confirmText: 'Submit PO',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					const payload = {
						purchaseorder: this.selected_purchase_order,
						items: this.form_receive_items,
						auto_transfers: checkAutoTransfer
					}

					console.log(checkAutoTransfer)
					console.log(this.form_receive_items)

					const res = await this.InsertPurchaseReceive(payload)
					if (res.status === 'ok') {
						this.CloseReceiveModal()
						this.CloseDetailsModal()
						this.LoadAsyncData()
					}
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

				const vouchers = await this.GetChequeVouchers(params)

				this.chequeVouchers = []
				this.chequeVouchers = vouchers.data.results
				this.totalDataCount = vouchers.data.total

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

				// this.filters.push({ field: 'transaction_date', value: formattedDate, type: 'like' })
				this.filters.push({ field: 'po_number', value: this.filterPO, type: 'like' })
				this.filters.push({ field: 'supplier_id', value: this.filterSupplier, type: '=' })

				this.LoadAsyncData()
			},

			FilterByPO(value) {
				this.searchDebounce(this)
			},

			FilterBySupplier(value) {
				this.searchDebounce(this)
			},

			searchDebounce: debounce((vm) => {
				vm.onFilterData()
			}, 500),

			Print() {
				let obj = {
					type: 'Cheque_Voucher',
					branch_code: this.$store.state.selectedBranch.branch_code,
					ref_field: 'cheque_voucher_no',
					ref_no: this.selected_voucher.cheque_voucher_no
				}

				let urlParams = new URLSearchParams(obj).toString()

				window.open('/printing/cheque_voucher?' + urlParams, '_blank', 'location=yes,height=768,width=800,scrollbars=yes,status=yes')

				//window.open('/printing/cheque_voucher?params=' + urlParams, '_blank', 'location=yes,height=768,width=800,scrollbars=yes,status=yes')
			}
		},

		mounted() {
			this.LoadAsyncData()
			// this.LoadAsyncData()
			// this.GetSuppliers()
			// console.log(this.selected_purchase_order)
		}
	}
</script>

<style scoped>
	.wrapper-h {
		height: calc(100vh - 125px);
	}
</style>
