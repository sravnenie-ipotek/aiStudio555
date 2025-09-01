'use client'

/**
 * FAQHeader Component
 * Header section with title, search, and category filtering
 * @module @aistudio555/ui/FAQ/FAQHeader
 */

import React, { forwardRef, useState, useRef, useId } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { 
  Search, 
  ChevronDown, 
  CheckCircle, 
  HelpCircle,
  Filter,
  X,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import type { FAQHeaderProps, FAQCategoryInfo } from './types';

const faqHeaderVariants = cva(
  'text-center mb-8',
  {
    variants: {
      size: {
        sm: 'mb-6',
        md: 'mb-8',
        lg: 'mb-10',
      },
      alignment: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },
    defaultVariants: {
      size: 'md',
      alignment: 'center',
    },
  }
);

const searchBarVariants = cva(
  'flex gap-3 max-w-xl mx-auto mb-6',
  {
    variants: {
      layout: {
        horizontal: 'flex-col sm:flex-row',
        vertical: 'flex-col',
        inline: 'flex-row',
      },
      width: {
        sm: 'max-w-md',
        md: 'max-w-xl',
        lg: 'max-w-2xl',
        full: 'max-w-none w-full',
      },
    },
    defaultVariants: {
      layout: 'horizontal',
      width: 'md',
    },
  }
);

interface FAQHeaderExtendedProps extends FAQHeaderProps, VariantProps<typeof faqHeaderVariants> {
  layout?: 'horizontal' | 'vertical' | 'inline';
  searchWidth?: 'sm' | 'md' | 'lg' | 'full';
  showAdvancedFilters?: boolean;
  showSearchSuggestions?: boolean;
  searchSuggestions?: string[];
  onAdvancedFilter?: (filters: Record<string, any>) => void;
}

const FAQHeader = forwardRef<HTMLDivElement, FAQHeaderExtendedProps>(
  ({
    title = 'Ответы на ваши вопросы',
    subtitle = 'Найдите ответы на самые популярные вопросы о наших курсах',
    searchQuery,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    categories,
    resultsCount,
    searchPlaceholder = 'Поиск по вопросам...',
    showBadge = true,
    badgeText = 'Часто задаваемые вопросы',
    size,
    alignment,
    layout = 'horizontal',
    searchWidth = 'md',
    showAdvancedFilters = false,
    showSearchSuggestions = false,
    searchSuggestions = [],
    className,
    ...props
  }, ref) => {
    
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchId = useId();
    const filterId = useId();

    // Handle search input with debouncing
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onSearchChange(value);
      
      // Show suggestions if enabled and has suggestions
      if (showSearchSuggestions && searchSuggestions.length > 0) {
        setShowSuggestions(value.length > 0);
      }
    };

    // Handle search clear
    const clearSearch = () => {
      onSearchChange('');
      setShowSuggestions(false);
      searchInputRef.current?.focus();
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion: string) => {
      onSearchChange(suggestion);
      setShowSuggestions(false);
      searchInputRef.current?.blur();
    };

    // Handle keyboard navigation for suggestions
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSuggestions(false);
        searchInputRef.current?.blur();
      }
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={faqHeaderVariants({ size, alignment, className })}
        {...props}
      >
        {/* Badge */}
        {showBadge && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-primary-yellow/10 text-text-primary px-4 py-2 rounded-full text-sm font-medium mb-4 border border-primary-yellow/20"
          >
            <HelpCircle className="w-4 h-4 text-primary-yellow" aria-hidden="true" />
            <span>{badgeText}</span>
            <Sparkles className="w-4 h-4 text-primary-yellow" aria-hidden="true" />
          </motion.div>
        )}
        
        {/* Title */}
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl lg:text-5xl font-bold text-text-primary mb-4 font-rubik"
        >
          {title}
        </motion.h2>
        
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg text-text-gray leading-relaxed max-w-2xl mx-auto mb-8"
        >
          {subtitle}
        </motion.p>

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={searchBarVariants({ layout, width: searchWidth })}
        >
          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-gray w-5 h-5" 
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                id={searchId}
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  setIsFocused(false);
                  // Delay hiding suggestions to allow clicking
                  setTimeout(() => setShowSuggestions(false), 150);
                }}
                onKeyDown={handleKeyDown}
                className="w-full h-12 pl-10 pr-12 border border-border-light rounded-xl focus:border-primary-yellow focus:outline-none focus:ring-2 focus:ring-primary-yellow/20 bg-white transition-all text-base font-medium placeholder:text-text-light"
                aria-label="Поиск по вопросам"
                aria-describedby={resultsCount !== undefined ? `${searchId}-results` : undefined}
                autoComplete="off"
              />
              
              {/* Clear Search Button */}
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-text-gray hover:text-text-primary hover:bg-light-bg rounded-full transition-all"
                  aria-label="Очистить поиск"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Search Suggestions Dropdown */}
            {showSearchSuggestions && showSuggestions && searchSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-border-light rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
                role="listbox"
                aria-label="Предложения поиска"
              >
                {searchSuggestions.slice(0, 5).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-primary-yellow/5 transition-colors flex items-center gap-3 border-b border-border-light last:border-0"
                    role="option"
                  >
                    <TrendingUp className="w-4 h-4 text-text-light flex-shrink-0" aria-hidden="true" />
                    <span className="text-text-primary">{suggestion}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          
          {/* Category Filter */}
          <div className="relative">
            <label htmlFor={filterId} className="sr-only">
              Фильтр по категориям
            </label>
            <select
              id={filterId}
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="h-12 pl-4 pr-10 border border-border-light rounded-xl focus:border-primary-yellow focus:outline-none focus:ring-2 focus:ring-primary-yellow/20 bg-white transition-all appearance-none cursor-pointer min-w-[160px] text-base font-medium"
              aria-label="Выберите категорию"
            >
              {categories.map(category => (
                <option key={category.key} value={category.key}>
                  {category.label} ({category.count})
                </option>
              ))}
            </select>
            <ChevronDown 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-gray w-5 h-5 pointer-events-none" 
              aria-hidden="true"
            />
          </div>

          {/* Advanced Filters Button */}
          {showAdvancedFilters && (
            <button
              className="h-12 px-4 border border-border-light rounded-xl hover:bg-light-bg focus:border-primary-yellow focus:outline-none focus:ring-2 focus:ring-primary-yellow/20 transition-all flex items-center gap-2 text-text-secondary hover:text-text-primary font-medium"
              aria-label="Расширенные фильтры"
            >
              <Filter className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:inline">Фильтры</span>
            </button>
          )}
        </motion.div>
        
        {/* Results Count */}
        {searchQuery && resultsCount !== undefined && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 text-sm text-text-gray bg-white px-4 py-2 rounded-lg border border-border-light"
            id={`${searchId}-results`}
            role="status"
            aria-live="polite"
          >
            <CheckCircle className="w-4 h-4 text-success" aria-hidden="true" />
            <span>
              {resultsCount === 0 ? 'Ничего не найдено' : `${resultsCount} ${resultsCount === 1 ? 'результат' : resultsCount < 5 ? 'результата' : 'результатов'} найдено`}
            </span>
          </motion.div>
        )}
      </motion.div>
    );
  }
);

FAQHeader.displayName = 'FAQHeader';

export { FAQHeader, faqHeaderVariants, searchBarVariants };
export type { FAQHeaderProps, FAQHeaderExtendedProps };