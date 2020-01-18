export default $config => {
  const { env } = process

  const $env = {
    get currentEnv () {
      return env.NODE_ENV
    },
    get dbHostName () {
      return env.DB_HOSTNAME
    },
    get dbPort () {
      return env.DB_PORT
    },
    get dbName () {
      return env.DB_NAME
    },
    get dbUser () {
      return env.DB_USER
    },
    get dbPassword () {
      return env.DB_PASSWORD
    },
    get appKey () {
      return env.APP_KEY
    },
    get appSecret () {
      return env.APP_SECRET
    },
    get appSecrets () {
      return (env.APP_SECRETS || 'KEteWS74wV^xgOr$PF%DySCt||a1rPU1B!9taf6A^!g^Nf||BP6CQTr1C@8yr*Igwfgq').split('||')
    },
    get host () {
      return env.HOST || 'localhost'
    },
    get port () {
      return env.PORT || 9000
    }
  }
  return { ...$env, ...$config }
}
