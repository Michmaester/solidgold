const PurchaseOrder = require('../models/purchase/purchase_orders')
const SalesTransactions = require('../models/sales/sales_transactions')


const dayjs = require('dayjs')
const Helpers = require('../utils/helpers')

const _ = require('lodash')



const GetCustomerSummaryDetails = async (params) => {

    try {

        let query = SalesTransactions.query()
        query.where('customer_id', params.customer_id)
        query.where('branch_code', params.branch_code)

        const invoices = await query


        let paidInvoices = (await invoices).filter(item => {
            return item.payment_status === 'PAID'
        })

        let unpaidInvoices = (await invoices).filter(item => {
            return item.payment_status === 'UNPAID'
        })

        let partialpaidInvoices = (await invoices).filter(item => {
            return item.payment_status === 'PARTIAL'
        })


        // count all invoices
        totalInvoicesCount = invoices.length
        totalInvoicesAmount = parseFloat(Helpers.calculateTotals(invoices, 'total_amount_due'))

        totalInvoicesPaidCount = paidInvoices.length
        totalInvoicesPaidAmount = parseFloat(Helpers.calculateTotals(paidInvoices, 'total_amount_tendered'))

        totalInvoicesUnpaidCount = unpaidInvoices.length
        totalInvoicesUnpaidAmount = parseFloat(Helpers.calculateTotals(unpaidInvoices, 'balance_amount'))

        totalInvoicesPartialpaidCount = partialpaidInvoices.length
        totalInvoicesPartialpaidAmount = parseFloat(Helpers.calculateTotals(partialpaidInvoices, 'total_amount_tendered'))

        totalTenderedAmount = parseFloat(totalInvoicesPaidAmount) + parseFloat(totalInvoicesPartialpaidAmount)

        let resultObj = {
            totalInvoicesCount: totalInvoicesCount,
            totalInvoicesAmount: totalInvoicesAmount,

            totalInvoicesPaidCount: totalInvoicesPaidCount,
            totalInvoicesPaidAmount: totalInvoicesPaidAmount,

            totalInvoicesUnpaidCount: totalInvoicesUnpaidCount,
            totalInvoicesUnpaidAmount: totalInvoicesUnpaidAmount,

            totalInvoicesPartialpaidCount: totalInvoicesPartialpaidCount,
            totalInvoicesPartialpaidAmount: totalInvoicesPartialpaidAmount,

            totalTenderedAmount: totalTenderedAmount
        }

        return resultObj


    } catch (error) {
        console.log(error)
    }

}


const GetSupplierSummaryDetails = async (params) => {

    try {

        let query = PurchaseOrder.query()
        query.where('supplier_id', params.supplier_id)
        query.where('branch_code', params.branch_code)

        const purchases = await query


        let paidPurchases = purchases.filter(item => {
            return item.payment_status === 'Paid'
        })

        let unpaidPurchases = purchases.filter(item => {
            return item.payment_status === 'Unpaid'
        })

        let partialpaidPurchases = purchases.filter(item => {
            return item.payment_status === 'Partial'
        })

        /* 
        
            IMPORTANT CHECK THIS BECAUSE IT IS WRONG!!!!!!!!!!!
            
        */


        // count all purchases
        totalPurchasesCount = purchases.length
        totalPurchasesAmount = parseFloat(Helpers.calculateTotals(purchases, 'total_amount'))

        totalPurchasesPaidCount = paidPurchases.length
        totalPurchasesPaidAmount = parseFloat(Helpers.calculateTotals(purchases, 'total_amount'))

        totalPurchasesUnpaidCount = unpaidPurchases.length
        totalPurchasesUnpaidAmount = parseFloat(Helpers.calculateTotals(purchases, 'total_amount'))

        let partialsAmount = totalPurchasesAmount - totalPurchasesUnpaidAmount

        totalPurchasesPartialpaidCount = partialpaidPurchases.length
        totalPurchasesPartialpaidAmount = parseFloat(partialsAmount)

        totalPaidAmount = parseFloat(totalPurchasesPaidAmount) + parseFloat(totalPurchasesPartialpaidAmount)

        let resultObj = {
            totalPurchasesCount: totalPurchasesCount,
            totalPurchasesAmount: totalPurchasesAmount,

            totalPurchasesPaidCount: totalPurchasesPaidCount,
            totalPurchasesPaidAmount: totalPurchasesPaidAmount,

            totalPurchasesUnpaidCount: totalPurchasesUnpaidCount,
            totalPurchasesUnpaidAmount: totalPurchasesUnpaidAmount,

            totalPurchasesPartialpaidCount: totalPurchasesPartialpaidCount,
            totalPurchasesPartialpaidAmount: totalPurchasesPartialpaidAmount,

            totalPaidAmount: totalPaidAmount
        }

        return resultObj


    } catch (error) {
        console.log(error)
    }

}






module.exports = {
    GetCustomerSummaryDetails,
    GetSupplierSummaryDetails
}