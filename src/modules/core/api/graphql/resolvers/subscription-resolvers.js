import _ from 'lodash'
import { withFilter } from 'apollo-server-koa'
import pubsub from '../subscriptions/pubsub'
import { ECHO } from '../subscriptions/events'

export default modules => {
  const resolvers = {
    echo: {
      subscribe: () => pubsub.asyncIterator([ECHO])
    }
  }
  const resolverMap = modules.map(ctrl => {
    const { model } = ctrl
    const {
      modelName, gqlSchema, skipDefaultCRUDSchema, idField
    } = model
    const camelCaseModelName = _.camelCase(modelName)
    const resolversFromSchema = {}

    if (!_.isEmpty(gqlSchema) && !_.isEmpty(gqlSchema.subscriptions)) {
      gqlSchema.subscriptions.forEach(({ name, subscribe }) => {
        if (name && subscribe) {
          resolversFromSchema[name.toString()] = {
            subscribe: (() => {
              if (_.isObject(subscribe)) {
                const { event, filter } = subscribe
                if (filter) {
                  return withFilter(() => pubsub.asyncIterator(event), filter)
                }
                return () => pubsub.asyncIterator([event])
              }
              return () => pubsub.asyncIterator([subscribe])
            })()
          }
        }
      })
    }

    const { name } = idField || { name: 'id' }
    return skipDefaultCRUDSchema === true ? resolversFromSchema : {
      [`${camelCaseModelName}Created`]: {
        subscribe: () => pubsub.asyncIterator([`${_.snakeCase(modelName).toUpperCase()}_CREATED`])
      },
      [`${camelCaseModelName}Updated`]: {
        subscribe: withFilter(
          () => pubsub.asyncIterator(`${_.snakeCase(modelName).toUpperCase()}_UPDATED`),
          (payload, variables) => payload[`${camelCaseModelName}Updated`][name.toString()] === variables[name.toString()]
        )
      },
      [`${camelCaseModelName}Deleted`]: {
        subscribe: withFilter(
          () => pubsub.asyncIterator(`${_.snakeCase(modelName).toUpperCase()}_DELETED`),
          (payload, variables) => payload[`${camelCaseModelName}Deleted`][name.toString()] === variables[name.toString()]
        )
      },
      ...resolversFromSchema
    }
  })
  resolverMap.forEach(r => { Object.assign(resolvers, r) })
  return resolvers
}
/**
 *
 */
