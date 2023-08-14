const dayjs = require('dayjs')

//models
const DashCharts = require('../models/charts/dash_charts')
const SalesTransactions = require('../models/sales/sales_transactions')
const PurchaseOrders = require('../models/purchase/purchase_orders')

const Stocks = require('../models/stocks/stocks')
const InventoryRestockings = require('../models/inventory_restockings')
const AccountReceivables = require('../models/account_receivables')
const AccountPayables = require('../models/account_payables')

const Helpers = require('../utils/helpers')

const { raw, ref, fn } = require('objection')
const findRemoveSync = require('find-remove')



// Crunch daily statistis
const ProcessDailyStatistics = async (datadate) => {

    let stats = []
    let branch_stats = []

    // get date now
    let dateNow = dayjs().format('YYYY-MM-DD')

    // get list of branches
    let branches = ['SG', 'HM', 'EG', 'GM', 'ATG']

    // iterate on the lst of branches
    for (let index = 0; index < branches.length; index++) {

        // query sales table where branch = ?
        let sales = await SalesTransactions.query().where(fn('DATE', ref('transaction_date')), dateNow).where('branch_code', branches[index])
        let po = await PurchaseOrders.query().where(fn('DATE', ref('date_created')), dateNow).where('branch_code', branches[index])

        // create an object to push on the branch_stats array
        let branch = branches[index].toLowerCase()

        let obj = {}
        obj[branch + '_sales'] = sales.length
        obj[branch + '_sales_total'] = Helpers.calculateTotals(sales, 'total_amount_tendered')
        obj[branch + '_po'] = po.length
        obj[branch + '_po_total'] = Helpers.calculateTotals(po, 'total_amount')

        branch_stats.push(obj)

    }


    let bigObj = {}

    //merge into 1 single object
    for (let index = 0; index < branch_stats.length; index++) {
        bigObj = { ...bigObj, ...branch_stats[index] }
    }

    bigObj['datadate'] = dateNow

    //check if thhere is record
    const checkExist = await DashCharts.query().where('datadate', dateNow).first()

    if (checkExist) {
        console.log('exist --> update')
        await DashCharts.query().patch({
            sg_sales: bigObj.sg_sales,
            gm_sales: bigObj.gm_sales,
            eg_sales: bigObj.eg_sales,
            hm_sales: bigObj.hm_sales,
            atg_sales: bigObj.atg_sales,

            sg_sales_total: bigObj.sg_sales_total,
            gm_sales_total: bigObj.gm_sales_total,
            eg_sales_total: bigObj.eg_sales_total,
            hm_sales_total: bigObj.hm_sales_total,
            atg_sales_total: bigObj.atg_sales_total,

            sg_po: bigObj.sg_po,
            gm_po: bigObj.gm_po,
            eg_po: bigObj.eg_po,
            hm_po: bigObj.hm_po,
            atg_po: bigObj.atg_po,

            sg_po_total: bigObj.sg_po_total,
            gm_po_total: bigObj.gm_po_total,
            eg_po_total: bigObj.eg_po_total,
            hm_po_total: bigObj.hm_po_total,
            atg_po_total: bigObj.atg_po_total,
            updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')

        }).where('datadate', bigObj.datadate)
    } else {
        console.log('no record --> insert')
        await DashCharts.query().insert({
            datadate: bigObj.datadate,
            sg_sales: bigObj.sg_sales,
            gm_sales: bigObj.gm_sales,
            eg_sales: bigObj.eg_sales,
            hm_sales: bigObj.hm_sales,
            atg_sales: bigObj.atg_sales,

            sg_sales_total: bigObj.sg_sales_total,
            gm_sales_total: bigObj.gm_sales_total,
            eg_sales_total: bigObj.eg_sales_total,
            hm_sales_total: bigObj.hm_sales_total,
            atg_sales_total: bigObj.atg_sales_total,

            sg_po: bigObj.sg_po,
            gm_po: bigObj.gm_po,
            eg_po: bigObj.eg_po,
            hm_po: bigObj.hm_po,
            atg_po: bigObj.atg_po,

            sg_po_total: bigObj.sg_po_total,
            gm_po_total: bigObj.gm_po_total,
            eg_po_total: bigObj.eg_po_total,
            hm_po_total: bigObj.hm_po_total,
            atg_po_total: bigObj.atg_po_total,

            created_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
        })
    }
}



