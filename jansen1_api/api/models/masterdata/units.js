const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class Units extends Model {

  static get tableName() {
    return 'md_units';
  }
}

module.exports = Units;