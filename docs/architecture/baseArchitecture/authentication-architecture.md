# Authentication & Authorization Architecture

## Overview

Multi-layered security architecture with JWT tokens, role-based access control,
and comprehensive session management.

## Authentication Flow

### 1. User Registration

```typescript
POST /api/auth/register
{
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  locale: 'en' | 'ru' | 'he'
}

// Server Process:
1. Validate input (Zod schema)
2. Check email uniqueness
3. Hash password (bcrypt, 12 rounds)
4. Create user record
5. Send verification email
6. Return success (no auto-login)
```

### 2. Email Verification

```typescript
GET /api/auth/verify?token=xxx

// Process:
1. Validate token (expires in 24h)
2. Mark email as verified
3. Auto-login user
4. Redirect to dashboard
```

### 3. User Login

```typescript
POST /api/auth/login
{
  email: string,
  password: string,
  rememberMe: boolean
}

// Server Process:
1. Validate credentials
2. Check email verification
3. Generate tokens:
   - Access token (15 min)
   - Refresh token (7 days or 30 days if rememberMe)
4. Create session record
5. Return tokens + user data
```

### 4. Token Management

```typescript
// Access Token Payload
{
  userId: string,
  email: string,
  role: UserRole,
  sessionId: string,
  iat: number,
  exp: number
}

// Refresh Token Strategy
POST /api/auth/refresh
Authorization: Bearer <refresh_token>

// Process:
1. Validate refresh token
2. Check session validity
3. Rotate refresh token (security)
4. Issue new access token
5. Update session activity
```

## Authorization System

### Role-Based Access Control (RBAC)

```typescript
enum UserRole {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT',
}

// Permission Matrix
const permissions = {
  STUDENT: [
    'course.view',
    'course.enroll',
    'profile.edit.own',
    'progress.view.own',
  ],
  INSTRUCTOR: [
    ...permissions.STUDENT,
    'course.create',
    'course.edit.own',
    'student.view.enrolled',
    'assignment.grade',
  ],
  ADMIN: [
    '*', // All permissions
  ],
  SUPPORT: ['user.view', 'user.support', 'course.view', 'payment.view'],
};
```

### Resource-Based Authorization

```typescript
// Middleware Implementation
const authorize = (resource: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const permission = `${resource}.${action}`;

    // Check role permissions
    if (!hasPermission(user.role, permission)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Check resource ownership if needed
    if (action.includes('.own')) {
      const isOwner = await checkOwnership(user.id, resource, req.params.id);
      if (!isOwner) {
        return res.status(403).json({ error: 'Not owner' });
      }
    }

    next();
  };
};

// Usage Example
router.put(
  '/api/courses/:id',
  authenticate,
  authorize('course', 'edit.own'),
  updateCourse
);
```

## Security Features

### 1. Password Security

```typescript
// Password Requirements
const passwordSchema = z.string()
  .min(8)
  .regex(/[A-Z]/, 'Must contain uppercase')
  .regex(/[a-z]/, 'Must contain lowercase')
  .regex(/[0-9]/, 'Must contain number')
  .regex(/[^A-Za-z0-9]/, 'Must contain special character');

// Password Reset Flow
POST /api/auth/forgot-password
{ email: string }

// Process:
1. Generate secure token (crypto.randomBytes)
2. Store token with 1-hour expiry
3. Send reset email
4. Track attempt count (max 3 per day)

POST /api/auth/reset-password
{
  token: string,
  newPassword: string
}
```

### 2. Two-Factor Authentication (2FA)

```typescript
// Enable 2FA
POST /api/auth/2fa/enable

// Response:
{
  secret: string,
  qrCode: string, // Base64 QR code
  backupCodes: string[]
}

// Verify 2FA
POST /api/auth/2fa/verify
{
  code: string // TOTP code
}

// Login with 2FA
POST /api/auth/login
{
  email: string,
  password: string,
  totpCode?: string // Required if 2FA enabled
}
```

### 3. Session Management

