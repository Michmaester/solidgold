const express = require('express');
const router = express.Router();

// const dayjs = require('dayjs');
// const authenticateJWT = require('../middlewares/authenticateJWT')

// const Generator = require('../utils/reference_generator')
// const JobOrders = require('../models/joborders/job_orders')
// const JobOrderItems = require('../models/joborders/job_order_items')
// const Helpers = require('../utils/helpers')



router.get('/', async (req, res, next) => {

    try {
        res.status(200).json({
            status: 'ok',
            message: 'testing biometric infos'
        })

    } catch (error) {
        next(error)
    }

})



module.exports = router;