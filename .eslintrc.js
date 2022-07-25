module.exports = {
    "env": {
      "es2021": true,
      node: true,
    },
    "extends": [
      "eslint:recommended",
    ],
    "overrides": [
      {
        files: ['*.ts', '*.d.ts'],
        extends: [
          "standard-with-typescript",
          "plugin:@typescript-eslint/recommended"
        ],
        plugins: {
          "@typescript-eslint"
        }
        "parserOptions": {
          "project": "./tsconfig.json"
        },
        "parser": "@typescript-eslint/parser",
        "parserOptions": {
          "ecmaVersion": "latest",
        },
        rules: {
          '@typescript-eslint/prefer-optional-chain': 0,
          '@typescript-eslint/strict-boolean-expressions': 0,
          '@typescript-eslint/no-var-requires': 0,
        }
      }
    ]
  }
  