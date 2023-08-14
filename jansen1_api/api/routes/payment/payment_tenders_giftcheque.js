const express = require('express');
const router = express.Router();

const PaymentTendersGiftCheque = require('../../models/payment/payment_tenders_giftcheque')


router.get('/', async (req,res,next) => {

    try {

        const results = await PaymentTendersGiftCheque.query()

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