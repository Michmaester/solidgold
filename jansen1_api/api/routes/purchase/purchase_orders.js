const express = require('express');
const router = express.Router();

const dayjs = require('dayjs');
const authenticateJWT = require('../../middlewares/authenticateJWT')

const Generator = require('../../utils/reference_generator')

const PurchaseOrders = require('../../models/purchase/purchase_orders');
const PurchaseOrderItems = require('../../models/purchase/purchase_order_items');
const PaymentPurchaseOrders = require('../../models/payment/payment_purchase_orders')

const ChequeVouchers = require('../../models/payment/cheque_vouchers')

const StockIns = require('../../models/stocks/stock_ins');
const Stocks = require('../../models/stocks/stocks');
const Products = require('../../models/products/products');

const Helpers = require('../../utils/helpers')
const StocksUtil = require('../../utils/stocks_util')
const PurchaseUtil = require('../../utils/purchase_util')

// ---------> Status

// Receive ----> already receive and recorded
// Paid -------> paid
// PO ---------> po submitted,need approval
// POSent -----> po sent to supplier



router.get('/', async (req, res, next) => {

    try {

        const params = req.query

        const branch_code = req.headers.xbranchcode

        let query = PurchaseOrders.query().withGraphFetched('[po_items.[product.[brand,unit]],supplier,branch,invoice_branch,courier,user]')

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


router.get('/po/:po_number', async (req, res, next) => {

    try {

        const po_number = req.params.po_number
        const results = await PurchaseOrders.query()
            .where('po_number', po_number)

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})

router.get('/supplier/:supplier_id', async (req, res, next) => {

    try {

        const supplier_id = req.params.supplier_id
        const results = await PurchaseOrders.query()
            .where('supplier_id', supplier_id)

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})

router.get('/supplier_receives/:supplier_id', async (req, res, next) => {

    try {

        const supplier_id = req.params.supplier_id
        const results = await PurchaseOrders.query()
            .where('supplier_id', supplier_id)
            .where('status', 'Received')

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})

router.get('/supplier_payments/:supplier_id', async (req, res, next) => {

    try {

        const supplier_id = req.params.supplier_id
        const results = await PurchaseOrders.query()
            .withGraphFetched('[payments]')
            .where('supplier_id', supplier_id)

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

        const params = req.query
        const status = req.params.status

        const branch_code = req.headers.xbranchcode

        let query = PurchaseOrders.query().withGraphFetched('[po_items.[product.[brand,unit]],supplier,branch,invoice_branch,courier,user,payments]')
        query = Helpers.queryFilters(params, query)
        query.where('branch_code', branch_code)
        query.where('status', status)

        const query_results = await query

        res.status(200).json({
            status: 'ok',
            data: query_results
        })

    } catch (error) {
        next(error)
    }

})

router.get('/po_readyfor_payment', async (req, res, next) => {

    try {

        const params = req.query
        const status = req.params.status

        const branch_code = req.headers.xbranchcode

        let query = PurchaseOrders.query().withGraphFetched('[po_items.[product.[brand,unit]],supplier,branch,invoice_branch,courier,user,payments]')
        query = Helpers.queryFilters(params, query)
        query.where('branch_code', branch_code)
        query.whereIn('status', ['Received', 'Close'])

        const query_results = await query

        res.status(200).json({
            status: 'ok',
            data: query_results
        })

    } catch (error) {
        next(error)
    }

})


router.get('/po_receives', async (req, res, next) => {

    try {

        const params = req.query

        const branch_code = req.headers.xbranchcode

        let query = PurchaseOrders.query().withGraphFetched('[po_items.[product.[brand,unit]],supplier,branch,invoice_branch,courier,user]')
        query = Helpers.queryFilters(params, query)
        query.where('branch_code', branch_code)
        query.where('status', 'in', ['Sent', 'Partial', 'Received', 'Close'])
        query.where('po_type', null)

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

        await PurchaseOrders.transaction(async trx => {

            const payload = req.body

            const purchase_order = payload.purchaseorder
            const po_items = payload.purchaseorder_items
            const po_payment = payload.purchaseorder_payment

            //generate po_no
            const newPoNo = await Generator.GenerateReference(trx, 'purchase_order')

            purchase_order.po_number = newPoNo + Generator.RandomNumberGenerator()


            //map items and calculate totals
            var items = po_items.map((item) => {

                //check price/quoted + make the cost price
                let cost_price = item.actual_price
                if (item.quoted_price > 0) {
                    cost_price = item.quoted_price
                }

                // calculate total amunt in backend
                let total_amount = parseFloat(cost_price) * item.quantity

                return {
                    po_number: purchase_order.po_number,
                    po_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    product_id: item.product.product_id,
                    qty: item.quantity,
                    total_item_amount: total_amount,
                    receive_total_amount: null,
                    item_discount: item.total_discount,
                    actual_price: item.actual_price,
                    quotation_price: item.quoted_price,
                    cost_price: cost_price,
                    receive_qty: null,
                    date_receive: null,
                    receive_encoder: null
                }
            })


            // get the totals of the items
            let po_total_amount = items.reduce((a, b) => +a + (+b['total_item_amount'] || 0), 0)
            let po_total_discount = items.reduce((a, b) => +a + (+b['item_discount'] || 0), 0)


            // PO
            const purchaseOrder = await PurchaseOrders.query(trx)
                .insert({
                    po_number: purchase_order.po_number,
                    date_created: dayjs().format('YYYY-MM-DD HH:mm:ss'),

                    total_amount: po_total_amount,
                    total_discount: po_total_discount,

                    supplier_id: purchase_order.supplier.supplier_id,
                    status: 'PO',
                    payment_status: 'Unpaid',
                    actual_total_amount: null,
                    actual_total_discount: null,
                    date_delivered: null,
                    is_sentto_supplier: null,
                    receive_total_amount: 0,
                    paid_amount: 0,
                    balance_amount: po_total_amount,
                    branch_code: purchase_order.branch.branch_code,
                    courier_id: null,
                    invoice_branch_id: purchase_order.branch.branch_code,
                    user_id: req.user.user_id,
                    created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    created_by: req.user.user_id
                })


            const purchaseorder_items = await PurchaseOrderItems.query(trx)
                .insertGraph(items)



            //iterate on items and reupdate the prodcut cost price
            // commented 20210425
            // for (var i = 0; i < items.length; i++) {

            //     let data = {
            //         product_id: items[i].product_id,
            //         cost: items[i].cost_price,
            //         user: req.user.user_id
            //     }
            //     await PurchaseUtil.UpdateProductCostPrice(trx, data)
            // }



            const po_amount = po_total_amount

            let payment_amount = 0
            let overpayment_amount = 0
            let payment_status = 'Unpaid'

            if (po_payment.payment_type != 'NOPAYMENT') {


                //if type="nopayment" then process the payment

                //check payment type
                if (po_payment.payment_type === 'CASH') {
                    payment_amount = po_payment.cash_amount
                } else {
                    payment_amount = po_payment.cheque_amount
                }

                //calculate totals diff to set the status
                if (parseFloat(po_amount) == parseFloat(payment_amount)) {
                    payment_status = "Paid"
                }

                if (parseFloat(po_amount) > parseFloat(payment_amount)) {
                    //partial
                    payment_status = "Partial"
                }

                if (parseFloat(po_amount) < parseFloat(payment_amount)) {
                    //partial
                    payment_status = "Paid"
                    overpayment_amount = parseFloat(payment_amount) - parseFloat(po_amount)
                }



                if (po_payment.payment_type === 'CASH') {
                    await PaymentPurchaseOrders.query(trx)
                        .insert({
                            po_number: purchase_order.po_number,
                            payment_amount: payment_amount,
                            payment_type: po_payment.payment_type,
                            payment_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                            created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                            created_by: req.user.user_id,
                            supplier_id: purchase_order.supplier.supplier_id
                        })
                }


                if (po_payment.payment_type === 'CHEQUE') {

                    // create a cheque voucher first
                    let cheque_voucher_no = null

                    //generate cheque voucher
                    const newCv = await Generator.GenerateReference(trx, 'cheque_voucher')

                    cheque_voucher_no = newCv + Generator.RandomNumberGenerator()

                    /* check cheque amount + cheque bank id */
                    await ChequeVouchers.query(trx).insert({
                        cheque_voucher_no: cheque_voucher_no,
                        cheque_no: po_payment.cheque_no,
                        cheque_name: po_payment.cheque_name,
                        cheque_amount: payment_amount,
                        cheque_date: po_payment.cheque_date,
                        cheque_bank: po_payment.cheque_bank.name,
                        cheque_bank_id: po_payment.cheque_bank.id,
                        supplier_id: purchase_order.supplier.supplier_id,
                        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        created_by: req.user.user_id
                    })

                    await Generator.UpdateRunningValue(trx, 'cheque_voucher', newCv)


                    await PaymentPurchaseOrders.query(trx)
                        .insert({
                            po_number: purchase_order.po_number,
                            payment_amount: payment_amount,
                            payment_type: po_payment.payment_type,
                            payment_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),

                            cheque_no: po_payment.cheque_no,
                            cheque_bank: po_payment.cheque_bank.name,
                            cheque_name: po_payment.cheque_name,
                            cheque_date: po_payment.cheque_date,
                            cheque_bank_id: po_payment.cheque_bank.id,
                            overpayment_amount: overpayment_amount,

                            supplier_id: purchase_order.supplier.supplier_id,
                            created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                            created_by: req.user.user_id
                        })
                }

            } else {
                payment_status = 'Unpaid'
            }


            // recalculate the balance amount

            let balance_amount = parseFloat(po_total_amount) - parseFloat(payment_amount)

            await PurchaseOrders.query(trx)
                .patch({
                    paid_amount: payment_amount,
                    balance_amount: balance_amount,
                    payment_status: payment_status
                })
                .where('po_number', purchase_order.po_number)

            //iterate over the items and update it on the stocks table if how many is purchase
            const itemsdata = {
                items: items,
                branch_code: purchase_order.branch.branch_code,
                type: 'po_requested'
            }
            await PurchaseUtil.UpdatePurchaseItemOnStocks(trx, itemsdata)

            await Generator.UpdateRunningValue(trx, 'purchase_order', newPoNo)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully created a new purchase order.'
            })

        });

    } catch (error) {
        next(error)
    }

})


router.post('/non_trade', authenticateJWT, async (req, res, next) => {

    try {

        await PurchaseOrders.transaction(async trx => {

            const payload = req.body

            const purchase_order = payload.purchaseorder
            const po_items = payload.purchaseorder_items
            const po_payment = payload.purchaseorder_payment

            //generate po_no
            const newPoNo = await Generator.GenerateReference(trx, 'purchase_order')

            purchase_order.po_number = newPoNo + Generator.RandomNumberGenerator() + 'NT'


            //map items and calculate totals
            var items = po_items.map((item) => {

                // calculate total amunt in backend
                let total_amount = parseFloat(item.actual_price) * item.quantity

                return {
                    po_number: purchase_order.po_number,
                    po_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    product_id: null,
                    qty: item.quantity,
                    total_item_amount: total_amount,
                    receive_total_amount: total_amount,
                    item_discount: item.total_discount,
                    actual_price: item.actual_price,
                    quotation_price: item.quoted_price,
                    cost_price: item.actual_price,
                    receive_qty: item.quantity,
                    date_receive: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    receive_encoder: null,
                    nt_item: item.nt_item,
                    nt_item_description: item.nt_item_description
                }
            })


            // get the totals of the items
            let po_total_amount = items.reduce((a, b) => +a + (+b['total_item_amount'] || 0), 0)
            let po_total_discount = items.reduce((a, b) => +a + (+b['item_discount'] || 0), 0)


            // PO
            const purchaseOrder = await PurchaseOrders.query(trx)
                .insert({
                    po_number: purchase_order.po_number,
                    date_created: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    total_amount: po_total_amount,
                    total_discount: po_total_discount,
                    supplier_id: purchase_order.supplier.supplier_id,
                    status: 'PO',
                    payment_status: 'Unpaid',
                    actual_total_amount: null,
                    actual_total_discount: null,
                    date_delivered: null,
                    is_sentto_supplier: null,
                    receive_total_amount: po_total_amount,
                    paid_amount: 0,
                    balance_amount: po_total_amount,
                    branch_code: purchase_order.branch.branch_code,
                    courier_id: null,
                    invoice_branch_id: purchase_order.branch.branch_code,
                    user_id: req.user.user_id,
                    created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    created_by: req.user.user_id,
                    po_type: 'non-trade'
                })



            const purchaseorder_items = await PurchaseOrderItems.query(trx)
                .insertGraph(items)


            const po_amount = po_total_amount

            let payment_amount = 0
            let overpayment_amount = 0
            let payment_status = 'Unpaid'

            if (po_payment.payment_type != 'NOPAYMENT') {


                //if type="nopayment" then process the payment

                //check payment type
                if (po_payment.payment_type == 'CASH') {
                    payment_amount = po_payment.cash_amount
                } else {
                    payment_amount = po_payment.cheque_amount
                }

                //calculate totals diff to set the status
                if (parseFloat(po_amount) == parseFloat(payment_amount)) {
                    payment_status = "Paid"
                }

                if (parseFloat(po_amount) > parseFloat(payment_amount)) {
                    //partial
                    payment_status = "Partial"
                }

                if (parseFloat(po_amount) < parseFloat(payment_amount)) {
                    //partial
                    payment_status = "Paid"
                    overpayment_amount = parseFloat(payment_amount) - parseFloat(po_amount)
                }


                if (po_payment.payment_type === 'CASH') {
                    await PaymentPurchaseOrders.query(trx)
                        .insert({
                            po_number: purchase_order.po_number,
                            payment_amount: payment_amount,
                            payment_type: po_payment.payment_type,
                            payment_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                            supplier_id: purchase_order.supplier.supplier_id,
                            created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                            created_by: req.user.user_id
                        })
                }


                if (po_payment.payment_type === 'CHEQUE') {


                    // create a cheque voucher first
                    let cheque_voucher_no = null

                    //generate cheque voucher
                    const newCv = await Generator.GenerateReference(trx, 'cheque_voucher')

                    cheque_voucher_no = newCv + Generator.RandomNumberGenerator()

                    /* check cheque amount + cheque bank id */
                    await ChequeVouchers.query(trx).insert({
                        cheque_voucher_no: cheque_voucher_no,
                        cheque_no: po_payment.cheque_no,
                        cheque_name: po_payment.cheque_name,
                        cheque_amount: payment_amount,
                        cheque_date: po_payment.cheque_date,
                        cheque_bank: po_payment.cheque_bank.name,
                        cheque_bank_id: po_payment.cheque_bank.id,
                        supplier_id: purchase_order.supplier.supplier_id,
                        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        created_by: req.user.user_id
                    })

                    await Generator.UpdateRunningValue(trx, 'cheque_voucher', newCv)

                    await PaymentPurchaseOrders.query(trx)
                        .insert({
                            po_number: purchase_order.po_number,
                            payment_amount: payment_amount,
                            payment_type: po_payment.payment_type,
                            payment_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),

                            cheque_no: po_payment.cheque_no,
                            cheque_bank: po_payment.cheque_bank.name,
                            cheque_name: po_payment.cheque_name,
                            cheque_date: po_payment.cheque_date,
                            cheque_bank_id: po_payment.cheque_bank.id,
                            overpayment_amount: overpayment_amount,

                            supplier_id: purchase_order.supplier.supplier_id,
                            created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                            created_by: req.user.user_id
                        })
                }

            } else {
                payment_status = 'Unpaid'
            }

            // recalculate the balance amount

            let balance_amount = parseFloat(po_total_amount) - parseFloat(payment_amount)

            await PurchaseOrders.query(trx)
                .patch({
                    paid_amount: payment_amount,
                    balance_amount: balance_amount,
                    payment_status: payment_status
                })
                .where('po_number', purchase_order.po_number)


            await Generator.UpdateRunningValue(trx, 'purchase_order', newPoNo)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully created a new purchase order.'
            })

        });

    } catch (error) {
        next(error)
    }

})


