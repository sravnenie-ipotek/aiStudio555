# Projectdes AI Academy Website

A professional, production-ready multilingual educational website built with HTML5, CSS3, and vanilla JavaScript. Features complete Russian and Hebrew localization, responsive design, and modern web standards.

## 🚀 Features

### Core Functionality
- ✅ **Multilingual Support**: Complete Russian and Hebrew translations
- ✅ **Responsive Design**: Mobile-first approach with 5 breakpoints
- ✅ **Progressive Web App**: Service worker, offline capability, installable
- ✅ **Modern Forms**: Real-time validation, email integration, modal enrollment
- ✅ **Performance Optimized**: Lazy loading, code splitting, caching strategies
- ✅ **SEO Optimized**: Structured data, meta tags, sitemap, robots.txt
- ✅ **Accessibility**: WCAG 2.1 AA compliant, keyboard navigation, screen reader support

### Pages
- **Homepage**: Hero section, advantages, statistics, CTA buttons
- **Programs**: 4 detailed course offerings with pricing and features
- **About**: Company mission, team, values, achievements
- **Contacts**: Multi-channel contact methods, FAQ, contact form

### Technical Features
- **Email Integration**: EmailJS + Formspree fallback
- **Payment Integration**: Stripe + PayPal support
- **Calendar Integration**: Calendly booking widget
- **Analytics**: Google Analytics 4 + Facebook Pixel
- **Performance**: Service worker caching, image optimization
- **Security**: Form validation, XSS protection, CSRF tokens

## 📁 Project Structure

```
projectdes-academy/
├── index.html                 # Homepage
├── programs.html              # Programs page
├── about.html                 # About page
├── contacts.html              # Contacts page
├── css/
│   ├── styles.css            # Main stylesheet
│   ├── responsive.css        # Media queries
│   └── animations.css        # Animations & transitions
├── js/
│   ├── main.js               # Core functionality
│   ├── language-switcher.js  # Internationalization
│   ├── forms.js              # Form handling & modals
│   └── integrations.js       # Email, payment, analytics
├── assets/
│   ├── images/              # Optimized images
│   ├── icons/               # SVG icons
│   └── fonts/               # Web fonts
├── locales/
│   ├── ru.json              # Russian translations
│   └── he.json              # Hebrew translations
├── manifest.json             # PWA manifest
├── sw.js                    # Service worker
├── robots.txt               # Search engine directives
├── sitemap.xml              # XML sitemap
└── README.md                # Documentation
```

## 🛠 Setup Instructions

### 1. Basic Setup

```bash
# Clone or download the project
git clone <repository-url>
cd projectdes-academy

# Serve locally (choose one method)
# Option A: Python 3
python -m http.server 8000

# Option B: Node.js
npx serve .

# Option C: PHP
php -S localhost:8000

# Visit: http://localhost:8000
```

### 2. Email Configuration

