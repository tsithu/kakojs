import ratelimit from 'koa-ratelimit'
import Redis from 'ioredis'

export default ({ app }) => {
  // , config
  // const connection = config.isProduction : ''
  app.use(ratelimit({
    db: new Redis(),
    duration: 60000,
    errorMessage: 'Rate limit exceeded. You seem to be doing that a bit too much.',
    id: ctx => ctx.ip,
    headers: {
      remaining: 'Rate-Limit-Remaining',
      reset: 'Rate-Limit-Reset',
      total: 'Rate-Limit-Total'
    },
    max: 100,
    disableHeader: false
  }))
}
