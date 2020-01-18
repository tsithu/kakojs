import chalk from 'chalk'

export default ({ app }) => {
  const colorName = ({ statusCode }) => {
    if (statusCode < 300) {
      return 'green'
    }
    if (statusCode < 400) {
      return 'yellow'
    }
    if (statusCode < 500) {
      return 'red'
    }
    if (statusCode >= 500) {
      return 'bgRedBright'
    }
    return 'blue'
  }
  app.use(async (ctx, next) => {
    try {
      const start = Date.now()
      await next()
      const ms = Date.now() - start
      const statusCode = `[${ctx.res.statusCode}]`
      $logger.info(`${chalk[colorName(ctx.res)](statusCode)} ${chalk.blue(ctx.method)} ${ctx.url} - ${ms}ms`)
    } catch (err) {
      $logger.error(err)
      throw err
    }
  })
}
