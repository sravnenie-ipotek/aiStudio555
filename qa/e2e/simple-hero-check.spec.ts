import { test, expect } from '@playwright/test';

test.describe('Simple Hero Section Check', () => {
  test('Navigate and inspect hero section', async ({ page }) => {
    // Navigate to homepage
    await page.goto('http://localhost:3000');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take a full page screenshot first
    await page.screenshot({ 
      path: '/Users/michaelmishayev/Desktop/Projects/schoolSite/projectdes-academy/full-homepage.png',
      fullPage: true
    });
    
    // Look for various hero section indicators
    const heroSelectors = [
      '[data-testid="hero-section"]',
      '.hero-section',
      'section[class*="hero"]',
      'div[class*="hero"]',
      'main section:first-child',
      'section:first-of-type'
    ];
    
    let heroFound = false;
    let usedSelector = '';
    
    for (const selector of heroSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        console.log(`✅ Found hero section with selector: ${selector}`);
        heroFound = true;
        usedSelector = selector;
        
        // Take screenshot of this element
        await element.first().screenshot({
          path: `/Users/michaelmishayev/Desktop/Projects/schoolSite/projectdes-academy/hero-found-${selector.replace(/[^a-zA-Z0-9]/g, '_')}.png`
        });
        break;
      }
    }
    
    if (!heroFound) {
      // Get page HTML to debug
      const html = await page.content();
      console.log('❌ Hero section not found with any selector');
      console.log('Page title:', await page.title());
      
      // Look for statistics text
      const statsTexts = ['12K+', '25+', '87%'];
      for (const statText of statsTexts) {
        const statElement = page.locator(`text=${statText}`);
        if (await statElement.count() > 0) {
          console.log(`📊 Found statistic: ${statText}`);
          
          // Get parent containers
          const parent = statElement.locator('xpath=..');
          const parentClass = await parent.getAttribute('class');
          console.log(`   Parent class: ${parentClass}`);
          
          const grandParent = statElement.locator('xpath=../..');
          const grandParentClass = await grandParent.getAttribute('class');
          console.log(`   Grandparent class: ${grandParentClass}`);
        }
      }
      
      // Look for main content areas
      const mainAreas = await page.locator('main, section, div[class*="container"]').all();
      console.log(`📍 Found ${mainAreas.length} potential main content areas`);
      
      for (let i = 0; i < Math.min(mainAreas.length, 5); i++) {
        const area = mainAreas[i];
        const tagName = await area.evaluate(el => el.tagName);
        const className = await area.getAttribute('class') || 'no-class';
        const text = await area.textContent();
        console.log(`   ${i + 1}. ${tagName} - ${className} - ${text?.substring(0, 100)}...`);
      }
    } else {
      // Hero section found, check for statistics
      const heroSection = page.locator(usedSelector).first();
      
      // Check for statistics
      const statsTexts = ['12K+', '25+', '87%'];
      const labels = ['Выпускников', 'Стран трудоустройства', 'Успешное трудоустройство'];
      
      console.log('🔍 Checking for statistics in hero section:');
      
      for (let i = 0; i < statsTexts.length; i++) {
        const statText = statsTexts[i];
        const label = labels[i];
        
        const statInHero = heroSection.locator(`text=${statText}`);
        const labelInHero = heroSection.locator(`text=${label}`);
        
        const statVisible = await statInHero.count() > 0;
        const labelVisible = await labelInHero.count() > 0;
        
        console.log(`   ${statText}: ${statVisible ? '✅' : '❌'} visible`);
        console.log(`   ${label}: ${labelVisible ? '✅' : '❌'} visible`);
        
        if (statVisible) {
          const bbox = await statInHero.first().boundingBox();
          console.log(`   ${statText} position: x=${bbox?.x}, y=${bbox?.y}, h=${bbox?.height}`);
        }
      }
      
      // Get hero section dimensions
      const heroBbox = await heroSection.boundingBox();
      console.log(`📏 Hero section dimensions:`);
      console.log(`   Width: ${heroBbox?.width}px`);
      console.log(`   Height: ${heroBbox?.height}px`);
      console.log(`   Top: ${heroBbox?.y}px`);
      console.log(`   Bottom: ${(heroBbox?.y || 0) + (heroBbox?.height || 0)}px`);
    }
  });
});