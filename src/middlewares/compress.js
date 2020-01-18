import compress from 'koa-compress'
import zlib from 'zlib'

export default ({ app }) => {
  app.use(compress({
    filter: contentType => /text/i.test(contentType),
    threshold: 2048,
    flush: zlib.Z_SYNC_FLUSH
  }))
}
