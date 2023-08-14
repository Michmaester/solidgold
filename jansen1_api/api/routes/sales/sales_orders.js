const express = require('express');
const router = express.Router();
const Decimal = require('decimal.js')

const { ref, raw } = require('objection');

const dayjs = require('dayjs');
const authenticateJWT = require('../../middlewares/authenticateJWT')

const Generator = require('../../utils/reference_generator')
const SalesOrders = require('../../models/sales/sales_orders')
const SalesOrderItems = require('../../models/sales/sales_order_items')
const SalesTransactions = require('../../models/sales/sales_transactions')
const SalesTransactionItems = require('../../models/sales/sales_transaction_items')
const SalesDeliveries = require('../../models/sales/sales_deliveries')

const ProductPrice = require('../../models/products/product_prices')

const PaymentTenders = require('../../models/payment/payment_tenders')
const PaymentTendersCash = require('../../models/payment/payment_tenders_cash')
const PaymentTendersCard = require('../../models/payment/payment_tenders_card')
const PaymentTendersCharge = require('../../models/payment/payment_tenders_charge')
const PaymentTendersCheque = require('../../models/payment/payment_tenders_cheque')
const ChangePriceHistory = require('../../models/sales/change_price_history')

const Helpers = require('../../utils/helpers')
const UserUtils = require('../../utils/user_util')
const StocksUtils = require('../../utils/stocks_util')
const PaymentUtils = require('../../utils/payments_util')


