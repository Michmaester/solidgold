<template>
	<div>

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">

			<h3 class="has-text-header">MasterData - General</h3>
			<div class="flex items-center">
				<b-button :disabled="selected_tab == 0" type="is-primary" icon-left="plus" class="is-small text-white" @click="NewBankForm">New</b-button>
				<b-button :disabled="selected_tab == 0 && selected_bank.id === 'null'" type="is-primary" icon-left="playlist-edit" class="is-small ml-1" @click="EditBankForm">Edit</b-button>
			</div>

		</div>

		<div class="grid grid-cols-8 gap-4 p-4">

			<div class="col-span-8">
				<b-tabs type="is-boxed" size="is-small" v-model="selected_tab">

					<b-tab-item label="Company Branches" class="wrapper-h-tab">

						<div class="w-full text-sm p-2">
							<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :selected.sync="selected_branch" @select="SelectedBranch" :data="branches" :columns="tbl_branches_columns">

							</b-table>
						</div>

					</b-tab-item>

					<b-tab-item label="Banks" class="wrapper-h-tab">
						<div class="w-full text-sm p-2">
							<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="14" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :selected.sync="selected_bank" @select="SelectedBank" :data="banks">

								<template v-for="column in tbl_banks_columns">
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

					<!-- Temporary hold this feature -->
					<!-- <b-tab-item label="Passcodes" class="wrapper-h-tab">
						<div class="w-full text-sm p-2">
							<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="14" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :selected.sync="selected_bank" @select="SelectedBank" :data="banks">

							</b-table>
						</div>
					</b-tab-item> -->

				</b-tabs>
			</div>

		</div>

		<b-modal :active.sync="isModalFormShow" has-modal-card trap-focus :width="500" @close="CloseFormModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 500px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-semibold text-white">Bank Form</p>
					<div>
						<a href="#" @click.prevent="CloseFormModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div>
						<b-field label="Bank Name" custom-class="text-xs">
							<b-input size='is-small' type="text" v-model="form_bank.name"></b-input>
						</b-field>
						<b-field label="Branch Name" custom-class="text-xs">
							<b-input size='is-small' type="text" v-model="form_bank.branch_name"></b-input>
						</b-field>
						<b-field label="Branch Address" custom-class="text-xs">
							<b-input size='is-small' type="text" v-model="form_bank.branch_address"></b-input>
						</b-field>

					</div>

				</section>
				<footer class="modal-card-foot px-5 py-3">

					<b-button v-if="isFormCreate" type="is-primary" icon-left="content-save-outline" class="is-small text-white" @click="SaveBankForm">Save Bank</b-button>
					<b-button v-if="!isFormCreate" type="is-primary" icon-left="update" class="is-small text-white" @click="UpdateBankForm">Update Bank</b-button>

				</footer>

			</div>
		</b-modal>

	</div>
</template>

<script>
	import { mapMutations, mapGetters, mapActions } from 'vuex'

	export default {
		name: 'MasterdataGeneralPage',

		components: {},
		meta: {
			module: 'setup-general'
		},

		computed: {
			...mapGetters({
				branches: 'masterdatas/getBranches',
				banks: 'masterdatas/getBanks'
			})
		},

		data() {
			return {
				tbl_branches_columns: [
					{ field: 'branch_code', label: 'Branch Code', width: '150', sortable: true },
					{ field: 'name', label: 'Company Name', width: '150', sortable: true },
					{ field: 'address', label: 'Address', width: '40' }
				],

				tbl_banks_columns: [
					{ field: 'name', label: 'Bank', width: '150', sortable: true, searchable: true },
					{ field: 'branch_name', label: 'Branch', width: '150', sortable: true, searchable: true },
					{ field: 'branch_address', label: 'Address', width: '40' }
				],

				selected_branch: {},
				selected_bank: {},

				form_bank: {
					id: null,
					name: null,
					branch_name: null,
					branch_address: null
				},

				selected_tab: 0,
				isFormCreate: true,

				isModalFormShow: false
			}
		},

		methods: {
			...mapActions({
				GetBranches: 'masterdatas/GetBranches',
				GetBanks: 'masterdatas/GetBanks',

				InsertBank: 'masterdatas/InsertBank',
				UpdateBank: 'masterdatas/UpdateBank'
			}),

			...mapMutations({}),

			SelectedBranch(data) {
				this.selected_branch = data
			},

			SelectedBank(data) {
				this.selected_bank = data
			},

			CloseFormModal() {
				this.isModalFormShow = false
			},

			NewBankForm() {
				this.isFormCreate = true

				this.form_bank.id = null
				this.form_bank.name = null
				this.form_bank.branch_name = null
				this.form_bank.branch_address = null

				this.isModalFormShow = true
			},

			EditBankForm() {
				this.isFormCreate = false

				this.form_bank.id = this.selected_bank.id
				this.form_bank.name = this.selected_bank.name
				this.form_bank.branch_name = this.selected_bank.branch_name
				this.form_bank.branch_address = this.selected_bank.branch_address

				this.isModalFormShow = true
			},

			async SaveBankForm() {
				const res = await this.InsertBank(this.form_bank)

				if (res.status === 'ok') {
					this.CloseFormModal()
				}
			},

			async UpdateBankForm() {
				const res = await this.UpdateBank(this.form_bank)

				if (res.status === 'ok') {
					this.CloseFormModal()
				}
			}
		},

		mounted() {
			this.GetBranches()
			this.GetBanks()

			console.log(this.selected_bank)
		}
	}
</script>

<style scoped>
	.wrapper-h-tab {
		height: calc(100vh - 170px);
	}
</style>
