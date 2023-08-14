<template>
	<div>

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">

			<h3 class="has-text-header">Product Subdata</h3>
			<div class="flex items-center">
				<b-button type="is-primary" icon-left="plus" class="is-small text-white" @click="NewForm">New</b-button>
				<b-button type="is-primary" icon-left="playlist-edit" class="is-small ml-1" @click="EditForm">Edit</b-button>
				<b-button type="is-danger" icon-left="delete" class="is-small ml-1">Delete</b-button>
			</div>

		</div>

		<div class="grid grid-cols-8 gap-4 p-4">

			<div class="col-span-8">

				<b-tabs type="is-boxed" size="is-small" v-model="selected_tab">

					<b-tab-item label="Brands" class="wrapper-h-tab">
						<div class="w-full text-sm p-2">
							<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="14" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :selected.sync="selected_brand" :data="brands">

								<template slot="top-left">
								</template>

								<template v-for="column in tbl_brands_columns">
									<b-table-column :key="column.id" v-bind="column">
										<template v-if="column.searchable && !column.numeric" slot="searchable" slot-scope="props">
											<b-input v-model="props.filters[props.column.field]" placeholder="Search..." icon="magnify" size="is-small" />
										</template>
										<template v-slot="props">
											{{ props.row[column.field] }}
										</template>
									</b-table-column>
								</template>

							</b-table>
						</div>
					</b-tab-item>

					<b-tab-item label="Categories" class="wrapper-h-tab">
						<div class="w-full text-sm p-2">
							<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="14" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :selected.sync="selected_category" :data="categories">

								<template slot="top-left">
								</template>

								<b-table-column label="Category" searchable>
									<template slot="searchable" slot-scope="props">
										<b-input v-model="props.filters['name']" placeholder="Search..." icon="magnify" size="is-small" />
									</template>
									<template v-slot="props">
										{{ props.row.name }}
									</template>
								</b-table-column>

								<b-table-column v-slot="props" label="Description">
									{{ props.row.description }}
								</b-table-column>

								<b-table-column label="Division" searchable>
									<template slot="searchable" slot-scope="props">
										<b-input v-model="props.filters['division.name']" placeholder="Search..." icon="magnify" size="is-small" />
									</template>
									<template v-slot="props">
										{{ props.row.division.name }}
									</template>

								</b-table-column>

								<b-table-column v-slot="props" label="Status">
									{{ props.row.status }}
								</b-table-column>

							</b-table>
						</div>
					</b-tab-item>

					<b-tab-item label="Colors" class="wrapper-h-tab">
						<div class="w-full text-sm p-2">
							<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="14" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :selected.sync="selected_color" :data="colors">

								<template slot="top-left">
								</template>

								<template v-for="column in tbl_colors_columns">
									<b-table-column :key="column.id" v-bind="column">
										<template v-if="column.searchable && !column.numeric" slot="searchable" slot-scope="props">
											<b-input v-model="props.filters[props.column.field]" placeholder="Search..." icon="magnify" size="is-small" />
										</template>
										<template v-slot="props">
											{{ props.row[column.field] }}
										</template>
									</b-table-column>
								</template>

							</b-table>
						</div>
					</b-tab-item>

					<b-tab-item label="Divisions" class="wrapper-h-tab">
						<div class="w-full text-sm p-2">
							<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :selected.sync="selected_division" :data="divisions" :columns="tbl_divisions_columns">

							</b-table>
						</div>
					</b-tab-item>

					<b-tab-item label="Types" class="wrapper-h-tab">
						<div class="w-full text-sm p-2">
							<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="14" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :selected.sync="selected_type" :data="types">

								<template slot="top-left">
								</template>
								<template v-for="column in tbl_types_columns">
									<b-table-column :key="column.id" v-bind="column">
										<template v-if="column.searchable && !column.numeric" slot="searchable" slot-scope="props">
											<b-input v-model="props.filters[props.column.field]" placeholder="Search..." icon="magnify" size="is-small" />
										</template>
										<template v-slot="props">
											{{ props.row[column.field] }}
										</template>
									</b-table-column>
								</template>

							</b-table>
						</div>
					</b-tab-item>

					<b-tab-item label="Units" class="wrapper-h-tab">
						<div class="w-full text-sm p-2">
							<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="14" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :selected.sync="selected_unit" :data="units">

								<template slot="top-left">
								</template>

								<template v-for="column in tbl_units_columns">
									<b-table-column :key="column.id" v-bind="column">
										<template v-if="column.searchable && !column.numeric" slot="searchable" slot-scope="props">
											<b-input v-model="props.filters[props.column.field]" placeholder="Search..." icon="magnify" size="is-small" />
										</template>
										<template v-slot="props">
											{{ props.row[column.field] }}
										</template>
									</b-table-column>
								</template>

							</b-table>
						</div>
					</b-tab-item>

				</b-tabs>

			</div>

		</div>

		<b-modal :active.sync="isModalFormShow" has-modal-card trap-focus :width="1000" @close="CloseFormModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1000px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-semibold text-white">{{ this.formName }}</p>
					<div>
						<a href="#" @click.prevent="CloseFormModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div v-if="isShowBrandForm" class="flex">
						<b-field label="Brand Name" custom-class="text-xs" class="w-64 mr-4">
							<b-input size='is-small' type="text" v-model="form_brand.brandname"></b-input>
						</b-field>
						<b-field label="Status" custom-class="text-xs">
							<b-switch v-model="form_brand.status" true-value="Active" false-value="Inactive" size="is-small">{{ form_brand.status }}</b-switch>
						</b-field>

					</div>

					<div v-if="isShowCategoryForm">
						<b-field label="Category Name" custom-class="text-xs">
							<b-input size='is-small' type="text" v-model="form_category.name"></b-input>
						</b-field>
						<b-field label="Description" custom-class="text-xs">
							<b-input size='is-small' type="text" v-model="form_category.description"></b-input>
						</b-field>
						<b-field label="Division" custom-class="text-xs">
							<!-- <b-input size='is-small' type="text" v-model="form_category.division_ref_id"></b-input> -->
							<b-select placeholder="Select division" size='is-small' expanded v-model="form_category.division_ref_id">
								<option v-for="div in divisions" :value="div.id" :key="div.id">
									{{ div.name }}
								</option>
							</b-select>
						</b-field>
						<b-field label="Status" custom-class="text-xs">
							<b-switch v-model="form_category.status" true-value="Active" false-value="Inactive" size="is-small">{{ form_category.status }}</b-switch>
						</b-field>
					</div>

					<div v-if="isShowColorForm">
						<b-field label="Color" custom-class="text-xs">
							<b-input size='is-small' type="text" v-model="form_color.color"></b-input>
						</b-field>
						<b-field label="Status" custom-class="text-xs">
							<b-switch v-model="form_color.status" true-value="Active" false-value="Inactive" size="is-small">{{ form_color.status }}</b-switch>
						</b-field>
					</div>

					<div v-if="isShowDivisionForm">
						<b-field label="Name" custom-class="text-xs">
							<b-input size='is-small' type="text" v-model="form_division.name"></b-input>
						</b-field>
						<b-field label="Description" custom-class="text-xs">
							<b-input size='is-small' type="text" v-model="form_division.description"></b-input>
						</b-field>
					</div>

					<div v-if="isShowTypeForm">
						<b-field label="Type" custom-class="text-xs">
							<b-input size='is-small' type="text" v-model="form_type.item_type"></b-input>
						</b-field>
						<b-field label="Description" custom-class="text-xs">
							<b-input size='is-small' type="text" v-model="form_type.description"></b-input>
						</b-field>
						<b-field label="Category" custom-class="text-xs">
							<!-- <b-input size='is-small' type="text" v-model="form_type.category_id"></b-input> -->
							<b-select placeholder="Select category" size='is-small' expanded v-model="form_type.category_id">
								<option v-for="cat in categories" :value="cat.id" :key="cat.id">
									{{ cat.name }}
								</option>
							</b-select>
						</b-field>
						<b-field label="Status" custom-class="text-xs">
							<b-switch v-model="form_type.status" true-value="Active" false-value="Inactive" size="is-small">{{ form_type.status }}</b-switch>
						</b-field>
					</div>

					<div v-if="isShowUnitForm">
						<b-field label="Item Unit" custom-class="text-xs">
							<b-input size='is-small' type="text" v-model="form_unit.item_unit"></b-input>
						</b-field>
						<b-field label="Selling Unit" custom-class="text-xs">
							<b-input size='is-small' type="text" v-model="form_unit.selling_unit"></b-input>
						</b-field>

						<b-field label="SKU" custom-class="text-xs">
							<b-input size='is-small' type="text" v-model="form_unit.sku"></b-input>
						</b-field>
						<b-field label="SKU Quantity" custom-class="text-xs">
							<b-input size='is-small' type="text" v-model="form_unit.sku_item_qty"></b-input>
						</b-field>
						<b-field label="status" custom-class="text-xs">
							<!-- <b-input size='is-small' type="text" v-model="form_unit.status"></b-input> -->
							<b-switch v-model="form_unit.status" true-value="Active" false-value="Inactive" size="is-small">{{ form_unit.status }}</b-switch>
						</b-field>
					</div>

				</section>
				<footer class="modal-card-foot px-5 py-3">

					<div v-if="isShowBrandForm">
						<b-button v-if="isFormCreate" type="is-primary" icon-left="content-save-outline" class="is-small text-white" @click="SaveBrandForm">Save Brand</b-button>
						<b-button v-if="!isFormCreate" type="is-primary" icon-left="update" class="is-small text-white" @click="UpdateBrandForm">Update Brand</b-button>
						<b-button class="is-small">Clear</b-button>
					</div>

					<div v-if="isShowCategoryForm">
						<b-button v-if="isFormCreate" type="is-primary" icon-left="content-save-outline" class="is-small text-white" @click="SaveCategoryForm">Save Category</b-button>
						<b-button v-if="!isFormCreate" type="is-primary" icon-left="update" class="is-small text-white" @click="UpdateCategoryForm">Update Category</b-button>
						<b-button class="is-small">Clear</b-button>
					</div>

					<div v-if="isShowColorForm">
						<b-button v-if="isFormCreate" type="is-primary" icon-left="content-save-outline" class="is-small text-white" @click="SaveColorForm">Save Color</b-button>
						<b-button v-if="!isFormCreate" type="is-primary" icon-left="update" class="is-small text-white" @click="UpdateColorForm">Update Color</b-button>
						<b-button class="is-small">Clear</b-button>
					</div>

					<div v-if="isShowDivisionForm">
						<b-button v-if="isFormCreate" type="is-primary" icon-left="content-save-outline" class="is-small text-white" @click="SaveDivisionForm">Save Division</b-button>
						<b-button v-if="!isFormCreate" type="is-primary" icon-left="update" class="is-small text-white" @click="UpdateDivisionForm">Update Division</b-button>
						<b-button class="is-small">Clear</b-button>
					</div>

					<div v-if="isShowTypeForm">
						<b-button v-if="isFormCreate" type="is-primary" icon-left="content-save-outline" class="is-small text-white" @click="SaveTypeForm">Save Type</b-button>
						<b-button v-if="!isFormCreate" type="is-primary" icon-left="update" class="is-small text-white" @click="UpdateTypeForm">Update Type</b-button>
						<b-button class="is-small">Clear</b-button>
					</div>

					<div v-if="isShowUnitForm">
						<b-button v-if="isFormCreate" type="is-primary" icon-left="content-save-outline" class="is-small text-white" @click="SaveUnitForm">Save Unit</b-button>
						<b-button v-if="!isFormCreate" type="is-primary" icon-left="update" class="is-small text-white" @click="UpdateUnitForm">Update Unit</b-button>
						<b-button class="is-small">Clear</b-button>
					</div>
				</footer>

			</div>
		</b-modal>

	</div>
