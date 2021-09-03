import { AuthModel, AuthController } from '$/modules/auth'
import { UserModel, UserController } from '$/modules/user'
import { TenantModel, TenantController } from '$/modules/tenant'

export default config => [
  new AuthController(AuthModel, config),
  new UserController(UserModel, config),
  new TenantController(TenantModel, config)
]
