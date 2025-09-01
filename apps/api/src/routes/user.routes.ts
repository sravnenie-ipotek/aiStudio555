/**
 * User Routes
 * Handles all user-related endpoints
 * @module apps/api/routes/user
 */

import { Router } from 'express';
import { UserRole } from '@aistudio555/db';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getUserStatistics,
  uploadAvatar,
  getInstructorProfile,
} from '../controllers/user.controller';
import {
  authenticate,
  authorize,
  ownsResource,
} from '../middleware/auth.middleware';

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * GET /api/users/instructors/:id
 * Get public instructor profile
 */
router.get('/instructors/:id', getInstructorProfile);

// ============================================
// AUTHENTICATED ROUTES
// ============================================

/**
 * GET /api/users/profile
 * Get current user's profile
 */
router.get('/profile', authenticate, getUserProfile);

/**
 * GET /api/users/profile/:id
 * Get specific user's profile (if authorized)
 */
router.get('/profile/:id', authenticate, getUserProfile);

/**
 * PUT /api/users/profile
 * Update current user's profile
 */
router.put('/profile', authenticate, updateUserProfile);

/**
 * POST /api/users/change-password
 * Change current user's password
 */
router.post('/change-password', authenticate, changePassword);

/**
 * POST /api/users/avatar
 * Upload user avatar
 */
router.post('/avatar', authenticate, uploadAvatar);

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * GET /api/users
 * Get all users (Admin only)
 */
router.get('/', authenticate, authorize(UserRole.ADMIN), getAllUsers);

/**
 * GET /api/users/statistics
 * Get user statistics (Admin only)
 */
router.get('/statistics', authenticate, authorize(UserRole.ADMIN), getUserStatistics);

/**
 * PUT /api/users/:id/role
 * Update user role (Admin only)
 */
router.put('/:id/role', authenticate, authorize(UserRole.ADMIN), updateUserRole);

/**
 * DELETE /api/users/:id
 * Delete user (Admin only)
 */
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteUser);

export default router;