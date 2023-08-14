const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class DivisionRefs extends Model {

  static get tableName() {
    return 'md_division_refs';
  }
}

module.exports = DivisionRefs;