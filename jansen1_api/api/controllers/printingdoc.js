const PurchaseOrder = require('../models/purchase/purchase_orders')
const StockTransfer = require('../models/stocks/stock_transfers')
const Stocks = require('../models/stocks/stocks')
const StockIns = require('../models/stocks/stock_ins')
const StockOuts = require('../models/stocks/stock_outs')

const SalesTransactions = require('../models/sales/sales_transactions')
const SalesDelivery = require('../models/sales/sales_deliveries')
const SalesReturns = require('../models/sales/sales_returns')

const Customer = require('../models/partners/customers')
const PaymentPurchaseOrder = require('../models/payment/payment_purchase_orders')

const CreditMemo = require('../models/credit_memos')

const dayjs = require('dayjs')
const Helpers = require('../utils/helpers')

const _ = require('lodash')
const e = require('express')
const ChequeVouchers = require('../models/payment/cheque_vouchers')
const Suppliers = require('../models/partners/suppliers')



const GetForPrintListOfFilteredSalesTransactions = async (params) => {

    try {

        const branch_code = params.branch_code

        let query = SalesTransactions.query().withGraphFetched('[trans_items.[product.[brand]],customer,user,delivery]')
        query = Helpers.queryFilters(params, query)
        query.where('branch_code', branch_code)

        const result = await query

        const doc_meta = {
            docName: 'Sales Transactions',
            generatedDate: dayjs().format('MMM-DD-YYYY HH:mm:ss'),
            branch_code: branch_code,
            masterItemProps: [],
            listProp: null,
            isSingleResult: false,
            fields: [
                { field: 'invoice_no', label: 'Invoice No', isTotal: false },
                { field: 'dateTransaction', label: 'Trans. Date', isTotal: false },
                { field: 'customer.name', label: 'Customer', isTotal: false },
                { field: 'transaction_type', label: 'Type', isTotal: false },
                { field: 'total_amount_due', label: 'Total Amount', isTotal: true, isAmount: true },
                { field: 'total_amount_tendered', label: 'Total Tendered', isTotal: true, isAmount: true },
            ],
            isFooterVisible: true,
            footerItems: [
                { field: null, label: 'Received by', isBlankLine: true },
                { field: null, label: 'Approved by', isBlankLine: true }
            ]
        }

        return {
            result: result,
            docMeta: doc_meta
        }

    } catch (error) {
        console.log(error)
    }

}


const GetForPrintSalesDelivery = async (params) => {

    try {

        const branch_code = params.branch_code

        const result = await SalesDelivery.query()
            .where(params.ref_field, params.ref_no)
            .withGraphFetched('sales_trans.[customer,trans_items.[product.[brand,unit]]]')
            .first()

        const mappedResultItems = result.sales_trans.trans_items.map(item => {
            return {
                product_code: item.product.product_code,
                product_name: item.product.name,
                product_description: item.product.description,
                brandname: item.product.brand.brandname,
                item_unit: item.product.unit.item_unit,
                qty: item.qty,
                delivered_qty: item.delivered_qty,
                price_per_unit: item.price_per_unit,
            }
        })

        let resultObj = {
            dr_no: result.dr_no,
            branch_code: result.branch_code,
            status: result.status,
            customer: result.sales_trans.customer.name,
            date_requested: result.dateDeliveryRequested,
            items: mappedResultItems
        }


        const doc_meta = {
            docName: 'Sales Delivery',
            generatedDate: dayjs().format('MMM-DD-YYYY HH:mm:ss'),
            branch_code: branch_code,
            masterItemProps: [
                { field: 'dr_no', label: 'PO Number' },
                { field: 'branch_code', label: 'Branch' },
                { field: 'status', label: 'Status' },
                { field: 'customer', label: 'Customer' },
                { field: 'date_requested', label: 'Requested Date' },
            ],
            listProp: 'items',
            isSingleResult: true,
            fields: [
                { field: 'product_code', label: 'Code', isTotal: false, isAmount: false },
                { field: 'product_name', label: 'Product', isTotal: false, isAmount: false },
                { field: 'product_description', label: 'Desc', isTotal: false, isAmount: false },
                { field: 'brandname', label: 'Brand', isTotal: false, isAmount: false },
                { field: 'item_unit', label: 'Unit', isTotal: false, isAmount: false },
                { field: 'qty', label: 'Ordered Qty.', isTotal: true, isAmount: false },
                { field: 'delivered_qty', label: 'Delivered Qty', isTotal: true, isAmount: false },
                { field: 'price_per_unit', label: 'Price/Unit', isTotal: true, isAmount: true }
            ],
            isFooterVisible: true,
            footerItems: [
                { field: null, label: 'Received by', isBlankLine: true },
                { field: null, label: 'Approved by', isBlankLine: true }
            ]
        }

        return {
            result: resultObj,
            docMeta: doc_meta
        }

    } catch (error) {
        console.log(error)
    }

}


