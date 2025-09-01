'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

export interface LanguageSelectorProps {
  className?: string;
  variant?: 'default' | 'compact' | 'icon-only';
  showFlag?: boolean;
  showNativeName?: boolean;
}

/**
 * Language Selector Component
 * 
 * Features:
 * - Session-based language persistence (not user-based)
 * - RTL language support (Hebrew)
 * - Loading state handling
 * - Strapi connection status awareness
 * - Accessible keyboard navigation
 * - Multiple display variants
 */
export function LanguageSelector({
  className,
  variant = 'default',
  showFlag = true,
  showNativeName = true,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const {
    language: currentLanguage,
    languages,
    changeLanguage,
    isLoading,
    strapiConnected,
    getLanguageConfig,
    isRTL,
  } = useTranslation();

  const currentLangConfig = getLanguageConfig();

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case 'ArrowDown':
        if (!isOpen) {
          event.preventDefault();
          setIsOpen(true);
        }
        break;
    }
  };

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode as any);
    setIsOpen(false);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🌍 Language changed to: ${languageCode}`);
    }
  };

  // Render based on variant
  const renderButton = () => {
    const baseClasses = cn(
      'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
      'border border-dark-gray/30 bg-dark-secondary hover:bg-dark-gray/50',
      'text-white hover:text-primary-yellow focus:outline-none focus:ring-2 focus:ring-primary-yellow/50',
      isOpen && 'bg-dark-gray/50 text-primary-yellow',
      isLoading && 'opacity-50 cursor-not-allowed',
      className
    );

    switch (variant) {
      case 'icon-only':
        return (
          <button
            ref={buttonRef}
            onClick={() => !isLoading && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            className={cn(baseClasses, 'p-2')}
            aria-label={`Current language: ${currentLangConfig.nativeName}`}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            disabled={isLoading}
          >
            {showFlag && currentLangConfig.flag ? (
              <span className="text-lg">{currentLangConfig.flag}</span>
            ) : (
              <Globe className="w-4 h-4" />
            )}
          </button>
        );
      
      case 'compact':
        return (
          <button
            ref={buttonRef}
            onClick={() => !isLoading && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            className={baseClasses}
            aria-label={`Current language: ${currentLangConfig.nativeName}`}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            disabled={isLoading}
          >
            {showFlag && currentLangConfig.flag && (
              <span className="text-sm">{currentLangConfig.flag}</span>
            )}
            <span className="text-sm font-medium uppercase">{currentLanguage}</span>
            <ChevronDown 
              className={cn(
                'w-3 h-3 transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
            />
          </button>
        );
      
      default:
        return (
          <button
            ref={buttonRef}
            onClick={() => !isLoading && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            className={baseClasses}
            aria-label={`Current language: ${currentLangConfig.nativeName}`}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            disabled={isLoading}
          >
            {showFlag && currentLangConfig.flag && (
              <span className="text-base">{currentLangConfig.flag}</span>
            )}
            <span className="text-sm font-medium">
              {showNativeName ? currentLangConfig.nativeName : currentLangConfig.name}
            </span>
            <ChevronDown 
              className={cn(
                'w-4 h-4 transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
            />
          </button>
        );
    }
  };

  return (
    <div className="relative inline-block">
      {renderButton()}
      
      {/* Connection Status Indicator (Development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute -top-1 -right-1">
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              strapiConnected === null && 'bg-yellow-500', // Checking
              strapiConnected === true && 'bg-green-500',  // Connected
              strapiConnected === false && 'bg-red-500'    // Disconnected
            )}
            title={
              strapiConnected === null
                ? 'Checking Strapi connection...'
                : strapiConnected
                ? 'Strapi connected'
                : 'Strapi disconnected (using fallbacks)'
            }
          />
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            'absolute top-full mt-2 min-w-[160px] bg-dark-secondary rounded-lg shadow-xl',
            'border border-dark-gray/30 py-1 z-50',
            isRTL ? 'right-0' : 'left-0'
          )}
          role="listbox"
          aria-label="Language options"
        >
          {languages.map((lang) => {
            const isSelected = lang.code === currentLanguage;
            
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-left transition-colors',
                  'hover:bg-dark-gray/50 hover:text-primary-yellow',
                  isSelected && 'bg-dark-gray/30 text-primary-yellow',
                  !isSelected && 'text-white'
                )}
                role="option"
                aria-selected={isSelected}
              >
                {showFlag && lang.flag && (
                  <span className="text-base flex-shrink-0">{lang.flag}</span>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {showNativeName ? lang.nativeName : lang.name}
                  </span>
                  {showNativeName && lang.name !== lang.nativeName && (
                    <span className="text-xs text-gray-400">{lang.name}</span>
                  )}
                </div>
                {isSelected && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-primary-yellow rounded-full" />
                  </div>
                )}
              </button>
            );
          })}
          
          {/* Loading State */}
          {isLoading && (
            <div className="px-3 py-2 text-xs text-gray-400 border-t border-dark-gray/30">
              Loading translations...
            </div>
          )}
          
          {/* Connection Status */}
          {process.env.NODE_ENV === 'development' && (
            <div className="px-3 py-2 text-xs text-gray-400 border-t border-dark-gray/30">
              {strapiConnected === null && 'Connecting to Strapi...'}
              {strapiConnected === true && '🟢 Strapi connected'}
              {strapiConnected === false && '🔴 Using fallback translations'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;