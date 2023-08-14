const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class ProductInventories extends Model {

  static get tableName() {
    return 'product_inventories';
  }

}

module.exports = ProductInventories;