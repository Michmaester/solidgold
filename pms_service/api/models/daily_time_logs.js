const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class DailyTimeLogs extends Model {
  static get tableName() {
    return 'daily_time_logs';
  }
}

module.exports = DailyTimeLogs;