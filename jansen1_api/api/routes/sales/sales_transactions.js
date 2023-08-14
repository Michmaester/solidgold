const express = require('express');
const { ref, raw } = require('objection');
const router = express.Router();
const Decimal = require('decimal.js')
const dayjs = require('dayjs')

const ChangePriceHistory = require('../../models/sales/change_price_history')

const SalesTransactions = require('../../models/sales/sales_transactions')
const SalesTransactionItems = require('../../models/sales/sales_transaction_items')
const authenticateJWT = require('../../middlewares/authenticateJWT')

const PaymentCash = require('../../models/payment/payment_tenders_cash')
const PaymentCard = require('../../models/payment/payment_tenders_card')
const PaymentCheque = require('../../models/payment/payment_tenders_cheque')
const PaymentCharge = require('../../models/payment/payment_tenders_charge')

const Helpers = require('../../utils/helpers');
const ProductPrices = require('../../models/products/product_prices');
const ProductPricesHistory = require('../../models/products/product_prices_history');
const Users = require('../../models/users');

router.get('/', async (req, res, next) => {

    try {

        const params = req.query

        const branch_code = req.headers.xbranchcode

        let query = SalesTransactions.query().withGraphFetched('[trans_items.[product.[brand]],customer,user,delivery]')
        query = Helpers.queryFilters(params, query)
        query.where('branch_code', branch_code)

        const query_results = await query

        //console.log(query_results)


        res.status(200).json({
            status: 'ok',
            data: query_results
        })

    } catch (error) {
        next(error)
    }

})

router.get('/transactions/:invoice_no', async (req, res, next) => {

    try {

        const invoice_no = req.params.invoice_no

        const results = await SalesTransactions.query()
            .withGraphFetched('[delivery,trans_items.[product.[brand,unit]],customer,user,salesfront]')
            .where('invoice_no', invoice_no)
            .first()

        let paymethods = await SalesTransactions.query()
            .withGraphFetched('[payment_tender.[payment_cash,payment_card,payment_charge,payment_cheque,payment_giftcheque]]')
            .where('invoice_no', invoice_no)
            .first()


        //manipulate the paymethods and return the corresponding invoice_print_type
        let invoice_print_type = null

        if (paymethods.payment_tender.payment_charge.length > 0) {
            invoice_print_type = 'trust_receipt'
        } else {
            invoice_print_type = 'invoice_receipt'
        }

        results['invoice_print_type'] = invoice_print_type


        res.status(200).json({
            status: 'ok',
            data: results
        })

    } catch (error) {
        next(error)
    }

})



router.get('/cashier_trans',authenticateJWT, async (req, res, next) => {

    try {

        const datefrom = req.query.datefrom
        const dateto = req.query.dateto
        const branch_code = req.query.branch_code

        //var results = []

        // if (datefrom === dateto) {

        //     results = await SalesTransactions.query()
        //         .withGraphFetched('[customer,salesfront,payment_tender.[payment_cash,payment_card,payment_cheque,payment_charge]]')
        //         .where(raw('DATE(transaction_date)'), datefrom)
        //         .andWhere('branch_code', branch_code)
        // } else {

        //     results = await SalesTransactions.query()
        //         .withGraphFetched('[customer,salesfront,payment_tender.[payment_cash,payment_card,payment_cheque,payment_charge]]')
        //         .whereBetween(raw('DATE(transaction_date)'), [datefrom, dateto])
        //         .andWhere('branch_code', branch_code)
        // }

        /// revise to support 2 dates
        let results = await SalesTransactions.query()
            .withGraphFetched('[customer,salesfront,payment_tender.[payment_cash,payment_card,payment_cheque,payment_charge]]')
            .whereBetween(raw('DATE(transaction_date)'), [datefrom, dateto])
            .where('branch_code', branch_code)

        //need to calculate payaments methods..... ?????????
        /* 
        
        1. list of sales transaction ids
        2. query it and totalall the payment methods
        
        */

        // ---------> NEEDED check wether we filter this by terminal=null (cashier payments only)

        const pay_cash = results.map((item) => {
            return item.payment_tender.payment_cash
        })

        const pay_card = results.map((item) => {
            return item.payment_tender.payment_card
        })
        const pay_cheque = results.map((item) => {
            return item.payment_tender.payment_cheque
        })
        const pay_charge = results.map((item) => {
            return item.payment_tender.payment_charge
        })


        var mergedCash = [].concat.apply([], pay_cash);
        const cashTotals = parseFloat(Helpers.calculateTotals(mergedCash.filter(item => { return item.terminal === null }), 'amount'))

        var mergedCard = [].concat.apply([], pay_card);
        const cardTotals = parseFloat(Helpers.calculateTotals(mergedCard.filter(item => { return item.terminal === null }), 'amount'))

        var mergedCheque = [].concat.apply([], pay_cheque);
        const chequeTotals = parseFloat(Helpers.calculateTotals(mergedCheque.filter(item => { return item.terminal === null }), 'amount'))

        var mergedCharge = [].concat.apply([], pay_charge);
        const chargeTotals = parseFloat(Helpers.calculateTotals(mergedCharge.filter(item => { return item.terminal === null }), 'amount'))

        salesTotals = cashTotals + cardTotals + chequeTotals + chargeTotals

        let payments_totals = {
            cash: cashTotals,
            card: cardTotals,
            cheque: chequeTotals,
            charges: chargeTotals,
            salesTotals: salesTotals
        }

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results,
            payments_totals: payments_totals
        })

    } catch (error) {
        next(error)
    }

})



