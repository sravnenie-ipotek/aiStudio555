'use client'

/**
 * FAQ Component Usage Example
 * Demonstrates how to use the FAQ component system
 * @module @aistudio555/ui/FAQ/example
 */

import React from 'react';
import { 
  FAQSection, 
  FAQItem, 
  createFAQItem,
  useFAQState,
  useFAQSearch,
  useFAQAnalytics 
} from './index';
import type { FAQItem as FAQItemType } from './types';

// Example FAQ data
const exampleFAQs: FAQItemType[] = [
  createFAQItem(
    'faq-1',
    'Как записаться на курс AI Transformation Manager?',
    'Для записи на курс вы можете воспользоваться формой регистрации на нашем сайте или связаться с нашими консультантами. Мы предлагаем гибкие варианты оплаты, включая рассрочку на 3, 6 и 12 месяцев.',
    {
      category: 'enrollment',
      popular: true,
      readTime: 2,
      lastUpdated: 'вчера',
      tags: ['запись', 'регистрация', 'AI', 'рассрочка'],
      searchKeywords: ['регистрация', 'подписаться', 'enrollment'],
    }
  ),
  createFAQItem(
    'faq-2',
    'Какие способы оплаты доступны?',
    'Мы принимаем оплату банковскими картами (Visa, MasterCard), банковскими переводами, через PayPal и электронные кошельки. Также доступна беспроцентная рассрочка на 3, 6 и 12 месяцев.',
    {
      category: 'payment',
      popular: true,
      readTime: 1,
      lastUpdated: '2 дня назад',
      tags: ['оплата', 'рассрочка', 'способы оплаты', 'карта'],
      searchKeywords: ['payment', 'деньги', 'стоимость'],
    }
  ),
  createFAQItem(
    'faq-3',
    'Получу ли я сертификат по окончании курса?',
    'Да, по окончании курса вы получите официальный сертификат Projectdes AI Academy, который признается ведущими компаниями в области AI и технологий. Сертификат выдается в электронном виде с возможностью печати.',
    {
      category: 'certification',
      popular: true,
      readTime: 1,
      lastUpdated: 'неделю назад',
      tags: ['сертификат', 'документ', 'окончание', 'диплом'],
      searchKeywords: ['certificate', 'документы', 'подтверждение'],
    }
  ),
  createFAQItem(
    'faq-4',
    'Нужен ли опыт программирования для курса No-Code Website Development?',
    'Нет, курс специально разработан для людей без опыта программирования. Мы обучаем создавать профессиональные сайты с помощью современных no-code инструментов таких как Webflow, Bubble, и Framer.',
    {
      category: 'courses',
      popular: false,
      readTime: 2,
      lastUpdated: '3 дня назад',
      tags: ['программирование', 'опыт', 'no-code', 'новичок'],
      searchKeywords: ['coding', 'programming', 'development'],
    }
  ),
  createFAQItem(
    'faq-5',
    'Как получить техническую поддержку во время обучения?',
    'Техническая поддержка доступна 24/7 через чат на сайте, email support@projectdes.ai или телефон +7 (495) 123-45-67. Средний время ответа - менее 2 часов. Также у вас есть доступ к форуму студентов.',
    {
      category: 'technical',
      popular: false,
      readTime: 1,
      lastUpdated: 'сегодня',
      tags: ['поддержка', 'помощь', 'контакты', 'чат'],
      searchKeywords: ['support', 'help', 'assistance'],
    }
  ),
  createFAQItem(
    'faq-6',
    'Можно ли учиться в своем темпе или есть строгое расписание?',
    'Наши курсы разработаны для гибкого обучения. Вы можете учиться в удобном для вас темпе, но мы рекомендуем придерживаться рекомендуемого графика для лучших результатов. Материалы остаются доступными в течение 12 месяцев после покупки.',
    {
      category: 'courses',
      popular: false,
      readTime: 2,
      lastUpdated: '5 дней назад',
      tags: ['расписание', 'темп', 'гибкость', 'время'],
      searchKeywords: ['schedule', 'flexible', 'timing'],
    }
  ),
];

// Basic Usage Example
export function BasicFAQExample() {
  return (
    <div className="min-h-screen bg-light-bg">
      <div className="container mx-auto py-12">
        <FAQSection
          faqs={exampleFAQs}
          title="Часто задаваемые вопросы"
          subtitle="Найдите ответы на самые популярные вопросы о наших курсах"
          showSearch={true}
          showCategories={true}
          showPopularQuestions={true}
          maxPopularQuestions={3}
          showCTA={true}
          ctaProps={{
            title: 'Остались вопросы?',
            subtitle: 'Получите персональную консультацию от наших экспертов',
            consultationText: 'Задать вопрос',
            coursesText: 'Все курсы',
            consultationUrl: '/consultation',
            coursesUrl: '/courses',
            showStats: true,
            stats: [
              { value: '500+', label: 'Отвеченных вопросов', color: 'primary' },
              { value: '<24ч', label: 'Время ответа', color: 'success' },
              { value: '98%', label: 'Довольных студентов', color: 'info' },
            ],
          }}
          enableAnalytics={true}
          background="light"
          spacing="lg"
          maxWidth="md"
        />
      </div>
    </div>
  );
}

