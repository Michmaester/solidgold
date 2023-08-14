const express = require('express');
const router = express.Router();
const { ref, raw } = require('objection');

const dayjs = require('dayjs')
const Helpers = require('../utils/helpers')
const DataHelpers = require('../utils/data_helpers')


// models
const SalesTransactions = require('../models/sales/sales_transactions')
const PurchaseOrders = require('../models/purchase/purchase_orders')
const Stocks = require('../models/stocks/stocks');
const DashCharts = require('../models/charts/dash_charts');
const InventoryRestockings = require('../models/inventory_restockings');
const AccountReceivables = require('../models/account_receivables');
const AccountPayables = require('../models/account_payables');



router.get('/', async (req, res, next) => {

    try {

        const query = req.query

        var branch_code = null

        if (query.hasOwnProperty('branch_code')) {
            branch_code = query.branch_code
        } else {
            branch_code = req.headers.xbranchcode
        }

        //need to check, if i sent a param with branch_code, then use it
        //const branch_code = req.headers.xbranchcode

        // get previous month
        // get present month

        let thisMonthYear = dayjs().format('YYYY-MM')
        let prevMonthYear = dayjs(thisMonthYear).subtract(1, 'month').format('YYYY-MM')

        let datetoday = dayjs().format('YYYY-MM-DD')

        //get sales totals today
        //get invoices counts today
        const sales = await SalesTransactions.query().where(raw('DATE(transaction_date)'), datetoday).andWhere('branch_code', branch_code)
        const sales_totals = parseFloat(Helpers.calculateTotals(sales, 'total_amount_due'))
        const sales_counts = sales.length

        //get purchase totals today
        //get purchase counts today
        const purchases = await PurchaseOrders.query().where(raw('DATE(date_created)'), datetoday).andWhere('branch_code', branch_code).andWhere('status', '<>', 'Cancelled')
        const purchases_totals = parseFloat(Helpers.calculateTotals(purchases, 'total_amount'))
        const purchases_counts = purchases.length

        const today = {
            sales: {
                totals: sales_totals,
                counts: sales_counts
            },
            purchases: {
                totals: purchases_totals,
                counts: purchases_counts
            }
        }


        // Inventory restocking
        const stocks = await InventoryRestockings.query().where('branch_code', branch_code)

        const invRestocks = {
            items: stocks.slice(0, 15),
            counts: stocks.length
        }

        // Accounts receivables

        const receivables = await AccountReceivables.query().where('branch_code', branch_code)

        const accountReceivables = {
            items: receivables,
            totals: parseFloat(Helpers.calculateTotals(receivables, 'amount')),
            counts: receivables.length
        }




        // Accounts Payables
        // const payables = await PurchaseOrders.query().withGraphFetched('[supplier]')
        //     .where('payment_status', 'Unpaid').where('branch_code', branch_code)
        //     .where('status', 'Received').orWhere('status', 'Partial')

        // const mappedPayables = payables.map((item) => {
        //     return {
        //         supplier: item.supplier.name,
        //         amount: item.receive_total_amount,
        //         due_date: dayjs(item.payment_duedate).format('MMM-DD')
        //     }
        // })

        // const accountPayables = {
        //     items: mappedPayables,
        //     totals: parseFloat(Helpers.calculateTotals(mappedPayables, 'amount')),
        //     counts: mappedPayables.length
        // }


        const payables = await AccountPayables.query().where('branch_code', branch_code)
        const accountPayables = {
            items: payables,
            totals: parseFloat(Helpers.calculateTotals(payables, 'amount')),
            counts: payables.length
        }



        res.status(200).json({
            status: 'ok',
            data: {
                today: today,
                restocks: invRestocks,
                receivables: accountReceivables,
                payables: accountPayables
            }
        })

    } catch (error) {
        next(error)
    }

})


function relDiff(a, b) {
    return 100 * Math.abs((a - b) / ((a + b) / 2));
}


function percChange(a, b) {

    const num = ((b - a) / a) * 100

    return Math.round((num + Number.EPSILON) * 100) / 100
    //return 100 * Math.abs((a - b) / ((a + b) / 2));
}




router.get('/get_allbranch_monthly_salespo', async (req, res, next) => {

    try {

        // get previous month
        // get present month

        let thisMonthYear = dayjs().format('YYYY-MM')
        let prevMonthYear = dayjs(thisMonthYear).subtract(1, 'month').format('YYYY-MM')


        const datas = await DashCharts.query().where('datadate', 'like', thisMonthYear + '-%')

        const sg_chart = datas.map((item) => {
            return {
                date: item.datadate,
                sales: item.sg_sales,
                sales_totals: item.sg_sales_total,
                po: item.sg_po,
                po_totals: item.sg_po_total
            }
        })

        const gm_chart = datas.map((item) => {
            return {
                date: item.datadate,
                sales: item.gm_sales,
                sales_totals: item.gm_sales_total,
                po: item.gm_po,
                po_totals: item.gm_po_total
            }
        })

        const eg_chart = datas.map((item) => {
            return {
                date: item.datadate,
                sales: item.eg_sales,
                sales_totals: item.eg_sales_total,
                po: item.eg_po,
                po_totals: item.eg_po_total
            }
        })

        const hm_chart = datas.map((item) => {
            return {
                date: item.datadate,
                sales: item.hm_sales,
                sales_totals: item.hm_sales_total,
                po: item.hm_po,
                po_totals: item.hm_po_total
            }
        })

        const atg_chart = datas.map((item) => {
            return {
                date: item.datadate,
                sales: item.atg_sales,
                sales_totals: item.atg_sales_total,
                po: item.atg_po,
                po_totals: item.atg_po_total
            }
        })

        let charts = {
            sg: sg_chart,
            gm: gm_chart,
            eg: eg_chart,
            hm: hm_chart,
            atg: atg_chart
        }



        res.status(200).json({
            status: 'ok',
            data: charts
        })

    } catch (error) {
        next(error)
    }

})


module.exports = router;