const express = require('express')
const router = express.Router()
const dayjs = require('dayjs')

const { ref, raw } = require('objection');

const CashierDailyTransactions = require('../../models/cashier/cashier_daily_transactions')
const CashierDailyClosingItems = require('../../models/cashier/cashier_daily_closing_items')


router.get('/', async (req, res, next) => {
	try {
		const results = await CashierDailyTransactions.query().withGraphFetched('closing_items')

		res.status(200).json({
			status: 'ok',
			total_counts: results.length,
			data: results,
		})
	} catch (error) {
		next(error)
	}
})

router.get('/:transaction_date/branch/:branch_code', async (req, res, next) => {
	try {
		const transaction_date = req.params.transaction_date
		const branch_code = req.params.branch_code

		const results = await CashierDailyTransactions.query()
			.where(raw('DATE(transaction_date)'), transaction_date)
			.where('branch_code', branch_code)
			.withGraphFetched('closing_items')
			.first()

		res.status(200).json({
			status: 'ok',
			total_counts: results.length,
			data: results,
		})
	} catch (error) {
		next(error)
	}
})

router.post('/', async (req, res, next) => {
	try {
		const payload = req.body.payload

		await CashierDailyTransactions.transaction(async (trx) => {
			const item = await CashierDailyTransactions.query(trx).insert({
				transaction_date: payload.transaction_date,
				initial_cash_amount: payload.initial_cash_amount,
				branch_code: payload.branch_code,
				opening_datetime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
			})

			res.status(200).json({
				status: 'ok',
				title: 'Successful',
				message: 'Successfully opened a cashier daily transaction.',
				data: item,
			})
		})
	} catch (error) {
		next(error)
	}
})

router.post('/day_closing', async (req, res, next) => {
	try {
		const payload = req.body.payload
		const closing_items = payload.closing_items


		await CashierDailyTransactions.transaction(async (trx) => {
			const item = await CashierDailyTransactions.query(trx)
				.patch({
					total_sales_collection: payload.total_sales_collection,
					total_net_accountability: payload.total_net_accountability,
					short_over_amount: payload.short_over_amount,
					daily_total_expense: payload.daily_total_expense,
					closing_datetime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
				})
				.where('id', payload.id)

			//insert vlosing items
			for (var i = closing_items.length - 1; i >= 0; i--) {
				await CashierDailyClosingItems.query(trx).insert({
					daily_trans_id: payload.id,
					paytype: closing_items[i].paytype,
					bills: closing_items[i].bills,
					cash_qty: closing_items[i].cash_qty,
					equiv: closing_items[i].equiv,
				})
			}

			res.status(200).json({
				status: 'ok',
				title: 'Successful',
				message: 'Successfully updated a new sales order items.',
				data: item,
			})
		})
	} catch (error) {
		next(error)
	}
})

module.exports = router
