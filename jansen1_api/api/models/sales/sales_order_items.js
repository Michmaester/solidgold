const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class SalesOrderItems extends Model {

  static get tableName() {
    return 'sales_order_items';
  }

  static get relationMappings() {
      const Product = require('../products/products')

      return {
          product: {
              relation: Model.HasOneRelation,
              modelClass: Product,
              join: {
                  from: 'sales_order_items.product_id',
                  to: 'products.product_id'
              }
          }
      }
  }
}

module.exports = SalesOrderItems;