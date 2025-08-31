# Error Handling Strategy

## Overview

Comprehensive error handling for production-grade application with proper
logging, monitoring, and user experience.

## Error Classification

### Error Types

```typescript
enum ErrorType {
  VALIDATION = 'VALIDATION', // 400 - Invalid input
  AUTHENTICATION = 'AUTHENTICATION', // 401 - Not authenticated
  AUTHORIZATION = 'AUTHORIZATION', // 403 - Not authorized
  NOT_FOUND = 'NOT_FOUND', // 404 - Resource not found
  CONFLICT = 'CONFLICT', // 409 - Resource conflict
  RATE_LIMIT = 'RATE_LIMIT', // 429 - Too many requests
  INTERNAL = 'INTERNAL', // 500 - Server error
  DATABASE = 'DATABASE', // 500 - Database error
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE', // 502 - Third-party service error
  TIMEOUT = 'TIMEOUT', // 504 - Request timeout
}
```

## Custom Error Classes

### Base Error Class

```typescript
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;
  public readonly timestamp: Date;
  public readonly correlationId: string;

  constructor(
    type: ErrorType,
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    this.timestamp = new Date();
    this.correlationId = generateCorrelationId();

    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error classes
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(ErrorType.VALIDATION, message, 400, true, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(ErrorType.AUTHENTICATION, message, 401, true);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(ErrorType.NOT_FOUND, `${resource} not found`, 404, true);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: any) {
    super(ErrorType.DATABASE, message, 500, false, details);
  }
}
```

## Global Error Handler

### Express Error Middleware

```typescript
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error values
  let error: AppError;

  if (err instanceof AppError) {
    error = err;
  } else if (err instanceof PrismaClientKnownRequestError) {
    error = handlePrismaError(err);
  } else if (err instanceof ZodError) {
    error = handleValidationError(err);
  } else {
    // Unknown errors
    error = new AppError(
      ErrorType.INTERNAL,
      'An unexpected error occurred',
      500,
      false
    );
  }

  // Log error
  logError(error, req);

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    error: {
      type: error.type,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && {
        details: error.details,
        stack: error.stack,
      }),
      correlationId: error.correlationId,
      timestamp: error.timestamp,
    },
  });
};

// Prisma error handler
const handlePrismaError = (err: PrismaClientKnownRequestError): AppError => {
  switch (err.code) {
    case 'P2002':
      return new ValidationError('Duplicate value for unique field');
    case 'P2025':
      return new NotFoundError('Record');
    case 'P2003':
      return new ValidationError('Foreign key constraint failed');
    default:
      return new DatabaseError('Database operation failed', err);
  }
};

// Zod validation error handler
const handleValidationError = (err: ZodError): AppError => {
  const errors = err.errors.map(e => ({
    field: e.path.join('.'),
    message: e.message,
  }));

  return new ValidationError('Validation failed', errors);
};
```

## Frontend Error Handling

### Error Boundary Component

```tsx
// React Error Boundary
class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error tracking service
    Sentry.captureException(error, {
      contexts: { react: { componentStack: errorInfo.componentStack } },
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Error Fallback Component
const ErrorFallback: FC<{ error: Error }> = ({ error }) => {
  return (
    <div className="error-fallback">
      <h2>Oops! Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={() => window.location.reload()}>Reload Page</button>
    </div>
  );
};
```

### API Error Handler Hook

```typescript
// Custom hook for API error handling
export const useErrorHandler = () => {
  const { t } = useTranslation();
  const toast = useToast();

  const handleError = useCallback(
    (error: any) => {
      if (error.response) {
        const { data } = error.response;

        switch (data.error?.type) {
          case ErrorType.VALIDATION:
            toast.error(t('errors.validation'), {
              description: formatValidationErrors(data.error.details),
            });
            break;

          case ErrorType.AUTHENTICATION:
            toast.error(t('errors.authentication'));
            router.push('/login');
            break;

          case ErrorType.AUTHORIZATION:
            toast.error(t('errors.unauthorized'));
            break;

          case ErrorType.RATE_LIMIT:
            toast.error(t('errors.tooManyRequests'));
            break;

          case ErrorType.NOT_FOUND:
            toast.error(t('errors.notFound'));
            break;

          default:
            toast.error(t('errors.generic'));
        }
      } else if (error.request) {
        toast.error(t('errors.network'));
      } else {
        toast.error(t('errors.unexpected'));
      }

      // Log to monitoring
      Sentry.captureException(error);
    },
    [t, toast]
  );

  return { handleError };
};
```

