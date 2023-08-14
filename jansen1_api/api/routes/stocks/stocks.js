const express = require('express');
const router = express.Router();

const dayjs = require('dayjs');
const _ = require('lodash');
const authenticateJWT = require('../../middlewares/authenticateJWT')

const Stocks = require('../../models/stocks/stocks');
const Products = require('../../models/products/products');
const Helpers = require('../../utils/helpers')



router.get('/', async (req, res, next) => {

    try {

        const params = req.query

        const branch_code = req.headers.xbranchcode

        let query = Stocks.query()
            .joinRelated('product')
            .joinRelated('brand')
            .joinRelated('unit')
            .select(
                'stocks.*',
                'product.name as product_name',
                'product.description as product_description',
                'product.product_code',
                'product.category_ref_id',
                'brand.brandname',
                'unit.*'
            )

        query.where('stocks.branch_code', branch_code)
        query = Helpers.queryFilters(params, query)

        const query_results = await query

        res.status(200).json({
            status: 'ok',
            data: query_results
        })

    } catch (error) {
        next(error)
    }

})

router.get('/testing', async (req, res, next) => {

    try {

        const params = req.query

        const query_results = await Stocks.query()
            .joinRelated('product')
            .joinRelated('brand')
            .joinRelated('unit')
            .select('stocks.*', 'product.*', 'brand.brandname', 'unit.*')
            .limit(5)


        res.status(200).json({
            status: 'ok',
            data: query_results
        })

    } catch (error) {
        next(error)
    }

})



// get all by branch
router.get('/branch/:branch_code', async (req, res, next) => {

    try {

        const branch_code = req.params.branch_code

        const results = await Stocks.query()
            .where('branch_code', branch_code)
            .withGraphFetched('product')

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})


// branch +  product_id
router.get('/branch/:branch_code/:product_id', async (req, res, next) => {

    try {

        const branch_code = req.params.branch_code
        const product_id = req.params.product_id

        const results = await Stocks.query()
            .where('branch_code', branch_code)
            .where('product_id', product_id)
            .withGraphFetched('product')
            .first()

        res.status(200).json({
            status: 'ok',
            data: results
        })

    } catch (error) {
        next(error)
    }

})


// stock_id
router.get('/:stock_id', async (req, res, next) => {

    try {

        const stock_id = req.params.stock_id

        const results = await Stocks.query()
            .where('stock_id', stock_id)
            .withGraphFetched('product')
            .first()

        res.status(200).json({
            status: 'ok',
            data: results
        })

    } catch (error) {
        next(error)
    }

})



router.post('/', async (req, res, next) => {

    try {

        var payload = req.body

        const result = await Stocks.query()
            .insert({
                product_id: payload.product_id,
                onhand_qty: payload.product_id,
                last_qty: payload.product_id,
                date_onhand_qty: payload.product_id,
                date_last_qty: payload.product_id,
                branch_code: payload.product_id
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


// update the quantity by product_id + branch_code
router.put('/update/:branch_code/:product_id', async (req, res, next) => {

    try {

        var payload = req.body
        const branch_code = req.params.branch_code
        const product_id = req.params.product_id

        // get the record first
        const stock = await Stocks.query()
            .where('branch_code', branch_code)
            .where('product_id', product_id)
            .first()

        // use the existing and add the new onhand_qty
        const date_onhand_qty = dayjs().format('YYYY-MM-DD HH:mm:ss')
        const date_last_qty = stock.date_onhand_qty
        const last_qty = stock.onhand_qty

        const updatedStock = await Stocks.query()
            .where('branch_code', branch_code)
            .where('product_id', product_id)
            .patch({
                onhand_qty: payload.onhand_qty,
                date_onhand_qty: date_onhand_qty,
                last_qty: last_qty,
                date_last_qty: date_last_qty,
                updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                updated_by: req.user.user_id
            })


        res.status(200).json({
            status: 'ok',
            total_counts: updatedStock.length,
            data: updatedStock
        })

    } catch (error) {
        next(error)
    }

})



router.post('/bulk_update_stocks', authenticateJWT, async (req, res, next) => {

    try {

        await Stocks.transaction(async trx => {

            const payload = req.body

            //iterate
            for (let index = 0; index < payload.length; index++) {

                // get the record first
                let stock = await Stocks.query(trx).where('stock_id', payload[index].stock_id).first()

                // use the existing and add the new onhand_qty
                let date_onhand_qty = dayjs().format('YYYY-MM-DD HH:mm:ss')
                let date_last_qty = stock.date_onhand_qty
                let last_qty = stock.onhand_qty

                const updatedStock = await Stocks.query(trx)
                    .where('stock_id', payload[index].stock_id)
                    .patch({
                        onhand_qty: payload[index].onhand_qty,
                        date_onhand_qty: date_onhand_qty,
                        last_qty: last_qty,
                        date_last_qty: date_last_qty,
                        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        updated_by: req.user.user_id
                    })

            }

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully bulk update stocks'
            })

        })


    } catch (error) {
        next(error)
    }

})


// update the quantity by stock_id
router.put('/', authenticateJWT, async (req, res, next) => {

    try {

        var payload = req.body

        // get the record first
        const stock = await Stocks.query()
            .where('stock_id', payload.stock_id)
            .first()

        // use the existing and add the new onhand_qty
        const date_onhand_qty = dayjs().format('YYYY-MM-DD HH:mm:ss')
        const date_last_qty = stock.date_onhand_qty
        const last_qty = stock.onhand_qty


        const updatedStock = await Stocks.query()
            .where('stock_id', payload.stock_id)
            .patch({
                onhand_qty: payload.onhand_qty,
                date_onhand_qty: date_onhand_qty,
                last_qty: last_qty,
                date_last_qty: date_last_qty,
                updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                updated_by: req.user.user_id
            })


        res.status(200).json({
            status: 'ok',
            total_counts: updatedStock.length,
            data: updatedStock,
            title: 'Successfull',
            message: 'Succesfully rebalance the product quantity.'
        })

    } catch (error) {
        next(error)
    }

})

router.put('/restocking', authenticateJWT, async (req, res, next) => {

    try {

        var payload = req.body

        // use the existing and add the new onhand_qty
        const restocking_threshold = payload.restocking_threshold


        const updatedStock = await Stocks.query()
            .where('stock_id', payload.stock_id)
            .patch({
                restocking_threshold: payload.restocking_threshold,
                updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                updated_by: req.user.user_id
            })


        res.status(200).json({
            status: 'ok',
            total_counts: updatedStock.length,
            data: updatedStock,
            title: 'Successful',
            message: 'Succesfully updated thhe restocking threshold'
        })

    } catch (error) {
        next(error)
    }

})


module.exports = router;