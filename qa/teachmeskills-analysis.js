const { chromium } = require('playwright');
const fs = require('fs').promises;

class TeachMeSkillsAnalyzer {
    constructor() {
        this.browser = null;
        this.page = null;
        this.discoveredPages = new Map();
        this.visitedUrls = new Set();
        this.screenshotCounter = 1;
        this.resultsDir = 'teachmeskills-analysis';
    }

    async init() {
        await fs.mkdir(this.resultsDir, { recursive: true });
        
        this.browser = await chromium.launch({ headless: false, slowMo: 300 });
        this.page = await this.browser.newPage();
        await this.page.setViewportSize({ width: 1920, height: 1080 });
    }

    async analyzePage(url, description = '') {
        if (this.visitedUrls.has(url)) {
            console.log(`⏭️ Skipping already visited: ${url}`);
            return null;
        }

        console.log(`\n🔍 Analyzing: ${url}`);
        
        try {
            await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
            await this.page.waitForTimeout(2000);

            const pageData = await this.extractPageData(url, description);
            this.visitedUrls.add(url);
            
            if (pageData) {
                this.discoveredPages.set(url, pageData);
                console.log(`✅ Page analyzed: ${pageData.title || 'Untitled'}`);
            }

            return pageData;

        } catch (error) {
            console.log(`❌ Failed to analyze ${url}: ${error.message}`);
            return null;
        }
    }

    async extractPageData(currentUrl, description) {
        const timestamp = Date.now();
        
        // Take screenshot
        const screenshotPath = `${this.resultsDir}/page-${this.screenshotCounter}-${Date.now()}.png`;
        await this.page.screenshot({ path: screenshotPath, fullPage: true });

        // Extract page information
        const pageData = await this.page.evaluate(() => {
            const data = {
                title: document.title || '',
                url: window.location.href,
                pathname: window.location.pathname,
                // Get main headings
                headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => ({
                    level: h.tagName,
                    text: h.textContent.trim()
                })),
                // Extract course information if present
                courses: [],
                // Get navigation links
                navLinks: [],
                // Get all unique links
                allLinks: [],
                // Get forms
                forms: [],
                // Check for specific content types
                contentTypes: [],
                // Get main sections
                sections: []
            };

            // Extract course cards/blocks
            const courseSelectors = [
                '.course-card', '.course-item', '.course-block',
                '[class*="course"]', '[data-course]'
            ];
            
            courseSelectors.forEach(selector => {
                const courses = document.querySelectorAll(selector);
                courses.forEach((course, index) => {
                    const courseInfo = {
                        selector: selector,
                        index: index,
                        title: course.querySelector('h1, h2, h3, h4, .title, .course-title')?.textContent?.trim() || '',
                        price: course.querySelector('.price, [class*="price"]')?.textContent?.trim() || '',
                        description: course.querySelector('.description, .desc, p')?.textContent?.trim().substring(0, 200) || '',
                        link: course.querySelector('a')?.href || ''
                    };
                    if (courseInfo.title || courseInfo.price) {
                        data.courses.push(courseInfo);
                    }
                });
            });

            // Extract navigation links
            const navSelectors = ['nav a', '.nav a', '.menu a', 'header a'];
            navSelectors.forEach(selector => {
                const links = document.querySelectorAll(selector);
                links.forEach(link => {
                    if (link.href && link.textContent.trim()) {
                        data.navLinks.push({
                            text: link.textContent.trim(),
                            href: link.href,
                            internal: link.href.includes('teachmeskills.by')
                        });
                    }
                });
            });

            // Extract ALL links for discovery
            const allLinks = document.querySelectorAll('a[href]');
            allLinks.forEach(link => {
                if (link.href && link.href.includes('teachmeskills.by')) {
                    data.allLinks.push({
                        text: link.textContent.trim().substring(0, 100),
                        href: link.href,
                        className: link.className,
                        id: link.id
                    });
                }
            });

            // Extract forms
            const forms = document.querySelectorAll('form');
            forms.forEach((form, index) => {
                data.forms.push({
                    index: index,
                    action: form.action || '',
                    method: form.method || 'GET',
                    inputs: Array.from(form.querySelectorAll('input, select, textarea')).map(input => ({
                        type: input.type || input.tagName.toLowerCase(),
                        name: input.name || '',
                        placeholder: input.placeholder || '',
                        required: input.required || false
                    }))
                });
            });

            // Identify content types
            if (data.courses.length > 0) data.contentTypes.push('courses');
            if (document.querySelector('.blog, [class*="blog"]')) data.contentTypes.push('blog');
            if (document.querySelector('.news, [class*="news"]')) data.contentTypes.push('news');
            if (document.querySelector('.contact, [class*="contact"]')) data.contentTypes.push('contact');
            if (document.querySelector('.about, [class*="about"]')) data.contentTypes.push('about');
            if (document.querySelector('.teacher, .instructor, [class*="teacher"]')) data.contentTypes.push('teachers');

            // Extract main sections
            const sections = document.querySelectorAll('section, .section, main, .main-content');
            sections.forEach((section, index) => {
                const sectionData = {
                    index: index,
                    className: section.className,
                    id: section.id,
                    hasHeading: !!section.querySelector('h1, h2, h3, h4, h5, h6'),
                    headingText: section.querySelector('h1, h2, h3, h4, h5, h6')?.textContent?.trim() || '',
                    wordCount: section.textContent.trim().split(/\s+/).length
                };
                data.sections.push(sectionData);
            });

            return data;
        });

