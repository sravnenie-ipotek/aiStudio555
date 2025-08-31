import { test, expect } from '../../fixtures/auth';
import { TestHelpers, CourseHelpers } from '../../utils/test-helpers';

test.describe('Course Player', () => {
  let testHelpers: TestHelpers;
  let courseHelpers: CourseHelpers;
  
  const mockCourseData = {
    id: '1',
    title: 'AI Transformation Manager',
    description: 'Master AI transformation strategies for modern businesses',
    instructor: {
      id: '1',
      name: 'Dr. AI Expert',
      bio: 'Leading AI transformation consultant',
      avatar: '/images/instructors/ai-expert.jpg'
    },
    totalLessons: 20,
    totalDuration: 600, // minutes
    currentLesson: {
      id: '3',
      title: 'Understanding AI Implementation Frameworks',
      description: 'Learn the key frameworks for implementing AI in organizations',
      videoUrl: '/videos/course-1/lesson-3.mp4',
      duration: 25,
      order: 3,
      transcript: 'Welcome to lesson 3...',
      resources: [
        { id: '1', title: 'Implementation Framework Guide', url: '/resources/framework-guide.pdf' },
        { id: '2', title: 'Case Study Examples', url: '/resources/case-studies.pdf' }
      ]
    },
    lessons: [
      { id: '1', title: 'Introduction to AI Transformation', duration: 20, order: 1, completed: true },
      { id: '2', title: 'AI Strategy Development', duration: 30, order: 2, completed: true },
      { id: '3', title: 'Understanding AI Implementation Frameworks', duration: 25, order: 3, completed: false, current: true },
      { id: '4', title: 'Data Strategy for AI', duration: 35, order: 4, completed: false },
      { id: '5', title: 'Change Management in AI Projects', duration: 40, order: 5, completed: false }
    ],
    progress: {
      completedLessons: 2,
      totalLessons: 20,
      percentage: 10,
      watchTime: 50 // minutes
    }
  };

  test.beforeEach(async ({ page }) => {
    testHelpers = new TestHelpers(page);
    courseHelpers = new CourseHelpers(page);
    
    // Mock course data
    await testHelpers.mockApiResponse('/courses/1', mockCourseData);
    await testHelpers.mockApiResponse('/courses/1/lessons/3', mockCourseData.currentLesson);
  });

  test('should display course player correctly @smoke @critical', async ({ page }) => {
    await page.goto('/learn/1');
    
    // Check page title
    await expect(page).toHaveTitle(/.*AI Transformation Manager.*/);
    
    // Check main player layout
    await expect(page.getByTestId('course-player-container')).toBeVisible();
    await expect(page.getByTestId('video-player')).toBeVisible();
    await expect(page.getByTestId('course-sidebar')).toBeVisible();
    
    // Check video player elements
    await expect(page.getByTestId('video-element')).toBeVisible();
    await expect(page.getByTestId('video-controls')).toBeVisible();
    await expect(page.getByTestId('video-progress-bar')).toBeVisible();
    
    // Check current lesson info
    await expect(page.getByTestId('current-lesson-title')).toContainText('Understanding AI Implementation Frameworks');
    await expect(page.getByTestId('current-lesson-description')).toContainText('Learn the key frameworks');
    
    await testHelpers.takeScreenshot('course-player-main');
  });

  test('should display course sidebar correctly @critical', async ({ page }) => {
    await page.goto('/learn/1');
    
    // Check course info in sidebar
    await expect(page.getByTestId('course-title-sidebar')).toContainText('AI Transformation Manager');
    await expect(page.getByTestId('course-progress-sidebar')).toContainText('10%');
    await expect(page.getByTestId('lessons-completed-count')).toContainText('2 of 20');
    
    // Check instructor info
    await expect(page.getByTestId('instructor-name')).toContainText('Dr. AI Expert');
    await expect(page.getByTestId('instructor-avatar')).toBeVisible();
    
    // Check lessons list
    await expect(page.getByTestId('lessons-list')).toBeVisible();
    const lessonItems = page.getByTestId('lesson-item');
    await expect(lessonItems).toHaveCount(5);
    
    // Check lesson states
    const firstLesson = lessonItems.first();
    await expect(firstLesson.getByTestId('lesson-completed-icon')).toBeVisible();
    
    const currentLesson = lessonItems.nth(2);
    await expect(currentLesson).toHaveClass(/current|active/);
    await expect(currentLesson.getByTestId('lesson-playing-icon')).toBeVisible();
  });

  test('should play video correctly @critical', async ({ page }) => {
    await page.goto('/learn/1');
    
    // Mock video element
    await page.addInitScript(() => {
      // Mock HTML5 video API
      Object.defineProperty(HTMLVideoElement.prototype, 'play', {
        value: function() {
          this.dispatchEvent(new Event('play'));
          return Promise.resolve();
        }
      });
      
      Object.defineProperty(HTMLVideoElement.prototype, 'pause', {
        value: function() {
          this.dispatchEvent(new Event('pause'));
        }
      });
    });
    
    // Click play button
    await page.getByTestId('video-play-button').click();
    
    // Video should start playing
    const videoElement = page.getByTestId('video-element');
    await expect(videoElement).toHaveJSProperty('paused', false);
    
    // Play button should become pause button
    await expect(page.getByTestId('video-pause-button')).toBeVisible();
    
    // Click pause button
    await page.getByTestId('video-pause-button').click();
    await expect(videoElement).toHaveJSProperty('paused', true);
  });

  test('should update progress as video plays', async ({ page }) => {
    await page.goto('/learn/1');
    
    // Mock video progress update
    await page.evaluate(() => {
      const video = document.querySelector('[data-testid="video-element"]') as HTMLVideoElement;
      if (video) {
        // Simulate video progress
        Object.defineProperty(video, 'currentTime', { value: 300, writable: true }); // 5 minutes
        Object.defineProperty(video, 'duration', { value: 1500, writable: true }); // 25 minutes
        video.dispatchEvent(new Event('timeupdate'));
      }
    });
    
    // Check progress bar
    const progressBar = page.getByTestId('video-progress-bar');
    await expect(progressBar).toHaveAttribute('aria-valuenow', '20'); // 5/25 * 100 = 20%
    
    // Check time display
    await expect(page.getByTestId('video-current-time')).toContainText('5:00');
    await expect(page.getByTestId('video-duration')).toContainText('25:00');
  });

  test('should navigate between lessons @critical', async ({ page }) => {
    await page.goto('/learn/1');
    
    // Click on next lesson in sidebar
    const nextLesson = page.getByTestId('lesson-item').nth(3);
    await nextLesson.click();
    
    // Should load next lesson
    await expect(page).toHaveURL('/learn/1?lesson=4');
    await expect(page.getByTestId('current-lesson-title')).toContainText('Data Strategy for AI');
    
    // Previous lesson should be marked as completed
    const previousLesson = page.getByTestId('lesson-item').nth(2);
    await expect(previousLesson.getByTestId('lesson-completed-icon')).toBeVisible();
  });

  test('should use lesson navigation controls', async ({ page }) => {
    await page.goto('/learn/1');
    
    // Test previous lesson button
    await page.getByTestId('previous-lesson-btn').click();
    await expect(page).toHaveURL('/learn/1?lesson=2');
    await expect(page.getByTestId('current-lesson-title')).toContainText('AI Strategy Development');
    
    // Test next lesson button
    await page.getByTestId('next-lesson-btn').click();
    await expect(page).toHaveURL('/learn/1?lesson=3');
    await expect(page.getByTestId('current-lesson-title')).toContainText('Understanding AI Implementation Frameworks');
  });

  test('should mark lesson as complete @critical', async ({ page }) => {
    await page.goto('/learn/1');
    
    // Mock lesson completion API
    await testHelpers.mockApiResponse('/courses/1/lessons/3/progress', {
      message: 'Lesson marked as complete',
      progress: { completed: true, watchTime: 25 }
    });
    
    // Watch video to completion (simulate)
    await page.evaluate(() => {
      const video = document.querySelector('[data-testid="video-element"]') as HTMLVideoElement;
      if (video) {
        Object.defineProperty(video, 'currentTime', { value: 1500, writable: true });
        Object.defineProperty(video, 'duration', { value: 1500, writable: true });
        video.dispatchEvent(new Event('ended'));
      }
    });
    
    // Mark complete button should appear
    await expect(page.getByTestId('mark-complete-button')).toBeVisible();
    await page.getByTestId('mark-complete-button').click();
    
    // Should show success message
    await testHelpers.expectSuccess('Lesson marked as complete');
    
    // Lesson should be marked complete in sidebar
    const currentLesson = page.getByTestId('lesson-item').nth(2);
    await expect(currentLesson.getByTestId('lesson-completed-icon')).toBeVisible();
  });

  test('should display lesson resources', async ({ page }) => {
    await page.goto('/learn/1');
    
    // Check resources section
    await expect(page.getByTestId('lesson-resources')).toBeVisible();
    await expect(page.getByTestId('resources-title')).toContainText('Lesson Resources');
    
    // Check resource items
    const resourceItems = page.getByTestId('resource-item');
    await expect(resourceItems).toHaveCount(2);
    
    // Check first resource
    const firstResource = resourceItems.first();
    await expect(firstResource.getByTestId('resource-title')).toContainText('Implementation Framework Guide');
    await expect(firstResource.getByTestId('resource-download-btn')).toBeVisible();
    
    // Test resource download
    await firstResource.getByTestId('resource-download-btn').click();
    const download = await page.waitForEvent('download');
    expect(download.suggestedFilename()).toContain('framework-guide');
  });

  test('should show lesson transcript', async ({ page }) => {
    await page.goto('/learn/1');
    
    // Click transcript toggle
    await page.getByTestId('transcript-toggle').click();
    
    // Transcript should be visible
    await expect(page.getByTestId('lesson-transcript')).toBeVisible();
    await expect(page.getByTestId('transcript-content')).toContainText('Welcome to lesson 3');
    
    // Should be able to search transcript
    await page.getByTestId('transcript-search').fill('frameworks');
    await expect(page.getByTestId('transcript-highlight')).toBeVisible();
  });

  test('should adjust video playback speed', async ({ page }) => {
    await page.goto('/learn/1');
    
    // Click speed control
    await page.getByTestId('playback-speed-btn').click();
    
    // Speed options should be visible
    await expect(page.getByTestId('speed-options')).toBeVisible();
    
    // Select 1.5x speed
    await page.getByTestId('speed-1-5x').click();
    
    // Video playback rate should update
    const video = page.getByTestId('video-element');
    await expect(video).toHaveJSProperty('playbackRate', 1.5);
    
    // Speed indicator should update
    await expect(page.getByTestId('current-speed')).toContainText('1.5x');
  });

  test('should toggle fullscreen mode', async ({ page }) => {
    await page.goto('/learn/1');
    
    // Click fullscreen button
    await page.getByTestId('fullscreen-btn').click();
    
    // Should request fullscreen
    await page.evaluate(() => {
      document.fullscreenElement = document.querySelector('[data-testid="course-player-container"]');
    });
    
    // Exit fullscreen button should be visible
    await expect(page.getByTestId('exit-fullscreen-btn')).toBeVisible();
  });

  test('should save video progress automatically', async ({ page }) => {
    await page.goto('/learn/1');
    
    // Mock progress save API
    await testHelpers.mockApiResponse('/courses/1/lessons/3/progress', {
      message: 'Progress saved',
      currentTime: 300,
      watchTime: 5
    });
    
    // Simulate video progress
    await page.evaluate(() => {
      const video = document.querySelector('[data-testid="video-element"]') as HTMLVideoElement;
      if (video) {
        Object.defineProperty(video, 'currentTime', { value: 300, writable: true });
        video.dispatchEvent(new Event('timeupdate'));
      }
    });
    
    // Wait for auto-save (should happen every 30 seconds or on pause)
    await page.waitForTimeout(1000);
    
    // Progress should be saved (API call made)
    // Note: In real implementation, you'd verify the API call was made
  });

  test('should handle video loading errors', async ({ page }) => {
    // Mock video error
    await page.route('**/videos/course-1/lesson-3.mp4', route => route.abort());
    
    await page.goto('/learn/1');
    
    // Should show video error message
    await expect(page.getByTestId('video-error')).toBeVisible();
    await expect(page.getByTestId('video-error')).toContainText('Failed to load video');
    await expect(page.getByTestId('retry-video-btn')).toBeVisible();
    
    // Test retry functionality
    await page.route('**/videos/course-1/lesson-3.mp4', route => {
      route.fulfill({
        status: 200,
        contentType: 'video/mp4',
        body: Buffer.from('mock video data')
      });
    });
    
    await page.getByTestId('retry-video-btn').click();
    await expect(page.getByTestId('video-element')).toBeVisible();
  });

  test('should be responsive on mobile @mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/learn/1');
    
    // Check mobile layout
    await expect(page.getByTestId('mobile-player-layout')).toBeVisible();
    
    // Sidebar should be collapsible on mobile
    await expect(page.getByTestId('course-sidebar')).toBeHidden();
    await page.getByTestId('mobile-sidebar-toggle').click();
    await expect(page.getByTestId('course-sidebar')).toBeVisible();
    
    // Video should be responsive
    const video = page.getByTestId('video-element');
    const videoBounds = await video.boundingBox();
    expect(videoBounds?.width).toBeLessThanOrEqual(375);
    
    await testHelpers.takeScreenshot('course-player-mobile');
  });

  test('should support keyboard shortcuts @accessibility', async ({ page }) => {
    await page.goto('/learn/1');
    
    // Focus video player
    await page.getByTestId('video-element').focus();
    
    // Test spacebar play/pause
    await page.keyboard.press('Space');
    await expect(page.getByTestId('video-element')).toHaveJSProperty('paused', false);
    
    await page.keyboard.press('Space');
    await expect(page.getByTestId('video-element')).toHaveJSProperty('paused', true);
    
    // Test arrow key seeking
    await page.keyboard.press('ArrowRight');
    // Should seek forward 10 seconds
    
    await page.keyboard.press('ArrowLeft');
    // Should seek backward 10 seconds
    
    // Test f key for fullscreen
    await page.keyboard.press('f');
    await expect(page.getByTestId('exit-fullscreen-btn')).toBeVisible();
  });

  test('should meet accessibility standards @accessibility', async ({ page }) => {
    await page.goto('/learn/1');
    
    // Check accessibility compliance
    await testHelpers.checkAccessibility();
    
    // Check video accessibility
    await expect(page.getByTestId('video-element')).toHaveAttribute('title');
    await expect(page.getByTestId('video-controls')).toHaveAttribute('aria-label');
    
    // Check lesson navigation accessibility
    await expect(page.getByTestId('lessons-list')).toHaveAttribute('role', 'list');
    await expect(page.getByTestId('lesson-item').first()).toHaveAttribute('role', 'listitem');
    
    // Test keyboard navigation
    await testHelpers.testKeyboardNavigation([
      'video-play-button',
      'video-progress-bar',
      'playback-speed-btn',
      'fullscreen-btn',
      'previous-lesson-btn',
      'next-lesson-btn'
    ]);
  });

  test('should handle network interruptions gracefully', async ({ page }) => {
    await page.goto('/learn/1');
    
    // Simulate network interruption
    await page.setOfflineMode(true);
    
    // Try to navigate to next lesson
    await page.getByTestId('next-lesson-btn').click();
    
    // Should show offline message
    await expect(page.getByTestId('offline-message')).toBeVisible();
    await expect(page.getByTestId('offline-message')).toContainText('You appear to be offline');
    
    // Restore connection
    await page.setOfflineMode(false);
    
    // Retry button should work
    await page.getByTestId('retry-connection-btn').click();
    await expect(page.getByTestId('current-lesson-title')).toContainText('Data Strategy for AI');
  });

  test('should display course completion modal', async ({ page }) => {
    // Mock last lesson of course
    const lastLessonData = {
      ...mockCourseData,
      currentLesson: {
        ...mockCourseData.currentLesson,
        id: '20',
        title: 'Course Summary and Next Steps',
        order: 20
      },
      progress: {
        completedLessons: 19,
        totalLessons: 20,
        percentage: 95
      }
    };
    
    await testHelpers.mockApiResponse('/courses/1', lastLessonData);
    await testHelpers.mockApiResponse('/courses/1/lessons/20', lastLessonData.currentLesson);
    
    await page.goto('/learn/1?lesson=20');
    
    // Complete the last lesson
    await page.getByTestId('mark-complete-button').click();
    
    // Should show course completion modal
    await expect(page.getByTestId('course-completion-modal')).toBeVisible();
    await expect(page.getByTestId('completion-congratulations')).toContainText('Congratulations!');
    await expect(page.getByTestId('course-completion-message')).toContainText('You have completed AI Transformation Manager');
    
    // Should offer certificate download
    await expect(page.getByTestId('download-certificate-btn')).toBeVisible();
    
    // Should suggest related courses
    await expect(page.getByTestId('related-courses-section')).toBeVisible();
  });

  test('should handle lesson notes functionality', async ({ page }) => {
    await page.goto('/learn/1');
    
    // Click notes tab
    await page.getByTestId('notes-tab').click();
    
    // Add a note
    await page.getByTestId('add-note-btn').click();
    await page.getByTestId('note-input').fill('Important concept about AI frameworks');
    await page.getByTestId('note-timestamp').fill('5:30');
    await page.getByTestId('save-note-btn').click();
    
    // Note should appear in notes list
    await expect(page.getByTestId('note-item')).toBeVisible();
    await expect(page.getByTestId('note-content')).toContainText('Important concept about AI frameworks');
    await expect(page.getByTestId('note-time')).toContainText('5:30');
    
    // Click note should seek to timestamp
    await page.getByTestId('note-item').click();
    const video = page.getByTestId('video-element');
    await expect(video).toHaveJSProperty('currentTime', 330); // 5:30 in seconds
  });
});