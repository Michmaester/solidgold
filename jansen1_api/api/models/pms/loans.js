const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class Loans extends Model {

  static get tableName() {
    return 'pms_loans';
  }

  // static get relationMappings() {
  //   const Roles = require('../models/auth/roles')


  //   return {
  //     role_permissions: {
  //       relation: Model.HasOneRelation,
  //       modelClass: Roles,
  //       // filter: query => query.select('messages'),
  //       join: {
  //         from: 'users.role',
  //         to: 'auth_roles.role'
  //       }
  //     }
  //   }
  // }

}

module.exports = Loans;