const express = require('express');
const router = express.Router();

const dayjs = require('dayjs');
const authenticateJWT = require('../../middlewares/authenticateJWT')

const PurhcaseOrders = require('../../models/purchase/purchase_orders')

const Generator = require('../../utils/reference_generator')
const Suppliers = require('../../models/partners/suppliers')
const Helpers = require('../../utils/helpers')

router.get('/', async (req, res, next) => {

    try {

        const params = req.query

        let query = Suppliers.query().withGraphFetched('[attachments]')
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


router.get('/all_suppliers', async (req, res, next) => {

    try {

        const params = req.query

        let query = Suppliers.query().withGraphFetched('[attachments]')
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


router.get('/supplier/:supplier_id', async (req, res, next) => {

    try {

        let supplier_id = req.params.supplier_id


        const results = await Suppliers.query()
            .withGraphFetched('[attachments]')
            .where('supplier_id', supplier_id)


        res.status(200).json({
            status: 'ok',
            total_counts: results.length,
            data: results
        })

    } catch (error) {
        next(error)
    }

})

router.get('/pos/:supplier_id', async (req, res, next) => {

    try {
        const supplier_id = req.params.supplier_id
        const branch_code = req.headers.xbranchcode

        const results = await PurhcaseOrders.query()
            .where('supplier_id', supplier_id)
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



router.post('/', authenticateJWT, async (req, res, next) => {

    try {

        await Suppliers.transaction(async trx => {

            const payload = req.body

            //generate suplier id
            const newSupplierId = await Generator.GenerateReference(trx, 'supplier')

            payload.supplier_id = newSupplierId


            let status = null
            if (payload.bool_status) {
                status = 'Active'
            } else {
                status = 'Inactive'
            }


            //console.log(status)

            // explicit insert
            const supplier = await Suppliers.query(trx).insert({
                supplier_id: payload.supplier_id,
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



            await Generator.UpdateRunningValue(trx, 'supplier', newSupplierId)

            res.status(200).json({
                status: 'ok',
                message: 'Supplier successfully created.',
                data: supplier
            })
        });

    } catch (error) {
        next(error)
    }

})


//update supplier
router.put('/', authenticateJWT, async (req, res, next) => {

    try {

        await Suppliers.transaction(async trx => {

            const payload = req.body

            let status = null
            if (payload.bool_status) {
                status = 'Active'
            } else {
                status = 'Inactive'
            }

            // explicit insert
            const supplier = await Suppliers.query(trx)
                .patch({
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
                .where('supplier_id', payload.supplier_id)

            res.status(200).json({
                status: 'ok',
                message: 'Supplier successfully updated.',
                data: supplier
            })
        });

    } catch (error) {
        next(error)
    }

})

module.exports = router;