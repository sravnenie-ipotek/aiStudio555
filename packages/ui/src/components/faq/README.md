# FAQ Component System

A comprehensive, accessible, and performant FAQ (Frequently Asked Questions) component system built with React, TypeScript, and Framer Motion.

## Features

### 🎯 Core Features
- **Fully Accessible**: WCAG 2.1 AA compliant with comprehensive keyboard navigation
- **Advanced Search**: Fuzzy search with relevance scoring and real-time filtering
- **Smart Categorization**: Automatic category generation with filtering
- **Popular Questions**: Quick access panel for most frequently asked questions
- **Responsive Design**: Mobile-first design with smooth animations
- **TypeScript Support**: Fully typed with comprehensive interfaces

### 🚀 Performance Features
- **Virtual Scrolling**: Handle large FAQ lists efficiently
- **Debounced Search**: Optimized search with minimal re-renders
- **Lazy Loading**: Progressive content loading for better performance
- **Animation Optimization**: GPU-accelerated animations with Framer Motion

### 📊 Analytics & SEO
- **Built-in Analytics**: Google Analytics 4 and custom analytics support
- **SEO Optimized**: Structured data markup for rich snippets
- **Search Insights**: Track search queries and popular questions

## Components

### Core Components

#### `FAQSection`
Main orchestrator component that brings together all FAQ functionality.

```tsx
import { FAQSection } from '@aistudio555/ui';

<FAQSection
  faqs={faqData}
  title="Frequently Asked Questions"
  subtitle="Find answers to common questions"
  showSearch={true}
  showCategories={true}
  showPopularQuestions={true}
  enableAnalytics={true}
/>
```

#### `FAQHeader`
Header component with search functionality and category filtering.

```tsx
import { FAQHeader } from '@aistudio555/ui';

<FAQHeader
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  selectedCategory={category}
  onCategoryChange={setCategory}
  categories={categories}
  resultsCount={filteredFaqs.length}
/>
```

#### `FAQAccordion`
Container component for the FAQ accordion list.

```tsx
import { FAQAccordion } from '@aistudio555/ui';

<FAQAccordion
  faqs={faqs}
  openItems={openItems}
  onToggleItem={toggleItem}
  showCategory={true}
  showPopularBadge={true}
/>
```

#### `FAQItem`
Individual FAQ accordion item with full accessibility support.

```tsx
import { FAQItem } from '@aistudio555/ui';

<FAQItem
  faq={faq}
  isOpen={isOpen}
  onToggle={handleToggle}
  index={index}
  showCategory={true}
  showReadTime={true}
/>
```

#### `FAQQuickAccess`
Popular questions quick access panel.

```tsx
import { FAQQuickAccess } from '@aistudio555/ui';

<FAQQuickAccess
  faqs={popularFaqs}
  onQuestionClick={handleQuestionClick}
  maxQuestions={3}
  style="card"
/>
```

#### `FAQEmptyState`
Empty state component for when no results are found.

```tsx
import { FAQEmptyState } from '@aistudio555/ui';

<FAQEmptyState
  searchQuery={searchQuery}
  onClearSearch={clearSearch}
  onShowAll={showAll}
  showSuggestions={true}
/>
```

## Usage Examples

### Basic Usage

```tsx
import React from 'react';
import { FAQSection, FAQItem } from '@aistudio555/ui';

const faqData: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I get started?',
    answer: 'Getting started is easy! Simply sign up for an account...',
    category: 'general',
    popular: true,
    readTime: 2,
    lastUpdated: 'yesterday',
    tags: ['getting-started', 'basics'],
  },
  // ... more FAQ items
];

function MyFAQPage() {
  return (
    <FAQSection
      faqs={faqData}
      title="Help Center"
      subtitle="Find answers to your questions"
      showCTA={true}
      ctaProps={{
        title: 'Still have questions?',
        consultationText: 'Contact Support',
        consultationUrl: '/contact',
      }}
    />
  );
}
```

### Advanced Usage with Custom Hooks

```tsx
import React from 'react';
import { 
  FAQSection, 
  useFAQState, 
  useFAQSearch, 
  useFAQAnalytics 
} from '@aistudio555/ui';

function AdvancedFAQPage() {
  const { filterState, updateSearch, updateCategory, toggleItem } = useFAQState();
  
  const { filteredFaqs, isSearching, suggestions } = useFAQSearch(
    faqData,
    filterState.searchQuery,
    {
      enableFuzzySearch: true,
      searchThreshold: 0.3,
      maxResults: 50,
    }
  );

  const { trackSearchEvent, trackQuestionClick } = useFAQAnalytics(true);

  const handleSearchChange = (query: string) => {
    updateSearch(query);
    trackSearchEvent(query, filteredFaqs.length);
  };

  const handleQuestionClick = (faq: FAQItem) => {
    toggleItem(faq.id);
    trackQuestionClick(faq);
  };

  return (
    <FAQSection
      faqs={filteredFaqs}
      searchQuery={filterState.searchQuery}
      onSearchChange={handleSearchChange}
      onQuestionClick={handleQuestionClick}
      enableVirtualization={true}
      maxVisibleItems={20}
      enableAnalytics={true}
    />
  );
}
```

## Customization

### Styling with Tailwind CSS

The components use Tailwind CSS classes that align with the project's design system:

