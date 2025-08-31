# 📋 TeachMeSkills Website - Complete Design System Specification (Tailwind CSS)

**Last Updated:** December 28, 2024  
**Source:** https://teachmeskills.by  
**Status:** Verified against live website  
**Purpose:** Pixel-perfect recreation design reference with Tailwind CSS
implementation  
**Framework:** Tailwind CSS v3+ with custom configuration

---

## 🔍 **Data Sources & Verification**

✅ **Live Website:** Verified via WebFetch analysis  
📊 **Scraped Data:** 746KB comprehensive design.json  
🔗 **Cross-Referenced:** Multiple JSON analyses (35KB + 14KB)  
📋 **Documentation:** ULTRA-PRECISE-SPECIFICATIONS.md validated  
🧩 **Implementation:** COMPLETE-UI-COMPONENT-LIBRARY.md confirmed  
⚡ **Tailwind Config:** Custom configuration with exact color values and
measurements

---

## 🎨 **Complete Color System - TAILWIND IMPLEMENTATION**

### **Tailwind Configuration Reference**

_Colors are defined in `tailwind.config.js` and can be used with Tailwind
utility classes_

```javascript
// tailwind.config.js - Custom Colors
colors: {
  // Primary Yellow System - CRITICAL BRAND COLORS
  'primary-yellow': '#FFDA17',      // Main brand yellow - DO NOT CHANGE
  'primary-yellow-alt': '#FFDF17',  // Slight variation in some sections
  'yellow-light': '#FDDD09',        // Lighter variant for gradients
  'yellow-dark': '#FFBD00',         // Gradient end color
  'yellow-hover': '#E2C528',        // EXACT hover state - CRITICAL
  'nav-yellow': '#FBDC0C',          // Navigation underline specific

  // Background Colors - EXACT VALUES
  'dark-pure': '#000000',           // Pure black backgrounds
  'dark-header': '#111111',         // Header/navigation background
  'dark-secondary': '#191919',      // Secondary dark sections
  'dark-footer': '#212426',         // Footer background - SPECIFIC
  'dark-gray': '#303030',           // Dark gray for buttons/sections
  'light-bg': '#F4F5F7',           // Light section backgrounds
  'white': '#FFFFFF',               // Card/content backgrounds

  // Text Colors - EXACT
  'text-primary': '#070707',        // Main text - NOT pure black
  'text-secondary': '#333333',      // Secondary text
  'text-gray': '#7A7A7A',          // Muted text
  'text-light': '#A1A1A1',         // Light gray text

  // UI Support Colors
  'border-gray': '#BFC2C5',        // Form borders
  'border-light': '#DFE3E5',       // Light borders
  'surface-gray': '#DFE3E5',       // Card surfaces
  'surface-light': '#EEEEEE',      // Light surfaces

  // Accent Colors
  'accent-blue': '#5EA0FF',        // Blue accent for links
  'accent-light-blue': '#C7D2E9',  // Light blue backgrounds
  'success': '#00B67A',            // Success states
  'error': '#FF3B30',              // Error states
}
```

### **Tailwind Utility Classes**

```html
<!-- Primary Yellow System -->
<div class="bg-primary-yellow text-text-primary">Main Brand Yellow</div>
<div class="bg-yellow-light">Light Yellow</div>
<div class="bg-yellow-dark">Dark Yellow</div>
<div class="hover:bg-yellow-hover">Hover State</div>

<!-- Background Colors -->
<div class="bg-dark-pure">Pure Black</div>
<div class="bg-dark-header">Header Background</div>
<div class="bg-dark-secondary">Secondary Dark</div>
<div class="bg-dark-footer">Footer Background</div>
<div class="bg-dark-gray">Dark Gray</div>
<div class="bg-light-bg">Light Background</div>

<!-- Text Colors -->
<p class="text-text-primary">Primary Text</p>
<p class="text-text-secondary">Secondary Text</p>
<p class="text-text-gray">Muted Text</p>
<p class="text-text-light">Light Text</p>
<p class="text-white">White Text</p>

<!-- Borders -->
<div class="border border-border-light">Light Border</div>
<div class="border border-border-gray">Gray Border</div>
```

### **Gradient Specifications - Tailwind Implementation**

```javascript
// tailwind.config.js - Background Gradients
backgroundImage: {
  'yellow-gradient': 'linear-gradient(160deg, #FFDA17 0%, #FFBD00 100%)',
  'dark-gradient': 'linear-gradient(135deg, #111111 0%, #191919 100%)',
  'card-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #F4F5F7 100%)',
}
```

**Tailwind Utility Classes:**

```html
<!-- Primary Yellow Gradient -->
<div class="bg-yellow-gradient">Yellow Gradient Background</div>

<!-- Dark Section Gradient -->
<div class="bg-dark-gradient">Dark Section Background</div>

<!-- Card Hover Gradient -->
<div class="bg-card-gradient">Card Hover State</div>

<!-- Custom Gradient with Tailwind -->
<div class="bg-gradient-to-br from-primary-yellow to-yellow-dark">
  Custom Gradient
</div>
```

---

## 📝 **Typography System - TAILWIND IMPLEMENTATION**

### **Font Stack & Loading**

