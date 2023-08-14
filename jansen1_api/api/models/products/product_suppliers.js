const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class ProductSuppliers extends Model {

  static get tableName() {
    return 'product_suppliers';
  }

}

module.exports = ProductSuppliers;