const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class Terms extends Model {

  static get tableName() {
    return 'md_terms';
  }
}

module.exports = Terms;