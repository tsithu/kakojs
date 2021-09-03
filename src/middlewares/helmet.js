import helmet from 'koa-helmet'

export default function ({ app }) {
  app.use(helmet(this.options))
}
