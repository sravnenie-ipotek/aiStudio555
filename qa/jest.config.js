const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: '../apps/web/',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/playwright/',
    '<rootDir>/cypress/'
  ],
  collectCoverageFrom: [
    '../apps/web/src/**/*.{js,jsx,ts,tsx}',
    '!../apps/web/src/**/*.d.ts',
    '!../apps/web/src/**/*.stories.{js,jsx,ts,tsx}',
    '!../apps/web/src/app/**/loading.tsx',
    '!../apps/web/src/app/**/not-found.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 85,
      statements: 85,
    },
  },
  moduleNameMapping: {
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/../apps/web/src/$1',
    '^@packages/(.*)$': '<rootDir>/../packages/$1',
  },
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-string-pathtotransformer--pathtotransformer-object
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  testMatch: [
    '<rootDir>/unit/**/*.(test|spec).(js|jsx|ts|tsx)',
    '<rootDir>/integration/**/*.(test|spec).(js|jsx|ts|tsx)'
  ],
  // Add custom matchers
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);