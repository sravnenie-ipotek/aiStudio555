'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  HelpCircle, 
  MessageCircle, 
  Users, 
  GraduationCap, 
  Search,
  Filter,
  ChevronDown,
  Star,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight
} from 'lucide-react';

// SEO Structured Data for FAQ Rich Results
function FAQStructuredData({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: 'general' | 'courses' | 'payment' | 'technical';
  popular?: boolean;
  tags?: string[];
}

interface FAQSectionProps {
  className?: string;
}

export function FAQSection({ className }: FAQSectionProps) {
  const { tSync, isRTL, getDirectionClass } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<string[]>([]);
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Enhanced FAQ data with categories and metadata
  const allFaqs: FAQItem[] = Array.from({ length: 8 }, (_, i) => ({
    id: `faq-${i + 1}`,
    question: tSync(`faq.question${i + 1}`) || `How do I get started with ${['AI learning', 'the courses', 'payment options', 'technical support', 'certification process', 'career opportunities', 'project work', 'job placement'][i]}?`,
    answer: tSync(`faq.answer${i + 1}`) || `Our ${['AI courses are designed for beginners and professionals alike. Start with our fundamentals course', 'comprehensive learning platform offers step-by-step guidance with practical projects', 'flexible payment plans include installments and various payment methods for your convenience', 'dedicated support team is available 24/7 to help with any technical questions or issues', 'certification program includes hands-on projects and industry-recognized credentials', 'career services team provides job placement assistance and professional networking opportunities', 'real-world projects give you practical experience with industry-standard tools and methodologies', 'job placement guarantee ensures 95% of graduates find positions within 6 months of completion'][i]}.`,
    category: (['general', 'courses', 'payment', 'technical'] as const)[i % 4],
    popular: i < 3, // First 3 are popular
    tags: ['курсы', 'обучение', 'сертификация', 'AI'][Math.floor(Math.random() * 4)] ? ['курсы'] : [],
  }));

  // Filter FAQs based on search and category
  const filteredFaqs = allFaqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Initialize Preline components after mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('preline/preline').then(() => {
        // Preline auto-init handled by plugin
      });
    }
  }, [filteredFaqs]);

  const categories = [
    { key: 'all', label: tSync('faq.categories.all') || 'Все', count: allFaqs.length },
    { key: 'general', label: tSync('faq.categories.general') || 'Общие', count: allFaqs.filter(f => f.category === 'general').length },
    { key: 'courses', label: tSync('faq.categories.courses') || 'Курсы', count: allFaqs.filter(f => f.category === 'courses').length },
    { key: 'payment', label: tSync('faq.categories.payment') || 'Оплата', count: allFaqs.filter(f => f.category === 'payment').length },
    { key: 'technical', label: tSync('faq.categories.technical') || 'Поддержка', count: allFaqs.filter(f => f.category === 'technical').length },
  ];

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <>
      {/* SEO Structured Data */}
      <FAQStructuredData faqs={filteredFaqs} />
      
      <section className={`py-8 lg:py-12 bg-light-bg ${className || ''}`}>
        <div className="max-w-4xl mx-auto px-3 lg:px-6">
          
          {/* Section Header - Design System Compliant */}
          <motion.div 
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className={`text-center mb-8 ${getDirectionClass()}`}
          >
            <div className="inline-flex items-center gap-2 bg-primary-yellow/10 text-text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              <HelpCircle className="w-4 h-4" />
              {tSync('faq.badge') || 'Часто задаваемые вопросы'}
            </div>
            
            <h2 className="text-4xl font-bold text-text-primary mb-3 font-rubik">
              {tSync('faq.title') || 'Ответы на ваши вопросы'}
            </h2>
            
            <p className="text-lg text-text-gray leading-relaxed max-w-2xl mx-auto mb-6">
              {tSync('faq.subtitle') || 'Найдите ответы на самые популярные вопросы о наших курсах'}
            </p>

            {/* Search and Filter - Clean Design */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-6">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-gray w-4 h-4" />
                <input
                  type="text"
                  placeholder={tSync('faq.search.placeholder') || 'Поиск по вопросам...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 border border-border-light rounded-lg focus:border-primary-yellow focus:outline-none focus:ring-2 focus:ring-primary-yellow/20 bg-white transition-all text-base"
                />
              </div>
              
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-11 pl-4 pr-10 border border-border-light rounded-lg focus:border-primary-yellow focus:outline-none focus:ring-2 focus:ring-primary-yellow/20 bg-white transition-all appearance-none cursor-pointer min-w-[140px] text-base"
                >
                  {categories.map(category => (
                    <option key={category.key} value={category.key}>
                      {category.label} ({category.count})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-gray w-4 h-4 pointer-events-none" />
              </div>
            </div>
            
            {/* Results Count */}
            {searchQuery && (
              <div className="inline-flex items-center gap-2 text-sm text-text-gray">
                <CheckCircle className="w-4 h-4 text-success" />
                {filteredFaqs.length} {tSync('faq.results') || 'результатов найдено'}
              </div>
            )}
          </motion.div>

          {/* FAQ Accordion - Preline UI Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Popular Questions Quick Access */}
            {selectedCategory === 'all' && searchQuery === '' && (
              <div className="bg-white rounded-xl border border-border-light p-6 mb-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary-yellow/20 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-primary-yellow" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {tSync('faq.popular.title') || 'Популярные вопросы'}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {allFaqs.filter(faq => faq.popular).slice(0, 3).map((faq, index) => (
                    <button
                      key={`popular-${faq.id}`}
                      onClick={() => toggleItem(faq.id)}
                      className="text-left p-4 bg-light-bg rounded-lg hover:bg-primary-yellow/5 border border-transparent hover:border-primary-yellow/20 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary-yellow/20 rounded-full flex items-center justify-center text-xs font-bold text-primary-yellow group-hover:bg-primary-yellow group-hover:text-white transition-colors">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-primary-yellow transition-colors">
                            {faq.question}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* FAQ Accordion List */}
            <AnimatePresence mode="wait">
              {filteredFaqs.length > 0 ? (
                <div className="space-y-3">
                  {filteredFaqs.map((faq, index) => {
                    const isOpen = openItems.includes(faq.id);
                    
                    return (
                      <motion.div
                        key={faq.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-white border border-border-light rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        {/* Accordion Header */}
                        <button
                          onClick={() => toggleItem(faq.id)}
                          className="w-full px-6 py-5 text-left focus:outline-none focus:ring-2 focus:ring-primary-yellow/20 rounded-xl transition-all duration-200 group"
                          aria-expanded={isOpen}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="flex-shrink-0 w-8 h-8 bg-primary-yellow/20 rounded-full flex items-center justify-center text-sm font-bold text-primary-yellow group-hover:bg-primary-yellow group-hover:text-white transition-colors">
                                {faq.popular ? (
                                  <Star className="w-4 h-4" />
                                ) : (
                                  index + 1
                                )}
                              </div>
                              <div className="flex-1">
                                {/* Category & Popular Badge */}
                                <div className="flex items-center gap-2 mb-2">
                                  {faq.popular && (
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary-yellow/20 text-primary-yellow rounded-full">
                                      Популярный
                                    </span>
                                  )}
                                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                    faq.category === 'general' ? 'bg-blue-50 text-blue-700' :
                                    faq.category === 'courses' ? 'bg-green-50 text-green-700' :
                                    faq.category === 'payment' ? 'bg-purple-50 text-purple-700' :
                                    'bg-red-50 text-red-700'
                                  }`}>
                                    {categories.find(c => c.key === faq.category)?.label}
                                  </span>
                                </div>
                                {/* Question */}
                                <h3 className="text-base font-semibold text-text-primary group-hover:text-primary-yellow transition-colors leading-relaxed pr-4">
                                  {faq.question}
                                </h3>
                              </div>
                            </div>
                            {/* Toggle Icon */}
                            <div className="flex-shrink-0 ml-4">
                              <div className={`w-6 h-6 flex items-center justify-center rounded-full bg-light-bg group-hover:bg-primary-yellow/20 transition-all duration-200 ${isOpen ? 'rotate-45' : ''}`}>
                                <Plus className="w-4 h-4 text-text-gray group-hover:text-primary-yellow transition-colors" />
                              </div>
                            </div>
                          </div>
                        </button>
                        
                        {/* Accordion Content */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6">
                                <div className="flex gap-4">
                                  <div className="flex-shrink-0 w-8"></div>
                                  <div className="flex-1">
                                    <div className="text-text-gray leading-relaxed mb-4">
                                      {faq.answer}
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-text-light">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        2 мин чтения
                                      </span>
                                      <span>Обновлено недавно</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 bg-white rounded-xl border border-border-light"
                >
                  <div className="w-16 h-16 bg-light-bg rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-text-gray" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {tSync('faq.noResults.title') || 'Ничего не найдено'}
                  </h3>
                  <p className="text-text-gray max-w-md mx-auto mb-6">
                    {tSync('faq.noResults.description') || 'Попробуйте изменить запрос или выберите другую категорию'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-6 py-2 text-primary-yellow border border-primary-yellow rounded-lg hover:bg-primary-yellow hover:text-text-primary transition-all"
                    >
                      Очистить поиск
                    </button>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="px-6 py-2 bg-primary-yellow text-text-primary font-semibold rounded-lg hover:bg-yellow-hover transition-all"
                    >
                      Показать все
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Clean CTA Section - Design System Compliant */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div className="bg-white rounded-xl border border-border-light p-8 shadow-sm">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-yellow/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-yellow" />
                  </div>
                  <div className={`text-left ${isRTL ? 'text-right' : ''}`}>
                    <p className="text-xl font-bold text-text-primary mb-1">
                      {tSync('faq.cta.title') || 'Остались вопросы?'}
                    </p>
                    <p className="text-text-gray">
                      {tSync('faq.cta.subtitle') || 'Получите персональную консультацию'}
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
                  <a
                    href="/consultation"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary-yellow hover:bg-yellow-hover text-text-primary font-semibold rounded-lg transition-all duration-300 shadow-button text-base"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {tSync('faq.cta.consultation') || 'Задать вопрос'}
                  </a>
                  
                  <a
                    href="/courses"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-light-bg text-text-primary font-semibold rounded-lg transition-all duration-300 border border-border-light hover:border-primary-yellow text-base group"
                  >
                    <GraduationCap className="w-5 h-5 mr-2 group-hover:text-primary-yellow transition-colors" />
                    <span className="group-hover:text-primary-yellow transition-colors">
                      {tSync('faq.cta.courses') || 'Все курсы'}
                    </span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
              
              {/* Stats Row */}
              <div className="flex items-center justify-center gap-8 mt-8 pt-6 border-t border-border-light text-center">
                <div>
                  <div className="text-2xl font-bold text-primary-yellow mb-1">500+</div>
                  <div className="text-sm text-text-gray">Отвеченных вопросов</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success mb-1">&lt;24ч</div>
                  <div className="text-sm text-text-gray">Время ответа</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent-blue mb-1">98%</div>
                  <div className="text-sm text-text-gray">Довольных клиентов</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}