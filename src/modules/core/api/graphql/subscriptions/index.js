/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken')

export default config => ({
  onConnect: (connectionParams, webSocket, context) => {
    const { appSecret } = config
    const { authorization } = connectionParams
    if (authorization) {
      const accessToken = authorization.replace('Bearer ', '')
      const { user } = jwt.verify(accessToken, appSecret)
      return { user }
    }
    // $logger.debug({ on: 'Connect', authorization })
    return null
  },
  onDisconnect: (webSocket, context) => {
    // $logger.debug({ on: 'Disconnect' })
    // ...
  }
})
