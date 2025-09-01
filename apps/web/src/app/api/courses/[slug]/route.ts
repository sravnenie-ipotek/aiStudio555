/**
 * GET /api/courses/[slug] - Single Course Details API
 * 
 * Features:
 * - Complete course details with modules and lessons
 * - Instructor information with avatar
 * - Course reviews and testimonials
 * - Multi-language content support
 * - Performance optimization with selective data loading
 * - Comprehensive error handling
 * - SEO-friendly meta information
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCourseBySlug } from '@aistudio555/db';
import { CourseDetailResponse } from '@aistudio555/types';

interface RouteParams {
  params: {
    slug: string;
  };
}

/**
 * GET /api/courses/[slug]
 * 
 * @description Get detailed information for a single course by slug
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing course slug
 * @returns Complete course details with modules, instructor, reviews
 * 
 * @example
 * GET /api/courses/ai-transformation-manager
 * GET /api/courses/no-code-website-development
 * GET /api/courses/ai-video-avatar-generation
 * 
 * @throws {404} Course not found or inactive
 * @throws {500} Database or server error
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<CourseDetailResponse | { success: false; error: any }>> {
  try {
    const { slug } = params;
    
    // Validate slug parameter
    if (!slug || typeof slug !== 'string' || slug.length < 1) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_SLUG',
            message: 'Course slug is required and must be a non-empty string',
            details: { providedSlug: slug },
            timestamp: new Date().toISOString(),
          }
        },
        { status: 400 }
      );
    }
    
    // Sanitize slug (prevent injection attempts)
    const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📚 Course Detail API Request:', {
        slug: sanitizedSlug,
        originalSlug: slug,
        timestamp: new Date().toISOString()
      });
    }
    
    // Fetch course by slug
    const course = await getCourseBySlug(sanitizedSlug);
    
    // Check if course exists and is available
    if (!course) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'COURSE_NOT_FOUND',
            message: `Course with slug '${sanitizedSlug}' not found or is not available`,
            details: { 
              slug: sanitizedSlug,
              suggestion: 'Check the course slug or verify if the course is published and active'
            },
            timestamp: new Date().toISOString(),
          }
        },
        { status: 404 }
      );
    }
    
    // Transform course data for API response
    const transformedCourse = {
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      shortDescription: course.shortDescription,
      
      // Images and media
      thumbnail: course.thumbnail,
      heroImage: course.heroImage,
      thumbnailImage: course.thumbnailImage,
      ogImage: course.ogImage,
      
      // Marketing content
      keyBenefits: course.keyBenefits,
      targetAudience: course.targetAudience,
      careerOutcomes: course.careerOutcomes,
      skillsLearned: course.skillsLearned,
      features: course.features,
      
      // Course format and platform
      format: course.format,
      platform: course.platform,
      
      // Pricing information
      price: parseFloat(course.price.toString()),
      currency: course.currency,
      discountPrice: course.discountPrice ? parseFloat(course.discountPrice.toString()) : null,
      paymentPlans: course.paymentPlans,
      
      // Duration structure
      duration: course.duration,
      durationWeeks: course.durationWeeks,
      hoursPerWeek: course.hoursPerWeek,
      totalHours: course.totalHours,
      
      // Computed metrics
      studentCount: course.studentCount,
      averageRating: course.averageRating,
      completionRate: course.completionRate,
      
      // Enrollment & scheduling
      nextStartDate: course.nextStartDate?.toISOString(),
      enrollmentDeadline: course.enrollmentDeadline?.toISOString(),
      maxStudents: course.maxStudents,
      minStudents: course.minStudents,
      
      // Course metadata
      level: course.level,
      language: course.language,
      difficulty: course.difficulty,
      
      // Category details
      category: {
        id: course.category.id,
        slug: course.category.slug,
        name: course.category.name,
        description: course.category.description,
        icon: course.category.icon,
        order: course.category.order
      },
      
      // Detailed instructor information
      instructor: {
        id: course.instructor.id,
        name: course.instructor.name,
        company: course.instructor.company,
        bio: course.instructor.bio,
        linkedin: course.instructor.linkedin,
        website: course.instructor.website,
        avatar: course.instructor.avatar ? {
          id: course.instructor.avatar.id,
          url: course.instructor.avatar.url,
          filename: course.instructor.avatar.filename,
          mimeType: course.instructor.avatar.mimeType,
        } : null,
        locale: course.instructor.locale,
      },
      
      // Course structure with modules and lessons
      modules: course.modules.map(module => ({
        id: module.id,
        title: module.title,
        description: module.description,
        order: module.order,
        lessons: module.lessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          order: lesson.order,
          videoUrl: lesson.videoUrl, // Note: might need access control in production
        })),
        createdAt: module.createdAt.toISOString(),
        updatedAt: module.updatedAt.toISOString(),
      })),
      
      // Course reviews
      reviews: course.reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        title: review.title,
        content: review.content,
        isVerified: review.isVerified,
        createdAt: review.createdAt.toISOString(),
        user: {
          firstName: review.user.profile?.firstName || 'Anonymous',
          lastName: review.user.profile?.lastName || '',
          avatar: review.user.profile?.avatar || null,
        }
      })),
      
      // Course testimonials
      testimonials: course.testimonials.map(testimonial => ({
        id: testimonial.id,
        studentName: testimonial.studentName,
        quote: testimonial.quote,
        order: testimonial.order,
        avatar: testimonial.avatar ? {
          url: testimonial.avatar.url,
          filename: testimonial.avatar.filename,
        } : null,
        createdAt: testimonial.createdAt.toISOString(),
      })),
      
      // Enrollment counts
      enrollmentCount: course._count?.enrollments || 0,
      reviewCount: course._count?.reviews || 0,
      
      // Publishing information
      status: course.status,
      publishedAt: course.publishedAt?.toISOString(),
      isActive: course.isActive,
      isFeatured: course.isFeatured,
      
      // SEO metadata
      metaTitle: course.metaTitle,
      metaDescription: course.metaDescription,
      keywords: course.keywords,
      
      // Timestamps
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
    };
    
    // Build successful response
    const response: CourseDetailResponse = {
      success: true,
      data: transformedCourse
    };
    
    // Set performance and caching headers
    const nextResponse = NextResponse.json(response);
    nextResponse.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600');
    nextResponse.headers.set('X-Course-ID', course.id);
    nextResponse.headers.set('X-Last-Modified', course.updatedAt.toISOString());
    
    // SEO headers
    if (course.metaTitle) {
      nextResponse.headers.set('X-Meta-Title', course.metaTitle);
    }
    if (course.metaDescription) {
      nextResponse.headers.set('X-Meta-Description', course.metaDescription);
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Course Detail API Response:', {
        courseId: course.id,
        slug: course.slug,
        modulesCount: course.modules.length,
        reviewsCount: course.reviews.length,
        testimonialsCount: course.testimonials.length,
      });
    }
    
    return nextResponse;
    
  } catch (error) {
    console.error('❌ Course Detail API Error:', error);
    
    // Determine error type and status
    let statusCode = 500;
    let errorMessage = 'Internal server error';
    let errorCode = 'INTERNAL_ERROR';
    
    if (error instanceof Error) {
      // Handle database connection errors
      if (error.message.includes('database') || error.message.includes('connection')) {
        statusCode = 503;
        errorMessage = 'Database temporarily unavailable';
        errorCode = 'DATABASE_ERROR';
      }
      // Handle timeout errors
      else if (error.message.includes('timeout')) {
        statusCode = 504;
        errorMessage = 'Request timeout';
        errorCode = 'TIMEOUT_ERROR';
      }
    }
    
    const errorResponse = {
      success: false as const,
      error: {
        code: errorCode,
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? {
          originalError: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        } : {},
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      }
    };
    
    const nextResponse = NextResponse.json(errorResponse, { status: statusCode });
    nextResponse.headers.set('Cache-Control', 'no-cache');
    
    return nextResponse;
  }
}

/**
 * Only allow GET requests
 */
export async function POST() {
  return NextResponse.json(
    { 
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'POST method not allowed on this endpoint',
        allowed: ['GET']
      }
    },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { 
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'PUT method not allowed on this endpoint',
        allowed: ['GET']
      }
    },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { 
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'DELETE method not allowed on this endpoint',
        allowed: ['GET']
      }
    },
    { status: 405 }
  );
}