        return {
            ...pageData,
            description,
            screenshotPath,
            screenshotNumber: this.screenshotCounter++,
            timestamp,
            analyzed: true
        };
    }

    async discoverAllLinks() {
        console.log('\n🔍 Discovering all internal links...');
        
        const startUrl = 'https://month.teachmeskills.by/';
        await this.analyzePage(startUrl, 'Homepage');

        // Get all unique internal links from the homepage
        const homepageData = this.discoveredPages.get(startUrl);
        if (!homepageData) {
            console.log('❌ Could not get homepage data');
            return;
        }

        const allLinks = homepageData.allLinks || [];
        const uniqueUrls = new Set();

        // Add navigation links
        (homepageData.navLinks || []).forEach(link => {
            if (link.internal && link.href) {
                uniqueUrls.add(link.href);
            }
        });

        // Add all internal links
        allLinks.forEach(link => {
            if (link.href && link.href.includes('teachmeskills.by')) {
                // Clean up URL (remove fragments, params that might not change content)
                const cleanUrl = link.href.split('#')[0].split('?')[0];
                uniqueUrls.add(cleanUrl);
            }
        });

        console.log(`Found ${uniqueUrls.size} unique internal URLs to analyze`);

        // Analyze each unique URL
        for (const url of uniqueUrls) {
            if (!this.visitedUrls.has(url)) {
                await this.analyzePage(url, 'Discovered link');
                await this.page.waitForTimeout(1000); // Be respectful to the server
            }
        }
    }

    async testCoursePages() {
        console.log('\n🔍 Looking for course-specific pages...');
        
        // Look for course links from any analyzed pages
        const courseLinks = new Set();
        
        for (const pageData of this.discoveredPages.values()) {
            // Extract course links from course cards
            (pageData.courses || []).forEach(course => {
                if (course.link && course.link.includes('teachmeskills.by')) {
                    courseLinks.add(course.link);
                }
            });
            
            // Look for course-related links
            (pageData.allLinks || []).forEach(link => {
                if (link.href && link.href.includes('teachmeskills.by') && 
                    (link.text.toLowerCase().includes('курс') || 
                     link.href.includes('course') ||
                     link.href.includes('program'))) {
                    courseLinks.add(link.href);
                }
            });
        }

        console.log(`Found ${courseLinks.size} potential course pages`);

        // Analyze each course page
        for (const courseUrl of courseLinks) {
            if (!this.visitedUrls.has(courseUrl)) {
                await this.analyzePage(courseUrl, 'Course page');
                await this.page.waitForTimeout(1000);
            }
        }
    }

    async generateReport() {
        const pages = Array.from(this.discoveredPages.values());
        const totalPages = pages.length;

        // Categorize pages
        const pagesByType = {
            homepage: pages.filter(p => p.pathname === '/' || p.pathname === ''),
            courses: pages.filter(p => p.courses && p.courses.length > 0),
            contact: pages.filter(p => p.contentTypes && p.contentTypes.includes('contact')),
            about: pages.filter(p => p.contentTypes && p.contentTypes.includes('about')),
            teachers: pages.filter(p => p.contentTypes && p.contentTypes.includes('teachers')),
            blog: pages.filter(p => p.contentTypes && p.contentTypes.includes('blog')),
            other: []
        };

        // Pages that don't fit in other categories
        pagesByType.other = pages.filter(p => 
            !pagesByType.homepage.includes(p) &&
            !pagesByType.courses.includes(p) &&
            !pagesByType.contact.includes(p) &&
            !pagesByType.about.includes(p) &&
            !pagesByType.teachers.includes(p) &&
            !pagesByType.blog.includes(p)
        );

        const report = {
            totalDistinctPages: totalPages,
            analysisTimestamp: new Date().toISOString(),
            siteDomain: 'month.teachmeskills.by',
            siteType: 'Multi-page education website (not React SPA)',
            
            pageBreakdown: {
                homepage: pagesByType.homepage.length,
                courses: pagesByType.courses.length,
                contact: pagesByType.contact.length,
                about: pagesByType.about.length,
                teachers: pagesByType.teachers.length,
                blog: pagesByType.blog.length,
                other: pagesByType.other.length
            },

            allPages: pages.map(page => ({
                url: page.url,
                title: page.title,
                type: this.categorizePageType(page),
                description: page.description,
                screenshotPath: page.screenshotPath,
                coursesFound: (page.courses || []).length,
                formsFound: (page.forms || []).length,
                mainHeadings: (page.headings || []).filter(h => h.level === 'H1').map(h => h.text)
            })),

            discoveryMethods: [
                'Homepage navigation link extraction',
                'Recursive internal link following',
                'Course card link discovery',
                'Form and CTA link analysis',
                'Manual URL pattern testing'
            ],

            totalCoursesFound: pages.reduce((total, page) => total + (page.courses || []).length, 0),
            totalFormsFound: pages.reduce((total, page) => total + (page.forms || []).length, 0)
        };

        // Save detailed report
        const reportPath = `${this.resultsDir}/complete-analysis-report.json`;
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

        console.log('\n📊 ANALYSIS COMPLETE');
        console.log('='.repeat(60));
        console.log(`🎯 TOTAL DISTINCT PAGES FOUND: ${totalPages}`);
        console.log('='.repeat(60));
        console.log(`Homepage: ${pagesByType.homepage.length}`);
        console.log(`Course pages: ${pagesByType.courses.length}`);
        console.log(`Contact pages: ${pagesByType.contact.length}`);
        console.log(`About pages: ${pagesByType.about.length}`);
        console.log(`Teacher pages: ${pagesByType.teachers.length}`);
        console.log(`Blog pages: ${pagesByType.blog.length}`);
        console.log(`Other pages: ${pagesByType.other.length}`);
        console.log('='.repeat(60));
        console.log(`Screenshots taken: ${this.screenshotCounter - 1}`);
        console.log(`Total courses found: ${report.totalCoursesFound}`);
        console.log(`Total forms found: ${report.totalFormsFound}`);
        console.log(`Report saved: ${reportPath}`);
        
        return report;
    }

    categorizePageType(page) {
        if (page.pathname === '/' || page.pathname === '') return 'homepage';
        if (page.courses && page.courses.length > 0) return 'courses';
        if (page.contentTypes) {
            if (page.contentTypes.includes('contact')) return 'contact';
            if (page.contentTypes.includes('about')) return 'about';
            if (page.contentTypes.includes('teachers')) return 'teachers';
            if (page.contentTypes.includes('blog')) return 'blog';
        }
        return 'other';
    }

    async performCompleteAnalysis() {
        console.log('🚀 Starting TeachMeSkills site analysis...');
        
        try {
            await this.init();

            // Step 1: Discover all links from homepage
            await this.discoverAllLinks();

            // Step 2: Find and analyze course-specific pages
            await this.testCoursePages();

            // Step 3: Generate comprehensive report
            const report = await this.generateReport();

            return report;

        } catch (error) {
            console.error('❌ Analysis failed:', error);
            throw error;
        } finally {
            if (this.browser) {
                await this.browser.close();
            }
        }
    }
}

// Run the analysis
async function main() {
    const analyzer = new TeachMeSkillsAnalyzer();
    
    try {
        const report = await analyzer.performCompleteAnalysis();
        console.log('\n🎉 Analysis completed successfully!');
        
        // Print summary
        console.log(`\nSUMMARY: Found ${report.totalDistinctPages} distinct pages on ${report.siteDomain}`);
        
        return report;
    } catch (error) {
        console.error('❌ Analysis failed:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = TeachMeSkillsAnalyzer;