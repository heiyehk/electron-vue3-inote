module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    quotes: [1, 'single'],
    semi: 1,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'no-irregular-whitespace': 2,
    'no-case-declarations': 0,
    'no-undef': 0,
    'eol-last': 1,
    'block-scoped-var': 2,
    'comma-dangle': [2, 'never'],
    'no-dupe-keys': 2,
    'no-empty': 1,
    'no-extra-semi': 2,
    'no-multiple-empty-lines': [1, { max: 1, maxEOF: 1 }],
    'no-trailing-spaces': 1,
    'semi-spacing': [2, { before: false, after: true }],
    'no-unreachable': 1,
    'space-infix-ops': 1,
    'spaced-comment': 1,
    'no-var': 2,
    'no-multi-spaces': 2,
    'comma-spacing': 1
  }
};
