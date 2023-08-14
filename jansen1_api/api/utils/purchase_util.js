const SettingsReferences = require('../models/settings_references')

const dayjs = require('dayjs');

const Stocks = require('../models/stocks/stocks');
const StockTransfers = require('../models/stocks/stock_transfers');
const StockTransferItems = require('../models/stocks/stock_transfer_items');

const Products = require('../models/products/products');
const ProductPrice = require('../models/products/product_prices');
const ProductPriceHistory = require('../models/products/product_prices_history');

const PurchaseOrders = require('../models/purchase/purchase_orders')
const Generator = require('../utils/reference_generator')

const StocksUtil = require('../utils/stocks_util')

const _ = require('lodash')


async function UpdatePurchaseItemOnStocks(trx, data) {

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



async function PurchaseAutoTransferToBranch(trx, data) {



    try {
        let form_branch_code = data.from_branch_code
        let transfers = data.items
        let user = data.user

        //get the uniq branchcodes
        let branches = _.uniqBy(transfers, 'auto_transfer_to_branch').map(x => { return x.auto_transfer_to_branch })




        for (let index = 0; index < branches.length; index++) {

            let items = transfers.filter(item => { return item.auto_transfer_to_branch === branches[index] })

            //generate stx no.
            let newStockTransferNo = await Generator.GenerateReference(trx, 'stock_transfer')
            let stock_transfer_no = newStockTransferNo + Generator.RandomNumberGenerator()

            let stxObj = {
                stock_transfer_no: stock_transfer_no,
                stxItems: items
            }

            // do a stock transfer
            await StockTransfers.query(trx).insert({
                stock_transfer_no: stock_transfer_no,
                status: 'COMPLETED',
                requesting_branch_code: branches[index],
                fulfilling_branch_code: form_branch_code,
                date_requested: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                date_fulfilled: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                user_requesting: user,
                user_fulfilling: user,
                is_own_request: 1,
                type: 'AUTO',
                branch_code: form_branch_code,
            })


            for (let j = 0; j < items.length; j++) {

                await StockTransferItems.query(trx).insert({
                    stock_transfer_no: stock_transfer_no,
                    requested_product_id: items[j].product.product_id,
                    fulfilled_product_id: items[j].product.product_id,
                    requested_qty: items[j].autotransfer_quantity,
                    fulfilled_qty: items[j].autotransfer_quantity
                })



                let outData = {
                    item: {
                        stock_transfer_no: stock_transfer_no,
                        product_id: items[j].product.product_id
                    },
                    branch_code: form_branch_code,
                    user_id: user,
                    item_qty: items[j].autotransfer_quantity,
                    type: 'stock_transfer',
                    ref_field: 'stock_transfer_no'
                }

                await StocksUtil.ProcessStockOuts(trx, outData)




                let inData = {
                    item: {
                        stock_transfer_no: stock_transfer_no,
                        product_id: items[j].product.product_id
                    },
                    branch_code: items[j].auto_transfer_to_branch,
                    user_id: user,
                    item_qty: items[j].autotransfer_quantity,
                    type: 'stock_transfer',
                    ref_field: 'stock_transfer_no'
                }

                await StocksUtil.ProcessStockIns(trx, inData)
            }

            await Generator.UpdateRunningValue(trx, 'stock_transfer', newStockTransferNo)

        }

    } catch (error) {
        console.log(error)
    }


}



async function UpdateProductCostPrice(trx,data){


    try {
        let item = data

        let product_id = item.product_id
        let cost = item.cost

        //query the product price table
        // if the same, do not change
        // if not the same then do an averaging

        const product = await ProductPrice.query(trx).where('product_id',product_id).first()

        //compare
        if(cost == product.cost){
            //do nothing
        }else{

            //do averaging
            let new_cost = 0


            // if 0 then do not average
            if(product.cost > 0){
                new_cost = (parseFloat(product.cost) + parseFloat(cost)) / 2
            }else{
                new_cost = parseFloat(cost)
            }

            //update it
            await ProductPrice.query(trx).patch({
                cost : new_cost
            })
            .where('product_id',product_id)

            //insert to price history
            await ProductPriceHistory.query(trx).insert({
                product_id : product_id,
                cost : new_cost,
                retail : product.retail,
                wholesale: product.wholesale,
                created_at: dayjs().format('YYYY-MM-DD HH:mm:hh'),
                created_by : item.user

            })

        }

       

    } catch (error) {

    }
}




module.exports = {
    UpdatePurchaseItemOnStocks,
    PurchaseAutoTransferToBranch,
    UpdateProductCostPrice
}