const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

class SPAAnalyzer {
    constructor() {
        this.browser = null;
        this.page = null;
        this.discoveredPages = new Map();
        this.clickedElements = new Set();
        this.networkRequests = [];
        this.screenshotCounter = 1;
        this.resultsDir = 'spa-analysis-results';
    }

    async init() {
        // Create results directory
        try {
            await fs.mkdir(this.resultsDir, { recursive: true });
        } catch (err) {
            // Directory might already exist
        }

        this.browser = await chromium.launch({ 
            headless: false, // Visual debugging
            slowMo: 500 // Slow down for better observation
        });
        
        this.page = await this.browser.newPage();
        
        // Set viewport for consistent screenshots
        await this.page.setViewportSize({ width: 1920, height: 1080 });
        
        // Monitor network requests
        this.page.on('request', request => {
            this.networkRequests.push({
                url: request.url(),
                method: request.method(),
                resourceType: request.resourceType()
            });
        });

        // Monitor console logs for routing information
        this.page.on('console', msg => {
            console.log('Browser console:', msg.text());
        });
    }

    async navigateAndCapture(url, description = '') {
        console.log(`\n🔍 Navigating to: ${url}`);
        
        try {
            // Try different wait strategies for better compatibility
            const waitStrategies = ['load', 'domcontentloaded', 'networkidle'];
            let success = false;
            
            for (const waitUntil of waitStrategies) {
                try {
                    await this.page.goto(url, { 
                        waitUntil: waitUntil,
                        timeout: 15000 
                    });
                    console.log(`✅ Successfully loaded with ${waitUntil} strategy`);
                    success = true;
                    break;
                } catch (strategyError) {
                    console.log(`⚠️ ${waitUntil} strategy failed: ${strategyError.message}`);
                    continue;
                }
            }

            if (!success) {
                console.log(`❌ All navigation strategies failed for ${url}`);
                return null;
            }

            // Wait for React/JavaScript to fully render
            await this.page.waitForTimeout(5000);

            // Wait for common loading indicators to disappear
            try {
                await this.page.waitForSelector('.loading, .spinner, .loader', { state: 'hidden', timeout: 5000 });
            } catch (e) {
                // Loading indicators might not exist
            }

            // Capture page state
            const pageState = await this.capturePageState(url, description);
            return pageState;

        } catch (error) {
            console.log(`❌ Critical error navigating to ${url}: ${error.message}`);
            return null;
        }
    }

    async capturePageState(currentUrl, description) {
        const timestamp = Date.now();
        
        // Take screenshot
        const screenshotPath = `${this.resultsDir}/screenshot-${this.screenshotCounter}-${timestamp}.png`;
        await this.page.screenshot({ 
            path: screenshotPath, 
            fullPage: true 
        });

        // Get page content hash for uniqueness detection
        const pageContent = await this.page.evaluate(() => {
            // Get meaningful content, exclude dynamic elements
            const content = document.body.innerText;
            const title = document.title;
            const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent);
            
            return {
                content: content.substring(0, 1000), // First 1000 chars for comparison
                title,
                headings,
                url: window.location.href,
                pathname: window.location.pathname,
                hash: window.location.hash
            };
        });

        // Create unique identifier for this page state
        const pageId = `${pageContent.pathname}${pageContent.hash}`;
        const contentHash = this.hashString(pageContent.content + pageContent.title + pageContent.headings.join(''));

        const pageState = {
            id: pageId,
            url: currentUrl,
            actualUrl: pageContent.url,
            pathname: pageContent.pathname,
            hash: pageContent.hash,
            title: pageContent.title,
            headings: pageContent.headings,
            contentHash,
            description,
            screenshotPath,
            timestamp,
            screenshotNumber: this.screenshotCounter++
        };

        // Check if this is a unique page
        const existingPage = Array.from(this.discoveredPages.values()).find(page => 
            page.contentHash === contentHash || page.id === pageId
        );

        if (!existingPage) {
            this.discoveredPages.set(pageId, pageState);
            console.log(`✅ New page discovered: ${pageState.title || pageId}`);
        } else {
            console.log(`🔄 Duplicate page detected: ${pageState.title || pageId}`);
        }

