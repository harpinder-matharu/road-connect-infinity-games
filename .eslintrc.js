module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/ban-types': 'off',
  },
  ignorePatterns: [
    'build/',
    'extensions/',
    'library/',
    'native/',
    'node_modules/',
    'preview-template/',
    'profiles/',
    'settings/',
    'temp/',
    'assets/resources/i18n/',
    '.*',
    '*.min.js',
  ],
};
