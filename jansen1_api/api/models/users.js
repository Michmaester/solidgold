const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class Users extends Model {

  static get tableName() {
    return 'users';
  }

  static get relationMappings() {
    const Roles = require('../models/auth/roles')


    return {
      role_permissions: {
        relation: Model.HasOneRelation,
        modelClass: Roles,
        // filter: query => query.select('messages'),
        join: {
          from: 'users.role',
          to: 'auth_roles.role'
        }
      },

      // permissions: {
      //     relation: Model.ManyToManyRelation,
      //     modelClass: Permissions,
      //     // filter: query => query.select('messages'),
      //     join: {
      //         from: 'auth_roles.role_id',

      //         through: {
      //             // persons_movies is the join table.
      //             from: 'auth_roles_permissions.role_id',
      //             to: 'auth_roles_permissions.perm_id'
      //         },

      //         to: 'auth_permissions.perm_id'
      //     }
      // }
    }
  }

}

module.exports = Users;