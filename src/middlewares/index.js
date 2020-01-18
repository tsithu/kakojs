import _ from 'lodash'
import session from './session'
import loggerProd from './logger'
import loggerDev from './dev-logger'
import responseTime from './response-time'
import cors from './cors'
import helmet from './helmet'
import lusca from './lusca'
// import ratelimit from './ratelimit'
import error from './error'
import response from './response'
import userAgent from './user-agent'
import bodyParser from './bodyparser'
import passport from './passport'
import routeGuard from './route-guard'
import compress from './compress'
import requestId from './request-id'
// import restApi from './rest-api'
import graphqlApi from './graphql-api'

export default payload => {
  const {
    app, config, database, middlewares: $middlewares
  } = payload
  const {
    api, isDevelopment, isProduction
  } = config
  const { graphql } = api
  const middlewares = [
    responseTime,
    error,
    requestId,
    [isDevelopment, loggerDev],
    [isProduction, loggerProd],
    // [isProduction, ratelimit],
    [isProduction, cors],
    session,
    [true, helmet],
    [isProduction === 'skip', lusca],
    compress,
    bodyParser,
    response,
    userAgent,
    passport,
    [true, routeGuard],
    // [rest, restApi],
    [graphql, graphqlApi],
    ...(_.isFunction($middlewares) ? $middlewares({ app, config, database }) : ($middlewares || []))
  ]
  const isActive = mw => {
    if (mw && _.isArray(mw) && mw.length === 2) {
      return _.isFunction(mw[0]) ? mw[0]() : (mw[0] || false)
    }
    return false
  }
  const servers = {}
  middlewares
    .map(mw => (_.isArray(mw) ? mw : [true, mw]))
    .filter(mw => isActive(mw))
    .forEach(mw => {
      const mwFn = mw[1]
      if (_.isFunction(mwFn)) {
        const rtn = mwFn(_.omit(payload, ['middlewares', 'modules']))
        if (rtn) {
          const { httpServer, apolloServer } = rtn
          if (httpServer) Object.assign(servers, { httpServer })
          if (apolloServer) Object.assign(servers, { apolloServer })
        }
      } else {
        $logger.error('Middleware should be function.', mwFn)
      }
    })
  return { app, ...servers }
}

// hpp | content-length-validator
// Shrinkwrap
