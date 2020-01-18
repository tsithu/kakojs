import helmet from 'koa-helmet'

export default ({ app }) => {
  app.use(helmet())
}
