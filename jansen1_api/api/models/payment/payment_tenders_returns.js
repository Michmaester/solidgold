const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class PaymentTendersReturns extends Model {

    static get tableName() {
        return 'payment_tenders_returns';
    }
}

module.exports = PaymentTendersReturns;