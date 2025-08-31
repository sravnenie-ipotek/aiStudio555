// cypress/support/commands.ts
/// <reference types="cypress" />
import type { User, TestUser, Course, LoginFormData, RegistrationFormData, ViewportConfig, VIEWPORTS } from './types';

// Authentication Commands
Cypress.Commands.add('login', (email?: string, password?: string) => {
  const loginEmail = email || Cypress.env('testEmail');
  const loginPassword = password || Cypress.env('testPassword');

  cy.session([loginEmail, loginPassword], () => {
    cy.visit('/login');
    cy.getByTestId('login-email').type(loginEmail);
    cy.getByTestId('login-password').type(loginPassword);
    cy.getByTestId('login-submit').click();
    
    // Wait for successful login
    cy.url().should('not.contain', '/login');
    cy.window().its('localStorage.auth-token').should('exist');
  });
});

Cypress.Commands.add('loginAs', (userType: 'student' | 'instructor' | 'admin') => {
  const credentials = {
    student: { email: 'student@projectdes.ai', password: 'Student123!@#' },
    instructor: { email: 'instructor@projectdes.ai', password: 'Instructor123!@#' },
    admin: { email: 'admin@projectdes.ai', password: 'Admin123!@#' },
  };

  const { email, password } = credentials[userType];
  cy.login(email, password);
});

Cypress.Commands.add('logout', () => {
  cy.visit('/');
  cy.getByTestId('user-menu').click();
  cy.getByTestId('logout-button').click();
  
  // Wait for logout to complete
  cy.url().should('eq', Cypress.config().baseUrl + '/');
  cy.window().its('localStorage.auth-token').should('not.exist');
});

Cypress.Commands.add('register', (userData: Partial<TestUser>) => {
  const user = {
    email: `test+${Date.now()}@projectdes.ai`,
    password: 'Test123!@#',
    firstName: 'Test',
    lastName: 'User',
    ...userData,
  };

  cy.visit('/register');
  cy.fillRegistrationForm(user as TestUser);
  cy.submitForm('[data-testid="registration-form"]');
  
  // Handle email verification if required
  cy.url().then((url) => {
    if (url.includes('/verify-email')) {
      // Mock email verification for testing
      cy.task('log', 'Mocking email verification for test user');
      cy.visit('/dashboard');
    }
  });
});

// User Management Commands
Cypress.Commands.add('createTestUser', (userData: Partial<TestUser>) => {
  return cy.task('createTestUser', userData).then((user) => {
    return user as User;
  });
});

Cypress.Commands.add('deleteTestUser', (userId: string) => {
  cy.task('deleteTestUser', userId);
});

// Course Commands
Cypress.Commands.add('enrollInCourse', (courseId: string) => {
  cy.apiRequest('POST', `/courses/${courseId}/enroll`, {}).then((response) => {
    expect(response.status).to.eq(201);
  });
});

Cypress.Commands.add('createTestCourse', (courseData: Partial<Course>) => {
  return cy.task('createTestCourse', courseData).then((course) => {
    return course as Course;
  });
});

// Payment Commands
Cypress.Commands.add('mockStripePayment', () => {
  cy.intercept('POST', '**/create-payment-intent', {
    statusCode: 200,
    body: {
      clientSecret: 'pi_test_1234567890_secret_test',
      id: 'pi_test_1234567890',
    },
  }).as('createPaymentIntent');

  cy.intercept('POST', '**/confirm-payment', {
    statusCode: 200,
    body: {
      status: 'succeeded',
      id: 'pi_test_1234567890',
    },
  }).as('confirmPayment');
});

Cypress.Commands.add('mockPayPalPayment', () => {
  cy.intercept('POST', '**/paypal/create-order', {
    statusCode: 200,
    body: {
      id: 'test-paypal-order-id',
      status: 'CREATED',
      links: [
        {
          rel: 'approve',
          href: 'https://www.sandbox.paypal.com/checkoutnow?token=test-token',
        },
      ],
    },
  }).as('createPayPalOrder');

  cy.intercept('POST', '**/paypal/capture-order', {
    statusCode: 200,
    body: {
      id: 'test-paypal-order-id',
      status: 'COMPLETED',
    },
  }).as('capturePayPalOrder');
});

Cypress.Commands.add('completePayment', (method: 'stripe' | 'paypal') => {
  if (method === 'stripe') {
    cy.mockStripePayment();
    cy.getByTestId('stripe-payment-button').click();
    cy.wait('@createPaymentIntent');
    // Simulate successful Stripe payment
    cy.getByTestId('payment-success-message').should('be.visible');
  } else if (method === 'paypal') {
    cy.mockPayPalPayment();
    cy.getByTestId('paypal-payment-button').click();
    cy.wait('@createPayPalOrder');
    // Simulate successful PayPal payment
    cy.getByTestId('payment-success-message').should('be.visible');
  }
});

// Navigation Commands
Cypress.Commands.add('visitWithAuth', (url: string) => {
  cy.login();
  cy.visit(url);
});