        return pageState;
    }

    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    async findClickableElements() {
        console.log('\n🔍 Finding all clickable elements...');
        
        const clickableElements = await this.page.evaluate(() => {
            const elements = [];
            
            // Find various types of clickable elements
            const selectors = [
                'a[href]',
                'button',
                '[onclick]',
                '[role="button"]',
                '.btn',
                '.button',
                'nav a',
                '.nav-link',
                '.menu-item',
                '[data-toggle]',
                '[data-target]',
                'input[type="submit"]',
                'input[type="button"]',
                '.card',
                '.course-card',
                '.program-card'
            ];

            selectors.forEach(selector => {
                const found = document.querySelectorAll(selector);
                found.forEach((el, index) => {
                    if (el.offsetParent !== null) { // Element is visible
                        const rect = el.getBoundingClientRect();
                        elements.push({
                            selector: selector,
                            index: index,
                            text: el.textContent?.trim().substring(0, 100) || '',
                            href: el.href || '',
                            id: el.id || '',
                            className: el.className || '',
                            tagName: el.tagName,
                            x: rect.x,
                            y: rect.y,
                            width: rect.width,
                            height: rect.height,
                            visible: rect.width > 0 && rect.height > 0
                        });
                    }
                });
            });

            return elements.filter(el => el.visible);
        });

        console.log(`Found ${clickableElements.length} clickable elements`);
        return clickableElements;
    }

    async clickElement(element) {
        const elementId = `${element.selector}-${element.index}-${element.text.substring(0, 20)}`;
        
        if (this.clickedElements.has(elementId)) {
            return false; // Already clicked
        }

        console.log(`\n🖱️ Clicking: ${element.text || element.selector}`);
        
        try {
            // Scroll element into view
            await this.page.evaluate((el) => {
                const element = document.querySelectorAll(el.selector)[el.index];
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, element);

            await this.page.waitForTimeout(1000);

            // Click the element
            await this.page.evaluate((el) => {
                const element = document.querySelectorAll(el.selector)[el.index];
                if (element) {
                    element.click();
                }
            }, element);

            // Wait for potential page changes
            await this.page.waitForTimeout(2000);

            this.clickedElements.add(elementId);
            return true;

        } catch (error) {
            console.log(`❌ Failed to click element: ${error.message}`);
            return false;
        }
    }

    async testCommonRoutes() {
        console.log('\n🔍 Testing common SPA routes...');
        
        const baseUrl = 'https://month.teachmeskills.by';
        const commonRoutes = [
            '/',
            '/courses',
            '/programs',
            '/about',
            '/contact',
            '/pricing',
            '/teachers',
            '/reviews',
            '/blog',
            '/faq',
            '/#/',
            '/#/courses',
            '/#/programs',
            '/#/about',
            '/#/contact',
            '/#/pricing'
        ];

        for (const route of commonRoutes) {
            const fullUrl = route.startsWith('#') ? baseUrl + route : baseUrl + route;
            await this.navigateAndCapture(fullUrl, `Direct route: ${route}`);
            await this.page.waitForTimeout(1000);
        }
    }

    async analyzeDOMStructure() {
        console.log('\n🔍 Analyzing DOM structure for React components...');
        
        const domAnalysis = await this.page.evaluate(() => {
            const analysis = {
                reactComponents: [],
                routeElements: [],
                sections: [],
                dataAttributes: []
            };

            // Look for React-specific elements
            const reactElements = document.querySelectorAll('[data-reactroot], [data-react-helmet]');
            analysis.reactComponents = Array.from(reactElements).map(el => ({
                tagName: el.tagName,
                attributes: Array.from(el.attributes).map(attr => `${attr.name}="${attr.value}"`)
            }));

            // Look for routing indicators
            const routeSelectors = ['[data-route]', '[data-page]', '[data-view]', '.route', '.page', '.view'];
            routeSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    analysis.routeElements.push({
                        selector,
                        text: el.textContent?.trim().substring(0, 50),
                        attributes: Array.from(el.attributes).map(attr => `${attr.name}="${attr.value}"`)
                    });
                });
            });

            // Count major sections
            const sections = document.querySelectorAll('section, .section, main, .main, .page-content');
            analysis.sections = Array.from(sections).map((section, index) => ({
                index,
                tagName: section.tagName,
                className: section.className,
                id: section.id,
                textPreview: section.textContent?.trim().substring(0, 100)
            }));

            // Look for data attributes that might indicate different views
            const allElements = document.querySelectorAll('*');
            allElements.forEach(el => {
                Array.from(el.attributes).forEach(attr => {
                    if (attr.name.startsWith('data-') && 
                        (attr.name.includes('page') || attr.name.includes('route') || attr.name.includes('view'))) {
                        analysis.dataAttributes.push({
                            element: el.tagName,
                            attribute: attr.name,
                            value: attr.value
                        });
                    }
                });
            });

            return analysis;
        });

        console.log('DOM Analysis Results:');
        console.log(`- React components found: ${domAnalysis.reactComponents.length}`);
        console.log(`- Route elements found: ${domAnalysis.routeElements.length}`);
        console.log(`- Major sections found: ${domAnalysis.sections.length}`);
        console.log(`- Data attributes found: ${domAnalysis.dataAttributes.length}`);

        return domAnalysis;
    }

    async performComprehensiveAnalysis() {
        console.log('🚀 Starting comprehensive SPA analysis...');
        
        try {
            await this.init();

            // 1. Initial navigation and capture
            await this.navigateAndCapture('https://month.teachmeskills.by/', 'Initial page load');

            // 2. Test common routes
            await this.testCommonRoutes();

            // 3. Analyze DOM structure
            const domAnalysis = await this.analyzeDOMStructure();

            // 4. Find and interact with clickable elements
            const clickableElements = await this.findClickableElements();
            
            let clickCount = 0;
            for (const element of clickableElements) {
                if (clickCount >= 50) break; // Prevent infinite clicking
                
                const clicked = await this.clickElement(element);
                if (clicked) {
                    clickCount++;
                    // Capture page state after click
                    await this.capturePageState(
                        await this.page.url(), 
                        `After clicking: ${element.text || element.selector}`
                    );
                }
            }

            // 5. Check for modals, popups, or hidden content
            await this.checkForHiddenContent();

            // 6. Generate comprehensive report
            const report = await this.generateReport(domAnalysis, clickableElements);
            
            return report;

        } catch (error) {
            console.error('Analysis failed:', error);
            throw error;
        } finally {
            if (this.browser) {
                await this.browser.close();
            }
        }
    }

    async checkForHiddenContent() {
        console.log('\n🔍 Checking for hidden content, modals, and popups...');
        
        // Try to trigger common modal/popup triggers
        const triggerSelectors = [
            '.modal-trigger',
            '.popup-trigger',
            '[data-toggle="modal"]',
            '[data-bs-toggle="modal"]',
            '.hamburger',
            '.menu-toggle',
            '.nav-toggle'
        ];

        for (const selector of triggerSelectors) {
            try {
                const element = await this.page.$(selector);
                if (element) {
                    await element.click();
                    await this.page.waitForTimeout(1000);
                    await this.capturePageState(
                        await this.page.url(), 
                        `After triggering: ${selector}`
                    );
                }
            } catch (error) {
                // Continue if element not found or not clickable
            }
        }

        // Check for tab content
        const tabSelectors = ['.tab', '.nav-tab', '[role="tab"]', '.tab-link'];
        for (const selector of tabSelectors) {
            try {
                const tabs = await this.page.$$(selector);
                for (let i = 0; i < Math.min(tabs.length, 10); i++) {
                    await tabs[i].click();
                    await this.page.waitForTimeout(1000);
                    await this.capturePageState(
                        await this.page.url(), 
                        `Tab content: ${selector} #${i}`
                    );
                }
            } catch (error) {
                // Continue if tabs not found
            }
        }
    }

    async generateReport(domAnalysis, clickableElements) {
        const uniquePages = Array.from(this.discoveredPages.values());
        const totalPages = uniquePages.length;

        const report = {
            totalDistinctPages: totalPages,
            analysisTimestamp: new Date().toISOString(),
            discoveredPages: uniquePages.map(page => ({
                id: page.id,
                title: page.title,
                url: page.actualUrl,
                description: page.description,
                screenshotPath: page.screenshotPath,
                headings: page.headings
            })),
            statistics: {
                clickableElementsFound: clickableElements.length,
                elementsClicked: this.clickedElements.size,
                networkRequests: this.networkRequests.length,
                screenshotsTaken: this.screenshotCounter - 1
            },
            domAnalysis,
            methodology: [
                'Direct navigation to common SPA routes',
                'Systematic clicking of all visible interactive elements',
                'DOM analysis for React components and routing patterns',
                'Network request monitoring for API-driven content',
                'Screenshot capture for visual verification',
                'Content hashing for duplicate detection'
            ]
        };

        // Save report to file
        const reportPath = `${this.resultsDir}/analysis-report.json`;
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

        console.log('\n📊 ANALYSIS COMPLETE');
        console.log('='.repeat(50));
        console.log(`Total distinct pages found: ${totalPages}`);
        console.log(`Screenshots taken: ${report.statistics.screenshotsTaken}`);
        console.log(`Elements interacted with: ${report.statistics.elementsClicked}`);
        console.log(`Report saved to: ${reportPath}`);
        
        return report;
    }
}

// Run the analysis
async function main() {
    const analyzer = new SPAAnalyzer();
    
    try {
        const report = await analyzer.performComprehensiveAnalysis();
        console.log('\n🎉 Analysis completed successfully!');
        return report;
    } catch (error) {
        console.error('❌ Analysis failed:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = SPAAnalyzer;