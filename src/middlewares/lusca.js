import lusca from 'koa-lusca'
import convert from 'koa-convert'

export default ({ app, config }) => {
  const { host, port, isDevelopment } = config
  app.use(convert(lusca({
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
      reportOnly: isDevelopment,
      reportUri: `https://${host}:${port}/csp/report`
    },
    referrerPolicy: 'same-origin',
    p3p: 'Work Suspended',
    hsts: { maxAge: 31536000, includeSubDomains: true },
    xssProtection: true
  })))
}
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/img-src
