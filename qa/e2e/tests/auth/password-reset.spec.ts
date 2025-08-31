import { test, expect } from '@playwright/test';
import { AuthHelper, testUsers } from '../../fixtures/auth';
import { TestHelpers } from '../../utils/test-helpers';

test.describe('Authentication - Password Reset Flow', () => {
  let authHelper: AuthHelper;
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    testHelpers = new TestHelpers(page);
  });

  test.describe('Forgot Password Page', () => {
    test('should display forgot password form correctly @smoke', async ({ page }) => {
      await page.goto('/auth/forgot-password');
      
      // Check page title
      await expect(page).toHaveTitle(/.*Forgot Password.*/);
      
      // Check form elements
      await expect(page.getByTestId('email-input')).toBeVisible();
      await expect(page.getByTestId('forgot-password-submit')).toBeVisible();
      await expect(page.getByTestId('back-to-login-link')).toBeVisible();
      
      // Check descriptive text
      await expect(page.getByTestId('forgot-password-description')).toContainText('Enter your email address and we\'ll send you a link to reset your password');
      
      await testHelpers.takeScreenshot('forgot-password-form');
    });

    test('should send password reset email successfully @critical', async ({ page }) => {
      // Mock successful forgot password API response
      await testHelpers.mockApiResponse('/auth/forgot-password', {
        message: 'Password reset email sent successfully'
      });

      await page.goto('/auth/forgot-password');
      
      // Fill email field
      await testHelpers.fillField('email-input', testUsers.student.email);
      
      // Submit form
      await page.getByTestId('forgot-password-submit').click();
      
      // Verify success message
      await testHelpers.expectSuccess('Password reset email sent successfully');
      await expect(page.getByTestId('email-sent-message')).toContainText('Check your email for reset instructions');
    });

    test('should validate email format', async ({ page }) => {
      await page.goto('/auth/forgot-password');
      
      // Fill invalid email
      await testHelpers.fillField('email-input', 'invalid-email', false);
      await page.getByTestId('email-input').blur();
      
      // Check validation error
      await expect(page.getByTestId('email-input-error')).toContainText('Please enter a valid email address');
    });

    test('should validate required email field', async ({ page }) => {
      await page.goto('/auth/forgot-password');
      
      // Try to submit without email
      await page.getByTestId('forgot-password-submit').click();
      
      // Check validation error
      await expect(page.getByTestId('email-input-error')).toContainText('Email is required');
    });

    test('should handle email not found error', async ({ page }) => {
      // Mock API error response
      await testHelpers.mockApiResponse('/auth/forgot-password', {
        message: 'No account found with this email address'
      }, 404);

      await page.goto('/auth/forgot-password');
      
      // Fill non-existent email
      await testHelpers.fillField('email-input', 'nonexistent@example.com');
      
      // Submit form
      await page.getByTestId('forgot-password-submit').click();
      
      // Check error message
      await testHelpers.expectError('No account found with this email address');
    });

    test('should show loading state during submission', async ({ page }) => {
      // Delay API response
      await page.route('**/api/auth/forgot-password', async route => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Email sent' })
        });
      });

      await page.goto('/auth/forgot-password');
      
      // Fill and submit
      await testHelpers.fillField('email-input', testUsers.student.email);
      await page.getByTestId('forgot-password-submit').click();
      
      // Check loading state
      await expect(page.getByTestId('forgot-password-submit')).toBeDisabled();
      await expect(page.getByTestId('loading-spinner')).toBeVisible();
      
      await testHelpers.waitForLoading();
    });

    test('should navigate back to login page', async ({ page }) => {
      await page.goto('/auth/forgot-password');
      
      // Click back to login link
      await page.getByTestId('back-to-login-link').click();
      
      // Verify navigation
      await expect(page).toHaveURL('/auth/login');
    });
  });

  test.describe('Reset Password Page', () => {
    const resetToken = 'mock-reset-token-123';

    test('should display reset password form correctly @smoke', async ({ page }) => {
      await page.goto(`/auth/reset-password?token=${resetToken}`);
      
      // Check page title
      await expect(page).toHaveTitle(/.*Reset Password.*/);
      
      // Check form elements
      await expect(page.getByTestId('password-input')).toBeVisible();
      await expect(page.getByTestId('confirm-password-input')).toBeVisible();
      await expect(page.getByTestId('reset-password-submit')).toBeVisible();
      
      // Check password strength indicator
      await expect(page.getByTestId('password-strength')).toBeVisible();
      
      await testHelpers.takeScreenshot('reset-password-form');
    });

    test('should reset password successfully @critical', async ({ page }) => {
      const newPassword = 'NewSecurePass123!';

      // Mock successful reset password API response
      await testHelpers.mockApiResponse('/auth/reset-password', {
        message: 'Password reset successfully'
      });

      await page.goto(`/auth/reset-password?token=${resetToken}`);
      
      // Fill password fields
      await testHelpers.fillField('password-input', newPassword);
      await testHelpers.fillField('confirm-password-input', newPassword);
      
      // Submit form
      await page.getByTestId('reset-password-submit').click();
      
      // Verify success and redirect to login
      await expect(page).toHaveURL('/auth/login');
      await testHelpers.expectSuccess('Password reset successfully');
    });

    test('should validate password strength', async ({ page }) => {
      await page.goto(`/auth/reset-password?token=${resetToken}`);
      
      const weakPasswords = [
        { password: '123', error: 'Password must be at least 8 characters long' },
        { password: 'password', error: 'Password must contain at least one uppercase letter' },
        { password: 'PASSWORD123', error: 'Password must contain at least one lowercase letter' },
        { password: 'Password', error: 'Password must contain at least one number' },
        { password: 'Password123', error: 'Password must contain at least one special character' }
      ];

      for (const { password, error } of weakPasswords) {
        await testHelpers.fillField('password-input', password, false);
        await page.getByTestId('password-input').blur();
        
        await expect(page.getByTestId('password-input-error')).toContainText(error);
        
        // Clear for next test
        await page.getByTestId('password-input').clear();
      }
    });

    test('should validate password confirmation match', async ({ page }) => {
      await page.goto(`/auth/reset-password?token=${resetToken}`);
      
      // Fill different passwords
      await testHelpers.fillField('password-input', 'SecurePass123!');
      await testHelpers.fillField('confirm-password-input', 'DifferentPass123!', false);
      await page.getByTestId('confirm-password-input').blur();
      
      // Check validation error
      await expect(page.getByTestId('confirm-password-input-error')).toContainText('Passwords do not match');
    });

    test('should handle invalid or expired token', async ({ page }) => {
      // Mock API error response for invalid token
      await testHelpers.mockApiResponse('/auth/reset-password', {
        message: 'Reset token is invalid or expired'
      }, 400);

      await page.goto(`/auth/reset-password?token=invalid-token`);
      
      // Fill valid passwords
      await testHelpers.fillField('password-input', 'NewSecurePass123!');
      await testHelpers.fillField('confirm-password-input', 'NewSecurePass123!');
      
      // Submit form
      await page.getByTestId('reset-password-submit').click();
      
      // Check error message
      await testHelpers.expectError('Reset token is invalid or expired');
    });

    test('should handle missing token in URL', async ({ page }) => {
      await page.goto('/auth/reset-password');
      
      // Should show error message about missing token
      await expect(page.getByTestId('error-message')).toContainText('Invalid reset link');
      
      // Form should be disabled
      await expect(page.getByTestId('password-input')).toBeDisabled();
      await expect(page.getByTestId('confirm-password-input')).toBeDisabled();
      await expect(page.getByTestId('reset-password-submit')).toBeDisabled();
    });

    test('should show loading state during password reset', async ({ page }) => {
      // Delay API response
      await page.route('**/api/auth/reset-password', async route => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Password reset' })
        });
      });

      await page.goto(`/auth/reset-password?token=${resetToken}`);
      
      // Fill and submit
      await testHelpers.fillField('password-input', 'NewSecurePass123!');
      await testHelpers.fillField('confirm-password-input', 'NewSecurePass123!');
      await page.getByTestId('reset-password-submit').click();
      
      // Check loading state
      await expect(page.getByTestId('reset-password-submit')).toBeDisabled();
      await expect(page.getByTestId('loading-spinner')).toBeVisible();
      
      await testHelpers.waitForLoading();
    });

    test('should toggle password visibility', async ({ page }) => {
      await page.goto(`/auth/reset-password?token=${resetToken}`);
      
      const passwordInput = page.getByTestId('password-input');
      const confirmPasswordInput = page.getByTestId('confirm-password-input');
      const passwordToggle = page.getByTestId('password-toggle');
      const confirmPasswordToggle = page.getByTestId('confirm-password-toggle');
      
      // Initially should be password type
      await expect(passwordInput).toHaveAttribute('type', 'password');
      await expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      
      // Toggle visibility
      await passwordToggle.click();
      await expect(passwordInput).toHaveAttribute('type', 'text');
      
      await confirmPasswordToggle.click();
      await expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    });
  });

  test.describe('Email Verification', () => {
    const verificationToken = 'mock-verification-token-123';

    test('should verify email successfully @critical', async ({ page }) => {
      // Mock successful verification API response
      await testHelpers.mockApiResponse('/auth/verify-email*', {
        message: 'Email verified successfully'
      });

      await page.goto(`/auth/verify-email?token=${verificationToken}`);
      
      // Check success message
      await expect(page.getByTestId('verification-success')).toBeVisible();
      await expect(page.getByTestId('verification-success')).toContainText('Email verified successfully');
      
      // Check login link
      await expect(page.getByTestId('login-link')).toBeVisible();
      
      await testHelpers.takeScreenshot('email-verification-success');
    });

    test('should handle invalid verification token', async ({ page }) => {
      // Mock API error response
      await testHelpers.mockApiResponse('/auth/verify-email*', {
        message: 'Invalid or expired verification token'
      }, 400);

      await page.goto(`/auth/verify-email?token=invalid-token`);
      
      // Check error message
      await expect(page.getByTestId('verification-error')).toContainText('Invalid or expired verification token');
      
      // Check resend verification link
      await expect(page.getByTestId('resend-verification-link')).toBeVisible();
    });

    test('should handle missing verification token', async ({ page }) => {
      await page.goto('/auth/verify-email');
      
      // Should show error about missing token
      await expect(page.getByTestId('verification-error')).toContainText('Invalid verification link');
    });

    test('should allow resending verification email', async ({ page }) => {
      // Mock failed verification followed by successful resend
      await testHelpers.mockApiResponse('/auth/verify-email*', {
        message: 'Invalid verification token'
      }, 400);
      
      await testHelpers.mockApiResponse('/auth/resend-verification', {
        message: 'Verification email sent'
      });

      await page.goto(`/auth/verify-email?token=expired-token`);
      
      // Click resend verification
      await page.getByTestId('resend-verification-link').click();
      
      // Check success message
      await testHelpers.expectSuccess('Verification email sent');
    });

    test('should navigate to login after successful verification', async ({ page }) => {
      // Mock successful verification
      await testHelpers.mockApiResponse('/auth/verify-email*', {
        message: 'Email verified successfully'
      });

      await page.goto(`/auth/verify-email?token=${verificationToken}`);
      
      // Click login link
      await page.getByTestId('login-link').click();
      
      // Verify navigation
      await expect(page).toHaveURL('/auth/login');
    });
  });

  test('should work on mobile devices @mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Test forgot password page
    await page.goto('/auth/forgot-password');
    await expect(page.getByTestId('forgot-password-form')).toBeVisible();
    
    // Test reset password page
    await page.goto(`/auth/reset-password?token=${resetToken}`);
    await expect(page.getByTestId('reset-password-form')).toBeVisible();
    
    await testHelpers.takeScreenshot('password-reset-mobile');
  });

  test('should meet accessibility standards @accessibility', async ({ page }) => {
    // Test forgot password accessibility
    await page.goto('/auth/forgot-password');
    await testHelpers.checkAccessibility();
    
    // Test reset password accessibility
    await page.goto(`/auth/reset-password?token=${resetToken}`);
    await testHelpers.checkAccessibility();
    
    // Test email verification accessibility
    await page.goto(`/auth/verify-email?token=test-token`);
    await testHelpers.checkAccessibility();
  });
});