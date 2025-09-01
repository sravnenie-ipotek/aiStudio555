import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Navigation Menu Investigation', () => {
  let consoleErrors: string[] = [];
  let consoleMessages: string[] = [];

  test.beforeEach(async ({ page }) => {
    // Capture console messages and errors
    page.on('console', (msg) => {
      const text = `[${msg.type().toUpperCase()}] ${msg.text()}`;
      consoleMessages.push(text);
      if (msg.type() === 'error') {
        consoleErrors.push(text);
      }
    });

    // Capture uncaught exceptions
    page.on('pageerror', (error) => {
      consoleErrors.push(`[EXCEPTION] ${error.message}`);
    });

    // Capture failed network requests
    page.on('response', (response) => {
      if (!response.ok() && response.status() !== 404) {
        consoleErrors.push(`[NETWORK ERROR] ${response.status()} ${response.url()}`);
      }
    });
  });

  test('Comprehensive Navigation Menu Analysis', async ({ page }) => {
    console.log('🔍 Starting comprehensive navigation menu analysis...');

    // Step 1: Navigate to localhost:3000
    console.log('📍 Navigating to localhost:3000...');
    try {
      await page.goto('http://localhost:3000', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
    } catch (error) {
      console.error('❌ Failed to navigate:', error);
      return;
    }

    // Step 2: Take initial screenshot
    console.log('📸 Taking initial page screenshot...');
    const screenshotPath = path.join(__dirname, 'reports', 'navigation-debug-initial.png');
    await fs.promises.mkdir(path.dirname(screenshotPath), { recursive: true });
    await page.screenshot({ 
      path: screenshotPath, 
      fullPage: true 
    });

    // Step 3: Check page title and URL
    const title = await page.title();
    const url = page.url();
    console.log(`📄 Page Title: ${title}`);
    console.log(`🔗 Current URL: ${url}`);

    // Step 4: Inspect DOM structure for navigation elements
    console.log('🔍 Inspecting DOM for navigation elements...');
    
    // Check for header element
    const headerExists = await page.locator('header').count();
    console.log(`🏷️  Header elements found: ${headerExists}`);

    // Check for nav elements
    const navExists = await page.locator('nav').count();
    console.log(`🧭 Nav elements found: ${navExists}`);

    // Check for navigation by common selectors
    const navigationSelectors = [
      'header nav',
      '.navigation',
      '.nav-menu',
      '.header-nav',
      '[data-testid="navigation"]',
      '[role="navigation"]',
      'ul[role="menubar"]',
      '.navbar',
      '.menu'
    ];

    console.log('🎯 Checking common navigation selectors:');
    for (const selector of navigationSelectors) {
      const count = await page.locator(selector).count();
      console.log(`   ${selector}: ${count} elements`);
    }

    // Step 5: Look for menu items or links
    console.log('🔗 Checking for menu items and navigation links:');
    const linkSelectors = [
      'a[href]',
      'button[role="menuitem"]',
      '.nav-link',
      '.menu-item',
      '[data-nav-item]'
    ];

    for (const selector of linkSelectors) {
      const count = await page.locator(selector).count();
      console.log(`   ${selector}: ${count} elements`);
      
      if (count > 0) {
        const links = await page.locator(selector).all();
        for (let i = 0; i < Math.min(5, links.length); i++) {
          try {
            const text = await links[i].textContent();
            const href = await links[i].getAttribute('href');
            console.log(`     - "${text?.trim()}" → ${href}`);
          } catch (e) {
            console.log(`     - [Error getting link info: ${e}]`);
          }
        }
      }
    }

    // Step 6: Check for visibility issues
    console.log('👁️  Checking element visibility:');
    
    // Check if any navigation elements are hidden
    const hiddenNavElements = await page.evaluate(() => {
      const navElements = document.querySelectorAll('nav, header nav, .navigation, .nav-menu');
      const results: Array<{selector: string, visible: boolean, display: string, opacity: string, visibility: string}> = [];
      
      navElements.forEach((el, index) => {
        const styles = window.getComputedStyle(el);
        results.push({
          selector: `${el.tagName.toLowerCase()}${el.className ? '.' + Array.from(el.classList).join('.') : ''}[${index}]`,
          visible: el.offsetWidth > 0 && el.offsetHeight > 0,
          display: styles.display,
          opacity: styles.opacity,
          visibility: styles.visibility
        });
      });
      
      return results;
    });

    hiddenNavElements.forEach(result => {
      console.log(`   ${result.selector}:`);
      console.log(`     - Visible: ${result.visible}`);
      console.log(`     - Display: ${result.display}`);
      console.log(`     - Opacity: ${result.opacity}`);
      console.log(`     - Visibility: ${result.visibility}`);
    });

    // Step 7: Get page HTML for further analysis
    console.log('📄 Extracting page HTML...');
    const htmlContent = await page.content();
    const htmlPath = path.join(__dirname, 'reports', 'navigation-debug.html');
    await fs.promises.writeFile(htmlPath, htmlContent);

    // Step 8: Check for React components in the DOM
    console.log('⚛️  Checking for React component indicators:');
    const reactInfo = await page.evaluate(() => {
      // Check for React
      const hasReact = !!(window as any).React;
      
      // Check for data-reactroot or similar
      const reactRoot = document.querySelector('[data-reactroot], #__next, #root');
      
      // Check for React DevTools
      const hasReactDevTools = !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
      
      // Look for Next.js indicators
      const hasNextJs = !!(window as any).__NEXT_DATA__;
      
      return {
        hasReact,
        reactRoot: reactRoot ? reactRoot.tagName : null,
        hasReactDevTools,
        hasNextJs,
        nextData: hasNextJs ? (window as any).__NEXT_DATA__ : null
      };
    });

    console.log('⚛️  React Information:');
    console.log(`   - React available: ${reactInfo.hasReact}`);
    console.log(`   - React root: ${reactInfo.reactRoot}`);
    console.log(`   - React DevTools: ${reactInfo.hasReactDevTools}`);
    console.log(`   - Next.js available: ${reactInfo.hasNextJs}`);

    // Step 9: Report console errors and messages
    console.log('🚨 Console Analysis:');
    console.log(`   - Total messages: ${consoleMessages.length}`);
    console.log(`   - Errors: ${consoleErrors.length}`);
    
    if (consoleErrors.length > 0) {
      console.log('❌ Console Errors:');
      consoleErrors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }

    if (consoleMessages.length > 0) {
      console.log('📝 Recent console messages:');
      consoleMessages.slice(-10).forEach((message, index) => {
        console.log(`   ${index + 1}. ${message}`);
      });
    }

    // Step 10: Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      url,
      title,
      headerCount: headerExists,
      navCount: navExists,
      consoleErrors,
      consoleMessages: consoleMessages.slice(-20), // Last 20 messages
      reactInfo,
      hiddenElements: hiddenNavElements
    };

    const reportPath = path.join(__dirname, 'reports', 'navigation-debug-report.json');
    await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));

    console.log(`📊 Detailed report saved to: ${reportPath}`);
    console.log(`📸 Screenshot saved to: ${screenshotPath}`);
    console.log(`📄 HTML content saved to: ${htmlPath}`);

    // Assertions for the test
    expect(headerExists).toBeGreaterThan(0); // Should have at least one header
    expect(consoleErrors.length).toBeLessThan(5); // Should not have too many errors
  });
});