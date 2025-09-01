import { test, expect } from '@playwright/test';

test('Screenshot navigation bar for verification', async ({ page }) => {
  // Navigate to homepage
  await page.goto('http://localhost:3000');
  
  // Wait for page to load completely
  await page.waitForLoadState('networkidle');
  
  // Take full page screenshot first for context
  await page.screenshot({ 
    path: 'navigation-full-page.png', 
    fullPage: true 
  });
  
  // Locate the navigation bar - try multiple selectors
  const navSelectors = [
    'nav',
    'header',
    '[data-testid="navigation"]', 
    '.navigation',
    '.navbar',
    '.header'
  ];
  
  let navigation = null;
  for (const selector of navSelectors) {
    try {
      navigation = page.locator(selector).first();
      const isVisible = await navigation.isVisible({ timeout: 5000 });
      if (isVisible) {
        console.log(`Found navigation using selector: ${selector}`);
        break;
      }
    } catch (e) {
      // Continue to next selector
    }
  }
  
  if (navigation) {
    // Take screenshot of navigation area
    await navigation.screenshot({ 
      path: 'navigation-bar-only.png' 
    });
    
    // Get navigation text content for verification
    const navText = await navigation.textContent();
    console.log('Navigation text content:', navText);
    
    // Look for specific elements mentioned in requirements
    const elements = {
      logo: await page.locator('text=AiStudio555').first().isVisible().catch(() => false),
      courses: await page.locator('text=Курсы').first().isVisible().catch(() => false),
      phone: await page.locator('text=+').first().isVisible().catch(() => false),
      languageSelector: await page.locator('[role="button"]', { hasText: /RU|EN|HE/ }).first().isVisible().catch(() => false),
      ctaButton: await page.locator('a:has-text("Начать обучение"), a:has-text("Start Learning"), button:has-text("CTA")').first().isVisible().catch(() => false),
      socialIcons: await page.locator('svg, i[class*="fa-"], [data-testid*="social"]').first().isVisible().catch(() => false)
    };
    
    console.log('Element visibility check:', elements);
  } else {
    console.log('Navigation element not found, taking screenshot of top of page');
    await page.locator('body').screenshot({ 
      path: 'navigation-top-area.png',
      clip: { x: 0, y: 0, width: 1200, height: 150 }
    });
  }
});