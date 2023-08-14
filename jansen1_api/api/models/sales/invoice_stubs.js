const { Model } = require('objection');
const knex = require('../../../configs/knex')
const dayjs = require('dayjs');

Model.knex(knex)

class InvoiceStubs extends Model {

    static get tableName() {
        return 'invoice_stubs';
    }

    static get relationMappings() {
        const InvoiceStubDetails = require('./invoice_stub_details')
        const SalesTransaction = require('./sales_transactions')
        const User = require('../users')

        return {
            stub_details: {
                relation: Model.HasManyRelation,
                modelClass: InvoiceStubDetails,
                join: {
                    from: 'invoice_stubs.id',
                    to: 'invoice_stub_details.stub_id'
                }
            },

            invoice: {
                relation: Model.HasOneRelation,
                modelClass: SalesTransaction,
                join: {
                    from: 'invoice_stubs.invoice_no',
                    to: 'sales_transactions.invoice_no'
                }
            },

            user: {
                relation: Model.HasOneRelation,
                modelClass: User,
                filter: query => query.select('username'),
                join: {
                    from: 'invoice_stubs.user_id',
                    to: 'users.user_id'
                }
            }
        }
    }
}

module.exports = InvoiceStubs;