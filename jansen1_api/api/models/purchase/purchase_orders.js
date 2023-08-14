const { Model } = require('objection');
const knex = require('../../../configs/knex')
const dayjs = require('dayjs');

Model.knex(knex)

class PurchaseOrders extends Model {

  static get tableName() {
    return 'purchase_orders';
  }

  get dateCreated() {
    return dayjs(this.date_created).format('MMM-DD-YYYY HH:mm:ss')
  }

  $formatJson(obj) {
    obj = super.$formatJson(obj);

    // Getter properties are not enumerable, so we need to add them 
    // to the output object explicitly.
    obj.dateCreated = this.dateCreated;

    return obj;
  }

  static get relationMappings() {
    const PurchaseOrderItems = require('./purchase_order_items')
    const Suppliers = require('../partners/suppliers')
    const Branch = require('../masterdata/branches')
    const InvoiceBranch = require('../masterdata/branches')
    const Courier = require('../masterdata/couriers')
    const User = require('../users')
    const PaymentPurchaseOrders = require('../payment/payment_purchase_orders')

    return {
        po_items: {
            relation: Model.HasManyRelation,
            modelClass: PurchaseOrderItems,
            // filter: query => query.select('messages'),
            join: {
                from: 'purchase_orders.po_number',
                to: 'purchase_order_items.po_number'
            }
        },

        supplier: {
            relation: Model.HasOneRelation,
            modelClass: Suppliers,
            // filter: query => query.select('messages'),
            join: {
                from: 'suppliers.supplier_id',
                to: 'purchase_orders.supplier_id'
            }
        },

        branch: {
            relation: Model.HasOneRelation,
            modelClass: Branch,
            // filter: query => query.select('messages'),
            join: {
                from: 'md_branches.branch_code',
                to: 'purchase_orders.branch_id'
            }
        },

        invoice_branch: {
            relation: Model.HasOneRelation,
            modelClass: InvoiceBranch,
            // filter: query => query.select('messages'),
            join: {
                from: 'md_branches.branch_code',
                to: 'purchase_orders.invoice_branch_id'
            }
        },

        courier: {
            relation: Model.HasOneRelation,
            modelClass: Courier,
            // filter: query => query.select('messages'),
            join: {
                from: 'md_couriers.id',
                to: 'purchase_orders.courier_id'
            }
        },

        user: {
            relation: Model.HasOneRelation,
            modelClass: User,
            filter: query => query.select('user_id','username','fullname'),
            join: {
                from: 'users.user_id',
                to: 'purchase_orders.user_id'
            }
        },

        payments: {
            relation: Model.HasManyRelation,
            modelClass: PaymentPurchaseOrders,
            join: {
                from: 'payment_purchase_orders.po_number',
                to: 'purchase_orders.po_number'
            }
        },
        
    }
  }

  
}

module.exports = PurchaseOrders;