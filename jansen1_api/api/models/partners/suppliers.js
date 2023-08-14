const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class Suppliers extends Model {

  static get tableName() {
    return 'suppliers';
  }

  static get relationMappings() {
      const Attachments = require('./attachments')

      return {
          attachments: {
              relation: Model.HasManyRelation,
              modelClass: Attachments,
              // filter: query => query.select('messages'),
              join: {
                  from: 'suppliers.supplier_id',
                  to: 'partner_attachments.partner_id'
              }
          },
      }
  }
}

module.exports = Suppliers;