// cypress/support/e2e.ts
/// <reference types="cypress" />
import './commands';
import 'cypress-axe';
import '@testing-library/cypress/add-commands';

// Import types
import type { User, Course, TestUser } from './types';

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignore specific errors that don't affect test validity
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  if (err.message.includes('Non-Error promise rejection captured')) {
    return false;
  }
  // Allow test to fail on other uncaught exceptions
  return true;
});

// Before each test
beforeEach(() => {
  // Preserve cookies and localStorage across tests for authenticated flows
  if (Cypress.env('preserveAuth') !== false) {
    Cypress.Cookies.preserveOnce('auth-token', 'refresh-token');
  }
  
  // Set default viewport for responsive testing
  cy.viewport(1280, 720);
  
  // Inject axe-core for accessibility testing
  cy.injectAxe();
});

// After each test
afterEach(() => {
  // Clear any test artifacts if needed
  cy.task('log', `Test completed: ${Cypress.currentTest.title}`);
});

// Global types
declare global {
  namespace Cypress {
    interface Chainable {
      // Authentication commands
      login(email?: string, password?: string): Chainable<void>;
      loginAs(userType: 'student' | 'instructor' | 'admin'): Chainable<void>;
      logout(): Chainable<void>;
      register(userData: Partial<TestUser>): Chainable<void>;
      
      // User management commands
      createTestUser(userData: Partial<TestUser>): Chainable<User>;
      deleteTestUser(userId: string): Chainable<void>;
      
      // Course commands
      enrollInCourse(courseId: string): Chainable<void>;
      createTestCourse(courseData: Partial<Course>): Chainable<Course>;
      
      // Payment commands
      mockStripePayment(): Chainable<void>;
      mockPayPalPayment(): Chainable<void>;
      completePayment(method: 'stripe' | 'paypal'): Chainable<void>;
      
      // Navigation commands
      visitWithAuth(url: string): Chainable<void>;
      navigateToPage(page: 'home' | 'courses' | 'dashboard' | 'profile'): Chainable<void>;
      
      // Form commands
      fillLoginForm(email: string, password: string): Chainable<void>;
      fillRegistrationForm(userData: TestUser): Chainable<void>;
      submitForm(formSelector?: string): Chainable<void>;
      
      // API commands
      apiRequest(method: string, endpoint: string, body?: any): Chainable<Response>;
      mockApiResponse(endpoint: string, response: any): Chainable<void>;
      
      // Utility commands
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
      findByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
      waitForPageLoad(): Chainable<void>;
      checkAccessibility(): Chainable<void>;
      switchLanguage(lang: 'en' | 'ru' | 'he'): Chainable<void>;
      
      // Database commands
      seedTestData(): Chainable<void>;
      clearTestData(): Chainable<void>;
      
      // Responsive testing commands
      testOnMobile(): Chainable<void>;
      testOnTablet(): Chainable<void>;
      testOnDesktop(): Chainable<void>;
      testResponsiveness(): Chainable<void>;
    }
  }
}

export {};