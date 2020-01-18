/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
import { SchemaDirectiveVisitor, AuthenticationError } from 'apollo-server-koa'
import { defaultFieldResolver } from 'graphql'

export class UpperCaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field) {
    const { resolve = defaultFieldResolver } = field
    field.resolve = async function (...args) {
      const result = await resolve.apply(this, args)
      if (typeof result === 'string') {
        return result.toUpperCase()
      }
      return result
    }
  }
}

export class LowerCaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field) {
    const { resolve = defaultFieldResolver } = field
    field.resolve = async function (...args) {
      const result = await resolve.apply(this, args)
      if (typeof result === 'string') {
        return result.toLowerCase()
      }
      return result
    }
  }
}

export class PrivateResourceDirective extends SchemaDirectiveVisitor {
  visitObject (type) {
    this.ensureFieldsWrapped(type)
    type._requiredAuthRole = 'user' // this.args.requires
  }

  visitFieldDefinition (field, details) {
    this.ensureFieldsWrapped(details.objectType)
    field._requiredAuthRole = 'user'
  }

  ensureFieldsWrapped (objectType) {
    // Mark the GraphQLObjectType object to avoid re-wrapping:
    if (objectType._authFieldsWrapped) return
    objectType._authFieldsWrapped = true

    const fields = objectType.getFields()

    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName.toString()]
      const { resolve = defaultFieldResolver } = field
      field.resolve = async function (...args) {
        // Get the required Role from the field first, falling back
        // to the objectType if no Role is required by the field:
        const requiredRole = field._requiredAuthRole
          || objectType._requiredAuthRole

        if (!requiredRole) {
          return resolve.apply(this, args)
        }

        const context = args[2]
        const { user } = context
        if (!user) {
          throw new AuthenticationError('Unauthenticated')
          // Do not change the following error name as it is using in client.
        }
        return resolve.apply(this, args)
      }
    })
    // https://github.com/apollographql/graphql-tools/blob/master/docs/source/schema-directives.md
  }
}
