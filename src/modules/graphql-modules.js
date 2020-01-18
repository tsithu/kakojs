import { AuthModel, AuthController } from '$/modules/auth'
import { UserModel, UserController } from '$/modules/user'

export default config => [
  new AuthController(AuthModel, config),
  new UserController(UserModel, config)
]
