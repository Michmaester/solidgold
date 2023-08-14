const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class TestDatas extends Model {

    static get tableName() {
        return 'testdatas';
    }
}

module.exports = TestDatas;