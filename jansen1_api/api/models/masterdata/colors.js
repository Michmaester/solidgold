const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class Colors extends Model {

  static get tableName() {
    return 'md_colors';
  }
}

module.exports = Colors;