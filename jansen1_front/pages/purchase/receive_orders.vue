<template>
	<div>

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">

			<h3 class="has-text-header">Received PO's</h3>
			<div class="flex items-center">
				<b-button :disabled="selected_purchase_order.id == null || selected_purchase_order.status === 'Close' || selected_purchase_order.status === 'Received'" type="is-success" icon-left="checkbox-multiple-marked" class="is-small mr-1 font-bold px-6" @click="ShowReceiveModal">Receive Purchase Order</b-button>

			</div>

		</div>

		<div class="grid grid-cols-8 gap-4 p-4 has-background-pageheader">

			<div class="col-span-8 wrapper-h bg-white">

				<!-- main table -->
				<div class="text-sm p-2">
					<b-table :striped="true" :narrowed="true" :hoverable="true" :loading="loading" paginated backend-pagination :pagination-rounded="true" pagination-size="is-small" :total="totalDataCount" :per-page="pageSize" @page-change="onPageChange" backend-sorting :default-sort-direction="defaultSortOrder" :default-sort="[sortField, sortOrder]" @sort="onSort" sort-icon="arrow-up" sort-icon-size="is-small" :pagination-simple="false" :pagination-position="'top'" :selected.sync="selected_purchase_order" @select="SelectedPurchaseOrder" :data="purchaseReceives">

						<b-table-column field="po_number" label="Purchase No." v-slot="props" sortable>
							<p class="cursor-pointer underline font-bold hover:text-blue-500" @click="ShowDetailsModal">{{ props.row.po_number }}</p>
						</b-table-column>
						<b-table-column label="Date Sent" v-slot="props">
							{{ props.row.dateCreated }}
						</b-table-column>
						<b-table-column field="supplier_id" label="Supplier" v-slot="props" sortable>
							{{ props.row.supplier.name }}
						</b-table-column>
						<b-table-column label="PO Amount" v-slot="props">
							{{ $formatAmountCurrency(props.row.total_amount) }}
						</b-table-column>
						<b-table-column label="Receive Amount" v-slot="props">
							{{ $formatAmountCurrency(props.row.receive_total_amount) }}
						</b-table-column>
						<b-table-column label="Status" v-slot="props">
							{{ props.row.status }}
						</b-table-column>

						<template slot="top-left">
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
						</template>

					</b-table>
				</div>

			</div>

		</div>

		<b-modal :active.sync="isModalDetailsShow" has-modal-card trap-focus :width="1000" @close="CloseDetailsModal" :destroy-on-hide="false">

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
							<p v-if="selected_purchase_order.supplier_id != null">Supplier <span class="font-bold">{{ selected_purchase_order.supplier.name }}</span></p>
						</div>
						<div class="w-1/2">
							<p>PO Amount <span class="font-bold">{{ $formatAmountCurrency(selected_purchase_order.total_amount) }}</span></p>
							<p>Receive Amount <span class="font-bold">{{ $formatAmountCurrency(selected_purchase_order.receive_total_amount) }}</span></p>
							<!-- <p>Witheld Amount <span class="font-bold">
									<b-input :disabled="selected_purchase_order.payment_status === 'Paid'" size='is-small' type="text" v-model="selected_purchase_order.withold_amount"></b-input>
								</span></p> -->

							<b-field class="flex items-center">
								<label for="" class="mr-2">Witheld Amount</label>
								<b-numberinput :controls="false" :disabled="selected_purchase_order.payment_status === 'Paid'" type="is-primary" size="is-small" class="w-40" v-model="po_withold_amount"></b-numberinput>
							</b-field>

						</div>

					</div>

					<div v-if="new_po_total_amount > 0" class="bg-yellow-200 p-2 my-2">
						<p>New Total PO Received Amount : {{ $formatAmountCurrency(new_po_total_amount) }}</p>
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
								<!-- {{ props.row.actual_price }} -->
								<!-- <b-input :disabled="selected_purchase_order.status !== 'Sent' || parseFloat(props.row.quotation_price) <= 0 || props.row.quotation_price == null" size='is-small' expanded type="text" v-model="props.row.quotation_price" @input="RecalculateSelectedPoItemToTalAmount(props)"></b-input> -->
								<b-input :disabled="selected_purchase_order.status !== 'Received' || parseFloat(props.row.actual_price) <= 0 || props.row.actual_price == null || selected_purchase_order.payment_status === 'Paid'" size='is-small' expanded type="text" v-model="props.row.actual_price" @input="RecalculateSelectedPoItemToTalAmount(props)"></b-input>
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Quoted">
								<!-- {{ props.row.quotation_price }} -->
								<b-input :disabled="selected_purchase_order.status !== 'Received' || parseFloat(props.row.quotation_price) <= 0 || props.row.quotation_price == null" size='is-small' expanded type="text" v-model="props.row.quotation_price" @input="RecalculateSelectedPoItemToTalAmount(props)"></b-input>
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Qty">
								{{ $formatAmount(props.row.qty,0) }}
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Item Total">
								{{ $formatAmount(props.row.total_item_amount) }}
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Receive Qty">
								{{ $formatAmount(props.row.receive_qty,0) }}
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Receive Total">
								{{ $formatAmount(props.row.receive_total_amount) }}
							</b-table-column>

							<!-- tbl_purchaseorder_items_columns: [
								{ field: 'product.name', label: 'Product', width: '150' },
								{ field: 'qty', label: 'PO Qty', width: '40' },
								{ field: 'actual_price', label: 'Actual Price', width: '40' },
								{ field: 'total_item_amount', label: 'PO Total Amount', width: '40' },
								{ field: 'receive_qty', label: 'Receive Qty', width: '40' }
							], -->

						</b-table>

					</div>

				</section>
				<footer class="modal-card-foot px-5 py-3">

					<b-button :disabled="selected_purchase_order.status !== 'Received' || selected_purchase_order.payment_status === 'Paid'" type="is-primary" size="is-small" @click="UpdateSelectedPurchaseOrderReceivedPrice">Submit PO Received Update</b-button>
					<!-- <b-button :disabled="selected_purchase_order.payment_status === 'Paid'" type="is-primary" size="is-small" @click="UpdateSelectedPurchaseOrderReceivedPrice">Submit PO Received Update</b-button> -->
				</footer>

			</div>
		</b-modal>

		<b-modal :active.sync="isModalReceiveShow" has-modal-card trap-focus :width="1100" @close="CloseReceiveModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1100px;">

				<header class="modal-card-head p-5 has-background-primary flex items-center">
					<p class="modal-card-title text-base font-bold text-white">Receive Purchase Order</p>
					<div>
						<a href="#" @click.prevent="CloseReceiveModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>

				<header class="px-5 py-2 has-background-pageheader border-b border-gray-200">
					<div class="flex">
						<div class="w-1/2">
							<p>Purchase Order No. <span class="font-bold">{{ selected_purchase_order.po_number }}</span></p>
							<p>PO Date <span class="font-bold">{{ selected_purchase_order.dateCreated }}</span></p>
							<p v-if="selected_purchase_order.supplier_id != null">Supplier <span class="font-bold">{{ selected_purchase_order.supplier.name }}</span></p>

						</div>
						<div class="w-1/2">
							<p>PO Amount <span class="font-bold">{{ $formatAmountCurrency(selected_purchase_order.total_amount) }}</span></p>
							<p>Receive Amount <span class="font-bold">{{ $formatAmountCurrency(selected_purchase_order.receive_total_amount) }}</span></p>
							<b-field class="flex items-center">
								<label for="" class="mr-2">Witheld Amount</label>
								<b-numberinput :controls="false" type="is-primary" size="is-small" class="w-40" v-model="po_withold_amount"></b-numberinput>
							</b-field>

						</div>
					</div>
				</header>
				<section class="modal-card-body app-modal-form text-sm">

					<div class="my-4 text-sm">

						<b-table :striped="true" :narrowed="true" sort-icon="arrow-up" sort-icon-size="is-small" :data="form_receive_items">

							<b-table-column v-slot="props" field="" label="Product">
								<div class="flex flex-col leading-tight">
									<p><span class="font-semibold text-red-500 mr-2">{{ props.row.product.product_code }}</span>{{ props.row.product.name }}</p>
									<p>{{ props.row.product.description }} - {{ props.row.product.brand.brandname }} - {{ props.row.product.unit.item_unit }}</p>
								</div>
							</b-table-column>

							<b-table-column label="Cost" v-slot="props">
								{{ props.row.price }}
							</b-table-column>

							<b-table-column label="Quoted" v-slot="props">
								{{ props.row.quotation_price }}
							</b-table-column>

							<b-table-column label="Qty." v-slot="props" centered>
								{{ props.row.po_quantity }}
							</b-table-column>

							<b-table-column label="Actual Receive Qty." v-slot="props" width="150">
								<b-field>
									<b-numberinput size='is-small' :min="props.row.old_receive_quantity" controls-position="compact" v-model="props.row.receive_quantity" @input="CalculateItemTotals(props)"></b-numberinput>
								</b-field>
							</b-table-column>

							<!-- <b-table-column label="Amount" v-slot="props" width="150">
								<b-input disabled type="is-primary" size="is-small" v-model="props.row.receive_total_amount" />
							</b-table-column> -->

							<b-table-column label="Receive Status" v-slot="props" centered>
								<p :class="$RenderColorStatus(props.row.receive_item_status, 'text')">{{ props.row.receive_item_status }}</p>
							</b-table-column>

							<b-table-column label="Auto Transfer To" v-slot="props">
								<!-- <b-select size="is-small" v-model="props.row.auto_transfer_to_branch" @input="SelectedItemToAutoTransfer(props)">
									<option selected :value="null"></option>
									<option value="SG">Solidgold</option>
									<option value="EG" disabled>Evergold</option>
									<option value="GM">Goldmaster</option>
									<option value="HM">Homemaster</option>
								</b-select> -->

								<b-select size="is-small" v-model="props.row.auto_transfer_to_branch" @input="SelectedItemToAutoTransfer(props)">
									<option selected :value="null"></option>
									<option v-for="(branch,idx) in branches.filter(item => { return item.branch_code != selectedBranch.branch_code }) " :key="idx" :value="branch.branch_code">{{ branch.name }}</option>
								</b-select>
							</b-table-column>

							<b-table-column label="Transfer Qty." v-slot="props" width="150">
								<b-field>
									<b-numberinput :disabled="props.row.autotransfer_quantity === 0" size='is-small' expanded :min="props.row.old_receive_quantity" :max="props.row.receive_quantity" controls-position="compact" v-model="props.row.autotransfer_quantity"></b-numberinput>
								</b-field>
							</b-table-column>

							<template slot="top-left">

							</template>

						</b-table>

					</div>

				</section>
				<footer class="modal-card-foot px-5 py-3">
					<b-button type="is-primary" size="is-small" @click="SavePurchaseReceiveForm" icon-left="content-save">Confirm Receive Items</b-button>
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
			module: 'po-receive'
		},

		computed: {
			...mapGetters({
				// purchaseOrderItems: 'purchases/getPurchaseOrderItems',
				// receivePurchaseOrders: 'purchases/getReceivePurchaseOrders',
				suppliers: 'partners/getSuppliers',
				branches: 'masterdatas/getBranches',
				selectedBranch: 'getSelectedBranch'
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

				purchaseReceives: [],
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

				selected_purchase_order: {},
				selected_po_items: [],

				form_receive_items: [],

				isModalDetailsShow: false,
				isModalReceiveShow: false,

				new_po_total_amount: 0,

				po_withold_amount: 0
			}
		},

		methods: {
			...mapActions({
				GetPurchaseReceives: 'purchases/GetPurchaseReceives',

				GetPurchaseOrderItems: 'purchases/GetPurchaseOrderItems',
				GetSuppliers: 'partners/GetSuppliers',

				//UpdatePurchaseOrderStatus: 'purchases/UpdatePurchaseOrderStatus',

				InsertPurchaseReceive: 'purchases/InsertPurchaseReceive',

				UpdatePurchaseOrderReceivedPrice: 'purchases/UpdatePurchaseOrderReceivedPrice'
			}),

			...mapMutations({}),

			SelectedPurchaseOrder(data) {
				this.po_withold_amount = 0

				this.selected_purchase_order = data

				//this.selected_po_items = this.selected_purchase_order.po_items
				this.selected_po_items = this.$clearReactive(this.selected_purchase_order.po_items)

				// put to withhold amount
				this.po_withold_amount = parseFloat(this.selected_purchase_order.withold_amount)
			},

			ShowDetailsModal() {
				// put to withhold amount
				this.po_withold_amount = parseFloat(this.selected_purchase_order.withold_amount)

				this.isModalDetailsShow = true
			},

			CloseDetailsModal() {
				this.po_withold_amount = 0
				this.isModalDetailsShow = false
			},

			ShowReceiveModal() {
				// put to withhold amount
				this.po_withold_amount = parseFloat(this.selected_purchase_order.withold_amount)

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
				this.po_withold_amount = 0
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

			async SavePurchaseReceiveForm() {
				//detect if there are any auto transfer.
				let message = null
				let checkTransferQtyError = 0

				const checkAutoTransfer = this.form_receive_items.filter((item) => {
					return item.auto_transfer_to_branch
				})

				if (!this.po_withold_amount) {
					this.po_withold_amount = 0
				}

				if (checkAutoTransfer.length > 0) {
					//check if the transfer qty is not exceeding
					for (var i = 0; i < checkAutoTransfer.length; i++) {
						let receive_quantity = parseFloat(checkAutoTransfer[i].receive_quantity)
						let autotransfer_quantity = parseFloat(checkAutoTransfer[i].autotransfer_quantity)

						if (autotransfer_quantity > receive_quantity) {
							checkTransferQtyError = parseInt(checkTransferQtyError) + 1
						}
					}
				}

				if (checkTransferQtyError > 0) {
					this.$buefy.dialog.alert({
						message: 'Quantity to be transferred is greater than Quantity received. <br /> Please correct the information and try again.',
						type: 'is-danger',
						hasIcon: true,
						icon: 'alert-circle',
						iconPack: 'mdi',
						ariaRole: 'alertdialog',
						ariaModal: true
					})
				} else {
					//proceed
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
						console.log(this.po_withold_amount)
						//let takeout the reactiveness

						let payload = {
							purchaseorder: this.$clearReactive(this.selected_purchase_order),
							items: this.form_receive_items,
							auto_transfers: checkAutoTransfer
						}

						payload.purchaseorder.withold_amount = this.po_withold_amount

						const res = await this.InsertPurchaseReceive(payload)
						if (res.status === 'ok') {
							this.CloseReceiveModal()
							this.CloseDetailsModal()
							this.LoadAsyncData()
						}
					}
				}
			},

			// Added 20210321 - to support editing of price
			async UpdateSelectedPurchaseOrderReceivedPrice() {
				// update price
				// recalculate

				if (!this.po_withold_amount) {
					this.po_withold_amount = 0
				}

				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>update</b> the Price/s? This action cannot be undone.',
					confirmText: 'Update Price/s',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					const payload = {
						po: this.$clearReactive(this.selected_purchase_order),
						po_items: this.selected_po_items
					}

					payload.po.withold_amount = this.po_withold_amount

					const res = await this.UpdatePurchaseOrderReceivedPrice(payload)

					if (res.status === 'ok') {
						this.CloseDetailsModal()
						this.LoadAsyncData()
						this.new_po_total_amount = 0
					}
				}
			},

			RecalculateSelectedPoItemToTalAmount(props) {
				let idx = props.index

				let price = 0
				if (parseFloat(props.row.quotation_price) > 0) {
					price = parseFloat(props.row.quotation_price)
				} else {
					price = parseFloat(props.row.actual_price)
				}

				let total_amount = parseFloat(props.row.qty) * price
				let receive_total_amount = parseFloat(props.row.receive_qty) * price

				this.selected_po_items[idx].total_item_amount = total_amount.toFixed(2)
				this.selected_po_items[idx].receive_total_amount = receive_total_amount.toFixed(2)

				this.new_po_total_amount = this.$calculateTotals(this.selected_po_items, 'receive_total_amount')
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

				const pos = await this.GetPurchaseReceives(params)

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

			TestingWithold(e) {
				this.po_withold_amount = parseFloat(e)
			}
		},

		mounted() {
			this.LoadAsyncData()
			this.GetSuppliers()
		}
	}
</script>

<style scoped>
	.wrapper-h {
		height: calc(100vh - 125px);
	}
</style>
