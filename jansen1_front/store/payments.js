export const state = () => ({

    salesPayments: [],
    purchasePayments: [],

})

export const getters = {

    getSalesPayments(state) {
        return state.salesPayments
    },

    getPurchasePayments(state) {
        return state.purchasePayments
    },

}

export const mutations = {

    setSalesPayments(state, salesPayments) {
        state.salesPayments = salesPayments
    },

    setPurchasePayments(state, purchasePayments) {
        state.purchasePayments = purchasePayments
    },

}

export const actions = {




    // Sales

    async GetSalesPayments({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('payments/payment_tenders', { params: payload })

        commit('setSalesPayments', result.data)
        commit('setIsLoading', false, { root: true })

        return result

    },

    async GetSalesPaymentsFilter({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('payments/payment_tenders/filter', { params: payload })

        commit('setSalesPayments', result.data)

        commit('setIsLoading', false, { root: true })

    },




    async SubmitInvoicePayment({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('payments/payment_tenders/payment_invoice_submit', payload)

        if (response.status === 'ok') {
            dispatch('GetSalesPayments')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },

    async SubmitCustomerInvoicePayment({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('payments/payment_tenders/payment_customer_submit', payload)

        if (response.status === 'ok') {
            dispatch('GetSalesPayments')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },






























    async GetPurchasePayments({ commit }) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('payments/payment_purchase_orders')

        commit('setPurchasePayments', result.data)

        commit('setIsLoading', false, { root: true })
    },


    async GetChequeVouchers({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('payments/payment_purchase_orders/cheque_vouchers', { params: payload })

        commit('setIsLoading', false, { root: true })

        return result

    },



    async SubmitPurchaseOrderPayment({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('payments/payment_purchase_orders/payment_po_submit', payload)

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },

    async SubmitSupplierPurchaseOrderPayment({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('payments/payment_purchase_orders/payment_supplier_po_submit', payload)

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },




}