Cypress.Commands.add('navigateToPage', (page: 'home' | 'courses' | 'dashboard' | 'profile') => {
  const routes = {
    home: '/',
    courses: '/courses',
    dashboard: '/dashboard',
    profile: '/profile',
  };
  cy.visit(routes[page]);
});

// Form Commands
Cypress.Commands.add('fillLoginForm', (email: string, password: string) => {
  cy.getByTestId('login-email').clear().type(email);
  cy.getByTestId('login-password').clear().type(password);
});

Cypress.Commands.add('fillRegistrationForm', (userData: TestUser) => {
  cy.getByTestId('register-first-name').type(userData.firstName);
  cy.getByTestId('register-last-name').type(userData.lastName);
  cy.getByTestId('register-email').type(userData.email);
  cy.getByTestId('register-password').type(userData.password);
  cy.getByTestId('register-confirm-password').type(userData.password);
  cy.getByTestId('register-accept-terms').check();
  
  if (userData.locale) {
    cy.getByTestId('register-language').select(userData.locale);
  }
});

Cypress.Commands.add('submitForm', (formSelector?: string) => {
  if (formSelector) {
    cy.get(formSelector).submit();
  } else {
    cy.get('form').submit();
  }
});

// API Commands
Cypress.Commands.add('apiRequest', (method: string, endpoint: string, body?: any) => {
  return cy.request({
    method,
    url: `${Cypress.env('apiUrl')}${endpoint}`,
    body,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${window.localStorage.getItem('auth-token')}`,
    },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('mockApiResponse', (endpoint: string, response: any) => {
  cy.intercept('GET', `${Cypress.env('apiUrl')}${endpoint}`, {
    statusCode: 200,
    body: response,
  }).as(`api${endpoint.replace(/\//g, '_')}`);
});

// Utility Commands
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

Cypress.Commands.add('findByTestId', (testId: string) => {
  return cy.findByTestId(testId);
});

Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.window().its('document.readyState').should('eq', 'complete');
});

Cypress.Commands.add('checkAccessibility', () => {
  cy.checkA11y(null, null, (violations) => {
    cy.task('log', `Accessibility violations: ${violations.length}`);
    violations.forEach((violation) => {
      cy.task('log', `${violation.id}: ${violation.description}`);
    });
  });
});

Cypress.Commands.add('switchLanguage', (lang: 'en' | 'ru' | 'he') => {
  cy.getByTestId('language-switcher').click();
  cy.getByTestId(`language-option-${lang}`).click();
  cy.url().should('contain', `lang=${lang}`);
});

// Database Commands
Cypress.Commands.add('seedTestData', () => {
  cy.task('seedDatabase');
});

Cypress.Commands.add('clearTestData', () => {
  cy.task('clearDatabase');
});

// Responsive Testing Commands
Cypress.Commands.add('testOnMobile', () => {
  cy.viewport(375, 812);
});

Cypress.Commands.add('testOnTablet', () => {
  cy.viewport(768, 1024);
});

Cypress.Commands.add('testOnDesktop', () => {
  cy.viewport(1280, 720);
});

Cypress.Commands.add('testResponsiveness', () => {
  const viewports: ViewportConfig[] = [
    { name: 'mobile', width: 375, height: 812, isMobile: true },
    { name: 'tablet', width: 768, height: 1024, isTablet: true },
    { name: 'desktop', width: 1280, height: 720 },
  ];

  viewports.forEach((viewport) => {
    cy.viewport(viewport.width, viewport.height);
    cy.wait(500); // Allow time for responsive changes
    
    // Basic responsive checks
    cy.get('body').should('be.visible');
    cy.get('[data-testid="main-navigation"]').should('be.visible');
    
    // Check for horizontal scroll
    cy.window().then((win) => {
      expect(win.document.body.scrollWidth).to.be.at.most(win.innerWidth + 1);
    });
  });
});

// Custom assertions
Cypress.Commands.add('toHaveValidationError', { prevSubject: 'element' }, (subject, fieldName) => {
  cy.wrap(subject)
    .find(`[data-testid="${fieldName}-error"]`)
    .should('be.visible')
    .and('not.be.empty');
});

Cypress.Commands.add('toBeAccessible', { prevSubject: 'optional' }, (subject) => {
  const target = subject ? cy.wrap(subject) : cy.get('body');
  target.then(() => {
    cy.checkA11y();
  });
});

Cypress.Commands.add('toHaveCorrectMetaTags', () => {
  cy.get('head title').should('exist').and('not.be.empty');
  cy.get('head meta[name="description"]').should('exist').and('have.attr', 'content').and('not.be.empty');
  cy.get('head meta[property="og:title"]').should('exist');
  cy.get('head meta[property="og:description"]').should('exist');
});

Cypress.Commands.add('toLoadWithinTimeout', { prevSubject: 'element' }, (subject, timeout) => {
  cy.wrap(subject).should('be.visible', { timeout });
});

// Error handling helper
const handleTestError = (error: Error, testName: string) => {
  cy.task('log', `Test error in ${testName}: ${error.message}`);
  throw error;
};

// Export for use in tests
export { handleTestError };