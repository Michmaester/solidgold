<template>
	<div>

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">

			<h3 class="has-text-header">Products</h3>
			<div class="flex items-center">
				<b-button type="is-primary" icon-left="update" class="is-small text-white" @click="BulkPriceUpdate">Bulk Price Update</b-button>
				<b-button type="is-primary" icon-left="plus" class="is-small text-white ml-1" @click="NewForm">Create Product</b-button>
				<b-button :disabled="selected_product.id == null" type="is-primary" icon-left="playlist-edit" class="is-small ml-1" @click="EditForm">Edit</b-button>
			</div>
		</div>

		<div class="grid grid-cols-8 gap-4 p-4 has-background-pageheader">

			<div class="col-span-8 wrapper-h bg-white">

				<!-- main table -->
				<div class="text-sm p-2">

					<b-table :striped="true" :narrowed="true" :hoverable="true" :loading="loading" paginated backend-pagination :pagination-rounded="true" pagination-size="is-small" :total="totalDataCount" :per-page="pageSize" @page-change="onPageChange" backend-sorting :default-sort-direction="defaultSortOrder" :default-sort="[sortField, sortOrder]" @sort="onSort" sort-icon="arrow-up" sort-icon-size="is-small" :pagination-simple="false" :pagination-position="'top'" :selected.sync="selected_product" :data="products">

						<template slot="top-left">
							<div class="flex">
								<b-field label="Product Name" custom-class="font-semibold text-xs no-mb-labels" class="w-64 text-xs mr-1">
									<b-input type="primary" size="is-small" v-model="filterName" @input="FilterByName"></b-input>
								</b-field>

								<b-field label="Code" custom-class="font-semibold text-xs no-mb-labels" class="w-40 text-xs mr-1">
									<b-input type="primary" size="is-small" v-model="filterCode" @input="FilterByCode"></b-input>
								</b-field>
							</div>

						</template>

						<b-table-column label="ID" field="product_id" v-slot="props" sortable>
							{{ props.row.product_id}}
						</b-table-column>

						<b-table-column label="Code" v-slot="props">
							<p class="font-bold">{{ props.row.product_code }}</p>

						</b-table-column>

						<b-table-column label="Product" v-slot="props">
							{{ props.row.name }}
						</b-table-column>

						<b-table-column label="Description" v-slot="props">
							{{ props.row.description }}
						</b-table-column>

						<b-table-column label="Brand" v-slot="props">
							{{ props.row.brand.brandname }}
						</b-table-column>

						<b-table-column label="Unit" v-slot="props">
							{{ props.row.unit.item_unit }}
						</b-table-column>

						<b-table-column label="Cost" v-slot="props" width="100">
							<b-input type="is-primary" size="is-small" v-model="props.row.price.cost"></b-input>
						</b-table-column>

						<b-table-column label="Retail" v-slot="props" width="100">
							<b-input type="is-primary" size="is-small" v-model="props.row.price.retail"></b-input>
						</b-table-column>

						<b-table-column label="Wholesale" v-slot="props" width="100">
							<b-input type="is-primary" size="is-small" v-model="props.row.price.wholesale"></b-input>
						</b-table-column>

					</b-table>
				</div>

			</div>

		</div>

		<b-modal :active.sync="isModalProductFormShow" has-modal-card trap-focus :width="1000" @close="CloseProductFormModal" :can-cancel="['outside']" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1000px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-semibold text-white">Product Form</p>
					<div>
						<a href="#" @click.prevent="CloseProductFormModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div class="flex">
						<b-field label="Name" custom-class="text-xs" class="w-1/2 mr-4">
							<b-input size='is-small' type="text" v-model="form_product.name"></b-input>
						</b-field>
						<b-field label="Code" custom-class="text-xs" class="w-32 mr-4">
							<b-input size='is-small' type="text" v-model="form_product.product_code"></b-input>
						</b-field>
						<b-field label="Description" custom-class="text-xs" class="w-1/2">
							<b-input size='is-small' type="text" v-model="form_product.description"></b-input>
						</b-field>
					</div>

					<div class="flex mt-3">

						<b-field label="Category" custom-class="text-xs" class="w-1/3 mr-4">
							<b-select placeholder="Select category" size='is-small' expanded v-model="form_product.category_ref_id">
								<option v-for="category in categories" :value="category.id" :key="category.id">
									{{ category.name }}
								</option>
							</b-select>
						</b-field>

						<b-field label="Brand" custom-class="text-xs" class="w-1/3 mr-4">
							<b-select placeholder="Select brand" size='is-small' expanded v-model="form_product.brand_id">
								<option v-for="brand in brands" :value="brand.id" :key="brand.id">
									{{ brand.brandname }}
								</option>
							</b-select>
						</b-field>
						<!-- <b-field label="Division" custom-class="text-xs" class="w-1/2">
							<b-select placeholder="Select division" size='is-small' expanded v-model="form_product.division_ref_id">
								<option v-for="division in divisions" :value="division.id" :key="division.id">
									{{ division.name }}
								</option>
							</b-select>
						</b-field> -->
					</div>

					<div class="flex">

						<b-field label="Type" custom-class="text-xs" class="w-1/3 mr-4">
							<b-select placeholder="Select division" size='is-small' expanded v-model="form_product.type_ref_id">
								<option v-for="type in types" :value="type.id" :key="type.id">
									{{ type.item_type }}
								</option>
							</b-select>
						</b-field>

						<b-field label="Unit" custom-class="text-xs" class="w-1/3 mr-4">
							<b-select placeholder="Select unit" size='is-small' expanded v-model="form_product.product_unit_id">
								<option v-for="unit in units" :value="unit.id" :key="unit.id">
									{{ unit.item_unit }}
								</option>
							</b-select>
						</b-field>

					</div>

					<div class="flex">

						<!-- <b-field label="Order Qty" custom-class="text-xs" class="w-1/3 mr-4">
							<b-input size='is-small' type="text" v-model="form_product.on_order_qty"></b-input>
						</b-field>
						<b-field label="On PO" custom-class="text-xs" class="w-1/3">
							<b-input size='is-small' type="text" v-model="form_product.on_PO"></b-input>
						</b-field> -->
					</div>

					<div class="flex my-3">
						<!-- <b-field label="Code" custom-class="text-xs" class="mr-4">
							<b-input size='is-small' type="text" v-model="form_product.product_code"></b-input>
						</b-field> -->
						<b-field label="Status" custom-class="text-xs" class="w-32 mr-4">
							<!-- <b-input size='is-small' type="text" v-model="form_product.status"></b-input> -->
							<b-switch v-model="form_product.status" true-value="Active" false-value="Inactive" size="is-small">{{ form_product.status }}</b-switch>
						</b-field>

						<b-field label="Cost" custom-class="text-xs" class="w-48 mr-4">
							<b-input size='is-small' type="text" v-model="form_product.price.cost"></b-input>
						</b-field>
						<b-field label="Retail" custom-class="text-xs" class="w-48 mr-4">
							<b-input size='is-small' type="text" v-model="form_product.price.retail"></b-input>
						</b-field>
						<b-field label="Wholesale" custom-class="text-xs" class="w-48 mr-4">
							<b-input size='is-small' type="text" v-model="form_product.price.wholesale"></b-input>
						</b-field>

					</div>

					<div class="rounded bg-gray-300 p-4">
						<!-- <b-field label="Image" custom-class="text-xs" class="w-32 mr-4">
							
							<b-switch v-model="form_product.enabled_images" true-value="Active" false-value="Inactive" size="is-small">{{ form_product.status }}</b-switch>
						</b-field> -->

						<b-field class="file is-primary">
							<b-upload v-model="files" expanded class="file-label" accept="image/*" :native="true" :multiple="true" @input="CheckFileCounts">
								<span class="file-cta  is-fullwidth">
									<b-icon class="file-icon" size="is-small" icon="upload"></b-icon>
									<span class="file-label" size="is-small">Upload Images</span>
								</span>

							</b-upload>
						</b-field>

						<div class="flex">
							<!-- <img v-for="(file,idx) in imageFiles" :src="file.src" class="file-name w-24 h-24" :key="idx" /> -->

							<div class="flex flex-col" v-for="(image, imageIndex) in imageFiles" :key="imageIndex">
								<div class="p-2 w-24 h-24 border border-gray-500 rounded mx-2" @click="imageFilesIndex = imageIndex" :style="{ backgroundImage: `url(${image.src})` }">

								</div>

								<b-button class="is-small mt-1 mx-2" type="is-danger" icon-left="delete" @click="deleteDropFile(imageIndex)">Remove</b-button>
								<!-- <button class="delete is-small" type="button" @click="deleteDropFile(imageIndex)">
								</button> -->
							</div>
						</div>

						<CoolLightBox :items="imageFiles" :index="imageFilesIndex" :slideshow="false" :gallery="false" :showCloseButton="true" @close="imageFilesIndex = null">
						</CoolLightBox>

					</div>

				</section>
				<footer class="modal-card-foot px-5 py-3">
					<b-button v-if="isFormCreate" type="is-primary" icon-left="content-save-outline" class="is-small text-white" @click="SaveProductForm">Save Product</b-button>
					<b-button v-if="!isFormCreate" type="is-primary" icon-left="update" class="is-small text-white" @click="UpdateProductForm">Update Product</b-button>
					<b-button v-if="!isFormCreate" type="is-primary" icon-left="update" class="is-small text-white" @click="UpdateProductPrice">Update Price</b-button>

				</footer>

			</div>
		</b-modal>

	</div>
