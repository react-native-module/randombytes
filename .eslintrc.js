module.exports = {
    "env": {
      "es2021": true,
      node: true,
    },
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaVersion": "latest",
    },
    "plugins": [
      "@typescript-eslint"
    ],
    "overrides": [
      {
        files: ['*.ts', '*.d.ts'],
        extends: [
          "standard-with-typescript"
        ],
        "parserOptions": {
          "project": "./tsconfig.json"
        },
        rules: {
          '@typescript-eslint/prefer-optional-chain': 0,
          '@typescript-eslint/strict-boolean-expressions': 0,
          '@typescript-eslint/no-var-requires': 0,
        }
      }
    ]
  }
  