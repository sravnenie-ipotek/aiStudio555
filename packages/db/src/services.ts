/**
 * Database Service Functions for Course Catalog API
 * Comprehensive CRUD operations with caching and performance optimization
 */

import { prisma } from './client';
import { 
  Prisma, 
  CourseStatus, 
  CourseLevel, 
  CourseFormat, 
  Locale 
} from '../node_modules/.prisma/client';

// ============================================
// COURSE SERVICES
// ============================================

export interface CourseFilters {
  // Pagination
  page?: number;
  limit?: number;
  
  // Filtering
  category?: string;
  level?: CourseLevel;
  format?: CourseFormat;
  language?: Locale;
  status?: CourseStatus;
  featured?: boolean;
  active?: boolean;
  
  // Price filtering
  priceMin?: number;
  priceMax?: number;
  
  // Search
  search?: string;
  
  // Sorting
  sort?: 'title' | 'price' | 'rating' | 'students' | 'date' | 'popularity';
  order?: 'asc' | 'desc';
  
  // Advanced filters
  instructor?: string;
  minRating?: number;
  
  // Date filters
  startDateFrom?: Date;
  startDateTo?: Date;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Course include options for efficient database queries
 */
const courseIncludeOptions = {
  category: {
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      icon: true,
      order: true,
    }
  },
  instructor: {
    select: {
      id: true,
      name: true,
      company: true,
      bio: true,
      avatarId: true,
      linkedin: true,
      website: true,
      avatar: {
        select: {
          id: true,
          url: true,
          filename: true,
          mimeType: true,
        }
      }
    }
  },
  _count: {
    select: {
      enrollments: {
        where: { status: 'ACTIVE' }
      },
      reviews: {
        where: { isPublished: true }
      }
    }
  }
} satisfies Prisma.CourseInclude;

/**
 * Get courses with advanced filtering, search, and pagination
 * @param filters - Query filters and options
 * @returns Paginated course results with metadata
 */
