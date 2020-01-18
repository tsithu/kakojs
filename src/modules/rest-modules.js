import { AuthRoute, AuthController } from '$/modules/auth'
import { UserRoute, UserModel, UserController } from '$/modules/user'

export default (router, config) => [
  new AuthRoute(new AuthController(UserModel, config), router),
  new UserRoute(new UserController(UserModel, config), router)
]
