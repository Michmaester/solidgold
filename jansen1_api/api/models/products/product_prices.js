const { Model } = require('objection');
const knex = require('../../../configs/knex')
const dayjs = require('dayjs');

Model.knex(knex)

class ProductPrices extends Model {

  static get tableName() {
    return 'product_prices';
  }

  get dateEffective() {
    return dayjs(this.effective_date).format('MMM-DD-YYYY')
  }

  $formatJson(obj) {
    obj = super.$formatJson(obj);
    obj.dateEffective = this.dateEffective;

    return obj;
  }

  static get relationMappings() {
      const Product = require('./products')
      
      return {
          product : {
              relation: Model.HasOneRelation,
              modelClass: Product,
              // filter: query => query.select('name'),
              join: {
                  from: 'products.product_id',
                  to: 'product_prices.product_id'
              }
          }
      }
  }
}

module.exports = ProductPrices;