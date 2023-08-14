const { Model } = require('objection');
const knex = require('../../../configs/knex')
const dayjs = require('dayjs');

Model.knex(knex)

class SalesDeliveries extends Model {

  static get tableName() {
    return 'sales_deliveries';
  }

  get dateDeliveryRequested() {
    return dayjs(this.delivery_requested_date).format('MMM DD, YYYY hh:mm A')
  }

  $formatJson(obj) {
    obj = super.$formatJson(obj);
    obj.dateDeliveryRequested = this.dateDeliveryRequested;
    return obj;
  }

  static get relationMappings() {
      const SalesTrans = require('./sales_transactions')
      
      return {

          sales_trans: {
              relation: Model.HasOneRelation,
              modelClass: SalesTrans,
              // filter: query => query.select('messages'),
              join: {
                  from: 'sales_deliveries.invoice_no',
                  to: 'sales_transactions.invoice_no'
              }
          }
      }
  }
}

module.exports = SalesDeliveries;