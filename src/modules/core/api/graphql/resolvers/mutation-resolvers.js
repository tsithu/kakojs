import _ from 'lodash'
import uniqid from 'uniqid'
import pubsub from '../subscriptions/pubsub'
import { ECHO } from '../subscriptions/events'

export default function mutationResolvers (modules) {
  const resolvers = {
    echo: (root, { message }, { user }) => {
      pubsub.publish(ECHO, { echo: `${message} ... ${user ? user.name : 'No User'}` })
      return message
    }
  }
  const resolverMap = modules.map(ctrl => {
    const { model, loader, loaderName } = ctrl
    const {
      modelName, gqlSchema, skipDefaultCRUDSchema, idField
    } = model
    const camelCaseModelName = _.camelCase(modelName)
    const resolversFromSchema = {}

    if (!_.isEmpty(gqlSchema) && !_.isEmpty(gqlSchema.mutations)) {
      gqlSchema.mutations.forEach(({ name, resolver }) => {
        if (resolver) {
          if (_.isFunction(resolver)) {
            resolversFromSchema[name.toString()] = resolver
          } else if (_.isObject(resolver)) {
            const loaderFn = loader
              && _.isString(resolver.loader)
              && loader[resolver.loader] ? loader[resolver.loader] : null
            if (loaderFn) {
              resolversFromSchema[name.toString()] = (root, args, ctx) => {
                const params = []
                if (_.isArray(resolver.args) && !_.isEmpty(resolver.args)) {
                  resolver.args.forEach(argName => params.push(args[argName.toString()]))
                }
                return !_.isEmpty(params)
                  ? ctx.loaders[loaderName.toString()][resolver.loader].load(...params)
                  : null
              }
            } else {
              resolversFromSchema[name.toString()] = async (root, args, ctx, info) => {
                const params = []
                if (_.isArray(resolver.args) && !_.isEmpty(resolver.args)) {
                  resolver.args.forEach(argName => params.push(args[argName.toString()]))
                }
                params.push(ctx)
                params.push(info)
                const result = await ctrl[resolver.controllerFn](...params)
                if (resolver.publish) {
                  const events = []
                  if (!_.isArray(resolver.publish)) {
                    events.push(resolver.publish)
                  } else {
                    events.push(...resolver.publish)
                  }
                  events.forEach(({ event, payload }) => {
                    pubsub.publish(event,
                      _.isFunction(payload)
                        ? payload({
                          result, event, args, context: ctx
                        })
                        : { [payload]: result })
                  })
                }
                return result
              }
            }
          }
        }
      })
    }

    // eslint-disable-next-line no-unused-vars
    const { name } = idField || { name: 'id' }
    return skipDefaultCRUDSchema === true ? resolversFromSchema : {
      [`create${modelName}`]: async (root, { input }) => {
        const data = input[`${camelCaseModelName}`]
        const result = await ctrl.createNew(data)
        pubsub.publish(`${_.snakeCase(modelName).toUpperCase()}_CREATED`, {
          [`${camelCaseModelName}Created`]: result
        })
        return {
          clientMutationId: uniqid(),
          [`${camelCaseModelName}`]: {
            nodeId: uniqid(),
            ...result
          }
        }
      },
      [`update${modelName}`]: async (root, { input }) => {
        // TODO: Not implemented yet!
        const data = input[`${camelCaseModelName}Patch`]
        const result = await ctrl.patchById(input.id, data)
        return {
          clientMutationId: uniqid(),
          [`${camelCaseModelName}`]: {
            nodeId: uniqid(),
            ...result
          }
        }
      },
      [`update${modelName}ById`]: async (root, { input }) => {
        const data = input[`${camelCaseModelName}Patch`]
        const result = await ctrl.patchById(input.id, data)
        pubsub.publish(`${_.snakeCase(modelName).toUpperCase()}_UPDATED`, {
          [`${camelCaseModelName}Updated`]: result
        })
        return {
          clientMutationId: uniqid(),
          [`${camelCaseModelName}`]: {
            nodeId: uniqid(),
            ...result
          }
        }
      }, // eslint-disable-next-line
      [`delete${modelName}`]: async (root, { input }) => ({
        // TODO: Not implemented yet!
        clientMutationId: uniqid(),
        [`${camelCaseModelName}`]: {
          nodeId: uniqid(), id: 1, name: 'test'
        }
      }),
      [`delete${modelName}ById`]: async (root, { input }) => {
        const { id } = input
        const result = await ctrl.deleteById(id)
        pubsub.publish(`${_.snakeCase(modelName).toUpperCase()}_DELETED`, {
          [`${camelCaseModelName}Deleted`]: result
        })
        return {
          clientMutationId: uniqid(),
          [`deleted${modelName}Id`]: result ? result.id : null,
          [`${camelCaseModelName}`]: {
            nodeId: uniqid(),
            ...result
          }
        }
      },
      [`delete${modelName}ByIds`]: async (root, { input }) => {
        const { ids } = input
        const results = await ctrl.deleteByIds(ids)
        const deletedRecords = []
        if (results) {
          results.forEach(result => {
            deletedRecords.push({
              clientMutationId: uniqid(),
              [`deleted${modelName}Id`]: result ? result.id : null,
              [`${camelCaseModelName}`]: {
                nodeId: uniqid(),
                ...result
              }
            })
          })
        }
        return deletedRecords
      },
      ...resolversFromSchema
    }
  })
  resolverMap.forEach(r => { Object.assign(resolvers, r) })
  return resolvers
}
