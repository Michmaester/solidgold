const express = require('express');
const router = express.Router();

const Branches = require('../../models/masterdata/branches')
const authenticateJWT = require('../../middlewares/authenticateJWT')

router.get('/', async (req, res, next) => {

    try {

        const results = await Branches.query()

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