export const state = () => ({
    salesOrders: [],
    salesOrderItems: [],

    salesTransactions: [],
    salesTransactionItems: [],

    salesTransaction: {},

    salesDocuments: [],
    salesDeliveries: [],
    salesReturns: [],

    salesInvoices: []

})

export const getters = {

    getSalesOrders(state) {
        return state.salesOrders
    },

    getSalesOrderItems(state) {
        return state.salesOrderItems
    },

    getSalesTransactions(state) {
        return state.salesTransactions
    },

    getSalesTransaction(state) {
        return state.salesTransaction
    },

    getSalesTransactionItems(state) {
        return state.salesTransactionItems
    },

    getSalesDocuments(state) {
        return state.salesDocuments
    },

    getSalesDeliveries(state) {
        return state.salesDeliveries
    },

    getSalesReturns(state) {
        return state.salesReturns
    },

    getSalesInvoices(state) {
        return state.salesInvoices
    },


}

export const mutations = {

    setSalesOrders(state, salesOrders) {
        state.salesOrders = salesOrders
    },

    setSalesOrderItems(state, salesOrderItems) {
        state.salesOrderItems = salesOrderItems
    },

    setSalesTransactions(state, salesTransactions) {
        state.salesTransactions = salesTransactions
    },

    setSalesTransaction(state, salesTransaction) {
        state.salesTransaction = salesTransaction
    },

    setSalesTransactionItems(state, salesTransactionItems) {
        state.salesTransactionItems = salesTransactionItems
    },

    setSalesDocuments(state, salesDocuments) {
        state.salesDocuments = salesDocuments
    },

    setSalesDeliveries(state, salesDeliveries) {
        state.salesDeliveries = salesDeliveries
    },

    setSalesReturns(state, salesReturns) {
        state.salesReturns = salesReturns
    },

    setSalesInvoices(state, salesInvoices) {
        state.salesInvoices = salesInvoices
    },

}

