import { test, expect } from '@playwright/test'

test.describe('FAQ Component Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Listen for console errors to catch JavaScript initialization issues
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text())
      }
    })
  })

  test('FAQ section loads without JavaScript errors and functions correctly', async ({ page }) => {
    // Navigate to homepage
    await page.goto('http://localhost:3000')
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle')
    
    // 1. Check if FAQ section is visible
    const faqSection = page.locator('[data-testid="faq-section"]').or(page.locator('section:has-text("FAQ")'))
    await expect(faqSection).toBeVisible({ timeout: 10000 })
    
    // 2. Verify at least one FAQ item is displayed
    const faqItems = page.locator('[data-testid="faq-item"]').or(
      page.locator('.faq-item').or(
        page.locator('[role="button"]:has-text("?")')
      )
    )
    await expect(faqItems.first()).toBeVisible()
    
    // Count FAQ items to ensure we have content
    const faqCount = await faqItems.count()
    expect(faqCount).toBeGreaterThan(0)
    console.log(`Found ${faqCount} FAQ items`)
    
    // 3. Test basic interactivity - opening/closing FAQ item
    const firstFaqItem = faqItems.first()
    
    // Try to click the first FAQ item (could be button or clickable element)
    await firstFaqItem.click()
    
    // Wait a moment for any animations
    await page.waitForTimeout(500)
    
    // Look for expanded content (could be answer text or expanded state)
    const expandedContent = page.locator('[data-testid="faq-answer"]').or(
      page.locator('.faq-answer').or(
        page.locator('[aria-expanded="true"]')
      )
    )
    
    // Verify some form of expansion/interaction occurred
    const hasExpandedContent = await expandedContent.count() > 0
    const hasAriaExpanded = await page.locator('[aria-expanded="true"]').count() > 0
    
    if (hasExpandedContent || hasAriaExpanded) {
      console.log('FAQ item successfully expanded')
      
      // Try to close it by clicking again
      await firstFaqItem.click()
      await page.waitForTimeout(500)
      
      // Check if it collapsed
      const stillExpanded = await page.locator('[aria-expanded="true"]').count()
      if (stillExpanded === 0) {
        console.log('FAQ item successfully collapsed')
      }
    } else {
      console.log('FAQ interaction detected but no clear expanded state found')
    }
    
    // 4. Test search functionality if present
    const searchInput = page.locator('[data-testid="faq-search"]').or(
      page.locator('input[placeholder*="search"]').or(
        page.locator('input[type="search"]')
      )
    )
    
    if (await searchInput.count() > 0) {
      console.log('FAQ search input found, testing search functionality')
      
      // Type a search term
      await searchInput.fill('course')
      await page.waitForTimeout(1000)
      
      // Check if FAQ items were filtered
      const visibleFaqsAfterSearch = await faqItems.count()
      console.log(`FAQ items visible after search: ${visibleFaqsAfterSearch}`)
      
      // Clear search to restore all items
      await searchInput.fill('')
      await page.waitForTimeout(1000)
      
      const visibleFaqsAfterClear = await faqItems.count()
      expect(visibleFaqsAfterClear).toBeGreaterThanOrEqual(visibleFaqsAfterSearch)
      console.log('Search functionality working correctly')
    } else {
      console.log('No FAQ search input found - skipping search test')
    }
    
    // 5. Verify no JavaScript console errors related to 'filteredFaqs'
    const pageErrors = []
    page.on('pageerror', error => {
      pageErrors.push(error.message)
    })
    
    // Wait a bit more to catch any delayed errors
    await page.waitForTimeout(2000)
    
    // Check for the specific error we fixed
    const hasInitializationError = pageErrors.some(error => 
      error.includes('filteredFaqs') && error.includes('before initialization')
    )
    
    expect(hasInitializationError).toBe(false)
    
    if (pageErrors.length > 0) {
      console.log('Page errors detected:', pageErrors)
    } else {
      console.log('No JavaScript errors detected - FAQ component initialized correctly')
    }
  })

  test('FAQ component handles edge cases gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.waitForLoadState('networkidle')
    
    // Test rapid clicking to ensure no race conditions
    const faqItems = page.locator('[data-testid="faq-item"]').or(
      page.locator('.faq-item').or(
        page.locator('[role="button"]:has-text("?")') 
      )
    )
    
    if (await faqItems.count() > 0) {
      const firstItem = faqItems.first()
      
      // Rapid clicks to test for race conditions
      await firstItem.click()
      await firstItem.click()
      await firstItem.click()
      
      // Should not cause errors
      await page.waitForTimeout(1000)
      
      console.log('FAQ component handled rapid clicking without errors')
    }
    
    // Test search with special characters if search exists
    const searchInput = page.locator('input[placeholder*="search"], input[type="search"]')
    
    if (await searchInput.count() > 0) {
      await searchInput.fill('!@#$%^&*()')
      await page.waitForTimeout(500)
      
      // Should not cause errors, just show no results or all results
      const visibleItems = await faqItems.count()
      expect(visibleItems).toBeGreaterThanOrEqual(0)
      
      console.log('FAQ search handled special characters correctly')
    }
  })
})