router.post('/update', authenticateJWT, async (req, res, next) => {

    try {

        await PurchaseOrders.transaction(async trx => {

            const payload = req.body

            const purchase_order = payload.purchaseorder
            const po_items = payload.purchaseorder_items

            //update the purchase order


            //Get the PO TYPE
            const po = await PurchaseOrders.query(trx).where('po_number', purchase_order.po_number).first()



            //map items and calculate totals
            var items = po_items.map((item) => {

                //check price/quoted + make the cost price
                let cost_price = item.actual_price
                if (item.quoted_price > 0) {
                    cost_price = item.quoted_price
                }

                // calculate total amunt in backend
                let total_amount = parseFloat(cost_price) * item.quantity

                let product_id = null
                let receive_total_amount = total_amount
                let receive_qty = item.quantity
                if (po.po_type !== 'non-trade') {
                    product_id = item.product.product_id
                    receive_total_amount = 0
                    receive_qty = 0
                }

                return {
                    po_number: purchase_order.po_number,
                    po_date: item.po_date,
                    product_id: product_id,
                    qty: item.quantity,
                    total_item_amount: total_amount,
                    receive_total_amount: receive_total_amount,
                    item_discount: item.total_discount,
                    actual_price: item.actual_price,
                    quotation_price: item.quoted_price,
                    cost_price: cost_price,
                    receive_qty: receive_qty,
                    date_receive: null,
                    receive_encoder: null,
                    nt_item: item.nt_item,
                    nt_item_description: item.nt_item_description
                }
            })



            // get the totals of the items
            let po_total_amount = items.reduce((a, b) => +a + (+b['total_item_amount'] || 0), 0)
            let po_total_discount = items.reduce((a, b) => +a + (+b['item_discount'] || 0), 0)



            //get the old items because we need it to dedcut on the stocks
            const old_po_items = await PurchaseOrderItems.query().where('po_number', purchase_order.po_number)



            // check wether the PO has a payment already
            // if yes then we must update the necessary data
            let paid_amount = parseFloat(po.paid_amount)

            //we assume total_amount is change
            let balance_amount = parseFloat(po_total_amount) - parseFloat(paid_amount)

            let receive_total_amount = 0
            if (po.po_type !== 'non-trade') {
                receive_total_amount = 0
            } else {
                receive_total_amount = po_total_amount
            }


            // update the PO
            const purchaseOrder = await PurchaseOrders.query(trx)
                .patch({
                    total_amount: po_total_amount,
                    receive_total_amount: receive_total_amount,
                    balance_amount: balance_amount,
                    total_discount: po_total_discount,
                    supplier_id: purchase_order.supplier.supplier_id,
                    branch_code: purchase_order.branch,
                    invoice_branch_id: purchase_order.branch,
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.user.user_id
                })
                .where('po_number', purchase_order.po_number)



            // Delete the po items
            const poitems = await PurchaseOrderItems.query(trx)
                .delete()
                .where('po_number', purchase_order.po_number)




            if (po.po_type !== 'non-trade') {

                // Deduct it on the stocks as we have deleted it
                const deleted_items = {
                    items: old_po_items,
                    branch_code: purchase_order.branch,
                    type: 'po_items_deleted'
                }
                await PurchaseUtil.UpdatePurchaseItemOnStocks(trx, deleted_items)



                // Insert the po items
                const purchaseorder_items = await PurchaseOrderItems.query(trx)
                    .insertGraph(items)


                //iterate on items and reupdate the prodcut cost price
                // commented 20210425
                // for (var i = 0; i < items.length; i++) {

                //     let data = {
                //         product_id: items[i].product_id,
                //         cost: items[i].cost_price,
                //         user: req.user.user_id
                //     }
                //     await PurchaseUtil.UpdateProductCostPrice(trx, data)
                // }




                // Add it on the stocks as we had inserted the update items
                const added_items = {
                    items: items,
                    branch_code: purchase_order.branch,
                    type: 'po_requested'
                }
                await PurchaseUtil.UpdatePurchaseItemOnStocks(trx, added_items)

            } else {
                //its a nontrade PO

                // Insert the po items
                const purchaseorder_items = await PurchaseOrderItems.query(trx)
                    .insertGraph(items)
            }







            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully updated a new purchase order.'
            })

        });

    } catch (error) {
        next(error)
    }

})

