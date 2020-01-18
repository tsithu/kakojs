import error from 'koa-error'

export default ({ app }) => {
  app.use(error({
    accepts: ['json'] // , 'html', 'text'
  }))
}
