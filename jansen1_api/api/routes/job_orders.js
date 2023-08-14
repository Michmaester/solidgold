const express = require('express');
const router = express.Router();

const dayjs = require('dayjs');
const authenticateJWT = require('../middlewares/authenticateJWT')

const Generator = require('../utils/reference_generator')
const JobOrders = require('../models/joborders/job_orders')
const JobOrderItems = require('../models/joborders/job_order_items')
const Helpers = require('../utils/helpers')



router.get('/', async (req, res, next) => {

    try {

        const params = req.query

        const branch_code = req.headers.xbranchcode

        let query = JobOrders.query().withGraphFetched('[customer,items.product]')

        query = Helpers.queryFilters(params, query)

        query.where('branch_code', branch_code)

        const query_results = await query

        res.status(200).json({
            status: 'ok',
            data: query_results
        })

    } catch (error) {
        next(error)
    }

})



// insert JO + JO items
router.post('/', authenticateJWT, async (req, res, next) => {

    try {

        await JobOrders.transaction(async trx => {

            const payload = req.body

            const jo = payload.jo
            const jo_items = payload.jo_items

            //generate product_id
            const newJobOrderNo = await Generator.GenerateReference(trx, 'job_order')

            jo.job_order_no = newJobOrderNo + Generator.RandomNumberGenerator()


            const jo_order = await JobOrders.query(trx)
                .insert({
                    job_order_no: jo.job_order_no,
                    customer_id: jo.customer.customer_id,
                    jo_created: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    jo_completed: null,
                    remarks: jo.remarks,
                    status: 'Created',
                    created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    created_by: req.user.user_id
                })


            for (var i = 0; i < jo_items.length; i++) {

                await JobOrderItems.query(trx)
                    .insert({
                        job_order_no: jo.job_order_no,
                        item_no: jo_items[i].item.product_id,
                        quantity: jo_items[i].quantity

                    })
            }

            await Generator.UpdateRunningValue(trx, 'job_order', newJobOrderNo)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully create a new job order.'
            })
        })

    } catch (error) {
        next(error)
    }

})

// update JO + JO items
router.put('/', authenticateJWT, async (req, res, next) => {

    try {

        await JobOrders.transaction(async trx => {

            const payload = req.body

            const jo = payload.jo
            const jo_items = payload.jo_items

            await JobOrders.query(trx)
                .patch({
                    customer_id: jo.customer.customer_id,
                    remarks: jo.remarks,
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.user.user_id
                })
                .where('job_order_no', jo.job_order_no)


            //delete
            await JobOrderItems.query(trx).delete().where('job_order_no', jo.job_order_no)


            //insert
            for (var i = 0; i < jo_items.length; i++) {

                await JobOrderItems.query(trx)
                    .insert({
                        job_order_no: jo.job_order_no,
                        item_no: jo_items[i].item.product_id,
                        quantity: jo_items[i].quantity

                    })
            }

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully update the job order.'
            })
        })



    } catch (error) {
        next(error)
    }

})



// update JO status
router.post('/update_status', authenticateJWT, async (req, res, next) => {

    try {

        await JobOrders.transaction(async trx => {

            const payload = req.body
            const jos = payload.job_orders
            const status = payload.status

            for (var i = 0; i < jos.length; i++) {

                await JobOrders.query(trx)
                    .patch({
                        status: status,
                        jo_completed: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        updated_by: req.user.user_id
                    })
                    .where('job_order_no', jos[i])

            }

            //const results = await JobOrders.query()

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully udpated status.'
            })
        })




    } catch (error) {
        next(error)
    }

})




module.exports = router;