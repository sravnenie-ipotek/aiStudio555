'use client'

/**
 * FAQSection Component
 * Main orchestrator component that brings together all FAQ functionality
 * @module @aistudio555/ui/FAQ/FAQSection
 */

import React, { forwardRef, useState, useMemo, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { FAQHeader } from './FAQHeader';
import { FAQAccordion } from './FAQAccordion';
import { FAQQuickAccess } from './FAQQuickAccess';
import { FAQEmptyState } from './FAQEmptyState';
import { Button } from '../Button';
import { 
  MessageCircle, 
  GraduationCap, 
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Star,
  Award,
  Target
} from 'lucide-react';
import type { 
  FAQSectionProps, 
  FAQItem, 
  FAQCategoryInfo, 
  FAQFilterState,
  FAQSearchOptions
} from './types';

// Default FAQ data for demonstration
const defaultFaqs: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Как записаться на курс AI Transformation Manager?',
    answer: 'Для записи на курс вы можете воспользоваться формой регистрации на нашем сайте или связаться с нашими консультантами. Мы предлагаем гибкие варианты оплаты, включая рассрочку.',
    category: 'enrollment',
    popular: true,
    readTime: 2,
    lastUpdated: 'вчера',
    tags: ['запись', 'регистрация', 'AI'],
  },
  {
    id: 'faq-2',
    question: 'Какие способы оплаты доступны?',
    answer: 'Мы принимаем оплату банковскими картами, банковскими переводами, через электронные кошельки. Также доступна рассрочка на 3, 6 и 12 месяцев.',
    category: 'payment',
    popular: true,
    readTime: 1,
    lastUpdated: '2 дня назад',
    tags: ['оплата', 'рассрочка', 'способы оплаты'],
  },
  {
    id: 'faq-3',
    question: 'Получу ли я сертификат по окончании курса?',
    answer: 'Да, по окончании курса вы получите официальный сертификат Projectdes AI Academy, который признается ведущими компаниями в области AI и технологий.',
    category: 'certification',
    popular: true,
    readTime: 1,
    lastUpdated: 'неделю назад',
    tags: ['сертификат', 'документ', 'окончание'],
  },
  {
    id: 'faq-4',
    question: 'Нужен ли опыт программирования для курса No-Code Website Development?',
    answer: 'Нет, курс специально разработан для людей без опыта программирования. Мы обучаем создавать сайты с помощью современных no-code инструментов.',
    category: 'courses',
    popular: false,
    readTime: 2,
    lastUpdated: '3 дня назад',
    tags: ['программирование', 'опыт', 'no-code'],
  },
  {
    id: 'faq-5',
    question: 'Как получить техническую поддержку?',
    answer: 'Техническая поддержка доступна 24/7 через чат на сайте, email support@projectdes.ai или телефон. Средний время ответа - менее 2 часов.',
    category: 'technical',
    popular: false,
    readTime: 1,
    lastUpdated: 'сегодня',
    tags: ['поддержка', 'помощь', 'контакты'],
  },
];

const faqSectionVariants = cva(
  'py-8 lg:py-12',
  {
    variants: {
      background: {
        white: 'bg-white',
        light: 'bg-light-bg',
        gradient: 'bg-gradient-to-b from-white to-light-bg',
      },
      spacing: {
        sm: 'py-6 lg:py-8',
        md: 'py-8 lg:py-12',
        lg: 'py-12 lg:py-16',
      },
      maxWidth: {
        sm: 'max-w-3xl',
        md: 'max-w-4xl',
        lg: 'max-w-6xl',
        full: 'max-w-none',
      },
    },
    defaultVariants: {
      background: 'light',
      spacing: 'md',
      maxWidth: 'md',
    },
  }
);

interface FAQSectionExtendedProps extends FAQSectionProps, VariantProps<typeof faqSectionVariants> {
  // Advanced search options
  searchOptions?: FAQSearchOptions;
  // Custom categories
  customCategories?: FAQCategoryInfo[];
  // Performance options
  enableVirtualization?: boolean;
  maxVisibleItems?: number;
  // Analytics
  enableAnalytics?: boolean;
  onAnalyticsEvent?: (event: string, data: any) => void;
  // Layout options
  layout?: 'standard' | 'compact' | 'featured';
  // Animation options
  enableAnimations?: boolean;
  staggerDelay?: number;
}

