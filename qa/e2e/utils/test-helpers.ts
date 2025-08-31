import { Page, expect, Locator } from '@playwright/test';

/**
 * Common test utilities and helpers
 */

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Fill form field with validation
   */
  async fillField(testId: string, value: string, shouldValidate = true) {
    const field = this.page.getByTestId(testId);
    await field.fill(value);
    
    if (shouldValidate) {
      await expect(field).toHaveValue(value);
    }
  }

  /**
   * Submit form and wait for response
   */
  async submitForm(submitTestId: string, expectedUrl?: string) {
    await this.page.getByTestId(submitTestId).click();
    
    if (expectedUrl) {
      await this.page.waitForURL(expectedUrl, { timeout: 10000 });
    }
  }

  /**
   * Check for error message
   */
  async expectError(message: string) {
    await expect(this.page.getByTestId('error-message')).toContainText(message);
  }

  /**
   * Check for success message  
   */
  async expectSuccess(message?: string) {
    const successElement = this.page.getByTestId('success-message');
    await expect(successElement).toBeVisible();
    
    if (message) {
      await expect(successElement).toContainText(message);
    }
  }

  /**
   * Wait for loading state to finish
   */
  async waitForLoading() {
    // Wait for loading spinner to disappear
    await this.page.getByTestId('loading-spinner').waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * Take screenshot with descriptive name
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `qa/e2e/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  /**
   * Mock API response
   */
  async mockApiResponse(url: string, response: any, status = 200) {
    await this.page.route(`**/api${url}`, async route => {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }

  /**
   * Check responsive design
   */
  async testResponsive(sizes: Array<{ width: number; height: number; name: string }>) {
    for (const size of sizes) {
      await this.page.setViewportSize({ width: size.width, height: size.height });
      await this.waitForPageLoad();
      
      // Take screenshot for visual comparison
      await this.page.screenshot({ 
        path: `qa/e2e/screenshots/responsive-${size.name}-${Date.now()}.png`,
        fullPage: true 
      });
    }
  }

  /**
   * Test keyboard navigation
   */
  async testKeyboardNavigation(elements: string[]) {
    for (let i = 0; i < elements.length; i++) {
      await this.page.keyboard.press('Tab');
      const element = this.page.getByTestId(elements[i]);
      await expect(element).toBeFocused();
    }
  }

  /**
   * Test form validation
   */
  async testFormValidation(fields: Array<{ testId: string; invalidValue: string; expectedError: string }>) {
    for (const field of fields) {
      await this.fillField(field.testId, field.invalidValue, false);
      await this.page.getByTestId(field.testId).blur();
      
      const errorElement = this.page.getByTestId(`${field.testId}-error`);
      await expect(errorElement).toContainText(field.expectedError);
    }
  }

  /**
   * Wait for network requests to complete
   */
  async waitForNetworkIdle(timeout = 5000) {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Check accessibility compliance
   */
  async checkAccessibility() {
    // Check for alt attributes on images
    const images = await this.page.locator('img').all();
    for (const img of images) {
      await expect(img).toHaveAttribute('alt');
    }

    // Check for proper heading hierarchy
    const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);

    // Check for aria-labels on interactive elements
    const buttons = await this.page.locator('button').all();
    for (const button of buttons) {
      const hasAriaLabel = await button.getAttribute('aria-label');
      const hasText = await button.textContent();
      expect(hasAriaLabel || hasText).toBeTruthy();
    }
  }

  /**
   * Test performance metrics
   */
  async measurePerformance() {
    const performanceEntries = await this.page.evaluate(() => {
      return JSON.stringify(performance.getEntriesByType('navigation'));
    });
    
    const navigationTiming = JSON.parse(performanceEntries)[0];
    
    // Core Web Vitals thresholds
    const loadTime = navigationTiming.loadEventEnd - navigationTiming.fetchStart;
    const domContentLoaded = navigationTiming.domContentLoadedEventEnd - navigationTiming.fetchStart;
    
    // Assert performance thresholds
    expect(loadTime).toBeLessThan(3000); // 3 seconds
    expect(domContentLoaded).toBeLessThan(1500); // 1.5 seconds
    
    return {
      loadTime,
      domContentLoaded,
      ttfb: navigationTiming.responseStart - navigationTiming.fetchStart,
      domInteractive: navigationTiming.domInteractive - navigationTiming.fetchStart
    };
  }
}

/**
 * Course-related test helpers
 */
export class CourseHelpers extends TestHelpers {
  /**
   * Enroll in a course
   */
  async enrollInCourse(courseId: string) {
    await this.page.goto(`/courses/${courseId}`);
    await this.page.getByTestId('enroll-button').click();
    await this.waitForPageLoad();
  }

  /**
   * Navigate to course player
   */
  async goToCoursePlayer(courseId: string) {
    await this.page.goto(`/learn/${courseId}`);
    await this.waitForPageLoad();
  }

  /**
   * Play video lesson
   */
  async playVideoLesson() {
    const playButton = this.page.getByTestId('video-play-button');
    await playButton.click();
    
    // Wait for video to start playing
    await this.page.waitForTimeout(1000);
  }

  /**
   * Complete lesson
   */
  async completeLesson() {
    await this.page.getByTestId('mark-complete-button').click();
    await this.expectSuccess('Lesson marked as complete');
  }
}

/**
 * Payment-related test helpers
 */
export class PaymentHelpers extends TestHelpers {
  /**
   * Fill payment form
   */
  async fillPaymentForm(cardDetails: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    name: string;
  }) {
    await this.fillField('card-number', cardDetails.cardNumber);
    await this.fillField('expiry-date', cardDetails.expiryDate);
    await this.fillField('cvv', cardDetails.cvv);
    await this.fillField('cardholder-name', cardDetails.name);
  }

  /**
   * Test Stripe checkout flow
   */
  async testStripeCheckout(courseId: string) {
    await this.page.goto(`/checkout?courseId=${courseId}`);
    await this.page.getByTestId('stripe-checkout-button').click();
    
    // Mock Stripe success
    await this.mockApiResponse('/payments/stripe/checkout', {
      sessionId: 'test_session_123',
      url: 'https://checkout.stripe.com/test'
    });
  }

  /**
   * Test PayPal checkout flow
   */
  async testPayPalCheckout(courseId: string) {
    await this.page.goto(`/checkout?courseId=${courseId}`);
    await this.page.getByTestId('paypal-checkout-button').click();
    
    // Mock PayPal success
    await this.mockApiResponse('/payments/paypal/create-order', {
      orderId: 'test_order_123',
      approvalUrl: 'https://www.paypal.com/test'
    });
  }
}

/**
 * Common test data
 */
export const testData = {
  courses: {
    aiTransformation: {
      id: '1',
      title: 'AI Transformation Manager',
      price: 1500,
      duration: '8 weeks'
    },
    noCode: {
      id: '2', 
      title: 'No-Code Website Development',
      price: 1000,
      duration: '6 weeks'
    },
    aiVideo: {
      id: '3',
      title: 'AI Video & Avatar Generation', 
      price: 1200,
      duration: '4 weeks'
    }
  },
  
  payment: {
    testCard: {
      cardNumber: '4242424242424242',
      expiryDate: '12/25',
      cvv: '123',
      name: 'Test User'
    }
  }
};

/**
 * Device viewport configurations for responsive testing
 */
export const viewports = {
  mobile: { width: 375, height: 667, name: 'mobile' },
  tablet: { width: 768, height: 1024, name: 'tablet' },
  desktop: { width: 1920, height: 1080, name: 'desktop' },
  ultrawide: { width: 2560, height: 1440, name: 'ultrawide' }
};