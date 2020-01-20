module.exports = {
  verbose: true,
  bail: true,
  roots: ['./tests'],
  testEnvironment: 'node',
  globals: {
    $kako: false,
    $logger: false
  }
}
