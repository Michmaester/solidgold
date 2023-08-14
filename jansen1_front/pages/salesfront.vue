<template>
	<div class="overflow-y-auto">

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200" id="salesfront-header">

			<h3 class="has-text-header">Sales Ordering</h3>
			<nuxt-link v-if="!isSalesStaff" :to="'/'">Dashboard</nuxt-link>

			<div class="flex items-center">

				<p class="px-4 text-sm">{{ selectedBranch.name }} [{{ selectedBranch.branch_code }}]</p>
				<div class="px-2 leading-tight mx-4">
					<p class="has-text-primary font-semibold">{{ this.$auth.user.fullname }}</p>
					<p class="text-xs has-text-primary">{{ this.$auth.user.position }}</p>
				</div>

				<b-button type="is-primary" rounded size="is-small" @click="LogoutUser">Logout</b-button>
			</div>

		</div>

		<div class="grid grid-cols-8 gap-4 p-4 has-background-pageheader">

			<div class="col-span-8 flex flex-col sm:flex-row bg-white">

				<div class="sm:w-3/6 w-full flex flex-col" id="salesfront-left-content">

					<b-field>
						<p class="control">
							<span class="button is-static font-bold w-40">Product Code</span>
						</p>
						<b-input placeholder="Type to search..." expanded v-model="filterCode" @input="FilterByCode"></b-input>
						<p class="control">
							<b-button type="is-danger" icon-right="close" @click="FilterByCode(null)"></b-button>
						</p>
					</b-field>

					<b-field>
						<p class="control">
							<span class="button is-static font-bold w-40">Product Name</span>
						</p>
						<b-input placeholder="Type to search..." expanded v-model="filterName" @input="FilterByName"></b-input>
						<p class="control">

							<b-button type="is-danger" icon-right="close" @click="FilterByName(null)"></b-button>
						</p>
					</b-field>

					<div class="w-full">
						<h3 class="p-2 font-bold text-sm has-background-primary">Products</h3>
						<client-only placeholder="Loading...">
							<b-field class="flex flex-col rlist mr-2 w-full">
								<virtual-list class="list" style="height:calc(100vh - 240px); overflow-y: auto;" :data-key="'id'" :data-sources="products" :data-component="item" :estimate-size="150" :extra-props="{ onItemClick: onClickDefineInRoot }" />
							</b-field>
						</client-only>
					</div>

				</div>

				<div class="sm:w-3/6 w-full bg-gray-500 ml-2 sm:ml-4" id="salesfront-printable">
					<div>

						<div class="bg-gray-800 flex justify-between items-center p-2">
							<p class="text-white font-bold text-xl">Total Amount : {{ $formatAmountCurrency(orders_total) }}</p>
							<div class="flex">
								<b-button type="is-primary" class="font-bold mr-2 printing-hide" @click="GetKeepList" icon-left="format-list-checkbox"></b-button>
								<b-button :disabled="form_products.length <= 0 || this.form_sales.customer_id == null" type="is-primary" class="font-bold mr-2 printing-hide" @click="PerformKeep">Keep</b-button>
								<b-button :disabled="form_products.length <= 0 || this.form_sales.customer_id == null" type="is-primary" class="font-bold mr-2 printing-hide" @click="PrintList" icon-left="printer">Print</b-button>
								<b-button :disabled="form_products.length <= 0 || this.form_sales.customer_id == null" type="is-primary" class="font-bold printing-hide" @click="SubmitOrder" icon-left="check">Submit Order</b-button>
							</div>

						</div>

						<div class="p-2">

							<div>
								<b-field label="Customers" custom-class="text-sm" class="w-full">
									<client-only placeholder="Loading...">
										<v-select :options="customers" v-model="form_sales.customer_id" class="bg-white rounded-sm" @input="SelectedCustomer" :reduce="customer => customer.customer_id" label="name" />
									</client-only>
								</b-field>
								<b-field v-if="form_sales.customer_name === 'cash' || form_sales.customer_name === 'Cash'" label="Name" custom-class="text-sm" class="w-full">
									<b-input type="text" v-model="form_sales.cash_remark" class="bg-gray-500"></b-input>
								</b-field>
							</div>

							<div class="flex">

								<b-field label="Customer Address" custom-class="text-sm" class="w-full mr-2">
									<p class="w-full bg-white px-2 py-1 font-bold text-red-600 rounded-sm">{{ form_sales.customer_address }}</p>
								</b-field>

								<b-field label="Sales Type" custom-class="text-sm" class="w-48">
									<p class="w-full bg-white px-2 py-1 font-bold text-red-600 rounded-sm">{{ form_sales.sales_type }}</p>
								</b-field>

							</div>

						</div>

						<div class="w-full flex items-center bg-gray-400 p-2">
							<div class="w-full">Product</div>
							<div class="w-32">Quantity</div>
							<div class="w-40">Price</div>
							<div class="w-40">Total</div>
							<div class="w-56 printing-hide">Action</div>
						</div>

						<!-- added dynamic height and scroll for y axis -->
						<div class="overflow-y-scroll" style="height:calc(100vh - 340px)">
							<div v-for="(item,index) in form_products" :key="index" class="w-full text-sm flex items-center bg-gray-200 hover:bg-gray-100 p-2 border-b border-gray-300">
								<div class="w-full leading-tight">
									<p class="text-sm font-semibold">{{ item.name }} - {{ item.product_code }}</p>
									<p class="text-sm">{{ item.description }} - {{ item.brand }}</p>
								</div>
								<p class="w-32">{{ item.quantity }}</p>

								<p class="w-40">{{ item.sale_price }}</p>
								<p class="w-40">{{ item.total_item_amount }}</p>

								<div class="w-56 printing-hide">
									<b-button type="is-primary" @click="EditProduct(index)">Edit</b-button>
									<b-button type="is-danger" icon-right="delete" @click="RemoveProduct(index)"></b-button>
								</div>
							</div>
						</div>

					</div>
				</div>

			</div>

		</div>

		<b-modal :active.sync="isModalShow" has-modal-card :width="1000" @close="CloseProductModal" :can-cancel="['outside']" :destroy-on-hide="false">

			<div class="modal-card" style="width: 800px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-semibold text-white">Product Form</p>
					<div>
						<a href="#" @click.prevent="CloseProductModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div class="columns mb-0">
						<div class="column">
							<div class="flex items-center justify-between">
								<div>
									<p class="font-bold text-l">Product Name : {{ form_product.name }}</p>
									<p class="font-bold text-l">Description : {{ form_product.description }}</p>
								</div>
								<div class="flex justify-end">
									<!-- <img v-for="(file,idx) in productImages" :src="file" class="p-2 w-24 h-24 border border-gray-500 mx-2 rounded" :key="idx" /> -->

									<div class="p-2 w-24 h-24 border border-gray-500 mx-2 rounded" v-for="(image, imageIndex) in productImages" :key="imageIndex" @click="productIndex = imageIndex" :style="{ backgroundImage: `url(${image})` }"></div>

								</div>
							</div>

							<p class="font-bold text-xl mt-2 p-3 rounded-sm bg-red-200 text-center"><span class="text-red-500" v-if="form_product.onhand_qty == 0">[ NO STOCK !! ]</span> Stock On-Hand : {{ form_product.onhand_qty }}</p>

							<div class="flex mt-4">

								<b-field :label="'Quantity - ' + this.selected_unit.item_unit" custom-class="" class="mr-6">
									<b-numberinput min="0" :max="form_product.onhand_qty" controls-position="compact" v-model="form_product.quantity" @input="CalculateItemTotal"></b-numberinput>
								</b-field>

								<b-field label="Price" custom-class="" class="mr-6">
									<b-input :disabled="$auth.user.role !== 'Administrator'" type="text" v-model="form_product.sale_price" @input="CalculateItemTotal"></b-input>
								</b-field>

								<b-field label="Total Amount" custom-class="" class="mr-6">
									<b-input disabled type="text" v-model="form_product.total_item_amount"></b-input>
								</b-field>

							</div>
						</div>

					</div>

				</section>
				<footer class="modal-card-foot px-5 py-3">
					<b-button :disabled="form_product.quantity == 0 || form_product.total_item_amount == 0 || form_product.sale_price == 0" v-show="isFormCreate" type="is-primary" expanded @click="AddProductForm" icon-left="plus">Add Product</b-button>
					<b-button v-show="!isFormCreate" type="is-primary" expanded @click="UpdateProductForm">Update</b-button>
				</footer>

			</div>
		</b-modal>

		<b-modal :active.sync="isModalKeepListShow" has-modal-card :width="1000" @close="CloseKeepListModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 800px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-semibold text-white">Keep Lists</p>
					<div>
						<b-button :disabled="checked_keep_lists.length <= 0" type="is-danger" size="is-small" @click="DeleteSelectedKeepLists">Delete</b-button>
						<b-button :disabled="selected_keep_list == null" type="is-light" size="is-small" @click="ProcessSelectedKeepList" icon-left="check">Select</b-button>
					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div>
						<b-table :striped="true" :narrowed="true" :hoverable="true" paginated :pagination-rounded="false" pagination-size="is-small" sort-icon="arrow-up" sort-icon-size="is-small" :pagination-simple="true" :pagination-position="'top'" :checked-rows.sync="checked_keep_lists" checkable :checkbox-position="'right'" :selected.sync="selected_keep_list" :data="keepLists">

							<b-table-column v-slot="props" field="" label="Date">
								{{ props.row.dateOrder }}
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Customer">
								{{ props.row.customer_name }}
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Remark">
								{{ props.row.cash_remark }}
							</b-table-column>

							<b-table-column v-slot="props" field="" label="Sales">
								{{ props.row.salesman }}
							</b-table-column>

							<!-- <b-table-column v-slot="props" field="" label="Items Count">
								{{ props.row.total_items }}
							</b-table-column> -->

						</b-table>
					</div>

				</section>

			</div>
		</b-modal>

		<CoolLightBox :items="productImages" :index="productIndex" :slideshow="false" :gallery="false" :showCloseButton="true" @close="productIndex = null">
		</CoolLightBox>

	</div>
