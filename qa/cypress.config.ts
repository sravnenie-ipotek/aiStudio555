import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    fixturesFolder: 'cypress/fixtures',
    video: true,
    screenshotOnRunFailure: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 30000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    env: {
      apiUrl: 'http://localhost:5000/api',
      baseUrl: 'http://localhost:3000',
      // Test user credentials
      testEmail: 'test@projectdes.ai',
      testPassword: 'Test123!@#',
      // Feature flags
      enablePayments: true,
      enableMultiLanguage: true,
    },
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // Tasks for test setup/teardown
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        createTestUser: async (userData) => {
          // Mock implementation - would connect to test DB
          console.log('Creating test user:', userData);
          return { id: 'test-user-id', ...userData };
        },
        clearDatabase: async () => {
          // Mock implementation - would clear test data
          console.log('Clearing test database');
          return null;
        },
        seedDatabase: async () => {
          // Mock implementation - would seed test data
          console.log('Seeding test database');
          return null;
        },
      });

      return config;
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});