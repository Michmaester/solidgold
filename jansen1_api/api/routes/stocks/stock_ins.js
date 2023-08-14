const express = require('express');
const router = express.Router();

const dayjs = require('dayjs');
const authenticateJWT = require('../../middlewares/authenticateJWT')

const StockIns = require('../../models/stocks/stock_ins');
const Helpers = require('../../utils/helpers')


router.get('/', async (req, res, next) => {

    try {

        // const params = req.query

        // const branch_code = req.headers.xbranchcode

        // let query = StockIns.query().withGraphFetched('[product,branch]')

        // query = Helpers.queryFilters(params, query)
        // query.where('branch_code', branch_code)
        // const query_results = await query


        // res.status(200).json({
        //     status: 'ok',
        //     data: query_results
        // })


        const params = req.query

        const branch_code = req.headers.xbranchcode

        let query = StockIns.query()
            .joinRelated('product')
            .joinRelated('brand')
            .joinRelated('unit')
            .select(
                'stock_ins.*',
                'product.name as product_name',
                'product.description as product_description',
                'product.product_code',
                'product.category_ref_id',
                'brand.brandname',
                'unit.*'
            )

        query.where('stock_ins.branch_code', branch_code)
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
        const results = await StockIns.query()
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

router.get('/:stockin_id', async (req, res, next) => {

    try {

        const stockin_id = req.params.stockin_id
        const results = await StockIns.query()
            .where('stockin_id', stockin_id)
            .withGraphFetched('product')
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

module.exports = router;