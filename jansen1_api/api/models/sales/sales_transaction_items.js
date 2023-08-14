const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class SalesTransactionItems extends Model {

  static get tableName() {
    return 'sales_transaction_items';
  }

  static get relationMappings() {
      const Product = require('../products/products')

      return {
          product: {
              relation: Model.HasOneRelation,
              modelClass: Product,
              join: {
                  from: 'sales_transaction_items.product_id',
                  to: 'products.product_id'
              }
          }
      }
  }

}

module.exports = SalesTransactionItems;