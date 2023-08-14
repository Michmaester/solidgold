/* Requires */

/* Models */
const Employees = require('../models/employees')
const Fingerprints = require('../models/fingerprints')

/* Helpers */


/* Methods */

const GetFingerprints = async (params) => {

    try {

        return await Fingerprints.query().select(
            'id',
            'emp_id',
            'finger_idx',
            'data'

        )

    } catch (error) {
        console.log(error)
    }

}







/* Exposed the methods */
module.exports = {
    GetFingerprints
}