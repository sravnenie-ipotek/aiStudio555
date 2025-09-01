# API Architecture Documentation

## Overview

The AiStudio555 AI Academy API serves as the backbone of the platform, providing RESTful endpoints for all client applications. Built with Express.js and TypeScript, it follows industry best practices for scalability, security, and maintainability.

## Core Principles

### 1. RESTful Design
- **Resource-Based URLs**: `/api/courses`, `/api/users`, `/api/enrollments`
- **HTTP Methods**: GET (read), POST (create), PUT (update), DELETE (remove)
- **Stateless**: Each request contains all information needed
- **JSON Format**: All requests and responses use JSON

### 2. API Versioning Strategy
- **URL Versioning**: `/api/v1/`, `/api/v2/` for major versions
- **Header Versioning**: `X-API-Version` for minor updates
- **Deprecation Policy**: 6-month notice before removing endpoints
- **Backward Compatibility**: New fields are additive, never breaking

### 3. Authentication & Authorization

#### JWT Token Strategy
```typescript
// Access Token (15 minutes)
{
  userId: string,
  email: string,
  role: 'student' | 'instructor' | 'admin',
  permissions: string[],
  iat: number,
  exp: number
}

// Refresh Token (7 days)
{
  userId: string,
  tokenId: string,
  iat: number,
  exp: number
}
```

#### Authorization Levels
- **Public**: No authentication required
- **Authenticated**: Valid JWT required
- **Role-Based**: Specific roles (student, instructor, admin)
- **Permission-Based**: Granular permissions for actions

## API Structure

### Base URL Patterns
```
Production: https://api.aistudio555.ai
Staging: https://staging-api.aistudio555.ai
Development: http://localhost:3001
```

### Endpoint Categories

#### 1. Authentication Endpoints
```
POST   /api/auth/register        - User registration
POST   /api/auth/login          - User login
POST   /api/auth/logout         - User logout
POST   /api/auth/refresh        - Refresh access token
POST   /api/auth/forgot-password - Request password reset
POST   /api/auth/reset-password  - Reset password with token
POST   /api/auth/verify-email    - Verify email address
GET    /api/auth/me            - Get current user
```

#### 2. User Management
```
GET    /api/users               - List users (admin)
GET    /api/users/:id          - Get user details
PUT    /api/users/:id          - Update user profile
DELETE /api/users/:id          - Delete user (admin)
GET    /api/users/:id/courses  - Get user's enrolled courses
GET    /api/users/:id/progress - Get learning progress
```

#### 3. Course Management
```
GET    /api/courses             - List all courses
GET    /api/courses/:id        - Get course details
POST   /api/courses             - Create course (instructor)
PUT    /api/courses/:id        - Update course (instructor)
DELETE /api/courses/:id        - Delete course (admin)
GET    /api/courses/:id/modules - Get course modules
GET    /api/courses/:id/reviews - Get course reviews
POST   /api/courses/:id/enroll  - Enroll in course
```

#### 4. Learning Management
```
GET    /api/lessons/:id        - Get lesson content
POST   /api/lessons/:id/complete - Mark lesson complete
GET    /api/assignments/:id    - Get assignment
POST   /api/submissions        - Submit assignment
GET    /api/certificates/:id   - Get certificate
POST   /api/certificates/generate - Generate certificate
```

#### 5. Payment Processing
```
POST   /api/payments/create-intent     - Create payment intent
POST   /api/payments/confirm          - Confirm payment
GET    /api/payments/history          - Payment history
POST   /api/payments/refund           - Request refund
GET    /api/payments/invoices/:id     - Get invoice
POST   /api/webhooks/stripe          - Stripe webhook
POST   /api/webhooks/paypal          - PayPal webhook
```

#### 6. Communication
```
GET    /api/notifications       - Get notifications
PUT    /api/notifications/:id/read - Mark as read
POST   /api/messages           - Send message
GET    /api/messages           - Get messages
POST   /api/support/ticket     - Create support ticket
```