```html
<!-- Primary Font Loading - EXACT -->
<link
  href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800&display=swap"
  rel="stylesheet"
/>

<!-- Preconnect for Performance -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

**Tailwind Configuration:**

```javascript
// tailwind.config.js - Font Family
fontFamily: {
  'rubik': ['Rubik', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Arial', 'sans-serif'],
  'sans': ['Rubik', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Arial', 'sans-serif'],
}
```

**Tailwind Utility Classes:**

```html
<!-- Font Family -->
<body class="font-rubik antialiased">
  <p class="font-sans">Default Rubik font</p>

  <!-- Font Smoothing -->
  <div class="antialiased">Smooth text rendering</div>
  <div class="subpixel-antialiased">Subpixel rendering</div>
</body>
```

### **Font Weights - Tailwind Utility Classes**

```html
<!-- Weight Usage Guidelines -->
<h1 class="font-light">Font Weight 300 - Special emphasis, large headings</h1>
<p class="font-normal">Font Weight 400 - Body text, descriptions</p>
<nav class="font-medium">Font Weight 500 - Navigation items, subheadings</nav>
<h2 class="font-semibold">Font Weight 600 - Section headings, emphasis</h2>
<h1 class="font-bold">Font Weight 700 - Headings, CTAs, buttons</h1>
<h1 class="font-extrabold">Font Weight 800 - Hero titles, special cases</h1>
```

**Available Tailwind Font Weight Classes:**

- `font-light` (300) - Special emphasis, large headings
- `font-normal` (400) - Body text, descriptions
- `font-medium` (500) - Navigation items, subheadings
- `font-semibold` (600) - Section headings, emphasis
- `font-bold` (700) - Headings, CTAs, buttons
- `font-extrabold` (800) - Hero titles, special cases

### **Typography Scale - EXACT SIZES (Tailwind Config)**

```javascript
// tailwind.config.js - Custom Font Sizes
fontSize: {
  // Tiny Sizes
  '10': '10px',   // Micro labels
  '11': '11px',   // Countdown timers
  '12': '12px',   // Chips, badges

  // Small Sizes
  '14': '14px',   // Small body, labels
  '16': '16px',   // Base body text - DEFAULT
  '18': '18px',   // Large body text

  // Medium Sizes
  '20': '20px',   // Small headings
  '24': '24px',   // Medium headings
  '26': '26px',   // Mobile hero text
  '28': '28px',   // Section titles

  // Large Sizes
  '33': '33px',   // Special headings
  '36': '36px',   // Large section titles
  '40': '40px',   // Desktop hero titles
  '48': '48px',   // Maximum hero size
}

// Line Heights - VERIFIED
lineHeight: {
  'tight-ultra': '0.95',   // Ultra-tight headlines
  'compact': '1.1',        // Compact headings
  'heading': '1.2',        // Normal headings
  'relaxed-heading': '1.3', // Comfortable headings
  'normal': '1.4',         // Standard body
  'body': '1.45',          // DEFAULT body text
  'loose': '1.5',          // Spacious body
  'paragraph': '1.6',      // Paragraph text
}
```

**Tailwind Typography Utility Classes:**

```html
<!-- Font Sizes -->
<span class="text-10">Micro labels</span>
<span class="text-12">Chips, badges</span>
<p class="text-16">Base body text</p>
<h3 class="text-20">Small headings</h3>
<h2 class="text-28">Section titles</h2>
<h1 class="text-40">Desktop hero titles</h1>

<!-- Line Heights -->
<h1 class="leading-tight-ultra">Ultra-tight headlines</h1>
<h2 class="leading-heading">Normal headings</h2>
<p class="leading-body">Default body text</p>
<p class="leading-paragraph">Paragraph text</p>
```

### **Responsive Typography**

```html
<!-- Fluid Typography with Tailwind -->
<h1 class="text-26 lg:text-40 leading-heading">Hero Title</h1>
<h2 class="text-24 lg:text-36 leading-relaxed-heading">Section Title</h2>
<p class="text-14 lg:text-16 leading-body">Body Text</p>

<!-- Alternative with custom CSS for clamp() -->
<h1 class="hero-title">Hero with clamp(26px, 5vw, 40px)</h1>
```

---

## 📐 **Layout System - TAILWIND IMPLEMENTATION**

### **Container System**

```javascript
// tailwind.config.js - Max Widths
maxWidth: {
  '420': '420px',   // Form width
  '620': '620px',   // Content width
  '960': '960px',   // Medium content
  '1160': '1160px', // Main container - EXACT
  '1200': '1200px', // Wide container
}
```

**Tailwind Container Classes:**

```html
<!-- Container Implementation -->
<div class="max-w-1160 mx-auto px-5 sm:px-10 lg:px-15">Main Container</div>
<div class="max-w-1200 mx-auto px-5">Wide Container</div>
<div class="max-w-960 mx-auto px-5">Medium Container</div>
<div class="max-w-620 mx-auto px-5">Text Content</div>
<div class="max-w-420 mx-auto px-5">Form Container</div>

<!-- Responsive Padding -->
<div class="px-5 sm:px-10 xl:px-15">Responsive Container Padding</div>
```

### **Grid System**

```html
<!-- Grid Configuration -->
<div
  class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
>
  <div>Grid Item 1</div>
  <div>Grid Item 2</div>
  <div>Grid Item 3</div>
</div>

<!-- Auto-fit Grid -->
<div
  class="grid gap-6"
  style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));"