```typescript
// Session Security
interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  lastActivity: Date;
}

// Session Controls
- Concurrent session limit (3 devices)
- Session timeout (30 min inactivity)
- Force logout all devices
- Session activity tracking

// API Endpoints
GET /api/auth/sessions      // List active sessions
DELETE /api/auth/sessions/:id  // Logout specific device
DELETE /api/auth/sessions/all  // Logout all devices
```

### 4. Rate Limiting

```typescript
// Configuration
const rateLimits = {
  '/api/auth/login': {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    skipSuccessfulRequests: true,
  },
  '/api/auth/register': {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 registrations per hour per IP
  },
  '/api/auth/forgot-password': {
    windowMs: 60 * 60 * 1000,
    max: 3,
  },
  '/api/*': {
    windowMs: 60 * 1000,
    max: 100, // General API limit
  },
};
```

### 5. Security Headers

```typescript
// Helmet Configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://js.stripe.com'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.stripe.com'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);
```

## OAuth2 Integration

### Social Login Providers

```typescript
// Google OAuth
GET / api / auth / google;
// Redirects to Google consent screen

GET / api / auth / google / callback;
// Handles Google callback
// Creates/updates user
// Issues JWT tokens

// GitHub OAuth
GET / api / auth / github;
GET / api / auth / github / callback;

// Implementation with Passport.js
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // Find or create user
      let user = await prisma.user.findUnique({
        where: { email: profile.emails[0].value },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: profile.emails[0].value,
            emailVerified: true,
            profile: {
              create: {
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                avatar: profile.photos[0].value,
              },
            },
          },
        });
      }

      done(null, user);
    }
  )
);
```

## Audit Logging

### Security Events

```typescript
enum SecurityEvent {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_RESET = 'PASSWORD_RESET',
  TWO_FA_ENABLED = 'TWO_FA_ENABLED',
  TWO_FA_DISABLED = 'TWO_FA_DISABLED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
}

// Audit Log Entry
interface AuditLog {
  id: string;
  userId?: string;
  event: SecurityEvent;
  ipAddress: string;
  userAgent: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

// Log Security Event
const logSecurityEvent = async (
  event: SecurityEvent,
  req: Request,
  metadata?: any
) => {
  await prisma.auditLog.create({
    data: {
      userId: req.user?.id,
      event,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata,
    },
  });

  // Alert on suspicious activity
  if (event === SecurityEvent.SUSPICIOUS_ACTIVITY) {
    await sendSecurityAlert(req.user, metadata);
  }
};
```

## API Security

### Request Validation

```typescript
// Zod Schema Validation Middleware
const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    }
  };
};

// Usage
router.post(
  '/api/courses',
  authenticate,
  authorize('course', 'create'),
  validate(createCourseSchema),
  createCourse
);
```

### CORS Configuration

```typescript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://projectdes.ai',
      'https://www.projectdes.ai',
      'https://staging.projectdes.ai',
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
```

## Implementation Checklist

### Phase 1: Basic Authentication (Week 1)

- [ ] User registration with email verification
- [ ] Login with JWT tokens
- [ ] Password reset flow
- [ ] Session management
- [ ] Basic role-based access

### Phase 2: Enhanced Security (Week 2)

- [ ] Two-factor authentication
- [ ] OAuth2 social login
- [ ] Rate limiting
- [ ] Security headers
- [ ] Audit logging

### Phase 3: Advanced Features (Week 3)

- [ ] Biometric authentication (mobile)
- [ ] Risk-based authentication
- [ ] IP whitelist/blacklist
- [ ] Anomaly detection
- [ ] Compliance reporting

## Security Best Practices

1. **Never trust client input** - Validate everything server-side
2. **Use HTTPS everywhere** - No exceptions
3. **Store sensitive data encrypted** - Use AES-256 for PII
4. **Implement proper logging** - But never log passwords or tokens
5. **Regular security audits** - Quarterly penetration testing
6. **Keep dependencies updated** - Use Dependabot
7. **Implement CSP headers** - Prevent XSS attacks
8. **Use secure cookies** - HttpOnly, Secure, SameSite
9. **Implement CAPTCHA** - For public forms
10. **Monitor for breaches** - Use HaveIBeenPwned API
