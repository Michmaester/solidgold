const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class EmploymentInfos extends Model {
  static get tableName() {
    return 'employment_infos';
  }
}

module.exports = EmploymentInfos;