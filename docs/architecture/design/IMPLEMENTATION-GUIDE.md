# AiStudio555 Implementation Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 9.0+
- Git

### Installation Steps
```bash
# 1. Install dependencies
pnpm install

# 2. Setup Tailwind CSS in Next.js app
cd apps/web
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Configure Tailwind (copy config from this guide)
# 4. Add Tailwind directives to globals.css
# 5. Start development server
pnpm dev
```

### Tailwind Directives (globals.css)
```css
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 📦 Technology Stack

### Frontend Stack
```yaml
Framework: Next.js 14.1.0 (App Router)
Language: TypeScript 5.x
Styling: Tailwind CSS v3.4+
UI Components: Radix UI + shadcn/ui
State Management: React Query v5
Forms: React Hook Form + Zod
Internationalization: next-intl
Testing: Vitest + React Testing Library
```

### Backend Stack
```yaml
Runtime: Node.js 20+
Framework: Express.js
Database: PostgreSQL + Prisma ORM
Authentication: JWT (access + refresh tokens)
Validation: Zod schemas
Security: Helmet, CORS, rate limiting
Payments: Stripe + PayPal
Email: Nodemailer
Caching: Redis
```

### Infrastructure
```yaml
Package Manager: pnpm (monorepo)
Build System: Turborepo
Process Manager: PM2
Web Server: Nginx
CI/CD: GitHub Actions
Code Quality: ESLint, Prettier, Husky
```

## 🎨 CSS to Tailwind Migration

### Color Mapping Reference
```css
/* Custom CSS → Tailwind Class */
color: #FFDA17      → text-primary-yellow
background: #FFDA17 → bg-primary-yellow
color: #070707      → text-text-primary
background: #F4F5F7 → bg-light-bg
border: #DFE3E5     → border-border-light
```

### Typography Migration
```css
/* Custom CSS → Tailwind Class */
font-size: 16px     → text-base
font-size: 28px     → text-4xl
font-size: 40px     → text-7xl
font-weight: 600    → font-semibold
font-weight: 700    → font-bold
line-height: 1.45   → leading-[1.45]
```

### Spacing Migration
```css
/* Custom CSS → Tailwind Class */
padding: 8px        → p-1
padding: 16px       → p-2
padding: 24px       → p-3
margin: 32px        → m-4
gap: 48px           → gap-6
```

### Layout Migration
```css
/* Custom CSS → Tailwind Class */
display: flex              → flex
justify-content: center    → justify-center
align-items: center        → items-center
display: grid              → grid
grid-template-columns: 12  → grid-cols-12
max-width: 1280px          → max-w-[1280px]
width: 100%                → w-full
```

### Common Component Patterns

#### Hero Section
```html
<!-- Before (Custom CSS) -->
<section class="hero-section">
  <div class="container">
    <h1 class="hero-title">Title</h1>
  </div>
</section>

<!-- After (Tailwind) -->
<section class="bg-dark-pure py-10 md:py-16">
  <div class="container mx-auto px-3 md:px-6">
    <h1 class="text-5xl md:text-7xl font-bold text-primary-yellow">Title</h1>
  </div>
</section>
```

#### Card Component
```html
<!-- Before -->
<div class="course-card">
  <h3 class="card-title">Title</h3>
  <p class="card-text">Description</p>
</div>

<!-- After -->
<div class="bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-lg transition-shadow">
  <h3 class="text-2xl font-semibold mb-2">Title</h3>
  <p class="text-text-secondary">Description</p>
</div>
```

#### Button
```html
<!-- Before -->
<button class="btn btn-primary">Click Me</button>

<!-- After -->
<button class="bg-primary-yellow text-dark-pure px-4 py-2 rounded-lg font-semibold hover:bg-yellow-hover transition-colors">
  Click Me
