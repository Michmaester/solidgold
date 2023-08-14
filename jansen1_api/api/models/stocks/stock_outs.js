const { Model } = require('objection');
const knex = require('../../../configs/knex')
const dayjs = require('dayjs');

Model.knex(knex)

class StockOuts extends Model {

  static get tableName() {
    return 'stock_outs';
  }

  get dateStockout() {
    return dayjs(this.stockout_date).format('MMM-DD-YYYY HH:mm:ss')
  }

  $formatJson(obj) {
    obj = super.$formatJson(obj);

    // Getter properties are not enumerable, so we need to add them 
    // to the output object explicitly.
    obj.dateStockout = this.dateStockout;

    return obj;
  }

  static get relationMappings() {
    const Product = require('../products/products')
    const Branch = require('../masterdata/branches')
    const Brand = require('../masterdata/brands')
    const Unit = require('../masterdata/units')

    return {
      product: {
        relation: Model.HasOneRelation,
        modelClass: Product,
        // filter: query => query.select('messages'),
        join: {
          from: 'stock_outs.product_id',
          to: 'products.product_id'
        }
      },
      branch: {
        relation: Model.HasOneRelation,
        modelClass: Branch,
        // filter: query => query.select('messages'),
        join: {
          from: 'stock_outs.branch_code',
          to: 'md_branches.branch_code'
        }
      },

      brand: {
        relation: Model.HasOneThroughRelation,
        modelClass: Brand,
        join: {
          from: 'stock_outs.product_id',
          through: {
            from: 'products.product_id',
            to: 'products.brand_id'
          },
          to: 'md_brands.id'
        }
      },

      unit: {
        relation: Model.HasOneThroughRelation,
        modelClass: Unit,
        join: {
          from: 'stock_outs.product_id',
          through: {
            from: 'products.product_id',
            to: 'products.product_unit_id'
          },
          to: 'md_units.id'
        }
      },
    }
  }
}

module.exports = StockOuts;