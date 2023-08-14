//const PMS_API_URL = this.$config.pmsServiceUrl

export const state = () => ({

    employees: []

})


export const mutations = {

    setEmployees(state, employees) {
        state.employees = employees
    },



}

export const getters = {

    getEmployees(state) {
        return state.employees
    },



}



export const actions = {

    async GetEmployees({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get(this.$config.pmsServiceUrl + '/employees', { params: payload })

        commit('setIsLoading', false, { root: true })
        return result

    },

    async GetDailyTimeRecords({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get(this.$config.pmsServiceUrl + '/dtrs', { params: payload })

        commit('setIsLoading', false, { root: true })
        return result

    },

    async GetPayrolls({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get(this.$config.pmsServiceUrl + '/payrolls', { params: payload })

        commit('setIsLoading', false, { root: true })
        return result

    },


    async FixDailyTimeLogs({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$post(this.$config.pmsServiceUrl + '/dtls/fix_dtls', payload)

        commit('setIsLoading', false, { root: true })
        return result

    },






}