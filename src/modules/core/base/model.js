import { Model } from 'objection'
import pluralize from 'pluralize'
import _ from 'lodash'

function convertType (type) {
  switch (type) {
    case 'string':
      return 'String'
    case 'integer':
      return 'Int'
    case 'number':
    case 'decimal':
      return 'Float'
    case 'boolean':
      return 'Boolean'
    case 'date':
      return 'Date'
    case 'time':
      return 'Time'
    case 'datetime':
      return 'DateTime'
    case 'json':
      return 'JSON'
    default:
      throw Error('Unknow Type for GraphQl Schema')
  }
}

function getType (type) {
  if (_.isArray(type)) {
    if (!_.isEmpty(type)) {
      if (type.length > 1) {
        return type[0] !== 'null' ? type[0] : type[1]
      }
      return type[0]
    }
    return 'string'
  }
  return type || 'string'
}
export default class BaseModel extends Model {
  static query (...args) {
    return super.query(...args).onBuildKnex(knexQueryBuilder => {
      const { client } = knexQueryBuilder
      const { config } = client
      const { debug } = config
      if (debug) {
        knexQueryBuilder.on('query', queryData => {
          $logger.debug(queryData)
        })
      }
    })
  }

  static get modelName () {
    return this.name.replace('Model', '')
  }

  static get pluralModelName () {
    return pluralize.plural(this.modelName)
  }

  static get tableName () {
    return pluralize.plural(_.snakeCase(this.modelName)).toLowerCase()
  }

  static get idField () {
    return _.find(this.fields, 'isPk')
  }

  static get fields () {
    const value = []
    const { required, properties } = this.jsonSchema
    if (properties) {
      Object.entries(properties).forEach(entry => {
        const [name, val] = entry
        const isPk = name === this.idColumn
        const isRequired = isPk || (required.indexOf(name) > -1)
        const valType = getType(val.type)
        const snakeCase = _.snakeCase(name)
        const gqlType = convertType(valType)
        const gqlTypeWithStatus = `${gqlType}${isRequired ? '!' : ''}`
        const gqlFilterType = `${gqlType}FilterInput`
        const gqlDirective = (() => {
          if (val.directive) {
            return _.isFunction(val.directive) ? val.directive() : val.directive
          }
          return ''
        })()
        value.push({
          isPk,
          name,
          snakeCaseName: snakeCase,
          upperSnakeCaseName: snakeCase.toUpperCase(),
          required: isRequired,
          type: valType,
          gqlType,
          gqlFilterType,
          gqlTypeWithStatus,
          gqlFieldDef: `${name}: ${gqlTypeWithStatus}`,
          gqlDirective
        })
      })
    }
    return value
  }

  static get fieldsWithRelation () {
    const value = []
    if (this.relationMappings) {
      Object.entries(this.relationMappings).forEach(entry => {
        const [name, val] = entry
        const snakeCase = _.snakeCase(name)
        const gqlType = val.modelClass.modelName
        const isArray = val.relation === Model.HasManyRelation || val.relation === Model.ManyToManyRelation
        value.push({
          name,
          snakeCaseName: snakeCase,
          upperSnakeCaseName: snakeCase.toUpperCase(),
          gqlType,
          gqlFieldDef: `${name}: ${isArray ? `[${gqlType}]` : gqlType}`,
          isArray
        })
      })
    }
    return value
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['createdBy', 'updatedBy'],
      properties: {
        id: { type: 'integer' },
        isEditing: { type: ['boolean', 'null'] },
        createdAt: { type: 'datetime' },
        createdBy: { type: 'integer' },
        updatedAt: { type: 'datetime' },
        updatedBy: { type: 'integer' },
        isActive: { type: ['boolean', 'null'] }
      }
    }
  }

  static get relationMappings () {
    return {
      userByCreatedBy: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.dependencies.UserModel,
        join: {
          from: `${this.tableName}.createdBy`,
          to: 'users.id'
        },
        resolver: ({ createdBy }, args, { loaders }) => (
          createdBy ? loaders.userLoader.byID.load(createdBy) : null
        )
      },
      userByUpdatedBy: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.dependencies.UserModel,
        join: {
          from: `${this.tableName}.updatedBy`,
          to: 'users.id'
        },
        resolver: ({ updatedBy }, args, { loaders }) => (
          updatedBy ? loaders.userLoader.byID.load(updatedBy) : null
        )
      }
    }
  }

  static get dependencies () {
    if (!this.local_dependencies) {
      this.local_dependencies = {
        // eslint-disable-next-line
        UserModel: require('$/modules/user/model').default
      }
    }
    return this.local_dependencies
  }
}
