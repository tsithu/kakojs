const TABLE = 'tokens'

exports.up = async knex => {
  await knex.schema.createTable(TABLE, table => {
    table.increments()
    table.integer('user_id').unsigned().references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .index()
    table.string('client').notNullable().index()
    table.string('access_token', 1000).notNullable().unique().index()
    table.string('refresh_token', 1000).notNullable().unique().index()
    table.string('strategy', 100).notNullable().index()
    table.boolean('is_revoked').defaultTo(false)
    table.integer('created_by').unsigned().notNullable().references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
    table.integer('updated_by').unsigned().notNullable().references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
    table.timestamps(true, true)
    table.unique(['user_id', 'client', 'strategy'])
  })

  await knex.schema.raw(`
      CREATE TRIGGER ${TABLE}_updated_at
      BEFORE UPDATE ON ${TABLE} FOR EACH ROW
      EXECUTE PROCEDURE set_current_timestamp_on_update();
    `)

  return Promise
}

exports.down = async knex => knex.schema.dropTable(TABLE)
