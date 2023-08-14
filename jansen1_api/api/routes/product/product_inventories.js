const express = require('express');
const router = express.Router();

const ProductInventories = require('../../models/products/product_inventories');
const authenticateJWT = require('../../middlewares/authenticateJWT')

router.get('/', async (req, res, next) => {

    try {
        const results = await ProductInventories.query()

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