const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class Loans extends Model {
  static get tableName() {
    return 'loans';
  }
}

module.exports = Loans;