// Advanced Usage Example with Custom Hooks
export function AdvancedFAQExample() {
  const { filterState, updateSearch, updateCategory, toggleItem, clearFilters } = useFAQState({
    searchQuery: '',
    selectedCategory: 'all',
    openItems: [],
  });

  const { filteredFaqs, isSearching, suggestions, resultsCount } = useFAQSearch(
    exampleFAQs,
    filterState.searchQuery,
    {
      enableFuzzySearch: true,
      searchThreshold: 0.2,
      maxResults: 20,
      includeKeywords: true,
      includeAnswers: true,
    }
  );

  const { trackSearchEvent, trackQuestionClick, trackCategoryFilter } = useFAQAnalytics(true);

  // Handle search with analytics
  const handleSearchChange = (query: string) => {
    updateSearch(query);
    if (query.trim()) {
      trackSearchEvent(query, filteredFaqs.length);
    }
  };

  // Handle category change with analytics
  const handleCategoryChange = (category: string) => {
    updateCategory(category);
    trackCategoryFilter(category, filteredFaqs.length);
  };

  // Handle question click with analytics
  const handleQuestionClick = (faq: FAQItemType) => {
    toggleItem(faq.id);
    trackQuestionClick(faq);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-light-bg">
      <div className="container mx-auto py-12">
        <FAQSection
          faqs={filteredFaqs}
          title="AI Academy - Центр поддержки"
          subtitle="Интеллектуальный поиск ответов на ваши вопросы"
          searchQuery={filterState.searchQuery}
          onSearchChange={handleSearchChange}
          selectedCategory={filterState.selectedCategory}
          onCategoryChange={handleCategoryChange}
          onQuestionClick={handleQuestionClick}
          showSearch={true}
          showCategories={true}
          showPopularQuestions={filterState.searchQuery === '' && filterState.selectedCategory === 'all'}
          maxPopularQuestions={3}
          showCTA={true}
          enableVirtualization={true}
          maxVisibleItems={15}
          enableAnalytics={true}
          layout="featured"
          background="gradient"
          spacing="lg"
          maxWidth="lg"
          searchOptions={{
            enableFuzzySearch: true,
            searchThreshold: 0.2,
            maxResults: 20,
            includeKeywords: true,
            includeAnswers: true,
          }}
          ctaProps={{
            title: 'Нужна дополнительная помощь?',
            subtitle: 'Наши AI-эксперты готовы помочь вам 24/7',
            consultationText: 'Связаться с экспертом',
            coursesText: 'Посмотреть курсы',
            showStats: true,
          }}
          onSearchAnalytics={(query, count) => {
            console.log('Search Analytics:', { query, resultCount: count });
          }}
          onAnalyticsEvent={(event, data) => {
            console.log('FAQ Analytics Event:', event, data);
          }}
        />

        {/* Debug Information (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Search Query: "{filterState.searchQuery}"</p>
              <p>Selected Category: {filterState.selectedCategory}</p>
              <p>Open Items: {filterState.openItems.length}</p>
              <p>Filtered Results: {resultsCount}</p>
              <p>Is Searching: {isSearching.toString()}</p>
              <p>Suggestions: {suggestions.length > 0 ? suggestions.join(', ') : 'None'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact Layout Example
export function CompactFAQExample() {
  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <FAQSection
          faqs={exampleFAQs.slice(0, 4)} // Show only first 4 questions
          title="Быстрые ответы"
          subtitle="Основные вопросы о наших курсах"
          layout="compact"
          background="white"
          spacing="sm"
          maxWidth="sm"
          showPopularQuestions={false}
          showCTA={false}
          enableAnimations={false}
        />
      </div>
    </div>
  );
}

// Custom Category Example
export function CustomCategoryFAQExample() {
  const customCategories = [
    { key: 'all', label: 'Все вопросы', count: exampleFAQs.length },
    { key: 'getting-started', label: 'Начало работы', count: 2 },
    { key: 'billing', label: 'Оплата и цены', count: 2 },
    { key: 'support', label: 'Поддержка', count: 2 },
  ];

  return (
    <div className="min-h-screen bg-light-bg">
      <div className="container mx-auto py-12">
        <FAQSection
          faqs={exampleFAQs}
          customCategories={customCategories}
          title="Кастомные категории"
          subtitle="Пример с пользовательскими категориями"
          showSearch={true}
          showCategories={true}
          showPopularQuestions={true}
        />
      </div>
    </div>
  );
}

export default BasicFAQExample;