const { Model } = require('objection');
const knex = require('../../../configs/knex')
const dayjs = require('dayjs');

Model.knex(knex)

class DashCharts extends Model {

    static get tableName() {
        return 'dash_charts';
    }

}

module.exports = DashCharts;