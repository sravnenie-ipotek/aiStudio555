/**
 * FAQ Components Export Index
 * All FAQ-related components, types, and utilities
 * @module @aistudio555/ui/FAQ
 */

// Core Components
export * from './FAQSection';
export * from './FAQHeader';
export * from './FAQAccordion';
export * from './FAQItem';
export * from './FAQQuickAccess';
export * from './FAQEmptyState';

// Types and Interfaces
export * from './types';

// Custom Hooks
export * from './hooks';

// Re-export commonly used types for convenience
export type {
  FAQItem,
  FAQCategory,
  FAQCategoryInfo,
  FAQSectionProps,
  FAQFilterState,
  FAQSearchOptions,
  FAQSearchResult,
} from './types';

// Version and metadata
export const FAQ_COMPONENT_VERSION = '1.0.0';
export const FAQ_COMPONENT_NAME = 'FAQ System';

// Default configurations
export const DEFAULT_FAQ_CONFIG = {
  maxPopularQuestions: 3,
  searchThreshold: 0.3,
  maxSearchResults: 50,
  enableAnimations: true,
  enableAnalytics: true,
  showCategories: true,
  showPopularQuestions: true,
  showCTA: true,
} as const;

// Utility functions
export const createFAQItem = (
  id: string,
  question: string,
  answer: string,
  options?: Partial<Omit<FAQItem, 'id' | 'question' | 'answer'>>
): FAQItem => ({
  id,
  question,
  answer,
  category: options?.category || 'general',
  popular: options?.popular || false,
  tags: options?.tags || [],
  readTime: options?.readTime || Math.ceil(answer.split(' ').length / 200), // Estimate based on 200 words/min
  lastUpdated: options?.lastUpdated || 'недавно',
  searchKeywords: options?.searchKeywords || [],
});

export const createFAQCategory = (
  key: string,
  label: string,
  count: number,
  icon?: React.ComponentType<{ className?: string }>
): FAQCategoryInfo => ({
  key,
  label,
  count,
  icon,
});

// Search utilities
export const searchFAQs = (
  faqs: FAQItem[],
  query: string,
  options: Partial<FAQSearchOptions> = {}
): FAQItem[] => {
  if (!query.trim()) return faqs;

  const {
    enableFuzzySearch = true,
    searchThreshold = 0.3,
    maxResults = 50,
    includeKeywords = true,
    includeAnswers = true,
  } = options;

  const lowerQuery = query.toLowerCase();
  
  let filtered = faqs.filter(faq => {
    const questionMatch = faq.question.toLowerCase().includes(lowerQuery);
    const answerMatch = includeAnswers ? 
      faq.answer.toLowerCase().includes(lowerQuery) : false;
    const keywordsMatch = includeKeywords && faq.searchKeywords ?
      faq.searchKeywords.some(keyword => keyword.toLowerCase().includes(lowerQuery)) : false;
    const tagsMatch = faq.tags ? 
      faq.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) : false;

    return questionMatch || answerMatch || keywordsMatch || tagsMatch;
  });

  // Sort by relevance if fuzzy search is enabled
  if (enableFuzzySearch) {
    filtered.sort((a, b) => {
      const aScore = calculateRelevanceScore(a, lowerQuery, { includeAnswers, includeKeywords });
      const bScore = calculateRelevanceScore(b, lowerQuery, { includeAnswers, includeKeywords });
      return bScore - aScore;
    });
  }

  // Limit results if specified
  if (maxResults && filtered.length > maxResults) {
    filtered = filtered.slice(0, maxResults);
  }

  return filtered;
};

// Helper function for relevance scoring
const calculateRelevanceScore = (
  faq: FAQItem, 
  query: string, 
  options: { includeAnswers: boolean; includeKeywords: boolean }
): number => {
  let score = 0;
  
  // Question title match (highest weight)
  if (faq.question.toLowerCase().includes(query)) {
    score += faq.question.toLowerCase().indexOf(query) === 0 ? 10 : 5;
  }
  
  // Answer match (medium weight)
  if (options.includeAnswers && faq.answer.toLowerCase().includes(query)) {
    score += 3;
  }
  
  // Keywords match (medium weight)
  if (options.includeKeywords && faq.searchKeywords) {
    faq.searchKeywords.forEach(keyword => {
      if (keyword.toLowerCase().includes(query)) {
        score += 2;
      }
    });
  }
  
  // Tags match (low weight)
  if (faq.tags) {
    faq.tags.forEach(tag => {
      if (tag.toLowerCase().includes(query)) {
        score += 1;
      }
    });
  }
  
  // Popular questions get bonus
  if (faq.popular) {
    score += 1;
  }
  
  return score;
};

// Category utilities
export const groupFAQsByCategory = (faqs: FAQItem[]): Record<string, FAQItem[]> => {
  return faqs.reduce((groups, faq) => {
    const category = faq.category || 'general';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(faq);
    return groups;
  }, {} as Record<string, FAQItem[]>);
};

export const generateCategoriesFromFAQs = (faqs: FAQItem[]): FAQCategoryInfo[] => {
  const categoryMap = new Map<string, number>();
  categoryMap.set('all', faqs.length);
  
  faqs.forEach(faq => {
    if (faq.category) {
      categoryMap.set(faq.category, (categoryMap.get(faq.category) || 0) + 1);
    }
  });

  const categoryLabels: Record<string, string> = {
    all: 'Все',
    general: 'Общие',
    courses: 'Курсы',
    payment: 'Оплата',
    technical: 'Поддержка',
    enrollment: 'Запись',
    certification: 'Сертификация',
  };

  return Array.from(categoryMap.entries())
    .filter(([key, count]) => count > 0)
    .map(([key, count]) => ({
      key,
      label: categoryLabels[key] || key,
      count,
    }));
};