router.get('/', async (req, res, next) => {

    try {

        const branch_code = req.headers.xbranchcode

        const results = await SalesOrders.query()
            .withGraphFetched('[order_items.product,user]')
            .where('branch_code', branch_code)
            .orderBy('id', 'DESC')

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})

router.get('/by_order_no/:order_no', async (req, res, next) => {

    try {
        const sales_order_no = req.params.order_no
        const branch = req.query.branch

        const results = await SalesOrders.query()
            .withGraphFetched('order_items.product.[unit,brand,category,type]')
            // .where('order_date', 'like', date + '%')
            .where('order_no',sales_order_no)
            .where('branch_code', branch)
            .orderBy('id', 'DESC')

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})


router.get('/keep_list_all', authenticateJWT, async (req, res, next) => {

    try {

        const branch_code = req.headers.xbranchcode
        const user_id = req.user.user_id

        const results = await SalesOrders.query()
            .withGraphFetched('[order_items.product.[brand],user]')
            .where('branch_code', branch_code)
            .where('status', 'keep')
            .where('user_id', user_id)
            .orderBy('id', 'DESC')


        // calcultae the totals here

        let data = results.map(item => {
            return {
                id: item.id,
                order_no: item.order_no,
                dateOrder: item.dateOrder,
                customer_id: item.customer_id,
                customer_name: item.customer_name,
                customer_address: item.customer_address,
                sales_type: item.sales_type,
                cash_remark: item.cash_remark,
                items: item.order_items,
                salesman: item.user.username,
                total_items: Helpers.calculateTotals(item.order_items, 'quantity')

            }
        })

        res.status(200).json({
            status: 'ok',
            total_counts: data.length,
            data: data
        })

    } catch (error) {
        next(error)
    }

})


router.get('/status/:status', async (req, res, next) => {

    try {

        const status = req.params.status
        const branch_code = req.headers.xbranchcode

        const results = await SalesOrders.query()
            .withGraphFetched('order_items.product.[unit,brand,category,type]')
            .where('status', status)
            .where('branch_code', branch_code)
            .orderBy('id', 'DESC')

        // sort?

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})


router.get('/get_cashier', async (req, res, next) => {

    try {

        const date = req.query.date
        const status = req.query.status
        const branch = req.query.branch

        const results = await SalesOrders.query()
            .withGraphFetched('order_items.product.[unit,brand,category,type]')
            .where('status', status)
            .where(raw('DATE(order_date)'), date)
            // .where('order_date', 'like', date + '%')
            .where('branch_code', branch)
            .orderBy('id', 'DESC')

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})




router.post('/', authenticateJWT, async (req, res, next) => {

    try {

        await SalesOrders.transaction(async trx => {


            const branch_code = req.headers.xbranchcode

            const payload = req.body
            const salesorder = payload.salesorder
            const salesorder_items = payload.salesorder_items

            //check if already exist or the order is a kepp order
            const isExist = await SalesOrders.query(trx).where('order_no', salesorder.order_no).where('status', 'keep').first()

            if (isExist) {
                //update sales order
                //delete and insert the items

                await SalesOrders.query(trx).patch({
                    order_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    sales_type: salesorder.sales_type,
                    status: 'submitted',
                    user_id: req.user_user_id,
                    cash_remark: salesorder.cash_remark
                }).where('order_no', salesorder.order_no)

                await SalesOrderItems.query(trx).delete().where('order_no', salesorder.order_no)

                for (let index = 0; index < salesorder_items.length; index++) {
                    await SalesOrderItems.query(trx).insert({
                        order_no: salesorder.order_no,
                        product_id: salesorder_items[index].product_id,
                        sale_price: salesorder_items[index].sale_price,
                        quantity: salesorder_items[index].quantity
                    })
                }
            } else {

                //generate product_id
                const newSaleOrderNo = await Generator.GenerateReference(trx, 'sales_order')

                salesorder.order_no = newSaleOrderNo + Generator.RandomNumberGenerator()
                salesorder.status = 'submitted'
                salesorder.order_date = dayjs().format('YYYY-MM-DD HH:mm:ss')
                salesorder.is_printed = null
                salesorder.shipment = 'Pickup'
                salesorder.user_id = req.user.user_id
                salesorder.branch_code = branch_code
                salesorder.created_at = dayjs().format('YYYY-MM-DD HH:mm:ss')
                salesorder.created_by = req.user.user_id
                //default to zero
                salesorder.delivery_fee = 0

                // add the cash_remark if filled in
                // jan-18-2021

                const salesOrder = await SalesOrders.query(trx)
                    .insert(salesorder)

                salesorder_items.forEach((data) => {
                    data.order_no = salesorder.order_no
                })

                await SalesOrderItems.query(trx).insertGraph(salesorder_items)
                await Generator.UpdateRunningValue(trx, 'sales_order', newSaleOrderNo)

            }

            let log = {
                event: 'create-sales-order',
                user_id: req.user.user_id,
                branch_code: branch_code
            }
            await UserUtils.LoggedEvent(trx, log)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully created a new sales order.'
            })

        });

    } catch (error) {
        next(error)
    }

})


// add for the keep/hold feature
router.post('/keep', authenticateJWT, async (req, res, next) => {

    try {

        await SalesOrders.transaction(async trx => {


            const branch_code = req.headers.xbranchcode

            const payload = req.body
            const salesorder = payload.salesorder
            const salesorder_items = payload.salesorder_items


            //check if already exist
            const isExist = await SalesOrders.query(trx).where('order_no', salesorder.order_no).where('status', 'keep').first()

            if (isExist) {

                //console.log('keep exist, updating it')
                //update sales order
                //delete and insert the items

                await SalesOrders.query(trx).patch({
                    order_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    sales_type: salesorder.sales_type,
                    user_id: req.user_user_id,
                    cash_remark: salesorder.cash_remark
                }).where('order_no', salesorder.order_no)

                await SalesOrderItems.query(trx).delete().where('order_no', salesorder.order_no)

                for (let index = 0; index < salesorder_items.length; index++) {
                    await SalesOrderItems.query(trx).insert({
                        order_no: salesorder.order_no,
                        product_id: salesorder_items[index].product_id,
                        sale_price: salesorder_items[index].sale_price,
                        quantity: salesorder_items[index].quantity
                    })
                }

                let log = {
                    event: 'update-keep-sales-order',
                    user_id: req.user.user_id,
                    branch_code: branch_code
                }
                await UserUtils.LoggedEvent(trx, log)

            } else {

                //console.log('keep does not exist, creating it')
                //generate product_id
                const newSaleOrderNo = await Generator.GenerateReference(trx, 'sales_order')

                salesorder.order_no = newSaleOrderNo + Generator.RandomNumberGenerator()
                salesorder.status = 'keep'
                salesorder.order_date = dayjs().format('YYYY-MM-DD HH:mm:ss')
                salesorder.is_printed = null
                salesorder.shipment = 'Pickup'
                salesorder.user_id = req.user.user_id
                salesorder.branch_code = branch_code
                salesorder.created_at = dayjs().format('YYYY-MM-DD HH:mm:ss')
                salesorder.created_by = req.user.user_id
                //default to zero
                salesorder.delivery_fee = 0

                // add the cash_remark if filled in
                // jan-18-2021
                const salesOrder = await SalesOrders.query(trx)
                    .insert(salesorder)

                salesorder_items.forEach((data) => {
                    data.order_no = salesorder.order_no
                })

                await SalesOrderItems.query(trx).insertGraph(salesorder_items)

                await Generator.UpdateRunningValue(trx, 'sales_order', newSaleOrderNo)

                let log = {
                    event: 'create-sales-order',
                    user_id: req.user.user_id,
                    branch_code: branch_code
                }
                await UserUtils.LoggedEvent(trx, log)
            }



            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully updated the keep list.'
            })

        });

    } catch (error) {
        next(error)
    }

})