// Crunch and put data on the respective tables
const ProcessRestockingsAndPayables = async (datadate) => {

    // get date now
    let dateNow = dayjs().format('YYYY-MM-DD')

    // get list of branches
    let branches = ['SG', 'HM', 'EG', 'GM', 'ATG']

    // iterate on the lst of branches
    for (let index = 0; index < branches.length; index++) {


        // Inventory ------------
        const stocks = await Stocks.query().withGraphFetched('[product]').where('branch_code', branches[index]).where('restocking_threshold', '>=', ref('onhand_qty'))
        let mappedStocks = stocks.map(item => {
            let isOrdered = 'no'
            if (item.po_qty > 0) {
                isOrdered = 'yes'
            }
            return {
                product_id: item.product_id,
                stock_id: item.stock_id,
                product: item.product.name,
                onhand_qty: item.onhand_qty,
                ordered_status: isOrdered,
                ordered_qty: item.po_qty,
                branch_code: item.branch_code,

            }
        })

        //delete
        await InventoryRestockings.query().delete().where('branch_code', branches[index])

        //insert
        for (let idx = 0; idx < mappedStocks.length; idx++) {
            //insert
            await InventoryRestockings.query().insert(mappedStocks[idx])
        }



        // Account Receivables
        const invoices = await SalesTransactions.query().withGraphFetched('[customer]').where('payment_status', '!=', 'Paid').where('branch_code', branches[index])

        let mappedInvoices = invoices.map(item => {

            //calculate due date
            let transdate = item.transaction_date
            let customer_terms = parseInt(item.customer.payment_terms)
            let duedate = dayjs(transdate).add(customer_terms, 'day').format('YYYY-MM-DD')

            return {
                customer_id: item.customer_id,
                customer: item.customer.name,
                invoice_no: item.invoice_no,
                amount: item.balance_amount,
                due_date: duedate,
                branch_code: item.branch_code
            }
        })

        //delete
        await AccountReceivables.query().delete().where('branch_code', branches[index])

        //insert
        for (let idx = 0; idx < mappedInvoices.length; idx++) {
            //insert
            await AccountReceivables.query().insert(mappedInvoices[idx])
        }



        // Account Payables

        const pos = await PurchaseOrders.query().withGraphFetched('[supplier]').where('payment_status', '!=', 'Paid').where('branch_code', branches[index]).whereNotIn('status', ['PO', 'Cancelled'])

        let mappedPos = pos.map(item => {

            //calculate due date
            let transdate = item.date_created
            let supplier_terms = parseInt(item.supplier.payment_terms)
            let duedate = dayjs(transdate).add(supplier_terms, 'day').format('YYYY-MM-DD')

            return {

                supplier_id: item.supplier_id,
                supplier: item.supplier.name,
                po_number: item.po_number,
                amount: item.total_amount,
                due_date: duedate,
                branch_code: item.branch_code
            }
        })

        //delete
        await AccountPayables.query().delete().where('branch_code', branches[index])

        //insert
        for (let idx = 0; idx < mappedPos.length; idx++) {
            //insert
            await AccountPayables.query().insert(mappedPos[idx])
        }


    }

}



const DeleteOldFiles = async (dir, fileAge, fileExt) => {
    findRemoveSync(dir, { age: { seconds: fileAge }, extensions: fileExt })
}


module.exports = {
    ProcessDailyStatistics,
    ProcessRestockingsAndPayables,
    DeleteOldFiles
}