</template>

<script>
	import { mapActions, mapMutations, mapGetters } from 'vuex'
	import { debounce } from 'lodash'
	import Item from '@/components/Item'
	import CoolLightBox from 'vue-cool-lightbox'
	import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'

	export default {
		layout: 'auth',

		components: {
			CoolLightBox
		},

		computed: {
			...mapGetters({
				selectedBranch: 'getSelectedBranch'
			})
		},

		props: {},

		data() {
			return {
				item: Item,

				products: [],
				customers: [],
				categories: [],
				brands: [],
				types: [],
				units: [],
				colors: [],

				productImages: [],
				productIndex: null,
				images: ['https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg', 'https://static.toiimg.com/photo/72975551.cms'],
				index: null,

				form_product: {
					product_id: null,
					name: null,
					description: null,
					retail: null,
					wholesale: null,
					onhand_qty: null,
					sale_price: null,
					quantity: null,
					total_item_amount: null
				},

				form_sales: {
					order_no: null,
					customer_id: null,
					customer_name: null,
					customer_address: null,
					sales_type: null,
					cash_remark: null
				},

				form_products: [],
				orders_total: null,

				selected_edit_product_index: null,

				selected_product: {},
				selected_customer: {},
				selected_unit: {},

				tmp_selected_products: [],

				isModalShow: false,
				isFormCreate: false,
				isModalKeepListShow: false,

				isSalesStaff: false,

				filterCode: null,
				filterName: null,

				keepLists: [],
				checked_keep_lists: [],
				selected_keep_list: null
			}
		},

		methods: {
			...mapActions({
				GetSalesFrontDatas: 'GetSalesFrontDatas',
				GetProductStock: 'products/GetProductStock',
				GetProductBySelectedCriterias: 'products/GetProductBySelectedCriterias',
				InsertSalesOrder: 'sales/InsertSalesOrder',

				GetAllKeepList: 'sales/GetAllKeepList',
				InsertKeepList: 'sales/InsertKeepList',
				DeleteKeepList: 'sales/DeleteKeepList'
			}),

			...mapMutations({}),

			async GetProductByCriteria() {
				this.filters = []

				this.filters.push({ field: 'product_code', value: this.filterCode, type: 'like' })
				this.filters.push({ field: 'name', value: this.filterName, type: 'like' })

				const params = {
					filters: this.filters || []
				}

				if (this.filterCode === null && this.filterName === null) {
					this.products = []
				} else {
					const res = await this.GetProductBySelectedCriterias(params)
					this.products = res.data
				}
			},

			SelectedCustomer(data) {
				// clear the form
				//this.$setObjectPropNull(this.form_sales, null)
				this.form_sales.order_no = null

				if (data) {
					var res = this.customers.find((item) => {
						return item.customer_id === this.form_sales.customer_id
					})

					this.form_sales.customer_address = res.address == null ? 'n/a' : res.address
					this.form_sales.customer_name = res.name
					this.form_sales.sales_type = res.sales_type
				} else {
					this.form_sales.customer_address = 'n/a'
					this.form_sales.customer_name = null
					this.form_sales.sales_type = 'Retail'
				}

				this.form_sales.cash_remark = null
			},

			async SelectedProduct() {
				this.isFormCreate = true

				let data = this.$clearReactive(this.selected_product)

				this.form_product.product_id = data.product_id
				this.form_product.name = data.name
				this.form_product.description = data.description

				if (this.form_sales.sales_type === 'Retail' || this.form_sales.sales_type === 'retail') {
					this.form_product.sale_price = data.price.retail
				} else {
					this.form_product.sale_price = data.price.wholesale
				}

				this.selected_unit = this.selected_product.unit

				//get this product stock on hand by the selected branch
				const stock = await this.GetProductStock(this.form_product)

				this.form_product.onhand_qty = stock.onhand_qty
				this.form_product.quantity = 0
				this.form_product.total_item_amount = 0

				this.CalculateItemTotal()

				this.productImages = []

				if (data.images) {
					let splittedImages = data.images.split(',')
					for (let idx = 0; idx < splittedImages.length; idx++) {
						this.productImages.push(process.env.apiUrl + '/files' + splittedImages[idx])
					}
				}

				this.isModalShow = true
			},

			EditProduct(index) {
				this.selected_edit_product_index = index

				this.isFormCreate = false

				//clear reactive data
				this.form_product = this.$clearReactive(this.form_products[index])

				this.isModalShow = true
			},

			CloseProductModal() {
				this.isModalShow = false
				this.selected_product = {}
			},

			CalculateItemTotal() {
				this.form_product.total_item_amount = (this.form_product.quantity * this.form_product.sale_price).toFixed(2)
			},

			CalculateOrderTotal() {
				this.orders_total = this.$calculateTotals(this.form_products, 'total_item_amount')
			},

			AddProductForm() {
				//check the selected product is already on the cart
				//if yes then update the cart

				let newprod = this.$clearReactive(this.form_product)

				let objIndex = this.form_products.findIndex((obj) => obj.product_id === newprod.product_id)
				if (objIndex >= 0) {
					//is exist then add up and recalculate
					let qty = this.form_products[objIndex].quantity
					let sale_price = this.form_products[objIndex].sale_price

					let newqty = parseInt(qty) + parseInt(newprod.quantity)
					let new_total_item_amount = newqty * parseFloat(sale_price)

					this.form_products[objIndex].quantity = newqty
					this.form_products[objIndex].total_item_amount = new_total_item_amount.toFixed(2)
				} else {
					//this.form_products.push(this.$clearReactive(this.form_product))
					this.form_products.push(newprod)
				}

				this.isModalShow = false
				this.CalculateOrderTotal()
			},

			UpdateProductForm() {
				//do not splice to maintain the order of the list
				let prod = this.$clearReactive(this.form_product)

				this.form_products[this.selected_edit_product_index].quantity = prod.quantity
				this.form_products[this.selected_edit_product_index].total_item_amount = prod.total_item_amount

				this.isModalShow = false
				this.CalculateOrderTotal()
			},

			RemoveProduct(index) {
				this.form_products.splice(index, 1)
				this.CalculateOrderTotal()
			},

			async SubmitOrder() {
				//console.log(this.form_sales)
				// this.InitClear()

				const { result, dialog } = await this.$buefy.dialog.confirm({
					title: 'Submit Order',
					message: 'Are you sure you want to <b>submit</b> this order? This action cannot be undone.',
					confirmText: 'Submit Order',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: false
				})

				if (result) {
					var order_items = this.form_products.map((item) => {
						return {
							product_id: item.product_id,
							sale_price: item.sale_price,
							quantity: item.quantity
						}
					})
					let res = await this.InsertSalesOrder({
						salesorder: this.form_sales,
						salesorder_items: order_items
					})
					if (res.status === 'ok') {
						this.InitClear()
						dialog.close()
						this.$buefy.dialog.alert({
							message: 'Order was submitted successfully.'
						})
					}
				}
			},

			PrintList() {
				window.print()
			},

			InitClear() {
				this.$setObjectPropNull(this.form_product, null)
				this.$setObjectPropNull(this.form_sales, null)

				this.form_products = []
				this.orders_total = null
			},

			FilterByCode(value) {
				this.filterCode = value
				this.searchDebounce(this)
			},

			FilterByName(value) {
				this.filterName = value
				this.searchDebounce(this)
			},

			searchDebounce: debounce((vm) => {
				vm.GetProductByCriteria()
			}, 500),

			onClickDefineInRoot(data) {
				this.selected_product = data
				this.SelectedProduct()
			},

			async LogoutUser() {
				try {
					let response = await this.$auth.logout()

					//remove cookie
					this.$cookies.remove('preferred-branch')
				} catch (err) {
					console.log(err)
				}
			},

			CloseKeepListModal() {
				this.isModalKeepListShow = false
			},

			ProcessSelectedKeepList() {
				this.form_products = []

				this.$setObjectPropNull(this.form_sales, null)

				this.form_sales.order_no = this.selected_keep_list.order_no
				this.form_sales.customer_id = this.selected_keep_list.customer_id
				this.form_sales.customer_name = this.selected_keep_list.customer_name
				this.form_sales.customer_address = this.selected_keep_list.customer_address
				this.form_sales.sales_type = this.selected_keep_list.sales_type
				this.form_sales.cash_remark = this.selected_keep_list.cash_remark

				let items = this.selected_keep_list.items
				for (let index = 0; index < items.length; index++) {
					let new_total_item_amount = parseInt(items[index].quantity) * parseFloat(items[index].sale_price)

					this.form_products.push({
						product_id: items[index].product_id,
						name: items[index].product.name,
						description: items[index].product.description,
						product_code: items[index].product.product_code,
						brand: items[index].product.brand.brandname,
						sale_price: items[index].sale_price,
						quantity: items[index].quantity,
						total_item_amount: new_total_item_amount.toFixed(2)
					})
				}

				this.CalculateOrderTotal()

				this.isModalKeepListShow = false
			},

			async GetKeepList() {
				this.isModalKeepListShow = true
				const result = await this.GetAllKeepList()
				this.keepLists = result.data
			},

			async PerformKeep() {
				const { result, dialog } = await this.$buefy.dialog.confirm({
					title: 'Keep Order',
					message: 'Are you sure you want to <b>KEEP</b> this order? This action cannot be undone.',
					confirmText: 'Keep Order',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: false
				})

				let order_items = this.form_products.map((item) => {
					return {
						product_id: item.product_id,
						sale_price: item.sale_price,
						quantity: item.quantity
					}
				})
				const payload = {
					salesorder: this.form_sales,
					salesorder_items: order_items
				}

				console.log(payload)

				if (result) {
					const res = await this.InsertKeepList(payload)
					if (res.status === 'ok') {
						dialog.close()
						this.InitClear()
					}
				}
			},

			async DeleteSelectedKeepLists() {
				const { result, dialog } = await this.$buefy.dialog.confirm({
					title: 'Delete Keep Order/s',
					message: 'Are you sure you want to <b>DELETE</b> this order/s? This action cannot be undone.',
					confirmText: 'Delete Keep Order/s',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: false
				})

				const payload = {
					order_nos: this.checked_keep_lists.map((item) => {
						return item.order_no
					})
				}

				if (result) {
					const res = await this.DeleteKeepList(payload)
					if (res.status === 'ok') {
						this.checked_keep_lists = []
						dialog.close()
						this.GetKeepList()
					}
				}
			}
		},

		async mounted() {
			const datas = await this.GetSalesFrontDatas()

			this.customers = datas.customers

			this.form_sales.customer_address = 'n/a'
			this.form_sales.sales_type = 'Retail'

			if (this.$auth.$state.user.role === 'Sales') {
				this.isSalesStaff = true
			} else {
				this.isSalesStaff = false
			}
		}
	}
</script>

<style scoped>
	.wrapper-h {
		height: calc(100vh - 125px);
	}
	.image {
		width: 300px;
		height: 300px;
		margin: 0 auto;
	}
</style>
