import { AuthRoute, AuthController } from '$/modules/auth'
import { UserRoute, UserModel, UserController } from '$/modules/user'
import { TenantRoute, TenantModel, TenantController } from '$/modules/tenant'

export default (config, router) => ([
  new AuthRoute(new AuthController(UserModel, config), router),
  new UserRoute(new UserController(UserModel, config), router),
  new TenantRoute(new TenantController(TenantModel, config), router)
])
