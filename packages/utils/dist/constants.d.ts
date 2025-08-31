/**
 * Application Constants
 * Shared constants and configuration values
 */
/**
 * API Configuration
 */
export declare const API_CONFIG: {
    readonly DEFAULT_TIMEOUT: 30000;
    readonly MAX_RETRY_ATTEMPTS: 3;
    readonly RATE_LIMIT_WINDOW: number;
    readonly RATE_LIMIT_MAX_REQUESTS: 100;
};
/**
 * Pagination Defaults
 */
export declare const PAGINATION: {
    readonly DEFAULT_PAGE: 1;
    readonly DEFAULT_LIMIT: 20;
    readonly MAX_LIMIT: 100;
    readonly MIN_LIMIT: 1;
};
/**
 * File Upload Limits
 */
export declare const FILE_UPLOAD: {
    readonly MAX_SIZE: number;
    readonly ALLOWED_TYPES: readonly ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf", "text/plain"];
    readonly MAX_FILES: 5;
};
/**
 * User Roles
 */
export declare const USER_ROLES: {
    readonly STUDENT: "STUDENT";
    readonly INSTRUCTOR: "INSTRUCTOR";
    readonly ADMIN: "ADMIN";
    readonly SUPER_ADMIN: "SUPER_ADMIN";
};
/**
 * Course Levels
 */
export declare const COURSE_LEVELS: {
    readonly BEGINNER: "beginner";
    readonly INTERMEDIATE: "intermediate";
    readonly ADVANCED: "advanced";
};
/**
 * Payment Status
 */
export declare const PAYMENT_STATUS: {
    readonly PENDING: "pending";
    readonly COMPLETED: "completed";
    readonly FAILED: "failed";
    readonly REFUNDED: "refunded";
};
/**
 * Subscription Status
 */
export declare const SUBSCRIPTION_STATUS: {
    readonly ACTIVE: "active";
    readonly PAUSED: "paused";
    readonly CANCELLED: "cancelled";
    readonly EXPIRED: "expired";
};
/**
 * Supported Languages
 */
export declare const SUPPORTED_LANGUAGES: {
    readonly ENGLISH: "en";
    readonly HEBREW: "he";
    readonly RUSSIAN: "ru";
};
/**
 * Supported Currencies
 */
export declare const SUPPORTED_CURRENCIES: {
    readonly USD: "USD";
    readonly EUR: "EUR";
    readonly ILS: "ILS";
};
/**
 * Email Templates
 */
export declare const EMAIL_TEMPLATES: {
    readonly WELCOME: "welcome";
    readonly EMAIL_VERIFICATION: "email_verification";
    readonly PASSWORD_RESET: "password_reset";
    readonly COURSE_ENROLLMENT: "course_enrollment";
    readonly COURSE_COMPLETION: "course_completion";
    readonly PAYMENT_SUCCESS: "payment_success";
    readonly PAYMENT_FAILED: "payment_failed";
};
/**
 * Cache Keys
 */
export declare const CACHE_KEYS: {
    readonly USER_PROFILE: (userId: string) => string;
    readonly COURSE_DETAILS: (courseId: string) => string;
    readonly USER_COURSES: (userId: string) => string;
    readonly COURSE_STUDENTS: (courseId: string) => string;
    readonly PAYMENT_INTENT: (intentId: string) => string;
};
/**
 * Cache TTL (Time To Live) in seconds
 */
export declare const CACHE_TTL: {
    readonly SHORT: number;
    readonly MEDIUM: number;
    readonly LONG: number;
    readonly VERY_LONG: number;
};
/**
 * Error Codes
 */
export declare const ERROR_CODES: {
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR";
    readonly AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR";
    readonly NOT_FOUND: "NOT_FOUND";
    readonly CONFLICT: "CONFLICT";
    readonly RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED";
    readonly EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR";
    readonly INTERNAL_ERROR: "INTERNAL_ERROR";
};
/**
 * HTTP Status Codes
 */
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly TOO_MANY_REQUESTS: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly SERVICE_UNAVAILABLE: 503;
};
//# sourceMappingURL=constants.d.ts.map