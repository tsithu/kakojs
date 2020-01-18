import dotenv from 'dotenv'
import kako from '$/index'
import appConfig from ':src/config/development'
import knexConfig from ':/knexfile'
import restApi from '$/middlewares/rest-api'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

kako({
  config: appConfig(process.env),
  knexConfig: config => knexConfig(config),
  middlewares: [
    [true, restApi]
  ]
  // modules: $config => []
}).start()
