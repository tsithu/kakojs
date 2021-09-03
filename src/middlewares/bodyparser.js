import koaBody from 'koa-body'

export default function ({ app }) {
  app.use(koaBody(this.options))
}
