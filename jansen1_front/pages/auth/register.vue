<template>
	<div class="flex h-screen auth-body">

		<div class="container mx-auto h-full flex justify-center items-center">

			<div class="w-full" style="width:600px;">

				<div class="bg-white shadow-lg rounded-sm px-8 pt-6 pb-4 mb-4">

					<a href="https://www.mecssolutions.com">
						<img src="@/assets/images/mecs.png" alt="" class="mt-2 mb-10 mx-auto mecs-logo">
					</a>

					<div class="grid grid-cols-8">

						<div class="col-span-4 mr-6">
							<b-field label="Username" custom-class="font-semibold text-sm">
								<b-input v-model="form_register.username" placeholder="Username" class="shadow-sm"></b-input>
							</b-field>

							<b-field label="Password" custom-class="font-semibold text-sm rounded">
								<b-input v-model="form_register.password" type="password" password-reveal placeholder="***" class="shadow-sm"></b-input>
							</b-field>

							<b-field label="Confirm Password" custom-class="font-semibold text-sm rounded">
								<b-input v-model="form_register.password_confirm" type="password" password-reveal placeholder="***" class="shadow-sm"></b-input>
							</b-field>
						</div>

						<div class="col-span-4">
							<b-field label="Fullname" custom-class="font-semibold text-sm">
								<b-input v-model="form_register.fullname" placeholder="Fullname" class="shadow-sm"></b-input>
							</b-field>

							<b-field label="Position" custom-class="font-semibold text-sm">
								<b-input v-model="form_register.position" placeholder="Position" class="shadow-sm"></b-input>
							</b-field>

							<b-field label="Department" custom-class="font-semibold text-sm">
								<b-input v-model="form_register.department" placeholder="Department" class="shadow-sm"></b-input>
							</b-field>
						</div>

					</div>

					<div class="flex items-center justify-between mt-10 text-sm">

						<nuxt-link :to="'/auth/login'" class="has-text-primary">Login here.</nuxt-link>
						<b-button @click.prevent="RegisterUser" type="is-primary" class="font-bold text-white px-6 rounded-sm">Register</b-button>

					</div>

				</div>

			</div>

		</div>

	</div>
</template>

<script>
	import { mapActions, mapMutations, mapGetters } from 'vuex'

	export default {
		name: 'RegisterPageComponent',
		layout: 'auth',
		auth: false,

		components: {},
		computed: mapGetters({}),

		data() {
			return {
				form_register: {
					username: null,
					password: null,
					password_confirm: null,
					fullname: null,
					position: null,
					department: null
				}
			}
		},

		methods: {
			...mapActions({
				RegisterNewUser: 'RegisterUser'
			}),

			...mapMutations({}),

			async RegisterUser() {
				const res = await this.RegisterNewUser(this.form_register)

				if (res.status == 'ok') {
					this.$setObjectPropNull(this.form_register, null)
					this.$notify({ group: 'app', title: res.data.title, text: res.data.message, type: 'success' })
				}

				// try {
				//     let response = await this.$auth.loginWith('local', { data: this.form_login })
				// } catch (err) {
				//
				// }
			}
		},

		mounted() {}
	}
</script>

<style scoped>
	.wrapper-h {
		height: calc(100vh - 125px);
	}
</style>