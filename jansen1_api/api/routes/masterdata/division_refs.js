const express = require('express');
const router = express.Router();

const DivisionRefs = require('../../models/masterdata/division_refs')


router.get('/', async (req,res,next) => {

    try {

        const results = await DivisionRefs.query()

        res.status(200).json({
            status : 'ok',
            total_counts : results.length,
            data : results
        })

    } catch (error) {
        next(error)
    }

})


router.post('/', async (req,res,next) => {

    try {

        const payload = req.body

        const results = await DivisionRefs.query()
                            .insert(payload)

        res.status(200).json({
            status : 'ok',
            title : 'Successful',
            message : 'Successfully created a new division.',
            total_counts : results.length,
            data : results
        })

    } catch (error) {
        next(error)
    }

})


router.post('/update', async (req,res,next) => {

    try {

        const payload = req.body

        const results = await DivisionRefs.query()
                            .updateAndFetchById(payload.id, payload);

        res.status(200).json({
            status : 'ok',
            title : 'Successful',
            message : 'Successfully update a division.',
            total_counts : results.length,
            data : results
        })

    } catch (error) {
        next(error)
    }

})


module.exports = router;