// Added 20210306 - support editing of price
router.post('/update_price', authenticateJWT, async (req, res, next) => {

    try {

        await PurchaseOrders.transaction(async trx => {

            const payload = req.body

            const purchase_order = payload.po
            const po_items = payload.po_items


            //update the purchase order

            //Get the PO
            const po = await PurchaseOrders.query(trx).where('po_number', purchase_order.po_number).first()

            // //map items and calculate totals
            let items = po_items.map((item) => {

                let price = 0

                // check if quoation price is existing, then we should use it
                if (parseFloat(item.quotation_price) > 0) {
                    price = parseFloat(item.quotation_price)
                } else {
                    price = parseFloat(item.actual_price)
                }

                // calculate total amunt in backend
                let total_amount = parseFloat(price) * item.qty

                let product_id = null
                if (po.po_type !== 'non-trade') {
                    product_id = item.product_id
                }

                return {
                    id: item.id,
                    po_number: purchase_order.po_number,
                    product_id: product_id,
                    total_item_amount: total_amount,
                    actual_price: item.actual_price,
                    quotation_price: item.quotation_price,
                }
            })



            // get the totals of the items
            let po_total_amount = items.reduce((a, b) => +a + (+b['total_item_amount'] || 0), 0)
            // let po_total_discount = items.reduce((a, b) => +a + (+b['item_discount'] || 0), 0)


            // // check wether the PO has a payment already
            // // if yes then we must update the necessary data
            let paid_amount = parseFloat(po.paid_amount)

            // //we assume total_amount is change
            let balance_amount = parseFloat(po_total_amount) - parseFloat(paid_amount)


            //calculate totals diff to set the status
            let overpayment_amount = 0
            let payment_status = 'Unpaid'

            if (parseFloat(po_total_amount) == parseFloat(paid_amount)) {
                payment_status = "Paid"
            }

            if (parseFloat(po_total_amount) > parseFloat(paid_amount) && parseFloat(paid_amount) != 0) {
                //partial
                payment_status = "Partial"
            }

            if (parseFloat(po_total_amount) < parseFloat(paid_amount)) {
                //partial
                payment_status = "Paid"
                // over payment here
                overpayment_amount = parseFloat(paid_amount) - parseFloat(po_total_amount)
            }


            // update the PO

            // check if nonn-trade
            if (po.po_type === 'non-trade') {

                await PurchaseOrders.query(trx)
                    .patch({
                        total_amount: po_total_amount,
                        receive_total_amount: po_total_amount,
                        balance_amount: balance_amount,
                        payment_status: payment_status,
                        overpayment_amount: overpayment_amount,
                        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        updated_by: req.user.user_id
                    })
                    .where('po_number', purchase_order.po_number)

            } else {
                await PurchaseOrders.query(trx)
                    .patch({
                        total_amount: po_total_amount,
                        balance_amount: balance_amount,
                        payment_status: payment_status,
                        overpayment_amount: overpayment_amount,
                        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        updated_by: req.user.user_id
                    })
                    .where('po_number', purchase_order.po_number)
            }



            //iterate on items and update it

            for (let i = 0; i < items.length; i++) {

                await PurchaseOrderItems.query(trx).patch({
                    total_item_amount: items[i].total_item_amount,
                    actual_price: items[i].actual_price,
                    quotation_price: items[i].quotation_price
                }).where('id', items[i].id)

            }


            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully updated purchase order.'
            })

        });

    } catch (error) {
        next(error)
    }

})


