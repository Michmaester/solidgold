const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class EmployeeDependents extends Model {
  static get tableName() {
    return 'employee_dependents';
  }
}

module.exports = EmployeeDependents;