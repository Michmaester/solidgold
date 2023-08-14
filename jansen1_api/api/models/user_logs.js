const { Model } = require('objection');
const knex = require('../../configs/knex')

Model.knex(knex)

class UserLogs extends Model {

    static get tableName() {
        return 'user_logs';
    }

    static get relationMappings() {
        const Users = require('../models/users')


        return {
            user: {
                relation: Model.HasOneRelation,
                modelClass: Users,
                // filter: query => query.select('messages'),
                join: {
                    from: 'users.user_id',
                    to: 'user_logs.user_id'
                }
            }
        }
    }

}

module.exports = UserLogs;