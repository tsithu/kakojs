import cors from '@koa/cors'

export default ({ app, config }) => {
  app.use(cors({
    origin: ctx => {
      const requestOrigin = ctx.accept.headers.origin
      const { whitelist } = config.cors
      if (!whitelist.includes(requestOrigin)) {
        ctx.forbidden(JSON.stringify(`${requestOrigin} is not a valid origin.`))
      }
      return requestOrigin
    },
    maxAge: 86400,
    credentials: true,
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    allowMethods: ['GET', 'POST', 'OPTIONS', 'HEAD'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    keepHeadersOnError: true
  }))
}
