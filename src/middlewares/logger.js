import logger from 'koa-pino-logger'

export default ({ app }) => {
  app.silent = false
  app.use(logger({ logger: global.$logger }))
}
