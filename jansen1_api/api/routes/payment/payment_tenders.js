const express = require('express');
const router = express.Router();

const dayjs = require('dayjs');

const PaymentTenders = require('../../models/payment/payment_tenders')
const PaymentTendersReturns = require('../../models/payment/payment_tenders_returns')
const PaymentTendersCash = require('../../models/payment/payment_tenders_cash')
const PaymentTendersCard = require('../../models/payment/payment_tenders_card')
const PaymentTendersCharge = require('../../models/payment/payment_tenders_charge')
const PaymentTendersCheque = require('../../models/payment/payment_tenders_cheque')
const SalesTransactions = require('../../models/sales/sales_transactions')
const SalesReturns = require('../../models/sales/sales_returns')

const authenticateJWT = require('../../middlewares/authenticateJWT')
const Helpers = require('../../utils/helpers');

//const { SalesReturn } = require('../../utils/report_queries');



router.get('/', async (req, res, next) => {

    try {

        const params = req.query

        const branch_code = req.headers.xbranchcode

        // let query = PaymentTenders.query().withGraphFetched('[sales_transaction.[customer,user],payment_cash,payment_card,payment_charge,payment_cheque,payment_giftcheque]')
        let query = SalesTransactions.query().withGraphFetched('[customer,user,payment_tender.[payment_cash,payment_card,payment_charge,payment_cheque,payment_giftcheque,payment_return]]')


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


router.get('/test', async (req, res, next) => {

    try {

        const params = req.query
        let query = PaymentTenders.query()
            .joinRelated('sales_transaction')
            .select(
                'sales_transaction.*'
            )

        query.where('branch_code', 'SG')

        const query_results = await query


        res.status(200).json({
            status: 'ok',
            data: query_results
        })


    } catch (error) {
        next(error)
    }

})

router.get('/testsales', async (req, res, next) => {

    try {

        const params = req.query



        let query = SalesTransactions.query().withGraphFetched('[customer,user,payment_tender.[payment_cash,payment_card,payment_charge,payment_cheque,payment_giftcheque]]')

        query.where('branch_code', 'SG')

        const query_results = await query


        res.status(200).json({
            status: 'ok',
            data: query_results
        })


    } catch (error) {
        next(error)
    }

})




router.get('/customer/:customer_id', async (req, res, next) => {

    try {

        const customer_id = req.params.customer_id

        let results = await PaymentTenders.query()
            .withGraphFetched('[sales_transaction(whereCustomer).customer]')
            .modifiers({
                whereCustomer(builder) {
                    builder.where('customer_id', customer_id);
                }
            })
            .orderBy('id', 'DESC')

        var data = results.filter((item) => { return item.sales_transaction != null })

        res.status(200).json({
            status: 'ok',
            total_counts: data.length,
            data: data
        })

    } catch (error) {
        next(error)
    }

})

router.get('/filter', async (req, res, next) => {

    try {

        const payload = req.body

        const filter_type = payload.filter_type
        const filter_value = payload.filter_value

        var results = []

        if (filter_type == 'invoice') {

            results = await PaymentTenders.query()
                .withGraphFetched('[sales_transaction.[customer,user],payment_cash,payment_card,payment_charge,payment_cheque,payment_giftcheque]')
                .orderBy('id', 'DESC')
                .where('invoice_no', filter_value)
        }

        if (filter_type == 'customer') {
            results = await PaymentTenders.query()
                .withGraphFetched('[sales_transaction.[customer,user],payment_cash,payment_card,payment_charge,payment_cheque,payment_giftcheque]')
                .orderBy('id', 'DESC')
                .where('customer_id', filter_value)
        }



        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})


router.post('/payment_invoice_submit', async (req, res, next) => {

    try {

        await PaymentTenders.transaction(async trx => {


            const payload = req.body

            const transaction = payload.transaction
            // const transaction_items = payload.sales_transaction_items
            const payments = payload.payments

            const payments_total = payments.reduce((a, b) => +a + (+b['amount'] || 0), 0).toFixed(2)

            //check transaction number on payment tender table

            // it should be on the record
            //use the id for the payment inserts
            const payment = await PaymentTenders.query(trx)
                .where('sales_transaction_id', transaction.id).first()


            // insert payments
            // array

            const paytrans_date = dayjs().format('YYYY-MM-DD HH:mm:ss')


            // // we need to check wether the credit memo is suffieicnt for the total amount to be payed
            // let available_balance = transaction.balance_amount - payments_total
            // let actual_total_payed = 0

            // if(available_balance < 0){
            //     // it means our payment is bigger than the invoice amount
            //     actual_total_payed = payments_total - Math.abs(available_balance)
            // }

            // if(available_balance >= 0){
            //     // it means our payment is bigger than the invoice amount
            //     actual_total_payed = payments_total
            // }


            // interate on payload.payments and insert
            for (var i = 0; i < payments.length; i++) {

                switch (payments[i].type) {

                    case 'CASH':
                        // insert cash
                        await PaymentTendersCash.query(trx)
                            .insert({
                                payment_id: payment.id,
                                amount: payments[i].amount,
                                paytrans_date: paytrans_date,
                                terminal: 'webapp'
                            })
                        break


                    case 'CHEQUE':
                        await PaymentTendersCheque.query(trx)
                            .insert({
                                payment_id: payment.id,
                                amount: payments[i].amount,
                                cheque_name: payments[i].cheque_name,
                                cheque_no: payments[i].cheque_no,
                                cheque_date: dayjs(payments[i].cheque_date).format('YYYY-MM-DD'),
                                type: payments[i].type,
                                bank_id: payments[i].cheque_bank.id,
                                paytrans_date: paytrans_date,
                                terminal: 'webapp'
                            })
                        break


                    // IMPORTANT USE "RETURN"

                    case 'RETURN':
                        await PaymentTendersReturns.query(trx)
                            .insert({
                                payment_id: payment.id,
                                amount: payments[i].amount,
                                paytrans_date: paytrans_date,
                                terminal: 'webapp',
                                ref_no: payments[i].ref_no
                            })

                        let sr = await SalesReturns.query(trx).where('sales_return_code', payments[i].ref_no).first()

                        let newBal = parseFloat(sr.credit_balance) - parseFloat(payments[i].amount)

                        // update the sales return so that the applied_amount and the credit_balance will be updated
                        // this is more easier as this is direct selection of invoice
                        await SalesReturns.query(trx).patch({
                            applied_amount: payments[i].amount,
                            credit_balance: newBal
                        }).where('sales_return_code', payments[i].ref_no)

                        break

                    default:
                        break
                }

            }




            // all payments are succesfully inserted
            // we must update the sales_transaction

            // update the transaction
            // amount paid
            // balance
            // status

            var new_balance = transaction.balance_amount - payments_total
            var total_amount_tendered = parseFloat(transaction.total_amount_tendered) + parseFloat(payments_total)
            var paystatus = transaction.payment_status

            if (new_balance <= 0) {
                paystatus = 'Paid'
            }

            if (new_balance > 0 && new_balance < transaction.total_amount_due) {
                paystatus = 'Partial'
            }

            if (new_balance == transaction.total_amount_due) {
                paystatus = 'Unpaid'
            }


            //update the transaction
            const trans = await SalesTransactions.query(trx)
                .patch({
                    total_amount_tendered: total_amount_tendered,
                    balance_amount: new_balance,
                    payment_status: paystatus

                })
                .where('invoice_no', transaction.invoice_no)


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




router.post('/payment_customer_submit', async (req, res, next) => {

    try {

        await PaymentTenders.transaction(async trx => {


            const payload = req.body

            const branch_code = req.headers.xbranchcode

            const customer_payment_type = payload.customer_payment_type
            const customer = payload.customer
            const invoice_choices = payload.invoice_choices
            const payments = payload.payments


            var invoices = []

            // IMPORTANT
            // paymet type will be limited to single method only for customer invoice payment


            //check the type
            // by invoice_priority
            // by invoice_choices

            const payments_total = payments.reduce((a, b) => +a + (+b['amount'] || 0), 0).toFixed(2)


            if (customer_payment_type == 'invoice_priority') {
                // get the customer invoices ordered by id "asc"

                // 20210220 - added branch filter

                const customer_invoices = await SalesTransactions.query(trx).where('customer_id', customer.customer_id)
                    .where('payment_status', '!=', 'Paid')
                    .where('branch_code', branch_code)
                    .orderBy('id', 'ASC')
                invoices = customer_invoices
            }

            if (customer_payment_type == 'invoice_choices') {
                invoices = invoice_choices
            }


            var payment_remaining = payments_total
            var invoices_payments = []
            var actual_payment_amount = 0

            // supports single payment method only
            const single_payment = payments[0]

            for (var i = 0; i < invoices.length; i++) {

                var diff_res = parseFloat(payment_remaining) - parseFloat(invoices[i].balance_amount)

                //if less than zero thats a balance
                //if greater than zero then its a total remaining

                if (diff_res > 0) {
                    actual_payment_amount = invoices[i].balance_amount
                    payment_remaining = diff_res
                } else {
                    actual_payment_amount = payment_remaining
                    payment_remaining = 0
                }


                var new_total_tendered = parseFloat(invoices[i].total_amount_tendered) + parseFloat(actual_payment_amount)
                var new_balance = invoices[i].total_amount_due - new_total_tendered
                if (new_balance > 0) {
                    new_balance = Math.abs(new_balance)
                } else {
                    new_balance = 0
                }


                var paystatus = invoices[i].payment_status

                if (new_balance <= 0) {
                    paystatus = 'Paid'
                }

                if (new_balance > 0 && new_balance < invoices[i].total_amount_due) {
                    paystatus = 'Partial'
                }

                if (new_balance == invoices[i].total_amount_due) {
                    paystatus = 'Unpaid'
                }

                invoices_payments.push(
                    {
                        trans_id: invoices[i].id,
                        invoice_no: invoices[i].invoice_no,
                        payment_details: single_payment,
                        actual_payment_amount: parseFloat(actual_payment_amount),
                        total_amount_tendered: new_total_tendered,
                        balance_amount: new_balance,
                        payment_status: paystatus,
                        total_payment_remaning: payment_remaining
                    }
                )
            }


            let salesReturnPaymentList = []


            for (var i = 0; i < invoices_payments.length; i++) {

                //check transaction number on payment tender table

                // it should be on the record because it was already "charge" when on "cashier app"
                //use the id for the payment inserts
                const payment = await PaymentTenders.query(trx)
                    .where('sales_transaction_id', invoices_payments[i].trans_id).first()


                // insert payments
                // array
                const paytrans_date = dayjs().format('YYYY-MM-DD HH:mm:ss')
                // interate on payload.payments and insert


                switch (invoices_payments[i].payment_details.type) {

                    case 'CASH':
                        // insert cash
                        await PaymentTendersCash.query(trx)
                            .insert({
                                payment_id: payment.id,
                                amount: invoices_payments[i].actual_payment_amount,
                                paytrans_date: paytrans_date,
                                terminal: 'webapp'
                            })
                        break

                    case 'CHEQUE':
                        await PaymentTendersCheque.query(trx)
                            .insert({
                                payment_id: payment.id,
                                amount: invoices_payments[i].actual_payment_amount,
                                cheque_name: invoices_payments[i].payment_details.cheque_name,
                                cheque_no: invoices_payments[i].payment_details.cheque_no,
                                cheque_date: dayjs(invoices_payments[i].payment_details.cheque_date).format('MM/DD/YYYY'),
                                type: invoices_payments[i].payment_details.type,
                                bank_id: invoices_payments[i].payment_details.cheque_bank.id,
                                paytrans_date: paytrans_date,
                                terminal: 'webapp'
                            })
                        break

                    case 'RETURN':
                        await PaymentTendersReturns.query(trx)
                            .insert({
                                payment_id: payment.id,
                                amount: invoices_payments[i].actual_payment_amount,
                                paytrans_date: paytrans_date,
                                terminal: 'webapp',
                                ref_no: invoices_payments[i].payment_details.ref_no
                            })

                        // put the retunr payment into a specific array, we will use it 1 time to update the "applied_amount" and "credit_balance"
                        salesReturnPaymentList.push({
                            amount: invoices_payments[i].actual_payment_amount
                        })

                        break

                    default:
                        break
                }


                //update the sales transaction
                const trans = await SalesTransactions.query(trx)
                    .patch({
                        total_amount_tendered: invoices_payments[i].total_amount_tendered,
                        balance_amount: invoices_payments[i].balance_amount,
                        payment_status: invoices_payments[i].payment_status

                    })
                    .where('invoice_no', invoices_payments[i].invoice_no)
            }


            // chheck if we payed using the sales returns
            if (salesReturnPaymentList.length > 0) {

                let totalAppliedAmount = Helpers.calculateTotals(salesReturnPaymentList, 'amount')

                let sr = await SalesReturns.query(trx).where('sales_return_code', single_payment.ref_no).first()

                let newBal = parseFloat(sr.credit_balance) - parseFloat(totalAppliedAmount)

                // update the sales return so that the applied_amount and the credit_balance will be updated
                // this is more easier as this is direct selection of invoice
                await SalesReturns.query(trx).patch({
                    applied_amount: totalAppliedAmount,
                    credit_balance: newBal
                }).where('sales_return_code', single_payment.ref_no)

            }


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