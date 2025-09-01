import { Page, expect } from '@playwright/test';

/**
 * Core Web Vitals and Performance Utilities
 */
export class PerformanceUtils {
  constructor(private page: Page) {}

  /**
   * Measure Core Web Vitals
   */
  async measureCoreWebVitals() {
    const vitals = await this.page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals: Record<string, number> = {};
        
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
          vitals.lcp = lastEntry.startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        // First Input Delay (FID) - using First Contentful Paint as proxy
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            vitals.fcp = entries[0].startTime;
          }
        }).observe({ type: 'paint', buffered: true });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          vitals.cls = clsValue;
        }).observe({ type: 'layout-shift', buffered: true });

        // Wait a bit for metrics to be collected
        setTimeout(() => resolve(vitals), 2000);
      });
    });

    return vitals as { lcp?: number; fcp?: number; cls?: number };
  }

  /**
   * Measure page load performance
   */
  async measurePageLoad() {
    const metrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        loadComplete: navigation.loadEventEnd - navigation.fetchStart,
        ttfb: navigation.responseStart - navigation.fetchStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
      };
    });

    return metrics;
  }

  /**
   * Assert Core Web Vitals are within acceptable ranges
   */
  async assertCoreWebVitals() {
    const vitals = await this.measureCoreWebVitals();
    
    // LCP should be less than 2.5s (2500ms)
    if (vitals.lcp) {
      expect(vitals.lcp).toBeLessThan(2500);
    }
    
    // CLS should be less than 0.1
    if (vitals.cls !== undefined) {
      expect(vitals.cls).toBeLessThan(0.1);
    }
    
    return vitals;
  }
}

/**
 * Accessibility Testing Utilities
 */
export class AccessibilityUtils {
  constructor(private page: Page) {}

  /**
   * Check basic accessibility requirements
   */
  async checkBasicA11y() {
    // Check for proper heading hierarchy
    const headings = await this.page.$$eval('h1, h2, h3, h4, h5, h6', (elements) => {
      return elements.map(el => ({
        tagName: el.tagName,
        text: el.textContent?.slice(0, 50) || '',
        hasText: !!el.textContent?.trim()
      }));
    });

    // Should have at least one h1
    const h1Count = headings.filter(h => h.tagName === 'H1').length;
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // All headings should have text
    const emptyHeadings = headings.filter(h => !h.hasText);
    expect(emptyHeadings).toHaveLength(0);

    // Check for alt text on images
    const imagesWithoutAlt = await this.page.$$eval('img', (images) => {
      return images.filter(img => !img.getAttribute('alt')).length;
    });
    expect(imagesWithoutAlt).toBe(0);

    // Check for form labels
    const inputsWithoutLabels = await this.page.$$eval('input, textarea, select', (inputs) => {
      return inputs.filter(input => {
        const id = input.id;
        const hasLabel = id && document.querySelector(`label[for="${id}"]`);
        const hasAriaLabel = input.getAttribute('aria-label');
        const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
        return !hasLabel && !hasAriaLabel && !hasAriaLabelledBy;
      }).length;
    });
    expect(inputsWithoutLabels).toBe(0);
  }

  /**
   * Check keyboard navigation
   */
  async checkKeyboardNavigation() {
    // Get all focusable elements
    const focusableElements = await this.page.$$eval('*', (elements) => {
      const focusable = elements.filter(el => {
        const tabIndex = el.getAttribute('tabindex');
        const tagName = el.tagName.toLowerCase();
        const isInteractive = ['a', 'button', 'input', 'textarea', 'select'].includes(tagName);
        const hasTabIndex = tabIndex !== null && tabIndex !== '-1';
        
        return (isInteractive || hasTabIndex) && 
               !el.hasAttribute('disabled') && 
               getComputedStyle(el).display !== 'none';
      });
      
      return focusable.length;
    });

    expect(focusableElements).toBeGreaterThan(0);

    // Test Tab navigation
    await this.page.keyboard.press('Tab');
    const firstFocused = await this.page.evaluate(() => document.activeElement?.tagName);
    expect(firstFocused).toBeTruthy();
  }
}

/**
 * Responsive Design Testing Utilities
 */
export class ResponsiveUtils {
  constructor(private page: Page) {}