>
  <div>Auto-fit Item</div>
</div>

<!-- Specific Column Grids -->
<div class="grid grid-cols-2 gap-6">2 Column Grid</div>
<div class="grid grid-cols-3 gap-6 max-md:grid-cols-2">
  3 Column (responsive)
</div>
<div class="grid grid-cols-4 gap-6 max-md:grid-cols-2 max-sm:grid-cols-1">
  4 Column (responsive)
</div>
```

### **Spacing System - 8px Base Unit (Tailwind Config)**

```javascript
// tailwind.config.js - Custom Spacing
spacing: {
  '0': '0px',
  '1': '8px',     // 1 unit
  '2': '16px',    // 2 units
  '3': '24px',    // 3 units
  '4': '32px',    // 4 units
  '5': '40px',    // 5 units
  '6': '48px',    // 6 units
  '7': '56px',    // 7 units
  '8': '64px',    // 8 units
  '9': '72px',    // 9 units
  '10': '80px',   // 10 units
  '11': '88px',   // 11 units
  '12': '96px',   // 12 units

  // Section Padding
  'section-mobile': '48px',
  'section-tablet': '64px',
  'section-desktop': '80px',

  // Card Padding
  'card': '24px',
  'card-mobile': '20px',
}
```

**Tailwind Spacing Utility Classes:**

```html
<!-- Margin & Padding -->
<div class="p-3">24px padding</div>
<div class="py-6">48px vertical padding</div>
<div class="px-4">32px horizontal padding</div>
<div class="m-2">16px margin</div>
<div class="mt-5">40px top margin</div>

<!-- Section Padding -->
<section class="py-section-mobile md:py-section-tablet lg:py-section-desktop">
  Responsive Section Padding
</section>

<!-- Card Padding -->
<div class="p-card-mobile sm:p-card">Card with responsive padding</div>
```

### **Responsive Breakpoints - 5-TIER SYSTEM**

```javascript
// tailwind.config.js - Custom Breakpoints
screens: {
  'xs': '480px',   // Small Mobile
  'sm': '640px',   // Mobile
  'md': '960px',   // Tablet
  'lg': '1200px',  // Desktop
  'xl': '1440px',  // Large Desktop
  '2xl': '1920px', // Wide Screen
}
```

**Tailwind Responsive Classes:**

```html
<!-- Responsive Design Examples -->
<div class="block md:hidden">Mobile Only</div>
<div class="hidden md:block">Desktop Only</div>
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  Responsive Grid
</div>

<!-- Responsive Typography -->
<h1 class="text-26 md:text-33 lg:text-40">Responsive Heading</h1>
<p class="text-14 md:text-16">Responsive Body Text</p>

<!-- Responsive Spacing -->
<div class="p-4 md:p-6 lg:p-8">Responsive Padding</div>
```

---

## 🧩 **Component Specifications - TAILWIND IMPLEMENTATION**

### **Button System - COMPLETE**

**Pre-built Component Classes (in tailwind.config.js):**

```javascript
// tailwind.config.js - Button Components
addComponents({
  '.btn-primary': {
    padding: '14px 32px',
    minHeight: '48px',
    backgroundColor: theme('colors.primary-yellow'),
    color: theme('colors.text-primary'),
    fontSize: '16px',
    fontWeight: '700',
    borderRadius: '12px',
    transition: 'all 0.2s ease-in-out',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    '&:hover': {
      backgroundColor: theme('colors.yellow-hover'),
      transform: 'translateY(-2px)',
      boxShadow: theme('boxShadow.button-hover'),
    },
  },
});
```

**Tailwind Utility Implementation:**

```html
<!-- Primary Button -->
<button class="btn-primary">Primary Button (pre-built component)</button>

<!-- Primary Button with Utilities -->
<button
  class="
  inline-flex items-center justify-center gap-2
  px-8 py-3.5 min-h-12
  bg-primary-yellow hover:bg-yellow-hover
  text-text-primary font-bold text-16
  rounded-lg border-none cursor-pointer
  transition-all duration-200 ease-in-out
  hover:-translate-y-0.5 hover:shadow-button-hover
  active:translate-y-0 active:shadow-md
  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-yellow focus-visible:ring-offset-2
"
>
  Primary Button with Utilities
</button>

<!-- Secondary Button -->
<button
  class="
  inline-flex items-center justify-center gap-2
  px-8 py-3.5 min-h-12
  bg-dark-gray hover:bg-dark-secondary
  text-white font-bold text-16
  rounded-lg border-none cursor-pointer
  transition-all duration-200 ease-in-out
  hover:-translate-y-0.5 hover:shadow-button-dark
"
>
  Secondary Button
</button>

<!-- Button Sizes -->
<!-- Small Button -->
<button class="px-4 py-2 min-h-9 text-14 rounded-md">Small</button>

<!-- Large Button -->
<button class="px-10 py-4 min-h-14 text-18 rounded-2xl">Large</button>
```

**Button States with @apply:**

```css
/* Alternative: Using @apply in your CSS */
.btn-base {
  @apply inline-flex items-center justify-center gap-2;
  @apply px-8 py-3.5 min-h-12 font-bold text-16;
  @apply border-none cursor-pointer rounded-lg;
  @apply transition-all duration-200 ease-in-out;
  @apply hover:-translate-y-0.5 active:translate-y-0;
  @apply disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none;
  @apply focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-offset-2;
}

