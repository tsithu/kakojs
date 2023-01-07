import session from 'koa-session'

export default function ({ app, config }) {
  const { appSecrets } = config
  delete config.appSecrets
  app.keys = appSecrets
  app.use(session(this.options, app))

  // https://github.com/Hiswe/koa-nuxt
  app.use(async (ctx, next) => {
    ctx.session.now = new Date().valueOf()
    // ensure headers are sent before nuxt
    await ctx.session.manuallyCommit()
    // nuxt render can be safely be done after that
    await next()
  })
}
