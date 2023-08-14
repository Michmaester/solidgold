const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class AccountPayables extends Model {

    static get tableName() {
        return 'account_payables';
    }

}

module.exports = AccountPayables;