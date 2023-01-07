import BaseModel from '$/modules/core/base/model'

export default class UserModel extends BaseModel {
  static get modelName () {
    return 'User'
  }

  static get jsonSchema () {
    const baseSchema = super.jsonSchema
    const { required, properties } = baseSchema
    return {
      required: ['name', 'email', 'password', ...required],
      properties: {
        ...properties,
        name: { type: 'string', minLength: 1, maxLength: 250 },
        email: { type: 'string', minLength: 1, maxLength: 150 },
        password: { type: 'string', minLength: 1, maxLength: 200 },
        resetToken: { type: ['string', 'null'], minLength: 10, maxLength: 300 }
      }
    }
  }
}
