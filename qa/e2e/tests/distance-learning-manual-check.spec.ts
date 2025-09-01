import { test, expect } from '@playwright/test';

test('Manual verification of DistanceLearning component', async ({ page }) => {
  // Go to homepage
  await page.goto('http://localhost:3000');
  
  // Wait for load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Scroll down to find the distance learning section
  await page.evaluate(() => {
    window.scrollTo(0, 2000);
  });
  await page.waitForTimeout(2000);

  // Take a full page screenshot for analysis
  await page.screenshot({ 
    path: 'qa/e2e/reports/full-page-with-distance-learning.png',
    fullPage: true
  });

  // Find and screenshot just the distance learning content
  const distanceLearningTitle = page.locator('text=О дистанционном обучении');
  if (await distanceLearningTitle.count() > 0) {
    await distanceLearningTitle.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    const parentSection = distanceLearningTitle.locator('../..');
    await parentSection.screenshot({
      path: 'qa/e2e/reports/distance-learning-section-only.png'
    });
    
    console.log('✅ Successfully captured DistanceLearning section');
  } else {
    console.log('❌ Could not find DistanceLearning section');
  }

  // Check button specifically
  const button = page.locator('a:text("Узнать больше")');
  if (await button.count() > 0) {
    await button.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    const buttonBounds = await button.boundingBox();
    console.log('✅ Button found at:', buttonBounds);
    
    // Get button styles
    const styles = await button.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        borderRadius: computed.borderRadius,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight
      };
    });
    
    console.log('Button styles:', styles);
  }
});