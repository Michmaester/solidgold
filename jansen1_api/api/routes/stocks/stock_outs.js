const express = require('express');
const router = express.Router();

const dayjs = require('dayjs');
const authenticateJWT = require('../../middlewares/authenticateJWT')

const StockOuts = require('../../models/stocks/stock_outs');
const Helpers = require('../../utils/helpers')


router.get('/', async (req, res, next) => {

    try {
        // const branch_code = req.headers.xbranchcode
        // const results = await StockOuts.query()
        //                     .withGraphFetched('[product,branch]')
        //                     .where('branch_code',branch_code)

        // res.status(200).json({
        //     status : 'ok',
        //     total_counts : results.length,
        //     data : results
        // })


        // const params = req.query

        // const branch_code = req.headers.xbranchcode

        // let query = StockOuts.query().withGraphFetched('[product,branch]')

        // query = Helpers.queryFilters(params, query)

        // if (params.page) query.page(parseInt(params.page) - 1, params.pageSize)
        // if (params.sort_by) query.orderBy(params.sort_by, params.sort_order)

        // query.where('branch_code', branch_code)

        // const query_results = await query


        // res.status(200).json({
        //     status: 'ok',
        //     data: query_results
        // })

        const params = req.query

        const branch_code = req.headers.xbranchcode

        let query = StockOuts.query()
            .joinRelated('product')
            .joinRelated('brand')
            .joinRelated('unit')
            .select(
                'stock_outs.*',
                'product.name as product_name',
                'product.description as product_description',
                'product.product_code',
                'product.category_ref_id',
                'brand.brandname',
                'unit.*'
            )

        query.where('stock_outs.branch_code', branch_code)
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

router.get('/branch/:branch_code', async (req, res, next) => {

    try {

        const branch_code = req.params.branch_code
        const results = await StockOuts.query()
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

router.get('/:stockout_id', async (req, res, next) => {

    try {

        const stockout_id = req.params.stockout_id
        const results = await StockOuts.query()
            .where('stockout_id', stockout_id)
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
        const result = await StockOuts.query()
            .insert({
                product_id: payload.product_id,
                qty: payload.qty,
                qty_instock: payload.qty_instock,
                unit: payload.unit,
                stockout_date: payload.stockout_date,
                branch_code: payload.branch_code
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



router.put('/', async (req, res, next) => {

    try {

        var payload = req.body

        const result = await StockOuts.query()
            .where('stockout_id', payload.stockout_id)
            .patch({
                product_id: payload.product_id,
                qty: payload.qty,
                qty_instock: payload.qty_instock,
                unit: payload.unit,
                stockout_date: payload.stockout_date,
                branch_code: payload.branch_code
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




// router.delete('/', async (req,res,next) => {

//     try {

//         var payload = req.body
//         const result = await StockVales.query()
//                             .where('stock_vale_no',payload.stock_vale_no)
//                             .delete()

//         res.status(200).json({
//             status : 'ok',
//             total_counts : result.length,
//             data : result
//         })

//     } catch (error) {
//         next(error)
//     }

// })



module.exports = router;