// Added 20210321 - support editing of price on po that are already received
router.post('/update_received_price', authenticateJWT, async (req, res, next) => {

    try {

        await PurchaseOrders.transaction(async trx => {

            const payload = req.body

            const purchase_order = payload.po
            const po_items = payload.po_items


            //update the purchase order

            //Get the PO
            const po = await PurchaseOrders.query(trx).where('po_number', purchase_order.po_number).first()

            // //map items and calculate totals
            let items = po_items.map((item) => {

                let price = 0

                // check if quoation price is existing, then we should use it
                if (parseFloat(item.quotation_price) > 0) {
                    price = parseFloat(item.quotation_price)
                } else {
                    price = parseFloat(item.actual_price)
                }

                // calculate total amunt in backend
                let total_amount = parseFloat(price) * item.qty
                let receive_total_amount = parseFloat(price) * item.receive_qty

                let product_id = null
                if (po.po_type !== 'non-trade') {
                    product_id = item.product_id
                }

                return {
                    id: item.id,
                    po_number: purchase_order.po_number,
                    product_id: product_id,
                    total_item_amount: total_amount,
                    receive_total_amount: receive_total_amount,
                    actual_price: item.actual_price,
                    quotation_price: item.quotation_price,
                }
            })


            // added and update logic to suppport withhelds (20210606)
            let withold_amount = parseFloat(purchase_order.withold_amount)

            // total_amount - should be the total amount updated by the price without witheld
            let total_amount = items.reduce((a, b) => +a + (+b['receive_total_amount'] || 0), 0)

            // recieve_total_amount should be the total_amount deducted with withold
            let receive_total_amount = parseFloat(total_amount) - withold_amount

            // get the totals of the items
            let po_total_amount = receive_total_amount
            //let po_total_amount = items.reduce((a, b) => +a + (+b['receive_total_amount'] || 0), 0)
            // let po_total_discount = items.reduce((a, b) => +a + (+b['item_discount'] || 0), 0)


            // // check wether the PO has a payment already
            // // if yes then we must update the necessary data
            let paid_amount = parseFloat(po.paid_amount)

            // //we assume total_amount is change
            let balance_amount = parseFloat(po_total_amount) - parseFloat(paid_amount)


            //calculate totals diff to set the status
            let overpayment_amount = 0
            let payment_status = 'Unpaid'

            if (parseFloat(po_total_amount) == parseFloat(paid_amount)) {
                payment_status = "Paid"
            }

            if (parseFloat(po_total_amount) > parseFloat(paid_amount) && parseFloat(paid_amount) != 0) {
                //partial
                payment_status = "Partial"
            }

            if (parseFloat(po_total_amount) < parseFloat(paid_amount)) {
                //partial
                payment_status = "Paid"
                // over payment here
                overpayment_amount = parseFloat(paid_amount) - parseFloat(po_total_amount)
            }


            // update the PO
            const purchaseOrder = await PurchaseOrders.query(trx)
                .patch({
                    total_amount: total_amount,

                    receive_total_amount: po_total_amount,
                    withold_amount: withold_amount,
                    receive_total_amount_without_withhold: total_amount,

                    balance_amount: balance_amount,
                    payment_status: payment_status,
                    overpayment_amount: overpayment_amount,
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.user.user_id
                })
                .where('po_number', purchase_order.po_number)


            //iterate on items and update it

            for (let i = 0; i < items.length; i++) {

                await PurchaseOrderItems.query(trx).patch({
                    total_item_amount: items[i].total_item_amount,
                    actual_price: items[i].actual_price,
                    quotation_price: items[i].quotation_price,
                    receive_total_amount: items[i].receive_total_amount
                }).where('id', items[i].id)

            }


            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully updated purchase order.'
            })

        });

    } catch (error) {
        next(error)
    }

})



