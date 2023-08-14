export const state = () => ({

    stocks: [],
    stockIns: [],
    stockOuts: [],
    stockTransfers: [],

    productStock: {},

    allProdNames: [],
    allProdCodes: [],

})


export const mutations = {

    setStocks(state, stocks) {
        state.stocks = stocks
    },

    setStockIns(state, stockIns) {
        state.stockIns = stockIns
    },

    setStockOuts(state, stockOuts) {
        state.stockOuts = stockOuts
    },

    setStockTransfers(state, stockTransfers) {
        state.stockTransfers = stockTransfers
    },

    setProductStock(state, productStock) {
        state.productStock = productStock
    },

    setAllProdNames(state, allProdNames) {
        state.allProdNames = allProdNames
    },

    setAllProdCodes(state, allProdCodes) {
        state.allProdCodes = allProdCodes
    },

}

export const getters = {

    getStocks(state) {
        return state.stocks
    },

    getStockIns(state) {
        return state.stockIns
    },

    getStockOuts(state) {
        return state.stockOuts
    },

    getStockTransfers(state) {
        return state.stockTransfers
    },

    getProductStock(state) {
        return state.productStock
    },

    getAllProdNames(state) {
        return state.allProdNames
    },

    getAllProdCodes(state) {
        return state.allProdCodes
    },

}



export const actions = {

    async GetAllProdNames({ commit }) {
        commit('setIsLoading', true, { root: true })
        let result = await this.$axios.$get('stocks/stocks/stocks_all_product_names')
        commit('setAllProdNames', result.data)
        commit('setIsLoading', false, { root: true })
    },

    async GetAllProdCodes({ commit }) {
        commit('setIsLoading', true, { root: true })
        let result = await this.$axios.$get('stocks/stocks/stocks_all_product_codes')
        commit('setAllProdCodes', result.data)
        commit('setIsLoading', false, { root: true })
    },

    async GetStocks({ commit }, payload) {

        //commit('setIsLoading', true, { root: true })

        const result = await this.$axios.$get('stocks/stocks', { params: payload })

        commit('setStocks', result.data)
        //commit('setIsLoading', false, { root: true })

        return result

    },

    async GetStockIns({ commit }, payload) {

        //commit('setIsLoading', true, { root: true })

        const result = await this.$axios.$get('stocks/stock_ins', { params: payload })

        commit('setStockIns', result.data)
        //commit('setIsLoading', false, { root: true })

        return result

    },

    async GetStockOuts({ commit }, payload) {

        //commit('setIsLoading', true, { root: true })

        const result = await this.$axios.$get('stocks/stock_outs', { params: payload })

        commit('setStockOuts', result.data)
        //commit('setIsLoading', false, { root: true })

        return result
    },


    async GetProductStock({ commit }, payload) {
        // product id
        // branch

        commit('setIsLoading', true, { root: true })

        const result = await this.$axios.$get('stocks/stocks/branch/' + payload.branch_code + '/' + payload.product_id)

        commit('setProductStock', result.data)
        commit('setIsLoading', false, { root: true })

        return result.data

    },




    async SetRebalanceOnhandQty({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$put('stocks/stocks', payload)

        if (response.status === 'ok') {
            dispatch('GetStocks')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },

    async BulkUpdateStockOnhandQty({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('stocks/stocks/bulk_update_stocks', payload)

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },

    async SetRestockingThresholdQty({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$put('stocks/stocks/restocking', payload)

        if (response.status === 'ok') {
            dispatch('GetStocks')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },




    async GetStockTransfers({ commit }, payload) {
        const result = await this.$axios.$get('stocks/stock_transfers', { params: payload })
        commit('setStockTransfers', result.data)
        return result
    },

    async GetStockTransfersRequestReceive({ commit }, payload) {
        const result = await this.$axios.$get('stocks/stock_transfers/fullfilling/' + payload.branch_code, { params: payload })
        commit('setStockTransfers', result.data)
        return result
    },




    async InsertStockTransfer({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('stocks/stock_transfers', payload)

        if (response.status === 'ok') {
            dispatch('GetStockTransfers')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },

    async ProcessStockTransfer({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('stocks/stock_transfers/process', payload)

        if (response.status === 'ok') {
            dispatch('GetStockTransfers')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },


    async AcceptStockTransfer({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('stocks/stock_transfers/branch_accept', payload)

        if (response.status === 'ok') {
            dispatch('GetStockTransfers')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },

    async RevertStockTransfer({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('stocks/stock_transfers/branch_revert_accept', payload)

        if (response.status === 'ok') {
            dispatch('GetStockTransfers')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },


    async SetAllowReprinting({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('stocks/stock_transfers/allow_reprint', payload)

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },





}