# TeachMeSkills.by Design Analysis & Extraction

## Overview
Complete design analysis and HTML structure extraction from https://teachmeskills.by/ for reference in AiStudio555 Academy development.

## Site Architecture & Technology Stack

### Platform
- **CMS**: Tilda platform
- **Domain**: teachmeskills.by
- **Primary Language**: Russian (with English elements)
- **Structure**: Single-page with modular sections

### Design System Analysis

#### Color Palette
```css
/* Primary Colors */
--primary-black: #070707;
--accent-yellow: #ffda17;
--background-light: #f4f5f7;
--text-primary: #070707;
--text-secondary: #666666;
--white: #ffffff;

/* Additional Colors */
--border-light: #e6e6e6;
--shadow-color: rgba(0, 0, 0, 0.1);
```

#### Typography System
```css
/* Font Family */
font-family: 'Rubik', sans-serif;

/* Font Weights */
--font-regular: 400;
--font-medium: 500;
--font-bold: 700;

/* Font Sizes */
--heading-xl: 48px;
--heading-lg: 36px;
--heading-md: 24px;
--heading-sm: 20px;
--body-lg: 18px;
--body-md: 16px;
--body-sm: 14px;
--caption: 12px;
```

#### Spacing System
```css
/* Based on 8px grid system */
--space-xs: 8px;
--space-sm: 16px;
--space-md: 24px;
--space-lg: 32px;
--space-xl: 48px;
--space-xxl: 64px;
--space-xxxl: 96px;
```

#### Border Radius
```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 24px;
--radius-xl: 32px;
```

## Key Components Identified

### 1. Navigation Component
```html
<!-- Main Navigation Structure -->
<div class="t-header">
  <nav class="t-menu">
    <div class="t-logo">
      <img src="logo.svg" alt="TeachMeSkills">
    </div>
    <ul class="t-menu-list">
      <li><a href="/kursy">Курсы</a></li>
      <li><a href="/teachers">Преподаватели</a></li>
      <li><a href="/blog">Блог</a></li>
      <li class="dropdown">О школе</li>
    </ul>
  </nav>
</div>
```

**Navigation Styling Pattern:**
- Fixed header with transparent background on scroll
- Horizontal menu with hover effects
- Mobile hamburger menu
- Logo on the left, menu items on the right

### 2. Hero Section
```html
<!-- Hero Section Structure -->
<section class="hero-section">
  <div class="hero-content">
    <h1>Научим программировать и поможем стать ITшником</h1>
    <p class="hero-description">Онлайн-курсы по IT-профессиям</p>
    <div class="hero-buttons">
      <button class="btn-primary">Выбрать курс</button>
      <button class="btn-secondary">Записаться на консультацию</button>
    </div>
  </div>
  <div class="hero-image">
    <!-- Hero illustration/image -->
  </div>
</section>
```

### 3. Course Card Component
```html
<!-- Course Card Structure -->
<div class="course-card">
  <div class="course-image">
    <img src="course-thumbnail.jpg" alt="Course">
  </div>
  <div class="course-content">
    <h3 class="course-title">Front End разработчик</h3>
    <p class="course-description">Создание интерфейсов веб-сайтов</p>
    <div class="course-meta">
      <span class="duration">4 месяца</span>
      <span class="level">С нуля</span>
    </div>
    <div class="course-price">
      <span class="current-price">290 BYN/мес</span>
      <span class="original-price">320 BYN/мес</span>
    </div>
    <button class="btn-course">Подробнее</button>
  </div>
</div>
```

### 4. Button System
```css
/* Primary Button */
.btn-primary {
  background-color: #ffda17;
  color: #070707;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #e6c315;
  transform: translateY(-2px);
}

/* Secondary Button */
.btn-secondary {
  background-color: transparent;
  color: #070707;
  border: 2px solid #070707;
  border-radius: 12px;
  padding: 14px 30px;
  font-weight: 700;
  font-size: 16px;
}

/* Course Button */
.btn-course {
  background-color: #070707;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  width: 100%;
}
```

## Layout Patterns

### Grid System
- **Container Max Width**: 1200px
- **Grid Columns**: 12-column grid system
- **Gutters**: 24px between columns
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### Section Structure
```html
<!-- Common Section Pattern -->
<section class="section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Section Title</h2>
      <p class="section-description">Section description</p>
    </div>
    <div class="section-content">
      <!-- Section specific content -->
    </div>
  </div>
</section>
```

## Interactive Elements

### Animation Patterns
- Scroll-triggered animations
- Hover effects on cards and buttons
- Smooth transitions (0.3s ease)
- Subtle micro-interactions

### JavaScript Functionality
- Mobile menu toggle
- Course filtering/sorting
- Scroll-based header changes
- Form validation and submission
- Analytics tracking

## Responsive Design

### Mobile-First Approach
```css
/* Mobile Base Styles */
.course-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

/* Tablet */
@media (min-width: 768px) {
  .course-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .course-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
}
```

## Content Structure

### Course Categories
1. **Front End разработчик** - 4 месяца, с нуля
2. **Python разработчик** - 5 месяцев, с нуля  
3. **iOS разработчик** - 4 месяца, с нуля
4. **UX/UI дизайнер** - 4 месяца, с нуля
5. **Тестировщик** - 3 месяца, с нуля
6. **Java разработчик** - 5 месяцев, с нуля

### Key Features Highlighted
- Онлайн обучение
- Поддержка преподавателей
- Помощь в трудоустройстве
- Практические проекты
- Сертификация

## Implementation Notes for AiStudio555 Academy

### Similarities to Leverage
1. **Color Scheme**: Black + Yellow accent works well
2. **Typography**: Rubik font family is professional and readable
3. **Card-based Layout**: Course cards with clear hierarchy
4. **CTA Strategy**: Multiple action buttons with clear hierarchy
5. **Mobile-first**: Strong responsive implementation

### Adaptations Needed
1. **Brand Colors**: Adapt to AiStudio555 brand (#635bff primary)
2. **Course Structure**: Adjust for AI-focused content
3. **Pricing Display**: Implement installment plans
4. **Multi-language**: Russian/Hebrew/English support
5. **Payment Integration**: Stripe/PayPal integration

### Technical Considerations
1. **Platform**: Next.js vs Tilda approach
2. **Performance**: Optimize for Lighthouse scores
3. **SEO**: Better meta tags and structured data
4. **Accessibility**: WCAG 2.1 AA compliance
5. **Analytics**: GA4 and GTM integration

---

*Analysis completed on 2025-08-31*
*Source: https://teachmeskills.by/*