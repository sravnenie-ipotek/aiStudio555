import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');
  
  // Start browser for authentication state setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Wait for development server to be ready
  const baseURL = config.use?.baseURL || 'http://localhost:3000';
  
  try {
    await page.goto(baseURL);
    console.log(`✅ Development server is ready at ${baseURL}`);
  } catch (error) {
    console.error(`❌ Failed to connect to development server at ${baseURL}`);
    throw error;
  }

  // Cleanup
  await context.close();
  await browser.close();
  
  console.log('✅ Global setup completed');
}

export default globalSetup;