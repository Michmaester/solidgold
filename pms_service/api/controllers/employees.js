/* Requires */

/* Models */
const Employees = require('../models/employees')
const Fingerprints = require('../models/fingerprints')

/* Helpers */
const QueryHelper = require('../helpers/query')


/* Methods */

const GetEmployees = async (params) => {

    try {

        let query = Employees.query()
            .select(
                'id',
                'emp_id',
                'first_name',
                'middle_name',
                'last_name',
                'user_name',
                'password',
                'id_no',
                'status'
            )
            .withGraphFetched('[empDetails,empDependents,empInfo,loans]')

        query = QueryHelper.queryFilters(params, query)

        return await query.debug()

    } catch (error) {
        console.log(error)
    }

}

const GetEmployee = async (params) => {

    try {

        let emp_id = params.emp_id

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
            .where('emp_id', emp_id)
            .withGraphFetched('[empDetails,empDependents,dtrs.[dtls]]')
            .first()

    } catch (error) {
        console.log(error)
    }

}







/* Exposed the methods */
module.exports = {
    GetEmployees,
    GetEmployee
}