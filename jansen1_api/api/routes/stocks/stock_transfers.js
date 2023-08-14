const express = require('express');
const router = express.Router();

const dayjs = require('dayjs');
const authenticateJWT = require('../../middlewares/authenticateJWT')

const StockTransfers = require('../../models/stocks/stock_transfers');
const StockTransferItems = require('../../models/stocks/stock_transfer_items');
const Generator = require('../../utils/reference_generator')
const StocksUtil = require('../../utils/stocks_util')
const Helpers = require('../../utils/helpers')


router.get('/', async (req, res, next) => {

    try {

        const params = req.query

        const branch_code = req.headers.xbranchcode

        let query = StockTransfers.query().withGraphFetched('[items.product.[brand,unit]]')

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

router.get('/branch/:branch_code', async (req, res, next) => {

    try {

        const branch_code = req.params.branch_code
        const results = await StockTransfers.query()
            .where('branch_code', branch_code)
            .withGraphFetched('items')

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})

router.get('/:stock_transfer_no', async (req, res, next) => {

    try {

        const stock_transfer_no = req.params.stock_transfer_no
        const results = await StockTransfers.query()
            .where('stock_transfer_no', stock_transfer_no)
            .withGraphFetched('items')
            .first()

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})


router.get('/fullfilling/:branch_code', async (req, res, next) => {

    try {

        const branch_code = req.params.branch_code
        const params = req.query

        let query = StockTransfers.query().withGraphFetched('[items.product.[brand,unit]]')

        query = Helpers.queryFilters(params, query)
        query.where('fulfilling_branch_code', branch_code)
        const query_results = await query

        res.status(200).json({
            status: 'ok',
            data: query_results
        })

    } catch (error) {
        next(error)
    }

})

router.get('/requesting/:branch_code', async (req, res, next) => {

    try {

        const branch_code = req.params.branch_code
        const results = await StockTransfers.query()
            .where('requesting_branch_code', branch_code)
            .withGraphFetched('items')

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})


router.get('/status/:status', async (req, res, next) => {

    try {

        const status = req.params.status
        const results = await StockTransfers.query()
            .where('status', status)
            .withGraphFetched('items')

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})


router.get('/status/:status/branch/:branch_code', async (req, res, next) => {

    try {

        const status = req.params.status
        const branch_code = req.params.branch_code

        const results = await StockTransfers.query()
            .where('status', status)
            .where('branch_code', branch_code)
            .withGraphFetched('items')

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})






// make a new stock transfer
router.post('/', authenticateJWT, async (req, res, next) => {

    try {

        await StockTransfers.transaction(async trx => {

            const payload = req.body

            const stock_transfer = payload.stock_transfer
            const items = payload.items

            const newStockTransferNo = await Generator.GenerateReference(trx, 'stock_transfer')

            stock_transfer.stock_transfer_no = newStockTransferNo + Generator.RandomNumberGenerator()

            const result = await StockTransfers.query(trx)
                .insert({
                    stock_transfer_no: stock_transfer.stock_transfer_no,
                    status: 'REQUEST',
                    requesting_branch_code: stock_transfer.requesting_branch_code,
                    fulfilling_branch_code: stock_transfer.fulfilling_branch_code,
                    date_requested: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    date_fulfilled: stock_transfer.date_fulfilled,
                    user_requesting: req.user.user_id,
                    user_fulfilling: stock_transfer.user_fulfilling,
                    branch_code: stock_transfer.requesting_branch_code,
                    created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    created_by: req.user.user_id,
                    remarks: stock_transfer.remarks
                })

            for (var i = 0; i < items.length; i++) {

                await StockTransferItems.query(trx)
                    .insert({
                        stock_transfer_no: stock_transfer.stock_transfer_no,
                        requested_product_id: items[i].product.product_id,
                        requested_qty: items[i].request_qty
                    })
            }

            await Generator.UpdateRunningValue(trx, 'stock_transfer', newStockTransferNo)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully created a new stock transfer request.'
            })

        })

    } catch (error) {
        next(error)
    }

})


// stock transfer is proeess by the fulfilling branch
router.post('/process', authenticateJWT, async (req, res, next) => {

    try {

        await StockTransfers.transaction(async trx => {

            const payload = req.body

            const stock_transfer = payload.stock_transfer
            const items = payload.items



            // ==============================

            // Stock transfer is process by the fulfilling branch
            // 1. update the stock transfer items with the fulfilling qty.
            // 2. update the status of the stock transfer to "REQUEST FULFILLED"


            // 3. NEED to THINK (perform a stock out for the fulfilling branch)
            // we need stock out and put the stock temporarirly on a table
            // if the requester will cancel, then it will be reverted  and perform "Stockin"

            //wtf!

            for (var i = 0; i < items.length; i++) {

                await StockTransferItems.query(trx)
                    .patch({
                        fulfilled_qty: items[i].fulfilled_qty
                    })
                    .where('id', items[i].id)

                // injectthe product id
                items[i]['product_id'] = items[i].product.product_id

                // Stock outs
                let data = {
                    item: items[i],
                    branch_code: stock_transfer.fulfilling_branch_code,
                    user_id: req.user.user_id,
                    item_qty: items[i].fulfilled_qty,
                    type: 'stock_transfer',
                    ref_field: 'stock_transfer_no'
                }

                await StocksUtil.ProcessStockOuts(trx, data)
            }

            await StockTransfers.query(trx)
                .patch({
                    status: 'REQUEST-FULFILLED',
                    date_fulfilled: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    user_fulfilling: req.user.user_id,
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.user.user_id
                })
                .where('stock_transfer_no', stock_transfer.stock_transfer_no)

            // await Generator.UpdateRunningValue(trx,'sales_order',newStockTransferNo)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully process a stock transfer request.'
            })

        })

    } catch (error) {
        next(error)
    }

})


// accept the fulffiled transfer by the fulfilling branch
router.post('/branch_accept', authenticateJWT, async (req, res, next) => {

    try {

        await StockTransfers.transaction(async trx => {

            const payload = req.body

            const stock_transfer = payload.stock_transfer
            const items = stock_transfer.items


            for (var i = 0; i < items.length; i++) {

                // await StockTransferItems.query(trx)
                //                 .patch({
                //                     fulfilled_qty : items[i].fulfilled_qty
                //                 })
                //                 .where('id',items[i].id)

                // inject the product id
                items[i]['product_id'] = items[i].requested_product_id


                // Stock ins
                let data = {
                    item: items[i],
                    branch_code: stock_transfer.requesting_branch_code,
                    user_id: req.user.user_id,
                    item_qty: items[i].fulfilled_qty,
                    type: 'stock_transfer',
                    ref_field: 'stock_transfer_no'
                }

                await StocksUtil.ProcessStockIns(trx, data)

            }


            await StockTransfers.query(trx)
                .patch({
                    status: 'COMPLETED',
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.user.user_id
                })
                .where('stock_transfer_no', stock_transfer.stock_transfer_no)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully accepted a stock transfer.'
            })

        })

    } catch (error) {
        next(error)
    }

})


// Cancel the fulffiled transfer by the fulfilling branch
router.post('/branch_revert_accept', authenticateJWT, async (req, res, next) => {

    try {

        await StockTransfers.transaction(async trx => {

            const payload = req.body

            const stock_transfer = payload.stock_transfer
            const items = stock_transfer.items

            /*

            Revert : means, the fulfilled items by the fulfillinf branch which are Deducted to its stock
            must be returned to its stock ang cancel the stock transfer.
            */


            for (var i = 0; i < items.length; i++) {

                // await StockTransferItems.query(trx)
                //                 .patch({
                //                     fulfilled_qty : items[i].fulfilled_qty
                //                 })
                //                 .where('id',items[i].id)

                // inject the product id
                items[i]['product_id'] = items[i].requested_product_id


                // Stock Ins
                let data = {
                    item: items[i],
                    branch_code: stock_transfer.fulfilling_branch_code,
                    user_id: req.user.user_id,
                    item_qty: items[i].fulfilled_qty,
                    type: 'stock_transfer',
                    ref_field: 'stock_transfer_no'
                }

                await StocksUtil.ProcessStockIns(trx, data)

            }


            await StockTransfers.query(trx)
                .patch({
                    status: 'REVERTED',
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.user.user_id
                })
                .where('stock_transfer_no', stock_transfer.stock_transfer_no)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully reverted a stock transfer.'
            })

        })

    } catch (error) {
        next(error)
    }

})





