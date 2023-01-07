import ratelimit from 'koa-ratelimit'
import Redis from 'ioredis'

export default function ({ app }) {
  app.use(ratelimit(this.options(Redis)))
}
