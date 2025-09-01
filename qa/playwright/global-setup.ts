import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;

  console.log('🚀 Starting global setup...');
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Health check - ensure the application is running
    console.log(`📡 Checking application health at ${baseURL}...`);
    await page.goto(baseURL!);
    await page.waitForSelector('body', { timeout: 30000 });
    
    // Check if the app is properly loaded
    const title = await page.title();
    if (!title) {
      throw new Error('Application failed to load - no title found');
    }
    
    console.log(`✅ Application is healthy. Page title: "${title}"`);
    
    // Save storage state for authenticated tests if needed
    // await context.storageState({ path: 'playwright/.auth/user.json' });
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
  
  console.log('✅ Global setup completed successfully');
}

export default globalSetup;