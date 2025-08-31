/**
 * ESLint Configuration - Root Level
 *
 * This is the main ESLint configuration for the Projectdes Academy monorepo.
 * It provides base linting rules for TypeScript/JavaScript across all workspaces.
 *
 * Key features:
 * - TypeScript support with @typescript-eslint
 * - Prettier integration for formatting
 * - Workspace-specific overrides
 * - Git hook integration via Husky
 *
 * @see https://eslint.org/docs/user-guide/configuring/
 * @see https://typescript-eslint.io/docs/
 */
module.exports = {
  // Indicates this is the root config - stops ESLint from searching parent directories
  root: true,

  // Base configuration sets to extend
  extends: [
    'eslint:recommended', // ESLint's recommended rules
    'plugin:@typescript-eslint/recommended', // TypeScript-specific recommended rules
    'prettier', // Disables ESLint rules that conflict with Prettier
  ],

  // Use TypeScript parser for parsing .ts/.tsx files
  parser: '@typescript-eslint/parser',

  // Plugins provide additional rules and functionality
  plugins: ['@typescript-eslint'],

  // Parser configuration for TypeScript
  parserOptions: {
    ecmaVersion: 2022, // Support for ECMAScript 2022 features
    sourceType: 'module', // Use ES modules (import/export)
    project: './tsconfig.json', // Use TypeScript project configuration
  },

  // Environment settings - defines global variables
  env: {
    node: true, // Node.js global variables
    es6: true, // Enable all ECMAScript 6 features
  },

  // Custom rules and rule overrides
  rules: {
    // ==============================================
    // TypeScript-Specific Rules
    // ==============================================

    // Prevent unused variables, allow underscore prefix for intentionally unused
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    // Warn against 'any' type usage - prefer specific types
    '@typescript-eslint/no-explicit-any': 'warn',

    // Don't require explicit return types - TypeScript inference is good enough
    '@typescript-eslint/explicit-function-return-type': 'off',

    // Don't require explicit types on module boundaries - let inference work
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // Warn against non-null assertions (!) - they can hide potential errors
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // Prefer nullish coalescing (??) over logical OR (||) for null/undefined checks
    '@typescript-eslint/prefer-nullish-coalescing': 'error',

    // Prefer optional chaining (?.) for accessing potentially undefined properties
    '@typescript-eslint/prefer-optional-chain': 'error',

    // ==============================================
    // General Code Quality Rules
    // ==============================================

    // Allow console statements in development, warn in general
    'no-console': 'warn',

    // Never allow debugger statements in committed code
    'no-debugger': 'error',

    // Prefer const for variables that don't change
    'prefer-const': 'error',

    // Disallow var declarations - use let/const instead
    'no-var': 'error',

    // Require object shorthand syntax ({ name } instead of { name: name })
    'object-shorthand': 'error',

    // Prefer arrow functions over function expressions
    'prefer-arrow-callback': 'error',

    // Prefer template literals over string concatenation
    'prefer-template': 'error',

    // ==============================================
    // Code Style Rules (coordinated with Prettier)
    // ==============================================

    // Enforce spacing in template literals
    'template-curly-spacing': 'error',

    // Enforce spacing around arrow function arrows
    'arrow-spacing': 'error',

    // Require trailing commas in multiline structures
    'comma-dangle': ['error', 'always-multiline'],

    // Always require semicolons
    semi: ['error', 'always'],

    // Use single quotes, allow double quotes to avoid escaping
    quotes: ['error', 'single', { avoidEscape: true }],

    // Disable indent rule to prevent stack overflow with complex JSX
    indent: 'off',
    '@typescript-eslint/indent': 'off',

    // Limit line length to 100 characters, ignore URLs
    'max-len': ['error', { code: 100, ignoreUrls: true }],

    // Require newline at end of files
    'eol-last': 'error',

    // Disallow trailing whitespace
    'no-trailing-spaces': 'error',

    // Limit consecutive empty lines
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
  },

  // ==============================================
  // Workspace-Specific Configuration Overrides
  // ==============================================
  overrides: [
    {
      // React/Next.js Web Application Configuration
      // Applied to: apps/web/** (frontend application)
      files: ['apps/web/**/*.{ts,tsx}'],
      extends: [
        'next/core-web-vitals', // Next.js specific rules for performance
        'plugin:react/recommended', // React best practices
        'plugin:react-hooks/recommended', // React Hooks rules
      ],
      plugins: ['react', 'react-hooks'],
      settings: {
        react: {
          version: 'detect', // Automatically detect React version
        },
      },
      rules: {
        // React.js specific rule overrides for Next.js
        'react/react-in-jsx-scope': 'off', // Not needed with Next.js 13+ (automatic imports)
        'react/prop-types': 'off', // Using TypeScript for prop validation
        'react/display-name': 'off', // Next.js handles display names automatically

        // React Hooks rules for proper usage
        'react-hooks/rules-of-hooks': 'error', // Follow Hook rules strictly
        'react-hooks/exhaustive-deps': 'warn', // Warn about missing dependencies
      },
    },
    {
      // Express API/Backend Server Configuration
      // Applied to: apps/api/** (Express.js backend)
      // Purpose: Allow server-side patterns and logging
      files: ['apps/api/**/*.ts'],
      env: {
        node: true, // Enable Node.js globals (process, Buffer, etc.)
      },
      rules: {
        'no-console': 'off', // Allow console.log in server code for logging
      },
    },
    {
      // Shared Packages Configuration (UI, Utils, Types, DB)
      // Applied to: packages/** (shared monorepo packages)
      // Purpose: Stricter rules for reusable code
      files: ['packages/**/*.{ts,tsx}'],
      rules: {
        'no-console': 'error', // No console statements in shared packages
      },
    },
    {
      // Test Files Configuration
      // Applied to: All test files, QA directory
      // Purpose: Relaxed rules for testing code
      files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', 'qa/**/*.{ts,js}'],
      env: {
        jest: true, // Enable Jest testing globals (describe, it, etc.)
        node: true, // Enable Node.js globals for test setup
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off', // Allow 'any' in tests for mocks
        'no-console': 'off', // Allow console in tests for debugging
      },
    },
    {
      // Build Configuration Files
      // Applied to: All config and setup files
      // Purpose: Allow Node.js patterns in build scripts
      files: ['*.config.{js,ts}', '*.setup.{js,ts}'],
      env: {
        node: true, // Enable Node.js globals for config files
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off', // Allow require() in config files
        'no-console': 'off', // Allow console in build scripts
      },
    },
  ],

  // ==============================================
  // Files and Directories to Ignore
  // ==============================================
  // These patterns tell ESLint to skip linting certain files/folders
  ignorePatterns: [
    // Dependencies and package managers
    'node_modules/', // npm/pnpm installed packages

    // Build outputs
    'dist/', // Compiled TypeScript output
    'build/', // Production builds
    '.next/', // Next.js build output
    '.turbo/', // Turborepo cache

    // Test outputs
    'coverage/', // Test coverage reports
    'playwright-report/', // Playwright test reports
    'test-results/', // Test result files

    // Generated and minified files
    '*.min.js', // Minified JavaScript files
    '*.d.ts', // TypeScript declaration files (auto-generated)
  ],
};
