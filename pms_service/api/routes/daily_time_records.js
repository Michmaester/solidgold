const express = require('express');
const router = express.Router();
const dayjs = require('dayjs')

const EmployeeController = require('../controllers/employees')


// test models
const Employees = require('../models/employees')
//const  = require('../models/employees')


router.get('/', async (req, res, next) => {

    try {

        // get all employees
        // get its dtrs + dtls
        // filter the dtrs with date
        // filter the employee

        let datas = []

        let results = await Employees.query().withGraphFetched('dtrs.[dtls]')
        //flatten it

        for (let idx = 0; idx < results.length; idx++) {

            let emp = results[idx]

            for (let j = 0; j < emp.dtrs.length; j++) {
                let dtr = emp.dtrs[j]


                let dtrObj = {
                    emp_id: emp.emp_id,
                    emp_full: emp.first_name + ' ' + emp.last_name,
                    dtr_id: dtr.dtr_id,
                    dtr_date: dayjs(dtr.dtr_datetime).format('YYYY-MM-DD'),
                    dtr_datetime: dtr.dtr_datetime
                }

                // we know there will be 4 dtl



                if (dtr.dtls.length > 0) {

                    // let dtl1 = dtr.dtls.find(x => { return x.shift_no == 1 }).map(item => { return { id: item.id, dtl_datetime: item.dtl_datetime } })

                    // if (dtl1 == null) {
                    //     dtl1 = {
                    //         id: null,
                    //         dtl_datetime: null
                    //     }
                    // }

                    dtrObj['in1'] = process(dtr, 1)

                    dtrObj['out1'] = process(dtr, 2)

                    dtrObj['in2'] = process(dtr, 3)

                    dtrObj['out2'] = process(dtr, 4)
                }


                //claculate the totl working hours here

                let duration1 = 0
                let duration2 = 0

                if (dtrObj.in1 && dtrObj.out1) {

                    let d1 = dayjs(dtrObj.in1.dtl_datetime)
                    let d2 = dayjs(dtrObj.out1.dtl_datetime)

                    let diff = d2.diff(d1, 'hour', true)
                    if (isNaN(diff)) {
                        diff = 0
                    }
                    duration1 = diff
                }

                if (dtrObj.in2 && dtrObj.out2) {
                    let d1 = dayjs(dtrObj.in2.dtl_datetime)
                    let d2 = dayjs(dtrObj.out2.dtl_datetime)

                    let diff = d2.diff(d1, 'hour', true)

                    if (isNaN(diff)) {
                        diff = 0
                    }
                    duration2 = diff
                }




                let totalWorkHours = duration1 + duration2

                dtrObj['total_working_hours'] = totalWorkHours


                datas.push(dtrObj)

            }

        }






        res.status(200).json({
            status: 'okay',
            data: datas
        })

    } catch (error) {
        next(error)
    }

})


function process(dtr, shift_no) {
    let dtl = {
        id: null,
        emp_id: dtr.emp_id,
        dtl_datetime: null,
        dtl_time: 'n/a',
        dtr_id: dtr.dtr_id,
        dtr_datetime: dtr.dtr_datetime,
        shift_no: shift_no,
        branch_code: dtr.branch_code,
        dtlEmpty: true
    }

    let res = dtr.dtls.find(x => { return x.shift_no == shift_no })

    if (res) {
        dtl = {
            id: res.id,
            emp_id: dtr.emp_id,
            dtl_datetime: res.dtl_datetime,
            dtl_time: dayjs(res.dtl_datetime).format('HH:mm:ss'),
            dtr_id: dtr.dtr_id,
            dtr_datetime: dtr.dtr_datetime,
            shift_no: shift_no,
            branch_code: dtr.branch_code,
            dtlEmpty: false
        }
    }

    return dtl
}

module.exports = router;