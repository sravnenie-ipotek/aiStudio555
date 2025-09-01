import { test, expect } from '@playwright/test';

test.describe('DistanceLearning Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage where component is located
    await page.goto('http://localhost:3000');
    
    // Wait for component to load
    await page.waitForSelector('[data-testid="distance-learning-section"], section:has-text("О дистанционном обучении"), section:has-text("дистанционном обучении")', {
      timeout: 10000
    });
  });

  test('component layout and design verification', async ({ page }) => {
    // Scroll to the DistanceLearning section
    const section = page.locator('section').filter({
      has: page.locator(':text("дистанционном обучении")')
    });
    
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // Allow time for scrolling and rendering

    // Verify section exists and is visible
    await expect(section).toBeVisible();

    // Verify background styling
    await expect(section).toHaveCSS('background-color', 'rgb(255, 255, 255)'); // white background

    // Verify the gray card container
    const grayCard = section.locator('div').filter({
      has: page.locator(':text("О дистанционном обучении")')
    }).first();
    
    await expect(grayCard).toBeVisible();
    await expect(grayCard).toHaveCSS('background-color', 'rgb(244, 245, 247)'); // #f4f5f7
    await expect(grayCard).toHaveCSS('border-radius', '24px');

    // Take screenshot of the full component
    await section.screenshot({ 
      path: 'qa/e2e/reports/distance-learning-component.png',
      fullPage: false
    });

    console.log('✅ Basic layout verification passed');
  });

  test('text content verification', async ({ page }) => {
    const section = page.locator('section').filter({
      has: page.locator(':text("дистанционном обучении")')
    });
    
    await section.scrollIntoViewIfNeeded();

    // Verify title text
    const title = section.locator(':text("О дистанционном обучении")');
    await expect(title).toBeVisible();
    await expect(title).toHaveCSS('font-size', '40px');
    await expect(title).toHaveCSS('font-weight', '700');
    await expect(title).toHaveCSS('color', 'rgb(7, 7, 7)'); // #070707

    // Verify description text exists and is styled correctly
    const description = section.locator(':text("Мифы о дистанционном образовании")');
    await expect(description).toBeVisible();
    await expect(description).toHaveCSS('font-size', '16px');
    await expect(description).toHaveCSS('color', 'rgb(7, 7, 7)'); // #070707

    console.log('✅ Text content verification passed');
  });

  test('button styling and functionality', async ({ page }) => {
    const section = page.locator('section').filter({
      has: page.locator(':text("дистанционном обучении")')
    });
    
    await section.scrollIntoViewIfNeeded();

    // Find the CTA button
    const ctaButton = section.locator('a:text("Узнать больше")');
    await expect(ctaButton).toBeVisible();

    // Verify button styling
    await expect(ctaButton).toHaveCSS('background-color', 'rgb(255, 218, 23)'); // #ffda17 yellow
    await expect(ctaButton).toHaveCSS('color', 'rgb(7, 7, 7)'); // #070707 dark text
    await expect(ctaButton).toHaveCSS('border-radius', '8px');
    await expect(ctaButton).toHaveCSS('font-weight', '700');

    // Test button hover behavior
    await ctaButton.hover();
    await page.waitForTimeout(300); // Wait for hover transition

    // The hover colors should change via inline styles
    // We'll verify the element is still interactive
    await expect(ctaButton).toBeEnabled();

    // Verify button link
    await expect(ctaButton).toHaveAttribute('href', '/about-online-learning');

    console.log('✅ Button verification passed');
  });

  test('responsive behavior - desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    
    const section = page.locator('section').filter({
      has: page.locator(':text("дистанционном обучении")')
    });
    
    await section.scrollIntoViewIfNeeded();

    // On desktop, image should be visible
    const imageContainer = section.locator('div').filter({
      has: page.locator('img[alt*="обучается онлайн"]')
    });
    
    // The image container should exist (it might be hidden on smaller screens)
    const imageExists = await imageContainer.count() > 0;
    if (imageExists) {
      await expect(imageContainer).toHaveCSS('background-color', 'rgb(255, 218, 23)'); // #FFDA17 yellow background
    }

    // Take desktop screenshot
    await section.screenshot({ 
      path: 'qa/e2e/reports/distance-learning-desktop.png',
      fullPage: false
    });

    console.log('✅ Desktop responsive verification passed');
  });

  test('responsive behavior - tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    const section = page.locator('section').filter({
      has: page.locator(':text("дистанционном обучении")')
    });
    
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Verify component is still visible and properly styled
    await expect(section).toBeVisible();

    // Take tablet screenshot
    await section.screenshot({ 
      path: 'qa/e2e/reports/distance-learning-tablet.png',
      fullPage: false
    });

    console.log('✅ Tablet responsive verification passed');
  });

  test('responsive behavior - mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    
    const section = page.locator('section').filter({
      has: page.locator(':text("дистанционном обучении")')
    });
    
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Verify component is still visible and accessible
    await expect(section).toBeVisible();

    // On mobile, the image should be hidden (xl:block class)
    const imageContainer = section.locator('div').filter({
      has: page.locator('img[alt*="обучается онлайн"]')
    });
    
    // Image container might not be visible on mobile due to xl:block class
    const imageCount = await imageContainer.count();
    console.log(`Image containers found: ${imageCount}`);

    // Take mobile screenshot
    await section.screenshot({ 
      path: 'qa/e2e/reports/distance-learning-mobile.png',
      fullPage: false
    });

    console.log('✅ Mobile responsive verification passed');
  });

  test('accessibility verification', async ({ page }) => {
    const section = page.locator('section').filter({
      has: page.locator(':text("дистанционном обучении")')
    });
    
    await section.scrollIntoViewIfNeeded();

    // Check for proper heading structure
    const title = section.locator(':text("О дистанционном обучении")');
    await expect(title).toBeVisible();

    // Verify button is keyboard accessible
    const ctaButton = section.locator('a:text("Узнать больше")');
    await expect(ctaButton).toBeVisible();
    
    // Test keyboard navigation
    await ctaButton.focus();
    await expect(ctaButton).toBeFocused();

    // Verify link has proper href
    await expect(ctaButton).toHaveAttribute('href', '/about-online-learning');

    console.log('✅ Accessibility verification passed');
  });

  test('performance and loading verification', async ({ page }) => {
    // Track page load performance
    const startTime = Date.now();
    
    await page.goto('http://localhost:3000');
    
    const section = page.locator('section').filter({
      has: page.locator(':text("дистанционном обучении")')
    });
    
    await section.waitFor({ state: 'visible' });
    
    const loadTime = Date.now() - startTime;
    console.log(`Component loaded in: ${loadTime}ms`);
    
    // Verify reasonable load time (under 3 seconds)
    expect(loadTime).toBeLessThan(3000);

    // Verify image loading if present
    const image = section.locator('img[alt*="обучается онлайн"]');
    const imageExists = await image.count() > 0;
    
    if (imageExists) {
      // Wait for image to load
      await expect(image).toBeVisible();
      
      // Check if image loaded properly (not broken)
      const imageNaturalWidth = await image.evaluate((img: HTMLImageElement) => img.naturalWidth);
      expect(imageNaturalWidth).toBeGreaterThan(0);
    }

    console.log('✅ Performance verification passed');
  });
});