#### EmailJS Setup (Recommended)
1. Create account at [EmailJS](https://emailjs.com)
2. Create email service (Gmail/Outlook/SendGrid)
3. Create email templates:
   - **Enrollment Template**: For course registrations
   - **Contact Template**: For general inquiries
4. Update `js/integrations.js`:

```javascript
const EMAIL_CONFIG = {
  emailJS: {
    serviceId: 'your_service_id',
    templateIds: {
      enrollment: 'your_enrollment_template_id',
      contact: 'your_contact_template_id'
    },
    publicKey: 'your_public_key'
  }
};
```

#### Formspree Setup (Fallback)
1. Create account at [Formspree](https://formspree.io)
2. Create two forms: enrollment and contact
3. Update endpoints in `js/integrations.js`

### 3. Payment Integration

#### Stripe Setup
1. Create [Stripe](https://stripe.com) account
2. Get publishable keys (test/live)
3. Create products and prices for each course
4. Update `js/integrations.js`:

```javascript
const PAYMENT_CONFIG = {
  stripe: {
    publicKey: 'pk_live_your_key',
    testKey: 'pk_test_your_key',
    mode: 'test', // Change to 'live' for production
    courses: {
      'no-code-websites': 'price_your_price_id',
      // ... other courses
    }
  }
};
```

#### PayPal Setup
1. Create [PayPal Developer](https://developer.paypal.com) account
2. Create application and get client ID
3. Update configuration in `js/integrations.js`

### 4. Calendar Integration

1. Create [Calendly](https://calendly.com) account
2. Set up meeting types (consultation, demo, etc.)
3. Update URL in `js/integrations.js`:

```javascript
class CalendarIntegration {
  constructor() {
    this.calendlyUrl = 'https://calendly.com/your-username';
  }
}
```

### 5. Analytics Setup

#### Google Analytics
1. Create GA4 property
2. Add tracking code to HTML head:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Facebook Pixel
1. Create Facebook Business account
2. Set up pixel and add code to HTML head

### 6. Content Customization

#### Update Company Information
1. **Contact Details**: Update email addresses in:
   - `js/integrations.js` (EMAIL_CONFIG.recipients)
   - All HTML files (contact sections)
   - `locales/ru.json` and `locales/he.json`

2. **Social Media Links**: Update URLs in HTML files:
   - WhatsApp: Update phone number
   - LinkedIn, Instagram, TikTok: Update handles

3. **Team Information**: Update team section in `about.html`

#### Add Real Images
1. Replace placeholder images in `assets/images/`
2. Optimize images (WebP format recommended)
3. Update image paths in HTML files
4. Generate app icons (72x72 to 512x512)

### 7. SEO Optimization

#### Meta Tags
- Update page titles and descriptions in HTML files
- Add structured data for courses
- Update Open Graph images

#### Sitemap
- Update `sitemap.xml` with your domain
- Submit to Google Search Console

### 8. Security Configuration

#### Content Security Policy
Add to HTML head:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self'; 
  script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.paypal.com https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.emailjs.com https://formspree.io;
">
```

### 9. Performance Optimization

#### Image Optimization
```bash
# Install imagemin (optional)
npm install -g imagemin-cli imagemin-webp

# Convert images to WebP
imagemin assets/images/*.{jpg,png} --out-dir=assets/images --plugin=webp
```

#### CSS/JS Minification
```bash
# Install terser and cssnano (optional)
npm install -g terser cssnano-cli

# Minify JavaScript
terser js/main.js -o js/main.min.js
terser js/language-switcher.js -o js/language-switcher.min.js

# Minify CSS
cssnano css/styles.css css/styles.min.css
```

## 🧪 Testing Checklist

### Functional Testing
- [ ] All forms submit successfully
- [ ] Email notifications are received
- [ ] Language switching works (Russian ↔ Hebrew)
- [ ] Modal enrollment form opens and submits
- [ ] All navigation links work
- [ ] Social media links open correctly
- [ ] FAQ items expand/collapse

### Responsive Testing
- [ ] Mobile (375px): All elements are readable and touchable
- [ ] Tablet (768px): Layout adapts properly
- [ ] Desktop (1024px+): Full layout with proper spacing
- [ ] RTL support: Hebrew text displays correctly

### Performance Testing
- [ ] PageSpeed Insights score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] No console errors
- [ ] Service worker registers correctly

### Accessibility Testing
- [ ] Can navigate using only keyboard
- [ ] Screen reader compatibility
- [ ] Color contrast meets WCAG AA standards
- [ ] All images have alt text
- [ ] Form labels are properly associated

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest) 
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Android Chrome)

## 🚀 Deployment

### Static Hosting (Recommended)
1. **Netlify**:
   - Connect GitHub repository
   - Auto-deploy on push
   - Free SSL and CDN

2. **Vercel**:
   - Import from GitHub
   - Zero configuration deployment
   - Edge functions support

3. **GitHub Pages**:
   - Enable in repository settings
   - Custom domain support
   - Free hosting

### Traditional Hosting
1. Upload files via FTP/SFTP
2. Ensure server supports:
   - HTML5 features
   - HTTPS (required for PWA)
   - Gzip compression
   - Browser caching headers

### Pre-deployment Checklist
- [ ] Update all placeholder content
- [ ] Configure email services
- [ ] Set up payment processing
- [ ] Update analytics tracking codes
- [ ] Test all functionality
- [ ] Optimize images and assets
- [ ] Update sitemap with production domain
- [ ] Configure DNS settings
- [ ] Enable HTTPS/SSL
- [ ] Test PWA installation

## 📈 Analytics & Monitoring

### Key Metrics to Track
- **User Engagement**: Page views, session duration, bounce rate
- **Conversion Funnel**: Form submissions, enrollment rates
- **Performance**: Page load times, Core Web Vitals
- **User Demographics**: Countries, languages, devices
- **Course Interest**: Most viewed programs, popular content

### Monitoring Tools
- Google Analytics 4
- Google Search Console
- PageSpeed Insights
- Lighthouse audits
- Uptime monitoring services

## 🔧 Maintenance

### Regular Updates
- **Content**: Course information, pricing, team members
- **Dependencies**: Check for updated CDN libraries
- **Security**: Monitor for vulnerabilities
- **Performance**: Regular Lighthouse audits
- **SEO**: Update meta descriptions, add new content

### Backup Strategy
- Regular site backups
- Database backups (if applicable)
- Configuration files backup
- Email/form submission logs

## 🆘 Support

### Common Issues

1. **Forms not working**: Check email service configuration
2. **Language switching failed**: Verify translation file paths
3. **Payment errors**: Check API keys and configuration
4. **Mobile layout issues**: Test responsive breakpoints
5. **Performance issues**: Optimize images and enable caching

### Resources
- [MDN Web Docs](https://developer.mozilla.org/)
- [Web.dev](https://web.dev/)
- [Can I Use](https://caniuse.com/)
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [Stripe Documentation](https://stripe.com/docs)

## 📄 License

This project is created for Projectdes AI Academy. All rights reserved.

---

**Built with ❤️ for modern web standards and optimal user experience.**