const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class Attachments extends Model {

  static get tableName() {
    return 'partner_attachments';
  }
}

module.exports = Attachments;