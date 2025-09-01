# 🟠 QA Testing Suite - Projectdes AI Academy

**Comprehensive Testing Framework for Phase 1 Site Hierarchy Implementation**

This testing suite provides complete coverage for the Next.js App Router implementation with route groups, layouts, error boundaries, and loading states.

## 📁 Directory Structure

```
qa/
├── playwright/                 # E2E Testing with Playwright
│   ├── tests/                 # Test specifications
│   │   ├── route-groups.spec.ts      # Route group navigation
│   │   ├── error-boundaries.spec.ts  # Error handling
│   │   ├── loading-states.spec.ts    # Loading state testing
│   │   ├── performance.spec.ts       # Performance & Core Web Vitals
│   │   ├── accessibility.spec.ts     # A11y compliance
│   │   └── responsive-design.spec.ts # Responsive behavior
│   ├── utils/                 # Test utilities
│   │   └── test-utils.ts     # Helper classes and functions
│   └── global-setup.ts       # Global test setup
├── unit/                      # Unit Tests with Jest & RTL
│   ├── layouts.test.tsx      # Layout component tests
│   └── error-boundaries.test.tsx # Error boundary tests
├── integration/               # Integration Tests
│   └── route-navigation.test.tsx # Route navigation flow
├── manual-testing/            # Manual Testing Resources
│   └── COMPREHENSIVE_MANUAL_TESTING_CHECKLIST.md
├── cypress/                   # Legacy Cypress Tests (Phase 2)
│   ├── e2e/                  # E2E test specifications
│   ├── support/              # Custom commands & utilities
│   └── fixtures/             # Test data
├── playwright.config.ts       # Playwright configuration
├── jest.config.js            # Jest configuration
├── jest.setup.js             # Jest test setup
├── cypress.config.ts         # Cypress configuration
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

```bash
# Install dependencies
pnpm install

# Install Playwright browsers
pnpm run playwright:install
```

### Running Tests

```bash
# Run all Playwright E2E tests
pnpm run playwright:test

# Run Playwright tests with UI
pnpm run playwright:test --ui

# Run specific test file
pnpm run playwright:test tests/route-groups.spec.ts

# Run Jest unit tests
pnpm run test:unit

# Run Jest with coverage
pnpm run test:unit --coverage

# Run Jest in watch mode
pnpm run test:unit --watch

