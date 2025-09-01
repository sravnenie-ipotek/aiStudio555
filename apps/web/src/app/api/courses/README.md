# Course Catalog API Documentation

🔷 **[API ARCHITECT]** - Production-ready course catalog endpoints with comprehensive features.

## Overview

The Course Catalog API provides comprehensive endpoints for managing and displaying educational courses. Built with Next.js 14.1.0 App Router, TypeScript, and Prisma ORM, it offers advanced filtering, search, pagination, and multi-language support.

## Base URL

```
https://projectdes-academy.com/api/courses
```

## Authentication

Currently, all endpoints are public (read-only). Future versions will include authentication for course management endpoints.

## Endpoints

### 1. List Courses

**`GET /api/courses`**

Retrieve paginated course catalog with advanced filtering and search capabilities.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | `number` | `1` | Page number (min: 1) |
| `limit` | `number` | `20` | Items per page (min: 1, max: 100) |
| `category` | `string` | - | Category slug or ID |
| `level` | `CourseLevel` | - | Course difficulty level |
| `format` | `CourseFormat` | - | Course delivery format |
| `language` | `Locale` | - | Course language |
| `featured` | `boolean` | - | Featured courses only |
| `active` | `boolean` | `true` | Active courses only |
| `priceMin` | `number` | - | Minimum price filter |
| `priceMax` | `number` | - | Maximum price filter |
| `search` | `string` | - | Search in title, description, instructor |
| `sort` | `string` | `date` | Sort by: title, price, rating, students, popularity |
| `order` | `string` | `desc` | Sort order: asc, desc |
| `instructor` | `string` | - | Instructor name or ID |
| `minRating` | `number` | - | Minimum average rating (1-5) |

#### Example Requests

```bash
# Basic course listing
GET /api/courses

# Search for AI courses
GET /api/courses?search=AI&sort=popularity&order=desc

# Filter by category and level
GET /api/courses?category=ai-transformation&level=BEGINNER&limit=12

# Price range filtering
GET /api/courses?priceMin=500&priceMax=1500&featured=true
```

#### Response Format

```json
{
  "success": true,
  "data": [
    {
      "id": "course-uuid",
      "slug": "ai-transformation-manager",
      "title": {
        "en": "AI Transformation Manager",
        "ru": "Менеджер по AI трансформации",
        "he": "מנהל טרנספורמציה AI"
      },
      "description": { /* Multi-language content */ },
      "shortDescription": { /* Brief description */ },
      "thumbnail": "https://cdn.example.com/course-thumb.jpg",
      "heroImage": "https://cdn.example.com/course-hero.jpg",
      "keyBenefits": ["Skill 1", "Skill 2", "Skill 3"],
      "targetAudience": ["Professionals", "Managers"],
      "careerOutcomes": ["AI Manager", "Digital Transformation Lead"],
      "skillsLearned": ["Machine Learning", "AI Strategy"],
      "features": [
        {
          "name": "Live Sessions",
          "description": "Interactive live sessions with experts",
          "icon": "video-icon"
        }
      ],
      "format": "ONLINE",
      "platform": "Zoom + Custom LMS",
      "price": 1299.00,
      "currency": "USD",
      "discountPrice": 999.00,
      "paymentPlans": [
        {
          "id": "plan-1",
          "name": "3-Month Plan",
          "installments": 3,
          "price": 433.00,
          "interval": "month"
        }
      ],
      "duration": 120,
      "durationWeeks": 16,
      "hoursPerWeek": 8,
      "totalHours": 128,
      "studentCount": 1247,
      "averageRating": 4.8,
      "completionRate": 89.5,
      "nextStartDate": "2024-02-01T00:00:00.000Z",
      "enrollmentDeadline": "2024-01-25T23:59:59.000Z",
      "maxStudents": 50,
      "level": "INTERMEDIATE",
      "language": "EN",
      "difficulty": 3,
      "category": {
        "id": "cat-uuid",
        "slug": "ai-transformation",
        "name": { "en": "AI Transformation" },
        "icon": "ai-icon"
      },
      "instructor": {
        "id": "instructor-uuid",
        "name": "Dr. Sarah Johnson",
        "company": "AI Institute",
        "avatar": {
          "url": "https://cdn.example.com/instructor.jpg",
          "filename": "sarah-johnson.jpg"
        }
      },
      "enrollmentCount": 1247,
      "reviewCount": 89,
      "status": "PUBLISHED",
      "publishedAt": "2023-12-01T00:00:00.000Z",
      "isActive": true,
      "isFeatured": true,
      "metaTitle": "AI Transformation Manager Course",
      "metaDescription": "Master AI transformation...",
      "keywords": ["ai", "transformation", "management"],
      "createdAt": "2023-11-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "links": {
    "self": "/api/courses?page=1&limit=20",
    "first": "/api/courses?page=1&limit=20",
    "last": "/api/courses?page=8&limit=20",
    "next": "/api/courses?page=2&limit=20",
    "prev": null
  }
}
```

