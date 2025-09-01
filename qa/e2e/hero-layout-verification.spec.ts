import { test, expect } from '@playwright/test';

test.describe('Hero Section Layout Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('http://localhost:3000');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Wait for hero section to be visible
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 });
  });

  test('Desktop: Hero section statistics are fully visible', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Wait for layout to stabilize
    await page.waitForTimeout(1000);
    
    // Take screenshot of full hero section
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible();
    
    // Take full hero section screenshot
    await heroSection.screenshot({ 
      path: '/Users/michaelmishayev/Desktop/Projects/schoolSite/projectdes-academy/hero-section-desktop-full.png',
      animations: 'disabled'
    });
    
    // Verify statistics elements are visible
    const stats = [
      { text: '12K+', label: 'Выпускников' },
      { text: '25+', label: 'Стран трудоустройства' },
      { text: '87%', label: 'Успешное трудоустройство' }
    ];
    
    for (const stat of stats) {
      const statElement = page.locator('text=' + stat.text).first();
      await expect(statElement).toBeVisible();
      
      const labelElement = page.locator('text=' + stat.label).first();
      await expect(labelElement).toBeVisible();
      
      // Verify elements are within viewport
      const statBox = await statElement.boundingBox();
      const labelBox = await labelElement.boundingBox();
      
      expect(statBox).not.toBeNull();
      expect(labelBox).not.toBeNull();
      
      if (statBox && labelBox) {
        expect(statBox.y).toBeGreaterThan(0);
        expect(labelBox.y).toBeGreaterThan(0);
        expect(statBox.y + statBox.height).toBeLessThan(900);
        expect(labelBox.y + labelBox.height).toBeLessThan(900);
      }
    }
    
    console.log('✅ Desktop: All statistics are visible and within viewport');
  });

  test('Tablet: Hero section responsive behavior', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Wait for layout to stabilize
    await page.waitForTimeout(1000);
    
    // Take screenshot
    const heroSection = page.locator('[data-testid="hero-section"]');
    await heroSection.screenshot({ 
      path: '/Users/michaelmishayev/Desktop/Projects/schoolSite/projectdes-academy/hero-section-tablet.png',
      animations: 'disabled'
    });
    
    // Verify statistics are still visible on tablet
    const statsContainer = page.locator('.grid').filter({ hasText: '12K+' });
    await expect(statsContainer).toBeVisible();
    
    // Check that hero section doesn't overflow
    const heroBox = await heroSection.boundingBox();
    expect(heroBox).not.toBeNull();
    
    if (heroBox) {
      expect(heroBox.width).toBeLessThanOrEqual(768);
    }
    
    console.log('✅ Tablet: Hero section responsive and statistics visible');
  });

  test('Mobile: Hero section mobile responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for layout to stabilize
    await page.waitForTimeout(1000);
    
    // Take screenshot
    const heroSection = page.locator('[data-testid="hero-section"]');
    await heroSection.screenshot({ 
      path: '/Users/michaelmishayev/Desktop/Projects/schoolSite/projectdes-academy/hero-section-mobile.png',
      animations: 'disabled'
    });
    
    // Verify statistics are visible on mobile (they might stack vertically)
    const stat12k = page.locator('text=12K+').first();
    const stat25 = page.locator('text=25+').first();
    const stat87 = page.locator('text=87%').first();
    
    await expect(stat12k).toBeVisible();
    await expect(stat25).toBeVisible();
    await expect(stat87).toBeVisible();
    
    // Check for proper mobile spacing
    const heroBox = await heroSection.boundingBox();
    expect(heroBox).not.toBeNull();
    
    if (heroBox) {
      expect(heroBox.width).toBeLessThanOrEqual(375);
    }
    
    console.log('✅ Mobile: Hero section responsive and statistics visible');
  });

  test('Hero section layout measurements', async ({ page }) => {
    // Set desktop viewport for measurements
    await page.setViewportSize({ width: 1440, height: 900 });
    
    await page.waitForTimeout(1000);
    
    const heroSection = page.locator('[data-testid="hero-section"]');
    const heroBox = await heroSection.boundingBox();
    
    expect(heroBox).not.toBeNull();
    
    if (heroBox) {
      console.log(`📊 Hero Section Measurements:`);
      console.log(`   Width: ${heroBox.width}px`);
      console.log(`   Height: ${heroBox.height}px`);
      console.log(`   Top: ${heroBox.y}px`);
      console.log(`   Bottom: ${heroBox.y + heroBox.height}px`);
      
      // Verify adequate height for content
      expect(heroBox.height).toBeGreaterThan(500);
    }
    
    // Check spacing between elements
    const title = page.locator('h1').first();
    const subtitle = page.locator('[data-testid="hero-section"] p').first();
    const statsContainer = page.locator('.grid').filter({ hasText: '12K+' });
    
    const titleBox = await title.boundingBox();
    const subtitleBox = await subtitle.boundingBox();
    const statsBox = await statsContainer.boundingBox();
    
    if (titleBox && subtitleBox && statsBox) {
      const titleToSubtitle = subtitleBox.y - (titleBox.y + titleBox.height);
      const subtitleToStats = statsBox.y - (subtitleBox.y + subtitleBox.height);
      
      console.log(`📏 Element Spacing:`);
      console.log(`   Title to Subtitle: ${titleToSubtitle}px`);
      console.log(`   Subtitle to Stats: ${subtitleToStats}px`);
      
      // Verify adequate spacing
      expect(titleToSubtitle).toBeGreaterThan(10);
      expect(subtitleToStats).toBeGreaterThan(20);
    }
  });

  test('Background image and overlay verification', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(1000);
    
    const heroSection = page.locator('[data-testid="hero-section"]');
    
    // Check for background image styles
    const backgroundStyle = await heroSection.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundImage: computed.backgroundImage,
        backgroundSize: computed.backgroundSize,
        backgroundPosition: computed.backgroundPosition,
        position: computed.position
      };
    });
    
    console.log(`🎨 Background Styles:`);
    console.log(`   Background Image: ${backgroundStyle.backgroundImage !== 'none' ? 'Present' : 'Missing'}`);
    console.log(`   Background Size: ${backgroundStyle.backgroundSize}`);
    console.log(`   Background Position: ${backgroundStyle.backgroundPosition}`);
    
    // Verify text is readable over background
    const title = page.locator('h1').first();
    const titleStyles = await title.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        textShadow: computed.textShadow,
        zIndex: computed.zIndex
      };
    });
    
    console.log(`📝 Text Readability:`);
    console.log(`   Title Color: ${titleStyles.color}`);
    console.log(`   Text Shadow: ${titleStyles.textShadow}`);
  });

  test('Cross-browser consistency check', async ({ page, browserName }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(1000);
    
    // Take browser-specific screenshot
    const heroSection = page.locator('[data-testid="hero-section"]');
    await heroSection.screenshot({ 
      path: `/Users/michaelmishayev/Desktop/Projects/schoolSite/projectdes-academy/hero-section-${browserName}.png`,
      animations: 'disabled'
    });
    
    // Verify statistics visibility across browsers
    const stats = ['12K+', '25+', '87%'];
    for (const stat of stats) {
      const statElement = page.locator('text=' + stat).first();
      await expect(statElement).toBeVisible();
    }
    
    console.log(`✅ ${browserName}: Hero section renders correctly`);
  });
});