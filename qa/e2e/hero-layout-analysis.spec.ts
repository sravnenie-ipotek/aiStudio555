import { test, expect } from '@playwright/test';

test.describe('Hero Section Layout Analysis', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('http://localhost:3000');
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    // Wait for any potential animations or dynamic content
    await page.waitForTimeout(2000);
  });

  test('capture full homepage with focus on hero section statistics', async ({ page }) => {
    // Set viewport to common desktop size
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Take full page screenshot first
    await page.screenshot({ 
      path: 'hero-layout-full.png',
      fullPage: true,
      type: 'png'
    });

    // Focus on hero section specifically
    const heroSection = page.locator('[data-testid="hero-section"], .hero-section, section:first-of-type');
    
    if (await heroSection.count() > 0) {
      await heroSection.screenshot({
        path: 'hero-section-focus.png',
        type: 'png'
      });
    }

    // Look for statistics elements specifically
    const statsElements = [
      page.locator('text=/12K\\+|12,000\\+|12 000\\+/'),
      page.locator('text=/25\\+/'),
      page.locator('text=/87%|87 %/'),
      page.locator('.statistics, .stats, [data-testid*="stat"], [class*="statistic"]'),
    ];

    for (const [index, element] of statsElements.entries()) {
      if (await element.count() > 0) {
        await element.first().screenshot({
          path: `statistic-${index + 1}.png`,
          type: 'png'
        });
        
        // Get element position and visibility info
        const boundingBox = await element.first().boundingBox();
        console.log(`Statistic ${index + 1} position:`, boundingBox);
        
        const isVisible = await element.first().isVisible();
        console.log(`Statistic ${index + 1} visible:`, isVisible);
      }
    }

    // Test different viewport sizes to see layout behavior
    const viewports = [
      { width: 1440, height: 900, name: 'desktop-medium' },
      { width: 1366, height: 768, name: 'desktop-small' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 390, height: 844, name: 'mobile' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(1000); // Allow layout to adjust
      
      await page.screenshot({
        path: `hero-${viewport.name}-${viewport.width}x${viewport.height}.png`,
        fullPage: false, // Viewport only
        type: 'png'
      });
    }

    // Reset to original viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Scroll to bottom of hero section to see if stats are visible
    const heroBottom = page.locator('.hero-section, [data-testid="hero-section"]').last();
    if (await heroBottom.count() > 0) {
      await heroBottom.scrollIntoView();
      await page.waitForTimeout(1000);
      
      await page.screenshot({
        path: 'hero-bottom-scroll.png',
        type: 'png'
      });
    }

    // Measure hero section height vs viewport height
    const heroHeight = await page.evaluate(() => {
      const hero = document.querySelector('.hero-section, [data-testid="hero-section"], section:first-of-type');
      return hero ? hero.getBoundingClientRect().height : 0;
    });

    const viewportHeight = await page.evaluate(() => window.innerHeight);
    
    console.log('Hero section height:', heroHeight);
    console.log('Viewport height:', viewportHeight);
    console.log('Height ratio:', heroHeight / viewportHeight);

    // Take screenshot with browser developer tools-like info
    await page.screenshot({
      path: 'hero-debug-info.png',
      fullPage: true,
      type: 'png'
    });
  });

  test('analyze hero section CSS properties', async ({ page }) => {
    // Analyze CSS properties that might cause overflow issues
    const cssAnalysis = await page.evaluate(() => {
      const hero = document.querySelector('.hero-section, [data-testid="hero-section"], section:first-of-type');
      if (!hero) return null;

      const styles = window.getComputedStyle(hero);
      const statsElements = Array.from(document.querySelectorAll('[class*="stat"], .statistics, .stats'));
      
      return {
        heroSection: {
          height: styles.height,
          minHeight: styles.minHeight,
          maxHeight: styles.maxHeight,
          overflow: styles.overflow,
          overflowY: styles.overflowY,
          position: styles.position,
          display: styles.display,
          flexDirection: styles.flexDirection,
          justifyContent: styles.justifyContent,
          alignItems: styles.alignItems,
        },
        statistics: statsElements.map(el => {
          const elStyles = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return {
            element: el.className,
            position: elStyles.position,
            bottom: elStyles.bottom,
            top: elStyles.top,
            transform: elStyles.transform,
            visibility: elStyles.visibility,
            display: elStyles.display,
            boundingBox: {
              top: rect.top,
              bottom: rect.bottom,
              height: rect.height,
              visible: rect.top < window.innerHeight && rect.bottom > 0
            }
          };
        })
      };
    });

    console.log('CSS Analysis:', JSON.stringify(cssAnalysis, null, 2));

    // Check for common layout issues
    const layoutIssues = await page.evaluate(() => {
      const issues = [];
      const hero = document.querySelector('.hero-section, [data-testid="hero-section"], section:first-of-type');
      
      if (hero) {
        const rect = hero.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (rect.height > viewportHeight) {
          issues.push('Hero section height exceeds viewport height');
        }
        
        if (rect.bottom > viewportHeight) {
          issues.push('Hero section bottom extends beyond viewport');
        }

        const styles = window.getComputedStyle(hero);
        if (styles.height === '100vh' && rect.height > viewportHeight) {
          issues.push('100vh height may be causing issues with viewport units');
        }
      }
      
      return issues;
    });

    console.log('Layout Issues Found:', layoutIssues);
  });
});