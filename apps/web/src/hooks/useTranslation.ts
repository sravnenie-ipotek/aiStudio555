/**
 * Enhanced Translation Hook for AiStudio555 Academy
 * =================================================
 * 
 * Integrates with Strapi CMS for dynamic translations
 * Fallback support for hardcoded translations
 * Session-based language management
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { strapiClient, type TranslationEntry } from '@/lib/strapi-client';
import { languageManager, type SupportedLanguage } from '@/lib/language-manager';

type Language = SupportedLanguage;

interface TranslationCache {
  [key: string]: {
    [language in Language]?: string;
  };
}

// Fallback translations for critical UI elements when Strapi is unavailable
const fallbackTranslations: Record<Language, Record<string, string>> = {
  ru: {
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.close': 'Закрыть',
    'common.cancel': 'Отмена',
    'common.language': 'Язык',
    'nav.courses': 'Курсы',
    'nav.monthlyStarts': 'Старты месяца',
    'nav.instructors': 'Преподаватели',
    'nav.blog': 'Блог',
    'nav.aboutSchool': 'О школе',
    'nav.enrollNow': 'Записаться сейчас',
    'nav.aiManager': 'AI Transformation Manager',
    'nav.noCode': 'No-Code разработка',
    'nav.aiVideo': 'AI видео генерация',
    'nav.allCourses': 'Все курсы',
    'nav.aboutUs': 'О нас',
    'nav.contacts': 'Контакты',
    'nav.careerCenter': 'Карьерный центр',
    'nav.profOrientation': 'Профориентация',
  },
  en: {
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.close': 'Close',
    'common.cancel': 'Cancel',
    'common.language': 'Language',
    'nav.courses': 'Courses',
    'nav.monthlyStarts': 'Monthly Starts',
    'nav.instructors': 'Teachers',
    'nav.blog': 'Blog',
    'nav.aboutSchool': 'About School',
    'nav.enrollNow': 'Enroll Now',
    'nav.aiManager': 'AI Transformation Manager',
    'nav.noCode': 'No-Code Development',
    'nav.aiVideo': 'AI Video Generation',
    'nav.allCourses': 'All Courses',
    'nav.aboutUs': 'About Us',
    'nav.contacts': 'Contacts',
    'nav.careerCenter': 'Career Center',
    'nav.profOrientation': 'Career Guidance',
  },
  he: {
    'common.loading': 'טוען...',
    'common.error': 'שגיאה',
    'common.close': 'סגור',
    'common.cancel': 'ביטול',
    'common.language': 'שפה',
    'nav.courses': 'קורסים',
    'nav.monthlyStarts': 'התחלות חודשיות',
    'nav.instructors': 'מורים',
    'nav.blog': 'בלוג',
    'nav.aboutSchool': 'אודות הבית ספר',
    'nav.enrollNow': 'הרשם עכשיו',
    'nav.aiManager': 'AI Transformation Manager',
    'nav.noCode': 'פיתוח ללא קוד',
    'nav.aiVideo': 'יצירת וידאו AI',
    'nav.allCourses': 'כל הקורסים',
    'nav.aboutUs': 'עלינו',
    'nav.contacts': 'צור קשר',
    'nav.careerCenter': 'מרכז קריירה',
    'nav.profOrientation': 'הכוונה מקצועית',
  },
};

// Enhanced translation function with parameter replacement
function formatTranslation(text: string, params?: Record<string, any>): string {
  if (!params || typeof text !== 'string') {
    return text;
  }

  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }, text);
}

export function useTranslation() {
  const [translationCache, setTranslationCache] = useState<TranslationCache>({});
  const [isLoading, setIsLoading] = useState(false);
  const [strapiConnected, setStrapiConnected] = useState<boolean | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(true); // Track if using fallback translations
  
  // Get current language from language manager
  const currentLanguage = languageManager.getCurrentLanguage();

  // Initialize language manager on mount
  useEffect(() => {
    languageManager.initialize();
    
    // Check Strapi connection status
    const checkStrapiHealth = async () => {
      try {
        const health = await strapiClient.healthCheck();
        setStrapiConnected(health.status === 'ok');
        
        setIsUsingFallback(health.status !== 'ok');
        if (process.env.NODE_ENV === 'development') {
          console.log(`🌐 Strapi connection: ${health.status}`, health.message);
        }
      } catch (error) {
        setStrapiConnected(false);
        setIsUsingFallback(true);
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Strapi health check failed:', error);
        }
      }
    };
    
    checkStrapiHealth();
  }, []);

  // Subscribe to language changes
  useEffect(() => {
    const unsubscribe = languageManager.subscribe((newLanguage) => {
      // Clear cache when language changes to force reload
      setTranslationCache({});
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 Language changed to: ${newLanguage}`);
      }
    });
    
    return unsubscribe;
  }, []);

  // Main translation function
  const t = useCallback(
    async (key: string, params?: Record<string, any>): Promise<string> => {
      // Check cache first
      if (translationCache[key]?.[currentLanguage]) {
        return formatTranslation(translationCache[key][currentLanguage]!, params);
      }

      // Try to get from Strapi if connected
      if (strapiConnected) {
        try {
          setIsLoading(true);
          const translation = await strapiClient.getTranslation(key, currentLanguage);
          
          // Update cache
          setTranslationCache(prev => ({
            ...prev,
            [key]: {
              ...prev[key],
              [currentLanguage]: translation,
            },
          }));
          
          return formatTranslation(translation, params);
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`⚠️ Failed to get translation for key: ${key}`, error);
          }
          // Fall through to fallback logic
        } finally {
          setIsLoading(false);
        }
      }

      // Use fallback translations with hierarchy: current → ru → en → key
      const fallbackHierarchy = languageManager.getFallbackHierarchy(currentLanguage);
      
      for (const lang of fallbackHierarchy) {
        const fallbackText = fallbackTranslations[lang]?.[key];
        if (fallbackText) {
          // Cache the fallback
          setTranslationCache(prev => ({
            ...prev,
            [key]: {
              ...prev[key],
              [currentLanguage]: fallbackText,
            },
          }));
          
          return formatTranslation(fallbackText, params);
        }
      }

      // Return key as final fallback
      if (process.env.NODE_ENV === 'development') {
        console.warn(`🚨 No translation found for key: ${key}`);
      }
      
      return formatTranslation(key, params);
    },
    [currentLanguage, translationCache, strapiConnected],
  );

  // Synchronous translation function for immediate use
  const tSync = useCallback(
    (key: string, params?: Record<string, any>): string => {
      // Check cache first
      if (translationCache[key]?.[currentLanguage]) {
        return formatTranslation(translationCache[key][currentLanguage]!, params);
      }

      // Use fallback translations with hierarchy
      const fallbackHierarchy = languageManager.getFallbackHierarchy(currentLanguage);
      
      for (const lang of fallbackHierarchy) {
        const fallbackText = fallbackTranslations[lang]?.[key];
        if (fallbackText) {
          return formatTranslation(fallbackText, params);
        }
      }

      // Return key as final fallback
      return formatTranslation(key, params);
    },
    [currentLanguage, translationCache],
  );

  // Preload translations for better performance
  const preloadTranslations = useCallback(
    async (keys: string[]) => {
      if (!strapiConnected || keys.length === 0) return;
      
      try {
        setIsLoading(true);
        const translationMap = await strapiClient.getTranslationsMap(keys, currentLanguage);
        
        // Update cache with all translations
        setTranslationCache(prev => {
          const updated = { ...prev };
          Object.entries(translationMap).forEach(([key, value]) => {
            updated[key] = {
              ...updated[key],
              [currentLanguage]: value,
            };
          });
          return updated;
        });
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`📦 Preloaded ${Object.keys(translationMap).length} translations`);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Failed to preload translations:', error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [currentLanguage, strapiConnected],
  );

  // Change language with immediate UI update
  const changeLanguage = useCallback((newLanguage: Language) => {
    languageManager.setLanguage(newLanguage);
  }, []);

  // Clear translation cache (useful for development/admin)
  const clearCache = useCallback(() => {
    setTranslationCache({});
    strapiClient.clearCache();
    if (process.env.NODE_ENV === 'development') {
      console.log('🧹 Translation cache cleared');
    }
  }, []);

  return {
    t,
    tSync, // Synchronous version for immediate use
    language: currentLanguage,
    changeLanguage,
    languages: languageManager.getAvailableLanguages(),
    isLoading,
    strapiConnected,
    isUsingFallback, // Expose fallback status
    preloadTranslations,
    clearCache,
    // Language utility functions
    isRTL: languageManager.isRTL(currentLanguage),
    getLanguageConfig: () => languageManager.getLanguageConfig(currentLanguage),
    getDirectionClass: () => languageManager.getDirectionClass(currentLanguage),
    getLanguageClass: () => languageManager.getLanguageClass(currentLanguage),
  };
}

// Export types for use in components
export type { Language };
export type TranslationFunction = ReturnType<typeof useTranslation>['t'];
