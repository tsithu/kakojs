import pluralize from 'pluralize'

export default class BaseRoute {
  constructor (controller, router, config) {
    this.controller = controller
    this.router = router
    this.config = config || controller.config
  }

  /*
  get prefix () {
    return this.route
  }
  */
  get route () {
    return `/${this.pluralRouteName.toLowerCase()}`
  }

  get pluralRouteName () {
    return pluralize.plural(this.constructor.name.replace('Route', ''))
  }

  get singularRouteName () {
    return pluralize.singular(this.constructor.name.replace('Route', ''))
  }

  setupRoutes () {
    this.index()
    this.getById()
  }

  index () {
    this.router.get(this.route, async ctx => {
      try {
        const items = await this.controller.index()
        ctx.ok(items)
      } catch (err) {
        ctx.internalServerError(err)
      }
    })
  }

  getById () {
    const url = `${this.route}/:id`
    this.router.get(url, async ctx => {
      const { id } = ctx.params
      const record = await this.controller.findById(id)
      ctx.ok(record)
    })
  }
}
