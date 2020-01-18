import Koa from 'koa'
import applyMiddleware from '$/middlewares'
import initConfig from '$/config'
import initDatabase from '$/database/'
import initLogger from '$/shared/logger'

export default ({
  config, knexConfig, middlewares, modules
}) => {
  const app = new Koa()
  const $config = initConfig(config)
  const database = initDatabase({ config: $config, knexConfig })
  const {
    port, host, isTest, isProduction
  } = $config

  global.$logger = initLogger($config)

  const { httpServer, apolloServer } = applyMiddleware({
    app, config: $config, database, middlewares, modules
  })

  process.on('unhandledRejection', err => { $logger.error('Unhandled Rejection at: Promise.', err) })

  app.start = (isReady = true) => {
    if (!isTest && (isReady || isProduction)) {
      (httpServer || app).listen({ port, host }, () => {
        const info = { processId: process.pid, isApiOnly }
        if (apolloServer) {
          const { graphqlPath, subscriptionsPath } = apolloServer
          Object.assign(info, { graphqlPath, subscriptionsPath })
        }
        $logger.info(`Kako server is running at http://${host}:${port}.`)
        $logger.info(info)
      }).on('error', err => {
        $logger.error(err)
      })
    }
    return app
  }
  return app
}
