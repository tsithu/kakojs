import _ from 'lodash'
import getModules from '$/modules/rest-modules'

export default ({ router, config, modules }) => {
  const buildInModules = getModules(router, config)
  const $modules = _.isFunction(modules)
    ? modules({ config, modules: buildInModules })
    : [...buildInModules, ...(modules || [])]

  $modules.forEach(mod => {
    mod.setupRoutes()
  })
  // Setup Root Route
  router.get('/', ctx => {
    const data = $modules.map(mod => mod.route)
    ctx.ok({ route: 'root', data })
  })
}