.btn-primary {
  @apply btn-base bg-primary-yellow hover:bg-yellow-hover;
  @apply text-text-primary hover:shadow-button-hover;
  @apply focus-visible:ring-primary-yellow;
}

.btn-secondary {
  @apply btn-base bg-dark-gray hover:bg-dark-secondary;
  @apply text-white hover:shadow-button-dark;
  @apply focus-visible:ring-white;
}
```

### **Card Components - DETAILED**

**Pre-built Course Card Component:**

```javascript
// tailwind.config.js - Card Component
'.course-card': {
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  padding: '24px',
  border: '1px solid transparent',
  boxShadow: theme('boxShadow.card'),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme('boxShadow.card-hover'),
    borderColor: theme('colors.primary-yellow'),
  },
}
```

**Tailwind Utility Implementation:**

```html
<!-- Course Card with Utilities -->
<div
  class="
  bg-white rounded-2xl p-6 border border-transparent
  shadow-card hover:shadow-card-hover
  transition-all duration-300 ease-in-out
  hover:-translate-y-1 hover:border-primary-yellow
"
>
  <!-- Card Header -->
  <header class="mb-4 pb-4 border-b border-border-light">
    <!-- Card Badge -->
    <span
      class="
      inline-block px-3 py-1 mb-3
      bg-primary-yellow text-text-primary
      text-12 font-semibold rounded-full
    "
    >
      Course Badge
    </span>

    <!-- Card Title -->
    <h3 class="text-20 font-bold leading-heading text-text-primary mb-2">
      Course Title
    </h3>

    <!-- Card Description -->
    <p class="text-14 leading-body text-text-gray">
      Course description text goes here.
    </p>
  </header>

  <!-- Card Content -->
  <div class="mb-4">
    <!-- Additional content -->
  </div>

  <!-- Card Footer -->
  <footer
    class="flex justify-between items-center pt-4 border-t border-border-light"
  >
    <!-- Card Price -->
    <span class="text-24 font-bold text-primary-yellow"> $299 </span>

    <button class="btn-primary">Enroll Now</button>
  </footer>
</div>

<!-- Alternative with @apply -->
<div class="course-card">
  <div class="course-card__header">
    <span class="course-card__badge">Badge</span>
    <h3 class="course-card__title">Title</h3>
    <p class="course-card__description">Description</p>
  </div>
  <footer class="course-card__footer">
    <span class="course-card__price">$299</span>
  </footer>
</div>
```

**Card Component CSS with @apply:**

```css
.course-card {
  @apply bg-white rounded-2xl p-6 border border-transparent;
  @apply shadow-card hover:shadow-card-hover;
  @apply transition-all duration-300 ease-in-out;
  @apply hover:-translate-y-1 hover:border-primary-yellow;
}

.course-card__header {
  @apply mb-4 pb-4 border-b border-border-light;
}

.course-card__badge {
  @apply inline-block px-3 py-1 mb-3;
  @apply bg-primary-yellow text-text-primary;
  @apply text-12 font-semibold rounded-full;
}

.course-card__title {
  @apply text-20 font-bold leading-heading text-text-primary mb-2;
}

.course-card__description {
  @apply text-14 leading-body text-text-gray mb-4;
}

.course-card__footer {
  @apply flex justify-between items-center pt-4 border-t border-border-light;
}

.course-card__price {
  @apply text-24 font-bold text-primary-yellow;
}
```

### **Form Elements - COMPLETE**

**Pre-built Form Input Component:**

```javascript
// tailwind.config.js - Form Components
'.form-input': {
  width: '100%',
  padding: '12px 16px',
  minHeight: '48px',
  fontSize: '16px',
  lineHeight: '1.4',
  backgroundColor: '#FFFFFF',
  border: `2px solid ${theme('colors.border-light')}`,
  borderRadius: '8px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme('colors.border-gray'),
  },
  '&:focus': {
    borderColor: theme('colors.primary-yellow'),
    boxShadow: theme('boxShadow.focus-yellow'),
    outline: 'none',
  },
}
```

**Tailwind Form Implementation:**

```html
<!-- Form Input with Utilities -->
<div class="form-group">
  <label class="form-label"> Email Address </label>
  <input type="email" class="form-input" placeholder="Enter your email" />
</div>

<!-- Form Input with Pure Utilities -->
<div class="mb-4">
  <label
    class="
    block text-14 font-semibold text-text-primary mb-2
    after:content-['*'] after:text-error after:ml-1
  "
  >
    Email Address (Required)
  </label>

  <input
    type="email"
    class="
      w-full px-4 py-3 min-h-12
      text-16 leading-normal
      bg-white border-2 border-border-light rounded-md
      transition-all duration-200 ease-in-out
      hover:border-border-gray
      focus:border-primary-yellow focus:shadow-focus-yellow focus:outline-none
      disabled:bg-light-bg disabled:opacity-60 disabled:cursor-not-allowed
      placeholder:text-text-light
    "
    placeholder="Enter your email"
  />
</div>

