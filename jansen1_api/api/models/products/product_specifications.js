const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class ProductSpecifications extends Model {

  static get tableName() {
    return 'product_specifications';
  }

}

module.exports = ProductSpecifications;