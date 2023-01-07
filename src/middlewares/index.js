/* eslint-disable object-curly-newline */
import _ from 'lodash'
import session from './session'
import loggerProd from './logger'
import loggerDev from './dev-logger'
import responseTime from './response-time'
import cors from './cors'
import helmet from './helmet'
import lusca from './lusca'
import ratelimit from './ratelimit'
import error from './error'
import response from './response'
import userAgent from './user-agent'
import bodyParser from './bodyparser'
import passport from './passport'
import routeGuard from './route-guard'
import compress from './compress'
import requestId from './request-id'
import restApi from './rest-api'
import graphqlApi from './graphql-api'
import defaultOptions from './all-default-options'

export default payload => {
  const {
    app, config, database, middlewares
  } = payload
  const {
    api, isDevelopment, isProduction
  } = config
  const { rest, graphql } = api
  const buildInMiddlewares = [
    { name: 'koa-response-time', middleware: responseTime, options: defaultOptions['koa-response-time'] },
    { name: 'koa-error', middleware: error, options: defaultOptions['koa-error'] },
    { name: 'koa-requestid', middleware: requestId, options: defaultOptions['koa-requestid'] },
    { name: 'kako-dev-logger', middleware: loggerDev, disable: !isDevelopment },
    { name: 'kako-prod-logger', middleware: loggerProd, disable: !isProduction },
    { name: 'koa-ratelimit', middleware: ratelimit, disable: false, options: defaultOptions['koa-ratelimit'] },
    { name: '@koa/cors', middleware: cors, disable: !isDevelopment, options: defaultOptions['@koa/cors'] },
    { name: 'koa-session', middleware: session, options: defaultOptions['koa-session'] },
    { name: 'koa-helmet', middleware: helmet, options: defaultOptions['koa-helmet'] },
    { name: 'koa-lusca', middleware: lusca, disable: true, options: defaultOptions['koa-lusca'] },
    { name: 'koa-compress', middleware: compress, options: defaultOptions['koa-compress'] },
    { name: 'koa-body', middleware: bodyParser, options: defaultOptions['koa-body'] },
    { name: 'koa-respond', middleware: response, options: defaultOptions['koa-respond'] },
    { name: 'koa-useragent', middleware: userAgent },
    { name: 'koa-passport', middleware: passport, options: defaultOptions['koa-passport'] },
    { name: 'kako-route-guard', middleware: routeGuard },
    { name: 'kako-rest', middleware: restApi, disable: (_.isEmpty(rest) || rest === false) },
    { name: 'kako-graphql', middleware: graphqlApi, disable: (_.isEmpty(graphql) || graphql === false) }
  ]
  const isActive = mw => {
    if (!_.isEmpty(mw)) {
      return _.isFunction(mw.disable) ? !mw.disable(mw, config) : !(mw.disable || false)
    }
    return false
  }
  const $middlewares = _.isFunction(middlewares)
    ? middlewares({ middlewares: buildInMiddlewares, config, database })
    : [...buildInMiddlewares, ...middlewares]
  const returns = {}
  $middlewares
    .map(mw => (_.isFunction(mw) ? { name: mw.name || 'anonymous', middleware: mw } : mw))
    .filter(mw => isActive(mw))
    .forEach(mw => {
      const mwFn = mw.middleware.bind(mw)
      if (_.isFunction(mwFn)) {
        const rtn = mwFn(_.omit(payload, ['middlewares']))
        if (rtn) {
          const { httpServer, apolloServer } = rtn
          if (httpServer) Object.assign(returns, { httpServer })
          if (apolloServer) Object.assign(returns, { apolloServer })
        }
      } else {
        $logger.error('Middleware should be function.', mwFn)
      }
    })
  return { app, ...returns }
}
