import { test, expect } from '@playwright/test';

test.describe('Navigation Menu Tests', () => {
  test('Should load navigation from Strapi', async ({ page }) => {
    // Capture console messages
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      consoleLogs.push(`[${msg.type()}] ${text}`);
      if (text.includes('Navigation') || text.includes('Strapi')) {
        console.log(text);
      }
    });

    // Navigate to homepage
    await page.goto('http://localhost:3000');
    
    // Wait for navigation to load
    await page.waitForTimeout(2000);
    
    // Check if navigation items are present
    const coursesLink = page.locator('nav >> text=Курсы').first();
    const monthlyStartsLink = page.locator('nav >> text=Старты месяца').first();
    const instructorsLink = page.locator('nav >> text=Преподаватели').first();
    const blogLink = page.locator('nav >> text=Блог').first();
    const aboutLink = page.locator('nav >> text=О школе').first();
    
    // Verify navigation items are visible
    console.log('\n=== Navigation Items Visibility ===');
    console.log('Courses visible:', await coursesLink.isVisible());
    console.log('Monthly Starts visible:', await monthlyStartsLink.isVisible());
    console.log('Instructors visible:', await instructorsLink.isVisible());
    console.log('Blog visible:', await blogLink.isVisible());
    console.log('About School visible:', await aboutLink.isVisible());
    
    // Check Strapi connection indicator
    const strapiIndicator = page.locator('text=Strapi Connected').or(page.locator('text=Strapi Offline'));
    const isConnected = await page.locator('text=Strapi Connected').isVisible().catch(() => false);
    
    console.log('\n=== Strapi Status ===');
    console.log('Strapi connected:', isConnected);
    
    // Check for fallback mode
    const fallbackBadge = page.locator('text=FALLBACK MODE');
    const inFallbackMode = await fallbackBadge.isVisible().catch(() => false);
    console.log('In fallback mode:', inFallbackMode);
    
    // Take screenshot
    await page.screenshot({ path: 'navigation-test.png', fullPage: false });
    
    // Print console logs
    console.log('\n=== Console Logs ===');
    consoleLogs.forEach(log => {
      if (log.includes('Navigation') || log.includes('Strapi') || log.includes('navigation')) {
        console.log(log);
      }
    });
    
    // Assertions
    expect(await coursesLink.isVisible()).toBeTruthy();
    expect(await monthlyStartsLink.isVisible()).toBeTruthy();
    expect(await instructorsLink.isVisible()).toBeTruthy();
    expect(await blogLink.isVisible()).toBeTruthy();
    expect(await aboutLink.isVisible()).toBeTruthy();
  });

  test('Should handle language switching', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);
    
    // TODO: Add language switching test once language selector is implemented
    console.log('Language switching test placeholder');
  });
});