export default env => ({
  sqlDebug: false,
  isDevelopment: true,
  isApiOnly: false,
  api: {
    accessTokenKey: 'access-token',
    rest: { baseUrl: '/api' },
    graphql: {
      baseUrl: '/graphql',
      depthLimit: { maxDepth: 7, options: {} },
      queryComplexity: false, // { maximumComplexity: 5000, variables: {} },
      validationComplexity: { complexityLimit: 1000 }
    }
  },
  cors: {
    whitelist: ['http://localhost:9090']
  },
  authentication: {
    userTable: 'users',
    strategies: ['local', 'jwt', 'github'],
    local: {
      usernameField: 'email',
      passwordField: 'password'
    },
    jwt: {
      entity: 'tokens',
      jsonWebTokenOptions: {
        audience: 'https://kakojs.io',
        issuer: 'kakojs.io',
        algorithm: 'HS256',
        expiresIn: { accessToken: '1h', refreshToken: '30d' }
      }
    },
    google: {
      clientID: 'your google client id',
      clientSecret: 'your google client secret',
      successRedirect: '/',
      scope: [
        'profile openid email'
      ]
    },
    facebook: {
      clientID: 'your facebook client id',
      clientSecret: 'your facebook client secret',
      successRedirect: '/',
      scope: [
        'public_profile',
        'email'
      ],
      profileFields: [
        'id',
        'displayName',
        'first_name',
        'last_name',
        'email',
        'gender',
        'profileUrl',
        'birthday',
        'picture',
        'permissions'
      ]
    },
    twitter: {

    },
    github: {
      clientID: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:9000/api/auth/login/github/callback',
      scope: [
        'public_profile',
        'email'
      ]
    }
  },
  paginate: {
    defaultPageSize: 100,
    maxPageSize: 500
  }
})