#### 7. Analytics & Reporting
```
GET    /api/analytics/dashboard      - Dashboard stats
GET    /api/analytics/courses/:id   - Course analytics
GET    /api/analytics/revenue       - Revenue reports
GET    /api/analytics/engagement    - User engagement
POST   /api/analytics/track        - Track events
```

## Request/Response Format

### Standard Request Headers
```http
Content-Type: application/json
Authorization: Bearer <jwt_token>
X-API-Version: 1.0
X-Request-ID: <uuid>
Accept-Language: en-US
```

### Success Response Format
```json
{
  "success": true,
  "data": {
    // Response payload
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0",
    "requestId": "uuid"
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "uuid"
  }
}
```

### Pagination Format
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Error Codes

### HTTP Status Codes
- **200**: OK - Request succeeded
- **201**: Created - Resource created
- **204**: No Content - Request succeeded, no content
- **400**: Bad Request - Invalid request
- **401**: Unauthorized - Authentication required
- **403**: Forbidden - Access denied
- **404**: Not Found - Resource not found
- **409**: Conflict - Resource conflict
- **422**: Unprocessable Entity - Validation error
- **429**: Too Many Requests - Rate limit exceeded
- **500**: Internal Server Error
- **503**: Service Unavailable

### Application Error Codes
```typescript
enum ErrorCodes {
  // Authentication
  AUTH_INVALID_CREDENTIALS = 'AUTH001',
  AUTH_TOKEN_EXPIRED = 'AUTH002',
  AUTH_TOKEN_INVALID = 'AUTH003',
  AUTH_INSUFFICIENT_PERMISSIONS = 'AUTH004',
  
  // Validation
  VALIDATION_REQUIRED = 'VAL001',
  VALIDATION_FORMAT = 'VAL002',
  VALIDATION_RANGE = 'VAL003',
  
  // Business Logic
  COURSE_NOT_FOUND = 'CRS001',
  ENROLLMENT_EXISTS = 'ENR001',
  PAYMENT_FAILED = 'PAY001',
  
  // System
  RATE_LIMIT_EXCEEDED = 'SYS001',
  SERVICE_UNAVAILABLE = 'SYS002'
}
```

## Rate Limiting

