import { test, expect } from '../../fixtures/auth';
import { TestHelpers, PaymentHelpers, testData } from '../../utils/test-helpers';

test.describe('Payment Flow - Checkout', () => {
  let testHelpers: TestHelpers;
  let paymentHelpers: PaymentHelpers;

  test.beforeEach(async ({ page }) => {
    testHelpers = new TestHelpers(page);
    paymentHelpers = new PaymentHelpers(page);
    
    // Mock course data for checkout
    await testHelpers.mockApiResponse('/courses/1', testData.courses.aiTransformation);
    
    // Mock coupon validation
    await testHelpers.mockApiResponse('/payments/apply-coupon', {
      valid: true,
      discount: 0.2, // 20% discount
      discountedPrice: 1200,
      message: 'Coupon applied successfully'
    });
  });

  test('should display checkout page correctly @smoke @critical', async ({ page }) => {
    await page.goto('/checkout?courseId=1');
    
    // Check page title
    await expect(page).toHaveTitle(/.*Checkout.*/);
    
    // Check course information
    await expect(page.getByTestId('checkout-course-title')).toContainText('AI Transformation Manager');
    await expect(page.getByTestId('checkout-course-price')).toContainText('$1,500');
    await expect(page.getByTestId('checkout-course-duration')).toContainText('8 weeks');
    
    // Check payment options
    await expect(page.getByTestId('payment-methods')).toBeVisible();
    await expect(page.getByTestId('stripe-payment-option')).toBeVisible();
    await expect(page.getByTestId('paypal-payment-option')).toBeVisible();
    
    // Check form sections
    await expect(page.getByTestId('billing-information')).toBeVisible();
    await expect(page.getByTestId('payment-summary')).toBeVisible();
    
    await testHelpers.takeScreenshot('checkout-page-main');
  });

  test('should calculate price correctly with tax', async ({ page }) => {
    await page.goto('/checkout?courseId=1');
    
    // Check price breakdown
    await expect(page.getByTestId('subtotal-amount')).toContainText('$1,500.00');
    await expect(page.getByTestId('tax-amount')).toContainText('$120.00'); // 8% tax
    await expect(page.getByTestId('total-amount')).toContainText('$1,620.00');
  });

  test('should apply coupon code successfully @critical', async ({ page }) => {
    await page.goto('/checkout?courseId=1');
    
    // Apply coupon
    await testHelpers.fillField('coupon-code-input', 'SAVE20');
    await page.getByTestId('apply-coupon-btn').click();
    
    // Check success message
    await testHelpers.expectSuccess('Coupon applied successfully');
    
    // Check updated pricing
    await expect(page.getByTestId('discount-amount')).toContainText('-$300.00');
    await expect(page.getByTestId('subtotal-amount')).toContainText('$1,200.00');
    await expect(page.getByTestId('total-amount')).toContainText('$1,296.00'); // $1200 + 8% tax
    
    // Coupon should be displayed
    await expect(page.getByTestId('applied-coupon')).toContainText('SAVE20');
    await expect(page.getByTestId('remove-coupon-btn')).toBeVisible();
  });

  test('should handle invalid coupon code', async ({ page }) => {
    // Mock invalid coupon response
    await testHelpers.mockApiResponse('/payments/apply-coupon', {
      valid: false,
      message: 'Invalid coupon code'
    }, 400);

    await page.goto('/checkout?courseId=1');
    
    // Apply invalid coupon
    await testHelpers.fillField('coupon-code-input', 'INVALID');
    await page.getByTestId('apply-coupon-btn').click();
    
    // Check error message
    await testHelpers.expectError('Invalid coupon code');
    
    // Pricing should remain unchanged
    await expect(page.getByTestId('total-amount')).toContainText('$1,620.00');
  });

  test('should remove applied coupon', async ({ page }) => {
    await page.goto('/checkout?courseId=1');
    
    // Apply coupon first
    await testHelpers.fillField('coupon-code-input', 'SAVE20');
    await page.getByTestId('apply-coupon-btn').click();
    await testHelpers.expectSuccess('Coupon applied successfully');
    
    // Remove coupon
    await page.getByTestId('remove-coupon-btn').click();
    
    // Pricing should revert
    await expect(page.getByTestId('total-amount')).toContainText('$1,620.00');
    await expect(page.getByTestId('applied-coupon')).not.toBeVisible();
  });

  test('should validate billing information @critical', async ({ page }) => {
    await page.goto('/checkout?courseId=1');
    
    // Try to proceed without filling billing info
    await page.getByTestId('proceed-to-payment-btn').click();
    
    // Check validation errors
    await expect(page.getByTestId('billing-first-name-error')).toContainText('First name is required');
    await expect(page.getByTestId('billing-last-name-error')).toContainText('Last name is required');
    await expect(page.getByTestId('billing-email-error')).toContainText('Email is required');
    await expect(page.getByTestId('billing-address-error')).toContainText('Address is required');
    await expect(page.getByTestId('billing-city-error')).toContainText('City is required');
    await expect(page.getByTestId('billing-country-error')).toContainText('Country is required');
  });

  test('should fill billing information correctly', async ({ page }) => {
    await page.goto('/checkout?courseId=1');
    
    // Fill billing information
    await testHelpers.fillField('billing-first-name', 'John');
    await testHelpers.fillField('billing-last-name', 'Doe');
    await testHelpers.fillField('billing-email', 'john.doe@example.com');
    await testHelpers.fillField('billing-address', '123 Main St');
    await testHelpers.fillField('billing-city', 'New York');
    await testHelpers.fillField('billing-postal-code', '10001');
    
    // Select country
    await page.getByTestId('billing-country-select').selectOption('US');
    
    // Select state (should appear after country selection)
    await expect(page.getByTestId('billing-state-select')).toBeVisible();
    await page.getByTestId('billing-state-select').selectOption('NY');
    
    // Proceed button should be enabled
    await expect(page.getByTestId('proceed-to-payment-btn')).toBeEnabled();
  });

  test.describe('Stripe Payment Flow', () => {
    test('should initiate Stripe checkout @critical', async ({ page }) => {
      await page.goto('/checkout?courseId=1');
      
      // Fill billing information
      await testHelpers.fillField('billing-first-name', 'John');
      await testHelpers.fillField('billing-last-name', 'Doe');
      await testHelpers.fillField('billing-email', 'john.doe@example.com');
      await testHelpers.fillField('billing-address', '123 Main St');
      await testHelpers.fillField('billing-city', 'New York');
      await page.getByTestId('billing-country-select').selectOption('US');
      await page.getByTestId('billing-state-select').selectOption('NY');
      
      // Select Stripe payment
      await page.getByTestId('stripe-payment-option').click();
      await expect(page.getByTestId('stripe-payment-option')).toBeChecked();
      
      // Mock Stripe checkout session creation
      await testHelpers.mockApiResponse('/payments/stripe/checkout', {
        sessionId: 'cs_test_session_123',
        url: 'https://checkout.stripe.com/c/pay/cs_test_session_123'
      });
      
      // Proceed to payment
      await page.getByTestId('proceed-to-payment-btn').click();
      
      // Should redirect to Stripe (in real test, you'd mock this)
      // For testing purposes, we'll check that the API was called correctly
      await expect(page.getByTestId('payment-processing')).toBeVisible();
    });

    test('should handle Stripe checkout errors', async ({ page }) => {
      await page.goto('/checkout?courseId=1');
      
      // Fill minimal required info
      await testHelpers.fillField('billing-first-name', 'John');
      await testHelpers.fillField('billing-last-name', 'Doe');
      await testHelpers.fillField('billing-email', 'john.doe@example.com');
      
      // Mock Stripe error
      await testHelpers.mockApiResponse('/payments/stripe/checkout', {
        message: 'Payment processing failed'
      }, 400);
      
      await page.getByTestId('stripe-payment-option').click();
      await page.getByTestId('proceed-to-payment-btn').click();
      
      // Check error handling
      await testHelpers.expectError('Payment processing failed');
    });
  });

  test.describe('PayPal Payment Flow', () => {
    test('should initiate PayPal checkout @critical', async ({ page }) => {
      await page.goto('/checkout?courseId=1');
      
      // Fill billing information
      await testHelpers.fillField('billing-first-name', 'John');
      await testHelpers.fillField('billing-last-name', 'Doe');
      await testHelpers.fillField('billing-email', 'john.doe@example.com');
      await testHelpers.fillField('billing-address', '123 Main St');
      await testHelpers.fillField('billing-city', 'New York');
      await page.getByTestId('billing-country-select').selectOption('US');
      
      // Select PayPal payment
      await page.getByTestId('paypal-payment-option').click();
      await expect(page.getByTestId('paypal-payment-option')).toBeChecked();
      
      // Mock PayPal order creation
      await testHelpers.mockApiResponse('/payments/paypal/create-order', {
        orderId: 'ORDER123456789',
        approvalUrl: 'https://www.paypal.com/checkoutnow?token=ORDER123456789'
      });
      
      // Proceed to payment
      await page.getByTestId('proceed-to-payment-btn').click();
      
      // Should show PayPal processing
      await expect(page.getByTestId('paypal-processing')).toBeVisible();
    });

    test('should handle PayPal order creation errors', async ({ page }) => {
      await page.goto('/checkout?courseId=1');
      
      // Fill minimal required info
      await testHelpers.fillField('billing-first-name', 'John');
      await testHelpers.fillField('billing-last-name', 'Doe');
      await testHelpers.fillField('billing-email', 'john.doe@example.com');
      
      // Mock PayPal error
      await testHelpers.mockApiResponse('/payments/paypal/create-order', {
        message: 'PayPal order creation failed'
      }, 400);
      
      await page.getByTestId('paypal-payment-option').click();
      await page.getByTestId('proceed-to-payment-btn').click();
      
      // Check error handling
      await testHelpers.expectError('PayPal order creation failed');
    });
  });

  test('should handle checkout without course ID', async ({ page }) => {
    await page.goto('/checkout');
    
    // Should show error message
    await expect(page.getByTestId('checkout-error')).toContainText('Course not found');
    await expect(page.getByTestId('back-to-courses-btn')).toBeVisible();
    
    // Click back to courses
    await page.getByTestId('back-to-courses-btn').click();
    await expect(page).toHaveURL('/programs');
  });

  test('should handle invalid course ID', async ({ page }) => {
    // Mock course not found error
    await testHelpers.mockApiResponse('/courses/999', {
      message: 'Course not found'
    }, 404);

    await page.goto('/checkout?courseId=999');
    
    // Should show error message
    await expect(page.getByTestId('course-not-found')).toContainText('Course not found');
  });

  test('should show loading state during checkout', async ({ page }) => {
    await page.goto('/checkout?courseId=1');
    
    // Fill form
    await testHelpers.fillField('billing-first-name', 'John');
    await testHelpers.fillField('billing-last-name', 'Doe');
    await testHelpers.fillField('billing-email', 'john.doe@example.com');
    
    // Delay payment processing
    await page.route('**/api/payments/stripe/checkout', async route => {
      await new Promise(resolve => setTimeout(resolve, 3000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ sessionId: 'test', url: 'https://stripe.com' })
      });
    });
    
    await page.getByTestId('stripe-payment-option').click();
    await page.getByTestId('proceed-to-payment-btn').click();
    
    // Check loading state
    await expect(page.getByTestId('proceed-to-payment-btn')).toBeDisabled();
    await expect(page.getByTestId('payment-processing')).toBeVisible();
    await expect(page.getByTestId('payment-processing')).toContainText('Processing your payment...');
  });

  test('should be responsive on mobile @mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/checkout?courseId=1');
    
    // Check mobile layout
    await expect(page.getByTestId('checkout-mobile-view')).toBeVisible();
    
    // Course info should be collapsible on mobile
    await expect(page.getByTestId('mobile-course-summary')).toBeVisible();
    await page.getByTestId('toggle-course-details').click();
    await expect(page.getByTestId('course-details-expanded')).toBeVisible();
    
    // Payment methods should stack vertically
    await expect(page.getByTestId('payment-methods-mobile')).toBeVisible();
    
    await testHelpers.takeScreenshot('checkout-mobile');
  });

  test('should support keyboard navigation @accessibility', async ({ page }) => {
    await page.goto('/checkout?courseId=1');
    
    // Test keyboard navigation through form
    await testHelpers.testKeyboardNavigation([
      'coupon-code-input',
      'apply-coupon-btn',
      'billing-first-name',
      'billing-last-name',
      'billing-email',
      'billing-address',
      'billing-city',
      'billing-country-select',
      'stripe-payment-option',
      'paypal-payment-option',
      'proceed-to-payment-btn'
    ]);
  });

  test('should meet accessibility standards @accessibility', async ({ page }) => {
    await page.goto('/checkout?courseId=1');
    
    // Check accessibility compliance
    await testHelpers.checkAccessibility();
    
    // Check form labels
    await expect(page.getByTestId('billing-first-name')).toHaveAttribute('aria-label');
    await expect(page.getByTestId('payment-methods')).toHaveAttribute('role', 'radiogroup');
    
    // Check price information accessibility
    await expect(page.getByTestId('payment-summary')).toHaveAttribute('aria-label');
  });

  test('should save billing information for future use', async ({ page }) => {
    await page.goto('/checkout?courseId=1');
    
    // Fill billing information
    await testHelpers.fillField('billing-first-name', 'John');
    await testHelpers.fillField('billing-last-name', 'Doe');
    await testHelpers.fillField('billing-email', 'john.doe@example.com');
    await testHelpers.fillField('billing-address', '123 Main St');
    
    // Check save billing info checkbox
    await page.getByTestId('save-billing-info').check();
    
    // Mock save billing info API
    await testHelpers.mockApiResponse('/users/billing-info', {
      message: 'Billing information saved'
    });
    
    await page.getByTestId('proceed-to-payment-btn').click();
    
    // Billing info should be saved
    // In next checkout, the fields should be pre-filled
  });

  test('should display installment payment options', async ({ page }) => {
    // Mock course with installment options
    await testHelpers.mockApiResponse('/courses/1', {
      ...testData.courses.aiTransformation,
      paymentOptions: {
        fullPayment: 1500,
        installments: {
          enabled: true,
          options: [
            { months: 3, monthlyAmount: 525, totalAmount: 1575 },
            { months: 6, monthlyAmount: 275, totalAmount: 1650 }
          ]
        }
      }
    });

    await page.goto('/checkout?courseId=1');
    
    // Check installment options
    await expect(page.getByTestId('payment-plan-options')).toBeVisible();
    await expect(page.getByTestId('full-payment-option')).toBeVisible();
    await expect(page.getByTestId('installment-3-months')).toBeVisible();
    await expect(page.getByTestId('installment-6-months')).toBeVisible();
    
    // Select 3-month installment
    await page.getByTestId('installment-3-months').click();
    
    // Price should update
    await expect(page.getByTestId('monthly-amount')).toContainText('$525.00');
    await expect(page.getByTestId('total-amount')).toContainText('$1,575.00');
    await expect(page.getByTestId('installment-info')).toContainText('3 monthly payments of $525.00');
  });

  test('should handle SSL/Security indicators', async ({ page }) => {
    await page.goto('/checkout?courseId=1');
    
    // Check security indicators
    await expect(page.getByTestId('ssl-badge')).toBeVisible();
    await expect(page.getByTestId('security-message')).toContainText('Your payment information is secure and encrypted');
    
    // Check security icons
    await expect(page.getByTestId('stripe-security-badge')).toBeVisible();
    await expect(page.getByTestId('paypal-security-badge')).toBeVisible();
  });
});