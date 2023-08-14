const express = require('express');
const router = express.Router();

const dayjs = require('dayjs');
const authenticateJWT = require('../../middlewares/authenticateJWT')

const SalesDeliveries = require('../../models/sales/sales_deliveries')
const SalesTransactions = require('../../models/sales/sales_transactions')
const SalesTransactionItems = require('../../models/sales/sales_transaction_items')
const StocksUtil = require('../../utils/stocks_util')
const Helpers = require('../../utils/helpers')

router.get('/', async (req, res, next) => {

    try {

        const params = req.query

        const branch_code = req.headers.xbranchcode

        let query = SalesDeliveries.query().withGraphFetched('sales_trans.[customer,trans_items.[product.[brand]]]')
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

router.get('/customer/:customer_id', async (req, res, next) => {

    try {

        //search delivery by customer id
        const customer_id = req.params.customer_id

        let results = await SalesDeliveries.query()
            .withGraphFetched('sales_trans(whereCustomer).[customer]')
            .modifiers({
                whereCustomer(builder) {
                    builder.where('customer_id', customer_id);
                }
            })

        var data = results.filter((item) => { return item.sales_trans != null })

        res.status(200).json({
            status: 'ok',
            total_counts: data.length,
            data: data
        })

    } catch (error) {
        next(error)
    }

})


// confirm delivery

router.post('/confirm_delivery', authenticateJWT, async (req, res, next) => {

    try {

        await SalesDeliveries.transaction(async trx => {

            const payload = req.body
            const sales_delivery = payload.sales_delivery
            const items = payload.items

            for (var i = 0; i < items.length; i++) {

                var newly_delivered_qty = parseInt(items[i].delivered_qty) - parseInt(items[i].old_delivered_qty)

                await SalesTransactionItems.query()
                    .patch({
                        delivered_qty: items[i].delivered_qty,
                        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        updated_by: req.user.user_id
                    })
                    .where('id', items[i].id)

                // Stock outs
                let data = {
                    item: items[i],
                    branch_code: sales_delivery.branch_code,
                    user_id: req.user.user_id,
                    item_qty: newly_delivered_qty,
                    type: 'sales_delivery',
                    ref_field: 'invoice_no'
                }

                await StocksUtil.ProcessStockOuts(trx, data)
            }

            const results = await SalesDeliveries.query()
                .patch({
                    status: 'Delivered',
                    delivered_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.user.user_id
                })
                .where('id', sales_delivery.id)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully confirm the sales delivery.'
            })
        })

    } catch (error) {
        next(error)
    }

})


router.post('/update_status/:status', async (req, res, next) => {

    try {

        const dr_nos = req.body
        const status = req.params.status

        for (var i = dr_nos.length - 1; i >= 0; i--) {
            await SalesDeliveries.query().patch({ status: status }).where('dr_no', dr_nos[i])
        }

        res.status(200).json({
            status: 'ok',
            title: 'Successful',
            message: 'Successfully updated the delivery status.'
        })

    } catch (error) {
        next(error)
    }

})



module.exports = router;