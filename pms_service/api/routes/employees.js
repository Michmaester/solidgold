const express = require('express');
const router = express.Router();

const EmployeeController = require('../controllers/employees')



router.get('/', async (req, res, next) => {

    try {

        let employees = await EmployeeController.GetEmployees(req.query)

        res.status(200).json({
            status: 'okay',
            data: employees
        })

    } catch (error) {
        next(error)
    }

})

router.get('/single/:emp_id', async (req, res, next) => {

    try {

        console.log(req.params)

        let params = {
            emp_id: req.params.emp_id
        }

        let employee = await EmployeeController.GetEmployee(params)

        res.status(200).json({
            status: 'okay',
            data: employee
        })

    } catch (error) {
        next(error)
    }

})


module.exports = router;