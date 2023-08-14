const express = require('express');
const router = express.Router();

const EmployeeController = require('../controllers/employees')



router.get('/', async (req, res, next) => {

    try {

        let employees = await EmployeeController.GetEmployees()

        res.status(200).json({
            status: 'okay',
            data: employees
        })

    } catch (error) {
        next(error)
    }

})


module.exports = router;