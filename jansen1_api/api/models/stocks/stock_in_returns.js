const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class StockInReturns extends Model {

  static get tableName() {
    return 'stock_in_returns';
  }

  // static get relationMappings() {
  //     const StockValeItems = require('./stock_vale_items')
      
  //     return {
  //         valeItems : {
  //             relation: Model.HasManyRelation,
  //             modelClass: StockValeItems,
  //             // filter: query => query.select('messages'),
  //             join: {
  //                 from: 'stock_vales.stock_vale_no',
  //                 to: 'stock_vale_items.stock_vale_no'
  //             }
  //         }
  //     }
  // }
}

module.exports = StockInReturns;