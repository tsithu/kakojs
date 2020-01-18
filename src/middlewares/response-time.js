import responseTime from 'koa-response-time'

export default function ({ app }) {
  app.use(responseTime(this.options))
}
