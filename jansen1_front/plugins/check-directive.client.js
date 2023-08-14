import Vue from 'vue'

export default ({ store }) => {

    if (!store.state.auth.loggedIn) {
        return
    }

    const allowed_perms = store.state.auth.user.permissions


    Vue.directive('check', {
        inserted(el, binding, vnode, old) {

            // if (binding.arg == 'disable') { // Check by argument given to directive
            //     if (!allowed_perms.includes(binding.value)) {
            //         vnode.elm.parentElement.removeChild(vnode.elm)
            //         
            //     }
            // }else{
            //     if (!allowed_perms.includes(binding.value)) {
            //         vnode.elm.parentElement.removeChild(vnode.elm)
            //     }
            // }

            // console.log(binding)
            // console.log(el)


            if (!allowed_perms.includes(binding.value)) {
                vnode.elm.parentElement.removeChild(vnode.elm)
            }


        }
    })
}


