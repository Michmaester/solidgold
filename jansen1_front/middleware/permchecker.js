import http from 'http'

export default function ({ route, app, store, redirect }) {

    if (!store.state.auth.loggedIn) {
        return
    }

    let allowed_perms = store.state.auth.user.permissions

    const module = route.meta.reduce((module, meta) => meta.module || module, null)

    if (!module) {
        return
    }

    //concat "view"
    let module_perm = 'view-' + module
    let permitted = allowed_perms.includes(module_perm)

    if (!permitted) {
        return redirect('/route_not_allowed')
    }

}