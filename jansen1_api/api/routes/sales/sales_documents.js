const express = require('express');
const router = express.Router();

const SalesDocuments = require('../../models/sales/sales_documents')


router.get('/', async (req,res,next) => {

    try {

        const results = await SalesDocuments.query()

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