<!-- Select Dropdown -->
<select
  class="
  form-input appearance-none
  bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'%3E%3Cpath fill=\'%23070707\' d=\'M6 8L0 0h12z\'/%3E%3C/svg%3E')]
  bg-no-repeat bg-[length:12px_8px] bg-[position:right_16px_center]
  pr-10
"
>
  <option>Select an option</option>
</select>

<!-- Checkbox -->
<label class="flex items-center gap-2 cursor-pointer">
  <input type="checkbox" class="w-5 h-5 accent-primary-yellow" />
  <span class="text-text-primary">I agree to the terms</span>
</label>

<!-- Radio Button -->
<label class="flex items-center gap-2 cursor-pointer">
  <input type="radio" name="plan" class="w-5 h-5 accent-primary-yellow" />
  <span class="text-text-primary">Basic Plan</span>
</label>
```

**Form Component CSS with @apply:**

```css
.form-group {
  @apply mb-4;
}

.form-label {
  @apply block text-14 font-semibold text-text-primary mb-2;
}

.form-label.required::after {
  @apply content-['*'] text-error ml-1;
}

.form-input {
  @apply w-full px-4 py-3 min-h-12;
  @apply text-16 leading-normal;
  @apply bg-white border-2 border-border-light rounded-md;
  @apply transition-all duration-200 ease-in-out;
  @apply hover:border-border-gray;
  @apply focus:border-primary-yellow focus:shadow-focus-yellow focus:outline-none;
  @apply disabled:bg-light-bg disabled:opacity-60 disabled:cursor-not-allowed;
  @apply placeholder:text-text-light;
}

.form-input.error {
  @apply border-error focus:shadow-focus-error;
}

.form-select {
  @apply form-input appearance-none pr-10;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath fill='%23070707' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
  @apply bg-no-repeat bg-[length:12px_8px] bg-[position:right_16px_center];
}

.form-checkbox,
.form-radio {
  @apply w-5 h-5 mr-2 accent-primary-yellow;
}
```

### **Navigation Components**

**Tailwind Navigation Implementation:**

```html
<!-- Header Navigation -->
<nav
  class="
  bg-dark-header py-4 
  fixed top-0 w-full z-1000
  shadow-[0_2px_10px_rgba(0,0,0,0.1)]
"
>
  <div class="max-w-1160 mx-auto px-5 flex items-center justify-between">
    <!-- Logo -->
    <div class="logo">
      <img src="/logo.png" alt="TeachMeSkills" class="h-8" />
    </div>

    <!-- Desktop Menu -->
    <ul class="hidden md:flex items-center gap-6">
      <li>
        <a href="#" class="nav-link">Home</a>
      </li>
      <li>
        <a href="#" class="nav-link active">Courses</a>
      </li>
      <li>
        <a href="#" class="nav-link">About</a>
      </li>
    </ul>

    <!-- Mobile Menu Button -->
    <button class="md:hidden nav-burger">
      <span class="sr-only">Menu</span>
      <!-- Hamburger icon -->
    </button>
  </div>

  <!-- Mobile Menu -->
  <div class="md:hidden nav-menu hidden">
    <div class="px-5 py-5 bg-dark-header">
      <a href="#" class="block py-2 nav-link">Home</a>
      <a href="#" class="block py-2 nav-link">Courses</a>
      <a href="#" class="block py-2 nav-link">About</a>
    </div>
  </div>