```tsx
// Custom styling example
<FAQSection
  className="bg-gradient-to-b from-white to-gray-50"
  background="gradient"
  spacing="lg"
  maxWidth="lg"
/>
```

### Custom Categories

```tsx
import { FAQCategoryInfo } from '@aistudio555/ui';

const customCategories: FAQCategoryInfo[] = [
  { key: 'all', label: 'All Questions', count: 25 },
  { key: 'billing', label: 'Billing & Pricing', count: 8 },
  { key: 'technical', label: 'Technical Support', count: 12 },
  { key: 'account', label: 'Account Management', count: 5 },
];

<FAQSection
  faqs={faqs}
  customCategories={customCategories}
/>
```

### Animation Configuration

```tsx
<FAQSection
  faqs={faqs}
  enableAnimations={true}
  staggerDelay={0.1}
  layout="featured"
/>
```

## Accessibility Features

### Keyboard Navigation
- **Tab/Shift+Tab**: Navigate between questions
- **Enter/Space**: Open/close FAQ items
- **Arrow Keys**: Navigate within accordion
- **Escape**: Close all items or exit search

### Screen Reader Support
- Semantic HTML structure
- ARIA labels and descriptions
- Live regions for dynamic content updates
- Proper heading hierarchy

### Focus Management
- Visible focus indicators
- Logical tab order
- Focus trapping in modals/dropdowns

## Performance Optimizations

### Search Optimization
- Debounced search input (300ms delay)
- Memoized filter results
- Efficient relevance scoring algorithm

### Rendering Optimization
- Virtual scrolling for large lists
- Lazy loading of non-visible content
- Optimized re-render cycles

### Animation Performance
- GPU-accelerated animations
- Reduced motion preferences respected
- Optimized Framer Motion variants

## Analytics Integration

### Google Analytics 4

```tsx
// Automatic GA4 tracking
<FAQSection
  faqs={faqs}
  enableAnalytics={true}
  onAnalyticsEvent={(event, data) => {
    // Custom analytics handling
    console.log('FAQ Event:', event, data);
  }}
/>
```

### Custom Analytics

```tsx
import { useFAQAnalytics } from '@aistudio555/ui';

const { trackSearchEvent, trackQuestionClick } = useFAQAnalytics(true);

// Manual tracking
trackSearchEvent('pricing questions', 5);
trackQuestionClick(faqItem);
```

## SEO Features

### Structured Data
Automatically generates JSON-LD structured data for FAQ rich snippets:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I get started?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Getting started is easy..."
      }
    }
  ]
}
```

### Meta Tags
Include relevant meta tags in your page head:

```html
<meta name="description" content="Find answers to frequently asked questions about our services" />
<meta property="og:title" content="FAQ - Help Center" />
<meta property="og:description" content="Get quick answers to common questions" />
```

## API Reference

### Types

#### `FAQItem`
```typescript
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: FAQCategory;
  popular?: boolean;
  tags?: string[];
  readTime?: number;
  lastUpdated?: string;
  searchKeywords?: string[];
}
```

#### `FAQSectionProps`
```typescript
interface FAQSectionProps {
  className?: string;
  faqs?: FAQItem[];
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showCategories?: boolean;
  showPopularQuestions?: boolean;
  maxPopularQuestions?: number;
  showCTA?: boolean;
  ctaProps?: FAQCTAProps;
  onQuestionClick?: (faq: FAQItem) => void;
  onSearchAnalytics?: (query: string, results: number) => void;
}
```

### Utilities

#### `createFAQItem`
Helper function to create FAQ items with proper typing:

```typescript
import { createFAQItem } from '@aistudio555/ui';

const faq = createFAQItem(
  'faq-1',
  'How do I get started?',
  'Getting started is easy...',
  {
    category: 'general',
    popular: true,
    tags: ['basics', 'getting-started'],
  }
);
```

#### `searchFAQs`
Advanced search utility:

```typescript
import { searchFAQs } from '@aistudio555/ui';

const results = searchFAQs(faqs, 'pricing', {
  enableFuzzySearch: true,
  searchThreshold: 0.3,
  maxResults: 10,
});
```

## Best Practices

### Content Guidelines
1. **Clear Questions**: Write questions as users would ask them
2. **Comprehensive Answers**: Provide complete, helpful answers
3. **Proper Categorization**: Use consistent category naming
4. **Regular Updates**: Keep content fresh with `lastUpdated` dates

### Performance Guidelines
1. **Limit FAQ Count**: Consider pagination for >50 FAQs
2. **Enable Virtualization**: For lists with >20 items
3. **Optimize Images**: Use next/image for any images in answers
4. **Debounce Search**: Default 300ms debounce is usually optimal

### Accessibility Guidelines
1. **Test with Screen Readers**: Verify with NVDA, JAWS, or VoiceOver
2. **Keyboard Navigation**: Test all interactions with keyboard only
3. **Color Contrast**: Ensure text meets WCAG AA standards
4. **Semantic HTML**: Use proper heading hierarchy

## Browser Support

- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 88+
- **Accessibility**: Screen readers and assistive technologies

## Dependencies

- React 18+
- Framer Motion 10+
- Lucide React (icons)
- class-variance-authority (styling)
- Tailwind CSS 3.4+

## License

This component system is part of the Projectdes AI Academy UI library and follows the project's licensing terms.