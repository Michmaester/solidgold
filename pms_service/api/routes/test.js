const express = require('express');
const router = express.Router();

const EmployeeController = require('../controllers/employees')

const TestController = require('../controllers/test')



router.get('/', async (req, res, next) => {

    try {

        let test = await TestController.GetTests();

        console.log(test)

        res.status(200).json({
            status: 'okay',
            data: 'testing'
        })

    } catch (error) {
        next(error)
    }

})

router.get('/get_dtrs', async (req, res, next) => {

    try {

        let dtrs = await TestController.GetDtrs();

        res.status(200).json({
            status: 'okay',
            data: dtrs
        })

    } catch (error) {
        next(error)
    }

})

router.get('/get_dtls', async (req, res, next) => {

    try {

        let dtls = await TestController.GetDtls();

        res.status(200).json({
            status: 'okay',
            data: dtls
        })

    } catch (error) {
        next(error)
    }

})



// get dtr with relationship dtls
// fix dtl for specifc dtr with dtr_id

router.get('/fix_dtl/:id', async (req, res, next) => {

    try {

        let result = await TestController.FixDtl({ id: req.params.id })

        //let dtls = await TestController.GetDtls();

        res.status(200).json({
            status: 'okay',
            data: result
        })

    } catch (error) {
        next(error)
    }

})

router.get('/fix_dtls', async (req, res, next) => {

    try {

        let result = await TestController.FixMultipleDtl({ ids: [1, 2, 3, 4, 5] })

        //let dtls = await TestController.GetDtls();

        res.status(200).json({
            status: 'okay',
            data: result
        })

    } catch (error) {
        next(error)
    }

})





module.exports = router;