const FAQSection = forwardRef<HTMLElement, FAQSectionExtendedProps>(
  ({
    className,
    faqs = defaultFaqs,
    title,
    subtitle,
    searchPlaceholder,
    showSearch = true,
    showCategories = true,
    showPopularQuestions = true,
    maxPopularQuestions = 3,
    showCTA = true,
    ctaProps,
    onQuestionClick,
    onSearchAnalytics,
    background = 'light',
    spacing,
    maxWidth,
    searchOptions = {
      enableFuzzySearch: true,
      searchThreshold: 0.3,
      maxResults: 50,
      includeKeywords: true,
      includeAnswers: true,
    },
    customCategories,
    enableVirtualization = false,
    maxVisibleItems = 20,
    enableAnalytics = true,
    onAnalyticsEvent,
    layout = 'standard',
    enableAnimations = true,
    staggerDelay = 0.05,
    ...props
  }, ref) => {

    // State management
    const [filterState, setFilterState] = useState<FAQFilterState>({
      searchQuery: '',
      selectedCategory: 'all',
      openItems: [],
    });

    // Intersection observer for animations
    const { ref: containerRef, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    // Generate categories from FAQ data
    const categories: FAQCategoryInfo[] = useMemo(() => {
      if (customCategories) return customCategories;
      
      const categoryMap = new Map<string, number>();
      categoryMap.set('all', faqs.length);
      
      faqs.forEach(faq => {
        if (faq.category) {
          categoryMap.set(faq.category, (categoryMap.get(faq.category) || 0) + 1);
        }
      });

      return [
        { key: 'all', label: 'Все', count: faqs.length },
        { key: 'general', label: 'Общие', count: categoryMap.get('general') || 0 },
        { key: 'courses', label: 'Курсы', count: categoryMap.get('courses') || 0 },
        { key: 'payment', label: 'Оплата', count: categoryMap.get('payment') || 0 },
        { key: 'technical', label: 'Поддержка', count: categoryMap.get('technical') || 0 },
        { key: 'enrollment', label: 'Запись', count: categoryMap.get('enrollment') || 0 },
        { key: 'certification', label: 'Сертификация', count: categoryMap.get('certification') || 0 },
      ].filter(category => category.count > 0);
    }, [faqs, customCategories]);

    // Advanced search and filtering
    const filteredFaqs = useMemo(() => {
      let filtered = [...faqs];

      // Category filter
      if (filterState.selectedCategory !== 'all') {
        filtered = filtered.filter(faq => faq.category === filterState.selectedCategory);
      }

      // Search filter with fuzzy matching
      if (filterState.searchQuery) {
        const query = filterState.searchQuery.toLowerCase();
        
        filtered = filtered.filter(faq => {
          const questionMatch = faq.question.toLowerCase().includes(query);
          const answerMatch = searchOptions.includeAnswers ? 
            faq.answer.toLowerCase().includes(query) : false;
          const keywordsMatch = searchOptions.includeKeywords && faq.searchKeywords ?
            faq.searchKeywords.some(keyword => keyword.toLowerCase().includes(query)) : false;
          const tagsMatch = faq.tags ? 
            faq.tags.some(tag => tag.toLowerCase().includes(query)) : false;

          return questionMatch || answerMatch || keywordsMatch || tagsMatch;
        });

        // Sort by relevance if fuzzy search is enabled
        if (searchOptions.enableFuzzySearch) {
          filtered.sort((a, b) => {
            const aScore = calculateRelevanceScore(a, query);
            const bScore = calculateRelevanceScore(b, query);
            return bScore - aScore;
          });
        }
      }

      // Limit results if specified
      if (searchOptions.maxResults && filtered.length > searchOptions.maxResults) {
        filtered = filtered.slice(0, searchOptions.maxResults);
      }

      return filtered;
    }, [faqs, filterState, searchOptions]);

    // Calculate relevance score for search results
    const calculateRelevanceScore = useCallback((faq: FAQItem, query: string): number => {
      let score = 0;
      const lowerQuery = query.toLowerCase();
      
      // Question title match (highest weight)
      if (faq.question.toLowerCase().includes(lowerQuery)) {
        score += faq.question.toLowerCase().indexOf(lowerQuery) === 0 ? 10 : 5;
      }
      
      // Answer match (medium weight)
      if (searchOptions.includeAnswers && faq.answer.toLowerCase().includes(lowerQuery)) {
        score += 3;
      }
      
      // Keywords match (medium weight)
      if (searchOptions.includeKeywords && faq.searchKeywords) {
        faq.searchKeywords.forEach(keyword => {
          if (keyword.toLowerCase().includes(lowerQuery)) {
            score += 2;
          }
        });
      }
      
      // Tags match (low weight)
      if (faq.tags) {
        faq.tags.forEach(tag => {
          if (tag.toLowerCase().includes(lowerQuery)) {
            score += 1;
          }
        });
      }
      
      // Popular questions get bonus
      if (faq.popular) {
        score += 1;
      }
      
      return score;
    }, [searchOptions]);

    // Event handlers
    const handleSearchChange = useCallback((query: string) => {
      setFilterState(prev => ({ ...prev, searchQuery: query }));
      
      if (onSearchAnalytics && enableAnalytics) {
        onSearchAnalytics(query, filteredFaqs.length);
      }
      
      if (onAnalyticsEvent && enableAnalytics) {
        onAnalyticsEvent('faq_search', {
          query,
          results_count: filteredFaqs.length,
          category: filterState.selectedCategory,
        });
      }
    }, [filteredFaqs.length, onSearchAnalytics, enableAnalytics, onAnalyticsEvent, filterState.selectedCategory]);

    const handleCategoryChange = useCallback((category: string) => {
      setFilterState(prev => ({ ...prev, selectedCategory: category }));
      
      if (onAnalyticsEvent && enableAnalytics) {
        onAnalyticsEvent('faq_category_filter', {
          category,
          results_count: filteredFaqs.length,
        });
      }
    }, [filteredFaqs.length, onAnalyticsEvent, enableAnalytics]);

    const handleToggleItem = useCallback((id: string) => {
      setFilterState(prev => ({
        ...prev,
        openItems: prev.openItems.includes(id)
          ? prev.openItems.filter(item => item !== id)
          : [...prev.openItems, id]
      }));
      
      if (onAnalyticsEvent && enableAnalytics) {
        const faq = faqs.find(f => f.id === id);
        onAnalyticsEvent('faq_item_toggle', {
          faq_id: id,
          question: faq?.question,
          category: faq?.category,
          is_popular: faq?.popular,
        });
      }
    }, [faqs, onAnalyticsEvent, enableAnalytics]);

    const handleQuestionClick = useCallback((id: string) => {
      if (onQuestionClick) {
        const faq = faqs.find(f => f.id === id);
        onQuestionClick(faq!);
      }
      handleToggleItem(id);
    }, [faqs, onQuestionClick, handleToggleItem]);

    const handleClearSearch = useCallback(() => {
      setFilterState(prev => ({ ...prev, searchQuery: '' }));
    }, []);

    const handleShowAll = useCallback(() => {
      setFilterState(prev => ({ 
        ...prev, 
        searchQuery: '', 
        selectedCategory: 'all' 
      }));
    }, []);

    // SEO structured data
    const structuredData = useMemo(() => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": filteredFaqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }), [filteredFaqs]);

    return (
      <>
        {/* SEO Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        <section
          ref={ref}
          className={faqSectionVariants({ background, spacing, className })}
          {...props}
        >
          <div className={`${maxWidth === 'full' ? '' : faqSectionVariants({ maxWidth })} mx-auto px-4 lg:px-6`}>
            
            {/* Header Section */}
            <FAQHeader
              ref={containerRef}
              title={title}
              subtitle={subtitle}
              searchQuery={filterState.searchQuery}
              onSearchChange={handleSearchChange}
              selectedCategory={filterState.selectedCategory}
              onCategoryChange={handleCategoryChange}
              categories={categories}
              resultsCount={filteredFaqs.length}
              searchPlaceholder={searchPlaceholder}
              showBadge={layout !== 'compact'}
              size={layout === 'compact' ? 'sm' : 'md'}
            />

            {/* Quick Access Section */}
            {showPopularQuestions && filterState.selectedCategory === 'all' && filterState.searchQuery === '' && (
              <FAQQuickAccess
                faqs={faqs}
                onQuestionClick={handleQuestionClick}
                maxQuestions={maxPopularQuestions}
                variant={layout === 'featured' ? 'featured' : 'default'}
                style={layout === 'compact' ? 'minimal' : 'card'}
              />
            )}

            {/* Main Content Area */}
            <motion.div
              initial={enableAnimations ? { opacity: 0, y: 20 } : {}}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {filteredFaqs.length > 0 ? (
                <FAQAccordion
                  faqs={enableVirtualization ? filteredFaqs.slice(0, maxVisibleItems) : filteredFaqs}
                  openItems={filterState.openItems}
                  onToggleItem={handleToggleItem}
                  showCategory={showCategories}
                  showPopularBadge={true}
                  showReadTime={layout !== 'compact'}
                  showLastUpdated={layout === 'featured'}
                  animationDelay={enableAnimations ? staggerDelay : 0}
                  size={layout === 'compact' ? 'sm' : 'md'}
                  layout={maxWidth === 'full' ? 'full' : 'centered'}
                />
              ) : (
                <FAQEmptyState
                  searchQuery={filterState.searchQuery}
                  onClearSearch={handleClearSearch}
                  onShowAll={handleShowAll}
                  variant={layout === 'compact' ? 'compact' : 'default'}
                  theme={background === 'white' ? 'light' : 'neutral'}
                  showSuggestions={layout !== 'compact'}
                />
              )}
            </motion.div>

            {/* CTA Section */}
            {showCTA && (
              <motion.div
                initial={enableAnimations ? { opacity: 0, y: 20 } : {}}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-12"
              >
                <div className="bg-white rounded-xl border border-border-light p-8 shadow-sm">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-yellow/20 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary-yellow" />
                      </div>
                      <div className="text-left">
                        <p className="text-xl font-bold text-text-primary mb-1">
                          {ctaProps?.title || 'Остались вопросы?'}
                        </p>
                        <p className="text-text-gray">
                          {ctaProps?.subtitle || 'Получите персональную консультацию'}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-text-light">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-success" />
                            Бесплатно
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-accent-blue" />
                            15 минут
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="primary"
                        size="lg"
                        leftIcon={<MessageCircle className="w-5 h-5" />}
                        className="min-w-[180px]"
                      >
                        {ctaProps?.consultationText || 'Задать вопрос'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="lg"
                        leftIcon={<GraduationCap className="w-5 h-5" />}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                        className="min-w-[140px] group"
                      >
                        <span className="group-hover:text-primary-yellow transition-colors">
                          {ctaProps?.coursesText || 'Все курсы'}
                        </span>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Stats Row */}
                  {ctaProps?.showStats !== false && (
                    <div className="flex items-center justify-center gap-8 mt-8 pt-6 border-t border-border-light text-center">
                      {(ctaProps?.stats || [
                        { value: '500+', label: 'Отвеченных вопросов', color: 'primary' as const },
                        { value: '<24ч', label: 'Время ответа', color: 'success' as const },
                        { value: '98%', label: 'Довольных клиентов', color: 'info' as const },
                      ]).map((stat, index) => (
                        <div key={index}>
                          <div className={`text-2xl font-bold mb-1 ${
                            stat.color === 'primary' ? 'text-primary-yellow' :
                            stat.color === 'success' ? 'text-success' :
                            stat.color === 'info' ? 'text-accent-blue' :
                            stat.color === 'warning' ? 'text-warning' :
                            'text-text-primary'
                          }`}>
                            {stat.value}
                          </div>
                          <div className="text-sm text-text-gray">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </>
    );
  }
);

FAQSection.displayName = 'FAQSection';

export { FAQSection, faqSectionVariants };
export type { FAQSectionProps, FAQSectionExtendedProps };