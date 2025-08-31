import { test, expect } from '../../fixtures/auth';
import { TestHelpers } from '../../utils/test-helpers';

test.describe('Performance - Core Web Vitals', () => {
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    testHelpers = new TestHelpers(page);
    
    // Enable network throttling for realistic testing
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
      uploadThroughput: 750 * 1024 / 8, // 750 Kbps
      latency: 40 // 40ms RTT
    });
  });

  test('should meet Core Web Vitals thresholds on homepage @performance @critical', async ({ page }) => {
    // Navigate to homepage and measure performance
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Get Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const webVitals = {};
          
          entries.forEach(entry => {
            if (entry.entryType === 'largest-contentful-paint') {
              webVitals.LCP = entry.startTime;
            } else if (entry.entryType === 'first-input') {
              webVitals.FID = entry.processingStart - entry.startTime;
            } else if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              webVitals.CLS = (webVitals.CLS || 0) + entry.value;
            }
          });
          
          // Also get navigation timing
          const navigation = performance.getEntriesByType('navigation')[0];
          webVitals.TTFB = navigation.responseStart;
          webVitals.DOMContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
          webVitals.LoadComplete = navigation.loadEventEnd - navigation.fetchStart;
          
          resolve(webVitals);
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        
        // Fallback timeout
        setTimeout(() => resolve({}), 10000);
      });
    });

    console.log('Core Web Vitals:', metrics);
    
    // Assert Core Web Vitals thresholds
    if (metrics.LCP) {
      expect(metrics.LCP).toBeLessThan(2500); // LCP < 2.5s (Good)
    }
    
    if (metrics.FID) {
      expect(metrics.FID).toBeLessThan(100); // FID < 100ms (Good)
    }
    
    if (metrics.CLS !== undefined) {
      expect(metrics.CLS).toBeLessThan(0.1); // CLS < 0.1 (Good)
    }
    
    // Additional performance metrics
    expect(metrics.TTFB).toBeLessThan(800); // TTFB < 800ms
    expect(metrics.DOMContentLoaded).toBeLessThan(2000); // DOMContentLoaded < 2s
    expect(metrics.LoadComplete).toBeLessThan(3000); // Full load < 3s
  });

  test('should meet performance thresholds on dashboard @performance @critical', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'networkidle' });
    
    const performanceMetrics = await testHelpers.measurePerformance();
    
    // Dashboard-specific thresholds
    expect(performanceMetrics.loadTime).toBeLessThan(2500);
    expect(performanceMetrics.domContentLoaded).toBeLessThan(1500);
    expect(performanceMetrics.ttfb).toBeLessThan(600);
    
    console.log('Dashboard Performance:', performanceMetrics);
  });

  test('should meet performance thresholds on course player @performance', async ({ page }) => {
    // Mock course data for faster loading
    await testHelpers.mockApiResponse('/courses/1', {
      id: '1',
      title: 'Performance Test Course',
      currentLesson: {
        id: '1',
        title: 'Test Lesson',
        videoUrl: '/videos/test-lesson.mp4'
      }
    });

    await page.goto('/learn/1', { waitUntil: 'networkidle' });
    
    const performanceMetrics = await testHelpers.measurePerformance();
    
    // Course player thresholds (slightly higher due to video content)
    expect(performanceMetrics.loadTime).toBeLessThan(3500);
    expect(performanceMetrics.domContentLoaded).toBeLessThan(2000);
    
    console.log('Course Player Performance:', performanceMetrics);
  });

  test('should optimize image loading and rendering', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check for proper image optimization
    const images = await page.locator('img').all();
    
    for (const img of images) {
      // Check for lazy loading
      const loading = await img.getAttribute('loading');
      if (loading) {
        expect(['lazy', 'eager']).toContain(loading);
      }
      
      // Check for alt attribute (accessibility + SEO)
      const alt = await img.getAttribute('alt');
      expect(alt).toBeDefined();
      
      // Check for responsive images
      const srcset = await img.getAttribute('srcset');
      const sizes = await img.getAttribute('sizes');
      
      // Either should have srcset/sizes or be a small icon
      const src = await img.getAttribute('src');
      if (!srcset && src && !src.includes('icon') && !src.includes('logo')) {
        console.warn(`Image ${src} should have srcset for responsive loading`);
      }
    }
  });

  test('should minimize JavaScript bundle size @performance', async ({ page }) => {
    // Navigate and capture network requests
    const networkRequests = [];
    
    page.on('response', response => {
      const url = response.url();
      const contentType = response.headers()['content-type'] || '';
      
      if (contentType.includes('javascript')) {
        networkRequests.push({
          url,
          size: parseInt(response.headers()['content-length'] || '0'),
          status: response.status()
        });
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Calculate total JS bundle size
    const totalJSSize = networkRequests.reduce((sum, req) => sum + req.size, 0);
    const totalJSSizeKB = totalJSSize / 1024;
    
    console.log(`Total JavaScript bundle size: ${totalJSSizeKB.toFixed(2)} KB`);
    console.log('JavaScript files loaded:', networkRequests.length);
    
    // Assert bundle size thresholds
    expect(totalJSSizeKB).toBeLessThan(500); // Total JS < 500KB
    expect(networkRequests.length).toBeLessThan(10); // < 10 JS files for HTTP/1.1 compatibility
    
    // Check for successful loading
    const failedRequests = networkRequests.filter(req => req.status >= 400);
    expect(failedRequests).toHaveLength(0);
  });

  test('should implement efficient CSS loading @performance', async ({ page }) => {
    const cssRequests = [];
    
    page.on('response', response => {
      const url = response.url();
      const contentType = response.headers()['content-type'] || '';
      
      if (contentType.includes('css') || url.endsWith('.css')) {
        cssRequests.push({
          url,
          size: parseInt(response.headers()['content-length'] || '0'),
          status: response.status()
        });
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Calculate total CSS size
    const totalCSSSize = cssRequests.reduce((sum, req) => sum + req.size, 0);
    const totalCSSSizeKB = totalCSSSize / 1024;
    
    console.log(`Total CSS bundle size: ${totalCSSSizeKB.toFixed(2)} KB`);
    
    // Assert CSS size thresholds
    expect(totalCSSSizeKB).toBeLessThan(100); // Total CSS < 100KB
    expect(cssRequests.length).toBeLessThan(5); // < 5 CSS files
    
    // Check for render-blocking resources
    const renderBlockingCSS = cssRequests.filter(req => 
      !req.url.includes('media=') && !req.url.includes('async')
    );
    
    // Should minimize render-blocking CSS
    expect(renderBlockingCSS.length).toBeLessThan(3);
  });

  test('should optimize font loading performance @performance', async ({ page }) => {
    const fontRequests = [];
    
    page.on('response', response => {
      const url = response.url();
      if (url.includes('font') || /\.(woff2?|eot|ttf|otf)$/i.test(url)) {
        fontRequests.push({
          url,
          size: parseInt(response.headers()['content-length'] || '0'),
          status: response.status()
        });
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check font loading strategy
    const fontFaceRules = await page.evaluate(() => {
      const rules = [];
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules || []) {
            if (rule.type === CSSRule.FONT_FACE_RULE) {
              rules.push({
                fontFamily: rule.style.fontFamily,
                fontDisplay: rule.style.fontDisplay,
                src: rule.style.src
              });
            }
          }
        } catch (e) {
          // Cross-origin stylesheets may not be accessible
        }
      }
      return rules;
    });

    console.log('Font loading strategy:', fontFaceRules);
    console.log('Font requests:', fontRequests.length);
    
    // Should use font-display: swap for better loading performance
    const fontsWithSwap = fontFaceRules.filter(rule => 
      rule.fontDisplay === 'swap'
    );
    
    expect(fontsWithSwap.length).toBeGreaterThan(0);
    
    // Should minimize number of font files
    expect(fontRequests.length).toBeLessThan(6);
    
    // Should use WOFF2 format for better compression
    const woff2Fonts = fontRequests.filter(req => req.url.includes('woff2'));
    if (fontRequests.length > 0) {
      expect(woff2Fonts.length).toBeGreaterThan(0);
    }
  });

  test('should handle slow network conditions gracefully @performance', async ({ page }) => {
    // Simulate 3G network
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 400 * 1024 / 8, // 400 Kbps
      uploadThroughput: 400 * 1024 / 8,
      latency: 400 // 400ms RTT
    });

    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;
    
    console.log(`3G load time: ${loadTime}ms`);
    
    // Should still load reasonably fast on 3G
    expect(loadTime).toBeLessThan(5000); // 5 seconds on 3G
    
    // Check that critical content is visible
    await expect(page.getByTestId('main-navigation')).toBeVisible();
    await expect(page.getByTestId('hero-section')).toBeVisible();
  });

  test('should implement proper caching strategies @performance', async ({ page }) => {
    const cachedResources = [];
    
    page.on('response', response => {
      const url = response.url();
      const cacheControl = response.headers()['cache-control'];
      const expires = response.headers()['expires'];
      const etag = response.headers()['etag'];
      
      if (cacheControl || expires || etag) {
        cachedResources.push({
          url,
          cacheControl,
          expires,
          etag,
          type: response.headers()['content-type']
        });
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    
    console.log('Cached resources:', cachedResources.length);
    
    // Should have caching headers on static assets
    const staticAssets = cachedResources.filter(resource => 
      resource.url.includes('.js') || 
      resource.url.includes('.css') || 
      resource.url.includes('.png') ||
      resource.url.includes('.jpg') ||
      resource.url.includes('.svg')
    );
    
    expect(staticAssets.length).toBeGreaterThan(0);
    
    // Static assets should have long cache times
    const longCachedAssets = staticAssets.filter(asset =>
      asset.cacheControl && (
        asset.cacheControl.includes('max-age=31536000') || // 1 year
        asset.cacheControl.includes('immutable')
      )
    );
    
    expect(longCachedAssets.length).toBeGreaterThan(0);
  });

  test('should optimize third-party script loading @performance', async ({ page }) => {
    const thirdPartyRequests = [];
    
    page.on('request', request => {
      const url = request.url();
      const currentDomain = new URL(page.url()).hostname;
      const requestDomain = new URL(url).hostname;
      
      if (requestDomain !== currentDomain && 
          requestDomain !== 'localhost' &&
          !requestDomain.includes('127.0.0.1')) {
        thirdPartyRequests.push({
          url,
          domain: requestDomain,
          resourceType: request.resourceType()
        });
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    
    console.log('Third-party requests:', thirdPartyRequests.length);
    console.log('Third-party domains:', [...new Set(thirdPartyRequests.map(r => r.domain))]);
    
    // Should minimize third-party requests
    expect(thirdPartyRequests.length).toBeLessThan(10);
    
    // Check for async/defer on third-party scripts
    const thirdPartyScripts = await page.locator('script[src*="http"]').all();
    
    for (const script of thirdPartyScripts) {
      const src = await script.getAttribute('src');
      const async = await script.getAttribute('async');
      const defer = await script.getAttribute('defer');
      
      if (src && !src.includes(page.url().split('/')[2])) {
        expect(async !== null || defer !== null).toBe(true);
      }
    }
  });

  test('should implement service worker for caching @performance', async ({ page }) => {
    await page.goto('/');
    
    // Check if service worker is registered
    const serviceWorkerRegistered = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          return !!registration;
        } catch (error) {
          return false;
        }
      }
      return false;
    });

    // Service worker should be implemented for offline caching
    if (serviceWorkerRegistered) {
      console.log('Service worker is registered');
      
      // Test offline functionality
      await page.setOfflineMode(true);
      await page.reload();
      
      // Critical pages should still work offline
      await expect(page.getByTestId('main-navigation')).toBeVisible();
    } else {
      console.warn('Service worker not implemented - consider adding for offline support');
    }
  });
});