// update the PO status
router.post('/update_status', authenticateJWT, async (req, res, next) => {

    try {

        await PurchaseOrders.transaction(async trx => {

            const payload = req.body
            const po_numbers = payload.po_numbers
            const status = payload.status

            // multiple update here
            for (var i = po_numbers.length - 1; i >= 0; i--) {

                if (status === 'Sent') {
                    // check the po_type for non-trade
                    if (po_numbers[i].po_type === 'non-trade') {
                        await PurchaseOrders.query(trx).patch({ status: 'Close', is_sentto_supplier: 1 }).where('po_number', po_numbers[i].po_number)
                    } else {
                        await PurchaseOrders.query(trx).patch({ status: status, is_sentto_supplier: 1 }).where('po_number', po_numbers[i].po_number)
                    }

                } else {
                    await PurchaseOrders.query(trx).patch({ status: status }).where('po_number', po_numbers[i])
                }
            }

            // //update the purchase order
            // const purchaseOrder = 

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully updated a new purchase order.'
            })

        });

    } catch (error) {
        next(error)
    }

})



/* 
router.post('/po_receiving', authenticateJWT, async (req, res, next) => {

    try {

        await PurchaseOrders.transaction(async trx => {

            const payload = req.body

            const purchase_order = payload.purchaseorder
            const po_items = payload.items
            const auto_transfers = payload.auto_transfers

            //map items
            var items = po_items.map((item) => {

                //calculate the total_receive_amount
                // check wether to use the cost or quoted price
                let cost = 0
                if (item.quotation_price) {
                    cost = item.quotation_price
                } else {
                    cost = item.price
                }

                let receive_total_amount = parseFloat(cost) * parseFloat(item.receive_quantity)

                return {
                    id: item.id,
                    product_id: item.product.product_id,
                    po_number: purchase_order.po_number,
                    po_quantity: item.po_quantity,
                    total_item_amount: item.total_item_amount,
                    actual_price: item.price,
                    receive_qty: item.receive_quantity,
                    old_receive_quantity: item.old_receive_quantity,
                    receive_total_amount: receive_total_amount,
                    receive_item_status: item.receive_item_status
                }
            })

            var items_receives = items.filter((item) => { return item.receive_qty != item.old_receive_quantity })

            // IMPORTANT ------->
            // if item quantity never change, take it out on the list because we dont want to process it.

            for (var i = 0; i < items_receives.length; i++) {

                // we need to get the newly added quantity only.
                var newly_receive_quantity = parseInt(items_receives[i].receive_qty) - parseInt(items_receives[i].old_receive_quantity)

                await PurchaseOrderItems.query(trx)
                    .patch({
                        receive_qty: items_receives[i].receive_qty,
                        receive_total_amount: items_receives[i].receive_total_amount,
                        date_receive: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        receive_encoder: req.user.user_id
                    })
                    .where('id', items_receives[i].id)


                let data = {
                    item: items_receives[i],
                    branch_code: purchase_order.branch_code,
                    user_id: req.user.user_id,
                    item_qty: newly_receive_quantity,
                    type: 'po_receive',
                    ref_field: 'po_number'
                }


                await StocksUtil.ProcessStockIns(trx, data)

            }


            //iterate over the items and update it on the stocks table (po_qty) if how many is received
            let mappedItems = items_receives.map(item => {
                return {
                    product_id: item.product_id,
                    qty: item.receive_qty
                }
            })
            let itemsdata = {
                items: mappedItems,
                branch_code: purchase_order.branch_code,
                type: 'po_received'
            }
            await PurchaseUtil.UpdatePurchaseItemOnStocks(trx, itemsdata)


            // insert receiving table logs
            po_qty_totals = items.reduce((a, b) => +a + (+b['po_quantity'] || 0), 0)
            receive_qty_totals = items.reduce((a, b) => +a + (+b['receive_qty'] || 0), 0)
            receive_total_amount = items.reduce((a, b) => +a + (+b['receive_total_amount'] || 0), 0)


            let receive_status = null

            if (receive_qty_totals == po_qty_totals) {
                receive_status = "Received"
            }

            if (receive_qty_totals < po_qty_totals) {
                receive_status = "Partial"
            }

            if (receive_qty_totals > po_qty_totals) {
                receive_status = "Received-Over"
            }

            const purchaseOrder = await PurchaseOrders.query(trx)
                .patch({
                    receive_total_amount: receive_total_amount,
                    status: receive_status,
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.user.user_id
                })
                .where('po_number', purchase_order.po_number)


            // Added to support PO Receiving + Autotransfer to selected branch
            // original wrap in single transaction
            if (auto_transfers.length > 0) {
                //process it
                let transferData = {
                    from_branch_code: purchase_order.branch_code,
                    items: auto_transfers,
                    user: req.user.user_id
                }
                await PurchaseUtil.PurchaseAutoTransferToBranch(trx, transferData)
            }

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully updated a new purchase order.'
            })

        });

    } catch (error) {
        next(error)
    }

})
*/




