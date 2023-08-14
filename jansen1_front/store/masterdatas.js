export const state = () => ({
    branches: [],
    banks: [],

    brands: [],
    categories: [],
    colors: [],
    divisions: [],
    types: [],
    units: [],

    typesByCategory: []

})


export const mutations = {

    setBranches(state, branches) {
        state.branches = branches
    },

    setBanks(state, banks) {
        state.banks = banks
    },

    setBrands(state, brands) {
        state.brands = brands
    },

    setCategories(state, categories) {
        state.categories = categories
    },

    setColors(state, colors) {
        state.colors = colors
    },

    setDivisions(state, divisions) {
        state.divisions = divisions
    },

    setTypes(state, types) {
        state.types = types
    },

    setTypesByCategory(state, payload) {
        state.typesByCategory = state.types.filter(item => { return item.category_id == payload.id })
    },

    setUnits(state, units) {
        state.units = units
    }

}

export const getters = {

    getBranches(state) {
        return state.branches
    },

    getBanks(state) {
        return state.banks
    },

    getBrands(state) {
        return state.brands
    },

    getCategories(state) {
        return state.categories
    },

    getColors(state) {
        return state.colors
    },

    getDivisions(state) {
        return state.divisions
    },

    getTypes(state) {
        return state.types
    },

    getTypesByCategory(state) {
        return state.typesByCategory
    },

    getUnits(state) {
        return state.units
    }

}



export const actions = {

    async GetBranches({ commit }) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('masterdata/branches')

        commit('setBranches', result.data)

        commit('setIsLoading', false, { root: true })

    },

    async GetBanks({ commit }) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('masterdata/banks')

        commit('setBanks', result.data)

        commit('setIsLoading', false, { root: true })

    },


    async GetBrands({ commit }) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('masterdata/brands')

        commit('setBrands', result.data)

        commit('setIsLoading', false, { root: true })

    },

    async GetCategories({ commit }) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('masterdata/categories')

        commit('setCategories', result.data)

        commit('setIsLoading', false, { root: true })

    },

    async GetColors({ commit }) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('masterdata/colors')

        commit('setColors', result.data)

        commit('setIsLoading', false, { root: true })

    },

    async GetDivisions({ commit }) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('masterdata/division_refs')

        commit('setDivisions', result.data)

        commit('setIsLoading', false, { root: true })


    },

    async GetTypes({ commit }) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('masterdata/types')

        commit('setTypes', result.data)

        commit('setIsLoading', false, { root: true })

    },

    async GetUnits({ commit }) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('masterdata/units')

        commit('setUnits', result.data)

        commit('setIsLoading', false, { root: true })

    },





    async GetTypesByCategory({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('masterdata/types/category/' + payload.id)

        commit('setIsLoading', false, { root: true })

        return result

    },



    // inserrts + updates


    // products is on the product module (store/products)


    async InsertBrand({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('masterdata/brands', payload)

        if (response.status === 'ok') {
            dispatch('GetBrands')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },

    async UpdateBrand({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('masterdata/brands/update', payload)

        if (response.status === 'ok') {
            dispatch('GetBrands')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },


    async InsertCategory({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('masterdata/categories', payload)

        if (response.status === 'ok') {
            dispatch('GetCategories')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },

    async UpdateCategory({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('masterdata/categories/update', payload)

        if (response.status === 'ok') {
            dispatch('GetCategories')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },


    async InsertColor({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('masterdata/colors', payload)

        if (response.status === 'ok') {
            dispatch('GetColors')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },

    async UpdateColor({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('masterdata/colors/update', payload)

        if (response.status === 'ok') {
            dispatch('GetColors')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },


    async InsertDivision({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('masterdata/division_refs', payload)

        if (response.status === 'ok') {
            dispatch('GetDivisions')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },

    async UpdateDivision({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('masterdata/division_refs/update', payload)

        if (response.status === 'ok') {
            dispatch('GetDivisions')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },



    async InsertType({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('masterdata/types', payload)

        if (response.status === 'ok') {
            dispatch('GetTypes')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },

    async UpdateType({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('masterdata/types/update', payload)

        if (response.status === 'ok') {
            dispatch('GetTypes')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },


    async InsertUnit({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('masterdata/units', payload)

        if (response.status === 'ok') {
            dispatch('GetUnits')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },

    async UpdateUnit({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('masterdata/units/update', payload)

        if (response.status === 'ok') {
            dispatch('GetUnits')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },





    async InsertBank({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('masterdata/banks', payload)

        if (response.status === 'ok') {
            dispatch('GetBanks')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },

    async UpdateBank({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('masterdata/banks/update', payload)

        if (response.status === 'ok') {
            dispatch('GetBanks')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response

    },




}