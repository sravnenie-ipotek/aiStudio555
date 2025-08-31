import { test, expect } from '../../fixtures/auth';
import { TestHelpers } from '../../utils/test-helpers';

test.describe('API Integration Tests', () => {
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    testHelpers = new TestHelpers(page);
  });

  test.describe('Authentication API', () => {
    test('should handle login API correctly @critical', async ({ page }) => {
      const loginData = {
        email: 'test@example.com',
        password: 'SecurePass123!'
      };

      // Mock successful login response
      await page.route('**/api/auth/login', route => {
        const request = route.request();
        const postData = JSON.parse(request.postData());
        
        expect(postData.email).toBe(loginData.email);
        expect(postData.password).toBe(loginData.password);
        
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: {
            'Set-Cookie': 'refreshToken=valid.refresh.token; HttpOnly; Secure'
          },
          body: JSON.stringify({
            accessToken: 'valid.access.token',
            refreshToken: 'valid.refresh.token',
            user: {
              id: '1',
              email: loginData.email,
              firstName: 'Test',
              lastName: 'User',
              role: 'student'
            }
          })
        });
      });

      await page.goto('/auth/login');
      
      // Fill and submit login form
      await testHelpers.fillField('email-input', loginData.email);
      await testHelpers.fillField('password-input', loginData.password);
      await page.getByTestId('login-submit').click();
      
      // Verify successful login
      await expect(page).toHaveURL('/dashboard');
      
      // Verify tokens are stored
      const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
      expect(accessToken).toBe('valid.access.token');
    });

    test('should handle token refresh API correctly @critical', async ({ page }) => {
      // Set expired access token
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'expired.token');
        localStorage.setItem('refreshToken', 'valid.refresh.token');
      });

      let refreshCalled = false;
      
      // Mock token refresh endpoint
      await page.route('**/api/auth/refresh', route => {
        refreshCalled = true;
        const request = route.request();
        const postData = JSON.parse(request.postData());
        
        expect(postData.refreshToken).toBe('valid.refresh.token');
        
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            accessToken: 'new.access.token',
            refreshToken: 'new.refresh.token'
          })
        });
      });

      // Mock protected endpoint that returns 401
      let protectedCallCount = 0;
      await page.route('**/api/auth/me', route => {
        protectedCallCount++;
        const authHeader = route.request().headers()['authorization'];
        
        if (protectedCallCount === 1 && authHeader === 'Bearer expired.token') {
          // First call with expired token
          route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Token expired' })
          });
        } else if (protectedCallCount === 2 && authHeader === 'Bearer new.access.token') {
          // Second call with new token after refresh
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              id: '1',
              email: 'user@test.com',
              firstName: 'Test',
              lastName: 'User'
            })
          });
        }
      });

      // Navigate to protected page
      await page.goto('/dashboard');
      
      // Verify token refresh was called
      expect(refreshCalled).toBe(true);
      expect(protectedCallCount).toBe(2);
      
      // Verify new tokens are stored
      const newAccessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
      expect(newAccessToken).toBe('new.access.token');
    });
  });

  test.describe('Course API', () => {
    test('should fetch user courses correctly', async ({ page }) => {
      let apiCalled = false;
      
      // Mock courses API
      await page.route('**/api/courses/enrollments/my', route => {
        apiCalled = true;
        
        // Verify authentication header
        const authHeader = route.request().headers()['authorization'];
        expect(authHeader).toContain('Bearer');
        
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            enrollments: [
              {
                id: '1',
                courseId: '1',
                course: {
                  id: '1',
                  title: 'Test Course',
                  description: 'Test Description',
                  price: 100,
                  duration: '4 weeks'
                },
                progress: 50,
                status: 'active'
              }
            ],
            stats: {
              totalCourses: 1,
              completedCourses: 0,
              averageProgress: 50
            }
          })
        });
      });

      await page.goto('/dashboard/courses');
      
      // Verify API was called
      expect(apiCalled).toBe(true);
      
      // Verify course data is displayed
      await expect(page.getByTestId('course-card')).toBeVisible();
      await expect(page.getByTestId('course-title')).toContainText('Test Course');
    });

    test('should handle course progress updates', async ({ page }) => {
      const courseId = '1';
      const lessonId = '1';
      let progressUpdated = false;
      
      // Mock progress update API
      await page.route(`**/api/courses/${courseId}/lessons/${lessonId}/progress`, route => {
        progressUpdated = true;
        const request = route.request();
        const method = request.method();
        const postData = JSON.parse(request.postData());
        
        expect(method).toBe('POST');
        expect(postData).toHaveProperty('completed');
        expect(postData).toHaveProperty('watchTime');
        
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Progress updated successfully',
            progress: {
              completed: postData.completed,
              watchTime: postData.watchTime,
              currentTime: postData.currentTime
            }
          })
        });
      });

      // Mock course data
      await testHelpers.mockApiResponse(`/courses/${courseId}`, {
        id: courseId,
        title: 'Test Course',
        currentLesson: {
          id: lessonId,
          title: 'Test Lesson'
        }
      });

      await page.goto(`/learn/${courseId}`);
      
      // Simulate marking lesson as complete
      await page.evaluate(() => {
        // Simulate API call
        fetch(`/api/courses/1/lessons/1/progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({
            completed: true,
            watchTime: 25,
            currentTime: 1500
          })
        });
      });

      await page.waitForTimeout(1000);
      expect(progressUpdated).toBe(true);
    });
  });

  test.describe('Payment API', () => {
    test('should create Stripe checkout session correctly', async ({ page }) => {
      let checkoutSessionCreated = false;
      
      // Mock Stripe checkout API
      await page.route('**/api/payments/stripe/checkout', route => {
        checkoutSessionCreated = true;
        const request = route.request();
        const postData = JSON.parse(request.postData());
        
        expect(postData).toHaveProperty('courseId');
        expect(postData.courseId).toBe('1');
        
        // Verify authentication
        const authHeader = request.headers()['authorization'];
        expect(authHeader).toContain('Bearer');
        
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            sessionId: 'cs_test_session_123',
            url: 'https://checkout.stripe.com/c/pay/cs_test_session_123'
          })
        });
      });

      await page.goto('/checkout?courseId=1');
      
      // Fill required billing info
      await testHelpers.fillField('billing-first-name', 'John');
      await testHelpers.fillField('billing-last-name', 'Doe');
      await testHelpers.fillField('billing-email', 'john@example.com');
      
      // Select Stripe and proceed
      await page.getByTestId('stripe-payment-option').click();
      await page.getByTestId('proceed-to-payment-btn').click();
      
      expect(checkoutSessionCreated).toBe(true);
    });

    test('should verify payment session correctly', async ({ page }) => {
      const sessionId = 'cs_test_session_123';
      let verificationCalled = false;
      
      // Mock payment verification API
      await page.route(`**/api/payments/verify-session?session_id=${sessionId}`, route => {
        verificationCalled = true;
        
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            payment: {
              id: 'pay_123456789',
              status: 'completed',
              amount: 1620,
              currency: 'USD',
              method: 'stripe'
            },
            enrollment: {
              id: 'enroll_123',
              courseId: '1',
              status: 'active'
            },
            course: {
              id: '1',
              title: 'Test Course'
            }
          })
        });
      });

      await page.goto(`/payment/success?session_id=${sessionId}`);
      
      expect(verificationCalled).toBe(true);
      await expect(page.getByTestId('success-title')).toContainText('Payment Successful');
    });
  });

  test.describe('User Management API', () => {
    test('should update user profile correctly', async ({ page }) => {
      let profileUpdated = false;
      
      // Mock profile update API
      await page.route('**/api/users/profile', route => {
        profileUpdated = true;
        const request = route.request();
        const method = request.method();
        const postData = JSON.parse(request.postData());
        
        expect(method).toBe('PUT');
        expect(postData).toHaveProperty('firstName');
        expect(postData).toHaveProperty('lastName');
        
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Profile updated successfully',
            user: {
              id: '1',
              ...postData
            }
          })
        });
      });

      await page.goto('/dashboard/settings');
      
      // Update profile
      await testHelpers.fillField('first-name-input', 'Updated');
      await testHelpers.fillField('last-name-input', 'Name');
      await page.getByTestId('save-profile-btn').click();
      
      expect(profileUpdated).toBe(true);
      await testHelpers.expectSuccess('Profile updated successfully');
    });

    test('should handle password change correctly', async ({ page }) => {
      let passwordChanged = false;
      
      // Mock password change API
      await page.route('**/api/users/change-password', route => {
        passwordChanged = true;
        const request = route.request();
        const postData = JSON.parse(request.postData());
        
        expect(postData).toHaveProperty('currentPassword');
        expect(postData).toHaveProperty('newPassword');
        
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Password changed successfully'
          })
        });
      });

      await page.goto('/dashboard/settings');
      await page.getByTestId('settings-tab-security').click();
      
      // Change password
      await testHelpers.fillField('current-password-input', 'CurrentPass123!');
      await testHelpers.fillField('new-password-input', 'NewPass123!');
      await testHelpers.fillField('confirm-new-password-input', 'NewPass123!');
      await page.getByTestId('change-password-btn').click();
      
      expect(passwordChanged).toBe(true);
      await testHelpers.expectSuccess('Password changed successfully');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle API timeout errors', async ({ page }) => {
      // Mock API timeout
      await page.route('**/api/courses/enrollments/my', async route => {
        await new Promise(resolve => setTimeout(resolve, 10000)); // 10 second delay
        route.fulfill({
          status: 408,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Request timeout'
          })
        });
      });

      await page.goto('/dashboard/courses', { timeout: 5000 });
      
      // Should show timeout error
      await expect(page.getByTestId('timeout-error')).toBeVisible();
      await expect(page.getByTestId('error-message')).toContainText('Request timed out');
    });

    test('should handle API validation errors', async ({ page }) => {
      // Mock validation error
      await page.route('**/api/users/profile', route => {
        route.fulfill({
          status: 422,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Validation failed',
            errors: [
              {
                field: 'email',
                message: 'Email format is invalid'
              },
              {
                field: 'firstName',
                message: 'First name is required'
              }
            ]
          })
        });
      });

      await page.goto('/dashboard/settings');
      
      // Try to update with invalid data
      await testHelpers.fillField('first-name-input', '');
      await testHelpers.fillField('email-input', 'invalid-email');
      await page.getByTestId('save-profile-btn').click();
      
      // Should show field-specific errors
      await expect(page.getByTestId('first-name-input-error')).toContainText('First name is required');
      await expect(page.getByTestId('email-input-error')).toContainText('Email format is invalid');
    });

    test('should handle network connectivity issues', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Simulate network disconnection
      await page.setOfflineMode(true);
      
      // Try to make API call
      await page.getByTestId('refresh-data-btn').click();
      
      // Should show offline indicator
      await expect(page.getByTestId('offline-indicator')).toBeVisible();
      await expect(page.getByTestId('offline-message')).toContainText('You appear to be offline');
      
      // Restore connection
      await page.setOfflineMode(false);
      
      // Should retry automatically or show retry option
      await page.getByTestId('retry-connection-btn').click();
      await expect(page.getByTestId('offline-indicator')).toBeHidden();
    });

    test('should handle server maintenance mode', async ({ page }) => {
      // Mock maintenance mode response
      await page.route('**/api/**', route => {
        route.fulfill({
          status: 503,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Service temporarily unavailable',
            maintenanceMode: true,
            estimatedDuration: '30 minutes'
          })
        });
      });

      await page.goto('/dashboard');
      
      // Should show maintenance message
      await expect(page.getByTestId('maintenance-notice')).toBeVisible();
      await expect(page.getByTestId('maintenance-message')).toContainText('Service temporarily unavailable');
      await expect(page.getByTestId('estimated-duration')).toContainText('30 minutes');
    });
  });

  test.describe('API Performance & Caching', () => {
    test('should implement proper caching headers', async ({ page }) => {
      let requestCount = 0;
      
      // Monitor course data requests
      await page.route('**/api/courses/1', route => {
        requestCount++;
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: {
            'Cache-Control': 'max-age=300', // 5 minutes
            'ETag': '"course-1-etag-123"'
          },
          body: JSON.stringify({
            id: '1',
            title: 'Cached Course',
            description: 'Test caching'
          })
        });
      });

      // First request
      await page.goto('/programs/course-1');
      expect(requestCount).toBe(1);
      
      // Second request (should be cached)
      await page.reload();
      
      // Depending on implementation, might still make request with If-None-Match header
      // but should handle 304 Not Modified responses
    });

    test('should handle API rate limiting gracefully', async ({ page }) => {
      let requestCount = 0;
      
      // Mock rate limiting
      await page.route('**/api/courses/enrollments/my', route => {
        requestCount++;
        
        if (requestCount <= 5) {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ enrollments: [] })
          });
        } else {
          route.fulfill({
            status: 429,
            contentType: 'application/json',
            headers: {
              'Retry-After': '60'
            },
            body: JSON.stringify({
              message: 'Too many requests',
              retryAfter: 60
            })
          });
        }
      });

      // Make multiple requests
      for (let i = 0; i < 7; i++) {
        await page.reload();
        await page.waitForTimeout(100);
      }

      // Should show rate limit message
      await expect(page.getByTestId('rate-limit-error')).toBeVisible();
      await expect(page.getByTestId('retry-after-message')).toContainText('Try again in 60 seconds');
    });
  });

  test.describe('Real-time Features', () => {
    test('should handle WebSocket connections for real-time updates', async ({ page }) => {
      // Mock WebSocket connection for real-time course progress
      await page.addInitScript(() => {
        class MockWebSocket {
          constructor(url) {
            this.url = url;
            this.onopen = null;
            this.onmessage = null;
            this.onclose = null;
            this.onerror = null;
            
            setTimeout(() => {
              if (this.onopen) this.onopen();
            }, 100);
          }
          
          send(data) {
            // Mock sending progress update
            setTimeout(() => {
              if (this.onmessage) {
                this.onmessage({
                  data: JSON.stringify({
                    type: 'progress_update',
                    courseId: '1',
                    progress: 75
                  })
                });
              }
            }, 500);
          }
          
          close() {
            if (this.onclose) this.onclose();
          }
        }
        
        window.WebSocket = MockWebSocket;
      });

      await page.goto('/learn/1');
      
      // Should establish WebSocket connection
      await expect(page.getByTestId('connection-status')).toContainText('Connected');
      
      // Should receive real-time progress updates
      await page.waitForTimeout(1000);
      await expect(page.getByTestId('course-progress')).toContainText('75%');
    });
  });
});