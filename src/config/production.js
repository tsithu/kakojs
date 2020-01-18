const { env } = process

export default {
  sqlDebug: false,
  isProduction: true,
  isApiOnly: false,
  api: {
    accessTokenKey: 'access-token',
    rest: false, // { baseUrl: '/api' },
    graphql: {
      baseUrl: '/graphql',
      depthLimit: { maxDepth: 7, options: {} },
      queryComplexity: false, // { maximumComplexity: 1000, variables: {} },
      validationComplexity: { complexityLimit: 1000 }
    }
  },
  cors: {
    whitelist: ['http://localhost:9090']
  },
  authentication: {
    strategies: ['local'],
    local: {
      entity: 'users',
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: false
      // session: false
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
    twitter: {},
    github: {
      clientID: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://kakojs.io/api/auth/login/github/callback',
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
}
