import pluralize from 'pluralize'

export default class BaseRoute {
  constructor (controller, router, config) {
    this.controller = controller
    this.router = router
    this.config = config || controller.config
  }

  get route () {
    return `/${this.pluralRouteName.toLowerCase()}`
  }

  get pluralRouteName () {
    return pluralize.plural(this.constructor.name.replace('Route', ''))
  }

  get singularRouteName () {
    return pluralize.singular(this.constructor.name.replace('Route', ''))
  }

  init () {
    this.index()
    this.find()
    this.findOne()
    this.findLast()
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

  find () {
    const url = `${this.route}`
    this.router.post(url, async ctx => {
      try {
        const { request } = ctx
        const {
          first, offset, orderBy, filter
        } = request.body
        const items = await this.controller.find(first, offset, orderBy, filter)
        ctx.ok(items)
      } catch (err) {
        ctx.internalServerError(err)
      }
    })
  }

  findOne () {
    this.router.post(
      ['one', 'first', 'find-one', 'find-first'].map(p => `${this.route}/${p}`),
      async ctx => {
        try {
          const { request } = ctx
          const { filter, orderBy } = request.body
          const item = await this.controller.findOne(filter, orderBy)
          ctx.ok(item)
        } catch (err) {
          ctx.internalServerError(err)
        }
      }
    )
  }

  findLast () {
    this.router.post(
      ['last', 'find-last'].map(p => `${this.route}/${p}`),
      async ctx => {
        try {
          const { request } = ctx
          const { filter, orderBy } = request.body
          const item = await this.controller.findLast(filter, orderBy)
          ctx.ok(item)
        } catch (err) {
          ctx.internalServerError(err)
        }
      }
    )
  }
}