router.get('/invoices', async (req, res, next) => {

    try {

        //this wil be queried with dates
        const branch_code = req.headers.xbranchcode

        const results = await SalesTransactions.query()
            .distinct('invoice_no')
            .where('branch_code', branch_code)

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})




router.get('/searchby_invoiceno', async (req, res, next) => {

    try {

        const params = req.query

        const branch_code = req.headers.xbranchcode

        let query = SalesTransactions.query().withGraphFetched('[customer]').where('branch_code', branch_code)

        query.where('invoice_no', 'like', '%' + params.searchterm + '%')
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

router.post('/generate_change_prices', async (req, res, next) => {
    
    await ChangePriceHistory.transaction(async trx => {
        let salesTransactions = await SalesTransactions.query()
        // salesTransactions = salesTransactions.filter((item) => {
        //     return item.id = '621';
        //   });
        for (let index = 0; index < salesTransactions.length; index++) {
            const salesTransaction = salesTransactions[index];
            var user = await Users.query().where('user_id',salesTransaction.user_id).first()
            let trxItems = await SalesTransactionItems.query().where('sales_transaction_id',salesTransaction.id)
            console.log(`INVOICE:${salesTransaction.id}`)
            for (let index = 0; index < trxItems.length; index++) {
                const trxItem = trxItems[index];
                
                var actualPrice = 0
                console.log(`PRODUCT:${trxItem.product_id}`)
                let product_price = await ProductPrices.query().where('product_id',trxItem.product_id).first()
                let product_price_history = await ProductPricesHistory.query()
                .where('product_id',trxItem.product_id)
                if(product_price_history.length != 0)
                {
                    var filteredPriceHistory = product_price_history.filter((item) => {
                        return item.created_at < salesTransaction.transaction_date;
                      });
                      //console.log(`INVOICE_DATE:${salesTransaction.transaction_date}`)

                      var lastResult = filteredPriceHistory.pop();
                     
                      if(lastResult)
                      {
                        //console.log(`PRICE_DATE:${lastResult.created_at}`)
                        product_price = lastResult
                      }
                      //check transaction date against price_history
                }
                //check what to get if retail or wholesale
                if(salesTransaction.transaction_type == 'retail' && product_price.retail) 
                {
                    actualPrice = product_price.retail
                    //console.log('IS_RETAIL')
                }
                else if(salesTransaction.transaction_type == 'wholesale' && product_price.wholesale)
                {
                    actualPrice = product_price.wholesale
                    //console.log('IS_WHOLESALE')
                }
                else
                {
                    //console.log(`PRODUCT_PRICE ${product_price}`)
                    actualPrice = trxItem.price_per_unit
                }
              
                var difference = Decimal.sub(actualPrice,trxItem.price_per_unit).toNumber()
                //console.log(`DIFFERENCE:${difference} = ${actualPrice } - ${trxItem.price_per_unit}`)
                if(difference == 0)
                {
                    continue;
                }
                await ChangePriceHistory.query(trx).insert(
                    {
                        actual_price:actualPrice,
                        changed_price:trxItem.price_per_unit,
                        difference:difference,
                        ref_invoice:salesTransaction.invoice_no,
                        ref_item_no:trxItem.product_id,
                        updated_by:user.user_id,
                        updated_at:dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        username:user.username
                    }
                )
            }  
        }
        res.status(200).json({
            status: 'ok',
            data: null
        })
    });
    
})

// Add transaction here
// This endpoint is use by the cashier

// router.post('/', async (req, res, next) => {

//     try {

//         await SalesTransactions.transaction(async trx => {

//             const payload = req.body

//             // //generate product_id
//             // const newSaleOrderNo = await Generator.GenerateReference(trx,'sales_order')

//             // payload.status = 'submitted'
//             // payload.order_no = newSaleOrderNo + Generator.RandomNumberGenerator()

//             const trans = await SalesTransactions.query(trx)
//                 .insert({
//                     transaction_type: payload.trans_type
//                 })

//             const trans_items = await SalesTransactionItems.query(trx)
//                 .insertGraph([
//                     { sales_transaction_id: trans.id, qty: 200 },
//                     { sales_transaction_id: trans.id, qty: 100 }
//                 ])

//             const result = {
//                 trans: trans,
//                 items: trans_items
//             }

//             // await Generator.UpdateRunningValue(trx,'sales_order',newSaleOrderNo)

//             res.status(200).json({
//                 status: 'ok',
//                 title: 'Successful',
//                 message: 'Successfully created a new sales transaction.',
//                 total_counts: result.length,
//                 data: result
//             })

//         });

//     } catch (error) {
//         next(error)
//     }

// })

module.exports = router;