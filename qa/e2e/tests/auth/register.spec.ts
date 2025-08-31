import { test, expect } from '@playwright/test';
import { AuthHelper, testUsers } from '../../fixtures/auth';
import { TestHelpers } from '../../utils/test-helpers';

test.describe('Authentication - Registration Flow', () => {
  let authHelper: AuthHelper;
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    testHelpers = new TestHelpers(page);
  });

  test('should display registration form correctly @smoke', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Check page title
    await expect(page).toHaveTitle(/.*Register.*/);
    
    // Check form elements are present
    await expect(page.getByTestId('first-name-input')).toBeVisible();
    await expect(page.getByTestId('last-name-input')).toBeVisible();
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('confirm-password-input')).toBeVisible();
    await expect(page.getByTestId('phone-input')).toBeVisible();
    await expect(page.getByTestId('register-submit')).toBeVisible();
    
    // Check link to login
    await expect(page.getByTestId('login-link')).toBeVisible();
    
    // Take screenshot
    await testHelpers.takeScreenshot('register-form-initial');
  });

  test('should register successfully with valid data @critical', async ({ page }) => {
    const newUser = {
      firstName: 'New',
      lastName: 'User',
      email: `new.user.${Date.now()}@test.com`,
      password: 'SecurePass123!',
      phone: '+1234567890'
    };

    // Mock successful registration API response
    await testHelpers.mockApiResponse('/auth/register', {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: '2',
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: 'student'
      }
    });

    await page.goto('/auth/register');
    
    // Fill registration form
    await testHelpers.fillField('first-name-input', newUser.firstName);
    await testHelpers.fillField('last-name-input', newUser.lastName);
    await testHelpers.fillField('email-input', newUser.email);
    await testHelpers.fillField('password-input', newUser.password);
    await testHelpers.fillField('confirm-password-input', newUser.password);
    await testHelpers.fillField('phone-input', newUser.phone);
    
    // Submit form
    await testHelpers.submitForm('register-submit', '/dashboard');
    
    // Verify successful registration
    await expect(page.getByTestId('user-avatar')).toBeVisible();
    await expect(page.getByText(`Welcome, ${newUser.firstName}`)).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Try to submit without filling fields
    await page.getByTestId('register-submit').click();
    
    // Check validation errors
    await expect(page.getByTestId('first-name-input-error')).toContainText('First name is required');
    await expect(page.getByTestId('last-name-input-error')).toContainText('Last name is required');
    await expect(page.getByTestId('email-input-error')).toContainText('Email is required');
    await expect(page.getByTestId('password-input-error')).toContainText('Password is required');
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Fill invalid email
    await testHelpers.fillField('email-input', 'invalid-email', false);
    await page.getByTestId('email-input').blur();
    
    // Check validation error
    await expect(page.getByTestId('email-input-error')).toContainText('Please enter a valid email address');
  });

  test('should validate password strength @critical', async ({ page }) => {
    await page.goto('/auth/register');
    
    const weakPasswords = [
      { password: '123', error: 'Password must be at least 8 characters long' },
      { password: 'password', error: 'Password must contain at least one uppercase letter' },
      { password: 'PASSWORD', error: 'Password must contain at least one lowercase letter' },
      { password: 'Password', error: 'Password must contain at least one number' },
      { password: 'Password123', error: 'Password must contain at least one special character' }
    ];

    for (const { password, error } of weakPasswords) {
      await testHelpers.fillField('password-input', password, false);
      await page.getByTestId('password-input').blur();
      
      // Check validation error
      await expect(page.getByTestId('password-input-error')).toContainText(error);
      
      // Clear field for next test
      await page.getByTestId('password-input').clear();
    }
  });

  test('should validate password confirmation match', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Fill different passwords
    await testHelpers.fillField('password-input', 'SecurePass123!');
    await testHelpers.fillField('confirm-password-input', 'DifferentPass123!', false);
    await page.getByTestId('confirm-password-input').blur();
    
    // Check validation error
    await expect(page.getByTestId('confirm-password-input-error')).toContainText('Passwords do not match');
  });

  test('should validate phone number format', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Fill invalid phone number
    await testHelpers.fillField('phone-input', '123', false);
    await page.getByTestId('phone-input').blur();
    
    // Check validation error
    await expect(page.getByTestId('phone-input-error')).toContainText('Please enter a valid phone number');
  });

  test('should show error for existing email @critical', async ({ page }) => {
    // Mock API error response for existing email
    await testHelpers.mockApiResponse('/auth/register', {
      message: 'Email already exists'
    }, 400);

    await page.goto('/auth/register');
    
    // Fill form with existing email
    await testHelpers.fillField('first-name-input', 'Test');
    await testHelpers.fillField('last-name-input', 'User');
    await testHelpers.fillField('email-input', testUsers.student.email);
    await testHelpers.fillField('password-input', 'SecurePass123!');
    await testHelpers.fillField('confirm-password-input', 'SecurePass123!');
    
    // Submit form
    await page.getByTestId('register-submit').click();
    
    // Check error message
    await testHelpers.expectError('Email already exists');
  });

  test('should show password strength indicator', async ({ page }) => {
    await page.goto('/auth/register');
    
    const passwordInput = page.getByTestId('password-input');
    const strengthIndicator = page.getByTestId('password-strength');
    
    // Test different password strengths
    const passwords = [
      { password: '123', strength: 'weak' },
      { password: 'password123', strength: 'medium' },
      { password: 'SecurePass123!', strength: 'strong' }
    ];

    for (const { password, strength } of passwords) {
      await passwordInput.fill(password);
      await expect(strengthIndicator).toContainText(strength);
    }
  });

  test('should handle registration with optional phone number', async ({ page }) => {
    const newUser = {
      firstName: 'No',
      lastName: 'Phone',
      email: `no.phone.${Date.now()}@test.com`,
      password: 'SecurePass123!'
    };

    // Mock successful registration without phone
    await testHelpers.mockApiResponse('/auth/register', {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: '3',
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: 'student'
      }
    });

    await page.goto('/auth/register');
    
    // Fill form without phone
    await testHelpers.fillField('first-name-input', newUser.firstName);
    await testHelpers.fillField('last-name-input', newUser.lastName);
    await testHelpers.fillField('email-input', newUser.email);
    await testHelpers.fillField('password-input', newUser.password);
    await testHelpers.fillField('confirm-password-input', newUser.password);
    
    // Submit form
    await testHelpers.submitForm('register-submit', '/dashboard');
    
    // Verify successful registration
    await expect(page.getByTestId('user-avatar')).toBeVisible();
  });

  test('should show loading state during registration', async ({ page }) => {
    // Delay the API response
    await page.route('**/api/auth/register', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'token',
          refreshToken: 'refresh',
          user: { id: '1', email: 'test@example.com' }
        })
      });
    });

    await page.goto('/auth/register');
    
    // Fill minimum required fields
    await testHelpers.fillField('first-name-input', 'Test');
    await testHelpers.fillField('last-name-input', 'User');
    await testHelpers.fillField('email-input', 'test@example.com');
    await testHelpers.fillField('password-input', 'SecurePass123!');
    await testHelpers.fillField('confirm-password-input', 'SecurePass123!');
    
    // Submit form
    await page.getByTestId('register-submit').click();
    
    // Check loading state
    await expect(page.getByTestId('register-submit')).toBeDisabled();
    await expect(page.getByTestId('loading-spinner')).toBeVisible();
    
    // Wait for completion
    await testHelpers.waitForLoading();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Click login link
    await page.getByTestId('login-link').click();
    
    // Verify navigation
    await expect(page).toHaveURL('/auth/login');
    await expect(page).toHaveTitle(/.*Login.*/);
  });

  test('should redirect authenticated users to dashboard', async ({ page }) => {
    // Mock authenticated state
    await page.evaluate(() => {
      localStorage.setItem('accessToken', 'mock-token');
    });

    // Try to visit register page
    await page.goto('/auth/register');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should work on mobile devices @mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/auth/register');
    
    // Check mobile responsiveness
    await expect(page.getByTestId('register-form')).toBeVisible();
    await expect(page.getByTestId('first-name-input')).toBeVisible();
    await expect(page.getByTestId('email-input')).toBeVisible();
    
    // Take mobile screenshot
    await testHelpers.takeScreenshot('register-mobile');
  });

  test('should support keyboard navigation @accessibility', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Test keyboard navigation through form fields
    await testHelpers.testKeyboardNavigation([
      'first-name-input',
      'last-name-input',
      'email-input',
      'password-input',
      'confirm-password-input',
      'phone-input',
      'register-submit',
      'login-link'
    ]);
  });

  test('should meet accessibility standards @accessibility', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Check accessibility compliance
    await testHelpers.checkAccessibility();
    
    // Check ARIA labels on form inputs
    const formInputs = [
      'first-name-input',
      'last-name-input', 
      'email-input',
      'password-input',
      'confirm-password-input',
      'phone-input'
    ];

    for (const input of formInputs) {
      await expect(page.getByTestId(input)).toHaveAttribute('aria-label');
    }
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/auth/register');
    
    const passwordInput = page.getByTestId('password-input');
    const confirmPasswordInput = page.getByTestId('confirm-password-input');
    const passwordToggle = page.getByTestId('password-toggle');
    const confirmPasswordToggle = page.getByTestId('confirm-password-toggle');
    
    // Initially should be password type
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    
    // Toggle password visibility
    await passwordToggle.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    await confirmPasswordToggle.click();
    await expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });
});