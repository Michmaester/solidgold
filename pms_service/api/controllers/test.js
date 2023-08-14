/* Requires */
const dayjs = require('dayjs')

/* Models */
const Employees = require('../models/employees')
const Fingerprints = require('../models/fingerprints')

const Dtrs = require('../models/daily_time_records')
const Dtls = require('../models/daily_time_logs')


/* Helpers */


/* Methods */

const GetTests = async (params) => {

    try {

        return []

    } catch (error) {
        console.log(error)
    }

}


const GetDtrs = async (params) => {

    try {

        let dtrs = await Dtrs.query()

        return dtrs

    } catch (error) {
        console.log(error)
    }

}

const GetDtls = async (params) => {

    try {

        let dtls = await Dtls.query()

        return dtls

    } catch (error) {
        console.log(error)
    }

}

const FixDtl = async (params) => {

    try {

        let id = params.id

        //get the dtl
        let dtl = await Dtls.query().where('id', id).first()

        //check the shift
        let dtl_date = dayjs(dtl.dtl_datetime).format('YYYY-MM-DD')
        let new_time = dayjs(dtl.dtl_datetime).format('HH:mm:ss')

        switch (dtl.shift_no) {
            case 1:
                new_time = '08:30:00'
                break;

            case 2:
                new_time = '12:00:00'
                break;

            case 3:
                new_time = '13:00:00'
                break;

            case 4:
                new_time = '17:30:00'
                break;

            default:
                break;
        }

        let new_dtl_datetime = dtl_date + ' ' + new_time

        let res = await Dtls.query().patch({
            dtl_datetime: new_dtl_datetime,
            fix_timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            fix_emp_id: 1
        }).where('id', id)

        console.log(res)

        return true

    } catch (error) {
        console.log(error)
    }

}


const FixMultipleDtl = async (params) => {

    try {

        let fixResults = []
        let ids = params.ids

        let dtls = await Dtls.query().whereIn('id', ids)

        for (let idx = 0; idx < dtls.length; idx++) {
            let dtl = dtls[idx]

            //check the shift
            let dtl_date = dayjs(dtl.dtl_datetime).format('YYYY-MM-DD')
            let new_time = dayjs(dtl.dtl_datetime).format('HH:mm:ss')

            switch (dtl.shift_no) {
                case 1:
                    new_time = '08:30:00'
                    break;

                case 2:
                    new_time = '12:00:00'
                    break;

                case 3:
                    new_time = '13:00:00'
                    break;

                case 4:
                    new_time = '17:30:00'
                    break;

                default:
                    break;
            }

            let new_dtl_datetime = dtl_date + ' ' + new_time

            let res = await Dtls.query().patch({
                dtl_datetime: new_dtl_datetime,
                fix_timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                fix_emp_id: 1
            }).where('id', dtl.id)


            fixResults.push({
                id: dtl.id,
                isFix: res === 1 ? true : false
            })


        }

        return fixResults



        // for (let idx = 0; idx < ids.length; idx++) {

        //     let id = ids[idx]

        //     //get the dtl
        //     let dtl = await Dtls.query().where('id', id).first()

        //     //check the shift
        //     let dtl_date = dayjs(dtl.dtl_datetime).format('YYYY-MM-DD')
        //     let new_time = dayjs(dtl.dtl_datetime).format('HH:mm:ss')

        //     switch (dtl.shift_no) {
        //         case 1:
        //             new_time = '08:30:00'
        //             break;

        //         case 2:
        //             new_time = '12:00:00'
        //             break;

        //         case 3:
        //             new_time = '13:00:00'
        //             break;

        //         case 4:
        //             new_time = '17:30:00'
        //             break;

        //         default:
        //             break;
        //     }

        //     let new_dtl_datetime = dtl_date + ' ' + new_time

        //     let res = await Dtls.query().patch({
        //         dtl_datetime: new_dtl_datetime,
        //         fix_timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        //         fix_emp_id: 1
        //     }).where('id', id)
        // }



        // console.log(res)

        // return true

    } catch (error) {
        console.log(error)
    }

}




/* Exposed the methods */
module.exports = {
    GetTests,
    GetDtrs,
    GetDtls,

    FixDtl,
    FixMultipleDtl
}