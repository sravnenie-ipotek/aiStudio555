import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test teardown...');
  
  // Add any cleanup logic here
  // For example: clear test data, stop services, etc.
  
  console.log('✅ Global teardown completed');
}

export default globalTeardown;