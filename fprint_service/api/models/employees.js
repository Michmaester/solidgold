const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class Employees extends Model {
  static get tableName() {
    return 'employees';
  }
}

module.exports = Employees;