import dotenv from 'dotenv'
import supertest from 'supertest'
import kako from ':'
import appConfig from '$/config/development'
import knexConfig from ':/knexfile'

dotenv.config({ path: '.env.development' })

describe('Core', () => {
  let server = kako({
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
  })
  let request

  beforeAll(done => {
    server = server.listen(done)
    request = supertest(server)
  })

  afterAll(done => {
    server.close(done)
  })

  describe('Rest API Root: GET=>/api', () => {
    test('Should respond as expected.', async () => {
      const response = await request.get('/api')
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(response.body.route).toEqual('root')
    })
  })

  describe('GraphQL API Root: GET=>/graphql', () => {
    test('Should respond as expected.', async () => {
      const response = await request.get('/graphql')
      expect(response.status).toEqual(400)
      expect(response.type).toEqual('text/plain')
    })
  })
})
