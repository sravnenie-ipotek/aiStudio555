/**
 * Accessibility Testing Utilities
 * Helper functions for comprehensive WCAG 2.1 AA compliance testing
 * @module QA/E2E/AccessibilityUtils
 */

import { Page, Locator } from '@playwright/test';

interface ContrastCheckResult {
  element: string;
  foreground: string;
  background: string;
  ratio: number;
  passes: boolean;
  level: 'AA' | 'AAA' | 'FAIL';
  wcagCriterion: string;
}

interface FocusTestResult {
  element: string;
  hasFocusIndicator: boolean;
  focusMethod: 'outline' | 'boxShadow' | 'backgroundColor' | 'border' | 'none';
  passes: boolean;
}

interface TouchTargetResult {
  element: string;
  width: number;
  height: number;
  passes: boolean;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export class AccessibilityTestUtils {
  constructor(private page: Page) {}

  /**
   * Calculate color contrast ratio between two colors
   */
  private calculateContrastRatio(color1: string, color2: string): number {
    // Helper function to convert RGB to relative luminance
    const getLuminance = (color: string): number => {
      const rgb = this.parseColor(color);
      const [r, g, b] = rgb.map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const lightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (lightest + 0.05) / (darkest + 0.05);
  }

  /**
   * Parse color string to RGB values
   */
  private parseColor(color: string): [number, number, number] {
    const div = document.createElement('div');
    div.style.color = color;
    document.body.appendChild(div);
    const rgbColor = window.getComputedStyle(div).color;
    document.body.removeChild(div);
    
    const match = rgbColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
    return [0, 0, 0]; // Default to black
  }

  /**
   * Check color contrast compliance for all text elements
   */
  async checkColorContrast(): Promise<ContrastCheckResult[]> {
    const results: ContrastCheckResult[] = [];

    const textElements = await this.page.locator('*:has-text(/./):not(script):not(style)').all();
    
    for (const element of textElements.slice(0, 20)) { // Limit to prevent timeout
      try {
        const styles = await element.evaluate((el) => {
          const computedStyles = window.getComputedStyle(el);
          return {
            color: computedStyles.color,
            backgroundColor: computedStyles.backgroundColor,
            fontSize: parseFloat(computedStyles.fontSize),
            fontWeight: computedStyles.fontWeight,
            tagName: el.tagName.toLowerCase()
          };
        });

        // Skip transparent or inherited backgrounds
        if (styles.backgroundColor === 'rgba(0, 0, 0, 0)' || styles.backgroundColor === 'transparent') {
          continue;
        }

        const ratio = this.calculateContrastRatio(styles.color, styles.backgroundColor);
        const isLargeText = styles.fontSize >= 18 || (styles.fontSize >= 14 && parseInt(styles.fontWeight) >= 700);
        const requiredRatio = isLargeText ? 3.0 : 4.5;
        
        results.push({
          element: styles.tagName,
          foreground: styles.color,
          background: styles.backgroundColor,
          ratio: Math.round(ratio * 100) / 100,
          passes: ratio >= requiredRatio,
          level: ratio >= 7.0 ? 'AAA' : (ratio >= requiredRatio ? 'AA' : 'FAIL'),
          wcagCriterion: '1.4.3 Contrast (Minimum)'
        });
      } catch (error) {
        // Skip elements that can't be evaluated
        continue;
      }
    }

    return results;
  }

  /**
   * Test focus indicators for all focusable elements
   */
  async checkFocusIndicators(): Promise<FocusTestResult[]> {
    const results: FocusTestResult[] = [];
    
    const focusableElements = await this.page.locator(
      'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
    ).all();

    for (const element of focusableElements) {
      await element.focus();
      
      const focusStyles = await element.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
          outlineStyle: styles.outlineStyle,
          outlineColor: styles.outlineColor,
          boxShadow: styles.boxShadow,
          backgroundColor: styles.backgroundColor,
          borderColor: styles.borderColor,
          borderWidth: styles.borderWidth,
          tagName: el.tagName.toLowerCase(),
          ariaLabel: el.getAttribute('aria-label')
        };
      });

      // Determine focus indicator method
      let focusMethod: FocusTestResult['focusMethod'] = 'none';
      let hasFocusIndicator = false;

      if (focusStyles.outline !== 'none' && focusStyles.outlineWidth !== '0px') {
        focusMethod = 'outline';
        hasFocusIndicator = true;
      } else if (focusStyles.boxShadow !== 'none') {
        focusMethod = 'boxShadow';
        hasFocusIndicator = true;
      } else if (focusStyles.borderWidth !== '0px' && focusStyles.borderColor !== 'rgba(0, 0, 0, 0)') {
        focusMethod = 'border';
        hasFocusIndicator = true;
      }

      results.push({
        element: `${focusStyles.tagName}${focusStyles.ariaLabel ? ` (${focusStyles.ariaLabel})` : ''}`,
        hasFocusIndicator,
        focusMethod,
        passes: hasFocusIndicator
      });
    }

