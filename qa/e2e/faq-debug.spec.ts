import { test, expect } from '@playwright/test'

test.describe('FAQ Component Debug', () => {
  test('inspect FAQ section structure', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.waitForLoadState('networkidle')
    
    // Take a screenshot to see what's on the page
    await page.screenshot({ path: 'faq-debug-full-page.png', fullPage: true })
    
    // Look for FAQ section with various selectors
    const faqSelectors = [
      'section:has-text("FAQ")',
      '[data-testid="faq-section"]',
      '.faq-section',
      'section:has-text("Frequently")',
      'section:has-text("Questions")',
      '[id*="faq"]',
      '[class*="faq"]'
    ]
    
    console.log('Searching for FAQ section with various selectors:')
    for (const selector of faqSelectors) {
      const element = page.locator(selector)
      const count = await element.count()
      console.log(`${selector}: ${count} elements found`)
      
      if (count > 0) {
        // Get the text content to understand what we found
        const textContent = await element.first().textContent()
        console.log(`Content preview: ${textContent?.substring(0, 200)}...`)
      }
    }
    
    // Look for any accordion-like structures
    const accordionSelectors = [
      '[role="button"]',
      '.accordion',
      '[data-accordion]',
      '.collapse',
      '.expandable',
      'button:has-text("?")',
      'div[class*="faq"]',
      'button[aria-expanded]'
    ]
    
    console.log('\nSearching for accordion/FAQ items:')
    for (const selector of accordionSelectors) {
      const elements = page.locator(selector)
      const count = await elements.count()
      console.log(`${selector}: ${count} elements found`)
      
      if (count > 0 && count < 20) { // Avoid logging too many generic elements
        for (let i = 0; i < Math.min(count, 3); i++) {
          const text = await elements.nth(i).textContent()
          console.log(`  Item ${i}: ${text?.substring(0, 100)}...`)
        }
      }
    }
    
    // Get all sections on the page to understand the structure
    const sections = page.locator('section')
    const sectionCount = await sections.count()
    console.log(`\nFound ${sectionCount} sections on the page:`)
    
    for (let i = 0; i < Math.min(sectionCount, 10); i++) {
      const sectionText = await sections.nth(i).textContent()
      const preview = sectionText?.substring(0, 150).replace(/\s+/g, ' ').trim()
      console.log(`Section ${i}: ${preview}...`)
    }
    
    // Check for any JavaScript errors in console
    const logs: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(msg.text())
      }
    })
    
    await page.waitForTimeout(3000)
    
    if (logs.length > 0) {
      console.log('\nJavaScript errors found:')
      logs.forEach(log => console.log(`- ${log}`))
    } else {
      console.log('\nNo JavaScript errors detected')
    }
  })
})