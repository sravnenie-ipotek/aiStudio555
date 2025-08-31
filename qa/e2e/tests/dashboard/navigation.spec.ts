import { test, expect } from '../../fixtures/auth';
import { TestHelpers } from '../../utils/test-helpers';
import { testUsers } from '../../fixtures/auth';

test.describe('Dashboard Navigation', () => {
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    testHelpers = new TestHelpers(page);
    
    // Mock dashboard data
    await testHelpers.mockApiResponse('/auth/me', {
      id: '1',
      email: testUsers.student.email,
      firstName: testUsers.student.firstName,
      lastName: testUsers.student.lastName,
      role: 'student'
    });
    
    await testHelpers.mockApiResponse('/courses/enrollments/my', {
      enrollments: [
        {
          id: '1',
          courseId: '1',
          course: {
            id: '1',
            title: 'AI Transformation Manager',
            description: 'Master AI transformation strategies',
            price: 1500,
            duration: '8 weeks',
            thumbnail: '/images/courses/ai-transformation.jpg'
          },
          progress: 45,
          enrolledAt: '2024-01-01T00:00:00Z',
          status: 'active'
        },
        {
          id: '2',
          courseId: '2',
          course: {
            id: '2',
            title: 'No-Code Website Development',
            description: 'Build websites without coding',
            price: 1000,
            duration: '6 weeks',
            thumbnail: '/images/courses/no-code.jpg'
          },
          progress: 20,
          enrolledAt: '2024-01-15T00:00:00Z',
          status: 'active'
        }
      ],
      stats: {
        totalCourses: 2,
        completedCourses: 0,
        averageProgress: 32.5,
        totalWatchTime: 450 // minutes
      }
    });
  });

  test('should display dashboard correctly @smoke @critical', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check page title
    await expect(page).toHaveTitle(/.*Dashboard.*/);
    
    // Check main dashboard elements
    await expect(page.getByTestId('dashboard-header')).toBeVisible();
    await expect(page.getByTestId('welcome-message')).toContainText(`Welcome back, ${testUsers.student.firstName}`);
    
    // Check sidebar navigation
    await expect(page.getByTestId('sidebar-navigation')).toBeVisible();
    await expect(page.getByTestId('nav-dashboard')).toBeVisible();
    await expect(page.getByTestId('nav-courses')).toBeVisible();
    await expect(page.getByTestId('nav-settings')).toBeVisible();
    
    // Check user avatar and menu
    await expect(page.getByTestId('user-avatar')).toBeVisible();
    
    await testHelpers.takeScreenshot('dashboard-main');
  });

  test('should display student statistics @critical', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check statistics cards
    await expect(page.getByTestId('stat-enrolled-courses')).toContainText('2');
    await expect(page.getByTestId('stat-completed-courses')).toContainText('0');
    await expect(page.getByTestId('stat-average-progress')).toContainText('32.5%');
    await expect(page.getByTestId('stat-watch-time')).toContainText('7.5 hours');
  });

  test('should display enrolled courses @critical', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check courses section
    await expect(page.getByTestId('enrolled-courses-section')).toBeVisible();
    await expect(page.getByTestId('enrolled-courses-title')).toContainText('My Courses');
    
    // Check individual course cards
    const courseCards = page.getByTestId('course-card');
    await expect(courseCards).toHaveCount(2);
    
    // Check first course details
    const firstCourse = courseCards.first();
    await expect(firstCourse.getByTestId('course-title')).toContainText('AI Transformation Manager');
    await expect(firstCourse.getByTestId('course-progress')).toContainText('45%');
    await expect(firstCourse.getByTestId('course-duration')).toContainText('8 weeks');
    
    // Check continue learning button
    await expect(firstCourse.getByTestId('continue-learning-btn')).toBeVisible();
  });

  test('should navigate to course player from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Click on first course continue button
    const firstCourse = page.getByTestId('course-card').first();
    await firstCourse.getByTestId('continue-learning-btn').click();
    
    // Should navigate to course player
    await expect(page).toHaveURL('/learn/1');
  });

  test('should navigate through sidebar menu @critical', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Navigate to courses page
    await page.getByTestId('nav-courses').click();
    await expect(page).toHaveURL('/dashboard/courses');
    await expect(page.getByTestId('courses-page-title')).toContainText('My Courses');
    
    // Navigate back to dashboard
    await page.getByTestId('nav-dashboard').click();
    await expect(page).toHaveURL('/dashboard');
    
    // Navigate to settings
    await page.getByTestId('nav-settings').click();
    await expect(page).toHaveURL('/dashboard/settings');
    await expect(page.getByTestId('settings-page-title')).toContainText('Account Settings');
  });

  test('should highlight active navigation item', async ({ page }) => {
    // Test dashboard active state
    await page.goto('/dashboard');
    await expect(page.getByTestId('nav-dashboard')).toHaveClass(/active|current/);
    
    // Test courses active state  
    await page.goto('/dashboard/courses');
    await expect(page.getByTestId('nav-courses')).toHaveClass(/active|current/);
    
    // Test settings active state
    await page.goto('/dashboard/settings');
    await expect(page.getByTestId('nav-settings')).toHaveClass(/active|current/);
  });

  test('should display user menu correctly', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Click user avatar to open menu
    await page.getByTestId('user-menu-trigger').click();
    
    // Check menu items
    await expect(page.getByTestId('user-menu-dropdown')).toBeVisible();
    await expect(page.getByTestId('user-menu-profile')).toContainText('Profile');
    await expect(page.getByTestId('user-menu-settings')).toContainText('Settings');
    await expect(page.getByTestId('logout-button')).toContainText('Logout');
    
    // Check user info in menu
    await expect(page.getByTestId('user-menu-name')).toContainText(`${testUsers.student.firstName} ${testUsers.student.lastName}`);
    await expect(page.getByTestId('user-menu-email')).toContainText(testUsers.student.email);
  });

  test('should logout successfully from user menu', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Open user menu and logout
    await page.getByTestId('user-menu-trigger').click();
    await page.getByTestId('logout-button').click();
    
    // Should redirect to home page
    await expect(page).toHaveURL('/');
    
    // Should clear authentication state
    const token = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(token).toBeNull();
  });

  test('should handle empty course state', async ({ page }) => {
    // Mock empty courses response
    await testHelpers.mockApiResponse('/courses/enrollments/my', {
      enrollments: [],
      stats: {
        totalCourses: 0,
        completedCourses: 0,
        averageProgress: 0,
        totalWatchTime: 0
      }
    });

    await page.goto('/dashboard');
    
    // Check empty state
    await expect(page.getByTestId('empty-courses-message')).toBeVisible();
    await expect(page.getByTestId('empty-courses-message')).toContainText('You haven\'t enrolled in any courses yet');
    await expect(page.getByTestId('browse-courses-btn')).toBeVisible();
    
    // Click browse courses button
    await page.getByTestId('browse-courses-btn').click();
    await expect(page).toHaveURL('/programs');
  });

  test('should be responsive on mobile devices @mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/dashboard');
    
    // Check mobile layout
    await expect(page.getByTestId('mobile-nav-toggle')).toBeVisible();
    await expect(page.getByTestId('sidebar-navigation')).toBeHidden();
    
    // Open mobile navigation
    await page.getByTestId('mobile-nav-toggle').click();
    await expect(page.getByTestId('mobile-nav-overlay')).toBeVisible();
    await expect(page.getByTestId('sidebar-navigation')).toBeVisible();
    
    // Test navigation on mobile
    await page.getByTestId('nav-courses').click();
    await expect(page).toHaveURL('/dashboard/courses');
    await expect(page.getByTestId('mobile-nav-overlay')).toBeHidden();
    
    await testHelpers.takeScreenshot('dashboard-mobile');
  });

  test('should handle loading states', async ({ page }) => {
    // Delay API responses
    await page.route('**/api/courses/enrollments/my', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          enrollments: [],
          stats: { totalCourses: 0, completedCourses: 0, averageProgress: 0, totalWatchTime: 0 }
        })
      });
    });

    await page.goto('/dashboard');
    
    // Check loading states
    await expect(page.getByTestId('courses-loading')).toBeVisible();
    await expect(page.getByTestId('stats-loading')).toBeVisible();
    
    // Wait for loading to complete
    await testHelpers.waitForLoading();
    
    // Check loaded content
    await expect(page.getByTestId('enrolled-courses-section')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await testHelpers.mockApiResponse('/courses/enrollments/my', {
      message: 'Failed to fetch courses'
    }, 500);

    await page.goto('/dashboard');
    
    // Check error state
    await expect(page.getByTestId('courses-error')).toBeVisible();
    await expect(page.getByTestId('courses-error')).toContainText('Failed to load courses');
    await expect(page.getByTestId('retry-button')).toBeVisible();
    
    // Test retry functionality
    await testHelpers.mockApiResponse('/courses/enrollments/my', {
      enrollments: [],
      stats: { totalCourses: 0, completedCourses: 0, averageProgress: 0, totalWatchTime: 0 }
    });
    
    await page.getByTestId('retry-button').click();
    await expect(page.getByTestId('enrolled-courses-section')).toBeVisible();
  });

  test('should display recent activity', async ({ page }) => {
    // Mock recent activity data
    await testHelpers.mockApiResponse('/users/activity/recent', {
      activities: [
        {
          id: '1',
          type: 'lesson_completed',
          title: 'Completed: Introduction to AI',
          description: 'AI Transformation Manager - Chapter 1',
          timestamp: '2024-01-20T10:00:00Z'
        },
        {
          id: '2', 
          type: 'course_enrolled',
          title: 'Enrolled in No-Code Development',
          description: 'Started your learning journey',
          timestamp: '2024-01-15T14:30:00Z'
        }
      ]
    });

    await page.goto('/dashboard');
    
    // Check recent activity section
    await expect(page.getByTestId('recent-activity-section')).toBeVisible();
    await expect(page.getByTestId('recent-activity-title')).toContainText('Recent Activity');
    
    // Check activity items
    const activityItems = page.getByTestId('activity-item');
    await expect(activityItems).toHaveCount(2);
    
    const firstActivity = activityItems.first();
    await expect(firstActivity.getByTestId('activity-title')).toContainText('Completed: Introduction to AI');
    await expect(firstActivity.getByTestId('activity-description')).toContainText('AI Transformation Manager - Chapter 1');
  });

  test('should show progress indicators correctly', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check progress bars
    const progressBars = page.getByTestId('course-progress-bar');
    
    // First course should show 45% progress
    const firstProgress = progressBars.first();
    await expect(firstProgress).toHaveAttribute('aria-valuenow', '45');
    
    // Check progress text
    await expect(page.getByTestId('course-progress').first()).toContainText('45%');
  });

  test('should support keyboard navigation @accessibility', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Test keyboard navigation through sidebar
    await testHelpers.testKeyboardNavigation([
      'nav-dashboard',
      'nav-courses', 
      'nav-settings',
      'user-menu-trigger'
    ]);
    
    // Test keyboard access to course cards
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('continue-learning-btn').first()).toBeFocused();
  });

  test('should meet accessibility standards @accessibility', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check accessibility compliance
    await testHelpers.checkAccessibility();
    
    // Check ARIA labels on navigation
    await expect(page.getByTestId('sidebar-navigation')).toHaveAttribute('aria-label');
    await expect(page.getByTestId('user-menu-trigger')).toHaveAttribute('aria-label');
    
    // Check semantic navigation structure
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    
    // Check heading hierarchy
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should refresh data when navigating back to dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Navigate away and back
    await page.getByTestId('nav-courses').click();
    await page.getByTestId('nav-dashboard').click();
    
    // Should refresh data
    await expect(page.getByTestId('enrolled-courses-section')).toBeVisible();
    await expect(page.getByTestId('welcome-message')).toBeVisible();
  });
});