export async function getCourses(filters: CourseFilters = {}): Promise<PaginatedResult<any>> {
  const {
    page = 1,
    limit = 20,
    category,
    level,
    format,
    language,
    status = CourseStatus.PUBLISHED,
    featured,
    active = true,
    priceMin,
    priceMax,
    search,
    sort = 'date',
    order = 'desc',
    instructor,
    minRating,
    startDateFrom,
    startDateTo,
  } = filters;

  // Pagination calculation
  const skip = (page - 1) * limit;

  // Build where clause
  const where: Prisma.CourseWhereInput = {
    AND: [
      // Basic filters
      ...(active !== undefined ? [{ isActive: active }] : []),
      { status },
      ...(featured !== undefined ? [{ isFeatured: featured }] : []),
      
      // Category filter (slug or ID)
      ...(category ? [{
        OR: [
          { categoryId: category },
          { category: { slug: category } }
        ]
      }] : []),
      
      // Metadata filters
      ...(level ? [{ level }] : []),
      ...(format ? [{ format }] : []),
      ...(language ? [{ language }] : []),
      
      // Price range
      ...(priceMin !== undefined ? [{ price: { gte: priceMin } }] : []),
      ...(priceMax !== undefined ? [{ price: { lte: priceMax } }] : []),
      
      // Instructor filter
      ...(instructor ? [{
        OR: [
          { instructorId: instructor },
          { instructor: { name: { contains: instructor, mode: Prisma.QueryMode.insensitive } } }
        ]
      }] : []),
      
      // Rating filter
      ...(minRating ? [{ averageRating: { gte: minRating } }] : []),
      
      // Date filters
      ...(startDateFrom ? [{ nextStartDate: { gte: startDateFrom } }] : []),
      ...(startDateTo ? [{ nextStartDate: { lte: startDateTo } }] : []),
      
      // Search functionality
      ...(search ? [{
        OR: [
          // Search in JSON title fields
          {
            title: {
              path: ['en'],
              string_contains: search
            }
          },
          {
            title: {
              path: ['ru'], 
              string_contains: search
            }
          },
          {
            title: {
              path: ['he'],
              string_contains: search
            }
          },
          // Search in JSON description
          {
            description: {
              path: ['en'],
              string_contains: search
            }
          },
          // Search in instructor name
          {
            instructor: {
              name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive
              }
            }
          },
          // Search in category name
          {
            category: {
              name: {
                path: ['en'],
                string_contains: search
              }
            }
          }
        ]
      }] : [])
    ]
  };

  // Build order by clause
  const orderBy: Prisma.CourseOrderByWithRelationInput[] = [];
  
  switch (sort) {
    case 'title':
      orderBy.push({ title: order });
      break;
    case 'price':
      orderBy.push({ price: order });
      break;
    case 'rating':
      orderBy.push({ averageRating: order });
      break;
    case 'students':
      orderBy.push({ studentCount: order });
      break;
    case 'popularity':
      orderBy.push({ studentCount: order }, { averageRating: 'desc' });
      break;
    case 'date':
    default:
      orderBy.push({ publishedAt: order });
      break;
  }

  try {
    // Execute queries in parallel
    const [courses, totalCount] = await Promise.all([
      prisma.course.findMany({
        where,
        include: courseIncludeOptions,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.course.count({ where })
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data: courses,
      meta: {
        page,
        limit,
        total: totalCount,
        pages: totalPages,
        hasNext,
        hasPrev,
      }
    };
  } catch (error) {
    console.error('❌ Database error in getCourses:', error);
    throw new Error('Failed to fetch courses');
  }
}

/**
 * Get single course by slug with complete details
 * @param slug - Course slug
 * @returns Course with full details or null
 */
export async function getCourseBySlug(slug: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { 
        slug,
        isActive: true,
        status: CourseStatus.PUBLISHED
      },
      include: {
        ...courseIncludeOptions,
        modules: {
          include: {
            lessons: {
              select: {
                id: true,
                title: true,
                duration: true,
                order: true,
                videoUrl: true,
              },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        },
        reviews: {
          where: { isPublished: true },
          include: {
            user: {
              include: {
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatar: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10 // Latest 10 reviews
        },
        testimonials: {
          where: { isPublished: true },
          include: {
            avatar: {
              select: {
                url: true,
                filename: true
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    return course;
  } catch (error) {
    console.error('❌ Database error in getCourseBySlug:', error);
    throw new Error('Failed to fetch course');
  }
}

/**
 * Get featured courses for homepage
 * @param limit - Maximum number of featured courses
 * @returns Featured courses array
 */
export async function getFeaturedCourses(limit: number = 6) {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isFeatured: true,
        isActive: true,
        status: CourseStatus.PUBLISHED
      },
      include: courseIncludeOptions,
      orderBy: [
        { averageRating: 'desc' },
        { studentCount: 'desc' },
        { publishedAt: 'desc' }
      ],
      take: limit
    });

    return courses;
  } catch (error) {
    console.error('❌ Database error in getFeaturedCourses:', error);
    throw new Error('Failed to fetch featured courses');
  }
}

// ============================================
// CATEGORY SERVICES  
// ============================================

/**
 * Get all categories in hierarchical structure
 * @returns Categories with parent-child relationships
 */
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { 
        isActive: true,
        parentId: null // Only root categories
      },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            courses: {
              where: {
                isActive: true,
                status: CourseStatus.PUBLISHED
              }
            }
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    return categories;
  } catch (error) {
    console.error('❌ Database error in getCategories:', error);
    throw new Error('Failed to fetch categories');
  }
}

/**
 * Get category by slug with course count
 * @param slug - Category slug
 * @returns Category details or null
 */
export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        parent: {
          select: {
            id: true,
            slug: true,
            name: true
          }
        },
        children: {
          where: { isActive: true },
          select: {
            id: true,
            slug: true,
            name: true,
            icon: true,
            _count: {
              select: {
                courses: {
                  where: {
                    isActive: true,
                    status: CourseStatus.PUBLISHED
                  }
                }
              }
            }
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            courses: {
              where: {
                isActive: true,
                status: CourseStatus.PUBLISHED
              }
            }
          }
        }
      }
    });

    return category;
  } catch (error) {
    console.error('❌ Database error in getCategoryBySlug:', error);
    throw new Error('Failed to fetch category');
  }
}

// ============================================
// INSTRUCTOR SERVICES
// ============================================

/**
 * Get instructor by ID with courses
 * @param instructorId - Instructor ID
 * @returns Instructor with course data
 */
export async function getInstructorById(instructorId: string) {
  try {
    const instructor = await prisma.instructor.findUnique({
      where: { id: instructorId },
      include: {
        avatar: {
          select: {
            url: true,
            filename: true
          }
        },
        courses: {
          where: {
            isActive: true,
            status: CourseStatus.PUBLISHED
          },
          include: courseIncludeOptions,
          orderBy: { publishedAt: 'desc' }
        }
      }
    });

    return instructor;
  } catch (error) {
    console.error('❌ Database error in getInstructorById:', error);
    throw new Error('Failed to fetch instructor');
  }
}

