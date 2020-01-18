import bodyparser from 'koa-bodyparser'

export default ({ app }) => {
  app.use(bodyparser())
}
