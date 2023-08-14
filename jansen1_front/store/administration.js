export const state = () => ({
    users: [],
    roles: [],
    rolePermissions: [],

})

export const getters = {

    getUsers(state) {
        return state.users
    },

    getRoles(state) {
        return state.roles
    },

    getRolePermissions(state) {
        return state.rolePermissions
    },




}

export const mutations = {

    setUsers(state, users) {
        state.users = users
    },

    setRoles(state, roles) {
        state.roles = roles
    },

    setRolePermissions(state, rolePermissions) {
        state.rolePermissions = rolePermissions
    },

    // searchUsersByUsername(state, users) {
    //     state.users = users
    // },



}

export const actions = {

    async GetUsers({ commit }) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('users')

        commit('setUsers', result.data)

        commit('setIsLoading', false, { root: true })

    },

    async GetRoles({ commit }) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('role_permissions/roles')

        commit('setRoles', result.data)

        commit('setIsLoading', false, { root: true })

    },


    async GetRolePermissions({ commit }, payload) {

        commit('setIsLoading', true, { root: true })

        let result = await this.$axios.$get('role_permissions/roles/' + payload.role_id)

        commit('setRolePermissions', result.data)
        commit('setIsLoading', false, { root: true })

        return result

    },

    async UpdateRolePermissions({ commit, dispatch }, payload) {

        commit('setIsLoading', true, { root: true })

        let response = await this.$axios.$post('role_permissions', payload)

        if (response.status === 'ok') {
            dispatch('GetRolePermissions', payload.role)
        }
        commit('setIsLoading', false, { root: true })

    },

    async UpdateUserInformation({ commit, dispatch }, payload) {
        commit('setIsLoading', true, { root: true })
        let response = await this.$axios.$post('users/update_information', payload)
        commit('setIsLoading', false, { root: true })
        return response

    },



}