    return results;
  }

  /**
   * Check touch target sizes for mobile accessibility
   */
  async checkTouchTargets(): Promise<TouchTargetResult[]> {
    const results: TouchTargetResult[] = [];
    const MINIMUM_SIZE = 44; // WCAG 2.1 AA requirement
    
    const interactiveElements = await this.page.locator(
      'button, input, select, a[href], [role="button"], [tabindex]:not([tabindex="-1"])'
    ).all();

    for (const element of interactiveElements) {
      const box = await element.boundingBox();
      
      if (box) {
        const passes = box.width >= MINIMUM_SIZE && box.height >= MINIMUM_SIZE;
        let severity: TouchTargetResult['severity'] = 'low';
        
        if (box.width < MINIMUM_SIZE || box.height < MINIMUM_SIZE) {
          if (box.width < 32 || box.height < 32) {
            severity = 'critical';
          } else if (box.width < 40 || box.height < 40) {
            severity = 'high';
          } else {
            severity = 'medium';
          }
        }

        const tagName = await element.evaluate(el => el.tagName.toLowerCase());
        
        results.push({
          element: tagName,
          width: Math.round(box.width),
          height: Math.round(box.height),
          passes,
          severity
        });
      }
    }

    return results;
  }

  /**
   * Validate heading hierarchy
   */
  async checkHeadingHierarchy(): Promise<{ valid: boolean; issues: string[] }> {
    const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').all();
    const issues: string[] = [];
    let previousLevel = 0;

    for (const heading of headings) {
      const level = await heading.evaluate(el => parseInt(el.tagName.replace('H', '')));
      
      if (previousLevel === 0) {
        // First heading should be h1 (or h2 in some contexts)
        if (level > 2) {
          issues.push(`First heading is h${level}, should start with h1 or h2`);
        }
      } else {
        // Check for skipped levels
        if (level > previousLevel + 1) {
          issues.push(`Heading level jumps from h${previousLevel} to h${level} (skipped levels)`);
        }
      }
      
      previousLevel = level;
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }

  /**
   * Check ARIA attributes and roles
   */
  async checkAriaCompliance(): Promise<{ element: string; issue: string; severity: string }[]> {
    const issues: { element: string; issue: string; severity: string }[] = [];

    // Check for required ARIA labels on interactive elements
    const interactiveElements = await this.page.locator(
      'button:not([aria-label]):not([aria-labelledby]):empty, input:not([aria-label]):not([aria-labelledby]):not([placeholder])'
    ).all();

    for (const element of interactiveElements) {
      const tagName = await element.evaluate(el => el.tagName.toLowerCase());
      issues.push({
        element: tagName,
        issue: 'Interactive element lacks accessible name',
        severity: 'high'
      });
    }

    // Check for proper ARIA expanded states on accordion elements
    const expandableElements = await this.page.locator('[aria-expanded]').all();
    
    for (const element of expandableElements) {
      const ariaExpanded = await element.getAttribute('aria-expanded');
      const ariaControls = await element.getAttribute('aria-controls');
      
      if (!['true', 'false'].includes(ariaExpanded || '')) {
        issues.push({
          element: 'aria-expanded',
          issue: `Invalid aria-expanded value: "${ariaExpanded}"`,
          severity: 'medium'
        });
      }

      if (ariaExpanded === 'true' && !ariaControls) {
        issues.push({
          element: 'aria-controls',
          issue: 'Expanded element missing aria-controls attribute',
          severity: 'medium'
        });
      }
    }

    return issues;
  }

  /**
   * Test keyboard navigation flow
   */
  async testKeyboardNavigation(): Promise<{ tabOrder: string[]; issues: string[] }> {
    const tabOrder: string[] = [];
    const issues: string[] = [];
    let previousElement: Locator | null = null;

    // Start from the first focusable element
    const firstFocusable = this.page.locator('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])').first();
    
    if (await firstFocusable.isVisible()) {
      await firstFocusable.focus();
    }

    // Navigate through tab sequence
    for (let i = 0; i < 15; i++) { // Limit to prevent infinite loop
      await this.page.keyboard.press('Tab');
      
      const activeElement = this.page.locator(':focus');
      
      if (await activeElement.isVisible()) {
        const elementInfo = await activeElement.evaluate(el => ({
          tagName: el.tagName.toLowerCase(),
          type: (el as HTMLInputElement).type || '',
          ariaLabel: el.getAttribute('aria-label') || '',
          textContent: el.textContent?.trim().substring(0, 20) || '',
          tabIndex: el.tabIndex
        }));

        const elementDescription = `${elementInfo.tagName}${elementInfo.type ? `[${elementInfo.type}]` : ''}${elementInfo.ariaLabel ? ` (${elementInfo.ariaLabel})` : ''}${elementInfo.textContent ? ` "${elementInfo.textContent}"` : ''}`;
        
        tabOrder.push(elementDescription);

        // Check for tab traps
        if (previousElement && await previousElement.isSameNode(activeElement)) {
          issues.push('Tab navigation stuck on same element');
          break;
        }

        previousElement = activeElement;
      }
    }

    // Test reverse tab navigation
    await this.page.keyboard.press('Shift+Tab');
    const reverseActiveElement = this.page.locator(':focus');
    
    if (await reverseActiveElement.isVisible()) {
      const isCorrectReverse = tabOrder.length > 1; // Should go to previous element
      if (!isCorrectReverse) {
        issues.push('Reverse tab navigation does not work correctly');
      }
    }

    return { tabOrder, issues };
  }

  /**
   * Generate comprehensive accessibility report
   */
  async generateAccessibilityReport(): Promise<{
    colorContrast: ContrastCheckResult[];
    focusIndicators: FocusTestResult[];
    touchTargets: TouchTargetResult[];
    headingHierarchy: { valid: boolean; issues: string[] };
    ariaCompliance: { element: string; issue: string; severity: string }[];
    keyboardNavigation: { tabOrder: string[]; issues: string[] };
    overallScore: number;
    wcagLevel: 'AA' | 'A' | 'FAIL';
  }> {
    const [
      colorContrast,
      focusIndicators,
      touchTargets,
      headingHierarchy,
      ariaCompliance,
      keyboardNavigation
    ] = await Promise.all([
      this.checkColorContrast(),
      this.checkFocusIndicators(),
      this.checkTouchTargets(),
      this.checkHeadingHierarchy(),
      this.checkAriaCompliance(),
      this.testKeyboardNavigation()
    ]);

    // Calculate overall score
    const colorScore = colorContrast.filter(c => c.passes).length / Math.max(colorContrast.length, 1) * 100;
    const focusScore = focusIndicators.filter(f => f.passes).length / Math.max(focusIndicators.length, 1) * 100;
    const touchScore = touchTargets.filter(t => t.passes).length / Math.max(touchTargets.length, 1) * 100;
    const headingScore = headingHierarchy.valid ? 100 : 50;
    const ariaScore = Math.max(0, 100 - (ariaCompliance.length * 10)); // Deduct 10 points per issue
    const keyboardScore = keyboardNavigation.issues.length === 0 ? 100 : 70;

    const overallScore = Math.round(
      (colorScore + focusScore + touchScore + headingScore + ariaScore + keyboardScore) / 6
    );

    const wcagLevel: 'AA' | 'A' | 'FAIL' = overallScore >= 90 ? 'AA' : overallScore >= 70 ? 'A' : 'FAIL';

    return {
      colorContrast,
      focusIndicators,
      touchTargets,
      headingHierarchy,
      ariaCompliance,
      keyboardNavigation,
      overallScore,
      wcagLevel
    };
  }
}