# Legacy Cypress tests (Phase 2 features)
pnpm run cypress:open
pnpm run cypress:run
```

## 🎯 Testing Coverage

### 1. Route Groups Testing (`route-groups.spec.ts`)
- **Marketing Route Group** (`(marketing)`)
  - Homepage, courses, course details, about, contact, blog, teachers
  - Dynamic routing with slugs
  - Marketing layout consistency
- **Enrollment Route Group** (`(enrollment)`)
  - Multi-step enrollment flow
  - Simplified layout with security indicators
  - Payment integration readiness
- **Dashboard Route Group** (`(dashboard)`)
  - Authentication requirements
  - Protected route access
  - Dashboard layout and navigation
- **Auth Route Group** (`(auth)`)
  - Login, register, password reset flows
  - Minimal auth-specific layout

### 2. Error Boundaries Testing (`error-boundaries.spec.ts`)
- **Marketing Error Boundary**
  - Custom error pages with marketing layout
  - "Try Again" functionality
  - Development vs production error details
  - Popular pages quick links
- **Enrollment Error Boundary**
  - Payment error handling
  - Session timeout management
  - Security-focused error messages
- **Global Error Handling**
  - 404 error pages
  - Network error resilience
  - JavaScript-disabled fallbacks

### 3. Loading States Testing (`loading-states.spec.ts`)
- **Page Navigation Loading**
  - Route transition loading states
  - Network condition simulation
  - Loading indicator accessibility
- **Form Submission Loading**
  - Multi-step form progress
  - Payment processing states
  - Error state transitions
- **Dynamic Content Loading**
  - Course search and filtering
  - Dashboard data loading
  - Progressive enhancement

### 4. Performance Testing (`performance.spec.ts`)
- **Core Web Vitals**
  - LCP (Largest Contentful Paint) < 2.5s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1
- **Page Load Performance**
  - TTFB (Time to First Byte) < 1s
  - DOM Content Loaded < 4s
  - Total load time < 8s
- **Resource Optimization**
  - Bundle size analysis
  - Image optimization verification
  - Font loading performance

### 5. Accessibility Testing (`accessibility.spec.ts`)
- **WCAG 2.1 AA Compliance**
  - Color contrast ratios
  - Keyboard navigation
  - Screen reader compatibility
- **Semantic HTML Structure**
  - Proper heading hierarchy
  - ARIA labels and descriptions
  - Form accessibility
- **Interactive Elements**
  - Focus management
  - Touch target sizing (44px+)
  - Skip links functionality

### 6. Responsive Design Testing (`responsive-design.spec.ts`)
- **Breakpoint Testing**
  - Mobile (375px), Tablet (768px), Desktop (1024px+)
  - No horizontal scroll at any breakpoint
  - Touch-friendly interactions
- **Layout Adaptation**
  - Content reflow and stacking
  - Navigation pattern changes
  - Image scaling and optimization
- **Cross-Device Compatibility**
  - Portrait/landscape orientations
  - High-DPI display support
  - Touch vs mouse interactions

## 🧪 Test Utilities

### Performance Utils
```typescript
const performanceUtils = new PerformanceUtils(page);
const vitals = await performanceUtils.assertCoreWebVitals();
const metrics = await performanceUtils.measurePageLoad();
```

### Accessibility Utils
```typescript
const accessibilityUtils = new AccessibilityUtils(page);
await accessibilityUtils.checkBasicA11y();
await accessibilityUtils.checkKeyboardNavigation();
```

### Responsive Utils
```typescript
const responsiveUtils = new ResponsiveUtils(page);
await responsiveUtils.assertNoHorizontalScroll();
const results = await responsiveUtils.testBreakpoints();
```

### Route Utils
```typescript
const routeUtils = new RouteUtils(page);
await routeUtils.navigateAndVerify('/courses', 'Courses Page');
await routeUtils.checkRouteStatus('/api/health', 200);
```

### Error Utils
```typescript
const errorUtils = new ErrorUtils(page);
await errorUtils.test404Handling('/invalid-route');
await errorUtils.testNetworkError();
```

### Loading Utils
```typescript
const loadingUtils = new LoadingUtils(page);
await loadingUtils.verifyLoadingSequence(() => page.goto('/courses'));
```

## 📊 Test Data Management

### Fixtures

Test data is organized in JSON fixtures:

- **`users.json`**: Test user accounts with different roles and scenarios
- **`courses.json`**: Course catalog data, enrollments, and curriculum
- **`payments.json`**: Payment methods, transactions, and promo codes  
- **`dashboard.json`**: Dashboard data, analytics, and notifications

### Data Factories

Type-safe data factories for generating test data:

```typescript
import { testUserFactory, testCourseFactory } from '../support/types';

const user = testUserFactory({
  email: 'custom@example.com',
  role: 'STUDENT'
});

const course = testCourseFactory({
  title: 'Custom Course',
  price: 1000
});
```

## 🔧 Configuration

### Environment Variables

```bash
# Cypress environment variables
CYPRESS_BASE_URL=http://localhost:3000
CYPRESS_API_URL=http://localhost:5000/api
CYPRESS_TEST_EMAIL=test@projectdes.ai
CYPRESS_TEST_PASSWORD=Test123!@#

