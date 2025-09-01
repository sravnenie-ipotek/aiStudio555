'use client'

/**
 * FAQEmptyState Component
 * Empty state for when no FAQ results are found
 * @module @aistudio555/ui/FAQ/FAQEmptyState
 */

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { 
  Search, 
  HelpCircle, 
  RotateCcw, 
  Grid3X3,
  MessageCircle,
  Lightbulb,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import type { FAQEmptyStateProps } from './types';

const faqEmptyStateVariants = cva(
  'text-center py-12 bg-white rounded-xl border border-border-light',
  {
    variants: {
      variant: {
        default: 'py-12',
        compact: 'py-8',
        expanded: 'py-16',
      },
      theme: {
        neutral: 'bg-white',
        light: 'bg-light-bg',
        gradient: 'bg-gradient-to-br from-primary-yellow/5 to-accent-blue/5',
      },
    },
    defaultVariants: {
      variant: 'default',
      theme: 'neutral',
    },
  }
);

const emptyStateIconVariants = cva(
  'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6',
  {
    variants: {
      style: {
        simple: 'bg-light-bg',
        colorful: 'bg-primary-yellow/20',
        gradient: 'bg-gradient-to-br from-primary-yellow/20 to-accent-blue/20',
      },
    },
    defaultVariants: {
      style: 'simple',
    },
  }
);

interface FAQEmptyStateExtendedProps extends FAQEmptyStateProps, VariantProps<typeof faqEmptyStateVariants> {
  iconStyle?: 'simple' | 'colorful' | 'gradient';
  showSuggestions?: boolean;
  suggestions?: string[];
  showContactOption?: boolean;
  contactText?: string;
  onContactClick?: () => void;
  animationDelay?: number;
}

const FAQEmptyState = forwardRef<HTMLDivElement, FAQEmptyStateExtendedProps>(
  ({
    searchQuery,
    onClearSearch,
    onShowAll,
    title = 'Ничего не найдено',
    description = 'Попробуйте изменить запрос или выберите другую категорию',
    clearButtonText = 'Очистить поиск',
    showAllButtonText = 'Показать все',
    className,
    variant,
    theme,
    iconStyle = 'simple',
    showSuggestions = true,
    suggestions = [
      'Как записаться на курс?',
      'Стоимость обучения',
      'Получение сертификата',
      'Техническая поддержка'
    ],
    showContactOption = true,
    contactText = 'Задать вопрос специалисту',
    onContactClick,
    animationDelay = 0,
    ...props
  }, ref) => {

    // Animation variants
    const containerVariants = {
      hidden: { 
        opacity: 0, 
        scale: 0.95,
        y: 20 
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: 0.5,
          delay: animationDelay,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    };

    const suggestionVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.3 + i * 0.1,
          duration: 0.4,
        },
      }),
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion: string) => {
      // This would typically trigger a search for the suggestion
      if (onClearSearch) {
        onClearSearch();
      }
      // You might want to implement a search trigger here
    };

    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={faqEmptyStateVariants({ variant, theme, className })}
        role="status"
        aria-live="polite"
        {...props}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: animationDelay + 0.2, 
            duration: 0.6,
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
          className={emptyStateIconVariants({ style: iconStyle })}
        >
          <Search className="w-8 h-8 text-text-gray" aria-hidden="true" />
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: animationDelay + 0.3, duration: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-text-primary mb-3 font-rubik">
            {title}
          </h3>
          
          <p className="text-text-gray max-w-md mx-auto mb-6 leading-relaxed">
            {searchQuery ? (
              <>
                По запросу <span className="font-medium text-text-primary">"{searchQuery}"</span> {description.toLowerCase()}
              </>
            ) : (
              description
            )}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: animationDelay + 0.4, duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
        >
          <button
            onClick={onClearSearch}
            className="inline-flex items-center justify-center px-6 py-3 text-primary-yellow border border-primary-yellow rounded-lg hover:bg-primary-yellow hover:text-dark-pure transition-all duration-200 font-medium group"
          >
            <RotateCcw className="w-4 h-4 mr-2 group-hover:-rotate-180 transition-transform duration-300" />
            {clearButtonText}
          </button>
          
          <button
            onClick={onShowAll}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-yellow text-dark-pure font-medium rounded-lg hover:bg-yellow-hover transition-all duration-200 shadow-sm hover:shadow-md group"
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            {showAllButtonText}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: animationDelay + 0.5, duration: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 justify-center mb-4">
              <Lightbulb className="w-4 h-4 text-primary-yellow" aria-hidden="true" />
              <span className="text-sm font-medium text-text-secondary">
                Популярные вопросы:
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
              {suggestions.slice(0, 4).map((suggestion, index) => (
                <motion.button
                  key={index}
                  custom={index}
                  variants={suggestionVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium bg-light-bg text-text-secondary rounded-full hover:bg-primary-yellow/10 hover:text-primary-yellow transition-all duration-200 border border-transparent hover:border-primary-yellow/30"
                >
                  <HelpCircle className="w-3 h-3 mr-1.5" aria-hidden="true" />
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Contact Option */}
        {showContactOption && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay + 0.6, duration: 0.4 }}
            className="pt-6 border-t border-border-light"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-accent-blue" aria-hidden="true" />
              <span className="text-sm text-text-gray">
                Не нашли ответ на свой вопрос?
              </span>
            </div>
            
            <button
              onClick={onContactClick}
              className="inline-flex items-center justify-center px-6 py-3 bg-accent-blue text-white font-medium rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {contactText}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-xs text-text-light mt-2">
              Ответим в течение 24 часов
            </p>
          </motion.div>
        )}

        {/* Accessibility Helper */}
        <div className="sr-only">
          {searchQuery ? 
            `По запросу "${searchQuery}" ничего не найдено. Попробуйте очистить поиск или показать все вопросы.` :
            `Нет доступных вопросов. Используйте кнопку "Показать все" для просмотра всех вопросов.`
          }
        </div>
      </motion.div>
    );
  }
);

FAQEmptyState.displayName = 'FAQEmptyState';

export { FAQEmptyState, faqEmptyStateVariants, emptyStateIconVariants };
export type { FAQEmptyStateProps, FAQEmptyStateExtendedProps };