const GetForPrintSalesReturn = async (params) => {

    try {

        const branch_code = params.branch_code

        const result = await SalesReturns.query()
            .where(params.ref_field, params.ref_no)
            .withGraphFetched('[items.product.[brand,unit],customer]')
            .first()

        const doc_meta = {
            docName: 'Sales Return/Exchange',
            generatedDate: dayjs().format('MMM-DD-YYYY HH:mm:ss'),
            branch_code: branch_code,
            masterItemProps: [
                { field: 'sales_return_code', label: 'Sales Return No.' },
                { field: 'invoice_no', label: 'Invoice No' },
                { field: 'return_date', label: 'Return Date' },
                { field: 'customer_name', label: 'Customer' },
                { field: 'cash_tend', label: 'Cash Tend' },
                { field: 'status', label: 'Status' }
            ],
            listProp: 'items',
            isSingleResult: true,
            fields: [
                { field: 'product.product_code', label: 'Code', isTotal: false, isAmount: false },
                { field: 'product.name', label: 'Product', isTotal: false, isAmount: false },
                { field: 'product.description', label: 'Desc', isTotal: false, isAmount: false },
                { field: 'product.brand.brandname', label: 'Brand', isTotal: false, isAmount: false },
                { field: 'product.unit.item_unit', label: 'Unit', isTotal: false, isAmount: false },
                { field: 'quantity', label: 'Quantity', isTotal: true, isAmount: false },
                { field: 'price_per_unit', label: 'Price/Unit', isTotal: true, isAmount: true },
                { field: 'is_replace', label: 'Exchange', isYesNo: true }
            ],
            isFooterVisible: true,
            footerItems: [
                { field: null, label: 'Received by', isBlankLine: true },
                { field: null, label: 'Approved by', isBlankLine: true }
            ]
        }

        return {
            result: result,
            docMeta: doc_meta
        }

    } catch (error) {
        console.log(error)
    }

}


