import passport from 'koa-passport'

export default ({ app, config, database }) => {
  const { authentication } = config
  const { userTable, strategies } = authentication

  passport.serializeUser((user, done) => { done(null, user.id) })
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await database(userTable || 'users').where({ id }).first()
      done(null, user)
    } catch (err) {
      $logger.error(err)
      done(err)
    }
  })

  strategies.forEach(strategy => {
    try {
      if (authentication[strategy.toString()]) {
        // eslint-disable-next-line
        const initStrategy = require(`./../modules/auth/passport/strategies/passport-${strategy}`).default
        initStrategy({ passport, config, database })
      } else {
        $logger.error(`Passport strategy (${strategy}) is not implemented yet.`)
      }
    } catch (err) {
      $logger.error(err)
    }
  })

  app.use(passport.initialize())
  app.use(passport.session())
}
