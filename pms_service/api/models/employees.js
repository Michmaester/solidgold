const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class Employees extends Model {

  static get tableName() {
    return 'employees';
  }

  static get relationMappings() {
    const EmployeeDetails = require('./employee_details')
    const EmployeeDependents = require('./employee_dependents')
    //payslips
    //infos
    const EmploymentInfo = require('./employment_infos')

    //loans
    const Loans = require('./loans')

    //dtrs
    const Dtrs = require('./daily_time_records')



    return {

      empDetails: {
        relation: Model.HasOneRelation,
        modelClass: EmployeeDetails,
        join: {
          from: 'employees.emp_id',
          to: 'employee_details.emp_id'
        }
      },

      empInfo: {
        relation: Model.HasOneRelation,
        modelClass: EmploymentInfo,
        join: {
          from: 'employees.emp_id',
          to: 'employment_infos.emp_id'
        }
      },

      empDependents: {
        relation: Model.HasManyRelation,
        modelClass: EmployeeDependents,
        join: {
          from: 'employees.emp_id',
          to: 'employee_dependents.emp_id'
        }
      },

      loans: {
        relation: Model.HasManyRelation,
        modelClass: Loans,
        join: {
          from: 'employees.emp_id',
          to: 'loans.emp_id'
        }
      },

      dtrs: {
        relation: Model.HasManyRelation,
        modelClass: Dtrs,
        join: {
          from: 'employees.emp_id',
          to: 'daily_time_records.emp_id'
        }
      }

    }
  }

}

module.exports = Employees;