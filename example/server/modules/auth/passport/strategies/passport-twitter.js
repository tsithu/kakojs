/*
export default (passport, authController) => {
  const TwitterStrategy = require('passport-twitter').Strategy
  passport.use(new TwitterStrategy({
    consumerKey: 'your-consumer-key',
    consumerSecret: 'your-secret',
    callbackURL: `http://localhost:${process.env.PORT || 3000}/auth/twitter/callback`
  },
  ((token, tokenSecret, profile, done) => {
    // retrieve user ...
    fetchUser().then(user => done(null, user))
  })))
}
*/
