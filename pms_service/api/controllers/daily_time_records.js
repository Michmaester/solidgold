/* Requires */

/* Models */
const DailyTimeRecords = require('../models/daily_time_records')

/* Helpers */


/* Methods */

const GetDailyTimeRecords = async (params) => {

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
    GetDailyTimeRecords
}