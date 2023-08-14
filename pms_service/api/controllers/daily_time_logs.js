/* Requires */

/* Models */
const DailyTimeLogs = require('../models/daily_time_logs')


/* Helpers */


/* Methods */

const GetDailyTimeLogs = async (params) => {

    try {

        // return await Fingerprints.query().select(
        //     'id',
        //     'emp_id',
        //     'finger_idx',
        //     'data'

        // )
        return true

    } catch (error) {
        console.log(error)
    }

}







/* Exposed the methods */
module.exports = {
    GetDailyTimeLogs
}