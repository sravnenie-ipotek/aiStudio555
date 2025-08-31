# Projectdes AI Academy - E2E Testing Suite

Comprehensive End-to-End testing suite for the Projectdes AI Academy platform using Cypress and Playwright.

## 🧪 Test Structure

```
/qa
├── cypress/
│   ├── e2e/                    # E2E test specifications
│   │   ├── auth.cy.ts         # Authentication flows
│   │   ├── courses.cy.ts      # Course browsing & enrollment
│   │   ├── payment.cy.ts      # Payment processing
│   │   └── dashboard.cy.ts    # Dashboard functionality
│   ├── support/               # Custom commands & utilities
│   │   ├── e2e.ts            # Global configuration
│   │   ├── commands.ts       # Custom Cypress commands
│   │   └── types.ts          # TypeScript type definitions
│   ├── fixtures/             # Test data
│   │   ├── users.json        # User test data
│   │   ├── courses.json      # Course test data
│   │   ├── payments.json     # Payment test data
│   │   └── dashboard.json    # Dashboard test data
│   └── screenshots/          # Test failure screenshots
└── cypress.config.ts         # Cypress configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm package manager
- Test environment running locally

### Installation

```bash
cd qa
pnpm install
```

### Running Tests

```bash
# Interactive mode (development)
pnpm cypress:open

# Headless mode (CI/CD)
pnpm cypress:run

# Specific test file
pnpm cypress:run --spec "cypress/e2e/auth.cy.ts"

# Specific browser
pnpm cypress:run --browser chrome
```

## 🧩 Test Categories

### Authentication Tests (`auth.cy.ts`)

**Coverage:**
- ✅ User registration (valid/invalid data, email verification)
- ✅ User login (credentials, 2FA, OAuth, rate limiting)
- ✅ Password reset flow (request, validation, confirmation)
- ✅ Session management (timeout, refresh, concurrent sessions)
- ✅ Logout functionality (single device, all devices)
- ✅ Security features (suspicious activity, password complexity)

**Key Features:**
- Comprehensive form validation testing
- Multi-language support testing
- Responsive design validation
- Accessibility compliance checks
- Rate limiting and security testing

### Course Tests (`courses.cy.ts`)

**Coverage:**
- ✅ Course catalog browsing and filtering
- ✅ Course search functionality
- ✅ Course detail pages and curriculum
- ✅ Course enrollment flows
- ✅ Prerequisites and capacity handling
- ✅ Course comparison features
- ✅ Categories and recommendations

**Key Features:**
- Advanced filtering and search testing
- Enrollment prerequisite validation
- Course capacity and waitlist management
- Multi-language course support
- Responsive course catalog testing

### Payment Tests (`payment.cy.ts`)

**Coverage:**
- ✅ Stripe payment processing (success, failure, 3D Secure)
- ✅ PayPal payment integration
- ✅ Billing information validation
- ✅ Promo codes and discounts
- ✅ International payment support
- ✅ Payment security and error handling

**Key Features:**
- Multiple payment method testing
- Payment failure scenarios
- Currency conversion testing
- Security validation (HTTPS, CSRF tokens)
- Analytics event tracking

### Dashboard Tests (`dashboard.cy.ts`)

**Coverage:**
- ✅ Dashboard overview and statistics
- ✅ Course progress tracking
- ✅ Learning analytics and achievements
- ✅ Notifications and activity feeds
- ✅ Dashboard customization
- ✅ Search and filtering capabilities

**Key Features:**
- Real-time progress tracking
- Interactive analytics dashboards
- Notification system testing
- Performance and loading state testing
- Mobile-responsive dashboard testing

## 🛠 Custom Commands

### Authentication Commands

```typescript
// Login with default or custom credentials
cy.login(email?, password?)

// Login as specific user type
cy.loginAs('student' | 'instructor' | 'admin')

// Register new user
cy.register(userData)

// Logout current user
cy.logout()
```

### Course Commands

```typescript
// Enroll in a course
cy.enrollInCourse(courseId)

// Create test course
cy.createTestCourse(courseData)
```

### Payment Commands

```typescript
// Mock Stripe payment
cy.mockStripePayment()

// Mock PayPal payment
cy.mockPayPalPayment()

// Complete payment flow
cy.completePayment('stripe' | 'paypal')
```

### Utility Commands

```typescript
// Find elements by test ID
cy.getByTestId(testId)

// Check accessibility
cy.checkAccessibility()

// Test responsive design
cy.testResponsiveness()

// Switch languages
cy.switchLanguage('en' | 'ru' | 'he')
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