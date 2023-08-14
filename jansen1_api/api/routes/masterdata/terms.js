const express = require('express');
const router = express.Router();

const Terms = require('../../models/masterdata/terms')
const authenticateJWT = require('../../middlewares/authenticateJWT')


router.get('/', async (req, res, next) => {

    try {

        const results = await Terms.query()

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