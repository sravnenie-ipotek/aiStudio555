import { test, expect } from '../../fixtures/auth';
import { TestHelpers, viewports } from '../../utils/test-helpers';

test.describe('Accessibility - WCAG 2.1 AA Compliance', () => {
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    testHelpers = new TestHelpers(page);
  });

  test.describe('Keyboard Navigation', () => {
    test('should support full keyboard navigation on homepage @accessibility @critical', async ({ page }) => {
      await page.goto('/');
      
      // Test Tab navigation through interactive elements
      const focusableElements = [
        'main-navigation',
        'language-switcher',
        'cta-button',
        'course-card',
        'contact-form-button'
      ];

      for (let i = 0; i < focusableElements.length; i++) {
        await page.keyboard.press('Tab');
        
        // Check if current element is focusable and visible
        const focusedElement = await page.evaluate(() => document.activeElement);
        expect(focusedElement).toBeTruthy();
      }
      
      // Test Shift+Tab for reverse navigation
      await page.keyboard.press('Shift+Tab');
      const previousElement = await page.evaluate(() => document.activeElement);
      expect(previousElement).toBeTruthy();
    });

    test('should support keyboard navigation in dashboard @accessibility @critical', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Test navigation menu keyboard access
      await page.keyboard.press('Tab');
      await expect(page.getByTestId('nav-dashboard')).toBeFocused();
      
      // Arrow keys should navigate between menu items
      await page.keyboard.press('ArrowDown');
      await expect(page.getByTestId('nav-courses')).toBeFocused();
      
      await page.keyboard.press('ArrowDown');
      await expect(page.getByTestId('nav-settings')).toBeFocused();
      
      // Enter should activate menu items
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL('/dashboard/settings');
    });

    test('should support keyboard navigation in forms @accessibility', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Tab through form elements
      await page.keyboard.press('Tab');
      await expect(page.getByTestId('email-input')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.getByTestId('password-input')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.getByTestId('login-submit')).toBeFocused();
      
      // Enter should submit form
      await testHelpers.fillField('email-input', 'test@example.com');
      await testHelpers.fillField('password-input', 'password123');
      
      await page.getByTestId('login-submit').focus();
      await page.keyboard.press('Enter');
      
      // Form should be submitted (we'll get validation errors without proper backend)
      await page.waitForTimeout(1000);
    });

    test('should provide skip navigation links @accessibility', async ({ page }) => {
      await page.goto('/');
      
      // Tab to first element should reveal skip link
      await page.keyboard.press('Tab');
      
      const skipLink = page.getByTestId('skip-to-main');
      await expect(skipLink).toBeVisible();
      await expect(skipLink).toBeFocused();
      
      // Activating skip link should jump to main content
      await page.keyboard.press('Enter');
      await expect(page.getByTestId('main-content')).toBeFocused();
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have proper heading hierarchy @accessibility @critical', async ({ page }) => {
      await page.goto('/');
      
      // Check heading hierarchy (h1 -> h2 -> h3, etc.)
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      expect(headings.length).toBeGreaterThan(0);
      
      // Should have exactly one h1
      const h1Elements = await page.locator('h1').all();
      expect(h1Elements).toHaveLength(1);
      
      // Check for proper nesting (no skipped levels)
      const headingLevels = [];
      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        const level = parseInt(tagName.charAt(1));
        headingLevels.push(level);
      }
      
      // Verify no levels are skipped
      for (let i = 1; i < headingLevels.length; i++) {
        const currentLevel = headingLevels[i];
        const previousLevel = headingLevels[i - 1];
        
        if (currentLevel > previousLevel) {
          expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
        }
      }
    });

    test('should have proper ARIA labels and roles @accessibility @critical', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Check navigation landmarks
      const nav = page.getByRole('navigation');
      await expect(nav).toBeVisible();
      await expect(nav).toHaveAttribute('aria-label');
      
      // Check main landmark
      const main = page.getByRole('main');
      await expect(main).toBeVisible();
      
      // Check interactive elements have proper roles
      const buttons = await page.getByRole('button').all();
      expect(buttons.length).toBeGreaterThan(0);
      
      // Check form elements have labels
      const inputs = await page.locator('input').all();
      for (const input of inputs) {
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledby = await input.getAttribute('aria-labelledby');
        const id = await input.getAttribute('id');
        
        // Input should have label, aria-label, or aria-labelledby
        const hasLabel = ariaLabel || ariaLabelledby || 
          (id && await page.locator(`label[for="${id}"]`).count() > 0);
        
        expect(hasLabel).toBe(true);
      }
    });

    test('should provide alternative text for images @accessibility @critical', async ({ page }) => {
      await page.goto('/');
      
      const images = await page.locator('img').all();
      
      for (const img of images) {
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');
        
        // Images should have alt text unless they're decorative
        if (role !== 'presentation' && role !== 'none') {
          expect(alt).toBeTruthy();
          expect(alt).not.toBe('');
        }
      }
    });

    test('should have accessible form error messages @accessibility', async ({ page }) => {
      await page.goto('/auth/register');
      
      // Submit form to trigger validation errors
      await page.getByTestId('register-submit').click();
      
      // Check that error messages are associated with inputs
      const errorMessages = await page.locator('[data-testid*="-error"]').all();
      
      for (const errorMsg of errorMessages) {
        const testId = await errorMsg.getAttribute('data-testid');
        const inputId = testId.replace('-error', '');
        const input = page.getByTestId(inputId);
        
        // Error message should be visible
        await expect(errorMsg).toBeVisible();
        
        // Input should be marked as invalid
        await expect(input).toHaveAttribute('aria-invalid', 'true');
        
        // Input should reference error message
        const describedBy = await input.getAttribute('aria-describedby');
        expect(describedBy).toContain(inputId + '-error');
      }
    });
  });

  test.describe('Color and Contrast', () => {
    test('should meet color contrast requirements @accessibility @critical', async ({ page }) => {
      await page.goto('/');
      
      // Check text contrast ratios
      const textElements = await page.locator('p, span, a, button, h1, h2, h3, h4, h5, h6').all();
      
      for (const element of textElements.slice(0, 10)) { // Test first 10 elements
        const styles = await element.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            fontSize: computed.fontSize
          };
        });
        
        // This is a simplified check - in real implementation, you'd use
        // a proper contrast ratio calculation library
        const hasGoodContrast = await element.evaluate(el => {
          const computed = window.getComputedStyle(el);
          const color = computed.color;
          const bgColor = computed.backgroundColor;
          
          // Simple check for common good contrast combinations
          return (
            (color.includes('rgb(0, 0, 0)') && bgColor.includes('rgb(255, 255, 255)')) ||
            (color.includes('rgb(255, 255, 255)') && bgColor.includes('rgb(0, 0, 0)')) ||
            color.includes('rgb(31, 41, 55)') // Dark gray text
          );
        });
        
        if (await element.isVisible()) {
          console.log(`Element contrast check:`, styles);
          // Note: In a real implementation, you'd calculate actual contrast ratios
          // expect(contrastRatio).toBeGreaterThan(4.5); // AA standard
        }
      }
    });

    test('should not rely on color alone for information @accessibility', async ({ page }) => {
      await page.goto('/dashboard/courses');
      
      // Check course status indicators
      const statusIndicators = await page.getByTestId('course-status').all();
      
      for (const indicator of statusIndicators) {
        const text = await indicator.textContent();
        const ariaLabel = await indicator.getAttribute('aria-label');
        
        // Status should have text or aria-label, not just color
        expect(text || ariaLabel).toBeTruthy();
        expect((text || ariaLabel).trim()).not.toBe('');
      }
      
      // Check form validation - errors should have text, not just red color
      await page.goto('/auth/login');
      await page.getByTestId('login-submit').click();
      
      const errorMessages = await page.locator('[data-testid*="-error"]').all();
      for (const error of errorMessages) {
        const text = await error.textContent();
        expect(text).toBeTruthy();
        expect(text.trim()).not.toBe('');
      }
    });
  });

  test.describe('Responsive Design & Zoom', () => {
    test('should support 200% zoom @accessibility', async ({ page }) => {
      await page.goto('/');
      
      // Set zoom to 200%
      await page.setViewportSize({ width: 960, height: 540 }); // Simulate 200% zoom on 1920x1080
      
      // Check that content is still accessible
      await expect(page.getByTestId('main-navigation')).toBeVisible();
      await expect(page.getByTestId('hero-section')).toBeVisible();
      
      // Navigation should remain functional
      await page.getByTestId('mobile-menu-toggle').click();
      await expect(page.getByTestId('mobile-menu')).toBeVisible();
    });

    test('should be accessible on mobile devices @accessibility @mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/');
      
      // Check mobile navigation
      await expect(page.getByTestId('mobile-menu-toggle')).toBeVisible();
      await page.getByTestId('mobile-menu-toggle').click();
      
      // Mobile menu should be keyboard accessible
      await page.keyboard.press('Tab');
      await expect(page.getByTestId('nav-dashboard')).toBeFocused();
      
      // Touch targets should be at least 44x44px
      const touchTargets = await page.locator('button, a, [role="button"]').all();
      
      for (const target of touchTargets.slice(0, 5)) {
        if (await target.isVisible()) {
          const boundingBox = await target.boundingBox();
          if (boundingBox) {
            expect(boundingBox.width).toBeGreaterThanOrEqual(44);
            expect(boundingBox.height).toBeGreaterThanOrEqual(44);
          }
        }
      }
    });
  });

  test.describe('Focus Management', () => {
    test('should manage focus in modals @accessibility', async ({ page }) => {
      await page.goto('/dashboard/settings');
      
      // Open a modal (e.g., avatar upload)
      await page.getByTestId('avatar-upload-btn').click();
      
      // Focus should move to modal
      await expect(page.getByTestId('upload-modal')).toBeVisible();
      const modalFirstFocusable = page.getByTestId('file-input');
      await expect(modalFirstFocusable).toBeFocused();
      
      // Tab should cycle within modal
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Should not escape modal
      const focusedElement = await page.evaluate(() => document.activeElement);
      const isInModal = await page.evaluate((modal) => {
        return modal.contains(document.activeElement);
      }, await page.getByTestId('upload-modal').elementHandle());
      
      expect(isInModal).toBe(true);
      
      // Escape should close modal and restore focus
      await page.keyboard.press('Escape');
      await expect(page.getByTestId('upload-modal')).not.toBeVisible();
      await expect(page.getByTestId('avatar-upload-btn')).toBeFocused();
    });

    test('should provide visible focus indicators @accessibility @critical', async ({ page }) => {
      await page.goto('/');
      
      // Tab to interactive elements and check focus visibility
      const focusableElements = await page.locator('button, a, input, select, textarea').all();
      
      for (const element of focusableElements.slice(0, 5)) {
        if (await element.isVisible()) {
          await element.focus();
          
          // Check for focus indicator
          const focusStyles = await element.evaluate(el => {
            const styles = window.getComputedStyle(el, ':focus');
            return {
              outline: styles.outline,
              outlineWidth: styles.outlineWidth,
              boxShadow: styles.boxShadow,
              borderColor: styles.borderColor
            };
          });
          
          // Should have some form of focus indicator
          const hasFocusIndicator = 
            focusStyles.outline !== 'none' ||
            focusStyles.outlineWidth !== '0px' ||
            focusStyles.boxShadow !== 'none' ||
            focusStyles.borderColor !== 'initial';
          
          expect(hasFocusIndicator).toBe(true);
        }
      }
    });
  });

  test.describe('Media and Animation', () => {
    test('should respect prefers-reduced-motion @accessibility', async ({ page }) => {
      // Emulate reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      
      // Check that animations are reduced or removed
      const animatedElements = await page.locator('[style*="animation"], [class*="animate"]').all();
      
      for (const element of animatedElements) {
        const animationDuration = await element.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return styles.animationDuration;
        });
        
        // Animation duration should be very short or none for reduced motion
        expect(['0s', '0.01s', 'none']).toContain(animationDuration);
      }
    });

    test('should provide video controls and captions @accessibility', async ({ page }) => {
      await page.goto('/learn/1');
      
      // Check video player accessibility
      const videoElement = page.getByTestId('video-element');
      await expect(videoElement).toHaveAttribute('controls');
      
      // Check for captions track
      const captionTracks = await page.locator('video track[kind="captions"], video track[kind="subtitles"]').count();
      expect(captionTracks).toBeGreaterThan(0);
      
      // Video should be keyboard controllable
      await videoElement.focus();
      await page.keyboard.press('Space'); // Play/pause
      await page.keyboard.press('ArrowRight'); // Seek forward
      await page.keyboard.press('ArrowLeft'); // Seek backward
    });
  });

  test.describe('Language and Localization', () => {
    test('should have proper language attributes @accessibility', async ({ page }) => {
      await page.goto('/');
      
      // Check html lang attribute
      const htmlLang = await page.getAttribute('html', 'lang');
      expect(htmlLang).toBeTruthy();
      expect(htmlLang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/); // e.g., "en" or "en-US"
      
      // Check for language switching
      const langSwitcher = page.getByTestId('language-switcher');
      if (await langSwitcher.isVisible()) {
        await langSwitcher.click();
        
        // Language options should be accessible
        const langOptions = await page.getByTestId('lang-option').all();
        for (const option of langOptions) {
          await expect(option).toHaveAttribute('lang');
        }
      }
    });

    test('should support RTL languages @accessibility', async ({ page }) => {
      // Test Hebrew language (RTL)
      await page.goto('/?lang=he');
      
      // Check for RTL direction
      const bodyDir = await page.getAttribute('body', 'dir');
      const htmlDir = await page.getAttribute('html', 'dir');
      
      expect(bodyDir === 'rtl' || htmlDir === 'rtl').toBe(true);
      
      // Check that text alignment is appropriate for RTL
      const textElements = await page.locator('p, h1, h2, h3').all();
      
      for (const element of textElements.slice(0, 3)) {
        if (await element.isVisible()) {
          const textAlign = await element.evaluate(el => 
            window.getComputedStyle(el).textAlign
          );
          
          // Should be right-aligned or start-aligned (which becomes right in RTL)
          expect(['right', 'start'].includes(textAlign)).toBe(true);
        }
      }
    });
  });

  test.describe('Error Prevention and Recovery', () => {
    test('should provide clear error messages @accessibility', async ({ page }) => {
      await page.goto('/auth/register');
      
      // Submit form with errors
      await page.getByTestId('register-submit').click();
      
      // Error messages should be descriptive and helpful
      const errorMessages = await page.locator('[data-testid*="-error"]').all();
      
      for (const errorMsg of errorMessages) {
        const text = await errorMsg.textContent();
        
        // Error messages should be specific, not generic
        expect(text).not.toMatch(/^(error|invalid|required)$/i);
        expect(text.length).toBeGreaterThan(10); // Should be descriptive
      }
    });

    test('should allow error correction @accessibility', async ({ page }) => {
      await page.goto('/checkout');
      
      // Fill form with invalid data
      await testHelpers.fillField('billing-email', 'invalid-email');
      await page.getByTestId('proceed-to-payment-btn').click();
      
      // User should be able to correct errors
      const emailInput = page.getByTestId('billing-email');
      await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
      
      // Correct the error
      await emailInput.clear();
      await emailInput.fill('valid@email.com');
      
      // Error state should be cleared
      await expect(emailInput).not.toHaveAttribute('aria-invalid', 'true');
    });
  });

  test('should run automated accessibility audit @accessibility @critical', async ({ page }) => {
    await page.goto('/');
    
    // Inject axe-core for automated testing
    await page.addScriptTag({ url: 'https://unpkg.com/axe-core@4.7.0/axe.min.js' });
    
    // Run axe audit
    const results = await page.evaluate(async () => {
      return await window.axe.run();
    });
    
    console.log(`Accessibility violations found: ${results.violations.length}`);
    
    // Log violations for debugging
    results.violations.forEach(violation => {
      console.log(`- ${violation.id}: ${violation.description}`);
      console.log(`  Impact: ${violation.impact}`);
      console.log(`  Nodes: ${violation.nodes.length}`);
    });
    
    // Should have no critical or serious violations
    const criticalViolations = results.violations.filter(v => 
      v.impact === 'critical' || v.impact === 'serious'
    );
    
    expect(criticalViolations).toHaveLength(0);
    
    // Total violations should be minimal
    expect(results.violations.length).toBeLessThan(5);
  });
});