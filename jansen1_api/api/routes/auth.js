const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Users = require('../models/users')
dotenv.config();

const authenticateJWT = require('../middlewares/authenticateJWT')


router.post('/login', async (req, res, next) => {

    try {

        await Users.transaction(async trx => {

            const payload = req.body

            // validate request
            // check the username in the database
            const user = await Users.query(trx).findOne('username', payload.username)

            //console.log(user)

            if (user) {
                // compare password
                const isValidPass = await bcrypt.compare(payload.password, user.password)
                if (isValidPass) {


                    // query the user permissions base on its role
                    const userdetails = await Users.query()
                        .withGraphFetched('[role_permissions.permissions]')
                        .where('user_id', user.user_id)
                        .first()

                    var mapped_perms = userdetails.role_permissions.permissions.map(item => {
                        return item.perm_name
                    })

                    //generate a token
                    const loggedUser = {
                        user_id: userdetails.user_id,
                        username: userdetails.username,
                        fullname: userdetails.fullname,
                        position: userdetails.position,
                        department: userdetails.department,
                        role: userdetails.role,
                        permissions: mapped_perms
                    }
                    const token = jwt.sign({ user: loggedUser }, process.env.JWT_TOKEN)

                    return res.status(200).send({
                        'user': loggedUser,
                        'token': token
                    })
                } else {
                    return res.status(401).send({
                        'message': 'Password is incorrect.'
                    })
                }
            } else {
                return res.status(404).send({
                    'message': 'Username not Found.'
                })
            }
        });

    } catch (error) {
        next(error)
    }

})


router.post('/register', async (req, res, next) => {

    try {

        await Users.transaction(async trx => {

            const payload = req.body

            // validate request

            // hash the plain password
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(payload.password, salt)


            // insert
            const user = await Users.query(trx).insert({
                username: payload.username,
                password: hashPassword,
                fullname: payload.fullname,
                position: payload.position,
                department: payload.department
            })

            // generate token

            // send response

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully created a user.',
                total_counts: user.length,
                data: user.id
            })

        });

    } catch (error) {
        next(error)
    }

})



router.post('/me', authenticateJWT, async (req, res, next) => {

    try {

        res.status(200).json(req.user)

    } catch (error) {
        next(error)
    }

})


module.exports = router;