const GetForPrintSalesPayment = async (params) => {

    try {

        const branch_code = params.branch_code

        const result = await SalesTransactions.query()
            .where(params.ref_field, params.ref_no)
            .withGraphFetched('[customer,user,payment_tender.[payment_cash,payment_card,payment_charge,payment_cheque,payment_giftcheque]]')
            .first()

        // mapped the result

        let mappedPaymentCards = result.payment_tender.payment_card.map(item => {
            return {
                type: 'Card',
                amount: item.amount,
                paytrans_date: dayjs(item.paytrans_date).format('MMMM DD, YYYY HH:mm')
            }
        }).filter(x => x !== null)

        let mappedPaymentCash = result.payment_tender.payment_cash.map(item => {
            return {
                type: 'Cash',
                amount: item.amount,
                paytrans_date: dayjs(item.paytrans_date).format('MMMM DD, YYYY HH:mm')
            }
        }).filter(x => x !== null)

        let mappedPaymentCharge = result.payment_tender.payment_charge.map(item => {
            return {
                type: 'Charge',
                amount: - item.amount,
                paytrans_date: dayjs(item.paytrans_date).format('MMMM DD, YYYY HH:mm')
            }
        }).filter(x => x !== null)

        let mappedPaymentCheque = result.payment_tender.payment_cheque.map(item => {
            return {
                type: 'Cheque',
                amount: item.amount,
                paytrans_date: dayjs(item.paytrans_date).format('MMMM DD, YYYY HH:mm')
            }
        }).filter(x => x !== null)

        let mappedPaymentGiftCheque = result.payment_tender.payment_giftcheque.map(item => {
            return {
                type: 'Gift Cheque',
                amount: item.amount,
                paytrans_date: dayjs(item.paytrans_date).format('MMMM DD, YYYY HH:mm')
            }
        }).filter(x => x !== null)


        let mergePayments = [
            ...mappedPaymentCards,
            ...mappedPaymentCash,
            ...mappedPaymentCharge,
            ...mappedPaymentCheque,
            ...mappedPaymentGiftCheque
        ]

        //order it using paytans_date

        let payments = _.sortBy(mergePayments, ['paytrans_date'], ['asc'])


        let resultObj = {
            invoice_no: result.invoice_no,
            customer: result.customer.name,
            date: result.dateTransaction,
            amount_due: result.total_amount_due,
            amount_paid: result.total_amount_tendered,
            balance: result.balance_amount,
            status: result.payment_status,
            pay_items: payments
        }


        const doc_meta = {
            docName: 'Sales Payment',
            generatedDate: dayjs().format('MMM-DD-YYYY HH:mm:ss'),
            branch_code: branch_code,
            masterItemProps: [
                { field: 'invoice_no', label: 'Invoice No' },
                { field: 'customer', label: 'Customer' },
                { field: 'date', label: 'Date' },
                { field: 'amount_due', label: 'Amount Due' },
                { field: 'amount_paid', label: 'Amount Paid' },
                { field: 'balance', label: 'Balance' },
                { field: 'status', label: 'Status' },
            ],
            listProp: 'pay_items',
            isSingleResult: true,
            fields: [
                { field: 'type', label: 'Type', isTotal: false, isAmount: false },
                { field: 'amount', label: 'Amount', isTotal: false, isAmount: true },
                { field: 'paytrans_date', label: 'Payment Date', isTotal: false, isAmount: false },
            ],
            isFooterVisible: true,
            footerItems: [
                { field: null, label: 'Received by', isBlankLine: true },
                { field: null, label: 'Approved by', isBlankLine: true }
            ]
        }

        return {
            result: resultObj,
            docMeta: doc_meta
        }

    } catch (error) {
        console.log(error)
    }

}


const GetForPrintPurchaseOrder = async (params) => {

    try {

        const branch_code = params.branch_code

        const result = await PurchaseOrder.query()
            .where(params.ref_field, params.ref_no)
            .withGraphFetched('[po_items.[product.[brand,unit]],supplier]')
            .first()

        //manipulate
        const resultData = {
            po_number: result.po_number,
            po_type: result.po_type,
            branch_code: result.branch_code,
            status: result.status,
            supplier: result.supplier.name,
            payment_status: result.payment_status,
            date_created: result.date_created,
            po_items: []
        }

        const mappedResultItems = result.po_items.map(item => {
            let actual_price = 0

            if (item.quotation_price && item.quotation_price > 0) {
                actual_price = item.quotation_price
            } else {
                actual_price = item.actual_price
            }

            let product_code = null
            let product_name = null
            let product_description = null
            let brand = null
            let unit = null

            if (resultData.po_type !== 'non-trade') {
                product_code = item.product.product_code
                product_name = item.product.name
                product_description = item.product.description
                brand = item.product.brand.brandname
                unit = item.product.unit.item_unit
            }

            return {
                product_code: product_code,
                product_name: product_name,
                product_description: product_description,
                brand: brand,
                unit: unit,
                qty: item.qty,
                actual_price: actual_price,
                total_item_amount: item.total_item_amount,
                nt_item: item.nt_item,
                nt_item_description: item.nt_item_description,
            }
        })

        resultData.po_items = mappedResultItems

        let fields = []
        if (resultData.po_type === 'non-trade') {
            fields = [
                { field: 'nt_item', label: 'Item' },
                { field: 'nt_item_description', label: 'Description' },
                { field: 'qty', label: 'Ordered Qty.' },
                { field: 'actual_price', label: 'Cost' },
                { field: 'total_item_amount', label: 'Total Item Cost', isTotal: true, isAmount: true }
            ]
        } else {
            fields = [
                { field: 'product_code', label: 'Code', isTotal: false, isAmount: false },
                { field: 'product_name', label: 'Product', isTotal: false, isAmount: false },
                { field: 'product_description', label: 'Desc', isTotal: false, isAmount: false },
                { field: 'brand', label: 'Brand', isTotal: false, isAmount: false },
                { field: 'unit', label: 'Unit', isTotal: false, isAmount: false },
                { field: 'qty', label: 'Ordered Qty.', isTotal: false, isAmount: false },
                { field: 'actual_price', label: 'Cost', isTotal: false, isAmount: true },
                { field: 'total_item_amount', label: 'Total Item Cost', isTotal: true, isAmount: true }
            ]
        }


        const doc_meta = {
            docName: 'Purchase Order',
            generatedDate: dayjs().format('MMM-DD-YYYY HH:mm:ss'),
            branch_code: branch_code,
            masterItemProps: [
                { field: 'supplier', label: 'Supplier' },
                { field: 'po_number', label: 'PO Number' },
                { field: 'date_created', label: 'PO Date' },
            ],
            listProp: 'po_items',
            isSingleResult: true,
            fields: fields,
            isFooterVisible: true,
            footerItems: [
                { field: null, label: 'Prepared by', isBlankLine: true },
                { field: null, label: 'Approved by', isBlankLine: true }
            ]
        }

        return {
            result: resultData,
            docMeta: doc_meta
        }

    } catch (error) {
        console.log(error)
    }

}

