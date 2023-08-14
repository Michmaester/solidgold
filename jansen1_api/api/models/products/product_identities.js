const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class ProductIdentities extends Model {

  static get tableName() {
    return 'product_identities';
  }

}

module.exports = ProductIdentities;