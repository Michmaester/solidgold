export const state = () => ({
    isLoading: false,
    ajaxResult: null,
    selectedBranch: {},

    testdatas: []
})

export const getters = {

    getLoadingStatus(state) {
        return state.isLoading
    },

    getAjaxResult(state) {
        return state.ajaxResult
    },

    getSelectedBranch(state) {
        return state.selectedBranch
    },

    getTestDatas(state) {
        return state.testdatas
    }
}

export const mutations = {

    setIsLoading(state, isLoading) {
        state.isLoading = isLoading
    },

    setAjaxResult(state, ajaxResult) {
        state.ajaxResult = ajaxResult
    },

    setSelectedBranch(state, selectedBranch) {
        state.selectedBranch = selectedBranch
    },

    setTestDatas(state, testdatas) {
        state.testdatas = testdatas
    }
}

export const actions = {

    // read cookie when the app is bootup and put it on the store
    async nuxtServerInit({ commit, dispatch }, { req }) {
        // Parse cookies with cookie-universal-nuxt
        const branch = this.$cookies.get('preferred-branch')

        commit('setSelectedBranch', branch)
    },

    async RegisterUser({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('auth/register', payload)

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },


    async AuthenticateUser({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('auth/login', payload)

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },


    async Testing({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$get('test')

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },





    // Reports Generation

    async GenerateReport({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('/reports', payload)

        commit('setAjaxResult', response, { root: true })
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




    async GetSalesFrontDatas({ commit }, payload) {

        commit('setIsLoading', true, { root: true })


        //const products = await this.$axios.$get('products')
        const customers = await this.$axios.$get('partner_customers')
        // const categories = await this.$axios.$get('masterdata/categories')
        // const brands = await this.$axios.$get('masterdata/brands')
        // //const types = await this.$axios.$get('masterdata/types')
        // const units = await this.$axios.$get('masterdata/units')
        // const colors = await this.$axios.$get('masterdata/colors')

        const response = {
            // products: products.data,
            customers: customers.data,
            // categories: categories.data,
            // brands: brands.data,
            // // types: types.data,
            // units: units.data,
            // colors: colors.data

        }

        commit('setIsLoading', false, { root: true })

        return response
    },


    async GetTestDatas({ commit }, payload) {

        commit('setIsLoading', true, { root: true })


        //const products = await this.$axios.$get('products')
        const response = await this.$axios.$get('testdatas')

        commit('setIsLoading', false, { root: true })

        return response.data
    },


    /* Single Doc Printing */

    async GetPrintDoc({ commit }, payload) {

        commit('setIsLoading', true, { root: true })
        const response = await this.$axios.$get('printdoc', { params: payload })
        commit('setIsLoading', false, { root: true })

        return response
    },
}