</template>

<script>
	import { mapActions, mapMutations, mapGetters } from 'vuex'
	import dayjs from 'dayjs'
	import { debounce } from 'lodash'
	import CoolLightBox from 'vue-cool-lightbox'
	import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'

	export default {
		components: {
			CoolLightBox
		},
		meta: {
			module: 'setup-products'
		},

		computed: {
			...mapGetters({
				// products: 'products/getProducts',
				brands: 'masterdatas/getBrands',
				categories: 'masterdatas/getCategories',
				colors: 'masterdatas/getColors',
				divisions: 'masterdatas/getDivisions',
				types: 'masterdatas/getTypes',
				units: 'masterdatas/getUnits'
			})
		},

		data() {
			return {
				products: [],
				totalDataCount: 0,
				loading: false,
				sortField: 'id',
				sortOrder: 'desc',
				defaultSortOrder: 'desc',
				page: 1,
				pageSize: 17,

				filters: [],
				filterName: null,
				filterCode: null,

				selected_product: {},

				form_product: {
					id: null,
					product_id: null,
					name: null,
					description: null,
					product_code: null,
					status: null,
					brand_id: null,
					division_ref_id: null,
					category_ref_id: null,
					type_ref_id: null,
					product_unit_id: null,
					on_order_qty: null,
					on_PO: null,
					price: {
						cost: null,
						retail: null,
						wholesale: null
					},

					enabled_images: null,
					image1: null,
					image2: null,
					image3: null
				},

				files: [],
				imageFiles: [],
				imageFilesIndex: null,

				isFormCreate: false,
				isModalProductFormShow: false
			}
		},

		methods: {
			...mapActions({
				GetProducts: 'products/GetProducts',
				GetBrands: 'masterdatas/GetBrands',
				GetCategories: 'masterdatas/GetCategories',
				GetColors: 'masterdatas/GetColors',
				GetDivisions: 'masterdatas/GetDivisions',
				GetTypes: 'masterdatas/GetTypes',
				GetUnits: 'masterdatas/GetUnits',

				InsertProduct: 'products/InsertProduct',
				UpdateProduct: 'products/UpdateProduct',
				UpdateProductPricing: 'products/UpdateProductPricing',

				BulkUpdateProductPricing: 'products/BulkUpdateProductPricing',

				UploadProductImage: 'products/UploadProductImage',
				UpdateProductImages: 'products/UpdateProductImages'
			}),

			...mapMutations({}),

			NewForm() {
				this.isFormCreate = true

				//console.log(this.form_product)

				this.$setObjectPropNull(this.form_product, null)

				// console.log('empty.')
				// console.log(this.form_product)

				this.isModalProductFormShow = true
			},

			EditForm() {
				this.isFormCreate = false

				this.form_product = this.$clearReactive(this.selected_product)

				this.imageFiles = []
				if (this.form_product.images) {
					let splittedImages = this.form_product.images.split(',')
					for (let idx = 0; idx < splittedImages.length; idx++) {
						this.imageFiles.push({
							name: null,
							src: process.env.apiUrl + '/files' + splittedImages[idx],
							file: null
						})
					}
				}

				this.isModalProductFormShow = true
			},

			CloseProductFormModal() {
				this.imageFiles = []

				this.isModalProductFormShow = false
			},

			//Product

			async SaveProductForm() {
				// const success = await this.$refs.form.validate()
				// if (!success) {
				// 	return
				// }

				/*

									SEQUENCE :
									// INSERT
									1. insert the customer
									2. upload the images
									3. update the customer images with the uploaded images filename and paths
									4. return overall repsonse


									//UPDATE
									1. update the customer infromation
									2. upload the images
									3. update the customer images with the uploaded images filename and paths
									4. return overall repsonse

								*/

				// console.log(this.imageFiles)

				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>Add</b> this product? This action cannot be undone. Kindly double check the details before confirming.',
					confirmText: 'Confirm Action',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					const resp = await this.InsertProduct(this.form_product)

					// check if product is inserted
					if (resp.status === 'ok') {
						//check if there are images to be uploaded
						if (this.imageFiles.length > 0) {
							let folderDir = 'images'
							let formdata = new FormData()

							formdata.append('folderDir', folderDir)
							formdata.append('prefixName', resp.data.product_id)

							for (let idx = 0; idx < this.imageFiles.length; idx++) {
								formdata.append('images', this.imageFiles[idx].file)
							}

							// upload the images, wait the result and make an object,update the customer
							let uploadRes = await this.UploadProductImage(formdata)
							if (uploadRes.status === 'okay') {
								//create object
								let arrImages = []
								for (let idx = 0; idx < uploadRes.files.length; idx++) {
									let filename = '/uploads/images/' + uploadRes.files[idx].filename
									arrImages.push(filename)
								}

								let payload = {
									images: arrImages.join(','),
									product_id: resp.data.product_id
								}

								//update product images
								let updateRes = await this.UpdateProductImages(payload)
								if (updateRes.status === 'ok') {
									this.CloseProductFormModal()
									this.LoadAsyncData()
								}
							}
						} else {
							this.CloseProductFormModal()
							this.LoadAsyncData()
						}
					}
				}
			},

			async UpdateProductForm() {
				// const success = await this.$refs.form.validate();
				// if (!success) {
				//   return
				// }

				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>Update</b> this product? This action cannot be undone. Kindly double check the details before confirming.',
					confirmText: 'Confirm Action',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					const resp = await this.UpdateProduct(this.form_product)
					if (resp.status === 'ok') {
						this.CloseProductFormModal()
						this.LoadAsyncData()
					}
				}
			},

			async UpdateProductPrice() {
				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>update</b> this product prices? This action cannot be undone. Kindly double check the details before confirming.',
					confirmText: 'Confirm Action',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					const resp = await this.UpdateProductPricing(this.form_product)
					if (resp.status === 'ok') {
						this.CloseProductFormModal()
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

				const products = await this.GetProducts(params)

				this.products = []
				this.products = this.$clearReactive(products.data.results)
				this.totalDataCount = products.data.total

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

				// let formattedDate = null
				// if (this.filterDate) {
				// 	formattedDate = dayjs(this.filterDate).format('YYYY-MM-DD')
				// }

				// this.filters.push({ field: 'transaction_date', value: formattedDate, type: 'like' })
				this.filters.push({ field: 'name', value: this.filterName, type: 'like' })
				this.filters.push({ field: 'product_code', value: this.filterCode, type: 'like' })

				this.LoadAsyncData()
			},

			FilterByName(value) {
				this.searchDebounce(this)
			},

			FilterByCode(value) {
				this.searchDebounce(this)
			},

			searchDebounce: debounce((vm) => {
				vm.onFilterData()
			}, 500),

			async BulkPriceUpdate() {
				const { result, dialog } = await this.$buefy.dialog.confirm({
					message: 'Are you sure you want to <b>Update</b> this Products? This action cannot be undone.',
					confirmText: 'Bulk Update Products',
					type: 'is-danger',
					hasIcon: true,
					closeOnConfirm: true
				})

				if (result) {
					const res = await this.BulkUpdateProductPricing(this.products)
					if (res.status === 'ok') {
						this.LoadAsyncData()
					}
				}
			},

			async CheckFileCounts() {
				for (var i = 0; i < this.files.length; i++) {
					this.imageFiles.push({
						name: this.files[i].name,
						src: await this.ReadURL(this.files[i]),
						file: this.files[i]
					})
				}

				this.files = []

				// if (this.files.length > 3) {
				// 	alert('Only maximum of 3 images area allowed.')
				// 	this.files = []
				// 	this.imageFiles = []
				// } else {
				// 	// allow

				// 	// read and convert here

				// 	//iterate
				// 	for (var i = 0; i < this.files.length; i++) {
				// 		this.imageFiles.push({
				// 			name: this.files[i].name,
				// 			src: await this.ReadURL(this.files[i]),
				// 			file: this.files[i]
				// 		})
				// 	}
				// }
			},

			deleteDropFile(index) {
				this.imageFiles.splice(index, 1)
			},

			ReadURL(file) {
				return new Promise((res, rej) => {
					const reader = new FileReader()
					reader.onload = (e) => res(e.target.result)
					reader.onerror = (e) => rej(e)
					reader.readAsDataURL(file)
				})
			}
		},

		mounted() {
			this.LoadAsyncData()

			this.GetBrands()
			this.GetCategories()
			this.GetColors()
			this.GetDivisions()
			this.GetTypes()
			this.GetUnits()
		}
	}
</script>

<style scoped>
	.wrapper-h {
		height: calc(100vh - 125px);
	}
</style>
