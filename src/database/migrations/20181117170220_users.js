exports.up = knex => knex.schema.createTable('users', table => {
  table.increments()
  table.boolean('is_editing').defaultTo(false)
  table
    .string('name', 250)
    .notNullable()
    .index()
  table
    .string('email', 150)
    .notNullable()
    .unique()
    .index()
  table.string('password', 300).notNullable()
  table
    .boolean('is_active')
    .defaultTo(false)
    .index()
  table
    .integer('created_by')
    .unsigned()
    .references('id')
    .inTable('users')
    .onDelete('CASCADE')
    .onUpdate('CASCADE')
  table
    .integer('updated_by')
    .unsigned()
    .references('id')
    .inTable('users')
    .onDelete('CASCADE')
    .onUpdate('CASCADE')
  table.timestamps(true, true)
})

exports.down = knex => knex.schema.dropTable('users')

// http://perkframework.com/v1/guides/database-migrations-knex.html
