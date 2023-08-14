const DataHelpers = require('./data_helpers')
const ReportQueryUtil = require('./report_query_util')

const SalesTransactions = require('../models/sales/sales_transactions')
const SalesTransactionItems = require('../models/sales/sales_transaction_items')

const PaymentTender = require('../models/payment/payment_tenders')
const PaymentCash = require('../models/payment/payment_tenders_cash')
const PaymentCard = require('../models/payment/payment_tenders_card')
const PaymentCharge = require('../models/payment/payment_tenders_charge')
const PaymentCheque = require('../models/payment/payment_tenders_cheque')
const PaymentGiftCheque = require('../models/payment/payment_tenders_giftcheque')



const SalesReturns = require('../models/sales/sales_returns')

const Products = require('../models/products/products')

const PurchaseOrders = require('../models/purchase/purchase_orders')
const PurchaseOrderItems = require('../models/purchase/purchase_order_items')

const Stocks = require('../models/stocks/stocks')
const StockTransfer = require('../models/stocks/stock_transfers')
const StockOuts = require('../models/stocks/stock_outs')
const StockIns = require('../models/stocks/stock_ins')


const Categories = require('../models/masterdata/categories')
const UserLogs = require('../models/user_logs')


const _ = require('lodash')
const dayjs = require('dayjs')
const { request } = require('express')

const { raw, ref, fn } = require('objection')
const e = require('express')
const { helpers } = require('faker')
const { product } = require('puppeteer')