router.post('/delete_keep_list', authenticateJWT, async (req, res, next) => {

    try {

        await SalesOrders.transaction(async trx => {

            const order_nos = req.body.order_nos

            await SalesOrderItems.query(trx).delete().whereIn('order_no', order_nos)
            await SalesOrders.query(trx).delete().whereIn('order_no', order_nos)


            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully deleted selected keep list.'
            })

        });

    } catch (error) {
        next(error)
    }

})


router.post('/update_status', async (req, res, next) => {

    try {

        await SalesOrders.transaction(async trx => {

            const payload = req.body

            const salesOrder = await SalesOrders.query(trx)
                .update({ status: payload.status })
                .where('order_no', payload.order_no)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully updated status',
                total_counts: salesOrder.length,
                data: salesOrder
            })

        });

    } catch (error) {
        next(error)
    }

})



router.post('/update_shipment', async (req, res, next) => {

    try {

        await SalesOrders.transaction(async trx => {

            const payload = req.body

            var salesOrder = null;

            if (payload.shipment == 'Delivery') {
                salesOrder = await SalesOrders.query(trx)
                    .update(
                        {
                            shipment: payload.shipment,
                            delivery_request_date: payload.delivery_request_date,
                            delivery_fee: payload.delivery_fee,
                            delivery_notes: payload.delivery_notes
                        }
                    )
                    .where('order_no', payload.order_no)
            } else {
                //pickup
                salesOrder = await SalesOrders.query(trx)
                    .update(
                        {
                            shipment: payload.shipment,
                            delivery_request_date: null,
                            delivery_fee: 0,
                            delivery_notes: null
                        }
                    )
                    .where('order_no', payload.order_no)
            }



            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully updated status',
                total_counts: salesOrder.length,
                data: salesOrder
            })

        });

    } catch (error) {
        next(error)
    }

})

router.post('/update_salestype',authenticateJWT, async (req, res, next) => {

    try {

        await SalesOrders.transaction(async trx => {

            const payload = req.body

            const salestype = payload.sales_type.toLowerCase()


            // get the pricing of the items and follow what the sale types is

            const items = await SalesOrderItems.query(trx).where('order_no', payload.order_no)

            for (let index = 0; index < items.length; index++) {

                let product_id = items[index].product_id
                let product_price = 0

                const product = await ProductPrice.query(trx).where('product_id', product_id).first()

                if (salestype === 'wholesale') product_price = product.wholesale
                if (salestype === 'retail') product_price = product.retail

                var getPrevious = await SalesOrderItems.query().where('id', items[index].id).first()
                let actual_price = getPrevious.sale_price;
                let prevChangeHistory = await ChangePriceHistory.query()
                .where('ref_order_no',getPrevious.order_no)
                .where('ref_item_no',getPrevious.product_id).first()
                if(prevChangeHistory)
                {
                    actual_price = prevChangeHistory.actual_price
                }
                var difference = Decimal.sub(actual_price,product_price).toNumber()
                if(getPrevious.sale_price  === product_price)
                {
                    continue;
                }
                    //check first if there is an existing change price history for this item, if so set 'inactive' to 1
            await ChangePriceHistory.query(trx).patch({
                inactive:1
            }).where('ref_order_no',getPrevious.order_no)
            .where('ref_item_no',getPrevious.product_id)
                
                await ChangePriceHistory.query(trx).insert(
                    {
                        actual_price:actual_price,
                        changed_price:product_price,
                        difference:difference,
                        ref_order_no:getPrevious.order_no,
                        ref_item_no:getPrevious.product_id,
                        updated_by:req.user.user_id,
                        updated_at:dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        username:req.user.username
                    }
                )
                //update the sales order item
                await SalesOrderItems.query(trx).patch({
                    sale_price: product_price
                })
                    .where('id', items[index].id)

            }

            const salesOrder = await SalesOrders.query(trx)
                .update({ sales_type: payload.sales_type })
                .where('order_no', payload.order_no)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully updated status',
                total_counts: salesOrder.length,
                data: salesOrder
            })

        });

    } catch (error) {
        console.log(error)
        next(error)
    }

})


// cashier_submit
// create transaction + items
// pay + pay details

