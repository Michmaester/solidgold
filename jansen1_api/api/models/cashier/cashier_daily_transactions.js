const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class CashierDailyTransactions extends Model {

  static get tableName() {
    return 'cashier_daily_transactions';
  }

  static get relationMappings() {
      const ClosingItems = require('./cashier_daily_closing_items')

      return {
          closing_items: {
              relation: Model.HasManyRelation,
              modelClass: ClosingItems,
              // filter: query => query.select('messages'),
              join: {
                  from: 'cashier_daily_transactions.id',
                  to: 'cashier_daily_closing_items.daily_trans_id'
              }
          }
      }
  }
}

module.exports = CashierDailyTransactions;