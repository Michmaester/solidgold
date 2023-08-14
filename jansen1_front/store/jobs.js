export const state = () => ({

    jobOrders: [],
})


export const mutations = {

    setJobOrders(state, jobOrders) {
        state.jobOrders = jobOrders
    },

}

export const getters = {

    getJobOrders(state) {
        return state.jobOrders
    },

}



export const actions = {

    async GetJobOrders({ commit }, payload) {

        const result = await this.$axios.$get('job_orders', { params: payload })

        commit('setJobOrders', result.data)
        return result

    },


    async InsertJobOrder({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('job_orders', payload)
        if (response.status === 'ok') {
            dispatch('GetJobOrders')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response
    },

    async UpdateJobOrder({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$put('job_orders', payload)
        if (response.status === 'ok') {
            dispatch('GetJobOrders')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response


    },


    async UpdateJobOrdersStatus({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        const response = await this.$axios.$post('job_orders/update_status', payload)
        if (response.status === 'ok') {
            dispatch('GetJobOrders')
        }

        commit('setAjaxResult', response, { root: true })
        commit('setIsLoading', false, { root: true })

        return response
    },


}