const { Model } = require('objection');
const knex = require('../../../configs/knex')
const dayjs = require('dayjs');

Model.knex(knex)

class SalesOrders extends Model {

  static get tableName() {
    return 'sales_orders';
  }

  get dateOrder() {
    return dayjs(this.order_date).format('MMM-DD-YYYY HH:mm:ss')
  }

  $formatJson(obj) {
    obj = super.$formatJson(obj);
    obj.dateOrder = this.dateOrder;
    return obj;
  }

  static get relationMappings() {
      const SalesOrderItems = require('./sales_order_items')
      const User = require('../users')
      
      return {
          order_items: {
              relation: Model.HasManyRelation,
              modelClass: SalesOrderItems,
              // filter: query => query.select('messages'),
              join: {
                  from: 'sales_orders.order_no',
                  to: 'sales_order_items.order_no'
              }
          },

          user: {
              relation: Model.HasOneRelation,
              modelClass: User,
              filter: query => query.select('username'),
              join: {
                  from: 'sales_orders.user_id',
                  to: 'users.user_id'
              }
          }
      }
  }
}

module.exports = SalesOrders;