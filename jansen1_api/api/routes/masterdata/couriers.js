const express = require('express');
const router = express.Router();

const Couriers = require('../../models/masterdata/couriers')
const authenticateJWT = require('../../middlewares/authenticateJWT')

router.get('/', async (req, res, next) => {

    try {

        const results = await Couriers.query()

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})


module.exports = router;