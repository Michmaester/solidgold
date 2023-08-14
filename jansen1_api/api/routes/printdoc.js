const express = require('express');
const router = express.Router();

const dayjs = require('dayjs');
const authenticateJWT = require('../middlewares/authenticateJWT')

const Generator = require('../utils/reference_generator')
const JobOrders = require('../models/joborders/job_orders')
const JobOrderItems = require('../models/joborders/job_order_items')
const Helpers = require('../utils/helpers')

const PrintingDocController = require('../controllers/printingdoc')

router.get('/', async (req, res, next) => {

    try {

        const params = req.query
        let query_results = null


        //base on the params we will choose on how to process it
        switch (params.type) {

            case 'List_Sales_Transactions':
                query_results = await PrintingDocController.GetForPrintListOfFilteredSalesTransactions(params)
                break;

            case 'Sales_Delivery':
                query_results = await PrintingDocController.GetForPrintSalesDelivery(params)
                break;

            case 'Sales_Return':
                query_results = await PrintingDocController.GetForPrintSalesReturn(params)
                break;

            case 'Sales_Payment':
                query_results = await PrintingDocController.GetForPrintSalesPayment(params)
                break;

            case 'PO':
                query_results = await PrintingDocController.GetForPrintPurchaseOrder(params)
                break;

            case 'Stock_Transfer':
                query_results = await PrintingDocController.GetForPrintStockTransfer(params)
                break;

            case 'List_Filtered_Stocks':
                query_results = await PrintingDocController.GetForPrintListOfFilteredStocks(params)
                break;

            case 'List_Filtered_StockIns':
                query_results = await PrintingDocController.GetForPrintListOfFilteredStockIns(params)
                break;

            case 'List_Filtered_StockOuts':
                query_results = await PrintingDocController.GetForPrintListOfFilteredStockOuts(params)
                break;



            case 'Account_Statement_Customer':
                query_results = await PrintingDocController.GetForPrintStatementofAccountCustomer(params)
                break;

            case 'Cheque_Voucher':
                query_results = await PrintingDocController.GetForPrintChequeVoucher(params)
                break;

            // added 20210502
            case 'Account_Statement_Supplier':
                query_results = await PrintingDocController.GetForPrintStatemnentofAccountSupplier(params)
                break;





            default:
                break;
        }


        res.status(200).json({
            status: 'ok',
            data: query_results
        })

    } catch (error) {
        next(error)
    }

})








module.exports = router;