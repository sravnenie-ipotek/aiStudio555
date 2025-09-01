/**
 * GET /api/courses - Comprehensive Course Catalog API
 * 
 * Features:
 * - Advanced filtering (category, level, format, price range)
 * - Full-text search across multiple fields
 * - Pagination with HATEOAS links
 * - Multi-language support
 * - Performance optimization with indexes
 * - Comprehensive error handling
 * - OpenAPI-compliant responses
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  getCourses, 
  validateCourseParams, 
  buildPaginationLinks,
  type CourseFilters 
} from '@aistudio555/db';
import { 
  CoursesListResponse,
  CoursesQueryParams
} from '@aistudio555/types';

/**
 * GET /api/courses
 * 
 * @description List courses with advanced filtering, search, and pagination
 * 
 * @param request - Next.js request object with query parameters
 * @returns Paginated course list with metadata and HATEOAS links
 * 
 * @example
 * GET /api/courses?category=ai-transformation&level=BEGINNER&page=1&limit=12
 * GET /api/courses?search=AI&sort=popularity&order=desc
 * GET /api/courses?priceMin=500&priceMax=1500&featured=true
 * 
 * @throws {400} Invalid query parameters
 * @throws {500} Database or server error
 */
export async function GET(request: NextRequest): Promise<NextResponse<CoursesListResponse | { success: false; error: any }>> {
  try {
    // Extract and validate query parameters
    const { searchParams } = new URL(request.url);
    const rawParams = Object.fromEntries(searchParams.entries());
    
    // Validate and sanitize parameters
    const validatedParams: CourseFilters = validateCourseParams(rawParams);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📚 Course API Request:', {
        params: validatedParams,
        timestamp: new Date().toISOString()
      });
    }
    
    // Fetch courses with validated parameters
    const result = await getCourses(validatedParams);
    
    // Build HATEOAS pagination links
    const baseUrl = `${request.nextUrl.origin}/api/courses`;
    const links = buildPaginationLinks(
      baseUrl,
      result.meta.page,
      result.meta.limit,
      result.meta.total,
      rawParams
    );
    
    // Transform data for API response
    const transformedCourses = result.data.map(course => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      shortDescription: course.shortDescription,
      
      // Images
      thumbnail: course.thumbnail,
      heroImage: course.heroImage,
      thumbnailImage: course.thumbnailImage,
      
      // Marketing content
      keyBenefits: course.keyBenefits,
      targetAudience: course.targetAudience,
      careerOutcomes: course.careerOutcomes,
      skillsLearned: course.skillsLearned,
      features: course.features,
      
      // Course details
      format: course.format,
      platform: course.platform,
      
      // Pricing
      price: parseFloat(course.price.toString()),
      currency: course.currency,
      discountPrice: course.discountPrice ? parseFloat(course.discountPrice.toString()) : null,
      paymentPlans: course.paymentPlans,
      
      // Duration
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
      
      // Metadata
      level: course.level,
      language: course.language,
      difficulty: course.difficulty,
      
      // Relations (simplified for list view)
      category: {
        id: course.category.id,
        slug: course.category.slug,
        name: course.category.name,
        icon: course.category.icon
      },
      instructor: {
        id: course.instructor.id,
        name: course.instructor.name,
        company: course.instructor.company,
        avatar: course.instructor.avatar ? {
          url: course.instructor.avatar.url,
          filename: course.instructor.avatar.filename
        } : null
      },
      
      // Counts from database
      enrollmentCount: course._count?.enrollments || 0,
      reviewCount: course._count?.reviews || 0,
      
      // Publishing status
      status: course.status,
      publishedAt: course.publishedAt?.toISOString(),
      isActive: course.isActive,
      isFeatured: course.isFeatured,
      
      // SEO
      metaTitle: course.metaTitle,
      metaDescription: course.metaDescription,
      keywords: course.keywords,
      
      // Timestamps
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
    }));
    
    // Build successful response
    const response: CoursesListResponse = {
      success: true,
      data: transformedCourses,
      meta: {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        pages: result.meta.pages,
        hasNext: result.meta.hasNext,
        hasPrev: result.meta.hasPrev,
      },
      links
    };
    
    // Set performance headers
    const nextResponse = NextResponse.json(response);
    nextResponse.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    nextResponse.headers.set('X-Total-Count', result.meta.total.toString());
    nextResponse.headers.set('X-Page-Count', result.meta.pages.toString());
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Course API Response:', {
        count: transformedCourses.length,
        total: result.meta.total,
        page: result.meta.page,
        pages: result.meta.pages
      });
    }
    
    return nextResponse;
    
  } catch (error) {
    console.error('❌ Course API Error:', error);
    
    // Determine error type and status
    let statusCode = 500;
    let errorMessage = 'Internal server error';
    let errorCode = 'INTERNAL_ERROR';
    
    if (error instanceof Error) {
      // Handle validation errors
      if (error.message.includes('Invalid') || error.message.includes('validation')) {
        statusCode = 400;
        errorMessage = error.message;
        errorCode = 'VALIDATION_ERROR';
      }
      // Handle database connection errors
      else if (error.message.includes('database') || error.message.includes('connection')) {
        statusCode = 503;
        errorMessage = 'Database temporarily unavailable';
        errorCode = 'DATABASE_ERROR';
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