
const TABLE = 'tenants'

exports.seed = async knex => {
  await knex(TABLE).del()
  await knex.raw(`ALTER SEQUENCE ${TABLE}_id_seq RESTART WITH 1`)
  await knex(TABLE).insert([
    {
      name: 'KaKoJS',
      code: 'kakojs',
      description: 'KakoJS',
      domain: 'kakojs.org',
      owner_id: 1,
      status: 'Active',
      is_active: true,
      created_by: 1,
      updated_by: 1
    }
  ])
  return Promise
}
