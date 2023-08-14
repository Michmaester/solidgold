const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const AuthJWT = require('./api/middlewares/authenticateJWT')
// const morgan = require('morgan');
const app = express()


const routes = require('./api/routes')

// app.use(morgan('dev'));

//Loads the handlebars module
const handlebars = require('express-handlebars');

const TestDataController = require('./api/controllers/testdata')



const _ = require('lodash')


/* ======================================

	Express + Handlebar Configs

=======================================*/
app.use(cors())


// app.set('view engine', 'hbs');
// app.engine('hbs', handlebars(
// 	{
// 		layoutsDir: __dirname + '/views/layouts',
// 		extname: 'hbs',
// 		defaultLayout: 'planB',
// 		partialsDir: __dirname + '/views/partials/'
// 	}));


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//serve static files for pdf generation
app.use('/files', express.static('public'))
// app.use(AuthJWT)
/* ======================================

	Router configs

=======================================*/


app.use('/partner_customers', routes.partners.customers)
app.use('/partner_suppliers', routes.partners.suppliers)

app.use('/masterdata/brands', routes.masterdata.brands)
app.use('/masterdata/categories', routes.masterdata.categories)
app.use('/masterdata/colors', routes.masterdata.colors)
app.use('/masterdata/types', routes.masterdata.types)
app.use('/masterdata/terms', routes.masterdata.terms)
app.use('/masterdata/units', routes.masterdata.units)
app.use('/masterdata/branches', routes.masterdata.branches)
app.use('/masterdata/banks', routes.masterdata.banks)
app.use('/masterdata/division_refs', routes.masterdata.division_refs)
app.use('/masterdata/couriers', routes.masterdata.couriers)

app.use('/payments/payment_tenders', routes.payment.payment_tenders)
app.use('/payments/payment_tenders_cash', routes.payment.payment_tenders_cash)
app.use('/payments/payment_tenders_card', routes.payment.payment_tenders_card)
app.use('/payments/payment_tenders_charge', routes.payment.payment_tenders_charge)
app.use('/payments/payment_tenders_cheque', routes.payment.payment_tenders_cheque)
app.use('/payments/payment_tenders_giftcheque', routes.payment.payment_tenders_giftcheque)
app.use('/payments/payment_purchase_orders', routes.payment.payment_purchase_orders)

app.use('/stocks/stock_transfers', routes.stocks.stock_transfers)
app.use('/stocks/stock_transfer_items', routes.stocks.stock_transfer_items)
app.use('/stocks/stocks', routes.stocks.stocks)
app.use('/stocks/stock_ins', routes.stocks.stock_ins)
app.use('/stocks/stock_outs', routes.stocks.stock_outs)

app.use('/purchase/purchase_orders', routes.purchase.purchase_orders)
app.use('/purchase/purchase_order_items', routes.purchase.purchase_order_items)
app.use('/purchase/purchase_order_item_deliveries', routes.purchase.purchase_order_item_deliveries)

app.use('/sales/sales_orders', routes.sales.sales_orders)
app.use('/sales/sales_order_items', routes.sales.sales_order_items)
app.use('/sales/sales_transactions', routes.sales.sales_transactions)
app.use('/sales/sales_transaction_items', routes.sales.sales_transaction_items)
app.use('/sales/sales_documents', routes.sales.sales_documents)
app.use('/sales/sales_deliveries', routes.sales.sales_deliveries)
app.use('/sales/sales_returns', routes.sales.sales_returns)
app.use('/sales/invoice_stubs', routes.sales.invoice_stubs)


app.use('/products', routes.product.products)
app.use('/product/identities', routes.product.product_identities)
app.use('/product/inventories', routes.product.product_inventories)
app.use('/product/prices', routes.product.product_prices)
app.use('/product/specifications', routes.product.product_specifications)
app.use('/product/prod_suppliers', routes.product.product_suppliers)

app.use('/cashier/cashier', routes.cashier.cashier)
app.use('/cashier/daily_transactions', routes.cashier.daily_transactions)
app.use('/cashier/daily_closing_items', routes.cashier.daily_closing_items)


app.use('/reports', routes.reports)


app.use('/job_orders', routes.job_orders)
app.use('/users', routes.users)

app.use('/auth', routes.auth)
app.use('/pdfgen', routes.pdfgen)
app.use('/role_permissions', routes.role_permissions)
app.use('/dashboard', routes.dashboard)
app.use('/printdoc', routes.printdoc)



// Added 20210817 to support product image
app.use('/upload', routes.upload)


// PMS
app.use('/pms/biometric_infos', routes.pms.biometric_infos)
// other routes here for the pms




app.get('/generate_fake_datas', async (req, res, next) => {
	try {

		const results = await TestDataController.GenerateFakeDatas()

		res.status(200).json({
			status: 'ok',
			// data: results.results,
			// totals: results.results.total
		})
	} catch (error) {
		next(error)
	}
})

app.get('/test', async (req, res, next) => {
	try {

		res.status(200).json({
			status: 'ok',
			messaage: 'You have reached this endpoint. Server is working.'
		})
	} catch (error) {
		next(error)
	}
})






const SalesTransaction = require('./api/models/sales/sales_transactions')

app.get('/testreport', async (req, res, next) => {
	try {

		// query sales transactions
		const result = await SalesTransaction.query().withGraphFetched('[customer]')

		//get the unqiue customers
		const customers = _.uniqBy(result,x => x.customer_id).map(item => {
			return {
				customer_id : item.customer_id,
				name : item.customer.name,
				transactions : []
			}
		})


		let datas = []

		for (var i = 0; i < customers.length; i++) {

			let res = result.filter(item => {
				return item.customer_id === customers[i].customer_id
			})

			customers[i].transactions = res
			datas.push(customers[i])
		}

		





		//iterate on them and filter the results using the customer_id


		res.status(200).json({
			status: 'ok',
			data: datas
		})
	} catch (error) {
		next(error)
	}
})



// Error Handlers for the unspecified routes and other system wide errors

app.use((req, res, next) => {
	let error = new Error('Not Found')
	error.statusCode = 404
	next(error)
})

app.use((error, req, res, next) => {
	// res.status(error.status || 500);
	res.json({
		status: 'server_error',
		message: error.message,
	})
})



module.exports = app
