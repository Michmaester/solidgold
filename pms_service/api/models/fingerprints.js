const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class Fingerprints extends Model {
  static get tableName() {
    return 'fingerprints';
  }
}

module.exports = Fingerprints;