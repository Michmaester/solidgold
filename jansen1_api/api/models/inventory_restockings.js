const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class InventoryRestockings extends Model {

    static get tableName() {
        return 'inventory_restockings';
    }

}

module.exports = InventoryRestockings;