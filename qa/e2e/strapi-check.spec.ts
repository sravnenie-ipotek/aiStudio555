import { test, expect } from '@playwright/test';

test('Check Strapi Connection Status', async ({ page }) => {
  // Capture console messages
  const consoleLogs: string[] = [];
  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push(`[${msg.type()}] ${text}`);
    if (text.includes('Strapi') || text.includes('FALLBACK')) {
      console.log(text);
    }
  });

  // Navigate to homepage
  await page.goto('http://localhost:3000');
  
  // Wait for Strapi connection check
  await page.waitForTimeout(3000);
  
  // Check the indicator badges
  const fallbackBadge = page.locator('text=FALLBACK MODE');
  const strapiBadge = page.locator('div').filter({ hasText: /Strapi/ });
  
  const fallbackVisible = await fallbackBadge.isVisible().catch(() => false);
  const strapiText = await strapiBadge.first().textContent().catch(() => '');
  
  console.log('Fallback badge visible:', fallbackVisible);
  console.log('Strapi badge text:', strapiText);
  
  // Take screenshot
  await page.screenshot({ path: 'strapi-status.png' });
  
  // Print console logs
  console.log('\n=== Console Logs ===');
  consoleLogs.forEach(log => console.log(log));
});