### 2. Get Course Details

**`GET /api/courses/{slug}`**

Retrieve detailed information for a specific course including modules, lessons, reviews, and testimonials.

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | `string` | Course slug identifier |

#### Example Request

```bash
GET /api/courses/ai-transformation-manager
```

#### Response Format

```json
{
  "success": true,
  "data": {
    // All fields from list endpoint plus:
    "modules": [
      {
        "id": "module-uuid",
        "title": { "en": "Introduction to AI" },
        "description": { "en": "Learn AI basics" },
        "order": 1,
        "lessons": [
          {
            "id": "lesson-uuid",
            "title": { "en": "What is AI?" },
            "description": { "en": "Overview of AI" },
            "duration": 45,
            "order": 1,
            "videoUrl": "https://vimeo.com/example"
          }
        ],
        "createdAt": "2023-11-01T00:00:00.000Z",
        "updatedAt": "2023-11-01T00:00:00.000Z"
      }
    ],
    "reviews": [
      {
        "id": "review-uuid",
        "rating": 5,
        "title": "Excellent course!",
        "content": "Learned so much...",
        "isVerified": true,
        "createdAt": "2023-12-15T00:00:00.000Z",
        "user": {
          "firstName": "John",
          "lastName": "D.",
          "avatar": "https://cdn.example.com/avatar.jpg"
        }
      }
    ],
    "testimonials": [
      {
        "id": "testimonial-uuid",
        "studentName": "Maria Rodriguez",
        "quote": "This course changed my career!",
        "order": 1,
        "avatar": {
          "url": "https://cdn.example.com/testimonial.jpg",
          "filename": "maria.jpg"
        },
        "createdAt": "2023-12-01T00:00:00.000Z"
      }
    ]
  }
}
```

### 3. Get Categories

**`GET /api/courses/categories`**

Retrieve hierarchical category structure with course counts.

#### Example Request

```bash
GET /api/courses/categories
```

#### Response Format

```json
{
  "success": true,
  "data": [
    {
      "id": "category-uuid",
      "slug": "ai-transformation",
      "name": {
        "en": "AI Transformation",
        "ru": "AI Трансформация",
        "he": "טרנספורמציה AI"
      },
      "description": {
        "en": "Courses on AI transformation strategies"
      },
      "icon": "ai-brain-icon",
      "order": 1,
      "parentId": null,
      "children": [
        {
          "id": "child-category-uuid",
          "slug": "ai-strategy",
          "name": { "en": "AI Strategy" },
          "icon": "strategy-icon",
          "order": 1,
          "parentId": "category-uuid",
          "children": [],
          "courseCount": 3,
          "isActive": true,
          "createdAt": "2023-11-01T00:00:00.000Z",
          "updatedAt": "2023-11-01T00:00:00.000Z"
        }
      ],
      "courseCount": 12,
      "isActive": true,
      "createdAt": "2023-11-01T00:00:00.000Z",
      "updatedAt": "2023-11-01T00:00:00.000Z"
    }
  ]
}
```

### 4. Get Featured Courses

**`GET /api/courses/featured`**

Retrieve curated featured courses optimized for homepage display.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | `number` | `6` | Max featured courses (max: 12) |

#### Example Request

```bash
GET /api/courses/featured?limit=3
```

#### Response Format

