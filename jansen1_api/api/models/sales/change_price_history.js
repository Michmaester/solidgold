const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class ChangePriceHistory extends Model {

  static get tableName() {
    return 'change_price_history';
  }


}

module.exports = ChangePriceHistory;