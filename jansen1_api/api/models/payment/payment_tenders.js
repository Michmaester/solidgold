const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class PaymentTenders extends Model {

    static get tableName() {
        return 'payment_tenders';
    }

    static get relationMappings() {

        const SalesTransaction = require('../sales/sales_transactions')
        const PaymentCash = require('./payment_tenders_cash')
        const PaymentCard = require('./payment_tenders_card')
        const PaymentCharge = require('./payment_tenders_charge')
        const PaymentCheque = require('./payment_tenders_cheque')
        const PaymentGiftCheque = require('./payment_tenders_giftcheque')
        const PaymentReturn = require('./payment_tenders_returns')

        return {
            sales_transaction: {
                relation: Model.HasOneRelation,
                modelClass: SalesTransaction,
                // filter: query => query.select('messages'),
                join: {
                    from: 'payment_tenders.sales_transaction_id',
                    to: 'sales_transactions.id'
                }
            },
            payment_cash: {
                relation: Model.HasManyRelation,
                modelClass: PaymentCash,
                // filter: query => query.select('messages'),
                join: {
                    from: 'payment_tenders.id',
                    to: 'payment_tenders_cash. payment_id'
                }
            },
            payment_card: {
                relation: Model.HasManyRelation,
                modelClass: PaymentCard,
                // filter: query => query.select('messages'),
                join: {
                    from: 'payment_tenders.id',
                    to: 'payment_tenders_card.payment_id'
                }
            },
            payment_charge: {
                relation: Model.HasManyRelation,
                modelClass: PaymentCharge,
                // filter: query => query.select('messages'),
                join: {
                    from: 'payment_tenders.id',
                    to: 'payment_tenders_charge.payment_id'
                }
            },
            payment_cheque: {
                relation: Model.HasManyRelation,
                modelClass: PaymentCheque,
                // filter: query => query.select('messages'),
                join: {
                    from: 'payment_tenders.id',
                    to: 'payment_tenders_cheque.payment_id'
                }
            },
            payment_giftcheque: {
                relation: Model.HasManyRelation,
                modelClass: PaymentGiftCheque,
                // filter: query => query.select('messages'),
                join: {
                    from: 'payment_tenders.id',
                    to: 'payment_tenders_giftcheque.payment_id'
                }
            },
            payment_return: {
                relation: Model.HasManyRelation,
                modelClass: PaymentReturn,
                // filter: query => query.select('messages'),
                join: {
                    from: 'payment_tenders.id',
                    to: 'payment_tenders_returns.payment_id'
                }
            }
        }
    }
}

module.exports = PaymentTenders;