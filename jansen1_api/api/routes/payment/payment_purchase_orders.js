const express = require('express');
const router = express.Router();

const dayjs = require('dayjs');
const authenticateJWT = require('../../middlewares/authenticateJWT')

const PaymentPurchaseOrders = require('../../models/payment/payment_purchase_orders')
const PurchaseOrders = require('../../models/purchase/purchase_orders');
const ChequeVouchers = require('../../models/payment/cheque_vouchers')


// const Generator = require('../../utils/')
const Generator = require('../../utils/reference_generator')


const Helpers = require('../../utils/helpers')

router.get('/', async (req, res, next) => {

    try {

        const results = await PaymentPurchaseOrders.query().withGraphFetched('po.[po_items.product,supplier,branch]')

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})


router.get('/cheque_vouchers', async (req, res, next) => {

    try {
        const params = req.query

        //const branch_code = req.headers.xbranchcode
        /* IMPORTANT -  WE ASSUME only 1 branch is doing the PO as of now */

        let query = ChequeVouchers.query()
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


router.get('/:po_number', async (req, res, next) => {

    try {

        const po_number = req.params.po_number

        const results = await PaymentPurchaseOrders.query().findOne('po_number', po_number)

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})

// endpoint is not use anymore
router.post('/', authenticateJWT, async (req, res, next) => {

    try {

        await PaymentPurchaseOrders.transaction(async trx => {

            const payload = req.body

            const po = payload.purchase_order
            let payments = payload.purchase_payments

            //process the "is_new=1" payments only
            let overpayment_amount = 0
            let total_payments = payments.reduce((a, b) => +a + (+b['payment_amount'] || 0), 0).toFixed(2)
            let receive_total_amount = po.receive_total_amount

            let balance = parseFloat(receive_total_amount) - parseFloat(total_payments)

            //console.log('baance ' + balance)
            let payment_status = 'Unpaid'

            if (balance == 0) {
                payment_status = 'Paid'
            }

            if (balance < 0) {
                overpayment_amount = Math.abs(balance)
                payment_status = 'Paid'
            }

            if (balance > 0) {
                payment_status = 'Partial'
            }


            // filter out the "is_new =1 " rows
            let payment_items = payments.filter((item) => {
                return item.is_new == 1
            })


            for (var i = 0; i < payment_items.length; i++) {

                let cheque_voucher_no = null


                switch (payment_items[i].type) {

                    case 'CASH':
                        // insert cash
                        //null the cheque values
                        payment_items[i].cheque_date = null
                        payment_items[i].cheque_bank = {
                            name: null,
                            id: null
                        }

                        break

                    case 'CHEQUE':
                        //generate cheque voucher
                        //generate po_no
                        const newCv = await Generator.GenerateReference(trx, 'cheque_voucher')

                        cheque_voucher_no = newCv + Generator.RandomNumberGenerator()

                        await PaymentPurchaseOrders.query(trx).insert({
                            cheque_voucher_no: cheque_voucher_no,
                            cheque_no: payment_items[i].cheque_no,
                            cheque_name: payment_items[i].cheque_name,
                            cheque_amount: payment_items[i].cheque_amount,
                            cheque_date: payment_items[i].cheque_date,
                            cheque_bank: payment_items[i].cheque_bank.name,
                            cheque_bank_id: payment_items[i].cheque_bank.id,
                            supplier_id: payment_items[i].supplier_id,
                            created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                            created_by: req.user.user_id

                        })

                        await Generator.UpdateRunningValue(trx, 'cheque_voucher', newCv)


                        break

                    default:
                        break
                }


                await PaymentPurchaseOrders.query(trx)
                    .insert({
                        po_number: po.po_number,
                        payment_amount: payment_items[i].payment_amount,
                        payment_type: payment_items[i].type,
                        payment_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        cash_amount: payment_items[i].cash_amount,

                        cheque_voucher_no: cheque_voucher_no,
                        cheque_no: payment_items[i].cheque_no,
                        cheque_name: payment_items[i].cheque_name,
                        cheque_amount: payment_items[i].cheque_amount,
                        cheque_date: payment_items[i].cheque_date,
                        cheque_bank: payment_items[i].cheque_bank.name,
                        cheque_bank_id: payment_items[i].cheque_bank.id,
                        status: payment_items[i].status,

                        supplier_id: po.supplier_id
                    })
            }

            // update the purchase order record
            await PurchaseOrders.query(trx)
                .patch({
                    payment_status: payment_status,
                    overpayment_amount: overpayment_amount,
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.user.user_id
                })
                .where('po_number', po.po_number)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully created a new payment.',
            })

        });

    } catch (error) {
        next(error)
    }

})

router.put('/', authenticateJWT, async (req, res, next) => {

    try {

        await PaymentPurchaseOrders.transaction(async trx => {

            const payload = req.body

            const payment = await PaymentPurchaseOrders.query(trx)
                .update({
                    po_amount: payload.po_amount,
                    // payment_type : payload.payment_type,
                    payment_date: payload.payment_date,
                    cash_amount: payload.cash_amount,
                    cheque_bank: payload.cheque_bank,
                    cheque_name: payload.cheque_name,
                    cheque_amount: payload.cheque_amount,
                    cheque_date: payload.cheque_date,
                    bank_id: payload.bank_id

                })
                .where('po_number', payload.po_number)


            //check what payment method is it
            // insert payment info on the selected payment method

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully updated a new payment.',
                total_counts: payment.length,
                data: payment
            })

        });

    } catch (error) {
        next(error)
    }

})



router.post('/payment_po_submit', authenticateJWT, async (req, res, next) => {

    try {

        await PaymentPurchaseOrders.transaction(async trx => {

            const payload = req.body
            const po = payload.po
            const payments = payload.payments

            const payments_total = payments.reduce((a, b) => +a + (+b['amount'] || 0), 0).toFixed(2)

            const paytrans_date = dayjs().format('YYYY-MM-DD HH:mm:ss')
            // interate on payload.payments and insert
            for (var i = 0; i < payments.length; i++) {

                switch (payments[i].type) {

                    case 'CASH':
                        // insert cash

                        await PaymentPurchaseOrders.query(trx).insert({
                            po_number: po.po_number,
                            payment_amount: payments[i].amount,
                            payment_type: 'CASH',
                            payment_date: paytrans_date,
                            created_at: paytrans_date,
                            created_by: req.user.user_id,
                            supplier_id: po.supplier_id

                        })
                        break

                    case 'CHEQUE':

                        let cheque_voucher_no = null

                        //generate cheque voucher
                        const newCv = await Generator.GenerateReference(trx, 'cheque_voucher')

                        cheque_voucher_no = newCv + Generator.RandomNumberGenerator()


                        /* check cheque amount + cheque bank id */

                        await ChequeVouchers.query(trx).insert({
                            cheque_voucher_no: cheque_voucher_no,
                            cheque_no: payments[i].cheque_no,
                            cheque_name: payments[i].cheque_name,
                            cheque_amount: payments[i].amount,
                            cheque_date: payments[i].cheque_date,
                            cheque_bank: payments[i].cheque_bank.name,
                            cheque_bank_id: payments[i].cheque_bank.id,
                            supplier_id: po.supplier_id,
                            created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                            created_by: req.user.user_id
                        })

                        await Generator.UpdateRunningValue(trx, 'cheque_voucher', newCv)

                        await PaymentPurchaseOrders.query(trx).insert({
                            po_number: po.po_number,
                            payment_amount: payments[i].amount,
                            payment_type: 'CHEQUE',
                            payment_date: paytrans_date,
                            cheque_voucher_no: cheque_voucher_no,
                            cheque_no: payments[i].cheque_no,
                            cheque_name: payments[i].cheque_name,
                            cheque_date: payments[i].cheque_date,
                            cheque_bank: payments[i].cheque_bank.name,
                            cheque_bank_id: payments[i].cheque_bank.id,
                            created_at: paytrans_date,
                            created_by: req.user.user_id,
                            supplier_id: po.supplier_id
                        })
                        break

                    default:
                        break
                }

            }


            var new_balance = parseFloat(po.balance_amount) - parseFloat(payments_total)
            var paid_amount = parseFloat(po.paid_amount) + parseFloat(payments_total)
            var paystatus = po.payment_status

            if (new_balance <= 0) {
                paystatus = 'Paid'
            }

            if (new_balance > 0 && new_balance < po.receive_total_amount) {
                paystatus = 'Partial'
            }

            if (new_balance == po.receive_total_amount) {
                paystatus = 'Unpaid'
            }


            const purchaseOrder = await PurchaseOrders.query(trx).patch({
                paid_amount: paid_amount,
                balance_amount: new_balance,
                payment_status: paystatus
            }).where('po_number', po.po_number)

            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully submitted a new PO payment.'
            })

        });

    } catch (error) {
        next(error)
    }

})

