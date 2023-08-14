const express = require('express')
const router = express.Router()

const { ref, raw } = require('objection');

const SettingsReferences = require('../../models/settings_references')
const SalesTransactions = require('../../models/sales/sales_transactions')
const Helpers = require('../../utils/helpers')


router.get('/passcode/:branch_code', async (req, res, next) => {
	try {
		const branch_code = req.params.branch_code

		const results = await SettingsReferences.query()
			.where('prefix', branch_code)
			.where('ref_name', 'cashier_passcode')
			.select('starting_value')
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



router.get('/get_cashier_total_netsales', async (req, res, next) => {

	try {

		const date = req.query.date
		const branch = req.query.branch

		const results = await SalesTransactions.query()
			.withGraphFetched('[payment_tender.[payment_cash,payment_card,payment_cheque,payment_charge]]')
			.where(raw('DATE(transaction_date)'), date)
			.where('branch_code', branch)



		// get the payment cheque/credit card/charge to be autofiulled on the closing form
		const pay_cash = results.map((item) => {
			return item.payment_tender.payment_cash
		})

		const pay_card = results.map((item) => {
			return item.payment_tender.payment_card
		})
		const pay_cheque = results.map((item) => {
			return item.payment_tender.payment_cheque
		})
		const pay_charge = results.map((item) => {
			return item.payment_tender.payment_charge
		})


		var mergedCash = [].concat.apply([], pay_cash);
		const cashTotals = parseFloat(Helpers.calculateTotals(mergedCash.filter(item => { return item.terminal === null }), 'amount'))

		var mergedCard = [].concat.apply([], pay_card);
		const cardTotals = parseFloat(Helpers.calculateTotals(mergedCard.filter(item => { return item.terminal === null }), 'amount'))

		var mergedCheque = [].concat.apply([], pay_cheque);
		const chequeTotals = parseFloat(Helpers.calculateTotals(mergedCheque.filter(item => { return item.terminal === null }), 'amount'))

		var mergedCharge = [].concat.apply([], pay_charge);
		const chargeTotals = parseFloat(Helpers.calculateTotals(mergedCharge.filter(item => { return item.terminal === null }), 'amount'))

		// salesTotals = cashTotals + cardTotals + chequeTotals + chargeTotals

		// let payments_totals = {
		//     cash: cashTotals,
		//     card: cardTotals,
		//     cheque: chequeTotals,
		//     charges: chargeTotals,
		//     salesTotals: salesTotals
		// }


		//sumup total amount due
		let obj = {
			count: results.length,
			totals: parseFloat(Helpers.calculateTotals(results, 'total_amount_due')),
			totals_card: cardTotals,
			totals_cheque: chequeTotals,
			totals_charges: chargeTotals
		}

		res.status(200).json({
			status: 'ok',
			data: obj
		})

	} catch (error) {
		next(error)
	}

})

module.exports = router
