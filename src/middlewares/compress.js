import compress from 'koa-compress'
import zlib from 'zlib'

export default function ({ app }) {
  app.use(compress(this.options(zlib)))
}
