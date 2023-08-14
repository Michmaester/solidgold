<template>
	<div>

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">

			<h3 class="has-text-header">Purchase Order</h3>
			<div class="flex items-center">
				<b-button type="is-success" icon-left="playlist-plus" class="is-small mr-1" @click="NewPurchaseOrder">Create New Purchase Order</b-button>
				<b-button :disabled="selected_purchase_order.status != 'PO'" type="is-primary" icon-left="playlist-edit" class="is-small mr-1" @click="EditPurchaseOrder">Edit PO</b-button>

				<b-dropdown aria-role="list" position="is-bottom-left">
					<b-button class="button is-primary" size="is-small" slot="trigger" slot-scope="{ active }">
						<span>Actions</span>
						<b-icon size="is-small" :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
					</b-button>
					<b-dropdown-item aria-role="listitem" :disabled="checked_purchaseorder.length <= 0 || selected_purchase_order.status !== 'PO'" @click="CancelPurchaseOrder" class="flex items-center">
						<b-icon icon="close-box-multiple-outline" size="is-small" class="mr-2"></b-icon>
						<span>Cancel Purchase Order</span>
					</b-dropdown-item>
					<hr class="dropdown-divider">
					<b-dropdown-item aria-role="listitem" :disabled="checked_purchaseorder.length <= 0 || selected_purchase_order.status !== 'Partial'" @click="ClosePurchaseOrder" class="flex items-center">
						<b-icon icon="check" size="is-small" class="mr-2"></b-icon>
						<span>Close Purchase Order</span>
					</b-dropdown-item>
					<hr class="dropdown-divider">
					<b-dropdown-item aria-role="listitem" :disabled="checked_purchaseorder.length <= 0 || !$checkPropValueEqual(checked_purchaseorder, 'status', 'PO')" @click="SendToSupplier" class="flex items-center">
						<b-icon icon="send-check" size="is-small" class="mr-2"></b-icon>
						<span>Send to Supplier</span>
					</b-dropdown-item>
					<b-dropdown-item aria-role="listitem" :disabled="selected_purchase_order.id == null" @click="Print" class="flex items-center">
						<b-icon icon="printer" size="is-small" class="mr-2"></b-icon>
						<span>Print</span>
					</b-dropdown-item>
				</b-dropdown>

				<!-- actions -->

			</div>

		</div>

		<div class="grid grid-cols-8 gap-4 p-4 has-background-pageheader">

			<div class="col-span-8 wrapper-h bg-white text-sm">

				<!-- <b-field>
					<v-select :options="product_lists" label="name" maxHeight="100px" />
				</b-field> -->

				<!-- main table -->
				<div class="p-2">

					<b-table :striped="true" :narrowed="true" :hoverable="true" :loading="loading" paginated backend-pagination :pagination-rounded="true" pagination-size="is-small" :total="totalDataCount" :per-page="pageSize" @page-change="onPageChange" backend-sorting :default-sort-direction="defaultSortOrder" :default-sort="[sortField, sortOrder]" @sort="onSort" sort-icon="arrow-up" sort-icon-size="is-small" :pagination-simple="false" :pagination-position="'top'" :checked-rows.sync="checked_purchaseorder" :is-row-checkable="(row) => row.status == 'PO' || row.status == 'Approved' || row.status == 'Partial'" checkable :checkbox-position="'right'" :selected.sync="selected_purchase_order" @select="SelectedPurchaseOrder" :data="purchaseOrders">

						<b-table-column v-slot="props" field="" label="Purchase No.">
							<p @click="ShowPoDetails(props.row)" class="underline font-bold cursor-pointer hover:text-blue-500">{{ props.row.po_number }}</p>
						</b-table-column>

						<b-table-column v-slot="props" field="" label="Date">
							{{ props.row.dateCreated }}
						</b-table-column>

						<b-table-column v-slot="props" field="" label="Supplier">
							{{ props.row.supplier.name }}
						</b-table-column>

						<b-table-column v-slot="props" field="" label="PO Amount">
							{{ $formatAmountCurrency(props.row.total_amount) }}
						</b-table-column>

						<b-table-column v-slot="props" field="" label="Receive Amount">
							{{ $formatAmountCurrency(props.row.receive_total_amount) }}
						</b-table-column>

						<b-table-column v-slot="props" field="" label="Witheld">
							{{ $formatAmountCurrency(props.row.withold_amount) }}
						</b-table-column>

						<!-- <b-table-column v-slot="props" field="" label="Terms">
							{{ props.row.terms }}
						</b-table-column> -->

						<b-table-column v-slot="props" field="" label="Status">
							{{ props.row.status }}
						</b-table-column>

						<b-table-column v-slot="props" field="" label="Payment">
							<p :class="$RenderColorStatus(props.row.payment_status,'text')">
								{{ props.row.payment_status }}
							</p>
						</b-table-column>

						<template slot="top-left">
							<div class="flex">

								<b-field label="PO No." custom-class="font-semibold text-xs no-mb-labels" class="w-40 text-xs mr-1">
									<b-input type="primary" size="is-small" v-model="filterPO" @input="FilterByPO"></b-input>
								</b-field>

								<b-field label="Status" custom-class="font-semibold text-xs no-mb-labels" class="w-40 text-xs mr-1">
									<b-input type="primary" size="is-small" v-model="filterStatus" @input="FilterByStatus"></b-input>
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

		<b-modal :active.sync="isModalPODetailsShow" has-modal-card trap-focus :width="1000" @close="CloseDetailsModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1000px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-semibold text-white">Purchase Order Details</p>
					<div class="flex">
						<a href="#" @click.prevent="CloseDetailsModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div class="flex">
						<div class="w-1/3">
							<p class="font-bold">Purchase No. : <span class="font-normal underline">{{ selected_purchase_order.po_number }}</span></p>
							<p class="font-bold">PO Date : <span class="font-normal">{{ selected_purchase_order.dateCreated }}</span></p>
						</div>
						<div class="w-1/3">
							<p class="font-bold">PO Amount : <span class="font-normal">{{ $formatAmountCurrency(selected_purchase_order.total_amount) }}</span></p>
							<p class="font-bold" v-if="selected_purchase_order.supplier_id != null">Supplier : <span class="font-normal">{{ selected_purchase_order.supplier.name || null }}</span></p>
						</div>
						<div class="w-1/3">
							<p class="font-bold">Status : <span class="font-normal">{{ selected_purchase_order.status }}</span></p>
							<p class="font-bold">Payment : <span class="font-normal">{{ selected_purchase_order.payment_status }}</span></p>
						</div>
					</div>

					<div v-if="new_po_total_amount > 0" class="bg-yellow-200 p-2 my-2">
						<p>New Total PO Amount : {{ $formatAmountCurrency(new_po_total_amount) }}</p>
					</div>

					<div v-if="selected_purchase_order.po_type == null" class="text-sm">

						<b-table :bordered="false" :striped="true" :narrowed="true" :hoverable="true" :loading="false" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="10" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :data="selected_po_items">

							<b-table-column v-slot="props" field="" label="Items">
								<div class="flex flex-col leading-tight">
									<p><span class="font-semibold text-red-500 mr-2">{{ props.row.product.product_code }}</span>{{ props.row.product.name }}</p>
									<p>{{ props.row.product.description }} - {{ props.row.product.brand.brandname }} - {{ props.row.product.unit.item_unit }}</p>
								</div>
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Qty">
								{{ $formatAmount(props.row.qty,0) }}
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Actual Price">
								<!-- {{ props.row.actual_price }} -->
								<b-input :disabled="selected_purchase_order.status !== 'Sent' || parseFloat(props.row.actual_price) <= 0 || props.row.actual_price == null" size='is-small' expanded type="text" v-model="props.row.actual_price" @input="RecalculateSelectedPoItemToTalAmount(props)"></b-input>
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Quotation Price">
								<!-- {{ props.row.quotation_price }} -->
								<b-input :disabled="selected_purchase_order.status !== 'Sent' || parseFloat(props.row.quotation_price) <= 0 || props.row.quotation_price == null" size='is-small' expanded type="text" v-model="props.row.quotation_price" @input="RecalculateSelectedPoItemToTalAmount(props)"></b-input>
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Discount">
								{{ $formatAmount(props.row.item_discount) }}
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Total Amount">
								{{ $formatAmount(props.row.total_item_amount) }}
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Delivered Amount">
								{{ $formatAmount(props.row.delivered_total_amount) }}
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
							<b-table :bordered="false" :striped="true" :narrowed="true" :hoverable="true" :loading="false" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="10" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :data="selected_po_items">

								<b-table-column v-slot="props" field="" label="Product">
									<div class="flex flex-col leading-tight">
										<p><span class="font-semibold text-red-500 mr-2">{{ props.row.nt_item }}</span></p>
										<p>{{ props.row.nt_item_description }}</p>
									</div>
								</b-table-column>

								<b-table-column v-slot="props" field="" label="Qty">
									{{ props.row.qty }}
								</b-table-column>

								<b-table-column v-slot="props" field="" label="Actual Price">
									<!-- {{ props.row.actual_price }} -->
									<b-input :disabled="selected_purchase_order.status !== 'Close'" size='is-small' expanded type="text" v-model="props.row.actual_price" @input="RecalculateSelectedPoItemToTalAmount(props)"></b-input>
								</b-table-column>

								<b-table-column v-slot="props" field="" label="Total Amount">
									{{ props.row.total_item_amount }}
								</b-table-column>

							</b-table>
						</div>

					</div>

				</section>
				<footer class="modal-card-foot px-5 py-3">
					<b-button :disabled="selected_purchase_order.status !== 'Sent' && selected_purchase_order.status != 'Close'" type="is-primary" size="is-small" @click="UpdateSelectedPurchaseOrderPrice">Submit PO Update</b-button>
				</footer>

			</div>
		</b-modal>

		<b-modal :active.sync="isModalShow" has-modal-card trap-focus :width="1200" @close="ClosePurchaseOrderModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1200px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-semibold text-white">Purchase Order Form</p>
					<div class="flex items-center">

						<b-switch class="mr-2" size="is-small" :value="true" type="is-danger" v-model="isNonTradePurchase" @input="NonTradeSwitch">Non-Trade Purchase Order</b-switch>

						<a href="#" @click.prevent="ClosePurchaseOrderModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div class="flex">

						<div class="flex flex-col w-2/6 mr-2">

							<div class="flex w-full">
								<!-- <b-field label="PO No" custom-class="text-xs">
									<b-input disabled size='is-small' type="text" v-model="form_purchaseorder.po_number"></b-input>
								</b-field> -->
								<b-field label="Total Amount" custom-class="text-xs" class="mr-2 w-1/2">
									<b-input disabled size='is-small' expanded type="text" v-model="form_purchaseorder.total_amount"></b-input>
								</b-field>
								<b-field label="Total Discount" custom-class="text-xs" class="w-1/2">
									<b-input disabled size='is-small' expanded type="text" v-model="form_purchaseorder.total_discount"></b-input>
								</b-field>
							</div>

							<div class="flex w-full">
								<b-field label="PO date" custom-class="text-xs" class="mr-2 w-1/2">
									<b-input size='is-small' type="text" v-model="form_purchaseorder.date_created"></b-input>
								</b-field>
								<client-only placeholder="Loading...">
									<b-field label="Branch" custom-class="text-xs" class="w-1/2">
										<v-select :disabled="isSinglePurchase" :options="branches" label="name" maxHeight="100px" class="text-xs" v-model="form_purchaseorder.branch" />
									</b-field>
								</client-only>
							</div>

							<div class="flex w-full">
								<client-only placeholder="Loading...">
									<b-field label="Supplier" custom-class="text-xs" class="w-full">
										<v-select :options="suppliers" label="name" maxHeight="100px" class="text-xs" v-model="form_purchaseorder.supplier" />
									</b-field>
								</client-only>
							</div>

						</div>

						<div class="bg-gray-200 w-4/6 p-4">

							<div class="flex items-center">

								<p class="font-bold mr-4">Select Payment</p>

								<b-field>
									<b-radio-button :disabled="!isFormCreate" size="is-small" v-model="form_purchaseorder_payment.payment_type" native-value="NOPAYMENT" type="is-primary" @input="ChangePaymentType">
										<span>No Payment</span>
									</b-radio-button>

									<b-radio-button :disabled="!isFormCreate" size="is-small" v-model="form_purchaseorder_payment.payment_type" native-value="CASH" type="is-primary" @input="ChangePaymentType">
										<span>Cash</span>
									</b-radio-button>

									<b-radio-button :disabled="!isFormCreate" size="is-small" v-model="form_purchaseorder_payment.payment_type" native-value="CHEQUE" type="is-primary" @input="ChangePaymentType">
										<span>Cheque</span>
									</b-radio-button>
								</b-field>

							</div>

							<div class="flex flex-col w-full">

								<b-field label="Cash Amount" custom-class="text-xs" class="w-30 mr-6">
									<b-input :disabled="form_purchaseorder_payment.payment_type != 'CASH'" size='is-small' type="text" v-model="form_purchaseorder_payment.cash_amount" expanded></b-input>
								</b-field>

								<div disabled class="flex w-full">
									<b-field label="Cheque Amount" custom-class="text-xs" class="w-24 mr-2">
										<b-input :disabled="form_purchaseorder_payment.payment_type != 'CHEQUE'" size='is-small' type="text" v-model="form_purchaseorder_payment.cheque_amount" expanded></b-input>
									</b-field>

									<b-field label="Cheque No" custom-class="text-xs" class="w-30 mr-2">
										<b-input :disabled="form_purchaseorder_payment.payment_type != 'CHEQUE'" size='is-small' type="text" v-model="form_purchaseorder_payment.cheque_no" expanded></b-input>
									</b-field>

									<b-field label="Cheque Bank" custom-class="text-xs" class="text-xs w-48 mr-2">
										<v-select :disabled="form_purchaseorder_payment.payment_type != 'CHEQUE'" :options="banks" label="name" maxHeight="100px" expanded v-model="form_purchaseorder_payment.cheque_bank" @input="SelectedPaymentChequeBank" />
									</b-field>

									<b-field label="Cheque Date" custom-class="text-xs" class="w-24 mr-2">
										<b-input :disabled="form_purchaseorder_payment.payment_type != 'CHEQUE'" size='is-small' type="text" v-model="form_purchaseorder_payment.cheque_date" expanded></b-input>
									</b-field>

									<b-field label="Cheque Name" custom-class="text-xs" class="w-64 mr-2">
										<b-input :disabled="form_purchaseorder_payment.payment_type != 'CHEQUE'" size='is-small' type="text" v-model="form_purchaseorder_payment.cheque_name" expanded></b-input>
									</b-field>

								</div>

							</div>

						</div>

					</div>

					<div v-if="isNonTradePurchase === false" class="my-2 text-sm flex">

						<div class="w-1/3">
							<h4 class="font-bold">Product Selection</h4>

							<b-field>
								<b-input placeholder="Search code..." size="is-small" expanded v-model="filterCode" @input="FilterByCode"></b-input>
								<b-input placeholder="Search name..." size="is-small" expanded v-model="filterName" @input="FilterByName"></b-input>
								<p class="control">
									<b-button type="is-info" size="is-small" @click="ConfirmForPO">Confirm for Purchase</b-button>
								</p>
							</b-field>

							<b-table :data="products" :sticky-header="true" :height="450">

								<b-table-column label="Product/Brand/Unit" v-slot="props">
									<div class="leading-tight w-full">
										<p class="font-semibold"><span class="text-red-500 font-bold">{{ props.row.product_code }}</span> {{ props.row.name }}</p>
										<p class="text-sm"><span class="rounded-sm bg-yellow-300 px-1 text-xs mr-2">{{ props.row.category.name }}</span>{{ props.row.description }}</p>
										<p v-if="props.row.brand" class="text-sm">{{ props.row.brand.brandname }} - <span v-if="props.row.unit">{{ props.row.unit.item_unit }}</span></p>
									</div>
								</b-table-column>

								<b-table-column label="PO Qty" v-slot="props" :width="'130px'">
									<b-field>
										<b-numberinput size='is-small' min="0" controls-position="compact" v-model="props.row.qty"></b-numberinput>
									</b-field>

								</b-table-column>

							</b-table>
						</div>

						<div class="w-2/3 ml-2">
							<b-table :striped="true" :narrowed="true" :data="form_purchaseorder_items">

								<b-table-column v-slot="props" field="" label="Product" width="200" class="cell-valign-middle">

									<div class="flex flex-col mb-2 leading-tight">
										<p v-if="props.row.product" class="text-sm"><span class="font-bold text-red-500 mr-2">{{ props.row.product.product_code }}</span> {{ props.row.product.name }}</p>
										<p v-if="props.row.product && isFormCreate" class="text-xs">{{ props.row.product.description }} / {{ props.row.product.brand }} / {{ props.row.product.unit }}</p>
										<p v-if="props.row.product && isFormCreate == false " class="text-xs">{{ props.row.product.description }}</p>
									</div>

								</b-table-column>

								<b-table-column v-slot="props" field="" label="Quantity" width="150">
									<b-field>
										<b-numberinput size='is-small' min="0" controls-position="compact" @input="RecalculateTotals(props)" v-model="props.row.quantity"></b-numberinput>
									</b-field>
								</b-table-column>

								<b-table-column v-slot="props" field="" label="Actual Price">
									<b-input disabled size='is-small' type="text" v-model="props.row.actual_price" @input="RecalculateTotals(props)" />
								</b-table-column>

								<b-table-column v-slot="props" field="" label="Quoted Price">
									<b-input size='is-small' type="text" v-model="props.row.quoted_price" @input="RecalculateTotals(props)" />
								</b-table-column>

								<b-table-column v-slot="props" field="" label="Total Item Amount">
									<b-input disabled size='is-small' type="text" v-model="props.row.total_item_amount" />
								</b-table-column>

								<b-table-column v-slot="props" field="" label="Total Discount">
									<b-input disabled size='is-small' type="text" v-model="props.row.total_discount" @input="RecalculateTotals(props)" />
								</b-table-column>

								<b-table-column v-slot="props" field="" label="Action">
									<b-button type="is-danger" size="is-small" icon-left="close" @click="RemoveOrderItemsRow(props)"></b-button>
								</b-table-column>

							</b-table>
						</div>

					</div>

					<div v-if="isNonTradePurchase" class="text-sm mt-4 mb-6">
						<div class="flex justify-end">
							<b-button type="is-primary" size="is-small" @click="AddOrderItemsRow" icon-left="plus">Add Item</b-button>
						</div>
						<b-table :striped="true" :narrowed="true" :data="form_purchaseorder_items">

							<b-table-column v-slot="props" field="" label="Item">
								<b-input size='is-small' type="text" v-model="props.row.nt_item" />
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Description">
								<b-input size='is-small' type="text" v-model="props.row.nt_item_description" />
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Quantity" width="150">
								<b-field>
									<b-numberinput size='is-small' min="0" controls-position="compact" @input="RecalculateTotals(props)" v-model="props.row.quantity"></b-numberinput>
								</b-field>
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Price" width="150">
								<b-input size='is-small' type="text" v-model="props.row.actual_price" @input="RecalculateTotals(props)" />
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Total Item Amount" width="150">
								<b-input disabled size='is-small' type="text" v-model="props.row.total_item_amount" />
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Action" width="50">
								<b-button type="is-danger" size="is-small" icon-left="close" @click="RemoveOrderItemsRow(props)"></b-button>
							</b-table-column>

						</b-table>
						<div class="flex justify-end mt-1">
							<b-button type="is-primary" size="is-small" @click="AddOrderItemsRow" icon-left="plus">Add Item</b-button>
						</div>
					</div>

				</section>
				<footer class="modal-card-foot px-5 py-3">
					<b-button :disabled="form_purchaseorder_items.length <= 0" v-show="isFormCreate" type="is-primary" size="is-small" @click="SavePurchaseOrderForm" icon-left="content-save">Submit Purchase Order</b-button>
					<b-button v-show="!isFormCreate" type="is-primary" size="is-small" @click="UpdatePurchaseOrderForm">Update Purchase Order</b-button>
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
			module: 'po'
		},

		computed: {
			...mapGetters({
				purchaseOrderItems: 'purchases/getPurchaseOrderItems',
				branches: 'masterdatas/getBranches',
				banks: 'masterdatas/getBanks',
				suppliers: 'partners/getSuppliers'
				// products: 'products/getProducts'
			})

			// isSinglePurchase() {
			// 	console.log(process.env.singlePurchase)
			// 	if (process.env.singlePurchase === 'TRUE') {
			// 		return true
			// 	} else {
			// 		return false
			// 	}
			// }
		},

		watch: {},

		data() {
			return {
				// tbl_purchaseorders_columns: [
				// 	{ field: 'po_number', label: 'PO No.', width: '150', sortable: true },
				// 	{ field: 'dateCreated', label: 'Date' },
				// 	{ field: 'total_amount', label: 'Amount' },
				// 	{ field: 'total_discount', label: 'Discount' },
				// 	{ field: 'supplier.name', label: 'Supplier' },
				// 	{ field: 'status', label: 'Status' },
				// 	{ field: 'actual_total_amount', label: 'Actual Amount' },
				// 	{ field: 'actual_total_discount', label: 'Actual Discount' },
				// 	{ field: 'branch_id', label: 'Branch' },
				// 	{ field: 'invoice_branch_id', label: 'Branch Invoice' }
				// ],

				// tbl_purchaseorder_items_columns: [
				// 	{ field: 'product.name', label: 'Product', width: '150' },
				// 	{ field: 'qty', label: 'Qty', width: '40' },
				// 	{ field: 'actual_price', label: 'Actual Price', width: '40' },
				// 	{ field: 'quotation_price', label: 'Quotation Price', width: '40' },
				// 	{ field: 'item_discount', label: 'Discount', width: '40' },
				// 	{ field: 'total_item_amount', label: 'Total Amount', width: '40' },
				// 	{ field: 'delivered_total_amount', label: 'Delivered Amount', width: '40' }
				// ],

				isSinglePurchase: true,

				purchaseOrders: [],
				totalDataCount: 0,
				loading: false,
				sortField: 'id',
				sortOrder: 'desc',
				defaultSortOrder: 'desc',
				page: 1,
				pageSize: 15,

				filters: [],
				formFilters: [],

				filterPO: null,
				filterStatus: null,
				filterSupplier: null,

				selected_purchase_order: {},
				selected_po_items: [],
				checked_purchaseorder: [],

				product_lists: [],

				form_purchaseorder: {
					po_number: null,
					date_created: null,
					total_amount: null,
					total_discount: null,
					supplier: null,
					status: null,
					date_delivered: null,
					is_sentto_supplier: null,
					branch: null,
					courier_id: null,
					invoice_branch_id: null
				},

				form_purchaseorder_items: [],

				form_purchaseorder_payment: {
					payment_type: 'NOPAYMENT',
					cash_amount: null,
					cheque_no: null,
					cheque_bank: null,
					cheque_name: null,
					cheque_amount: null,
					cheque_date: dayjs().format('YYYY-MM-DD'),
					bank_id: null,
					payment_status: null
				},

				form_purchase_payment: {
					po_number: null,
					po_amount: null,
					payment_type: null,
					payment_date: null,
					cash_amount: null,
					cheque_bank: null,
					cheque_name: null,
					cheque_amount: null,
					cheque_date: null,
					bank_id: null,
					bank: null
				},

				isFormCreate: false,
				isFormPaymentCreate: false,
				isFormReceiveCreate: false,

				isModalShow: false,
				isModalPaymentFormShow: false,
				isModalReceiveFormShow: false,
				isModalPODetailsShow: false,

				activePaymentTab: 0,

				productOptions: [],

				products: [],
				filterCode: null,
				filterName: null,
				productsChoices: [],
				productsForPO: [],

				isNonTradePurchase: false,

				new_po_total_amount: 0
			}
		},

		methods: {
			...mapActions({
				GetPurchaseOrders: 'purchases/GetPurchaseOrders',
				GetPurchaseOrderItems: 'purchases/GetPurchaseOrderItems',
				GetBranches: 'masterdatas/GetBranches',
				GetBanks: 'masterdatas/GetBanks',
				GetSuppliers: 'partners/GetSuppliers',
				GetProducts: 'products/GetProducts',

				GetPurchasePayment: 'purchases/GetPurchasePayment',

				InsertPurchaseOrder: 'purchases/InsertPurchaseOrder',
				UpdatePurchaseOrder: 'purchases/UpdatePurchaseOrder',
				UpdatePurchaseOrderStatus: 'purchases/UpdatePurchaseOrderStatus',

				InsertPurchasePayment: 'purchases/InsertPurchasePayment',
				UpdatePurchasePayment: 'purchases/UpdatePurchasePayment',

				SearchProductsByCode: 'products/SearchProductsByCode',
				GetProductBySelectedCriterias: 'products/GetProductBySelectedCriterias',

				InsertNonTradePurchaseOrder: 'purchases/InsertNonTradePurchaseOrder',

				UpdatePurchaseOrderPrice: 'purchases/UpdatePurchaseOrderPrice'
			}),

			...mapMutations({}),

			NonTradeSwitch(data) {
				//Clear form to initialize again

				this.isFormCreate = true

				this.form_purchaseorder.po_number = 'System Generated'
				this.form_purchaseorder.date_created = dayjs().format('YYYY-MM-DD HH:mm:ss')

				this.form_purchaseorder.total_amount = null
				this.form_purchaseorder.total_discount = null
				this.form_purchaseorder.supplier = null
				this.form_purchaseorder.branch = { name: process.env.purchasingBranchName, branch_code: process.env.purchasingBranchCode }

				this.filterCode = null
				this.products = []

				this.form_purchaseorder_items = []

				if (data) {
					var item = {
						product: null,
						product_id: null,
						quantity: 0,
						actual_price: 0,
						quoted_price: 0,
						total_item_amount: 0,
						total_discount: 0,
						weight: 0,
						total_weight: 0,
						weight_unit: 'tons',
						nt_item: null,
						nt_item_description: null
					}

					this.form_purchaseorder_items.push(item)
				} else {
					//using the normal PO
				}
			},

			AddOrderItemsRow() {
				var item = {
					product: null,
					product_id: null,
					quantity: 0,
					actual_price: 0,
					quoted_price: 0,
					total_item_amount: 0,
					total_discount: 0,
					weight: 0,
					total_weight: 0,
					weight_unit: 'tons',
					nt_item: null,
					nt_item_description: null
				}

				this.form_purchaseorder_items.push(item)
			},

			RemoveOrderItemsRow(data) {
				var idx = data.index

				this.form_purchaseorder_items.splice(idx, 1)

				//remove this item also on the productsforPO

				let cleanedProductForPO = this.productsForPO.filter((item) => {
					return item.product_id !== data.row.product.product_id
				})

				for (let index = 0; index < this.products.length; index++) {
					if (this.products[index].product_id === data.row.product.product_id) {
						this.products[index].qty = null
					}
				}

				this.productsForPO = []
				this.productsForPO = cleanedProductForPO
				//if (idx === 0) this.AddOrderItemsRow()

				this.form_purchaseorder.total_amount = this.$calculateTotals(this.form_purchaseorder_items, 'total_item_amount')
				this.form_purchaseorder.total_discount = this.$calculateTotals(this.form_purchaseorder_items, 'total_discount')
			},

			SelectedPurchaseOrder(data) {
				this.selected_purchase_order = data

				this.selected_po_items = this.$clearReactive(this.selected_purchase_order.po_items)

				//if (this.selected_purchase_order.po_type === 'non-trade') {
				this.form_purchase_receive_items = this.$clearReactive(this.selected_purchase_order.po_items)
				//}
			},

			// Added 20210306 - to support editing of price
			async UpdateSelectedPurchaseOrderPrice() {
				// update price
				// recalculate

				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>update</b> the Price/s? This action cannot be undone.',
					confirmText: 'Update Price/s',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					const payload = {
						po: this.selected_purchase_order,
						po_items: this.selected_po_items
					}

					const res = await this.UpdatePurchaseOrderPrice(payload)

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
				this.selected_po_items[idx].total_item_amount = total_amount.toFixed(2)

				this.new_po_total_amount = this.$calculateTotals(this.selected_po_items, 'total_item_amount')
			},

			RecalculateTotals(data) {
				// added 2021-01-05
				let item_price = 0
				if (data.row.quoted_price) {
					item_price = data.row.quoted_price
				} else {
					item_price = data.row.actual_price
				}

				let idx = data.index
				let total_item_amount = parseFloat(item_price) * parseInt(data.row.quantity)
				this.form_purchaseorder_items[idx].total_item_amount = total_item_amount.toFixed(2)

				this.form_purchaseorder.total_amount = this.$calculateTotals(this.form_purchaseorder_items, 'total_item_amount')
				this.form_purchaseorder.total_discount = this.$calculateTotals(this.form_purchaseorder_items, 'total_discount')
			},

			NewPurchaseOrder() {
				this.isFormCreate = true

				//this.$setObjectPropNull(this.form_purchaseorder, null)

				this.form_purchaseorder.po_number = 'System Generated'
				this.form_purchaseorder.date_created = dayjs().format('YYYY-MM-DD HH:mm:ss')

				this.form_purchaseorder.total_amount = null
				this.form_purchaseorder.total_discount = null
				this.form_purchaseorder.supplier = null
				this.form_purchaseorder.branch = { name: process.env.purchasingBranchName, branch_code: process.env.purchasingBranchCode }
				//this.form_purchaseorder.branch.branch_code = 'EG'

				this.filterCode = null
				this.products = []

				this.form_purchaseorder_items = []

				//this.$setObjectPropNull(this.form_purchaseorder_items, null)

				this.isModalShow = true
			},

			EditPurchaseOrder() {
				this.isFormCreate = false

				this.form_purchaseorder.po_number = this.selected_purchase_order.po_number
				this.form_purchaseorder.date_created = this.selected_purchase_order.date_created
				this.form_purchaseorder.total_amount = this.selected_purchase_order.total_amount
				this.form_purchaseorder.total_discount = this.selected_purchase_order.total_discount

				this.form_purchaseorder.supplier = this.selected_purchase_order.supplier
				this.form_purchaseorder.branch = this.selected_purchase_order.branch_code

				var items = this.selected_purchase_order.po_items.map((item) => {
					return {
						product: item.product,
						product_id: item.product_id,
						quantity: item.qty,
						actual_price: item.actual_price,
						quoted_price: item.quotation_price,
						total_item_amount: item.total_item_amount,
						total_discount: item.item_discount,
						weight: 0,
						total_weight: 0,
						weight_unit: 'tons',
						nt_item: item.nt_item,
						nt_item_description: item.nt_item_description
					}
				})

				this.form_purchaseorder_items = items

				if (this.selected_purchase_order.po_type === 'non-trade') {
					this.isNonTradePurchase = true
				} else {
					this.isNonTradePurchase = false
				}

				this.form_purchaseorder_payment.payment_type = 'NOPAYMENT'
				this.form_purchaseorder_payment.cash_amount = null
				this.form_purchaseorder_payment.cheque_no = null
				this.form_purchaseorder_payment.cheque_bank = null
				this.form_purchaseorder_payment.cheque_name = null
				this.form_purchaseorder_payment.cheque_amount = null
				this.form_purchaseorder_payment.cheque_date = dayjs().format('YYYY-MM-DD')
				this.form_purchaseorder_payment.bank_id = null
				this.form_purchaseorder_payment.payment_status = null

				this.isModalShow = true
			},

			ClosePurchaseOrderModal() {
				this.isNonTradePurchase = false
				this.isModalShow = false

				this.products = []
				this.productsForPO = []
				this.filterCode = null
				this.filterName = null
			},

			async SavePurchaseOrderForm() {
				let message = null

				if (this.isNonTradePurchase) {
					message = 'Are you sure you want to <b>Submit</b> this <b>NON-TRADE</b> Purchase Order? This action cannot be undone.'
				} else {
					message = 'Are you sure you want to <b>Submit</b> this Purchase Order? This action cannot be undone.'
				}

				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: message,
					confirmText: 'Submit PO',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					if (this.isNonTradePurchase) {
						// Submit the NonTrade Purchase Order
						let res = await this.InsertNonTradePurchaseOrder({
							purchaseorder: this.form_purchaseorder,
							purchaseorder_items: this.form_purchaseorder_items,
							purchaseorder_payment: this.form_purchaseorder_payment
						})

						if (res.status === 'ok') {
							this.ClosePurchaseOrderModal()
							this.LoadAsyncData()
						}
					} else {
						// Submit the normal Purchase Order
						let res = await this.InsertPurchaseOrder({
							purchaseorder: this.form_purchaseorder,
							purchaseorder_items: this.form_purchaseorder_items,
							purchaseorder_payment: this.form_purchaseorder_payment
						})

						if (res.status === 'ok') {
							this.ClosePurchaseOrderModal()
							this.LoadAsyncData()
						}
					}
				}
			},

			async UpdatePurchaseOrderForm() {
				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>Update</b> this Purchase Order? This action cannot be undone.',
					confirmText: 'Update PO',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					let res = await this.UpdatePurchaseOrder({
						purchaseorder: this.form_purchaseorder,
						purchaseorder_items: this.form_purchaseorder_items
					})

					if (res.status === 'ok') {
						this.ClosePurchaseOrderModal()
						this.LoadAsyncData()
					}
				}
			},

			ChangePaymentType() {
				let type = this.form_purchaseorder_payment.payment_type

				switch (type) {
					case 'NOPAYMENT':
						this.form_purchaseorder_payment.cash_amount = null
						this.form_purchaseorder_payment.cheque_amount = null
						this.form_purchaseorder_payment.cheque_date = null
						this.form_purchaseorder_payment.cheque_bank = {}
						this.form_purchaseorder_payment.cheque_name = null
						this.form_purchaseorder_payment.cheque_no = null
						break

					case 'CASH':
						this.form_purchaseorder_payment.cheque_amount = null
						this.form_purchaseorder_payment.cheque_date = null
						this.form_purchaseorder_payment.cheque_bank = {}
						this.form_purchaseorder_payment.cheque_name = null
						this.form_purchaseorder_payment.cheque_no = null
						this.form_purchaseorder_payment.cash_amount = this.form_purchaseorder.total_amount
						break

					case 'CHEQUE':
						this.form_purchaseorder_payment.cash_amount = null
						this.form_purchaseorder_payment.cheque_no = null
						this.form_purchaseorder_payment.cheque_amount = this.form_purchaseorder.total_amount
						this.form_purchaseorder_payment.cheque_date = dayjs().format('YYYY-MM-DD')
						break

					default:
						break
				}
			},

			ClosePurchasePaymentModal() {
				this.isModalPaymentFormShow = false
			},

			ClosePurchaseReceiveModal() {
				this.isModalReceiveFormShow = false
			},

			SelectedPaymentMethodTab(item) {
				this.form_purchase_payment.payment_type = item
			},

			ChequeBankSelected() {
				this.form_purchase_payment.bank_id = this.form_purchase_payment.bank.id
				this.form_purchase_payment.cheque_bank = this.form_purchase_payment.bank.name
			},

			async SavePurchasePaymentForm() {
				let res = await this.InsertPurchasePayment(this.form_purchase_payment)

				if (res.status === 'ok') {
					this.ClosePurchasePaymentModal()
				}
			},

			async UpdatePurchasePaymentForm() {
				let res = await this.UpdatePurchasePayment(this.form_purchase_payment)

				if (res.status === 'ok') {
					this.ClosePurchasePaymentModal()
				}
			},

			SelectedFilterPONo(data) {
				if (data) {
					this.tmp_purchaseOrders = this.purchaseOrders.filter((item) => {
						return item.po_number == data
					})
				} else {
					this.tmp_purchaseOrders = this.purchaseOrders
				}
			},

			SelectedFilterSupplier(data) {
				if (data) {
					this.tmp_purchaseOrders = this.purchaseOrders.filter((item) => {
						return item.supplier_id == data
					})
				} else {
					this.tmp_purchaseOrders = this.purchaseOrders
				}
			},

			ShowPoDetails(data) {
				this.isModalPODetailsShow = true
			},

			CloseDetailsModal() {
				this.isModalPODetailsShow = false
				this.new_po_total_amount = 0
			},

			CloseNonTradeDetailsModal() {
				this.isModalNonTradePODetailsShow = false
			},

			SelectedPaymentChequeBank(data) {
				if (data) {
					this.form_purchaseorder_payment.cheque_bank = data
				}
			},

			SelectedPurchaseOrderProduct(data) {
				var idx = data.index
				if (data.row.product) {
					this.form_purchaseorder_items[idx].actual_price = data.row.product.price.cost
				} else {
					this.form_purchaseorder_items[idx].actual_price = 0
					this.form_purchaseorder_items[idx].quantity = 0
				}

				this.RecalculateTotals(data)
			},

			async ApprovePurchaseOrder() {
				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>approve</b> the selected Purchase Order/s? This action cannot be undone.',
					confirmText: 'Approve PO',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					var payload = {
						po_numbers: this.$mapArraySingleProp(this.checked_purchaseorder, 'po_number'),
						status: 'Approved'
					}

					let res = await this.UpdatePurchaseOrderStatus(payload)
					if (res.status === 'ok') {
						this.LoadAsyncData()
						this.checked_purchaseorder = []
					}
				}
			},

			async SendToSupplier() {
				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>send</b> the selected Purchase Order/s to supplier/s? This action cannot be undone.',
					confirmText: 'Send PO/s',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					var payload = {
						//po_numbers: this.$mapArraySingleProp(this.checked_purchaseorder, 'po_number'),
						po_numbers: this.checked_purchaseorder.map((item) => {
							return {
								po_number: item.po_number,
								po_type: item.po_type
							}
						}),
						status: 'Sent'
					}

					let res = await this.UpdatePurchaseOrderStatus(payload)
					if (res.status === 'ok') {
						this.LoadAsyncData()
						this.checked_purchaseorder = []
					}
				}

				// var test = this.$checkPropValueEqual(this.checked_purchaseorder, 'status', 'PO')
			},

			async CancelPurchaseOrder() {
				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>cancel</b> the selected Purchase Order? This action cannot be undone.',
					confirmText: 'Cancel PO',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					var payload = {
						po_numbers: [this.selected_purchase_order.po_number],
						status: 'Cancelled'
					}

					let res = await this.UpdatePurchaseOrderStatus(payload)
					if (res.status === 'ok') {
						this.LoadAsyncData()
						this.checked_purchaseorder = []
					}
				}
			},

			async ClosePurchaseOrder() {
				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>close</b> the selected Purchase Order? This action cannot be undone.',
					confirmText: 'Close PO',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					var payload = {
						po_numbers: [this.selected_purchase_order.po_number],
						status: 'Close'
					}

					let res = await this.UpdatePurchaseOrderStatus(payload)
					if (res.status === 'ok') {
						this.LoadAsyncData()
						this.checked_purchaseorder = []
					}
				}
			},

			Print() {
				let obj = {
					type: 'PO',
					branch_code: this.$store.state.selectedBranch.branch_code,
					ref_field: 'po_number',
					ref_no: this.selected_purchase_order.po_number
				}

				let urlParams = new URLSearchParams(obj).toString()

				window.open('/printing/singledoc?' + urlParams, '_blank', 'location=yes,height=768,width=800,scrollbars=yes,status=yes')
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

				const pos = await this.GetPurchaseOrders(params)

				this.purchaseOrders = []
				this.purchaseOrders = pos.data.results
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
				this.filters.push({ field: 'status', value: this.filterStatus, type: 'like' })
				this.filters.push({ field: 'supplier_id', value: this.filterSupplier, type: '=' })

				this.LoadAsyncData()
			},

			FilterByPO(value) {
				this.searchDebounce(this)
			},

			FilterByStatus(value) {
				this.searchDebounce(this)
			},

			FilterBySupplier(value) {
				this.searchDebounce(this)
			},

			searchDebounce: debounce((vm) => {
				vm.onFilterData()
			}, 500),

			onProductSearch(searchterm, loading) {
				if (searchterm.length) {
					loading(true)
					this.searchProduct(loading, searchterm, this)
				}
			},
			searchProduct: debounce(async (loading, searchterm, vm) => {
				vm.productOptions = await vm.SearchProductsByCode({ searchterm: searchterm })
				loading(false)
			}, 500),

			async GetProductByCriteria() {
				this.formFilters = []

				//check the filtercode here
				if (this.filterCode !== null || this.filterCode !== '') {
					this.formFilters.push({ field: 'product_code', value: this.filterCode, type: 'like' })
				}

				if (this.filterName !== null || this.filterName !== '' || this.filterName.length > 2) {
					this.formFilters.push({ field: 'name', value: this.filterName, type: 'like' })
				}

				const criteriaParams = {
					filters: this.formFilters || []
				}

				if (criteriaParams.filters.length > 0) {
					const res = await this.GetProductBySelectedCriterias(criteriaParams)
					this.products = res.data
				} else {
					this.products = []
				}

				// if ((this.filterCode === null || this.filterCode === '') && (this.filterName === null || this.filterName === '')) {
				// 	this.products = []
				// } else {
				// 	const res = await this.GetProductBySelectedCriterias(criteriaParams)
				// 	this.products = res.data
				// }
			},

			FilterByCode(value) {
				this.filterCode = value

				if (this.filterCode === '') {
				} else {
					//console.log('hit debounce - ' + this.filterCode)
					this.searchCriteriaDebounce(this)
				}

				//console.log(this.filterCode)
			},

			FilterByName(value) {
				this.filterName = value
				if (this.filterName === '' || this.filterName.length < 3) {
				} else {
					console.log('hit debounce - ' + this.filterName)
					this.searchCriteriaDebounce(this)
				}
			},

			searchCriteriaDebounce: debounce((vm) => {
				vm.GetProductByCriteria()
			}, 350),

			ConfirmForPO() {
				let res = this.products.filter((item) => {
					return parseInt(item.qty) > 0
				})

				if (res.length > 0) {
					let resExisting = []
					let resExistProdIds = []

					//check if selected items exist on the list,if exist then update only the quantities
					for (let index = 0; index < res.length; index++) {
						let idx = this.productsForPO.findIndex((x) => x.product_id === res[index].product_id)
						if (idx >= 0) {
							resExistProdIds.push(res[index].product_id)
							resExisting.push({
								existingIdx: idx,
								data: res[index]
							})
						}
					}

					//update the existings
					if (resExisting.length > 0) {
						let filteredRes = res.filter((item) => !resExistProdIds.includes(item.product_id))
						res = filteredRes
						resExisting.forEach((el) => {
							//update
							this.productsForPO[el.existingIdx].qty = el.data.qty
						})
					}

					//push res that are unqiue
					if (res.length > 0) {
						this.productsForPO.push(...res)
					}
				}

				//mapped

				let mappedProductsForPO = this.productsForPO.map((item) => {
					let product = {
						product_id: item.product_id,
						product_code: item.product_code,
						name: item.name,
						description: item.description,
						brand: item.brand.brandname,
						unit: item.unit.item_unit
					}

					let total_item_amount = parseFloat(item.price.cost) * parseFloat(item.qty)

					return {
						product: product,
						quantity: item.qty,
						actual_price: item.price.cost,
						quoted_price: null,
						total_item_amount: total_item_amount.toFixed(2),
						total_discount: null
					}
				})

				this.form_purchaseorder_items = mappedProductsForPO
				this.form_purchaseorder.total_amount = this.$calculateTotals(this.form_purchaseorder_items, 'total_item_amount')
				this.form_purchaseorder.total_discount = this.$calculateTotals(this.form_purchaseorder_items, 'total_discount')

				// for (let index = 0; index < this.products.length; index++) {
				// 	this.products[index].qty = null
				// }

				//this.productsForPO = []
			}
		},

		mounted() {
			this.LoadAsyncData()
			this.GetBranches()
			this.GetSuppliers()
			this.GetProducts()
			this.GetBanks()

			if (this.$route.params.action === 'new') this.NewPurchaseOrder()

			if (process.env.singleBranchPurchase === 'TRUE') {
				this.isSinglePurchase = true
			} else {
				this.isSinglePurchase = false
			}
		}
	}
</script>

<style scoped>
	.wrapper-h {
		height: calc(100vh - 125px);
	}
</style>
