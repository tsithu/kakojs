module.exports = $config => {
  const {
    currentEnv, dbHostName, dbPort, dbName, dbUser, dbPassword, sqlDebug
  } = $config
  const knexConfig = {
    development: {
      debug: sqlDebug,
      client: 'postgresql',
      connection: {
        host: dbHostName,
        port: dbPort,
        database: dbName,
        user: dbUser,
        password: dbPassword
      },
      pool: {
        min: 5,
        max: 30
      },
      acquireConnectionTimeout: 60000,
      migrations: {
        directory: './server/database/migrations',
        tableName: 'knex_migrations'
      },
      seeds: {
        directory: './server/database/seeds'
      }
    },
    staging: {
      client: 'postgresql',
      connection: {
        host: dbHostName,
        port: dbPort,
        database: dbName,
        user: dbUser,
        password: dbPassword
      },
      pool: {
        min: 5,
        max: 30
      },
      migrations: {
        directory: './server/database/migrations',
        tableName: 'knex_migrations'
      },
      seeds: {
        directory: './server/database/seeds'
      }
    },
    production: {
      client: 'postgresql',
      connection: {
        host: dbHostName,
        port: dbPort,
        database: dbName,
        user: dbUser,
        password: dbPassword
      },
      pool: {
        min: 5,
        max: 20
      },
      acquireConnectionTimeout: 60000,
      migrations: {
        directory: './server/database/migrations',
        tableName: 'knex_migrations'
      },
      seeds: {
        directory: './server/database/seeds'
      }
    },

    test: {
      client: 'postgresql',
      connection: {
        host: dbHostName,
        database: dbName,
        user: dbUser,
        password: dbPassword
      },
      migrations: {
        directory: './server/database/migrations',
        tableName: 'knex_migrations'
      },
      seeds: {
        directory: './server/database/seeds'
      }
    }
  }

  delete $config.dbHostName
  delete $config.dbName
  delete $config.dbUser
  delete $config.dbPassword

  return knexConfig[currentEnv.toString()]
}