</button>
```

## ✅ Implementation Checklist

### Design System Setup
- [ ] Install Tailwind CSS and dependencies
- [ ] Configure tailwind.config.js with custom tokens
- [ ] Add Google Fonts (Rubik)
- [ ] Set up color system
- [ ] Configure spacing scale (8px base)
- [ ] Add responsive breakpoints

### Component Implementation
- [ ] Header/Navigation
- [ ] Hero sections
- [ ] Course cards
- [ ] Forms (contact, enrollment)
- [ ] Footer
- [ ] Modals/Dialogs
- [ ] Loading states
- [ ] Error states

### Features
- [ ] Multi-language support (RU/HE/EN)
- [ ] RTL support for Hebrew
- [ ] Dark mode (optional)
- [ ] Mobile responsive design
- [ ] Accessibility (WCAG 2.2 AA)

### Performance
- [ ] Optimize images (WebP, lazy loading)
- [ ] Configure PurgeCSS
- [ ] Enable code splitting
- [ ] Add caching headers
- [ ] Test Core Web Vitals

### Analytics & Tracking
- [ ] Google Tag Manager
- [ ] Google Analytics 4
- [ ] Facebook Pixel
- [ ] TikTok Pixel
- [ ] Yandex.Metrika (optional)

### Payment Integration
- [ ] Stripe setup
- [ ] PayPal integration
- [ ] Webhook handlers
- [ ] Payment confirmation emails

### Testing
- [ ] Unit tests for utilities
- [ ] Component testing
- [ ] E2E test critical paths
- [ ] Cross-browser testing
- [ ] Mobile device testing

## 📊 Third-Party Services

### Required Integrations

#### Payment Processors
```javascript
// Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// PayPal
const paypal = require('@paypal/checkout-server-sdk');
```

#### Analytics Setup
```html
<!-- Google Tag Manager (Head) -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>

<!-- Google Tag Manager (Body) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

#### Email Service
```javascript
// Nodemailer configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
```

### Optional Services
- CDN (Cloudflare/Fastly)
- Error tracking (Sentry)
- Uptime monitoring (UptimeRobot)
- Chat widget (Intercom/Crisp)

## 🔍 Quality Verification

### Visual Fidelity Checks
```yaml
Colors:
  - Primary yellow: #FFDA17 ✓
  - Dark backgrounds: #000000, #111111 ✓
  - Text colors: #070707, #333333 ✓

Typography:
  - Font: Rubik (400, 600, 700) ✓
  - Base size: 16px ✓
  - Line height: 1.45 ✓

Spacing:
  - 8px unit system ✓
  - Container: 1280px max ✓
  - Section padding: 64px/40px ✓

Components:
  - Buttons: 44px min height ✓
  - Cards: 12px radius ✓
  - Inputs: 44px height ✓
```

### Performance Metrics
```yaml
Core Web Vitals:
  LCP: < 2.5s
  FID: < 100ms
  CLS: < 0.1
  
Bundle Size:
  CSS: < 50KB (with PurgeCSS)
  JS: < 500KB (initial)
  Images: WebP format
  
Loading:
  First Paint: < 1.5s
  TTI: < 3.8s
  Total Size: < 2MB
```

### Accessibility Compliance
```yaml
WCAG 2.2 AA:
  - Color contrast: 4.5:1 minimum
  - Focus indicators: Visible
  - Keyboard navigation: Complete
  - Screen reader: Tested
  - Alt text: All images
  - ARIA labels: Interactive elements
```

## 🛠️ Troubleshooting

### Common Issues

#### Tailwind Not Working
```bash
# Check configuration
- Verify content paths in tailwind.config.js
- Ensure CSS file imports @tailwind directives
- Check PostCSS configuration
- Run: npx tailwindcss -o output.css --watch
```

#### Custom Colors Not Applying
```javascript
// Ensure colors are in extend object
theme: {
  extend: {
    colors: {
      'primary-yellow': '#FFDA17',
      // ... other colors
    }
  }
}
```

#### Fonts Not Loading
```css
/* Add to globals.css before Tailwind directives */
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;600;700&display=swap');
```

#### PurgeCSS Removing Classes
```javascript
// Add to safelist in tailwind.config.js
purge: {
  safelist: [
    'bg-primary-yellow',
    'text-primary-yellow',
    // ... other dynamic classes
  ]
}
```

## 📚 Resources

### Documentation
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Radix UI Components](https://www.radix-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)

### Tools
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - VS Code extension
- [Headwind](https://marketplace.visualstudio.com/items?itemName=heybourn.headwind) - Class sorter
- [Tailwind Playground](https://play.tailwindcss.com/) - Online editor

### Performance Testing
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

*Last Updated: December 2024*  
*Project: AiStudio555 Academy*  
*Version: 1.0.0*