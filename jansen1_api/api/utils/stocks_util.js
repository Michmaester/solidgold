const SettingsReferences = require('../models/settings_references')

const dayjs = require('dayjs');
const StockIns = require('../models/stocks/stock_ins');
const StockOuts = require('../models/stocks/stock_outs');
const Stocks = require('../models/stocks/stocks');
const Products = require('../models/products/products');


async function ProcessStockIns(trx, data) {

    try {
        // data = object
        // trx

        // get the product
        // insert stock-ins
        // calculate
        // update stocks

        const product = await Products.query(trx)
            .withGraphFetched('[stock,unit]')
            .where('product_id', data.item.product_id)
            .first()

        const stock = await Stocks.query(trx)
            .where('branch_code', data.branch_code)
            .where('product_id', product.product_id)
            .first()

        await StockIns.query(trx)
            .insert({
                type: data.type,
                ref_field: data.ref_field,
                ref_field_value: data.item[data.ref_field],
                product_id: product.product_id,
                qty: data.item_qty,
                qty_instock: stock.onhand_qty,
                unit: product.unit.item_unit,
                stockin_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                branch_code: data.branch_code,
                created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                created_by: data.user_id
            })



        const date_onhand_qty = dayjs().format('YYYY-MM-DD HH:mm:ss')
        const date_last_qty = stock.date_onhand_qty
        const last_qty = stock.onhand_qty

        const new_onhand_qty = parseInt(stock.onhand_qty) + parseInt(data.item_qty)

        await Stocks.query(trx).where('stock_id', stock.stock_id)
            .patch({
                onhand_qty: new_onhand_qty,
                date_onhand_qty: date_onhand_qty,
                last_qty: last_qty,
                date_last_qty: date_last_qty,
            })
    } catch (error) {
        console.log(error)
    }



}

async function ProcessStockOuts(trx, data) {

    try {
        // data = object
        // trx

        // get the product
        // insert stock-ins
        // calculate
        // update stocks

        const product = await Products.query(trx)
            .withGraphFetched('[stock,unit]')
            .where('product_id', data.item.product_id)
            .first()

        const stock = await Stocks.query(trx)
            .where('branch_code', data.branch_code)
            .where('product_id', product.product_id)
            .first()

        await StockOuts.query(trx)
            .insert({
                type: data.type,
                ref_field: data.ref_field,
                ref_field_value: data.item[data.ref_field],
                product_id: product.product_id,
                qty: data.item_qty,
                qty_instock: stock.onhand_qty,
                unit: product.unit.item_unit,
                stockout_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                branch_code: data.branch_code,
                created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                created_by: data.user_id
            })



        const date_onhand_qty = dayjs().format('YYYY-MM-DD HH:mm:ss')
        const date_last_qty = stock.date_onhand_qty
        const last_qty = stock.onhand_qty

        const new_onhand_qty = parseInt(stock.onhand_qty) - parseInt(data.item_qty)

        await Stocks.query(trx).where('stock_id', stock.stock_id)
            .patch({
                onhand_qty: new_onhand_qty,
                date_onhand_qty: date_onhand_qty,
                last_qty: last_qty,
                date_last_qty: date_last_qty,
            })
    } catch (error) {
        console.log(error)
    }



}


module.exports = {
    ProcessStockIns,
    ProcessStockOuts
}