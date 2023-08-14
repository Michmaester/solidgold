const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');

const Users = require('../models/users')
const Roles = require('../models/auth/roles')

router.get('/', async (req, res, next) => {

    try {
        const results = await Users.query().withGraphFetched('[role_permissions.permissions]')

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})

router.get('/single/:username', async (req, res, next) => {

    try {
        const username = req.params.username
        const results = await Users.query()
            .withGraphFetched('[role_permissions.permissions]')
            .where('username', username)
            .first()

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})

router.get('/roles', async (req, res, next) => {

    try {

        const results = await Roles.query()

        res.status(200).json({
            status: 'ok',
            data: results
        })

    } catch (error) {
        next(error)
    }

})

router.post('/update_information', async (req, res, next) => {

    try {

        const payload = req.body

        let hashPassword = null

        // hash the plain password

        if (payload.password) {
            const salt = await bcrypt.genSalt(10)
            hashPassword = await bcrypt.hash(payload.password, salt)
        }

        let userObj = {
            department: payload.department,
            fullname: payload.fullname,
            password: hashPassword,
            position: payload.position,
            role: payload.role,
            status: payload.status,
            username: payload.username
        }

        if (payload.password === null) {
            delete userObj.password;
        }

        const results = await Users.query().patch(userObj).where('user_id', payload.user_id)



        res.status(200).json({
            status: 'ok',
            title: 'Success',
            message: 'Succesfully update the user information.'
        })

    } catch (error) {
        next(error)
    }
})

module.exports = router;