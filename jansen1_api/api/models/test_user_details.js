const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class TestUserDetails extends Model {
  static get tableName() {
    return 'test_user_details';
  }

  static get relationMappings() {
      const TestUsers = require('./test_users')
      return {
          writer: {
              relation: Model.BelongsToOneRelation,
              modelClass: TestUsers,
              join: {
                  from: 'test_user_details.user_id',
                  to: 'test_users.id'
              }
          }
      }
  }
}

module.exports = TestUserDetails;