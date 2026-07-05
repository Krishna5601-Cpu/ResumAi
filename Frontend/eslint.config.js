import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    // Add your rule overrides here:
    rules: {
      // 1. Turns off the "Fast Refresh only works when a file only exports components" error
      'react-refresh/only-export-components': 'off',

      // 2. Turns off the "is defined but never used" red errors
      'no-unused-vars': 'off',
    },
  },
])