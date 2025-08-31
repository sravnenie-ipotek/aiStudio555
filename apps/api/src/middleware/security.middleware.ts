/**
 * Comprehensive Security Middleware for Projectdes AI Academy
 * ============================================================
 * 
 * Implements multiple layers of security protection
 */

import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Content Security Policy configuration
export const contentSecurityPolicy = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // For Next.js
      "'unsafe-eval'", // For development (remove in production)
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
      'https://js.stripe.com',
      'https://www.paypal.com',
      'https://cdn.jsdelivr.net',
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://fonts.googleapis.com',
      'https://cdn.jsdelivr.net',
    ],
    fontSrc: [
      "'self'",
      'data:',
      'https://fonts.gstatic.com',
    ],
    imgSrc: [
      "'self'",
      'data:',
      'https:',
      'blob:',
    ],
    connectSrc: [
      "'self'",
      'https://api.projectdes.ai',
      'https://api.stripe.com',
      'https://www.paypal.com',
      'https://www.google-analytics.com',
      'wss://ws.projectdes.ai',
    ],
    frameSrc: [
      'https://js.stripe.com',
      'https://www.paypal.com',
      'https://www.youtube.com',
    ],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'", 'https:'],
    childSrc: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
    baseUri: ["'self'"],
    manifestSrc: ["'self'"],
    workerSrc: ["'self'", 'blob:'],
    upgradeInsecureRequests: [],
  },
  reportOnly: false,
});

// Security headers configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: false, // We configure CSP separately above
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
});

// Rate limiting configurations
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit auth attempts
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    // Use combination of IP and email/username for auth endpoints
    return `${req.ip}:${req.body?.email || req.body?.username || ''}`;
  },
});

export const apiRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 API calls per minute
  message: 'API rate limit exceeded.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize request body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query as any);
  }
  
  // Sanitize params
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  
  next();
};

function sanitizeObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return sanitizeValue(obj);
  }
  
  const sanitized: any = Array.isArray(obj) ? [] : {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // Remove any keys that start with $ or contain dots (MongoDB operators)
      if (typeof key === 'string' && (key.startsWith('$') || key.includes('.'))) {
        continue;
      }
      sanitized[key] = sanitizeObject(obj[key]);
    }
  }
  
  return sanitized;
}

function sanitizeValue(value: any): any {
  if (typeof value === 'string') {
    // Remove potential XSS attempts
    value = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    value = value.replace(/javascript:/gi, '');
    value = value.replace(/on\w+\s*=/gi, '');
    
    // Remove SQL injection attempts
    value = value.replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE)\b)/gi, '');
    
    // Trim whitespace
    value = value.trim();
  }
  
  return value;
}

// CSRF Protection
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Skip CSRF for GET requests and webhooks
  if (req.method === 'GET' || req.path.includes('/webhooks/')) {
    return next();
  }
  
  const token = req.headers['x-csrf-token'] || req.body?._csrf;
  const sessionToken = (req as any).session?.csrfToken;
  
  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({
      error: 'Invalid CSRF token',
      message: 'Security validation failed. Please refresh and try again.',
    });
  }
  
  next();
};

// Generate CSRF token
export const generateCSRFToken = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as any).session?.csrfToken) {
    (req as any).session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  next();
};

// Request ID middleware for tracking
export const requestId = (req: Request, res: Response, next: NextFunction) => {
  req.id = req.headers['x-request-id'] as string || uuidv4();
  res.setHeader('X-Request-Id', req.id);
  next();
};

