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

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post('/login', login);

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', refreshToken);

/**
 * GET /api/auth/verify-email
 * Verify email address with token
 */
router.get('/verify-email', verifyEmail);

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 */
router.post('/forgot-password', forgotPassword);

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post('/reset-password', resetPassword);

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