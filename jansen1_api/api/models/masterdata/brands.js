const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class Brands extends Model {

  static get tableName() {
    return 'md_brands';
  }
}

module.exports = Brands;