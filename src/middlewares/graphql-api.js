/* eslint-disable global-require */

export default function (payload) {
  const { ApolloServer, defaultPlaygroundOptions } = require('apollo-server-koa')
  const { createServer } = require('http')
  const schemas = require('$/modules/core/api/graphql').default
  const contextFn = require('$/modules/core/api/graphql/context.js').default
  const { app, config } = payload // , database
  const { api, isDevelopment } = config
  const { graphql } = api
  const {
    typeDefs, resolvers, subscriptions, resolverValidationOptions,
    schemaDirectives, validationRules, loaders
  } = schemas(payload)

  const playgroundOptions = {
    settings: {
      ...defaultPlaygroundOptions.settings,
      'request.credentials': 'same-origin'
    }
  }

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions,
    schemaDirectives,
    resolverValidationOptions,
    validationRules,
    introspection: isDevelopment,
    playground: isDevelopment ? playgroundOptions : false,
    debug: isDevelopment,
    context: contextFn(config, loaders)
  })
  apolloServer.applyMiddleware({
    app,
    path: graphql.baseUrl,
    cors: false,
    bodyParserConfig: false
    /* ,
    disableHealthCheck: true,
    onHealthCheck: ctx => {
      console.log(ctx)
    }
    */
  })
  const httpServer = createServer(app.callback())
  apolloServer.installSubscriptionHandlers(httpServer)

  return { httpServer, apolloServer }
}
