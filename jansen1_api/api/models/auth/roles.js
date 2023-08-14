const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class Roles extends Model {

    static get tableName() {
        return 'auth_roles';
    }

    static get relationMappings() {
        const RolesPermissions = require('./roles_permissions')
        const Permissions = require('./permissions')

        return {
            // permissions: {
            //     relation: Model.HasManyRelation,
            //     modelClass: RolesPermissions,
            //     // filter: query => query.select('messages'),
            //     join: {
            //         from: 'auth_roles.role_id',
            //         to: 'auth_roles_permissions.role_id'
            //     }
            // },

            permissions: {
                relation: Model.ManyToManyRelation,
                modelClass: Permissions,
                // filter: query => query.select('messages'),
                join: {
                    from: 'auth_roles.role_id',

                    through: {
                        // persons_movies is the join table.
                        from: 'auth_roles_permissions.role_id',
                        to: 'auth_roles_permissions.perm_id'
                    },

                    to: 'auth_permissions.perm_id'
                }
            }
        }
    }
}

module.exports = Roles;