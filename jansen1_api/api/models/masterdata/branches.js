const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class Branches extends Model {

  static get tableName() {
    return 'md_branches';
  }
}

module.exports = Branches;