// ============================================
// ANALYTICS SERVICES
// ============================================

/**
 * Get course analytics summary
 * @returns Basic analytics for dashboard
 */
export async function getCourseAnalytics() {
  try {
    const [
      totalCourses,
      activeCourses,
      totalEnrollments,
      avgRating
    ] = await Promise.all([
      prisma.course.count(),
      prisma.course.count({
        where: {
          isActive: true,
          status: CourseStatus.PUBLISHED
        }
      }),
      prisma.enrollment.count({
        where: { status: 'ACTIVE' }
      }),
      prisma.course.aggregate({
        where: {
          averageRating: { not: null },
          isActive: true,
          status: CourseStatus.PUBLISHED
        },
        _avg: {
          averageRating: true
        }
      })
    ]);

    return {
      totalCourses,
      activeCourses,
      totalEnrollments,
      averageRating: avgRating._avg.averageRating || 0
    };
  } catch (error) {
    console.error('❌ Database error in getCourseAnalytics:', error);
    throw new Error('Failed to fetch course analytics');
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Build HATEOAS links for pagination
 * @param baseUrl - Base API endpoint URL
 * @param page - Current page
 * @param limit - Items per page
 * @param total - Total items
 * @param queryParams - Additional query parameters
 * @returns HATEOAS navigation links
 */
export function buildPaginationLinks(
  baseUrl: string,
  page: number,
  limit: number,
  total: number,
  queryParams: Record<string, any> = {}
) {
  const totalPages = Math.ceil(total / limit);
  const query = new URLSearchParams(queryParams).toString();
  const queryString = query ? `&${query}` : '';

  return {
    self: `${baseUrl}?page=${page}&limit=${limit}${queryString}`,
    first: `${baseUrl}?page=1&limit=${limit}${queryString}`,
    last: `${baseUrl}?page=${totalPages}&limit=${limit}${queryString}`,
    next: page < totalPages 
      ? `${baseUrl}?page=${page + 1}&limit=${limit}${queryString}` 
      : null,
    prev: page > 1 
      ? `${baseUrl}?page=${page - 1}&limit=${limit}${queryString}` 
      : null
  };
}

/**
 * Validate and sanitize course query parameters
 * @param params - Raw query parameters
 * @returns Validated and typed parameters
 */
export function validateCourseParams(params: Record<string, any>): CourseFilters {
  const {
    page = '1',
    limit = '20',
    category,
    level,
    format,
    language,
    status,
    featured,
    active,
    priceMin,
    priceMax,
    search,
    sort = 'date',
    order = 'desc',
    instructor,
    minRating,
    startDateFrom,
    startDateTo,
  } = params;

  // Sanitize and validate
  return {
    page: Math.max(1, parseInt(page) || 1),
    limit: Math.min(100, Math.max(1, parseInt(limit) || 20)),
    category: category?.toString().trim(),
    level: Object.values(CourseLevel).includes(level) ? level : undefined,
    format: Object.values(CourseFormat).includes(format) ? format : undefined,
    language: Object.values(Locale).includes(language) ? language : undefined,
    status: Object.values(CourseStatus).includes(status) ? status : CourseStatus.PUBLISHED,
    ...(featured !== undefined ? { featured: featured === 'true' } : {}),
    active: active !== undefined ? active === 'true' : true,
    ...(priceMin ? { priceMin: parseFloat(priceMin) } : {}),
    ...(priceMax ? { priceMax: parseFloat(priceMax) } : {}),
    search: search?.toString().trim().slice(0, 100), // Limit search length
    sort: ['title', 'price', 'rating', 'students', 'date', 'popularity'].includes(sort) 
      ? sort as any : 'date',
    order: ['asc', 'desc'].includes(order) ? order as any : 'desc',
    ...(instructor ? { instructor: instructor.toString().trim() } : {}),
    ...(minRating ? { minRating: Math.max(0, Math.min(5, parseFloat(minRating))) } : {}),
    ...(startDateFrom ? { startDateFrom: new Date(startDateFrom) } : {}),
    ...(startDateTo ? { startDateTo: new Date(startDateTo) } : {}),
  };
}