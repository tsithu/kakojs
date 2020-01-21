import app from '$/app'
import Model from '$/modules/core/base/model'
import Controller from '$/modules/core/base/controller'
import Route from '$/modules/core/base/route'
import services from '$/services'
import initLogger from '$/shared/logger'

export default app
export const kako = app
export const KakoModel = Model
export const KakoController = Controller
export const KakoRoute = Route
export const loadServices = services
export const kakoLogger = initLogger({ isProduction: process.env.NODE_ENV === 'production' })
