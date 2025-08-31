// cypress/e2e/courses.cy.ts
/// <reference types="cypress" />
import { testCourseFactory, testUserFactory } from '../support/types';

describe('Course Browsing and Enrollment', () => {
  beforeEach(() => {
    cy.clearTestData();
    cy.seedTestData();
  });

  afterEach(() => {
    cy.clearTestData();
  });

  describe('Course Catalog', () => {
    beforeEach(() => {
      // Mock courses data
      cy.intercept('GET', '/api/courses*', {
        statusCode: 200,
        body: {
          data: [
            testCourseFactory({
              id: 'course-1',
              title: 'AI Transformation Manager',
              description: 'Comprehensive AI transformation training',
              price: 1500,
              discountedPrice: 1000,
              level: 'INTERMEDIATE',
              language: 'en',
              tags: ['ai', 'management', 'transformation'],
              currentStudents: 45,
              maxStudents: 100,
            }),
            testCourseFactory({
              id: 'course-2',
              title: 'No-Code Website Development',
              description: 'Build websites without coding',
              price: 1200,
              level: 'BEGINNER',
              language: 'en',
              tags: ['no-code', 'web-development', 'beginner'],
              currentStudents: 78,
              maxStudents: 150,
            }),
            testCourseFactory({
              id: 'course-3',
              title: 'AI Video & Avatar Generation',
              description: 'Create AI-powered videos and avatars',
              price: 1300,
              level: 'ADVANCED',
              language: 'en',
              tags: ['ai', 'video', 'avatars'],
              currentStudents: 23,
              maxStudents: 80,
            }),
          ],
          total: 3,
          page: 1,
          limit: 10,
          hasMore: false,
        },
      }).as('getCourses');

      cy.visit('/courses');
      cy.wait('@getCourses');
      cy.waitForPageLoad();
    });

    it('should display course catalog correctly', () => {
      // Check page elements
      cy.getByTestId('courses-page-title').should('be.visible').and('contain.text', 'Courses');
      cy.getByTestId('course-search').should('be.visible');
      cy.getByTestId('course-filters').should('be.visible');
      cy.getByTestId('course-grid').should('be.visible');

      // Check course cards are displayed
      cy.getByTestId('course-card').should('have.length', 3);
      cy.getByTestId('course-card').first().should('contain.text', 'AI Transformation Manager');

      // Check accessibility
      cy.checkAccessibility();
      
      // Check meta tags
      cy.toHaveCorrectMetaTags();
    });

    it('should display course card information correctly', () => {
      cy.getByTestId('course-card').first().within(() => {
        // Course basic info
        cy.getByTestId('course-title').should('contain.text', 'AI Transformation Manager');
        cy.getByTestId('course-description').should('be.visible');
        cy.getByTestId('course-level').should('contain.text', 'INTERMEDIATE');
        cy.getByTestId('course-duration').should('be.visible');
        
        // Pricing info
        cy.getByTestId('course-price').should('contain.text', '$1,500');
        cy.getByTestId('course-discounted-price').should('contain.text', '$1,000');
        cy.getByTestId('course-discount-badge').should('be.visible');
        
        // Course stats
        cy.getByTestId('course-students').should('contain.text', '45');
        cy.getByTestId('course-capacity').should('contain.text', '100');
        
        // Course tags
        cy.getByTestId('course-tags').should('be.visible');
        cy.getByTestId('course-tag').should('contain.text', 'ai');
        
        // Action buttons
        cy.getByTestId('course-view-button').should('be.visible');
        cy.getByTestId('course-enroll-button').should('be.visible');
      });
    });

    it('should search courses by title and description', () => {
      // Search for AI courses
      cy.getByTestId('course-search').type('AI');
      cy.getByTestId('search-button').click();

      // Should show filtered results
      cy.getByTestId('course-card').should('have.length', 2);
      cy.getByTestId('course-card').first().should('contain.text', 'AI Transformation');
      cy.getByTestId('search-results-count').should('contain.text', '2 courses found');

      // Clear search
      cy.getByTestId('clear-search').click();
      cy.getByTestId('course-card').should('have.length', 3);
    });

    it('should filter courses by level', () => {
      // Filter by beginner level
      cy.getByTestId('level-filter').select('BEGINNER');
      cy.getByTestId('apply-filters').click();

      // Should show only beginner courses
      cy.getByTestId('course-card').should('have.length', 1);
      cy.getByTestId('course-card').should('contain.text', 'No-Code Website Development');
    });

    it('should filter courses by price range', () => {
      // Set price range filter
      cy.getByTestId('min-price-filter').type('1000');
      cy.getByTestId('max-price-filter').type('1300');
      cy.getByTestId('apply-filters').click();

      // Should show courses in price range
      cy.getByTestId('course-card').should('have.length', 2);
      cy.getByTestId('no-results-message').should('not.exist');
    });

    it('should filter courses by tags', () => {
      // Filter by AI tag
      cy.getByTestId('tags-filter').within(() => {
        cy.getByTestId('tag-ai').click();
      });
      cy.getByTestId('apply-filters').click();

      // Should show AI-related courses
      cy.getByTestId('course-card').should('have.length', 2);
      cy.getByTestId('course-card').each(($card) => {
        cy.wrap($card).should('contain.text', 'AI');
      });
    });

    it('should handle no search results', () => {
      // Search for non-existent course
      cy.getByTestId('course-search').type('NonExistentCourse123');
      cy.getByTestId('search-button').click();

      // Should show no results message
      cy.getByTestId('no-results-message').should('be.visible')
        .and('contain.text', 'No courses found');
      cy.getByTestId('course-card').should('not.exist');

      // Should show suggestion to clear filters
      cy.getByTestId('clear-all-filters').should('be.visible');
    });

    it('should sort courses by different criteria', () => {
      // Sort by price (low to high)
      cy.getByTestId('sort-dropdown').select('price-asc');

      // Should reorder courses
      cy.getByTestId('course-card').first()
        .should('contain.text', 'No-Code Website Development'); // $1200

      // Sort by popularity
      cy.getByTestId('sort-dropdown').select('popularity');
      cy.getByTestId('course-card').first()
        .should('contain.text', 'No-Code Website Development'); // 78 students
    });

    it('should handle pagination', () => {
      // Mock large dataset
      cy.intercept('GET', '/api/courses*', {
        statusCode: 200,
        body: {
          data: Array.from({ length: 10 }, (_, i) => 
            testCourseFactory({ 
              id: `course-${i + 1}`,
              title: `Test Course ${i + 1}`,
            })
          ),
          total: 25,
          page: 1,
          limit: 10,
          hasMore: true,
        },
      }).as('getCoursesPage1');

      cy.visit('/courses');
      cy.wait('@getCoursesPage1');

      // Should show pagination
      cy.getByTestId('pagination').should('be.visible');
      cy.getByTestId('current-page').should('contain.text', '1');
      cy.getByTestId('total-pages').should('contain.text', '3');

      // Click next page
      cy.intercept('GET', '/api/courses*page=2*', {
        statusCode: 200,
        body: {
          data: Array.from({ length: 10 }, (_, i) => 
            testCourseFactory({ 
              id: `course-${i + 11}`,
              title: `Test Course ${i + 11}`,
            })
          ),
          total: 25,
          page: 2,
          limit: 10,
          hasMore: true,
        },
      }).as('getCoursesPage2');

      cy.getByTestId('next-page').click();
      cy.wait('@getCoursesPage2');
      cy.getByTestId('current-page').should('contain.text', '2');
    });

    it('should be responsive on different screen sizes', () => {
      cy.testResponsiveness();

      // Test mobile layout
      cy.testOnMobile();
      cy.getByTestId('course-grid').should('have.class', 'mobile-layout');
      cy.getByTestId('course-card').should('be.visible');
      
      // Test tablet layout
      cy.testOnTablet();
      cy.getByTestId('course-grid').should('have.class', 'tablet-layout');
    });
  });

  describe('Course Details Page', () => {
    beforeEach(() => {
      const courseData = testCourseFactory({
        id: 'course-detail-1',
        title: 'AI Transformation Manager',
        description: 'Comprehensive AI transformation training program',
        price: 1500,
        discountedPrice: 1000,
        level: 'INTERMEDIATE',
        duration: '8 weeks',
        maxStudents: 100,
        currentStudents: 45,
      });

      cy.intercept('GET', '/api/courses/course-detail-1', {
        statusCode: 200,
        body: courseData,
      }).as('getCourseDetails');

      cy.intercept('GET', '/api/courses/course-detail-1/curriculum', {
        statusCode: 200,
        body: {
          modules: [
            {
              id: 'module-1',
              title: 'Introduction to AI Transformation',
              lessons: [
                { id: 'lesson-1', title: 'Understanding AI in Business', duration: '45 min' },
                { id: 'lesson-2', title: 'AI Strategy Framework', duration: '60 min' },
              ],
            },
            {
              id: 'module-2',
              title: 'Implementation Strategies',
              lessons: [
                { id: 'lesson-3', title: 'Change Management', duration: '55 min' },
                { id: 'lesson-4', title: 'ROI Measurement', duration: '40 min' },
              ],
            },
          ],
        },
      }).as('getCourseCurriculum');

      cy.visit('/courses/course-detail-1');
      cy.wait('@getCourseDetails');
      cy.wait('@getCourseCurriculum');
    });

    it('should display course details correctly', () => {
      // Course header
      cy.getByTestId('course-detail-title').should('contain.text', 'AI Transformation Manager');
      cy.getByTestId('course-detail-description').should('be.visible');
      cy.getByTestId('course-detail-level').should('contain.text', 'INTERMEDIATE');
      cy.getByTestId('course-detail-duration').should('contain.text', '8 weeks');

      // Pricing section
      cy.getByTestId('course-detail-price').should('contain.text', '$1,500');
      cy.getByTestId('course-detail-discounted-price').should('contain.text', '$1,000');
      cy.getByTestId('course-savings').should('contain.text', 'Save $500');

      // Course stats
      cy.getByTestId('course-enrolled-students').should('contain.text', '45');
      cy.getByTestId('course-available-spots').should('contain.text', '55 spots left');

      // Enrollment button
      cy.getByTestId('enroll-now-button').should('be.visible').and('contain.text', 'Enroll Now');

      cy.checkAccessibility();
    });

    it('should display course curriculum', () => {
      cy.getByTestId('course-curriculum').should('be.visible');
      
      // Check modules
      cy.getByTestId('curriculum-module').should('have.length', 2);
      cy.getByTestId('curriculum-module').first().within(() => {
        cy.getByTestId('module-title').should('contain.text', 'Introduction to AI Transformation');
        cy.getByTestId('module-lessons').should('be.visible');
        cy.getByTestId('lesson-item').should('have.length', 2);
      });

      // Check lessons
      cy.getByTestId('lesson-item').first().within(() => {
        cy.getByTestId('lesson-title').should('contain.text', 'Understanding AI in Business');
        cy.getByTestId('lesson-duration').should('contain.text', '45 min');
      });

      // Test expandable modules
      cy.getByTestId('module-toggle').first().click();
      cy.getByTestId('module-lessons').first().should('be.visible');
    });

    it('should handle course enrollment for authenticated users', () => {
      cy.login();
      cy.visit('/courses/course-detail-1');
      cy.wait('@getCourseDetails');

      // Mock enrollment API
      cy.intercept('POST', '/api/courses/course-detail-1/enroll', {
        statusCode: 201,
        body: {
          success: true,
          enrollment: {
            id: 'enrollment-123',
            courseId: 'course-detail-1',
            status: 'ACTIVE',
          },
        },
      }).as('enrollInCourse');

      cy.getByTestId('enroll-now-button').click();

      // Should proceed to payment or show enrollment success
      cy.wait('@enrollInCourse');
      cy.url().should('satisfy', (url: string) => 
        url.includes('/payment') || url.includes('/dashboard')
      );
    });

    it('should redirect unauthenticated users to login', () => {
      cy.getByTestId('enroll-now-button').click();

      // Should redirect to login with return URL
      cy.url().should('include', '/login');
      cy.url().should('include', 'return=');
    });

    it('should show course prerequisites if any', () => {
      cy.intercept('GET', '/api/courses/course-detail-1', {
        statusCode: 200,
        body: testCourseFactory({
          id: 'course-detail-1',
          prerequisites: ['Basic computer skills', 'Business management experience'],
        }),
      }).as('getCourseWithPrereqs');

      cy.visit('/courses/course-detail-1');
      cy.wait('@getCourseWithPrereqs');

      cy.getByTestId('course-prerequisites').should('be.visible');
      cy.getByTestId('prerequisite-item').should('have.length', 2);
      cy.getByTestId('prerequisite-item').first()
        .should('contain.text', 'Basic computer skills');
    });

    it('should display instructor information', () => {
      cy.intercept('GET', '/api/courses/course-detail-1/instructor', {
        statusCode: 200,
        body: {
          id: 'instructor-1',
          firstName: 'Dr. Sarah',
          lastName: 'Johnson',
          title: 'AI Transformation Expert',
          bio: 'Leading expert in AI transformation with 15 years of experience',
          avatar: 'https://example.com/avatar.jpg',
          credentials: ['PhD in Computer Science', 'Certified AI Strategist'],
        },
      }).as('getInstructor');

      cy.visit('/courses/course-detail-1');
      cy.wait('@getInstructor');

      cy.getByTestId('instructor-section').should('be.visible');
      cy.getByTestId('instructor-name').should('contain.text', 'Dr. Sarah Johnson');
      cy.getByTestId('instructor-title').should('contain.text', 'AI Transformation Expert');
      cy.getByTestId('instructor-bio').should('be.visible');
      cy.getByTestId('instructor-credentials').should('be.visible');
    });

    it('should show course reviews and ratings', () => {
      cy.intercept('GET', '/api/courses/course-detail-1/reviews*', {
        statusCode: 200,
        body: {
          data: [
            {
              id: 'review-1',
              userId: 'user-1',
              userName: 'John Doe',
              rating: 5,
              comment: 'Excellent course! Learned a lot about AI transformation.',
              createdAt: '2024-01-15T10:30:00Z',
            },
            {
              id: 'review-2',
              userId: 'user-2',
              userName: 'Jane Smith',
              rating: 4,
              comment: 'Very comprehensive and well-structured.',
              createdAt: '2024-01-10T14:20:00Z',
            },
          ],
          averageRating: 4.5,
          totalReviews: 23,
        },
      }).as('getCourseReviews');

      cy.visit('/courses/course-detail-1');
      cy.wait('@getCourseReviews');

      cy.getByTestId('course-reviews-section').should('be.visible');
      cy.getByTestId('average-rating').should('contain.text', '4.5');
      cy.getByTestId('total-reviews').should('contain.text', '23 reviews');
      cy.getByTestId('review-item').should('have.length', 2);

      // Check individual review
      cy.getByTestId('review-item').first().within(() => {
        cy.getByTestId('reviewer-name').should('contain.text', 'John Doe');
        cy.getByTestId('review-rating').should('be.visible');
        cy.getByTestId('review-comment').should('contain.text', 'Excellent course');
      });
    });

    it('should handle course capacity limits', () => {
      // Mock course at capacity
      cy.intercept('GET', '/api/courses/course-detail-1', {
        statusCode: 200,
        body: testCourseFactory({
          id: 'course-detail-1',
          currentStudents: 100,
          maxStudents: 100,
          status: 'PUBLISHED',
        }),
      }).as('getFullCourse');

      cy.visit('/courses/course-detail-1');
      cy.wait('@getFullCourse');

      // Should show course is full
      cy.getByTestId('course-full-message').should('be.visible')
        .and('contain.text', 'Course is currently full');
      cy.getByTestId('enroll-now-button').should('be.disabled');
      cy.getByTestId('join-waitlist-button').should('be.visible');
    });

    it('should allow joining waitlist for full courses', () => {
      // Setup full course
      cy.intercept('GET', '/api/courses/course-detail-1', {
        statusCode: 200,
        body: testCourseFactory({
          currentStudents: 100,
          maxStudents: 100,
        }),
      }).as('getFullCourse');

      cy.login();
      cy.visit('/courses/course-detail-1');
      cy.wait('@getFullCourse');

      // Mock waitlist API
      cy.intercept('POST', '/api/courses/course-detail-1/waitlist', {
        statusCode: 201,
        body: { success: true, position: 5 },
      }).as('joinWaitlist');

      cy.getByTestId('join-waitlist-button').click();
      cy.wait('@joinWaitlist');

      // Should show waitlist confirmation
      cy.getByTestId('waitlist-success').should('be.visible')
        .and('contain.text', 'You are #5 on the waitlist');
    });
  });

  describe('Course Enrollment Flow', () => {
    beforeEach(() => {
      cy.login();
    });

    it('should handle direct enrollment for free courses', () => {
      const freeCourse = testCourseFactory({
        id: 'free-course-1',
        title: 'Introduction to AI',
        price: 0,
      });

      cy.intercept('GET', '/api/courses/free-course-1', {
        statusCode: 200,
        body: freeCourse,
      }).as('getFreeCourse');

      cy.intercept('POST', '/api/courses/free-course-1/enroll', {
        statusCode: 201,
        body: {
          success: true,
          enrollment: { id: 'enrollment-123', status: 'ACTIVE' },
        },
      }).as('enrollInFreeCourse');

      cy.visit('/courses/free-course-1');
      cy.wait('@getFreeCourse');

      cy.getByTestId('enroll-free-button').click();
      cy.wait('@enrollInFreeCourse');

      // Should redirect to course dashboard
      cy.url().should('include', '/dashboard/courses/free-course-1');
      cy.getByTestId('enrollment-success').should('be.visible');
    });

    it('should redirect to payment for paid courses', () => {
      const paidCourse = testCourseFactory({
        id: 'paid-course-1',
        price: 1000,
      });

      cy.intercept('GET', '/api/courses/paid-course-1', {
        statusCode: 200,
        body: paidCourse,
      }).as('getPaidCourse');

      cy.visit('/courses/paid-course-1');
      cy.wait('@getPaidCourse');

      cy.getByTestId('enroll-now-button').click();

      // Should redirect to payment page
      cy.url().should('include', '/payment');
      cy.url().should('include', 'courseId=paid-course-1');
    });

    it('should handle enrollment with prerequisites check', () => {
      const courseWithPrereqs = testCourseFactory({
        id: 'advanced-course-1',
        prerequisites: ['course-basics-1', 'course-intermediate-1'],
      });

      cy.intercept('GET', '/api/courses/advanced-course-1', {
        statusCode: 200,
        body: courseWithPrereqs,
      }).as('getCourseWithPrereqs');

      cy.intercept('GET', '/api/user/prerequisites/advanced-course-1', {
        statusCode: 200,
        body: {
          hasPrerequisites: false,
          missingPrerequisites: ['course-basics-1'],
        },
      }).as('checkPrerequisites');

      cy.visit('/courses/advanced-course-1');
      cy.wait('@getCourseWithPrereqs');
      cy.wait('@checkPrerequisites');

      cy.getByTestId('enroll-now-button').click();

      // Should show prerequisites warning
      cy.getByTestId('prerequisites-modal').should('be.visible');
      cy.getByTestId('missing-prerequisites').should('contain.text', 'course-basics-1');
      cy.getByTestId('complete-prerequisites').should('be.visible');
    });

    it('should show already enrolled state', () => {
      cy.intercept('GET', '/api/courses/enrolled-course-1', {
        statusCode: 200,
        body: testCourseFactory({ id: 'enrolled-course-1' }),
      }).as('getEnrolledCourse');

      cy.intercept('GET', '/api/user/enrollments/enrolled-course-1', {
        statusCode: 200,
        body: {
          id: 'enrollment-123',
          status: 'ACTIVE',
          progress: 45,
          enrolledAt: '2024-01-01T10:00:00Z',
        },
      }).as('getEnrollmentStatus');

      cy.visit('/courses/enrolled-course-1');
      cy.wait('@getEnrolledCourse');
      cy.wait('@getEnrollmentStatus');

      // Should show enrolled status
      cy.getByTestId('enrolled-status').should('be.visible')
        .and('contain.text', 'You are enrolled');
      cy.getByTestId('course-progress').should('contain.text', '45%');
      cy.getByTestId('continue-course-button').should('be.visible');
      cy.getByTestId('enroll-now-button').should('not.exist');
    });
  });

  describe('Course Categories and Navigation', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/categories', {
        statusCode: 200,
        body: [
          { id: 'cat-1', name: 'AI & Machine Learning', courseCount: 15 },
          { id: 'cat-2', name: 'Web Development', courseCount: 8 },
          { id: 'cat-3', name: 'Data Science', courseCount: 12 },
          { id: 'cat-4', name: 'Digital Marketing', courseCount: 6 },
        ],
      }).as('getCategories');

      cy.visit('/courses');
      cy.wait('@getCategories');
    });

    it('should display course categories', () => {
      cy.getByTestId('course-categories').should('be.visible');
      cy.getByTestId('category-item').should('have.length', 4);

      cy.getByTestId('category-item').first().within(() => {
        cy.getByTestId('category-name').should('contain.text', 'AI & Machine Learning');
        cy.getByTestId('category-count').should('contain.text', '15 courses');
      });
    });

    it('should filter courses by category', () => {
      cy.intercept('GET', '/api/courses?category=cat-1*', {
        statusCode: 200,
        body: {
          data: [
            testCourseFactory({
              title: 'AI Course 1',
              categoryId: 'cat-1',
            }),
            testCourseFactory({
              title: 'Machine Learning Course',
              categoryId: 'cat-1',
            }),
          ],
          total: 2,
        },
      }).as('getCoursesByCategory');

      cy.getByTestId('category-item').first().click();
      cy.wait('@getCoursesByCategory');

      // Should show filtered courses
      cy.getByTestId('course-card').should('have.length', 2);
      cy.getByTestId('active-category').should('contain.text', 'AI & Machine Learning');
      cy.getByTestId('clear-category-filter').should('be.visible');
    });

    it('should navigate through category breadcrumbs', () => {
      // Click category
      cy.getByTestId('category-item').first().click();
      
      // Check breadcrumbs
      cy.getByTestId('breadcrumbs').should('be.visible');
      cy.getByTestId('breadcrumb-home').should('contain.text', 'Courses');
      cy.getByTestId('breadcrumb-category').should('contain.text', 'AI & Machine Learning');

      // Navigate back via breadcrumb
      cy.getByTestId('breadcrumb-home').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/courses');
    });
  });

  describe('Featured and Recommended Courses', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/courses/featured', {
        statusCode: 200,
        body: [
          testCourseFactory({
            id: 'featured-1',
            title: 'Featured AI Course',
            featured: true,
          }),
        ],
      }).as('getFeaturedCourses');

      cy.visit('/');
      cy.wait('@getFeaturedCourses');
    });

    it('should display featured courses on homepage', () => {
      cy.getByTestId('featured-courses-section').should('be.visible');
      cy.getByTestId('featured-course-card').should('have.length.at.least', 1);
      cy.getByTestId('featured-course-card').first()
        .should('contain.text', 'Featured AI Course');
    });

    it('should show personalized recommendations for logged-in users', () => {
      cy.login();
      
      cy.intercept('GET', '/api/courses/recommendations', {
        statusCode: 200,
        body: [
          testCourseFactory({
            id: 'recommended-1',
            title: 'Recommended for You',
            recommended: true,
          }),
        ],
      }).as('getRecommendations');

      cy.visit('/');
      cy.wait('@getRecommendations');

      cy.getByTestId('recommended-courses-section').should('be.visible');
      cy.getByTestId('recommended-course-card').should('be.visible');
    });
  });

  describe('Course Comparison', () => {
    beforeEach(() => {
      cy.visit('/courses');
      cy.getByTestId('course-card').should('have.length.at.least', 2);
    });

    it('should allow comparing multiple courses', () => {
      // Select courses for comparison
      cy.getByTestId('course-card').first().within(() => {
        cy.getByTestId('compare-checkbox').check();
      });

      cy.getByTestId('course-card').eq(1).within(() => {
        cy.getByTestId('compare-checkbox').check();
      });

      // Should show compare button
      cy.getByTestId('compare-courses-button').should('be.visible')
        .and('contain.text', 'Compare 2 courses');

      // Click compare
      cy.getByTestId('compare-courses-button').click();

      // Should open comparison modal
      cy.getByTestId('course-comparison-modal').should('be.visible');
      cy.getByTestId('comparison-table').should('be.visible');
      cy.getByTestId('compared-course').should('have.length', 2);
    });

    it('should display course comparison details', () => {
      // Setup comparison
      cy.getByTestId('course-card').first().within(() => {
        cy.getByTestId('compare-checkbox').check();
      });
      cy.getByTestId('course-card').eq(1).within(() => {
        cy.getByTestId('compare-checkbox').check();
      });

      cy.getByTestId('compare-courses-button').click();

      // Check comparison table content
      cy.getByTestId('comparison-table').within(() => {
        cy.getByTestId('comparison-row-title').should('be.visible');
        cy.getByTestId('comparison-row-price').should('be.visible');
        cy.getByTestId('comparison-row-duration').should('be.visible');
        cy.getByTestId('comparison-row-level').should('be.visible');
        cy.getByTestId('comparison-row-students').should('be.visible');
      });

      // Should allow enrollment from comparison
      cy.getByTestId('comparison-enroll-button').should('have.length', 2);
    });
  });

  describe('Multi-language Course Support', () => {
    beforeEach(() => {
      if (!Cypress.env('enableMultiLanguage')) {
        cy.task('log', 'Skipping multi-language tests - feature disabled');
        return;
      }
    });

    it('should filter courses by language', () => {
      cy.visit('/courses');
      
      // Filter by Russian courses
      cy.getByTestId('language-filter').select('ru');
      cy.getByTestId('apply-filters').click();

      // Should show Russian courses
      cy.getByTestId('course-card').each(($card) => {
        cy.wrap($card).within(() => {
          cy.getByTestId('course-language').should('contain.text', 'RU');
        });
      });
    });

    it('should display course content in selected language', () => {
      cy.switchLanguage('ru');
      cy.visit('/courses');

      // Should show UI in Russian
      cy.getByTestId('courses-page-title').should('contain.text', 'Курсы');
      cy.getByTestId('course-search').should('have.attr', 'placeholder')
        .and('match', /поиск|искать/i);
    });
  });

  describe('Course Accessibility', () => {
    beforeEach(() => {
      cy.visit('/courses');
    });

    it('should be keyboard navigable', () => {
      // Tab through course cards
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'course-search');

      // Continue tabbing
      cy.focused().tab();
      cy.focused().should('have.attr', 'data-testid', 'search-button');

      // Tab to course cards
      cy.focused().tab().tab();
      cy.focused().should('have.attr', 'data-testid').and('contain', 'course-');
    });

    it('should have proper ARIA labels and roles', () => {
      cy.getByTestId('course-card').first().within(() => {
        cy.get('[role="img"]').should('exist'); // Course thumbnail
        cy.get('[aria-label]').should('exist'); // Course actions
      });

      cy.getByTestId('course-search').should('have.attr', 'aria-label');
      cy.getByTestId('course-filters').should('have.attr', 'role', 'region');
    });

    it('should support screen readers', () => {
      cy.getByTestId('course-card').first().within(() => {
        // Should have descriptive text for screen readers
        cy.get('.sr-only, [aria-describedby]').should('exist');
      });

      // Check for skip links
      cy.get('[href="#main-content"]').should('exist');
    });
  });
});