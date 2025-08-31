'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  flag: string;
}

const languages: Language[] = [
  { code: 'ru', name: 'Russian', nativeName: 'Русский', dir: 'ltr', flag: '🇷🇺' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', dir: 'rtl', flag: '🇮🇱' },
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', flag: '🇺🇸' },
];

export interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal' | 'mobile';
  className?: string;
}

export function LanguageSwitcher({ variant = 'default', className }: LanguageSwitcherProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Get saved language from localStorage or detect from browser
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      const lang = languages.find(l => l.code === savedLang);
      if (lang) {
        setCurrentLanguage(lang);
        applyLanguage(lang);
      }
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      const lang = languages.find(l => l.code === browserLang) || languages[0];
      setCurrentLanguage(lang);
      applyLanguage(lang);
    }
  }, []);

  const applyLanguage = (language: Language) => {
    // Save to localStorage
    localStorage.setItem('language', language.code);

    // Update HTML attributes
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.dir;

    // Update body classes for RTL styling
    if (language.dir === 'rtl') {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }

    // Trigger language change event for other components
    window.dispatchEvent(new CustomEvent('languageChange', { detail: language }));
  };

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    applyLanguage(language);
    setIsOpen(false);
  };

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang)}
            className={cn(
              'px-2 py-1 text-sm font-medium transition-colors rounded',
              currentLanguage.code === lang.code
                ? 'text-primary-yellow bg-primary-yellow/10'
                : 'text-text-gray hover:text-text-primary',
            )}
            aria-label={`Switch to ${lang.name}`}
            aria-current={currentLanguage.code === lang.code ? 'true' : 'false'}
          >
            {lang.code.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className={cn('space-y-2', className)}>
        <p className="text-sm font-medium text-text-secondary px-3">Language</p>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 text-left transition-colors',
              'hover:bg-surface-light rounded-lg',
              currentLanguage.code === lang.code && 'bg-primary-yellow/10',
            )}
            aria-label={`Switch to ${lang.name}`}
            aria-current={currentLanguage.code === lang.code ? 'true' : 'false'}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{lang.flag}</span>
              <div>
                <p className="text-sm font-medium text-text-primary">{lang.nativeName}</p>
                <p className="text-xs text-text-gray">{lang.name}</p>
              </div>
            </div>
            {currentLanguage.code === lang.code && (
              <Check className="w-4 h-4 text-primary-yellow" />
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn('inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 tap-target text-text-primary hover:bg-surface-light h-11 px-5 text-base min-w-[44px] gap-2', className)}
          aria-label="Language selector"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
          <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
          <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[180px] bg-white dark:bg-dark-secondary rounded-lg shadow-lg border border-border-light p-1"
          sideOffset={5}
          align="end"
        >
          {languages.map((lang) => (
            <DropdownMenu.Item
              key={lang.code}
              className={cn(
                'flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer',
                'hover:bg-surface-light focus:bg-surface-light outline-none',
                'transition-colors',
                currentLanguage.code === lang.code && 'bg-primary-yellow/10',
              )}
              onSelect={() => handleLanguageChange(lang)}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{lang.flag}</span>
                <div>
                  <p className="font-medium text-text-primary">{lang.nativeName}</p>
                  <p className="text-xs text-text-gray">{lang.name}</p>
                </div>
              </div>
              {currentLanguage.code === lang.code && (
                <Check className="w-4 h-4 text-primary-yellow ml-2" />
              )}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
