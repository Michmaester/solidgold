const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class DailyTimeRecords extends Model {

  static get tableName() {
    return 'daily_time_records';
  }

  static get relationMappings() {
    const Dtls = require('./daily_time_logs')



    return {

      dtls: {
        relation: Model.HasManyRelation,
        modelClass: Dtls,
        join: {
          from: 'daily_time_records.dtr_id',
          to: 'daily_time_logs.dtr_id'
        }
      },

    }
  }

}

module.exports = DailyTimeRecords;