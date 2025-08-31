const { chromium } = require('playwright');

async function quickTest() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Testing basic site access...');
        
        // Try to load the main page with minimal expectations
        await page.goto('https://month.teachmeskills.by/', { 
            waitUntil: 'domcontentloaded',
            timeout: 10000 
        });
        
        console.log('✅ Site loaded successfully');
        
        // Wait a bit for JavaScript
        await page.waitForTimeout(3000);
        
        // Get basic page info
        const title = await page.title();
        const url = page.url();
        
        console.log(`Title: ${title}`);
        console.log(`URL: ${url}`);
        
        // Take a screenshot
        await page.screenshot({ path: 'quick-test-screenshot.png', fullPage: true });
        console.log('📸 Screenshot saved: quick-test-screenshot.png');
        
        // Check if it's a React app
        const hasReact = await page.evaluate(() => {
            return !!(window.React || document.querySelector('[data-reactroot]') || 
                     document.querySelector('script[src*="react"]'));
        });
        
        console.log(`React detected: ${hasReact}`);
        
        // Get some basic stats
        const stats = await page.evaluate(() => {
            return {
                totalElements: document.querySelectorAll('*').length,
                links: document.querySelectorAll('a').length,
                buttons: document.querySelectorAll('button').length,
                forms: document.querySelectorAll('form').length,
                images: document.querySelectorAll('img').length
            };
        });
        
        console.log('Basic page stats:', stats);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

quickTest();