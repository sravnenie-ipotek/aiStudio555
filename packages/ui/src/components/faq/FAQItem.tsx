'use client'

/**
 * FAQItem Component
 * Individual FAQ accordion item with full accessibility support
 * @module @aistudio555/ui/FAQ/FAQItem
 */

import React, { forwardRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { 
  Plus, 
  Star, 
  Clock, 
  ChevronDown,
  HelpCircle,
  BookOpen,
  CreditCard,
  Settings,
  UserCheck,
  Award
} from 'lucide-react';
import type { FAQItemProps, FAQCategory } from './types';

// Category icon mapping
const categoryIcons: Record<FAQCategory, React.ComponentType<{ className?: string }>> = {
  general: HelpCircle,
  courses: BookOpen,
  payment: CreditCard,
  technical: Settings,
  enrollment: UserCheck,
  certification: Award,
};

// Category color mapping for Tailwind classes
const categoryColors: Record<FAQCategory, string> = {
  general: 'bg-blue-50 text-blue-700 border-blue-200',
  courses: 'bg-green-50 text-green-700 border-green-200',
  payment: 'bg-purple-50 text-purple-700 border-purple-200',
  technical: 'bg-red-50 text-red-700 border-red-200',
  enrollment: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  certification: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

const faqItemVariants = cva(
  'bg-white border border-border-light rounded-xl shadow-sm transition-all duration-300 group',
  {
    variants: {
      state: {
        closed: 'hover:shadow-md hover:border-primary-yellow/30',
        open: 'shadow-md border-primary-yellow/50 bg-primary-yellow/5',
      },
      popular: {
        true: 'ring-1 ring-primary-yellow/20',
        false: '',
      },
    },
    defaultVariants: {
      state: 'closed',
      popular: false,
    },
  }
);

const FAQItem = forwardRef<HTMLDivElement, FAQItemProps>(
  ({
    faq,
    isOpen,
    onToggle,
    index,
    showCategory = true,
    showPopularBadge = true,
    showReadTime = true,
    showLastUpdated = true,
    className,
    ...props
  }, ref) => {
    const contentId = useId();
    const headerId = useId();
    
    const CategoryIcon = faq.category ? categoryIcons[faq.category] : HelpCircle;
    const categoryColorClass = faq.category ? categoryColors[faq.category] : categoryColors.general;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={faqItemVariants({ 
          state: isOpen ? 'open' : 'closed',
          popular: faq.popular || false,
          className 
        })}
        {...props}
      >
        {/* Accordion Header */}
        <button
          id={headerId}
          onClick={onToggle}
          className="w-full px-6 py-5 text-left focus:outline-none focus:ring-2 focus:ring-primary-yellow/30 focus:ring-offset-2 rounded-xl transition-all duration-200 group/button"
          aria-expanded={isOpen}
          aria-controls={contentId}
          aria-describedby={`${contentId}-desc`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {/* Question Number/Icon */}
              <div className="flex-shrink-0 w-10 h-10 bg-primary-yellow/20 rounded-full flex items-center justify-center text-sm font-bold text-primary-yellow group-hover/button:bg-primary-yellow group-hover/button:text-dark-pure transition-all duration-200">
                {faq.popular ? (
                  <Star className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <span aria-hidden="true">{index + 1}</span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Badges Row */}
                {(showPopularBadge || showCategory) && (
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {/* Popular Badge */}
                    {showPopularBadge && faq.popular && (
                      <span 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-primary-yellow/20 text-primary-yellow rounded-full border border-primary-yellow/30"
                        aria-label="Популярный вопрос"
                      >
                        <Star className="w-3 h-3" aria-hidden="true" />
                        Популярный
                      </span>
                    )}
                    
                    {/* Category Badge */}
                    {showCategory && faq.category && (
                      <span 
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${categoryColorClass}`}
                        aria-label={`Категория: ${faq.category}`}
                      >
                        <CategoryIcon className="w-3 h-3" aria-hidden="true" />
                        {faq.category === 'general' && 'Общие'}
                        {faq.category === 'courses' && 'Курсы'}
                        {faq.category === 'payment' && 'Оплата'}
                        {faq.category === 'technical' && 'Поддержка'}
                        {faq.category === 'enrollment' && 'Запись'}
                        {faq.category === 'certification' && 'Сертификация'}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Question */}
                <h3 className="text-base font-semibold text-text-primary group-hover/button:text-primary-yellow transition-colors leading-relaxed pr-4">
                  {faq.question}
                </h3>
                
                {/* Meta Information */}
                {(showReadTime || showLastUpdated) && (
                  <div className="flex items-center gap-4 mt-2 text-xs text-text-light">
                    {showReadTime && faq.readTime && (
                      <span className="flex items-center gap-1" aria-label={`Время чтения: ${faq.readTime} минут`}>
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        {faq.readTime} мин чтения
                      </span>
                    )}
                    {showLastUpdated && faq.lastUpdated && (
                      <span aria-label={`Обновлено: ${faq.lastUpdated}`}>
                        Обновлено {faq.lastUpdated}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Toggle Icon */}
            <div className="flex-shrink-0 ml-4">
              <div 
                className={`w-8 h-8 flex items-center justify-center rounded-full bg-light-bg group-hover/button:bg-primary-yellow/20 transition-all duration-200 ${
                  isOpen ? 'rotate-45' : ''
                }`}
                aria-hidden="true"
              >
                <Plus className="w-4 h-4 text-text-gray group-hover/button:text-primary-yellow transition-colors" />
              </div>
            </div>
          </div>
        </button>
        
        {/* Accordion Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id={contentId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ 
                duration: 0.3, 
                ease: [0.4, 0, 0.2, 1] // Custom easing for smooth accordion
              }}
              className="overflow-hidden"
              role="region"
              aria-labelledby={headerId}
            >
              <div className="px-6 pb-6">
                <div className="flex gap-4">
                  {/* Spacer for alignment */}
                  <div className="flex-shrink-0 w-10" aria-hidden="true"></div>
                  
                  <div className="flex-1">
                    {/* Answer Content */}
                    <div 
                      className="text-text-gray leading-relaxed mb-4 prose prose-sm max-w-none"
                      id={`${contentId}-desc`}
                    >
                      {faq.answer}
                    </div>
                    
                    {/* Tags */}
                    {faq.tags && faq.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {faq.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium bg-surface-light text-text-secondary rounded-md"
                            aria-label={`Тег: ${tag}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Footer with metadata */}
                    <div className="flex items-center justify-between text-sm text-text-light pt-4 border-t border-border-light">
                      <div className="flex items-center gap-4">
                        {faq.readTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" aria-hidden="true" />
                            <span className="sr-only">Время чтения:</span>
                            {faq.readTime} мин чтения
                          </span>
                        )}
                      </div>
                      
                      {faq.lastUpdated && (
                        <span>
                          <span className="sr-only">Последнее обновление:</span>
                          Обновлено {faq.lastUpdated}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

FAQItem.displayName = 'FAQItem';

export { FAQItem, faqItemVariants };
export type { FAQItemProps };