const { Model } = require('objection');
const knex = require('../../../configs/knex')
const dayjs = require('dayjs');

Model.knex(knex)

class SalesTransactions extends Model {

  static get tableName() {
    return 'sales_transactions';
  }

  get dateTransaction() {
    return dayjs(this.transaction_date).format('MMM DD, YYYY hh:mm A')
  }

  $formatJson(obj) {
    obj = super.$formatJson(obj);
    obj.dateTransaction = this.dateTransaction;
    return obj;
  }

  static get relationMappings() {
    const SalesTransItems = require('./sales_transaction_items')
    const Customer = require('../partners/customers')
    const Delivery = require('../sales/sales_deliveries')
    const User = require('../users')
    const PaymentTenders = require('../payment/payment_tenders')

    return {
      trans_items: {
        relation: Model.HasManyRelation,
        modelClass: SalesTransItems,
        // filter: query => query.select('messages'),
        join: {
          from: 'sales_transactions.id',
          to: 'sales_transaction_items.sales_transaction_id'
        }
      },

      customer: {
        relation: Model.HasOneRelation,
        modelClass: Customer,
        // filter: query => query.select('messages'),
        join: {
          from: 'sales_transactions.customer_id',
          to: 'customers.customer_id'
        }
      },

      delivery: {
        relation: Model.HasOneRelation,
        modelClass: Delivery,
        // filter: query => query.select('messages'),
        join: {
          from: 'sales_transactions.invoice_no',
          to: 'sales_deliveries.invoice_no'
        }
      },

      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        filter: query => query.select(['fullname', 'position', 'username']),
        join: {
          from: 'sales_transactions.user_id',
          to: 'users.user_id'
        }
      },

      salesfront: {
        relation: Model.HasOneRelation,
        modelClass: User,
        filter: query => query.select(['fullname', 'position', 'username']),
        join: {
          from: 'sales_transactions.salesfront_user_id',
          to: 'users.user_id'
        }
      },

      payment_tender: {
        relation: Model.HasOneRelation,
        modelClass: PaymentTenders,
        filter: query => query.select(['id']),
        join: {
          from: 'sales_transactions.id',
          to: 'payment_tenders.sales_transaction_id'
        }
      },
    }
  }
}

module.exports = SalesTransactions;