const express = require('express');
const router = express.Router();

const PurchaseOrderItemDeliveries = require('../../models/purchase/purchase_order_item_deliveries')
const authenticateJWT = require('../../middlewares/authenticateJWT')

router.get('/', async (req, res, next) => {

    try {

        const results = await PurchaseOrderItemDeliveries.query()

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