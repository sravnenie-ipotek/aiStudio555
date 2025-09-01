# AiStudio555 AI Academy - Technical Specifications

**Developer Implementation Guide**  
**Version:** 2.0 | **Date:** December 2024

---

## 🛠️ **Technology Stack**

### **Frontend**

- **HTML5**: Semantic markup, accessibility standards
- **CSS3**: Grid/Flexbox layouts, custom properties
- **JavaScript (ES6+)**: Modern syntax, modules, async/await
- **No Framework**: Vanilla JS for performance and simplicity

### **Styling Architecture**

```
css/
├── teachmeskills-typography.css    (Font system)
├── typography-overrides.css        (Critical font fixes)
├── modern-ui-fixes.css            (Professional UI patterns)
├── teachmeskills-complete.css     (Main styles)
├── promotional-banner.css         (Marketing banners)
├── modern-chips.css              (Course tags system)
├── course-card-fixes.css         (Card interactions)
└── rtl.css                       (Hebrew RTL support)
```

### **JavaScript Modules**

```
js/
├── course-interactions.js        (Payment & enrollment)
├── i18n.js                      (Internationalization)
├── animations.js                (UI interactions)
├── analytics.js                 (Tracking & events)
└── form-handling.js            (Contact & booking forms)
```

---

## 🎨 **Design System Specifications**

### **Color Palette**

```css
:root {
  /* Primary Colors */
  --primary-blue: #635bff;
  --primary-blue-hover: #5849e6;
  --primary-blue-light: rgba(99, 91, 255, 0.1);

  /* Neutral System */
  --bg-primary: #f8fafc; /* Light blue-gray */
  --bg-secondary: #f1f5f9; /* Lighter gray */
  --bg-surface: #ffffff; /* Pure white */
  --bg-dark: #0f172a; /* Dark slate */

  /* Text Hierarchy */
  --text-primary: #1e293b; /* Dark slate */
  --text-secondary: #64748b; /* Medium gray */
  --text-muted: #94a3b8; /* Light gray */
  --text-white: #ffffff;

  /* UI Elements */
  --border-light: #e2e8f0;
  --border-medium: #cbd5e1;
  --success-green: #10b981;
  --warning-red: #ef4444;
}
```

### **Typography Scale**

```css
/* Rubik Font System - Weights: 400, 600, 700 */
.heading-xxl {
  font-size: 40px;
  font-weight: 700;
  line-height: 0.95;
}
.heading-xl {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
}
.heading-lg {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
}
.body-text {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.45;
}
.nav-link {
  font-size: 21px;
  font-weight: 600;
  line-height: 1.2;
}
.btn-text {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
}
```

### **Spacing System (8px base unit)**

```css
:root {
  --space-1: 4px; /* 0.5 units */
  --space-2: 8px; /* 1 unit */
  --space-3: 12px; /* 1.5 units */
  --space-4: 16px; /* 2 units */
  --space-6: 24px; /* 3 units */
  --space-8: 32px; /* 4 units */
  --space-12: 48px; /* 6 units */
  --space-16: 64px; /* 8 units */
}
```

---

## 📱 **Responsive Design Standards**

### **Breakpoint System**

```css
/* Mobile First Approach */
/* Base: 320px - 639px (Mobile) */

@media (min-width: 640px) {
  /* Small tablet */
}

@media (min-width: 768px) {
  /* Tablet */
}

@media (min-width: 1024px) {
  /* Desktop */
}

@media (min-width: 1280px) {
  /* Large desktop */
}
```

### **Container System**

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--space-8);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 var(--space-12);
  }
}
```

### **Grid System**

```css
.grid {
  display: grid;
  gap: var(--space-6);
}

.grid-2 {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

@media (max-width: 640px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
```

---

## 🧩 **Component Specifications**

### **Navigation Header**

```css
.header {
  height: 72px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 var(--space-8);
}

.nav-logo {
  max-width: 160px;
  max-height: 40px;
  margin-right: var(--space-16);
}

.nav-menu {
  display: flex;
  gap: var(--space-8);
  list-style: none;
}
```

### **Course Cards**

```css
.course-card {
  background: var(--bg-surface);
  border-radius: 12px;
  padding: var(--space-8);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-light);
  transition: all 0.2s ease;
}

.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px -5px rgba(0, 0, 0, 0.15);
}
```

### **Chip System**

```css
.chip {
  padding: var(--space-1) var(--space-3);
  border-radius: 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
}

