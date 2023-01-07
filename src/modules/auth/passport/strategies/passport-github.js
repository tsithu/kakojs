import { Strategy as GitHubStrategy } from 'passport-github'
// import UserModel from '$/modules/user/model'

export default payload => {
  const { passport, config, database } = payload
  const { userTable, authentication } = config
  const { github, local } = authentication
  const options = github
  const verify = async (accessToken, refreshToken, profile, done) => {
    try {
      // TODO: Find or Create
      // https://www.djamware.com/post/59a6257180aca768e4d2b132/node-express-passport-facebook-twitter-google-github-login
      const user = await database(userTable || 'users')
        .where({ githubId: profile.id })
        .first()
      if (!user) {
        return done(null, false)
      }
      delete user[local.passwordField]
      return done(null, user)
    } catch (err) {
      $logger.error(err)
      return done(err)
    }
  }
  passport.use(new GitHubStrategy(options, verify))
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
