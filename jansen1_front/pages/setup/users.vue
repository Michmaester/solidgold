<template>
	<div>

		<div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">

			<h3 class="has-text-header">User Management</h3>
			<div class="flex">
				<b-button type="is-primary" size="is-small" class="mr-1" @click="ShowRolesPermissions">Roles & Permissions</b-button>
				<div class="flex items-center">
					<b-dropdown aria-role="list" position="is-bottom-left">
						<b-button type="is-primary" size="is-small" slot="trigger" slot-scope="{ active }">
							<span>Actions</span>
							<b-icon size="is-small" :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
						</b-button>

						<b-dropdown-item class="text-xs" aria-role="listitem">User Information</b-dropdown-item>
						<b-dropdown-item class="text-xs" aria-role="listitem">Other action</b-dropdown-item>
					</b-dropdown>
				</div>
			</div>

		</div>

		<div class="grid grid-cols-8 gap-4 p-4 has-background-pageheader">

			<div class="col-span-8 wrapper-h bg-white">

				<!-- main table -->
				<div class="text-sm p-2">
					<b-table :bordered="false" :striped="true" :narrowed="true" :hoverable="true" :loading="false" sort-icon="arrow-up" sort-icon-size="is-small" :paginated="true" :per-page="10" current-page.sync="1" :pagination-simple="false" :pagination-position="'top'" pagination-size="is-small" :selected.sync="selected_user" @select="SelectedUser" :data="users_data">

						<template slot="top-left">
							<div>
								<b-field>
									<b-input placeholder="Search username" type="search" v-model="search_user" @input="ClearSearchUser" :icon-right-clickable="true" size="is-small" icon="magnify">
									</b-input>
									<p class="control">
										<b-button type="is-primary" size="is-small" @click="SearchUser">Search</b-button>
									</p>
								</b-field>
							</div>
						</template>

						<b-table-column label="Username" v-slot="props">
							<p class="cursor-pointer underline font-bold hover:text-blue-500" @click="ShowDetailsModal">{{ props.row.username }}</p>
						</b-table-column>

						<b-table-column label="Fullname" v-slot="props">
							<p class="cursor-pointer underline font-bold hover:text-blue-500" @click="ShowDetailsModal">{{ props.row.fullname }}</p>
						</b-table-column>

						<b-table-column label="Position" v-slot="props">
							{{ props.row.position }}
						</b-table-column>

						<b-table-column label="Department" v-slot="props">
							{{ props.row.department }}
						</b-table-column>

						<b-table-column label="Role" v-slot="props">
							{{ props.row.role }}
						</b-table-column>

						<b-table-column label="Status" v-slot="props">
							{{ props.row.status }}
						</b-table-column>

						<b-table-column label="Last Login" v-slot="props">
							{{ props.row.last_login }}
						</b-table-column>

					</b-table>
				</div>

			</div>

		</div>

		<b-modal :active.sync="isModalRolesPermShow" has-modal-card trap-focus :width="1200" @close="CloseRolesPermModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 1200px">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-bold text-white">Roles & Permissions</p>
					<div>
						<a href="#" @click.prevent="CloseRolesPermModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>

				<header class="px-5 py-2 has-background-pageheader border-b border-gray-200">
					<div class="flex items-center justify-between">

						<div class="flex">
							<b-field>
								<template v-for="(role,idx) in rolelist">

									<b-radio-button :key="idx" size="is-small" v-model="selected_role.role_id" :native-value="role.role_id" type="is-primary" @input="ChangeRole">
										<span>{{ role.role }}</span>
									</b-radio-button>

								</template>
							</b-field>
						</div>

						<b-button type="is-success" size="is-small" class="font-bold px-10" icon-left="content-save-outline" @click="SaveRolePermSettings">Update Permissions</b-button>

					</div>
				</header>
				<section class="modal-card-body app-modal-form">

					<div class="flex flex-col">

						<div class="text-sm w-full">

							<b-table :striped="true" :narrowed="true" :hoverable="true" sort-icon="arrow-up" sort-icon-size="is-small" :data="form_roleperms">

								<b-table-column label="Module / Sub-Module" v-slot="props" width="200">
									<p v-if="props.row.submod_name != null" class="ml-2">{{ props.row.submod_name}}</p>
									<p v-else class="font-bold">{{ props.row.mod_name }}</p>
								</b-table-column>

								<b-table-column label="Permissions" v-slot="props">

									<div v-if="props.row.hasOwnProperty('permissions')" class="block">
										<template v-for="(item,idx) in props.row.permissions">
											<b-checkbox class="w-48" v-model="item.enabled" :native-value="item.perm_name" :key="idx">{{ item.perm_name }}</b-checkbox>
										</template>
									</div>
									<div v-else>
										<b-checkbox v-model="props.row.enabled" :native-value="props.row.perm_name">{{ props.row.perm_name }}</b-checkbox>
									</div>

								</b-table-column>

							</b-table>

						</div>

					</div>

				</section>

			</div>
		</b-modal>

		<b-modal :active.sync="isModalDetailsShow" has-modal-card trap-focus :width="900" @close="CloseDetailsModal" :destroy-on-hide="false">

			<div class="modal-card" style="width: 900px;">

				<header class="modal-card-head p-5 has-background-primary">
					<p class="modal-card-title text-base font-semibold text-white">User Information</p>
					<div>
						<a href="#" @click.prevent="CloseDetailsModal">
							<b-icon icon="close" size="is-medium" class="hover:text-gray-800"></b-icon>
						</a>
					</div>
				</header>

				<section class="modal-card-body app-modal-form">

					<div class="flex">
						<!-- <div class="w-1/2">
							<p>Fullname :<span class="font-bold">{{ selected_user.fullname }}</span></p>
							<p>Username <span class="font-bold">{{ selected_user.username }}</span></p>
						</div> -->
						<!-- <div class="w-1/2">
							<p>Total Amount <span class="font-bold">{{ selected_purchase_order.total_amount }}</span></p>
							<p v-if="selected_purchase_order.supplier_id != null">Supplier <span class="font-bold">{{ selected_purchase_order.supplier.name }}</span></p>
						</div> -->

						<div class="w-1/2 mr-2">
							<b-field label="Username" custom-class="font-semibold text-sm">
								<b-input v-model="form_user.username" size="is-small" placeholder="Username" class="shadow-sm"></b-input>
							</b-field>

							<b-field label="Password" custom-class="font-semibold text-sm rounded">
								<b-input v-model="form_user.password" size="is-small" type="password" password-reveal placeholder="***" class="shadow-sm"></b-input>
							</b-field>

							<div class="flex">
								<b-field label="Status" custom-class="text-xs">
									<b-switch v-model="form_user.status" true-value="Active" false-value="Inactive" size="is-small" class="w-32 mt-2">{{ form_user.status }}</b-switch>
								</b-field>
								<b-field label="Role" custom-class="font-semibold text-sm rounded" class="w-full">
									<b-select placeholder="Select a role" size="is-small" v-model="form_user.role" expanded>
										<option v-for="role in roles" :value="role.role" :key="role.id">
											{{ role.role }}
										</option>
									</b-select>
								</b-field>
							</div>

						</div>

						<div class="w-1/2 ml-2">
							<b-field label="Fullname" custom-class="font-semibold text-sm">
								<b-input v-model="form_user.fullname" size="is-small" placeholder="Fullname" class="shadow-sm"></b-input>
							</b-field>

							<b-field label="Position" custom-class="font-semibold text-sm">
								<b-input v-model="form_user.position" size="is-small" placeholder="Position" class="shadow-sm"></b-input>
							</b-field>

							<b-field label="Department" custom-class="font-semibold text-sm">
								<b-input v-model="form_user.department" size="is-small" placeholder="Department" class="shadow-sm"></b-input>
							</b-field>
						</div>

					</div>

				</section>

				<footer class="modal-card-foot p-5">
					<b-button type="is-primary" size="is-small" @click="UpdateUserInfo" icon-left="content-save">Update User Information</b-button>
				</footer>

			</div>
		</b-modal>

	</div>
