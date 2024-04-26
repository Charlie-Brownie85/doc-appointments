/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  env: {
    node: true,
  },
  globals: {
    context: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-strongly-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/typescript',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    semi: [2, 'always'],
    indent: ['error', 2, { SwitchCase: 2 }],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-useless-return': 'warn',
    'no-useless-constructor': 0,
    'no-empty-function': 0,
    'no-shadow': 'off',
    'no-param-reassign': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-unused-vars': ['error'],
    'consistent-return': 'warn',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'arrow-parens': 'off',
    'max-len': 'off',
    'import/order': [
      2,
      {
        'newlines-between': 'always-and-inside-groups',
        groups: [
          'builtin',
          'external',
          [
            'internal',
            'parent',
            'sibling',
          ],
          'index',
        ],
      },
    ],
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
        '**/*.test.js',
        '**/*.spec.js',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
