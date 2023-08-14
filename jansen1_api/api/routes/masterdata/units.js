const express = require('express');
const router = express.Router();

const Units = require('../../models/masterdata/units')
const authenticateJWT = require('../../middlewares/authenticateJWT')

router.get('/', async (req, res, next) => {

    try {

        const results = await Units.query()

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

        const results = await Units.query()
            .insert(payload)

        res.status(200).json({
            status: 'ok',
            title: 'Successful',
            message: 'Successfully created a new unit.',
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

        const results = await Units.query()
            .updateAndFetchById(payload.id, payload);

        res.status(200).json({
            status: 'ok',
            title: 'Successful',
            message: 'Successfully update a unit.',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})


module.exports = router;