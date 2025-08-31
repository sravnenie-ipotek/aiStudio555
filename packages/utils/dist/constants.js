/**
 * Application Constants
 * Shared constants and configuration values
 */
/**
 * API Configuration
 */
export const API_CONFIG = {
    DEFAULT_TIMEOUT: 30000,
    MAX_RETRY_ATTEMPTS: 3,
    RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: 100,
};
/**
 * Pagination Defaults
 */
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    MIN_LIMIT: 1,
};
/**
 * File Upload Limits
 */
export const FILE_UPLOAD = {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
    ],
    MAX_FILES: 5,
};
/**
 * User Roles
 */
export const USER_ROLES = {
    STUDENT: 'STUDENT',
    INSTRUCTOR: 'INSTRUCTOR',
    ADMIN: 'ADMIN',
    SUPER_ADMIN: 'SUPER_ADMIN',
};
/**
 * Course Levels
 */
export const COURSE_LEVELS = {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced',
};
/**
 * Payment Status
 */
export const PAYMENT_STATUS = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
};
/**
 * Subscription Status
 */
export const SUBSCRIPTION_STATUS = {
    ACTIVE: 'active',
    PAUSED: 'paused',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired',
};
/**
 * Supported Languages
 */
export const SUPPORTED_LANGUAGES = {
    ENGLISH: 'en',
    HEBREW: 'he',
    RUSSIAN: 'ru',
};
/**
 * Supported Currencies
 */
export const SUPPORTED_CURRENCIES = {
    USD: 'USD',
    EUR: 'EUR',
    ILS: 'ILS',
};
/**
 * Email Templates
 */
export const EMAIL_TEMPLATES = {
    WELCOME: 'welcome',
    EMAIL_VERIFICATION: 'email_verification',
    PASSWORD_RESET: 'password_reset',
    COURSE_ENROLLMENT: 'course_enrollment',
    COURSE_COMPLETION: 'course_completion',
    PAYMENT_SUCCESS: 'payment_success',
    PAYMENT_FAILED: 'payment_failed',
};
/**
 * Cache Keys
 */
export const CACHE_KEYS = {
    USER_PROFILE: (userId) => `user:${userId}:profile`,
    COURSE_DETAILS: (courseId) => `course:${courseId}:details`,
    USER_COURSES: (userId) => `user:${userId}:courses`,
    COURSE_STUDENTS: (courseId) => `course:${courseId}:students`,
    PAYMENT_INTENT: (intentId) => `payment:${intentId}`,
};
/**
 * Cache TTL (Time To Live) in seconds
 */
export const CACHE_TTL = {
    SHORT: 5 * 60, // 5 minutes
    MEDIUM: 30 * 60, // 30 minutes
    LONG: 2 * 60 * 60, // 2 hours
    VERY_LONG: 24 * 60 * 60, // 24 hours
};
/**
 * Error Codes
 */
export const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
};
/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
};
//# sourceMappingURL=constants.js.map