router.post('/cashier_submit', async (req, res, next) => {

    try {

        await SalesTransactions.transaction(async trx => {


            const payload = req.body

            // console.log('+----------------------+')
            // console.log('+ Cashier Submit ')
            // console.log('+')
            // console.log('+----------------------+')

            // console.log('----- Payload')
            // console.log(dayjs().format("YYYY-MM-DD HH:mm:ss"))
            // console.log(payload)


            const transaction = payload.sales_transaction
            const transaction_items = payload.sales_transaction_items
            const payments = payload.payments
            const delivery = payload.delivery

            // Generate invoice_no
            const newSalesInvoiceNo = await Generator.GenerateReference(trx, 'sales_invoice')

            transaction.invoice_no = newSalesInvoiceNo

            // Transaction
            const trans = await SalesTransactions.query(trx)
                .insert({
                    transaction_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    transaction_type: transaction.transaction_type,
                    customer_id: transaction.customer_id,

                    //change 20210704 to support dedcution
                    total_amount_due: transaction.total_amount_due,
                    deduct_1perc_amount: transaction.deduct_1perc_amount,
                    total_amount_due_without_deduct_1perc: transaction.total_amount_due_without_deduct_1perc,


                    invoice_no: transaction.invoice_no,
                    invoice_type: transaction.invoice_type,
                    total_amount_tendered: transaction.total_amount_tendered,
                    balance_amount: transaction.balance_amount,
                    change_amount: transaction.change_amount,
                    total_discounted_amount: transaction.total_discounted_amount,
                    status: transaction.status,
                    payment_status: transaction.payment_status,
                    user_id: transaction.user_id,
                    branch_code: transaction.branch_code,
                    salesfront_user_id: transaction.salesfront_user_id,
                    cash_remark: transaction.cash_remark
                })

            for (var i = 0; i < transaction_items.length; i++) {

                await SalesTransactionItems.query(trx).insert({
                    sales_transaction_id: trans.id,
                    qty: transaction_items[i].qty,
                    product_id: transaction_items[i].product_id,
                    price_per_unit: transaction_items[i].price_per_unit,
                    unit: transaction_items[i].unit,
                    remarks: transaction_items[i].remarks,

                    // discounted_amount: transaction_items[i].price_per_unit,

                    total_amount: transaction_items[i].total_amount,
                    created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    created_by: transaction.user_id
                })

            }

            // Generate Delivery
            if (delivery.shipment === 'Delivery') {

                const newSalesDeliveryNo = await Generator.GenerateReference(trx, 'sales_delivery')

                delivery['dr_no'] = newSalesDeliveryNo + Generator.RandomNumberGenerator()

                await SalesDeliveries.query(trx)
                    .insert({
                        dr_no: delivery.dr_no,
                        invoice_no: transaction.invoice_no,
                        delivery_requested_date: delivery.delivery_request_date,
                        delivery_notes: delivery.delivery_notes,
                        delivery_fee: delivery.delivery_fee,
                        status: 'Pending',
                        branch_code: transaction.branch_code,
                        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        created_by: transaction.user_id

                    })

                await Generator.UpdateRunningValue(trx, 'sales_delivery', newSalesDeliveryNo)

            }



            // Payment
            // put this section to a helper "payment helper"

            let payment_data = {
                trans: trans,
                payments: payments
            }

            await PaymentUtils.ProcessSalesTransactionPayments(trx, payment_data)

            // Pickup and Stockout
            // we should do a stockout after a successful payment.
            if (delivery.shipment === 'Pickup') {

                //iterate over the items
                for (var i = 0; i < transaction_items.length; i++) {

                    // Stock outs
                    let data = {
                        item: { product_id: transaction_items[i].product_id, invoice_no: transaction.invoice_no },
                        branch_code: trans.branch_code,
                        user_id: trans.user_id,
                        item_qty: transaction_items[i].qty,
                        type: 'sales_transaction',
                        ref_field: 'invoice_no'
                    }

                    await StocksUtils.ProcessStockOuts(trx, data)
                }

            }


            // Update the sales_order status = completed
            await SalesOrders.query(trx)
                .update({ status: 'completed' })
                .where('order_no', payload.sales_order_no)



            await Generator.UpdateRunningValue(trx, 'sales_invoice',  transaction.invoice_no )

            // console.log(dayjs().format("YYYY-MM-DD HH:mm:ss"))
            // console.log('----- End Cashier Submit')
            //update change_price_history
            await ChangePriceHistory.query(trx).patch({
                ref_invoice:newSalesInvoiceNo
            }).where('ref_order_no',  payload.sales_order_no)
            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully created a new sales transactions and payment.',
                data: {
                    invoice_no: transaction.invoice_no
                }
            })

        })

    } catch (error) {
        next(error)
    }

})





module.exports = router;