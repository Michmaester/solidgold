const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class StockTransfers extends Model {

  static get tableName() {
    return 'stock_transfers';
  }

  static get relationMappings() {
    const StockTransferItems = require('./stock_transfer_items')
    const User = require('../users')

    return {
      items: {
        relation: Model.HasManyRelation,
        modelClass: StockTransferItems,
        // filter: query => query.select('messages'),
        join: {
          from: 'stock_transfers.stock_transfer_no',
          to: 'stock_transfer_items.stock_transfer_no'
        }
      },

      user_req: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'stock_transfers.user_requesting',
          to: 'users.user_id'
        }
      },

      user_ful: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'stock_transfers.user_fulfilling',
          to: 'users.user_id'
        }
      }
    }
  }
}

module.exports = StockTransfers;