</template>

<script>
	import { mapActions, mapMutations, mapGetters } from 'vuex'

	export default {
		components: {},
		meta: {
			module: 'setup-users'
		},

		computed: {
			...mapGetters({
				users: 'administration/getUsers',
				roles: 'administration/getRoles',
				rolePermissions: 'administration/getRolePermissions'
			})
		},

		watch: {
			users(newValue, oldValue) {
				this.users_data = newValue
			}
		},

		data() {
			return {
				// tbl_users_columns: [
				// 	{ field: 'username', label: 'Username', sortable: true },
				// 	{ field: 'fullname', label: 'Fullname' },
				// 	{ field: 'position', label: 'Position', sortable: true },
				// 	{ field: 'department', label: 'Department', sortable: true },
				// 	{ field: 'role', label: 'Role' }
				// ],

				users_data: [],
				search_user: null,
				selected_user: {},

				selected_role: {},
				rolelist: [],
				form_roleperms: [],

				checkboxGroup: [],

				isModalDetailsShow: false,
				isModalRolesPermShow: false,

				form_user: {
					id: null,
					username: null,
					password: null,
					fullname: null,
					position: null,
					department: null,
					role: null,
					status: null
				}
			}
		},

		methods: {
			...mapActions({
				GetUsers: 'administration/GetUsers',
				GetRoles: 'administration/GetRoles',
				GetRolePermissions: 'administration/GetRolePermissions',
				UpdateRolePermissions: 'administration/UpdateRolePermissions',
				UpdateUserInformation: 'administration/UpdateUserInformation'
			}),

			...mapMutations({}),

			SelectedUser(data) {
				this.selected_user = this.$clearReactive(data)
				this.form_user = this.selected_user
				this.form_user.password = null
			},

			SearchUser() {
				if (this.search_user) {
					this.users_data = this.users.filter((item) => {
						return item.username.toLowerCase().includes(this.search_user.toLowerCase())
					})
					//console.log(this.search_user)
				}
			},

			ClearSearchUser() {
				if (!this.search_user) {
					this.users_data = this.users
				}
				//console.log(event)
				//this.users_data = this.users
			},

			ShowDetailsModal() {
				this.isModalDetailsShow = true
			},

			CloseDetailsModal() {
				this.isModalDetailsShow = false
			},

			ShowRolesPermModal() {
				this.isModalRolesPermShow = true
			},

			CloseRolesPermModal() {
				this.isModalRolesPermShow = false
			},

			async ShowRolesPermissions() {
				//select a default role to display
				//admin = default
				this.selected_role = this.$clearReactive(
					this.roles.filter((item) => {
						return item.role === 'Administrator'
					})[0]
				)

				let result = await this.GetRolePermissions(this.selected_role)

				this.rolelist = this.$clearReactive(this.roles)
				this.form_roleperms = this.$clearReactive(result.data)
				this.isModalRolesPermShow = true
			},

			async ChangeRole(data) {
				let result = await this.GetRolePermissions(this.selected_role)
				this.form_roleperms = this.$clearReactive(result.data)
			},

			async SaveRolePermSettings() {
				const payload = {
					permissions: this.form_roleperms,
					role: this.selected_role
				}

				const res = await this.UpdateRolePermissions(payload)

				console.log(res)
			},

			async UpdateUserInfo() {
				console.log(this.form_user)
				const res = await this.UpdateUserInformation(this.form_user)
				if (res.status === 'ok') {
					this.GetUsers()
					this.CloseDetailsModal()
				}
			}
		},

		mounted() {
			this.GetUsers()
			this.GetRoles()
		}
	}
</script>

<style scoped>
	.wrapper-h {
		height: calc(100vh - 125px);
	}
</style>