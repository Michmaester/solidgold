const express = require('express');
const router = express.Router();

const Categories = require('../../models/masterdata/categories')


router.get('/', async (req,res,next) => {

    try {

        const results = await Categories.query().withGraphFetched('[division]')

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

        const results = await Categories.query()
                            .insert(payload)

        res.status(200).json({
            status : 'ok',
            title : 'Successful',
            message : 'Successfully created a new category.',
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

        const results = await Categories.query()
                            .updateAndFetchById(payload.id, payload);

        res.status(200).json({
            status : 'ok',
            title : 'Successful',
            message : 'Successfully update a category.',
            total_counts : results.length,
            data : results
        })

    } catch (error) {
        next(error)
    }

})


module.exports = router;