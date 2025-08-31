/**
 * Production Smoke Tests for Projectdes AI Academy
 * =================================================
 * 
 * Critical path testing for production deployment validation
 */

describe('Production Smoke Tests', () => {
  const baseUrl = Cypress.config('baseUrl') || 'https://projectdes.ai';
  const apiUrl = Cypress.env('API_URL') || 'https://api.projectdes.ai';

  // Test user credentials (should be set in environment)
  const testUser = {
    email: Cypress.env('TEST_USER_EMAIL') || 'test@projectdes.ai',
    password: Cypress.env('TEST_USER_PASSWORD') || 'Test123!@#',
    name: 'Test User',
  };

  // Helper function to check response times
  const checkResponseTime = (startTime: number, maxTime: number = 3000) => {
    const responseTime = Date.now() - startTime;
    expect(responseTime).to.be.lessThan(maxTime);
    return responseTime;
  };

  describe('🌐 Public Pages Accessibility', () => {
    it('should load homepage within 3 seconds', () => {
      const startTime = Date.now();
      
      cy.visit('/', {
        onBeforeLoad: (win) => {
          // Check for console errors
          cy.spy(win.console, 'error');
        },
      });
      
      // Check page loaded
      cy.get('h1').should('be.visible');
      
      // Check response time
      const responseTime = checkResponseTime(startTime);
      cy.log(`Homepage loaded in ${responseTime}ms`);
      
      // Check for console errors
      cy.window().then((win) => {
        expect(win.console.error).to.not.have.been.called;
      });
      
      // Check critical elements
      cy.get('header').should('be.visible');
      cy.get('footer').should('be.visible');
      cy.get('[data-testid="hero-section"]').should('be.visible');
      
      // Check language switcher
      cy.get('[data-testid="language-switcher"]').should('be.visible');
      
      // Check navigation links
      cy.get('nav a[href="/programs"]').should('be.visible');
      cy.get('nav a[href="/about"]').should('be.visible');
      cy.get('nav a[href="/contact"]').should('be.visible');
    });

    it('should load programs page with course listings', () => {
      cy.visit('/programs');
      
      // Check page title
      cy.title().should('include', 'Programs');
      
      // Check courses are displayed
      cy.get('[data-testid="course-card"]').should('have.length.at.least', 1);
      
      // Check course information
      cy.get('[data-testid="course-card"]').first().within(() => {
        cy.get('[data-testid="course-title"]').should('be.visible');
        cy.get('[data-testid="course-price"]').should('be.visible');
        cy.get('[data-testid="course-duration"]').should('be.visible');
        cy.get('[data-testid="enroll-button"]').should('be.visible');
      });
      
      // Check filters work
      cy.get('[data-testid="category-filter"]').should('be.visible');
    });

    it('should load course detail page', () => {
      cy.visit('/programs/ai-manager');
      
      // Check course details
      cy.get('h1').should('contain', 'AI');
      cy.get('[data-testid="course-description"]').should('be.visible');
      cy.get('[data-testid="course-curriculum"]').should('be.visible');
      cy.get('[data-testid="course-price"]').should('be.visible');
      cy.get('[data-testid="enroll-button"]').should('be.visible');
      
      // Check instructor info
      cy.get('[data-testid="instructor-info"]').should('be.visible');
    });

    it('should load about page', () => {
      cy.visit('/about');
      
      cy.get('h1').should('be.visible');
      cy.contains('mission', { matchCase: false }).should('be.visible');
      cy.get('[data-testid="team-section"]').should('be.visible');
    });

    it('should load contact page with form', () => {
      cy.visit('/contact');
      
      // Check contact form
      cy.get('form[data-testid="contact-form"]').should('be.visible');
      cy.get('input[name="name"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('textarea[name="message"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
      
      // Check contact information
      cy.get('[data-testid="contact-info"]').should('be.visible');
    });
  });

  describe('🔐 Authentication Flow', () => {
    it('should allow user registration', () => {
      const uniqueEmail = `test${Date.now()}@projectdes.ai`;
      
      cy.visit('/auth/register');
      
      // Fill registration form
      cy.get('input[name="firstName"]').type('Test');
      cy.get('input[name="lastName"]').type('User');
      cy.get('input[name="email"]').type(uniqueEmail);
      cy.get('input[name="password"]').type(testUser.password);
      cy.get('input[name="confirmPassword"]').type(testUser.password);
      
      // Accept terms
      cy.get('input[type="checkbox"][name="terms"]').check();
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      // Check for success (redirect or message)
      cy.url().should('not.include', '/register');
      
      // Check user is logged in
      cy.getCookie('token').should('exist');
    });

    it('should allow user login', () => {
      cy.visit('/auth/login');
      
      // Fill login form
      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="password"]').type(testUser.password);
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      // Check redirect to dashboard
      cy.url().should('include', '/dashboard');
      
      // Check user info is displayed
      cy.get('[data-testid="user-menu"]').should('be.visible');
    });

    it('should handle password reset flow', () => {
      cy.visit('/auth/forgot-password');
      
      // Enter email
      cy.get('input[name="email"]').type(testUser.email);
      cy.get('button[type="submit"]').click();
      
      // Check for success message
      cy.contains('reset link has been sent', { matchCase: false }).should('be.visible');
    });

    it('should handle logout', () => {
      // First login
      cy.login(testUser.email, testUser.password);
      
      // Then logout
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="logout-button"]').click();
      
      // Check redirect to home
      cy.url().should('eq', `${baseUrl}/`);
      
      // Check cookie is removed
      cy.getCookie('token').should('not.exist');
    });
  });

  describe('🛍️ Course Enrollment & Payment', () => {
    beforeEach(() => {
      cy.login(testUser.email, testUser.password);
    });

    it('should allow course enrollment', () => {
      cy.visit('/programs/ai-manager');
      
      // Click enroll button
      cy.get('[data-testid="enroll-button"]').click();
      
      // Should redirect to checkout
      cy.url().should('include', '/checkout');
      
      // Check course details in checkout
      cy.get('[data-testid="checkout-course-name"]').should('be.visible');
      cy.get('[data-testid="checkout-price"]').should('be.visible');
    });

    it('should process Stripe payment', () => {
      cy.visit('/checkout?course=ai-manager');
      
      // Select Stripe payment
      cy.get('[data-testid="payment-method-stripe"]').click();
      
      // Fill payment details (using Stripe test card)
      cy.get('iframe[name*="stripe"]').then($iframe => {
        const doc = $iframe.contents();
        
        // Fill card number
        cy.wrap(doc.find('input[name="cardnumber"]'))
          .type('4242424242424242');
        
        // Fill expiry
        cy.wrap(doc.find('input[name="exp-date"]'))
          .type('1225');
        
        // Fill CVC
        cy.wrap(doc.find('input[name="cvc"]'))
          .type('123');
        
        // Fill ZIP
        cy.wrap(doc.find('input[name="postal"]'))
          .type('12345');
      });
      
      // Submit payment
      cy.get('[data-testid="submit-payment"]').click();
      
      // Check for success
      cy.url().should('include', '/payment/success', { timeout: 10000 });
      cy.contains('Payment successful', { matchCase: false }).should('be.visible');
    });

    it('should handle PayPal payment', () => {
      cy.visit('/checkout?course=ai-manager');
      
      // Select PayPal payment
      cy.get('[data-testid="payment-method-paypal"]').click();
      
      // Click PayPal button
      cy.get('[data-testid="paypal-button"]').click();
      
      // Note: Can't fully test PayPal in E2E, just check redirect
      cy.url().should('include', 'paypal.com');
    });
  });

  describe('📚 Dashboard & Learning Platform', () => {
    beforeEach(() => {
      cy.login(testUser.email, testUser.password);
    });

    it('should display user dashboard', () => {
      cy.visit('/dashboard');
      
      // Check dashboard elements
      cy.get('[data-testid="dashboard-stats"]').should('be.visible');
      cy.get('[data-testid="enrolled-courses"]').should('be.visible');
      cy.get('[data-testid="recent-activity"]').should('be.visible');
      
      // Check user info
      cy.get('[data-testid="user-name"]').should('contain', testUser.name);
    });

    it('should show enrolled courses', () => {
      cy.visit('/dashboard/courses');
      
      // Check courses list
      cy.get('[data-testid="course-list"]').should('be.visible');
      
      // If user has courses
      cy.get('body').then($body => {
        if ($body.find('[data-testid="enrolled-course"]').length > 0) {
          cy.get('[data-testid="enrolled-course"]').first().within(() => {
            cy.get('[data-testid="course-progress"]').should('be.visible');
            cy.get('[data-testid="continue-button"]').should('be.visible');
          });
        } else {
          cy.contains('No courses enrolled', { matchCase: false }).should('be.visible');
        }
      });
    });

    it('should allow profile updates', () => {
      cy.visit('/settings/profile');
      
      // Update profile
      cy.get('input[name="firstName"]').clear().type('Updated');
      cy.get('input[name="lastName"]').clear().type('Name');
      
      // Save changes
      cy.get('[data-testid="save-profile"]').click();
      
      // Check for success message
      cy.contains('Profile updated', { matchCase: false }).should('be.visible');
    });
  });

  describe('🌍 Internationalization', () => {
    it('should switch to Russian language', () => {
      cy.visit('/');
      
      // Switch to Russian
      cy.get('[data-testid="language-switcher"]').click();
      cy.get('[data-testid="language-ru"]').click();
      
      // Check URL changed
      cy.url().should('include', '/ru');
      
      // Check content is in Russian
      cy.get('html').should('have.attr', 'lang', 'ru');
    });

    it('should switch to Hebrew with RTL', () => {
      cy.visit('/');
      
      // Switch to Hebrew
      cy.get('[data-testid="language-switcher"]').click();
      cy.get('[data-testid="language-he"]').click();
      
      // Check URL changed
      cy.url().should('include', '/he');
      
      // Check RTL is applied
      cy.get('html').should('have.attr', 'dir', 'rtl');
      cy.get('html').should('have.attr', 'lang', 'he');
    });
  });

  describe('📱 Mobile Responsiveness', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
    });

    it('should display mobile menu', () => {
      cy.visit('/');
      
      // Check mobile menu button
      cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
      
      // Open mobile menu
      cy.get('[data-testid="mobile-menu-button"]').click();
      
      // Check menu items
      cy.get('[data-testid="mobile-menu"]').should('be.visible');
      cy.get('[data-testid="mobile-menu"] a').should('have.length.at.least', 3);
    });

    it('should handle mobile course browsing', () => {
      cy.visit('/programs');
      
      // Check courses are displayed in mobile layout
      cy.get('[data-testid="course-card"]').should('be.visible');
      
      // Check filters are accessible
      cy.get('[data-testid="mobile-filter-button"]').click();
      cy.get('[data-testid="filter-menu"]').should('be.visible');
    });
  });

  describe('♿ Accessibility', () => {
    it('should have proper ARIA labels', () => {
      cy.visit('/');
      
      // Check main navigation
      cy.get('nav').should('have.attr', 'aria-label');
      
      // Check buttons have accessible text
      cy.get('button').each($button => {
        expect($button).to.have.attr('aria-label')
          .or.to.contain.text;
      });
      
      // Check images have alt text
      cy.get('img').each($img => {
        expect($img).to.have.attr('alt');
      });
    });

    it('should support keyboard navigation', () => {
      cy.visit('/');
      
      // Tab through navigation
      cy.get('body').tab();
      cy.focused().should('have.attr', 'href');
      
      // Tab to buttons
      cy.tab().tab().tab();
      cy.focused().should('match', 'button, a');
    });
  });

  describe('🔍 SEO & Meta Tags', () => {
    it('should have proper meta tags', () => {
      cy.visit('/');
      
      // Check title
      cy.title().should('include', 'Projectdes AI Academy');
      
      // Check meta description
      cy.get('meta[name="description"]').should('have.attr', 'content');
      
      // Check Open Graph tags
      cy.get('meta[property="og:title"]').should('have.attr', 'content');
      cy.get('meta[property="og:description"]').should('have.attr', 'content');
      cy.get('meta[property="og:image"]').should('have.attr', 'content');
      
      // Check Twitter Card
      cy.get('meta[name="twitter:card"]').should('have.attr', 'content');
    });

    it('should have sitemap accessible', () => {
      cy.request('/sitemap.xml').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers['content-type']).to.include('xml');
      });
    });

    it('should have robots.txt accessible', () => {
      cy.request('/robots.txt').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.include('User-agent');
        expect(response.body).to.include('Sitemap');
      });
    });
  });

  describe('⚡ Performance', () => {
    it('should load within performance budget', () => {
      cy.visit('/', {
        onBeforeLoad: (win) => {
          win.performance.mark('pageStart');
        },
        onLoad: (win) => {
          win.performance.mark('pageEnd');
          win.performance.measure('pageLoad', 'pageStart', 'pageEnd');
          const measure = win.performance.getEntriesByName('pageLoad')[0];
          
          // Check load time is under 3 seconds
          expect(measure.duration).to.be.lessThan(3000);
        },
      });
    });

    it('should have optimized images', () => {
      cy.visit('/');
      
      cy.get('img').each($img => {
        // Check images have loading attribute
        expect($img).to.have.attr('loading');
        
        // Check images use next/image optimization
        const src = $img.attr('src');
        if (src && !src.startsWith('data:')) {
          expect(src).to.include('/_next/image');
        }
      });
    });
  });

  describe('🛡️ Security', () => {
    it('should have security headers', () => {
      cy.request('/').then((response) => {
        // Check security headers
        expect(response.headers).to.have.property('x-frame-options');
        expect(response.headers).to.have.property('x-content-type-options');
        expect(response.headers).to.have.property('strict-transport-security');
      });
    });

    it('should enforce HTTPS', () => {
      // Check that HTTP redirects to HTTPS
      if (baseUrl.includes('https://')) {
        const httpUrl = baseUrl.replace('https://', 'http://');
        cy.request({
          url: httpUrl,
          followRedirect: false,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.be.oneOf([301, 302, 307, 308]);
          expect(response.headers.location).to.include('https://');
        });
      }
    });
  });

  describe('🔔 API Health Checks', () => {
    it('should have API health endpoint', () => {
      cy.request(`${apiUrl}/health`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('status', 'healthy');
      });
    });

    it('should have database connectivity', () => {
      cy.request(`${apiUrl}/health/db`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('database', 'connected');
      });
    });

    it('should have Redis connectivity', () => {
      cy.request(`${apiUrl}/health/redis`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('redis', 'connected');
      });
    });
  });
});

// Custom commands for smoke tests
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/auth/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});

// Export types
export {};