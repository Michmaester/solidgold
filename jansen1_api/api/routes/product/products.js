const express = require('express');
const router = express.Router();

const dayjs = require('dayjs');
const authenticateJWT = require('../../middlewares/authenticateJWT')

const Generator = require('../../utils/reference_generator')
const Products = require('../../models/products/products');
const ProductPrice = require('../../models/products/product_prices')
const ProductPricesHistory = require('../../models/products/product_prices_history')

const Stocks = require('../../models/stocks/stocks')
const Branches = require('../../models/masterdata/branches')
const Helpers = require('../../utils/helpers')





router.get('/', async (req, res, next) => {

    try {

        const params = req.query

        let query = Products.query().withGraphFetched('[unit,brand,stock,price]')
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

router.get('/search_by_name', async (req, res, next) => {

    try {
        const params = req.query

        let data = await Products.query().where('name', 'like', '%' + params.searchterm + '%')

        res.status(200).json({
            status: 'ok',
            data: data
        })

    } catch (error) {
        next(error)
    }

})

router.get('/search_by_code', async (req, res, next) => {

    try {
        const params = req.query

        let data = []

        // add combination of search code + name
        if (params.searchtype === 'mixed') {
            data = await Products.query()
                .where('product_code', 'like', '%' + params.searchterm + '%')
                .orWhere('name', 'like', '%' + params.searchterm + '%')
                .withGraphFetched('[brand,unit,category,price]')
        } else {
            data = await Products.query()
                .where('product_code', 'like', '%' + params.searchterm + '%')
                .withGraphFetched('[brand,unit,category,price]')
        }



        res.status(200).json({
            status: 'ok',
            data: data
        })

    } catch (error) {
        next(error)
    }

})

router.get('/all_products', async (req, res, next) => {

    try {

        const params = req.query

        let query = Products.query().withGraphFetched('[unit,brand,stock,price]')
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



router.get('/onhand_stock/:product_id', async (req, res, next) => {

    try {

        const product_id = req.params.product_id
        const branch_code = req.headers.xbranchcode

        const stock = await Stocks.query().where('product_id', product_id).andWhere('branch_code', branch_code).first()

        res.status(200).json({
            status: 'ok',
            data: stock
        })

    } catch (error) {
        next(error)
    }

})

router.get('/single_product/:product_id', async (req, res, next) => {

    try {

        const product_id = req.params.product_id

        const product = await Products.query().where('product_id', product_id).withGraphFetched('[brand,unit]').first()

        res.status(200).json({
            status: 'ok',
            data: product
        })

    } catch (error) {
        next(error)
    }

})


router.get('/by_criteria', async (req, res, next) => {

    try {

        const params = req.query

        let query = Products.query().withGraphFetched('[price,brand,unit,category,stock]')
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

router.post('/', authenticateJWT, async (req, res, next) => {

    try {

        await Products.transaction(async trx => {

            const payload = req.body
            const price = payload.price

            //generate product_id
            const newProductId = await Generator.GenerateReference(trx, 'product')
            payload.product_id = newProductId

            //insert product
            const product = await Products.query(trx)
                .insert({
                    product_id: payload.product_id,
                    name: payload.name,
                    product_code: payload.product_code,
                    description: payload.description,
                    status: payload.status,
                    brand_id: payload.brand_id,
                    division_ref_id: payload.division_ref_id,
                    category_ref_id: payload.category_ref_id,
                    type_ref_id: payload.type_ref_id,
                    product_unit_id: payload.product_unit_id,
                    on_order_qty: payload.on_order_qty,
                    on_PO: payload.on_PO,
                    created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    created_by: req.user.user_id
                })

            //insert product price
            await ProductPrice.query(trx)
                .insert({
                    product_id: payload.product_id,
                    cost: price.cost,
                    retail: price.retail,
                    wholesale: price.wholesale,
                    effective_date: dayjs().format('YYYY-MM-DD'),
                    status: 'active',
                    type: 'Regular',
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.user.user_id

                })
                .where('product_id', payload.product_id)

            //insert product prioce history
            await ProductPricesHistory.query(trx)
                .insert({
                    product_id: payload.product_id,
                    cost: price.cost,
                    retail: price.retail,
                    wholesale: price.wholesale,
                    created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    created_by: req.user.user_id

                })

            //check product if in inventory, if not then insert it
            //get all branches

            const branches = await Branches.query(trx)
            const mappedBranches = branches.map(item => { return item.branch_code })

            for (const branch of mappedBranches) {
                //query stocks
                const stockres = await Stocks.query(trx).where('product_id', payload.product_id).andWhere('branch_code', branch).first()

                if (!stockres) {
                    //console.log(branch + ' no exist ---> insert');

                    await Stocks.query(trx).insert({
                        product_id: payload.product_id,
                        onhand_qty: 0,
                        last_qty: 0,
                        date_onhand_qty: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        date_last_qty: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        restocking_threshold: 0,
                        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        updated_by: req.user.user_id,
                        branch_code: branch

                    })
                }
            }

            await Generator.UpdateRunningValue(trx, 'product', newProductId)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully created a new product.',
                total_counts: product.length,
                data: product
            })

        });

    } catch (error) {
        next(error)
    }

})


router.post('/update', authenticateJWT, async (req, res, next) => {

    try {

        await Products.transaction(async trx => {

            const payload = req.body
            const price = payload.price

            //update product table
            await Products.query(trx)
                .patch({
                    name: payload.name,
                    product_code: payload.product_code,
                    description: payload.description,
                    status: payload.status,
                    brand_id: payload.brand_id,
                    division_ref_id: payload.division_ref_id,
                    category_ref_id: payload.category_ref_id,
                    type_ref_id: payload.type_ref_id,
                    product_unit_id: payload.product_unit_id,
                    on_order_qty: payload.on_order_qty,
                    on_PO: payload.on_PO,
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.user.user_id

                })
                .where('id', payload.id)


            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully updated a product.'
            })

        })


    } catch (error) {
        next(error)
    }

})


router.post('/bulk_update_pricing', authenticateJWT, async (req, res, next) => {

    try {

        await Products.transaction(async trx => {

            const payload = req.body

            //iterate
            for (let index = 0; index < payload.length; index++) {
                await ProductPrice.query(trx).patch({
                    cost: payload[index].price.cost,
                    retail: payload[index].price.retail,
                    wholesale: payload[index].price.wholesale,
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.user.user_id
                }).where('product_id', payload[index].product_id)

                await ProductPricesHistory.query(trx)
                    .insert({
                        product_id: payload[index].product_id,
                        cost: payload[index].price.cost,
                        retail: payload[index].price.retail,
                        wholesale: payload[index].price.wholesale,
                        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        created_by: req.user.user_id

                    })
            }

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully bulk update pricing'
            })

        })


    } catch (error) {
        next(error)
    }

})


router.post('/update_pricing', authenticateJWT, async (req, res, next) => {

    try {

        await ProductPrice.transaction(async trx => {

            const payload = req.body
            const price = payload.price

            //update product table
            await ProductPrice.query(trx)
                .patch({
                    cost: price.cost,
                    retail: price.retail,
                    wholesale: price.wholesale,
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.user.user_id

                })
                .where('product_id', payload.product_id)

            await ProductPricesHistory.query(trx)
                .insert({
                    product_id: payload.product_id,
                    cost: price.cost,
                    retail: price.retail,
                    wholesale: price.wholesale,
                    created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    created_by: req.user.user_id

                })

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully update product price.'
            })

        })

    } catch (error) {
        next(error)
    }

})


router.post('/update_images', authenticateJWT, async (req, res, next) => {

    try {

        await Products.transaction(async trx => {

            const payload = req.body
            console.log(payload)

            await Products.query(trx)
                .patch({
                    images: payload.images,
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.user.user_id

                }).where('product_id', payload.product_id)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully update product images.'
            })

        })

    } catch (error) {
        next(error)
    }

})

module.exports = router;
