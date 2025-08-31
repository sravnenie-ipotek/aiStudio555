/**
 * Webhook Routes
 * Handles payment provider webhooks
 * @module apps/api/routes/webhook
 */

import { Router } from 'express';
import express from 'express';
import { handleStripeWebhook } from '../controllers/payment.controller';

const router = Router();

// ============================================
// WEBHOOK ENDPOINTS
// ============================================

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 * Note: This endpoint needs raw body, not JSON parsed
 */
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);

/**
 * POST /api/webhooks/paypal
 * Handle PayPal webhook events
 * TODO: Implement PayPal webhook handler
 */
router.post('/paypal', (req, res) => {
  // TODO: Implement PayPal webhook verification and handling
  res.status(200).json({ received: true });
});

export default router;