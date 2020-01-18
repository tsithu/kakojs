import requestId from 'koa-requestid'

export default ({ app }) => {
  app.use(requestId({
    expose: 'X-Request-Id',
    header: 'X-Req-Id',
    query: 'request-id'
  }))
}
