import app from '$/app'

const { EXEC_MODE, NODE_ENV } = process.env

if (NODE_ENV === 'production') {
  if (EXEC_MODE === 'cluster') {
    import('./cluster').then(cluster => {
      cluster.default(app.start)
    }).catch(err => {
      console.error(err)
      process.exit(-1)
    })
  } else {
    app.start()
  }
}
