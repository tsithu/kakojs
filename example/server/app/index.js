import { kako, initLogger } from 'kakojs'
import config from '$/config'
import knexConfig from ':/knexfile'
import middlewares from '$/middlewares'
import modLoader from '$/modules'

global.$logger = initLogger({ name: 'GM+', isProduction: process.env.NODE_ENV === 'production' })

const app = kako({
  config,
  knexConfig,
  middlewares,
  modules: ({ router }) => (router ? modLoader.rest(config, router) : modLoader.graphql(config))
})

export default app
