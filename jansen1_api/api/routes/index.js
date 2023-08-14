
const sales = {

    sales_orders: require('./sales/sales_orders'),
    sales_order_items: require('./sales/sales_order_items'),
    sales_transactions: require('./sales/sales_transactions'),
    sales_transaction_items: require('./sales/sales_transaction_items'),
    sales_documents: require('./sales/sales_documents'),
    sales_deliveries: require('./sales/sales_deliveries'),
    sales_returns: require('./sales/sales_returns'),
    invoice_stubs: require('./sales/invoice_stubs'),

}

const purchase = {
    purchase_orders: require('./purchase/purchase_orders'),
    purchase_order_items: require('./purchase/purchase_order_items'),
    purchase_order_item_deliveries: require('./purchase/purchase_order_item_deliveries')

}


const product = {
    products: require('./product/products'),
    product_identities: require('./product/product_identities'),
    product_inventories: require('./product/product_inventories'),
    product_prices: require('./product/product_prices'),
    product_specifications: require('./product/product_specifications'),
    product_suppliers: require('./product/product_suppliers')
}

const inventory = {}



const partners = {
    customers: require('./partners/customers'),
    suppliers: require('./partners/suppliers')
}


const payment = {
    payment_tenders: require('./payment/payment_tenders'),
    payment_tenders_card: require('./payment/payment_tenders_card'),
    payment_tenders_cash: require('./payment/payment_tenders_cash'),
    payment_tenders_charge: require('./payment/payment_tenders_charge'),
    payment_tenders_cheque: require('./payment/payment_tenders_cheque'),
    payment_tenders_giftcheque: require('./payment/payment_tenders_giftcheque'),
    payment_purchase_orders: require('./payment/payment_purchase_orders')
}


const stocks = {
    stock_transfers: require('./stocks/stock_transfers'),
    stock_transfer_items: require('./stocks/stock_transfer_items'),
    stocks: require('./stocks/stocks'),
    stock_ins: require('./stocks/stock_ins'),
    stock_outs: require('./stocks/stock_outs'),
}

const cashier = {
    cashier: require('./cashier/cashier'),
    daily_transactions: require('./cashier/cashier_daily_transactions'),
    daily_closing_items: require('./cashier/cashier_daily_closing_items')
}


const masterdata = {

    brands: require('./masterdata/brands'),
    categories: require('./masterdata/categories'),
    colors: require('./masterdata/colors'),
    types: require('./masterdata/types'),
    terms: require('./masterdata/terms'),
    units: require('./masterdata/units'),
    banks: require('./masterdata/banks'),
    branches: require('./masterdata/branches'),
    division_refs: require('./masterdata/division_refs'),
    couriers: require('./masterdata/couriers'),

}


const pms = {
    biometric_infos : require('./pms/biometric_infos')
}


// testing model transactions
// const testing = {
//     test_users: require('./test_users'),
//     test_messages: require('./test_messages')
// }

const dashboard = require('./dashboard')
const job_orders = require('./job_orders')
const users = require('./users')
const auth = require('./auth')
const pdfgen = require('./pdf_generator')

const reports = require('./reports')
const role_permissions = require('./role_permissions')

const printdoc = require('./printdoc')

// Added 20210817 to support product image
const upload = require('./upload')


module.exports = {
    sales,
    purchase,
    product,
    inventory,
    reports,
    partners,
    masterdata,
    stocks,
    payment,
    job_orders,
    users,
    auth,
    cashier,
    pdfgen,
    role_permissions,
    dashboard,
    printdoc,
    pms,
    upload
}