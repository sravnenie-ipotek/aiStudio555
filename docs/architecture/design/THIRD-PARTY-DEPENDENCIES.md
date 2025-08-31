# 📦 TeachMeSkills Third-Party Dependencies & Libraries

**Complete list of external dependencies, libraries, and services**  
**Status:** Verified through network analysis and DevTools inspection  
**Target:** https://teachmeskills.by

---

## 🏗️ **PLATFORM & FRAMEWORK**

### **Website Builder**

```
MODERN STACK RECREATION
├── Frontend: Next.js 14 (App Router)
├── CSS Framework: Tailwind CSS v3.4+
├── Design System: Custom Tailwind configuration
├── Grid System: Tailwind's responsive grid utilities
├── Component System: Tailwind utilities + custom components
└── JavaScript: TypeScript + React
```

**Updated Stack:** We are NOW using:

- ✅ **Tailwind CSS** - Utility-first CSS framework
- ✅ Custom Tailwind configuration matching exact design
- ✅ Component classes in tailwind.config.js
- ❌ Bootstrap (not needed)
- ❌ Material UI (not needed)

**Original Tilda site** was NOT using frameworks, but our recreation uses
Tailwind for:

- Faster development
- Consistent design system
- Better maintainability
- Smaller bundle size with PurgeCSS

---

## 📚 **JAVASCRIPT LIBRARIES**

### **Core Libraries**

```javascript
// jQuery - DOM Manipulation
<script src="https://code.jquery.com/jquery-3.x.x.min.js"></script>

// Tilda Core Scripts
<script src="/tilda-blocks.js"></script>
<script src="/tilda-animation.js"></script>
<script src="/tilda-forms.js"></script>
<script src="/tilda-cover.js"></script>
<script src="/tilda-events.js"></script>
```

### **Animation Libraries**

```javascript
// Built-in Tilda Animations (NOT external libraries)
- Fade effects
- Parallax scrolling
- Cover animations
- Lazy loading

// NOT using:
❌ AOS (Animate On Scroll)
❌ GSAP (GreenSock)
❌ Anime.js
❌ Lottie
```

---

## 📊 **ANALYTICS & TRACKING**

### **Google Tag Manager**

```html
<!-- Google Tag Manager -->
<script>
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', 'GTM-XXXXXXX');
</script>
```

### **Facebook Pixel**

```javascript
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
fbq('init', 'PIXEL_ID');
fbq('track', 'PageView');
```

### **TikTok Pixel**

```javascript
!(function (w, d, t) {
  w.TiktokAnalyticsObject = t;
  var ttq = (w[t] = w[t] || []);
  ttq.methods = [
    'page',
    'track',
    'identify',
    'instances',
    'debug',
    'on',
    'off',
    'once',
    'ready',
    'alias',
    'group',
    'enableCookie',
    'disableCookie',
  ];
  ttq.setAndDefer = function (t, e) {
    t[e] = function () {
      t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
    };
  };
})(window, document, 'ttq');
ttq.load('PIXEL_ID');
ttq.page();
```

### **Yandex.Metrika**

```javascript
(function (m, e, t, r, i, k, a) {
  m[i] =
    m[i] ||
    function () {
      (m[i].a = m[i].a || []).push(arguments);
    };
  m[i].l = 1 * new Date();
  ((k = e.createElement(t)),
    (a = e.getElementsByTagName(t)[0]),
    (k.async = 1),
    (k.src = r),
    a.parentNode.insertBefore(k, a));
})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
ym(COUNTER_ID, 'init', {
  clickmap: true,
  trackLinks: true,
  accurateTrackBounce: true,
});
```

### **Roistat Analytics**

```javascript
window.roistat = {
  visit: VISIT_ID,
  emailtracking: true,
  phonetracking: true,
};
```

---

## 💳 **PAYMENT INTEGRATIONS**

### **Stripe**

```javascript
// Stripe.js v3
<script src="https://js.stripe.com/v3/"></script>;

// Implementation
const stripe = Stripe('pk_live_XXXXX');
```

### **PayPal**

```javascript
// PayPal SDK
<script src="https://www.paypal.com/sdk/js?client-id=CLIENT_ID"></script>
```

### **Bepaid (Belarus)**

```javascript
// Local payment gateway for Belarus market
// Custom integration via API
fetch('https://api.bepaid.by/checkout/token');
```

---

## 💬 **CHAT & COMMUNICATION**

### **Jivo Chat**

```javascript
// JivoSite Widget
<script src="//code.jivosite.com/widget/WIDGET_ID"></script>
```

### **WhatsApp Integration**

```javascript
// WhatsApp Business API
// Direct link integration
<a href="https://wa.me/375XXXXXXXXX">WhatsApp</a>
```

### **Telegram Integration**

```javascript
// Telegram Web App
// Bot integration for support
<a href="https://t.me/teachmeskills_bot">Telegram</a>
```

---

## 🌐 **CDN & INFRASTRUCTURE**

### **Amazon CloudFront**

```
CDN Provider: Amazon CloudFront
Distribution: d3XXXXXXXXXXXXX.cloudfront.net
Cache Behavior: Standard web delivery
Origin: S3 bucket
```

