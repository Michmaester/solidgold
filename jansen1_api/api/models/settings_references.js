const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class SettingsReferences extends Model {

  static get tableName() {
    return 'settings_references';
  }

}

module.exports = SettingsReferences;