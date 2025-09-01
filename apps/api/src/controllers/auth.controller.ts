/**
 * Authentication Controller
 * Handles user registration, login, and authentication
 * @module apps/api/controllers/auth
 */

import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { prisma, UserRole, Locale, EnrollmentStatus } from '@aistudio555/db';
import { 
  UserRegisterSchema, 
  UserLoginSchema, 
  PasswordResetRequestSchema,
  PasswordResetSchema,
  RefreshTokenSchema
} from '@aistudio555/types';
import { 
  generateTokenPair, 
  verifyRefreshToken
} from '../middleware/auth.middleware';
import { 
  ValidationError, 
  ConflictError, 
  AuthenticationError,
  NotFoundError 
} from '../middleware/error.middleware';
import { asyncHandler } from '../middleware/error.middleware';
import { createLogger } from '@aistudio555/utils';

const logger = createLogger('auth-controller');

// ============================================
// REGISTER
// ============================================
export const register = asyncHandler(async (
  req: Request,
  res: Response
) => {
  // Validate input
  const validatedData = UserRegisterSchema.parse(req.body);

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });

  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(validatedData.password, 12);

  // Generate email verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Create user with profile
  const user = await prisma.user.create({
    data: {
      email: validatedData.email,
      passwordHash,
      role: UserRole.STUDENT,
      emailVerified: false,
      profile: {
        create: {
          firstName: validatedData.firstName || '',
          lastName: validatedData.lastName || '',
          locale: validatedData.language ? (validatedData.language.toUpperCase() as keyof typeof Locale) : Locale.EN,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  // Store verification token in database
  await prisma.verificationToken.create({
    data: {
      userId: user.id,
      token: verificationToken,
      expires: verificationExpires,
    },
  });
  
  // TODO: Send verification email
  logger.info(`Verification token for ${user.email}: ${verificationToken}`);

  // Generate tokens
  const tokens = generateTokenPair({
    id: user.id,
    email: user.email,
    role: user.role as any,
  });

  // Log successful registration
  logger.info(`User registered successfully: ${user.email}`);

  // Send response
  res.status(201).json({
    success: true,
    message: 'Registration successful. Please verify your email.',
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
      ...tokens,
    },
  });
});

// ============================================
// LOGIN
// ============================================
export const login = asyncHandler(async (
  req: Request,
  res: Response
) => {
  // Validate input
  const validatedData = UserLoginSchema.parse(req.body);

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: validatedData.email },
    include: {
      profile: true,
    },
  });

  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(
    validatedData.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Check if email is verified
  if (!user.emailVerified) {
    throw new AuthenticationError('Please verify your email before logging in');
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Generate tokens
  const tokens = generateTokenPair({
    id: user.id,
    email: user.email,
    role: user.role as any,
  });

  // Create session
  const sessionToken = crypto.randomBytes(32).toString('hex');
  await prisma.session.create({
    data: {
      userId: user.id,
      token: sessionToken,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  // Log successful login
  logger.info(`User logged in successfully: ${user.email}`);

  // Send response
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
      ...tokens,
    },
  });
});

// ============================================
// REFRESH TOKEN
// ============================================
export const refreshToken = asyncHandler(async (
  req: Request,
  res: Response
) => {
  // Validate input
  const validatedData = RefreshTokenSchema.parse(req.body);

  // Verify refresh token
  const payload = verifyRefreshToken(validatedData.refreshToken);

  // Find user
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

  // Generate new token pair
  const tokens = generateTokenPair({
    id: user.id,
    email: user.email,
    role: user.role as any,
  });

  // Send response
  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: tokens,
  });
});

// ============================================
// LOGOUT
// ============================================
export const logout = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.id;

  if (userId) {
    // Delete all sessions for the user
    await prisma.session.deleteMany({
      where: { userId },
    });

    logger.info(`User logged out: ${req.user?.email}`);
  }

  // Send response
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// ============================================
// VERIFY EMAIL
// ============================================
export const verifyEmail = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    throw new ValidationError('Verification token is required');
  }

  // Find verification token
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!verificationToken) {
    throw new ValidationError('Invalid or expired verification token');
  }

  // Check if token has expired
  if (verificationToken.expires < new Date()) {
    throw new ValidationError('Verification token has expired');
  }

  // Check if already verified
  if (verificationToken.verified) {
    throw new ValidationError('Email has already been verified');
  }

  // Mark token as verified
  await prisma.verificationToken.update({
    where: { id: verificationToken.id },
    data: { verified: true },
  });

  // Mark user as verified
  await prisma.user.update({
    where: { id: verificationToken.userId },
    data: { emailVerified: true },
  });

  // Clean up expired tokens for this user
  await prisma.verificationToken.deleteMany({
    where: {
      userId: verificationToken.userId,
      expires: { lt: new Date() },
    },
  });

  logger.info(`Email verified successfully: ${verificationToken.user.email}`);

  // Send response
  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
  });
});

// ============================================
// FORGOT PASSWORD
// ============================================
export const forgotPassword = asyncHandler(async (
  req: Request,
  res: Response
) => {
  // Validate input
  const validatedData = PasswordResetRequestSchema.parse(req.body);

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });

  // Always return success to prevent email enumeration
  if (!user) {
    logger.warn(`Password reset requested for non-existent email: ${validatedData.email}`);
  } else {
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token in database
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expires: resetExpires,
      },
    });

    // TODO: Send password reset email
    logger.info(`Password reset token for ${user.email}: ${resetToken}`);
  }

  // Send response (same response whether user exists or not)
  res.status(200).json({
    success: true,
    message: 'If an account exists with this email, a password reset link has been sent',
  });
});

// ============================================
// RESET PASSWORD
// ============================================
export const resetPassword = asyncHandler(async (
  req: Request,
  res: Response
) => {
  // Validate input
  const validatedData = PasswordResetSchema.parse(req.body);

  // Find reset token
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token: validatedData.token },
    include: { user: true },
  });

  if (!resetToken) {
    throw new ValidationError('Invalid or expired reset token');
  }

  // Check if token has expired
  if (resetToken.expires < new Date()) {
    throw new ValidationError('Reset token has expired');
  }

  // Check if token has already been used
  if (resetToken.used) {
    throw new ValidationError('Reset token has already been used');
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(validatedData.password, 12);

  // Update user password
  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { passwordHash },
  });

  // Mark token as used
  await prisma.passwordResetToken.update({
    where: { id: resetToken.id },
    data: { used: true },
  });

  // Clean up expired tokens for this user
  await prisma.passwordResetToken.deleteMany({
    where: {
      userId: resetToken.userId,
      expires: { lt: new Date() },
    },
  });

  // Invalidate all existing sessions for security
  await prisma.session.deleteMany({
    where: { userId: resetToken.userId },
  });

  logger.info(`Password reset successfully for user: ${resetToken.user.email}`);

  // Send response
  res.status(200).json({
    success: true,
    message: 'Password reset successfully. Please log in with your new password.',
  });
});

// ============================================
// GET CURRENT USER
// ============================================
export const getCurrentUser = asyncHandler(async (
  req: Request,
  res: Response
) => {
  if (!req.user) {
    throw new AuthenticationError('User not authenticated');
  }

  // Get full user data
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      profile: true,
      enrollments: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              thumbnail: true,
            },
          },
        },
        where: {
          status: EnrollmentStatus.ACTIVE,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Send response
  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      profile: user.profile,
      enrollments: user.enrollments,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    },
  });
});