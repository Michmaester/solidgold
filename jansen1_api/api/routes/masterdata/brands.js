const express = require('express');
const router = express.Router();

const Brands = require('../../models/masterdata/brands')
const authenticateJWT = require('../../middlewares/authenticateJWT')


router.get('/', async (req, res, next) => {

    try {

        const results = await Brands.query()

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

        const results = await Brands.query()
            .insert({
                brandname: payload.brandname,
                status: payload.status
            })

        res.status(200).json({
            status: 'ok',
            title: 'Successful',
            message: 'Successfully created a new brand.',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})


router.post('/update', async (req, res, next) => {

    try {

        const payload = req.body

        const results = await Brands.query()
            .updateAndFetchById(payload.id, payload);

        res.status(200).json({
            status: 'ok',
            title: 'Successful',
            message: 'Successfully update a brand.',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})


module.exports = router;