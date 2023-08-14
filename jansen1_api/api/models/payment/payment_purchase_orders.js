const { Model } = require('objection');
const knex = require('../../../configs/knex')
const dayjs = require('dayjs');

Model.knex(knex)

class PaymentPurchaseOrders extends Model {

  static get tableName() {
    return 'payment_purchase_orders';
  }

  get paymentDate() {
    return dayjs(this.payment_date).format('MMM-DD-YYYY HH:mm:ss')
  }

  get chequeDate() {
    return this.cheque_date != null ? dayjs(this.cheque_date).format('MMM-DD-YYYY') : null
  }

  $formatJson(obj) {
    obj = super.$formatJson(obj);

    obj.paymentDate = this.paymentDate;
    obj.chequeDate = this.chequeDate;

    return obj;
  }

  static get relationMappings() {
    const PurchaseOrder = require('../purchase/purchase_orders')
    const Supplier = require('../partners/suppliers')

    return {

      po: {
        relation: Model.HasOneRelation,
        modelClass: PurchaseOrder,
        join: {
          from: 'purchase_orders.po_number',
          to: 'payment_purchase_orders.po_number'
        }
      },

      supplier: {
        relation: Model.HasOneRelation,
        modelClass: Supplier,
        join: {
          from: 'payment_purchase_orders.supplier_id',
          to: 'suppliers.supplier_id'
        }
      }

    }
  }


}

module.exports = PaymentPurchaseOrders;