router.patch('/', async (req, res, next) => {

    try {

        var payload = req.body

        const result = await StockTransfers.query()
            .where('stock_transfer_no', payload.stock_transfer_no)
            .patch({
                status: payload.status,
                requesting_branch_code: payload.requesting_branch_code,
                fullfilling_branch_code: payload.fullfilling_branch_code,
                date_requested: payload.date_requested,
                date_fulfilled: payload.date_fulfilled,
                user_requesting: payload.user_requesting,
                user_fulfilling: payload.user_fulfilling,
                is_own_request: payload.is_own_request,
                branch_code: payload.branch_code,

            })

        res.status(200).json({
            status: 'ok',
            total_counts: result.length,
            data: result
        })

    } catch (error) {
        next(error)
    }

})

router.patch('/status', async (req, res, next) => {

    try {

        var payload = req.body
        const result = await StockTransfers.query()
            .where('stock_transfer_no', payload.stock_transfer_no)
            .patch({
                status: payload.status
            })

        res.status(200).json({
            status: 'ok',
            total_counts: result.length,
            data: result
        })

    } catch (error) {
        next(error)
    }

})



router.delete('/', async (req, res, next) => {

    try {

        var payload = req.body
        const result = await StockTransfers.query()
            .where('stock_transfer_no', payload.stock_transfer_no)
            .delete()

        res.status(200).json({
            status: 'ok',
            total_counts: result.length,
            data: result
        })

    } catch (error) {
        next(error)
    }

})


router.post('/allow_reprint', authenticateJWT, async (req, res, next) => {

    try {

        await StockTransfers.transaction(async trx => {

            const stock_transfer = req.body

            await StockTransfers.query(trx)
                .patch({
                    printed: null,
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.user.user_id
                })
                .where('stock_transfer_no', stock_transfer.stock_transfer_no)
                .andWhere('branch_code', stock_transfer.branch_code)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully allowed reprinting.'
            })

        })

    } catch (error) {
        next(error)
    }

})



module.exports = router;