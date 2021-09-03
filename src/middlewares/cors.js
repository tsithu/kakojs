import cors from '@koa/cors'

export default function ({ app, config }) {
  app.use(cors(this.options(config)))
}