// modified separate 2 transactions
// modified 20210504 must support multiple receiving

// must add withholding amount ...

router.post('/po_receiving', authenticateJWT, async (req, res, next) => {

    try {

        const payload = req.body

        const purchase_order = payload.purchaseorder
        const po_items = payload.items
        const auto_transfers = payload.auto_transfers

        await PurchaseOrders.transaction(async trx => {


            //map items
            var items = po_items.map((item) => {

                //calculate the total_receive_amount
                // check wether to use the cost or quoted price
                let cost = 0
                if (item.quotation_price) {
                    cost = item.quotation_price
                } else {
                    cost = item.price
                }

                let receive_total_amount = parseFloat(cost) * parseFloat(item.receive_quantity)

                return {
                    id: item.id,
                    product_id: item.product.product_id,
                    po_number: purchase_order.po_number,
                    po_quantity: item.po_quantity,
                    total_item_amount: item.total_item_amount,
                    actual_price: item.price,
                    receive_qty: item.receive_quantity,
                    old_receive_quantity: item.old_receive_quantity,
                    receive_total_amount: receive_total_amount,
                    receive_item_status: item.receive_item_status
                }
            })

            var items_receives = items.filter((item) => { return item.receive_qty != item.old_receive_quantity })

            // IMPORTANT ------->
            // if item quantity never change, take it out on the list because we dont want to process it.

            for (var i = 0; i < items_receives.length; i++) {

                // we need to get the newly added quantity only.
                var newly_receive_quantity = parseInt(items_receives[i].receive_qty) - parseInt(items_receives[i].old_receive_quantity)

                await PurchaseOrderItems.query(trx)
                    .patch({
                        receive_qty: items_receives[i].receive_qty,
                        receive_total_amount: items_receives[i].receive_total_amount,
                        date_receive: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        receive_encoder: req.user.user_id
                    })
                    .where('id', items_receives[i].id)


                let data = {
                    item: items_receives[i],
                    branch_code: purchase_order.branch_code,
                    user_id: req.user.user_id,
                    item_qty: newly_receive_quantity,
                    type: 'po_receive',
                    ref_field: 'po_number'
                }


                await StocksUtil.ProcessStockIns(trx, data)

            }


            //iterate over the items and update it on the stocks table (po_qty) if how many is received
            let mappedItems = items_receives.map(item => {
                return {
                    product_id: item.product_id,
                    qty: item.receive_qty
                }
            })
            let itemsdata = {
                items: mappedItems,
                branch_code: purchase_order.branch_code,
                type: 'po_received'
            }
            await PurchaseUtil.UpdatePurchaseItemOnStocks(trx, itemsdata)


            // insert receiving table logs
            po_qty_totals = items.reduce((a, b) => +a + (+b['po_quantity'] || 0), 0)
            receive_qty_totals = items.reduce((a, b) => +a + (+b['receive_qty'] || 0), 0)
            receive_total_amount = items.reduce((a, b) => +a + (+b['receive_total_amount'] || 0), 0)


            let receive_status = null

            if (receive_qty_totals == po_qty_totals) {
                receive_status = "Received"
            }

            if (receive_qty_totals < po_qty_totals) {
                receive_status = "Partial"
            }

            if (receive_qty_totals > po_qty_totals) {
                receive_status = "Received-Over"
            }


            // add support fot he witholding here

            let receive_total_amount_without_withhold = receive_total_amount
            let receive_total_amount_with_withold = parseFloat(receive_total_amount) - parseFloat(purchase_order.withold_amount)

            // we need to recalculate the balance here
            let balance_amount = parseFloat(receive_total_amount_with_withold) - parseFloat(purchase_order.paid_amount)



            const purchaseOrder = await PurchaseOrders.query(trx)
                .patch({

                    withold_amount: parseFloat(purchase_order.withold_amount),

                    receive_total_amount: receive_total_amount_with_withold,
                    receive_total_amount_without_withhold: receive_total_amount_without_withhold,

                    balance_amount: balance_amount,

                    status: receive_status,
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.user.user_id
                })
                .where('po_number', purchase_order.po_number)

        });

        await PurchaseOrders.transaction(async trx => {

            // Added to support PO Receiving + Autotransfer to selected branch
            if (auto_transfers.length > 0) {
                //process it
                let transferData = {
                    from_branch_code: purchase_order.branch_code,
                    items: auto_transfers,
                    user: req.user.user_id
                }
                await PurchaseUtil.PurchaseAutoTransferToBranch(trx, transferData)
            }

        });

        res.status(200).json({
            status: 'ok',
            title: 'Successful',
            message: 'Successfully updated a new purchase order.'
        })

    } catch (error) {
        next(error)
    }

})


