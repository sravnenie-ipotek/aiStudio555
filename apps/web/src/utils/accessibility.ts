import axe from 'axe-core';

/**
 * Accessibility testing utilities for WCAG 2.2 AA/AAA compliance
 * Used by design-fixer subagent for automated accessibility auditing
 */

export interface AccessibilityIssue {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    target: string[];
    failureSummary?: string;
  }>;
}

export interface AccessibilityReport {
  passes: number;
  violations: AccessibilityIssue[];
  incomplete: AccessibilityIssue[];
  inapplicable: number;
  timestamp: string;
  url?: string;
}

/**
 * Run accessibility audit on the current page or specific element
 * @param context - Optional CSS selector or element to test (defaults to entire document)
 * @param options - Axe configuration options
 */
export async function runAccessibilityAudit(
  context?: string | Element,
  options: axe.RunOptions = {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
    }
  }
): Promise<AccessibilityReport> {
  try {
    const results = await axe.run(context || document, options);
    
    return {
      passes: results.passes.length,
      violations: results.violations.map(formatViolation),
      incomplete: results.incomplete.map(formatViolation),
      inapplicable: results.inapplicable.length,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
  } catch (error) {
    console.error('Accessibility audit failed:', error);
    throw error;
  }
}

/**
 * Format axe violation for better readability
 */
function formatViolation(violation: axe.Result): AccessibilityIssue {
  return {
    id: violation.id,
    impact: violation.impact as AccessibilityIssue['impact'],
    description: violation.description,
    help: violation.help,
    helpUrl: violation.helpUrl,
    nodes: violation.nodes.map(node => ({
      html: node.html,
      target: node.target as string[],
      failureSummary: node.failureSummary
    }))
  };
}

/**
 * Check color contrast for text elements
 * @param foreground - Foreground color in hex format
 * @param background - Background color in hex format
 * @param fontSize - Font size in pixels
 * @param fontWeight - Font weight (normal or bold)
 */
export function checkColorContrast(
  foreground: string,
  background: string,
  fontSize: number = 16,
  fontWeight: 'normal' | 'bold' = 'normal'
): {
  ratio: number;
  largeText: boolean;
  passes: {
    aa: boolean;
    aaa: boolean;
  };
} {
  const ratio = getContrastRatio(foreground, background);
  const largeText = fontSize >= 18 || (fontSize >= 14 && fontWeight === 'bold');
  
  return {
    ratio,
    largeText,
    passes: {
      aa: largeText ? ratio >= 3.0 : ratio >= 4.5,
      aaa: largeText ? ratio >= 4.5 : ratio >= 7.0
    }
  };
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(foreground: string, background: string): number {
  const lum1 = getLuminance(foreground);
  const lum2 = getLuminance(background);
  const lightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (lightest + 0.05) / (darkest + 0.05);
}

/**
 * Calculate relative luminance of a color
 */
function getLuminance(color: string): number {
  const rgb = hexToRgb(color);
  const [r, g, b] = rgb.map(val => {
    const sRGB = val / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error('Invalid hex color');
  }
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ];
}

/**
 * Check if element has proper focus indicators
 */
export function checkFocusIndicator(element: Element): boolean {
  const styles = window.getComputedStyle(element);
  const focusElement = element as HTMLElement;
  
  // Temporarily focus the element
  focusElement.focus();
  const focusStyles = window.getComputedStyle(element);
  focusElement.blur();
  
  // Check for visual changes on focus
  const hasOutline = focusStyles.outlineWidth !== '0px' && 
                     focusStyles.outlineStyle !== 'none';
  const hasBorder = focusStyles.borderWidth !== styles.borderWidth ||
                    focusStyles.borderColor !== styles.borderColor;
  const hasBoxShadow = focusStyles.boxShadow !== styles.boxShadow;
  const hasBackground = focusStyles.backgroundColor !== styles.backgroundColor;
  
  return hasOutline || hasBorder || hasBoxShadow || hasBackground;
}

/**
 * Check if element has proper ARIA labels
 */
export function checkAriaLabels(element: Element): {
  hasLabel: boolean;
  labelType?: string;
  label?: string;
} {
  const ariaLabel = element.getAttribute('aria-label');
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  const ariaDescribedBy = element.getAttribute('aria-describedby');
  const title = element.getAttribute('title');
  
  if (ariaLabel) {
    return { hasLabel: true, labelType: 'aria-label', label: ariaLabel };
  }
  
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    return {
      hasLabel: !!labelElement,
      labelType: 'aria-labelledby',
      label: labelElement?.textContent || undefined
    };
  }
  
  if (ariaDescribedBy) {
    const descElement = document.getElementById(ariaDescribedBy);
    return {
      hasLabel: !!descElement,
      labelType: 'aria-describedby',
      label: descElement?.textContent || undefined
    };
  }
  
  if (title) {
    return { hasLabel: true, labelType: 'title', label: title };
  }
  
  // Check for associated label element (for form inputs)
  if (element instanceof HTMLInputElement || 
      element instanceof HTMLSelectElement || 
      element instanceof HTMLTextAreaElement) {
    const id = element.id;
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) {
        return {
          hasLabel: true,
          labelType: 'label',
          label: label.textContent || undefined
        };
      }
    }
  }
  
  return { hasLabel: false };
}