.chip-duration {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.25);
}

.chip-format {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: white;
}

.chip-level {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  color: white;
}
```

### **Button System**

```css
.btn {
  padding: var(--space-3) var(--space-6);
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.btn-primary {
  background: var(--primary-blue);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-blue-hover);
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(99, 91, 255, 0.3);
}

.btn-secondary {
  background: white;
  color: var(--text-primary);
  border: 1px solid var(--border-medium);
}
```

---

## 💳 **Payment Integration**

### **Stripe Integration**

```javascript
// Stripe Configuration
const stripe = Stripe('pk_live_...');

function initiateStripePayment(courseId) {
  const course = getCourseInfo(courseId);

  stripe.redirectToCheckout({
    lineItems: [
      {
        price: course.stripePriceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${window.location.origin}/programs.html`,
    customerEmail: getCustomerEmail(),
    metadata: {
      courseId: courseId,
      source: 'website',
    },
  });
}
```

### **PayPal Integration**

```javascript
// PayPal Configuration
function initiatePayPalPayment(courseId) {
  const course = getCourseInfo(courseId);

  paypal
    .Buttons({
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: course.price,
                currency_code: 'USD',
              },
              description: course.title,
            },
          ],
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
          trackPaymentEvent(courseId, 'paypal', 'completed');
          window.location.href = '/success.html';
        });
      },
    })
    .render('#paypal-button-container');
}
```

### **Course Information Database**

```javascript
const COURSES = {
  'ai-transformation-manager': {
    title: 'AI Transformation Manager',
    price: 1500,
    discountedPrice: 900,
    duration: '3 месяца',
    stripePriceId: 'price_ai_transformation',
    paypalItemId: 'ai-transformation-course',
  },
  'nocode-sites': {
    title: 'Создание сайтов без кода',
    price: 1200,
    discountedPrice: 720,
    duration: '3 месяца',
    stripePriceId: 'price_nocode_sites',
    paypalItemId: 'nocode-sites-course',
  },
  'ai-video-avatars': {
    title: 'AI видео и аватары',
    price: 1000,
    discountedPrice: 600,
    duration: '2 месяца',
    stripePriceId: 'price_ai_video',
    paypalItemId: 'ai-video-course',
  },
};
```

---

## 🌐 **Internationalization (i18n)**

### **Translation System**

```javascript
const translations = {
  ru: {
    'nav.home': 'Главная',
    'nav.programs': 'Программы',
    'nav.about': 'О нас',
    'nav.contacts': 'Контакты',
    'homepage.title': 'AiStudio555 AI Academy – Практическая школа AI-обучения',
    'programs.header.title': 'Программы обучения',
    'courses.enroll_button': 'Записаться на курс',
  },
  he: {
    'nav.home': 'בית',
    'nav.programs': 'תוכניות',
    'nav.about': 'אודות',
    'nav.contacts': 'צור קשר',
    'homepage.title': 'AiStudio555 AI Academy – בית ספר מעשי ללימודי AI',
    'programs.header.title': 'תוכניות לימוד',
    'courses.enroll_button': 'הירשם לקורס',
  },
};

function switchLanguage(lang) {
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');

  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });

  localStorage.setItem('selectedLanguage', lang);
}
```

### **RTL Support for Hebrew**

```css
html[dir='rtl'] {
  direction: rtl;
}

html[dir='rtl'] .nav-menu {
  margin-right: auto;
  margin-left: 0;
}

html[dir='rtl'] .course-card {
  text-align: right;
}

html[dir='rtl'] .chip {
  margin-right: 0;
  margin-left: var(--space-2);
}
```

---

## 📊 **Analytics & Tracking**

### **Google Analytics 4 Setup**

```javascript
// Google Analytics 4 Configuration
gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: document.title,
  page_location: window.location.href,
  language: document.documentElement.lang,
});

// Custom Event Tracking
function trackEvent(eventName, parameters) {
  gtag('event', eventName, {
    event_category: 'engagement',
    event_label: parameters.label || '',
    custom_parameters: parameters,
  });
}

// Course Enrollment Tracking
function trackCourseEnrollment(courseId) {
  trackEvent('course_enroll_click', {
    label: courseId,
    course_id: courseId,
    value: COURSES[courseId].price,
  });
}

// Payment Tracking
function trackPaymentEvent(courseId, method, status) {
  gtag('event', 'purchase', {
    transaction_id: generateTransactionId(),
    value: COURSES[courseId].discountedPrice,
    currency: 'USD',
    items: [
      {
        item_id: courseId,
        item_name: COURSES[courseId].title,
        category: 'course',
        quantity: 1,
        price: COURSES[courseId].discountedPrice,
      },
    ],
  });
}
```

### **Custom Event Tracking**

```javascript
// Form Submissions
function trackFormSubmission(formType) {
  trackEvent('form_submit', {
    label: formType,
    form_type: formType,
  });
}

// Page Engagement
function trackPageEngagement() {
  // Track scroll depth
  let maxScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      if (maxScroll >= 75) {
        trackEvent('page_scroll_75', { page: window.location.pathname });
      }
    }
  });

  // Track time on page
  const startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    trackEvent('time_on_page', {
      duration: timeSpent,
      page: window.location.pathname,
    });
  });
}
```

---

## 🔒 **Security & Performance**

### **Security Headers**

```html
<!-- Security Meta Tags -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'unsafe-inline' *.googletagmanager.com *.stripe.com *.paypal.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: *.google-analytics.com;"
/>

<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta http-equiv="X-Frame-Options" content="DENY" />
<meta http-equiv="X-XSS-Protection" content="1; mode=block" />
```

### **Performance Optimization**

```css
/* Critical CSS inlining for above-fold content */
<style>
  /* Inline critical styles here */
</style>

/* Font loading optimization */
<link rel="preload" href="fonts/rubik-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

/* Image optimization */
<img src="course-image.webp" alt="Course description" loading="lazy" width="300" height="200">
```

### **Form Validation**

```javascript
function validateContactForm(formData) {
  const errors = {};

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    errors.email = 'Пожалуйста, введите корректный email';
  }

  // Phone validation
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(formData.phone)) {
    errors.phone = 'Пожалуйста, введите корректный номер телефона';
  }

  // Name validation
  if (formData.name.trim().length < 2) {
    errors.name = 'Имя должно содержать минимум 2 символа';
  }

  return errors;
}
```

---

## 📋 **Development Checklist**

### **Pre-Launch Requirements**

- [ ] All pages load under 3 seconds
- [ ] Mobile responsive on all devices
- [ ] Cross-browser compatibility (Chrome, Safari, Firefox, Edge)
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] SEO optimization (meta tags, structured data, sitemap)
- [ ] SSL certificate and HTTPS enforcement
- [ ] Analytics and conversion tracking setup
- [ ] Payment integration testing (test and live modes)
- [ ] Form validation and error handling
- [ ] Multilingual content verification (Russian, Hebrew)

### **Performance Benchmarks**

- **Lighthouse Score**: 90+ Performance, 100 Accessibility, 90+ Best Practices,
  100 SEO
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Page Weight**: <2MB total per page
- **Time to Interactive**: <3.5 seconds
- **First Contentful Paint**: <1.8 seconds

### **Browser Support Matrix**

- ✅ Chrome 90+ (95% compatibility)
- ✅ Safari 14+ (95% compatibility)
- ✅ Firefox 88+ (90% compatibility)
- ✅ Edge 90+ (90% compatibility)
- ⚠️ IE 11 (Basic functionality only)

---

**📁 Full PRD available at**: `/docs/prd/AiStudio555AI-Academy-PRD.md`  
**🔗 Executive Summary**: `/docs/prd/Executive-Summary.md`