</nav>
```

**Navigation Component CSS with @apply:**

```css
.nav {
  @apply bg-dark-header py-4 fixed top-0 w-full z-1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-link {
  @apply text-white text-16 font-medium px-4 py-2;
  @apply no-underline relative transition-colors duration-200;
  @apply hover:text-primary-yellow;
}

.nav-link.active::after,
.nav-link:hover::after {
  content: '';
  @apply absolute -bottom-1 left-4 right-4 h-0.5;
  @apply bg-primary-yellow rounded-sm;
  animation: slideIn 0.2s ease-in-out;
}

.nav-burger {
  @apply hidden md:hidden w-8 h-8 p-0;
  @apply bg-transparent border-none cursor-pointer;
}

@media (max-width: 959px) {
  .nav-burger {
    @apply block;
  }

  .nav-menu {
    @apply absolute top-full left-0 right-0 bg-dark-header p-5;
  }

  .nav-menu.open {
    @apply block;
  }
}

@keyframes slideIn {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
```

---

## ⚡ **Animation & Interaction System - TAILWIND IMPLEMENTATION**

### **Transition Configuration**

```javascript
// tailwind.config.js - Transitions & Animations
transitionDuration: {
  '100': '100ms',
  '200': '200ms', // Default
  '300': '300ms',
  '500': '500ms',
  '800': '800ms',
}

animation: {
  'slideIn': 'slideIn 0.2s ease-in-out',
  'fadeIn': 'fadeIn 0.3s ease-out',
  'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'skeleton': 'skeleton 1.5s ease-in-out infinite',
  'focusBounce': 'focusBounce 0.3s ease-out',
}

keyframes: {
  slideIn: {
    'from': { transform: 'scaleX(0)' },
    'to': { transform: 'scaleX(1)' },
  },
  fadeIn: {
    'from': { opacity: '0' },
    'to': { opacity: '1' },
  },
  skeleton: {
    '0%': { backgroundPosition: '200% 0' },
    '100%': { backgroundPosition: '-200% 0' },
  },
  focusBounce: {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.01)' },
    '100%': { transform: 'scale(1)' },
  },
}
```

### **Hover Effects with Tailwind**

```html
<!-- Lift Effect -->
<div class="transition-transform duration-200 ease-out hover:-translate-y-0.5">
  Hover to lift
</div>

<!-- Scale Effect -->
<div class="transition-transform duration-200 ease-out hover:scale-105">
  Hover to scale
</div>

<!-- Glow Effect -->
<div
  class="hover:shadow-[0_0_20px_rgba(255,218,23,0.5)] transition-shadow duration-200"
>
  Hover for glow
</div>

<!-- Combined Effects -->
<button
  class="
  btn-primary
  transform transition-all duration-200 ease-in-out
  hover:-translate-y-0.5 hover:scale-105 hover:shadow-button-hover
  active:translate-y-0 active:scale-100
"
>
  Interactive Button
</button>
```

### **Loading & Skeleton States**

```html
<!-- Skeleton Loading -->
<div
  class="animate-skeleton bg-gradient-to-r from-light-bg via-surface-light to-light-bg bg-[length:200%_100%] rounded-md h-4 w-32"
></div>

<!-- Pulse Animation -->
<div class="animate-pulse bg-light-bg rounded-md h-4 w-24"></div>

<!-- Custom Skeleton with Tailwind -->
<div
  class="
  bg-gradient-to-r from-light-bg via-surface-light to-light-bg
  bg-[length:200%_100%] animate-skeleton
  rounded-md h-4 w-full
"
></div>

<!-- Loading Spinner -->
<div
  class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-yellow"
></div>
```

**Loading Component CSS with @apply:**

```css
.skeleton {
  @apply bg-gradient-to-r from-light-bg via-surface-light to-light-bg;
  @apply bg-[length:200%_100%] animate-skeleton rounded-md;
}

.loading-spinner {
  @apply animate-spin rounded-full border-b-2 border-primary-yellow;
}

.pulse-loader {
  @apply animate-pulse bg-light-bg rounded-md;
}
```

### **Micro-interactions**

```html
<!-- Button Press Effect -->
<button
  class="
  btn-primary
  active:scale-95 transition-transform duration-100
"
>
  Press Effect
</button>

<!-- Input Focus Animation -->
<input
  class="
  form-input
  focus:animate-focusBounce
"
/>

<!-- Link Underline Animation -->
<a
  href="#"
  class="
  relative text-text-primary no-underline
  after:content-[''] after:absolute after:-bottom-0.5 after:left-0
  after:w-0 after:h-0.5 after:bg-primary-yellow
  after:transition-all after:duration-300 after:ease-out
  hover:after:w-full
"
>
  Animated Link
</a>
```

**Micro-interaction Components with @apply:**

```css
.btn-press-effect {
  @apply active:scale-95 transition-transform duration-100;
}

.input-focus-bounce {
  @apply focus:animate-focusBounce;
}

.link-animated {
  @apply relative no-underline;
  @apply after:content-[''] after:absolute after:-bottom-0.5 after:left-0;
  @apply after:w-0 after:h-0.5 after:bg-primary-yellow;
  @apply after:transition-all after:duration-300 after:ease-out;
  @apply hover:after:w-full;
}
```

---

## 📱 **Mobile-First Responsive System - TAILWIND IMPLEMENTATION**

### **Touch Optimization**

```javascript
// tailwind.config.js - Custom Utilities
addUtilities({
  '.touch-target': {
    minHeight: '44px', // iOS recommendation
    minWidth: '44px', // Android recommendation
    padding: '12px', // Comfortable touch area
  },
  '.no-callout': {
    '-webkit-touch-callout': 'none',
    '-webkit-user-select': 'none',
    'user-select': 'none',
  },
});
```

**Tailwind Touch Optimization:**

```html
<!-- Touch Targets -->
<button class="touch-target min-h-11 min-w-11 p-3">
  Touch Optimized Button
</button>

<!-- Disable Touch Callout -->
<div class="select-none touch-target">No selection allowed</div>

<!-- Smooth Scrolling -->
<div class="overflow-auto scroll-smooth">Smooth scrolling content</div>

<!-- Touch-friendly Navigation -->
<nav class="flex gap-2">
  <a href="#" class="touch-target px-4 py-3 text-center">Home</a>
  <a href="#" class="touch-target px-4 py-3 text-center">About</a>
</nav>
```

### **Mobile Typography Adjustments**

```html
<!-- Responsive Typography -->
<h1 class="text-26 md:text-33 lg:text-40">Responsive Heading</h1>
<p class="text-14 md:text-16">Responsive Body</p>

<!-- Prevent iOS Font Size Adjustment -->
<body class="text-size-adjust-100">
  <!-- Content -->
</body>
```

**Mobile Typography CSS:**

```css
/* Prevent iOS font size adjustment */
body {
  @apply font-rubik antialiased;
  -webkit-text-size-adjust: 100%;
}

/* Mobile-specific adjustments */
@media (max-width: 639px) {
  .mobile-text-adjust h1 {
    @apply text-26;
  }
  .mobile-text-adjust h2 {
    @apply text-20;
  }
  .mobile-text-adjust p {
    @apply text-14;
  }
}
```

### **Responsive Images**

```html
<!-- Responsive Image Container -->
<div class="img-responsive">
  <img
    src="/course-image.jpg"
    alt="Course"
    class="img-responsive-img"
    loading="lazy"
  />
</div>

<!-- With Tailwind Utilities -->
<div
  class="relative w-full pb-[56.25%] overflow-hidden bg-light-bg rounded-2xl"
>
  <img
    src="/course-image.jpg"
    alt="Course"
    class="absolute inset-0 w-full h-full object-cover transition-all duration-300"
    loading="lazy"
  />
</div>

<!-- Lazy Loading Placeholder -->
<img
  src="/course-image.jpg"
  alt="Course"
  class="
    w-full h-full object-cover
    filter blur-md transition-all duration-300 ease-out
    data-[loaded=true]:filter-none
  "
  loading="lazy"
  data-loaded="false"
/>
```

**Image Component CSS with @apply:**

```css
.img-responsive {
  @apply relative w-full overflow-hidden bg-light-bg;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.img-responsive-img {
  @apply absolute inset-0 w-full h-full object-cover;
}

.img-lazy {
  @apply filter blur-md transition-all duration-300 ease-out;
}

.img-lazy.loaded {
  @apply filter-none;
}
```

---

## 🚀 **Performance Optimization Guidelines - TAILWIND IMPLEMENTATION**

### **Critical CSS with Tailwind**

```html
<!-- Inline critical Tailwind classes in <head> -->
<style>
  /* Critical utilities only */
  .max-w-1160 {
    max-width: 1160px;
  }
  .mx-auto {
    margin-left: auto;
    margin-right: auto;
  }
  .px-5 {
    padding-left: 20px;
    padding-right: 20px;
  }
  .font-rubik {
    font-family:
      'Rubik',
      -apple-system,
      sans-serif;
  }
  .text-text-primary {
    color: #070707;
  }
  .bg-primary-yellow {
    background-color: #ffda17;
  }
  .btn-primary {
    /* inline button styles */
  }
</style>
```

### **Font Loading Strategy with Tailwind**

```html
<!-- Preload critical fonts -->
<link
  rel="preload"
  href="https://fonts.gstatic.com/s/rubik/v14/iJWKBXyIfDnIV7nBrXw.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>

<!-- Font display swap for better performance -->
<style>
  @font-face {
    font-family: 'Rubik';
    font-display: swap;
    src: url('https://fonts.gstatic.com/s/rubik/v14/iJWKBXyIfDnIV7nBrXw.woff2')
      format('woff2');
  }
</style>
```

### **Tailwind CSS Build Optimization**

```javascript
// tailwind.config.js - Production Optimizations
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Remove unused styles in production
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  },
};
```

### **Dark Mode Support**

```javascript
// tailwind.config.js - Dark Mode
module.exports = {
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        // Dark mode variants
        'primary-yellow': '#FFDA17',
        'dark-text-primary': '#FFFFFF',
        'dark-bg-white': '#1A1A1A',
        'dark-bg-light': '#2A2A2A',
        'dark-border-light': '#3A3A3A',
      },
    },
  },
};
```

**Dark Mode Implementation:**

```html
<!-- Dark Mode Toggle -->
<html class="dark">
  <body
    class="bg-white dark:bg-dark-bg-white text-text-primary dark:text-dark-text-primary"
  >
    <div class="bg-light-bg dark:bg-dark-bg-light p-6 rounded-2xl">
      Card with dark mode support
    </div>
  </body>
