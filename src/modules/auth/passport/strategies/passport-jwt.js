import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
// import UserModel from '$/modules/user/model'

export default payload => {
  const { passport, config, database } = payload
  const { appSecret, authentication } = config
  const { userTable, jwt, local } = authentication
  const options = {
    secretOrKey: appSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ...jwt
  }

  const verify = async (jwtPayload, done) => {
    try {
      const { uid } = jwtPayload
      const user = await database(userTable || 'users').where({ id: uid }).first()
      if (user) {
        delete user[local.passwordField]
        return done(null, user)
      }
      return done(null, false)
    } catch (err) {
      $logger.error(err)
      return done(err)
    }
  }
  passport.use(new JwtStrategy(options, verify))
}

/*

const opts = {}

opts.secretOrKey = 'secret'
opts.issuer = 'accounts.examplesoft.com'
opts.audience = 'yoursite.net'
passport.use()

// https://github.com/rkusa/koa-passport
new JwtStrategy(opts, ((jwt_payload, done) => {
  User.findOne({ id: jwt_payload.sub }, (err, user) => {
    if (err) {
      return done(err, false)
    }
    if (user) {
      return done(null, user)
    }
    return done(null, false)
    // or you could create a new account
  })
}))
passport.use(new LocalStrategy(localOptions, async (username, password, done) => {
    try {
      const user = await database(localOptions.entity)
        .where({ [localOptions.usernameField]: username })
        .first()
      const dbPassword = user[localOptions.passwordField]

      delete user[localOptions.passwordField]

      if (!user) {
        return done(null, false) // { msg: 'User doesnot exist.' }
      }
      if (isValidPassword(password, dbPassword)) {
        return done(null, user)
      }
      return done(null, false) // { msg: Wrong Password }
    } catch (err) {
      $logger.error(err)
      return done(err)
    }
  }))
*/
