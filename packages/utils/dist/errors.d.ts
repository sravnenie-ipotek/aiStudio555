/**
 * Error Handling Utilities
 * Custom error classes and error handling helpers
 */
/**
 * Base application error
 */
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    readonly code: string | undefined;
    constructor(message: string, statusCode?: number, code?: string, isOperational?: boolean);
}
/**
 * Validation error
 */
export declare class ValidationError extends AppError {
    readonly errors: Record<string, string[]>;
    constructor(errors: Record<string, string[]>);
}
/**
 * Authentication error
 */
export declare class AuthenticationError extends AppError {
    constructor(message?: string);
}
/**
 * Authorization error
 */
export declare class AuthorizationError extends AppError {
    constructor(message?: string);
}
/**
 * Not found error
 */
export declare class NotFoundError extends AppError {
    constructor(resource?: string);
}
/**
 * Conflict error
 */
export declare class ConflictError extends AppError {
    constructor(message: string);
}
/**
 * Rate limit error
 */
export declare class RateLimitError extends AppError {
    constructor(retryAfter?: number);
}
/**
 * External service error
 */
export declare class ExternalServiceError extends AppError {
    readonly service: string;
    constructor(service: string, message: string);
}
/**
 * Check if error is operational (expected)
 */
export declare function isOperationalError(error: Error): boolean;
/**
 * Format error for response
 */
export declare function formatErrorResponse(error: Error): {
    code: string;
    message: string;
    details?: any;
};
/**
 * Async error handler wrapper
 */
export declare function asyncHandler<T extends (...args: any[]) => Promise<any>>(fn: T): T;
/**
 * Safe JSON parse with error handling
 */
export declare function safeJsonParse<T>(json: string, fallback?: T): T | undefined;
//# sourceMappingURL=errors.d.ts.map