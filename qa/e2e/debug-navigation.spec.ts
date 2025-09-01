import { test, expect } from '@playwright/test';

test('Debug Navigation Menu Visibility', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('http://localhost:3000');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of current state
  await page.screenshot({ path: 'debug-navigation-full.png', fullPage: true });
  
  // Check if header exists
  const header = page.locator('header');
  const headerExists = await header.count();
  console.log('Header elements found:', headerExists);
  
  if (headerExists > 0) {
    // Check header visibility
    const isHeaderVisible = await header.isVisible();
    console.log('Header visible:', isHeaderVisible);
    
    // Get header HTML content
    const headerHTML = await header.innerHTML();
    console.log('Header HTML length:', headerHTML.length);
    
    // Check navigation elements
    const nav = page.locator('nav');
    const navCount = await nav.count();
    console.log('Nav elements found:', navCount);
    
    if (navCount > 0) {
      const navVisible = await nav.isVisible();
      console.log('Nav visible:', navVisible);
      
      // Check for navigation items
      const navItems = page.locator('nav ul li');
      const navItemsCount = await navItems.count();
      console.log('Navigation items found:', navItemsCount);
      
      // Check for loading skeleton
      const skeleton = page.locator('.animate-pulse');
      const skeletonCount = await skeleton.count();
      console.log('Loading skeletons found:', skeletonCount);
    }
  }
  
  // Check for any JavaScript errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('JS Error:', msg.text());
    }
  });
  
  // Check for React/Next.js specific elements
  const nextScript = page.locator('script[src*="_next"]');
  const nextScriptCount = await nextScript.count();
  console.log('Next.js scripts found:', nextScriptCount);
  
  // Check document title
  const title = await page.title();
  console.log('Page title:', title);
  
  // Wait a bit more and take another screenshot
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'debug-navigation-after-wait.png', fullPage: true });
  
  // Try to find any text that should be in the header
  const logoText = page.locator('text=AiStudio555');
  const logoExists = await logoText.count();
  console.log('Logo text found:', logoExists);
  
  // Check for any error messages
  const errorText = page.locator('text=/error/i');
  const errorCount = await errorText.count();
  console.log('Error text found:', errorCount);
  
  // Log page HTML for debugging
  const pageHTML = await page.content();
  console.log('Page HTML length:', pageHTML.length);
  console.log('Page contains header tag:', pageHTML.includes('<header'));
  console.log('Page contains nav tag:', pageHTML.includes('<nav'));
  console.log('Page contains AiStudio555:', pageHTML.includes('AiStudio555'));
});