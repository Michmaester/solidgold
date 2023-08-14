const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class AccountReceivables extends Model {

    static get tableName() {
        return 'account_receivables';
    }

}

module.exports = AccountReceivables;