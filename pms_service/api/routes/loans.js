const express = require('express');
const router = express.Router();

const LoansController = require('../controllers/loans')



router.get('/', async (req, res, next) => {

    try {

        //let employees = await EmployeeController.GetEmployees()

        res.status(200).json({
            status: 'okay',
            data: 'test loans'
        })

    } catch (error) {
        next(error)
    }

})


module.exports = router;