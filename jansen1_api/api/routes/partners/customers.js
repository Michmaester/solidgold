const express = require('express');
const router = express.Router();

const dayjs = require('dayjs');
const authenticateJWT = require('../../middlewares/authenticateJWT')

const Generator = require('../../utils/reference_generator')
const Customers = require('../../models/partners/customers')
const SalesTransactions = require('../../models/sales/sales_transactions')
const SalesReturns = require('../../models/sales/sales_returns')
const CreditMemo = require('../../models/credit_memos')

const Helpers = require('../../utils/helpers')


router.get('/', async (req, res, next) => {

    try {

        const params = req.query

        let query = Customers.query().withGraphFetched('[attachments]')
        query = Helpers.queryFilters(params, query)
        const query_results = await query

        res.status(200).json({
            status: 'ok',
            data: query_results
        })

    } catch (error) {
        next(error)
    }

})

router.get('/all_customers', async (req, res, next) => {

    try {

        const params = req.query

        let query = Customers.query().withGraphFetched('[attachments]')
        query = Helpers.queryFilters(params, query)
        const query_results = await query

        res.status(200).json({
            status: 'ok',
            data: query_results
        })

    } catch (error) {
        next(error)
    }

})


router.get('/customer/:customer_id', async (req, res, next) => {

    try {

        let customer_id = req.params.customer_id

        const results = await Customers.query()
            .withGraphFetched('[attachments]')
            .where('customer_id', customer_id)

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})


router.get('/invoices/:customer_id', async (req, res, next) => {

    try {
        const customer_id = req.params.customer_id
        const branch_code = req.headers.xbranchcode

        const results = await SalesTransactions.query()
            .where('customer_id', customer_id)
            .where('payment_status', '!=', 'Paid')
            .where('branch_code', branch_code)

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})

router.get('/salesinvoices/:customer_id', async (req, res, next) => {

    try {
        const customer_id = req.params.customer_id
        const branch_code = req.headers.xbranchcode

        const results = await SalesTransactions.query()
            .where('customer_id', customer_id)
            .where('branch_code', branch_code)

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})



router.get('/sales_returns_credits/:customer_id', async (req, res, next) => {

    try {
        const customer_id = req.params.customer_id
        const branch_code = req.headers.xbranchcode

        const results = await SalesReturns.query()
            .where('customer_id', customer_id)
            .where('branch_code', branch_code)
            .where('credit_amount', '!=', 'null')
            .where('credit_balance', '>', 0)

        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})



router.post('/', authenticateJWT, async (req, res, next) => {

    try {

        await Customers.transaction(async trx => {

            const payload = req.body

            //generate customer_id
            const newCustomerId = await Generator.GenerateReference(trx, 'customer')

            payload.customer_id = newCustomerId

            let status = null
            if (payload.bool_status) {
                status = 'Active'
            } else {
                status = 'Inactive'
            }

            // explicit insert
            const customer = await Customers.query(trx).insert({
                customer_id: payload.customer_id,
                customer_ref: payload.customer_ref,
                name: payload.name,
                contact_person: payload.contact_person,
                address: payload.address,
                ship_to_address: payload.ship_to_address,
                bill_to_address: payload.bill_to_address,
                mobile1: payload.mobile1,
                mobile2: payload.mobile2,
                landline: payload.landline,
                email: payload.email,
                tin_number: payload.tin_number,
                sales_type: payload.sales_type,
                payment_terms: payload.payment_terms,
                notes: payload.notes,
                status: status,
                created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                created_by: req.user.user_id

            });

            await Generator.UpdateRunningValue(trx, 'customer', newCustomerId)

            res.status(200).json({
                status: 'ok',
                message: 'Customer successfully created.',
                data: customer
            })
        });

    } catch (error) {
        next(error)
    }

})


//update customer
router.put('/', authenticateJWT, async (req, res, next) => {

    try {

        await Customers.transaction(async trx => {

            const payload = req.body

            let status = null
            if (payload.bool_status) {
                status = 'Active'
            } else {
                status = 'Inactive'
            }

            // explicit insert
            const customer = await Customers.query(trx)
                .patch({
                    customer_ref: payload.customer_ref,
                    name: payload.name,
                    contact_person: payload.contact_person,
                    address: payload.address,
                    ship_to_address: payload.ship_to_address,
                    bill_to_address: payload.bill_to_address,
                    mobile1: payload.mobile1,
                    mobile2: payload.mobile2,
                    landline: payload.landline,
                    email: payload.email,
                    tin_number: payload.tin_number,
                    sales_type: payload.sales_type,
                    payment_terms: payload.payment_terms,
                    notes: payload.notes,
                    status: status,
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.user.user_id

                })
                .where('customer_id', payload.customer_id)


            res.status(200).json({
                status: 'ok',
                message: 'Customer successfully updated.',
                data: customer
            })
        });

    } catch (error) {
        next(error)
    }

})


module.exports = router;