/**
 * Generate accessibility report as HTML
 */
export function generateAccessibilityReportHTML(report: AccessibilityReport): string {
  const criticalCount = report.violations.filter(v => v.impact === 'critical').length;
  const seriousCount = report.violations.filter(v => v.impact === 'serious').length;
  const moderateCount = report.violations.filter(v => v.impact === 'moderate').length;
  const minorCount = report.violations.filter(v => v.impact === 'minor').length;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Accessibility Report - ${report.timestamp}</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; padding: 2rem; max-width: 1200px; margin: 0 auto; }
        h1, h2 { color: #1a1a1a; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0; }
        .stat { padding: 1rem; border-radius: 8px; background: #f5f5f5; }
        .stat.passes { background: #d4edda; color: #155724; }
        .stat.critical { background: #f8d7da; color: #721c24; }
        .stat.serious { background: #fff3cd; color: #856404; }
        .stat.moderate { background: #cce5ff; color: #004085; }
        .stat.minor { background: #e2e3e5; color: #383d41; }
        .violation { margin: 1rem 0; padding: 1rem; border-left: 4px solid; border-radius: 4px; background: #f9f9f9; }
        .violation.critical { border-color: #dc3545; }
        .violation.serious { border-color: #ffc107; }
        .violation.moderate { border-color: #17a2b8; }
        .violation.minor { border-color: #6c757d; }
        .node { margin: 0.5rem 0; padding: 0.5rem; background: white; border-radius: 4px; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        a { color: #0066cc; }
      </style>
    </head>
    <body>
      <h1>Accessibility Audit Report</h1>
      <p><strong>URL:</strong> ${report.url || 'N/A'}</p>
      <p><strong>Timestamp:</strong> ${report.timestamp}</p>
      
      <div class="summary">
        <div class="stat passes">
          <h3>Passes</h3>
          <p>${report.passes} rules</p>
        </div>
        <div class="stat critical">
          <h3>Critical</h3>
          <p>${criticalCount} issues</p>
        </div>
        <div class="stat serious">
          <h3>Serious</h3>
          <p>${seriousCount} issues</p>
        </div>
        <div class="stat moderate">
          <h3>Moderate</h3>
          <p>${moderateCount} issues</p>
        </div>
        <div class="stat minor">
          <h3>Minor</h3>
          <p>${minorCount} issues</p>
        </div>
      </div>
      
      <h2>Violations (${report.violations.length})</h2>
      ${report.violations.map(v => `
        <div class="violation ${v.impact}">
          <h3>${v.help}</h3>
          <p><strong>Impact:</strong> ${v.impact}</p>
          <p>${v.description}</p>
          <p><a href="${v.helpUrl}" target="_blank">Learn more</a></p>
          
          <h4>Affected Elements (${v.nodes.length})</h4>
          ${v.nodes.map(n => `
            <div class="node">
              <p><strong>Target:</strong> <code>${n.target.join(' ')}</code></p>
              <p><strong>HTML:</strong> <code>${escapeHtml(n.html)}</code></p>
              ${n.failureSummary ? `<p><strong>Issue:</strong> ${n.failureSummary}</p>` : ''}
            </div>
          `).join('')}
        </div>
      `).join('')}
      
      ${report.incomplete.length > 0 ? `
        <h2>Incomplete Tests (${report.incomplete.length})</h2>
        <p>These tests require manual review:</p>
        ${report.incomplete.map(v => `
          <div class="violation minor">
            <h3>${v.help}</h3>
            <p>${v.description}</p>
            <p><a href="${v.helpUrl}" target="_blank">Learn more</a></p>
          </div>
        `).join('')}
      ` : ''}
    </body>
    </html>
  `;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

export default {
  runAccessibilityAudit,
  checkColorContrast,
  checkFocusIndicator,
  checkAriaLabels,
  generateAccessibilityReportHTML
};