import BaseModel from '$/modules/core/base/model'

export default class AuthModel extends BaseModel {
  static get modelName () {
    return 'Auth'
  }

  static get skipDefaultCRUDSchema () {
    return true
  }

  static get gqlSchema () {
    return {
      typeDefs: `
        type AuthPayload {
          user: User
          accessToken: String
          authenticated: Boolean!
        }
        type ResetPasswordPayload {
          error: String
          generatedNewPassword: String
        }
      `,
      queries: [],
      mutations: [
        {
          name: 'login',
          typeDef: 'login(email: String!, password: String!): AuthPayload',
          resolver: {
            controllerFn: 'login',
            args: ['email', 'password'],
            publish: {
              event: 'USER_LOGGED_IN',
              payload: ({ result }) => ({ userLoggedIn: result ? result.user : null })
            }
          }
        },
        {
          name: 'logout',
          typeDef: 'logout(accessToken: String): AuthPayload',
          resolver: {
            controllerFn: 'logout',
            args: ['accessToken'],
            publish: {
              event: 'USER_LOGGED_OUT',
              payload: ({ context }) => ({ userLoggedOut: context ? context.user : null })
            }
          }
        },
        {
          name: 'register',
          typeDef: 'register(name: String!, email: String!, password: String!): AuthPayload',
          resolver: {
            controllerFn: 'register',
            args: ['name', 'email', 'password']
          }
        },
        {
          name: 'forgotPassword',
          typeDef: 'forgotPassword(email: String!): String',
          resolver: {
            controllerFn: 'forgotPassword',
            args: ['email']
          }
        },
        {
          name: 'resetPassword',
          typeDef: 'resetPassword(resetToken: String!): ResetPasswordPayload!',
          resolver: {
            controllerFn: 'resetPassword',
            args: ['resetToken']
          }
        },
        {
          name: 'changePassword',
          typeDef: 'changePassword(userId: Int!, oldPassword: String!, newPassword: String!): AuthPayload!',
          resolver: {
            controllerFn: 'changePassword',
            args: ['userId', 'oldPassword', 'newPassword']
          }
        }
      ],
      subscriptions: [
        {
          name: 'userLoggedIn',
          typeDef: 'userLoggedIn: User',
          subscribe: 'USER_LOGGED_IN' // Or { event: 'USER_LOGGED_IN' }
          /**
           * subscribe: { event: 'USER_LOGGED_IN', filter: (payload, variables) => null
           */
        },
        {
          name: 'userLoggedOut',
          typeDef: 'userLoggedOut: User',
          subscribe: 'USER_LOGGED_OUT'
        }
      ]
    }
  }

  static get jsonSchema () {
    return {
      required: ['email', 'password'],
      properties: {
        name: { type: ['string', null], minLength: 1, maxLength: 250 },
        email: { type: 'string', minLength: 1, maxLength: 150 },
        password: { type: 'string', minLength: 1, maxLength: 300 }
      }
    }
  }
}
