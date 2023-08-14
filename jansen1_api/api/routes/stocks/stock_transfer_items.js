const express = require('express');
const router = express.Router();

const StockTransferItems = require('../../models/stocks/stock_transfer_items')

router.get('/', async (req, res, next) => {

    try {
        const results = await StockTransferItems.query()
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