<template>

	<aside class="column is-2 sidebar-wrapper border-r border-gray-200 py-2">

		<b-dropdown :triggers="['hover']" aria-role="list" expanded>
			<b-button type="is-primary" class="rounded-sm font-bold" slot="trigger" icon-left="plus" expanded>New Action</b-button>

			<b-dropdown-item :focusable="false" custom>
				<div style="width:500px;">

					<div class="flex">

						<div class="w-1/3 flex flex-col">
							<h4 class="font-semibold mb-1">Sales</h4>
							<nuxt-link :to="{ name: 'sales-payments', params: { action: 'new' }}" class="hover:text-yellow-600">Delivery</nuxt-link>
							<nuxt-link :to="{ name: 'sales-return_exchange', params: { action: 'new' }}" class="hover:text-yellow-600">Return-Exchange</nuxt-link>
							<nuxt-link :to="'/sales/transactions'" class="hover:text-yellow-600">Payment</nuxt-link>
						</div>

						<div class="w-1/3 flex flex-col">
							<h4 class="font-semibold mb-1">Purchase</h4>
							<nuxt-link :to="{ name: 'purchase-orders', params: { action: 'new' }}" class="hover:text-yellow-600">New Order</nuxt-link>
							<nuxt-link :to="{ name: 'purchase-orders', params: { action: 'new' }}" class="hover:text-yellow-600">Receive</nuxt-link>
						</div>

						<div class="w-1/3 flex flex-col">
							<h4 class="font-semibold mb-1">Inventory</h4>
							<nuxt-link :to="'/sales/transactions'" class="hover:text-yellow-600">Stocks</nuxt-link>
						</div>

					</div>

					<div class="flex mt-4">
						<div class="w-1/3 flex flex-col">
							<h4 class="font-semibold mb-1">Partners</h4>
							<nuxt-link :to="'/sales/transactions'" class="hover:text-yellow-600">New Customer</nuxt-link>
							<nuxt-link :to="'/sales/transactions'" class="hover:text-yellow-600">New Supplier</nuxt-link>
						</div>
					</div>

				</div>
			</b-dropdown-item>

		</b-dropdown>

		<nuxt-link :to="'/'">
			<div class="flex-container p-2 modulemenu my-2">
				<div class="flex-container">
					<span class="icon-wrapper">
						<svg xmlns="http://www.w3.org/2000/svg" class="menu-icon" viewBox="0 0 24 24">
							<path d="M21 16V4H3v12h18m0-14a2 2 0 012 2v12a2 2 0 01-2 2h-7v2h2v2H8v-2h2v-2H3c-1.11 0-2-.9-2-2V4c0-1.11.89-2 2-2h18M5 6h9v5H5V6m10 0h4v2h-4V6m4 3v5h-4V9h4M5 12h4v2H5v-2m5 0h4v2h-4v-2z" />
						</svg>
					</span>
					<span class="f1 ml-2 has-text-header font-bold">Dashboard</span>
				</div>
			</div>
		</nuxt-link>

		<nuxt-link :to="'/salesfront'" v-check="'view-salesfront'">
			<div class="flex-container p-2 modulemenu my-2">
				<div class="flex-container">
					<span class="icon-wrapper">
						<svg xmlns="http://www.w3.org/2000/svg" class="menu-icon" viewBox="0 0 24 24">
							<path d="M15 5h3l-1.5 2L15 5M5 2h14c1.11 0 2 .9 2 2v16c0 1.11-.89 2-2 2H5c-1.1 0-2-.89-2-2V4c0-1.1.9-2 2-2m0 2v4h14V4H5m0 16h14V10H5v10m2-8h10v2H7v-2m0 4h10v2H7v-2z" />
						</svg>
					</span>
					<span class="f1 ml-2 has-text-header font-bold">Sales Front</span>
				</div>
			</div>
		</nuxt-link>

		<simplebar class="testa" data-simplebar-auto-hide="true">

			<div v-for="(menu,index) in menus" :key="index">

				<div v-check="menu.perm" class="flex-container p-2 modulemenu" @click.prevent="ToggleMenu(index)">
					<div class="flex-container">
						<span v-html="menu.iconsvg" class="icon-wrapper"></span>
						<span class="f1 ml-2 has-text-header font-semibold">{{ menu.label }}</span>
					</div>

					<svg class="menu-icon-expand" :class="{ 'rotate-90' : isActive(index) }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z" />
					</svg>
				</div>

				<ul class="menulist-wrapper ml-4 mb-1">
					<li v-check="submenu.perm" v-for="(submenu,i) in menu.submenus" :key="i" class="ml-2" :class="{ hidden : !isActive(index) }">
						<nuxt-link :to="menu.url + submenu.url" class="menulist px-2 py-1 f1 has-text-header">{{ submenu.label }}</nuxt-link>
					</li>
				</ul>

			</div>

		</simplebar>

	</aside>

