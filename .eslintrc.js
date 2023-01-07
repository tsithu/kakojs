module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true,
    'jest/globals': true

  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'airbnb-base',
    'plugin:security/recommended',
    'plugin:jest/recommended'
    // 'plugin:prettier/recommended'
  ],
  // required to lint *.vue files
  plugins: [
    'html',
    'import',
    'node',
    'security',
    'jest'
    // 'prettier'
  ],
  // add your custom rules here
  rules: {
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: ['**/test/*.js', '**/tests/*.js']
    }],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'always'
      }
    ],
    semi: ['error', 'never'],
    'comma-dangle': ['error', 'never'],
    'arrow-parens': ['error', 'as-needed'],
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'app', 'ctx', 'context', 'config',
        'res', 'req', '$config', 'menu',
        'Vue', 'record', 'variables', 'item', 'value',
        'model'
      ]
    }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-shadow': ['error', {
      builtinGlobals: true,
      hoist: 'all',
      allow: ['Vue', 'state', 'ctx', 'name', 'code', 'event']
    }],
    'max-len': ['error', {
      code: 120,
      ignoreComments: true,
      ignoreTrailingComments: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
      ignoreUrls: true
    }]
  },
  settings: {
    'import/resolver': {
      'babel-plugin-root-import': [
        {
          rootPathPrefix: ':',
          rootPathSuffix: './'
        },
        {
          rootPathPrefix: '$',
          rootPathSuffix: './src'
        }
      ]
    }
  },
  globals: {
    $kako: false,
    $logger: false
  }
}
