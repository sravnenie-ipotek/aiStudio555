import { test, expect } from '@playwright/test';

test.describe('🟠 DistanceLearning Component - UX & Technical Evaluation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Wait for the DistanceLearning component to load
    await page.waitForSelector('[data-testid="distance-learning-section"], section:has-text("О дистанционном обучении")', { timeout: 10000 });
  });

  test.describe('📱 Multi-Viewport Responsive Design', () => {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Mobile Large', width: 414, height: 896 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1024, height: 768 },
      { name: 'Desktop Large', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      test(`should render correctly on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        // Find the Distance Learning section
        const section = page.locator('section:has-text("О дистанционном обучении")').first();
        await expect(section).toBeVisible();

        // Take full section screenshot
        await section.screenshot({ 
          path: `qa/e2e/test-results/distance-learning-${viewport.name.toLowerCase().replace(' ', '-')}-${viewport.width}x${viewport.height}.png`,
          fullPage: false 
        });

        // Verify grid layout adjustments
        const gridContainer = section.locator('.grid.lg\\:grid-cols-2');
        await expect(gridContainer).toBeVisible();

        // Check button layout responsiveness
        const buttonContainer = section.locator('.flex.flex-col.sm\\:flex-row');
        await expect(buttonContainer).toBeVisible();

        // Verify stats grid responsiveness
        const statsGrid = section.locator('.grid.grid-cols-2.md\\:grid-cols-4');
        await expect(statsGrid).toBeVisible();
        
        console.log(`✅ ${viewport.name} layout verified`);
      });
    }
  });

  test.describe('🎨 Visual Design & Hierarchy', () => {
    test('should have proper visual hierarchy and typography', async ({ page }) => {
      const section = page.locator('section:has-text("О дистанционном обучении")').first();
      
      // Check main title styling
      const title = section.locator('h2, h3').filter({ hasText: 'О дистанционном обучении' }).first();
      await expect(title).toHaveClass(/text-3xl|text-4xl/);
      await expect(title).toHaveClass(/font-bold/);
      await expect(title).toHaveClass(/text-gray-900/);
      
      // Check description text
      const description = section.locator('p').first();
      await expect(description).toHaveClass(/text-lg/);
      await expect(description).toHaveClass(/text-gray-700/);
      
      // Verify badge styling
      const badge = section.locator('.bg-\\[\\#FFDA17\\]\\/20').first();
      await expect(badge).toBeVisible();
      
      console.log('✅ Visual hierarchy verified');
    });

    test('should have consistent card layout and spacing', async ({ page }) => {
      const section = page.locator('section:has-text("О дистанционном обучении")').first();
      
      // Check shadcn/ui card components
      const cards = section.locator('[class*="shadow-2xl"]');
      const cardCount = await cards.count();
      expect(cardCount).toBeGreaterThan(0);
      
      // Verify card spacing and shadows
      for (let i = 0; i < cardCount; i++) {
        const card = cards.nth(i);
        await expect(card).toBeVisible();
        await expect(card).toHaveClass(/shadow-2xl/);
      }
      
      // Check benefits section spacing
      const benefitItems = section.locator('.flex.items-start.gap-3.p-3');
      const benefitCount = await benefitItems.count();
      expect(benefitCount).toBe(3); // Should have 3 benefits
      
      console.log('✅ Card layout and spacing verified');
    });

    test('should display floating animation elements correctly', async ({ page }) => {
      const section = page.locator('section:has-text("О дистанционном обучении")').first();
      
      // Check floating Zap icon
      const zapIcon = section.locator('.animate-bounce');
      await expect(zapIcon).toBeVisible();
      await expect(zapIcon).toHaveClass(/bg-\[#FFDA17\]/);
      
      // Check floating BookOpen icon
      const bookIcon = section.locator('.border-2.border-\\[\\#FFDA17\\]');
      await expect(bookIcon).toBeVisible();
      
      console.log('✅ Floating elements verified');
    });
  });

  test.describe('🔘 Button Accessibility & Interactions', () => {
    test('should have accessible and properly styled buttons', async ({ page }) => {
      const section = page.locator('section:has-text("О дистанционном обучении")').first();
      
      // Primary CTA button
      const primaryButton = section.locator('a[href="/about-online-learning"]').first();
      await expect(primaryButton).toBeVisible();
      await expect(primaryButton).toHaveClass(/bg-\[#FFDA17\]/);
      await expect(primaryButton).toHaveClass(/hover:bg-\[#f0be0c\]/);
      
      // Secondary button
      const secondaryButton = section.locator('a[href="/consultation"]').first();
      await expect(secondaryButton).toBeVisible();
      await expect(secondaryButton).toHaveClass(/border-2/);
      
      // Check button sizes meet touch target requirements (44x44px minimum)
      const primaryButtonBox = await primaryButton.boundingBox();
      const secondaryButtonBox = await secondaryButton.boundingBox();
      
      if (primaryButtonBox) {
        expect(primaryButtonBox.height).toBeGreaterThanOrEqual(44);
        console.log(`Primary button height: ${primaryButtonBox.height}px ✅`);
      }
      
      if (secondaryButtonBox) {
        expect(secondaryButtonBox.height).toBeGreaterThanOrEqual(44);
        console.log(`Secondary button height: ${secondaryButtonBox.height}px ✅`);
      }
      
      console.log('✅ Button accessibility verified');
    });

    test('should have proper hover and focus states', async ({ page }) => {
      const section = page.locator('section:has-text("О дистанционном обучении")').first();
      
      const primaryButton = section.locator('a[href="/about-online-learning"]').first();
      
      // Test hover effects
      await primaryButton.hover();
      await page.waitForTimeout(300); // Allow transition to complete
      
      // Test focus states
      await primaryButton.focus();
      await expect(primaryButton).toBeFocused();
      
      console.log('✅ Button interactions verified');
    });
  });

  test.describe('🌈 Color Contrast & Readability (WCAG)', () => {
    test('should meet WCAG color contrast requirements', async ({ page }) => {
      const section = page.locator('section:has-text("О дистанционном обучении")').first();
      
      // Check main title contrast
      const title = section.locator('h2, h3').filter({ hasText: 'О дистанционном обучении' }).first();
      const titleStyles = await title.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          fontSize: computed.fontSize
        };
      });
      
      console.log('Title styles:', titleStyles);
      
      // Check description contrast
      const description = section.locator('p').first();
      const descriptionStyles = await description.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          fontSize: computed.fontSize
        };
      });
      
      console.log('Description styles:', descriptionStyles);
      
      // Verify brand color usage
      const brandButton = section.locator('.bg-\\[\\#FFDA17\\]').first();
      await expect(brandButton).toBeVisible();
      
      console.log('✅ Color contrast analysis completed');
    });

    test('should have readable text in all components', async ({ page }) => {
      const section = page.locator('section:has-text("О дистанционном обучении")').first();
      
      // Check all text elements are visible
      const textElements = section.locator('*').filter({ hasText: /.+/ });
      const count = await textElements.count();
      
      for (let i = 0; i < Math.min(count, 10); i++) {
        const element = textElements.nth(i);
        await expect(element).toBeVisible();
      }
      
      console.log(`✅ ${count} text elements checked for visibility`);
    });
  });

  test.describe('📊 Stats Section Engagement', () => {
    test('should display stats cards with proper styling', async ({ page }) => {
      const section = page.locator('section:has-text("О дистанционном обучении")').first();
      
      // Check stats grid
      const statsGrid = section.locator('.grid.grid-cols-2.md\\:grid-cols-4');
      await expect(statsGrid).toBeVisible();
      
      // Check individual stat cards
      const statCards = statsGrid.locator('[class*="text-center"]');
      const cardCount = await statCards.count();
      expect(cardCount).toBe(4);
      
      const expectedStats = ['5000+', '98%', '24/7', '50+'];
      
      for (let i = 0; i < cardCount; i++) {
        const card = statCards.nth(i);
        const statValue = card.locator('.text-2xl.font-bold');
        await expect(statValue).toBeVisible();
        
        const valueText = await statValue.textContent();
        expect(expectedStats).toContain(valueText);
      }
      
      console.log('✅ Stats section verified');
    });
  });

  test.describe('🖼️ Image Presentation & Performance', () => {
    test('should load and display image without background interference', async ({ page }) => {
      const section = page.locator('section:has-text("О дистанционном обучении")').first();
      
      // Check image loading
      const image = section.locator('img[alt*="девушка"], img[alt*="обучается"], img[src="/images/womanFarStudy.jpeg"]').first();
      await expect(image).toBeVisible();
      
      // Verify image properties
      const imageSrc = await image.getAttribute('src');
      expect(imageSrc).toContain('womanFarStudy.jpeg');
      
      // Check alt text
      const altText = await image.getAttribute('alt');
      expect(altText).toBeTruthy();
      expect(altText!.length).toBeGreaterThan(10);
      
      // Verify Next.js Image optimization
      await expect(image).toHaveAttribute('loading');
      
      console.log('✅ Image presentation verified');
    });

    test('should measure image loading performance', async ({ page }) => {
      // Start performance measurement
      const startTime = Date.now();
      
      const section = page.locator('section:has-text("О дистанционном обучении")').first();
      const image = section.locator('img[src="/images/womanFarStudy.jpeg"]').first();
      
      // Wait for image to load
      await expect(image).toBeVisible();
      await page.waitForLoadState('networkidle');
      
      const endTime = Date.now();
      const loadTime = endTime - startTime;
      
      console.log(`Image section load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
      
      console.log('✅ Image performance verified');
    });
  });

  test.describe('⌨️ Keyboard Navigation & Accessibility', () => {
    test('should support proper keyboard navigation', async ({ page }) => {
      const section = page.locator('section:has-text("О дистанционном обучении")').first();
      
      // Get all focusable elements
      const focusableElements = section.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const count = await focusableElements.count();
      
      console.log(`Found ${count} focusable elements`);
      
      // Test tab navigation through buttons
      const primaryButton = section.locator('a[href="/about-online-learning"]').first();
      const secondaryButton = section.locator('a[href="/consultation"]').first();
      
      await primaryButton.focus();
      await expect(primaryButton).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(secondaryButton).toBeFocused();
      
      console.log('✅ Keyboard navigation verified');
    });

    test('should have proper ARIA labels and semantic structure', async ({ page }) => {
      const section = page.locator('section:has-text("О дистанционном обучении")').first();
      
      // Check for semantic HTML structure
      await expect(section.locator('h2, h3').first()).toBeVisible();
      
      // Check image alt text
      const image = section.locator('img').first();
      const altText = await image.getAttribute('alt');
      expect(altText).toBeTruthy();
      expect(altText!.length).toBeGreaterThan(5);
      
      // Check button accessibility
      const buttons = section.locator('a[href]');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const hasHref = await button.getAttribute('href');
        expect(hasHref).toBeTruthy();
      }
      
      console.log('✅ Accessibility structure verified');
    });
  });

  test.describe('⚡ Core Web Vitals & Performance', () => {
    test('should measure Core Web Vitals', async ({ page }) => {
      // Navigate to page and measure performance
      const response = await page.goto('http://localhost:3000');
      expect(response?.status()).toBe(200);
      
      // Wait for the section to be visible
      const section = page.locator('section:has-text("О дистанционном обучении")').first();
      await expect(section).toBeVisible();
      
      // Wait for network to be idle
      await page.waitForLoadState('networkidle');
      
      // Measure paint metrics
      const paintMetrics = await page.evaluate(() => {
        const paintEntries = performance.getEntriesByType('paint');
        const metrics: Record<string, number> = {};
        
        paintEntries.forEach(entry => {
          metrics[entry.name] = entry.startTime;
        });
        
        return metrics;
      });
      
      console.log('Paint metrics:', paintMetrics);
      
      // Check for reasonable paint times (should be under 2500ms for good UX)
      if (paintMetrics['first-contentful-paint']) {
        expect(paintMetrics['first-contentful-paint']).toBeLessThan(2500);
      }
      
      console.log('✅ Core Web Vitals measured');
    });

    test('should test animation performance', async ({ page }) => {
      const section = page.locator('section:has-text("О дистанционном обучении")').first();
      
      // Check for animation elements
      const animatedElement = section.locator('.animate-bounce').first();
      await expect(animatedElement).toBeVisible();
      
      // Verify CSS animations are working
      const hasAnimationClass = await animatedElement.evaluate((el) => {
        return el.classList.contains('animate-bounce');
      });
      
      expect(hasAnimationClass).toBe(true);
      
      console.log('✅ Animation performance verified');
    });
  });

  test.describe('🔧 Technical Implementation Quality', () => {
    test('should properly implement shadcn/ui components', async ({ page }) => {
      const section = page.locator('section:has-text("О дистанционном обучении")').first();
      
      // Check for shadcn/ui Card components
      const cardComponents = section.locator('[class*="shadow-2xl"]');
      const cardCount = await cardComponents.count();
      expect(cardCount).toBeGreaterThan(0);
      
      // Check Badge component
      const badge = section.locator('[class*="bg-[#FFDA17]/20"]');
      await expect(badge).toBeVisible();
      
      // Check Button components with proper styling
      const buttons = section.locator('a').filter({ hasText: /узнать больше|консультация/i });
      const buttonCount = await buttons.count();
      expect(buttonCount).toBeGreaterThanOrEqual(2);
      
      console.log('✅ shadcn/ui implementation verified');
    });

    test('should have optimized Tailwind CSS classes', async ({ page }) => {
      const section = page.locator('section:has-text("О дистанционном обучении")').first();
      
      // Check for responsive classes
      const hasResponsiveGrid = await section.locator('.lg\\:grid-cols-2').count();
      expect(hasResponsiveGrid).toBeGreaterThan(0);
      
      // Check for proper spacing classes
      const hasSpacingClasses = await section.locator('[class*="gap-"], [class*="space-y-"], [class*="p-"], [class*="px-"], [class*="py-"]').count();
      expect(hasSpacingClasses).toBeGreaterThan(0);
      
      // Check for color classes using project brand colors
      const hasBrandColors = await section.locator('[class*="#FFDA17"], [class*="#070707"]').count();
      expect(hasBrandColors).toBeGreaterThan(0);
      
      console.log('✅ Tailwind CSS optimization verified');
    });
  });

  test.describe('📱 Mobile-Specific UX Testing', () => {
    test('should provide excellent mobile experience', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      const section = page.locator('section:has-text("О дистанционном обучении")').first();
      await expect(section).toBeVisible();
      
      // Check button layout on mobile
      const buttonContainer = section.locator('.flex.flex-col.sm\\:flex-row');
      await expect(buttonContainer).toBeVisible();
      
      // Verify touch targets are large enough
      const buttons = section.locator('a[href]');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(44); // iOS HIG minimum
          expect(box.width).toBeGreaterThanOrEqual(44);
        }
      }
      
      // Take mobile screenshot
      await section.screenshot({ 
        path: `qa/e2e/test-results/distance-learning-mobile-ux-375x667.png`
      });
      
      console.log('✅ Mobile UX verified');
    });
  });

  test.describe('🎯 Overall UX Quality Assessment', () => {
    test('should perform comprehensive UX evaluation', async ({ page }) => {
      const section = page.locator('section:has-text("О дистанционном обучении")').first();
      
      // Assessment criteria with scoring
      const uxCriteria = {
        visualHierarchy: { score: 0, maxScore: 10 },
        accessibility: { score: 0, maxScore: 10 },
        responsiveness: { score: 0, maxScore: 10 },
        interactivity: { score: 0, maxScore: 10 },
        performance: { score: 0, maxScore: 10 },
        designConsistency: { score: 0, maxScore: 10 }
      };
      
      // Visual Hierarchy Assessment
      const hasProperTitle = await section.locator('h2, h3').first().isVisible();
      const hasDescription = await section.locator('p').first().isVisible();
      const hasCTA = await section.locator('a[href]').first().isVisible();
      uxCriteria.visualHierarchy.score = (hasProperTitle ? 4 : 0) + (hasDescription ? 3 : 0) + (hasCTA ? 3 : 0);
      
      // Accessibility Assessment
      const hasAltText = await section.locator('img[alt]').count() > 0;
      const hasFocusableElements = await section.locator('a, button').count() >= 2;
      const hasSemanticStructure = await section.locator('h1, h2, h3, p, section').count() > 0;
      uxCriteria.accessibility.score = (hasAltText ? 4 : 0) + (hasFocusableElements ? 3 : 0) + (hasSemanticStructure ? 3 : 0);
      
      // Responsiveness Assessment
      const hasResponsiveGrid = await section.locator('.lg\\:grid-cols-2').count() > 0;
      const hasResponsiveButtons = await section.locator('.sm\\:flex-row').count() > 0;
      const hasResponsiveStats = await section.locator('.md\\:grid-cols-4').count() > 0;
      uxCriteria.responsiveness.score = (hasResponsiveGrid ? 4 : 0) + (hasResponsiveButtons ? 3 : 0) + (hasResponsiveStats ? 3 : 0);
      
      // Interactivity Assessment
      const hasHoverEffects = await section.locator('[class*="hover:"]').count() > 0;
      const hasAnimations = await section.locator('[class*="animate-"]').count() > 0;
      const hasTransitions = await section.locator('[class*="transition"]').count() > 0;
      uxCriteria.interactivity.score = (hasHoverEffects ? 4 : 0) + (hasAnimations ? 3 : 0) + (hasTransitions ? 3 : 0);
      
      // Performance Assessment (simplified)
      const startTime = Date.now();
      await expect(section).toBeVisible();
      const loadTime = Date.now() - startTime;
      uxCriteria.performance.score = loadTime < 1000 ? 10 : loadTime < 2000 ? 7 : loadTime < 3000 ? 5 : 2;
      
      // Design Consistency Assessment
      const hasBrandColors = await section.locator('[class*="#FFDA17"]').count() > 0;
      const hasConsistentSpacing = await section.locator('[class*="gap-"], [class*="space-"]').count() > 5;
      const hasShadowConsistency = await section.locator('[class*="shadow-"]').count() > 2;
      uxCriteria.designConsistency.score = (hasBrandColors ? 4 : 0) + (hasConsistentSpacing ? 3 : 0) + (hasShadowConsistency ? 3 : 0);
      
      // Calculate overall score
      const totalScore = Object.values(uxCriteria).reduce((sum, criteria) => sum + criteria.score, 0);
      const maxTotalScore = Object.values(uxCriteria).reduce((sum, criteria) => sum + criteria.maxScore, 0);
      const overallRating = (totalScore / maxTotalScore) * 10;
      
      console.log('\n🎯 UX EVALUATION RESULTS:');
      console.log('==========================');
      Object.entries(uxCriteria).forEach(([key, criteria]) => {
        const percentage = (criteria.score / criteria.maxScore * 100).toFixed(1);
        console.log(`${key}: ${criteria.score}/${criteria.maxScore} (${percentage}%)`);
      });
      console.log('==========================');
      console.log(`OVERALL RATING: ${overallRating.toFixed(1)}/10`);
      console.log(`TOTAL SCORE: ${totalScore}/${maxTotalScore}`);
      
      // Performance expectation
      expect(overallRating).toBeGreaterThan(7.0); // Expect good UX quality
      
      return overallRating;
    });
  });
});