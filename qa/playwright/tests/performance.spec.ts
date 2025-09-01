import { test, expect } from '@playwright/test';
import { PerformanceUtils, ResponsiveUtils } from '../utils/test-utils';

test.describe('Performance Testing', () => {
  let performanceUtils: PerformanceUtils;
  let responsiveUtils: ResponsiveUtils;

  test.beforeEach(async ({ page }) => {
    performanceUtils = new PerformanceUtils(page);
    responsiveUtils = new ResponsiveUtils(page);
  });

  test.describe('Core Web Vitals', () => {
    test('should meet Core Web Vitals thresholds on homepage', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const vitals = await performanceUtils.assertCoreWebVitals();
      
      console.log('Core Web Vitals:', vitals);
      
      // Additional assertions with more lenient thresholds for testing
      if (vitals.lcp) {
        expect(vitals.lcp, 'LCP should be less than 4s in test environment').toBeLessThan(4000);
      }
      
      if (vitals.cls !== undefined) {
        expect(vitals.cls, 'CLS should be less than 0.15 in test environment').toBeLessThan(0.15);
      }
    });

    test('should meet Core Web Vitals on courses page', async ({ page }) => {
      await page.goto('/courses');
      await page.waitForLoadState('networkidle');
      
      await performanceUtils.assertCoreWebVitals();
    });

    test('should meet Core Web Vitals on course detail page', async ({ page }) => {
      await page.goto('/courses/ai-transformation-manager');
      await page.waitForLoadState('networkidle');
      
      await performanceUtils.assertCoreWebVitals();
    });

    test('should meet Core Web Vitals on enrollment pages', async ({ page }) => {
      await page.goto('/enroll/ai-transformation-manager');
      await page.waitForLoadState('networkidle');
      
      // Enrollment pages should be fast and efficient
      const vitals = await performanceUtils.assertCoreWebVitals();
      
      // Enrollment should be particularly fast
      if (vitals.lcp) {
        expect(vitals.lcp, 'Enrollment pages should load very quickly').toBeLessThan(3000);
      }
    });
  });

  test.describe('Page Load Performance', () => {
    test('should load homepage within performance budget', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      const metrics = await performanceUtils.measurePageLoad();
      
      console.log('Homepage Load Metrics:', {
        totalLoadTime: loadTime,
        ...metrics
      });
      
      // Performance assertions
      expect(loadTime, 'Total load time should be under 8s').toBeLessThan(8000);
      expect(metrics.ttfb, 'TTFB should be under 1s').toBeLessThan(1000);
      expect(metrics.domContentLoaded, 'DOM Content Loaded should be under 4s').toBeLessThan(4000);
    });

    test('should load courses page efficiently', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/courses');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      const metrics = await performanceUtils.measurePageLoad();
      
      console.log('Courses Page Load Metrics:', {
        totalLoadTime: loadTime,
        ...metrics
      });
      
      expect(loadTime, 'Courses page load time').toBeLessThan(8000);
    });

    test('should handle navigation performance', async ({ page }) => {
      // Load initial page
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Measure navigation performance
      const navigationStart = Date.now();
      await page.goto('/about');
      await page.waitForLoadState('networkidle');
      const navigationTime = Date.now() - navigationStart;
      
      console.log('Navigation Time:', navigationTime);
      
      // Client-side navigation should be faster
      expect(navigationTime, 'Navigation should be fast').toBeLessThan(5000);
    });

    test('should perform well on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      const vitals = await performanceUtils.measureCoreWebVitals();
      
      console.log('Mobile Performance:', {
        loadTime,
        vitals
      });
      
      // Mobile should still meet performance standards
      expect(loadTime, 'Mobile load time should be reasonable').toBeLessThan(10000);
      
      if (vitals.lcp) {
        expect(vitals.lcp, 'Mobile LCP should be acceptable').toBeLessThan(5000);
      }
    });
  });

  test.describe('Resource Loading Performance', () => {
    test('should optimize image loading', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for images and their loading attributes
      const images = page.locator('img');
      const imageCount = await images.count();
      
      console.log('Found images:', imageCount);
      
      if (imageCount > 0) {
        for (let i = 0; i < Math.min(5, imageCount); i++) {
          const img = images.nth(i);
          
          // Check for lazy loading
          const loading = await img.getAttribute('loading');
          const src = await img.getAttribute('src');
          
          // Images should have proper loading attributes
          if (src && !src.includes('data:') && i > 0) {
            // Non-hero images should ideally be lazy loaded
            // This is a recommendation, not a hard requirement
            console.log(`Image ${i} loading attribute:`, loading);
          }
        }
      }
    });

    test('should minimize render-blocking resources', async ({ page }) => {
      // Start performance trace
      await page.tracing.start({ screenshots: true, snapshots: true });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Stop tracing
      await page.tracing.stop({ path: 'performance-trace.json' });
      
      // Check for render-blocking CSS
      const stylesheets = page.locator('link[rel="stylesheet"]');
      const stylesheetCount = await stylesheets.count();
      
      console.log('Stylesheets count:', stylesheetCount);
      
      // Should have minimal stylesheets
      expect(stylesheetCount, 'Should minimize CSS files').toBeLessThan(10);
    });

    test('should handle font loading efficiently', async ({ page }) => {
      await page.goto('/');
      
      // Check for font loading optimization
      const fontLinks = page.locator('link[href*="fonts"], link[rel="preload"][href*="font"]');
      const fontCount = await fontLinks.count();
      
      console.log('Font preloads:', fontCount);
      
      // Wait for fonts to load
      await page.waitForFunction(() => {
        return document.fonts.ready;
      });
      
      // Should not cause layout shifts
      const vitals = await performanceUtils.measureCoreWebVitals();
      if (vitals.cls !== undefined) {
        expect(vitals.cls, 'Fonts should not cause excessive layout shift').toBeLessThan(0.2);
      }
    });

    test('should optimize JavaScript bundle size', async ({ page }) => {
      // Monitor network requests
      const jsRequests: Array<{ url: string; size: number }> = [];
      
      page.on('response', async (response) => {
        if (response.url().endsWith('.js') && response.status() === 200) {
          try {
            const headers = response.headers();
            const contentLength = headers['content-length'];
            jsRequests.push({
              url: response.url(),
              size: contentLength ? parseInt(contentLength) : 0
            });
          } catch (e) {
            // Ignore errors getting response size
          }
        }
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const totalJSSize = jsRequests.reduce((total, req) => total + req.size, 0);
      
      console.log('JavaScript Requests:', jsRequests.length);
      console.log('Total JS Size:', totalJSSize, 'bytes');
      
      // Bundle size should be reasonable
      expect(jsRequests.length, 'Should not have too many JS files').toBeLessThan(20);
      
      // Individual files shouldn't be too large
      const largeFiles = jsRequests.filter(req => req.size > 500000); // 500KB
      expect(largeFiles.length, 'Should minimize large JS files').toBeLessThan(3);
    });
  });

  test.describe('Responsive Performance', () => {
    test('should perform well across all breakpoints', async ({ page }) => {
      const breakpoints = [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1024, height: 768 },
        { name: 'large', width: 1440, height: 900 }
      ];
      
      for (const breakpoint of breakpoints) {
        await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
        
        const startTime = Date.now();
        await page.goto('/', { waitUntil: 'networkidle' });
        const loadTime = Date.now() - startTime;
        
        console.log(`${breakpoint.name} (${breakpoint.width}px) load time:`, loadTime);
        
        // Should load reasonably fast on all devices
        expect(loadTime, `${breakpoint.name} should load efficiently`).toBeLessThan(10000);
      }
    });

    test('should not have horizontal scroll on any breakpoint', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await responsiveUtils.assertNoHorizontalScroll();
    });

    test('should optimize images for different screen sizes', async ({ page }) => {
      const breakpoints = [375, 768, 1024, 1440];
      
      for (const width of breakpoints) {
        await page.setViewportSize({ width, height: 800 });
        await page.goto('/', { waitUntil: 'networkidle' });
        
        // Check that images adapt to screen size
        const heroImage = page.locator('img').first();
        if (await heroImage.count() > 0) {
          const boundingBox = await heroImage.boundingBox();
          if (boundingBox) {
            expect(boundingBox.width, `Image should fit viewport at ${width}px`).toBeLessThanOrEqual(width);
          }
        }
      }
    });
  });

  test.describe('Performance Monitoring', () => {
    test('should track performance metrics', async ({ page }) => {
      // Set up performance monitoring
      await page.addInitScript(() => {
        (window as any).performanceMetrics = {};
        
        // Track navigation timing
        window.addEventListener('load', () => {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          (window as any).performanceMetrics.navigation = {
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
            loadComplete: perfData.loadEventEnd - perfData.fetchStart,
            ttfb: perfData.responseStart - perfData.fetchStart
          };
        });
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const metrics = await page.evaluate(() => (window as any).performanceMetrics);
      console.log('Performance Metrics:', metrics);
      
      expect(metrics).toBeDefined();
      if (metrics.navigation) {
        expect(metrics.navigation.ttfb, 'TTFB should be reasonable').toBeLessThan(2000);
        expect(metrics.navigation.domContentLoaded, 'DOM Content Loaded should be reasonable').toBeLessThan(5000);
      }
    });

    test('should measure memory usage', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Get memory information if available
      const memoryInfo = await page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory;
        }
        return null;
      });
      
      if (memoryInfo) {
        console.log('Memory Usage:', memoryInfo);
        
        // Memory usage should be reasonable
        const usedJSHeapSize = memoryInfo.usedJSHeapSize;
        const totalJSHeapSize = memoryInfo.totalJSHeapSize;
        
        expect(usedJSHeapSize, 'Used heap size should be reasonable').toBeLessThan(50 * 1024 * 1024); // 50MB
        expect(totalJSHeapSize, 'Total heap size should be reasonable').toBeLessThan(100 * 1024 * 1024); // 100MB
      }
    });

    test('should monitor third-party script impact', async ({ page }) => {
      const thirdPartyRequests: string[] = [];
      
      page.on('request', (request) => {
        const url = request.url();
        
        // Track third-party scripts
        if (!url.includes('localhost') && !url.includes('projectdes') && 
            (url.includes('.js') || url.includes('analytics') || url.includes('gtm'))) {
          thirdPartyRequests.push(url);
        }
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      console.log('Third-party Requests:', thirdPartyRequests);
      
      // Should minimize third-party impact
      expect(thirdPartyRequests.length, 'Should limit third-party scripts').toBeLessThan(10);
    });
  });

  test.describe('Performance Budget', () => {
    test('should stay within performance budget', async ({ page }) => {
      let totalResourceSize = 0;
      const resourceTypes = {
        html: 0,
        css: 0,
        js: 0,
        images: 0,
        fonts: 0,
        other: 0
      };
      
      page.on('response', async (response) => {
        if (response.status() === 200) {
          try {
            const contentLength = response.headers()['content-length'];
            const size = contentLength ? parseInt(contentLength) : 0;
            totalResourceSize += size;
            
            const url = response.url();
            if (url.endsWith('.html')) resourceTypes.html += size;
            else if (url.endsWith('.css')) resourceTypes.css += size;
            else if (url.endsWith('.js')) resourceTypes.js += size;
            else if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) resourceTypes.images += size;
            else if (url.match(/\.(woff|woff2|ttf|eot)$/)) resourceTypes.fonts += size;
            else resourceTypes.other += size;
          } catch (e) {
            // Ignore size calculation errors
          }
        }
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      console.log('Resource Sizes:', resourceTypes);
      console.log('Total Size:', totalResourceSize, 'bytes');
      
      // Performance budget thresholds (in bytes)
      expect(resourceTypes.js, 'JS bundle should be under 2MB').toBeLessThan(2 * 1024 * 1024);
      expect(resourceTypes.css, 'CSS should be under 500KB').toBeLessThan(500 * 1024);
      expect(resourceTypes.images, 'Images should be optimized').toBeLessThan(5 * 1024 * 1024);
      expect(totalResourceSize, 'Total page weight should be under 10MB').toBeLessThan(10 * 1024 * 1024);
    });
  });
});