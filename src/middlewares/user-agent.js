import { userAgent } from 'koa-useragent'

export default ({ app }) => {
  app.use(userAgent)
}
