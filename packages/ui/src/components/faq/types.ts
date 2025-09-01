/**
 * FAQ Component Types & Interfaces
 * Comprehensive type definitions for the FAQ system
 * @module @aistudio555/ui/FAQ/types
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: FAQCategory;
  popular?: boolean;
  tags?: string[];
  readTime?: number; // estimated reading time in minutes
  lastUpdated?: string;
  searchKeywords?: string[]; // additional search terms
}

export type FAQCategory = 'general' | 'courses' | 'payment' | 'technical' | 'enrollment' | 'certification';

export interface FAQCategoryInfo {
  key: string;
  label: string;
  count: number;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface FAQSearchResult {
  item: FAQItem;
  matches: {
    question: boolean;
    answer: boolean;
    keywords: boolean;
  };
  relevanceScore: number;
}

export interface FAQSectionProps {
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

export interface FAQHeaderProps {
  title?: string;
  subtitle?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: FAQCategoryInfo[];
  resultsCount?: number;
  searchPlaceholder?: string;
  showBadge?: boolean;
  badgeText?: string;
}

export interface FAQAccordionProps {
  faqs: FAQItem[];
  openItems: string[];
  onToggleItem: (id: string) => void;
  className?: string;
  showCategory?: boolean;
  showPopularBadge?: boolean;
  showReadTime?: boolean;
  showLastUpdated?: boolean;
  animationDelay?: number;
}

export interface FAQItemProps {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  showCategory?: boolean;
  showPopularBadge?: boolean;
  showReadTime?: boolean;
  showLastUpdated?: boolean;
  className?: string;
}

export interface FAQQuickAccessProps {
  faqs: FAQItem[];
  onQuestionClick: (id: string) => void;
  title?: string;
  maxQuestions?: number;
  className?: string;
}

export interface FAQEmptyStateProps {
  searchQuery: string;
  onClearSearch: () => void;
  onShowAll: () => void;
  title?: string;
  description?: string;
  clearButtonText?: string;
  showAllButtonText?: string;
  className?: string;
}

export interface FAQCTAProps {
  title?: string;
  subtitle?: string;
  consultationText?: string;
  coursesText?: string;
  consultationUrl?: string;
  coursesUrl?: string;
  showStats?: boolean;
  stats?: Array<{
    value: string;
    label: string;
    color?: 'primary' | 'success' | 'info' | 'warning';
  }>;
}

export interface FAQFilterState {
  searchQuery: string;
  selectedCategory: string;
  openItems: string[];
}

export interface FAQSearchOptions {
  enableFuzzySearch?: boolean;
  searchThreshold?: number; // minimum relevance score
  maxResults?: number;
  includeKeywords?: boolean;
  includeAnswers?: boolean;
}

// Animation variants for Framer Motion
export interface FAQAnimationVariants {
  container: {
    hidden: { opacity: number; y: number };
    visible: { 
      opacity: number; 
      y: number;
      transition: {
        duration: number;
        staggerChildren: number;
      };
    };
  };
  item: {
    hidden: { opacity: number; y: number };
    visible: { 
      opacity: number; 
      y: number;
      transition: {
        duration: number;
      };
    };
  };
  accordion: {
    closed: { height: number; opacity: number };
    open: { 
      height: string; 
      opacity: number;
      transition: {
        duration: number;
        ease: string;
      };
    };
  };
}

// Accessibility props
export interface FAQAccessibilityProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  role?: string;
  tabIndex?: number;
}

// Hook return types
export interface UseFAQSearchResult {
  filteredFaqs: FAQItem[];
  searchResults: FAQSearchResult[];
  isSearching: boolean;
  resultsCount: number;
  suggestions: string[];
}

export interface UseFAQStateResult {
  filterState: FAQFilterState;
  updateSearch: (query: string) => void;
  updateCategory: (category: string) => void;
  toggleItem: (id: string) => void;
  clearFilters: () => void;
  isItemOpen: (id: string) => boolean;
}