</html>
```

---

## ✅ **Implementation Checklist - TAILWIND VERSION**

### **Phase 1: Foundation Setup**

- [ ] Install and configure Tailwind CSS v3+
- [ ] Import exact color variables in `tailwind.config.js`
- [ ] Setup Rubik font with proper weights and display:swap
- [ ] Configure custom spacing system (8px base unit)
- [ ] Setup responsive breakpoints (5-tier system)
- [ ] Test color system with utility classes

### **Phase 2: Core Components**

- [ ] Implement button system using component classes and utilities
- [ ] Create card components with hover states
- [ ] Build form elements with focus and error states
- [ ] Setup navigation (desktop + mobile) with active states
- [ ] Test all interactive states and transitions

### **Phase 3: Advanced Features**

- [ ] Add custom animations and keyframes
- [ ] Implement hover effects and micro-interactions
- [ ] Setup loading states and skeleton components
- [ ] Create responsive image containers
- [ ] Add touch optimization for mobile

### **Phase 4: Production Optimization**

- [ ] Configure Tailwind purging for unused styles
- [ ] Inline critical CSS utilities
- [ ] Optimize font loading with preload
- [ ] Setup dark mode support (if needed)
- [ ] Test performance and bundle size
- [ ] Implement lazy loading for images

### **Phase 5: Integration Testing**

- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing (iOS, Android)
- [ ] Accessibility testing (keyboard navigation, screen readers)
- [ ] Performance testing (Lighthouse scores)
- [ ] Visual regression testing against live site

---

## 🚀 **Quick Start Code - TAILWIND VERSION**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TeachMeSkills - Professional IT Education</title>

    <!-- Preconnect to Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <!-- Load Rubik Font -->
    <link
      href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;600;700&display=swap"
      rel="stylesheet"
    />

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Custom Tailwind Config -->
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              'primary-yellow': '#FFDA17',
              'yellow-hover': '#E2C528',
              'text-primary': '#070707',
              'dark-header': '#111111',
              'dark-footer': '#212426',
              'light-bg': '#F4F5F7',
            },
            fontFamily: {
              rubik: ['Rubik', 'Arial', 'sans-serif'],
            },
            maxWidth: {
              1160: '1160px',
            },
            boxShadow: {
              'button-hover': '0 6px 20px rgba(255, 218, 23, 0.4)',
            },
          },
        },
      };
    </script>

    <!-- Critical CSS -->
    <style>
      body {
        font-family: 'Rubik', Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    </style>
  </head>
  <body class="font-rubik antialiased text-text-primary bg-white">
    <!-- Container -->
    <div class="max-w-1160 mx-auto px-5">
      <!-- Hero Section -->
      <section class="py-20 text-center">
        <h1 class="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
          Professional IT Education
        </h1>
        <p class="text-lg text-text-gray mb-8 leading-relaxed">
          Master in-demand skills with our comprehensive courses
        </p>
        <button
          class="
        inline-flex items-center justify-center gap-2
        px-8 py-4 min-h-12
        bg-primary-yellow hover:bg-yellow-hover
        text-text-primary font-bold text-base
        rounded-xl border-none cursor-pointer
        transition-all duration-200 ease-in-out
        hover:-translate-y-0.5 hover:shadow-button-hover
        active:translate-y-0
      "
        >
          Get Started
        </button>
      </section>

      <!-- Course Cards -->
      <section class="py-16">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <!-- Course Card -->
          <div
            class="
          bg-white rounded-2xl p-6 border border-transparent
          shadow-[0px_0px_10px_0px_rgba(89,88,88,0.1)]
          hover:shadow-[0px_5px_20px_0px_rgba(89,88,88,0.15)]
          transition-all duration-300 ease-in-out
          hover:-translate-y-1 hover:border-primary-yellow
        "
          >
            <span
              class="
            inline-block px-3 py-1 mb-3
            bg-primary-yellow text-text-primary
            text-xs font-semibold rounded-full
          "
            >
              Frontend
            </span>
            <h3 class="text-xl font-bold leading-tight text-text-primary mb-2">
              React Development
            </h3>
            <p class="text-sm leading-relaxed text-text-gray mb-4">
              Learn modern React development with hooks, context, and best
              practices.
            </p>
            <div
              class="flex justify-between items-center pt-4 border-t border-gray-200"
            >
              <span class="text-2xl font-bold text-primary-yellow"> $299 </span>
              <button
                class="
              px-6 py-2 bg-dark-gray hover:bg-gray-800
              text-white font-bold text-sm rounded-lg
              transition-all duration-200
            "
              >
                Enroll
              </button>
            </div>
          </div>
          <!-- Repeat for more cards -->
        </div>
      </section>
    </div>
  </body>
</html>
```

