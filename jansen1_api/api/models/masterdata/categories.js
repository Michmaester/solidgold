const { Model } = require('objection');
const knex = require('../../../configs/knex')

Model.knex(knex)

class Categories extends Model {

  static get tableName() {
    return 'md_categories';
  }

  static get relationMappings() {
      const DivisionRefs = require('./division_refs')
      
      return {
          division : {
              relation: Model.HasOneRelation,
              modelClass: DivisionRefs,
              // filter: query => query.select('name'),
              join: {
                  from: 'md_categories.division_ref_id',
                  to: 'md_division_refs.id'
              }
          }
      }
  }

}

module.exports = Categories;