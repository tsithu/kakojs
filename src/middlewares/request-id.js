import requestId from 'koa-requestid'

export default function ({ app }) {
  app.use(requestId(this.options))
}
