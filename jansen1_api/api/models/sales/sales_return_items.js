const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class SalesReturnItems extends Model {

  static get tableName() {
    return 'sales_return_items';
  }

  static get relationMappings() {
    const Product = require('../products/products')

    return {
      product: {
        relation: Model.HasOneRelation,
        modelClass: Product,
        //filter: query => query.select('name'),
        join: {
          from: 'products.product_id',
          to: 'sales_return_items.product_id'
        }
      }
    }
  }
}

module.exports = SalesReturnItems;