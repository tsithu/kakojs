import session from 'koa-session'

export default ({ app, config }) => {
  const { appSecrets } = config
  const options = {
    key: 'vkano:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    // don't autoCommit because we need to control when headers are send
    autoCommit: false, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false,
    /** (boolean) Force a session identifier cookie to be set on every response.
     * The expiration is reset to the original maxAge, resetting the expiration countdown.
     * (default is false) */
    renew: true
    /** (boolean) renew session when session is nearly expired, so we can always
     * keep user logged in. (default is false) */
  }
  delete config.appSecrets
  app.keys = appSecrets
  app.use(session(options, app))

  // https://github.com/Hiswe/koa-nuxt
  app.use(async (ctx, next) => {
    ctx.session.now = new Date().valueOf()
    // ensure headers are sent before nuxt
    await ctx.session.manuallyCommit()
    // nuxt render can be safely be done after that
    await next()
  })
}
