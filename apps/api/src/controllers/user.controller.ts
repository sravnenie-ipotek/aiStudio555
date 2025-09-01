/**
 * User Controller
 * Handles user profile and management operations
 * @module apps/api/controllers/user
 */

import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';
import { prisma, UserRole } from '@aistudio555/db';
import {
  UserProfileUpdateSchema,
  PasswordChangeSchema,
} from '@aistudio555/types';
import {
  NotFoundError,
  AuthorizationError,
  ValidationError,
  ConflictError,
} from '../middleware/error.middleware';
import { asyncHandler } from '../middleware/error.middleware';
import { createLogger } from '@aistudio555/utils';

const logger = createLogger('user-controller');

// ============================================
// GET USER PROFILE
// ============================================
export const getUserProfile = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  // Use authenticated user's ID if no ID provided
  const userId = id || req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      lastLoginAt: true,
      profile: true,
      _count: {
        select: {
          enrollments: true,
          instructorCourses: true,
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
    data: user,
  });
});

// ============================================
// UPDATE USER PROFILE
// ============================================
export const updateUserProfile = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user!.id;
  
  // Validate input
  const validatedData = UserProfileUpdateSchema.parse(req.body);

  // Update profile
  const profile = await prisma.userProfile.update({
    where: { userId },
    data: validatedData,
  });

  logger.info(`Profile updated for user: ${userId}`);

  // Send response
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: profile,
  });
});

// ============================================
// CHANGE PASSWORD
// ============================================
export const changePassword = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user!.id;
  
  // Validate input
  const validatedData = PasswordChangeSchema.parse(req.body);

  // Get user with current password hash
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(
    validatedData.currentPassword,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new ValidationError('Current password is incorrect');
  }

  // Hash new password
  const newPasswordHash = await bcrypt.hash(validatedData.newPassword, 12);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash },
  });

  logger.info(`Password changed for user: ${userId}`);

  // Send response
  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

// ============================================
// GET ALL USERS (Admin only)
// ============================================
export const getAllUsers = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    role,
    search,
    page = 1,
    limit = 20,
    sort = 'createdAt',
    order = 'desc',
  } = req.query;

  // Build filter conditions
  const where: any = {};

  if (role) {
    where.role = role as UserRole;
  }

  if (search) {
    where.OR = [
      { email: { contains: search as string, mode: 'insensitive' } },
      {
        profile: {
          OR: [
            { firstName: { contains: search as string, mode: 'insensitive' } },
            { lastName: { contains: search as string, mode: 'insensitive' } },
          ],
        },
      },
    ];
  }

  // Calculate pagination
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Get users with pagination
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: {
        [sort as string]: order,
      },
      select: {
        id: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        lastLoginAt: true,
        profile: true,
        _count: {
          select: {
            enrollments: true,
            instructorCourses: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  // Send response
  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

// ============================================
// UPDATE USER ROLE (Admin only)
// ============================================
export const updateUserRole = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !['STUDENT', 'INSTRUCTOR', 'ADMIN', 'SUPPORT'].includes(role)) {
    throw new ValidationError('Invalid role specified');
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Prevent self-demotion for admins
  if (user.id === req.user!.id && role !== 'ADMIN') {
    throw new AuthorizationError('You cannot change your own admin role');
  }

  // Update user role
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  logger.info(`User role updated: ${id} to ${role} by ${req.user!.email}`);

  // Send response
  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    data: updatedUser,
  });
});

// ============================================
// DELETE USER (Admin only)
// ============================================
export const deleteUser = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          enrollments: true,
          instructorCourses: true,
          payments: true,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Prevent self-deletion
  if (user.id === req.user!.id) {
    throw new AuthorizationError('You cannot delete your own account');
  }

  // Check for active relationships
  if (user._count.instructorCourses > 0) {
    throw new ConflictError('Cannot delete user with active courses as instructor');
  }

  // Soft delete by anonymizing user data
  await prisma.user.update({
    where: { id },
    data: {
      email: `deleted_${id}@deleted.com`,
      passwordHash: '',
      emailVerified: false,
      profile: {
        update: {
          firstName: 'Deleted',
          lastName: 'User',
          phone: null,
          avatar: null,
          bio: null,
        },
      },
    },
  });

  logger.info(`User deleted: ${id} by ${req.user!.email}`);

  // Send response
  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

// ============================================
// GET USER STATISTICS (Admin only)
// ============================================
export const getUserStatistics = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [
    totalUsers,
    verifiedUsers,
    activeStudents,
    instructors,
    newUsersThisMonth,
    activeEnrollments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { emailVerified: true } }),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'INSTRUCTOR' } }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
    }),
    prisma.enrollment.count({ where: { status: 'ACTIVE' } }),
  ]);

  // Send response
  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      verifiedUsers,
      activeStudents,
      instructors,
      newUsersThisMonth,
      activeEnrollments,
      verificationRate: Math.round((verifiedUsers / totalUsers) * 100),
    },
  });
});

// ============================================
// UPLOAD AVATAR
// ============================================
export const uploadAvatar = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user!.id;
  
  // TODO: Implement file upload with multer
  // This is a placeholder for avatar upload functionality
  
  throw new ValidationError('Avatar upload not yet implemented');
});

// ============================================
// GET INSTRUCTOR PROFILE
// ============================================
export const getInstructorProfile = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const instructor = await prisma.user.findFirst({
    where: {
      id,
      role: 'INSTRUCTOR',
    },
    select: {
      id: true,
      email: true,
      profile: true,
      instructorCourses: {
        where: { isPublished: true },
        select: {
          id: true,
          title: true,
          thumbnail: true,
          price: true,
          _count: {
            select: {
              enrollments: true,
            },
          },
        },
      },
      _count: {
        select: {
          instructorCourses: true,
        },
      },
    },
  });

  if (!instructor) {
    throw new NotFoundError('Instructor not found');
  }

  // Calculate total students
  const totalStudents = instructor.instructorCourses.reduce(
    (sum, course) => sum + course._count.enrollments,
    0
  );

  // Send response
  res.status(200).json({
    success: true,
    data: {
      ...instructor,
      totalStudents,
    },
  });
});