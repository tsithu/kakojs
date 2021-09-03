import error from 'koa-error'

export default function ({ app }) {
  app.use(error(this.options))
}
