<template>
	<div class="flex h-screen auth-body">

		<div class="container mx-auto h-full flex justify-center items-center">

			<div class="w-full" style="width:350px;">

				<div class="bg-white shadow-lg rounded-sm px-8 pt-6 pb-4 mb-4">

					<a href="https://www.mecssolutions.com">
						<img src="@/assets/images/mecs.png" alt="" class="mt-2 mb-10 mx-auto mecs-logo">
					</a>

					<b-field label="Username" custom-class="font-semibold text-sm">
						<b-input v-model="form_login.username" placeholder="Username" class="shadow-sm"></b-input>
					</b-field>

					<b-field label="Password" custom-class="font-semibold text-sm rounded">
						<b-input v-model="form_login.password" type="password" password-reveal placeholder="***" class="shadow-sm"></b-input>
					</b-field>

					<b-field label="Branch" custom-class="text-sm">
						<b-select placeholder="Select branch" expanded v-model="selectedBranch">
							<option v-for="branch in branches" :value="branch" :key="branch.id">
								{{ branch.name }}
							</option>
						</b-select>
					</b-field>

					<div class="flex items-center justify-between mt-10 text-sm">

						<nuxt-link :to="'/auth/register'" class="has-text-primary">New user? Register</nuxt-link>
						<b-button @click.prevent="LoginUser" type="is-primary" class="font-bold text-white px-6 rounded-sm">Login</b-button>

					</div>

				</div>

			</div>

		</div>

	</div>
</template>

<script>
	import { mapActions, mapMutations, mapGetters } from 'vuex'

	export default {
		name: 'LoginPageComponent',
		layout: 'auth',

		components: {},
		computed: {
			...mapGetters({
				branches: 'masterdatas/getBranches'
			})
		},

		data() {
			return {
				form_login: {
					username: null,
					password: null
				},

				selectedBranch: {}
			}
		},

		methods: {
			...mapActions({
				AuthenticateUser: 'AuthenticateUser',
				GetBranches: 'masterdatas/GetBranches'
			}),

			...mapMutations({
				setSelectedBranch: 'setSelectedBranch'
			}),

			async LoginUser() {
				//chang async/await to promise on the logiwith method

				try {
					// set the selected branch to store and cookie
					this.setSelectedBranch(this.selectedBranch)

					this.$cookies.set('preferred-branch', this.selectedBranch, {
						path: '/',
						maxAge: 60 * 60 * 24 * 7
					})

					this.$axios.setHeader('XBranchCode', this.selectedBranch.branch_code)

					let response = await this.$auth.loginWith('local', { data: this.form_login })

					if (response.status == '200') {
						console.log(response.data.user.role)
						if (response.data.user.role === 'Sales') {
							this.$router.push({ name: 'salesfront' })
						}

						// Reload it so that the permissions can be applied
						// if no reload then user need to reload the page manually

						location.reload()
					} else {
						console.log('bad errooooooooooor')
					}
				} catch (err) {
					console.log(err)
				}
			}
		},

		mounted() {
			this.GetBranches()
		}
	}
</script>

<style scoped>
	.wrapper-h {
		height: calc(100vh - 125px);
	}
</style>