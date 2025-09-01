'use client'

/**
 * FAQAccordion Component
 * Container component for FAQ accordion list with performance optimizations
 * @module @aistudio555/ui/FAQ/FAQAccordion
 */

import React, { forwardRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { FAQItem } from './FAQItem';
import type { FAQAccordionProps, FAQItem as FAQItemType } from './types';

const faqAccordionVariants = cva(
  'space-y-3',
  {
    variants: {
      size: {
        sm: 'space-y-2',
        md: 'space-y-3',
        lg: 'space-y-4',
      },
      layout: {
        compact: 'max-w-3xl mx-auto',
        full: 'w-full',
        centered: 'max-w-4xl mx-auto',
      },
    },
    defaultVariants: {
      size: 'md',
      layout: 'centered',
    },
  }
);

// Animation variants for staggered entrance
const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: {
      duration: 0.2,
    },
  },
};

interface FAQAccordionExtendedProps extends FAQAccordionProps, VariantProps<typeof faqAccordionVariants> {
  // Additional props for extended functionality
  enableVirtualization?: boolean;
  itemHeight?: number;
  maxVisibleItems?: number;
  allowMultipleOpen?: boolean;
  persistOpenState?: boolean;
  onItemStateChange?: (itemId: string, isOpen: boolean) => void;
}

const FAQAccordion = forwardRef<HTMLDivElement, FAQAccordionExtendedProps>(
  ({
    faqs,
    openItems,
    onToggleItem,
    className,
    size,
    layout,
    showCategory = true,
    showPopularBadge = true,
    showReadTime = true,
    showLastUpdated = true,
    animationDelay = 0,
    allowMultipleOpen = true,
    enableVirtualization = false,
    maxVisibleItems,
    onItemStateChange,
    ...props
  }, ref) => {

    // Memoize FAQ list to prevent unnecessary re-renders
    const memoizedFaqs = useMemo(() => faqs, [faqs]);

    // Optimized toggle handler with optional single-open mode
    const handleToggleItem = useCallback((id: string) => {
      if (!allowMultipleOpen && !openItems.includes(id)) {
        // Close all other items when opening a new one (accordion mode)
        onToggleItem(id);
        // Notify of state changes if callback provided
        openItems.forEach(openId => {
          if (openId !== id) {
            onItemStateChange?.(openId, false);
          }
        });
        onItemStateChange?.(id, true);
      } else {
        onToggleItem(id);
        onItemStateChange?.(id, !openItems.includes(id));
      }
    }, [allowMultipleOpen, openItems, onToggleItem, onItemStateChange]);

    // Virtualization logic for large lists
    const visibleFaqs = useMemo(() => {
      if (!enableVirtualization || !maxVisibleItems) {
        return memoizedFaqs;
      }
      return memoizedFaqs.slice(0, maxVisibleItems);
    }, [memoizedFaqs, enableVirtualization, maxVisibleItems]);

    // Generate unique key for each FAQ item
    const getItemKey = useCallback((faq: FAQItemType, index: number) => {
      return `faq-${faq.id}-${index}`;
    }, []);

    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={faqAccordionVariants({ size, layout, className })}
        role="region"
        aria-label="Часто задаваемые вопросы"
        {...props}
      >
        <AnimatePresence mode="wait">
          {visibleFaqs.length > 0 ? (
            <motion.div
              key="faq-list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-3"
            >
              {visibleFaqs.map((faq, index) => {
                const isOpen = openItems.includes(faq.id);
                
                return (
                  <motion.div
                    key={getItemKey(faq, index)}
                    variants={itemVariants}
                    layout
                    layoutId={faq.id}
                    style={{
                      // Add slight delay based on animationDelay prop
                      transitionDelay: `${animationDelay + (index * 0.05)}s`,
                    }}
                  >
                    <FAQItem
                      faq={faq}
                      isOpen={isOpen}
                      onToggle={() => handleToggleItem(faq.id)}
                      index={index}
                      showCategory={showCategory}
                      showPopularBadge={showPopularBadge}
                      showReadTime={showReadTime}
                      showLastUpdated={showLastUpdated}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="no-faqs"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-12"
            >
              <div className="text-text-gray">
                Нет доступных вопросов для отображения
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More Button for Virtualization */}
        {enableVirtualization && maxVisibleItems && faqs.length > maxVisibleItems && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center pt-6"
          >
            <button
              onClick={() => {
                // This would typically trigger loading more items
                // Implementation depends on parent component logic
              }}
              className="inline-flex items-center px-6 py-3 text-primary-yellow border border-primary-yellow rounded-lg hover:bg-primary-yellow hover:text-dark-pure transition-all duration-200 font-medium"
            >
              Показать еще {Math.min(10, faqs.length - maxVisibleItems)} вопросов
            </button>
          </motion.div>
        )}

        {/* Accessibility helpers */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {openItems.length > 0 && (
            `Открыто ${openItems.length} ${openItems.length === 1 ? 'вопрос' : 'вопросов'}`
          )}
        </div>
      </motion.div>
    );
  }
);

FAQAccordion.displayName = 'FAQAccordion';

export { FAQAccordion, faqAccordionVariants };
export type { FAQAccordionProps, FAQAccordionExtendedProps };