// before adding witholding

// router.post('/po_receiving', authenticateJWT, async (req, res, next) => {

//     try {

//         const payload = req.body

//         const purchase_order = payload.purchaseorder
//         const po_items = payload.items
//         const auto_transfers = payload.auto_transfers

//         await PurchaseOrders.transaction(async trx => {


//             //map items
//             var items = po_items.map((item) => {

//                 //calculate the total_receive_amount
//                 // check wether to use the cost or quoted price
//                 let cost = 0
//                 if (item.quotation_price) {
//                     cost = item.quotation_price
//                 } else {
//                     cost = item.price
//                 }

//                 let receive_total_amount = parseFloat(cost) * parseFloat(item.receive_quantity)

//                 return {
//                     id: item.id,
//                     product_id: item.product.product_id,
//                     po_number: purchase_order.po_number,
//                     po_quantity: item.po_quantity,
//                     total_item_amount: item.total_item_amount,
//                     actual_price: item.price,
//                     receive_qty: item.receive_quantity,
//                     old_receive_quantity: item.old_receive_quantity,
//                     receive_total_amount: receive_total_amount,
//                     receive_item_status: item.receive_item_status
//                 }
//             })

//             var items_receives = items.filter((item) => { return item.receive_qty != item.old_receive_quantity })

