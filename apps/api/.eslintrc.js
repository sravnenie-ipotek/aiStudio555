module.exports = {
  extends: ['../../.eslintrc.js'],
  env: {
    node: true,
    es2022: true,
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    // Node.js/Express specific rules
    'no-console': 'off', // Allow console in API for logging
    'node/no-process-env': 'off',

    // API specific patterns
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],

    // Express middleware patterns
    'consistent-return': 'off', // Express middleware doesn't always return
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false, // Allow async middleware
      },
    ],
  },
};
