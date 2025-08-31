/**
 * Payment Routes
 * Handles all payment-related endpoints
 * @module apps/api/routes/payment
 */

import { Router } from 'express';
import {
  createStripeCheckout,
  createPayPalOrder,
  capturePayPalOrder,
  getUserPayments,
  getPaymentDetails,
  applyCoupon,
  getAllPayments,
} from '../controllers/payment.controller';
import {
  authenticate,
  authorize,
} from '../middleware/auth.middleware';

const router = Router();

// ============================================
// AUTHENTICATED ROUTES
// ============================================

/**
 * POST /api/payments/stripe/checkout
 * Create Stripe checkout session
 */
router.post('/stripe/checkout', authenticate, createStripeCheckout);

/**
 * POST /api/payments/paypal/create-order
 * Create PayPal order
 */
router.post('/paypal/create-order', authenticate, createPayPalOrder);

/**
 * POST /api/payments/paypal/capture-order
 * Capture PayPal order after approval
 */
router.post('/paypal/capture-order', authenticate, capturePayPalOrder);

/**
 * GET /api/payments/my
 * Get current user's payments
 */
router.get('/my', authenticate, getUserPayments);

/**
 * GET /api/payments/:id
 * Get specific payment details
 */
router.get('/:id', authenticate, getPaymentDetails);

/**
 * POST /api/payments/apply-coupon
 * Apply coupon code to get discount
 */
router.post('/apply-coupon', authenticate, applyCoupon);

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * GET /api/payments
 * Get all payments (Admin only)
 */
router.get('/', authenticate, authorize('ADMIN'), getAllPayments);

export default router;