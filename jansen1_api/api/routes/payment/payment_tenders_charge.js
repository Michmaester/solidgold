const express = require('express');
const router = express.Router();

const PaymentTendersCharge = require('../../models/payment/payment_tenders_charge')


router.get('/', async (req,res,next) => {

    try {

        const results = await PaymentTendersCharge.query()

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