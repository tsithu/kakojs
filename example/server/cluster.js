import cluster from 'cluster'
import { cpus } from 'os'

export default startApp => {
  const cpuCount = cpus().length

  if (cluster.isMaster) {
    for (let i = 0; i < cpuCount; i++) {
      cluster.fork()
    }
    cluster.on('exit', worker => {
      console.log('Cluster %d is dead', worker.process.pid)
      // Ensuring a new cluster will start if an old one dies
      cluster.fork()
    })
  } else {
    startApp()
  }
}