router.post('/payment_supplier_po_submit', authenticateJWT, async (req, res, next) => {

    try {

        await PaymentPurchaseOrders.transaction(async trx => {


            const payload = req.body

            const supplier_payment_type = payload.supplier_payment_type
            const supplier = payload.supplier
            const po_choices = payload.po_choices
            const payments = payload.payments


            var pos = []

            // IMPORTANT
            // paymet type will be limited to single method only for customer invoice payment


            //check the type
            // by invoice_priority
            // by invoice_choices

            const payments_total = payments.reduce((a, b) => +a + (+b['amount'] || 0), 0).toFixed(2)


            if (supplier_payment_type === 'po_priority') {

                const supplier_pos = await PurchaseOrders.query(trx).where('supplier_id', supplier.supplier_id)
                    .where('payment_status', '!=', 'Paid')
                    .orderBy('id', 'ASC')

                // const customer_invoices = await SalesTransactions.query(trx).where('customer_id', customer.customer_id)
                //     .where('payment_status', '!=', 'Paid')
                //     .orderBy('id', 'ASC')
                pos = supplier_pos
            }

            if (supplier_payment_type === 'po_choices') {
                pos = po_choices
            }


            var payment_remaining = payments_total
            var pos_payments = []
            var actual_payment_amount = 0

            const single_payment = payments[0]

            for (var i = 0; i < pos.length; i++) {

                var diff_res = parseFloat(payment_remaining) - parseFloat(pos[i].balance_amount)

                //if less than zero thats a balance
                //if greater than zero then its a total remaining

                if (diff_res > 0) {
                    actual_payment_amount = pos[i].balance_amount
                    payment_remaining = diff_res
                } else {
                    actual_payment_amount = payment_remaining
                    payment_remaining = 0
                }


                var new_paid_amount = parseFloat(pos[i].paid_amount) + parseFloat(actual_payment_amount)
                var new_balance = pos[i].balance_amount - new_paid_amount
                if (new_balance > 0) {
                    new_balance = Math.abs(new_balance)
                } else {
                    new_balance = 0
                }


                var paystatus = pos[i].payment_status

                if (new_balance <= 0) {
                    paystatus = 'Paid'
                }

                if (new_balance > 0 && new_balance < pos[i].balance_amount) {
                    paystatus = 'Partial'
                }

                if (new_balance == pos[i].balance_amount) {
                    paystatus = 'Unpaid'
                }

                pos_payments.push(
                    {
                        po_id: pos[i].id,
                        po_number: pos[i].po_number,
                        supplier_id: pos[i].supplier_id,

                        payment_details: single_payment,

                        actual_payment_amount: parseFloat(actual_payment_amount),
                        paid_amount: new_paid_amount,
                        balance_amount: new_balance,
                        payment_status: paystatus,
                        total_payment_remaining: payment_remaining
                    }
                )
            }



            // generate cheque voucher here
            // use the cheque voucher no on the cheque payments
            let cheque_voucher_no = null
            if (single_payment.type === 'CHEQUE') {
                //generate cheque voucher
                const newCv = await Generator.GenerateReference(trx, 'cheque_voucher')

                cheque_voucher_no = newCv + Generator.RandomNumberGenerator()


                /* check cheque amount + cheque bank id */

                await ChequeVouchers.query(trx).insert({
                    cheque_voucher_no: cheque_voucher_no,
                    cheque_no: payments[0].cheque_no,
                    cheque_name: payments[0].cheque_name,
                    cheque_amount: payments[0].amount,
                    cheque_date: payments[0].cheque_date,
                    cheque_bank: payments[0].cheque_bank.name,
                    cheque_bank_id: payments[0].cheque_bank.id,
                    supplier_id: supplier.supplier_id,
                    created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    created_by: req.user.user_id
                })

                await Generator.UpdateRunningValue(trx, 'cheque_voucher', newCv)
            }


            for (var i = 0; i < pos_payments.length; i++) {

                //check transaction number on payment tender table

                // it should be on the record
                //use the id for the payment inserts
                // const payment = await PaymentTenders.query(trx)
                //     .where('sales_transaction_id', invoices_payments[i].trans_id).first()


                // insert payments
                // array
                const paytrans_date = dayjs().format('YYYY-MM-DD HH:mm:ss')
                // interate on payload.payments and insert


                switch (pos_payments[i].payment_details.type) {

                    case 'CASH':
                        // insert cash
                        await PaymentPurchaseOrders.query(trx).insert({
                            po_number: pos_payments[i].po_number,
                            payment_amount: pos_payments[i].actual_payment_amount,
                            payment_type: 'CASH',
                            payment_date: paytrans_date,
                            created_at: paytrans_date,
                            created_by: req.user.user_id,
                            supplier_id: pos_payments[i].supplier_id

                        })
                        break

                    case 'CHEQUE':

                        // await PaymentPurchaseOrders.query(trx).insert({
                        //     po_number: po.po_number,
                        //     payment_amount: payments[i].amount,
                        //     payment_type: 'CHEQUE',
                        //     payment_date: paytrans_date,
                        //     cheque_voucher_no: cheque_voucher_no,
                        //     cheque_no: payments[i].cheque_no,
                        //     cheque_name: payments[i].cheque_name,
                        //     cheque_date: payments[i].cheque_date,
                        //     cheque_bank: payments[i].cheque_bank.name,
                        //     cheque_bank_id: payments[i].cheque_bank.id,
                        //     created_at: paytrans_date,
                        //     created_by: req.user.user_id,
                        //     supplier_id: po.supplier_id
                        // })

                        await PaymentPurchaseOrders.query(trx).insert({
                            po_number: pos_payments[i].po_number,
                            payment_amount: pos_payments[i].actual_payment_amount,
                            payment_type: 'CHEQUE',
                            payment_date: paytrans_date,
                            cheque_voucher_no: cheque_voucher_no,
                            cheque_no: pos_payments[i].payment_details.cheque_no,
                            cheque_name: pos_payments[i].payment_details.cheque_name,
                            cheque_date: pos_payments[i].payment_details.cheque_date,
                            cheque_bank: pos_payments[i].payment_details.cheque_bank.name,
                            cheque_bank_id: pos_payments[i].payment_details.cheque_bank.id,
                            created_at: paytrans_date,
                            created_by: req.user.user_id,
                            supplier_id: pos_payments[i].supplier_id
                        })
                        break

                    default:
                        break
                }




                // var new_balance = parseFloat(po.balance_amount) - parseFloat(payments_total)
                // var paid_amount = parseFloat(po.paid_amount) + parseFloat(payments_total)
                // var paystatus = po.payment_status

                // if (new_balance <= 0) {
                //     paystatus = 'Paid'
                // }

                // if (new_balance > 0 && new_balance < po.receive_total_amount) {
                //     paystatus = 'Partial'
                // }

                // if (new_balance == po.receive_total_amount) {
                //     paystatus = 'Unpaid'
                // }


                await PurchaseOrders.query(trx).patch({
                    paid_amount: pos_payments[i].paid_amount,
                    balance_amount: pos_payments[i].balance_amount,
                    payment_status: pos_payments[i].payment_status
                }).where('po_number', pos_payments[i].po_number)




                // //update the sales transaction
                // const trans = await SalesTransactions.query(trx)
                //     .patch({
                //         total_amount_tendered: invoices_payments[i].total_amount_tendered,
                //         balance_amount: invoices_payments[i].balance_amount,
                //         payment_status: invoices_payments[i].payment_status

                //     })
                //     .where('invoice_no', invoices_payments[i].invoice_no)
            }










            // // all payments are succesfully inserted
            // // we must update the sales_transaction

            // // update the transaction
            // // amount paid
            // // balance
            // // status

            // var new_balance = transaction.balance_amount - payments_total
            // var total_amount_tendered = parseFloat(transaction.total_amount_tendered) + parseFloat(payments_total)
            // var paystatus = transaction.payment_status

            // if(new_balance <= 0){
            //     paystatus = 'Paid'
            // }

            // if(new_balance > 0 && new_balance < transaction.total_amount_due){
            //     paystatus = 'Partial'
            // }

            // if(new_balance == transaction.total_amount_due){
            //     paystatus = 'Unpaid'
            // }


            // //update the transaction
            // const trans = await SalesTransactions.query(trx)
            //                     .patch({
            //                         total_amount_tendered : total_amount_tendered,
            //                         balance_amount : new_balance,
            //                         payment_status : paystatus

            //                     })
            //                     .where('invoice_no',transaction.invoice_no)


            res.status(200).json({
                status: 'ok',
                title: 'Successful',
                message: 'Successfully created a new sales transactions and payment.'
            })

        });

    } catch (error) {
        next(error)
    }

})

module.exports = router;