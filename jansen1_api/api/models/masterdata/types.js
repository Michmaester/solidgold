const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class Types extends Model {

  static get tableName() {
    return 'md_types';
  }
}

module.exports = Types;