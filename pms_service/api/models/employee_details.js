const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class EmployeeDetails extends Model {
  static get tableName() {
    return 'employee_details';
  }
}

module.exports = EmployeeDetails;