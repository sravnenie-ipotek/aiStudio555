/**
 * Authentication Middleware
 * JWT token verification and user authentication
 * @module apps/api/middleware/auth
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticationError, AuthorizationError, ValidationError } from './error.middleware';
import { prisma } from '../server';
import { UserRole } from '@aistudio555/types';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
      token?: string;
    }
  }
}

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';

// Token payload interface
interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  type?: 'access' | 'refresh';
}

// ============================================
// JWT UTILITIES
// ============================================

/**
 * Generate access token
 */
export function generateAccessToken(payload: Omit<TokenPayload, 'type'>): string {
  return jwt.sign(
    { ...payload, type: 'access' },
    JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m' }
  );
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(payload: Omit<TokenPayload, 'type'>): string {
  return jwt.sign(
    { ...payload, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d' }
  );
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    throw new AuthenticationError('Invalid or expired refresh token');
  }
}

/**
 * Generate token pair
 */
export function generateTokenPair(user: { id: string; email: string; role: UserRole }) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    expiresIn: 900, // 15 minutes in seconds
  };
}

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

/**
 * Extract token from request
 */
function extractToken(req: Request): string | null {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookies (optional)
  if (req.cookies && req.cookies.access_token) {
    return req.cookies.access_token;
  }

  return null;
}

/**
 * Authenticate user middleware
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extract token
    const token = extractToken(req);
    if (!token) {
      throw new AuthenticationError('No token provided');
    }

    // Verify token
    const payload = verifyAccessToken(token);

    // Check if user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        emailVerified: true,
      },
    });

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    if (!user.emailVerified) {
      throw new AuthenticationError('Email not verified');
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
    };
    req.token = token;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication middleware
 * Continues even if no token is provided
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);
    
    if (token) {
      const payload = verifyAccessToken(token);
      
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role as UserRole,
        };
        req.token = token;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}

// ============================================
// AUTHORIZATION MIDDLEWARE
// ============================================

/**
 * Authorize user by role
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AuthorizationError(
          `Access denied. Required role: ${allowedRoles.join(' or ')}`
        )
      );
    }

    next();
  };
}

/**
 * Check if user owns the resource
 */
export function ownsResource(resourceUserIdField: string = 'userId') {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required'));
    }

    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (!resourceUserId) {
      return next(new ValidationError('Resource user ID not provided'));
    }

    // Admin can access any resource
    if (req.user.role === 'ADMIN') {
      return next();
    }

    // Check ownership
    if (req.user.id !== resourceUserId) {
      return next(new AuthorizationError('You do not have access to this resource'));
    }

    next();
  };
}

/**
 * Check enrollment status for course access
 */
export async function checkEnrollment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    const courseId = req.params.courseId || req.params.id;
    
    if (!courseId) {
      throw new ValidationError('Course ID not provided');
    }

    // Admin and instructor can access any course
    if (req.user.role === 'ADMIN' || req.user.role === 'INSTRUCTOR') {
      return next();
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: req.user.id,
        courseId: courseId,
        status: 'ACTIVE',
      },
    });

    if (!enrollment) {
      throw new AuthorizationError('You are not enrolled in this course');
    }

    // Attach enrollment to request
    (req as any).enrollment = enrollment;

    next();
  } catch (error) {
    next(error);
  }
}