const GetForPrintStockTransfer = async (params) => {

    try {

        let isAlreadyPrinted = false

        const branch_code = params.branch_code

        let result = await StockTransfer.query()
            .where(params.ref_field, params.ref_no)
            .withGraphFetched('[items.product.[brand,unit]]')
            .first()

        //check wether it was printed or not
        if (result.printed === 1) {
            result = []
            isAlreadyPrinted = true
        } else {
            await StockTransfer.query().patch({
                printed: 1,
                last_printed: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            })
                .where(params.ref_field, params.ref_no)
        }

        //if not then query details and display
        //if printed then give empty value plus status



        let doc_meta = {
            docName: 'Stock Transfer',
            generatedDate: dayjs().format('MMM-DD-YYYY HH:mm:ss'),
            branch_code: branch_code,
            masterItemProps: [
                { field: 'stock_transfer_no', label: 'Stock Transfer No.' },
                { field: 'requesting_branch_code', label: 'Requesting Branch' },
                { field: 'fulfilling_branch_code', label: 'Fulfilling Branch' },
                { field: 'status', label: 'Status' },
                { field: 'date_requested', label: 'Date Requested' },
                { field: 'remarks', label: 'Remarks' },
            ],
            listProp: 'items',
            isSingleResult: true,
            fields: [
                { field: 'product.product_code', label: 'Code', isTotal: false },
                { field: 'product.name', label: 'Product', isTotal: false },
                { field: 'product.description', label: 'Desc', isTotal: false },
                { field: 'product.brand.brandname', label: 'Brand', isTotal: false },
                { field: 'product.unit.item_unit', label: 'Unit', isTotal: false },
                { field: 'requested_qty', label: 'Req. Qty.', isTotal: false },
                { field: 'fulfilled_qty', label: 'Fulfilled Qty', isTotal: false },
            ],
            isFooterVisible: true,
            footerItems: [
                { field: null, label: 'Received by', isBlankLine: true },
                { field: null, label: 'Approved by', isBlankLine: true }
            ],
            isStockTransferAlreadyPrinted: isAlreadyPrinted
        }

        return {
            result: result,
            docMeta: doc_meta
        }

    } catch (error) {
        console.log(error)
    }

}


const GetForPrintListOfFilteredStocks = async (params) => {

    try {

        const branch_code = params.branch_code

        let query = Stocks.query()
            .joinRelated('product')
            .joinRelated('brand')
            .joinRelated('unit')
            .select(
                'stocks.*',
                'product.name as product_name',
                'product.description as product_description',
                'product.product_code',
                'product.category_ref_id',
                'brand.brandname',
                'unit.*'
            )

        query.where('stocks.branch_code', branch_code)
        query = Helpers.queryFilters(params, query)

        const result = await query

        const doc_meta = {
            docName: 'Stocks',
            generatedDate: dayjs().format('MMM-DD-YYYY HH:mm:ss'),
            branch_code: branch_code,
            masterItemProps: [],
            listProp: null,
            isSingleResult: false,
            fields: [
                { field: 'product_code', label: 'Code', isTotal: false },
                { field: 'product_name', label: 'Product', isTotal: false },
                { field: 'product_description', label: 'Desc', isTotal: false },
                { field: 'brandname', label: 'Brand', isTotal: false },
                { field: 'item_unit', label: 'Unit', isTotal: false },
                { field: 'onhand_qty', label: 'On-hand Qty.', isTotal: false },
                { field: 'last_qty', label: 'Last Qty', isTotal: false },
                { field: 'date_onhand_qty', label: 'Date Onhand', isTotal: false },
                { field: 'date_last_qty', label: 'Date Last', isTotal: false },
            ],
            isFooterVisible: true,
            footerItems: [
                { field: null, label: 'Received by', isBlankLine: true },
                { field: null, label: 'Approved by', isBlankLine: true }
            ]
        }

        return {
            result: result,
            docMeta: doc_meta
        }

    } catch (error) {
        console.log(error)
    }

}

