/**
 * Course Controller
 * Handles course-related operations
 * @module apps/api/controllers/course
 */

import { Request, Response, NextFunction } from 'express';
import { prisma, UserRole, CourseStatus, EnrollmentStatus } from '@aistudio555/db';
import {
  CourseCreateSchema,
  CourseUpdateSchema,
  LessonProgressSchema,
} from '@aistudio555/types';
import {
  NotFoundError,
  AuthorizationError,
  ConflictError,
} from '../middleware/error.middleware';
import { asyncHandler } from '../middleware/error.middleware';
import { createLogger } from '@aistudio555/utils';

const logger = createLogger('course-controller');

// ============================================
// GET ALL COURSES
// ============================================
export const getAllCourses = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const {
    category,
    level,
    language,
    search,
    page = 1,
    limit = 12,
    sort = 'createdAt',
    order = 'desc',
  } = req.query;

  // Build filter conditions
  const where: any = {
    status: CourseStatus.PUBLISHED,
  };

  if (category) {
    where.category = category;
  }

  if (level) {
    where.level = level;
  }

  if (language) {
    where.language = language;
  }

  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  // Calculate pagination
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Get courses with pagination
  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      skip,
      take,
      orderBy: {
        [sort as string]: order,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            bio: true,
            avatarId: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            modules: true,
          },
        },
      },
    }),
    prisma.course.count({ where }),
  ]);

  // Send response
  res.status(200).json({
    success: true,
    data: {
      courses,
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
// GET SINGLE COURSE
// ============================================
export const getCourseById = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  if (!id) {
    throw new NotFoundError('Course ID is required');
  }

  const course = await prisma.course.findFirst({
    where: { id },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          bio: true,
          avatarId: true,
        },
      },
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              title: true,
              duration: true,
              order: true,
            },
          },
        },
      },
      _count: {
        select: {
          enrollments: true,
          reviews: true,
        },
      },
    },
  });

  if (!course) {
    throw new NotFoundError('Course not found');
  }

  // Check if user is enrolled (if authenticated)
  let enrollment = null;
  if (req.user) {
    enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: req.user.id,
        courseId: id,
      },
    });
  }

  // Send response
  res.status(200).json({
    success: true,
    data: {
      course,
      isEnrolled: !!enrollment,
      enrollmentStatus: enrollment?.status,
    },
  });
});

// ============================================
// CREATE COURSE (Instructor/Admin only)
// ============================================
export const createCourse = asyncHandler(async (
  req: Request,
  res: Response
) => {
  // Validate input
  const validatedData = CourseCreateSchema.parse(req.body);

  // Generate slug from title
  const titleText = typeof validatedData.title === 'string' 
    ? validatedData.title 
    : JSON.stringify(validatedData.title);
  const slug = titleText.toLowerCase().replace(/\s+/g, '-');

  // Create course
  const course = await prisma.course.create({
    data: {
      ...validatedData,
      instructorId: req.user!.id,
      slug,
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          bio: true,
        },
      },
    },
  });

  logger.info(`Course created: ${course.id} by ${req.user!.email}`);

  // Send response
  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: course,
  });
});

// ============================================
// UPDATE COURSE (Instructor/Admin only)
// ============================================
export const updateCourse = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  
  if (!id) {
    throw new NotFoundError('Course ID is required');
  }
  
  // Validate input
  const validatedData = CourseUpdateSchema.parse(req.body);

  // Check if course exists
  const existingCourse = await prisma.course.findFirst({
    where: { id },
  });

  if (!existingCourse) {
    throw new NotFoundError('Course not found');
  }

  // Check authorization (only course owner or admin)
  if (
    req.user!.role !== UserRole.ADMIN &&
    existingCourse.instructorId !== req.user!.id
  ) {
    throw new AuthorizationError('You do not have permission to update this course');
  }

  // Generate new slug if title is updated
  let slug;
  if (validatedData.title) {
    const titleText = typeof validatedData.title === 'string' 
      ? validatedData.title 
      : JSON.stringify(validatedData.title);
    slug = titleText.toLowerCase().replace(/\s+/g, '-');
  }

  // Update course
  const course = await prisma.course.update({
    where: { id },
    data: {
      ...validatedData,
      ...(slug && { slug }),
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          bio: true,
        },
      },
    },
  });

  logger.info(`Course updated: ${course.id} by ${req.user!.email}`);

  // Send response
  res.status(200).json({
    success: true,
    message: 'Course updated successfully',
    data: course,
  });
});

