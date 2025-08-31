/**
 * Error Handling Utilities
 * Custom error classes and error handling helpers
 */
/**
 * Base application error
 */
export class AppError extends Error {
    statusCode;
    isOperational;
    code;
    constructor(message, statusCode = 500, code, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
/**
 * Validation error
 */
export class ValidationError extends AppError {
    errors;
    constructor(errors) {
        super('Validation failed', 422, 'VALIDATION_ERROR');
        this.errors = errors;
    }
}
/**
 * Authentication error
 */
export class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401, 'AUTHENTICATION_ERROR');
    }
}
/**
 * Authorization error
 */
export class AuthorizationError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 403, 'AUTHORIZATION_ERROR');
    }
}
/**
 * Not found error
 */
export class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404, 'NOT_FOUND');
    }
}
/**
 * Conflict error
 */
export class ConflictError extends AppError {
    constructor(message) {
        super(message, 409, 'CONFLICT');
    }
}
/**
 * Rate limit error
 */
export class RateLimitError extends AppError {
    constructor(retryAfter) {
        const message = retryAfter
            ? `Too many requests. Try again after ${retryAfter} seconds`
            : 'Too many requests';
        super(message, 429, 'RATE_LIMIT_EXCEEDED');
    }
}
/**
 * External service error
 */
export class ExternalServiceError extends AppError {
    service;
    constructor(service, message) {
        super(message, 503, 'EXTERNAL_SERVICE_ERROR');
        this.service = service;
    }
}
/**
 * Check if error is operational (expected)
 */
export function isOperationalError(error) {
    if (error instanceof AppError) {
        return error.isOperational;
    }
    return false;
}
/**
 * Format error for response
 */
export function formatErrorResponse(error) {
    if (error instanceof AppError) {
        const response = {
            code: error.code || 'UNKNOWN_ERROR',
            message: error.message,
        };
        if (error instanceof ValidationError) {
            response.details = error.errors;
        }
        return response;
    }
    return {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
    };
}
/**
 * Async error handler wrapper
 */
export function asyncHandler(fn) {
    return (async (...args) => {
        try {
            return await fn(...args);
        }
        catch (error) {
            throw error;
        }
    });
}
/**
 * Safe JSON parse with error handling
 */
export function safeJsonParse(json, fallback) {
    try {
        return JSON.parse(json);
    }
    catch {
        return fallback;
    }
}
//# sourceMappingURL=errors.js.map