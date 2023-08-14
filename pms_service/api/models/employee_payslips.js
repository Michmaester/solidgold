const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class EmployeePayslips extends Model {
  static get tableName() {
    return 'employee_payslips';
  }
}

module.exports = EmployeePayslips;