import _ from 'lodash'
import pubsub from '../subscriptions/pubsub'

export default modules => {
  const resolvers = {
    node: async (root, args) => {
      // console.log('root', root)
      // console.log('args', args)
      const { __typename, id } = args.id
      // console.log(__typename, id)
      const Controller = _.find(modules, mod => mod.constructor.name === `${__typename}Controller`)
      const node = await Controller.findOneById(id)
      return {
        ...node,
        __typename
      }
    }
  }
  const resolverMap = modules.map(ctrl => {
    const { model, loader, loaderName } = ctrl
    const {
      modelName, pluralModelName, gqlSchema, skipDefaultCRUDSchema
    } = model
    const camelCaseModelName = _.camelCase(modelName)
    const resolversFromSchema = {}
    if (!_.isEmpty(gqlSchema) && !_.isEmpty(gqlSchema.queries)) {
      gqlSchema.queries.forEach(({ name, resolver }) => {
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
    if (skipDefaultCRUDSchema === true) {
      return resolversFromSchema
    }
    return {
      [`all${pluralModelName}`]: async (root, {
        offset, first, orderBy, filter
      }) => {
        const { total, results } = await ctrl.index(first, offset, orderBy, filter)
        return { totalCount: total, nodes: results }
      },
      [`${camelCaseModelName}ById`]: (root, { id }, { loaders }) => loaders[loaderName.toString()].byID.load(id),
      // TODO: implement later
      [`${camelCaseModelName}`]: () => null,
      ...resolversFromSchema
    }
  })
  resolverMap.forEach(r => { Object.assign(resolvers, r) })
  return resolvers
}
