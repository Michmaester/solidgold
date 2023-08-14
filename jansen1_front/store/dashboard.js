export const state = () => ({

    monthlySales: [],
    monthlyPurchases: [],

    inventoryRestocks: [],
    accountsReceivables: [],
    accountsPayables: [],


    dashCharts: [],

    dashData: {}

})

export const getters = {

    getMonthlySales(state) {
        return state.monthlySales
    },

    getMonthlyPurchases(state) {
        return state.monthlyPurchases
    },

    getInventoryRestocks(state) {
        return state.inventoryRestocks
    },

    getAccountReceivables(state) {
        return state.accountsReceivables
    },

    getAccountPayables(state) {
        return state.accountsPayables
    },

    getDashCharts(state) {
        return state.dashCharts
    },

    getDashData(state) {
        return state.dashData
    },


}

export const mutations = {

    setMonthlySales(state, monthlySales) {
        state.monthlySales = monthlySales
    },

    setMonthlyPurchases(state, monthlyPurchases) {
        state.monthlyPurchases = monthlyPurchases
    },

    setInventoryRestocks(state, inventoryRestocks) {
        state.inventoryRestocks = inventoryRestocks
    },

    setAccountReceivables(state, accountsReceivables) {
        state.accountsReceivables = accountsReceivables
    },

    setAccountPayables(state, accountsPayables) {
        state.accountsPayables = accountsPayables
    },

    setDashCharts(state, dashCharts) {
        state.dashCharts = dashCharts
    },

    setDashData(state, dashData) {
        state.dashData = dashData
    },


}

export const actions = {


    async GetDashboardDatas({ commit }, payload) {

        commit('setIsLoading', true, { root: true })


        var response = null
        if (payload) {
            response = await this.$axios.$get('/dashboard', { params: { branch_code: payload.branch_code } })
        } else {
            response = await this.$axios.$get('/dashboard')
        }

        commit('setDashData', response.data)

        //commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response
    },

    async GetDashMonthlyCharts({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$get('/dashboard/get_allbranch_monthly_salespo', payload)

        commit('setDashCharts', response.data)

        //commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response
    },








    async GeneratePdf({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('/reports/generate_pdf', payload)

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },






}