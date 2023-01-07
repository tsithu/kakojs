import development from '$/config/development'
import production from '$/config/production'

const { env } = process
const configs = { development, production }

const $config = configs[env.NODE_ENV]
const $env = {
  currentEnv: env.NODE_ENV,
  dbHostName: env.DB_HOSTNAME,
  dbPort: env.DB_PORT,
  dbName: env.DB_NAME,
  dbUser: env.DB_USER,
  dbPassword: env.DB_PASSWORD,
  appKey: env.APP_KEY,
  appSecret: env.APP_SECRET,
  appSecrets: (env.APP_SECRETS || 'KEteWS74wV^xgOr$PF%DySCt||a1rPU1B!9taf6A^!g^Nf||BP6CQTr1C@8yr*Igwfgq').split('||'),
  host: (env.HOST || 'localhost'),
  port: (env.PORT || 9090)
}

export default { ...$env, ...$config }
