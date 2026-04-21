import js from '@eslint/js'
import globals from 'globals'

const sharedGlobals = {
  ...globals.browser,
  ...globals.node,
  ...globals.serviceworker
}

export default [
  {
    ignores: [
      'coverage/**',
      'dist/**',
      'node_modules/**'
    ]
  },
  {
    files: ['**/*.{js,mjs}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: sharedGlobals
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }]
    }
  }
]
