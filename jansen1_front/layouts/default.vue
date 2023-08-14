<template>
	<div>

		<nav class="header-wrapper has-background-header flex items-center justify-between px-4">

			<div class="flex items-center">
				<nuxt-link :to="'/'" class="w-64 mt-1">

					<!-- <img :src="require(`@/assets/images/${selectedBranch.branch_code.toLowerCase()}.jpg`)" alt="" class=""> -->
					<!-- <img :src="require(`../assets/images/sg.png`)" /> -->
					<img :src="`/${selectedBranch.branch_code.toLowerCase()}.png`" />
					<!-- <img :src="'@/assets/images/' + selectedBranch.branch_code.toLowerCase() + '.png'" alt="" class=""> -->
				</nuxt-link>

			</div>
			<div class="flex items-center">
				<div v-if="isTestMode" class="blink text-red-400">
					<p class="px-4 text-sm font-semibold">WARNING : You are on TEST MODE!!!</p>
				</div>
				<div>
					<p class="px-4 text-white text-sm">{{ selectedBranch.name }} [{{ selectedBranch.branch_code }}]</p>
				</div>

				<div class="flex items-center mx-4">
					<img src="@/assets/images/profiles/john-doe.jpg" alt="john-doe" class="w-8 rounded-full">
					<div class="px-2 leading-tight">
						<p class="has-text-primary font-semibold">{{ this.$auth.user.fullname }}</p>
						<p class="text-xs has-text-primary">{{ this.$auth.user.position }}</p>
					</div>
				</div>

				<b-button type="is-primary" rounded size="is-small" @click="LogoutUser" icon-left="logout-variant">Logout</b-button>
			</div>
		</nav>

		<section class="main-content columns is-marginless">

			<Navigation />

			<div class="column is-10 maincontent-wrapper p-0" id="scroll-maincontent">
				<!-- <simplebar class="testb" data-simplebar-auto-hide="false"> -->
				<nuxt />
				<!-- </simplebar> -->

			</div>
		</section>

		<div v-show="isLoading" id="ov-spinner" class="overlay">
			<div class="overlay__inner">
				<div class="overlay__content"><span class="spinner"></span></div>
			</div>
		</div>

		<notifications group="app" position="bottom left" :width="'100%'" />

		<b-sidebar type="is-light" :fullheight="true" :overlay="false" :right="true" :open.sync="isSidebarOpen">
			<div>
				<div class="flex items-center p-3 bg-white">
					<b-icon icon="bell" size="is-small" class="has-text-primary mr-2"></b-icon>
					<h3 class="has-text-primary font-semibold">Notifications</h3>
				</div>
				<ul class="py-4 text-sm">

					<!-- <li class="flex flex-col px-4 py-2 border-b border-white">
						<p class="font-semibold text-gray-700">This is a notification</p>
						<span class="text-xs text-gray-500">July-02-2020 @ 12:00 AM</span>
					</li>

					<li class="flex flex-col px-4 py-2 border-b border-white">
						<p class="font-semibold text-gray-700">This is a notification</p>
						<span class="text-xs text-gray-500">July-02-2020 @ 12:00 AM</span>
					</li>

					<li class="flex flex-col px-4 py-2 border-b border-white">
						<p class="font-semibold text-gray-700">This is a notification</p>
						<span class="text-xs text-gray-500">July-02-2020 @ 12:00 AM</span>
					</li> -->

				</ul>
			</div>
		</b-sidebar>

	</div>
</template>

<script>
	import Navigation from '@/components/Navigation'
	import simplebar from 'simplebar-vue'
	import { mapGetters, mapState } from 'vuex'

	export default {
		name: 'Default',

		components: {
			Navigation,
			simplebar
		},

		computed: {
			...mapGetters({
				isLoading: 'getLoadingStatus',
				ajaxResult: 'getAjaxResult',
				selectedBranch: 'getSelectedBranch'
			})
		},

		watch: {
			ajaxResult(newValue, oldValue) {
				//if(newValue.hasOwnProperty('nodisplay') && newValue.display)
				switch (newValue.status) {
					case 'ok':
						this.$notify({ group: 'app', title: newValue.title, text: newValue.message, type: 'success' })
						break

					case 'server_error':
						this.$notify({ group: 'app', title: newValue.title, text: newValue.message, type: 'error', duration: 5000 })
						break

					default:
						break
				}
			}
		},

		data() {
			return {
				isSidebarOpen: false,
				isTestMode: false
			}
		},

		methods: {
			ShowNotifications() {
				this.isSidebarOpen = true
			},

			async LogoutUser() {
				try {
					let response = await this.$auth.logout()

					//remove cookie
					this.$cookies.remove('preferred-branch')
				} catch (err) {
					console.log(err)
				}
			}
		},

		mounted() {
			if (process.env.mode === 'TEST') {
				this.isTestMode = true
			} else {
				this.isTestMode = false
			}
		}
	}
</script>

<style scoped>
	.testb {
		height: calc(100vh - 70px);
	}
</style>
