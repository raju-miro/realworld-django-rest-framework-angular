import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-plugin-prettier/recommended';

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'test-results/**', 'playwright-report/**', 'results/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.ts'],
  },
  prettier,
  {
    files: ['**/*.ts'],
    rules: {},
  },
];