const GetForPrintListOfFilteredStockIns = async (params) => {

    try {

        const branch_code = params.branch_code

        let query = StockIns.query()
            .joinRelated('product')
            .joinRelated('brand')
            .joinRelated('unit')
            .select(
                'stock_ins.*',
                'product.name as product_name',
                'product.description as product_description',
                'product.product_code',
                'product.category_ref_id',
                'brand.brandname',
                'unit.*'
            )

        query.where('stock_ins.branch_code', branch_code)
        query = Helpers.queryFilters(params, query)

        const result = await query

        const doc_meta = {
            docName: 'Stock Ins',
            generatedDate: dayjs().format('MMM-DD-YYYY HH:mm:ss'),
            branch_code: branch_code,
            masterItemProps: [],
            listProp: null,
            isSingleResult: false,
            fields: [
                { field: 'product_code', label: 'Code', isTotal: false },
                { field: 'product_name', label: 'Product', isTotal: false },
                { field: 'product_description', label: 'Desc', isTotal: false },
                { field: 'brandname', label: 'Brand', isTotal: false },
                { field: 'item_unit', label: 'Unit', isTotal: false },
                { field: 'qty', label: 'In Qty.', isTotal: false },
                { field: 'qty_instock', label: 'Instock Qty', isTotal: false },
                { field: 'ref_field_value', label: 'Reference', isTotal: false },
                { field: 'dateStockin', label: 'Date StockIn', isTotal: false },
            ],
            isFooterVisible: true,
            footerItems: [
                { field: null, label: 'Received by', isBlankLine: true },
                { field: null, label: 'Approved by', isBlankLine: true }
            ]
        }

        return {
            result: result,
            docMeta: doc_meta
        }

    } catch (error) {
        console.log(error)
    }

}

const GetForPrintListOfFilteredStockOuts = async (params) => {

    try {

        const branch_code = params.branch_code

        let query = StockOuts.query()
            .joinRelated('product')
            .joinRelated('brand')
            .joinRelated('unit')
            .select(
                'stock_outs.*',
                'product.name as product_name',
                'product.description as product_description',
                'product.product_code',
                'product.category_ref_id',
                'brand.brandname',
                'unit.*'
            )

        query.where('stock_outs.branch_code', branch_code)
        query = Helpers.queryFilters(params, query)

        const result = await query

        const doc_meta = {
            docName: 'Stock Outs',
            generatedDate: dayjs().format('MMM-DD-YYYY HH:mm:ss'),
            branch_code: branch_code,
            masterItemProps: [],
            listProp: null,
            isSingleResult: false,
            fields: [
                { field: 'product_code', label: 'Code', isTotal: false },
                { field: 'product_name', label: 'Product', isTotal: false },
                { field: 'product_description', label: 'Desc', isTotal: false },
                { field: 'brandname', label: 'Brand', isTotal: false },
                { field: 'item_unit', label: 'Unit', isTotal: false },
                { field: 'qty', label: 'Out Qty.', isTotal: false },
                { field: 'qty_instock', label: 'Instock Qty', isTotal: false },
                { field: 'ref_field_value', label: 'Reference', isTotal: false },
                { field: 'dateStockout', label: 'Date StockOut', isTotal: false },
            ],
            isFooterVisible: true,
            footerItems: [
                { field: null, label: 'Received by', isBlankLine: true },
                { field: null, label: 'Approved by', isBlankLine: true }
            ]
        }

        return {
            result: result,
            docMeta: doc_meta
        }

    } catch (error) {
        console.log(error)
    }

}