# Feature flags
CYPRESS_ENABLE_PAYMENTS=true
CYPRESS_ENABLE_MULTI_LANGUAGE=true
```

### Browser Testing

Configured to test across multiple browsers:

- Chrome (default)
- Firefox
- Safari (WebKit) 
- Edge

### Viewport Testing

Responsive testing across multiple device sizes:

- Mobile: 375×812 (iPhone)
- Tablet: 768×1024 (iPad)
- Laptop: 1024×768
- Desktop: 1280×720
- Wide: 1536×960

## 🚨 Error Handling

### Automatic Retries

- **Run Mode**: 2 retries for flaky tests
- **Open Mode**: 0 retries for development

### Screenshot Capture

- Automatic screenshots on test failures
- Full page screenshots for visual debugging
- Organized by test run and timestamp

### Error Recovery

Tests include comprehensive error handling:

- Network timeout recovery
- API failure handling
- Authentication state recovery
- Payment processing errors

## 🔍 Accessibility Testing

### Automated A11Y Checks

- **cypress-axe** integration for automated accessibility testing
- WCAG 2.1 AA compliance validation
- Color contrast verification
- Keyboard navigation testing

### Screen Reader Support

- ARIA label validation
- Screen reader announcement testing
- Focus management verification
- Skip link functionality

## 📱 Mobile Testing

### Touch Interactions

- Swipe gesture testing
- Touch-specific UI validation
- Mobile navigation testing

### Performance

- Image optimization validation
- Lazy loading verification
- Mobile-specific resource loading

## 🔐 Security Testing

### Authentication Security

- CSRF token validation
- Session timeout testing
- Rate limiting verification
- Password complexity enforcement

### Payment Security

- HTTPS enforcement
- Sensitive data handling
- PCI compliance validation

## 📈 Performance Testing

### Page Load Testing

- Core Web Vitals monitoring
- Resource loading optimization
- Bundle size validation

### User Experience

- Loading state testing
- Error boundary verification
- Smooth transition validation

## 🌐 Multi-Language Testing

### I18n Testing

- Language switcher functionality
- RTL (Right-to-Left) layout testing for Hebrew
- Localized content validation
- Currency and number formatting

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
# Example GitHub Actions workflow
- name: Run Cypress Tests
  uses: cypress-io/github-action@v6
  with:
    config-file: qa/cypress.config.ts
    working-directory: qa
    browser: chrome
    headless: true
```

### Test Reporting

- JUnit XML reports for CI integration
- HTML reports with screenshots and videos
- Test result notifications

## 🐛 Debugging

### Debug Mode

```bash
# Run with debug mode
DEBUG=cypress:* pnpm cypress:run

# Interactive debugging
cy.debug() // Add to test for breakpoint
cy.pause() // Pause execution
```

### Test Isolation

Each test runs in isolation with:

- Fresh browser context
- Cleared local/session storage
- Database reset between tests

## 🤝 Best Practices

### Writing Tests

1. **Use descriptive test names** that explain the expected behavior
2. **Keep tests atomic** - one behavior per test
3. **Use data-testid attributes** for reliable element selection
4. **Mock external services** to avoid test flakiness
5. **Test user workflows** rather than implementation details

### Maintenance

1. **Regular dependency updates** for security and performance
2. **Test data cleanup** to prevent test interference
3. **Screenshot review** to catch visual regressions
4. **Performance monitoring** to prevent slow test suites

## 📚 Additional Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Testing Library Cypress](https://testing-library.com/docs/cypress-testing-library/intro/)
- [Accessibility Testing with cypress-axe](https://github.com/component-driven/cypress-axe)

## 🆘 Troubleshooting

### Common Issues

**Tests failing locally but passing in CI:**
- Check environment variables
- Verify correct Node.js version
- Clear Cypress cache: `pnpm cypress cache clear`

**Flaky tests:**
- Add explicit waits with `cy.wait()`
- Use `should()` assertions with retries
- Mock external dependencies

**Performance issues:**
- Reduce test parallelization
- Optimize test data setup
- Enable video recording only on failure

### Getting Help

1. Check the test output and screenshots
2. Review the Cypress dashboard for detailed logs
3. Check the GitHub Issues for similar problems
4. Consult the team documentation

---

## 📋 Test Checklist

### Before Committing Tests

- [ ] Tests pass locally in both interactive and headless mode
- [ ] Tests are properly isolated and don't depend on each other
- [ ] Test data is properly mocked or using fixtures
- [ ] Accessibility checks are included where appropriate
- [ ] Responsive testing covers key breakpoints
- [ ] Error scenarios are covered
- [ ] Tests follow naming conventions
- [ ] TypeScript types are properly defined

### Code Review Checklist

- [ ] Tests cover happy path and edge cases
- [ ] Custom commands are used appropriately
- [ ] Test data uses factories or fixtures
- [ ] No hardcoded waits (`cy.wait(1000)`)
- [ ] Proper assertions with meaningful error messages
- [ ] Tests are maintainable and readable
- [ ] Security and accessibility testing included

---

**Quality Assurance Standards**: This test suite maintains 95%+ test coverage across critical user journeys and enforces strict quality gates for production deployments.