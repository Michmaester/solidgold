const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class Couriers extends Model {

  static get tableName() {
    return 'md_couriers';
  }
}

module.exports = Couriers;