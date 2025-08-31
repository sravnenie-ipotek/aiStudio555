module.exports = {
  extends: ['../../.eslintrc.js', 'next/core-web-vitals'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    // Next.js specific overrides
    '@next/next/no-html-link-for-pages': 'off',
    '@next/next/no-img-element': 'warn',
    'react/no-unescaped-entities': 'off',

    // Allow console in development for debugging
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

    // JSX and React specific
    'jsx-quotes': ['error', 'prefer-double'],
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-no-target-blank': 'error',
    'react/jsx-curly-brace-presence': ['error', 'never'],

    // Temporary fixes for development - can be made stricter later
    'no-trailing-spaces': 'warn',
    'max-len': ['warn', { code: 120, ignoreUrls: true }],
    'eol-last': 'warn',
    'semi': 'warn',
    'quotes': 'warn',
    'comma-dangle': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-unused-vars': 'warn',
  },
};
