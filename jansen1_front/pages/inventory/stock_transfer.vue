<template>
	<div>

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">

			<h3 class="has-text-header">Stock Transfer</h3>
			<div class="flex items-center">
				<b-button type="is-success" icon-left="plus" class="is-small text-white ml-1" @click="CreateStockTransfer">New Stock Transfer</b-button>
				<b-button :disabled="selected_stocktransfer_receives.status !== 'REQUEST'" type="is-success" icon-left="check" class="is-small text-white ml-1" @click="ProcessRequest">Process Request</b-button>
				<b-button v-if="selected_stocktransfer.status == 'REQUEST-FULFILLED'" type="is-success" icon-left="check" class="is-small text-white ml-1" @click="ShowDetailsModal">Accept Transfer</b-button>
				<b-button v-if="selected_stocktransfer.status == 'REQUEST-FULFILLED'" type="is-danger" icon-left="close" class="is-small text-white ml-1" @click="ShowDetailsModal">Revert Transfer</b-button>
				<b-button :disabled="selected_stocktransfer.id == null || selected_tab != 0" type="is-success" icon-left="printer" class="is-small text-white ml-1" @click="Print">Print</b-button>
			</div>

		</div>

		<div class="grid grid-cols-8 gap-4 p-4">
			<div class="col-span-8">

				<b-tabs type="is-boxed" size="is-small" v-model="selected_tab">
					<b-tab-item class="wrapper-h-tab">
						<template slot="header">
							<div class="px-6 flex items-center">
								<b-icon icon="transfer-right"></b-icon>
								<span class="font-semibold text-sm">Request Sent</span>
							</div>
						</template>
						<div class="w-full text-sm p-2">
							<b-table :striped="true" :narrowed="true" :hoverable="true" :loading="loading" paginated backend-pagination :pagination-rounded="true" pagination-size="is-small" :total="totalDataCount" :per-page="pageSize" @page-change="onPageChange" backend-sorting :default-sort-direction="defaultSortOrder" :default-sort="[sortField, sortOrder]" @sort="onSort" sort-icon="arrow-up" sort-icon-size="is-small" :pagination-simple="false" :pagination-position="'top'" :selected.sync="selected_stocktransfer" @select="SelectedStockTransfer" :data="stockTransfers">

								<template slot="top-left">
									<div class="flex">
										<b-field label="Date" custom-class="text-xs no-mb-labels font-semibold" class="w-40 mr-1">
											<b-datepicker v-model="filterDate" icon="calendar-month-outline" @input="FilterByDate" size="is-small" trap-focus>
												<p v-if="filterDate != null" class="control">
													<b-button type="is-danger" size="is-small" @click="FilterByDate(null)" icon-left="close">Clear</b-button>
												</p>
											</b-datepicker>
										</b-field>

										<b-field label="Transfer No" custom-class="font-semibold text-xs no-mb-labels" class="w-48 text-xs mr-1 w-32">
											<b-input type="primary" size="is-small" v-model="filterTransNo" @input="FilterByTransNo"></b-input>
										</b-field>

										<b-field label="Status" custom-class="font-semibold text-xs no-mb-labels" class="text-xs mr-1 w-32">
											<b-input type="primary" size="is-small" v-model="filterStatus" @input="FilterByStatus"></b-input>
										</b-field>

										<b-field label="Fulfilling Branch" custom-class="font-semibold text-xs no-mb-labels" class="text-xs mr-1 w-32">
											<b-input type="primary" size="is-small" v-model="filterFulfillingBranch" @input="FilterByFulfillingBranch"></b-input>
										</b-field>
									</div>
								</template>

								<b-table-column label="Transfer No" field="stock_transfer_no" v-slot="props" sortable>
									<p class="cursor-pointer underline font-bold hover:text-blue-500" @click="ShowDetailsModal">{{ props.row.stock_transfer_no }}</p>
								</b-table-column>
								<b-table-column label="Status" v-slot="props">
									{{ props.row.status }}
								</b-table-column>

								<b-table-column label="Date Requested" field="date_requested" v-slot="props" sortable>
									{{ props.row.date_requested }}
								</b-table-column>

								<b-table-column label="Requesting Branch" field="requesting_branch_code" v-slot="props" sortable>
									{{ props.row.requesting_branch_code }}
								</b-table-column>

								<b-table-column label="Fulfilling Branch" field="fulfilling_branch_code" v-slot="props" sortable>
									{{ props.row.fulfilling_branch_code }}
								</b-table-column>

								<b-table-column label="Type" v-slot="props">
									{{ props.row.type }}
								</b-table-column>

								<b-table-column label="Branch" v-slot="props">
									{{ props.row.branch_code }}
								</b-table-column>

							</b-table>
						</div>
					</b-tab-item>

					<b-tab-item class="wrapper-h-tab">
						<template slot="header">
							<div class="px-6 flex items-center">
								<b-icon icon="transfer-left"></b-icon>
								<span class="font-semibold text-sm">Request Receive</span>
							</div>
						</template>
						<div class="w-full text-sm p-2">

							<b-table :striped="true" :narrowed="true" :hoverable="true" :loading="receivesLoading" paginated backend-pagination :pagination-rounded="true" pagination-size="is-small" :total="receivesTotalDataCount" :per-page="receivesPageSize" @page-change="onPageChangeReceives" backend-sorting :default-sort-direction="receivesDefaultSortOrder" :default-sort="[receivesSortField, receivesSortOrder]" @sort="onSortReceives" sort-icon="arrow-up" sort-icon-size="is-small" :pagination-simple="false" :pagination-position="'top'" :selected.sync="selected_stocktransfer_receives" @select="SelectedStockTransferReceives" :data="stockRequestReceives">

								<template slot="top-left">
									<div class="flex justify-between">

										<div class="flex">
											<b-field label="Date" custom-class="text-xs no-mb-labels font-semibold" class="w-40 mr-1">
												<b-datepicker v-model="receivesFilterDate" icon="calendar-month-outline" @input="FilterByDateReceives" size="is-small" trap-focus>
													<p v-if="receivesFilterDate != null" class="control">
														<b-button type="is-danger" size="is-small" @click="FilterByDateReceives(null)" icon-left="close">Clear</b-button>
													</p>
												</b-datepicker>
											</b-field>

											<b-field label="Transfer No" custom-class="font-semibold text-xs no-mb-labels" class="w-48 text-xs mr-1 w-32">
												<b-input type="primary" size="is-small" v-model="receivesFilterTransNo" @input="FilterByTransNoReceives"></b-input>
											</b-field>

											<b-field label="Status" custom-class="font-semibold text-xs no-mb-labels" class="text-xs mr-1 w-32">
												<b-input type="primary" size="is-small" v-model="receivesFilterStatus" @input="FilterByStatusReceives"></b-input>
											</b-field>

											<b-field label="Requesting Branch" custom-class="font-semibold text-xs no-mb-labels" class="text-xs mr-1 w-32">
												<b-input type="primary" size="is-small" v-model="receivesFilterRequestingBranch" @input="FilterByRequestingBranchReceives"></b-input>
											</b-field>
										</div>

									</div>
								</template>

								<b-table-column label="Transfer No" field="stock_transfer_no" v-slot="props" sortable>
									<p class="cursor-pointer underline font-bold hover:text-blue-500" @click="ProcessRequest(props.row)">{{ props.row.stock_transfer_no }}</p>
								</b-table-column>
								<b-table-column label="Status" v-slot="props">
									{{ props.row.status }}
								</b-table-column>

								<b-table-column label="Date Requested" field="date_requested" v-slot="props" sortable>
									{{ props.row.date_requested }}
								</b-table-column>

								<b-table-column label="Requesting Branch" field="requesting_branch_code" v-slot="props" sortable>
									{{ props.row.requesting_branch_code }}
								</b-table-column>

								<b-table-column label="Fulfilling Branch" field="fulfilling_branch_code" v-slot="props" sortable>
									{{ props.row.fulfilling_branch_code }}
								</b-table-column>

								<b-table-column label="Type" v-slot="props">
									{{ props.row.type }}
								</b-table-column>

								<b-table-column label="Branch" v-slot="props">
									{{ props.row.branch_code }}
								</b-table-column>

							</b-table>

						</div>
					</b-tab-item>
				</b-tabs>
			</div>
		</div>

		<b-modal :active.sync="isModalDetailsShow" has-modal-card trap-focus :width="1000" @close="CloseDetailsModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1000px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-bold text-white">Stock Transfer Details</p>
					<div>

						<a href="#" @click.prevent="CloseDetailsModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>

				<header class="px-5 py-2 has-background-pageheader border-b border-gray-200">
					<div class="flex items-center justify-between">

						<div class="w-1/2">
							<p class="font-bold">Stock Transfer No. <span class="font-normal">{{ selected_stocktransfer.stock_transfer_no }}</span></p>
							<p class="font-bold">Date <span class="font-normal">{{ selected_stocktransfer.date_requested }}</span></p>
							<p class="font-bold">Remarks <span class="font-normal">{{ selected_stocktransfer.remarks }}</span></p>
						</div>
						<div class="w-1/2">
							<p class="font-bold">Requesting Branch <span class="font-normal">{{ selected_stocktransfer.requesting_branch_code }}</span></p>
							<p class="font-bold">Fulfilling Branch <span class="font-normal">{{ selected_stocktransfer.fulfilling_branch_code }}</span></p>
							<div v-if="selected_stocktransfer.printed === 1">
								<b-button v-check="'btn-allow-reprint'" type="is-success" icon-left="printer" class="is-small text-white ml-1" @click="AllowReprint">Allow Reprint</b-button>
							</div>

						</div>

					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div class="my-4 text-sm">

						<b-table :striped="true" :narrowed="true" sort-icon="arrow-up" sort-icon-size="is-small" :data="selected_stocktransfer_items">

							<b-table-column label="Requested Product" v-slot="props">
								<div class="flex flex-col leading-tight">
									<p><span class="font-semibold text-red-500 mr-2">{{ props.row.product.product_code }}</span>{{ props.row.product.name }}</p>
									<p>{{ props.row.product.description }} - {{ props.row.product.brand.brandname }} - {{ props.row.product.unit.item_unit }}</p>
								</div>
							</b-table-column>

							<b-table-column label="Requested Qty" v-slot="props">
								{{ $formatAmount(props.row.requested_qty,0) }}
							</b-table-column>

							<b-table-column label="Fulfilled Qty" v-slot="props">
								{{ $formatAmount(props.row.fulfilled_qty,0) }}
							</b-table-column>

						</b-table>

						<div class="mt-6">
							<!-- <b-button v-if="selected_stocktransfer.status == 'REQUEST'" type="is-success" icon-left="checkbox-multiple-marked" class="is-small mr-1" @click="ProcessRequest">Process this transfer</b-button> -->
							<b-button v-if="selected_stocktransfer.status == 'REQUEST-FULFILLED'" type="is-success" icon-left="thumb-up" class="is-small mr-1" @click="AcceptCompleteStockTransfer">Accept & Complete this Stock Transfer</b-button>
							<b-button v-if="selected_stocktransfer.status == 'REQUEST-FULFILLED'" type="is-danger" icon-left="thumb-down" class="is-small mr-1" @click="RevertProcessStockTransfer">Revert this Stock Transfer</b-button>
						</div>

					</div>

				</section>
			</div>
		</b-modal>

		<b-modal :active.sync="isModalTransferFormShow" has-modal-card trap-focus :width="1000" @close="CloseTransferFormModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1000px;min-height:500px">

				<header class="modal-card-head p-5 has-background-primary flex items-center">
					<p class="modal-card-title text-base font-bold text-white">Stock Transfer Form</p>
					<div>
						<a href="#" @click.prevent="CloseTransferFormModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>
				<section class="modal-card-body app-modal-form text-sm">

					<div class="flex">

						<client-only placeholder="Loading...">
							<b-field label="Requesting Branch" custom-class="font-semibold text-xs no-mb-labels" class="w-48 text-xs mr-2">
								<b-input disabled type="is-primary" size="is-small" v-model="form_stocktransfer.requesting_branch_code" />
							</b-field>

							<b-field label="Fulfilling Branch" custom-class="font-semibold text-xs no-mb-labels" class="w-64 text-xs mr-2">
								<v-select :options="branches.filter(item => { return item.branch_code != form_stocktransfer.requesting_branch_code})" label="name" v-model="form_stocktransfer.fulfilling_branch_code" :reduce="branch => branch.branch_code" />
							</b-field>

							<b-field label="Remarks" custom-class="font-semibold text-xs no-mb-labels" class="text-xs mr-2 w-full">
								<b-input type="is-primary" size="is-small" v-model="form_stocktransfer.remarks"></b-input>
							</b-field>
						</client-only>

					</div>

					<div class="my-4 text-sm">

						<b-table :striped="true" :narrowed="true" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="10" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :data="form_stocktransfer_items">

							<!-- <b-table-column label="Product" v-slot="props" width="400">
								<v-select :appendToBody="true" :options="products" label="name" @input="SelectedProduct(props)" class="text-sm" :clearable="false" v-model="props.row.product" />
							</b-table-column> -->

							<b-table-column v-slot="props" field="" label="Product" class="cell-valign-middle">
								<client-only placeholder="Loading...">
									<b-field custom-class="font-semibold text-xs no-mb-labels" class="text-xs" style="width:400px;">

										<v-select label="name" :filterable="false" :appendToBody="true" :options="productOptions" @search="onProductSearch" v-model="props.row.product" @input="SelectedProduct(props)">
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

							<b-table-column label="Qty" v-slot="props" width="200">
								<b-field>
									<b-numberinput size='is-small' min="0" :max="props.row.avail_stock_qty" expanded controls-position="compact" v-model="props.row.request_qty"></b-numberinput>
								</b-field>
							</b-table-column>

							<b-table-column label="Stock Available" v-slot="props" centered width="150">
								<b-input disabled type="is-primary" size="is-small" v-model="props.row.avail_stock_qty" />
							</b-table-column>

							<b-table-column label="Action" v-slot="props" width="100">
								<b-button type="is-danger" icon-left="close" class="is-small mr-1" @click="RemoveRowItems(props)"></b-button>
							</b-table-column>

							<template slot="top-left">
								<b-button type="is-primary" icon-left="plus" class="is-small mr-1" @click="AddRowItems">Add Item</b-button>
							</template>

						</b-table>

					</div>

				</section>
				<footer class="modal-card-foot px-5 py-3">
					<b-button type="is-primary" size="is-small" @click="SubmitStockTransferRequest" icon-left="content-save">Submit Transfer Request</b-button>
				</footer>

			</div>
		</b-modal>

		<b-modal :active.sync="isModalTransferProcessShow" has-modal-card trap-focus :width="1000" @close="CloseTransferProcessModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1000px;">

				<header class="modal-card-head p-5 has-background-primary flex items-center">
					<p class="modal-card-title text-base font-bold text-white">Process Stock Transfer</p>
					<div>
						<a href="#" @click.prevent="CloseTransferProcessModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>

				<header class="px-5 py-2 has-background-pageheader border-b border-gray-200">
					<div class="flex items-center justify-between">

						<div class="w-1/2">
							<p class="font-bold">Stock Transfer No. <span class="font-normal">{{ selected_stocktransfer_receives.stock_transfer_no }}</span></p>
							<p class="font-bold">Date <span class="font-normal">{{ selected_stocktransfer_receives.date_requested }}</span></p>
						</div>
						<div class="w-1/2">
							<p class="font-bold">Requesting Branch <span class="font-normal">{{ selected_stocktransfer_receives.requesting_branch_code }}</span></p>
							<p class="font-bold">Fulfilling Branch <span class="font-normal">{{ selected_stocktransfer_receives.fulfilling_branch_code }}</span></p>
						</div>

					</div>
				</header>

				<section class="modal-card-body app-modal-form text-sm">

					<!-- <div class="flex">
						<div class="w-1/2">
							<p>Transfer No :{{ selected_stocktransfer_receives.stock_transfer_no }}</p>
							<p>Requesting Branch :{{ selected_stocktransfer_receives.requesting_branch_code }}</p>
							<p>Fulfilling Branch :{{ selected_stocktransfer_receives.fulfilling_branch_code }}</p>
						</div>
						<div class="w-1/2">

						</div>
					</div> -->

					<div class="my-6 text-sm">

						<b-table :narrowed="true" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="10" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :data="form_stocktransfer_items_process">

							<!-- <b-table-column label="Product" v-slot="props">
								<b-input disabled type="is-primary" size="is-small" v-model="props.row.product.name" />
							</b-table-column> -->

							<b-table-column label="Requested Product" v-slot="props">
								<div class="flex flex-col leading-tight">
									<p><span class="font-semibold text-red-500 mr-2">{{ props.row.product.product_code }}</span>{{ props.row.product.name }}</p>
									<p>{{ props.row.product.description }} - {{ props.row.product.brand.brandname }} - {{ props.row.product.unit.item_unit }}</p>
								</div>
							</b-table-column>

							<b-table-column label="Qty" v-slot="props" width="100">
								<b-input disabled type="is-primary" size="is-small" custom-class="text-center font-bold" v-model="props.row.requested_qty" />
							</b-table-column>

							<b-table-column label="Stock Available" v-slot="props" width="100">
								<b-input disabled type="is-primary" size="is-small" custom-class="text-center font-bold" v-model="props.row.requested_product_stock.onhand_qty" />
							</b-table-column>

							<b-table-column label="Qty Send" v-slot="props" width="150">
								<b-field>
									<b-numberinput :disabled="selected_stocktransfer_receives.status === 'COMPLETED'" size='is-small' min="0" :max="props.row.requested_product_stock.onhand_qty" custom-class="text-center font-bold text-red-500" expanded controls-position="compact" v-model="props.row.fulfilled_qty"></b-numberinput>
								</b-field>
							</b-table-column>

						</b-table>

					</div>

				</section>
				<footer class="modal-card-foot p-3">
					<b-button :disabled="selected_stocktransfer_receives.status === 'COMPLETED'" type="is-primary" size="is-small" @click="SubmitStockTransferProcess" icon-left="content-save">Fulfill & Confirm Transfer</b-button>
				</footer>

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
			module: 'stock-transfer'
		},
		computed: {
			...mapGetters({
				// stockTransfers: 'stocks/getStockTransfers',
				branches: 'masterdatas/getBranches',
				products: 'products/getProducts',
				selectedBranch: 'getSelectedBranch'
			})
		},
		data() {
			return {
				stockTransfers: [],
				totalDataCount: 0,
				loading: false,
				sortField: 'id',
				sortOrder: 'desc',
				defaultSortOrder: 'desc',
				page: 1,
				pageSize: 15,

				filters: [],

				filterDate: null,
				filterTransNo: null,
				filterStatus: null,
				filterFulfillingBranch: null,

				selected_stocktransfer: {},
				selected_stocktransfer_items: [],

				form_stocktransfer: {
					id: null,
					stock_transfer_no: null,
					status: null,
					requesting_branch_code: null,
					fulfilling_branch_code: null,
					date_requested: null,
					date_fulfilled: null,
					user_requesting: null,
					user_fulfilling: null,
					is_own_request: null,
					branch_code: null,
					remarks: null
				},

				form_stocktransfer_items: [],

				form_stocktransfer_items_process: [],

				isFormCreate: false,
				isModalDetailsShow: false,
				isModalTransferFormShow: false,
				isModalTransferProcessShow: false,

				selected_tab: 0,

				stockRequestReceives: [],
				receivesTotalDataCount: 0,
				receivesLoading: false,
				receivesSortField: 'id',
				receivesSortOrder: 'desc',
				receivesDefaultSortOrder: 'desc',
				receivesPage: 1,
				receivesPageSize: 15,

				receivesFilters: [],

				selected_stocktransfer_receives: {},
				selected_stocktransfer_receives_items: [],

				productOptions: [],

				receivesFilters: [],

				receivesFilterDate: null,
				receivesFilterTransNo: null,
				receivesFilterStatus: null,
				receivesFilterRequestingBranch: null
			}
		},

		methods: {
			...mapActions({
				GetStockTransfers: 'stocks/GetStockTransfers',
				GetStockTransfersRequestReceive: 'stocks/GetStockTransfersRequestReceive',
				SearchProductsByCode: 'products/SearchProductsByCode',

				GetBranches: 'masterdatas/GetBranches',
				GetProducts: 'products/GetProducts',

				GetProductStock: 'stocks/GetProductStock',

				InsertStockTransfer: 'stocks/InsertStockTransfer',
				ProcessStockTransfer: 'stocks/ProcessStockTransfer',
				AcceptStockTransfer: 'stocks/AcceptStockTransfer',
				RevertStockTransfer: 'stocks/RevertStockTransfer',

				SetAllowReprinting: 'stocks/SetAllowReprinting'
			}),

			SelectedStockTransfer(data) {
				this.selected_stocktransfer = data
				this.selected_stocktransfer_items = data.items
			},

			SelectedStockTransferReceives(data) {
				this.selected_stocktransfer_receives = data
				this.selected_stocktransfer_receives_items = data.items
			},

			ShowDetailsModal() {
				this.isModalDetailsShow = true
			},

			CloseDetailsModal() {
				this.isModalDetailsShow = false
			},

			CloseTransferFormModal() {
				this.isModalTransferFormShow = false
			},

			CloseTransferProcessModal() {
				this.isModalTransferProcessShow = false
			},

			CreateStockTransfer() {
				this.isFormCreate = true

				this.$setObjectPropNull(this.form_stocktransfer, null)
				this.form_stocktransfer_items = []

				this.form_stocktransfer.requesting_branch_code = this.selectedBranch.branch_code
				this.isModalTransferFormShow = true
			},

			AddRowItems() {
				let object = {
					product: null,
					avail_stock_qty: 0,
					request_qty: 0
				}

				this.form_stocktransfer_items.push(object)
			},

			RemoveRowItems(data) {
				var idx = data.index
				this.form_stocktransfer_items.splice(idx, 1)
			},

			async SelectedProduct(data) {
				var idx = data.index

				const stock = await this.GetProductStock({ product_id: data.row.product.product_id, branch_code: this.form_stocktransfer.fulfilling_branch_code })
				// get the stocks of this product

				var onhand_qty = 0

				if (typeof stock !== 'undefined') {
					onhand_qty = stock.onhand_qty
				} else {
					onhand_qty = 0
				}

				this.form_stocktransfer_items[idx].avail_stock_qty = onhand_qty
			},

			async SubmitStockTransferRequest() {
				const payload = {
					stock_transfer: this.form_stocktransfer,
					items: this.form_stocktransfer_items
				}

				const res = await this.InsertStockTransfer(payload)
				if (res.status == 'ok') {
					this.CloseTransferFormModal()
					this.LoadAsyncData()
				}
			},

			async ProcessRequest(data) {
				//check the status of the request

				//if complete then no need to fetch and calculate
				//else fo it

				if (data && data.status === 'COMPLETED') {
					//no need fetch

					this.form_stocktransfer_items_process = data.items.map((item) => {
						return {
							id: item.id,
							product: item.product,
							fulfilled_qty: item.fulfilled_qty,
							requested_qty: item.requested_qty,
							requested_product_stock: {
								onhand_qty: null
							}
						}
					})
				} else {
					this.form_stocktransfer_items_process = await Promise.all(
						this.selected_stocktransfer_receives_items.map(async (item) => {
							return {
								id: item.id,
								product: item.product,
								requested_product_id: item.requested_product_id,
								requested_qty: item.requested_qty,
								fulfilled_product_id: item.fulfilled_product_id,
								stock_transfer_no: item.stock_transfer_no,
								requested_product_stock: await this.GetProductStock({ product_id: item.requested_product_id, branch_code: this.selected_stocktransfer_receives.fulfilling_branch_code })
							}
						})
					)

					// Check if the stock query is undeifned then need some error notification

					for (let idx = 0; idx < this.form_stocktransfer_items_process.length; idx++) {
						var request_qty = this.form_stocktransfer_items_process[idx].requested_qty
						var onhand_qty = this.form_stocktransfer_items_process[idx].requested_product_stock.onhand_qty

						var fullfilled_qty = request_qty

						if (parseInt(request_qty) < parseInt(onhand_qty)) {
							fullfilled_qty = request_qty
						}

						if (parseInt(request_qty) > parseInt(onhand_qty)) {
							fullfilled_qty = onhand_qty
						}

						this.form_stocktransfer_items_process[idx]['fulfilled_qty'] = fullfilled_qty
					}
				}

				this.isModalTransferProcessShow = true
			},

			async SubmitStockTransferProcess() {
				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>Fulfill</b> the Stock Transfer Request? This action cannot be undone.',
					confirmText: 'Confirm',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					const payload = {
						stock_transfer: this.selected_stocktransfer_receives,
						items: this.form_stocktransfer_items_process
					}

					const res = await this.ProcessStockTransfer(payload)
					if (res.status === 'ok') {
						this.CloseTransferProcessModal()
						this.CloseDetailsModal()

						this.LoadAsyncData()
						this.LoadAsyncDataReceives()
					}
				}
			},

			async AcceptCompleteStockTransfer() {
				//when accepted
				// 1. stock transfer status will be "Completed"
				// 2. item stockins
				// 3. items stockouts on the fulfilling branch

				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>Accept</b> the Stock Transfer? This action cannot be undone.',
					confirmText: 'Confirm',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					const payload = {
						stock_transfer: this.selected_stocktransfer
					}

					const res = await this.AcceptStockTransfer(payload)
					if (res.status === 'ok') {
						this.CloseDetailsModal()
						this.LoadAsyncData()
						this.LoadAsyncDataReceives()
					}
					//notification
					//this.GetPurchaseOrdersByStatus('Sent')
				}
			},

			async RevertProcessStockTransfer() {
				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>Revert</b> the Stock Transfer? This action cannot be undone.',
					confirmText: 'Confirm',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					const payload = {
						stock_transfer: this.selected_stocktransfer
					}

					const res = await this.RevertStockTransfer(payload)
					if (res.status === 'ok') {
						this.CloseDetailsModal()
						this.LoadAsyncData()
						this.LoadAsyncDataReceives()
					}
					//notification
					//this.GetPurchaseOrdersByStatus('Sent')
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

				const stocks = await this.GetStockTransfers(params)

				this.stockTransfers = []
				this.stockTransfers = stocks.data.results
				this.totalDataCount = stocks.data.total

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

				this.filters.push({ field: 'date_requested', value: formattedDate, type: 'like' })
				this.filters.push({ field: 'stock_transfer_no', value: this.filterTransNo, type: 'like' })
				this.filters.push({ field: 'status', value: this.filterStatus, type: 'like' })
				this.filters.push({ field: 'fulfilling_branch_code', value: this.filterFulfillingBranch, type: 'like' })
				// this.filters.push({ field: 'invoice_no', value: this.filterInvoice, type: '=' })
				// this.filters.push({ field: 'customer_id', value: this.filterCustomer, type: '=' })

				this.LoadAsyncData()
			},

			FilterByTransNo(value) {
				this.searchDebounce(this)
			},

			FilterByStatus(value) {
				this.searchDebounce(this)
			},

			FilterByDate(value) {
				this.filterDate = value
				this.searchDebounce(this)
			},

			FilterByFulfillingBranch(value) {
				this.searchDebounce(this)
			},

			searchDebounce: debounce((vm) => {
				vm.onFilterData()
			}, 500),

			// Request Receive

			async LoadAsyncDataReceives() {
				const params = {
					sort_by: this.receivesSortField,
					sort_order: this.receivesSortOrder,
					page: this.receivesPage,
					pageSize: this.receivesPageSize,
					filters: this.receivesFilters || [],
					branch_code: this.selectedBranch.branch_code
				}

				this.receivesLoading = true

				const stocks = await this.GetStockTransfersRequestReceive(params)

				this.stockRequestReceives = []
				this.stockRequestReceives = stocks.data.results
				this.receivesTotalDataCount = stocks.data.total

				this.receivesLoading = false
			},

			onPageChangeReceives(page) {
				this.page = page
				this.LoadAsyncData()
			},

			onSortReceives(field, order) {
				this.sortField = field
				this.sortOrder = order
				this.LoadAsyncData()
			},

			onFilterDataReceives() {
				this.receivesFilters = []

				let formattedDate = null
				if (this.receivesFilterDate) {
					formattedDate = dayjs(this.receivesFilterDate).format('YYYY-MM-DD')
				}

				this.receivesFilters.push({ field: 'date_requested', value: formattedDate, type: 'like' })
				this.receivesFilters.push({ field: 'stock_transfer_no', value: this.receivesFilterTransNo, type: 'like' })
				this.receivesFilters.push({ field: 'status', value: this.receivesFilterStatus, type: 'like' })
				this.receivesFilters.push({ field: 'requesting_branch_code', value: this.receivesFilterRequestingBranch, type: 'like' })

				this.LoadAsyncDataReceives()
			},

			FilterByTransNoReceives(value) {
				this.searchDebounceReceives(this)
			},

			FilterByStatusReceives(value) {
				this.searchDebounceReceives(this)
			},

			FilterByDateReceives(value) {
				this.receivesFilterDate = value
				this.searchDebounceReceives(this)
			},

			FilterByRequestingBranchReceives(value) {
				this.searchDebounceReceives(this)
			},

			searchDebounceReceives: debounce((vm) => {
				vm.onFilterDataReceives()
			}, 500),

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
					type: 'Stock_Transfer',
					branch_code: this.$store.state.selectedBranch.branch_code,
					ref_field: 'stock_transfer_no',
					ref_no: this.selected_stocktransfer.stock_transfer_no
				}

				let urlParams = new URLSearchParams(obj).toString()

				window.open('/printing/singledoc?' + urlParams, '_blank', 'location=yes,height=768,width=800,scrollbars=yes,status=yes')
			},

			async AllowReprint() {
				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>allow</b> re-priting of the selected Stock Transfer? This action cannot be undone.',
					confirmText: 'Allow Reprint',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					let res = await this.SetAllowReprinting(this.selected_stocktransfer)
					if (res.status === 'ok') {
						this.CloseDetailsModal()
						this.LoadAsyncData()
						this.LoadAsyncDataReceives()
					}
				}
			}
		},

		mounted() {
			this.LoadAsyncData()
			this.LoadAsyncDataReceives()

			this.GetBranches()
			this.GetProducts()
		}
	}
</script>

<style>
	.wrapper-h {
		height: calc(100vh - 125px);
	}
	.wrapper-h-tab {
		height: calc(100vh - 170px);
	}
</style>
