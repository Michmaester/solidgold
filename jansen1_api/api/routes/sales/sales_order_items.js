const express = require('express');
const router = express.Router();

const SalesOrderItems = require('../../models/sales/sales_order_items')
const ChangePriceHistory = require('../../models/sales/change_price_history')
const authenticateJWT = require('../../middlewares/authenticateJWT')
const dayjs = require('dayjs')
const Decimal = require('decimal.js')



router.get('/', async (req, res, next) => {

    try {

        const results = await SalesOrderItems.query().withGraphFetched('product')

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})


router.post('/', async (req, res, next) => {

    try {

        await SalesOrderItems.transaction(async trx => {

            var payload = req.body.payload

            payload.forEach((data) => {
                data.order_no = req.body.salesorder_no
            })

            const items = await SalesOrderItems.query(trx).insertGraph(payload)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully created a new sales order items.',
                total_counts: items.length,
                data: items
            })

        });

    } catch (error) {
        next(error)
    }

})

router.post('/update_quantity/:id', async (req, res, next) => {

    try {

        await SalesOrderItems.transaction(async trx => {

            var quantity = req.body.quantity
            const id = req.params.id

            const item = await SalesOrderItems.query(trx)
                .patch({
                    quantity: quantity
                })
                .where('id', id)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully updated a new sales order items.',
                data: item
            })

        });

    } catch (error) {
        next(error)
    }

})

router.post('/update_sale_price/:id', authenticateJWT, async (req, res, next) => {

    try {

        await SalesOrderItems.transaction(async trx => {

            var sale_price = req.body.sale_price
            const id = req.params.id
            var getPrevious = await SalesOrderItems.query().where('id', id).first()
            let actual_price = getPrevious.sale_price;
           
            //check if there is an existing change price history
            let prevChangeHistory = await ChangePriceHistory.query()
            .where('ref_order_no',getPrevious.order_no)
            .where('ref_item_no',getPrevious.product_id).first()

            if(prevChangeHistory)
            {
                actual_price = prevChangeHistory.actual_price
            }
            var difference = Decimal.sub(actual_price,sale_price).toNumber()
            //if current price is the same with the change price, ignore
            if(getPrevious.sale_price === sale_price)
            {
                res.status(200).json({
                    status: 'ok',
                    title: 'Successful',
                    message: 'Successfully updated a new sales order items.',
                    data: item
                })
            }
            //check first if there is an existing change price history for this item, if so set 'inactive' to 1
            await ChangePriceHistory.query(trx).patch({
                inactive:1
            }).where('ref_order_no',getPrevious.order_no)
            .where('ref_item_no',getPrevious.product_id)

            await ChangePriceHistory.query(trx).insert(
                {
                    actual_price:actual_price,
                    changed_price:sale_price,
                    difference:difference,
                    ref_order_no:getPrevious.order_no,
                    ref_item_no:getPrevious.product_id,
                    updated_by:req.user.user_id,
                    updated_at:dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    username:req.user.username
                }
            )

            const item = await SalesOrderItems.query(trx)
                .patch({
                    sale_price: sale_price
                })
                .where('id', id)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully updated a new sales order items.',
                data: item
            })
            
        });

    } catch (error) {
        console.log(error)
        next(error)
    }

})

router.post('/remove_item/:id', async (req, res, next) => {

    try {

        await SalesOrderItems.transaction(async trx => {


            const id = req.params.id

            const item = await SalesOrderItems.query(trx)
                .delete()
                .where('id', id)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully deleted an item'
            })

        });

    } catch (error) {
        next(error)
    }

})

router.post('/update_mixnmatch/:id', async (req, res, next) => {

    try {

        await SalesOrderItems.transaction(async trx => {


            let additional_price = req.body.additional_price
            let remarks = req.body.remarks
            const id = req.params.id

            // query item for the sale_price
            let orderitem = await SalesOrderItems.query().where('id', id).first()
            let sale_price = orderitem.sale_price

            let div_addprice = parseFloat(additional_price) / orderitem.quantity

            let new_sale_price = parseFloat(sale_price) + parseFloat(div_addprice)

            const item = await SalesOrderItems.query(trx)
                .patch({
                    sale_price: new_sale_price,
                    remarks: remarks
                })
                .where('id', id)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully updated a new sales order items.',
                data: item
            })

        });

    } catch (error) {
        next(error)
    }

})




module.exports = router;