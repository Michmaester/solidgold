const { Model } = require('objection');
const knex = require('../../../configs/knex')
const dayjs = require('dayjs');

Model.knex(knex)

class ProductPricesHistory extends Model {

    static get tableName() {
        return 'product_prices_history';
    }
}

module.exports = ProductPricesHistory;