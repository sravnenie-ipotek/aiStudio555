/**
 * Payment Routes
 * Handles all payment-related endpoints
 * @module apps/api/routes/payment
 */

import { Router } from 'express';
import { UserRole } from '@aistudio555/db';
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
import { paymentRateLimit } from '../middleware/security.middleware';

const router = Router();

// ============================================
// AUTHENTICATED ROUTES
// ============================================

/**
 * POST /api/payments/stripe/checkout
 * Create Stripe checkout session
 * SECURITY: Rate limited to prevent payment abuse
 */
router.post('/stripe/checkout', authenticate, paymentRateLimit, createStripeCheckout);

/**
 * POST /api/payments/paypal/create-order
 * Create PayPal order
 * SECURITY: Rate limited to prevent payment abuse
 */
router.post('/paypal/create-order', authenticate, paymentRateLimit, createPayPalOrder);

/**
 * POST /api/payments/paypal/capture-order
 * Capture PayPal order after approval
 * SECURITY: Rate limited to prevent payment abuse
 */
router.post('/paypal/capture-order', authenticate, paymentRateLimit, capturePayPalOrder);

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
router.get('/', authenticate, authorize(UserRole.ADMIN), getAllPayments);

export default router;