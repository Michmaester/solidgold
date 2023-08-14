const { Model } = require('objection');
const knex = require('../../../configs/knex')
const dayjs = require('dayjs');

Model.knex(knex)

class ChequeVouchers extends Model {

    static get tableName() {
        return 'cheque_vouchers';
    }


    static get relationMappings() {

        const Supplier = require('../partners/suppliers')

        return {
            supplier: {
                relation: Model.HasOneRelation,
                modelClass: Supplier,
                join: {
                    from: 'cheque_vouchers.supplier_id',
                    to: 'suppliers.supplier_id'
                }
            }

        }
    }


}

module.exports = ChequeVouchers;