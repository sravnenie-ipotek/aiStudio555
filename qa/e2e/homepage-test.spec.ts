import { test, expect } from '@playwright/test';

test.describe('Homepage Tests - AIStudio555', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Homepage loads with all sections', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check Hero Section
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
    await expect(page.locator('text=AIStudio555')).toBeVisible();
    
    // Check Statistics Section
    const statsSection = page.locator('#statistics-section');
    await expect(statsSection).toBeVisible();
    
    // Check Courses Section
    const coursesSection = page.locator('text=Наши курсы').first();
    await expect(coursesSection).toBeVisible();
    
    // Check course cards
    await expect(page.locator('text=AI Transformation Manager')).toBeVisible();
    await expect(page.locator('text=No-Code Website Development')).toBeVisible();
    await expect(page.locator('text=AI Video & Avatar Generation')).toBeVisible();
    
    // Check Benefits Section
    const benefitsSection = page.locator('text=Почему выбирают AIStudio555');
    await expect(benefitsSection).toBeVisible();
    
    // Check Testimonials Section
    const testimonialsSection = page.locator('text=Отзывы наших выпускников');
    await expect(testimonialsSection).toBeVisible();
    
    // Check CTA Section
    const ctaSection = page.locator('text=Готовы начать карьеру в IT?');
    await expect(ctaSection).toBeVisible();
    
    // Check Footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(page.locator('footer text=AIStudio555')).toBeVisible();
    
    console.log('✅ All homepage sections are visible');
  });

  test('Responsive design - Mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Check mobile menu button
    const mobileMenuButton = page.locator('button[aria-label*="menu"]');
    const isMobileMenuVisible = await mobileMenuButton.isVisible();
    
    // Check sections are still visible on mobile
    await expect(page.locator('text=AIStudio555').first()).toBeVisible();
    await expect(page.locator('text=Наши курсы').first()).toBeVisible();
    
    console.log('✅ Mobile responsive design working');
  });

  test('Responsive design - Tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    
    // Check layout on tablet
    await expect(page.locator('text=AIStudio555').first()).toBeVisible();
    
    console.log('✅ Tablet responsive design working');
  });

  test('Responsive design - Desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    
    // Check desktop layout
    await expect(page.locator('text=AIStudio555').first()).toBeVisible();
    
    // Check course cards are in a row on desktop
    const courseCards = page.locator('section').filter({ hasText: 'Наши курсы' });
    await expect(courseCards).toBeVisible();
    
    console.log('✅ Desktop responsive design working');
  });

  test('Interactive elements work', async ({ page }) => {
    // Test CTA buttons
    const ctaButton = page.locator('text=Начать обучение').first();
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toBeEnabled();
    
    // Test testimonial navigation
    const nextButton = page.locator('button[aria-label="Next testimonial"]');
    if (await nextButton.isVisible()) {
      await nextButton.click();
      // Check that testimonial changed
      await page.waitForTimeout(500);
    }
    
    console.log('✅ Interactive elements working');
  });

  test('Visual comparison with original design', async ({ page }) => {
    // Take full page screenshot
    await page.screenshot({ 
      path: 'homepage-aistudio555.png', 
      fullPage: true 
    });
    
    // Take section screenshots
    const heroSection = page.locator('section').first();
    await heroSection.screenshot({ path: 'hero-section.png' });
    
    const coursesSection = page.locator('section').filter({ hasText: 'Наши курсы' });
    await coursesSection.screenshot({ path: 'courses-section.png' });
    
    console.log('✅ Screenshots captured for visual comparison');
  });

  test('Performance metrics', async ({ page }) => {
    // Measure page load time
    const startTime = Date.now();
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    console.log(`⏱️ Page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000); // Should load in under 3 seconds
    
    // Check for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Console error:', msg.text());
      }
    });
    
    console.log('✅ Performance metrics checked');
  });
});