module.exports = {
  presets: [
    'backpack-core/babel',
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ]
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-transform-runtime',
    'babel-plugin-bulk-import',
    '@babel/plugin-syntax-dynamic-import',
    [
      'babel-plugin-root-import',
      {
        paths: [
          {
            rootPathPrefix: ':',
            rootPathSuffix: './'
          },
          {
            rootPathPrefix: '~',
            rootPathSuffix: './client'
          },
          {
            rootPathPrefix: '$',
            rootPathSuffix: './server'
          }
        ]
      }
    ]
  ]
}
