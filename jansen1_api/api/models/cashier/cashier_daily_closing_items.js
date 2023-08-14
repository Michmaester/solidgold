const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class CashierDailyClosingItems extends Model {

  static get tableName() {
    return 'cashier_daily_closing_items';
  }

  // static get relationMappings() {
  //   const Product = require('../products/products')

  //   return {
  //       product: {
  //           relation: Model.HasOneRelation,
  //           modelClass: Product,
  //           // filter: query => query.select('messages'),
  //           join: {
  //               from: 'purchase_order_items.product_id',
  //               to: 'products.product_id'
  //           }
  //       },
        
  //   }
  // }

 
}

module.exports = CashierDailyClosingItems;