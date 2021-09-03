import { Model } from 'objection'
import BaseModel from '$/modules/core/base/model'

export default class TokenModel extends BaseModel {
  static get modelName () {
    return 'Token'
  }

  static get jsonSchema () {
    const baseSchema = super.jsonSchema
    const { required, properties } = baseSchema
    return {
      required: ['userId', 'client', 'strategy', 'accessToken', 'refreshToken', ...required],
      properties: {
        ...properties,
        userId: { type: 'integer' },
        client: { type: ['string', 'null'], minLength: 0, maxLength: 255 },
        strategy: { type: 'string', minLength: 1, maxLength: 100 },
        accessToken: { type: 'string', minLength: 1, maxLength: 1000 },
        refreshToken: { type: 'string', minLength: 1, maxLength: 1000 },
        isRevoked: { type: 'boolean' }
      }
    }
  }

  static get relationMappings () {
    return {
      userByUserId: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.dependencies.UserModel,
        join: {
          from: `${this.tableName}.userId`,
          to: 'users.id'
        },
        resolver: ({ userId }, args, { loaders }) => (
          userId ? loaders.userLoader.byID.load(userId) : null
        )
      },
      ...super.relationMappings
    }
  }
}
