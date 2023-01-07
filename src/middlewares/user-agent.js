import { userAgent } from 'koa-useragent'

export default function ({ app }) {
  app.use(userAgent)
}
