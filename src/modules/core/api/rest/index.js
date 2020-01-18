import getRoutes from '$/modules/rest-modules'

export default ({ router, config }) => {
  const routes = getRoutes(router, config)
  routes.forEach(route => {
    route.setupRoutes()
  })
  // Setup Root Route
  router.get('/', ctx => {
    const data = routes.map(r => r.route)
    ctx.ok({ route: 'root', data })
  })
}
