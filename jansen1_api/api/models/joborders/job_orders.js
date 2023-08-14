const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class JobOrders extends Model {

  static get tableName() {
    return 'job_orders';
  }

  static get relationMappings() {
    const Customer = require('../partners/customers')
    const JobOrderItems = require('./job_order_items')

    return {

        customer: {
            relation: Model.HasOneRelation,
            modelClass: Customer,
            // filter: query => query.select('messages'),
            join: {
                from: 'job_orders.customer_id',
                to: 'customers.customer_id'
            }
        },

        items: {
            relation: Model.HasManyRelation,
            modelClass: JobOrderItems,
            // filter: query => query.select('messages'),
            join: {
                from: 'job_orders.job_order_no',
                to: 'job_order_items.job_order_no'
            }
        }
        
    }
  }

}

module.exports = JobOrders;