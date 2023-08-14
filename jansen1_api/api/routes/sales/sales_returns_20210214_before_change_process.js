const express = require('express');
const router = express.Router();

const dayjs = require('dayjs');
const authenticateJWT = require('../../middlewares/authenticateJWT')

const SalesReturns = require('../../models/sales/sales_returns')
const SalesReturnItems = require('../../models/sales/sales_return_items')

const SalesTransaction = require('../../models/sales/sales_transactions')
const SalesTransactionItem = require('../../models/sales/sales_transaction_items')

const Generator = require('../../utils/reference_generator')
const StocksUtil = require('../../utils/stocks_util')
const Helpers = require('../../utils/helpers');
//const { SalesTransaction } = require('../../utils/report_queries');



router.get('/', async (req, res, next) => {

    try {

        const params = req.query

        const branch_code = req.headers.xbranchcode

        let query = SalesReturns.query().withGraphFetched('[items.product.[brand,unit],customer]')
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



// modify sales return process here (feb-14-2021)



/*

1. check what kind of return/exchange
2. check invoice open/close
3. check return totaled compare to invoice
4. create credit memo if possible

*/






router.post('/', authenticateJWT, async (req, res, next) => {

    try {

        await SalesReturns.transaction(async trx => {

            const payload = req.body

            const sales_return = payload.sales_return
            const returns = payload.returns
            const replaces = payload.replaces
            const tag = payload.tag

            const branch_code = req.headers.xbranchcode

            //generate product_id
            const newSalesReturn = await Generator.GenerateReference(trx, 'sales_return')

            sales_return.sales_return_code = newSalesReturn + Generator.RandomNumberGenerator()

            const salesReturn = await SalesReturns.query(trx)
                .insert({
                    sales_return_code: sales_return.sales_return_code,
                    invoice_no: sales_return.invoice_no,
                    return_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    customer_id: sales_return.customer_id,
                    customer_name: sales_return.customer_name,
                    balance_replacement_amount: sales_return.balance_replacement_amount,
                    total_returned_amount: sales_return.total_returned_amount,
                    total_replaced_amount: sales_return.total_replaced_amount,
                    returned_replace_diff_amount: sales_return.returned_replace_diff_amount,
                    cash_tend: sales_return.cash_tend,
                    branch_code: branch_code,
                    created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    created_by: req.user.user_id

                })


            const salestransaction = await SalesTransaction.query(trx).where('invoice_no', sales_return.invoice_no).first()

            // create an array of objects

            var items_returns = []
            var items_replaces = []

            //Process Returns
            items_returns = returns.filter((item) => { return item.return_quantity > 0 })
                .map((x) => {
                    return {
                        sales_return_code: sales_return.sales_return_code,
                        product_id: x.product_id,
                        quantity: x.return_quantity,
                        price_per_unit: x.price_per_unit,
                        is_replace: 0,
                        invoice_quantity: x.trans_quantity
                    }
                })

            //Process replaces/excahnges
            if (replaces.length > 0) {
                items_replaces = replaces.filter((item) => { return item.replace_quantity > 0 })
                    .map((x) => {
                        return {
                            sales_return_code: sales_return.sales_return_code,
                            product_id: x.product_id,
                            quantity: x.replace_quantity,
                            price_per_unit: x.price_per_unit,
                            is_replace: 1
                        }
                    })
            }


            var items = [...items_returns, ...items_replaces]

            for (var i = 0; i < items.length; i++) {
                await SalesReturnItems.query(trx)
                    .insert(items[i])
            }


            //check the tag here if it is a complete return + exchange case
            // if not then update it and flag as incomplete

            // Returns item should be reflected on the sales item, it should be deducted
            if (items_returns.length > 0) {
                for (var i = 0; i < items_returns.length; i++) {

                    let item = await SalesTransactionItem.query(trx).where('sales_transaction_id', salestransaction.id).where('product_id', items_returns[i].product_id).first()

                    let new_qty = parseInt(item.qty) - parseInt(items_returns[i].quantity)

                    await SalesTransactionItem.query(trx).patch({
                        qty: new_qty
                    }).where('id', item.id)

                }
            }



            // Returns need to StockIns
            if (items_returns.length > 0) {
                for (var i = 0; i < items_returns.length; i++) {

                    // StockIns
                    let data = {
                        item: items_returns[i],
                        branch_code: branch_code,
                        user_id: req.user.user_id,
                        item_qty: items_returns[i].quantity,
                        type: 'sales_return',
                        ref_field: 'sales_return_code'
                    }

                    await StocksUtil.ProcessStockIns(trx, data)
                }
            }


            //Exchange need to Stockouts
            if (items_replaces.length > 0 && tag === null)
                for (var i = 0; i < items_replaces.length; i++) {

                    // StockOuts
                    let data = {
                        item: items_replaces[i],
                        branch_code: branch_code,
                        user_id: req.user.user_id,
                        item_qty: items_replaces[i].quantity,
                        type: 'sales_return',
                        ref_field: 'sales_return_code'
                    }

                    await StocksUtil.ProcessStockOuts(trx, data)
                }

            let status = tag
            if (tag === 'INCOMPLETE') {
                status = 'INCOMPLETE'
            } else {
                status = 'COMPLETE'
            }

            //update the sales return status base on the data submitted
            await SalesReturns.query(trx).patch({
                status: status
            }).where('sales_return_code', sales_return.sales_return_code)

            await Generator.UpdateRunningValue(trx, 'sales_return', newSalesReturn)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully created a new Sales Return.'
            })

        });

    } catch (error) {
        next(error)
    }

})

router.post('/update', authenticateJWT, async (req, res, next) => {

    try {

        await SalesReturns.transaction(async trx => {

            const payload = req.body

            const sales_return = payload.sales_return
            const returns = payload.returns
            const replaces = payload.replaces
            const tag = payload.tag

            const branch_code = req.headers.xbranchcode


            const salesReturn = await SalesReturns.query(trx)
                .patch({
                    sales_return_code: sales_return.sales_return_code,
                    balance_replacement_amount: sales_return.balance_replacement_amount,
                    total_returned_amount: sales_return.total_returned_amount,
                    total_replaced_amount: sales_return.total_replaced_amount,
                    returned_replace_diff_amount: sales_return.returned_replace_diff_amount,
                    cash_tend: sales_return.cash_tend,
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.user.user_id

                }).where('sales_return_code', sales_return.sales_return_code)



            // create an array of objects
            var items_returns = []
            var items_replaces = []



            //Process Returns
            items_returns = returns.filter((item) => { return item.return_quantity > 0 })
                .map((x) => {
                    return {
                        sales_return_code: sales_return.sales_return_code,
                        product_id: x.product_id,
                        quantity: x.return_quantity,
                        price_per_unit: x.price_per_unit,
                        is_replace: 0,
                        invoice_quantity: x.trans_quantity
                    }
                })


            /* IMPORTANT --> check wether the return increases */
            let returns_checked = []
            for (let index = 0; index < returns.length; index++) {
                let diffQty = 0
                let sr_item = await SalesReturnItems.query()
                    .where('sales_return_code', sales_return.sales_return_code)
                    .where('product_id', returns[index].product_id).first()

                let diff = parseInt(returns[index].return_quantity) - parseInt(sr_item.quantity)
                if (diff > 0) {
                    //return has increase
                    diffQty = diff
                } else {
                    //return is same level or decreases(we dont care about this for now)
                    diffQty = 0
                }

                let retObj = {
                    item: {
                        product_id: returns[index].product_id,
                        sales_return_code: sales_return.sales_return_code
                    },
                    quantity: diffQty,
                    price_per_unit: returns[index].price_per_unit,
                    is_replace: 0,
                    invoice_quantity: returns[index].trans_quantity
                }

                returns_checked.push(retObj)
            }


            //Process replaces/excahnges
            if (replaces.length > 0) {
                items_replaces = replaces.filter((item) => { return item.replace_quantity > 0 })
                    .map((x) => {
                        return {
                            sales_return_code: sales_return.sales_return_code,
                            product_id: x.product_id,
                            quantity: x.replace_quantity,
                            price_per_unit: x.price_per_unit,
                            is_replace: 1
                        }
                    })
            }


            var items = [...items_returns, ...items_replaces]

            //delete + insert
            await SalesReturnItems.query(trx).delete().where('sales_return_code', sales_return.sales_return_code)

            for (var i = 0; i < items.length; i++) {
                await SalesReturnItems.query(trx)
                    .insert(items[i])
            }


            //check the tag here if it is a complete return + exchange case
            // if not then update it and flag as incomplete

            //Returns need to StockIns
            if (returns_checked.length > 0) {
                for (var i = 0; i < returns_checked.length; i++) {

                    // StockIns
                    if (returns_checked[i].quantity > 0) {
                        let data = {
                            item: returns_checked[i].item,
                            branch_code: branch_code,
                            user_id: req.user.user_id,
                            item_qty: returns_checked[i].quantity,
                            type: 'sales_return',
                            ref_field: 'sales_return_code'
                        }

                        await StocksUtil.ProcessStockIns(trx, data)
                    }

                }
            }


            //Exchange need to Stockouts
            if (items_replaces.length > 0 && tag === null)
                for (var i = 0; i < items_replaces.length; i++) {

                    // StockOuts
                    if (items_replaces[i].quantity > 0) {
                        let data = {
                            item: items_replaces[i],
                            branch_code: branch_code,
                            user_id: req.user.user_id,
                            item_qty: items_replaces[i].quantity,
                            type: 'sales_return',
                            ref_field: 'sales_return_code'
                        }

                        await StocksUtil.ProcessStockOuts(trx, data)
                    }

                }

            let status = tag
            if (tag === 'INCOMPLETE') {
                status = 'INCOMPLETE'
            } else {
                status = 'COMPLETE'
            }

            //update the sales return status base on the data submitted
            await SalesReturns.query(trx).patch({
                status: status
            }).where('sales_return_code', sales_return.sales_return_code)


            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully updated the Sales Return.'
            })

        });

    } catch (error) {
        next(error)
    }

})



module.exports = router;