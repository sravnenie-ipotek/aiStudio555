import { test } from '@playwright/test';

test('capture hero section', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000); // Wait for animations
  
  // Capture full hero section
  await page.screenshot({ 
    path: 'hero-section-new.png',
    fullPage: false 
  });
  
  console.log('✅ Hero section screenshot saved as hero-section-new.png');
});