  async testBreakpoints() {
    const breakpoints = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1024, height: 768 },
      { name: 'large', width: 1440, height: 900 }
    ];

    const results: Array<{ name: string; width: number; height: number; hasHorizontalScroll: boolean }> = [];

    for (const breakpoint of breakpoints) {
      await this.page.setViewportSize({ 
        width: breakpoint.width, 
        height: breakpoint.height 
      });
      
      await this.page.waitForTimeout(500); // Allow layout to settle

      // Check for horizontal scroll
      const hasHorizontalScroll = await this.page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      results.push({
        name: breakpoint.name,
        width: breakpoint.width,
        height: breakpoint.height,
        hasHorizontalScroll
      });
    }

    return results;
  }

  async assertNoHorizontalScroll(breakpoints?: string[]) {
    const results = await this.testBreakpoints();
    
    for (const result of results) {
      if (!breakpoints || breakpoints.includes(result.name)) {
        expect(result.hasHorizontalScroll, 
          `Horizontal scroll detected on ${result.name} (${result.width}px)`
        ).toBe(false);
      }
    }
  }
}

/**
 * Route Testing Utilities
 */
export class RouteUtils {
  constructor(private page: Page) {}

  /**
   * Test route navigation and ensure proper loading
   */
  async navigateAndVerify(path: string, expectedTitle?: string, expectedHeading?: string) {
    await this.page.goto(path);
    
    // Wait for navigation to complete
    await this.page.waitForLoadState('networkidle');
    
    // Check for basic page structure
    await this.page.waitForSelector('body');
    
    // Verify title if provided
    if (expectedTitle) {
      await expect(this.page).toHaveTitle(new RegExp(expectedTitle, 'i'));
    }
    
    // Verify main heading if provided
    if (expectedHeading) {
      const heading = this.page.locator('h1').first();
      await expect(heading).toContainText(expectedHeading);
    }
    
    // Check that page doesn't have error states
    const errorElements = await this.page.$$('.error, [data-testid*="error"], .alert-error');
    expect(errorElements).toHaveLength(0);
    
    return this.page.url();
  }

  /**
   * Test that route returns correct status code
   */
  async checkRouteStatus(path: string, expectedStatus = 200) {
    const response = await this.page.goto(path);
    expect(response?.status()).toBe(expectedStatus);
    return response;
  }
}

/**
 * Error Boundary Testing Utilities
 */
export class ErrorUtils {
  constructor(private page: Page) {}

  /**
   * Trigger JavaScript error and verify error boundary
   */
  async triggerJavaScriptError() {
    await this.page.evaluate(() => {
      // Trigger an error that should be caught by error boundary
      throw new Error('Test error for error boundary');
    });
  }

  /**
   * Test 404 error handling
   */
  async test404Handling(invalidPath: string = '/this-route-does-not-exist') {
    const response = await this.page.goto(invalidPath);
    expect(response?.status()).toBe(404);
    
    // Should show 404 page content
    const bodyText = await this.page.textContent('body');
    expect(bodyText).toMatch(/404|not found|page not found/i);
  }

  /**
   * Test network error handling
   */
  async testNetworkError() {
    // Simulate offline mode
    await this.page.context().setOffline(true);
    
    try {
      await this.page.reload();
      // Should handle offline state gracefully
      const bodyText = await this.page.textContent('body');
      expect(bodyText).toBeTruthy(); // Page should still render something
    } finally {
      // Restore online mode
      await this.page.context().setOffline(false);
    }
  }
}

/**
 * Loading State Testing Utilities
 */
export class LoadingUtils {
  constructor(private page: Page) {}

  /**
   * Verify loading states appear and disappear
   */
  async verifyLoadingSequence(triggerAction: () => Promise<void>, expectedContent?: string) {
    // Start the action that should show loading
    const actionPromise = triggerAction();
    
    // Check for loading indicator within reasonable time
    try {
      await this.page.waitForSelector('[data-testid="loading"], .loading, .spinner', { 
        timeout: 1000 
      });
    } catch {
      // Loading might be too fast to catch - that's ok
    }
    
    // Wait for action to complete
    await actionPromise;
    
    // Ensure loading indicator is gone and content is shown
    await this.page.waitForSelector('[data-testid="loading"], .loading, .spinner', { 
      state: 'detached',
      timeout: 5000 
    });
    
    if (expectedContent) {
      await expect(this.page.locator('body')).toContainText(expectedContent);
    }
  }
}