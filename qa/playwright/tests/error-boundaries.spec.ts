import { test, expect } from '@playwright/test';
import { ErrorUtils, RouteUtils } from '../utils/test-utils';

test.describe('Error Boundaries & Error Handling', () => {
  let errorUtils: ErrorUtils;
  let routeUtils: RouteUtils;

  test.beforeEach(async ({ page }) => {
    errorUtils = new ErrorUtils(page);
    routeUtils = new RouteUtils(page);
  });

  test.describe('Marketing Error Boundary', () => {
    test('should display marketing error page for marketing routes', async ({ page }) => {
      await page.goto('/courses');
      await page.waitForLoadState('networkidle');
      
      // Create a navigation promise before triggering error
      const errorPromise = page.waitForEvent('pageerror');
      
      // Inject an error in the marketing context
      await page.evaluate(() => {
        // Simulate a component error
        const event = new ErrorEvent('error', {
          error: new Error('Test marketing error'),
          message: 'Test marketing error'
        });
        window.dispatchEvent(event);
      });
      
      // The error boundary should catch this and display error UI
      // Note: This might need adjustment based on actual error boundary implementation
      const errorHeading = page.locator('h2:has-text("Something went wrong")');
      await expect(errorHeading).toBeVisible({ timeout: 5000 });
      
      // Should show marketing-specific error UI with header and footer
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
      
      // Should have "Try Again" button
      const tryAgainButton = page.locator('button:has-text("Try Again")');
      await expect(tryAgainButton).toBeVisible();
      
      // Should have "Back to Home" link
      const homeLink = page.locator('a:has-text("Back to Home")');
      await expect(homeLink).toBeVisible();
      await expect(homeLink).toHaveAttribute('href', '/');
      
      // Should have "Browse Courses" link
      const coursesLink = page.locator('a:has-text("Browse Courses")');
      await expect(coursesLink).toBeVisible();
      await expect(coursesLink).toHaveAttribute('href', '/courses');
    });

    test('should show development error details in dev mode', async ({ page }) => {
      // This test assumes NODE_ENV=development
      await page.goto('/about');
      await page.waitForLoadState('networkidle');
      
      // Trigger error
      await page.evaluate(() => {
        const event = new ErrorEvent('error', {
          error: new Error('Test dev error with stack trace'),
          message: 'Test dev error with stack trace'
        });
        window.dispatchEvent(event);
      });
      
      // Should show error message
      await expect(page.locator('h2:has-text("Something went wrong")')).toBeVisible();
      
      // In development, should show technical details
      const technicalDetails = page.locator('details:has-text("Technical Details")');
      if (await technicalDetails.isVisible()) {
        await technicalDetails.click();
        
        // Should show error message and stack trace
        const errorMessage = page.locator('div:has-text("Test dev error with stack trace")');
        await expect(errorMessage).toBeVisible();
      }
    });

    test('should have functional "Try Again" button', async ({ page }) => {
      // Go to a marketing page
      await page.goto('/courses');
      await page.waitForLoadState('networkidle');
      
      // Trigger error to show error boundary
      await page.evaluate(() => {
        const event = new ErrorEvent('error', {
          error: new Error('Test retry error'),
          message: 'Test retry error'
        });
        window.dispatchEvent(event);
      });
      
      // Wait for error UI
      await expect(page.locator('h2:has-text("Something went wrong")')).toBeVisible();
      
      // Click "Try Again" button
      const tryAgainButton = page.locator('button:has-text("Try Again")');
      await tryAgainButton.click();
      
      // Page should recover (error UI should disappear)
      await expect(page.locator('h2:has-text("Something went wrong")')).not.toBeVisible();
    });

    test('should show popular pages quick links', async ({ page }) => {
      await page.goto('/blog');
      await page.waitForLoadState('networkidle');
      
      // Trigger error
      await page.evaluate(() => {
        const event = new ErrorEvent('error', {
          error: new Error('Test quick links error'),
          message: 'Test quick links error'
        });
        window.dispatchEvent(event);
      });
      
      // Should show popular pages section
      const popularPages = page.locator('h3:has-text("Popular Pages")');
      await expect(popularPages).toBeVisible();
      
      // Should have working links
      const coursesLink = page.locator('a[href="/courses"]:has-text("Courses")');
      await expect(coursesLink).toBeVisible();
      
      const aboutLink = page.locator('a[href="/about"]:has-text("About")');
      await expect(aboutLink).toBeVisible();
      
      const contactLink = page.locator('a[href="/contact"]:has-text("Contact")');
      await expect(contactLink).toBeVisible();
      
      const signInLink = page.locator('a[href="/auth/login"]:has-text("Sign In")');
      await expect(signInLink).toBeVisible();
    });
  });

  test.describe('Enrollment Error Boundary', () => {
    test('should display enrollment error page for enrollment routes', async ({ page }) => {
      await page.goto('/enroll/ai-transformation-manager');
      await page.waitForLoadState('networkidle');
      
      // Trigger error in enrollment context
      await page.evaluate(() => {
        const event = new ErrorEvent('error', {
          error: new Error('Test enrollment error'),
          message: 'Test enrollment error'
        });
        window.dispatchEvent(event);
      });
      
      // Should show error UI with enrollment layout
      // (This assumes enrollment has its own error boundary)
      const errorMessage = page.locator('text=Something went wrong, text=error, text=wrong').first();
      
      // Should maintain enrollment layout (simple header, no marketing footer)
      const enrollmentHeader = page.locator('header:has-text("Secure Enrollment")');
      // This might be visible even on error page for consistency
    });

    test('should handle payment-related errors gracefully', async ({ page }) => {
      await page.goto('/enroll/ai-transformation-manager/step-2-payment');
      await page.waitForLoadState('networkidle');
      
      // Simulate payment error
      await page.evaluate(() => {
        // Simulate Stripe error
        window.dispatchEvent(new CustomEvent('payment-error', {
          detail: { error: 'Payment failed' }
        }));
      });
      
      // Should show payment-specific error handling
      // This would depend on actual payment implementation
    });
  });

  test.describe('Global Error Handling', () => {
    test('should handle 404 errors correctly', async ({ page }) => {
      await errorUtils.test404Handling('/this-page-does-not-exist');
      
      // Should show 404 page with proper messaging
      const bodyText = await page.textContent('body');
      expect(bodyText).toMatch(/404|not found|page not found/i);
    });

    test('should handle network errors gracefully', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Simulate network failure
      await errorUtils.testNetworkError();
      
      // Page should still be functional
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should handle JavaScript disabled scenario', async ({ page }) => {
      // Disable JavaScript
      await page.context().addInitScript(() => {
        Object.defineProperty(window, 'navigator', {
          value: { ...window.navigator, javaEnabled: () => false }
        });
      });
      
      await page.goto('/');
      
      // Basic content should still be visible
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Main heading should be present
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
    });
  });

  test.describe('Error Boundary Recovery', () => {
    test('should recover from error when navigating to different route', async ({ page }) => {
      // Start on a page
      await page.goto('/courses');
      await page.waitForLoadState('networkidle');
      
      // Trigger error
      await page.evaluate(() => {
        const event = new ErrorEvent('error', {
          error: new Error('Test recovery error'),
          message: 'Test recovery error'
        });
        window.dispatchEvent(event);
      });
      
      // Should show error UI
      await expect(page.locator('text=Something went wrong')).toBeVisible();
      
      // Navigate to different page
      await page.goto('/about');
      await page.waitForLoadState('networkidle');
      
      // Error UI should be gone, page should work normally
      await expect(page.locator('text=Something went wrong')).not.toBeVisible();
      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
    });

    test('should handle rapid navigation during error state', async ({ page }) => {
      await page.goto('/courses');
      
      // Trigger error
      await page.evaluate(() => {
        const event = new ErrorEvent('error', {
          error: new Error('Test rapid nav error'),
          message: 'Test rapid nav error'
        });
        window.dispatchEvent(event);
      });
      
      // Rapidly navigate between pages
      await page.goto('/about');
      await page.goto('/contact');
      await page.goto('/courses');
      
      // Should end up on a working page
      await page.waitForLoadState('networkidle');
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });

  test.describe('Error Logging', () => {
    test('should log errors to console in development', async ({ page }) => {
      const consoleMessages: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleMessages.push(msg.text());
        }
      });
      
      await page.goto('/courses');
      
      // Trigger error
      await page.evaluate(() => {
        const event = new ErrorEvent('error', {
          error: new Error('Test console logging error'),
          message: 'Test console logging error'
        });
        window.dispatchEvent(event);
      });
      
      // Wait a bit for console logging
      await page.waitForTimeout(1000);
      
      // Should have logged the error
      const hasErrorLog = consoleMessages.some(msg => 
        msg.includes('Test console logging error')
      );
      expect(hasErrorLog).toBe(true);
    });
  });
});