// ============================================
// DELETE COURSE (Admin only)
// ============================================
export const deleteCourse = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  if (!id) {
    throw new NotFoundError('Course ID is required');
  }

  // Check if course exists
  const course = await prisma.course.findFirst({
    where: { id },
    include: {
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
  });

  if (!course) {
    throw new NotFoundError('Course not found');
  }

  // Prevent deletion if course has enrollments
  if (course._count.enrollments > 0) {
    throw new ConflictError('Cannot delete course with active enrollments');
  }

  // Delete course (cascades to modules and lessons)
  await prisma.course.delete({
    where: { id },
  });

  logger.info(`Course deleted: ${id} by ${req.user!.email}`);

  // Send response
  res.status(200).json({
    success: true,
    message: 'Course deleted successfully',
  });
});

// ============================================
// ENROLL IN COURSE
// ============================================
export const enrollInCourse = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const { id: courseId } = req.params;
  const userId = req.user!.id;

  if (!courseId) {
    throw new NotFoundError('Course ID is required');
  }

  // Check if course exists
  const course = await prisma.course.findFirst({
    where: { id: courseId },
  });

  if (!course) {
    throw new NotFoundError('Course not found');
  }

  // Check if already enrolled
  const existingEnrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      courseId,
    },
  });

  if (existingEnrollment) {
    throw new ConflictError('You are already enrolled in this course');
  }

  // Create enrollment
  const enrollment = await prisma.enrollment.create({
    data: {
      userId,
      courseId,
      status: EnrollmentStatus.ACTIVE,
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
        },
      },
    },
  });

  logger.info(`User ${userId} enrolled in course ${courseId}`);

  // Send response
  res.status(201).json({
    success: true,
    message: 'Successfully enrolled in course',
    data: enrollment,
  });
});

// ============================================
// GET USER ENROLLMENTS
// ============================================
export const getUserEnrollments = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const userId = req.user!.id;
  const { status } = req.query;

  const where: any = { userId };
  
  if (status) {
    where.status = status;
  }

  const enrollments = await prisma.enrollment.findMany({
    where,
    include: {
      course: {
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              bio: true,
            },
          },
          _count: {
            select: {
              modules: true,
            },
          },
        },
      },
      progress: {
        select: {
          status: true,
        },
      },
    },
    orderBy: {
      enrolledAt: 'desc',
    },
  });

  // Send response
  res.status(200).json({
    success: true,
    data: enrollments,
  });
});

// ============================================
// UPDATE LESSON PROGRESS
// ============================================
export const updateLessonProgress = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const { courseId, lessonId } = req.params;
  const userId = req.user!.id;
  
  if (!courseId || !lessonId) {
    throw new NotFoundError('Course ID and Lesson ID are required');
  }
  
  // Validate input
  const validatedData = LessonProgressSchema.parse(req.body);

  // Check enrollment
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      courseId,
      status: EnrollmentStatus.ACTIVE,
    },
  });

  if (!enrollment) {
    throw new AuthorizationError('You are not enrolled in this course');
  }

  // Check if lesson exists
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      module: {
        courseId,
      },
    },
  });

  if (!lesson) {
    throw new NotFoundError('Lesson not found in this course');
  }

  // Update or create progress
  const progress = await prisma.progress.upsert({
    where: {
      enrollmentId_lessonId: {
        enrollmentId: enrollment.id,
        lessonId: lessonId,
      },
    },
    create: {
      enrollmentId: enrollment.id,
      lessonId: lessonId,
      userId: userId,
      status: validatedData.completed ? 'COMPLETED' : 'IN_PROGRESS',
      completedAt: validatedData.completed ? new Date() : null,
    },
    update: {
      status: validatedData.completed ? 'COMPLETED' : 'IN_PROGRESS',
      completedAt: validatedData.completed ? new Date() : null,
    },
  });

  // Calculate overall course progress
  const totalLessons = await prisma.lesson.count({
    where: {
      module: {
        courseId,
      },
    },
  });

  const completedLessons = await prisma.progress.count({
    where: {
      enrollmentId: enrollment.id,
      status: 'COMPLETED',
    },
  });

  const progressPercent = Math.round((completedLessons / totalLessons) * 100);

  // Update enrollment progress
  await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      progressPercent,
      lastAccessedAt: new Date(),
      ...(progressPercent === 100 && {
        status: EnrollmentStatus.COMPLETED,
        completedAt: new Date(),
      }),
    },
  });

  // Send response
  res.status(200).json({
    success: true,
    message: 'Progress updated successfully',
    data: {
      progress,
      isCompleted: progressPercent === 100,
    },
  });
});