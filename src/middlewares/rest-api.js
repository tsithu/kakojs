import Router from '@koa/router'

export default ({ app, config, modules }) => {
  // eslint-disable-next-line
  const loadModules = require('$/modules/core/api/rest').default
  const { api } = config
  const router = new Router({
    prefix: api.rest.baseUrl
  })
  loadModules({ router, config, modules })
  app.use(router.routes())
  app.use(router.allowedMethods())

  return { router }
}
