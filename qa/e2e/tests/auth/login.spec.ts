import { test, expect } from '@playwright/test';
import { AuthHelper, testUsers } from '../../fixtures/auth';
import { TestHelpers } from '../../utils/test-helpers';

test.describe('Authentication - Login Flow', () => {
  let authHelper: AuthHelper;
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    testHelpers = new TestHelpers(page);
  });

  test('should display login form correctly @smoke @critical', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Check page title
    await expect(page).toHaveTitle(/.*Login.*/);
    
    // Check form elements are present
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();
    
    // Check links
    await expect(page.getByTestId('forgot-password-link')).toBeVisible();
    await expect(page.getByTestId('register-link')).toBeVisible();
    
    // Take screenshot for visual regression
    await testHelpers.takeScreenshot('login-form-initial');
  });

  test('should login successfully with valid credentials @critical', async ({ page }) => {
    const user = testUsers.student;
    
    // Mock successful login API response
    await testHelpers.mockApiResponse('/auth/login', {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: '1',
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: 'student'
      }
    });

    await page.goto('/auth/login');
    
    // Fill login form
    await testHelpers.fillField('email-input', user.email);
    await testHelpers.fillField('password-input', user.password);
    
    // Submit form
    await testHelpers.submitForm('login-submit', '/dashboard');
    
    // Verify successful login
    await expect(page.getByTestId('user-avatar')).toBeVisible();
    await expect(page.getByText(`Welcome, ${user.firstName}`)).toBeVisible();
  });

  test('should show error for invalid email format', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Fill invalid email
    await testHelpers.fillField('email-input', 'invalid-email', false);
    await page.getByTestId('email-input').blur();
    
    // Check validation error
    await expect(page.getByTestId('email-input-error')).toContainText('Please enter a valid email address');
  });

  test('should show error for empty fields', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Try to submit without filling fields
    await page.getByTestId('login-submit').click();
    
    // Check validation errors
    await expect(page.getByTestId('email-input-error')).toContainText('Email is required');
    await expect(page.getByTestId('password-input-error')).toContainText('Password is required');
  });

  test('should show error for invalid credentials @critical', async ({ page }) => {
    // Mock API error response
    await testHelpers.mockApiResponse('/auth/login', {
      message: 'Invalid email or password'
    }, 401);

    await page.goto('/auth/login');
    
    // Fill form with invalid credentials
    await testHelpers.fillField('email-input', 'invalid@example.com');
    await testHelpers.fillField('password-input', 'wrongpassword');
    
    // Submit form
    await page.getByTestId('login-submit').click();
    
    // Check error message
    await testHelpers.expectError('Invalid email or password');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network error
    await page.route('**/api/auth/login', route => route.abort());

    await page.goto('/auth/login');
    
    // Fill form
    await testHelpers.fillField('email-input', testUsers.student.email);
    await testHelpers.fillField('password-input', testUsers.student.password);
    
    // Submit form
    await page.getByTestId('login-submit').click();
    
    // Check network error message
    await testHelpers.expectError('Network error. Please check your connection and try again.');
  });

  test('should show loading state during login', async ({ page }) => {
    // Delay the API response
    await page.route('**/api/auth/login', async route => {
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

    await page.goto('/auth/login');
    
    // Fill and submit form
    await testHelpers.fillField('email-input', testUsers.student.email);
    await testHelpers.fillField('password-input', testUsers.student.password);
    await page.getByTestId('login-submit').click();
    
    // Check loading state
    await expect(page.getByTestId('login-submit')).toBeDisabled();
    await expect(page.getByTestId('loading-spinner')).toBeVisible();
    
    // Wait for completion
    await testHelpers.waitForLoading();
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Click forgot password link
    await page.getByTestId('forgot-password-link').click();
    
    // Verify navigation
    await expect(page).toHaveURL('/auth/forgot-password');
    await expect(page).toHaveTitle(/.*Forgot Password.*/);
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Click register link
    await page.getByTestId('register-link').click();
    
    // Verify navigation
    await expect(page).toHaveURL('/auth/register');
    await expect(page).toHaveTitle(/.*Register.*/);
  });

  test('should redirect authenticated users to dashboard', async ({ page }) => {
    // Mock authenticated state
    await page.evaluate(() => {
      localStorage.setItem('accessToken', 'mock-token');
    });

    // Try to visit login page
    await page.goto('/auth/login');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should work on mobile devices @mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/auth/login');
    
    // Check mobile responsiveness
    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    
    // Take mobile screenshot
    await testHelpers.takeScreenshot('login-mobile');
  });

  test('should support keyboard navigation @accessibility', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Test keyboard navigation
    await testHelpers.testKeyboardNavigation([
      'email-input',
      'password-input', 
      'login-submit',
      'forgot-password-link',
      'register-link'
    ]);
  });

  test('should meet accessibility standards @accessibility', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Check accessibility
    await testHelpers.checkAccessibility();
    
    // Check ARIA labels
    await expect(page.getByTestId('email-input')).toHaveAttribute('aria-label');
    await expect(page.getByTestId('password-input')).toHaveAttribute('aria-label');
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/auth/login');
    
    const passwordInput = page.getByTestId('password-input');
    const toggleButton = page.getByTestId('password-toggle');
    
    // Initially should be password type
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Toggle to show password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Toggle back to hide password
    await toggleButton.click(); 
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});