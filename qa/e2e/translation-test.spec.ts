import { test, expect } from '@playwright/test';

test('Check navigation translations', async ({ page }) => {
  // Navigate to homepage
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000); // Wait for translations to load
  
  // Take screenshot
  await page.screenshot({ path: 'translation-check.png' });
  
  // Get all navigation text
  const navTexts = await page.evaluate(() => {
    const navItems = document.querySelectorAll('nav ul li span');
    return Array.from(navItems).map(item => item.textContent?.trim());
  });
  
  console.log('Navigation items found:', navTexts);
  
  // Check for Russian translations
  const expectedRussian = ['Курсы', 'Старты месяца', 'Преподаватели', 'Блог', 'О школе'];
  const foundRussian = navTexts.filter(text => text && expectedRussian.includes(text));
  
  console.log('Russian translations found:', foundRussian);
  console.log('All navigation texts:', navTexts);
  
  // Check console for errors
  const consoleLogs = await page.evaluate(() => {
    return (window as any).__consoleLogs || [];
  });
  
  console.log('Console logs:', consoleLogs);
});