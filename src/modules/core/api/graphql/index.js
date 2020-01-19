
import _ from 'lodash'
import getTypeDefs from './type-defs'
import getResolvers from './resolvers'
import getSubscriptions from './subscriptions'
import getSchemaDirectives from './directives'
import getModules from '$/modules/graphql-modules'
import getLoaders from './loaders'
import getValidationRules from './validation-rules'

export default ctx => {
  const { config, modules } = ctx
  const buildInModules = getModules(config)
  const $modules = (_.isFunction(modules)
    ? modules({ config, modules: buildInModules, apiType: 'graphql' })
    : [...buildInModules, ...(modules || [])])
    .filter(m => _.isEmpty(m.router))

  const typeDefs = getTypeDefs($modules)
  const resolvers = getResolvers($modules)
  const subscriptions = getSubscriptions(config)
  const schemaDirectives = getSchemaDirectives($modules)
  const loaders = getLoaders($modules)
  const validationRules = getValidationRules(config.api)
  const resolverValidationOptions = {
    requireResolversForResolveType: false
  }

  return {
    typeDefs, resolvers, subscriptions, resolverValidationOptions, schemaDirectives, loaders, validationRules
  }
}