```json
{
  "success": true,
  "data": [
    {
      // Optimized course data with top marketing content
      // Same structure as list endpoint but with limited arrays
      "keyBenefits": ["Top 3 benefits only"],
      "features": ["Top 4 features only"],
      "keywords": ["Top 5 keywords only"]
    }
  ],
  "meta": {
    "total": 3
  }
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error context (development only)
    },
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "uuid"
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid query parameters |
| `COURSE_NOT_FOUND` | 404 | Course slug not found |
| `INVALID_SLUG` | 400 | Malformed course slug |
| `INVALID_LIMIT` | 400 | Invalid limit parameter |
| `METHOD_NOT_ALLOWED` | 405 | HTTP method not allowed |
| `DATABASE_ERROR` | 503 | Database unavailable |
| `TIMEOUT_ERROR` | 504 | Request timeout |
| `INTERNAL_ERROR` | 500 | Server error |

## Performance & Caching

### Caching Strategy

- **Course List**: `300s cache, 3600s stale-while-revalidate`
- **Course Details**: `600s cache, 3600s stale-while-revalidate`
- **Categories**: `1800s cache, 3600s stale-while-revalidate`
- **Featured**: `1800s cache, 7200s stale-while-revalidate`

### Performance Headers

All responses include performance monitoring headers:
- `X-Total-Count`: Total items count
- `X-Page-Count`: Total pages (list endpoints)
- `X-Course-ID`: Course identifier (detail endpoint)
- `X-Last-Modified`: Last modification timestamp

## Rate Limiting

Currently no rate limiting implemented. Future versions will include:
- 1000 requests/hour per IP for anonymous users
- Higher limits for authenticated users

## Multi-Language Support

All text content supports multi-language JSON objects:

```json
{
  "title": {
    "en": "English Title",
    "ru": "Русский заголовок", 
    "he": "כותרת בעברית"
  }
}
```

Supported languages:
- `en`: English
- `ru`: Russian
- `he`: Hebrew (RTL support)

## Database Schema Integration

The API integrates with the complete Prisma schema supporting:
- **28+ models** covering all business requirements
- **Multi-language content** with JSON fields
- **Hierarchical categories** with parent-child relationships
- **Comprehensive indexing** for performance
- **ACID compliance** with PostgreSQL

## TypeScript Integration

Full TypeScript support with:
- **Strict type checking** for all API responses
- **Shared types** between frontend and backend
- **Prisma type generation** for database models
- **OpenAPI-compliant** response interfaces

## Examples

### Frontend Integration (React/Next.js)

```tsx
import { CoursesListResponse, CourseDetailResponse } from '@aistudio555/types';

// List courses with filtering
const fetchCourses = async (params: URLSearchParams): Promise<CoursesListResponse> => {
  const response = await fetch(`/api/courses?${params}`);
  return response.json();
};

// Get course details
const fetchCourse = async (slug: string): Promise<CourseDetailResponse> => {
  const response = await fetch(`/api/courses/${slug}`);
  if (!response.ok) {
    throw new Error('Course not found');
  }
  return response.json();
};
```

### Search and Filtering

```jsx
const CourseSearch = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const searchCourses = async (searchTerm: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        sort: 'popularity',
        order: 'desc',
        limit: '12'
      });
      
      const response = await fetchCourses(params);
      setCourses(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <input 
        type="text" 
        placeholder="Search courses..."
        onChange={(e) => searchCourses(e.target.value)}
      />
      {loading ? <div>Loading...</div> : (
        <div>
          {courses.map(course => (
            <div key={course.id}>{course.title.en}</div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## API Testing

### cURL Examples

```bash
# Test course listing
curl -X GET "https://projectdes-academy.com/api/courses?limit=5" \
  -H "Accept: application/json"

# Test course search
curl -X GET "https://projectdes-academy.com/api/courses?search=AI&sort=rating" \
  -H "Accept: application/json"

# Test course details
curl -X GET "https://projectdes-academy.com/api/courses/ai-transformation-manager" \
  -H "Accept: application/json"

# Test categories
curl -X GET "https://projectdes-academy.com/api/courses/categories" \
  -H "Accept: application/json"

# Test featured courses
curl -X GET "https://projectdes-academy.com/api/courses/featured?limit=3" \
  -H "Accept: application/json"
```

### Postman Collection

A complete Postman collection is available with all endpoints, example requests, and automated tests.

## Security Considerations

- **Input Validation**: All query parameters are validated and sanitized
- **SQL Injection Protection**: Prisma ORM provides built-in protection
- **XSS Prevention**: All output is properly escaped
- **Rate Limiting**: Planned for future implementation
- **CORS**: Configured for production domains
- **HTTPS**: Required for all production traffic

## Future Enhancements

- **Authentication**: JWT-based auth for course management
- **GraphQL**: Alternative GraphQL endpoint
- **Real-time**: WebSocket support for live updates
- **Analytics**: Course view tracking and analytics
- **Recommendations**: AI-powered course recommendations
- **Bulk Operations**: Batch course operations API

---

**Built with ❤️ by the Projectdes Academy Team**