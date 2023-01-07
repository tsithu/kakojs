import lusca from 'koa-lusca'
import convert from 'koa-convert'

export default function ({ app, config }) {
  app.use(convert(lusca(this.options(config))))
}
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/img-src
