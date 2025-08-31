const { chromium } = require('playwright');
const fs = require('fs');

async function crawlTeachMeSkills() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    
    const page = await context.newPage();
    const foundUrls = new Set();
    const processedUrls = new Set();
    const categorizedPages = {
        navigation: [],
        courses: [],
        blog: [],
        legal: [],
        support: [],
        career: [],
        corporate: [],
        other: []
    };
    
    console.log('🔍 Starting comprehensive crawl of teachmeskills.by...');
    
    try {
        // Start with homepage
        console.log('🌐 Attempting to access teachmeskills.by...');
        await page.goto('https://teachmeskills.by/', { 
            waitUntil: 'domcontentloaded',
            timeout: 60000 
        });
        console.log('✅ Homepage loaded successfully');
        
        // Wait a bit for dynamic content
        await page.waitForTimeout(3000);
        await page.screenshot({ path: 'homepage-screenshot.png', fullPage: true });
        
        console.log('📸 Homepage screenshot captured');
        
        // Extract all links from homepage
        const allLinks = await page.$$eval('a[href]', links => 
            links.map(link => ({
                href: link.href,
                text: link.textContent?.trim() || '',
                className: link.className || ''
            }))
        );
        
        // Filter internal links
        const internalLinks = allLinks.filter(link => 
            link.href.includes('teachmeskills.by') || 
            link.href.startsWith('/') ||
            link.href.startsWith('#')
        );
        
        console.log(`📋 Found ${internalLinks.length} internal links on homepage`);
        
        // Add all internal links to our set
        internalLinks.forEach(link => {
            if (link.href.startsWith('/')) {
                foundUrls.add('https://teachmeskills.by' + link.href);
            } else {
                foundUrls.add(link.href);
            }
        });
        
        // Check sitemap.xml
        try {
            await page.goto('https://teachmeskills.by/sitemap.xml', { 
                waitUntil: 'domcontentloaded',
                timeout: 30000 
            });
            const sitemapContent = await page.textContent('body');
            if (sitemapContent && sitemapContent.includes('<url>')) {
                console.log('📍 Sitemap.xml found - extracting URLs');
                const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || [];
                urlMatches.forEach(match => {
                    const url = match.replace('<loc>', '').replace('</loc>', '');
                    foundUrls.add(url);
                });
                console.log(`📍 Added ${urlMatches.length} URLs from sitemap.xml`);
            }
        } catch (e) {
            console.log('⚠️ No sitemap.xml found');
        }
        
        // Check robots.txt
        try {
            await page.goto('https://teachmeskills.by/robots.txt', { 
                waitUntil: 'domcontentloaded',
                timeout: 20000 
            });
            const robotsContent = await page.textContent('body');
            console.log('🤖 Robots.txt content found');
        } catch (e) {
            console.log('⚠️ No robots.txt found');
        }
        
        // Common page pattern testing
        const commonPatterns = [
            '/about', '/o-nas', '/o-shkole', '/about-us',
            '/contacts', '/kontakty', '/contact',
            '/privacy', '/policy', '/terms', '/dogovor', '/agreement',
            '/help', '/faq', '/support', '/pomoshch',
            '/career', '/vacancy', '/jobs', '/rabota', '/vakansii',
            '/partners', '/partnery', '/cooperation',
            '/reviews', '/otzyvy', '/testimonials',
            '/news', '/novosti', '/articles', '/stati', '/blog',
            '/kursy', '/courses', '/programs',
            '/online', '/distantsionnoe',
            '/corporate', '/korporativnoe',
            '/certificates', '/sertifikaty'
        ];
        
        console.log('🔍 Testing common page patterns...');
        for (const pattern of commonPatterns) {
            try {
                const response = await page.goto('https://teachmeskills.by' + pattern, { 
                    waitUntil: 'domcontentloaded',
                    timeout: 15000 
                });
                if (response && response.status() === 200) {
                    foundUrls.add('https://teachmeskills.by' + pattern);
                    console.log(`✅ Found: ${pattern}`);
                }
            } catch (e) {
                // Pattern not found, continue
            }
        }
        
        // Crawl all found URLs
        const urlArray = Array.from(foundUrls);
        console.log(`🚀 Starting systematic crawl of ${urlArray.length} discovered URLs...`);
        
        for (const url of urlArray) {
            if (processedUrls.has(url)) continue;
            
            try {
                console.log(`📄 Processing: ${url}`);
                const response = await page.goto(url, { 
                    waitUntil: 'domcontentloaded', 
                    timeout: 20000 
                });
                
                if (response && response.status() === 200) {
                    processedUrls.add(url);
                    
                    // Categorize the page
                    const urlLower = url.toLowerCase();
                    if (urlLower.includes('kursy') || urlLower.includes('course')) {
                        categorizedPages.courses.push(url);
                    } else if (urlLower.includes('blog') || urlLower.includes('news') || urlLower.includes('stati')) {
                        categorizedPages.blog.push(url);
                    } else if (urlLower.includes('privacy') || urlLower.includes('terms') || urlLower.includes('policy')) {
                        categorizedPages.legal.push(url);
                    } else if (urlLower.includes('career') || urlLower.includes('vacancy') || urlLower.includes('rabota')) {
                        categorizedPages.career.push(url);
                    } else if (urlLower.includes('corporate') || urlLower.includes('korporativ')) {
                        categorizedPages.corporate.push(url);
                    } else if (urlLower.includes('help') || urlLower.includes('support') || urlLower.includes('faq')) {
                        categorizedPages.support.push(url);
                    } else if (urlLower.includes('about') || urlLower.includes('contact') || urlLower.includes('o-nas')) {
                        categorizedPages.navigation.push(url);
                    } else {
                        categorizedPages.other.push(url);
                    }
                    
                    // Extract additional links from this page
                    const pageLinks = await page.$$eval('a[href]', links => 
                        links.map(link => link.href).filter(href => 
                            href && (href.includes('teachmeskills.by') || href.startsWith('/'))
                        )
                    );
                    
                    pageLinks.forEach(link => {
                        if (link.startsWith('/')) {
                            foundUrls.add('https://teachmeskills.by' + link);
                        } else {
                            foundUrls.add(link);
                        }
                    });
                }
                
            } catch (error) {
                console.log(`❌ Error processing ${url}: ${error.message}`);
            }
        }
        
        // Generate comprehensive report
        const report = {
            totalUniquePages: processedUrls.size,
            categorizedPages,
            allUrls: Array.from(processedUrls).sort()
        };
        
        fs.writeFileSync('teachmeskills-crawl-report.json', JSON.stringify(report, null, 2));
        
        console.log('\n🎯 FINAL ANALYSIS COMPLETE');
        console.log(`📊 Total unique pages found: ${processedUrls.size}`);
        console.log('\n📋 Page Categories:');
        console.log(`   Navigation/Info: ${categorizedPages.navigation.length}`);
        console.log(`   Courses: ${categorizedPages.courses.length}`);
        console.log(`   Blog/News: ${categorizedPages.blog.length}`);
        console.log(`   Legal: ${categorizedPages.legal.length}`);
        console.log(`   Support: ${categorizedPages.support.length}`);
        console.log(`   Career: ${categorizedPages.career.length}`);
        console.log(`   Corporate: ${categorizedPages.corporate.length}`);
        console.log(`   Other: ${categorizedPages.other.length}`);
        
        return report;
        
    } catch (error) {
        console.error('❌ Critical error:', error);
    } finally {
        await browser.close();
    }
}

crawlTeachMeSkills();