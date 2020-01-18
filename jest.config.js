module.exports = {
  verbose: true,
  bail: true,
  roots: ['./src/tests'],
  testEnvironment: 'node',
  globals: {
    $kako: false,
    $logger: false
  }
}
