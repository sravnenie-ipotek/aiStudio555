'use client'

/**
 * FAQQuickAccess Component
 * Popular questions quick access panel for improved UX
 * @module @aistudio555/ui/FAQ/FAQQuickAccess
 */

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { 
  Star, 
  ArrowRight, 
  TrendingUp, 
  Zap,
  Users,
  HelpCircle
} from 'lucide-react';
import type { FAQQuickAccessProps, FAQItem } from './types';

const faqQuickAccessVariants = cva(
  'bg-white rounded-xl border border-border-light shadow-sm mb-6',
  {
    variants: {
      variant: {
        default: 'p-6',
        compact: 'p-4',
        featured: 'p-8 bg-gradient-to-r from-primary-yellow/5 to-accent-blue/5 border-primary-yellow/20',
      },
      layout: {
        grid: '',
        list: '',
        carousel: 'overflow-hidden',
      },
    },
    defaultVariants: {
      variant: 'default',
      layout: 'grid',
    },
  }
);

const quickAccessItemVariants = cva(
  'text-left p-4 rounded-lg border transition-all group cursor-pointer',
  {
    variants: {
      style: {
        card: 'bg-light-bg border-transparent hover:bg-primary-yellow/5 hover:border-primary-yellow/20',
        minimal: 'bg-transparent border-border-light hover:bg-light-bg hover:border-primary-yellow/30',
        elevated: 'bg-white border-border-light shadow-sm hover:shadow-md hover:border-primary-yellow/30 hover:-translate-y-0.5',
      },
      size: {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-5',
      },
    },
    defaultVariants: {
      style: 'card',
      size: 'md',
    },
  }
);

interface FAQQuickAccessExtendedProps extends FAQQuickAccessProps, VariantProps<typeof faqQuickAccessVariants> {
  style?: 'card' | 'minimal' | 'elevated';
  itemSize?: 'sm' | 'md' | 'lg';
  showArrowIndicator?: boolean;
  showPopularityScore?: boolean;
  showCategoryIcons?: boolean;
  enableHoverPreview?: boolean;
  animationDelay?: number;
}

const FAQQuickAccess = forwardRef<HTMLDivElement, FAQQuickAccessExtendedProps>(
  ({
    faqs,
    onQuestionClick,
    title = 'Популярные вопросы',
    maxQuestions = 3,
    className,
    variant,
    layout,
    style = 'card',
    itemSize = 'md',
    showArrowIndicator = true,
    showPopularityScore = false,
    showCategoryIcons = true,
    enableHoverPreview = false,
    animationDelay = 0,
    ...props
  }, ref) => {

    // Filter and limit popular questions
    const popularFaqs = faqs
      .filter(faq => faq.popular)
      .slice(0, maxQuestions);

    // Animation variants
    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          delay: animationDelay,
          staggerChildren: 0.1,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, x: -20 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4 },
      },
    };

    // Get category icon
    const getCategoryIcon = (category?: string) => {
      switch (category) {
        case 'courses': return Users;
        case 'payment': return Star;
        case 'technical': return HelpCircle;
        default: return TrendingUp;
      }
    };

    // Handle question click with analytics
    const handleQuestionClick = (faq: FAQItem) => {
      onQuestionClick(faq.id);
      
      // Optional: Send analytics event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'faq_popular_question_clicked', {
          event_category: 'engagement',
          event_label: faq.question,
          faq_id: faq.id,
          faq_category: faq.category,
        });
      }
    };

    if (popularFaqs.length === 0) {
      return null;
    }

    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={faqQuickAccessVariants({ variant, layout, className })}
        role="region"
        aria-label="Популярные вопросы"
        {...props}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-yellow/20 rounded-xl flex items-center justify-center">
            <Star className="w-5 h-5 text-primary-yellow" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-text-primary font-rubik">
              {title}
            </h3>
            <p className="text-sm text-text-gray mt-1">
              Самые часто задаваемые вопросы
            </p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-2 text-xs text-text-light bg-light-bg px-3 py-1.5 rounded-full">
              <TrendingUp className="w-3 h-3" aria-hidden="true" />
              Топ {popularFaqs.length}
            </div>
          </div>
        </div>

        {/* Quick Access Grid */}
        <div className={`grid gap-3 ${
          layout === 'list' ? 'grid-cols-1' :
          layout === 'carousel' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
          popularFaqs.length === 1 ? 'grid-cols-1' :
          popularFaqs.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
          'grid-cols-1 md:grid-cols-3'
        }`}>
          {popularFaqs.map((faq, index) => {
            const CategoryIcon = showCategoryIcons ? getCategoryIcon(faq.category) : Star;
            
            return (
              <motion.div
                key={faq.id}
                variants={itemVariants}
                whileHover={enableHoverPreview ? { 
                  scale: 1.02, 
                  transition: { duration: 0.2 } 
                } : undefined}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => handleQuestionClick(faq)}
                  className={quickAccessItemVariants({ style, size: itemSize })}
                  aria-label={`Перейти к вопросу: ${faq.question}`}
                >
                  <div className="flex items-start gap-3 h-full">
                    {/* Question Number/Icon */}
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-yellow/20 rounded-full flex items-center justify-center text-sm font-bold text-primary-yellow group-hover:bg-primary-yellow group-hover:text-white transition-all duration-200">
                      {showCategoryIcons ? (
                        <CategoryIcon className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <span aria-hidden="true">{index + 1}</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Category Badge */}
                      {faq.category && (
                        <div className="flex items-center gap-1 mb-2">
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary-yellow/10 text-primary-yellow rounded-full">
                            {faq.category === 'general' && 'Общие'}
                            {faq.category === 'courses' && 'Курсы'}
                            {faq.category === 'payment' && 'Оплата'}
                            {faq.category === 'technical' && 'Поддержка'}
                            {faq.category === 'enrollment' && 'Запись'}
                            {faq.category === 'certification' && 'Сертификация'}
                          </span>
                          
                          {showPopularityScore && (
                            <div className="flex items-center gap-1 text-xs text-text-light">
                              <Zap className="w-3 h-3" aria-hidden="true" />
                              <span>95%</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Question Text */}
                      <p className="text-sm font-medium text-text-primary group-hover:text-primary-yellow transition-colors leading-relaxed line-clamp-2">
                        {faq.question}
                      </p>
                      
                      {/* Read Time */}
                      {faq.readTime && (
                        <p className="text-xs text-text-light mt-2">
                          {faq.readTime} мин чтения
                        </p>
                      )}
                    </div>
                    
                    {/* Arrow Indicator */}
                    {showArrowIndicator && (
                      <div className="flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4 text-primary-yellow transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-between pt-4 mt-6 border-t border-border-light text-xs text-text-light">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" aria-hidden="true" />
              Самые популярные
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" aria-hidden="true" />
              Быстрые ответы
            </span>
          </div>
          
          <div className="text-success font-medium">
            95% помогли пользователям
          </div>
        </div>

        {/* Accessibility Helper */}
        <div className="sr-only" aria-live="polite">
          Показано {popularFaqs.length} популярных вопросов. Нажмите на любой вопрос, чтобы увидеть ответ.
        </div>
      </motion.div>
    );
  }
);

FAQQuickAccess.displayName = 'FAQQuickAccess';

export { FAQQuickAccess, faqQuickAccessVariants, quickAccessItemVariants };
export type { FAQQuickAccessProps, FAQQuickAccessExtendedProps };