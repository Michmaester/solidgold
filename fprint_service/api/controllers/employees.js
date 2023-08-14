/* Requires */

/* Models */
const Employees = require('../models/employees')
const Fingerprints = require('../models/fingerprints')

/* Helpers */


/* Methods */

const GetEmployees = async (params) => {

    try {

        return await Employees.query().select(
            'id',
            'first_name',
            'middle_name',
            'last_name',
            'user_name',
            'password',
            'id_no',
            'status'
        )

    } catch (error) {
        console.log(error)
    }

}







/* Exposed the methods */
module.exports = {
    GetEmployees
}