const GetForPrintStatementofAccountCustomer = async (params) => {

    try {

        const branch_code = params.branch_code


        //get customer invoices that are not paid and partialy paid

        const customer = await Customer.query().where('customer_id', params.ref_no).first()

        //get the customer sales returns
        const salesReturns = await SalesReturns.query()
            .where('customer_id', params.ref_no)
            .where('branch_code', branch_code)
            .where('credit_amount', '!=', 'null')
            .where('credit_balance', '>', '0')

        let salesReturnsTotals = Helpers.calculateTotals(salesReturns, 'credit_balance')

        // revise to support selected invoices only
        const invoices = await SalesTransactions.query()
            .whereIn('invoice_no', params.items)


        // =================================================
        // invoice = 100,000.00 -----> total amount due
        // amount due = 60,000.00 ----> total amount due - amount paid
        // credited = 40,000.00 ---> total amount paid
        // discount 0.00 - discount
        // amount paid = 40,000.00 - amount paid
        // blance = 60,000.00 = invoice amount - credited
        // =================================================

        //manipulate it
        const result = invoices.map(item => {
            return {
                transaction_date: item.transaction_date,
                invoice_no: item.invoice_no,
                invoice_amount: item.total_amount_due,
                total_amount_due: (item.total_amount_due - item.total_amount_tendered).toFixed(2),
                credited_amount: item.total_amount_tendered,
                total_discounted_amount: item.total_discounted_amount,
                total_amount_paid: item.total_amount_tendered,
                balance_amount: (item.total_amount_due - item.total_amount_tendered).toFixed(2)
            }
        })

        let invoicesBalanceTotals = Helpers.calculateTotals(result, 'balance_amount')

        // get the actual remaining balance which is deducted already by the sales_returns
        let actualRemainingBalance = parseFloat(invoicesBalanceTotals) - parseFloat(salesReturnsTotals)

        // added 20210621 - notify that an open invoice is existing
        let openInvoicesInReturns = []
        if (salesReturns.length > 0) {
            //check
            for (let idx = 0; idx < salesReturns.length; idx++) {
                let exist = result.find(item => { return item.invoice_no === salesReturns[idx].invoice_no })
                if (exist) {
                    openInvoicesInReturns.push(exist.invoice_no)
                }
            }
        }

        let notifyOpenInvoice = false
        if (openInvoicesInReturns.length > 0) {
            notifyOpenInvoice = true
        }

        // test
        //notifyOpenInvoice = true



        let otherDatas = {
            sales_returns: salesReturns,
            sales_returns_totals: salesReturnsTotals,
            actual_remaining_balance: actualRemainingBalance,
            notifyOpenInvoice: notifyOpenInvoice
        }

        const doc_meta = {
            docName: 'Statement of Accounts',
            generatedDate: dayjs().format('MMM-DD-YYYY'),
            branch_code: branch_code,
            masterItemProps: [],
            listProp: null,
            isSingleResult: false,
            customer: customer,
            fields: [
                { field: 'transaction_date', label: 'Date', isTotal: false },
                { field: 'invoice_no', label: 'Invoice No.', isTotal: false },
                { field: 'invoice_amount', label: 'Invoice Amount', isTotal: false },
                { field: 'total_amount_due', label: 'Total Amount Due', isTotal: true },
                { field: 'credited_amount', label: 'Credited Amount', isTotal: false },
                { field: 'total_discounted_amount', label: 'Total Discounted Amount', isTotal: true },
                { field: 'total_amount_paid', label: 'Total Amount Paid', isTotal: true },
                { field: 'balance_amount', label: 'Balance', isTotal: true },
            ],
            isFooterVisible: true,
            footerItems: [
                { field: null, label: 'Received by', isBlankLine: true },
            ],
            otherDatas: otherDatas
        }

        return {
            result: result,
            docMeta: doc_meta
        }

    } catch (error) {
        console.log(error)
    }

}



const GetForPrintChequeVoucher = async (params) => {

    try {

        const branch_code = params.branch_code



        // get the details of the cheque voucher
        const cVoucher = await ChequeVouchers.query().withGraphFetched('[supplier]')
            .where('cheque_voucher_no', params.ref_no).first()

        let po_details = await PaymentPurchaseOrder.query().withGraphFetched('[po]')
            .where('cheque_voucher_no', params.ref_no)


        let mappedPoDetails = po_details.map(item => {
            return {
                po_number: item.po_number,
                paid_amount: item.payment_amount,
                payment_status: item.po.payment_status
            }
        })



        // const result = await PaymentPurchaseOrder.query().withGraphFetched('[supplier]')
        //     .where('id', params.ref_no).first()



        const doc_meta = {
            docName: 'Cheque Payment Voucher',
            generatedDate: dayjs().format('MMM-DD-YYYY HH:mm:ss'),
            branch_code: branch_code,
            masterItemProps: [
            ],
            listProp: null,
            isSingleResult: true,
            fields: [
            ],
        }

        let resultObj = {
            voucher: cVoucher,
            po_details: mappedPoDetails
        }

        return {
            result: resultObj,
            docMeta: doc_meta
        }

    } catch (error) {
        console.log(error)
    }

}






