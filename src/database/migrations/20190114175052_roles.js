const TABLE = 'roles'

exports.up = async knex => {
  await knex.schema.createTable(TABLE, table => {
    table.increments()
    table.boolean('is_editing').defaultTo(false)
    table.string('name', 200).notNullable().unique().index()
    table.string('code', 200).notNullable().unique().index()
    table.string('description', 500)
    table.specificType('permissions', 'INT[]')
    table.boolean('is_active').defaultTo(false).index()
    table.integer('created_by').unsigned().notNullable().references('id')
      .inTable('users')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE')
    table.integer('updated_by').unsigned().notNullable().references('id')
      .inTable('users')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE')
    table.timestamps(true, true)
  })

  await knex.schema.raw(`
    CREATE TRIGGER ${TABLE}_updated_at
    BEFORE UPDATE ON ${TABLE} FOR EACH ROW
    EXECUTE PROCEDURE set_current_timestamp_on_update();
  `)

  return Promise
}

exports.down = async knex => knex.schema.dropTable(TABLE)
