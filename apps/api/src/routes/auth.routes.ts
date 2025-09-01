/**
 * Authentication Routes
 * Handles all auth-related endpoints
 * @module apps/api/routes/auth
 */

import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { 
  authRateLimit, 
  passwordResetRateLimit, 
  registrationRateLimit 
} from '../middleware/security.middleware';

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * POST /api/auth/register
 * Register a new user
 * SECURITY: Rate limited to 5 registrations per hour per IP
 */
router.post('/register', registrationRateLimit, register);

/**
 * POST /api/auth/login
 * Login with email and password
 * SECURITY: Rate limited to 5 attempts per 15 minutes
 */
router.post('/login', authRateLimit, login);

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 * SECURITY: Rate limited for token refresh abuse prevention
 */
router.post('/refresh', authRateLimit, refreshToken);

/**
 * GET /api/auth/verify-email
 * Verify email address with token
 */
router.get('/verify-email', verifyEmail);

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 * SECURITY: Rate limited to 3 attempts per hour
 */
router.post('/forgot-password', passwordResetRateLimit, forgotPassword);

/**
 * POST /api/auth/reset-password
 * Reset password with token
 * SECURITY: Rate limited to prevent abuse
 */
router.post('/reset-password', passwordResetRateLimit, resetPassword);

// ============================================
// PROTECTED ROUTES
// ============================================

/**
 * POST /api/auth/logout
 * Logout current user (requires authentication)
 */
router.post('/logout', authenticate, logout);

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', authenticate, getCurrentUser);

export default router;