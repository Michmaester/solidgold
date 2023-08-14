const express = require('express');
const router = express.Router();
const dayjs = require('dayjs')

//const FingerprintController = require('../controllers/fingerprints')

const DailyTimeLogs = require('../models/daily_time_logs')


router.get('/', async (req, res, next) => {

    try {

        //let fingerprints = await FingerprintController.GetFingerprints()

        res.status(200).json({
            status: 'okay',
            data: 'testing'
        })

    } catch (error) {
        next(error)
    }

})

router.post('/fix_dtls', async (req, res, next) => {

    try {

        let dtls = req.body.dtls
        let fixResults = []

        console.log(dtls)

        for (let idx = 0; idx < dtls.length; idx++) {

            let dtl = dtls[idx]

            //check if fix or create
            if (dtl.id) {
                //fix

                let newTime = checkShiftNo(dtl.shift_no)
                let dtlDate = dayjs(dtl.dtr_datetime).format('YYYY-MM-DD')

                let fixRes = await DailyTimeLogs.query().patch({
                    dtl_datetime: dtlDate + ' ' + newTime
                })
                    .where('id', dtl.id)
                    .where('dtr_id', dtl.dtr_id)

                fixResults.push(fixRes)


            } else {
                //create
                //fixResults.push('create')

                let newTime = checkShiftNo(dtl.shift_no)
                let dtlDate = dayjs(dtl.dtr_datetime).format('YYYY-MM-DD')

                console.log(newTime)
                console.log(dtlDate)

                let createRes = await DailyTimeLogs.query().insert({
                    dtr_id: dtl.dtr_id,
                    emp_id: dtl.emp_id,
                    dtl_datetime: dtlDate + ' ' + newTime,
                    shift_no: dtl.shift_no,
                    branch_code: dtl.branch_code
                })

                fixResults.push(createRes)
            }


        }

        res.status(200).json({
            status: 'okay',
            data: fixResults
        })

    } catch (error) {
        next(error)
    }

})


function checkShiftNo(shift_no) {
    let time = '08:30:00'
    switch (shift_no) {
        case 1:
            time = '08:30:00'
            break;

        case 2:
            time = '12:00:00'
            break;

        case 3:
            time = '13:00:00'
            break;
        case 4:
            time = '17:30:00'
            break;

        default:
            break;
    }

    return time
}


module.exports = router;