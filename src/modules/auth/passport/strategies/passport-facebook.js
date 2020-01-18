/*
passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
},
((accessToken, refreshToken, profile, cb) => {
  User.findOrCreate({ facebookId: profile.id }, (err, user) => cb(err, user))
})))
*/
