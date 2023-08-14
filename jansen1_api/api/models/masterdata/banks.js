const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class Banks extends Model {

  static get tableName() {
    return 'md_banks';
  }
}

module.exports = Banks;