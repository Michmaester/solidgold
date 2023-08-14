const SettingsReferences = require('../models/settings_references')

const dayjs = require('dayjs');


const Helpers = require('./helpers')

// const AccountsPayable = require('../models/acccounts_payables');
// const AccountsReceivable = require('../models/accounts_receivable');
// const Customer = require('../models/partners/customers');
// const Supplier = require('../models/partners/suppliers');

const SalesTransaction = require('../models/sales/sales_transactions')



async function GetCustomerStats(trx, data) {

    //data obj {}
    /* 
        customer_id

        invoice
            - count receivables base on terms
            - total the receivables
        deliveries
        payments
    */


    //let customer = await Customer.query().where('customer_id', data.customer_id).first()

    let invoiceQuery = SalesTransaction.query()
        .withGraphFetched('[delivery]')
        .where('customer_id', data.customer_id)

    if (data.branch_code) {
        invoiceQuery.where('branch_code', data.branch_code)
    }

    let invoiceResults = await invoiceQuery

    invTotalCounts = invoiceResults.length
    invTotalAmount = Helpers.calculateTotals(invoiceResults, 'total_amount_due')


    invPaids = invoiceResults.filter(item => { return item.payment_status === 'PAID' })
    invUnpaids = invoiceResults.filter(item => { return item.payment_status === 'UNPAID' })
    invPartials = invoiceResults.filter(item => { return item.payment_status === 'PARTIAL' })

    invPaidsCounts = invPaids.length
    invPaidsTotalAmount = Helpers.calculateTotals(invPaids, 'total_amount_due')

    invUnpaidsCounts = invUnpaids.length
    invUnpaidsTotalAmount = Helpers.calculateTotals(invUnpaids, 'total_amount_due')

    invPartialsCounts = invUnpaids.length
    invPartialsTotalAmount = Helpers.calculateTotals(invPartials, 'total_amount_due')

    totalReceivables = invUnpaidsTotalAmount + invPartialsTotalAmount


    invDeliveries = invoiceResults.map(item => { return item.delivery }).filter(x => x !== null)

    // Based on invoice we can count the totals
    // Helpers.calculateTotals(invoiceResults,'')

    let sampletest = {
        inv_total_counts: invTotalCounts,
        inv_totals: invTotalAmount,

        inv_paids: invPaids,
        inv_unpaids: invUnpaids,
        inv_partials: invPartials,

        inv_paids_counts: invPaidsCounts,
        inv_paids_totals: invPaidsTotalAmount,

        inv_unpaids_counts: invUnpaidsCounts,
        inv_unpaids_totals: invUnpaidsTotalAmount,

        inv_partials_counts: invPartialsCounts,
        inv_partials_totals: invPartialsTotalAmount,

        total_receivables: totalReceivables,
        deliveries: invDeliveries,
    }


    return sampletest





    // let query = Customer.query().withGraphFetched('[sales_trans]')
    //             .where('customer_id',data.customer_id)














    let items = data.items
    let type = data.type

    try {

        //iterate over the items and check it against the stock table
        for (let index = 0; index < items.length; index++) {

            var new_qty = 0

            const stock = await Stocks.query(trx).where('product_id', items[index].product_id).where('branch_code', data.branch_code).first()
            if (stock.po_qty === null) {
                stock.po_qty = 0
            }

            if (type === 'po_requested') {
                //add the qty
                new_qty = parseInt(stock.po_qty) + parseInt(items[index].qty)
            }

            if (type === 'po_received') {
                //subtract the qty
                new_qty = parseInt(stock.po_qty) - parseInt(items[index].qty)
            }

            if (type === 'po_items_deleted') {
                //subtract the qty
                new_qty = parseInt(stock.po_qty) - parseInt(items[index].qty)
            }

            // workaround for negative
            if (new_qty < 0) {
                new_qty = 0
            }

            if (new_qty === 0) new_qty = null

            // update here
            await Stocks.query(trx).patch({ po_qty: new_qty }).where('stock_id', stock.stock_id)

        }

    } catch (error) {

    }


}




module.exports = {
    GetCustomerStats
}