const express = require('express');
const router = express.Router();
const dayjs = require('dayjs')
const _ = require('lodash')

//const FingerprintController = require('../controllers/fingerprints')

const DailyTimeLogs = require('../models/daily_time_logs')

const Employees = require('../models/employees')

const Formatter = require('../helpers/formatter')


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
                    //dtr_datetime: dtr.dtr_datetime
                }

                // we know there will be 4 dtl

                let in1 = null
                let out1 = null
                let in2 = null
                let out2 = null

                if (dtr.dtls.length > 0) {

                    in1 = process(dtr, 1)
                    out1 = process(dtr, 2)
                    in2 = process(dtr, 3)
                    out2 = process(dtr, 4)
                }


                //claculate the totl working hours here

                let duration1 = 0
                let duration2 = 0

                if (in1 && out1) {

                    let d1 = dayjs(in1.dtl_datetime)
                    let d2 = dayjs(out1.dtl_datetime)

                    let diff = d2.diff(d1, 'hour', true)
                    if (isNaN(diff)) {
                        diff = 0
                    }
                    duration1 = diff
                }

                if (in2 && out2) {
                    let d1 = dayjs(in2.dtl_datetime)
                    let d2 = dayjs(out2.dtl_datetime)

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


        //flatten this result
        let payrollDatas = []
        //iterate on employees
        let employees = _.uniqBy(results, 'emp_id')

        for (let idx = 0; idx < employees.length; idx++) {

            let emp = employees[idx]

            let empData = datas.filter(x => { return x.emp_id === emp.emp_id })

            let arrDtrs = []
            if (empData.length > 0) {
                arrDtrs = empData.map(x => {
                    return {
                        dtr_id: x.dtr_id,
                        dtr_date: x.dtr_date,
                        total_working_hours: x.total_working_hours
                    }
                })
            }


            let empDataObj = {
                emp_id: emp.emp_id,
                emp_full: emp.first_name + ' ' + emp.last_name,
                total_working_hours: parseFloat(Formatter.calculateTotals(empData, 'total_working_hours')),
                basic_per_hour: null,
                gross_pay: null,
                loans: null,
                sss: null,
                phic: null,
                hdmf: null,
                net_pay: null,
                dtrs: arrDtrs
            }

            payrollDatas.push(empDataObj)

        }







        res.status(200).json({
            status: 'okay',
            data: payrollDatas
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