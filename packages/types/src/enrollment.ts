/**
 * Enrollment & Learning Progress Schemas
 * Zod validation schemas for course enrollment and progress tracking
 * @module @aistudio555/types/enrollment
 */

import { z } from 'zod';

// ============================================
// ENUMS
// ============================================

export const EnrollmentStatusEnum = z.enum([
  'PENDING',
  'ACTIVE',
  'COMPLETED',
  'EXPIRED',
  'CANCELLED',
  'SUSPENDED'
]);

export const ProgressStatusEnum = z.enum([
  'NOT_STARTED',
  'IN_PROGRESS',
  'COMPLETED',
  'SKIPPED'
]);

export const PaymentStatusEnum = z.enum([
  'PENDING',
  'PAID',
  'FAILED',
  'REFUNDED',
  'PARTIAL'
]);

// ============================================
// ENROLLMENT SCHEMAS
// ============================================

/**
 * Course enrollment creation schema
 */
export const CreateEnrollmentSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
  userId: z.string().uuid('Invalid user ID'),
  paymentMethodId: z.string().optional(),
  couponCode: z.string().optional(),
  installmentPlan: z.boolean().default(false),
});

/**
 * Full enrollment schema
 */
export const EnrollmentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  status: EnrollmentStatusEnum,
  enrolledAt: z.date(),
  startedAt: z.date().nullable(),
  completedAt: z.date().nullable(),
  expiresAt: z.date().nullable(),
  progress: z.number().min(0).max(100).default(0),
  lastAccessedAt: z.date().nullable(),
  paymentStatus: PaymentStatusEnum,
  paymentId: z.string().uuid().nullable(),
  certificateId: z.string().uuid().nullable(),
  totalTimeSpent: z.number().default(0), // in minutes
  metadata: z.record(z.any()).optional(),
});

/**
 * Update enrollment progress schema
 */
export const UpdateEnrollmentProgressSchema = z.object({
  enrollmentId: z.string().uuid(),
  lessonId: z.string().uuid(),
  status: ProgressStatusEnum,
  timeSpent: z.number().min(0), // in minutes
  score: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

// ============================================
// PROGRESS SCHEMAS
// ============================================

/**
 * Lesson progress schema
 */
export const LessonProgressSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  enrollmentId: z.string().uuid(),
  lessonId: z.string().uuid(),
  status: ProgressStatusEnum,
  startedAt: z.date().nullable(),
  completedAt: z.date().nullable(),
  lastAccessedAt: z.date(),
  timeSpent: z.number().default(0), // in minutes
  score: z.number().min(0).max(100).nullable(),
  attempts: z.number().default(0),
  notes: z.string().nullable(),
  bookmarks: z.array(z.object({
    timestamp: z.number(),
    note: z.string().optional(),
  })).optional(),
});

/**
 * Module progress aggregation schema
 */
export const ModuleProgressSchema = z.object({
  moduleId: z.string().uuid(),
  totalLessons: z.number(),
  completedLessons: z.number(),
  inProgressLessons: z.number(),
  progress: z.number().min(0).max(100),
  totalTimeSpent: z.number(), // in minutes
  averageScore: z.number().min(0).max(100).nullable(),
});

/**
 * Course progress overview schema
 */
export const CourseProgressSchema = z.object({
  enrollmentId: z.string().uuid(),
  courseId: z.string().uuid(),
  userId: z.string().uuid(),
  overallProgress: z.number().min(0).max(100),
  modulesProgress: z.array(ModuleProgressSchema),
  totalTimeSpent: z.number(), // in minutes
  estimatedTimeRemaining: z.number(), // in minutes
  currentLesson: z.object({
    lessonId: z.string().uuid(),
    moduleId: z.string().uuid(),
    title: z.string(),
  }).nullable(),
  nextLesson: z.object({
    lessonId: z.string().uuid(),
    moduleId: z.string().uuid(),
    title: z.string(),
  }).nullable(),
  completionDate: z.date().nullable(),
  certificateEligible: z.boolean(),
});

// ============================================
// CERTIFICATE SCHEMAS
// ============================================

/**
 * Certificate generation schema
 */
export const GenerateCertificateSchema = z.object({
  enrollmentId: z.string().uuid(),
  courseId: z.string().uuid(),
  userId: z.string().uuid(),
  completionDate: z.date(),
  grade: z.string().optional(),
  score: z.number().min(0).max(100).optional(),
});

/**
 * Certificate schema
 */
export const CertificateSchema = z.object({
  id: z.string().uuid(),
  certificateNumber: z.string(),
  enrollmentId: z.string().uuid(),
  courseId: z.string().uuid(),
  userId: z.string().uuid(),
  issuedAt: z.date(),
  expiresAt: z.date().nullable(),
  grade: z.string().nullable(),
  score: z.number().min(0).max(100).nullable(),
  templateId: z.string().optional(),
  verificationUrl: z.string().url(),
  metadata: z.record(z.any()).optional(),
});

// ============================================
// ANALYTICS SCHEMAS
// ============================================

/**
 * Learning analytics schema
 */
export const LearningAnalyticsSchema = z.object({
  userId: z.string().uuid(),
  totalCoursesEnrolled: z.number(),
  totalCoursesCompleted: z.number(),
  totalTimeSpent: z.number(), // in minutes
  averageCompletionRate: z.number().min(0).max(100),
  averageScore: z.number().min(0).max(100).nullable(),
  streakDays: z.number(),
  lastActiveDate: z.date(),
  preferredLearningTime: z.string().nullable(), // e.g., "morning", "evening"
  strongestSubjects: z.array(z.string()),
  improvementAreas: z.array(z.string()),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type EnrollmentStatus = z.infer<typeof EnrollmentStatusEnum>;
export type ProgressStatus = z.infer<typeof ProgressStatusEnum>;
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;
export type CreateEnrollment = z.infer<typeof CreateEnrollmentSchema>;
export type Enrollment = z.infer<typeof EnrollmentSchema>;
export type UpdateEnrollmentProgress = z.infer<typeof UpdateEnrollmentProgressSchema>;
export type LessonProgress = z.infer<typeof LessonProgressSchema>;
export type ModuleProgress = z.infer<typeof ModuleProgressSchema>;
export type CourseProgress = z.infer<typeof CourseProgressSchema>;
export type GenerateCertificate = z.infer<typeof GenerateCertificateSchema>;
export type Certificate = z.infer<typeof CertificateSchema>;
export type LearningAnalytics = z.infer<typeof LearningAnalyticsSchema>;