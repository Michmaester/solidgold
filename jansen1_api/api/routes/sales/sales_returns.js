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

//const CreditMemo = require('../../models/credit_memos')
// const CreditMemoController = require('../../controllers//creditmemo')



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


            // Create a sales return document with the tag invoice

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


            const tagInvoice = await SalesTransaction.query(trx).where('invoice_no', sales_return.invoice_no).first()


            // Create array of objects for returns and replace items

            let items_returns = []
            let items_replaces = []
            let items = []

            // Return Items 
            items_returns = returns.filter((item) => { return item.return_quantity > 0 })
                .map((x) => {

                    let item_total_amount = parseFloat(x.price_per_unit) * parseInt(x.return_quantity)

                    return {
                        sales_return_code: sales_return.sales_return_code,
                        product_id: x.product_id,
                        quantity: x.return_quantity,
                        price_per_unit: x.price_per_unit,
                        is_replace: 0,
                        invoice_quantity: x.trans_quantity,
                        item_total_amount: item_total_amount
                    }
                })

            // Replae or Exchange Items
            if (replaces.length > 0) {
                items_replaces = replaces.filter((item) => { return item.replace_quantity > 0 })
                    .map((x) => {

                        let item_total_amount = parseFloat(x.price_per_unit) * parseInt(x.return_quantity)

                        return {
                            sales_return_code: sales_return.sales_return_code,
                            product_id: x.product_id,
                            quantity: x.replace_quantity,
                            price_per_unit: x.price_per_unit,
                            is_replace: 1,
                            item_total_amount: item_total_amount
                        }
                    })
            }



            // Check the tag

            let sr_status = null
            let sr_type = null


            if (tag === 'COMPLETE') {

                // Insert the items
                items = [...items_returns, ...items_replaces]

                for (var i = 0; i < items.length; i++) {
                    await SalesReturnItems.query(trx)
                        .insert(items[i])
                }


                // Perform Stock-ins
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


                // Perform Stock-outs
                if (items_replaces.length > 0) {
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
                }

                sr_status = 'COMPLETE'
                sr_type = 'RET_EXCH'

            }

            if (tag === 'INCOMPLETE') {

                // Insert the items
                items = [...items_returns]

                for (var i = 0; i < items.length; i++) {
                    await SalesReturnItems.query(trx)
                        .insert(items[i])
                }

                // Perform Stock-ins
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

                sr_status = 'INCOMPLETE'
                sr_type = 'RET_HOLD'
            }


            if (tag === 'RETURN_ONLY') {

                // Insert the items
                items = [...items_returns]

                for (var i = 0; i < items.length; i++) {
                    await SalesReturnItems.query(trx)
                        .insert(items[i])
                }

                // Perform Stock-ins
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

                let returnsTotalAmount = Helpers.calculateTotals(items_returns, 'item_total_amount')

                //create a credit memo base on this
                // update SR document for the credit data

                await SalesReturns.query(trx).patch({
                    credit_amount: returnsTotalAmount,
                    applied_amount: 0,
                    credit_balance: returnsTotalAmount,
                }).where('sales_return_code', sales_return.sales_return_code)


                // let data = {
                //     customer_id: tagInvoice.customer_id,
                //     sr_no: sales_return.sales_return_code,
                //     invoice_no: tagInvoice.invoice_no,
                //     user: req.user.user_id,
                //     branch_code: branch_code,
                //     credit_amount: returnsTotalAmount
                // }

                // await CreditMemoController.CreateCreditMemo(trx, data)


                sr_status = 'COMPLETE'
                sr_type = 'RET_ONLY'

            }


            // Update the sales return status base on the data submitted
            await SalesReturns.query(trx).patch({
                status: sr_status,
                type: sr_type
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
                    balance_replacement_amount: sales_return.balance_replacement_amount,
                    total_returned_amount: sales_return.total_returned_amount,
                    total_replaced_amount: sales_return.total_replaced_amount,
                    returned_replace_diff_amount: sales_return.returned_replace_diff_amount,
                    cash_tend: sales_return.cash_tend,
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.user.user_id

                }).where('sales_return_code', sales_return.sales_return_code)





            // Create array of objects for returns and replace items

            let items_returns = []
            let items_replaces = []
            let items = []

            // Return Items 
            items_returns = returns.filter((item) => { return item.return_quantity > 0 })
                .map((x) => {
                    return {
                        sales_return_code: sales_return.sales_return_code,
                        product_id: x.product_id,
                        quantity: x.return_quantity,
                        price_per_unit: x.price_per_unit,
                        is_replace: 0,
                        invoice_quantity: x.trans_quantity,
                        item_total_amount: x.return_item_total_amount
                    }
                })

            // Replace or Exchange Items
            if (replaces.length > 0) {
                items_replaces = replaces.filter((item) => { return item.replace_quantity > 0 })
                    .map((x) => {
                        return {
                            sales_return_code: sales_return.sales_return_code,
                            product_id: x.product_id,
                            quantity: x.replace_quantity,
                            price_per_unit: x.price_per_unit,
                            is_replace: 1,
                            item_total_amount: x.replace_item_total_amount
                        }
                    })
            }


            /* IMPORTANT --> check wether the return increases */
            // We will use this returns checked array so that we can stock-in if the return items increases, decrease not supported, customer should buy
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



            // Check the tag

            let sr_status = null
            let sr_type = null


            if (tag === 'COMPLETE') {

                // Insert the items
                items = [...items_returns, ...items_replaces]

                //delete + insert
                await SalesReturnItems.query(trx).delete().where('sales_return_code', sales_return.sales_return_code)

                for (var i = 0; i < items.length; i++) {
                    await SalesReturnItems.query(trx)
                        .insert(items[i])
                }


                // Perform Stock-ins for increase return items only
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


                // Perform Stock-outs
                if (items_replaces.length > 0) {
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
                }

                sr_status = 'COMPLETE'
                sr_type = 'RET_EXCH'

            }

            if (tag === 'INCOMPLETE') {

                // Insert the items
                items = [...items_returns]

                //delete + insert
                await SalesReturnItems.query(trx).delete().where('sales_return_code', sales_return.sales_return_code)

                for (var i = 0; i < items.length; i++) {
                    await SalesReturnItems.query(trx)
                        .insert(items[i])
                }


                // Perform Stock-ins for increase return items only
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

                sr_status = 'INCOMPLETE'
                sr_type = 'RET_HOLD'
            }


            //update the sales return status base on the data submitted
            await SalesReturns.query(trx).patch({
                status: sr_status,
                status: sr_type,
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