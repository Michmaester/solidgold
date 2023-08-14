const { Model } = require('objection');
const knex = require('../../../configs/knex')
const dayjs = require('dayjs');

Model.knex(knex)

class InvoiceStubDetails extends Model {

    static get tableName() {
        return 'invoice_stub_details';
    }


    static get relationMappings() {
        const User = require('../users')

        return {
            user: {
                relation: Model.HasOneRelation,
                modelClass: User,
                filter: query => query.select('username'),
                join: {
                    from: 'invoice_stub_details.user_id',
                    to: 'users.user_id'
                }
            }
        }
    }
}

module.exports = InvoiceStubDetails;