const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class StockTransferItems extends Model {

  static get tableName() {
    return 'stock_transfer_items';
  }

  static get relationMappings() {
      const Product = require('../products/products')
      
      return {
          product : {
              relation: Model.HasOneRelation,
              modelClass: Product,
              // filter: query => query.select('messages'),
              join: {
                  from: 'products.product_id',
                  to: 'stock_transfer_items.requested_product_id'
              }
          }
      }
  }
  
}

module.exports = StockTransferItems;