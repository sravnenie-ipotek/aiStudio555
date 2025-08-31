import { test, expect } from '../../fixtures/auth';
import { TestHelpers } from '../../utils/test-helpers';

test.describe('Payment Success Flow', () => {
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    testHelpers = new TestHelpers(page);
    
    // Mock successful payment data
    await testHelpers.mockApiResponse('/payments/verify-session*', {
      payment: {
        id: 'pay_1234567890',
        status: 'completed',
        amount: 1620, // $16.20
        currency: 'USD',
        method: 'stripe',
        sessionId: 'cs_test_session_123'
      },
      enrollment: {
        id: 'enroll_123',
        courseId: '1',
        userId: '1',
        status: 'active',
        enrolledAt: '2024-01-20T10:30:00Z'
      },
      course: {
        id: '1',
        title: 'AI Transformation Manager',
        description: 'Master AI transformation strategies',
        duration: '8 weeks',
        thumbnail: '/images/courses/ai-transformation.jpg'
      },
      receipt: {
        id: 'receipt_123',
        downloadUrl: '/receipts/receipt_123.pdf'
      }
    });
  });

  test('should display payment success page correctly @smoke @critical', async ({ page }) => {
    await page.goto('/payment/success?session_id=cs_test_session_123');
    
    // Check page title
    await expect(page).toHaveTitle(/.*Payment Successful.*/);
    
    // Check success message
    await expect(page.getByTestId('success-icon')).toBeVisible();
    await expect(page.getByTestId('success-title')).toContainText('Payment Successful!');
    await expect(page.getByTestId('success-message')).toContainText('Thank you for your purchase');
    
    // Check course information
    await expect(page.getByTestId('purchased-course-title')).toContainText('AI Transformation Manager');
    await expect(page.getByTestId('course-thumbnail')).toBeVisible();
    
    // Check payment details
    await expect(page.getByTestId('payment-amount')).toContainText('$16.20');
    await expect(page.getByTestId('payment-method')).toContainText('Stripe');
    await expect(page.getByTestId('payment-id')).toContainText('pay_1234567890');
    
    // Check action buttons
    await expect(page.getByTestId('start-learning-btn')).toBeVisible();
    await expect(page.getByTestId('download-receipt-btn')).toBeVisible();
    await expect(page.getByTestId('go-to-dashboard-btn')).toBeVisible();
    
    await testHelpers.takeScreenshot('payment-success-main');
  });

  test('should verify payment session correctly @critical', async ({ page }) => {
    await page.goto('/payment/success?session_id=cs_test_session_123');
    
    // Payment should be verified automatically
    await expect(page.getByTestId('payment-verified')).toBeVisible();
    await expect(page.getByTestId('enrollment-confirmed')).toBeVisible();
    
    // Check enrollment details
    await expect(page.getByTestId('enrollment-date')).toContainText('January 20, 2024');
    await expect(page.getByTestId('enrollment-status')).toContainText('Active');
  });

  test('should handle invalid session ID', async ({ page }) => {
    // Mock invalid session response
    await testHelpers.mockApiResponse('/payments/verify-session*', {
      message: 'Invalid session ID'
    }, 400);

    await page.goto('/payment/success?session_id=invalid_session');
    
    // Should show error state
    await expect(page.getByTestId('payment-error')).toBeVisible();
    await expect(page.getByTestId('error-message')).toContainText('Payment verification failed');
    await expect(page.getByTestId('contact-support-btn')).toBeVisible();
    await expect(page.getByTestId('back-to-courses-btn')).toBeVisible();
  });

  test('should handle missing session ID', async ({ page }) => {
    await page.goto('/payment/success');
    
    // Should show error for missing session
    await expect(page.getByTestId('missing-session-error')).toBeVisible();
    await expect(page.getByTestId('error-message')).toContainText('No payment session found');
    await expect(page.getByTestId('back-to-home-btn')).toBeVisible();
  });

  test('should navigate to course player @critical', async ({ page }) => {
    await page.goto('/payment/success?session_id=cs_test_session_123');
    
    // Click start learning button
    await page.getByTestId('start-learning-btn').click();
    
    // Should navigate to course player
    await expect(page).toHaveURL('/learn/1');
    await expect(page.getByTestId('course-player-container')).toBeVisible();
  });

  test('should navigate to dashboard', async ({ page }) => {
    await page.goto('/payment/success?session_id=cs_test_session_123');
    
    // Click go to dashboard button
    await page.getByTestId('go-to-dashboard-btn').click();
    
    // Should navigate to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByTestId('dashboard-header')).toBeVisible();
  });

  test('should download receipt @critical', async ({ page }) => {
    await page.goto('/payment/success?session_id=cs_test_session_123');
    
    // Mock receipt download
    await page.route('**/receipts/receipt_123.pdf', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/pdf',
        headers: {
          'Content-Disposition': 'attachment; filename="receipt_123.pdf"'
        },
        body: Buffer.from('Mock PDF receipt content')
      });
    });
    
    // Click download receipt button
    await page.getByTestId('download-receipt-btn').click();
    
    // Wait for download to start
    const download = await page.waitForEvent('download');
    expect(download.suggestedFilename()).toContain('receipt');
    expect(download.suggestedFilename()).toContain('.pdf');
  });

  test('should handle receipt download failure', async ({ page }) => {
    // Mock receipt download failure
    await page.route('**/receipts/receipt_123.pdf', route => route.abort());
    
    await page.goto('/payment/success?session_id=cs_test_session_123');
    
    // Try to download receipt
    await page.getByTestId('download-receipt-btn').click();
    
    // Should show error message
    await testHelpers.expectError('Failed to download receipt');
  });

  test('should display enrollment confirmation email sent', async ({ page }) => {
    await page.goto('/payment/success?session_id=cs_test_session_123');
    
    // Check email confirmation message
    await expect(page.getByTestId('email-sent-notification')).toBeVisible();
    await expect(page.getByTestId('email-sent-notification')).toContainText('A confirmation email has been sent');
    
    // Should show user's email address
    await expect(page.getByTestId('confirmation-email')).toContainText('student@test.projectdes.com');
  });

  test('should show next steps and recommendations', async ({ page }) => {
    // Mock related courses data
    await testHelpers.mockApiResponse('/courses/recommendations*', {
      courses: [
        {
          id: '2',
          title: 'No-Code Website Development',
          price: 1000,
          thumbnail: '/images/courses/no-code.jpg'
        },
        {
          id: '3', 
          title: 'AI Video & Avatar Generation',
          price: 1200,
          thumbnail: '/images/courses/ai-video.jpg'
        }
      ]
    });

    await page.goto('/payment/success?session_id=cs_test_session_123');
    
    // Check next steps section
    await expect(page.getByTestId('next-steps-section')).toBeVisible();
    await expect(page.getByTestId('next-steps-title')).toContainText('What\'s Next?');
    
    // Check step items
    await expect(page.getByTestId('step-access-course')).toContainText('Access your course materials');
    await expect(page.getByTestId('step-join-community')).toContainText('Join our student community');
    await expect(page.getByTestId('step-download-app')).toContainText('Download our mobile app');
    
    // Check recommended courses
    await expect(page.getByTestId('recommended-courses-section')).toBeVisible();
    await expect(page.getByTestId('recommended-courses-title')).toContainText('You might also like');
    
    const recommendedCourses = page.getByTestId('recommended-course-card');
    await expect(recommendedCourses).toHaveCount(2);
  });

  test('should handle payment pending status', async ({ page }) => {
    // Mock pending payment
    await testHelpers.mockApiResponse('/payments/verify-session*', {
      payment: {
        id: 'pay_pending_123',
        status: 'pending',
        amount: 1620,
        currency: 'USD',
        method: 'paypal'
      },
      course: {
        id: '1',
        title: 'AI Transformation Manager'
      }
    });

    await page.goto('/payment/success?session_id=cs_test_pending');
    
    // Should show pending status
    await expect(page.getByTestId('payment-pending-icon')).toBeVisible();
    await expect(page.getByTestId('pending-title')).toContainText('Payment Pending');
    await expect(page.getByTestId('pending-message')).toContainText('We\'re processing your payment');
    
    // Should not show start learning button
    await expect(page.getByTestId('start-learning-btn')).not.toBeVisible();
    
    // Should show check status button
    await expect(page.getByTestId('check-status-btn')).toBeVisible();
  });

  test('should handle payment failed status', async ({ page }) => {
    // Mock failed payment
    await testHelpers.mockApiResponse('/payments/verify-session*', {
      payment: {
        id: 'pay_failed_123',
        status: 'failed',
        amount: 1620,
        currency: 'USD',
        method: 'stripe',
        error: 'Card declined'
      }
    });

    await page.goto('/payment/success?session_id=cs_test_failed');
    
    // Should show failure status
    await expect(page.getByTestId('payment-failed-icon')).toBeVisible();
    await expect(page.getByTestId('failed-title')).toContainText('Payment Failed');
    await expect(page.getByTestId('failed-message')).toContainText('Your payment could not be processed');
    await expect(page.getByTestId('failure-reason')).toContainText('Card declined');
    
    // Should show retry button
    await expect(page.getByTestId('retry-payment-btn')).toBeVisible();
    await expect(page.getByTestId('contact-support-btn')).toBeVisible();
  });

  test('should show loading state during verification', async ({ page }) => {
    // Delay payment verification
    await page.route('**/api/payments/verify-session*', async route => {
      await new Promise(resolve => setTimeout(resolve, 3000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          payment: { id: 'pay_123', status: 'completed' }
        })
      });
    });

    await page.goto('/payment/success?session_id=cs_test_session_123');
    
    // Should show loading state
    await expect(page.getByTestId('payment-verification-loading')).toBeVisible();
    await expect(page.getByTestId('verification-spinner')).toBeVisible();
    await expect(page.getByTestId('verification-message')).toContainText('Verifying your payment...');
    
    // Wait for verification to complete
    await testHelpers.waitForLoading();
    await expect(page.getByTestId('success-title')).toBeVisible();
  });

  test('should be responsive on mobile @mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/payment/success?session_id=cs_test_session_123');
    
    // Check mobile layout
    await expect(page.getByTestId('success-page-mobile')).toBeVisible();
    
    // Course info should be optimized for mobile
    await expect(page.getByTestId('course-info-mobile')).toBeVisible();
    
    // Action buttons should stack vertically
    await expect(page.getByTestId('action-buttons-mobile')).toBeVisible();
    
    // Next steps should be collapsible on mobile
    await page.getByTestId('mobile-next-steps-toggle').click();
    await expect(page.getByTestId('next-steps-content')).toBeVisible();
    
    await testHelpers.takeScreenshot('payment-success-mobile');
  });

  test('should support social sharing', async ({ page }) => {
    await page.goto('/payment/success?session_id=cs_test_session_123');
    
    // Check social sharing section
    await expect(page.getByTestId('social-sharing-section')).toBeVisible();
    await expect(page.getByTestId('share-achievement-title')).toContainText('Share your achievement');
    
    // Check sharing buttons
    await expect(page.getByTestId('share-twitter-btn')).toBeVisible();
    await expect(page.getByTestId('share-linkedin-btn')).toBeVisible();
    await expect(page.getByTestId('share-facebook-btn')).toBeVisible();
    
    // Test Twitter sharing
    await page.getByTestId('share-twitter-btn').click();
    
    // Should open Twitter in new tab (we'll just check the URL construction)
    const twitterUrl = await page.getByTestId('share-twitter-btn').getAttribute('href');
    expect(twitterUrl).toContain('twitter.com');
    expect(twitterUrl).toContain('AI Transformation Manager');
  });

  test('should meet accessibility standards @accessibility', async ({ page }) => {
    await page.goto('/payment/success?session_id=cs_test_session_123');
    
    // Check accessibility compliance
    await testHelpers.checkAccessibility();
    
    // Check ARIA labels and roles
    await expect(page.getByTestId('success-icon')).toHaveAttribute('aria-label');
    await expect(page.getByTestId('payment-details')).toHaveAttribute('aria-label', 'Payment details');
    
    // Check heading hierarchy
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h2')).toHaveCount.greaterThan(0);
    
    // Test keyboard navigation
    await testHelpers.testKeyboardNavigation([
      'start-learning-btn',
      'download-receipt-btn', 
      'go-to-dashboard-btn'
    ]);
  });

  test('should handle multiple course enrollment', async ({ page }) => {
    // Mock multiple course purchase
    await testHelpers.mockApiResponse('/payments/verify-session*', {
      payment: {
        id: 'pay_multiple_123',
        status: 'completed',
        amount: 2500,
        currency: 'USD'
      },
      enrollments: [
        {
          id: 'enroll_1',
          courseId: '1',
          course: { id: '1', title: 'AI Transformation Manager' }
        },
        {
          id: 'enroll_2', 
          courseId: '2',
          course: { id: '2', title: 'No-Code Website Development' }
        }
      ]
    });

    await page.goto('/payment/success?session_id=cs_test_multiple');
    
    // Should show multiple courses
    await expect(page.getByTestId('multiple-courses-success')).toBeVisible();
    await expect(page.getByTestId('success-title')).toContainText('Courses Purchased Successfully!');
    
    // Should list all purchased courses
    const courseItems = page.getByTestId('purchased-course-item');
    await expect(courseItems).toHaveCount(2);
    
    // Each course should have its own start learning button
    await expect(page.getByTestId('start-learning-btn-1')).toBeVisible();
    await expect(page.getByTestId('start-learning-btn-2')).toBeVisible();
  });

  test('should handle session timeout', async ({ page }) => {
    // Mock session timeout error
    await testHelpers.mockApiResponse('/payments/verify-session*', {
      message: 'Payment session has expired'
    }, 410);

    await page.goto('/payment/success?session_id=cs_test_expired');
    
    // Should show timeout message
    await expect(page.getByTestId('session-timeout-error')).toBeVisible();
    await expect(page.getByTestId('timeout-message')).toContainText('Payment session has expired');
    await expect(page.getByTestId('contact-support-message')).toContainText('If you completed the payment, please contact support');
    
    // Should provide support contact options
    await expect(page.getByTestId('support-email-link')).toBeVisible();
    await expect(page.getByTestId('support-chat-btn')).toBeVisible();
  });
});