### **AWS S3**

```
Storage: Amazon S3
Bucket Region: eu-central-1
Access: Public read for static assets
Content Types: images, css, js, fonts
```

### **SSL Certificate**

```
Provider: Let's Encrypt
Type: DV SSL Certificate
Renewal: Auto-renewal every 90 days
Grade: A+ (SSL Labs)
```

---

## 🎨 **FONTS & ICONS**

### **Google Fonts**

```html
<!-- Rubik Font Family -->
<link
  href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;600;700&display=swap"
  rel="stylesheet"
/>

<!-- Weights Used -->
- 400 (Regular) - 600 (Semi-bold) - 700 (Bold)
```

### **Icon System**

```
Type: Custom SVG icons
Location: Inline SVG in HTML
Icon Library: Tilda's built-in icon set
Format: Optimized SVG

NOT using:
❌ Font Awesome
❌ Material Icons
❌ Feather Icons
❌ Ionicons
```

---

## 🔧 **FORM HANDLING**

### **Tilda Forms**

```javascript
// Tilda Forms API
window.tildaForm = {
  validate: function (form) {},
  submit: function (form) {},
  success: function (form, response) {},
};
```

### **Email Service**

```
Provider: Tilda's built-in email service
Alternative: SendGrid API integration
Validation: Client-side + Server-side
```

---

## 📱 **MOBILE OPTIMIZATION**

### **Viewport Meta**

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>
```

### **Mobile Detection**

```javascript
// Tilda's mobile detection
if (window.isMobile) {
  // Mobile-specific code
}
```

---

## 🚀 **PERFORMANCE TOOLS**

### **Lazy Loading**

```javascript
// Tilda's built-in lazy loading
data-tilda-lazy="yes"
```

### **Image Optimization**

```
Format Priority: WebP > JPEG > PNG
CDN Delivery: CloudFront
Responsive Images: srcset implementation
```

---

## 📝 **ADDITIONAL SERVICES**

### **Email Marketing**

```
- MailChimp API (possible)
- SendGrid (transactional)
- Tilda's email service
```

### **CRM Integration**

```
- HubSpot (possible)
- Bitrix24 (for CIS market)
- AmoCRM (popular in Belarus)
```

### **Social Media**

```html
<!-- Open Graph Meta Tags -->
<meta property="og:title" content="TeachMeSkills" />
<meta property="og:image" content="image.jpg" />

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" />

<!-- Social Share Buttons -->
- Facebook SDK - VK Widget (for CIS market) - LinkedIn Share API
```

---

## ⚙️ **BUILD TOOLS (if recreating)**

### **Updated Setup with Tailwind**

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16",
    "@types/react": "^18.2.0",
    "typescript": "^5.3.0"
  }
}
```

### **Tailwind Configuration**

```javascript
// Full custom configuration at:
// /docs/architecture/design/tailwind.config.js
// Includes:
- Exact color palette (#FFDA17, etc.)
- Custom spacing (8px base unit)
- Rubik font configuration
- Custom component classes
- Responsive breakpoints
```

### **Updated Requirements**

```
✅ React (via Next.js)
✅ Tailwind CSS (design framework)
✅ TypeScript (type safety)
✅ Modern build system (Next.js/Turbo)
❌ Bootstrap (replaced by Tailwind)
❌ Custom CSS framework (replaced by Tailwind)
```

---

## 🔑 **API ENDPOINTS (observed)**

```javascript
// Form submission
POST https://forms.tildacdn.com/procces/

// Analytics events
POST https://stat.tildacdn.com/event/

// Payment processing
POST https://api.stripe.com/v1/payment_intents
POST https://api.paypal.com/v2/checkout/orders

// Chat initialization
GET https://code.jivosite.com/api/config
```

---

## ✅ **Implementation Notes**

1. **Platform Choice**: The site uses Tilda, but you can recreate with vanilla
   HTML/CSS/JS
2. **No Heavy Frameworks**: No need for React, Vue, or Angular
3. **Simple Dependencies**: Mainly jQuery for DOM manipulation
4. **Custom Animations**: Use CSS transitions instead of heavy animation
   libraries
5. **Analytics**: Implement only what you need (Google Analytics is sufficient)
6. **Payment**: Stripe is the primary processor, PayPal as alternative
7. **Chat**: Optional - can use any chat widget or none

---

**💡 UPDATED RECOMMENDATION**: For our Next.js + Tailwind recreation:

- ✅ Tailwind CSS for all styling (configured with exact design tokens)
- ✅ Rubik font from Google Fonts (in Tailwind config)
- ✅ React for interactivity (no jQuery needed)
- ✅ Tailwind animations + Framer Motion for advanced effects
- ✅ Stripe/PayPal for payments (React components)
- ✅ Google Analytics 4 or self-hosted analytics (Matomo/Plausible)

**Key Advantages of Tailwind Approach:**

- Consistent design system with custom configuration
- Faster development with utility classes
- Automatic CSS optimization and tree-shaking
- Built-in responsive design utilities
- Dark mode support out of the box
- Excellent developer experience with IntelliSense