// added 20210502
const GetForPrintStatemnentofAccountSupplier = async (params) => {

    try {

        const branch_code = params.branch_code


        //get supplier pos that are not paid and partialy paid

        const supplier = await Suppliers.query().where('supplier_id', params.ref_no).first()

        // //get the customer sales returns
        // const salesReturns = await SalesReturns.query()
        //     .where('customer_id', params.ref_no)
        //     .where('branch_code', branch_code)
        //     .where('credit_amount', '!=', 'null')
        //     .where('credit_balance', '>', '0')

        // let salesReturnsTotals = Helpers.calculateTotals(salesReturns, 'credit_balance')

        // revise to support selected invoices only
        const pos = await PurchaseOrder.query()
            .whereIn('po_number', params.items)


        // =================================================
        // invoice = 100,000.00 -----> total amount due
        // amount due = 60,000.00 ----> total amount due - amount paid
        // credited = 40,000.00 ---> total amount paid
        // discount 0.00 - discount
        // amount paid = 40,000.00 - amount paid
        // blance = 60,000.00 = invoice amount - credited
        // =================================================

        //manipulate it
        const result = pos.map(item => {
            return {
                date_created: item.date_created,
                po_number: item.po_number,
                receive_total_amount: item.receive_total_amount,
                paid_amount: item.paid_amount,
                balance_amount: item.balance_amount


                // invoice_amount: item.total_amount_due,
                // total_amount_due: (item.total_amount_due - item.total_amount_tendered).toFixed(2),
                // credited_amount: item.total_amount_tendered,
                // total_discounted_amount: item.total_discounted_amount,
                // total_amount_paid: item.total_amount_tendered,
                // balance_amount: (item.total_amount_due - item.total_amount_tendered).toFixed(2)
            }
        })

        let posBalanceTotals = Helpers.calculateTotals(result, 'balance_amount')

        // get the actual remaining balance which is deducted already by the sales_returns
        //let actualRemainingBalance = parseFloat(invoicesBalanceTotals) - parseFloat(salesReturnsTotals)


        let otherDatas = {
            pos_balance_totals: posBalanceTotals
        }

        const doc_meta = {
            docName: 'Accounts Payable',
            generatedDate: dayjs().format('MMM-DD-YYYY'),
            branch_code: branch_code,
            masterItemProps: [],
            listProp: null,
            isSingleResult: false,
            supplier: supplier,
            fields: [
                { field: 'date_created', label: 'Date', isTotal: false },
                { field: 'po_number', label: 'Purchase Order No.', isTotal: false },
                { field: 'receive_total_amount', label: 'PO Amount', isTotal: true, isAmount: true },
                { field: 'paid_amount', label: 'Amount Paid', isTotal: true, isAmount: true },
                { field: 'balance_amount', label: 'Balance', isTotal: true, isAmount: true },
            ],
            isFooterVisible: true,
            footerItems: [
                { field: null, label: 'Prepared by', isBlankLine: true },
                { field: null, label: 'Approved by', isBlankLine: true },
            ],
            otherDatas: otherDatas
        }

        return {
            result: result,
            docMeta: doc_meta
        }

    } catch (error) {
        console.log(error)
    }

}

module.exports = {
    GetForPrintListOfFilteredSalesTransactions,
    GetForPrintSalesDelivery,
    GetForPrintSalesReturn,
    GetForPrintSalesPayment,

    GetForPrintPurchaseOrder,
    GetForPrintStockTransfer,
    GetForPrintListOfFilteredStocks,
    GetForPrintListOfFilteredStockIns,
    GetForPrintListOfFilteredStockOuts,

    GetForPrintStatementofAccountCustomer,
    GetForPrintChequeVoucher,
    GetForPrintStatemnentofAccountSupplier
}