const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class Permissions extends Model {

    static get tableName() {
        return 'auth_permissions';
    }

      static get relationMappings() {
          const RolesPermissions = require('./roles_permissions')

          return {
              roleperms: {
                  relation: Model.HasManyRelation,
                  modelClass: RolesPermissions,
                  // filter: query => query.select('messages'),
                  join: {
                      from: 'auth_permissions.perm_id',
                      to: 'auth_roles_permissions.perm_id'
                  }
              }
          }
      }
}

module.exports = Permissions;