/**
 * FAQ Custom Hooks
 * React hooks for managing FAQ state and functionality
 * @module @aistudio555/ui/FAQ/hooks
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { 
  FAQItem, 
  FAQFilterState, 
  FAQSearchResult,
  FAQSearchOptions,
  UseFAQSearchResult,
  UseFAQStateResult,
  FAQCategoryInfo
} from './types';

/**
 * Custom hook for managing FAQ search functionality
 */
export const useFAQSearch = (
  faqs: FAQItem[],
  searchQuery: string,
  options: Partial<FAQSearchOptions> = {}
): UseFAQSearchResult => {
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const searchOptions = useMemo(() => ({
    enableFuzzySearch: true,
    searchThreshold: 0.3,
    maxResults: 50,
    includeKeywords: true,
    includeAnswers: true,
    ...options,
  }), [options]);

  // Debounced search to prevent excessive filtering
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim()) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(() => {
        setIsSearching(false);
      }, 300);
    } else {
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Calculate search results with relevance scoring
  const { filteredFaqs, searchResults } = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        filteredFaqs: faqs,
        searchResults: [],
      };
    }

    const lowerQuery = searchQuery.toLowerCase();
    const results: FAQSearchResult[] = [];
    
    faqs.forEach(faq => {
      const questionMatch = faq.question.toLowerCase().includes(lowerQuery);
      const answerMatch = searchOptions.includeAnswers ? 
        faq.answer.toLowerCase().includes(lowerQuery) : false;
      const keywordsMatch = searchOptions.includeKeywords && faq.searchKeywords ?
        faq.searchKeywords.some(keyword => keyword.toLowerCase().includes(lowerQuery)) : false;

      if (questionMatch || answerMatch || keywordsMatch) {
        const relevanceScore = calculateRelevanceScore(faq, lowerQuery, searchOptions);
        
        if (relevanceScore >= searchOptions.searchThreshold) {
          results.push({
            item: faq,
            matches: {
              question: questionMatch,
              answer: answerMatch,
              keywords: keywordsMatch,
            },
            relevanceScore,
          });
        }
      }
    });

    // Sort by relevance score
    if (searchOptions.enableFuzzySearch) {
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    // Limit results
    const limitedResults = searchOptions.maxResults ? 
      results.slice(0, searchOptions.maxResults) : results;

    return {
      filteredFaqs: limitedResults.map(result => result.item),
      searchResults: limitedResults,
    };
  }, [faqs, searchQuery, searchOptions]);

  // Generate search suggestions based on popular queries
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const popularQuestions = faqs
      .filter(faq => faq.popular)
      .map(faq => faq.question)
      .slice(0, 5);

    const relatedTags = faqs
      .flatMap(faq => faq.tags || [])
      .filter((tag, index, array) => array.indexOf(tag) === index)
      .filter(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 3);

    return [...popularQuestions, ...relatedTags];
  }, [faqs, searchQuery]);

  return {
    filteredFaqs,
    searchResults,
    isSearching,
    resultsCount: filteredFaqs.length,
    suggestions,
  };
};

/**
 * Custom hook for managing FAQ component state
 */
