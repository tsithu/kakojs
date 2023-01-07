import passport from 'koa-passport'
import _ from 'lodash'
import BaseRoute from '$/modules/core/base/route'

export default class AuthRoute extends BaseRoute {
  get route () {
    return '/auth' || this.route
  }

  init () {
    // call it only when you need default routes
    // super.init()
    this.login()
    this.register()
    this.logout()
  }

  static get returnAuthState () {
    return ctx => {
      if (ctx.isAuthenticated()) {
        ctx.ok(this.controller.getAuthResponse(ctx.state.user))
      } else {
        ctx.unauthorized()
      }
    }
  }

  login () {
    this.router.post('/auth/login',
      ctx => ctx.redirect('/auth/login/local'))

    this.router.post('/auth/login/local',
      passport.authenticate('local'),
      async ctx => {
        const { user } = ctx.state
        if (!user) {
          ctx.unauthorized()
        } else {
          ctx.ok(this.controller.getAuth(user))
        }
      })

    this.router.post('/auth/login/jwt',
      passport.authenticate('jwt', { session: false }),
      AuthRoute.returnAuthState)

    this.router.get('/auth/login/:strategy', ctx => {
      const { authentication } = this.config
      const { strategy } = ctx.params
      const { scope } = authentication[_.camelCase(strategy)]
      return passport.authenticate(strategy, { scope })(ctx)
    })

    // this.router.get('/auth/login/github/callback', passport.authenticate('github'),
    // AuthRoute.returnAuthState)

    this.router.get('/auth/login/:socialSignin/callback', async ctx => {
      const { socialSignin } = ctx.params
      return passport.authenticate(socialSignin, (err, user) => {
        if (!err) {
          ctx.login(user)
          AuthRoute.returnAuthState(ctx)
        } else {
          ctx.badRequest(err)
        }
      })(ctx)
    })
  }

  logout () {
    this.router.get('/auth/logout', async ctx => {
      if (!ctx.isAuthenticated()) {
        ctx.unauthorized()
      } else {
        ctx.logout()
        ctx.ok()
      }
    })
  }

  register () {
    this.router.post('/auth/register', async ctx => passport.authenticate('local', (err, user) => {
      // info, status
      if (user) {
        ctx.login(user)
        ctx.redirect('/auth/status')
      } else {
        ctx.status = 400
        ctx.body = { status: 'error' }
      }
    })(ctx))
  }
}
