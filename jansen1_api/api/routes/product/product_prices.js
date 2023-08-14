const express = require('express');
const router = express.Router();

const Generator = require('../../utils/reference_generator')
const ProductPrices = require('../../models/products/product_prices');
const authenticateJWT = require('../../middlewares/authenticateJWT')


router.get('/', async (req, res, next) => {

    try {
        const results = await ProductPrices.query().withGraphFetched('product');

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})


router.get('/:id', async (req, res, next) => {

    try {

        const id = req.params.id

        const results = await ProductPrices.query()
            .where('id', id)
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

router.get('/product/:product_id', async (req, res, next) => {

    try {

        const product_id = req.params.product_id

        const results = await ProductPrices.query()
            .where('product_id', product_id)
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


// insert
router.post('/', async (req, res, next) => {

    try {

        await ProductPrices.transaction(async trx => {

            const payload = req.body

            const price = await ProductPrices.query(trx).insert({
                product_id: payload.product_id,
                cost: payload.cost,
                retail: payload.retail,
                wholesale: payload.wholesale,
                effective_date: payload.effective_date,
                end_date: payload.end_date,
                status: payload.status,
                type: payload.type,
                price_change_batch_id: payload.price_change_batch_id,
                group_price_change_batch_id: payload.group_price_change_batch_id
            });

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully created a new product price',
                total_counts: price.length,
                data: price
            })

        });

    } catch (error) {
        next(error)
    }

})


// update using the id
router.put('/:id', async (req, res, next) => {

    try {

        await ProductPrices.transaction(async trx => {

            const payload = req.body
            const id = req.params.id

            const price = await ProductPrices.query(trx)
                .patch({
                    product_id: payload.product_id,
                    cost: payload.cost,
                    retail: payload.retail,
                    wholesale: payload.wholesale,
                    effective_date: payload.effective_date,
                    end_date: payload.end_date,
                    status: payload.status,
                    type: payload.type,
                    price_change_batch_id: payload.price_change_batch_id,
                    group_price_change_batch_id: payload.group_price_change_batch_id
                })
                .where('id', id)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully updated a new product price',
                total_counts: price.length,
                data: price
            })

        });

    } catch (error) {
        next(error)
    }

})


// update using the product_id
router.put('/product/:product_id', async (req, res, next) => {

    try {

        await ProductPrices.transaction(async trx => {

            const payload = req.body
            const product_id = req.params.product_id

            const price = await ProductPrices.query(trx)
                .patch({
                    cost: payload.cost,
                    retail: payload.retail,
                    wholesale: payload.wholesale,
                    effective_date: payload.effective_date,
                    end_date: payload.end_date,
                    status: payload.status,
                    type: payload.type,
                    price_change_batch_id: payload.price_change_batch_id,
                    group_price_change_batch_id: payload.group_price_change_batch_id
                })
                .where('product_id', product_id)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully updated a new product price',
                total_counts: price.length,
                data: price
            })

        });

    } catch (error) {
        next(error)
    }

})

module.exports = router;