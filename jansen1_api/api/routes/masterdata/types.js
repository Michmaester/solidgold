const express = require('express');
const router = express.Router();

const Types = require('../../models/masterdata/types')


router.get('/', async (req, res, next) => {

    try {

        const results = await Types.query()

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})

router.get('/category/:category_id', async (req, res, next) => {

    try {

        const category_id = req.params.category_id

        const results = await Types.query().where('category_id', category_id)

        res.status(200).json({
            status: 'ok',
            data: results
        })

    } catch (error) {
        next(error)
    }

})

router.post('/', async (req, res, next) => {

    try {

        const payload = req.body

        const results = await Types.query()
            .insert(payload)

        res.status(200).json({
            status: 'ok',
            title: 'Successful',
            message: 'Successfully created a new type.',
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

        const results = await Types.query()
            .updateAndFetchById(payload.id, payload);

        res.status(200).json({
            status: 'ok',
            title: 'Successful',
            message: 'Successfully update a type.',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})


module.exports = router;