</template>

<script>
	import simplebar from 'simplebar-vue'

	export default {
		components: {
			simplebar
		},
		data() {
			return {
				active_indexes: [],

				menus: [
					{
						label: 'Sales',
						url: '/sales',
						perm: 'view-sales',
						iconsvg:
							'<svg xmlns="http://www.w3.org/2000/svg" class="menu-icon" viewBox="0 0 24 24"><path d="M2 17h20v4H2v-4M6.25 7H9V6H6V3h8v3h-3v1h6.8c1 0 2 1 2.2 2l.5 7h-17l.55-7c0-1 1-2 2.2-2M13 9v2h5V9h-5M6 9v1h2V9H6m3 0v1h2V9H9m-3 2v1h2v-1H6m3 0v1h2v-1H9m-3 2v1h2v-1H6m3 0v1h2v-1H9M7 4v1h6V4H7z"/></svg>',
						submenus: [
							{ label: 'Transactions', url: '/transactions', perm: 'view-transactions' },
							{ label: 'Invoices Stubs', url: '/invoices-stubs', perm: 'view-transactions' },
							{ label: 'Deliveries', url: '/deliveries', perm: 'view-deliveries' },
							{ label: 'Return-Exchange', url: '/return_exchange', perm: 'view-return-exchange' },
							{ label: 'Payments', url: '/payments', perm: 'view-sales-payments' }
						]
					},
					{
						label: 'Purchase',
						url: '/purchase',
						perm: 'view-purchase',
						iconsvg:
							'<svg xmlns="http://www.w3.org/2000/svg" class="menu-icon" viewBox="0 0 24 24"><path d="M2 3h17a2 2 0 012 2v4h-2V5H2v14h17v-4h2v4a2 2 0 01-2 2H2a2 2 0 01-2-2V5a2 2 0 012-2m15 12v-2h7v-2h-7V9l-4 3 4 3M4 13h7v-2H4v2m0-4h7V7H4v2m0 8h4v-2H4v2z"/></svg>',
						submenus: [
							{ label: 'Orders', url: '/orders', perm: 'view-po' },
							{ label: 'Receive Orders', url: '/receive_orders', perm: 'view-po-receive' },
							{ label: 'Payments', url: '/payments', perm: 'view-po-payments' },
							{ label: 'Cheque Vouchers', url: '/cheque_vouchers', perm: 'view-cheque-vouchers' }
						]
					},
					{
						label: 'Inventory',
						url: '/inventory',
						perm: 'view-inventory',
						iconsvg:
							'<svg xmlns="http://www.w3.org/2000/svg" class="menu-icon" viewBox="0 0 24 24"><path d="M22 21H2V3h2v16h2v-2h4v2h2v-3h4v3h2v-2h4v4m-4-7h4v2h-4v-2m-6-8h4v3h-4V6m4 9h-4v-5h4v5M6 10h4v2H6v-2m4 6H6v-3h4v3z"/></svg>',
						submenus: [
							{ label: 'Stocks', url: '/stocks', perm: 'view-stocks' },
							{ label: 'Stock-Ins', url: '/stock_ins', perm: 'view-stockins' },
							{ label: 'Stock-Outs', url: '/stock_outs', perm: 'view-stockouts' },
							{ label: 'Stock Transfer', url: '/stock_transfer', perm: 'view-stock-transfer' }
						]
					},
					{
						label: 'Jobs',
						url: '/jobs',
						perm: 'view-jobs',
						iconsvg:
							'<svg xmlns="http://www.w3.org/2000/svg" class="menu-icon" viewBox="0 0 24 24"><path d="M4 3c-1.11 0-2 .89-2 2v4c0 1.11.89 2 2 2h4c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2m.2 1.5l1.06 1.05L5.27 9.5 2.74 6.95 3.81 5.9l1.47 1.49M4 13c-1.11 0-2 .89-2 2v4c0 1.11.89 2 2 2h4c1.11 0 2-.89 2-2v-4c0-1.11-.89-2-2-2m-4 2h4v4H4m8-14h10v2H12m0 12v-2h10v2m-10-8h10v2H12z"/></svg>',
						submenus: [{ label: 'Job Orders', url: '/job_orders', perm: 'view-jos' }]
					},
					{
						label: 'Partners',
						url: '/partners',
						perm: 'view-partners',
						iconsvg:
							'<svg xmlns="http://www.w3.org/2000/svg" class="menu-icon" viewBox="0 0 24 24"><path d="M12 5a3.5 3.5 0 00-3.5 3.5A3.5 3.5 0 0012 12a3.5 3.5 0 003.5-3.5A3.5 3.5 0 0012 5m0 2a1.5 1.5 0 011.5 1.5A1.5 1.5 0 0112 10a1.5 1.5 0 01-1.5-1.5A1.5 1.5 0 0112 7M5.5 8A2.5 2.5 0 003 10.5c0 .94.53 1.75 1.29 2.18.36.2.77.32 1.21.32.44 0 .85-.12 1.21-.32.37-.21.68-.51.91-.87C6.89 10.86 6.5 9.7 6.5 8.5v-.28c-.3-.14-.64-.22-1-.22m13 0c-.36 0-.7.08-1 .22v.28c0 1.2-.39 2.36-1.12 3.31.12.19.25.34.4.49.16.15.32.28.51.38.36.2.77.32 1.21.32.44 0 .85-.12 1.21-.32.76-.43 1.29-1.24 1.29-2.18A2.5 2.5 0 0018.5 8M12 14c-2.34 0-7 1.17-7 3.5V19h14v-1.5c0-2.33-4.66-3.5-7-3.5m-7.29.55C2.78 14.78 0 15.76 0 17.5V19h3v-1.93c0-1.01.69-1.85 1.71-2.52m14.58 0c1.02.67 1.71 1.51 1.71 2.52V19h3v-1.5c0-1.74-2.78-2.72-4.71-2.95M12 16c1.53 0 3.24.5 4.23 1H7.77c.99-.5 2.7-1 4.23-1z"/></svg>',
						submenus: [
							{ label: 'Customers', url: '/customers', perm: 'view-customers' },
							{ label: 'Suppliers', url: '/suppliers', perm: 'view-suppliers' }
						]
					},
					{
						label: 'Payroll',
						url: '/payroll',
						perm: 'view-payroll',
						iconsvg:
							'<svg xmlns="http://www.w3.org/2000/svg" class="menu-icon" viewBox="0 0 24 24"><path d="M10.63 14.1a6.998 6.998 0 019.27-3.47 6.998 6.998 0 013.47 9.27A6.98 6.98 0 0117 24c-2.7 0-5.17-1.56-6.33-4H1v-2c.06-1.14.84-2.07 2.34-2.82S6.72 14.04 9 14c.57 0 1.11.05 1.63.1M9 4c1.12.03 2.06.42 2.81 1.17S12.93 6.86 12.93 8c0 1.14-.37 2.08-1.12 2.83-.75.75-1.69 1.12-2.81 1.12s-2.06-.37-2.81-1.12C5.44 10.08 5.07 9.14 5.07 8c0-1.14.37-2.08 1.12-2.83C6.94 4.42 7.88 4.03 9 4m8 18a5 5 0 005-5 5 5 0 00-5-5 5 5 0 00-5 5 5 5 0 005 5m-1-8h1.5v2.82l2.44 1.41-.75 1.3L16 17.69V14z"/></svg>',
						submenus: [
							{ label: 'Employees', url: '/employees', perm: 'view-payroll-employees' },
							{ label: 'Timekeeping', url: '/timekeeping', perm: 'view-payroll-timekeeping' },
							{ label: 'Payroll', url: '/payroll', perm: 'view-payroll-payroll' },
							{ label: 'Reports', url: '/reports', perm: 'view-payroll-reports' },
							{ label: 'Setup', url: '/setup', perm: 'view-payroll-setup' }
						]
					},
					{
						label: 'Reporting',
						url: '/reporting',
						perm: 'view-reporting',
						iconsvg:
							'<svg xmlns="http://www.w3.org/2000/svg" class="menu-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6m4 18H6V4h7v5h5v11m-8-7H7v-2h3v2m4 0h-3v-2h3v2m-4 3H7v-2h3v2m4 0h-3v-2h3v2m-4 3H7v-2h3v2m4 0h-3v-2h3v2z"/></svg>',
						submenus: [{ label: 'Reports', url: '/reports', perm: 'view-report-reports' }]
					},
					{
						label: 'Setup',
						url: '/setup',
						perm: 'view-setup',
						iconsvg:
							'<svg xmlns="http://www.w3.org/2000/svg" class="menu-icon" viewBox="0 0 24 24"><path d="M12.63 2c5.53 0 10.01 4.5 10.01 10s-4.48 10-10.01 10c-3.51 0-6.58-1.82-8.37-4.57l1.58-1.25C7.25 18.47 9.76 20 12.64 20a8 8 0 008-8 8 8 0 00-8-8C8.56 4 5.2 7.06 4.71 11h2.76l-3.74 3.73L0 11h2.69c.5-5.05 4.76-9 9.94-9m2.96 8.24c.5.01.91.41.91.92v4.61c0 .5-.41.92-.92.92h-5.53c-.51 0-.92-.42-.92-.92v-4.61c0-.51.41-.91.91-.92V9.23c0-1.53 1.25-2.77 2.77-2.77 1.53 0 2.78 1.24 2.78 2.77v1.01m-2.78-2.38c-.75 0-1.37.61-1.37 1.37v1.01h2.75V9.23c0-.76-.62-1.37-1.38-1.37z"/></svg>',
						submenus: [
							{ label: 'General', url: '/general', perm: 'view-setup-general' },
							{ label: 'User Management', url: '/users', perm: 'view-setup-users' },
							{ label: 'Product Master', url: '/products_master', perm: 'view-setup-products' },
							{ label: 'Product Subdata', url: '/products_sub', perm: 'view-setup-products-sub' }
						]
					}
				]
			}
		},
		methods: {
			ToggleMenu(index) {
				var res = this.active_indexes.indexOf(index)
				if (res >= 0) {
					//existing then splice
					this.active_indexes.splice(res, 1)
				} else {
					//push to array
					this.active_indexes.push(index)
				}
			},

			isActive(index) {
				var res = this.active_indexes.indexOf(index)

				if (res >= 0) {
					return true
				} else {
					return false
				}
			},

			SideMenuToggleByRoute() {
				let currrentRouteName = this.$route.name

				if (currrentRouteName) {
					var splittedRoute = currrentRouteName.split('-')
					var index = this.menus.findIndex((item) => item.url === '/' + splittedRoute[0])
					this.ToggleMenu(index)
				}
			},

			ShowQuickActionModal() {
				alert('ooops')
			}
		},

		mounted() {
			this.SideMenuToggleByRoute()
		}
	}
</script>


<style scoped>
	.menu-icon {
		width: 20px;
		height: 20px;
		fill: #3c3c3c;
	}
	.icon-wrapper {
		width: 20px;
		height: 20px;
	}

	.menu-icon-expand {
		width: 20px;
		height: 20px;
		fill: #3c3c3c;
	}

	.rotate-90 {
		transform: rotate(90deg);
	}

	.menulist-wrapper {
		border-left: 1px solid rgb(151, 151, 151);
	}

	.flex-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.hidden {
		display: none;
	}

	div.modulemenu {
		border-radius: 2px;
		cursor: pointer;
		border-left: 2px solid #ffc20a00;
	}

	div.modulemenu:hover {
		border-radius: 2px;
		background-color: #ffffff;
		border-left: 2px solid #ffc30a;
	}

	li > a.menulist {
		display: inline-flex;
		width: 100%;
		border-radius: 2px;
		cursor: pointer;
	}

	li > a.menulist:hover {
		background-color: #ffffff;
	}

	.f1 {
		font-size: 14px;
	}
	.f2 {
		font-size: 16px;
	}

	a.nuxt-link-exact-active {
		background-color: #ffffff;
	}

	.testa {
		height: calc(100vh - 210px);
	}
</style>
