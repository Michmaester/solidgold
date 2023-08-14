const express = require('express');
const router = express.Router();

const Banks = require('../../models/masterdata/banks')
const authenticateJWT = require('../../middlewares/authenticateJWT')


router.get('/', async (req, res, next) => {

    try {

        const results = await Banks.query()

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})


router.post('/', async (req, res, next) => {

    try {

        const payload = req.body

        const results = await Banks.query()
            .insert({
                name: payload.name,
                branch_name: payload.branch_name,
                branch_address: payload.branch_address
            })

        res.status(200).json({
            status: 'ok',
            title: 'Successful',
            message: 'Successfully created a new bank.'
        })

    } catch (error) {
        next(error)
    }

})


router.post('/update', async (req, res, next) => {

    try {

        const payload = req.body

        const results = await Banks.query().patch({
            name: payload.name,
            branch_name: payload.branch_name,
            branch_address: payload.branch_address
        }).where('id', payload.id)

        res.status(200).json({
            status: 'ok',
            title: 'Successful',
            message: 'Successfully updated a bank.'
        })

    } catch (error) {
        next(error)
    }

})


module.exports = router;