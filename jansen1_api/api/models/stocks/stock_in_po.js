const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class StockInPo extends Model {

  static get tableName() {
    return 'stock_in_po';
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

module.exports = StockInPo;