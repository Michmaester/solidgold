const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class PurchaseOrderItems extends Model {

  static get tableName() {
    return 'purchase_order_items';
  }

  static get relationMappings() {
    const Product = require('../products/products')

    return {
        product: {
            relation: Model.HasOneRelation,
            modelClass: Product,
            // filter: query => query.select('messages'),
            join: {
                from: 'purchase_order_items.product_id',
                to: 'products.product_id'
            }
        },
        
    }
  }

 
}

module.exports = PurchaseOrderItems;