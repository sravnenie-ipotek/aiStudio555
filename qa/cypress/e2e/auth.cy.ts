// cypress/e2e/auth.cy.ts
/// <reference types="cypress" />
import { testUserFactory } from '../support/types';

describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.clearTestData();
    cy.seedTestData();
  });

  afterEach(() => {
    cy.clearTestData();
  });

  describe('User Registration', () => {
    beforeEach(() => {
      cy.visit('/register');
      cy.waitForPageLoad();
    });

    it('should display registration form correctly', () => {
      // Check form elements are present
      cy.getByTestId('register-first-name').should('be.visible');
      cy.getByTestId('register-last-name').should('be.visible');
      cy.getByTestId('register-email').should('be.visible');
      cy.getByTestId('register-password').should('be.visible');
      cy.getByTestId('register-confirm-password').should('be.visible');
      cy.getByTestId('register-accept-terms').should('be.visible');
      cy.getByTestId('register-submit').should('be.visible').and('be.disabled');

      // Check form accessibility
      cy.checkAccessibility();
      
      // Check meta tags
      cy.toHaveCorrectMetaTags();
    });

    it('should register a new user with valid data', () => {
      const userData = testUserFactory();

      // Fill registration form
      cy.fillRegistrationForm(userData);
      cy.getByTestId('register-submit').should('be.enabled').click();

      // Should redirect to email verification or dashboard
      cy.url().should('satisfy', (url: string) => 
        url.includes('/verify-email') || url.includes('/dashboard')
      );

      // Check success message
      cy.get('[data-testid="success-message"], [data-testid="verification-message"]')
        .should('be.visible')
        .and('contain.text', 'successfully');
    });

    it('should show validation errors for invalid data', () => {
      // Test empty form submission
      cy.getByTestId('register-accept-terms').check();
      cy.getByTestId('register-submit').click();

      // Check validation errors appear
      cy.getByTestId('register-first-name').toHaveValidationError('register-first-name');
      cy.getByTestId('register-last-name').toHaveValidationError('register-last-name');
      cy.getByTestId('register-email').toHaveValidationError('register-email');
      cy.getByTestId('register-password').toHaveValidationError('register-password');
    });

    it('should validate password requirements', () => {
      const userData = testUserFactory({
        password: 'weak',
      });

      cy.fillRegistrationForm(userData);
      cy.getByTestId('register-submit').click();

      // Check password validation error
      cy.getByTestId('register-password-error')
        .should('be.visible')
        .and('contain.text', 'Password must contain');
    });

    it('should validate password confirmation match', () => {
      const userData = testUserFactory();

      cy.getByTestId('register-first-name').type(userData.firstName);
      cy.getByTestId('register-last-name').type(userData.lastName);
      cy.getByTestId('register-email').type(userData.email);
      cy.getByTestId('register-password').type(userData.password);
      cy.getByTestId('register-confirm-password').type('DifferentPassword123!');
      cy.getByTestId('register-accept-terms').check();
      cy.getByTestId('register-submit').click();

      // Check password confirmation error
      cy.getByTestId('register-confirm-password-error')
        .should('be.visible')
        .and('contain.text', 'Passwords must match');
    });

    it('should handle duplicate email registration', () => {
      const userData = testUserFactory({
        email: Cypress.env('testEmail'), // Use existing test user email
      });

      cy.fillRegistrationForm(userData);
      cy.getByTestId('register-submit').click();

      // Check duplicate email error
      cy.getByTestId('register-email-error')
        .should('be.visible')
        .and('contain.text', 'Email already exists');
    });

    it('should work with different languages', () => {
      if (Cypress.env('enableMultiLanguage')) {
        // Test Russian registration
        cy.switchLanguage('ru');
        cy.visit('/register');
        
        const userData = testUserFactory({ locale: 'ru' });
        cy.getByTestId('register-language').select('ru');
        cy.fillRegistrationForm(userData);
        cy.getByTestId('register-submit').click();

        // Should handle Russian locale
        cy.url().should('satisfy', (url: string) => 
          url.includes('/verify-email') || url.includes('/dashboard')
        );
      }
    });

    it('should be responsive across different screen sizes', () => {
      cy.testResponsiveness();
      
      // Test mobile-specific behavior
      cy.testOnMobile();
      cy.getByTestId('register-form').should('be.visible');
      cy.get('body').should('not.have.css', 'overflow-x', 'scroll');
    });
  });

  describe('User Login', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.waitForPageLoad();
    });

    it('should display login form correctly', () => {
      // Check form elements
      cy.getByTestId('login-email').should('be.visible');
      cy.getByTestId('login-password').should('be.visible');
      cy.getByTestId('login-remember-me').should('be.visible');
      cy.getByTestId('login-submit').should('be.visible');
      cy.getByTestId('forgot-password-link').should('be.visible');
      cy.getByTestId('register-link').should('be.visible');

      // Check accessibility
      cy.checkAccessibility();
    });

    it('should login with valid credentials', () => {
      cy.fillLoginForm(Cypress.env('testEmail'), Cypress.env('testPassword'));
      cy.getByTestId('login-submit').click();

      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
      
      // Check authentication state
      cy.window().its('localStorage.auth-token').should('exist');
      cy.getByTestId('user-menu').should('be.visible');
    });

    it('should show error with invalid credentials', () => {
      cy.fillLoginForm('invalid@email.com', 'wrongpassword');
      cy.getByTestId('login-submit').click();

      // Should show error message
      cy.getByTestId('login-error')
        .should('be.visible')
        .and('contain.text', 'Invalid credentials');
        
      // Should stay on login page
      cy.url().should('include', '/login');
    });

    it('should show validation errors for empty fields', () => {
      cy.getByTestId('login-submit').click();

      // Check validation errors
      cy.getByTestId('login-email').toHaveValidationError('login-email');
      cy.getByTestId('login-password').toHaveValidationError('login-password');
    });

    it('should handle rate limiting', () => {
      // Simulate multiple failed login attempts
      for (let i = 0; i < 6; i++) {
        cy.fillLoginForm('test@example.com', 'wrongpassword');
        cy.getByTestId('login-submit').click();
        cy.wait(1000);
      }

      // Should show rate limiting error
      cy.getByTestId('login-error')
        .should('be.visible')
        .and('contain.text', 'Too many attempts');
    });

    it('should redirect authenticated users away from login', () => {
      // Login first
      cy.login();
      
      // Try to visit login page
      cy.visit('/login');
      
      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
    });

    it('should remember login state with "Remember Me"', () => {
      cy.fillLoginForm(Cypress.env('testEmail'), Cypress.env('testPassword'));
      cy.getByTestId('login-remember-me').check();
      cy.getByTestId('login-submit').click();

      // Clear session cookies but keep localStorage
      cy.clearCookies();
      
      // Should still be logged in after page refresh
      cy.reload();
      cy.url().should('include', '/dashboard');
    });

    it('should work with social login (OAuth)', () => {
      // Mock OAuth providers
      cy.intercept('GET', '/api/auth/google', {
        statusCode: 302,
        headers: { location: 'https://accounts.google.com/oauth/authorize' },
      }).as('googleAuth');

      cy.getByTestId('google-login-button').click();
      cy.wait('@googleAuth');

      // Mock successful OAuth callback
      cy.intercept('GET', '/api/auth/google/callback*', {
        statusCode: 302,
        headers: { location: '/dashboard' },
      }).as('googleCallback');

      // Simulate OAuth return
      cy.visit('/api/auth/google/callback?code=test-auth-code');
      cy.wait('@googleCallback');
      
      // Should be redirected to dashboard
      cy.url().should('include', '/dashboard');
    });
  });

  describe('User Logout', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/dashboard');
    });

    it('should logout successfully', () => {
      cy.logout();

      // Should clear authentication
      cy.window().its('localStorage.auth-token').should('not.exist');
      
      // Should redirect to home page
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      
      // Should show login link
      cy.getByTestId('login-link').should('be.visible');
    });

    it('should logout from all devices', () => {
      cy.getByTestId('user-menu').click();
      cy.getByTestId('logout-all-devices').click();
      
      // Confirm logout
      cy.getByTestId('confirm-logout-all').click();

      // Should show success message
      cy.getByTestId('success-message')
        .should('be.visible')
        .and('contain.text', 'Logged out from all devices');
    });
  });

  describe('Password Reset Flow', () => {
    beforeEach(() => {
      cy.visit('/forgot-password');
      cy.waitForPageLoad();
    });

    it('should display forgot password form', () => {
      cy.getByTestId('forgot-password-email').should('be.visible');
      cy.getByTestId('forgot-password-submit').should('be.visible');
      cy.getByTestId('back-to-login-link').should('be.visible');

      cy.checkAccessibility();
    });

    it('should send password reset email', () => {
      cy.getByTestId('forgot-password-email').type(Cypress.env('testEmail'));
      cy.getByTestId('forgot-password-submit').click();

      // Should show success message
      cy.getByTestId('success-message')
        .should('be.visible')
        .and('contain.text', 'Password reset email sent');

      // Should redirect to login
      cy.url().should('include', '/login');
    });

    it('should handle non-existent email', () => {
      cy.getByTestId('forgot-password-email').type('nonexistent@email.com');
      cy.getByTestId('forgot-password-submit').click();

      // Should show generic success message for security
      cy.getByTestId('success-message')
        .should('be.visible')
        .and('contain.text', 'If the email exists');
    });

    it('should validate email format', () => {
      cy.getByTestId('forgot-password-email').type('invalid-email');
      cy.getByTestId('forgot-password-submit').click();

      cy.getByTestId('forgot-password-email').toHaveValidationError('forgot-password-email');
    });

    it('should handle rate limiting for password reset', () => {
      // Simulate multiple reset requests
      for (let i = 0; i < 4; i++) {
        cy.getByTestId('forgot-password-email').clear().type(`test${i}@example.com`);
        cy.getByTestId('forgot-password-submit').click();
        cy.wait(1000);
        cy.visit('/forgot-password'); // Reset form
      }

      // Should show rate limiting
      cy.getByTestId('error-message')
        .should('be.visible')
        .and('contain.text', 'Too many requests');
    });
  });

  describe('Password Reset Confirmation', () => {
    const mockResetToken = 'mock-reset-token-123';

    beforeEach(() => {
      // Mock valid reset token endpoint
      cy.intercept('GET', `/api/auth/reset-password/verify?token=${mockResetToken}`, {
        statusCode: 200,
        body: { valid: true },
      }).as('verifyResetToken');

      cy.visit(`/reset-password?token=${mockResetToken}`);
      cy.wait('@verifyResetToken');
    });

    it('should display password reset form with valid token', () => {
      cy.getByTestId('new-password').should('be.visible');
      cy.getByTestId('confirm-new-password').should('be.visible');
      cy.getByTestId('reset-password-submit').should('be.visible');

      cy.checkAccessibility();
    });

    it('should reset password with valid data', () => {
      const newPassword = 'NewPassword123!@#';

      cy.intercept('POST', '/api/auth/reset-password', {
        statusCode: 200,
        body: { success: true },
      }).as('resetPassword');

      cy.getByTestId('new-password').type(newPassword);
      cy.getByTestId('confirm-new-password').type(newPassword);
      cy.getByTestId('reset-password-submit').click();

      cy.wait('@resetPassword');

      // Should show success and redirect to login
      cy.getByTestId('success-message')
        .should('be.visible')
        .and('contain.text', 'Password reset successful');

      cy.url().should('include', '/login');
    });

    it('should validate new password requirements', () => {
      cy.getByTestId('new-password').type('weak');
      cy.getByTestId('confirm-new-password').type('weak');
      cy.getByTestId('reset-password-submit').click();

      cy.getByTestId('new-password').toHaveValidationError('new-password');
    });

    it('should validate password confirmation match', () => {
      cy.getByTestId('new-password').type('StrongPassword123!');
      cy.getByTestId('confirm-new-password').type('DifferentPassword123!');
      cy.getByTestId('reset-password-submit').click();

      cy.getByTestId('confirm-new-password').toHaveValidationError('confirm-new-password');
    });

    it('should handle invalid or expired tokens', () => {
      cy.intercept('GET', '/api/auth/reset-password/verify?token=invalid-token', {
        statusCode: 400,
        body: { error: 'Invalid or expired token' },
      }).as('verifyInvalidToken');

      cy.visit('/reset-password?token=invalid-token');
      cy.wait('@verifyInvalidToken');

      // Should show error and redirect
      cy.getByTestId('error-message')
        .should('be.visible')
        .and('contain.text', 'Invalid or expired');

      cy.url().should('include', '/forgot-password');
    });
  });

  describe('Email Verification', () => {
    const mockVerificationToken = 'mock-verification-token-123';

    it('should verify email with valid token', () => {
      cy.intercept('GET', `/api/auth/verify?token=${mockVerificationToken}`, {
        statusCode: 200,
        body: { 
          success: true,
          user: { id: 'user-123', email: 'test@example.com' },
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
      }).as('verifyEmail');

      cy.visit(`/verify-email?token=${mockVerificationToken}`);
      cy.wait('@verifyEmail');

      // Should show success and auto-login
      cy.getByTestId('success-message')
        .should('be.visible')
        .and('contain.text', 'Email verified successfully');

      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
      cy.window().its('localStorage.auth-token').should('exist');
    });

    it('should handle invalid verification token', () => {
      cy.intercept('GET', '/api/auth/verify?token=invalid-token', {
        statusCode: 400,
        body: { error: 'Invalid verification token' },
      }).as('verifyInvalidEmail');

      cy.visit('/verify-email?token=invalid-token');
      cy.wait('@verifyInvalidEmail');

      cy.getByTestId('error-message')
        .should('be.visible')
        .and('contain.text', 'Invalid verification token');

      // Should provide option to resend
      cy.getByTestId('resend-verification').should('be.visible');
    });

    it('should allow resending verification email', () => {
      cy.visit('/verify-email');

      cy.intercept('POST', '/api/auth/resend-verification', {
        statusCode: 200,
        body: { success: true },
      }).as('resendVerification');

      cy.getByTestId('verification-email').type('test@example.com');
      cy.getByTestId('resend-verification-submit').click();

      cy.wait('@resendVerification');

      cy.getByTestId('success-message')
        .should('be.visible')
        .and('contain.text', 'Verification email sent');
    });
  });

  describe('Session Management', () => {
    beforeEach(() => {
      cy.login();
    });

    it('should handle session timeout', () => {
      // Mock expired token
      cy.intercept('GET', '/api/auth/me', {
        statusCode: 401,
        body: { error: 'Token expired' },
      }).as('getProfile');

      cy.visit('/dashboard');
      cy.wait('@getProfile');

      // Should redirect to login
      cy.url().should('include', '/login');
      
      // Should show session expired message
      cy.getByTestId('info-message')
        .should('be.visible')
        .and('contain.text', 'Session expired');
    });

    it('should refresh tokens automatically', () => {
      // Mock token refresh
      cy.intercept('POST', '/api/auth/refresh', {
        statusCode: 200,
        body: {
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
          expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        },
      }).as('refreshToken');

      // Mock API call that triggers refresh
      cy.intercept('GET', '/api/dashboard', {
        statusCode: 401,
        body: { error: 'Token expired' },
      }).as('dashboardExpired');

      cy.visit('/dashboard');
      cy.wait('@dashboardExpired');
      cy.wait('@refreshToken');

      // Should continue with new token
      cy.window().its('localStorage.auth-token').should('exist');
    });

    it('should show active sessions management', () => {
      cy.visitWithAuth('/profile/security');

      cy.getByTestId('active-sessions').should('be.visible');
      cy.getByTestId('current-session').should('be.visible');
      
      // Should show session details
      cy.getByTestId('session-device').should('contain.text', 'Chrome');
      cy.getByTestId('session-location').should('be.visible');
      cy.getByTestId('session-last-activity').should('be.visible');
    });
  });

  describe('Two-Factor Authentication (2FA)', () => {
    beforeEach(() => {
      cy.loginAs('student');
      cy.visit('/profile/security');
    });

    it('should enable 2FA', () => {
      cy.intercept('POST', '/api/auth/2fa/enable', {
        statusCode: 200,
        body: {
          secret: 'mock-2fa-secret',
          qrCode: 'data:image/png;base64,mock-qr-code',
          backupCodes: ['123456', '789012'],
        },
      }).as('enable2FA');

      cy.getByTestId('enable-2fa-button').click();
      cy.wait('@enable2FA');

      // Should show QR code and backup codes
      cy.getByTestId('qr-code').should('be.visible');
      cy.getByTestId('backup-codes').should('be.visible');
      cy.getByTestId('verify-2fa-code').should('be.visible');
    });

    it('should verify 2FA setup', () => {
      // Assuming 2FA is enabled
      cy.intercept('POST', '/api/auth/2fa/verify', {
        statusCode: 200,
        body: { verified: true },
      }).as('verify2FA');

      cy.getByTestId('verify-2fa-code').type('123456');
      cy.getByTestId('verify-2fa-submit').click();

      cy.wait('@verify2FA');

      cy.getByTestId('success-message')
        .should('be.visible')
        .and('contain.text', '2FA enabled successfully');
    });

    it('should require 2FA code during login', () => {
      // Mock user with 2FA enabled
      cy.logout();
      cy.visit('/login');

      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
          requires2FA: true,
          tempToken: 'temp-token-123',
        },
      }).as('loginWith2FA');

      cy.fillLoginForm(Cypress.env('testEmail'), Cypress.env('testPassword'));
      cy.getByTestId('login-submit').click();

      cy.wait('@loginWith2FA');

      // Should show 2FA input
      cy.getByTestId('totp-code').should('be.visible');
      cy.getByTestId('submit-2fa').should('be.visible');
      cy.getByTestId('use-backup-code').should('be.visible');
    });
  });

  describe('Security Features', () => {
    it('should handle suspicious activity', () => {
      // Mock different IP/device login
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
          success: true,
          suspiciousActivity: true,
          user: { id: 'user-123' },
          accessToken: 'token',
        },
      }).as('suspiciousLogin');

      cy.visit('/login');
      cy.fillLoginForm(Cypress.env('testEmail'), Cypress.env('testPassword'));
      cy.getByTestId('login-submit').click();

      cy.wait('@suspiciousLogin');

      // Should show security alert
      cy.getByTestId('security-alert')
        .should('be.visible')
        .and('contain.text', 'Unusual sign-in activity');
    });

    it('should enforce password complexity', () => {
      cy.visit('/register');

      const weakPasswords = ['password', '12345678', 'Password', 'password123'];

      weakPasswords.forEach((password) => {
        cy.getByTestId('register-password').clear().type(password);
        cy.getByTestId('register-password').blur();

        cy.getByTestId('register-password-error')
          .should('be.visible')
          .and('contain.text', 'Password must contain');
      });
    });
  });
});