const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class PaymentTendersCheque extends Model {

  static get tableName() {
    return 'payment_tenders_cheque';
  }

  static get relationMappings() {
    const Bank = require('../masterdata/banks')
    const PaymentTender = require('./payment_tenders')

    return {
      bank: {
        relation: Model.HasOneRelation,
        modelClass: Bank,
        join: {
          from: 'payment_tenders_cheque.bank_id',
          to: 'md_banks.id'
        }
      },
      tender: {
        relation: Model.HasOneRelation,
        modelClass: PaymentTender,
        join: {
          from: 'payment_tenders_cheque.payment_id',
          to: 'payment_tenders.id'
        }
      }
    }
  }
}

module.exports = PaymentTendersCheque;