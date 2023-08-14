const { Model } = require('objection');
const knex = require('../../../configs/knex')
const dayjs = require('dayjs');

Model.knex(knex)

class Stocks extends Model {

  static get tableName() {
    return 'stocks';
  }


  get dateOnHandQty() {
    return dayjs(this.date_onhand_qty).format('MMM-DD-YYYY HH:mm:ss')
  }

  get dateLastQty() {
    return dayjs(this.date_last_qty).format('MMM-DD-YYYY HH:mm:ss')
  }

  $formatJson(obj) {
    obj = super.$formatJson(obj);

    // Getter properties are not enumerable, so we need to add them 
    // to the output object explicitly.
    obj.dateOnHandQty = this.dateOnHandQty;
    obj.dateLastQty = this.dateLastQty;

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
        // modify : query => query.where('category',category),
        join: {
          from: 'stocks.product_id',
          to: 'products.product_id'
        }
      },

      branch: {
        relation: Model.HasOneRelation,
        modelClass: Branch,
        // filter: query => query.select('messages'),
        join: {
          from: 'stocks.branch_code',
          to: 'md_branches.branch_code'
        }
      },


      brand: {
        relation: Model.HasOneThroughRelation,
        modelClass: Brand,
        join: {
          from: 'stocks.product_id',
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
          from: 'stocks.product_id',
          through: {
            from: 'products.product_id',
            to: 'products.product_unit_id'
          },
          to: 'md_units.id'
        }
      },

      // brand: {
      //   relation: Model.HasOneThroughRelation,
      //   modelClass: Brand,
      //   // filter: query => query.select('messages'),
      //   join: {
      //     from: 'md_brands.id',
      //     through: {
      //       // persons_movies is the join table.
      //       from: 'persons_movies.personId',
      //       to: 'persons_movies.movieId'
      //     },
      //     to: 'movies.id'
      //   }
      // }
    }
  }

}

module.exports = Stocks;