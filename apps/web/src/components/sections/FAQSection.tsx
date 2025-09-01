'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  CheckCircle
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
    question: tSync(`faq.question${i + 1}`) || `Sample Question ${i + 1}`,
    answer: tSync(`faq.answer${i + 1}`) || `Sample answer for question ${i + 1}`,
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

  const categories = [
    { key: 'all', label: tSync('faq.categories.all') || 'Все', count: allFaqs.length },
    { key: 'general', label: tSync('faq.categories.general') || 'Общие', count: allFaqs.filter(f => f.category === 'general').length },
    { key: 'courses', label: tSync('faq.categories.courses') || 'Курсы', count: allFaqs.filter(f => f.category === 'courses').length },
    { key: 'payment', label: tSync('faq.categories.payment') || 'Оплата', count: allFaqs.filter(f => f.category === 'payment').length },
    { key: 'technical', label: tSync('faq.categories.technical') || 'Техническая поддержка', count: allFaqs.filter(f => f.category === 'technical').length },
  ];

  const handleAccordionChange = (value: string) => {
    setOpenItems(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  return (
    <>
      {/* SEO Structured Data */}
      <FAQStructuredData faqs={filteredFaqs} />
      
      <section className={`py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-yellow-50/30 ${className || ''}`}>
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          
          {/* Section Header */}
          <motion.div 
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className={`text-center mb-12 ${getDirectionClass()}`}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-primary-yellow/20 text-text-primary hover:bg-primary-yellow/30 transition-colors">
                <HelpCircle className="w-3 h-3 mr-1" />
                {tSync('faq.badge') || 'FAQ'}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                {filteredFaqs.length} {tSync('faq.results') || 'результатов'}
              </Badge>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {tSync('faq.title') || 'Часто задаваемые вопросы'}
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
              {tSync('faq.subtitle') || 'Ответы на самые популярные вопросы о наших курсах и обучении'}
            </p>

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={tSync('faq.search.placeholder') || 'Поиск по вопросам...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent bg-white shadow-sm transition-all"
                />
              </div>
              
              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent bg-white shadow-sm transition-all appearance-none cursor-pointer min-w-[180px]"
                >
                  {categories.map(category => (
                    <option key={category.key} value={category.key}>
                      {category.label} ({category.count})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </motion.div>

          {/* FAQ Cards Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Popular Questions Banner */}
            {selectedCategory === 'all' && searchQuery === '' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-6 bg-gradient-to-r from-primary-yellow/10 via-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary-yellow/20 rounded-lg">
                    <Star className="w-5 h-5 text-primary-yellow" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {tSync('faq.popular.title') || 'Самые популярные вопросы'}
                  </h3>
                  <Badge className="bg-primary-yellow text-text-primary">
                    {allFaqs.filter(f => f.popular).length}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {allFaqs.filter(faq => faq.popular).map((faq, index) => (
                    <motion.button
                      key={`popular-${faq.id}`}
                      onClick={() => {
                        setSelectedCategory('all');
                        setSearchQuery('');
                        if (!openItems.includes(faq.id)) {
                          handleAccordionChange(faq.id);
                        }
                        // Scroll to FAQ
                        setTimeout(() => {
                          const element = document.getElementById(faq.id);
                          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 100);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-yellow hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary-yellow/20 rounded-full flex items-center justify-center text-xs font-bold text-primary-yellow group-hover:bg-primary-yellow group-hover:text-white transition-colors">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-primary-yellow transition-colors">
                            {faq.question}
                          </p>
                          <div className="flex items-center gap-1 mt-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">2 мин чтения</span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
            
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                  <div className="p-2 bg-primary-yellow/10 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-primary-yellow" />
                  </div>
                  {selectedCategory === 'all' ? 
                    (tSync('faq.cardTitle') || 'Все вопросы') : 
                    categories.find(c => c.key === selectedCategory)?.label || 'Вопросы'
                  }
                  {searchQuery && (
                    <Badge variant="outline" className="ml-auto">
                      {filteredFaqs.length} найдено
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <AnimatePresence mode="wait">
                  {filteredFaqs.length > 0 ? (
                    <motion.div
                      key="faq-list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Accordion 
                        type="multiple" 
                        value={openItems}
                        onValueChange={setOpenItems}
                        className={`w-full space-y-3 ${getDirectionClass()}`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      >
                        {filteredFaqs.map((faq, index) => (
                          <motion.div
                            key={faq.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <AccordionItem
                              id={faq.id}
                              value={faq.id}
                              className="border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-lg hover:border-primary-yellow/30 transition-all duration-300 overflow-hidden"
                            >
                              <AccordionTrigger className="hover:no-underline px-6 py-5 group">
                                <div className="flex items-start gap-4 text-left w-full">
                                  <div className="flex-shrink-0 w-8 h-8 bg-primary-yellow/20 rounded-full flex items-center justify-center text-sm font-bold text-primary-yellow mt-0.5 group-hover:bg-primary-yellow group-hover:text-white transition-colors duration-200">
                                    {faq.popular ? (
                                      <Star className="w-4 h-4" />
                                    ) : (
                                      index + 1
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      {faq.popular && (
                                        <Badge size="sm" className="bg-orange-100 text-orange-700 border-orange-200">
                                          Популярный
                                        </Badge>
                                      )}
                                      <Badge 
                                        size="sm" 
                                        variant="outline"
                                        className={`
                                          ${faq.category === 'general' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                                          ${faq.category === 'courses' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                          ${faq.category === 'payment' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                                          ${faq.category === 'technical' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                                        `}
                                      >
                                        {categories.find(c => c.key === faq.category)?.label}
                                      </Badge>
                                    </div>
                                    <span className="font-medium text-gray-900 leading-relaxed group-hover:text-primary-yellow transition-colors duration-200">
                                      {faq.question}
                                    </span>
                                  </div>
                                </div>
                              </AccordionTrigger>
                              
                              <AccordionContent className="px-6 pb-6">
                                <motion.div 
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex gap-4"
                                >
                                  <div className="flex-shrink-0 w-8"></div>
                                  <div className="flex-1">
                                    <div className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">
                                      {faq.answer}
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        2 мин чтения
                                      </span>
                                      <span>Обновлено сегодня</span>
                                    </div>
                                  </div>
                                </motion.div>
                              </AccordionContent>
                            </AccordionItem>
                          </motion.div>
                        ))}
                      </Accordion>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="no-results"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {tSync('faq.noResults.title') || 'Ничего не найдено'}
                      </h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-6">
                        {tSync('faq.noResults.description') || 'Попробуйте изменить запрос или выберите другую категорию'}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={() => setSearchQuery('')}
                          className="px-4 py-2 text-primary-yellow border border-primary-yellow rounded-lg hover:bg-primary-yellow hover:text-white transition-colors"
                        >
                          Очистить поиск
                        </button>
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('all');
                          }}
                          className="px-4 py-2 bg-primary-yellow text-white rounded-lg hover:bg-yellow-hover transition-colors"
                        >
                          Показать все
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Bottom CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <Card className="border-0 bg-gradient-to-r from-primary-yellow/10 via-yellow-50 to-orange-50 shadow-xl overflow-hidden relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary-yellow rounded-full -translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-orange-300 rounded-full translate-x-20 translate-y-20"></div>
              </div>
              
              <CardContent className="p-8 relative z-10">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-4"
                  >
                    <div className="p-4 bg-primary-yellow/20 rounded-xl">
                      <Users className="w-8 h-8 text-primary-yellow" />
                    </div>
                    <div className={`text-left ${isRTL ? 'text-right' : ''}`}>
                      <p className="font-bold text-xl text-gray-900 mb-1">
                        {tSync('faq.cta.title') || 'Остались вопросы?'}
                      </p>
                      <p className="text-gray-600">
                        {tSync('faq.cta.subtitle') || 'Получите бесплатную консультацию от наших экспертов'}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Бесплатно
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-blue-500" />
                          15 минут
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          4.9/5 рейтинг
                        </span>
                      </div>
                    </div>
                  </motion.div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.a
                      href="/consultation"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center px-8 py-4 bg-primary-yellow hover:bg-yellow-hover text-text-primary font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl text-sm whitespace-nowrap relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <MessageCircle className="w-5 h-5 mr-2 relative z-10" />
                      <span className="relative z-10">{tSync('faq.cta.consultation') || 'Задать вопрос'}</span>
                    </motion.a>
                    
                    <motion.a
                      href="/courses"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-text-primary font-bold rounded-xl transition-all duration-300 border-2 border-gray-200 hover:border-primary-yellow shadow-lg hover:shadow-2xl text-sm whitespace-nowrap group"
                    >
                      <GraduationCap className="w-5 h-5 mr-2 group-hover:text-primary-yellow transition-colors" />
                      <span className="group-hover:text-primary-yellow transition-colors">
                        {tSync('faq.cta.courses') || 'Посмотреть курсы'}
                      </span>
                    </motion.a>
                  </div>
                </div>
                
                {/* Stats */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-gray-200/50 text-sm text-gray-600"
                >
                  <div className="text-center">
                    <div className="font-bold text-lg text-primary-yellow">500+</div>
                    <div>Вопросов отвечено</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-green-600">24ч</div>
                    <div>Среднее время ответа</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-blue-600">98%</div>
                    <div>Довольных студентов</div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </>
  );
}