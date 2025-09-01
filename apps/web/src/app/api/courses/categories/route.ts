/**
 * GET /api/courses/categories - Course Categories API
 * 
 * Features:
 * - Hierarchical category structure with parent-child relationships
 * - Course count for each category
 * - Multi-language category names and descriptions
 * - Active category filtering
 * - Optimized database queries
 * - Comprehensive error handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCategories } from '@aistudio555/db';
import { CategoriesListResponse } from '@aistudio555/types';

/**
 * GET /api/courses/categories
 * 
 * @description Get all active course categories in hierarchical structure
 * 
 * @param request - Next.js request object
 * @returns Hierarchical list of categories with course counts
 * 
 * @example
 * GET /api/courses/categories
 * 
 * Response structure:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "cat1",
 *       "slug": "ai-transformation",
 *       "name": { "en": "AI Transformation", "ru": "AI Трансформация" },
 *       "children": [...],
 *       "courseCount": 5
 *     }
 *   ]
 * }
 * 
 * @throws {500} Database or server error
 */
export async function GET(request: NextRequest): Promise<NextResponse<CategoriesListResponse | { success: false; error: any }>> {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('📂 Categories API Request:', {
        timestamp: new Date().toISOString()
      });
    }
    
    // Fetch categories with hierarchical structure
    const categories = await getCategories();
    
    // Transform categories data for API response
    const transformedCategories = categories.map(category => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description,
      icon: category.icon,
      order: category.order,
      
      // Parent information (should be null for root categories)
      parentId: category.parentId,
      
      // Child categories
      children: category.children.map(child => ({
        id: child.id,
        slug: child.slug,
        name: child.name,
        description: null, // Don't include description for children in this view
        icon: child.icon,
        order: child.order,
        parentId: child.parentId,
        children: [], // Don't include nested children in this API
        courseCount: child._count?.courses || 0,
        isActive: child.isActive,
        createdAt: child.createdAt.toISOString(),
        updatedAt: child.updatedAt.toISOString(),
      })),
      
      // Course count for this category
      courseCount: category._count?.courses || 0,
      
      // Status
      isActive: category.isActive,
      
      // Timestamps
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }));
    
    // Build successful response
    const response: CategoriesListResponse = {
      success: true,
      data: transformedCategories
    };
    
    // Set performance headers
    const nextResponse = NextResponse.json(response);
    nextResponse.headers.set('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600'); // Cache for 30 minutes
    nextResponse.headers.set('X-Total-Categories', categories.length.toString());
    
    // Calculate total course count across all categories
    const totalCourseCount = categories.reduce((sum, category) => {
      const categoryCount = category._count?.courses || 0;
      const childrenCount = category.children.reduce((childSum, child) => 
        childSum + (child._count?.courses || 0), 0
      );
      return sum + categoryCount + childrenCount;
    }, 0);
    
    nextResponse.headers.set('X-Total-Courses', totalCourseCount.toString());
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Categories API Response:', {
        categoriesCount: categories.length,
        totalCourseCount,
        hasChildren: categories.some(cat => cat.children.length > 0),
      });
    }
    
    return nextResponse;
    
  } catch (error) {
    console.error('❌ Categories API Error:', error);
    
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