const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class SalesDocuments extends Model {

  static get tableName() {
    return 'sales_documents';
  }

  // static get relationMappings() {
  //     const TestMessages = require('./test_messages')
  //     const TestUserDetails = require('./test_user_details')
  //     return {
  //         messages: {
  //             relation: Model.HasManyRelation,
  //             modelClass: TestMessages,
  //             filter: query => query.select('messages'),
  //             join: {
  //                 from: 'test_users.id',
  //                 to: 'test_messages.user_id'
  //             }
  //         },
  //         details: {
  //             relation: Model.HasOneRelation,
  //             modelClass: TestUserDetails,
  //             filter: query => query.select('email','address'),
  //             join: {
  //                 from: 'test_users.id',
  //                 to: 'test_user_details.user_id'
  //             }
  //         }
  //     }
  // }
}

module.exports = SalesDocuments;