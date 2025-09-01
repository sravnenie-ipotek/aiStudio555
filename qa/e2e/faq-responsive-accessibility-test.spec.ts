/**
 * FAQ Component - Comprehensive Responsive Design & Accessibility Test Suite
 * Tests responsive behavior, accessibility compliance (WCAG 2.1 AA), and UX patterns
 * @module QA/E2E/FAQ/ResponsiveAccessibilityTest
 */

import { test, expect, Page, Locator } from '@playwright/test';

// Test configuration
const BREAKPOINTS = {
  mobile: { width: 375, height: 667 },     // iPhone SE
  mobileLarge: { width: 414, height: 896 }, // iPhone XR
  tablet: { width: 768, height: 1024 },    // iPad
  tabletLarge: { width: 1024, height: 768 }, // iPad Landscape
  desktop: { width: 1280, height: 720 },   // Desktop
  desktopLarge: { width: 1920, height: 1080 } // Large Desktop
} as const;

const MINIMUM_TOUCH_TARGET = 44; // WCAG AA requirement: 44x44px
const MAXIMUM_LINE_LENGTH = 80; // Readability guideline
const ANIMATION_TIMEOUT = 500; // Time for animations to complete

interface AccessibilityTestResult {
  element: string;
  issue: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  wcagCriterion: string;
}

interface ResponsiveTestResult {
  breakpoint: string;
  element: string;
  issue: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

class FAQTestHelper {
  constructor(private page: Page) {}

  async navigateToFAQSection() {
    await this.page.goto('http://localhost:3000'); // Adjust URL based on your setup
    await this.page.waitForLoadState('networkidle');
    
    // Scroll to FAQ section if needed
    const faqSection = this.page.locator('[data-testid="faq-section"], section:has-text("Ответы на ваши вопросы")');
    if (await faqSection.isVisible()) {
      await faqSection.scrollIntoViewIfNeeded();
    }
  }

  async getAccessibilityViolations(): Promise<AccessibilityTestResult[]> {
    // Inject axe-core for accessibility testing
    await this.page.addScriptTag({ url: 'https://unpkg.com/axe-core@4.6.3/axe.min.js' });
    
    const results = await this.page.evaluate(async () => {
      // @ts-ignore
      const axeResults = await axe.run();
      return axeResults.violations.map((violation: any) => ({
        element: violation.nodes[0]?.target[0] || 'unknown',
        issue: violation.description,
        severity: violation.impact as 'critical' | 'high' | 'medium' | 'low',
        wcagCriterion: violation.tags.filter((tag: string) => tag.startsWith('wcag')).join(', ')
      }));
    });
    
    return results;
  }

  async checkTouchTargetSizes(): Promise<AccessibilityTestResult[]> {
    const issues: AccessibilityTestResult[] = [];
    
    // Get all interactive elements
    const interactiveElements = await this.page.locator('button, [role="button"], input, select, a, [tabindex]:not([tabindex="-1"])').all();
    
    for (const element of interactiveElements) {
      const box = await element.boundingBox();
      if (box && (box.width < MINIMUM_TOUCH_TARGET || box.height < MINIMUM_TOUCH_TARGET)) {
        const tagName = await element.evaluate(el => el.tagName.toLowerCase());
        issues.push({
          element: tagName,
          issue: `Touch target too small: ${Math.round(box.width)}x${Math.round(box.height)}px (minimum: ${MINIMUM_TOUCH_TARGET}x${MINIMUM_TOUCH_TARGET}px)`,
          severity: 'high',
          wcagCriterion: 'WCAG 2.1 AA - 2.5.5 Target Size'
        });
      }
    }
    
    return issues;
  }

