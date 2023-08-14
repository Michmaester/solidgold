const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class RolesPermissions extends Model {

    static get tableName() {
        return 'auth_roles_permissions';
    }

    //   static get relationMappings() {
    //       const SalesReturnItems = require('./sales_return_items')
    //       const Customer = require('../partners/customers')

    //       return {
    //           items: {
    //               relation: Model.HasManyRelation,
    //               modelClass: SalesReturnItems,
    //               // filter: query => query.select('messages'),
    //               join: {
    //                   from: 'sales_returns.sales_return_code',
    //                   to: 'sales_return_items.sales_return_code'
    //               }
    //           },
    //           customer: {
    //               relation: Model.HasOneRelation,
    //               modelClass: Customer,
    //               // filter: query => query.select('messages'),
    //               join: {
    //                   from: 'customers.customer_id',
    //                   to: 'sales_returns.customer_id'
    //               }
    //           }
    //       }
    //   }
}

module.exports = RolesPermissions;