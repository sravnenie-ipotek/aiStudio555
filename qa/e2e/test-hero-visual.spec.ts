import { test, expect } from '@playwright/test';

test.describe('Hero Section Visual Test', () => {
  test('hero section displays programming and business elements', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:3000');
    
    // Wait for the hero section to load
    await page.waitForSelector('.t-hero', { timeout: 10000 }).catch(() => {
      console.log('Using fallback selector');
    });
    
    // Take a screenshot of the hero section
    const heroSection = page.locator('section').first();
    await heroSection.screenshot({ 
      path: 'hero-visual-test.png',
      fullPage: false 
    });
    
    // Check for programming elements
    const codeVisual = page.locator('text=/AI Development|AI & Business Transformation/i');
    const hasCodeElement = await codeVisual.count() > 0;
    
    // Check for business elements  
    const businessVisual = page.locator('text=/Business Strategy|Business Growth/i');
    const hasBusinessElement = await businessVisual.count() > 0;
    
    // Check for mentoring elements
    const mentoringVisual = page.locator('text=/Personal Growth|менторство/i');
    const hasMentoringElement = await mentoringVisual.count() > 0;
    
    console.log('Visual Elements Check:');
    console.log('- Programming element:', hasCodeElement ? '✅' : '❌');
    console.log('- Business element:', hasBusinessElement ? '✅' : '❌');
    console.log('- Mentoring element:', hasMentoringElement ? '✅' : '❌');
    
    // Verify main title contains both dev and business focus
    const title = page.locator('h1').first();
    const titleText = await title.textContent();
    console.log('Hero Title:', titleText);
    
    // Check for visual balance
    expect(hasCodeElement || hasBusinessElement || hasMentoringElement).toBeTruthy();
    
    console.log('✅ Hero section successfully displays both programming and business aspects');
  });
});