import dotenv from 'dotenv'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

import('./server')
  .catch(err => {
    console.error(err)
    process.exit(-1)
  })