## Async Error Handling

### Async Handler Wrapper

```typescript
// Wrapper for async route handlers
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage
router.get(
  '/courses/:id',
  asyncHandler(async (req, res) => {
    const course = await courseService.findById(req.params.id);
    if (!course) {
      throw new NotFoundError('Course');
    }
    res.json(course);
  })
);
```

### Try-Catch Utilities

```typescript
// Result type for better error handling
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Safe async execution
export async function safeAsync<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// Usage
const result = await safeAsync(() => prisma.user.create({ data: userData }));

if (!result.success) {
  // Handle error
  logger.error('User creation failed', result.error);
  throw new DatabaseError('Failed to create user');
}

// Use result.data safely
```

## Error Logging

### Structured Logging

```typescript
import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'combined.log',
    }),
  ],
});

// Add cloud logging in production
if (process.env.NODE_ENV === 'production') {
  logger.add(new LoggingWinston());
}

// Error logging function
export const logError = (error: AppError, req?: Request) => {
  const errorLog = {
    correlationId: error.correlationId,
    type: error.type,
    message: error.message,
    statusCode: error.statusCode,
    timestamp: error.timestamp,
    ...(req && {
      request: {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userId: req.user?.id,
      },
    }),
    stack: error.stack,
    details: error.details,
  };

  if (!error.isOperational) {
    logger.error('Non-operational error', errorLog);
    // Alert team for critical errors
    alertTeam(errorLog);
  } else {
    logger.warn('Operational error', errorLog);
  }
};
```

## Error Monitoring

### Sentry Integration

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event, hint) {
    // Filter sensitive data
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    return event;
  },
});

// Express integration
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());

// Manual error capture
Sentry.captureException(error, {
  tags: {
    section: 'payment',
    userId: user.id,
  },
  extra: {
    orderId: order.id,
  },
});
```

## User-Friendly Error Messages

### Error Message Mapping

```typescript
const errorMessages: Record<string, string> = {
  'auth/invalid-credentials': 'Invalid email or password',
  'auth/email-already-exists': 'An account with this email already exists',
  'payment/card-declined': 'Your card was declined. Please try another card',
  'course/already-enrolled': 'You are already enrolled in this course',
  'network/timeout': 'Request timed out. Please try again',
  'validation/required-field': 'This field is required',
  'validation/invalid-email': 'Please enter a valid email address',
};

// Multi-language support
const errorMessagesI18n = {
  en: errorMessages,
  ru: {
    'auth/invalid-credentials': 'Неверный email или пароль',
    // ... other translations
  },
  he: {
    'auth/invalid-credentials': 'אימייל או סיסמה לא תקינים',
    // ... other translations
  },
};
```

## Recovery Strategies

### Retry Logic

```typescript
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

// Usage
const result = await retryWithBackoff(
  () => stripeClient.charges.create(chargeData),
  3,
  1000
);
```

### Circuit Breaker Pattern

```typescript
class CircuitBreaker {
  private failures = 0;
  private successCount = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private nextAttempt: number = Date.now();

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.successCount++;

    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
    }
  }

  private onFailure() {
    this.failures++;
    this.successCount = 0;

    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}
```

## Testing Error Scenarios

### Error Testing Examples

```typescript
describe('Error Handling', () => {
  it('should handle validation errors', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'invalid-email' });

    expect(response.status).toBe(400);
    expect(response.body.error.type).toBe('VALIDATION');
  });

  it('should handle authentication errors', async () => {
    const response = await request(app)
      .get('/api/protected')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
    expect(response.body.error.type).toBe('AUTHENTICATION');
  });

  it('should handle database errors', async () => {
    jest
      .spyOn(prisma.user, 'create')
      .mockRejectedValue(new PrismaClientKnownRequestError('', 'P2002', ''));

    const response = await request(app).post('/api/users').send(validUserData);

    expect(response.status).toBe(400);
    expect(response.body.error.message).toContain('Duplicate');
  });
});
```

## Implementation Checklist

- [ ] Create custom error classes
- [ ] Implement global error handler
- [ ] Add error boundaries in React
- [ ] Setup structured logging
- [ ] Integrate Sentry monitoring
- [ ] Add retry logic for external services
- [ ] Implement circuit breaker pattern
- [ ] Create error message translations
- [ ] Add error recovery strategies
- [ ] Write comprehensive error tests
