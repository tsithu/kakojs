import { Builder, Nuxt } from 'nuxt'
import nuxtConfig from ':/nuxt.config'

export default ({ app, config }) => {
  const { isDevelopment } = config
  const nuxt = new Nuxt({
    ...nuxtConfig,
    ...{ dev: isDevelopment }
  })

  if (isDevelopment) {
    const NUXT_BUILD_DONE = 'nuxt:build:done'
    const builder = new Builder(nuxt)
    builder.build()
      .then(() => process.emit(NUXT_BUILD_DONE))
      .catch(error => {
        $logger.error(error)
        process.exit(1)
      })

    process.on(NUXT_BUILD_DONE, err => {
      if (err) {
        $logger.error('Nuxt:Build Error:', err)
        process.exit(-1)
      } else {
        app.start()
      }
    })
  }

  app.use(ctx => {
    ctx.status = 200
    ctx.respond = false
    ctx.req.ctx = ctx
    // ctx.res.csrf = ctx.csrf
    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, promise => {
        promise.then(resolve).catch(reject)
      })
    })
  })
}
