const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class CreditMemos extends Model {

    static get tableName() {
        return 'credit_memos';
    }

}

module.exports = CreditMemos;