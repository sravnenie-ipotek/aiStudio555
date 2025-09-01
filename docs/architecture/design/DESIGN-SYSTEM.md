# AiStudio555 Design System - Complete Reference

## 🎨 Core Design Tokens

### Color System
```css
/* Primary Brand Colors */
--primary-yellow: #FFDA17    /* Main brand color */
--primary-yellow-alt: #FFDF17 /* Alternative yellow */
--yellow-light: #FDDD09      /* Light variant */
--yellow-dark: #FFBD00       /* Dark variant */
--yellow-hover: #E2C528      /* Hover state */
--nav-yellow: #FBDC0C        /* Navigation specific */

/* Dark Theme */
--dark-pure: #000000         /* Pure black */
--dark-header: #111111       /* Header background */
--dark-secondary: #191919    /* Secondary dark */
--dark-footer: #212426       /* Footer background */
--dark-gray: #303030         /* Gray dark */

/* Light Theme */
--light-bg: #F4F5F7          /* Main background */
--white: #FFFFFF             /* Pure white */

/* Text Colors */
--text-primary: #070707      /* Main text */
--text-secondary: #333333    /* Secondary text */
--text-gray: #7A7A7A         /* Gray text */
--text-light: #A1A1A1        /* Light text */

/* UI Elements */
--border-gray: #BFC2C5       /* Border color */
--border-light: #DFE3E5      /* Light border */
--surface-gray: #DFE3E5      /* Surface color */
--surface-light: #EEEEEE     /* Light surface */

/* Accent Colors */
--accent-blue: #5EA0FF       /* Blue accent */
--accent-light-blue: #C7D2E9 /* Light blue */
--success: #00B67A           /* Success green */
--error: #FF3B30             /* Error red */
```

### Typography System
```css
/* Font Family */
font-family: 'Rubik', system-ui, sans-serif;
font-weights: 400 (regular), 600 (semibold), 700 (bold)

/* Type Scale - 8px Base Unit */
xxs:  10px / 0.875rem line-height
xs:   12px / 1rem line-height
sm:   14px / 1.25rem line-height
base: 16px / 1.45rem line-height  /* Body text */
lg:   18px / 1.5rem line-height
xl:   20px / 1.625rem line-height
2xl:  22px / 1.75rem line-height  /* H3 */
3xl:  24px / 1.875rem line-height
4xl:  28px / 2.125rem line-height /* H2 */
5xl:  32px / 2.375rem line-height
6xl:  36px / 2.625rem line-height
7xl:  40px / 2.875rem line-height /* H1 */
8xl:  44px / 3.125rem line-height
9xl:  48px / 3.375rem line-height /* Hero */
```

### Spacing System (8px Unit)
```css
0: 0px     5: 40px    10: 80px    15: 120px   32: 256px
1: 8px     6: 48px    11: 88px    16: 128px   40: 320px
2: 16px    7: 56px    12: 96px    20: 160px   48: 384px
3: 24px    8: 64px    13: 104px   24: 192px   56: 448px
4: 32px    9: 72px    14: 112px                64: 512px
```

### Breakpoints
```css
xs: 480px   /* Mobile */
sm: 640px   /* Large mobile */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Wide screen */
```

## 📐 Layout System

### Container
```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px; /* Desktop */
  padding: 0 16px; /* Mobile */
}
```

### Grid System
- **Desktop**: 12-column grid, 24px gutters
- **Tablet**: 8-column grid, 16px gutters  
- **Mobile**: 4-column grid, 12px gutters

### Section Spacing
- **Desktop**: 64px vertical padding
- **Mobile**: 40px vertical padding
- **Between sections**: 48px gap
- **Card padding**: 24px (desktop), 16px (mobile)

## 🧩 Component Standards

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: #FFDA17;
  color: #070707;
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #E2C528;
  transform: translateY(-2px);
}

/* Minimum touch target: 44x44px */
```

### Cards
```css
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
```

### Forms
```css
.input {
  height: 44px;
  padding: 0 16px;
  border: 1px solid #DFE3E5;
  border-radius: 8px;
  font-size: 16px;
}

.input:focus {
  border-color: #FFDA17;
  outline: 2px solid rgba(255,218,23,0.2);
}

