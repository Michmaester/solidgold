const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class TestMessages extends Model {
  static get tableName() {
    return 'test_messages';
  }

  static get relationMappings() {
      const TestUser = require('./test_users')
      return {
          writer: {
              relation: Model.BelongsToOneRelation,
              modelClass: TestUser,
              join: {
                  from: 'test_messages.user_id',
                  to: 'test_users.id'
              }
          }
      }
  }
}

module.exports = TestMessages;