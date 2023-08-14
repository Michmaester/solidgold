const express = require('express');
const router = express.Router();

const Colors = require('../../models/masterdata/colors')
const authenticateJWT = require('../../middlewares/authenticateJWT')


router.get('/', async (req, res, next) => {

    try {

        const results = await Colors.query()

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

        const results = await Colors.query()
            .insert(payload)

        res.status(200).json({
            status: 'ok',
            title: 'Successful',
            message: 'Successfully created a new color.',
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

        const results = await Colors.query()
            .updateAndFetchById(payload.id, payload);

        res.status(200).json({
            status: 'ok',
            title: 'Successful',
            message: 'Successfully update a color.',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})



module.exports = router;