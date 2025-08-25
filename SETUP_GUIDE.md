# Projectdes AI Academy - Setup & Configuration Guide

## ✅ Implementation Status

The webapp is fully implemented with all required functionalities. Here's what has been completed:

### Pages (All Complete ✅)
1. **Main Page (index.html)** 
   - Header: "Projectdes AI Academy – Практическая школа будущего"
   - Subheader: "Учись. Создавай. Развивайся. Международные программы на русском и иврите."
   - "Sign up for course" button → Opens enrollment modal
   - "Learn more" button → Navigates to programs page
   - List of advantages with icons

2. **Programs Page (programs.html)**
   - 4 course categories with full details
   - Course descriptions, duration (2-3 months), online format
   - Results and portfolio information
   - "I want this course" enrollment buttons
   - Payment buttons (Stripe & PayPal) - Ready for configuration

3. **About Page (about.html)**
   - Full description of the school
   - Mission statement about AI Transformation Manager profession
   - Team section
   - Statistics and achievements

4. **Contacts Page (contacts.html)**
   - Contact form with Name, Phone, Email fields
   - "Schedule a meeting" button
   - Links to WhatsApp, Google Meet/Zoom
   - Social media links (TikTok, LinkedIn, Instagram)

### Functionality (All Implemented ✅)
- **Bilingual Interface**: Russian + Hebrew with language switcher
- **Form Submissions**: Email integration ready (needs API keys)
- **Payment Integration**: Stripe & PayPal code implemented (needs API keys)
- **Meeting Scheduling**: Google Meet/Zoom links ready (needs meeting IDs)
- **Social Media Links**: All social platforms linked

## 🔧 Configuration Required

To make the website fully functional, you need to configure the following in `/js/config.js`:

### 1. Contact Information
```javascript
contact: {
    whatsappNumber: '+1234567890', // Replace with your WhatsApp number
    email: 'info@projectdes.ai',   // Your contact email
    phone: '+1234567890'            // Your phone number
}
```

### 2. Meeting Links
```javascript
meetings: {
    zoomMeetingId: 'YOUR_ZOOM_MEETING_ID',
    googleMeetUrl: 'https://meet.google.com/YOUR_CODE',
    calendlyUrl: 'https://calendly.com/your-account'
}
```

### 3. Email Service (Choose one)

#### Option A: EmailJS (Recommended)
1. Sign up at https://www.emailjs.com/
2. Create email templates for enrollment and contact forms
3. Get your service ID and public key
4. Update in config.js:
```javascript
emailJS: {
    serviceId: 'service_xxxxxx',
    publicKey: 'YOUR_PUBLIC_KEY',
    templates: {
        enrollment: 'template_xxxxxx',
        contact: 'template_xxxxxx'
    }
}
```

#### Option B: Formspree (Backup)
1. Sign up at https://formspree.io/
2. Create forms for enrollment and contact
3. Get form IDs
4. Update in config.js:
```javascript
formspree: {
    enrollmentFormId: 'xxxxxxxxxxx',
    contactFormId: 'xxxxxxxxxxx'
}
```

### 4. Payment Integration

#### Stripe Setup
1. Sign up at https://stripe.com/
2. Get your publishable key
3. Create products/prices for each course
4. Update in config.js:
```javascript
stripe: {
    publicKey: 'pk_test_xxxxxxxxxx', // Use pk_live_ for production
    mode: 'test', // Change to 'live' for production
    products: {
        'no-code-websites': 'price_xxxxxx',
        'ai-video-avatars': 'price_xxxxxx',
        'ai-automation': 'price_xxxxxx',
        'social-media-ads': 'price_xxxxxx'
    }
}
```

#### PayPal Setup
1. Sign up at https://developer.paypal.com/
2. Get your client ID
3. Update in config.js:
```javascript
paypal: {
    clientId: 'YOUR_CLIENT_ID',
    environment: 'sandbox', // Change to 'production' for live
}
```

## 🚀 Testing the Website

### Local Testing
1. Open terminal in project directory
2. Run: `python3 -m http.server 8000`
3. Open browser: http://localhost:8000

### Test Checklist
- [ ] Language switching (Russian ⟷ Hebrew)
- [ ] Navigation between all pages
- [ ] Mobile responsive design
- [ ] Enrollment modal opens from main page
- [ ] Enrollment modal opens from each course
- [ ] Contact form validation
- [ ] FAQ toggles on contacts page
- [ ] All social media links work
- [ ] WhatsApp link opens with correct number
- [ ] Google Meet/Zoom links work
- [ ] Payment buttons appear on programs page
- [ ] Back to top button appears on scroll

## 📱 Mobile Testing
The site is fully responsive. Test on different screen sizes:
- Desktop: 1920x1080, 1440x900
- Tablet: 768x1024 (iPad)
- Mobile: 375x812 (iPhone X), 360x740 (Android)

## 🌐 Deployment

### Option 1: Static Hosting (Recommended)
Deploy to any static hosting service:
- Netlify: Drag & drop the folder at netlify.com
- Vercel: Deploy with `vercel` CLI
- GitHub Pages: Push to repository and enable Pages
- AWS S3 + CloudFront

### Option 2: Traditional Hosting
Upload all files to your web server via FTP/SFTP

## 📋 File Structure
```
projectdes-academy/
├── index.html           # Main page
├── programs.html        # Programs page
├── about.html          # About page
├── contacts.html       # Contacts page
├── css/
│   ├── styles.css      # Main styles
│   ├── responsive.css  # Mobile styles
│   └── animations.css  # Animations
├── js/
│   ├── config.js       # Configuration (UPDATE THIS!)
│   ├── main.js         # Core functionality
│   ├── language-switcher.js # Bilingual support
│   ├── forms.js        # Form handling
│   └── integrations.js # External services
├── locales/
│   ├── ru.json         # Russian translations
│   └── he.json         # Hebrew translations
└── assets/
    └── icons/          # Icon files

```

## 🔒 Security Notes
- Never commit API keys to Git
- Use environment variables in production
- Enable CORS for API endpoints
- Use HTTPS in production
- Validate all form inputs server-side

## 📞 Support
For questions about implementation, check the code comments or contact your developer.

## ✨ Features Summary
- ✅ 4 complete HTML pages with all required content
- ✅ Bilingual support (Russian + Hebrew)
- ✅ Responsive design for all devices
- ✅ Form validation and submission
- ✅ Email integration (EmailJS + Formspree)
- ✅ Payment integration (Stripe + PayPal)
- ✅ Meeting scheduling (Zoom + Google Meet)
- ✅ Social media integration
- ✅ SEO optimization
- ✅ Performance optimizations
- ✅ Accessibility features

The website is production-ready once you add your API keys and configuration!