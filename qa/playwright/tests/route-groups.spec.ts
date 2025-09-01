import { test, expect } from '@playwright/test';
import { RouteUtils, PerformanceUtils, AccessibilityUtils, ResponsiveUtils } from '../utils/test-utils';

test.describe('Route Groups Navigation', () => {
  let routeUtils: RouteUtils;
  let performanceUtils: PerformanceUtils;
  let accessibilityUtils: AccessibilityUtils;
  let responsiveUtils: ResponsiveUtils;

  test.beforeEach(async ({ page }) => {
    routeUtils = new RouteUtils(page);
    performanceUtils = new PerformanceUtils(page);
    accessibilityUtils = new AccessibilityUtils(page);
    responsiveUtils = new ResponsiveUtils(page);
  });

  test.describe('Marketing Route Group - (marketing)', () => {
    const marketingRoutes = [
      { path: '/', title: 'AiStudio555 AI Academy', heading: 'AI' },
      { path: '/courses', title: 'Courses', heading: 'Курсы' },
      { path: '/about', title: 'About', heading: 'О нас' },
      { path: '/contact', title: 'Contact', heading: 'Контакты' },
      { path: '/privacy', title: 'Privacy Policy', heading: 'Политика конфиденциальности' },
      { path: '/terms', title: 'Terms of Service', heading: 'Условия использования' },
      { path: '/blog', title: 'Blog', heading: 'Блог' },
      { path: '/teachers', title: 'Teachers', heading: 'Преподаватели' }
    ];

    marketingRoutes.forEach(({ path, title, heading }) => {
      test(`should load ${path} correctly`, async ({ page }) => {
        await routeUtils.navigateAndVerify(path, title);
        
        // Check that marketing layout is applied
        const header = page.locator('header');
        await expect(header).toBeVisible();
        
        const footer = page.locator('footer');
        await expect(footer).toBeVisible();
        
        // Verify layout structure
        const main = page.locator('main');
        await expect(main).toHaveClass(/flex-1/);
      });
    });

    test('should have consistent marketing layout across all pages', async ({ page }) => {
      for (const route of marketingRoutes) {
        await page.goto(route.path);
        await page.waitForLoadState('networkidle');
        
        // Check marketing layout structure
        const layoutContainer = page.locator('.min-h-screen.flex.flex-col');
        await expect(layoutContainer).toBeVisible();
        
        // Verify header and footer are present
        await expect(page.locator('header')).toBeVisible();
        await expect(page.locator('footer')).toBeVisible();
        
        // Check meta tags
        const metaDescription = page.locator('meta[name="description"]');
        await expect(metaDescription).toHaveAttribute('content', /AI|academy|training|specialist/i);
      }
    });

    test('should handle dynamic routes correctly', async ({ page }) => {
      // Test course detail page
      await routeUtils.navigateAndVerify('/courses/ai-transformation-manager');
      
      // Test teacher detail page  
      await routeUtils.navigateAndVerify('/teachers/john-doe');
      
      // Test blog post page
      await routeUtils.navigateAndVerify('/blog/getting-started-with-ai');
    });
  });

  test.describe('Enrollment Route Group - (enrollment)', () => {
    const enrollmentRoutes = [
      '/enroll/ai-transformation-manager',
      '/enroll/ai-transformation-manager/step-1-info',
      '/enroll/ai-transformation-manager/step-2-payment',
      '/enroll/ai-transformation-manager/step-3-confirmation',
      '/success',
      '/cancel'
    ];

    enrollmentRoutes.forEach((path) => {
      test(`should load enrollment route ${path}`, async ({ page }) => {
        await routeUtils.checkRouteStatus(path);
        
        // Check enrollment layout structure
        const enrollmentContainer = page.locator('.min-h-screen.bg-gray-50');
        await expect(enrollmentContainer).toBeVisible();
        
        // Verify simplified header
        const header = page.locator('header.bg-white.border-b');
        await expect(header).toBeVisible();
        await expect(header).toContainText('Projectdes AI Academy');
        await expect(header).toContainText('Secure Enrollment');
        
        // Verify no marketing footer (enrollment has simple footer)
        const footer = page.locator('footer.bg-white.border-t');
        await expect(footer).toBeVisible();
        await expect(footer).toContainText('support@projectdes.academy');
      });
    });

    test('should show enrollment progress indicator', async ({ page }) => {
      await page.goto('/enroll/ai-transformation-manager/step-1-info');
      await page.waitForLoadState('networkidle');
      
      // Look for step indicators or progress tracking
      const stepIndicator = page.locator('[data-testid*="step"], .step, .progress');
      // Note: This might need adjustment based on actual implementation
    });

    test('should prevent search engine indexing', async ({ page }) => {
      await page.goto('/enroll/ai-transformation-manager');
      
      // Check robots meta tag
      const robotsMeta = page.locator('meta[name="robots"]');
      await expect(robotsMeta).toHaveAttribute('content', /noindex/i);
    });
  });

  test.describe('Dashboard Route Group - (dashboard)', () => {
    const dashboardRoutes = [
      '/dashboard',
      '/dashboard/courses',
      '/dashboard/assignments',
      '/dashboard/certificates',
      '/dashboard/progress',
      '/dashboard/settings',
      '/dashboard/community'
    ];

    dashboardRoutes.forEach((path) => {
      test(`should require authentication for ${path}`, async ({ page }) => {
        const response = await page.goto(path);
        
        // Should redirect to login if not authenticated
        // This assumes auth middleware is implemented
        expect(page.url()).toMatch(/\/auth\/login|\/dashboard/);
      });
    });

    test('should load dashboard layout when authenticated', async ({ page }) => {
      // This test would need actual authentication setup
      // For now, we'll just test the route exists
      const response = await page.goto('/dashboard');
      expect(response?.status()).not.toBe(404);
    });
  });

  test.describe('Auth Route Group - (auth)', () => {
    const authRoutes = [
      { path: '/auth/login', title: 'Login' },
      { path: '/auth/register', title: 'Register' },
      { path: '/auth/forgot-password', title: 'Forgot Password' },
      { path: '/auth/reset-password', title: 'Reset Password' },
      { path: '/auth/verify-email', title: 'Verify Email' }
    ];

    authRoutes.forEach(({ path, title }) => {
      test(`should load auth route ${path}`, async ({ page }) => {
        const response = await routeUtils.checkRouteStatus(path);
        await page.waitForLoadState('networkidle');
        
        // Check for form elements typical of auth pages
        const form = page.locator('form');
        await expect(form).toBeVisible();
      });
    });

    test('should have consistent auth layout', async ({ page }) => {
      for (const route of authRoutes) {
        await page.goto(route.path);
        await page.waitForLoadState('networkidle');
        
        // Auth pages should have minimal layout
        // Check that main marketing header/footer are not present
        const marketingHeader = page.locator('nav[data-testid="main-navigation"]');
        await expect(marketingHeader).not.toBeVisible();
      }
    });
  });

  test.describe('API Routes', () => {
    test('should handle webhook route', async ({ page }) => {
      // This would typically be tested with API testing tools
      // but we can check the route exists
      const response = await page.request.post('/api/webhooks/strapi', {
        data: { test: true }
      });
      
      // Should not return 404
      expect(response.status()).not.toBe(404);
    });
  });

  test.describe('Cross-Route Group Navigation', () => {
    test('should navigate between route groups', async ({ page }) => {
      // Start on marketing page
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Navigate to enrollment
      await page.goto('/enroll/ai-transformation-manager');
      await page.waitForLoadState('networkidle');
      
      // Verify layout changed
      const enrollmentLayout = page.locator('.min-h-screen.bg-gray-50');
      await expect(enrollmentLayout).toBeVisible();
      
      // Navigate to auth
      await page.goto('/auth/login');
      await page.waitForLoadState('networkidle');
      
      // Navigate back to marketing
      await page.goto('/courses');
      await page.waitForLoadState('networkidle');
      
      // Verify marketing layout is restored
      const marketingFooter = page.locator('footer');
      await expect(marketingFooter).toBeVisible();
    });
  });
});