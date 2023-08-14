const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class CreditMemoTotals extends Model {

    static get tableName() {
        return 'credit_memo_totals';
    }

}

module.exports = CreditMemoTotals;