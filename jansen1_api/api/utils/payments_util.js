const SettingsReferences = require('../models/settings_references')

const dayjs = require('dayjs');
const StockIns = require('../models/stocks/stock_ins');
const StockOuts = require('../models/stocks/stock_outs');
const Stocks = require('../models/stocks/stocks');
const Products = require('../models/products/products');



const PaymentTenders = require('../models/payment/payment_tenders')
const PaymentTendersCash = require('../models/payment/payment_tenders_cash')
const PaymentTendersCard = require('../models/payment/payment_tenders_card')
const PaymentTendersCharge = require('../models/payment/payment_tenders_charge')
const PaymentTendersCheque = require('../models/payment/payment_tenders_cheque')


async function ProcessSalesTransactionPayments(trx, data) {

    // data = object
    // trx

    let trans = data.trans
    let payments = data.payments


    try {

        const payment = await PaymentTenders.query(trx)
            .insert({
                sales_transaction_id: trans.id,
                branch_code: trans.branch_code
            })


        const paytrans_date = dayjs().format('YYYY-MM-DD HH:mm:ss')

        // interate on payload.payments and insert
        for (var i = 0; i < payments.length; i++) {

            switch (payments[i].payment_type) {

                case 'CASH':
                    // insert cash
                    await PaymentTendersCash.query(trx)
                        .insert({
                            payment_id: payment.id,
                            amount: payments[i].details.amount,
                            paytrans_date: paytrans_date
                        })
                    break

                case 'CREDITCARD':
                    await PaymentTendersCard.query(trx)
                        .insert({
                            payment_id: payment.id,
                            amount: payments[i].details.amount,
                            card_no: payments[i].details.card_no,
                            expiration_date: dayjs(payments[i].details.expiration_date).format('YYYY-MM-DD'),
                            account_name: payments[i].details.account_name,
                            confirmation_code: payments[i].details.confirmation_code,
                            bank_id: null,
                            paytrans_date: paytrans_date

                        })
                    break

                case 'CHEQUE':
                    await PaymentTendersCheque.query(trx)
                        .insert({
                            payment_id: payment.id,
                            amount: payments[i].details.amount,
                            cheque_name: payments[i].details.cheque_name,
                            cheque_no: payments[i].details.cheque_no,
                            cheque_date: dayjs(payments[i].details.cheque_date).format('YYYY-MM-DD'),
                            type: payments[i].details.type,
                            bank_id: null,
                            paytrans_date: paytrans_date
                        })
                    break

                case 'CHARGE':
                    await PaymentTendersCharge.query(trx)
                        .insert({
                            payment_id: payment.id,
                            amount: payments[i].details.amount,
                            charge_date: dayjs(payments[i].details.charge_date).format('YYYY-MM-DD'),
                            customer_id: payments[i].details.customer_id,
                            paytrans_date: paytrans_date
                        })
                    break



                default:
                    break
            }

        }

        return Promise.resolve()

    } catch (error) {
        return Promise.reject(error)
    }

}




module.exports = {
    ProcessSalesTransactionPayments
}