/**
 * Course-related type definitions
 * Updated to match Prisma schema v2.0 - Extended course catalog system
 */
import { z } from 'zod';
// Enums matching Prisma schema
export var CourseFormat;
(function (CourseFormat) {
    CourseFormat["ONLINE"] = "ONLINE";
    CourseFormat["HYBRID"] = "HYBRID";
    CourseFormat["IN_PERSON"] = "IN_PERSON";
})(CourseFormat || (CourseFormat = {}));
export var CourseLevel;
(function (CourseLevel) {
    CourseLevel["BEGINNER"] = "BEGINNER";
    CourseLevel["INTERMEDIATE"] = "INTERMEDIATE";
    CourseLevel["ADVANCED"] = "ADVANCED";
    CourseLevel["EXPERT"] = "EXPERT";
})(CourseLevel || (CourseLevel = {}));
export var CourseStatus;
(function (CourseStatus) {
    CourseStatus["DRAFT"] = "DRAFT";
    CourseStatus["PUBLISHED"] = "PUBLISHED";
    CourseStatus["ARCHIVED"] = "ARCHIVED";
})(CourseStatus || (CourseStatus = {}));
export var Locale;
(function (Locale) {
    Locale["EN"] = "EN";
    Locale["RU"] = "RU";
    Locale["HE"] = "HE";
})(Locale || (Locale = {}));
// Certificate interface moved to enrollment.ts to avoid duplicates
// ============================================
// ZOD SCHEMAS FOR VALIDATION
// ============================================
export const CourseCreateSchema = z.object({
    title: z.record(z.string(), z.string()),
    description: z.record(z.string(), z.string()),
    shortDescription: z.record(z.string(), z.string()).optional(),
    slug: z.string().min(1, 'Slug is required'),
    categoryId: z.string().min(1, 'Category is required'),
    instructorId: z.string().min(1, 'Instructor is required'),
    price: z.number().min(0, 'Price must be positive'),
    currency: z.string().default('USD'),
    discountPrice: z.number().min(0).optional(),
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
    language: z.enum(['EN', 'RU', 'HE']),
    duration: z.number().min(1, 'Duration is required'),
    durationWeeks: z.number().optional(),
    hoursPerWeek: z.number().optional(),
    maxStudents: z.number().optional(),
    minStudents: z.number().optional(),
    nextStartDate: z.string().datetime().optional(),
    enrollmentDeadline: z.string().datetime().optional(),
    keyBenefits: z.array(z.string()).default([]),
    targetAudience: z.array(z.string()).default([]),
    careerOutcomes: z.array(z.string()).default([]),
    skillsLearned: z.array(z.string()).default([]),
    format: z.enum(['ONLINE', 'HYBRID', 'IN_PERSON']).default('ONLINE'),
    platform: z.string().optional(),
    thumbnail: z.string().optional(),
    heroImage: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).default([]),
});
export const CourseUpdateSchema = CourseCreateSchema.partial();
export const CourseLessonProgressSchema = z.object({
    lessonId: z.string().min(1, 'Lesson ID is required'),
    status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']),
    videoProgress: z.number().min(0).max(100).optional(),
    score: z.number().min(0).max(100).optional(),
});
//# sourceMappingURL=course.js.map