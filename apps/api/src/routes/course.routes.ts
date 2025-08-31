/**
 * Course Routes
 * Handles all course-related endpoints
 * @module apps/api/routes/course
 */

import { Router } from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getUserEnrollments,
  updateLessonProgress,
} from '../controllers/course.controller';
import {
  authenticate,
  authorize,
  checkEnrollment,
  optionalAuth,
} from '../middleware/auth.middleware';

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * GET /api/courses
 * Get all published courses (with optional filters)
 */
router.get('/', optionalAuth, getAllCourses);

/**
 * GET /api/courses/:id
 * Get single course details
 */
router.get('/:id', optionalAuth, getCourseById);

// ============================================
// AUTHENTICATED ROUTES
// ============================================

/**
 * GET /api/courses/enrollments/my
 * Get current user's enrollments
 */
router.get('/enrollments/my', authenticate, getUserEnrollments);

/**
 * POST /api/courses/:id/enroll
 * Enroll in a course
 */
router.post('/:id/enroll', authenticate, enrollInCourse);

/**
 * POST /api/courses/:courseId/lessons/:lessonId/progress
 * Update lesson progress
 */
router.post(
  '/:courseId/lessons/:lessonId/progress',
  authenticate,
  checkEnrollment,
  updateLessonProgress
);

// ============================================
// INSTRUCTOR/ADMIN ROUTES
// ============================================

/**
 * POST /api/courses
 * Create a new course (Instructor/Admin only)
 */
router.post(
  '/',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  createCourse
);

/**
 * PUT /api/courses/:id
 * Update course (Instructor/Admin only)
 */
router.put(
  '/:id',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  updateCourse
);

/**
 * DELETE /api/courses/:id
 * Delete course (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  deleteCourse
);

export default router;