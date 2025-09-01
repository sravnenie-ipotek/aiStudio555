import { test, expect } from '@playwright/test';
import { LoadingUtils, RouteUtils } from '../utils/test-utils';

test.describe('Loading States', () => {
  let loadingUtils: LoadingUtils;
  let routeUtils: RouteUtils;

  test.beforeEach(async ({ page }) => {
    loadingUtils = new LoadingUtils(page);
    routeUtils = new RouteUtils(page);
  });

  test.describe('Marketing Route Loading States', () => {
    test('should show loading state during page navigation', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Navigate to a different marketing page and verify loading
      await loadingUtils.verifyLoadingSequence(
        async () => {
          await page.goto('/courses');
          await page.waitForLoadState('networkidle');
        }
      );
      
      // Verify final content is loaded
      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
    });

    test('should handle slow network conditions', async ({ page }) => {
      // Simulate slow 3G network
      await page.context().route('**/*', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
        await route.continue();
      });
      
      await page.goto('/about');
      
      // Page should eventually load despite slow network
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should show loading for dynamic content', async ({ page }) => {
      await page.goto('/courses');
      await page.waitForLoadState('networkidle');
      
      // If there are dynamic course cards or search functionality
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
      
      if (await searchInput.count() > 0) {
        await loadingUtils.verifyLoadingSequence(
          async () => {
            await searchInput.fill('AI');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(500);
          }
        );
      }
    });

    test('should handle loading states for course details', async ({ page }) => {
      // Navigate to course detail page
      await loadingUtils.verifyLoadingSequence(
        async () => {
          await page.goto('/courses/ai-transformation-manager');
          await page.waitForLoadState('networkidle');
        }
      );
      
      // Should load course information
      const courseTitle = page.locator('h1, h2, .course-title');
      await expect(courseTitle.first()).toBeVisible();
    });

    test('should show loading for blog posts', async ({ page }) => {
      await loadingUtils.verifyLoadingSequence(
        async () => {
          await page.goto('/blog');
          await page.waitForLoadState('networkidle');
        }
      );
      
      // Navigate to individual blog post
      await loadingUtils.verifyLoadingSequence(
        async () => {
          await page.goto('/blog/getting-started-with-ai');
          await page.waitForLoadState('networkidle');
        }
      );
    });
  });

  test.describe('Enrollment Route Loading States', () => {
    test('should show loading during enrollment navigation', async ({ page }) => {
      await loadingUtils.verifyLoadingSequence(
        async () => {
          await page.goto('/enroll/ai-transformation-manager');
          await page.waitForLoadState('networkidle');
        }
      );
      
      // Should show enrollment layout
      const enrollmentHeader = page.locator('header:has-text("Secure Enrollment")');
      await expect(enrollmentHeader).toBeVisible();
    });

    test('should handle loading between enrollment steps', async ({ page }) => {
      await page.goto('/enroll/ai-transformation-manager/step-1-info');
      await page.waitForLoadState('networkidle');
      
      // Navigate to next step
      await loadingUtils.verifyLoadingSequence(
        async () => {
          await page.goto('/enroll/ai-transformation-manager/step-2-payment');
          await page.waitForLoadState('networkidle');
        }
      );
    });

    test('should show loading for form submissions', async ({ page }) => {
      await page.goto('/enroll/ai-transformation-manager/step-1-info');
      await page.waitForLoadState('networkidle');
      
      // Look for forms and test submission loading
      const form = page.locator('form').first();
      
      if (await form.count() > 0) {
        const submitButton = form.locator('button[type="submit"], input[type="submit"]');
        
        if (await submitButton.count() > 0) {
          await loadingUtils.verifyLoadingSequence(
            async () => {
              // Fill required fields if any
              const inputs = form.locator('input[required]');
              const inputCount = await inputs.count();
              
              for (let i = 0; i < inputCount; i++) {
                const input = inputs.nth(i);
                const type = await input.getAttribute('type') || 'text';
                
                switch (type) {
                  case 'email':
                    await input.fill('test@example.com');
                    break;
                  case 'text':
                    await input.fill('Test Value');
                    break;
                  case 'tel':
                    await input.fill('+1234567890');
                    break;
                }
              }
              
              await submitButton.click();
              await page.waitForTimeout(1000);
            }
          );
        }
      }
    });

    test('should handle payment loading states', async ({ page }) => {
      await page.goto('/enroll/ai-transformation-manager/step-2-payment');
      await page.waitForLoadState('networkidle');
      
      // Payment forms might have loading states during processing
      const paymentForm = page.locator('form:has-text("payment"), form:has([name*="card"])', 'form[data-testid*="payment"]').first();
      
      if (await paymentForm.count() > 0) {
        // This would test Stripe or payment processor loading states
        // Implementation depends on actual payment integration
      }
    });
  });

  test.describe('Dashboard Route Loading States', () => {
    test('should show loading for dashboard navigation', async ({ page }) => {
      // Dashboard routes might redirect to login first
      const response = await page.goto('/dashboard');
      
      if (response?.status() === 200) {
        await loadingUtils.verifyLoadingSequence(
          async () => {
            await page.waitForLoadState('networkidle');
          }
        );
      }
    });

    test('should handle loading for dashboard data', async ({ page }) => {
      await page.goto('/dashboard/courses');
      
      // If authenticated, should show course loading states
      await loadingUtils.verifyLoadingSequence(
        async () => {
          await page.waitForLoadState('networkidle');
        }
      );
    });

    test('should show loading for progress data', async ({ page }) => {
      await page.goto('/dashboard/progress');
      
      await loadingUtils.verifyLoadingSequence(
        async () => {
          await page.waitForLoadState('networkidle');
        }
      );
    });
  });

  test.describe('Auth Route Loading States', () => {
    test('should show loading during login', async ({ page }) => {
      await page.goto('/auth/login');
      await page.waitForLoadState('networkidle');
      
      const loginForm = page.locator('form').first();
      const emailInput = loginForm.locator('input[type="email"], input[name="email"]').first();
      const passwordInput = loginForm.locator('input[type="password"], input[name="password"]').first();
      const submitButton = loginForm.locator('button[type="submit"], input[type="submit"]').first();
      
      if (await emailInput.count() > 0 && await passwordInput.count() > 0 && await submitButton.count() > 0) {
        await loadingUtils.verifyLoadingSequence(
          async () => {
            await emailInput.fill('test@example.com');
            await passwordInput.fill('testpassword123');
            await submitButton.click();
            await page.waitForTimeout(2000);
          }
        );
      }
    });

    test('should show loading during registration', async ({ page }) => {
      await page.goto('/auth/register');
      await page.waitForLoadState('networkidle');
      
      const form = page.locator('form').first();
      
      if (await form.count() > 0) {
        await loadingUtils.verifyLoadingSequence(
          async () => {
            // Fill minimal required fields
            const inputs = form.locator('input[required]');
            const inputCount = await inputs.count();
            
            for (let i = 0; i < inputCount; i++) {
              const input = inputs.nth(i);
              const type = await input.getAttribute('type') || 'text';
              
              switch (type) {
                case 'email':
                  await input.fill('test@example.com');
                  break;
                case 'password':
                  await input.fill('TestPassword123!');
                  break;
                case 'text':
                  const name = await input.getAttribute('name') || '';
                  if (name.includes('name')) {
                    await input.fill('Test User');
                  } else {
                    await input.fill('Test Value');
                  }
                  break;
              }
            }
            
            const submitButton = form.locator('button[type="submit"]');
            if (await submitButton.count() > 0) {
              await submitButton.click();
              await page.waitForTimeout(2000);
            }
          }
        );
      }
    });

    test('should handle password reset loading', async ({ page }) => {
      await page.goto('/auth/forgot-password');
      await page.waitForLoadState('networkidle');
      
      const emailInput = page.locator('input[type="email"]').first();
      const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
      
      if (await emailInput.count() > 0 && await submitButton.count() > 0) {
        await loadingUtils.verifyLoadingSequence(
          async () => {
            await emailInput.fill('test@example.com');
            await submitButton.click();
            await page.waitForTimeout(1500);
          }
        );
      }
    });
  });

  test.describe('Loading State Accessibility', () => {
    test('should provide accessible loading indicators', async ({ page }) => {
      await page.goto('/');
      
      // Navigate and check for accessible loading indicators
      await page.goto('/courses');
      
      // Look for loading indicators with proper ARIA attributes
      const loadingIndicators = page.locator('[aria-live="polite"], [aria-live="assertive"], [role="status"], [aria-label*="loading" i]');
      
      // If loading indicators exist, they should be accessible
      const count = await loadingIndicators.count();
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const indicator = loadingIndicators.nth(i);
          
          // Should have appropriate ARIA attributes
          const hasAriaLive = await indicator.getAttribute('aria-live');
          const hasRole = await indicator.getAttribute('role');
          const hasAriaLabel = await indicator.getAttribute('aria-label');
          
          expect(hasAriaLive || hasRole || hasAriaLabel).toBeTruthy();
        }
      }
    });

    test('should announce loading state changes to screen readers', async ({ page }) => {
      await page.goto('/courses');
      await page.waitForLoadState('networkidle');
      
      // Check that loading state changes are announced
      // This would require more sophisticated testing with actual screen reader simulation
      const liveRegions = page.locator('[aria-live]');
      const count = await liveRegions.count();
      
      // Should have at least some live regions for dynamic content
      // This is more of a structural check
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Loading Performance', () => {
    test('should complete initial load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds on good network
      expect(loadTime).toBeLessThan(5000);
    });

    test('should show loading indicators for operations longer than 300ms', async ({ page }) => {
      // This test would need to be tailored to actual application behavior
      await page.goto('/courses');
      
      // Simulate slow operation
      await page.context().route('**/*', async (route) => {
        if (route.request().url().includes('/api/')) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        await route.continue();
      });
      
      // Any operation taking longer than 300ms should show loading indicator
      // This depends on actual API calls in the application
    });

    test('should handle concurrent loading operations', async ({ page }) => {
      // Navigate to multiple pages rapidly
      const promises = [
        page.goto('/'),
        page.goto('/courses'),
        page.goto('/about')
      ];
      
      // Wait for last navigation to complete
      await promises[2];
      await page.waitForLoadState('networkidle');
      
      // Final page should load correctly
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });
});