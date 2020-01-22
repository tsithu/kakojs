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
    'plugin:vue/recommended',
    'plugin:security/recommended',
    'plugin:jest/recommended'
    //'plugin:prettier/recommended'
  ],
  // required to lint *.vue files
  plugins: [
    'vue',
    'html',
    'import',
    'node',
    'security',
    'jest'
    //'prettier'
  ],
  // add your custom rules here
  rules: {
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": ["**/test/*.js", "**/tests/*.js"]
    }],
    'vue/max-attributes-per-line': [2, {
      'singleline': 5,
      'multiline': {
        'max': 1,
        'allowFirstLine': true
      }
    }],
    'vue/component-name-in-template-casing': ["error", "kebab-case"],
    'vue/html-closing-bracket-newline': ["error", {
      "singleline": "never",
      "multiline": "never"
    }],
    'vue/html-closing-bracket-spacing': ["error", { selfClosingTag: "never" }],
    'vue/html-self-closing': ["error", {
      html: {
        void: "any",
        normal: "any",
        component: "any"
      },
      svg: "any",
      math: "any"
    }],
    'space-before-function-paren': [
      "error",
      {
        anonymous: 'always',
        named: 'always'
      }
    ],
    'semi': ["error", "never"],
    'comma-dangle': ["error", "never"],
    'arrow-parens': ["error", "as-needed"],
    'no-param-reassign': ["error", {
      "props": true,
      "ignorePropertyModificationsFor": [
        "app", "ctx", "context", "config",
        "res", "req", "$config", "menu",
        "Vue", "record", "variables", "item", "value",
        "model"
      ]
    }],
    'no-plusplus': ["error", { "allowForLoopAfterthoughts": true }],
    'no-shadow': ["error", {
      "builtinGlobals": true,
      "hoist": "all",
      "allow": ["Vue", "state", "ctx", "name", "code", "event"]
    }],
    'max-len': ["error", {
      "code": 120,
      "ignoreComments": true,
      "ignoreTrailingComments": true,
      "ignoreStrings": true,
      "ignoreTemplateLiterals": true,
      "ignoreRegExpLiterals": true,
      "ignoreUrls": true
    }]
  },
  settings: {
    "import/resolver": {
      "babel-plugin-root-import": [
        {
          "rootPathPrefix": ":",
          "rootPathSuffix": "./"
        },
        {
          "rootPathPrefix": "~",
          "rootPathSuffix": "./client"
        },
        {
          "rootPathPrefix": "$",
          "rootPathSuffix": "./server"
        }
      ]
    }
  },
  globals: {
    $vkano: false,
    $logger: false,
    Vue: false
  }
}
