import { Model } from 'objection'
import BaseModel from '$/modules/core/base/model'

export default class TenantModel extends BaseModel {
  static get modelName () {
    return 'Tenant'
  }

  static get jsonSchema () {
    const baseSchema = super.jsonSchema
    const { required, properties } = baseSchema
    return {
      required: ['name', 'code', 'domain', 'ownerId', 'status', ...required],
      properties: {
        ...properties,
        name: { type: 'string', minLength: 1, maxLength: 200 },
        code: { type: 'string', minLength: 1, maxLength: 200 },
        domain: { type: 'string', minLength: 1, maxLength: 200 },
        description: { type: ['string', 'null'], minLength: 0, maxLength: 500 },
        ownerId: { type: ['integer', 'null'] },
        status: { type: 'string', minLength: 1, maxLength: 50 }
      }
    }
  }

  static get relationMappings () {
    return {
      userByOwnerId: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.dependencies.UserModel,
        join: {
          from: `${this.tableName}.ownerId`,
          to: 'users.id'
        },
        resolver: ({ ownerId }, args, { loaders }) => (
          ownerId ? loaders.userLoader.byID.load(ownerId) : null
        )
      },
      ...super.relationMappings
    }
  }
}
