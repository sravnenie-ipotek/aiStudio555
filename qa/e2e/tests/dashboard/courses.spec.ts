import { test, expect } from '../../fixtures/auth';
import { TestHelpers, testData } from '../../utils/test-helpers';

test.describe('Dashboard - My Courses', () => {
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    testHelpers = new TestHelpers(page);
    
    // Mock courses data
    await testHelpers.mockApiResponse('/courses/enrollments/my', {
      enrollments: [
        {
          id: '1',
          courseId: '1',
          course: testData.courses.aiTransformation,
          progress: 65,
          enrolledAt: '2024-01-01T00:00:00Z',
          lastAccessedAt: '2024-01-20T15:30:00Z',
          status: 'active',
          completedLessons: 13,
          totalLessons: 20,
          timeSpent: 480, // minutes
          nextLesson: {
            id: '14',
            title: 'Advanced AI Implementation Strategies',
            duration: 25
          }
        },
        {
          id: '2', 
          courseId: '2',
          course: testData.courses.noCode,
          progress: 30,
          enrolledAt: '2024-01-15T00:00:00Z',
          lastAccessedAt: '2024-01-19T09:15:00Z',
          status: 'active',
          completedLessons: 5,
          totalLessons: 16,
          timeSpent: 180,
          nextLesson: {
            id: '6',
            title: 'Building Your First Landing Page',
            duration: 30
          }
        },
        {
          id: '3',
          courseId: '3', 
          course: testData.courses.aiVideo,
          progress: 100,
          enrolledAt: '2023-12-01T00:00:00Z',
          lastAccessedAt: '2024-01-10T11:45:00Z',
          status: 'completed',
          completedLessons: 12,
          totalLessons: 12,
          timeSpent: 360,
          completedAt: '2024-01-10T11:45:00Z',
          certificate: {
            id: 'cert-123',
            url: '/certificates/cert-123.pdf'
          }
        }
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 3,
        totalPages: 1
      }
    });
  });

  test('should display courses page correctly @smoke @critical', async ({ page }) => {
    await page.goto('/dashboard/courses');
    
    // Check page structure
    await expect(page).toHaveTitle(/.*My Courses.*/);
    await expect(page.getByTestId('courses-page-title')).toContainText('My Courses');
    
    // Check filter and sort options
    await expect(page.getByTestId('course-filter-dropdown')).toBeVisible();
    await expect(page.getByTestId('course-sort-dropdown')).toBeVisible();
    
    // Check courses grid
    await expect(page.getByTestId('courses-grid')).toBeVisible();
    
    await testHelpers.takeScreenshot('courses-page-main');
  });

  test('should display all enrolled courses @critical', async ({ page }) => {
    await page.goto('/dashboard/courses');
    
    // Check course count
    const courseCards = page.getByTestId('course-card');
    await expect(courseCards).toHaveCount(3);
    
    // Check course details for active course
    const activeCourse = courseCards.first();
    await expect(activeCourse.getByTestId('course-title')).toContainText('AI Transformation Manager');
    await expect(activeCourse.getByTestId('course-progress')).toContainText('65%');
    await expect(activeCourse.getByTestId('course-lessons-count')).toContainText('13/20 lessons');
    await expect(activeCourse.getByTestId('course-time-spent')).toContainText('8h 0m');
    await expect(activeCourse.getByTestId('course-status')).toContainText('In Progress');
    
    // Check completed course
    const completedCourse = courseCards.nth(2);
    await expect(completedCourse.getByTestId('course-status')).toContainText('Completed');
    await expect(completedCourse.getByTestId('certificate-badge')).toBeVisible();
    await expect(completedCourse.getByTestId('download-certificate-btn')).toBeVisible();
  });

  test('should filter courses by status', async ({ page }) => {
    await page.goto('/dashboard/courses');
    
    // Filter by active courses
    await page.getByTestId('course-filter-dropdown').click();
    await page.getByTestId('filter-active').click();
    
    const activeCourses = page.getByTestId('course-card');
    await expect(activeCourses).toHaveCount(2);
    
    // Filter by completed courses
    await page.getByTestId('course-filter-dropdown').click();
    await page.getByTestId('filter-completed').click();
    
    const completedCourses = page.getByTestId('course-card');
    await expect(completedCourses).toHaveCount(1);
    await expect(completedCourses.getByTestId('course-status')).toContainText('Completed');
    
    // Reset filter
    await page.getByTestId('course-filter-dropdown').click();
    await page.getByTestId('filter-all').click();
    
    await expect(page.getByTestId('course-card')).toHaveCount(3);
  });

  test('should sort courses correctly', async ({ page }) => {
    await page.goto('/dashboard/courses');
    
    // Sort by progress (ascending)
    await page.getByTestId('course-sort-dropdown').click();
    await page.getByTestId('sort-progress-asc').click();
    
    const courseCards = page.getByTestId('course-card');
    const firstCourseProgress = await courseCards.first().getByTestId('course-progress').textContent();
    expect(firstCourseProgress).toContain('30%');
    
    // Sort by progress (descending) 
    await page.getByTestId('course-sort-dropdown').click();
    await page.getByTestId('sort-progress-desc').click();
    
    const firstCourseProgressDesc = await courseCards.first().getByTestId('course-progress').textContent();
    expect(firstCourseProgressDesc).toContain('100%');
    
    // Sort by enrollment date (newest first)
    await page.getByTestId('course-sort-dropdown').click();
    await page.getByTestId('sort-enrolled-newest').click();
    
    const firstCourseTitle = await courseCards.first().getByTestId('course-title').textContent();
    expect(firstCourseTitle).toContain('No-Code Website Development');
  });

  test('should navigate to course player', async ({ page }) => {
    await page.goto('/dashboard/courses');
    
    // Click continue learning on first course
    const firstCourse = page.getByTestId('course-card').first();
    await firstCourse.getByTestId('continue-learning-btn').click();
    
    // Should navigate to course player
    await expect(page).toHaveURL('/learn/1');
  });

  test('should display next lesson information', async ({ page }) => {
    await page.goto('/dashboard/courses');
    
    // Check next lesson info for active courses
    const activeCourse = page.getByTestId('course-card').first();
    await expect(activeCourse.getByTestId('next-lesson-title')).toContainText('Advanced AI Implementation Strategies');
    await expect(activeCourse.getByTestId('next-lesson-duration')).toContainText('25 min');
  });

  test('should download certificate for completed course', async ({ page }) => {
    await page.goto('/dashboard/courses');
    
    // Mock certificate download
    await page.route('**/certificates/cert-123.pdf', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/pdf',
        body: Buffer.from('Mock PDF content')
      });
    });
    
    // Click download certificate
    const completedCourse = page.getByTestId('course-card').nth(2);
    await completedCourse.getByTestId('download-certificate-btn').click();
    
    // Verify download initiated
    const download = await page.waitForEvent('download');
    expect(download.suggestedFilename()).toContain('certificate');
  });

  test('should display course statistics correctly', async ({ page }) => {
    await page.goto('/dashboard/courses');
    
    // Check summary statistics
    await expect(page.getByTestId('total-enrolled')).toContainText('3');
    await expect(page.getByTestId('total-completed')).toContainText('1');
    await expect(page.getByTestId('total-in-progress')).toContainText('2');
    await expect(page.getByTestId('average-progress')).toContainText('65%');
    
    // Check total time spent
    await expect(page.getByTestId('total-time-spent')).toContainText('17h 0m');
  });

  test('should handle search functionality', async ({ page }) => {
    await page.goto('/dashboard/courses');
    
    // Search for specific course
    await page.getByTestId('course-search-input').fill('AI Transformation');
    await page.keyboard.press('Enter');
    
    // Should show filtered results
    const searchResults = page.getByTestId('course-card');
    await expect(searchResults).toHaveCount(1);
    await expect(searchResults.getByTestId('course-title')).toContainText('AI Transformation Manager');
    
    // Clear search
    await page.getByTestId('course-search-input').clear();
    await page.keyboard.press('Enter');
    
    await expect(page.getByTestId('course-card')).toHaveCount(3);
  });

  test('should display empty state when no courses match filters', async ({ page }) => {
    await page.goto('/dashboard/courses');
    
    // Search for non-existent course
    await page.getByTestId('course-search-input').fill('Non-existent Course');
    await page.keyboard.press('Enter');
    
    // Should show empty state
    await expect(page.getByTestId('no-courses-found')).toBeVisible();
    await expect(page.getByTestId('no-courses-found')).toContainText('No courses found matching your search');
    await expect(page.getByTestId('clear-search-btn')).toBeVisible();
    
    // Clear search
    await page.getByTestId('clear-search-btn').click();
    await expect(page.getByTestId('course-card')).toHaveCount(3);
  });

  test('should show course progress details', async ({ page }) => {
    await page.goto('/dashboard/courses');
    
    // Click on course progress for details
    const firstCourse = page.getByTestId('course-card').first();
    await firstCourse.getByTestId('progress-details-btn').click();
    
    // Should show progress modal/dropdown
    await expect(page.getByTestId('progress-details-modal')).toBeVisible();
    await expect(page.getByTestId('lessons-completed')).toContainText('13 lessons completed');
    await expect(page.getByTestId('lessons-remaining')).toContainText('7 lessons remaining');
    await expect(page.getByTestId('estimated-completion')).toBeVisible();
  });

  test('should handle loading states', async ({ page }) => {
    // Delay API response
    await page.route('**/api/courses/enrollments/my', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          enrollments: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
        })
      });
    });

    await page.goto('/dashboard/courses');
    
    // Check loading state
    await expect(page.getByTestId('courses-loading')).toBeVisible();
    await expect(page.getByTestId('loading-skeleton')).toBeVisible();
    
    // Wait for loading to complete
    await testHelpers.waitForLoading();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await testHelpers.mockApiResponse('/courses/enrollments/my', {
      message: 'Failed to fetch enrolled courses'
    }, 500);

    await page.goto('/dashboard/courses');
    
    // Check error state
    await expect(page.getByTestId('courses-error')).toBeVisible();
    await expect(page.getByTestId('courses-error')).toContainText('Failed to load courses');
    await expect(page.getByTestId('retry-courses-btn')).toBeVisible();
  });

  test('should refresh courses data', async ({ page }) => {
    await page.goto('/dashboard/courses');
    
    // Click refresh button
    await page.getByTestId('refresh-courses-btn').click();
    
    // Should show loading and reload data
    await expect(page.getByTestId('courses-loading')).toBeVisible();
    await testHelpers.waitForLoading();
    
    // Data should be refreshed
    await expect(page.getByTestId('course-card')).toHaveCount(3);
  });

  test('should be responsive on mobile @mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/dashboard/courses');
    
    // Check mobile layout
    await expect(page.getByTestId('courses-mobile-view')).toBeVisible();
    await expect(page.getByTestId('course-card')).toHaveCount(3);
    
    // Check mobile-specific elements
    await expect(page.getByTestId('mobile-filter-toggle')).toBeVisible();
    await expect(page.getByTestId('mobile-sort-toggle')).toBeVisible();
    
    await testHelpers.takeScreenshot('courses-mobile');
  });

  test('should support pagination for many courses', async ({ page }) => {
    // Mock paginated response
    await testHelpers.mockApiResponse('/courses/enrollments/my*', {
      enrollments: Array.from({ length: 5 }, (_, i) => ({
        id: `${i + 1}`,
        courseId: `${i + 1}`,
        course: {
          id: `${i + 1}`,
          title: `Course ${i + 1}`,
          price: 1000,
          duration: '4 weeks'
        },
        progress: (i + 1) * 20,
        status: 'active'
      })),
      pagination: {
        page: 1,
        limit: 5,
        total: 12,
        totalPages: 3
      }
    });

    await page.goto('/dashboard/courses');
    
    // Check pagination controls
    await expect(page.getByTestId('pagination-controls')).toBeVisible();
    await expect(page.getByTestId('pagination-info')).toContainText('Showing 1-5 of 12 courses');
    
    // Navigate to next page
    await page.getByTestId('pagination-next').click();
    await expect(page).toHaveURL('/dashboard/courses?page=2');
  });

  test('should meet accessibility standards @accessibility', async ({ page }) => {
    await page.goto('/dashboard/courses');
    
    // Check accessibility compliance
    await testHelpers.checkAccessibility();
    
    // Check ARIA labels on interactive elements
    await expect(page.getByTestId('course-filter-dropdown')).toHaveAttribute('aria-label');
    await expect(page.getByTestId('course-sort-dropdown')).toHaveAttribute('aria-label');
    await expect(page.getByTestId('course-search-input')).toHaveAttribute('aria-label');
    
    // Check keyboard navigation
    await testHelpers.testKeyboardNavigation([
      'course-search-input',
      'course-filter-dropdown',
      'course-sort-dropdown',
      'continue-learning-btn'
    ]);
  });

  test('should display course thumbnails and handle missing images', async ({ page }) => {
    await page.goto('/dashboard/courses');
    
    // Check course thumbnails
    const courseCards = page.getByTestId('course-card');
    const firstCourse = courseCards.first();
    
    await expect(firstCourse.getByTestId('course-thumbnail')).toBeVisible();
    await expect(firstCourse.getByTestId('course-thumbnail')).toHaveAttribute('alt');
    
    // Test broken image handling
    await page.route('**/images/courses/*.jpg', route => route.abort());
    
    await page.reload();
    await expect(firstCourse.getByTestId('course-thumbnail-fallback')).toBeVisible();
  });
});