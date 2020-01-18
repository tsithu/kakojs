import _ from 'lodash'
import Knex from 'knex'
import { Model, knexSnakeCaseMappers } from 'objection'

export default ({ config, knexConfig }) => {
  const knex = Knex({
    ...(_.isFunction(knexConfig) ? knexConfig(config) : knexConfig),
    ...knexSnakeCaseMappers()
  })

  Model.knex(knex)
  return knex
}