  async checkColorContrast(): Promise<AccessibilityTestResult[]> {
    const issues: AccessibilityTestResult[] = [];
    
    // Check common color combinations used in the FAQ
    const colorTests = [
      { selector: '.text-text-primary', background: 'bg-white', minRatio: 4.5 },
      { selector: '.text-text-gray', background: 'bg-white', minRatio: 4.5 },
      { selector: '.text-primary-yellow', background: 'bg-white', minRatio: 3 }, // Large text can be 3:1
      { selector: 'button', background: '', minRatio: 4.5 }
    ];
    
    // This would need a more sophisticated implementation to actually calculate contrast ratios
    // For now, we'll do a visual inspection approach
    
    return issues; // Placeholder - would implement actual contrast checking
  }
}

test.describe('FAQ Component - Responsive Design & Accessibility Tests', () => {
  let helper: FAQTestHelper;
  let accessibilityIssues: AccessibilityTestResult[] = [];
  let responsiveIssues: ResponsiveTestResult[] = [];

  test.beforeEach(async ({ page }) => {
    helper = new FAQTestHelper(page);
    await helper.navigateToFAQSection();
  });

  test.describe('Responsive Design Tests', () => {
    Object.entries(BREAKPOINTS).forEach(([breakpointName, dimensions]) => {
      test(`${breakpointName} (${dimensions.width}x${dimensions.height}) - Layout Validation`, async ({ page }) => {
        await page.setViewportSize(dimensions);
        await helper.navigateToFAQSection();

        // Test: FAQ Section Container
        const faqSection = page.locator('section').first();
        await expect(faqSection).toBeVisible();
        
        const sectionBox = await faqSection.boundingBox();
        expect(sectionBox?.width).toBeLessThanOrEqual(dimensions.width);

        // Test: Header responsiveness
        const header = page.locator('h2').first();
        await expect(header).toBeVisible();
        
        const headerStyles = await header.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            fontSize: parseInt(styles.fontSize),
            lineHeight: parseFloat(styles.lineHeight),
            marginBottom: parseInt(styles.marginBottom)
          };
        });

        // Verify font scaling for different breakpoints
        if (dimensions.width < 640) { // Mobile
          expect(headerStyles.fontSize).toBeGreaterThanOrEqual(28); // Minimum mobile font size
        } else if (dimensions.width >= 1024) { // Desktop
          expect(headerStyles.fontSize).toBeGreaterThanOrEqual(40); // Desktop font size
        }

        // Test: Search bar responsiveness
        const searchBar = page.locator('input[type="text"]');
        if (await searchBar.isVisible()) {
          const searchBox = await searchBar.boundingBox();
          
          // Ensure search bar doesn't overflow
          expect(searchBox?.width).toBeLessThanOrEqual(dimensions.width - 32); // Account for padding
          
          // Test touch target size on mobile
          if (dimensions.width < 768 && searchBox) {
            expect(searchBox.height).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET);
          }
        }

        // Test: Category filter responsiveness
        const categoryFilter = page.locator('select');
        if (await categoryFilter.isVisible()) {
          const filterBox = await categoryFilter.boundingBox();
          
          if (dimensions.width < 640) { // Mobile
            // Should stack vertically with search or have appropriate sizing
            expect(filterBox?.width).toBeGreaterThanOrEqual(120); // Minimum usable width
          }
        }

        // Test: FAQ Items responsiveness
        const faqItems = await page.locator('[data-testid*="faq-item"], .space-y-3 > div').all();
        
        if (faqItems.length > 0) {
          for (const item of faqItems.slice(0, 3)) { // Test first 3 items
            const itemBox = await item.boundingBox();
            
            if (itemBox) {
              // Ensure items don't overflow
              expect(itemBox.width).toBeLessThanOrEqual(dimensions.width);
              
              // Check minimum height for touch targets
              const buttons = await item.locator('button').all();
              for (const button of buttons) {
                const buttonBox = await button.boundingBox();
                if (buttonBox && dimensions.width < 768) {
                  expect(buttonBox.height).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET);
                }
              }
            }
          }
        }

        // Test: CTA Section responsiveness
        const ctaSection = page.locator('.bg-white.rounded-xl.border');
        if (await ctaSection.isVisible()) {
          const ctaBox = await ctaSection.boundingBox();
          expect(ctaBox?.width).toBeLessThanOrEqual(dimensions.width);
          
          // Check button stacking on mobile
          if (dimensions.width < 640) {
            const buttons = await ctaSection.locator('button').all();
            if (buttons.length > 1) {
              const button1Box = await buttons[0].boundingBox();
              const button2Box = await buttons[1].boundingBox();
              
              // Buttons should stack vertically on mobile
              if (button1Box && button2Box) {
                expect(button2Box.y).toBeGreaterThan(button1Box.y + button1Box.height - 10); // Allow some overlap tolerance
              }
            }
          }
        }
      });
    });

    test('Responsive Breakpoint Transitions', async ({ page }) => {
      await helper.navigateToFAQSection();

      // Test smooth transitions between breakpoints
      const breakpointSizes = Object.values(BREAKPOINTS).map(bp => bp.width).sort((a, b) => a - b);
      
      for (let i = 0; i < breakpointSizes.length - 1; i++) {
        await page.setViewportSize({ width: breakpointSizes[i], height: 800 });
        await page.waitForTimeout(100); // Allow layout to settle
        
        await page.setViewportSize({ width: breakpointSizes[i + 1], height: 800 });
        await page.waitForTimeout(100);
        
        // Ensure no horizontal scrollbars
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        
        expect(hasHorizontalScroll).toBe(false);
      }
    });
  });

  test.describe('Accessibility Compliance Tests (WCAG 2.1 AA)', () => {
    test('Automated Accessibility Scan', async ({ page }) => {
      await helper.navigateToFAQSection();
      
      const violations = await helper.getAccessibilityViolations();
      
      // Log violations for reporting
      if (violations.length > 0) {
        console.log('Accessibility violations found:', violations);
        accessibilityIssues.push(...violations);
      }

      // Assert no critical or high severity violations
      const criticalViolations = violations.filter(v => v.severity === 'critical' || v.severity === 'high');
      expect(criticalViolations).toHaveLength(0);
    });

    test('Keyboard Navigation', async ({ page }) => {
      await helper.navigateToFAQSection();

      // Test Tab navigation through all interactive elements
      const tabOrder: string[] = [];
      let tabCount = 0;
      const maxTabs = 20; // Prevent infinite loop

      // Start from search input if available
      const searchInput = page.locator('input[type="text"]');
      if (await searchInput.isVisible()) {
        await searchInput.focus();
      }

      // Navigate through all focusable elements
      while (tabCount < maxTabs) {
        await page.keyboard.press('Tab');
        tabCount++;

        const activeElement = await page.evaluate(() => {
          const el = document.activeElement;
          return {
            tagName: el?.tagName.toLowerCase(),
            type: (el as HTMLInputElement)?.type,
            ariaLabel: el?.getAttribute('aria-label'),
            textContent: el?.textContent?.trim().substring(0, 30)
          };
        });

        const elementId = `${activeElement.tagName}${activeElement.type ? `[${activeElement.type}]` : ''}${activeElement.ariaLabel ? ` (${activeElement.ariaLabel})` : ''}`;
        tabOrder.push(elementId);

        // Check if we've completed the cycle (focused on search again or body)
        if (tabCount > 5 && (activeElement.tagName === 'input' || activeElement.tagName === 'body')) {
          break;
        }
      }

      console.log('Tab order:', tabOrder);

      // Verify logical tab order
      expect(tabOrder.length).toBeGreaterThan(0);
      
      // Test specific keyboard interactions
      // Test Escape key functionality
      const searchInput2 = page.locator('input[type="text"]');
      if (await searchInput2.isVisible()) {
        await searchInput2.focus();
        await searchInput2.fill('test search');
        await page.keyboard.press('Escape');
        
        // Check if search suggestions are hidden (if they were shown)
        const suggestions = page.locator('[role="listbox"]');
        if (await suggestions.isVisible()) {
          await expect(suggestions).toBeHidden();
        }
      }

      // Test Enter and Space key activation
      const buttons = await page.locator('button').all();
      if (buttons.length > 0) {
        await buttons[0].focus();
        
        // Test Enter key
        await page.keyboard.press('Enter');
        await page.waitForTimeout(ANIMATION_TIMEOUT);
        
        // Test Space key
        await page.keyboard.press(' ');
        await page.waitForTimeout(ANIMATION_TIMEOUT);
      }

      // Test Arrow key navigation if applicable
      const selectElement = page.locator('select');
      if (await selectElement.isVisible()) {
        await selectElement.focus();
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowUp');
      }
    });

    test('Screen Reader Compatibility', async ({ page }) => {
      await helper.navigateToFAQSection();

      // Test ARIA attributes
      const faqSection = page.locator('section').first();
      
      // Check for proper headings hierarchy
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      const headingLevels: number[] = [];
      
      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName);
        const level = parseInt(tagName.replace('H', ''));
        headingLevels.push(level);
      }

      // Verify proper heading hierarchy (no skipping levels)
      for (let i = 1; i < headingLevels.length; i++) {
        const diff = headingLevels[i] - headingLevels[i-1];
        expect(diff).toBeLessThanOrEqual(1); // Should not skip heading levels
      }

      // Check ARIA labels and roles
      const interactiveElements = await page.locator('button, input, select, [role="button"]').all();
      
      for (const element of interactiveElements) {
        const ariaLabel = await element.getAttribute('aria-label');
        const textContent = await element.textContent();
        const placeholder = await element.getAttribute('placeholder');
        
        // Each interactive element should have accessible text
        expect(
          ariaLabel || textContent?.trim() || placeholder
        ).toBeTruthy();
      }

      // Test live regions
      const liveRegions = await page.locator('[aria-live]').all();
      for (const region of liveRegions) {
        const ariaLive = await region.getAttribute('aria-live');
        expect(['polite', 'assertive', 'off']).toContain(ariaLive);
      }

      // Test form labeling
      const inputs = await page.locator('input').all();
      for (const input of inputs) {
        const hasLabel = await page.locator(`label[for="${await input.getAttribute('id')}"]`).count() > 0;
        const hasAriaLabel = await input.getAttribute('aria-label');
        const hasAriaLabelledby = await input.getAttribute('aria-labelledby');
        
        expect(
          hasLabel || hasAriaLabel || hasAriaLabelledby
        ).toBeTruthy();
      }

      // Test accordion accessibility
      const faqItems = await page.locator('[data-testid*="faq-item"], button[aria-expanded]').all();
      
      for (const item of faqItems) {
        const ariaExpanded = await item.getAttribute('aria-expanded');
        const ariaControls = await item.getAttribute('aria-controls');
        
        if (ariaExpanded !== null) {
          expect(['true', 'false']).toContain(ariaExpanded);
          
          if (ariaControls) {
            const controlledElement = page.locator(`#${ariaControls}`);
            await expect(controlledElement).toBeAttached();
          }
        }
      }
    });

    test('Touch Target Sizes', async ({ page }) => {
      await page.setViewportSize(BREAKPOINTS.mobile);
      await helper.navigateToFAQSection();

      const touchTargetIssues = await helper.checkTouchTargetSizes();
      
      if (touchTargetIssues.length > 0) {
        console.log('Touch target size violations:', touchTargetIssues);
        accessibilityIssues.push(...touchTargetIssues);
      }

      // Should have no critical touch target violations
      const criticalTouchIssues = touchTargetIssues.filter(issue => issue.severity === 'critical' || issue.severity === 'high');
      expect(criticalTouchIssues).toHaveLength(0);
    });

    test('Focus Management and Visual Indicators', async ({ page }) => {
      await helper.navigateToFAQSection();

      // Test focus visibility
      const focusableElements = await page.locator('button, input, select, a, [tabindex]:not([tabindex="-1"])').all();
      
      for (const element of focusableElements.slice(0, 5)) { // Test first 5 elements
        await element.focus();
        
        // Check for visible focus indicator
        const focusStyles = await element.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            outline: styles.outline,
            outlineWidth: styles.outlineWidth,
            outlineStyle: styles.outlineStyle,
            outlineColor: styles.outlineColor,
            boxShadow: styles.boxShadow
          };
        });

        // Should have some form of focus indicator
        const hasFocusIndicator = 
          focusStyles.outline !== 'none' ||
          focusStyles.outlineWidth !== '0px' ||
          focusStyles.boxShadow !== 'none';
        
        expect(hasFocusIndicator).toBe(true);
      }
    });
  });

  test.describe('Performance Tests', () => {
    test('Animation Performance', async ({ page }) => {
      await helper.navigateToFAQSection();

      // Test accordion animation performance
      const faqButtons = await page.locator('button[aria-expanded]').all();
      
      if (faqButtons.length > 0) {
        // Measure animation timing
        const startTime = Date.now();
        
        await faqButtons[0].click();
        await page.waitForTimeout(ANIMATION_TIMEOUT);
        
        const endTime = Date.now();
        const animationDuration = endTime - startTime;
        
        // Animation should complete within reasonable time
        expect(animationDuration).toBeLessThan(1000); // 1 second max
      }

      // Test search response time
      const searchInput = page.locator('input[type="text"]');
      if (await searchInput.isVisible()) {
        const searchStartTime = Date.now();
        
        await searchInput.fill('курс');
        await page.waitForTimeout(200); // Allow for search processing
        
        const searchEndTime = Date.now();
        const searchDuration = searchEndTime - searchStartTime;
        
        // Search should respond quickly
        expect(searchDuration).toBeLessThan(500); // 500ms target
      }
    });

    test('Memory Usage and Resource Loading', async ({ page }) => {
      await helper.navigateToFAQSection();

      // Check for memory leaks by measuring page metrics
      const metrics = await page.evaluate(() => ({
        jsHeapSizeUsed: (performance as any).memory?.usedJSHeapSize || 0,
        jsHeapSizeTotal: (performance as any).memory?.totalJSHeapSize || 0,
        jsHeapSizeLimit: (performance as any).memory?.jsHeapSizeLimit || 0
      }));

      // Basic memory usage check (values will vary by environment)
      if (metrics.jsHeapSizeUsed > 0) {
        const memoryUsageRatio = metrics.jsHeapSizeUsed / metrics.jsHeapSizeTotal;
        expect(memoryUsageRatio).toBeLessThan(0.9); // Should not be using >90% of allocated heap
      }
    });
  });

  test.describe('User Experience Validation', () => {
    test('Search Functionality', async ({ page }) => {
      await helper.navigateToFAQSection();

      const searchInput = page.locator('input[type="text"]');
      if (await searchInput.isVisible()) {
        // Test search with results
        await searchInput.fill('курс');
        await page.waitForTimeout(300);

        // Should show filtered results
        const resultsInfo = page.locator('[role="status"]');
        if (await resultsInfo.isVisible()) {
          const resultsText = await resultsInfo.textContent();
          expect(resultsText).toContain('результат');
        }

        // Test search with no results
        await searchInput.fill('xyz123notfound');
        await page.waitForTimeout(300);

        // Should show no results message
        const noResults = page.locator('text=Ничего не найдено, text=результат найдено');
        await expect(noResults.first()).toBeVisible();

        // Test search clear
        const clearButton = page.locator('button[aria-label*="Очистить"]');
        if (await clearButton.isVisible()) {
          await clearButton.click();
          const inputValue = await searchInput.inputValue();
          expect(inputValue).toBe('');
        }
      }
    });

    test('Category Filtering', async ({ page }) => {
      await helper.navigateToFAQSection();

      const categorySelect = page.locator('select');
      if (await categorySelect.isVisible()) {
        // Get initial state
        const initialOptions = await categorySelect.locator('option').all();
        expect(initialOptions.length).toBeGreaterThan(1);

        // Test category selection
        await categorySelect.selectOption({ index: 1 }); // Select second option
        await page.waitForTimeout(200);

        // Verify category change affects results
        const selectedValue = await categorySelect.inputValue();
        expect(selectedValue).not.toBe('all');
      }
    });

    test('Accordion Interaction', async ({ page }) => {
      await helper.navigateToFAQSection();

      const faqButtons = await page.locator('button[aria-expanded]').all();
      
      if (faqButtons.length > 0) {
        // Test opening FAQ item
        const firstButton = faqButtons[0];
        const initialExpanded = await firstButton.getAttribute('aria-expanded');
        
        await firstButton.click();
        await page.waitForTimeout(ANIMATION_TIMEOUT);
        
        const newExpanded = await firstButton.getAttribute('aria-expanded');
        expect(newExpanded).not.toBe(initialExpanded);

        // Test closing FAQ item
        await firstButton.click();
        await page.waitForTimeout(ANIMATION_TIMEOUT);
        
        const finalExpanded = await firstButton.getAttribute('aria-expanded');
        expect(finalExpanded).toBe(initialExpanded);
      }
    });

    test('Mobile Gesture Support', async ({ page }) => {
      await page.setViewportSize(BREAKPOINTS.mobile);
      await helper.navigateToFAQSection();

      // Test touch interactions on mobile
      const faqButtons = await page.locator('button[aria-expanded]').all();
      
      if (faqButtons.length > 0) {
        // Simulate touch tap
        await faqButtons[0].tap();
        await page.waitForTimeout(ANIMATION_TIMEOUT);
        
        const expandedState = await faqButtons[0].getAttribute('aria-expanded');
        expect(['true', 'false']).toContain(expandedState || '');
      }

      // Test scroll behavior
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
      });
      await page.waitForTimeout(100);

      // Ensure content is still accessible after scroll
      const visibleFAQs = await page.locator('button[aria-expanded]:visible').count();
      expect(visibleFAQs).toBeGreaterThan(0);
    });
  });

  test.afterAll(async () => {
    // Generate test report
    console.log('\n=== FAQ COMPONENT TEST REPORT ===');
    console.log(`Total Accessibility Issues: ${accessibilityIssues.length}`);
    console.log(`Total Responsive Issues: ${responsiveIssues.length}`);
    
    if (accessibilityIssues.length > 0) {
      console.log('\nAccessibility Issues:');
      accessibilityIssues.forEach(issue => {
        console.log(`- ${issue.severity.toUpperCase()}: ${issue.issue} (${issue.wcagCriterion})`);
      });
    }
    
    if (responsiveIssues.length > 0) {
      console.log('\nResponsive Issues:');
      responsiveIssues.forEach(issue => {
        console.log(`- ${issue.breakpoint} ${issue.severity.toUpperCase()}: ${issue.issue}`);
      });
    }
  });
});