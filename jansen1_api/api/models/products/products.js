const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class Products extends Model {

    static get tableName() {
        return 'products';
    }

    static modifiers = {
        filterByCategory(query, category) {
            query.where('category_ref_id', category);
        }
    }

    // static get modifiers() {
    //     return {
    //         filterByCategory(query, category) {
    //             query.where('category_ref_id', category);
    //         }
    //     };
    // }

    static get relationMappings() {
        const Category = require('../masterdata/categories')
        const Brand = require('../masterdata/brands')
        const Unit = require('../masterdata/units')
        const Type = require('../masterdata/types')
        const ProductPrices = require('./product_prices')
        const Stock = require('../stocks/stocks')

        return {
            category: {
                relation: Model.HasOneRelation,
                modelClass: Category,
                filter: query => query.select('name'),
                join: {
                    from: 'products.category_ref_id',
                    to: 'md_categories.id'
                }
            },

            brand: {
                relation: Model.HasOneRelation,
                modelClass: Brand,
                // filter: query => query.select('brandname'),
                join: {
                    from: 'products.brand_id',
                    to: 'md_brands.id'
                }
            },

            unit: {
                relation: Model.HasOneRelation,
                modelClass: Unit,
                // filter: query => query.select('selling_unit'),
                join: {
                    from: 'products.product_unit_id',
                    to: 'md_units.id'
                }
            },

            type: {
                relation: Model.HasOneRelation,
                modelClass: Type,
                filter: query => query.select('item_type'),
                join: {
                    from: 'products.type_ref_id',
                    to: 'md_types.id'
                }
            },

            stock: {
                relation: Model.HasOneRelation,
                modelClass: Stock,
                // filter: query => query.select('item_type'),
                join: {
                    from: 'products.product_id',
                    to: 'stocks.product_id'
                }
            },

            price: {
                relation: Model.HasOneRelation,
                modelClass: ProductPrices,
                // filter: query => query.select('item_type'),
                join: {
                    from: 'products.product_id',
                    to: 'product_prices.product_id'
                }
            }
        }
    }
}

module.exports = Products;