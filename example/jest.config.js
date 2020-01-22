module.exports = {
  verbose: true,
  bail: true,
  roots: ['./server/tests', './client/tests'],
  testEnvironment: 'node',
  globals: {
    $vkano: false,
    $logger: false
  }
}
