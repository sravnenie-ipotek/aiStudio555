/**
 * Error Handling Middleware
 * Centralized error handling for the API
 * @module apps/api/middleware/error
 */

import { Request, Response, NextFunction } from 'express';
import { createLogger } from '@projectdes/utils';

const logger = createLogger('error-handler');

// Custom error class
export class AppError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;
  details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation error class
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

// Authentication error class
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

// Authorization error class
export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

// Not found error class
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

// Conflict error class
export class ConflictError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 409, 'CONFLICT', details);
  }
}

// Rate limit error class
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

// Database error handler
function handleDatabaseError(error: any): AppError {
  // Prisma errors
  if (error.code === 'P2002') {
    return new ConflictError('Duplicate entry found', {
      field: error.meta?.target,
    });
  }
  
  if (error.code === 'P2025') {
    return new NotFoundError('Record not found');
  }
  
  if (error.code === 'P2003') {
    return new ValidationError('Foreign key constraint failed', {
      field: error.meta?.field_name,
    });
  }
  
  // Generic database error
  return new AppError('Database operation failed', 500, 'DATABASE_ERROR');
}

// JWT error handler
function handleJWTError(error: any): AppError {
  if (error.name === 'JsonWebTokenError') {
    return new AuthenticationError('Invalid token');
  }
  
  if (error.name === 'TokenExpiredError') {
    return new AuthenticationError('Token expired');
  }
  
  return new AuthenticationError('Token verification failed');
}

// Validation error handler (Zod)
function handleValidationError(error: any): AppError {
  if (error.name === 'ZodError') {
    const details = error.errors.map((err: any) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    
    return new ValidationError('Validation failed', details);
  }
  
  return new ValidationError('Invalid input data');
}

// Main error handler middleware
export function errorHandler(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let appError: AppError;

  // Handle different error types
  if (error instanceof AppError) {
    appError = error;
  } else if (error.name === 'PrismaClientKnownRequestError') {
    appError = handleDatabaseError(error);
  } else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    appError = handleJWTError(error);
  } else if (error.name === 'ZodError') {
    appError = handleValidationError(error);
  } else {
    // Unknown error
    appError = new AppError(
      process.env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : error.message,
      500,
      'INTERNAL_ERROR'
    );
  }

  // Log error
  if (appError.statusCode >= 500) {
    logger.error('Server Error:', {
      code: appError.code,
      message: appError.message,
      statusCode: appError.statusCode,
      stack: appError.stack,
      path: req.path,
      method: req.method,
      ip: req.ip,
      user: (req as any).user?.id,
    });
  } else {
    logger.warn('Client Error:', {
      code: appError.code,
      message: appError.message,
      statusCode: appError.statusCode,
      path: req.path,
      method: req.method,
    });
  }

  // Send error response
  res.status(appError.statusCode).json({
    success: false,
    error: {
      code: appError.code,
      message: appError.message,
      ...(process.env.NODE_ENV === 'development' && {
        details: appError.details,
        stack: appError.stack,
      }),
    },
    timestamp: new Date().toISOString(),
  });
}

// Async error wrapper
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}