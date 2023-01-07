import jwt from 'jsonwebtoken'
import Cryptr from 'cryptr'
import { TokenModel, TokenController } from '$/modules/token'
import { AuthModel, AuthController } from '$/modules/auth'

function removeFromCookies (cookies, key) {
  cookies.set(key)
}

export default (config, loaders) => (
  async ({ ctx, connection }) => {
    if (connection) return connection.context
    const { appSecret, api, isProduction } = config
    const { request, cookies } = ctx
    const { header } = request
    if (header) {
      const { authorization } = header
      if (authorization) {
        const KEY_ACCESS_TOKEN = api.accessTokenKey
        const accessToken = authorization.replace('Bearer ', '')
        const authCtrl = new AuthController(AuthModel, config)
        const client = authCtrl.getClient(ctx)
        const cryptr = new Cryptr(appSecret)
        try {
          const { user: currentUser, sub } = jwt.verify(accessToken, appSecret)
          if (client === cryptr.decrypt(sub)) {
            return { user: currentUser, loaders, ...ctx }
          }
        } catch ({ name, message }) {
          if (name === 'TokenExpiredError') {
            const tokenCtrl = new TokenController(TokenModel, config)
            const { user, sub, strategy } = jwt.verify(accessToken, appSecret, { ignoreExpiration: true })
            const token = await tokenCtrl.findOne({
              userId: { eq: user.id },
              client: { eq: cryptr.decrypt(sub) },
              strategy: { eq: strategy },
              accessToken: { eq: accessToken },
              isRevoked: { ne: true }
            })
            const { id: tokenId, refreshToken } = token || {}
            if (accessToken && refreshToken) {
              try {
                const { user: currentUser } = jwt.verify(refreshToken, appSecret)
                const newAccessToken = authCtrl.generateToken(user, sub, strategy)
                await tokenCtrl.patchById(tokenId, { accessToken: newAccessToken })
                cookies.set(KEY_ACCESS_TOKEN, newAccessToken, {
                  httpOnly: false, maxAge: (1000 * 60 * 60 * 24), signed: isProduction
                })
                return { user: currentUser, loaders, ...ctx }
              } catch (err) {
                await tokenCtrl.deleteByFilter({
                  client: { eq: client },
                  accessToken: { eq: accessToken }
                })
                removeFromCookies(cookies, KEY_ACCESS_TOKEN)
              }
            } else if (accessToken) {
              await tokenCtrl.deleteByFilter({
                client: { eq: client },
                accessToken: { eq: accessToken }
              })
              removeFromCookies(cookies, KEY_ACCESS_TOKEN)
            }
          } else {
            $logger.error({ name, message })
          }
        }
      }
    }
    return { loaders, ...ctx }
  }
)
