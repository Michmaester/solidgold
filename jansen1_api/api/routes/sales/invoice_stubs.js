const express = require('express');
const router = express.Router();

const dayjs = require('dayjs');
const authenticateJWT = require('../../middlewares/authenticateJWT')

const Generator = require('../../utils/reference_generator')
const Helpers = require('../../utils/helpers')
const UserUtils = require('../../utils/user_util')
const StocksUtils = require('../../utils/stocks_util')
const PaymentUtils = require('../../utils/payments_util')

const InvoiceStubs = require('../../models/sales/invoice_stubs')
const InvoiceStubDetails = require('../../models/sales/invoice_stub_details')


router.get('/', async (req, res, next) => {

    try {

        const params = req.query

        const branch_code = req.headers.xbranchcode
        //const branch_code = 'SG'

        let query = InvoiceStubs.query().withGraphFetched('[stub_details,invoice.[customer,trans_items]]')

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


/* Create invoice stubs + 1 detail */
router.post('/', authenticateJWT, async (req, res, next) => {

    try {

        await InvoiceStubs.transaction(async trx => {

            const params = req.body
            const branch_code = req.headers.xbranchcode

            let invoice_stub = params.invoice_stub
            let invoice_stub_details = params.invoice_stub_details


            //create control number
            let unix_timestamp = dayjs().unix()
            let control_no = invoice_stub.invoice_no + '-' + unix_timestamp

            let status = null

            //check the balance, if 0 then complete if not then partial
            let balance = parseInt(invoice_stub.total_items_qty) - parseInt(invoice_stub_details.qty)

            if (balance == 0) {
                status = 'Completed'
            } else {
                status = 'Partial'
            }

            const stub = await InvoiceStubs.query(trx).insert({
                invoice_no: invoice_stub.invoice_no,
                generated_datetime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                total_items_qty: invoice_stub.total_items_qty,
                balance_qty: balance,
                status: status,
                remarks: invoice_stub.remarks,
                user_id: req.user.user_id,
                branch_code: branch_code,
                created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                created_by: req.user.user_id
            })

            await InvoiceStubDetails.query(trx).insert({
                stub_id: stub.id,
                control_no: control_no,
                invoice_no: stub.invoice_no,
                action_datetime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                balance: balance,
                qty: invoice_stub_details.qty,
                remarks: invoice_stub_details.remarks,
                created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                created_by: req.user.user_id,
                updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                updated_by: req.user.user_id
            })

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully created a new Invoice Stub with detail.'
            })
        })

    } catch (error) {
        next(error)
    }
})


/* Add stub detail */
router.post('/detail', authenticateJWT, async (req, res, next) => {

    try {

        await InvoiceStubs.transaction(async trx => {

            const params = req.body
            const branch_code = req.headers.xbranchcode

            let invoice_stub = params.invoice_stub
            let invoice_stub_details = params.invoice_stub_details


            //create control number
            let unix_timestamp = dayjs().unix()
            let control_no = invoice_stub.invoice_no + '-' + unix_timestamp

            let status = null


            // query the stub details
            const stub_details = await InvoiceStubDetails.query(trx).where('invoice_no', invoice_stub.invoice_no)


            //check the balance, if 0 then complete if not then partial
            let stub_details_qty = parseInt(Helpers.calculateTotals(stub_details, 'qty')) + parseInt(invoice_stub_details.qty)
            let balance = parseInt(invoice_stub.total_items_qty) - parseInt(stub_details_qty)

            if (balance == 0) {
                status = 'Completed'
            } else {
                status = 'Partial'
            }

            await InvoiceStubDetails.query(trx).insert({
                stub_id: invoice_stub.id,
                control_no: control_no,
                invoice_no: invoice_stub.invoice_no,
                action_datetime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                balance: balance,
                qty: invoice_stub_details.qty,
                remarks: invoice_stub_details.remarks,
                created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                created_by: req.user.user_id,
                updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                updated_by: req.user.user_id
            })

            await InvoiceStubs.query(trx).patch({
                balance_qty: balance,
                status: status,
                updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                updated_by: req.user.user_id
            }).where('id', invoice_stub.id,)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully added a stub detail.'
            })
        })

    } catch (error) {
        next(error)
    }
})






// router.post('/', authenticateJWT, async (req, res, next) => {

//     try {

//         await SalesOrders.transaction(async trx => {


//             const branch_code = req.headers.xbranchcode

//             const payload = req.body
//             const salesorder = payload.salesorder
//             const salesorder_items = payload.salesorder_items

//             //generate product_id
//             const newSaleOrderNo = await Generator.GenerateReference(trx, 'sales_order')

//             salesorder.order_no = newSaleOrderNo + Generator.RandomNumberGenerator()
//             salesorder.status = 'submitted'
//             salesorder.order_date = dayjs().format('YYYY-MM-DD HH:mm:ss')
//             salesorder.is_printed = null
//             salesorder.shipment = 'Pickup'
//             salesorder.user_id = req.user.user_id
//             salesorder.branch_code = branch_code
//             salesorder.created_at = dayjs().format('YYYY-MM-DD HH:mm:ss')
//             salesorder.created_by = req.user.user_id
//             //default to zero
//             salesorder.delivery_fee = 0


//             const salesOrder = await SalesOrders.query(trx)
//                 .insert(salesorder)

//             salesorder_items.forEach((data) => {
//                 data.order_no = salesorder.order_no
//             })

//             await SalesOrderItems.query(trx).insertGraph(salesorder_items)

//             await Generator.UpdateRunningValue(trx, 'sales_order', newSaleOrderNo)

//             let log = {
//                 event: 'create-sales-order',
//                 user_id: req.user.user_id,
//                 branch_code: branch_code
//             }
//             await UserUtils.LoggedEvent(trx, log)

//             res.status(200).json({
//                 status: 'ok',
//                 title: 'Successful',
//                 message: 'Successfully created a new sales order.',
//                 total_counts: salesOrder.length,
//                 data: salesOrder
//             })

//         });

//     } catch (error) {
//         next(error)
//     }

// })


// router.post('/update_status', async (req, res, next) => {

//     try {

//         await SalesOrders.transaction(async trx => {

//             const payload = req.body

//             const salesOrder = await SalesOrders.query(trx)
//                 .update({ status: payload.status })
//                 .where('order_no', payload.order_no)

//             res.status(200).json({
//                 status: 'ok',
//                 title: 'Successful',
//                 message: 'Successfully updated status',
//                 total_counts: salesOrder.length,
//                 data: salesOrder
//             })

//         });

//     } catch (error) {
//         next(error)
//     }

// })








module.exports = router;