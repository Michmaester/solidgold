const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class JobOrderItems extends Model {

  static get tableName() {
    return 'job_order_items';
  }

  static get relationMappings() {
    const Product = require('../products/products')

    return {

        product: {
            relation: Model.HasOneRelation,
            modelClass: Product,
            filter: query => query.select('name','product_id'),
            join: {
                from: 'products.product_id',
                to: 'job_order_items.item_no'
            }
        }
        
    }
  }

}

module.exports = JobOrderItems;