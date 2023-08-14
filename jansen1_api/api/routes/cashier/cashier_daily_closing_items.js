const express = require('express')
const router = express.Router()

const CashierDailyClosingItems = require('../../models/cashier/cashier_daily_closing_items')


router.get('/', async (req, res, next) => {
	try {
		const results = await CashierDailyClosingItems.query()

		res.status(200).json({
			status: 'ok',
			total_counts: results.length,
			data: results,
		})
	} catch (error) {
		next(error)
	}
})


module.exports = router
