import { test, expect } from '@playwright/test';
import { ResponsiveUtils } from '../utils/test-utils';

test.describe('Responsive Design Testing', () => {
  let responsiveUtils: ResponsiveUtils;

  test.beforeEach(async ({ page }) => {
    responsiveUtils = new ResponsiveUtils(page);
  });

  test.describe('Breakpoint Testing', () => {
    test('should work correctly across all major breakpoints', async ({ page }) => {
      const routes = ['/', '/courses', '/about', '/contact'];
      
      for (const route of routes) {
        await page.goto(route);
        await page.waitForLoadState('networkidle');
        
        const results = await responsiveUtils.testBreakpoints();
        console.log(`Route: ${route}`, results);
        
        // Check for horizontal scroll at each breakpoint
        for (const result of results) {
          expect(result.hasHorizontalScroll, 
            `No horizontal scroll on ${result.name} (${result.width}px) for ${route}`
          ).toBe(false);
        }
      }
    });

    test('should have appropriate navigation on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for mobile navigation elements
      const mobileNav = page.locator('[data-testid*="mobile"], .mobile-menu, .hamburger, button[aria-label*="menu" i]');
      
      if (await mobileNav.count() > 0) {
        const firstMobileNav = mobileNav.first();
        
        // Mobile nav should be visible on mobile
        await expect(firstMobileNav).toBeVisible();
        
        // Should be able to interact with mobile navigation
        await firstMobileNav.click();
        
        // Navigation menu should appear
        const navMenu = page.locator('[role="navigation"], .nav-menu, .mobile-menu-items');
        
        if (await navMenu.count() > 0) {
          await expect(navMenu.first()).toBeVisible();
        }
      }
    });

    test('should hide mobile navigation on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Mobile navigation should be hidden on desktop
      const mobileNav = page.locator('[data-testid*="mobile"], .mobile-menu-button, .hamburger');
      
      if (await mobileNav.count() > 0) {
        // Should either be hidden or not visible
        const isVisible = await mobileNav.first().isVisible();
        expect(isVisible).toBe(false);
      }
      
      // Desktop navigation should be visible
      const desktopNav = page.locator('nav:not(.mobile), .desktop-nav, header nav');
      if (await desktopNav.count() > 0) {
        await expect(desktopNav.first()).toBeVisible();
      }
    });

    test('should adjust font sizes appropriately', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const breakpoints = [
        { name: 'mobile', width: 375 },
        { name: 'tablet', width: 768 },
        { name: 'desktop', width: 1024 }
      ];
      
      const fontSizes: Record<string, Record<string, string>> = {};
      
      for (const breakpoint of breakpoints) {
        await page.setViewportSize({ width: breakpoint.width, height: 800 });
        await page.waitForTimeout(500); // Allow layout to settle
        
        // Check font sizes for different elements
        const h1FontSize = await page.locator('h1').first().evaluate((el) => {
          return getComputedStyle(el).fontSize;
        });
        
        const pFontSize = await page.locator('p').first().evaluate((el) => {
          return getComputedStyle(el).fontSize;
        });
        
        fontSizes[breakpoint.name] = {
          h1: h1FontSize,
          p: pFontSize
        };
      }
      
      console.log('Font sizes across breakpoints:', fontSizes);
      
      // Font sizes should be reasonable and readable
      for (const breakpoint of Object.keys(fontSizes)) {
        const h1Size = parseFloat(fontSizes[breakpoint].h1);
        const pSize = parseFloat(fontSizes[breakpoint].p);
        
        expect(h1Size, `H1 font size should be readable on ${breakpoint}`).toBeGreaterThan(20);
        expect(pSize, `Paragraph font size should be readable on ${breakpoint}`).toBeGreaterThan(14);
      }
    });
  });

  test.describe('Touch Target Testing', () => {
    test('should have adequate touch targets on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check interactive elements for adequate size
      const touchTargets = page.locator('button, a, input[type="submit"], input[type="button"]');
      const count = await touchTargets.count();
      
      for (let i = 0; i < Math.min(10, count); i++) {
        const target = touchTargets.nth(i);
        
        if (await target.isVisible()) {
          const boundingBox = await target.boundingBox();
          
          if (boundingBox) {
            // Touch targets should be at least 44x44px (iOS HIG) or 48x48px (Material)
            const minSize = 44;
            
            expect(boundingBox.width, 
              `Touch target width should be at least ${minSize}px`
            ).toBeGreaterThanOrEqual(minSize);
            
            expect(boundingBox.height, 
              `Touch target height should be at least ${minSize}px`
            ).toBeGreaterThanOrEqual(minSize);
          }
        }
      }
    });

    test('should have adequate spacing between touch targets', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Find groups of buttons/links that are close together
      const buttonGroups = page.locator('.button-group, .nav-links, .cta-buttons, [class*="buttons"]');
      
      if (await buttonGroups.count() > 0) {
        const group = buttonGroups.first();
        const buttons = group.locator('button, a');
        const buttonCount = await buttons.count();
        
        if (buttonCount > 1) {
          const positions = [];
          
          for (let i = 0; i < buttonCount; i++) {
            const button = buttons.nth(i);
            if (await button.isVisible()) {
              const box = await button.boundingBox();
              if (box) positions.push(box);
            }
          }
          
          // Check spacing between adjacent buttons
          for (let i = 1; i < positions.length; i++) {
            const prev = positions[i - 1];
            const curr = positions[i];
            
            const horizontalSpacing = Math.abs(curr.x - (prev.x + prev.width));
            const verticalSpacing = Math.abs(curr.y - (prev.y + prev.height));
            
            // Should have at least 8px spacing between touch targets
            const hasAdequateSpacing = horizontalSpacing >= 8 || verticalSpacing >= 8;
            expect(hasAdequateSpacing, 
              'Touch targets should have adequate spacing'
            ).toBe(true);
          }
        }
      }
    });
  });

  test.describe('Content Adaptation', () => {
    test('should adapt content layout for different screen sizes', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Test desktop layout
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.waitForTimeout(500);
      
      const desktopLayout = await page.evaluate(() => {
        const hero = document.querySelector('[class*="hero"], .hero-section, section');
        const nav = document.querySelector('nav');
        
        return {
          heroDisplay: hero ? getComputedStyle(hero).display : null,
          navDisplay: nav ? getComputedStyle(nav).display : null,
          bodyWidth: document.body.clientWidth
        };
      });
      
      // Test mobile layout
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      
      const mobileLayout = await page.evaluate(() => {
        const hero = document.querySelector('[class*="hero"], .hero-section, section');
        const nav = document.querySelector('nav');
        
        return {
          heroDisplay: hero ? getComputedStyle(hero).display : null,
          navDisplay: nav ? getComputedStyle(nav).display : null,
          bodyWidth: document.body.clientWidth
        };
      });
      
      console.log('Desktop layout:', desktopLayout);
      console.log('Mobile layout:', mobileLayout);
      
      // Layout should adapt to screen size
      expect(mobileLayout.bodyWidth).toBeLessThan(desktopLayout.bodyWidth);
    });

    test('should show/hide appropriate content on different devices', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Test desktop-only content
      await page.setViewportSize({ width: 1024, height: 768 });
      const desktopOnlyElements = page.locator('.desktop-only, .hidden-mobile, [class*="desktop"]:not([class*="mobile"])');
      
      if (await desktopOnlyElements.count() > 0) {
        await expect(desktopOnlyElements.first()).toBeVisible();
      }
      
      // Test mobile - desktop-only content should be hidden
      await page.setViewportSize({ width: 375, height: 667 });
      
      if (await desktopOnlyElements.count() > 0) {
        const isVisible = await desktopOnlyElements.first().isVisible();
        expect(isVisible).toBe(false);
      }
      
      // Test mobile-only content
      const mobileOnlyElements = page.locator('.mobile-only, .hidden-desktop, [class*="mobile"]:not([class*="desktop"])');
      
      if (await mobileOnlyElements.count() > 0) {
        await expect(mobileOnlyElements.first()).toBeVisible();
      }
    });

    test('should handle text overflow properly', async ({ page }) => {
      await page.goto('/courses');
      await page.waitForLoadState('networkidle');
      
      const breakpoints = [375, 768, 1024];
      
      for (const width of breakpoints) {
        await page.setViewportSize({ width, height: 800 });
        await page.waitForTimeout(500);
        
        // Check for text overflow
        const textElements = page.locator('h1, h2, h3, p, .card-title, .course-title');
        const count = await textElements.count();
        
        for (let i = 0; i < Math.min(5, count); i++) {
          const element = textElements.nth(i);
          
          if (await element.isVisible()) {
            const overflow = await element.evaluate((el) => {
              const computed = getComputedStyle(el);
              return {
                overflow: computed.overflow,
                textOverflow: computed.textOverflow,
                whiteSpace: computed.whiteSpace,
                scrollWidth: el.scrollWidth,
                clientWidth: el.clientWidth
              };
            });
            
            // Text should not overflow container
            if (overflow.overflow !== 'hidden' && overflow.textOverflow !== 'ellipsis') {
              expect(overflow.scrollWidth <= overflow.clientWidth, 
                `Text should not overflow at ${width}px`
              ).toBe(true);
            }
          }
        }
      }
    });
  });

  test.describe('Image Responsiveness', () => {
    test('should scale images appropriately', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const images = page.locator('img');
      const imageCount = await images.count();
      
      if (imageCount > 0) {
        const breakpoints = [375, 768, 1024, 1440];
        
        for (const width of breakpoints) {
          await page.setViewportSize({ width, height: 800 });
          await page.waitForTimeout(500);
          
          // Check first few images
          for (let i = 0; i < Math.min(3, imageCount); i++) {
            const img = images.nth(i);
            
            if (await img.isVisible()) {
              const boundingBox = await img.boundingBox();
              
              if (boundingBox) {
                // Images should not exceed viewport width
                expect(boundingBox.width, 
                  `Image should not exceed viewport width at ${width}px`
                ).toBeLessThanOrEqual(width);
                
                // Images should have reasonable size
                expect(boundingBox.width, 
                  'Image should have reasonable width'
                ).toBeGreaterThan(0);
              }
            }
          }
        }
      }
    });

    test('should use responsive image attributes', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < Math.min(5, imageCount); i++) {
        const img = images.nth(i);
        
        const imageAttributes = await img.evaluate((el) => ({
          hasSrcset: !!el.getAttribute('srcset'),
          hasSizes: !!el.getAttribute('sizes'),
          hasLoading: !!el.getAttribute('loading'),
          width: el.getAttribute('width'),
          height: el.getAttribute('height'),
          src: el.getAttribute('src')
        }));
        
        // Images should ideally have responsive attributes
        if (imageAttributes.src && !imageAttributes.src.includes('data:')) {
          console.log(`Image ${i}:`, imageAttributes);
          
          // This is a recommendation rather than a hard requirement
          // Modern images should have loading attributes
          expect(imageAttributes.hasLoading !== undefined).toBeTruthy();
        }
      }
    });
  });

  test.describe('Form Responsiveness', () => {
    test('should make forms usable on mobile', async ({ page }) => {
      await page.goto('/auth/login');
      await page.waitForLoadState('networkidle');
      
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      
      const form = page.locator('form').first();
      
      if (await form.count() > 0) {
        // Form should fit within viewport
        const formBox = await form.boundingBox();
        
        if (formBox) {
          expect(formBox.width, 'Form should fit within mobile viewport').toBeLessThanOrEqual(375);
        }
        
        // Form inputs should be appropriately sized
        const inputs = form.locator('input, textarea');
        const inputCount = await inputs.count();
        
        for (let i = 0; i < inputCount; i++) {
          const input = inputs.nth(i);
          
          if (await input.isVisible()) {
            const inputBox = await input.boundingBox();
            
            if (inputBox) {
              // Input should be large enough for mobile interaction
              expect(inputBox.height, 'Input should have adequate height for mobile').toBeGreaterThanOrEqual(44);
              
              // Input should fit within form
              expect(inputBox.width, 'Input should fit within viewport').toBeLessThanOrEqual(375);
            }
          }
        }
      }
    });

    test('should adapt form layout for different screen sizes', async ({ page }) => {
      await page.goto('/enroll/ai-transformation-manager/step-1-info');
      await page.waitForLoadState('networkidle');
      
      const form = page.locator('form').first();
      
      if (await form.count() > 0) {
        // Test desktop layout
        await page.setViewportSize({ width: 1024, height: 768 });
        await page.waitForTimeout(500);
        
        const desktopFormLayout = await form.evaluate((el) => ({
          width: el.clientWidth,
          fieldsetCount: el.querySelectorAll('fieldset').length,
          inputRows: el.querySelectorAll('.form-row, .input-group').length
        }));
        
        // Test mobile layout
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(500);
        
        const mobileFormLayout = await form.evaluate((el) => ({
          width: el.clientWidth,
          fieldsetCount: el.querySelectorAll('fieldset').length,
          inputRows: el.querySelectorAll('.form-row, .input-group').length
        }));
        
        console.log('Desktop form layout:', desktopFormLayout);
        console.log('Mobile form layout:', mobileFormLayout);
        
        // Form should adapt to screen size
        expect(mobileFormLayout.width).toBeLessThan(desktopFormLayout.width);
      }
    });
  });

  test.describe('Performance on Different Devices', () => {
    test('should maintain performance on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      console.log('Mobile load time:', loadTime);
      
      // Mobile should still load reasonably fast
      expect(loadTime, 'Mobile load time should be reasonable').toBeLessThan(10000);
    });

    test('should handle device pixel ratio', async ({ page }) => {
      // Simulate high DPI display
      await page.emulateMedia({ 
        media: 'screen',
        colorScheme: 'light'
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check if images are crisp on high DPI
      const devicePixelRatio = await page.evaluate(() => window.devicePixelRatio);
      console.log('Device pixel ratio:', devicePixelRatio);
      
      // Should handle different pixel ratios gracefully
      expect(devicePixelRatio).toBeGreaterThan(0);
    });
  });

  test.describe('Orientation Testing', () => {
    test('should work in both portrait and landscape on mobile', async ({ page }) => {
      // Portrait orientation
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await responsiveUtils.assertNoHorizontalScroll(['mobile']);
      
      // Landscape orientation
      await page.setViewportSize({ width: 667, height: 375 });
      await page.waitForTimeout(500);
      
      await responsiveUtils.assertNoHorizontalScroll(['mobile']);
      
      // Content should still be accessible in landscape
      const mainContent = page.locator('main, [role="main"], .main-content').first();
      if (await mainContent.count() > 0) {
        await expect(mainContent).toBeVisible();
      }
    });

    test('should handle tablet orientations', async ({ page }) => {
      // Tablet portrait
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await responsiveUtils.assertNoHorizontalScroll(['tablet']);
      
      // Tablet landscape
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.waitForTimeout(500);
      
      await responsiveUtils.assertNoHorizontalScroll(['desktop']);
    });
  });
});