/**
 * Course Controller
 * Handles course-related operations
 * @module apps/api/controllers/course
 */

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import {
  CourseCreateSchema,
  CourseUpdateSchema,
  EnrollmentCreateSchema,
  LessonProgressSchema,
} from '@aistudio555/types';
import {
  AppError,
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
  res: Response,
  next: NextFunction
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
    isPublished: true,
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
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true,
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
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      instructor: {
        select: {
          id: true,
          email: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
              bio: true,
            },
          },
        },
      },
      modules: {
        where: { isPublished: true },
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { order: 'asc' },
            select: {
              id: true,
              title: true,
              type: true,
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
  res: Response,
  next: NextFunction
) => {
  // Validate input
  const validatedData = CourseCreateSchema.parse(req.body);

  // Create course
  const course = await prisma.course.create({
    data: {
      ...validatedData,
      instructorId: req.user!.id,
      slug: validatedData.title.toLowerCase().replace(/\s+/g, '-'),
    },
    include: {
      instructor: {
        select: {
          id: true,
          email: true,
          profile: true,
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
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  
  // Validate input
  const validatedData = CourseUpdateSchema.parse(req.body);

  // Check if course exists
  const existingCourse = await prisma.course.findUnique({
    where: { id },
  });

  if (!existingCourse) {
    throw new NotFoundError('Course not found');
  }

  // Check authorization (only course owner or admin)
  if (
    req.user!.role !== 'ADMIN' &&
    existingCourse.instructorId !== req.user!.id
  ) {
    throw new AuthorizationError('You do not have permission to update this course');
  }

  // Update course
  const course = await prisma.course.update({
    where: { id },
    data: {
      ...validatedData,
      slug: validatedData.title
        ? validatedData.title.toLowerCase().replace(/\s+/g, '-')
        : undefined,
    },
    include: {
      instructor: {
        select: {
          id: true,
          email: true,
          profile: true,
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
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  // Check if course exists
  const course = await prisma.course.findUnique({
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
  res: Response,
  next: NextFunction
) => {
  const { id: courseId } = req.params;
  const userId = req.user!.id;

  // Check if course exists
  const course = await prisma.course.findUnique({
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
      status: 'ACTIVE',
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
  res: Response,
  next: NextFunction
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
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
          _count: {
            select: {
              lessons: true,
            },
          },
        },
      },
      progress: {
        select: {
          completedLessons: true,
          completionPercentage: true,
          lastAccessedAt: true,
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
  res: Response,
  next: NextFunction
) => {
  const { courseId, lessonId } = req.params;
  const userId = req.user!.id;
  
  // Validate input
  const validatedData = LessonProgressSchema.parse(req.body);

  // Check enrollment
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      courseId,
      status: 'ACTIVE',
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
  let progress = await prisma.progress.findFirst({
    where: {
      enrollmentId: enrollment.id,
    },
  });

  if (!progress) {
    progress = await prisma.progress.create({
      data: {
        enrollmentId: enrollment.id,
        completedLessons: [],
        completionPercentage: 0,
      },
    });
  }

  // Update completed lessons
  const completedLessons = progress.completedLessons as string[];
  
  if (validatedData.completed && !completedLessons.includes(lessonId)) {
    completedLessons.push(lessonId);
  } else if (!validatedData.completed && completedLessons.includes(lessonId)) {
    const index = completedLessons.indexOf(lessonId);
    completedLessons.splice(index, 1);
  }

  // Calculate completion percentage
  const totalLessons = await prisma.lesson.count({
    where: {
      module: {
        courseId,
      },
    },
  });

  const completionPercentage = Math.round(
    (completedLessons.length / totalLessons) * 100
  );

  // Update progress
  progress = await prisma.progress.update({
    where: { id: progress.id },
    data: {
      completedLessons,
      completionPercentage,
      lastAccessedAt: new Date(),
    },
  });

  // Update enrollment if course completed
  if (completionPercentage === 100) {
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });
  }

  // Send response
  res.status(200).json({
    success: true,
    message: 'Progress updated successfully',
    data: {
      progress,
      isCompleted: completionPercentage === 100,
    },
  });
});