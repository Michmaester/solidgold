export const state = () => ({

    products: [],
    allProducts: [],



})

export const getters = {

    getProducts(state) {
        return state.products
    },

    getAllProducts(state) {
        return state.allProducts
    },




}

export const mutations = {

    setProducts(state, products) {
        state.products = products
    },

    setAllProducts(state, allProducts) {
        state.allProducts = allProducts
    },



}

export const actions = {

    async GetProducts({ commit }, payload) {
        let result = await this.$axios.$get('products', { params: payload })
        commit('setProducts', result.data)
        return result
    },

    async GetSingleProduct({ commit }, payload) {
        let result = await this.$axios.$get('products/single_product/' + payload.product_id)
        return result.data
    },



    async GetAllProducts({ commit }) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('products/all_products')

        commit('setAllProducts', result.data)
        commit('setIsLoading', false, { root: true })

    },

    async SearchProductsByName({ commit }, payload) {
        let result = await this.$axios.$get('products/search_by_name', { params: payload })
        return result.data
    },

    async SearchProductsByCode({ commit }, payload) {
        let result = await this.$axios.$get('products/search_by_code', { params: payload })
        return result.data
    },




    async InsertProduct({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('products', payload)

        if (response.status === 'ok') {
            dispatch('GetProducts')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },

    async UpdateProduct({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('products/update', payload)

        if (response.status === 'ok') {
            dispatch('GetProducts')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },


    async BulkUpdateProductPricing({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('products/bulk_update_pricing', payload)

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },

    async UpdateProductPricing({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('products/update_pricing', payload)

        if (response.status === 'ok') {
            dispatch('GetProducts')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },


    async GetProductStock({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        const result = await this.$axios.$get('products/onhand_stock/' + payload.product_id)

        commit('setIsLoading', false, { root: true })

        return result.data

    },



    async GetProductBySelectedCriterias({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        const result = await this.$axios.$get('products/by_criteria/', { params: payload })

        commit('setIsLoading', false, { root: true })

        return result

    },




    async UploadProductImage({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('upload/multi_images', payload)

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response
    },


    async UpdateProductImages({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('products/update_images', payload)

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response
    },

}