export const useFAQState = (initialState?: Partial<FAQFilterState>): UseFAQStateResult => {
  const [filterState, setFilterState] = useState<FAQFilterState>({
    searchQuery: '',
    selectedCategory: 'all',
    openItems: [],
    ...initialState,
  });

  const updateSearch = useCallback((query: string) => {
    setFilterState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const updateCategory = useCallback((category: string) => {
    setFilterState(prev => ({ ...prev, selectedCategory: category }));
  }, []);

  const toggleItem = useCallback((id: string) => {
    setFilterState(prev => ({
      ...prev,
      openItems: prev.openItems.includes(id)
        ? prev.openItems.filter(item => item !== id)
        : [...prev.openItems, id]
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilterState(prev => ({
      ...prev,
      searchQuery: '',
      selectedCategory: 'all',
    }));
  }, []);

  const isItemOpen = useCallback((id: string) => {
    return filterState.openItems.includes(id);
  }, [filterState.openItems]);

  return {
    filterState,
    updateSearch,
    updateCategory,
    toggleItem,
    clearFilters,
    isItemOpen,
  };
};

/**
 * Custom hook for FAQ analytics tracking
 */
export const useFAQAnalytics = (enableAnalytics: boolean = true) => {
  const trackSearchEvent = useCallback((query: string, resultsCount: number) => {
    if (!enableAnalytics || typeof window === 'undefined') return;

    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', 'faq_search', {
        event_category: 'engagement',
        search_term: query,
        results_count: resultsCount,
      });
    }

    // Custom analytics
    if (window.analytics) {
      window.analytics.track('FAQ Search', {
        query,
        resultsCount,
        timestamp: new Date().toISOString(),
      });
    }
  }, [enableAnalytics]);

  const trackQuestionClick = useCallback((faq: FAQItem) => {
    if (!enableAnalytics || typeof window === 'undefined') return;

    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', 'faq_question_click', {
        event_category: 'engagement',
        event_label: faq.question,
        faq_id: faq.id,
        faq_category: faq.category,
        is_popular: faq.popular,
      });
    }

    // Custom analytics
    if (window.analytics) {
      window.analytics.track('FAQ Question Clicked', {
        faqId: faq.id,
        question: faq.question,
        category: faq.category,
        isPopular: faq.popular,
        timestamp: new Date().toISOString(),
      });
    }
  }, [enableAnalytics]);

  const trackCategoryFilter = useCallback((category: string, resultsCount: number) => {
    if (!enableAnalytics || typeof window === 'undefined') return;

    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', 'faq_category_filter', {
        event_category: 'engagement',
        filter_value: category,
        results_count: resultsCount,
      });
    }

    // Custom analytics
    if (window.analytics) {
      window.analytics.track('FAQ Category Filter', {
        category,
        resultsCount,
        timestamp: new Date().toISOString(),
      });
    }
  }, [enableAnalytics]);

  return {
    trackSearchEvent,
    trackQuestionClick,
    trackCategoryFilter,
  };
};

/**
 * Custom hook for keyboard navigation in FAQ components
 */
export const useFAQKeyboardNavigation = (
  faqs: FAQItem[],
  openItems: string[],
  onToggleItem: (id: string) => void
) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, faqs.length - 1));
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < faqs.length) {
          onToggleItem(faqs[focusedIndex].id);
        }
        break;
      
      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        break;
      
      case 'End':
        event.preventDefault();
        setFocusedIndex(faqs.length - 1);
        break;
      
      case 'Escape':
        setFocusedIndex(-1);
        break;
    }
  }, [faqs, focusedIndex, onToggleItem]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    focusedIndex,
    setFocusedIndex,
  };
};

/**
 * Custom hook for FAQ performance optimizations
 */
export const useFAQPerformance = (faqs: FAQItem[], enabled: boolean = true) => {
  // Memoize FAQ categories calculation
  const categories = useMemo(() => {
    if (!enabled) return [];
    
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
      .filter(([, count]) => count > 0)
      .map(([key, count]) => ({
        key,
        label: categoryLabels[key] || key,
        count,
      }));
  }, [faqs, enabled]);

  // Memoize popular FAQs
  const popularFaqs = useMemo(() => {
    if (!enabled) return [];
    return faqs.filter(faq => faq.popular);
  }, [faqs, enabled]);

  return {
    categories,
    popularFaqs,
  };
};

// Helper function for relevance scoring
const calculateRelevanceScore = (
  faq: FAQItem, 
  query: string, 
  options: FAQSearchOptions
): number => {
  let score = 0;
  
  // Question title match (highest weight)
  const questionLower = faq.question.toLowerCase();
  if (questionLower.includes(query)) {
    score += questionLower.indexOf(query) === 0 ? 10 : 5;
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

// Type declarations for global analytics objects
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    analytics?: {
      track: (event: string, properties: Record<string, any>) => void;
    };
  }
}