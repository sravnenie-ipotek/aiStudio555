// cypress/e2e/dashboard.cy.ts
/// <reference types="cypress" />
import { testUserFactory, testCourseFactory } from '../support/types';

describe('Dashboard Functionality', () => {
  const testUser = testUserFactory({
    email: 'dashboard@projectdes.ai',
    firstName: 'Dashboard',
    lastName: 'User',
  });

  const enrolledCourses = [
    testCourseFactory({
      id: 'enrolled-course-1',
      title: 'AI Transformation Manager',
      level: 'INTERMEDIATE',
    }),
    testCourseFactory({
      id: 'enrolled-course-2', 
      title: 'No-Code Website Development',
      level: 'BEGINNER',
    }),
  ];

  const mockEnrollments = [
    {
      id: 'enrollment-1',
      courseId: 'enrolled-course-1',
      status: 'ACTIVE',
      progress: 65,
      enrolledAt: '2024-01-01T10:00:00Z',
      lastAccessedAt: '2024-01-15T14:30:00Z',
      nextLesson: {
        id: 'lesson-15',
        title: 'Advanced AI Implementation Strategies',
        moduleTitle: 'Module 3: Implementation',
      },
    },
    {
      id: 'enrollment-2',
      courseId: 'enrolled-course-2',
      status: 'ACTIVE',
      progress: 25,
      enrolledAt: '2024-01-10T09:00:00Z',
      lastAccessedAt: '2024-01-12T11:20:00Z',
      nextLesson: {
        id: 'lesson-5',
        title: 'Building Your First No-Code Page',
        moduleTitle: 'Module 2: Getting Started',
      },
    },
  ];

  beforeEach(() => {
    cy.clearTestData();
    cy.seedTestData();
    
    // Mock user authentication
    cy.login();
    
    // Mock dashboard data
    cy.intercept('GET', '/api/dashboard', {
      statusCode: 200,
      body: {
        user: testUser,
        enrollments: mockEnrollments,
        courses: enrolledCourses,
        stats: {
          totalCourses: 2,
          completedCourses: 0,
          totalHoursStudied: 45.5,
          currentStreak: 7,
          certificates: 0,
        },
        recentActivity: [
          {
            id: 'activity-1',
            type: 'lesson_completed',
            courseId: 'enrolled-course-1',
            lessonTitle: 'Understanding AI Frameworks',
            completedAt: '2024-01-15T14:30:00Z',
          },
          {
            id: 'activity-2',
            type: 'module_started',
            courseId: 'enrolled-course-2',
            moduleTitle: 'Module 2: Getting Started',
            startedAt: '2024-01-12T11:20:00Z',
          },
        ],
        upcomingDeadlines: [
          {
            id: 'deadline-1',
            type: 'assignment',
            courseId: 'enrolled-course-1',
            title: 'AI Strategy Project',
            dueDate: '2024-01-20T23:59:59Z',
          },
        ],
        recommendations: [
          {
            id: 'rec-course-1',
            title: 'Advanced AI Analytics',
            reason: 'Based on your progress in AI Transformation Manager',
            level: 'ADVANCED',
          },
        ],
      },
    }).as('getDashboardData');
  });

  afterEach(() => {
    cy.clearTestData();
  });

  describe('Dashboard Overview', () => {
    beforeEach(() => {
      cy.visit('/dashboard');
      cy.wait('@getDashboardData');
      cy.waitForPageLoad();
    });

    it('should display dashboard correctly', () => {
      // Header and navigation
      cy.getByTestId('dashboard-title').should('be.visible').and('contain.text', 'Dashboard');
      cy.getByTestId('user-welcome').should('be.visible').and('contain.text', 'Welcome back, Dashboard');
      cy.getByTestId('dashboard-navigation').should('be.visible');

      // Main sections
      cy.getByTestId('dashboard-stats').should('be.visible');
      cy.getByTestId('enrolled-courses-section').should('be.visible');
      cy.getByTestId('recent-activity-section').should('be.visible');
      cy.getByTestId('quick-actions').should('be.visible');

      // Check accessibility
      cy.checkAccessibility();
      
      // Check meta tags
      cy.toHaveCorrectMetaTags();
    });

    it('should display user statistics correctly', () => {
      cy.getByTestId('dashboard-stats').within(() => {
        // Course statistics
        cy.getByTestId('total-courses-stat').should('contain.text', '2');
        cy.getByTestId('completed-courses-stat').should('contain.text', '0');
        cy.getByTestId('hours-studied-stat').should('contain.text', '45.5');
        cy.getByTestId('current-streak-stat').should('contain.text', '7');
        cy.getByTestId('certificates-stat').should('contain.text', '0');

        // Progress indicators
        cy.getByTestId('overall-progress-bar').should('be.visible');
        cy.getByTestId('weekly-progress-chart').should('be.visible');
      });
    });

    it('should display enrolled courses correctly', () => {
      cy.getByTestId('enrolled-courses-section').within(() => {
        cy.getByTestId('enrolled-course-card').should('have.length', 2);

        // First course
        cy.getByTestId('enrolled-course-card').first().within(() => {
          cy.getByTestId('course-title').should('contain.text', 'AI Transformation Manager');
          cy.getByTestId('course-level').should('contain.text', 'INTERMEDIATE');
          cy.getByTestId('course-progress').should('contain.text', '65%');
          cy.getByTestId('course-progress-bar').should('have.attr', 'aria-valuenow', '65');
          cy.getByTestId('next-lesson').should('contain.text', 'Advanced AI Implementation Strategies');
          cy.getByTestId('continue-learning-button').should('be.visible');
        });

        // Second course
        cy.getByTestId('enrolled-course-card').eq(1).within(() => {
          cy.getByTestId('course-title').should('contain.text', 'No-Code Website Development');
          cy.getByTestId('course-progress').should('contain.text', '25%');
          cy.getByTestId('next-lesson').should('contain.text', 'Building Your First No-Code Page');
        });
      });
    });

    it('should display recent activity timeline', () => {
      cy.getByTestId('recent-activity-section').within(() => {
        cy.getByTestId('activity-item').should('have.length', 2);

        // Recent lesson completion
        cy.getByTestId('activity-item').first().within(() => {
          cy.getByTestId('activity-type').should('contain.text', 'Lesson Completed');
          cy.getByTestId('activity-title').should('contain.text', 'Understanding AI Frameworks');
          cy.getByTestId('activity-timestamp').should('be.visible');
          cy.getByTestId('activity-course').should('contain.text', 'AI Transformation Manager');
        });

        // Module started
        cy.getByTestId('activity-item').eq(1).within(() => {
          cy.getByTestId('activity-type').should('contain.text', 'Module Started');
          cy.getByTestId('activity-title').should('contain.text', 'Module 2: Getting Started');
          cy.getByTestId('activity-course').should('contain.text', 'No-Code Website Development');
        });
      });
    });

    it('should display upcoming deadlines', () => {
      cy.getByTestId('upcoming-deadlines-section').should('be.visible').within(() => {
        cy.getByTestId('deadline-item').should('have.length', 1);
        
        cy.getByTestId('deadline-item').first().within(() => {
          cy.getByTestId('deadline-type').should('contain.text', 'Assignment');
          cy.getByTestId('deadline-title').should('contain.text', 'AI Strategy Project');
          cy.getByTestId('deadline-course').should('contain.text', 'AI Transformation Manager');
          cy.getByTestId('deadline-date').should('be.visible');
          cy.getByTestId('days-remaining').should('be.visible');
        });
      });
    });

    it('should show course recommendations', () => {
      cy.getByTestId('recommendations-section').should('be.visible').within(() => {
        cy.getByTestId('recommended-course').should('have.length', 1);
        
        cy.getByTestId('recommended-course').first().within(() => {
          cy.getByTestId('recommended-title').should('contain.text', 'Advanced AI Analytics');
          cy.getByTestId('recommendation-reason').should('contain.text', 'Based on your progress');
          cy.getByTestId('recommended-level').should('contain.text', 'ADVANCED');
          cy.getByTestId('view-course-button').should('be.visible');
        });
      });
    });

    it('should provide quick action buttons', () => {
      cy.getByTestId('quick-actions').within(() => {
        cy.getByTestId('browse-courses-action').should('be.visible');
        cy.getByTestId('view-certificates-action').should('be.visible');
        cy.getByTestId('profile-settings-action').should('be.visible');
        cy.getByTestId('help-support-action').should('be.visible');
      });
    });

    it('should be responsive across different screen sizes', () => {
      cy.testResponsiveness();

      // Test mobile layout
      cy.testOnMobile();
      cy.getByTestId('dashboard-mobile-menu').should('be.visible');
      cy.getByTestId('enrolled-courses-section').should('be.visible');
      
      // Check mobile-specific styling
      cy.get('body').should('not.have.css', 'overflow-x', 'scroll');
    });
  });

  describe('Course Progress and Navigation', () => {
    beforeEach(() => {
      cy.visit('/dashboard');
      cy.wait('@getDashboardData');
    });

    it('should navigate to course learning interface', () => {
      cy.getByTestId('enrolled-course-card').first().within(() => {
        cy.getByTestId('continue-learning-button').click();
      });

      // Should redirect to course learning interface
      cy.url().should('include', '/learn/enrolled-course-1');
    });

    it('should show detailed course progress', () => {
      cy.getByTestId('enrolled-course-card').first().within(() => {
        cy.getByTestId('view-progress-details').click();
      });

      // Should open progress modal or navigate to progress page
      cy.getByTestId('course-progress-modal, course-progress-page').should('be.visible');
      cy.getByTestId('module-progress-list').should('be.visible');
      cy.getByTestId('completed-lessons-count').should('be.visible');
      cy.getByTestId('time-spent').should('be.visible');
    });

    it('should allow resuming from last accessed lesson', () => {
      cy.intercept('GET', '/api/courses/enrolled-course-1/resume', {
        statusCode: 200,
        body: {
          lessonId: 'lesson-15',
          moduleId: 'module-3',
          position: { module: 3, lesson: 5 },
        },
      }).as('getResumePosition');

      cy.getByTestId('enrolled-course-card').first().within(() => {
        cy.getByTestId('resume-lesson-button').click();
      });

      cy.wait('@getResumePosition');

      // Should navigate to specific lesson
      cy.url().should('include', '/learn/enrolled-course-1/lesson/lesson-15');
    });

    it('should show course completion status', () => {
      // Mock completed course
      cy.intercept('GET', '/api/dashboard', {
        statusCode: 200,
        body: {
          user: testUser,
          enrollments: [{
            id: 'enrollment-completed',
            courseId: 'completed-course-1',
            status: 'COMPLETED',
            progress: 100,
            completedAt: '2024-01-15T10:00:00Z',
            certificate: {
              id: 'cert-123',
              issuedAt: '2024-01-15T10:00:00Z',
              downloadUrl: '/certificates/cert-123.pdf',
            },
          }],
          courses: [{
            id: 'completed-course-1',
            title: 'Completed Course',
          }],
          stats: {
            totalCourses: 1,
            completedCourses: 1,
            totalHoursStudied: 45.5,
            currentStreak: 7,
            certificates: 1,
          },
        },
      }).as('getCompletedCourseData');

      cy.visit('/dashboard');
      cy.wait('@getCompletedCourseData');

      // Should show completion badge and certificate
      cy.getByTestId('enrolled-course-card').within(() => {
        cy.getByTestId('completion-badge').should('be.visible');
        cy.getByTestId('download-certificate').should('be.visible');
        cy.getByTestId('course-rating-prompt').should('be.visible');
      });
    });

    it('should handle course access restrictions', () => {
      // Mock restricted course access
      cy.intercept('POST', '/api/courses/enrolled-course-1/access', {
        statusCode: 403,
        body: {
          error: 'Course access suspended',
          reason: 'Payment required',
          paymentUrl: '/payment/renew/enrolled-course-1',
        },
      }).as('checkCourseAccess');

      cy.getByTestId('enrolled-course-card').first().within(() => {
        cy.getByTestId('continue-learning-button').click();
      });

      cy.wait('@checkCourseAccess');

      // Should show access restriction message
      cy.getByTestId('access-restricted-modal').should('be.visible');
      cy.getByTestId('restriction-reason').should('contain.text', 'Payment required');
      cy.getByTestId('resolve-access-button').should('be.visible');
    });
  });

  describe('Learning Analytics and Progress Tracking', () => {
    beforeEach(() => {
      // Mock detailed analytics data
      cy.intercept('GET', '/api/dashboard/analytics', {
        statusCode: 200,
        body: {
          weeklyStudyTime: [
            { date: '2024-01-08', hours: 2.5 },
            { date: '2024-01-09', hours: 3.0 },
            { date: '2024-01-10', hours: 1.5 },
            { date: '2024-01-11', hours: 4.0 },
            { date: '2024-01-12', hours: 2.0 },
            { date: '2024-01-13', hours: 3.5 },
            { date: '2024-01-14', hours: 2.8 },
          ],
          monthlyProgress: {
            lessonsCompleted: 25,
            modulesCompleted: 4,
            averageScore: 87,
            timeSpent: 45.5,
          },
          learningStreak: {
            current: 7,
            longest: 12,
            thisMonth: 18,
          },
          achievements: [
            {
              id: 'achievement-1',
              title: 'First Module Complete',
              description: 'Completed your first course module',
              earnedAt: '2024-01-05T10:00:00Z',
              icon: 'module-complete',
            },
            {
              id: 'achievement-2', 
              title: 'One Week Streak',
              description: 'Studied for 7 consecutive days',
              earnedAt: '2024-01-14T23:59:59Z',
              icon: 'streak-7',
            },
          ],
        },
      }).as('getAnalyticsData');

      cy.visit('/dashboard');
      cy.wait('@getDashboardData');
    });

    it('should display learning analytics', () => {
      cy.getByTestId('view-analytics-button').click();
      cy.wait('@getAnalyticsData');

      cy.getByTestId('analytics-dashboard').should('be.visible');
      
      // Weekly study time chart
      cy.getByTestId('weekly-study-chart').should('be.visible');
      cy.getByTestId('chart-data-point').should('have.length', 7);

      // Monthly statistics
      cy.getByTestId('monthly-stats').within(() => {
        cy.getByTestId('lessons-completed').should('contain.text', '25');
        cy.getByTestId('modules-completed').should('contain.text', '4');
        cy.getByTestId('average-score').should('contain.text', '87%');
        cy.getByTestId('time-spent').should('contain.text', '45.5');
      });

      // Learning streak information
      cy.getByTestId('streak-info').within(() => {
        cy.getByTestId('current-streak').should('contain.text', '7 days');
        cy.getByTestId('longest-streak').should('contain.text', '12 days');
        cy.getByTestId('monthly-days').should('contain.text', '18 days');
      });
    });

    it('should show achievements and badges', () => {
      cy.getByTestId('view-analytics-button').click();
      cy.wait('@getAnalyticsData');

      cy.getByTestId('achievements-section').should('be.visible').within(() => {
        cy.getByTestId('achievement-item').should('have.length', 2);

        // First achievement
        cy.getByTestId('achievement-item').first().within(() => {
          cy.getByTestId('achievement-icon').should('be.visible');
          cy.getByTestId('achievement-title').should('contain.text', 'First Module Complete');
          cy.getByTestId('achievement-description').should('be.visible');
          cy.getByTestId('achievement-date').should('be.visible');
        });

        // Recent achievement
        cy.getByTestId('achievement-item').eq(1).within(() => {
          cy.getByTestId('achievement-title').should('contain.text', 'One Week Streak');
          cy.getByTestId('achievement-badge').should('have.class', 'recent');
        });
      });
    });

    it('should display progress goals and milestones', () => {
      cy.intercept('GET', '/api/dashboard/goals', {
        statusCode: 200,
        body: {
          weeklyGoal: {
            target: 10, // hours
            current: 7.5,
            progress: 75,
          },
          monthlyGoal: {
            target: 40, // hours
            current: 25.5,
            progress: 63.75,
          },
          courseGoals: [
            {
              courseId: 'enrolled-course-1',
              targetCompletionDate: '2024-02-15',
              currentProgress: 65,
              recommendedWeeklyHours: 5,
              onTrack: true,
            },
          ],
        },
      }).as('getGoalsData');

      cy.getByTestId('view-goals-button').click();
      cy.wait('@getGoalsData');

      cy.getByTestId('goals-dashboard').should('be.visible');

      // Weekly goal
      cy.getByTestId('weekly-goal').within(() => {
        cy.getByTestId('goal-progress-bar').should('have.attr', 'aria-valuenow', '75');
        cy.getByTestId('goal-current').should('contain.text', '7.5 hours');
        cy.getByTestId('goal-target').should('contain.text', '10 hours');
      });

      // Course-specific goals
      cy.getByTestId('course-goal').first().within(() => {
        cy.getByTestId('target-date').should('contain.text', 'Feb 15, 2024');
        cy.getByTestId('on-track-indicator').should('be.visible');
        cy.getByTestId('recommended-hours').should('contain.text', '5 hours/week');
      });
    });
  });

  describe('Dashboard Customization', () => {
    beforeEach(() => {
      cy.visit('/dashboard');
      cy.wait('@getDashboardData');
    });

    it('should allow customizing dashboard layout', () => {
      cy.getByTestId('customize-dashboard-button').click();

      cy.getByTestId('customization-panel').should('be.visible').within(() => {
        // Widget toggles
        cy.getByTestId('toggle-recent-activity').should('be.visible');
        cy.getByTestId('toggle-recommendations').should('be.visible');
        cy.getByTestId('toggle-upcoming-deadlines').should('be.visible');
        cy.getByTestId('toggle-quick-actions').should('be.visible');

        // Layout options
        cy.getByTestId('layout-compact').should('be.visible');
        cy.getByTestId('layout-expanded').should('be.visible');
        cy.getByTestId('layout-cards').should('be.visible');
      });

      // Test hiding a widget
      cy.getByTestId('toggle-recent-activity').click();
      cy.getByTestId('save-customization').click();

      // Widget should be hidden
      cy.getByTestId('recent-activity-section').should('not.exist');
    });

    it('should save dashboard preferences', () => {
      cy.intercept('POST', '/api/dashboard/preferences', {
        statusCode: 200,
        body: { saved: true },
      }).as('savePreferences');

      cy.getByTestId('customize-dashboard-button').click();
      cy.getByTestId('layout-compact').click();
      cy.getByTestId('save-customization').click();

      cy.wait('@savePreferences');

      // Should show success message
      cy.getByTestId('preferences-saved').should('be.visible');

      // Should apply new layout
      cy.getByTestId('dashboard-container').should('have.class', 'layout-compact');
    });

    it('should reset dashboard to default', () => {
      cy.getByTestId('customize-dashboard-button').click();
      cy.getByTestId('reset-to-default').click();

      cy.getByTestId('confirm-reset').click();

      // Should restore default layout
      cy.getByTestId('recent-activity-section').should('be.visible');
      cy.getByTestId('recommendations-section').should('be.visible');
      cy.getByTestId('upcoming-deadlines-section').should('be.visible');
    });
  });

  describe('Notifications and Messages', () => {
    beforeEach(() => {
      // Mock notifications
      cy.intercept('GET', '/api/notifications', {
        statusCode: 200,
        body: {
          unreadCount: 3,
          notifications: [
            {
              id: 'notif-1',
              type: 'course_update',
              title: 'New lesson available',
              message: 'A new lesson has been added to AI Transformation Manager',
              courseId: 'enrolled-course-1',
              createdAt: '2024-01-15T10:00:00Z',
              read: false,
            },
            {
              id: 'notif-2',
              type: 'assignment_due',
              title: 'Assignment due soon',
              message: 'AI Strategy Project is due in 2 days',
              courseId: 'enrolled-course-1',
              dueDate: '2024-01-18T23:59:59Z',
              createdAt: '2024-01-16T09:00:00Z',
              read: false,
            },
            {
              id: 'notif-3',
              type: 'achievement',
              title: 'Achievement unlocked!',
              message: 'You earned the "One Week Streak" badge',
              createdAt: '2024-01-14T23:59:59Z',
              read: true,
            },
          ],
        },
      }).as('getNotifications');

      cy.visit('/dashboard');
      cy.wait('@getDashboardData');
      cy.wait('@getNotifications');
    });

    it('should display notification indicator', () => {
      // Should show unread count
      cy.getByTestId('notification-bell').should('be.visible');
      cy.getByTestId('notification-count').should('contain.text', '3');
    });

    it('should show notifications panel', () => {
      cy.getByTestId('notification-bell').click();

      cy.getByTestId('notifications-panel').should('be.visible').within(() => {
        cy.getByTestId('notification-item').should('have.length', 3);

        // Unread notification
        cy.getByTestId('notification-item').first().within(() => {
          cy.getByTestId('notification-title').should('contain.text', 'New lesson available');
          cy.getByTestId('notification-message').should('be.visible');
          cy.getByTestId('notification-timestamp').should('be.visible');
          cy.getByTestId('unread-indicator').should('be.visible');
        });

        // Mark as read button
        cy.getByTestId('mark-all-read').should('be.visible');
      });
    });

    it('should mark notifications as read', () => {
      cy.intercept('PUT', '/api/notifications/notif-1/read', {
        statusCode: 200,
        body: { read: true },
      }).as('markNotificationRead');

      cy.getByTestId('notification-bell').click();

      cy.getByTestId('notification-item').first().within(() => {
        cy.getByTestId('mark-read-button').click();
      });

      cy.wait('@markNotificationRead');

      // Should remove unread indicator
      cy.getByTestId('notification-item').first().within(() => {
        cy.getByTestId('unread-indicator').should('not.exist');
      });

      // Should update count
      cy.getByTestId('notification-count').should('contain.text', '2');
    });

    it('should navigate to course from notification', () => {
      cy.getByTestId('notification-bell').click();

      cy.getByTestId('notification-item').first().within(() => {
        cy.getByTestId('notification-action').click();
      });

      // Should navigate to relevant course
      cy.url().should('include', '/learn/enrolled-course-1');
    });
  });

  describe('Search and Filtering', () => {
    beforeEach(() => {
      cy.visit('/dashboard');
      cy.wait('@getDashboardData');
    });

    it('should search enrolled courses', () => {
      cy.getByTestId('course-search').type('AI Transformation');

      // Should filter course cards
      cy.getByTestId('enrolled-course-card').should('have.length', 1);
      cy.getByTestId('enrolled-course-card').first()
        .should('contain.text', 'AI Transformation Manager');
    });

    it('should filter courses by status', () => {
      cy.getByTestId('course-status-filter').select('in-progress');

      // Should show only in-progress courses
      cy.getByTestId('enrolled-course-card').each(($card) => {
        cy.wrap($card).within(() => {
          cy.getByTestId('course-progress').should('not.contain.text', '100%');
        });
      });
    });

    it('should filter by course level', () => {
      cy.getByTestId('course-level-filter').select('INTERMEDIATE');

      cy.getByTestId('enrolled-course-card').should('have.length', 1);
      cy.getByTestId('enrolled-course-card').first()
        .should('contain.text', 'AI Transformation Manager');
    });

    it('should clear all filters', () => {
      // Apply filters
      cy.getByTestId('course-search').type('AI');
      cy.getByTestId('course-level-filter').select('INTERMEDIATE');

      // Clear filters
      cy.getByTestId('clear-filters').click();

      // Should show all courses
      cy.getByTestId('enrolled-course-card').should('have.length', 2);
      cy.getByTestId('course-search').should('have.value', '');
      cy.getByTestId('course-level-filter').should('have.value', 'all');
    });
  });

  describe('Dashboard Performance and Loading', () => {
    beforeEach(() => {
      // Mock slow loading data
      cy.intercept('GET', '/api/dashboard', (req) => {
        req.reply((res) => {
          res.delay(2000); // 2 second delay
          res.send({
            statusCode: 200,
            body: {
              user: testUser,
              enrollments: mockEnrollments,
              courses: enrolledCourses,
              stats: {
                totalCourses: 2,
                completedCourses: 0,
                totalHoursStudied: 45.5,
                currentStreak: 7,
                certificates: 0,
              },
            },
          });
        });
      }).as('getSlowDashboardData');
    });

    it('should show loading states', () => {
      cy.visit('/dashboard');

      // Should show loading skeletons
      cy.getByTestId('dashboard-loading').should('be.visible');
      cy.getByTestId('stats-skeleton').should('be.visible');
      cy.getByTestId('courses-skeleton').should('be.visible');

      cy.wait('@getSlowDashboardData');

      // Should hide loading states
      cy.getByTestId('dashboard-loading').should('not.exist');
      cy.getByTestId('enrolled-courses-section').should('be.visible');
    });

    it('should handle dashboard loading errors', () => {
      cy.intercept('GET', '/api/dashboard', {
        statusCode: 500,
        body: { error: 'Internal server error' },
      }).as('getDashboardError');

      cy.visit('/dashboard');
      cy.wait('@getDashboardError');

      // Should show error message
      cy.getByTestId('dashboard-error').should('be.visible')
        .and('contain.text', 'Unable to load dashboard');
      
      // Should show retry button
      cy.getByTestId('retry-dashboard').should('be.visible');
    });

    it('should retry loading dashboard data', () => {
      // First request fails
      cy.intercept('GET', '/api/dashboard', {
        statusCode: 500,
        body: { error: 'Server error' },
      }).as('getDashboardError');

      cy.visit('/dashboard');
      cy.wait('@getDashboardError');

      // Second request succeeds
      cy.intercept('GET', '/api/dashboard', {
        statusCode: 200,
        body: {
          user: testUser,
          enrollments: mockEnrollments,
          courses: enrolledCourses,
          stats: {
            totalCourses: 2,
            completedCourses: 0,
            totalHoursStudied: 45.5,
            currentStreak: 7,
            certificates: 0,
          },
        },
      }).as('getDashboardRetrySuccess');

      cy.getByTestId('retry-dashboard').click();
      cy.wait('@getDashboardRetrySuccess');

      // Should show dashboard content
      cy.getByTestId('enrolled-courses-section').should('be.visible');
      cy.getByTestId('dashboard-error').should('not.exist');
    });
  });

  describe('Dashboard Accessibility', () => {
    beforeEach(() => {
      cy.visit('/dashboard');
      cy.wait('@getDashboardData');
    });

    it('should be keyboard navigable', () => {
      // Tab through main navigation
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid').and('contain', 'dashboard-nav');

      // Tab to course cards
      cy.focused().tab().tab();
      cy.focused().should('have.attr', 'data-testid').and('contain', 'enrolled-course');

      // Tab to action buttons
      cy.focused().tab();
      cy.focused().should('have.attr', 'data-testid').and('contain', 'continue-learning');
    });

    it('should have proper ARIA labels and roles', () => {
      // Main sections should have proper roles
      cy.getByTestId('dashboard-stats').should('have.attr', 'role', 'region');
      cy.getByTestId('enrolled-courses-section').should('have.attr', 'role', 'region');
      
      // Progress bars should have proper ARIA attributes
      cy.getByTestId('course-progress-bar').should('have.attr', 'role', 'progressbar');
      cy.getByTestId('course-progress-bar').should('have.attr', 'aria-valuenow');
      cy.getByTestId('course-progress-bar').should('have.attr', 'aria-valuemax', '100');

      // Interactive elements should have labels
      cy.getByTestId('continue-learning-button').should('have.attr', 'aria-label');
      cy.getByTestId('notification-bell').should('have.attr', 'aria-label');
    });

    it('should support screen reader announcements', () => {
      // Should have live regions for dynamic content
      cy.getByTestId('dashboard-announcements').should('have.attr', 'aria-live', 'polite');
      
      // Should announce progress updates
      cy.getByTestId('enrolled-course-card').first().within(() => {
        cy.getByTestId('course-progress').should('have.attr', 'aria-describedby');
      });
    });

    it('should work with high contrast mode', () => {
      // Enable high contrast mode simulation
      cy.get('body').invoke('addClass', 'high-contrast');

      // Check that elements are still visible and distinguishable
      cy.getByTestId('enrolled-course-card').should('be.visible');
      cy.getByTestId('course-progress-bar').should('be.visible');
      cy.getByTestId('continue-learning-button').should('be.visible');
    });
  });

  describe('Mobile Dashboard Experience', () => {
    beforeEach(() => {
      cy.testOnMobile();
      cy.visit('/dashboard');
      cy.wait('@getDashboardData');
    });

    it('should adapt layout for mobile', () => {
      // Should show mobile-specific navigation
      cy.getByTestId('mobile-dashboard-nav').should('be.visible');
      cy.getByTestId('desktop-sidebar').should('not.be.visible');

      // Course cards should stack vertically
      cy.getByTestId('enrolled-courses-grid').should('have.class', 'mobile-stack');
      
      // Stats should be horizontally scrollable
      cy.getByTestId('dashboard-stats').should('have.css', 'overflow-x', 'auto');
    });

    it('should work with touch interactions', () => {
      // Test swipe gestures on course cards
      cy.getByTestId('enrolled-course-card').first()
        .trigger('touchstart', { touches: [{ clientX: 100, clientY: 100 }] })
        .trigger('touchmove', { touches: [{ clientX: 200, clientY: 100 }] })
        .trigger('touchend');

      // Should reveal action buttons or show swipe actions
      cy.getByTestId('course-actions-panel').should('be.visible');
    });

    it('should maintain performance on mobile', () => {
      // Should lazy load course thumbnails
      cy.getByTestId('course-thumbnail').should('have.attr', 'loading', 'lazy');
      
      // Should use optimized images for mobile
      cy.getByTestId('course-thumbnail').should('have.attr', 'src')
        .and('match', /mobile|small|thumb/);
    });
  });
});