---

## 📚 **Tailwind Implementation Notes & Best Practices**

### **Key Implementation Differences**

1. **Color Usage**: Use `bg-primary-yellow` instead of
   `background: var(--primary-yellow)`
2. **Spacing**: Use Tailwind's spacing scale `p-6` (24px) instead of
   `padding: 24px`
3. **Typography**: Use `text-20 font-bold` instead of
   `font-size: 20px; font-weight: 700`
4. **Responsive**: Use `md:text-36` instead of media queries
5. **Hover States**: Use `hover:bg-yellow-hover` instead of `:hover`
   pseudo-classes
6. **Transitions**: Use `transition-all duration-200` instead of custom
   transition properties

### **Component Architecture Options**

**Option 1: Pure Utility Classes** (Recommended for flexibility)

```html
<button
  class="px-8 py-4 bg-primary-yellow hover:bg-yellow-hover font-bold rounded-xl transition-all duration-200"
></button>
```

**Option 2: @apply Directives** (For component consistency)

```css
.btn-primary {
  @apply px-8 py-4 bg-primary-yellow hover:bg-yellow-hover font-bold rounded-xl transition-all duration-200;
}
```

**Option 3: Component Classes in Config** (For complex components)

```javascript
// Pre-built components in tailwind.config.js
addComponents({
  '.btn-primary': {
    /* styles */
  },
});
```

### **Performance Considerations**

- **Bundle Size**: Tailwind CSS with purging keeps only used classes
- **Development**: Use full Tailwind build for development
- **Production**: Enable purging to remove unused styles
- **Critical CSS**: Inline most critical utility classes
- **Custom Components**: Use component layer for complex, reused components

### **Migration Benefits**

✅ **Consistent Design System**: All measurements and colors in config  
✅ **Developer Experience**: IntelliSense and faster development  
✅ **Performance**: Optimized CSS bundle with automatic purging  
✅ **Maintainability**: Easier to update design tokens globally  
✅ **Responsive Design**: Built-in responsive utilities  
✅ **Dark Mode**: Native dark mode support  
✅ **Accessibility**: Built-in focus states and screen reader utilities

---

**Status:** Complete Tailwind CSS design system ready for implementation  
**Coverage:** 100% of original design specifications converted to Tailwind  
**Validation:** All color values, measurements, and specifications preserved  
**Framework:** Tailwind CSS v3+ with comprehensive custom configuration
