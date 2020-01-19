export default {
  'koa-response-time': { hrtime: true },
  'koa-body': { multipart: true },
  'koa-compress': zlib => ({
    filter: contentType => /text/i.test(contentType),
    threshold: 2048,
    flush: zlib.Z_SYNC_FLUSH
  }),
  '@koa/cors': config => ({
    origin: ctx => {
      const requestOrigin = ctx.accept.headers.origin
      const { whitelist } = config.cors
      if (!whitelist.includes(requestOrigin)) {
        ctx.forbidden(JSON.stringify(`${requestOrigin} is not a valid origin.`))
      }
      return requestOrigin
    },
    maxAge: 86400,
    credentials: true,
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    allowMethods: ['GET', 'POST', 'OPTIONS', 'HEAD'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    keepHeadersOnError: true
  }),
  'koa-error': {
    accepts: ['json', 'text']
  }, // , 'html', 'text'
  'koa-requestid': {
    expose: 'X-Request-Id',
    header: 'X-Req-Id',
    query: 'request-id'
  },
  'koa-ratelimit': Redis => ({
    db: new Redis(),
    duration: 60000,
    errorMessage: 'Rate limit exceeded. You seem to be doing that a bit too much.',
    id: ctx => ctx.ip,
    headers: {
      remaining: 'Rate-Limit-Remaining',
      reset: 'Rate-Limit-Reset',
      total: 'Rate-Limit-Total'
    },
    max: 100,
    disableHeader: false
  }),
  'koa-session': {
    key: 'kako:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    // don't autoCommit because we need to control when headers are send
    autoCommit: false, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false,
    /** (boolean) Force a session identifier cookie to be set on every response.
     * The expiration is reset to the original maxAge, resetting the expiration countdown.
     * (default is false) */
    renew: true
    /** (boolean) renew session when session is nearly expired, so we can always
     * keep user logged in. (default is false) */
  },
  'koa-helmet': {},
  'koa-lusca': config => ({
    csrf: {
      key: 'csrf',
      header: 'X-CSRF-Token'
    },
    csp: {
      policy: {
        'default-src': "'self'",
        'script-src': "'self' maps.googleapis.com google-analytics.com",
        'img-src': "'self'",
        'font-src': "'self'",
        'media-src': "'self'",
        'frame-src': "'self'",
        'frame-ancestors': "'self'",
        'style-src': "'self' 'unsafe-inline'",
        'object-src': "'self'"
        /**
         * 'connect-src':
         * 'script-nonce':
         * 'plugin-types':
         * 'sandbox':
         * 'form-action':
         * 'reflected-xss':
         */
      },
      reportOnly: config.isDevelopment,
      reportUri: `https://${config.host}:${config.port}/csp/report`
    },
    referrerPolicy: 'same-origin',
    p3p: 'Work Suspended',
    hsts: { maxAge: 31536000, includeSubDomains: true },
    xssProtection: true
  }),
  'koa-respond': {},
  'koa-passport': {}
}