</template>

<script>
	import { mapMutations, mapGetters, mapActions } from 'vuex'

	export default {
		name: 'MasterdataProductPage',

		components: {},
		meta: {
			module: 'setup-products-sub'
		},

		computed: {
			...mapGetters({
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
				tbl_brands_columns: [
					{ field: 'brandname', label: 'Brand Name', width: '250', sortable: true, searchable: true },
					{ field: 'status', label: 'Status', searchable: true }
				],

				tbl_categories_columns: [
					{ field: 'name', label: 'Name', width: '150', sortable: true, searchable: true },
					{ field: 'description', label: 'Description', width: '150' },
					{ field: 'division.name', label: 'Division', width: '40' },
					{ field: 'status', label: 'Status', width: '40', searchable: true }
				],

				tbl_colors_columns: [
					{ field: 'color', label: 'Color', width: '150', sortable: true, searchable: true },
					{ field: 'status', label: 'Status' }
				],

				tbl_divisions_columns: [
					{ field: 'name', label: 'Name', width: '150', sortable: true },
					{ field: 'description', label: 'Description' }
				],

				tbl_types_columns: [
					{ field: 'item_type', label: 'Item Type', width: '150', sortable: true, searchable: true },
					{ field: 'description', label: 'Description', width: '150', sortable: true },
					{ field: 'category_id', label: 'Category Ref', width: '40' },
					{ field: 'status', label: 'Status', width: '40', searchable: true }
				],

				tbl_units_columns: [
					{ field: 'item_unit', label: 'Unit', width: '150', sortable: true, searchable: true },
					{ field: 'selling_unit', label: 'Selling Unit', width: '150', sortable: true, searchable: true },
					{ field: 'sku', label: 'SKU', width: '40' },
					{ field: 'sku_item_qty', label: 'SKU Quantity', width: '40' },
					{ field: 'status', label: 'Status', width: '40', searchable: true }
				],

				selected_brand: {},
				selected_category: {},
				selected_color: {},
				selected_division: {},
				selected_type: {},
				selected_unit: {},

				form_brand: {
					id: null,
					brandname: null,
					status: null
				},

				form_category: {
					id: null,
					name: null,
					description: null,
					division_ref_id: null,
					status: null
				},

				form_color: {
					id: null,
					color: null,
					status: null
				},

				form_division: {
					id: null,
					name: null,
					description: null
				},

				form_type: {
					id: null,
					item_type: null,
					description: null,
					category_id: null,
					status: null
				},

				form_unit: {
					id: null,
					item_unit: null,
					selling_unit: null,
					sku: null,
					sku_item_qty: null,
					status: null
				},

				formName: null,

				isFormCreate: false,
				selected_tab: null,
				isFormSidebarShow: false,
				isModalFormShow: false,

				isShowBrandForm: false,
				isShowCategoryForm: false,
				isShowColorForm: false,
				isShowDivisionForm: false,
				isShowTypeForm: false,
				isShowUnitForm: false
			}
		},

		methods: {
			...mapActions({
				GetBrands: 'masterdatas/GetBrands',
				GetCategories: 'masterdatas/GetCategories',
				GetColors: 'masterdatas/GetColors',
				GetDivisions: 'masterdatas/GetDivisions',
				GetTypes: 'masterdatas/GetTypes',
				GetUnits: 'masterdatas/GetUnits',

				InsertBrand: 'masterdatas/InsertBrand',
				UpdateBrand: 'masterdatas/UpdateBrand',

				InsertCategory: 'masterdatas/InsertCategory',
				UpdateCategory: 'masterdatas/UpdateCategory',

				InsertColor: 'masterdatas/InsertColor',
				UpdateColor: 'masterdatas/UpdateColor',

				InsertDivision: 'masterdatas/InsertDivision',
				UpdateDivision: 'masterdatas/UpdateDivision',

				InsertType: 'masterdatas/InsertType',
				UpdateType: 'masterdatas/UpdateType',

				InsertUnit: 'masterdatas/InsertUnit',
				UpdateUnit: 'masterdatas/UpdateUnit'
			}),

			...mapMutations({}),

			NewForm() {
				this.isFormCreate = true

				switch (this.selected_tab) {
					case 0:
						//show brand form
						this.$setObjectPropNull(this.form_brand, null)
						this.form_brand.status = 'Active'
						this.formName = 'Brand Form'
						this.isShowBrandForm = true
						break

					case 1:
						//show categories form
						this.$setObjectPropNull(this.form_category, null)
						this.form_category.status = 'Active'
						this.formName = 'Category Form'
						this.isShowCategoryForm = true
						break

					case 2:
						//show colors form
						this.$setObjectPropNull(this.form_color, null)
						this.form_color.status = 'Active'
						this.formName = 'Color Form'
						this.isShowColorForm = true
						break

					case 3:
						//show divisions form
						this.$setObjectPropNull(this.form_division, null)
						this.formName = 'Division Form'
						this.isShowDivisionForm = true
						break

					case 4:
						//show types form
						this.$setObjectPropNull(this.form_type, null)
						this.form_type.status = 'Active'
						this.formName = 'Type Form'
						this.isShowTypeForm = true
						break

					case 5:
						//show units form
						this.$setObjectPropNull(this.form_unit, null)
						this.form_unit.status = 'Active'
						this.formName = 'Unit Form'
						this.isShowUnitForm = true
						break

					default:
						break
				}

				this.isModalFormShow = true
			},

			EditForm() {
				this.isFormCreate = false

				switch (this.selected_tab) {
					case 0:
						//show product form
						this.form_brand = this.$clearReactive(this.selected_brand)
						this.formName = 'Brand Form'
						this.isShowBrandForm = true
						break

					case 1:
						//show categories form
						this.form_category = this.$clearReactive(this.selected_category)
						this.formName = 'Category Form'
						this.isShowCategoryForm = true
						break

					case 2:
						//show colors form
						this.form_color = this.$clearReactive(this.selected_color)
						this.formName = 'Color Form'
						this.isShowColorForm = true
						break

					case 3:
						//show divisions form
						this.form_division = this.$clearReactive(this.selected_division)
						this.formName = 'Division Form'
						this.isShowDivisionForm = true
						break

					case 4:
						//show types form
						this.form_type = this.$clearReactive(this.selected_type)
						this.formName = 'Type Form'
						this.isShowTypeForm = true
						break

					case 5:
						//show units form
						this.form_unit = this.$clearReactive(this.selected_unit)
						this.formName = 'Unit Form'
						this.isShowUnitForm = true
						break

					default:
						break
				}

				this.isModalFormShow = true
			},

			CloseFormModal() {
				this.isModalFormShow = false

				this.isShowBrandForm = false
				this.isShowCategoryForm = false
				this.isShowColorForm = false
				this.isShowDivisionForm = false
				this.isShowTypeForm = false
				this.isShowUnitForm = false
			},

			//Brands

			async SaveBrandForm() {
				// const success = await this.$refs.form.validate();
				// if (!success) {
				//   return
				// }

				//console.log(this.form_brand)

				const resp = await this.InsertBrand(this.form_brand)
				if (resp.status === 'ok') {
					this.CloseFormModal()
				}
			},

			async UpdateBrandForm() {
				// const success = await this.$refs.form.validate();
				// if (!success) {
				//   return
				// }

				const resp = await this.UpdateBrand(this.form_brand)
				if (resp.status === 'ok') {
					this.CloseFormModal()
				}
			},

			//Categories

			async SaveCategoryForm() {
				// const success = await this.$refs.form.validate();
				// if (!success) {
				//   return
				// }

				const resp = await this.InsertCategory(this.form_category)
				if (resp.status === 'ok') {
					this.CloseFormModal()
				}
			},

			async UpdateCategoryForm() {
				// const success = await this.$refs.form.validate();
				// if (!success) {
				//   return
				// }

				const resp = await this.UpdateCategory(this.form_category)
				if (resp.status === 'ok') {
					this.CloseFormModal()
				}
			},

			//Color

			async SaveColorForm() {
				// const success = await this.$refs.form.validate();
				// if (!success) {
				//   return
				// }

				const resp = await this.InsertColor(this.form_color)
				if (resp.status === 'ok') {
					this.CloseFormModal()
				}
			},

			async UpdateColorForm() {
				// const success = await this.$refs.form.validate();
				// if (!success) {
				//   return
				// }

				const resp = await this.UpdateColor(this.form_color)
				if (resp.status === 'ok') {
					this.CloseFormModal()
				}
			},

			//Division

			async SaveDivisionForm() {
				// const success = await this.$refs.form.validate();
				// if (!success) {
				//   return
				// }

				const resp = await this.InsertDivision(this.form_division)
				if (resp.status === 'ok') {
					this.CloseFormModal()
				}
			},

			async UpdateDivisionForm() {
				// const success = await this.$refs.form.validate();
				// if (!success) {
				//   return
				// }

				const resp = await this.UpdateDivision(this.form_division)
				if (resp.status === 'ok') {
					this.CloseFormModal()
				}
			},

			//Type

			async SaveTypeForm() {
				// const success = await this.$refs.form.validate();
				// if (!success) {
				//   return
				// }

				const resp = await this.InsertType(this.form_type)
				if (resp.status === 'ok') {
					this.CloseFormModal()
				}
			},

			async UpdateTypeForm() {
				// const success = await this.$refs.form.validate();
				// if (!success) {
				//   return
				// }

				const resp = await this.UpdateType(this.form_type)
				if (resp.status === 'ok') {
					this.CloseFormModal()
				}
			},

			//Unit

			async SaveUnitForm() {
				// const success = await this.$refs.form.validate();
				// if (!success) {
				//   return
				// }

				const resp = await this.InsertUnit(this.form_unit)
				if (resp.status === 'ok') {
					this.CloseFormModal()
				}
			},

			async UpdateUnitForm() {
				// const success = await this.$refs.form.validate();
				// if (!success) {
				//   return
				// }

				const resp = await this.UpdateUnit(this.form_unit)
				if (resp.status === 'ok') {
					this.CloseFormModal()
				}
			}
		},

		mounted() {
			this.GetBrands()
			this.GetCategories()
			this.GetColors()
			this.GetDivisions()
			this.GetTypes()
			this.GetUnits()
			// this.GetProducts()

			this.selected_tab = 0
		}
	}
</script>

<style scoped>
	.wrapper-h-tab {
		height: calc(100vh - 170px);
	}
</style>