// Security audit logging
export const securityAudit = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Log security-relevant events
  const auditLog = {
    timestamp: new Date().toISOString(),
    requestId: req.id,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    userId: (req as any).user?.id,
    query: req.query,
    body: req.method !== 'GET' ? '[REDACTED]' : undefined,
  };
  
  // Log response
  const originalSend = res.send;
  res.send = function(data) {
    res.send = originalSend;
    
    const responseTime = Date.now() - startTime;
    const statusCode = res.statusCode;
    
    // Log security events
    if (statusCode >= 400) {
      console.error('Security Event:', {
        ...auditLog,
        statusCode,
        responseTime,
        error: statusCode >= 500 ? data : undefined,
      });
    }
    
    // Log authentication events
    if (req.path.includes('/auth/') || req.path.includes('/login') || req.path.includes('/register')) {
      console.log('Auth Event:', {
        ...auditLog,
        statusCode,
        responseTime,
        success: statusCode < 400,
      });
    }
    
    return res.send(data);
  };
  
  next();
};

// SQL Injection Protection (for raw queries if any)
export const sqlInjectionProtection = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE)\b)/gi,
    /(--|#|\/\*|\*\/)/g,
    /(\bOR\b\s*\d+\s*=\s*\d+)/gi,
    /(\bAND\b\s*\d+\s*=\s*\d+)/gi,
    /(\'|\"|`)\s*OR\s*(\'|\"|`)/gi,
  ];
  
  const checkValue = (value: any): boolean => {
    if (typeof value === 'string') {
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(value)) {
          return true;
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        if (checkValue(value[key])) {
          return true;
        }
      }
    }
    return false;
  };
  
  if (checkValue(req.body) || checkValue(req.query) || checkValue(req.params)) {
    console.error('SQL Injection attempt detected:', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
    
    return res.status(400).json({
      error: 'Invalid input',
      message: 'Request contains invalid characters.',
    });
  }
  
  next();
};

// File upload security
export const fileUploadSecurity = (req: Request, res: Response, next: NextFunction) => {
  if (!req.files && !req.file) {
    return next();
  }
  
  const files = req.files ? (Array.isArray(req.files) ? req.files : [req.files]) : [req.file];
  
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'video/mp4',
    'video/webm',
  ];
  
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  
  for (const file of files) {
    if (file) {
      // Check file type
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({
          error: 'Invalid file type',
          message: `File type ${file.mimetype} is not allowed.`,
        });
      }
      
      // Check file size
      if (file.size > maxFileSize) {
        return res.status(400).json({
          error: 'File too large',
          message: `File size exceeds maximum allowed size of ${maxFileSize / 1024 / 1024}MB.`,
        });
      }
      
      // Check for double extensions
      const filename = file.originalname || file.name;
      if (filename && filename.split('.').length > 2) {
        return res.status(400).json({
          error: 'Invalid filename',
          message: 'Files with multiple extensions are not allowed.',
        });
      }
    }
  }
  
  next();
};

// Combined security middleware
export const setupSecurity = (app: any) => {
  // Basic security headers
  app.use(securityHeaders);
  app.use(contentSecurityPolicy);
  
  // Request tracking
  app.use(requestId);
  
  // Rate limiting
  app.use('/api/', apiRateLimit);
  app.use('/auth/', authRateLimit);
  app.use(generalRateLimit);
  
  // Input sanitization
  app.use(sanitizeInput);
  app.use(mongoSanitize());
  app.use(hpp()); // Prevent HTTP Parameter Pollution
  
  // SQL injection protection
  app.use(sqlInjectionProtection);
  
  // CSRF protection
  app.use(generateCSRFToken);
  app.use(csrfProtection);
  
  // Security audit logging
  app.use(securityAudit);
  
  // File upload security (apply to upload routes)
  app.use('/api/upload', fileUploadSecurity);
  
  console.log('✅ Security middleware configured');
};

// Export individual middlewares for selective use
export default {
  setupSecurity,
  securityHeaders,
  contentSecurityPolicy,
  generalRateLimit,
  authRateLimit,
  apiRateLimit,
  sanitizeInput,
  csrfProtection,
  generateCSRFToken,
  requestId,
  securityAudit,
  sqlInjectionProtection,
  fileUploadSecurity,
};

// TypeScript declaration merging for Request
declare global {
  namespace Express {
    interface Request {
      id?: string;
      rateLimit?: {
        limit: number;
        current: number;
        remaining: number;
        resetTime: Date;
      };
    }
  }
}