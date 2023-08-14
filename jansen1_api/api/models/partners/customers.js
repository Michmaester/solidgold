const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class Customers extends Model {

  static get tableName() {
    return 'customers';
  }

  static get relationMappings() {
      const Attachments = require('./attachments')

      return {
          attachments: {
              relation: Model.HasManyRelation,
              modelClass: Attachments,
              // filter: query => query.select('messages'),
              join: {
                  from: 'customers.customer_id',
                  to: 'partner_attachments.partner_id'
              }
          },
      }
  }
}

module.exports = Customers;