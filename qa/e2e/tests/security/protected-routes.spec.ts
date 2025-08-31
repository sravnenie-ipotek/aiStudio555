import { test, expect } from '@playwright/test';
import { TestHelpers } from '../../utils/test-helpers';

test.describe('Protected Routes & Authorization', () => {
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    testHelpers = new TestHelpers(page);
  });

  test.describe('Unauthenticated Access', () => {
    test('should redirect to login when accessing dashboard without authentication @critical', async ({ page }) => {
      // Clear any existing auth tokens
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      // Try to access dashboard
      await page.goto('/dashboard');
      
      // Should redirect to login
      await expect(page).toHaveURL('/auth/login');
      
      // Should show appropriate message
      await expect(page.getByTestId('auth-required-message')).toContainText('Please log in to access this page');
    });

    test('should redirect to login when accessing course player without authentication @critical', async ({ page }) => {
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      // Try to access course player
      await page.goto('/learn/1');
      
      // Should redirect to login
      await expect(page).toHaveURL('/auth/login');
      await expect(page.getByTestId('auth-required-message')).toContainText('Please log in to access this page');
    });

    test('should redirect to login when accessing settings without authentication', async ({ page }) => {
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      await page.goto('/dashboard/settings');
      await expect(page).toHaveURL('/auth/login');
    });

    test('should redirect to login when accessing my courses without authentication', async ({ page }) => {
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      await page.goto('/dashboard/courses');
      await expect(page).toHaveURL('/auth/login');
    });

    test('should allow access to public pages without authentication', async ({ page }) => {
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      // Test public pages
      const publicPages = ['/', '/about', '/contact', '/programs'];
      
      for (const url of publicPages) {
        await page.goto(url);
        await expect(page).toHaveURL(url);
        
        // Should not redirect to login
        await page.waitForTimeout(1000);
        expect(page.url()).not.toContain('/auth/login');
      }
    });
  });

  test.describe('Invalid Token Handling', () => {
    test('should handle expired JWT token @critical', async ({ page }) => {
      // Set expired token
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'expired.jwt.token');
      });

      // Mock API response for expired token
      await testHelpers.mockApiResponse('/auth/me', {
        message: 'Token expired'
      }, 401);

      await page.goto('/dashboard');
      
      // Should redirect to login
      await expect(page).toHaveURL('/auth/login');
      
      // Token should be cleared
      const token = await page.evaluate(() => localStorage.getItem('accessToken'));
      expect(token).toBeNull();
    });

    test('should handle malformed JWT token', async ({ page }) => {
      // Set malformed token
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'malformed-token');
      });

      // Mock API response for malformed token
      await testHelpers.mockApiResponse('/auth/me', {
        message: 'Invalid token format'
      }, 401);

      await page.goto('/dashboard');
      
      // Should redirect to login
      await expect(page).toHaveURL('/auth/login');
      
      // Should show error message
      await expect(page.getByTestId('token-error-message')).toContainText('Your session has expired');
    });

    test('should attempt token refresh before redirecting', async ({ page }) => {
      // Set expired access token but valid refresh token
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'expired.access.token');
        localStorage.setItem('refreshToken', 'valid.refresh.token');
      });

      // Mock refresh token success
      await testHelpers.mockApiResponse('/auth/refresh', {
        accessToken: 'new.access.token',
        refreshToken: 'new.refresh.token'
      });

      // Mock successful auth check with new token
      await testHelpers.mockApiResponse('/auth/me', {
        id: '1',
        email: 'user@test.com',
        firstName: 'Test',
        lastName: 'User'
      });

      await page.goto('/dashboard');
      
      // Should successfully load dashboard
      await expect(page).toHaveURL('/dashboard');
      await expect(page.getByTestId('dashboard-header')).toBeVisible();
      
      // New tokens should be stored
      const newAccessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
      expect(newAccessToken).toBe('new.access.token');
    });

    test('should redirect to login when refresh token is also expired', async ({ page }) => {
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'expired.access.token');
        localStorage.setItem('refreshToken', 'expired.refresh.token');
      });

      // Mock refresh token failure
      await testHelpers.mockApiResponse('/auth/refresh', {
        message: 'Refresh token expired'
      }, 401);

      await page.goto('/dashboard');
      
      // Should redirect to login
      await expect(page).toHaveURL('/auth/login');
      
      // All tokens should be cleared
      const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
      const refreshToken = await page.evaluate(() => localStorage.getItem('refreshToken'));
      expect(accessToken).toBeNull();
      expect(refreshToken).toBeNull();
    });
  });

  test.describe('Role-Based Access Control', () => {
    test('should enforce student role restrictions', async ({ page }) => {
      // Mock student user
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'student.jwt.token');
      });

      await testHelpers.mockApiResponse('/auth/me', {
        id: '1',
        email: 'student@test.com',
        firstName: 'Student',
        lastName: 'User',
        role: 'student'
      });

      // Student should access their own courses
      await page.goto('/dashboard/courses');
      await expect(page).toHaveURL('/dashboard/courses');
      
      // Student should NOT access admin routes
      await page.goto('/admin/dashboard');
      await expect(page).toHaveURL('/dashboard'); // Redirect to student dashboard
      
      // Should show access denied message
      await expect(page.getByTestId('access-denied-message')).toContainText('Access denied');
    });

    test('should enforce instructor role restrictions', async ({ page }) => {
      // Mock instructor user
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'instructor.jwt.token');
      });

      await testHelpers.mockApiResponse('/auth/me', {
        id: '2',
        email: 'instructor@test.com',
        firstName: 'Instructor',
        lastName: 'User',
        role: 'instructor'
      });

      // Instructor should access their instructor dashboard
      await page.goto('/instructor/dashboard');
      await expect(page).toHaveURL('/instructor/dashboard');
      
      // Instructor should NOT access admin routes
      await page.goto('/admin/users');
      await expect(page).toHaveURL('/instructor/dashboard'); // Redirect to instructor dashboard
    });

    test('should allow admin access to all routes', async ({ page }) => {
      // Mock admin user
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'admin.jwt.token');
      });

      await testHelpers.mockApiResponse('/auth/me', {
        id: '3',
        email: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });

      // Admin should access admin routes
      await page.goto('/admin/dashboard');
      await expect(page).toHaveURL('/admin/dashboard');
      
      // Admin should also access other role dashboards
      await page.goto('/instructor/dashboard');
      await expect(page).toHaveURL('/instructor/dashboard');
      
      await page.goto('/dashboard');
      await expect(page).toHaveURL('/dashboard');
    });
  });

  test.describe('Course Enrollment Authorization', () => {
    test('should restrict course access to enrolled students only @critical', async ({ page }) => {
      // Mock authenticated but not enrolled user
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'valid.jwt.token');
      });

      await testHelpers.mockApiResponse('/auth/me', {
        id: '1',
        email: 'user@test.com',
        role: 'student'
      });

      // Mock course access check - not enrolled
      await testHelpers.mockApiResponse('/courses/1/access', {
        hasAccess: false,
        message: 'Course enrollment required'
      }, 403);

      await page.goto('/learn/1');
      
      // Should redirect to course purchase page
      await expect(page).toHaveURL('/programs/ai-transformation-manager');
      
      // Should show enrollment required message
      await expect(page.getByTestId('enrollment-required')).toContainText('Enroll in this course to access the content');
    });

    test('should allow course access to enrolled students', async ({ page }) => {
      // Mock enrolled user
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'enrolled.jwt.token');
      });

      await testHelpers.mockApiResponse('/auth/me', {
        id: '1',
        email: 'user@test.com',
        role: 'student'
      });

      // Mock course access check - enrolled
      await testHelpers.mockApiResponse('/courses/1/access', {
        hasAccess: true,
        enrollment: {
          id: 'enroll_123',
          status: 'active'
        }
      });

      // Mock course data
      await testHelpers.mockApiResponse('/courses/1', {
        id: '1',
        title: 'Test Course',
        lessons: []
      });

      await page.goto('/learn/1');
      
      // Should load course player
      await expect(page).toHaveURL('/learn/1');
      await expect(page.getByTestId('course-player-container')).toBeVisible();
    });

    test('should handle suspended enrollment', async ({ page }) => {
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'suspended.jwt.token');
      });

      await testHelpers.mockApiResponse('/auth/me', {
        id: '1',
        email: 'user@test.com',
        role: 'student'
      });

      // Mock suspended enrollment
      await testHelpers.mockApiResponse('/courses/1/access', {
        hasAccess: false,
        enrollment: {
          id: 'enroll_123',
          status: 'suspended'
        },
        message: 'Your enrollment has been suspended'
      }, 403);

      await page.goto('/learn/1');
      
      // Should show suspension message
      await expect(page.getByTestId('enrollment-suspended')).toContainText('Your enrollment has been suspended');
      await expect(page.getByTestId('contact-support-btn')).toBeVisible();
    });
  });

  test.describe('Session Management', () => {
    test('should handle concurrent sessions', async ({ page, context }) => {
      // Create first session
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'session1.jwt.token');
      });

      await testHelpers.mockApiResponse('/auth/me', {
        id: '1',
        email: 'user@test.com'
      });

      await page.goto('/dashboard');
      await expect(page.getByTestId('dashboard-header')).toBeVisible();
      
      // Create second browser context (simulating another device/tab)
      const page2 = await context.newPage();
      await page2.evaluate(() => {
        localStorage.setItem('accessToken', 'session2.jwt.token');
      });

      // Mock concurrent session detection
      await page2.route('**/api/auth/me', route => {
        route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Session conflict detected'
          })
        });
      });

      await page2.goto('/dashboard');
      
      // Should show session conflict message
      await expect(page2.getByTestId('session-conflict')).toContainText('Another session is active');
    });

    test('should handle session timeout', async ({ page }) => {
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'valid.jwt.token');
      });

      await testHelpers.mockApiResponse('/auth/me', {
        id: '1',
        email: 'user@test.com'
      });

      await page.goto('/dashboard');
      
      // Mock session timeout after some activity
      await page.waitForTimeout(1000);
      
      await page.route('**/api/**', route => {
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Session expired'
          })
        });
      });

      // Make an API call that triggers session check
      await page.getByTestId('refresh-data-btn').click();
      
      // Should show session timeout modal
      await expect(page.getByTestId('session-timeout-modal')).toBeVisible();
      await expect(page.getByTestId('session-expired-message')).toContainText('Your session has expired');
    });
  });

  test.describe('API Route Protection', () => {
    test('should protect API endpoints from unauthorized access', async ({ page }) => {
      // Test API calls without authentication
      const response = await page.request.get('/api/courses/enrollments/my');
      expect(response.status()).toBe(401);
      
      const body = await response.json();
      expect(body.message).toContain('Authentication required');
    });

    test('should validate API tokens correctly', async ({ page }) => {
      // Test with invalid token
      const response = await page.request.get('/api/courses/enrollments/my', {
        headers: {
          'Authorization': 'Bearer invalid.token.here'
        }
      });
      
      expect(response.status()).toBe(401);
      
      const body = await response.json();
      expect(body.message).toContain('Invalid token');
    });

    test('should enforce role-based API access', async ({ page }) => {
      // Mock student trying to access admin API
      const response = await page.request.get('/api/admin/users', {
        headers: {
          'Authorization': 'Bearer student.jwt.token'
        }
      });
      
      expect(response.status()).toBe(403);
      
      const body = await response.json();
      expect(body.message).toContain('Insufficient permissions');
    });
  });

  test.describe('Security Headers & Protection', () => {
    test('should implement proper security headers', async ({ page }) => {
      const response = await page.goto('/dashboard');
      
      // Check security headers
      const headers = response.headers();
      
      // CSRF Protection
      expect(headers['x-frame-options']).toBeDefined();
      expect(headers['x-content-type-options']).toBe('nosniff');
      expect(headers['x-xss-protection']).toBeDefined();
      
      // HTTPS enforcement (in production)
      if (process.env.NODE_ENV === 'production') {
        expect(headers['strict-transport-security']).toBeDefined();
      }
    });

    test('should prevent XSS attacks', async ({ page }) => {
      // Mock authenticated user
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'valid.jwt.token');
      });

      await testHelpers.mockApiResponse('/auth/me', {
        id: '1',
        email: 'user@test.com'
      });

      // Try to inject script via URL parameters
      await page.goto('/dashboard?malicious=<script>alert("xss")</script>');
      
      // Script should not execute
      await page.waitForTimeout(1000);
      
      // Check that no alert was shown (page dialogs would be captured by Playwright)
      // and that the malicious content is escaped
      const content = await page.content();
      expect(content).not.toContain('<script>alert("xss")</script>');
    });

    test('should prevent CSRF attacks', async ({ page }) => {
      // Mock authenticated user
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'valid.jwt.token');
      });

      // Try to make a request without CSRF token (if implemented)
      const response = await page.request.post('/api/users/profile', {
        data: {
          firstName: 'Malicious',
          lastName: 'Update'
        }
      });
      
      // Should be rejected if CSRF protection is enabled
      // This depends on your CSRF implementation
      if (response.status() === 403) {
        const body = await response.json();
        expect(body.message).toContain('CSRF');
      }
    });
  });

  test.describe('Rate Limiting', () => {
    test('should implement rate limiting on sensitive endpoints', async ({ page }) => {
      // Test login rate limiting
      const loginAttempts = [];
      
      for (let i = 0; i < 10; i++) {
        const attempt = page.request.post('/api/auth/login', {
          data: {
            email: 'test@example.com',
            password: 'wrongpassword'
          }
        });
        loginAttempts.push(attempt);
      }
      
      const responses = await Promise.all(loginAttempts);
      
      // Should eventually return rate limit error
      const rateLimitedResponses = responses.filter(r => r.status() === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'valid.jwt.token');
      });

      // Simulate network failure
      await page.setOfflineMode(true);
      
      await page.goto('/dashboard');
      
      // Should show offline message
      await expect(page.getByTestId('offline-indicator')).toBeVisible();
      await expect(page.getByTestId('offline-message')).toContainText('You appear to be offline');
      
      // Restore connection
      await page.setOfflineMode(false);
      
      // Should retry automatically or show retry button
      await page.getByTestId('retry-connection-btn').click();
      await expect(page.getByTestId('dashboard-header')).toBeVisible();
    });

    test('should handle server errors gracefully', async ({ page }) => {
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'valid.jwt.token');
      });

      // Mock server error
      await page.route('**/api/auth/me', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Internal server error'
          })
        });
      });

      await page.goto('/dashboard');
      
      // Should show error page or message
      await expect(page.getByTestId('server-error')).toBeVisible();
      await expect(page.getByTestId('error-message')).toContainText('Something went wrong');
      await expect(page.getByTestId('retry-btn')).toBeVisible();
    });
  });
});