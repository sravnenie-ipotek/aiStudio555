import { test, expect } from '@playwright/test';

test('Debug Russian translations - check console and DOM', async ({ page, context }) => {
  // Enable console logging
  page.on('console', (msg) => {
    if (msg.type() === 'log' || msg.type() === 'warn' || msg.type() === 'error') {
      console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    }
  });

  // Navigate to homepage
  await page.goto('http://localhost:3001', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });

  // Wait for the page to load completely
  await page.waitForTimeout(3000);

  // Check if Russian text is present in hero title
  const heroTitle = page.locator('h1').first();
  await expect(heroTitle).toBeVisible();
  
  const titleText = await heroTitle.textContent();
  console.log('Hero title text:', titleText);

  // Check what text is actually displayed
  const heroSubtitle = page.locator('p').first();
  const subtitleText = await heroSubtitle.textContent();
  console.log('Hero subtitle text:', subtitleText);

  // Check if fallback Russian text is being used
  const expectedRussianTitle = 'AI-трансформация для разработчиков и бизнеса';
  const expectedRussianSubtitle = 'Персональное менторство, практические курсы и стратегии роста для next-level карьеры';

  // Log what we expect vs what we get
  console.log('Expected title:', expectedRussianTitle);
  console.log('Actual title:', titleText);
  console.log('Expected subtitle:', expectedRussianSubtitle);
  console.log('Actual subtitle:', subtitleText);

  // Check language setting in localStorage or console
  const languageInfo = await page.evaluate(() => {
    return {
      sessionStorage: sessionStorage.getItem('aistudio555_language'),
      htmlLang: document.documentElement.lang,
      htmlDir: document.documentElement.dir,
      location: window.location.href
    };
  });
  
  console.log('Language info:', languageInfo);

  // Take a screenshot for debugging
  await page.screenshot({ 
    path: 'debug-console.png', 
    fullPage: true 
  });
});