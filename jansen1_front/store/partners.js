export const state = () => ({

    customers: [],
    suppliers: [],

    allCustomers: [],
    allSuppliers: [],

    customerInvoices: [],
    supplierPOs: [],

    customerSalesInvoices: [],
    customerSalesDeliveries: [],
    customerSalesPayments: [],

    supplierPurchaseOrders: [],
    supplierPurchaseReceives: [],
    supplierPurchasePayments: [],

})


export const mutations = {



    setCustomers(state, customers) {
        state.customers = customers
    },

    setAllCustomers(state, allCustomers) {
        state.allCustomers = allCustomers
    },

    setSuppliers(state, suppliers) {
        state.suppliers = suppliers
    },

    setAllSuppliers(state, allSuppliers) {
        state.allSuppliers = allSuppliers
    },

    setCustomerInvoices(state, customerInvoices) {
        state.customerInvoices = customerInvoices
    },

    setCustomerSalesInvoices(state, customerSalesInvoices) {
        state.customerSalesInvoices = customerSalesInvoices
    },

    setCustomerSalesDeliveries(state, customerSalesDeliveries) {
        state.customerSalesDeliveries = customerSalesDeliveries
    },

    setCustomerSalesPayments(state, customerSalesPayments) {
        state.customerSalesPayments = customerSalesPayments
    },


    setSupplierPurchaseOrders(state, supplierPurchaseOrders) {
        state.supplierPurchaseOrders = supplierPurchaseOrders
    },

    setSupplierPurchaseReceives(state, supplierPurchaseReceives) {
        state.supplierPurchaseReceives = supplierPurchaseReceives
    },

    setSupplierPurchasePayments(state, supplierPurchasePayments) {
        state.supplierPurchasePayments = supplierPurchasePayments
    },

    setSupplierPos(state, supplierPOs) {
        state.supplierPOs = supplierPOs
    },





}

export const getters = {

    getCustomers(state) {
        return state.customers
    },

    getAllCustomers(state) {
        return state.allCustomers
    },

    getSuppliers(state) {
        return state.suppliers
    },

    getAllSuppliers(state) {
        return state.allSuppliers
    },

    getCustomerInvoices(state) {
        return state.customerInvoices
    },

    getCustomerSalesInvoices(state) {
        return state.customerSalesInvoices
    },

    getCustomerSalesDeliveries(state) {
        return state.customerSalesDeliveries
    },

    getCustomerSalesPayments(state) {
        return state.customerSalesPayments
    },

    getSupplierPurchaseOrders(state) {
        return state.supplierPurchaseOrders
    },

    getSupplierPurchaseReceives(state) {
        return state.supplierPurchaseReceives
    },

    getSupplierPurchasePayments(state) {
        return state.supplierPurchasePayments
    },

    getSupplierPos(state) {
        return state.supplierPOs
    },

}



export const actions = {

    async GetCustomers({ commit }, payload) {

        const result = await this.$axios.$get('partner_customers', { params: payload })

        commit('setCustomers', result.data)

        return result
    },

    async GetAllCustomers({ commit }) {

        const result = await this.$axios.$get('partner_customers/all_customers')
        commit('setAllCustomers', result.data)
    },

    async GetSuppliers({ commit }, payload) {

        const result = await this.$axios.$get('partner_suppliers', { params: payload })
        commit('setSuppliers', result.data)
        return result
    },

    async GetAllSuppliers({ commit }) {

        const result = await this.$axios.$get('partner_suppliers/all_suppliers')
        commit('setAllSuppliers', result.data)
    },


    async InsertCustomer({ commit, dispatch }, payload) {
        commit('setIsLoading', true, { root: true })
        const response = await this.$axios.$post('partner_customers', payload)
        if (response.status === 'ok') {
            dispatch('GetCustomers')
        }
        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })
        return response
    },

    async UpdateCustomer({ commit, dispatch }, payload) {
        commit('setIsLoading', true, { root: true })
        const response = await this.$axios.$put('partner_customers', payload)
        if (response.status === 'ok') {
            dispatch('GetCustomers')
        }
        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })
        return response
    },




    async InsertSupplier({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })
        const response = await this.$axios.$post('partner_suppliers', payload)
        if (response.status === 'ok') {
            dispatch('GetSuppliers')
        }
        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response
    },

    async UpdateSupplier({ commit, dispatch }, payload) {
        commit('setIsLoading', true, { root: true })
        const response = await this.$axios.$put('partner_suppliers', payload)
        if (response.status === 'ok') {
            dispatch('GetSuppliers')
        }
        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response
    },







    async GetCustomerInvoices({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        const result = await this.$axios.$get('partner_customers/invoices/' + payload.customer_id)

        commit('setCustomerInvoices', result.data)
        commit('setIsLoading', false, { root: true })

    },





    async GetCustomerSalesInvoices({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        const result = await this.$axios.$get('partner_customers/salesinvoices/' + payload.customer_id)

        commit('setCustomerSalesInvoices', result.data)
        commit('setIsLoading', false, { root: true })

    },

    async GetCustomerSalesDeliveries({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        const result = await this.$axios.$get('sales/sales_deliveries/customer/' + payload.customer_id)

        commit('setCustomerSalesDeliveries', result.data)
        commit('setIsLoading', false, { root: true })

    },

    async GetCustomerSalesPayments({ commit }, payload) {

        commit('setIsLoading', true, { root: true })



        const result = await this.$axios.$get('payments/payment_tenders/customer/' + payload.customer_id)

        commit('setCustomerSalesPayments', result.data)
        commit('setIsLoading', false, { root: true })

    },






    async GetSupplierPurchaseOrders({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        const result = await this.$axios.$get('purchase/purchase_orders/supplier/' + payload.supplier_id)

        commit('setSupplierPurchaseOrders', result.data)
        commit('setIsLoading', false, { root: true })

    },

    async GetSupplierPurchaseReceives({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        const result = await this.$axios.$get('purchase/purchase_orders/supplier_receives/' + payload.supplier_id)

        commit('setSupplierPurchaseReceives', result.data)
        commit('setIsLoading', false, { root: true })

    },

    async GetSupplierPurchasePayments({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        const result = await this.$axios.$get('purchase/purchase_orders/supplier_payments/' + payload.supplier_id)

        commit('setSupplierPurchasePayments', result.data)
        commit('setIsLoading', false, { root: true })

    },

    async GetSupplierPos({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        const result = await this.$axios.$get('partner_suppliers/pos/' + payload.supplier_id)

        commit('setSupplierPos', result.data)
        commit('setIsLoading', false, { root: true })

    },








    async GetCustomerSalesReturnCredits({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        const result = await this.$axios.$get('partner_customers/sales_returns_credits/' + payload.customer_id)

        commit('setIsLoading', false, { root: true })

        return result.data

    },




}