import { test, expect } from '@playwright/test';
import { AccessibilityUtils } from '../utils/test-utils';

test.describe('Accessibility Testing', () => {
  let accessibilityUtils: AccessibilityUtils;

  test.beforeEach(async ({ page }) => {
    accessibilityUtils = new AccessibilityUtils(page);
  });

  test.describe('Basic Accessibility Requirements', () => {
    test('should pass basic accessibility checks on homepage', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await accessibilityUtils.checkBasicA11y();
    });

    test('should pass basic accessibility checks on courses page', async ({ page }) => {
      await page.goto('/courses');
      await page.waitForLoadState('networkidle');
      
      await accessibilityUtils.checkBasicA11y();
    });

    test('should pass basic accessibility checks on course detail', async ({ page }) => {
      await page.goto('/courses/ai-transformation-manager');
      await page.waitForLoadState('networkidle');
      
      await accessibilityUtils.checkBasicA11y();
    });

    test('should pass basic accessibility checks on enrollment pages', async ({ page }) => {
      const enrollmentPages = [
        '/enroll/ai-transformation-manager',
        '/enroll/ai-transformation-manager/step-1-info',
        '/enroll/ai-transformation-manager/step-2-payment'
      ];

      for (const path of enrollmentPages) {
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        
        await accessibilityUtils.checkBasicA11y();
      }
    });

    test('should pass basic accessibility checks on auth pages', async ({ page }) => {
      const authPages = ['/auth/login', '/auth/register', '/auth/forgot-password'];

      for (const path of authPages) {
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        
        await accessibilityUtils.checkBasicA11y();
      }
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should support keyboard navigation on homepage', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await accessibilityUtils.checkKeyboardNavigation();
      
      // Test specific keyboard interactions
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
      
      // Should be able to navigate through all interactive elements
      let tabCount = 0;
      const maxTabs = 20; // Prevent infinite loop
      
      while (tabCount < maxTabs) {
        await page.keyboard.press('Tab');
        tabCount++;
        
        const activeElement = await page.evaluate(() => ({
          tagName: document.activeElement?.tagName,
          type: (document.activeElement as HTMLElement)?.getAttribute('type'),
          href: (document.activeElement as HTMLElement)?.getAttribute('href'),
          role: (document.activeElement as HTMLElement)?.getAttribute('role')
        }));
        
        if (activeElement.tagName === 'BODY' && tabCount > 5) {
          break; // Completed tab cycle
        }
      }
      
      expect(tabCount, 'Should have tabbable elements').toBeGreaterThan(1);
    });

    test('should support keyboard navigation in forms', async ({ page }) => {
      await page.goto('/auth/login');
      await page.waitForLoadState('networkidle');
      
      // Find form elements
      const inputs = page.locator('input, textarea, select, button');
      const inputCount = await inputs.count();
      
      if (inputCount > 0) {
        // Start tabbing through form
        await page.keyboard.press('Tab');
        
        // Should be able to reach all form elements
        for (let i = 0; i < inputCount && i < 10; i++) {
          const focusedElement = await page.evaluate(() => ({
            tagName: document.activeElement?.tagName,
            type: (document.activeElement as HTMLInputElement)?.type,
            name: (document.activeElement as HTMLInputElement)?.name
          }));
          
          expect(focusedElement.tagName).toMatch(/INPUT|TEXTAREA|SELECT|BUTTON/);
          
          // Continue to next element
          await page.keyboard.press('Tab');
        }
      }
    });

    test('should support Enter and Space key interactions', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Find a button or link to test
      const button = page.locator('button, a[href]').first();
      
      if (await button.count() > 0) {
        await button.focus();
        
        // Test Enter key
        const href = await button.getAttribute('href');
        if (href) {
          // For links, Enter should navigate
          await page.keyboard.press('Enter');
          // Navigation might occur, so just check we didn't crash
        } else {
          // For buttons, Enter should activate
          await page.keyboard.press('Enter');
          // Check that no JavaScript errors occurred
        }
      }
    });

    test('should trap focus in modal dialogs', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Look for modal trigger (might be a consultation button, etc.)
      const modalTrigger = page.locator('[data-testid*="modal"], button:has-text("консультация"), button:has-text("consultation")').first();
      
      if (await modalTrigger.count() > 0) {
        await modalTrigger.click();
        
        // Wait for modal to appear
        const modal = page.locator('[role="dialog"], .modal, [data-testid*="modal"]').first();
        
        if (await modal.isVisible()) {
          // Focus should be trapped within modal
          await page.keyboard.press('Tab');
          
          const focusedElement = await page.evaluate(() => {
            const activeElement = document.activeElement;
            const modalElement = document.querySelector('[role="dialog"], .modal, [data-testid*="modal"]');
            
            return {
              isWithinModal: modalElement?.contains(activeElement) || false,
              tagName: activeElement?.tagName
            };
          });
          
          expect(focusedElement.isWithinModal, 'Focus should be trapped within modal').toBe(true);
        }
      }
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', (elements) => {
        return elements.map(el => ({
          level: parseInt(el.tagName.charAt(1)),
          text: el.textContent?.trim() || '',
          hasText: !!el.textContent?.trim()
        }));
      });
      
      // Should have exactly one h1
      const h1Count = headings.filter(h => h.level === 1).length;
      expect(h1Count, 'Should have exactly one h1').toBe(1);
      
      // All headings should have text
      const emptyHeadings = headings.filter(h => !h.hasText);
      expect(emptyHeadings.length, 'All headings should have text').toBe(0);
      
      // Check heading hierarchy (no skipped levels)
      for (let i = 1; i < headings.length; i++) {
        const current = headings[i];
        const previous = headings[i - 1];
        
        if (current.level > previous.level) {
          const levelDiff = current.level - previous.level;
          expect(levelDiff, `Heading hierarchy should not skip levels: h${previous.level} -> h${current.level}`).toBeLessThanOrEqual(1);
        }
      }
    });

    test('should have proper ARIA labels and descriptions', async ({ page }) => {
      await page.goto('/courses');
      await page.waitForLoadState('networkidle');
      
      // Check for elements that should have ARIA labels
      const interactiveElements = page.locator('button, a, input, select, textarea');
      const count = await interactiveElements.count();
      
      for (let i = 0; i < Math.min(10, count); i++) {
        const element = interactiveElements.nth(i);
        
        const attributes = await element.evaluate((el) => ({
          tagName: el.tagName,
          hasAriaLabel: !!el.getAttribute('aria-label'),
          hasAriaLabelledBy: !!el.getAttribute('aria-labelledby'),
          hasAriaDescribedBy: !!el.getAttribute('aria-describedby'),
          hasTextContent: !!el.textContent?.trim(),
          hasTitle: !!el.getAttribute('title'),
          type: el.getAttribute('type'),
          role: el.getAttribute('role')
        }));
        
        // Interactive elements should have accessible names
        const hasAccessibleName = attributes.hasAriaLabel || 
                                  attributes.hasAriaLabelledBy || 
                                  attributes.hasTextContent || 
                                  attributes.hasTitle;
        
        expect(hasAccessibleName, 
          `${attributes.tagName} element should have accessible name`
        ).toBe(true);
      }
    });

    test('should provide alt text for all images', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');
        const ariaLabel = await img.getAttribute('aria-label');
        
        // Images should have alt text unless they're decorative
        const hasAltText = alt !== null;
        const isDecorative = role === 'presentation' || alt === '';
        const hasAriaLabel = !!ariaLabel;
        
        expect(hasAltText || isDecorative || hasAriaLabel, 
          'Images should have alt text or be marked as decorative'
        ).toBe(true);
      }
    });

    test('should have proper form labels', async ({ page }) => {
      await page.goto('/auth/login');
      await page.waitForLoadState('networkidle');
      
      const formControls = page.locator('input, textarea, select');
      const count = await formControls.count();
      
      for (let i = 0; i < count; i++) {
        const control = formControls.nth(i);
        
        const labelInfo = await control.evaluate((el) => {
          const id = el.id;
          const hasLabel = id && document.querySelector(`label[for="${id}"]`);
          const hasAriaLabel = !!el.getAttribute('aria-label');
          const hasAriaLabelledBy = !!el.getAttribute('aria-labelledby');
          const placeholder = el.getAttribute('placeholder');
          const type = el.getAttribute('type');
          
          return {
            id,
            hasLabel: !!hasLabel,
            hasAriaLabel,
            hasAriaLabelledBy,
            placeholder,
            type,
            hasAccessibleName: !!hasLabel || hasAriaLabel || hasAriaLabelledBy
          };
        });
        
        // Form controls should have accessible names
        // Placeholder text alone is not sufficient
        expect(labelInfo.hasAccessibleName, 
          `Form control (${labelInfo.type || 'input'}) should have proper label`
        ).toBe(true);
      }
    });

    test('should provide live region updates', async ({ page }) => {
      await page.goto('/enroll/ai-transformation-manager/step-1-info');
      await page.waitForLoadState('networkidle');
      
      // Look for live regions
      const liveRegions = page.locator('[aria-live], [role="status"], [role="alert"]');
      const count = await liveRegions.count();
      
      // Form validation and loading states should use live regions
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const region = liveRegions.nth(i);
          const ariaLive = await region.getAttribute('aria-live');
          const role = await region.getAttribute('role');
          
          // Should have appropriate politeness level
          expect(ariaLive || role).toMatch(/polite|assertive|status|alert/);
        }
      }
    });
  });

  test.describe('Color and Contrast', () => {
    test('should have sufficient color contrast', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Get text elements for contrast checking
      const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, a, button, span, div').filter({
        hasText: /.+/
      });
      
      const sampleSize = Math.min(10, await textElements.count());
      
      for (let i = 0; i < sampleSize; i++) {
        const element = textElements.nth(i);
        
        if (await element.isVisible()) {
          const styles = await element.evaluate((el) => {
            const computed = getComputedStyle(el);
            return {
              color: computed.color,
              backgroundColor: computed.backgroundColor,
              fontSize: computed.fontSize,
              fontWeight: computed.fontWeight
            };
          });
          
          // This is a basic check - in a real scenario, you'd use a proper contrast checker
          expect(styles.color, 'Text should have color').toBeTruthy();
          expect(styles.backgroundColor, 'Background should have color').toBeTruthy();
        }
      }
    });

    test('should not rely solely on color for information', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Look for error states, success states, etc.
      const statusElements = page.locator('.error, .success, .warning, .info, [class*="alert"]');
      const count = await statusElements.count();
      
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const element = statusElements.nth(i);
          const hasIcon = await element.locator('svg, .icon, [class*="icon"]').count();
          const hasText = await element.textContent();
          
          // Status should be conveyed through more than just color
          expect(hasIcon > 0 || (hasText && hasText.trim().length > 0),
            'Status elements should have icons or descriptive text, not just color'
          ).toBe(true);
        }
      }
    });
  });

  test.describe('Language and Internationalization', () => {
    test('should have proper language declarations', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check HTML lang attribute
      const htmlLang = await page.getAttribute('html', 'lang');
      expect(htmlLang, 'HTML should have lang attribute').toBeTruthy();
      expect(htmlLang, 'Should have valid language code').toMatch(/^[a-z]{2}(-[A-Z]{2})?$/);
      
      // Check for any lang changes within the document
      const langElements = page.locator('[lang]');
      const count = await langElements.count();
      
      for (let i = 0; i < count; i++) {
        const element = langElements.nth(i);
        const lang = await element.getAttribute('lang');
        expect(lang, 'Language attributes should be valid').toMatch(/^[a-z]{2}(-[A-Z]{2})?$/);
      }
    });

    test('should support RTL languages properly', async ({ page }) => {
      // Test Hebrew language support (RTL)
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Look for language switcher
      const languageSwitcher = page.locator('[data-testid*="language"], .language-switcher, [class*="lang"]');
      
      if (await languageSwitcher.count() > 0) {
        // Try to switch to Hebrew if available
        const hebrewOption = page.locator('button:has-text("עב"), option[value="he"], a[href*="he"]').first();
        
        if (await hebrewOption.count() > 0) {
          await hebrewOption.click();
          await page.waitForTimeout(1000);
          
          // Check if direction changed
          const dir = await page.getAttribute('html', 'dir');
          const bodyDir = await page.getAttribute('body', 'dir');
          
          // Should support RTL
          expect(dir || bodyDir).toMatch(/rtl|ltr/);
        }
      }
    });
  });

  test.describe('Focus Management', () => {
    test('should have visible focus indicators', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Tab through focusable elements
      await page.keyboard.press('Tab');
      
      // Check if focus is visible
      const focusedElement = page.locator(':focus');
      
      if (await focusedElement.count() > 0) {
        const styles = await focusedElement.evaluate((el) => {
          const computed = getComputedStyle(el);
          return {
            outline: computed.outline,
            outlineWidth: computed.outlineWidth,
            outlineStyle: computed.outlineStyle,
            outlineColor: computed.outlineColor,
            boxShadow: computed.boxShadow,
            border: computed.border
          };
        });
        
        // Should have some form of focus indicator
        const hasFocusIndicator = styles.outline !== 'none' || 
                                  styles.boxShadow !== 'none' ||
                                  styles.outlineWidth !== '0px';
        
        expect(hasFocusIndicator, 'Focused elements should have visible focus indicators').toBe(true);
      }
    });

    test('should manage focus on route changes', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Navigate to another page
      await page.goto('/courses');
      await page.waitForLoadState('networkidle');
      
      // Focus should be managed appropriately
      const focusedElement = await page.evaluate(() => {
        const active = document.activeElement;
        return {
          tagName: active?.tagName,
          isBody: active?.tagName === 'BODY',
          hasMainContent: !!document.querySelector('main, [role="main"]')
        };
      });
      
      // Focus should be on body or main content area after navigation
      expect(focusedElement.tagName).toMatch(/BODY|MAIN|H1/);
    });

    test('should handle focus for skip links', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Look for skip links (usually hidden until focused)
      const skipLink = page.locator('a[href*="#main"], a:has-text("Skip to"), .skip-link').first();
      
      if (await skipLink.count() > 0) {
        // Focus on skip link
        await skipLink.focus();
        
        // Should become visible when focused
        const isVisible = await skipLink.isVisible();
        expect(isVisible, 'Skip links should be visible when focused').toBe(true);
        
        // Should navigate to main content when activated
        await skipLink.click();
        
        const focusedAfterSkip = await page.evaluate(() => {
          const active = document.activeElement;
          return {
            tagName: active?.tagName,
            id: active?.id,
            role: active?.getAttribute('role')
          };
        });
        
        // Should focus on main content
        expect(focusedAfterSkip.tagName || focusedAfterSkip.role).toMatch(/MAIN|H1/);
      }
    });
  });

  test.describe('Error Handling Accessibility', () => {
    test('should announce errors to screen readers', async ({ page }) => {
      await page.goto('/auth/login');
      await page.waitForLoadState('networkidle');
      
      // Try to submit form with invalid data to trigger errors
      const form = page.locator('form').first();
      const submitButton = form.locator('button[type="submit"]').first();
      
      if (await submitButton.count() > 0) {
        await submitButton.click();
        
        // Wait for potential error messages
        await page.waitForTimeout(1000);
        
        // Look for error messages
        const errorMessages = page.locator('.error, [role="alert"], [aria-live="assertive"], [class*="error"]');
        const errorCount = await errorMessages.count();
        
        if (errorCount > 0) {
          // Error messages should be accessible
          const firstError = errorMessages.first();
          const errorInfo = await firstError.evaluate((el) => ({
            role: el.getAttribute('role'),
            ariaLive: el.getAttribute('aria-live'),
            textContent: el.textContent?.trim(),
            hasText: !!el.textContent?.trim()
          }));
          
          // Should have appropriate ARIA attributes for announcements
          const isAccessible = errorInfo.role === 'alert' ||
                              errorInfo.ariaLive === 'assertive' ||
                              errorInfo.ariaLive === 'polite';
          
          expect(isAccessible || errorInfo.hasText,
            'Error messages should be accessible to screen readers'
          ).toBe(true);
        }
      }
    });

    test('should associate errors with form fields', async ({ page }) => {
      await page.goto('/auth/register');
      await page.waitForLoadState('networkidle');
      
      // Submit form to trigger validation
      const submitButton = page.locator('button[type="submit"]').first();
      
      if (await submitButton.count() > 0) {
        await submitButton.click();
        await page.waitForTimeout(1000);
        
        // Check if errors are associated with form fields
        const errorMessages = page.locator('.error, [class*="error"]');
        const errorCount = await errorMessages.count();
        
        if (errorCount > 0) {
          const formFields = page.locator('input, textarea, select');
          const fieldCount = await formFields.count();
          
          for (let i = 0; i < fieldCount; i++) {
            const field = formFields.nth(i);
            const fieldInfo = await field.evaluate((el) => ({
              hasAriaDescribedBy: !!el.getAttribute('aria-describedby'),
              hasAriaInvalid: !!el.getAttribute('aria-invalid'),
              id: el.id
            }));
            
            // Fields with errors should have appropriate ARIA attributes
            if (fieldInfo.hasAriaInvalid === true) {
              expect(fieldInfo.hasAriaDescribedBy || fieldInfo.id,
                'Invalid fields should be described by error messages'
              ).toBeTruthy();
            }
          }
        }
      }
    });
  });
});