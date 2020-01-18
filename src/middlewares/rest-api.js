import Router from 'koa-router'
// import rest from '$/modules/core/api/rest'

export default ({ app, config }) => {
  // eslint-disable-next-line
  const setupRoutes = require('$/modules/core/api/rest').default
  const { api } = config
  const router = new Router({
    prefix: api.rest.baseUrl
  })
  setupRoutes({ router, config })
  app.use(router.routes())
  app.use(router.allowedMethods())
}
