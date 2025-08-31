// cypress/e2e/payment.cy.ts
/// <reference types="cypress" />
import { testCourseFactory } from '../support/types';

describe('Payment Flow', () => {
  const testCourse = testCourseFactory({
    id: 'payment-test-course',
    title: 'AI Transformation Manager',
    price: 1500,
    discountedPrice: 1000,
    stripePriceId: 'price_test_123',
    paypalItemId: 'paypal_item_456',
  });

  beforeEach(() => {
    cy.clearTestData();
    cy.seedTestData();
    
    // Setup authenticated user
    cy.login();
    
    // Mock course data
    cy.intercept('GET', `/api/courses/${testCourse.id}`, {
      statusCode: 200,
      body: testCourse,
    }).as('getCourseForPayment');
  });

  afterEach(() => {
    cy.clearTestData();
  });

  describe('Payment Page Setup', () => {
    beforeEach(() => {
      cy.visit(`/payment?courseId=${testCourse.id}`);
      cy.wait('@getCourseForPayment');
      cy.waitForPageLoad();
    });

    it('should display payment page correctly', () => {
      // Check page elements
      cy.getByTestId('payment-page-title').should('be.visible').and('contain.text', 'Complete Your Purchase');
      cy.getByTestId('course-summary').should('be.visible');
      cy.getByTestId('payment-methods').should('be.visible');
      cy.getByTestId('order-summary').should('be.visible');

      // Course summary
      cy.getByTestId('course-summary').within(() => {
        cy.getByTestId('course-title').should('contain.text', testCourse.title);
        cy.getByTestId('course-price').should('contain.text', '$1,500');
        cy.getByTestId('course-discounted-price').should('contain.text', '$1,000');
        cy.getByTestId('course-savings').should('contain.text', 'Save $500');
      });

      // Payment methods
      cy.getByTestId('stripe-payment-option').should('be.visible');
      cy.getByTestId('paypal-payment-option').should('be.visible');

      // Order summary
      cy.getByTestId('order-summary').within(() => {
        cy.getByTestId('subtotal').should('contain.text', '$1,500');
        cy.getByTestId('discount').should('contain.text', '-$500');
        cy.getByTestId('total-amount').should('contain.text', '$1,000');
      });

      // Check accessibility
      cy.checkAccessibility();
    });

    it('should redirect unauthenticated users to login', () => {
      cy.logout();
      cy.visit(`/payment?courseId=${testCourse.id}`);

      // Should redirect to login with return URL
      cy.url().should('include', '/login');
      cy.url().should('include', 'return=');
      cy.url().should('include', 'payment');
    });

    it('should handle invalid course ID', () => {
      cy.intercept('GET', '/api/courses/invalid-course', {
        statusCode: 404,
        body: { error: 'Course not found' },
      }).as('getCourseNotFound');

      cy.visit('/payment?courseId=invalid-course');
      cy.wait('@getCourseNotFound');

      // Should show error and redirect
      cy.getByTestId('error-message').should('be.visible')
        .and('contain.text', 'Course not found');
      cy.url().should('include', '/courses');
    });

    it('should handle already enrolled users', () => {
      cy.intercept('GET', '/api/user/enrollments/payment-test-course', {
        statusCode: 200,
        body: {
          id: 'existing-enrollment',
          status: 'ACTIVE',
          enrolledAt: '2024-01-01T10:00:00Z',
        },
      }).as('getExistingEnrollment');

      cy.visit(`/payment?courseId=${testCourse.id}`);
      cy.wait('@getExistingEnrollment');

      // Should show already enrolled message
      cy.getByTestId('already-enrolled-message').should('be.visible')
        .and('contain.text', 'You are already enrolled');
      
      // Should redirect to course or dashboard
      cy.getByTestId('go-to-course-button').click();
      cy.url().should('include', '/dashboard');
    });

    it('should be responsive across different screen sizes', () => {
      cy.testResponsiveness();

      // Test mobile layout
      cy.testOnMobile();
      cy.getByTestId('payment-form').should('be.visible');
      cy.getByTestId('order-summary').should('be.visible');

      // Check mobile-specific styling
      cy.get('body').should('not.have.css', 'overflow-x', 'scroll');
    });
  });

  describe('Stripe Payment Flow', () => {
    beforeEach(() => {
      cy.visit(`/payment?courseId=${testCourse.id}`);
      cy.wait('@getCourseForPayment');
      
      // Select Stripe payment method
      cy.getByTestId('stripe-payment-option').click();
      cy.mockStripePayment();
    });

    it('should display Stripe payment form', () => {
      cy.getByTestId('stripe-payment-form').should('be.visible');
      cy.getByTestId('stripe-card-element').should('be.visible');
      cy.getByTestId('billing-address-form').should('be.visible');
      cy.getByTestId('payment-button').should('be.visible').and('be.disabled');

      // Billing form fields
      cy.getByTestId('billing-name').should('be.visible');
      cy.getByTestId('billing-email').should('be.visible');
      cy.getByTestId('billing-address').should('be.visible');
      cy.getByTestId('billing-city').should('be.visible');
      cy.getByTestId('billing-country').should('be.visible');
    });

    it('should validate billing information', () => {
      // Try to submit without billing info
      cy.getByTestId('payment-button').should('be.disabled');

      // Fill invalid email
      cy.getByTestId('billing-email').type('invalid-email');
      cy.getByTestId('billing-email').blur();
      cy.getByTestId('billing-email').toHaveValidationError('billing-email');

      // Fill valid billing info
      cy.getByTestId('billing-name').type('John Doe');
      cy.getByTestId('billing-email').clear().type('john@example.com');
      cy.getByTestId('billing-address').type('123 Main St');
      cy.getByTestId('billing-city').type('New York');
      cy.getByTestId('billing-country').select('US');

      // Payment button should be enabled after valid billing info
      cy.getByTestId('payment-button').should('be.enabled');
    });

    it('should process successful Stripe payment', () => {
      // Fill billing information
      cy.getByTestId('billing-name').type('John Doe');
      cy.getByTestId('billing-email').type('john@example.com');
      cy.getByTestId('billing-address').type('123 Main St');
      cy.getByTestId('billing-city').type('New York');
      cy.getByTestId('billing-country').select('US');

      // Mock successful payment
      cy.intercept('POST', '/api/payments/create-intent', {
        statusCode: 200,
        body: {
          clientSecret: 'pi_test_1234567890_secret_test',
          paymentIntentId: 'pi_test_1234567890',
        },
      }).as('createPaymentIntent');

      cy.intercept('POST', '/api/payments/confirm', {
        statusCode: 200,
        body: {
          success: true,
          paymentId: 'payment_123',
          enrollmentId: 'enrollment_456',
        },
      }).as('confirmPayment');

      // Submit payment
      cy.getByTestId('payment-button').click();

      // Should show processing state
      cy.getByTestId('payment-processing').should('be.visible');
      cy.getByTestId('payment-button').should('be.disabled');

      cy.wait('@createPaymentIntent');
      cy.wait('@confirmPayment');

      // Should redirect to success page
      cy.url().should('include', '/payment/success');
      cy.getByTestId('payment-success-message').should('be.visible');
    });

    it('should handle Stripe payment failure', () => {
      // Fill billing information
      cy.getByTestId('billing-name').type('John Doe');
      cy.getByTestId('billing-email').type('john@example.com');
      cy.getByTestId('billing-address').type('123 Main St');
      cy.getByTestId('billing-city').type('New York');
      cy.getByTestId('billing-country').select('US');

      // Mock payment failure
      cy.intercept('POST', '/api/payments/create-intent', {
        statusCode: 400,
        body: {
          error: 'Your card was declined',
          code: 'card_declined',
        },
      }).as('createPaymentIntentFailed');

      cy.getByTestId('payment-button').click();
      cy.wait('@createPaymentIntentFailed');

      // Should show error message
      cy.getByTestId('payment-error').should('be.visible')
        .and('contain.text', 'Your card was declined');
      
      // Should re-enable payment button
      cy.getByTestId('payment-button').should('be.enabled');
    });

    it('should handle 3D Secure authentication', () => {
      // Fill billing information
      cy.getByTestId('billing-name').type('John Doe');
      cy.getByTestId('billing-email').type('john@example.com');
      cy.getByTestId('billing-address').type('123 Main St');
      cy.getByTestId('billing-city').type('New York');
      cy.getByTestId('billing-country').select('US');

      // Mock 3D Secure required
      cy.intercept('POST', '/api/payments/create-intent', {
        statusCode: 200,
        body: {
          clientSecret: 'pi_test_requires_action_secret',
          requiresAction: true,
        },
      }).as('create3DSPayment');

      cy.getByTestId('payment-button').click();
      cy.wait('@create3DSPayment');

      // Should show 3D Secure modal
      cy.getByTestId('three-d-secure-modal').should('be.visible');
      cy.getByTestId('three-d-secure-iframe').should('be.visible');
    });

    it('should save payment method for future use', () => {
      // Fill billing information
      cy.getByTestId('billing-name').type('John Doe');
      cy.getByTestId('billing-email').type('john@example.com');
      cy.getByTestId('billing-address').type('123 Main St');
      cy.getByTestId('billing-city').type('New York');
      cy.getByTestId('billing-country').select('US');

      // Check save payment method
      cy.getByTestId('save-payment-method').check();

      // Mock saved payment method
      cy.intercept('POST', '/api/payments/create-intent', {
        statusCode: 200,
        body: {
          clientSecret: 'pi_test_save_method',
          setupIntentId: 'seti_test_123',
        },
      }).as('createWithSaveMethod');

      cy.getByTestId('payment-button').click();
      cy.wait('@createWithSaveMethod');

      // Should indicate saving payment method
      cy.getByTestId('saving-payment-method').should('be.visible');
    });
  });

  describe('PayPal Payment Flow', () => {
    beforeEach(() => {
      cy.visit(`/payment?courseId=${testCourse.id}`);
      cy.wait('@getCourseForPayment');
      
      // Select PayPal payment method
      cy.getByTestId('paypal-payment-option').click();
      cy.mockPayPalPayment();
    });

    it('should display PayPal payment option', () => {
      cy.getByTestId('paypal-payment-form').should('be.visible');
      cy.getByTestId('paypal-button-container').should('be.visible');
      cy.getByTestId('paypal-terms').should('be.visible');
    });

    it('should process successful PayPal payment', () => {
      // Mock PayPal order creation
      cy.intercept('POST', '/api/payments/paypal/create-order', {
        statusCode: 200,
        body: {
          id: 'test-paypal-order-id',
          status: 'CREATED',
          links: [{
            rel: 'approve',
            href: 'https://www.sandbox.paypal.com/checkoutnow?token=test-token',
          }],
        },
      }).as('createPayPalOrder');

      // Mock PayPal order capture
      cy.intercept('POST', '/api/payments/paypal/capture-order', {
        statusCode: 200,
        body: {
          id: 'test-paypal-order-id',
          status: 'COMPLETED',
          purchase_units: [{
            payments: {
              captures: [{
                id: 'capture-123',
                status: 'COMPLETED',
              }],
            },
          }],
        },
      }).as('capturePayPalOrder');

      // Click PayPal button
      cy.getByTestId('paypal-button').click();
      cy.wait('@createPayPalOrder');

      // Simulate PayPal approval (normally opens popup)
      cy.visit('/payment/paypal/return?token=test-token&PayerID=test-payer-id');
      cy.wait('@capturePayPalOrder');

      // Should redirect to success page
      cy.url().should('include', '/payment/success');
      cy.getByTestId('payment-success-message').should('be.visible');
    });

    it('should handle PayPal payment cancellation', () => {
      // Mock PayPal order creation
      cy.intercept('POST', '/api/payments/paypal/create-order', {
        statusCode: 200,
        body: {
          id: 'test-paypal-order-id',
          status: 'CREATED',
          links: [{
            rel: 'approve',
            href: 'https://www.sandbox.paypal.com/checkoutnow?token=test-token',
          }],
        },
      }).as('createPayPalOrder');

      cy.getByTestId('paypal-button').click();
      cy.wait('@createPayPalOrder');

      // Simulate PayPal cancellation
      cy.visit('/payment/paypal/cancel?token=test-token');

      // Should return to payment page with cancellation message
      cy.url().should('include', '/payment');
      cy.getByTestId('payment-cancelled-message').should('be.visible')
        .and('contain.text', 'PayPal payment was cancelled');
    });

    it('should handle PayPal payment errors', () => {
      // Mock PayPal order creation failure
      cy.intercept('POST', '/api/payments/paypal/create-order', {
        statusCode: 400,
        body: {
          error: 'PayPal service unavailable',
          code: 'PAYPAL_SERVICE_ERROR',
        },
      }).as('createPayPalOrderFailed');

      cy.getByTestId('paypal-button').click();
      cy.wait('@createPayPalOrderFailed');

      // Should show error message
      cy.getByTestId('payment-error').should('be.visible')
        .and('contain.text', 'PayPal service unavailable');
    });
  });

  describe('Payment Success Flow', () => {
    beforeEach(() => {
      // Mock successful payment result
      cy.intercept('GET', '/api/payments/payment_123', {
        statusCode: 200,
        body: {
          id: 'payment_123',
          status: 'COMPLETED',
          amount: 1000,
          currency: 'USD',
          courseId: testCourse.id,
          enrollmentId: 'enrollment_456',
        },
      }).as('getPaymentDetails');

      cy.intercept('GET', '/api/enrollments/enrollment_456', {
        statusCode: 200,
        body: {
          id: 'enrollment_456',
          courseId: testCourse.id,
          status: 'ACTIVE',
          enrolledAt: '2024-01-15T10:30:00Z',
        },
      }).as('getEnrollmentDetails');

      cy.visit('/payment/success?paymentId=payment_123&enrollmentId=enrollment_456');
      cy.wait('@getPaymentDetails');
      cy.wait('@getEnrollmentDetails');
    });

    it('should display payment success page correctly', () => {
      // Success elements
      cy.getByTestId('payment-success-icon').should('be.visible');
      cy.getByTestId('payment-success-title').should('contain.text', 'Payment Successful!');
      cy.getByTestId('enrollment-success-message').should('be.visible')
        .and('contain.text', 'You are now enrolled');

      // Payment details
      cy.getByTestId('payment-details').within(() => {
        cy.getByTestId('payment-id').should('contain.text', 'payment_123');
        cy.getByTestId('payment-amount').should('contain.text', '$1,000');
        cy.getByTestId('course-name').should('contain.text', testCourse.title);
      });

      // Next steps
      cy.getByTestId('start-course-button').should('be.visible');
      cy.getByTestId('go-to-dashboard-button').should('be.visible');
      cy.getByTestId('download-receipt-button').should('be.visible');

      cy.checkAccessibility();
    });

    it('should navigate to course after successful payment', () => {
      cy.getByTestId('start-course-button').click();

      // Should redirect to course learning interface
      cy.url().should('include', `/learn/${testCourse.id}`);
    });

    it('should navigate to dashboard after successful payment', () => {
      cy.getByTestId('go-to-dashboard-button').click();

      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
    });

    it('should download payment receipt', () => {
      // Mock receipt generation
      cy.intercept('GET', '/api/payments/payment_123/receipt', {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="receipt-payment_123.pdf"',
        },
        body: 'Mock PDF content',
      }).as('downloadReceipt');

      cy.getByTestId('download-receipt-button').click();
      cy.wait('@downloadReceipt');

      // Verify download was triggered (Cypress limitation - can't verify actual file)
    });

    it('should handle invalid payment ID', () => {
      cy.intercept('GET', '/api/payments/invalid_payment', {
        statusCode: 404,
        body: { error: 'Payment not found' },
      }).as('getInvalidPayment');

      cy.visit('/payment/success?paymentId=invalid_payment');
      cy.wait('@getInvalidPayment');

      // Should show error and redirect
      cy.getByTestId('payment-not-found').should('be.visible');
      cy.url().should('include', '/dashboard');
    });

    it('should send confirmation email', () => {
      // Mock email sending
      cy.intercept('POST', '/api/notifications/payment-confirmation', {
        statusCode: 200,
        body: { sent: true },
      }).as('sendConfirmationEmail');

      // Email should be sent automatically on page load
      cy.wait('@sendConfirmationEmail');

      // Should show email confirmation
      cy.getByTestId('email-confirmation').should('be.visible')
        .and('contain.text', 'Confirmation email sent');
    });
  });

  describe('Payment Failure Flow', () => {
    beforeEach(() => {
      cy.visit(`/payment?courseId=${testCourse.id}`);
      cy.wait('@getCourseForPayment');
    });

    it('should handle payment processing errors', () => {
      cy.getByTestId('stripe-payment-option').click();
      
      // Fill billing information
      cy.getByTestId('billing-name').type('John Doe');
      cy.getByTestId('billing-email').type('john@example.com');
      cy.getByTestId('billing-address').type('123 Main St');
      cy.getByTestId('billing-city').type('New York');
      cy.getByTestId('billing-country').select('US');

      // Mock payment failure
      cy.intercept('POST', '/api/payments/create-intent', {
        statusCode: 400,
        body: {
          error: 'Your card was declined.',
          decline_code: 'generic_decline',
        },
      }).as('paymentDeclined');

      cy.getByTestId('payment-button').click();
      cy.wait('@paymentDeclined');

      // Should show specific error message
      cy.getByTestId('payment-error').should('be.visible')
        .and('contain.text', 'Your card was declined');
      
      // Should suggest trying different payment method
      cy.getByTestId('try-different-method').should('be.visible');
    });

    it('should handle network errors during payment', () => {
      cy.getByTestId('stripe-payment-option').click();
      
      // Fill billing information
      cy.getByTestId('billing-name').type('John Doe');
      cy.getByTestId('billing-email').type('john@example.com');
      cy.getByTestId('billing-address').type('123 Main St');
      cy.getByTestId('billing-city').type('New York');
      cy.getByTestId('billing-country').select('US');

      // Mock network error
      cy.intercept('POST', '/api/payments/create-intent', {
        forceNetworkError: true,
      }).as('networkError');

      cy.getByTestId('payment-button').click();
      cy.wait('@networkError');

      // Should show network error message
      cy.getByTestId('payment-error').should('be.visible')
        .and('contain.text', 'Network error');
      
      // Should show retry button
      cy.getByTestId('retry-payment').should('be.visible');
    });

    it('should allow retrying failed payment', () => {
      cy.getByTestId('stripe-payment-option').click();
      
      // Fill billing information
      cy.getByTestId('billing-name').type('John Doe');
      cy.getByTestId('billing-email').type('john@example.com');
      cy.getByTestId('billing-address').type('123 Main St');
      cy.getByTestId('billing-city').type('New York');
      cy.getByTestId('billing-country').select('US');

      // First attempt fails
      cy.intercept('POST', '/api/payments/create-intent', {
        statusCode: 400,
        body: { error: 'Temporary error' },
      }).as('firstAttemptFailed');

      cy.getByTestId('payment-button').click();
      cy.wait('@firstAttemptFailed');

      // Second attempt succeeds
      cy.intercept('POST', '/api/payments/create-intent', {
        statusCode: 200,
        body: {
          clientSecret: 'pi_test_retry_success',
          paymentIntentId: 'pi_test_retry',
        },
      }).as('retrySuccess');

      cy.getByTestId('retry-payment').click();
      cy.wait('@retrySuccess');

      // Should proceed to success
      cy.url().should('include', '/payment/success');
    });
  });

  describe('Promo Codes and Discounts', () => {
    beforeEach(() => {
      cy.visit(`/payment?courseId=${testCourse.id}`);
      cy.wait('@getCourseForPayment');
    });

    it('should apply valid promo code', () => {
      // Mock promo code validation
      cy.intercept('POST', '/api/promocodes/validate', {
        statusCode: 200,
        body: {
          valid: true,
          code: 'SAVE20',
          discountType: 'percentage',
          discountValue: 20,
          finalPrice: 800, // $1000 - 20%
        },
      }).as('validatePromoCode');

      cy.getByTestId('promo-code-input').type('SAVE20');
      cy.getByTestId('apply-promo-code').click();

      cy.wait('@validatePromoCode');

      // Should update pricing
      cy.getByTestId('promo-discount').should('be.visible').and('contain.text', '-$200');
      cy.getByTestId('total-amount').should('contain.text', '$800');
      cy.getByTestId('promo-code-applied').should('be.visible')
        .and('contain.text', 'SAVE20 applied');
    });

    it('should handle invalid promo code', () => {
      cy.intercept('POST', '/api/promocodes/validate', {
        statusCode: 400,
        body: {
          valid: false,
          error: 'Invalid promo code',
        },
      }).as('invalidPromoCode');

      cy.getByTestId('promo-code-input').type('INVALID');
      cy.getByTestId('apply-promo-code').click();

      cy.wait('@invalidPromoCode');

      // Should show error message
      cy.getByTestId('promo-code-error').should('be.visible')
        .and('contain.text', 'Invalid promo code');
      
      // Pricing should remain unchanged
      cy.getByTestId('total-amount').should('contain.text', '$1,000');
    });

    it('should handle expired promo code', () => {
      cy.intercept('POST', '/api/promocodes/validate', {
        statusCode: 400,
        body: {
          valid: false,
          error: 'Promo code has expired',
          expiredAt: '2024-01-01T00:00:00Z',
        },
      }).as('expiredPromoCode');

      cy.getByTestId('promo-code-input').type('EXPIRED');
      cy.getByTestId('apply-promo-code').click();

      cy.wait('@expiredPromoCode');

      cy.getByTestId('promo-code-error').should('be.visible')
        .and('contain.text', 'Promo code has expired');
    });

    it('should remove applied promo code', () => {
      // Apply promo code first
      cy.intercept('POST', '/api/promocodes/validate', {
        statusCode: 200,
        body: {
          valid: true,
          code: 'SAVE20',
          discountType: 'percentage',
          discountValue: 20,
          finalPrice: 800,
        },
      }).as('validatePromoCode');

      cy.getByTestId('promo-code-input').type('SAVE20');
      cy.getByTestId('apply-promo-code').click();
      cy.wait('@validatePromoCode');

      // Remove promo code
      cy.getByTestId('remove-promo-code').click();

      // Should revert to original pricing
      cy.getByTestId('promo-discount').should('not.exist');
      cy.getByTestId('total-amount').should('contain.text', '$1,000');
      cy.getByTestId('promo-code-input').should('have.value', '');
    });
  });

  describe('Payment Security', () => {
    beforeEach(() => {
      cy.visit(`/payment?courseId=${testCourse.id}`);
      cy.wait('@getCourseForPayment');
    });

    it('should enforce HTTPS for payment processing', () => {
      // Check that page is served over HTTPS in production
      cy.location('protocol').should('eq', 'https:');
    });

    it('should not log sensitive payment data', () => {
      // Mock console to capture logs
      cy.window().then((win) => {
        cy.stub(win.console, 'log').as('consoleLog');
        cy.stub(win.console, 'error').as('consoleError');
      });

      cy.getByTestId('stripe-payment-option').click();
      
      // Fill sensitive data
      cy.getByTestId('billing-name').type('John Doe');
      cy.getByTestId('billing-email').type('john@example.com');

      // Check that sensitive data is not logged
      cy.get('@consoleLog').should('not.have.been.calledWith', 
        Cypress.sinon.match(/4242424242424242/));
      cy.get('@consoleError').should('not.have.been.calledWith', 
        Cypress.sinon.match(/john@example.com/));
    });

    it('should validate CSRF token for payment requests', () => {
      cy.intercept('POST', '/api/payments/create-intent', (req) => {
        expect(req.headers).to.have.property('x-csrf-token');
      }).as('checkCSRFToken');

      cy.getByTestId('stripe-payment-option').click();
      
      // Fill and submit payment
      cy.getByTestId('billing-name').type('John Doe');
      cy.getByTestId('billing-email').type('john@example.com');
      cy.getByTestId('billing-address').type('123 Main St');
      cy.getByTestId('billing-city').type('New York');
      cy.getByTestId('billing-country').select('US');

      cy.getByTestId('payment-button').click();
      cy.wait('@checkCSRFToken');
    });
  });

  describe('Payment Analytics', () => {
    beforeEach(() => {
      cy.visit(`/payment?courseId=${testCourse.id}`);
      cy.wait('@getCourseForPayment');
    });

    it('should track payment funnel events', () => {
      // Mock analytics tracking
      cy.window().then((win) => {
        cy.stub(win, 'gtag').as('gtag');
      });

      // Payment page view should be tracked
      cy.get('@gtag').should('have.been.calledWith', 'event', 'page_view');

      // Select payment method
      cy.getByTestId('stripe-payment-option').click();
      cy.get('@gtag').should('have.been.calledWith', 'event', 'payment_method_selected');

      // Start payment process
      cy.getByTestId('billing-name').type('John Doe');
      cy.getByTestId('billing-email').type('john@example.com');
      cy.getByTestId('billing-address').type('123 Main St');
      cy.getByTestId('billing-city').type('New York');
      cy.getByTestId('billing-country').select('US');

      cy.mockStripePayment();
      cy.getByTestId('payment-button').click();

      cy.get('@gtag').should('have.been.calledWith', 'event', 'purchase_initiated');
    });

    it('should track payment completion', () => {
      // Mock successful payment completion
      cy.visit('/payment/success?paymentId=payment_123&enrollmentId=enrollment_456');

      cy.window().then((win) => {
        cy.stub(win, 'gtag').as('gtag');
      });

      // Should track purchase completion
      cy.get('@gtag').should('have.been.calledWith', 'event', 'purchase', {
        transaction_id: 'payment_123',
        value: 1000,
        currency: 'USD',
      });
    });
  });

  describe('International Payment Support', () => {
    beforeEach(() => {
      cy.visit(`/payment?courseId=${testCourse.id}`);
      cy.wait('@getCourseForPayment');
    });

    it('should support multiple currencies', () => {
      // Mock course in different currency
      cy.intercept('GET', `/api/courses/${testCourse.id}`, {
        statusCode: 200,
        body: {
          ...testCourse,
          price: 1200,
          currency: 'EUR',
        },
      }).as('getEuroCourse');

      cy.visit(`/payment?courseId=${testCourse.id}&currency=EUR`);
      cy.wait('@getEuroCourse');

      // Should display EUR pricing
      cy.getByTestId('total-amount').should('contain.text', '€1,200');
      cy.getByTestId('currency-selector').should('have.value', 'EUR');
    });

    it('should handle currency conversion', () => {
      // Mock currency conversion
      cy.intercept('GET', '/api/currency/rates?from=USD&to=EUR', {
        statusCode: 200,
        body: { rate: 0.85, convertedAmount: 850 },
      }).as('getCurrencyRate');

      cy.getByTestId('currency-selector').select('EUR');
      cy.wait('@getCurrencyRate');

      // Should show converted amount
      cy.getByTestId('total-amount').should('contain.text', '€850');
      cy.getByTestId('conversion-rate').should('be.visible');
    });

    it('should support international billing addresses', () => {
      cy.getByTestId('stripe-payment-option').click();

      // Fill international address
      cy.getByTestId('billing-name').type('Hans Mueller');
      cy.getByTestId('billing-email').type('hans@example.de');
      cy.getByTestId('billing-address').type('Musterstraße 123');
      cy.getByTestId('billing-city').type('Berlin');
      cy.getByTestId('billing-country').select('DE');
      cy.getByTestId('billing-postal-code').type('10115');

      // Should show country-specific fields
      cy.getByTestId('billing-postal-code').should('be.visible');
      cy.getByTestId('billing-state').should('not.exist'); // No state for Germany
    });
  });
});