
const TABLE = 'users'

exports.seed = async knex => {
  await knex(TABLE).del()
  await knex.raw(`ALTER SEQUENCE ${TABLE}_id_seq RESTART WITH 1`)
  await knex(TABLE).insert([
    {
      name: 'Super Admin',
      email: 'suadmin@kakojs.org',
      password: '$2a$10$k2QUiX.3cjSAxvSgOq3KrOBvN1nmf3hcuNfk.PkOy4eEzJoT/bbCe', // suadmin
      is_active: true,
      created_by: 1,
      updated_by: 1
    }
  ])
  return Promise
}
