import dotenv from 'dotenv'
import kako from '$/index'
import appConfig from ':src/config/development'
import knexConfig from ':/knexfile'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

kako({
  config: appConfig(process.env),
  knexConfig: config => knexConfig(config),
  middlewares: ctx => {
    const { middlewares } = ctx // config, database
    return middlewares
  },
  modules: ctx => {
    const { modules } = ctx
    return modules
  }
}).start()
