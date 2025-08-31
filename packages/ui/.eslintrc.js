module.exports = {
  extends: [
    '../../.eslintrc.js',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended',
  ],
  plugins: ['react', 'react-hooks'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // React component library specific rules
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off', // Using TypeScript
    'react/display-name': 'error', // Important for component library
    'react/jsx-props-no-spreading': 'warn',
    'react/jsx-no-target-blank': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Accessibility rules for UI components
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',

    // Stricter rules for shared components
    'no-console': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
  },
  overrides: [
    {
      // Storybook files
      files: ['**/*.stories.@(js|jsx|ts|tsx)'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'react/jsx-props-no-spreading': 'off',
      },
    },
  ],
};
