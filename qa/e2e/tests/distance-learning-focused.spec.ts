import { test, expect } from '@playwright/test';

test.describe('🟠 DistanceLearning Component - Focused UX Evaluation', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should capture component screenshots across viewports', async ({ page }) => {
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(1000); // Allow layout to settle

      // Try different selector strategies to find the DistanceLearning section
      let section;
      
      try {
        // Try to find by background color
        section = page.locator('section').filter({ has: page.locator('.bg-gradient-to-br.from-slate-50') });
        if (await section.count() === 0) {
          // Try to find by card content
          section = page.locator('section').filter({ has: page.locator('.shadow-2xl') });
        }
        if (await section.count() === 0) {
          // Try to find by heading content
          section = page.locator('section').filter({ has: page.locator('h2, h3, .text-3xl, .text-4xl') });
        }
        if (await section.count() === 0) {
          // Fallback to any section with cards
          section = page.locator('section').filter({ has: page.locator('[class*="Card"]') });
        }
      } catch (error) {
        console.log('Trying alternative selectors...');
        section = page.locator('section').nth(2); // Assuming it's the third section based on page structure
      }

      if (await section.count() > 0) {
        await section.first().screenshot({ 
          path: `qa/e2e/test-results/distance-learning-${viewport.name}-${viewport.width}x${viewport.height}.png`,
          fullPage: false 
        });
        console.log(`✅ Screenshot taken for ${viewport.name}`);
      } else {
        console.log(`⚠️ Could not find DistanceLearning section for ${viewport.name}`);
        // Take full page screenshot as fallback
        await page.screenshot({ 
          path: `qa/e2e/test-results/full-page-${viewport.name}-${viewport.width}x${viewport.height}.png`,
          fullPage: true 
        });
      }
    }
  });

  test('should evaluate visual design and accessibility', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for basic responsive design elements
    const hasResponsiveGrids = await page.locator('.lg\\:grid-cols-2').count();
    const hasResponsiveButtons = await page.locator('.sm\\:flex-row').count();
    const hasResponsiveText = await page.locator('.text-3xl.lg\\:text-4xl').count();
    
    console.log(`Responsive design elements found:`);
    console.log(`- Grid layouts: ${hasResponsiveGrids}`);
    console.log(`- Responsive buttons: ${hasResponsiveButtons}`);
    console.log(`- Responsive typography: ${hasResponsiveText}`);

    // Check for brand color usage
    const brandColorElements = await page.locator('[class*="FFDA17"]').count();
    console.log(`- Brand color usage: ${brandColorElements} elements`);

    // Check for shadows and modern design
    const shadowElements = await page.locator('[class*="shadow-"]').count();
    console.log(`- Shadow effects: ${shadowElements} elements`);

    // Check for accessibility features
    const images = await page.locator('img');
    const imageCount = await images.count();
    let imagesWithAlt = 0;
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const altText = await img.getAttribute('alt');
      if (altText && altText.length > 0) {
        imagesWithAlt++;
      }
    }
    
    console.log(`- Images with alt text: ${imagesWithAlt}/${imageCount}`);

    // Check for interactive elements
    const buttons = await page.locator('a[href], button').count();
    console.log(`- Interactive elements: ${buttons}`);

    // Basic performance check
    const startTime = Date.now();
    await page.locator('img').first().waitFor({ state: 'visible' });
    const loadTime = Date.now() - startTime;
    console.log(`- Image load time: ${loadTime}ms`);

    expect(hasResponsiveGrids).toBeGreaterThan(0);
    expect(brandColorElements).toBeGreaterThan(0);
    expect(shadowElements).toBeGreaterThan(0);
    expect(buttons).toBeGreaterThan(0);
    expect(imagesWithAlt).toBeGreaterThan(0);
  });

  test('should analyze component structure and quality', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Component quality metrics
    const qualityMetrics = {
      shadcnComponents: 0,
      tailwindClasses: 0,
      animations: 0,
      accessibility: 0,
      performance: 0
    };

    // Check for shadcn/ui components
    const cardComponents = await page.locator('[class*="shadow-2xl"], [class*="CardContent"], [class*="CardHeader"]').count();
    const badgeComponents = await page.locator('[class*="Badge"]').count();
    qualityMetrics.shadcnComponents = cardComponents + badgeComponents;

    // Check Tailwind CSS usage
    const tailwindElements = await page.locator('[class*="bg-"], [class*="text-"], [class*="p-"], [class*="m-"], [class*="w-"], [class*="h-"]').count();
    qualityMetrics.tailwindClasses = Math.min(tailwindElements, 50); // Cap at reasonable number

    // Check for animations
    const animatedElements = await page.locator('[class*="animate-"], [class*="transition-"], [class*="hover:"]').count();
    qualityMetrics.animations = animatedElements;

    // Check accessibility features
    const accessibleElements = await page.locator('img[alt], a[href], [role], [aria-label]').count();
    qualityMetrics.accessibility = accessibleElements;

    // Performance indicators
    const optimizedImages = await page.locator('img[loading], img[width][height]').count();
    qualityMetrics.performance = optimizedImages;

    console.log('\n🎯 COMPONENT QUALITY ANALYSIS:');
    console.log('================================');
    console.log(`shadcn/ui Components: ${qualityMetrics.shadcnComponents}`);
    console.log(`Tailwind Classes: ${qualityMetrics.tailwindClasses}+`);
    console.log(`Animation Elements: ${qualityMetrics.animations}`);
    console.log(`Accessibility Features: ${qualityMetrics.accessibility}`);
    console.log(`Performance Optimizations: ${qualityMetrics.performance}`);

    // Calculate quality score (0-10)
    const maxScores = {
      shadcnComponents: 10, // Max expected shadcn components
      tailwindClasses: 20,  // Reasonable Tailwind usage
      animations: 10,       // Animation elements
      accessibility: 15,    // Accessibility features
      performance: 5        // Performance optimizations
    };

    let totalScore = 0;
    let maxTotal = 0;

    Object.keys(qualityMetrics).forEach(key => {
      const score = Math.min(qualityMetrics[key], maxScores[key]);
      totalScore += score;
      maxTotal += maxScores[key];
    });

    const qualityRating = (totalScore / maxTotal) * 10;
    
    console.log(`\nOVERALL QUALITY RATING: ${qualityRating.toFixed(1)}/10`);
    console.log(`(${totalScore}/${maxTotal} points)`);

    // Expectations for good quality
    expect(qualityMetrics.shadcnComponents).toBeGreaterThan(3);
    expect(qualityMetrics.animations).toBeGreaterThan(2);
    expect(qualityMetrics.accessibility).toBeGreaterThan(5);
    expect(qualityRating).toBeGreaterThan(6.0);

    return qualityRating;
  });

  test('should perform comprehensive UX evaluation', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const uxCriteria = {
      visualHierarchy: { score: 0, maxScore: 10, weight: 0.2 },
      responsiveness: { score: 0, maxScore: 10, weight: 0.2 },
      accessibility: { score: 0, maxScore: 10, weight: 0.15 },
      interactivity: { score: 0, maxScore: 10, weight: 0.15 },
      designConsistency: { score: 0, maxScore: 10, weight: 0.15 },
      performance: { score: 0, maxScore: 10, weight: 0.15 }
    };

    // Visual Hierarchy (20%)
    const hasProperHeadings = await page.locator('h1, h2, h3, h4').count() > 0;
    const hasDescriptionText = await page.locator('p, .text-lg').count() > 0;
    const hasClearCTA = await page.locator('a[href], button').count() >= 2;
    const hasVisualSeparation = await page.locator('[class*="space-"], [class*="gap-"]').count() > 5;
    uxCriteria.visualHierarchy.score = 
      (hasProperHeadings ? 3 : 0) + 
      (hasDescriptionText ? 2 : 0) + 
      (hasClearCTA ? 3 : 0) + 
      (hasVisualSeparation ? 2 : 0);

    // Responsiveness (20%)
    const hasResponsiveGrid = await page.locator('[class*="lg:"], [class*="md:"], [class*="sm:"]').count() > 5;
    const hasResponsiveText = await page.locator('.text-3xl.lg\\:text-4xl, .sm\\:text-').count() > 0;
    const hasResponsiveSpacing = await page.locator('[class*="lg:gap-"], [class*="md:grid-"]').count() > 0;
    const hasFlexboxLayouts = await page.locator('.flex').count() >= 3;
    uxCriteria.responsiveness.score = 
      (hasResponsiveGrid ? 3 : 0) + 
      (hasResponsiveText ? 2 : 0) + 
      (hasResponsiveSpacing ? 3 : 0) + 
      (hasFlexboxLayouts ? 2 : 0);

    // Accessibility (15%)
    const images = await page.locator('img').count();
    const imagesWithAlt = await page.locator('img[alt]').count();
    const hasSemanticHTML = await page.locator('section, article, nav, main, header, footer').count() > 0;
    const hasAccessibleButtons = await page.locator('a[href], button[type]').count() >= 2;
    const altTextRatio = images > 0 ? (imagesWithAlt / images) : 1;
    uxCriteria.accessibility.score = 
      (altTextRatio * 4) + 
      (hasSemanticHTML ? 3 : 0) + 
      (hasAccessibleButtons ? 3 : 0);

    // Interactivity (15%)
    const hasHoverEffects = await page.locator('[class*="hover:"]').count() > 3;
    const hasAnimations = await page.locator('[class*="animate-"], [class*="transition-"]').count() > 2;
    const hasInteractiveElements = await page.locator('a[href], button').count() >= 2;
    const hasVisualFeedback = await page.locator('[class*="shadow-"], [class*="border-"]').count() > 5;
    uxCriteria.interactivity.score = 
      (hasHoverEffects ? 3 : 0) + 
      (hasAnimations ? 2 : 0) + 
      (hasInteractiveElements ? 3 : 0) + 
      (hasVisualFeedback ? 2 : 0);

    // Design Consistency (15%)
    const brandColorUsage = await page.locator('[class*="FFDA17"], [class*="#FFDA17"]').count();
    const consistentSpacing = await page.locator('[class*="p-"], [class*="gap-"], [class*="space-"]').count();
    const consistentShadows = await page.locator('[class*="shadow-"]').count();
    const consistentRounding = await page.locator('[class*="rounded-"]').count();
    uxCriteria.designConsistency.score = 
      (brandColorUsage >= 2 ? 3 : brandColorUsage > 0 ? 1 : 0) + 
      (consistentSpacing >= 10 ? 3 : consistentSpacing >= 5 ? 2 : 1) + 
      (consistentShadows >= 3 ? 2 : consistentShadows > 0 ? 1 : 0) + 
      (consistentRounding >= 5 ? 2 : consistentRounding > 0 ? 1 : 0);

    // Performance (15%)
    const startTime = Date.now();
    await page.locator('img').first().waitFor({ state: 'visible', timeout: 5000 });
    const loadTime = Date.now() - startTime;
    
    const hasOptimizedImages = await page.locator('img[loading], img[width][height]').count();
    const hasGradientBackgrounds = await page.locator('[class*="gradient-"]').count();
    
    const performanceScore = 
      (loadTime < 1000 ? 4 : loadTime < 2000 ? 3 : loadTime < 3000 ? 2 : 1) +
      (hasOptimizedImages > 0 ? 3 : 0) +
      (hasGradientBackgrounds > 0 ? 2 : 0) +
      1; // Base point for loading
    
    uxCriteria.performance.score = Math.min(performanceScore, 10);

    // Calculate weighted overall score
    let weightedTotal = 0;
    let maxWeightedTotal = 0;
    
    Object.entries(uxCriteria).forEach(([category, data]) => {
      const weightedScore = (data.score / data.maxScore) * data.weight;
      const maxWeightedScore = data.weight;
      weightedTotal += weightedScore;
      maxWeightedTotal += maxWeightedScore;
    });

    const overallRating = (weightedTotal / maxWeightedTotal) * 10;

    console.log('\n🎯 COMPREHENSIVE UX EVALUATION:');
    console.log('=================================');
    Object.entries(uxCriteria).forEach(([category, data]) => {
      const percentage = ((data.score / data.maxScore) * 100).toFixed(1);
      const weight = (data.weight * 100).toFixed(0);
      console.log(`${category}: ${data.score}/${data.maxScore} (${percentage}%) - Weight: ${weight}%`);
    });
    console.log('=================================');
    console.log(`🏆 OVERALL UX RATING: ${overallRating.toFixed(1)}/10`);
    console.log(`Load Time: ${loadTime}ms`);
    
    // Provide rating justification
    let ratingJustification = '';
    if (overallRating >= 9) {
      ratingJustification = 'EXCEPTIONAL - Outstanding UX with excellent implementation';
    } else if (overallRating >= 8) {
      ratingJustification = 'EXCELLENT - High-quality UX with strong implementation';
    } else if (overallRating >= 7) {
      ratingJustification = 'GOOD - Solid UX with room for minor improvements';
    } else if (overallRating >= 6) {
      ratingJustification = 'ACCEPTABLE - Adequate UX but needs enhancement';
    } else {
      ratingJustification = 'NEEDS IMPROVEMENT - Significant UX issues identified';
    }
    
    console.log(`📊 Rating Justification: ${ratingJustification}`);

    // Set expectations
    expect(overallRating).toBeGreaterThan(6.5); // Expect at least good UX quality
    
    return {
      overallRating,
      ratingJustification,
      criteria: uxCriteria,
      loadTime
    };
  });
});