export const actions = {

    async GetSalesOrders({ commit }) {
        commit('setIsLoading', true, { root: true })
        let result = await this.$axios.$get('sales/sales_orders')
        commit('setSalesOrders', result.data)
        commit('setIsLoading', false, { root: true })
    },

    async GetSalesOrderItems({ commit }) {
        commit('setIsLoading', true, { root: true })
        let result = await this.$axios.$get('sales/sales_order_items')
        commit('setSalesOrderItems', result.data)
        commit('setIsLoading', false, { root: true })
    },


    async GetSalesTransactions({ commit }, payload) {
        commit('setIsLoading', true, { root: true })
        let result = await this.$axios.$get('sales/sales_transactions', { params: payload })
        commit('setSalesTransactions', result.data)
        commit('setIsLoading', false, { root: true })

        return result
    },

    async GetSalesTransaction({ commit }, payload) {
        commit('setIsLoading', true, { root: true })
        let result = await this.$axios.$get('sales/sales_transactions/transactions/' + payload)
        commit('setSalesTransaction', result.data)
        commit('setIsLoading', false, { root: true })
        return result.data
    },

    async GetSalesTransactionItems({ commit }) {
        commit('setIsLoading', true, { root: true })
        let result = await this.$axios.$get('sales/sales_transaction_items')
        commit('setSalesTransactionItems', result.data)
        commit('setIsLoading', false, { root: true })
    },

    async GetSingleInvoice({ commit }, payload) {
        commit('setIsLoading', true, { root: true })
        let result = await this.$axios.$get('sales/sales_transactions/transactions/' + payload.invoice_no)
        commit('setIsLoading', false, { root: true })
        return result
    },




    async GetSalesDocuments({ commit }) {
        commit('setIsLoading', true, { root: true })
        let result = await this.$axios.$get('sales/sales_documents')
        commit('setSalesDocuments', result.data)
        commit('setIsLoading', false, { root: true })
    },


    async GetSalesDeliveries({ commit }, payload) {
        commit('setIsLoading', true, { root: true })
        let result = await this.$axios.$get('sales/sales_deliveries', { params: payload })
        commit('setSalesDeliveries', result.data)
        commit('setIsLoading', false, { root: true })

        return result
    },


    async GetSalesReturns({ commit }, payload) {
        commit('setIsLoading', true, { root: true })
        let result = await this.$axios.$get('sales/sales_returns', { params: payload })
        commit('setSalesReturns', result.data)
        commit('setIsLoading', false, { root: true })
        return result
    },

    async GetSalesInvoices({ commit }) {
        commit('setIsLoading', true, { root: true })
        let result = await this.$axios.$get('sales/sales_transactions/invoices')
        commit('setSalesInvoices', result.data)
        commit('setIsLoading', false, { root: true })
    },



    // create +  updates

    async InsertSalesOrder({ commit, dispatch }, payload) {
        commit('setIsLoading', true, { root: true })
        const response = await this.$axios.$post('sales/sales_orders', payload)

        if (response.status === 'ok') dispatch('GetSalesOrders')

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })
        return response
    },



    // update delivery status

    async ConfirmSalesDelivery({ commit, dispatch }, payload) {
        commit('setIsLoading', true, { root: true })
        const response = await this.$axios.$post('sales/sales_deliveries/confirm_delivery', payload)
        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })
        return response
    },

    async UpdateDeliveryStatus({ commit, dispatch }, payload) {
        commit('setIsLoading', true, { root: true })
        const response = await this.$axios.$post('sales/sales_deliveries/update_status/' + payload.status, payload.delivery_nos)
        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })
        return response
    },


    async InsertSalesReturn({ commit, dispatch }, payload) {
        commit('setIsLoading', true, { root: true })
        const response = await this.$axios.$post('sales/sales_returns', payload)
        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })
        return response
    },

    async UpdateSalesReturn({ commit, dispatch }, payload) {
        commit('setIsLoading', true, { root: true })
        const response = await this.$axios.$post('sales/sales_returns/update', payload)
        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })
        return response
    },




    /* Invoice Stubs - added 20210109 */

    async GetInvoiceStubs({ commit }, payload) {
        commit('setIsLoading', true, { root: true })
        let result = await this.$axios.$get('sales/invoice_stubs', { params: payload })

        commit('setIsLoading', false, { root: true })
        return result
    },


    async SearchInvoicesByInvoiceNo({ commit }, payload) {
        commit('setIsLoading', true, { root: true })
        let result = await this.$axios.$get('sales/sales_transactions/searchby_invoiceno', { params: payload })
        commit('setIsLoading', false, { root: true })
        return result.data
    },


    async InsertInvoiceStub({ commit, dispatch }, payload) {
        commit('setIsLoading', true, { root: true })
        const response = await this.$axios.$post('sales/invoice_stubs', payload)
        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })
        return response
    },

    async InsertInvoiceStubDetails({ commit, dispatch }, payload) {
        commit('setIsLoading', true, { root: true })
        const response = await this.$axios.$post('sales/invoice_stubs/detail', payload)
        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })
        return response
    },






    /* Added keeplist 20210206 */

    async GetAllKeepList({ commit }, payload) {
        commit('setIsLoading', true, { root: true })
        let result = await this.$axios.$get('sales/sales_orders/keep_list_all', { params: payload })
        commit('setIsLoading', false, { root: true })
        return result
    },

    async InsertKeepList({ commit, dispatch }, payload) {
        commit('setIsLoading', true, { root: true })
        const response = await this.$axios.$post('sales/sales_orders/keep', payload)
        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })
        return response
    },


    async DeleteKeepList({ commit, dispatch }, payload) {
        commit('setIsLoading', true, { root: true })
        const response = await this.$axios.$post('sales/sales_orders/delete_keep_list', payload)
        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })
        return response
    },




}