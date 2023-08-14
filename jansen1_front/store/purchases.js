export const state = () => ({
    purchaseOrders: [],
    purchaseOrderItems: [],

    purchaseReceives: [],
    purchaseReceived: [],

    purchasePayments: [],
    purchasePayment: {}

    // salesTransactions : [],
    // salesTransactionItems : [],

    // salesDocuments : [],
    // salesDeliveries : [],
    // salesReturns : [],

})

export const getters = {

    getPurchaseOrders(state) {
        return state.purchaseOrders
    },

    getPurchaseReceives(state) {
        return state.purchaseReceives
    },

    getPurchaseReceived(state) {
        return state.purchaseReceived
    },

    getReceivePurchaseOrders(state) {
        return state.purchaseOrders.filter((item) => {
            return item.status == 'Receive'
        })
    },

    getPurchaseOrderItems(state) {
        return state.purchaseOrderItems
    },

    getPurchasePayments(state) {
        return state.purchasePayments
    },

    getPurchasePayment(state) {
        return state.purchasePayment
    },





}

export const mutations = {

    setPurchaseOrders(state, purchaseOrders) {
        state.purchaseOrders = purchaseOrders
    },

    setPurchaseReceives(state, purchaseReceives) {
        state.purchaseReceives = purchaseReceives
    },

    setPurchaseReceived(state, purchaseReceived) {
        state.purchaseReceived = purchaseReceived
    },

    setPurchaseOrderItems(state, purchaseOrderItems) {
        state.purchaseOrderItems = purchaseOrderItems
    },

    setPurchasePayments(state, purchasePayments) {
        state.purchasePayments = purchasePayments
    },

    setPurchasePayment(state, purchasePayment) {
        state.purchasePayment = purchasePayment
    },



}

export const actions = {

    async GetPurchaseOrders({ commit }, payload) {

        commit('setIsLoading', true, { root: true })
        let result = await this.$axios.$get('purchase/purchase_orders', { params: payload })
        commit('setPurchaseOrders', result.data)
        commit('setIsLoading', false, { root: true })
        return result

    },

    async GetPurchaseOrdersByStatus({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('purchase/purchase_orders/status/' + payload)

        commit('setPurchaseOrders', result.data)

        commit('setIsLoading', false, { root: true })

    },



    async GetPurchaseOrderItems({ commit }) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('purchase/purchase_order_items')

        commit('setPurchaseOrderItems', result.data)

        commit('setIsLoading', false, { root: true })

    },


    async InsertPurchaseOrder({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('purchase/purchase_orders', payload)

        if (response.status === 'ok') {
            dispatch('GetPurchaseOrders')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response
    },

    async UpdatePurchaseOrderPrice({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })
        const response = await this.$axios.$post('purchase/purchase_orders/update_price', payload)
        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response
    },

    async InsertNonTradePurchaseOrder({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('purchase/purchase_orders/non_trade', payload)

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response
    },

    async UpdatePurchaseOrder({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('purchase/purchase_orders/update', payload)

        if (response.status === 'ok') {
            dispatch('GetPurchaseOrders')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },

    async UpdatePurchaseOrderStatus({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('purchase/purchase_orders/update_status', payload)

        if (response.status === 'ok') {
            dispatch('GetPurchaseOrders')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },


    async GetPurchaseReceives({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('purchase/purchase_orders/po_receives', { params: payload })

        commit('setPurchaseReceives', result.data)
        commit('setIsLoading', false, { root: true })

        return result

    },

    async GetPOReceived({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('purchase/purchase_orders/status/' + payload.type, { params: payload.params })

        commit('setPurchaseReceived', result.data)
        commit('setIsLoading', false, { root: true })

        return result

    },


    async UpdatePurchaseOrderReceivedPrice({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })
        const response = await this.$axios.$post('purchase/purchase_orders/update_received_price', payload)
        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response
    },


    async GetPOReadyForPayment({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('purchase/purchase_orders/po_readyfor_payment', { params: payload.params })

        commit('setIsLoading', false, { root: true })

        return result

    },





    async GetPurchasePayment({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const result = await this.$axios.$get('payments/payment_purchase_orders/' + payload.po_number)

        commit('setPurchasePayment', result.data)

        commit('setIsLoading', false, { root: true })

        return result

    },

    async InsertPurchasePayment({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('payments/payment_purchase_orders', payload)

        if (response.status === 'ok') {
            dispatch('GetPOReceived', ['Received'])
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },















    async UpdatePurchasePayment({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$put('payments/payment_purchase_orders', payload)

        if (response.status === 'ok') {
            dispatch('GetPurchaseOrders')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },






    // Receiving

    async InsertPurchaseReceive({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('purchase/purchase_orders/po_receiving', payload)

        if (response.status === 'ok') {
            dispatch('GetPurchaseReceives')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },




}