### Default Limits
```typescript
// Per IP Address
const rateLimits = {
  public: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // requests
  },
  authenticated: {
    windowMs: 15 * 60 * 1000,
    max: 1000
  },
  api: {
    '/api/auth/login': { max: 5, windowMs: 15 * 60 * 1000 },
    '/api/auth/register': { max: 3, windowMs: 60 * 60 * 1000 },
    '/api/payments/*': { max: 20, windowMs: 60 * 1000 }
  }
}
```

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200000
```

## Security Measures

### 1. Input Validation
- **Zod Schemas**: Type-safe validation
- **SQL Injection Prevention**: Parameterized queries via Prisma
- **XSS Protection**: Input sanitization
- **File Upload Validation**: Type, size, content checks

### 2. Authentication Security
- **Password Requirements**: Min 8 chars, complexity rules
- **Bcrypt Hashing**: Cost factor 12
- **JWT Security**: Short-lived access tokens
- **Refresh Token Rotation**: Single use refresh tokens

### 3. API Security Headers
```typescript
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000',
  'Content-Security-Policy': "default-src 'self'"
}
```

### 4. CORS Configuration
```typescript
const corsOptions = {
  origin: [
    'https://aistudio555.ai',
    'https://www.aistudio555.ai'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

## Caching Strategy

### Cache Layers
1. **CDN Cache**: Static assets (Cloudflare)
2. **Redis Cache**: Session data, frequent queries
3. **Database Cache**: Query result caching
4. **Client Cache**: HTTP cache headers

### Cache Headers
```http
Cache-Control: public, max-age=3600
ETag: "33a64df551425fcc"
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT
```

### Cache Invalidation
- **Time-Based**: TTL expiration
- **Event-Based**: On data updates
- **Manual**: Admin cache purge

## WebSocket API

### Real-Time Events
```typescript
// Connection
ws://api.aistudio555.ai/socket

// Events
socket.on('connect', () => {})
socket.on('notification', (data) => {})
socket.on('message', (data) => {})
socket.on('courseUpdate', (data) => {})
socket.on('disconnect', () => {})

// Rooms
socket.join('course:123')
socket.join('user:456')
```

## API Testing

### Testing Strategy
1. **Unit Tests**: Individual functions
2. **Integration Tests**: API endpoints
3. **Load Tests**: Performance testing
4. **Security Tests**: Vulnerability scanning

### Test Coverage Requirements
- **Minimum**: 80% code coverage
- **Critical Paths**: 100% coverage
- **Payment Flows**: 100% coverage

## Monitoring & Logging

### Logging Levels
```typescript
enum LogLevel {
  ERROR = 0,   // System errors
  WARN = 1,    // Warning conditions
  INFO = 2,    // Informational
  HTTP = 3,    // HTTP requests
  DEBUG = 4    // Debug information
}
```

### Metrics Tracked
- **Response Times**: P50, P95, P99
- **Error Rates**: 4xx, 5xx counts
- **Request Volume**: Requests per second
- **Business Metrics**: Enrollments, payments

### Alert Thresholds
- **Error Rate**: > 1% triggers alert
- **Response Time**: P95 > 500ms warning
- **Downtime**: Any 5xx spike
- **Payment Failures**: > 5% failure rate

## API Documentation

### OpenAPI/Swagger
- **Specification**: OpenAPI 3.0
- **Documentation URL**: `/api/docs`
- **Interactive Testing**: Swagger UI
- **Auto-Generation**: From TypeScript types

### Client SDKs
- **JavaScript/TypeScript**: Auto-generated
- **Python**: For data analysis
- **Mobile**: React Native compatible

## Performance Optimization

### Optimization Techniques
1. **Database Indexing**: Strategic indexes
2. **Query Optimization**: N+1 prevention
3. **Response Compression**: Gzip/Brotli
4. **Connection Pooling**: Database pools
5. **Lazy Loading**: Pagination, partial responses

### Performance Targets
- **API Response**: < 200ms average
- **Database Query**: < 50ms average
- **Cache Hit Rate**: > 80%
- **Uptime**: 99.9% SLA

## Deployment & Scaling

### Deployment Strategy
- **Blue-Green Deployment**: Zero downtime
- **Rolling Updates**: Gradual rollout
- **Feature Flags**: Controlled feature release
- **Rollback Plan**: Instant rollback capability

### Scaling Approach
- **Horizontal Scaling**: Multiple API instances
- **Load Balancing**: Nginx round-robin
- **Database Scaling**: Read replicas
- **Cache Scaling**: Redis cluster

## API Governance

### Change Management
1. **API Review Board**: Architecture decisions
2. **Breaking Change Policy**: 6-month deprecation
3. **Version Support**: 2 major versions
4. **Documentation Updates**: Before deployment

### Best Practices
- **Consistent Naming**: camelCase for JSON
- **Resource Nesting**: Max 2 levels deep
- **Batch Operations**: Bulk endpoints available
- **Idempotency**: POST/PUT operations idempotent
- **Audit Logging**: All modifications logged

## Future Enhancements

### Planned Features
1. **GraphQL API**: For flexible queries
2. **gRPC**: For microservices
3. **API Gateway**: Kong or AWS API Gateway
4. **Service Mesh**: Istio for microservices
5. **Event-Driven**: Kafka for event streaming

### API Evolution
- **v2 Planning**: GraphQL integration
- **Microservices**: Service decomposition
- **Real-time**: Enhanced WebSocket features
- **AI Integration**: ML model serving