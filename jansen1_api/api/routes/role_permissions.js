const express = require('express');
const router = express.Router();
const lodash = require('lodash')


const Roles = require('../models/auth/roles')
const Permissions = require('../models/auth/permissions')
const RolesPermissions = require('../models/auth/roles_permissions')


router.get('/', async (req, res, next) => {

    try {

        const roles_permissions = await RolesPermissions.query()

        res.status(200).json({
            status: 'ok',
            data: roles_permissions
        })
    } catch (error) {
        next(error)
    }

})







/* 
    Roles
*/

router.get('/roles', async (req, res, next) => {

    try {

        const roles = await Roles.query()

        res.status(200).json({
            status: 'ok',
            data: roles
        })
    } catch (error) {
        next(error)
    }

})

// get role + its permissions + not use permissions
router.get('/roles/:role_id', async (req, res, next) => {

    try {
        const role_id = req.params.role_id

        const permissions = await Permissions.query()

        //get the role_perm of role specified
        const roleperms = await RolesPermissions.query().where('role_id', role_id)
        let arr_roleperms = roleperms.map(item => { return item.perm_id })

        //merge the two data
        for (var i = 0; i < permissions.length; i++) {
            let res = arr_roleperms.includes(permissions[i].perm_id)
            permissions[i]['enabled'] = res
        }

        var mods = lodash.uniqBy(permissions, (item) => { return item.mod_name }).map(item => { return item.mod_name })

        let allmod_perms = []

        for (var i = 0; i < mods.length; i++) {

            var modlist = permissions.filter(item => {
                return item.mod_name === mods[i] && item.submod_name === null
            }).map(item => {
                return {
                    perm_id: item.perm_id,
                    mod_name: item.mod_name,
                    submod_name: item.submod_name,
                    perm_name: item.perm_name,
                    perm_desc: item.perm_desc,
                    enabled: item.enabled
                }
            })

            var modlist_filtered = permissions.filter(item => {
                return item.mod_name === mods[i] && item.submod_name !== null
            })

            var submods = lodash.uniqBy(modlist_filtered, (item) => { return item.submod_name }).map(item => { return item.submod_name })

            var submods_arr = []
            for (var j = 0; j < submods.length; j++) {

                var perms = permissions.filter(item => {
                    return item.mod_name === mods[i] && item.submod_name === submods[j]
                }).map(item => { return { perm_id: item.perm_id, perm_name: item.perm_name, enabled: item.enabled } })

                var obj = {
                    mod_name: mods[i],
                    submod_name: submods[j],
                    permissions: perms
                }

                submods_arr.push(obj)
            }

            allmod_perms.push(...modlist, ...submods_arr)

        }

        res.status(200).json({
            status: 'ok',
            data: allmod_perms
        })
    } catch (error) {
        next(error)
    }

})



/* 
    Permissions
*/
router.get('/permissions', async (req, res, next) => {

    try {
        const permissions = await Permissions.query()

        res.status(200).json({
            status: 'ok',
            data: permissions
        })

    } catch (error) {
        next(error)
    }

})






// Save the permissions

router.post('/', async (req, res, next) => {

    try {

        await RolesPermissions.transaction(async trx => {

            const payload = req.body
            const permissions = payload.permissions
            const role = payload.role

            //console.log(permissions)
            //console.log(role)

            // get the roleid
            //delete the records on roles_permissions base on role_id
            await RolesPermissions.query(trx).where('role_id', role.role_id).delete()

            var arr_newperms = []
            for (var i = 0; i < permissions.length; i++) {

                if (permissions[i].hasOwnProperty('permissions')) {
                    var subperms = permissions[i].permissions
                    //iterate
                    for (var j = 0; j < subperms.length; j++) {
                        if (subperms[j].enabled) {
                            arr_newperms.push({ role_id: role.role_id, perm_id: subperms[j].perm_id })
                        }
                    }
                } else {
                    if (permissions[i].enabled) {
                        arr_newperms.push({ role_id: role.role_id, perm_id: permissions[i].perm_id })
                    }
                }

            }

            for (var i = 0; i < arr_newperms.length; i++) {
                await RolesPermissions.query(trx).insert(arr_newperms[i])
            }


            //iterate over and insert

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully updated the permisssions.'
            })

        })



    } catch (error) {
        next(error)
    }

})


module.exports = router;