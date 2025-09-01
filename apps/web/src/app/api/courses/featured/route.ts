/**
 * GET /api/courses/featured - Featured Courses API
 * 
 * Features:
 * - Curated featured courses for homepage display
 * - High-performance queries optimized for landing pages
 * - Smart sorting by rating and popularity
 * - Configurable limit with reasonable defaults
 * - Comprehensive course information for marketing
 * - Aggressive caching for performance
 */

import { NextRequest, NextResponse } from 'next/server';
import { getFeaturedCourses } from '@aistudio555/db';
import { FeaturedCoursesResponse } from '@aistudio555/types';

/**
 * GET /api/courses/featured
 * 
 * @description Get featured courses optimized for homepage display
 * 
 * @param request - Next.js request object with optional query parameters
 * @returns List of featured courses sorted by rating and popularity
 * 
 * @query {number} limit - Maximum number of featured courses (default: 6, max: 12)
 * 
 * @example
 * GET /api/courses/featured
 * GET /api/courses/featured?limit=3
 * 
 * Response structure:
 * {
 *   "success": true,
 *   "data": [...courses],
 *   "meta": {
 *     "total": 6
 *   }
 * }
 * 
 * @throws {400} Invalid limit parameter
 * @throws {500} Database or server error
 */
export async function GET(request: NextRequest): Promise<NextResponse<FeaturedCoursesResponse | { success: false; error: any }>> {
  try {
    // Extract and validate query parameters
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    
    // Validate and sanitize limit parameter
    let limit = 6; // Default limit
    if (limitParam) {
      const parsedLimit = parseInt(limitParam);
      if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 12) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_LIMIT',
              message: 'Limit parameter must be a number between 1 and 12',
              details: { 
                providedLimit: limitParam,
                allowedRange: '1-12',
                defaultValue: 6 
              },
              timestamp: new Date().toISOString(),
            }
          },
          { status: 400 }
        );
      }
      limit = parsedLimit;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('⭐ Featured Courses API Request:', {
        limit,
        timestamp: new Date().toISOString()
      });
    }
    
    // Fetch featured courses
    const courses = await getFeaturedCourses(limit);
    
    // Transform courses data for API response
    const transformedCourses = courses.map(course => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      shortDescription: course.shortDescription,
      
      // Images optimized for homepage display
      thumbnail: course.thumbnail,
      heroImage: course.heroImage,
      thumbnailImage: course.thumbnailImage,
      
      // Key marketing content for homepage
      keyBenefits: course.keyBenefits.slice(0, 3), // Limit for homepage display
      targetAudience: course.targetAudience.slice(0, 2),
      careerOutcomes: course.careerOutcomes.slice(0, 3),
      skillsLearned: course.skillsLearned.slice(0, 5),
      features: course.features.slice(0, 4), // Top 4 features
      
      // Course essentials
      format: course.format,
      platform: course.platform,
      
      // Pricing (key for conversion)
      price: parseFloat(course.price.toString()),
      currency: course.currency,
      discountPrice: course.discountPrice ? parseFloat(course.discountPrice.toString()) : null,
      
      // Duration for quick overview
      duration: course.duration,
      durationWeeks: course.durationWeeks,
      hoursPerWeek: course.hoursPerWeek,
      totalHours: course.totalHours,
      
      // Social proof metrics
      studentCount: course.studentCount,
      averageRating: course.averageRating,
      completionRate: course.completionRate,
      
      // Enrollment information
      nextStartDate: course.nextStartDate?.toISOString(),
      enrollmentDeadline: course.enrollmentDeadline?.toISOString(),
      maxStudents: course.maxStudents,
      
      // Course level and difficulty
      level: course.level,
      language: course.language,
      difficulty: course.difficulty,
      
      // Category for filtering/navigation
      category: {
        id: course.category.id,
        slug: course.category.slug,
        name: course.category.name,
        icon: course.category.icon
      },
      
      // Instructor for credibility
      instructor: {
        id: course.instructor.id,
        name: course.instructor.name,
        company: course.instructor.company,
        avatar: course.instructor.avatar ? {
          url: course.instructor.avatar.url,
          filename: course.instructor.avatar.filename
        } : null
      },
      
      // Social proof counts
      enrollmentCount: course._count?.enrollments || 0,
      reviewCount: course._count?.reviews || 0,
      
      // Publishing status
      status: course.status,
      publishedAt: course.publishedAt?.toISOString(),
      isActive: course.isActive,
      isFeatured: course.isFeatured,
      
      // SEO for social sharing
      metaTitle: course.metaTitle,
      metaDescription: course.metaDescription,
      keywords: course.keywords.slice(0, 5), // Top keywords only
      
      // Timestamps
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
    }));
    
    // Build successful response
    const response: FeaturedCoursesResponse = {
      success: true,
      data: transformedCourses,
      meta: {
        total: transformedCourses.length
      }
    };
    
    // Set aggressive caching for featured courses (they don't change often)
    const nextResponse = NextResponse.json(response);
    nextResponse.headers.set('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=7200'); // 30 min cache, 2hr stale
    nextResponse.headers.set('X-Featured-Count', transformedCourses.length.toString());
    nextResponse.headers.set('X-Requested-Limit', limit.toString());
    
    // Performance monitoring headers
    if (transformedCourses.length > 0) {
      const avgRating = transformedCourses.reduce((sum, course) => 
        sum + (course.averageRating || 0), 0) / transformedCourses.length;
      const totalStudents = transformedCourses.reduce((sum, course) => 
        sum + course.studentCount, 0);
      
      nextResponse.headers.set('X-Avg-Rating', avgRating.toFixed(2));
      nextResponse.headers.set('X-Total-Students', totalStudents.toString());
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Featured Courses API Response:', {
        featuredCount: transformedCourses.length,
        requestedLimit: limit,
        averageRating: transformedCourses.reduce((sum, course) => 
          sum + (course.averageRating || 0), 0) / transformedCourses.length || 0,
        totalStudents: transformedCourses.reduce((sum, course) => 
          sum + course.studentCount, 0),
      });
    }
    
    return nextResponse;
    
  } catch (error) {
    console.error('❌ Featured Courses API Error:', error);
    
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