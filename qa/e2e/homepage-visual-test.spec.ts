import { test, expect } from '@playwright/test';

test.describe('Homepage Visual Test - AIStudio555', () => {
  test('Capture homepage screenshots', async ({ page }) => {
    // Navigate to homepage
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for animations
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'homepage-full.png', 
      fullPage: true 
    });
    
    console.log('✅ Full homepage screenshot captured: homepage-full.png');
    
    // Take viewport screenshot
    await page.screenshot({ 
      path: 'homepage-viewport.png', 
      fullPage: false 
    });
    
    // Check if Hero section exists
    const heroSection = page.locator('section').first();
    const heroVisible = await heroSection.isVisible();
    console.log(`Hero section visible: ${heroVisible}`);
    
    // Check if AIStudio555 text exists
    const brandText = await page.locator('text=AIStudio555').count();
    console.log(`AIStudio555 brand mentions found: ${brandText}`);
    
    // Check if courses exist
    const courseCards = await page.locator('text=AI Transformation Manager').count();
    console.log(`Course cards found: ${courseCards}`);
    
    // List all visible headings
    const headings = await page.locator('h1, h2, h3').allTextContents();
    console.log('Visible headings:', headings);
  });
});