/* Label always visible above input */
```

## 🎯 UI/UX Principles

### Core Principles
1. **Clarity over cleverness** - Make the next action obvious
2. **Consistency** - Patterns, naming, and layouts must be uniform
3. **Mobile-first** - Design for mobile, enhance for desktop
4. **Accessibility by default** - WCAG 2.2 AA compliance minimum
5. **Performance conscious** - LCP <2.5s, FID <100ms, CLS <0.1

### Interactive States
- **Default**: Base state appearance
- **Hover**: Visual feedback on mouseover
- **Active**: Pressed/clicked state
- **Focus**: Keyboard navigation (2-3px outline)
- **Disabled**: 50% opacity, no pointer events
- **Loading**: Spinner or skeleton screen

### Motion & Animation
```css
/* Standard transitions */
transition-fast: 150ms ease-in-out
transition-base: 250ms ease-in-out
transition-slow: 350ms ease-in-out

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; }
}
```

### Accessibility Requirements
- **Color contrast**: ≥4.5:1 for body text, ≥3:1 for large text
- **Focus indicators**: Visible for all interactive elements
- **Alt text**: Required for all images
- **Semantic HTML**: Proper heading hierarchy
- **ARIA labels**: For icon-only buttons
- **Keyboard navigation**: Full site navigable via keyboard

## 🚀 Performance Guidelines

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: <2.5s
- **FID (First Input Delay)**: <100ms
- **CLS (Cumulative Layout Shift)**: <0.1
- **TTI (Time to Interactive)**: <3.8s
- **Total Page Weight**: <2MB

### Optimization Strategies
1. **Images**: WebP format, lazy loading, srcset for responsive
2. **Fonts**: Rubik subset, font-display: swap
3. **CSS**: Tailwind PurgeCSS, critical CSS inline
4. **JavaScript**: Code splitting, tree shaking
5. **Caching**: Aggressive caching headers

## 🌍 Internationalization

### Language Support
- **Primary**: Russian (ru)
- **Secondary**: Hebrew (he) - RTL support required
- **Tertiary**: English (en)

### RTL Considerations
```css
/* Directional properties */
[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

/* Use logical properties */
margin-inline-start instead of margin-left
padding-inline-end instead of padding-right
```

## 🛠️ Tailwind Configuration

### Installation
```bash
# Install in Next.js app
cd apps/web
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Core Config Location
Place at: `/apps/web/tailwind.config.js`

### Content Paths
```javascript
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './src/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
]
```

### Utility Classes Reference

#### Layout
- `container mx-auto px-3 md:px-6` - Responsive container
- `grid grid-cols-4 md:grid-cols-12 gap-3` - Grid system
- `flex items-center justify-between` - Flexbox utilities

#### Spacing
- `p-3` - padding: 24px
- `m-2` - margin: 16px
- `space-y-6` - 48px vertical spacing between children

#### Typography
- `font-rubik` - Rubik font family
- `text-base` - 16px font size
- `font-semibold` - 600 font weight
- `text-text-primary` - #070707 color

#### Colors
- `bg-primary-yellow` - Background yellow
- `text-dark-pure` - Black text
- `border-border-gray` - Gray border

#### Responsive
- `md:text-4xl` - 28px on medium screens
- `lg:grid-cols-3` - 3 columns on large screens
- `hidden md:block` - Hide on mobile, show on desktop

## 📋 Quality Checklist

### Design Review
- [ ] Colors match design tokens exactly
- [ ] Typography follows 8px spacing system
- [ ] Components have all interactive states
- [ ] Mobile-first responsive design
- [ ] RTL support for Hebrew

### Performance Review
- [ ] Core Web Vitals meet targets
- [ ] Images optimized (WebP, lazy loading)
- [ ] CSS purged of unused styles
- [ ] JavaScript bundle <500KB

### Accessibility Review
- [ ] WCAG 2.2 AA compliant
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast verified
- [ ] Focus indicators visible

### Implementation Review
- [ ] Tailwind utilities used consistently
- [ ] No custom CSS unless necessary
- [ ] Components follow naming conventions
- [ ] Documentation updated
- [ ] Cross-browser tested

## 📚 Quick Reference

### Common Patterns
```html
<!-- Hero Section -->
<section class="bg-dark-pure py-8 md:py-10">
  <div class="container mx-auto px-3 md:px-6">
    <h1 class="text-7xl font-bold text-primary-yellow">...</h1>
  </div>
</section>

<!-- Card Component -->
<div class="bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition-shadow">
  <h3 class="text-2xl font-semibold mb-2">...</h3>
  <p class="text-text-secondary">...</p>
</div>

<!-- Primary Button -->
<button class="bg-primary-yellow text-dark-pure px-4 py-1.5 rounded-lg font-semibold hover:bg-yellow-hover transition-colors">
  Click Me
</button>

<!-- Form Input -->
<div class="space-y-1">
  <label class="text-sm font-medium text-text-primary">Label</label>
  <input class="w-full h-11 px-2 border border-border-gray rounded-lg focus:border-primary-yellow focus:outline-none focus:ring-2 focus:ring-primary-yellow/20">
</div>
```

---

*Last Updated: December 2024*  
*Framework: Tailwind CSS v3.4+*  
*Project: AiStudio555 Academy*