const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class PaymentTendersCash extends Model {

  static get tableName() {
    return 'payment_tenders_cash';
  }

  static get relationMappings() {
    const PaymentTender = require('./payment_tenders')

    return {
      tender: {
        relation: Model.HasOneRelation,
        modelClass: PaymentTender,
        join: {
          from: 'payment_tenders_cash.payment_id',
          to: 'payment_tenders.id'
        }
      }
    }
  }
}

module.exports = PaymentTendersCash;