const reportfn = {


    /* Sales Reports */

    SalesByCustomerSummary: async (params, filters) => {

        // query sales transactions
        const query = SalesTransactions.query().withGraphFetched('[customer,payment_tender]').where('branch_code', params.current_branch_code)

        // Filters
        if (filters.hasOwnProperty('date')) {
            query.whereBetween(fn('DATE', ref('transaction_date')), filters.date)
        }

        if (filters.hasOwnProperty('customer')) {
            query.where('customer_id', filters.customer)
        }

        const result = await query

        //get the unqiue customers
        const customers = _.uniqBy(result, x => x.customer_id).map(item => {
            return {
                customer_id: item.customer_id,
                name: item.customer.name,
                transactions: [],
                totals_amount: null,
                totals_tendered: null,
                totals_balance: null
            }
        })

        let datas = []

        for (var i = 0; i < customers.length; i++) {

            let res = result.filter(item => {
                return item.customer_id === customers[i].customer_id
            }).map(x => {

                let total_amount_due = x.total_amount_due
                let total_amount_tendered = x.total_amount_tendered
                let total_balance_amount = x.balance_amount

                return {
                    invoice_no: x.invoice_no,
                    transaction_date: x.transaction_date,
                    total_amount_due: (total_amount_due > 0) ? total_amount_due : null,
                    total_amount_tendered: (total_amount_tendered > 0) ? total_amount_tendered : null,
                    total_balance_amount: (total_balance_amount > 0) ? total_balance_amount : null,
                    type: x.transaction_type,
                    payment_id: x.payment_tender.id
                }
            })



            //need to get payment issued using webapp, deduct it on the total_amount tendered

            for (let index = 0; index < res.length; index++) {

                let webapp_payments = []

                let w_pcash = await PaymentCash.query().where('payment_id', res[index].payment_id).where('terminal', 'webapp')
                let w_pcheque = await PaymentCheque.query().where('payment_id', res[index].payment_id).where('terminal', 'webapp')

                webapp_payments.push(...w_pcash, ...w_pcheque)

                let w_paid = ReportQueryUtil.calculateTotals(webapp_payments, 'amount')

                if (w_paid > 0) {
                    res[index].total_amount_tendered = parseFloat(res[index].total_amount_tendered) - parseFloat(w_paid)

                    // update the balance also
                    res[index].total_balance_amount = parseFloat(res[index].total_amount_due) - parseFloat(res[index].total_amount_tendered)
                }



            }

            customers[i].transactions = res

            let totals_amount = ReportQueryUtil.calculateTotals(res, 'total_amount_due')
            let totals_tendered = ReportQueryUtil.calculateTotals(res, 'total_amount_tendered')
            let totals_balance = ReportQueryUtil.calculateTotals(res, 'total_balance_amount')

            customers[i].totals_amount = (totals_amount > 0) ? ReportQueryUtil.formatAmountCurrency(totals_amount) : null
            customers[i].totals_tendered = (totals_tendered > 0) ? ReportQueryUtil.formatAmountCurrency(totals_tendered) : null
            customers[i].totals_balance = (totals_balance > 0) ? ReportQueryUtil.formatAmountCurrency(totals_balance) : null

            datas.push(customers[i])
        }


        //result are the invoices
        // iterate on the invoices
        // get the payment_tenders
        // query the tables for the payment tenders
        // merge it
        // filter it


        let payments_list = []

        for (let index = 0; index < result.length; index++) {

            let pcash = await PaymentCash.query().where('payment_id', result[index].payment_tender.id).where('terminal', null)
            let payment_cash = pcash.map(item => {
                return {
                    id: item.id,
                    payment_id: item.payment_id,
                    amount: item.amount,
                    paytrans_date: item.paytrans_date,
                    terminal: item.terminal,
                    method: 'CASH'
                }
            })

            let pcard = await PaymentCard.query().where('payment_id', result[index].payment_tender.id).where('terminal', null)
            let payment_card = pcard.map(item => {
                return {
                    id: item.id,
                    payment_id: item.payment_id,
                    amount: item.amount,
                    paytrans_date: item.paytrans_date,
                    terminal: item.terminal,
                    method: 'CARD'
                }
            })

            let pcheque = await PaymentCheque.query().where('payment_id', result[index].payment_tender.id).where('terminal', null)
            let payment_cheque = pcheque.map(item => {
                return {
                    id: item.id,
                    payment_id: item.payment_id,
                    amount: item.amount,
                    paytrans_date: item.paytrans_date,
                    terminal: item.terminal,
                    method: 'CHEQUE'
                }
            })

            let pgiftcheque = await PaymentGiftCheque.query().where('payment_id', result[index].payment_tender.id).where('terminal', null)
            let payment_giftcheque = pgiftcheque.map(item => {
                return {
                    id: item.id,
                    payment_id: item.payment_id,
                    amount: item.amount,
                    paytrans_date: item.paytrans_date,
                    terminal: item.terminal,
                    method: 'GIFTCHEQUE'
                }
            })

            let pcharge = await PaymentCharge.query().where('payment_id', result[index].payment_tender.id).where('terminal', null)
            let payment_charge = pcharge.map(item => {
                return {
                    id: item.id,
                    payment_id: item.payment_id,
                    amount: item.amount,
                    paytrans_date: item.paytrans_date,
                    terminal: item.terminal,
                    method: 'CHARGE'
                }
            })

            payments_list.push(...payment_cash, ...payment_card, ...payment_charge, ...payment_cheque, ...payment_giftcheque)

        }


        //total the payment list

        let total_cash_paid = ReportQueryUtil.calculateTotals(payments_list.filter(item => { return item.method === 'CASH' }), 'amount')
        let total_card_paid = ReportQueryUtil.calculateTotals(payments_list.filter(item => { return item.method === 'CARD' }), 'amount')
        let total_cheque_paid = ReportQueryUtil.calculateTotals(payments_list.filter(item => { return item.method === 'CHEQUE' }), 'amount')
        let total_giftcheque_paid = ReportQueryUtil.calculateTotals(payments_list.filter(item => { return item.method === 'GIFTCHEQUE' }), 'amount')
        let total_charge = ReportQueryUtil.calculateTotals(payments_list.filter(item => { return item.method === 'CHARGE' }), 'amount')

        let total_paid = parseFloat(total_cash_paid) + parseFloat(total_card_paid) + parseFloat(total_cheque_paid) + parseFloat(total_giftcheque_paid)
        let total_sales = parseFloat(total_paid) + parseFloat(total_charge)

        // Added to format amount with decimal and commas 20210425
        // iterate on the data and directly format it
        for (let j = 0; j < datas.length; j++) {
            for (let k = 0; k < datas[j].transactions.length; k++) {
                let tdata = datas[j].transactions[k]

                tdata.total_amount_due = (tdata.total_amount_due > 0) ? ReportQueryUtil.formatAmount(tdata.total_amount_due) : null
                tdata.total_amount_tendered = (tdata.total_amount_tendered > 0) ? ReportQueryUtil.formatAmount(tdata.total_amount_tendered) : null
                tdata.total_balance_amount = (tdata.total_balance_amount > 0) ? ReportQueryUtil.formatAmount(tdata.total_balance_amount) : null
            }
        }


        let dataObj = {
            datas: datas,
            totals: {
                total_cash_paid: ReportQueryUtil.formatAmountCurrency(total_cash_paid),
                total_card_paid: ReportQueryUtil.formatAmountCurrency(total_card_paid),
                total_cheque_paid: ReportQueryUtil.formatAmountCurrency(total_cheque_paid),
                total_giftcheque_paid: ReportQueryUtil.formatAmountCurrency(total_giftcheque_paid),
                total_charge: ReportQueryUtil.formatAmountCurrency(total_charge),
                total_paid: ReportQueryUtil.formatAmountCurrency(total_paid),
                total_sales: ReportQueryUtil.formatAmountCurrency(total_sales),
            }
        }


        return dataObj

    },

    SalesByItemGroupSummary: async (params, filters) => {

        // get sales transactions
        // iterate on the items
        // get the category of each items
        // get the uniq categories
        // iterate on the unqiye categories
        // total and display it on the template



        //get the invoices
        const invoices = await SalesTransactions.query().where('branch_code', params.current_branch_code)

        let arrAllItems = []

        for (let index = 0; index < invoices.length; index++) {

            let items = await SalesTransactionItems.query().withGraphFetched('[product.[category,brand,unit]]').where('sales_transaction_id', invoices[index].id)
            arrAllItems.push(...items)
        }

        let flatAllItems = arrAllItems.map(item => {
            return {
                category_id: item.product.category_ref_id,
                category_name: item.product.category.name,
                product_id: item.product.product_id,
                product_name: item.product.name,
                product_code: item.product.product_code,
                product_desc: item.product.description,
                brand: item.product.brand.brandname,
                unit: item.product.unit.item_unit,
                qty: item.qty
            }
        })

        let mergeFlatAllItems = []

        //get also the uniq product_ids
        const uniqProdIds = _.uniqBy(flatAllItems, x => x.product_id).map(item => {
            return item.product_id
        })

        uniqProdIds.forEach(el => {

            let items = flatAllItems.filter(item => {
                return item.product_id === el
            })

            //totals here
            let sold_qty = parseInt(ReportQueryUtil.calculateTotals(items, 'qty'))

            let mergeObj = {
                category_id: items[0].category_id,
                category_name: items[0].category_name,
                product_id: items[0].product_id,
                product_name: items[0].product_name,
                product_code: items[0].product_code,
                product_desc: items[0].product_desc,
                brand: items[0].brand,
                unit: items[0].unit,
                sold_qty: sold_qty
            }

            mergeFlatAllItems.push(mergeObj)
        });

        //get the unqiue category
        let uniqCategories = _.uniqBy(mergeFlatAllItems, x => x.category_id).map(item => {
            return {
                category_id: item.category_id,
                category_name: item.category_name,
                items: []
            }
        })

        // Filter
        if (filters.hasOwnProperty('category')) {
            uniqCategories = uniqCategories.filter(item => { return item.category_id === filters.category })
        }

        let datas = []

        for (var i = 0; i < uniqCategories.length; i++) {

            let res = mergeFlatAllItems.filter(item => {
                return item.category_id === uniqCategories[i].category_id
            }).map(x => {
                return {
                    product_id: x.product_id,
                    product_name: x.product_name,
                    product_code: x.product_code,
                    product_desc: x.product_desc,
                    brand: x.brand,
                    unit: x.unit,
                    sold_qty: x.sold_qty
                }
            })

            uniqCategories[i].items = res

            datas.push(uniqCategories[i])
        }

        return datas
    },


    //Sales by customer detailed
    SalesByItemGroupSummaryDetailed: async (params, filters) => {

        // query sales transactions
        const query = SalesTransactions.query().withGraphFetched('[customer,trans_items.[product.[brand,unit]]]').where('branch_code', params.current_branch_code)

        // Filters
        if (filters.hasOwnProperty('date')) {
            query.whereBetween(fn('DATE', ref('transaction_date')), filters.date)
        }

        if (filters.hasOwnProperty('customer')) {
            query.where('customer_id', filters.customer)
        }

        const result = await query

        //get the unqiue customers
        const customers = _.uniqBy(result, x => x.customer_id).map(item => {
            return {
                customer_id: item.customer_id,
                name: item.customer.name,
                transactions: [],
                totals_amount: null,
                totals_tendered: null,
                totals_balance: null
            }
        })

        let datas = []

        for (var i = 0; i < customers.length; i++) {

            let res = result.filter(item => {
                return item.customer_id === customers[i].customer_id
            }).map(x => {
                return {
                    invoice_no: x.invoice_no,
                    transaction_date: x.transaction_date,
                    total_amount_due: ReportQueryUtil.formatAmount(x.total_amount_due),
                    total_amount_tendered: ReportQueryUtil.formatAmount(x.total_amount_tendered),
                    balance_amount: ReportQueryUtil.formatAmount(x.balance_amount),
                    type: x.transaction_type,
                    trans_items: x.trans_items,
                    total_price_totals: ReportQueryUtil.formatAmountCurrency(ReportQueryUtil.calculateTotals(x.trans_items, 'total_amount'))
                }
            })

            customers[i].transactions = res

            datas.push(customers[i])
        }

        // Added to format amount with decimal and commas 20210425
        // iterate on the data and directly format it
        for (let j = 0; j < datas.length; j++) {
            for (let k = 0; k < datas[j].transactions.length; k++) {
                let tdata = datas[j].transactions[k]

                for (let l = 0; l < tdata.trans_items.length; l++) {

                    let itemdata = tdata.trans_items[l]
                    itemdata.price_per_unit = (itemdata.price_per_unit > 0) ? ReportQueryUtil.formatAmount(itemdata.price_per_unit) : null
                    itemdata.qty = (itemdata.qty > 0) ? ReportQueryUtil.formatAmount(itemdata.qty, 0) : null
                    itemdata.total_amount = (itemdata.total_amount > 0) ? ReportQueryUtil.formatAmount(itemdata.total_amount) : null

                }
            }
        }

        return datas

    },



    SalesWithDiscount: async (params, filters) => {

        // query sales transactions
        const query = SalesTransactions.query().withGraphFetched('[customer,trans_items.[product.[brand,unit]]]').where('total_discounted_amount', '>', 0).where('branch_code', params.current_branch_code)

        // Filters
        if (filters.hasOwnProperty('date')) {
            query.whereBetween(fn('DATE', ref('transaction_date')), filters.date)
        }

        if (filters.hasOwnProperty('customer')) {
            query.where('customer_id', filters.customer)
        }

        const result = await query

        //get the unqiue customers
        const customers = _.uniqBy(result, x => x.customer_id).map(item => {
            return {
                customer_id: item.customer_id,
                name: item.customer.name,
                transactions: [],

            }
        })

        let datas = []

        for (var i = 0; i < customers.length; i++) {

            let res = result.filter(item => {
                return item.customer_id === customers[i].customer_id
            }).map(x => {
                return {
                    invoice_no: x.invoice_no,
                    transaction_date: x.transaction_date,
                    totals_discount: x.total_discounted_amount,
                    trans_items: x.trans_items,

                }
            })

            customers[i].transactions = res

            datas.push(customers[i])
        }

        return datas
    },



    SalesAccountReceivables: async (params, filters) => {

        // get sales transactions that are not fully paid
        // get the customers and get the uniq customers
        // filter the result by the uniq customer
        // calculate the ages of the receivables
        // display and total


        // query sales transactions
        const query = SalesTransactions.query().withGraphFetched('[customer]').where('payment_status', '!=', 'Paid').where('branch_code', params.current_branch_code)

        // Filters

        if (filters.hasOwnProperty('customer')) {
            query.where('customer_id', filters.customer)
        }

        const result = await query

        //get the unqiue customers
        const customers = _.uniqBy(result, x => x.customer_id).map(item => {
            return {
                customer_id: item.customer_id,
                name: item.customer.name,
                transactions: [],
                totals_days_0_30: null,
                totals_days_31_60: null,
                totals_days_61_90: null,
                totals_days_91_120: null,
                totals_days_120_over: null,
                total_of_totals: null
            }
        })

        let datas = []

        for (var i = 0; i < customers.length; i++) {

            let res = result.filter(item => {
                return item.customer_id === customers[i].customer_id
            }).map(x => {
                return {
                    invoice_no: x.invoice_no,
                    transaction_date: x.transaction_date,
                    balance_amount: x.balance_amount,
                    days_0_30: null,
                    days_31_60: null,
                    days_61_90: null,
                    days_91_120: null,
                    days_120_over: null,
                }
            })

            for (let index = 0; index < res.length; index++) {

                //calculate date and get days

                let datenow = dayjs()
                let age = datenow.diff(res[index].transaction_date, 'day')

                if (age >= 0 && age <= 30) {
                    res[index].days_0_30 = res[index].balance_amount
                }

                if (age >= 31 && age <= 60) {
                    res[index].days_31_60 = res[index].balance_amount
                }

                if (age >= 61 && age <= 90) {
                    res[index].days_61_90 = res[index].balance_amount
                }

                if (age >= 91 && age <= 120) {
                    res[index].days_91_120 = res[index].balance_amount
                }

                if (age > 120) {
                    res[index].days_120_over = res[index].balance_amount
                }

            }

            customers[i].transactions = res

            let calc_total0_30 = ReportQueryUtil.calculateTotals(res, 'days_0_30')
            let calc_total31_60 = ReportQueryUtil.calculateTotals(res, 'days_31_60')
            let calc_total61_90 = ReportQueryUtil.calculateTotals(res, 'days_61_90')
            let calc_total91_120 = ReportQueryUtil.calculateTotals(res, 'days_91_120')
            let calc_total120_over = ReportQueryUtil.calculateTotals(res, 'days_120_over')

            // added 20210605 to support total of totals for customer
            let calcArrs = [
                calc_total0_30,
                calc_total31_60,
                calc_total61_90,
                calc_total91_120,
                calc_total120_over
            ]

            let total_of_totals = ReportQueryUtil.sumArrays(calcArrs)

            //let total_of_totals = parseFloat(calc_total0_30) + parseFloat(calc_total31_60) + parseFloat(calc_total61_90) + parseFloat(calc_total91_120) + parseFloat(calc_total120_over)


            customers[i].totals_days_0_30 = (calc_total0_30 > 0) ? ReportQueryUtil.formatAmountCurrency(calc_total0_30) : null
            customers[i].totals_days_31_60 = (calc_total31_60 > 0) ? ReportQueryUtil.formatAmountCurrency(calc_total31_60) : null
            customers[i].totals_days_61_90 = (calc_total61_90 > 0) ? ReportQueryUtil.formatAmountCurrency(calc_total61_90) : null
            customers[i].totals_days_91_120 = (calc_total91_120 > 0) ? ReportQueryUtil.formatAmountCurrency(calc_total91_120) : null
            customers[i].totals_days_120_over = (calc_total120_over > 0) ? ReportQueryUtil.formatAmountCurrency(calc_total120_over) : null

            // added 20210605 to support total of totals for customer
            customers[i].total_of_totals = (total_of_totals > 0) ? ReportQueryUtil.formatAmountCurrency(total_of_totals) : null

            datas.push(customers[i])
        }

        // Added to format amount with decimal and commas 20210425
        // iterate on the data and directly format it
        for (let j = 0; j < datas.length; j++) {
            for (let k = 0; k < datas[j].transactions.length; k++) {
                let tdata = datas[j].transactions[k]

                tdata.days_0_30 = (tdata.days_0_30 > 0) ? ReportQueryUtil.formatAmount(tdata.days_0_30) : null
                tdata.days_31_60 = (tdata.days_31_60 > 0) ? ReportQueryUtil.formatAmount(tdata.days_31_60) : null
                tdata.days_61_90 = (tdata.days_61_90 > 0) ? ReportQueryUtil.formatAmount(tdata.days_61_90) : null
                tdata.days_91_120 = (tdata.days_91_120 > 0) ? ReportQueryUtil.formatAmount(tdata.days_91_120) : null
                tdata.days_120_over = (tdata.days_120_over > 0) ? ReportQueryUtil.formatAmount(tdata.days_120_over) : null

            }
        }

        return datas
    },


    ProfitAndLossSummary: async (params, filters) => {

        //get sales transaction
        //get unique customers

        // query sales transactions
        const query = SalesTransactions.query().withGraphFetched('[customer,trans_items.[product.[brand,unit,price]]]').where('branch_code', params.current_branch_code)

        // Filters
        if (filters.hasOwnProperty('date')) {
            query.whereBetween(fn('DATE', ref('transaction_date')), filters.date)
        }

        const result = await query

        //get the unqiue customers
        const customers = _.uniqBy(result, x => x.customer_id).map(item => {
            return {
                customer_id: item.customer_id,
                name: item.customer.name,
                income: null,
                expense: null,
                net_income: null
            }
        })

        let datas = []

        for (var i = 0; i < customers.length; i++) {

            let res = result.filter(item => {
                return item.customer_id === customers[i].customer_id
            }).map(x => {
                return {
                    invoice_no: x.invoice_no,
                    transaction_date: x.transaction_date,
                    trans_items: x.trans_items,
                    totals_price: null,
                    totals_cost: null,
                    totals_net_income: null
                }
            })

            for (var index = 0; index < res.length; index++) {
                let items = res[index].trans_items

                for (var j = 0; j < items.length; j++) {

                    let item_total_price = items[j].total_amount
                    let item_total_cost = parseFloat(items[j].product.price.cost) * parseFloat(items[j].qty)

                    let item_net_income = item_total_price - item_total_cost

                    res[index].trans_items[j].total_cost = item_total_cost.toFixed(2)
                    res[index].trans_items[j].total_item_net_income = item_net_income.toFixed(2)
                }

                //totals per invoice
                res[index].totals_price = ReportQueryUtil.calculateTotals(items, 'total_amount')
                res[index].totals_cost = ReportQueryUtil.calculateTotals(items, 'total_cost')
                res[index].totals_net_income = ReportQueryUtil.calculateTotals(items, 'total_item_net_income')

            }

            //totals it per customer

            customers[i].income = ReportQueryUtil.calculateTotals(res, 'totals_price')
            customers[i].expense = ReportQueryUtil.calculateTotals(res, 'totals_cost')
            customers[i].net_income = ReportQueryUtil.calculateTotals(res, 'totals_net_income')


            datas.push(customers[i])
        }


        let dataObj = {
            items: datas,
            total_income: ReportQueryUtil.formatAmountCurrency(ReportQueryUtil.calculateTotals(datas, 'income')),
            total_expense: ReportQueryUtil.formatAmountCurrency(ReportQueryUtil.calculateTotals(datas, 'expense')),
            total_net_income: ReportQueryUtil.formatAmountCurrency(ReportQueryUtil.calculateTotals(datas, 'net_income'))
        }

        return dataObj

    },

    ProfitAndLossDetailed: async (params, filters) => {

        //get sales transaction
        //get unique customers

        // query sales transactions
        const query = SalesTransactions.query().withGraphFetched('[customer,trans_items.[product.[brand,unit,price]]]').where('branch_code', params.current_branch_code)

        // Filters
        if (filters.hasOwnProperty('date')) {
            query.whereBetween(fn('DATE', ref('transaction_date')), filters.date)
        }

        if (filters.hasOwnProperty('customer')) {
            query.where('customer_id', filters.customer)
        }

        const result = await query

        //get the unqiue customers
        const customers = _.uniqBy(result, x => x.customer_id).map(item => {
            return {
                customer_id: item.customer_id,
                name: item.customer.name,
                items: [],
                totals_amount: null,
                totals_tendered: null,
                totals_balance: null
            }
        })

        let datas = []

        for (var i = 0; i < customers.length; i++) {

            let res = result.filter(item => {
                return item.customer_id === customers[i].customer_id
            }).map(x => {
                return {
                    invoice_no: x.invoice_no,
                    transaction_date: x.transaction_date,
                    trans_items: x.trans_items,
                    totals_price: null,
                    totals_cost: null,
                    totals_net_income: null


                }
            })

            for (var index = 0; index < res.length; index++) {
                let items = res[index].trans_items

                for (var j = 0; j < items.length; j++) {

                    let item_total_price = items[j].total_amount
                    let item_total_cost = parseFloat(items[j].product.price.cost) * parseFloat(items[j].qty)

                    let item_net_income = item_total_price - item_total_cost

                    res[index].trans_items[j].total_cost = item_total_cost.toFixed(2)
                    res[index].trans_items[j].total_item_net_income = item_net_income.toFixed(2)
                }


                res[index].totals_price = ReportQueryUtil.formatAmountCurrency(ReportQueryUtil.calculateTotals(items, 'total_amount'))
                res[index].totals_cost = ReportQueryUtil.formatAmountCurrency(ReportQueryUtil.calculateTotals(items, 'total_cost'))
                res[index].totals_net_income = ReportQueryUtil.formatAmountCurrency(ReportQueryUtil.calculateTotals(items, 'total_item_net_income'))

            }

            customers[i].items = res

            datas.push(customers[i])
        }

        return datas

    },

    ChargeAccountReport: async (params, filters) => {

        // query sales transactions
        const query = SalesTransactions.query().withGraphFetched('[customer]').where('balance_amount', '>', '0').where('branch_code', params.current_branch_code)

        // Filters
        if (filters.hasOwnProperty('date')) {
            query.whereBetween(fn('DATE', ref('transaction_date')), filters.date)
        }

        if (filters.hasOwnProperty('customer')) {
            query.where('customer_id', filters.customer)
        }

        const result = await query

        //get the unqiue customers
        const customers = _.uniqBy(result, x => x.customer_id).map(item => {
            return {
                customer_id: item.customer_id,
                name: item.customer.name,
                transactions: [],
                totals_amount: null,
                totals_tendered: null,
                totals_balance: null,
                uf_totals_balance: null
            }
        })

        let datas = []

        for (var i = 0; i < customers.length; i++) {

            let res = result.filter(item => {
                return item.customer_id === customers[i].customer_id
            }).map(x => {

                let total_amount_due = x.total_amount_due
                let total_amount_tendered = x.total_amount_tendered
                let total_balance_amount = x.balance_amount

                return {
                    invoice_no: x.invoice_no,
                    transaction_date: x.transaction_date,
                    total_amount_due: (total_amount_due > 0) ? total_amount_due : null,
                    total_amount_tendered: (total_amount_tendered > 0) ? total_amount_tendered : null,
                    total_balance_amount: (total_balance_amount > 0) ? total_balance_amount : null,
                    type: x.transaction_type,
                }
            })

            customers[i].transactions = res

            let totals_amount = ReportQueryUtil.calculateTotals(res, 'total_amount_due')
            let totals_tendered = ReportQueryUtil.calculateTotals(res, 'total_amount_tendered')
            let totals_balance = ReportQueryUtil.calculateTotals(res, 'total_balance_amount')

            customers[i].totals_amount = (totals_amount > 0) ? ReportQueryUtil.formatAmountCurrency(totals_amount) : null
            customers[i].totals_tendered = (totals_tendered > 0) ? ReportQueryUtil.formatAmountCurrency(totals_tendered) : null
            customers[i].totals_balance = (totals_balance > 0) ? ReportQueryUtil.formatAmountCurrency(totals_balance) : null
            customers[i].uf_totals_balance = (totals_balance > 0) ? totals_balance : null


            datas.push(customers[i])
        }

        let grandtotal_balance = ReportQueryUtil.calculateTotals(datas, 'uf_totals_balance')
        let overall_totals_balance = (grandtotal_balance > 0) ? ReportQueryUtil.formatAmountCurrency(grandtotal_balance) : null

        let dataObj = {
            overall_totals_balance: overall_totals_balance,
            datas: datas
        }

        return dataObj
    },

    ChargePaymentReport: async (params, filters) => {

        let payments = []

        let pcash_query = PaymentCash.query().where('terminal', 'webapp').withGraphFetched('[tender]')
        // Filters
        if (filters.hasOwnProperty('date')) {
            pcash_query.whereBetween(fn('DATE', ref('paytrans_date')), filters.date)
        }

        let pcash = await pcash_query

        // filter by branch_code
        let filteredPCash = pcash.filter(item => { return item.tender.branch_code === params.current_branch_code })

        let payment_cash = filteredPCash.map(item => {
            return {
                id: item.id,
                payment_id: item.payment_id,
                amount: item.amount,
                paytrans_date: dayjs(item.paytrans_date).format('MMM-DD-YYYY'),
                terminal: item.terminal,
                method: 'CASH',

                cheque_name: null,
                cheque_no: null,
                cheque_date: null,
                cheque_name: null,
                cheque_bank: null,
            }
        })

        let pcheque_query = PaymentCheque.query().where('terminal', 'webapp').withGraphFetched('[bank,tender]')

        // Filters
        if (filters.hasOwnProperty('date')) {
            pcheque_query.whereBetween(fn('DATE', ref('paytrans_date')), filters.date)
        }

        let pcheque = await pcheque_query

        // filter by branch_code
        let filteredPCheque = pcheque.filter(item => { return item.tender.branch_code === params.current_branch_code })

        let payment_cheque = filteredPCheque.map(item => {
            return {
                id: item.id,
                payment_id: item.payment_id,
                amount: item.amount,
                paytrans_date: dayjs(item.paytrans_date).format('MMM-DD-YYYY'),
                terminal: item.terminal,
                method: 'CHEQUE',

                cheque_name: item.cheque_name,
                cheque_no: item.cheque_no,
                cheque_date: item.cheque_date,
                cheque_name: item.cheque_name,
                cheque_bank: item.bank.name,
            }
        })


        payments.push(...payment_cash, ...payment_cheque)

        //totals its
        let total_payments = ReportQueryUtil.calculateTotals(payments, 'amount')
        let f_total_payments = (total_payments > 0) ? ReportQueryUtil.formatAmountCurrency(total_payments) : null

        //iterate

        let invoices = []

        for (let i = 0; i < payments.length; i++) {
            let ptender = await PaymentTender.query().where('id', payments[i].payment_id).first()

            let invoice = await SalesTransactions.query().where('id', ptender.sales_transaction_id).withGraphFetched('[customer]').first()
            invoice.paymentlist = payments[i]

            invoices.push(invoice)
        }

        let filteredInvoices = invoices.filter(item => { return item.branch_code === params.current_branch_code })


        let dataObj = {
            total_payments: f_total_payments,
            datas: filteredInvoices
        }


        return dataObj

    },

    SalesReturnReport: async (params, filters) => {

        let query = SalesReturns.query().withGraphFetched('[items.[product.[brand,unit]]]').where('branch_code', params.current_branch_code)

        // Filters
        if (filters.hasOwnProperty('date')) {
            query.whereBetween(fn('DATE', ref('return_date')), filters.date)
        }

        let salesReturns = await query

        let mappedSalesReturn = salesReturns.map(item => {

            let f_total_returned_amount = (item.total_returned_amount > 0) ? ReportQueryUtil.formatAmountCurrency(item.total_returned_amount) : null
            let f_total_replaced_amount = (item.total_replaced_amount > 0) ? ReportQueryUtil.formatAmountCurrency(item.total_replaced_amount) : null

            return {
                sales_return_code: item.sales_return_code,
                invoice_no: item.invoice_no,
                return_date: dayjs(item.return_date).format('MMM-DD-YYYY HH:mm'),
                customer: item.customer_name,
                type: item.type,
                total_returned_amount: f_total_returned_amount,
                total_replaced_amount: f_total_replaced_amount,
                items: item.items,
                sr_items: []
            }
        })




        for (let i = 0; i < mappedSalesReturn.length; i++) {

            let items = []
            let sr_items = mappedSalesReturn[i].items

            for (let index = 0; index < sr_items.length; index++) {

                let return_item_total = null
                let replace_item_total = null


                if (sr_items[index].is_replace === 0) {
                    return_item_total = sr_items[index].item_total_amount
                    replace_item_total = null
                } else {
                    return_item_total = null
                    replace_item_total = sr_items[index].item_total_amount
                }

                let itemsObj = {
                    brand: sr_items[index].product.brand.brandname,
                    name: sr_items[index].product.name,
                    description: sr_items[index].product.description,
                    unit: sr_items[index].product.unit.item_unit,
                    quantity: sr_items[index].quantity,
                    price_per_unit: sr_items[index].price_per_unit,
                    return_item_total: return_item_total,
                    replace_item_total: replace_item_total,
                }

                items.push(itemsObj)

            }

            mappedSalesReturn[i].sr_items = items

        }

        let dataObj = {
            date1: dayjs(filters.date[0]).format('MMM-DD-YYYY'),
            date2: dayjs(filters.date[1]).format('MMM-DD-YYYY'),
            datas: mappedSalesReturn
        }

        return dataObj
    },




    // Not use anymore
    SalesTransaction: async (params, filters) => {
        const results = await SalesTransactions.query().withGraphFetched('[customer]').where('branch_code', params.current_branch_code)
        return DataHelpers.columnDataMapper(params, results)
    },

    SalesReturn: async (params, filters) => {
        const results = await SalesReturns.query().withGraphFetched('[customer]').where('branch_code', params.current_branch_code)
        return DataHelpers.columnDataMapper(params, results)
    },






    /* Purchase Reports */

    PurchaseOrderBySupplierSummary: async (params, filters) => {

        // get PO and group it by Supplier
        // display and total it

        // get all PO that are not yet receive and summarized it.

        const query = PurchaseOrders.query().withGraphFetched('[supplier,po_items]').whereIn('status', ['Received', 'Close']).where('branch_code', params.current_branch_code)

        // Filters
        if (filters.hasOwnProperty('date')) {
            query.whereBetween(fn('DATE', ref('date_created')), filters.date)
        }

        if (filters.hasOwnProperty('supplier')) {
            query.where('supplier_id', filters.supplier)
        }

        const pos = await query


        //get the unqiue supplier
        const uniqSuppliers = _.uniqBy(pos, x => x.supplier_id).map(item => {
            return {
                supplier_id: item.supplier_id,
                supplier: item.supplier.name,
                items: [],
                totals_receive_amount: null,
                totals_paid_amount: null,
                totals_balance_amount: null
            }
        })

        let datas = []

        for (var i = 0; i < uniqSuppliers.length; i++) {

            let res = pos.filter(item => {
                return item.supplier_id === uniqSuppliers[i].supplier_id
            }).map(x => {
                return {
                    po_number: x.po_number,
                    po_date: x.po_date,
                    status: x.status,
                    receive_total_amount: (x.receive_total_amount > 0) ? x.receive_total_amount : null,
                    paid_amount: (x.paid_amount > 0) ? x.paid_amount : null,
                    balance_amount: (x.balance_amount > 0) ? x.balance_amount : null,
                    receive_date: x.po_items[0].date_receive
                }
            })

            uniqSuppliers[i].items = res

            let calc_total_receive = ReportQueryUtil.calculateTotals(res, 'receive_total_amount')
            let calc_total_paid = ReportQueryUtil.calculateTotals(res, 'paid_amount')
            let calc_total_balance = ReportQueryUtil.calculateTotals(res, 'balance_amount')

            uniqSuppliers[i].totals_receive_amount = (calc_total_receive > 0) ? ReportQueryUtil.formatAmountCurrency(calc_total_receive) : null
            uniqSuppliers[i].totals_paid_amount = (calc_total_paid > 0) ? ReportQueryUtil.formatAmountCurrency(calc_total_paid) : null
            uniqSuppliers[i].totals_balance_amount = (calc_total_balance > 0) ? ReportQueryUtil.formatAmountCurrency(calc_total_balance) : null

            datas.push(uniqSuppliers[i])
        }


        // Added to format amount with decimal and commas 20210425
        // iterate on the data and directly format it
        for (let j = 0; j < datas.length; j++) {
            for (let k = 0; k < datas[j].items.length; k++) {
                let tdata = datas[j].items[k]

                tdata.receive_total_amount = (tdata.receive_total_amount > 0) ? ReportQueryUtil.formatAmount(tdata.receive_total_amount) : null
                tdata.paid_amount = (tdata.paid_amount > 0) ? ReportQueryUtil.formatAmount(tdata.paid_amount) : null
                tdata.balance_amount = (tdata.balance_amount > 0) ? ReportQueryUtil.formatAmount(tdata.balance_amount) : null
            }
        }

        return datas
    },



    PurchaseOrderBySupplierDetailedSummary: async (params, filters) => {
        // get all PO that are not yet receive and summarized it.

        // get pos
        const query = PurchaseOrders.query().withGraphFetched('[supplier,po_items.[product.[brand,unit]]]').whereIn('status', ['Received', 'Close']).where('branch_code', params.current_branch_code)

        // Filters
        if (filters.hasOwnProperty('date')) {
            query.whereBetween(fn('DATE', ref('date_created')), filters.date)
        }

        if (filters.hasOwnProperty('supplier')) {
            query.where('supplier_id', filters.supplier)
        }

        const pos = await query


        //get the unqiue supplier
        const uniqSuppliers = _.uniqBy(pos, x => x.supplier_id).map(item => {
            return {
                supplier_id: item.supplier_id,
                supplier: item.supplier.name,
                purchase_orders: []
            }
        })

        let datas = []

        for (var i = 0; i < uniqSuppliers.length; i++) {

            let res = pos.filter(item => {
                return item.supplier_id === uniqSuppliers[i].supplier_id
            }).map(x => {


                let po_items = []

                if (x.po_type === 'non-trade') {
                    po_items = x.po_items.map(r => {
                        return {
                            product: {
                                name: r.nt_item,
                                description: r.nt_item_description
                            },
                            receive_qty: r.receive_qty,
                            actual_price: r.actual_price,
                            receive_total_amount: r.receive_total_amount
                        }
                    })
                } else {
                    po_items = x.po_items
                }

                let totals_price = ReportQueryUtil.calculateTotals(po_items, 'receive_total_amount')



                return {
                    po_number: x.po_number,
                    po_date: x.date_created,
                    po_items: po_items,
                    po_totals_price: (totals_price > 0) ? ReportQueryUtil.formatAmountCurrency(totals_price) : null
                }
            })


            // //iterate again and recalculate po_totals_price

            // for (var index = 0; index < res.length; index++) {

            // }

            uniqSuppliers[i].purchase_orders = res

            datas.push(uniqSuppliers[i])
        }

        return datas
    },



    PurchaseOrderBySummary: async (params, filters) => {
        const results = await SalesTransactions.query().withGraphFetched('[customer]')
        return DataHelpers.columnDataMapper(params, results)
    },



    PurchaseOrderByItemDetailedSummary: async (params, filters) => {

        //get the pos
        const query = PurchaseOrders.query().where('po_type', null).whereIn('status', ['Received', 'Close']).where('branch_code', params.current_branch_code)

        // Filters
        if (filters.hasOwnProperty('date')) {
            query.whereBetween(fn('DATE', ref('date_created')), filters.date)
        }

        const pos = await query


        let arrAllItems = []

        for (let index = 0; index < pos.length; index++) {

            let items = await PurchaseOrderItems.query().withGraphFetched('[product.[category,brand,unit]]').where('po_number', pos[index].po_number)
            arrAllItems.push(...items)
        }

        let flatAllItems = arrAllItems.map(item => {
            return {
                category_id: item.product.category_ref_id,
                category_name: item.product.category.name,
                product_id: item.product.product_id,
                product_name: item.product.name,
                product_code: item.product.product_code,
                product_desc: item.product.description,
                brand: item.product.brand.brandname,
                unit: item.product.unit.item_unit,
                ordered_qty: item.qty,
                actual_price: item.actual_price,
                quotation_price: item.quotation_price,
                cost_price: item.cost_price
            }
        })

        let mergeFlatAllItems = []

        //get also the uniq product_ids
        const uniqProdIds = _.uniqBy(flatAllItems, x => x.product_id).map(item => {
            return item.product_id
        })

        uniqProdIds.forEach(el => {

            let items = flatAllItems.filter(item => {
                return item.product_id === el
            })

            //totals here
            let ordered_qty = parseInt(ReportQueryUtil.calculateTotals(items, 'ordered_qty'))

            let total_price = parseFloat(items[0].cost_price) * parseFloat(items[0].ordered_qty)

            let mergeObj = {
                category_id: items[0].category_id,
                category_name: items[0].category_name,
                product_id: items[0].product_id,
                product_name: items[0].product_name,
                product_code: items[0].product_code,
                product_desc: items[0].product_desc,
                brand: items[0].brand,
                unit: items[0].unit,
                cost: items[0].cost_price,
                ordered_qty: items[0].ordered_qty,
                total_price: total_price.toFixed(2)
            }

            mergeFlatAllItems.push(mergeObj)
        });

        //get the unqiue category
        let uniqCategories = _.uniqBy(mergeFlatAllItems, x => x.category_id).map(item => {
            return {
                category_id: item.category_id,
                category_name: item.category_name,
                items: []
            }
        })


        if (filters.hasOwnProperty('category')) {
            uniqCategories = uniqCategories.filter(item => { return item.category_id === filters.category })
        }

        let datas = []

        for (var i = 0; i < uniqCategories.length; i++) {

            let res = mergeFlatAllItems.filter(item => {
                return item.category_id === uniqCategories[i].category_id
            }).map(x => {
                return {
                    product_id: x.product_id,
                    product_name: x.product_name,
                    product_code: x.product_code,
                    product_desc: x.product_desc,
                    brand: x.brand,
                    unit: x.unit,
                    cost: x.cost,
                    ordered_qty: x.ordered_qty,
                    total_price: x.total_price
                }
            })

            uniqCategories[i].items = res

            datas.push(uniqCategories[i])
        }

        return datas

    },




    OpenPurchaseOrderSummary: async (params, filters) => {

        // get all PO that are not yet receive and summarized it.

        const query = PurchaseOrders.query().withGraphFetched('[supplier]')
            .whereIn('status', ['Sent', 'PO', 'Partial']).where('branch_code', params.current_branch_code)

        // Filters
        if (filters.hasOwnProperty('date')) {
            query.whereBetween(fn('DATE', ref('date_created')), filters.date)
        }

        if (filters.hasOwnProperty('supplier')) {
            query.where('supplier_id', filters.supplier)
        }

        const pos = await query


        //get the unqiue supplier
        const uniqSuppliers = _.uniqBy(pos, x => x.supplier_id).map(item => {
            return {
                supplier_id: item.supplier_id,
                supplier: item.supplier.name,
                items: []
            }
        })

        let datas = []

        for (var i = 0; i < uniqSuppliers.length; i++) {

            let res = pos.filter(item => {
                return item.supplier_id === uniqSuppliers[i].supplier_id
            }).map(x => {
                return {
                    po_number: x.po_number,
                    po_date: x.date_created,
                    status: x.status
                }
            })

            uniqSuppliers[i].items = res

            datas.push(uniqSuppliers[i])
        }

        return datas



    },



    PurchasePayablesSummary: async (params, filters) => {

        // query sales transactions
        const query = PurchaseOrders.query().withGraphFetched('[supplier]')
            .whereIn('status', ['Received', 'Close'])
            .where('payment_status', '!=', 'Paid')
            .where('branch_code', params.current_branch_code)

        // Filters
        if (filters.hasOwnProperty('supplier')) {
            query.where('supplier_id', filters.supplier)
        }

        const result = await query


        var test = result.map(item => {
            return {
                po: item.po_number,
                pstatus: item.payment_status,
            }
        })



        console.log(test.length)



        //get the unqiue customers
        const suppliers = _.uniqBy(result, x => x.supplier_id).map(item => {
            return {
                supplier_id: item.supplier_id,
                name: item.supplier.name,
                transactions: [],
                totals_days_0_30: null,
                totals_days_31_60: null,
                totals_days_61_90: null,
                totals_days_91_120: null,
                totals_days_120_over: null
            }
        })

        let datas = []

        for (var i = 0; i < suppliers.length; i++) {

            let res = result.filter(item => {
                return item.supplier_id === suppliers[i].supplier_id
            }).map(x => {
                return {
                    po_number: x.po_number,
                    po_date: x.date_created,
                    balance_amount: x.balance_amount,
                    days_0_30: null,
                    days_31_60: null,
                    days_61_90: null,
                    days_91_120: null,
                    days_120_over: null,
                }
            })

            for (let index = 0; index < res.length; index++) {

                //calculate date and get days

                let datenow = dayjs()
                let age = datenow.diff(res[index].po_date, 'day')

                if (age >= 0 && age <= 30) {
                    res[index].days_0_30 = res[index].balance_amount
                }

                if (age >= 31 && age <= 60) {
                    res[index].days_31_60 = res[index].balance_amount
                }

                if (age >= 61 && age <= 90) {
                    res[index].days_61_90 = res[index].balance_amount
                }

                if (age >= 91 && age <= 120) {
                    res[index].days_91_120 = res[index].balance_amount
                }

                if (age > 120) {
                    res[index].days_120_over = res[index].balance_amount
                }

            }

            suppliers[i].transactions = res

            let calc_total0_30 = ReportQueryUtil.calculateTotals(res, 'days_0_30')
            let calc_total31_60 = ReportQueryUtil.calculateTotals(res, 'days_31_60')
            let calc_total61_90 = ReportQueryUtil.calculateTotals(res, 'days_61_90')
            let calc_total91_120 = ReportQueryUtil.calculateTotals(res, 'days_91_120')
            let calc_total120_over = ReportQueryUtil.calculateTotals(res, 'days_120_over')


            suppliers[i].totals_days_0_30 = (calc_total0_30 > 0) ? ReportQueryUtil.formatAmountCurrency(calc_total0_30) : null
            suppliers[i].totals_days_31_60 = (calc_total31_60 > 0) ? ReportQueryUtil.formatAmountCurrency(calc_total31_60) : null
            suppliers[i].totals_days_61_90 = (calc_total61_90 > 0) ? ReportQueryUtil.formatAmountCurrency(calc_total61_90) : null
            suppliers[i].totals_days_91_120 = (calc_total91_120 > 0) ? ReportQueryUtil.formatAmountCurrency(calc_total91_120) : null
            suppliers[i].totals_days_120_over = (calc_total120_over > 0) ? ReportQueryUtil.formatAmountCurrency(calc_total120_over) : null

            datas.push(suppliers[i])
        }

        //console.log(datas[0])

        // Added to format amount with decimal and commas 20210425
        // iterate on the data and directly format it
        for (let j = 0; j < datas.length; j++) {
            for (let k = 0; k < datas[j].transactions.length; k++) {
                let tdata = datas[j].transactions[k]

                tdata.days_0_30 = (tdata.days_0_30 > 0) ? ReportQueryUtil.formatAmount(tdata.days_0_30) : null
                tdata.days_31_60 = (tdata.days_31_60 > 0) ? ReportQueryUtil.formatAmount(tdata.days_31_60) : null
                tdata.days_61_90 = (tdata.days_61_90 > 0) ? ReportQueryUtil.formatAmount(tdata.days_61_90) : null
                tdata.days_91_120 = (tdata.days_91_120 > 0) ? ReportQueryUtil.formatAmount(tdata.days_91_120) : null
                tdata.days_120_over = (tdata.days_120_over > 0) ? ReportQueryUtil.formatAmount(tdata.days_120_over) : null

            }
        }

        return datas
    },




    /* Inventory Reports */


    LowQuantityItems: async (params, filters) => {
        let lowstock_limit = 10

        const stocks = await Stocks.query().withGraphFetched('[product.[category,brand,unit]]').where('onhand_qty', '<=', lowstock_limit)

        let uniqueCategories = _.uniqBy(stocks, x => x.product.category_ref_id).map(item => {
            return {
                category_id: item.product.category_ref_id,
                category_name: item.product.category.name
            }
        })


        if (filters.hasOwnProperty('category')) {
            uniqueCategories = uniqueCategories.filter(item => { return item.category_id === filters.category })
        }

        let datas = []

        uniqueCategories.forEach(el => {

            let categoryObj = {
                name: el.category_name,
                items: []
            }

            let filteredStocks = stocks.filter(item => {
                return item.product.category_ref_id === el.category_id
            })

            //get unique product_id

            let uniqueProducts = _.uniqBy(filteredStocks, x => x.product_id).map(item => {
                return item.product_id
            })

            for (let index = 0; index < uniqueProducts.length; index++) {

                let filteredByProductId = filteredStocks.filter(item => {
                    return item.product_id === uniqueProducts[index]
                })


                let sg_stock = filteredByProductId.find(item => { return item.branch_code === 'SG' })
                let eg_stock = filteredByProductId.find(item => { return item.branch_code === 'EG' })
                let gm_stock = filteredByProductId.find(item => { return item.branch_code === 'GM' })
                let hm_stock = filteredByProductId.find(item => { return item.branch_code === 'HM' })


                let productObj = {
                    product_code: filteredByProductId[0].product.product_code,
                    product_name: filteredByProductId[0].product.name,
                    product_description: filteredByProductId[0].product.description,
                    brand: filteredByProductId[0].product.brand.brandname,
                    unit: filteredByProductId[0].product.unit.item_unit,

                    branch_sg: (sg_stock) ? sg_stock.onhand_qty : 0,
                    branch_eg: (eg_stock) ? eg_stock.onhand_qty : 0,
                    branch_gm: (gm_stock) ? gm_stock.onhand_qty : 0,
                    branch_hm: (hm_stock) ? hm_stock.onhand_qty : 0
                }

                categoryObj.items.push(productObj)

            }
            datas.push(categoryObj)
        });

        return datas
    },



    TotalWarehouseStocksSummary: async (params, filters) => {

        // added price relation to get the product price.cost
        const query = Stocks.query().withGraphFetched('[product.[category,brand,unit,price]]')


        // Filters
        if (filters.hasOwnProperty('date')) {
            query.whereBetween(fn('DATE', ref('date_onhand_qty')), filters.date)
        }

        const stocks = await query




        let uniqueCategories = _.uniqBy(stocks, x => x.product.category_ref_id).map(item => {
            return {
                category_id: item.product.category_ref_id,
                category_name: item.product.category.name
            }
        })

        if (filters.hasOwnProperty('category')) {
            uniqueCategories = uniqueCategories.filter(item => { return item.category_id === filters.category })
        }

        let datas = []

        uniqueCategories.forEach(el => {

            let categoryObj = {
                name: el.category_name,
                items: []
            }

            let filteredStocks = stocks.filter(item => {
                return item.product.category_ref_id === el.category_id
            })

            //get unique product_id

            let uniqueProducts = _.uniqBy(filteredStocks, x => x.product_id).map(item => {
                return item.product_id
            })



            for (let index = 0; index < uniqueProducts.length; index++) {

                let filteredByProductId = filteredStocks.filter(item => {
                    return item.product_id === uniqueProducts[index]
                })




                let sg_stock = filteredByProductId.find(item => { return item.branch_code === 'SG' })
                let eg_stock = filteredByProductId.find(item => { return item.branch_code === 'EG' })
                let gm_stock = filteredByProductId.find(item => { return item.branch_code === 'GM' })
                let hm_stock = filteredByProductId.find(item => { return item.branch_code === 'HM' })
                let tcs_stock = filteredByProductId.find(item => { return item.branch_code === 'TCS' })

                // if (!sg_stock.price) {
                //     console.log('error')
                // }


                let new_sgstock = (sg_stock) ? sg_stock.onhand_qty : 0
                let new_egstock = (eg_stock) ? eg_stock.onhand_qty : 0
                let new_gmstock = (gm_stock) ? gm_stock.onhand_qty : 0
                let new_hmstock = (hm_stock) ? hm_stock.onhand_qty : 0
                let new_tcsstock = (tcs_stock) ? tcs_stock.onhand_qty : 0


                let formatted_sg_stock = (new_sgstock) ? ReportQueryUtil.formatAmount(new_sgstock, 0) : null
                let formatted_eg_stock = (new_egstock) ? ReportQueryUtil.formatAmount(new_egstock, 0) : null
                let formatted_gm_stock = (new_gmstock) ? ReportQueryUtil.formatAmount(new_gmstock, 0) : null
                let formatted_tcs_stock = (new_tcsstock) ? ReportQueryUtil.formatAmount(new_tcsstock, 0) : null

                let tmp_totals_stock = (new_sgstock + new_egstock + new_gmstock + new_tcsstock)
                let formatted_totals_stocks = (tmp_totals_stock) ? ReportQueryUtil.formatAmount(tmp_totals_stock, 0) : null


                // calculate the stock value -- added 20211111
                // remove checking of zero to support calculation of negative stocks

                let sgstock_cost = 0
                let egstock_cost = 0
                let gmstock_cost = 0
                let tcsstock_cost = 0

                if (sg_stock) {
                    sgstock_cost = (sg_stock.product.price) ? sg_stock.product.price.cost : 0
                } else {
                    sgstock_cost = 0
                }

                if (eg_stock) {
                    egstock_cost = (eg_stock.product.price) ? eg_stock.product.price.cost : 0
                } else {
                    egstock_cost = 0
                }

                if (gm_stock) {
                    gmstock_cost = (gm_stock.product.price) ? gm_stock.product.price.cost : 0
                } else {
                    gmstock_cost = 0
                }

                if (tcs_stock) {
                    tcsstock_cost = (tcs_stock.product.price) ? tcs_stock.product.price.cost : 0
                } else {
                    tcsstock_cost = 0
                }


                let sg_stock_value = new_sgstock * sgstock_cost
                let eg_stock_value = new_egstock * egstock_cost
                let gm_stock_value = new_gmstock * gmstock_cost
                let tcs_stock_value = new_tcsstock * tcsstock_cost


                let formatted_sg_sv = (sg_stock_value) ? ReportQueryUtil.formatAmount(sg_stock_value) : null
                let formatted_eg_sv = (eg_stock_value) ? ReportQueryUtil.formatAmount(eg_stock_value) : null
                let formatted_gm_sv = (gm_stock_value) ? ReportQueryUtil.formatAmount(gm_stock_value) : null
                let formatted_tcs_sv = (tcs_stock_value) ? ReportQueryUtil.formatAmount(tcs_stock_value) : null

                let tmp_totals_sv = (sg_stock_value + eg_stock_value + gm_stock_value + tcs_stock_value)
                let formatted_totals_sv = (tmp_totals_sv) ? ReportQueryUtil.formatAmount(tmp_totals_sv) : null




                let productObj = {
                    product_code: filteredByProductId[0].product.product_code,
                    product_name: filteredByProductId[0].product.name,
                    product_description: filteredByProductId[0].product.description,
                    brand: filteredByProductId[0].product.brand.brandname,
                    unit: filteredByProductId[0].product.unit.item_unit,

                    branch_sg: formatted_sg_stock,
                    branch_eg: formatted_eg_stock,
                    branch_gm: formatted_gm_stock,
                    // branch_hm: new_hmstock,
                    branch_tcs: formatted_tcs_stock,
                    totals_stock: formatted_totals_stocks,

                    branch_sg_sv: formatted_sg_sv,
                    branch_eg_sv: formatted_eg_sv,
                    branch_gm_sv: formatted_gm_sv,
                    branch_tcs_sv: formatted_tcs_sv,
                    totals_sv: formatted_totals_sv,
                }

                categoryObj.items.push(productObj)

            }
            datas.push(categoryObj)
        });

        return datas
    },



    InventoryDetailedSummary: async (params, filters) => {

        const products = await Products.query().withGraphFetched('[price,category,brand,unit]')

        let uniqueCategories = _.uniqBy(products, x => x.category_ref_id).map(item => {
            return {
                category_id: item.category_ref_id,
                category_name: item.category.name
            }
        })

        if (filters.hasOwnProperty('category')) {
            uniqueCategories = uniqueCategories.filter(item => { return item.category_id === filters.category })
        }

        let datas = []

        uniqueCategories.forEach(el => {



            let filteredProducts = products.filter(item => {
                return item.category_ref_id === el.category_id
            })


            let mappedProducts = filteredProducts.map(item => {
                return {
                    product_code: item.product_code,
                    product_name: item.name,
                    product_description: item.description,
                    brand: item.brand.brandname,
                    unit: item.unit.item_unit,
                    cost: item.price.cost,
                    retail: item.price.retail,
                    wholesale: item.price.wholesale
                }
            })


            let categoryObj = {
                name: el.category_name,
                items: mappedProducts
            }

            datas.push(categoryObj)
        });

        return datas
    },


    InventoryCostVsSelling: async (params, filters) => {
        const results = await SalesTransactions.query().withGraphFetched('[customer]')
        return DataHelpers.columnDataMapper(params, results)
    },
    InventoryCountSummary: async (params, filters) => {
        const results = await SalesTransactions.query().withGraphFetched('[customer]')
        return DataHelpers.columnDataMapper(params, results)
    },



    StockTransfer: async (params, filters) => {

        // get the stocktransfer - incoming

        const query = StockTransfer.query().withGraphFetched('[user_req,user_ful,items.[product.[brand,unit,category]]]')
            .whereIn('status', ['COMPLETED', 'REQUEST-FULFILLED'])
            .where('type', null)

        // Filters
        if (filters.hasOwnProperty('date')) {
            query.whereBetween(fn('DATE', ref('date_requested')), filters.date)
        }

        if (filters.hasOwnProperty('request_branch')) {
            query.where('requesting_branch_code', filters.request_branch)
        }

        if (filters.hasOwnProperty('fulfilled_branch')) {
            query.where('fulfilling_branch_code', filters.fulfilled_branch)
        }

        const stockTransfers = await query

        //mapped
        let mappedStockTransfers = stockTransfers.map(item => {
            return {
                stock_transfer_no: item.stock_transfer_no,
                status: item.status,
                date_requested: item.date_requested,
                date_fulfilled: item.date_fulfilled,
                requesting_branch: item.requesting_branch_code,
                fulfilling_branch: item.fulfilling_branch_code,
                user_requesting: item.user_req.fullname,
                user_fulfilling: item.user_ful.fullname,
                items: item.items
            }
        })


        return mappedStockTransfers

    },


    StockTransferOutgoing: async (params, filters) => {
        // get the stocktransfer

        const query = StockTransfer.query().withGraphFetched('[user_req,user_ful,items.[product.[brand,unit,category]]]')
            .whereIn('status', ['COMPLETED', 'REQUEST-FULFILLED'])
            .where('type', null)

        // Filters
        if (filters.hasOwnProperty('date')) {
            query.whereBetween(fn('DATE', ref('date_requested')), filters.date)
        }

        if (filters.hasOwnProperty('request_branch')) {
            query.where('requesting_branch_code', filters.request_branch)
        }

        if (filters.hasOwnProperty('fulfilled_branch')) {
            query.where('fulfilling_branch_code', filters.fulfilled_branch)
        }

        const stockTransfers = await query

        //mapped
        let mappedStockTransfers = stockTransfers.map(item => {
            return {
                stock_transfer_no: item.stock_transfer_no,
                status: item.status,
                date_requested: item.date_requested,
                date_fulfilled: item.date_fulfilled,
                requesting_branch: item.requesting_branch_code,
                fulfilling_branch: item.fulfilling_branch_code,
                user_requesting: item.user_req.fullname,
                user_fulfilling: item.user_ful.fullname,
                items: item.items
            }
        })


        return mappedStockTransfers
    },

    // Added 20210620
    StockOuts: async (params, filters) => {

        const query = StockOuts.query().withGraphFetched('[product.[brand,unit,category]]')
            .where('branch_code', params.current_branch_code)

        // Filters
        if (filters.hasOwnProperty('date')) {
            query.whereBetween(fn('DATE', ref('stockout_date')), filters.date)
        }

        const stockOuts = await query

        //flatten it
        let mappedStockOuts = stockOuts.map(item => {
            return {
                stockout_id: item.stockout_id,
                stockout_date: item.stockout_date,
                qty_out: item.qty,
                product_id: item.product_id,
                name: item.product.name,
                description: item.product.description,
                product_code: item.product.product_code,
                brand: item.product.brand.brandname,
                unit: item.product.unit.item_unit,
                category_name: item.product.category.name,
                category_id: item.product.category_ref_id,
                branch_code: item.branch_code
            }
        })


        //get unique categories

        let uniqueCategories = _.uniqBy(mappedStockOuts, x => x.category_id).map(item => {
            return {
                category_id: item.category_id,
                category_name: item.category_name
            }
        })

        if (filters.hasOwnProperty('category')) {
            uniqueCategories = uniqueCategories.filter(item => { return item.category_id === filters.category })
        }

        let datas = []

        uniqueCategories.forEach(el => {



            let filteredProducts = mappedStockOuts.filter(item => {
                return item.category_id === el.category_id
            })

            //need to total the product maybe they have duplicate

            let uniqueProducts = _.uniqBy(filteredProducts, x => x.product_id).map(item => {
                return {
                    product_id: item.product_id,
                    name: item.name
                }
            })


            let catProducts = []
            for (let idx = 0; idx < uniqueProducts.length; idx++) {

                let prods = filteredProducts.filter(prod => { return prod.product_id === uniqueProducts[idx].product_id })

                //
                if (prods.length > 0) {
                    //total it
                    let prodTotalQty = ReportQueryUtil.calculateTotals(prods, 'qty_out')

                    let prod = {
                        product_id: prods[0].product_id,
                        name: prods[0].name,
                        description: prods[0].description,
                        product_code: prods[0].product_code,
                        brand: prods[0].brand,
                        unit: prods[0].unit,
                        total_qty_out: prodTotalQty,
                        category_id: prods[0].category_id,
                        category_name: prods[0].category_name
                    }
                    catProducts.push(prod)
                }

            }

            let categoryObj = {
                name: el.category_name,
                items: catProducts
            }

            datas.push(categoryObj)
        });


        for (let index = 0; index < filters.date.length; index++) {
            filters.date[index] = dayjs(filters.date[index]).format('MMM-DD-YYYY')
        }

        let dateperiod = filters.date.join(' to ')

        let dataObj = {
            dateperiod: dateperiod,
            datas: datas
        }

        return dataObj

    },

    // Added 20210620
    StockIns: async (params, filters) => {

        const query = StockIns.query().withGraphFetched('[product.[brand,unit,category]]')
            .where('branch_code', params.current_branch_code)

        // Filters
        if (filters.hasOwnProperty('date')) {
            query.whereBetween(fn('DATE', ref('stockin_date')), filters.date)
        }

        const stockIns = await query

        //flatten it
        let mappedStockIns = stockIns.map(item => {

            // let qty = 0
            // if (item.qty) qty = item.qty

            return {
                stockin_id: item.stockin_id,
                stockin_date: item.stockin_date,
                qty_in: item.qty,
                product_id: item.product_id,
                name: item.product.name,
                description: item.product.description,
                product_code: item.product.product_code,
                brand: item.product.brand.brandname,
                unit: item.product.unit.item_unit,
                category_name: item.product.category.name,
                category_id: item.product.category_ref_id,
                branch_code: item.branch_code
            }
        })

        console.log(mappedStockIns)


        //get unique categories

        let uniqueCategories = _.uniqBy(mappedStockIns, x => x.category_id).map(item => {
            return {
                category_id: item.category_id,
                category_name: item.category_name
            }
        })

        if (filters.hasOwnProperty('category')) {
            uniqueCategories = uniqueCategories.filter(item => { return item.category_id === filters.category })
        }

        let datas = []

        uniqueCategories.forEach(el => {



            let filteredProducts = mappedStockIns.filter(item => {
                return item.category_id === el.category_id
            })

            //need to total the product maybe they have duplicate

            let uniqueProducts = _.uniqBy(filteredProducts, x => x.product_id).map(item => {
                return {
                    product_id: item.product_id,
                    name: item.name
                }
            })


            let catProducts = []
            for (let idx = 0; idx < uniqueProducts.length; idx++) {

                let prods = filteredProducts.filter(prod => { return prod.product_id === uniqueProducts[idx].product_id })

                //
                if (prods.length > 0) {
                    //total it
                    let prodTotalQty = ReportQueryUtil.calculateTotals(prods, 'qty_in')

                    let prod = {
                        product_id: prods[0].product_id,
                        name: prods[0].name,
                        description: prods[0].description,
                        product_code: prods[0].product_code,
                        brand: prods[0].brand,
                        unit: prods[0].unit,
                        total_qty_in: prodTotalQty,
                        category_id: prods[0].category_id,
                        category_name: prods[0].category_name
                    }
                    catProducts.push(prod)
                }

            }

            let categoryObj = {
                name: el.category_name,
                items: catProducts
            }

            datas.push(categoryObj)
        });


        for (let index = 0; index < filters.date.length; index++) {
            filters.date[index] = dayjs(filters.date[index]).format('MMM-DD-YYYY')
        }

        let dateperiod = filters.date.join(' to ')

        let dataObj = {
            dateperiod: dateperiod,
            datas: datas
        }

        return dataObj

    },



    UserLogs: async (params, filters) => {
        const query = UserLogs.query().withGraphFetched('[user]').where('branch_code', params.current_branch_code)

        // Filters
        if (filters.hasOwnProperty('date')) {
            query.whereBetween(fn('DATE', ref('event_datetime')), filters.date)
        }

        const logs = await query

        return logs
    },

}

module.exports = reportfn;