import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'

export default payload => {
  const { passport, config, database } = payload
  const { authentication } = config
  const { userTable, local } = authentication
  const options = local
  const comparePassword = async (inputPwd, dbPwd) => bcrypt.compare(inputPwd, dbPwd)
  const verify = async (username, password, done) => {
    try {
      const user = await database(userTable || 'users')
        .where({ [options.usernameField]: username }).first()

      if (!user) {
        return done(null, false, { message: 'User not found' })
      }

      const dbPassword = user[options.passwordField]
      const isValidPassword = await comparePassword(password, dbPassword)

      if (!isValidPassword) {
        return done(null, false, { message: 'Wrong Password' })
      }

      delete user[options.passwordField]

      return done(null, user, { message: 'Logged in Successfully' })
    } catch (err) {
      $logger.error(err)
      return done(err)
    }
  }
  passport.use(new LocalStrategy(options, verify))
}