//             // IMPORTANT ------->
//             // if item quantity never change, take it out on the list because we dont want to process it.

//             for (var i = 0; i < items_receives.length; i++) {

//                 // we need to get the newly added quantity only.
//                 var newly_receive_quantity = parseInt(items_receives[i].receive_qty) - parseInt(items_receives[i].old_receive_quantity)

//                 await PurchaseOrderItems.query(trx)
//                     .patch({
//                         receive_qty: items_receives[i].receive_qty,
//                         receive_total_amount: items_receives[i].receive_total_amount,
//                         date_receive: dayjs().format('YYYY-MM-DD HH:mm:ss'),
//                         receive_encoder: req.user.user_id
//                     })
//                     .where('id', items_receives[i].id)


//                 let data = {
//                     item: items_receives[i],
//                     branch_code: purchase_order.branch_code,
//                     user_id: req.user.user_id,
//                     item_qty: newly_receive_quantity,
//                     type: 'po_receive',
//                     ref_field: 'po_number'
//                 }


//                 await StocksUtil.ProcessStockIns(trx, data)

//             }


//             //iterate over the items and update it on the stocks table (po_qty) if how many is received
//             let mappedItems = items_receives.map(item => {
//                 return {
//                     product_id: item.product_id,
//                     qty: item.receive_qty
//                 }
//             })
//             let itemsdata = {
//                 items: mappedItems,
//                 branch_code: purchase_order.branch_code,
//                 type: 'po_received'
//             }
//             await PurchaseUtil.UpdatePurchaseItemOnStocks(trx, itemsdata)


//             // insert receiving table logs
//             po_qty_totals = items.reduce((a, b) => +a + (+b['po_quantity'] || 0), 0)
//             receive_qty_totals = items.reduce((a, b) => +a + (+b['receive_qty'] || 0), 0)
//             receive_total_amount = items.reduce((a, b) => +a + (+b['receive_total_amount'] || 0), 0)


//             let receive_status = null

//             if (receive_qty_totals == po_qty_totals) {
//                 receive_status = "Received"
//             }

//             if (receive_qty_totals < po_qty_totals) {
//                 receive_status = "Partial"
//             }

//             if (receive_qty_totals > po_qty_totals) {
//                 receive_status = "Received-Over"
//             }

//             const purchaseOrder = await PurchaseOrders.query(trx)
//                 .patch({
//                     receive_total_amount: receive_total_amount,
//                     status: receive_status,
//                     updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
//                     updated_by: req.user.user_id
//                 })
//                 .where('po_number', purchase_order.po_number)

//         });

//         await PurchaseOrders.transaction(async trx => {

//             // Added to support PO Receiving + Autotransfer to selected branch
//             if (auto_transfers.length > 0) {
//                 //process it
//                 let transferData = {
//                     from_branch_code: purchase_order.branch_code,
//                     items: auto_transfers,
//                     user: req.user.user_id
//                 }
//                 await PurchaseUtil.PurchaseAutoTransferToBranch(trx, transferData)
//             }

//         });

//         res.status(200).json({
//             status: 'ok',
//             title: 'Successful',
//             message: 'Successfully updated a new purchase order.'
//         })

//     } catch (error) {
//         next(error)
//     }

// })




module.exports = router;