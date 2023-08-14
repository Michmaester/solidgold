const express = require('express');
const router = express.Router();

const ProductSuppliers = require('../../models/products/product_suppliers');


router.get('/', async (req,res,next) => {

    try {
        const results = await ProductSuppliers.query()

        res.status(200).json({
            status : 'ok',
            total_counts : results.length,
            data : results
        })

    } catch (error) {
        next(error)
    }

})

module.exports = router;