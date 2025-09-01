/**
 * Language Management System for AiStudio555 Academy
 * ==================================================
 * 
 * Handles language detection, session storage, and fallback logic
 */

export type SupportedLanguage = 'ru' | 'en' | 'he';

interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  rtl: boolean;
  flag: string;
}

export const LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    rtl: false,
    flag: '🇷🇺',
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    rtl: false,
    flag: '🇺🇸',
  },
  he: {
    code: 'he',
    name: 'Hebrew',
    nativeName: 'עברית',
    rtl: true,
    flag: '🇮🇱',
  },
};

const DEFAULT_LANGUAGE: SupportedLanguage = 'ru';
const LANGUAGE_STORAGE_KEY = 'aistudio555_language';
const FALLBACK_HIERARCHY: SupportedLanguage[] = ['ru', 'en', 'he'];

class LanguageManager {
  private currentLanguage: SupportedLanguage = DEFAULT_LANGUAGE;
  private listeners: Set<(language: SupportedLanguage) => void> = new Set();
  private isInitialized = false;

  /**
   * Initialize language manager with detection and session restore
   */
  initialize(): SupportedLanguage {
    if (this.isInitialized) {
      return this.currentLanguage;
    }

    try {
      // 1. Check session storage first
      const storedLanguage = this.getStoredLanguage();
      
      if (storedLanguage) {
        this.currentLanguage = storedLanguage;
        if (process.env.NODE_ENV === 'development') {
          console.log(`🌍 Language restored from session: ${storedLanguage}`);
        }
      } else {
        // 2. Auto-detect from browser
        const detectedLanguage = this.detectBrowserLanguage();
        this.currentLanguage = detectedLanguage;
        this.storeLanguage(detectedLanguage);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`🌍 Language auto-detected: ${detectedLanguage}`);
        }
      }

      // Set document direction for RTL support
      this.updateDocumentDirection();
      
      this.isInitialized = true;
    } catch (error) {
      console.warn('Language initialization failed, using default:', error);
      this.currentLanguage = DEFAULT_LANGUAGE;
    }

    return this.currentLanguage;
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): SupportedLanguage {
    if (!this.isInitialized) {
      return this.initialize();
    }
    return this.currentLanguage;
  }

  /**
   * Set language manually (user selection)
   */
  setLanguage(language: SupportedLanguage): void {
    if (!this.isValidLanguage(language)) {
      console.warn(`Invalid language: ${language}, falling back to ${DEFAULT_LANGUAGE}`);
      language = DEFAULT_LANGUAGE;
    }

    const previousLanguage = this.currentLanguage;
    this.currentLanguage = language;
    
    // Store in session
    this.storeLanguage(language);
    
    // Update document direction
    this.updateDocumentDirection();

    if (process.env.NODE_ENV === 'development') {
      console.log(`🌍 Language changed: ${previousLanguage} → ${language}`);
    }

    // Notify listeners
    this.notifyListeners(language);
  }

  /**
   * Get language configuration
   */
  getLanguageConfig(language?: SupportedLanguage): LanguageConfig {
    const lang = language || this.getCurrentLanguage();
    return LANGUAGES[lang];
  }

  /**
   * Get all available languages
   */
  getAvailableLanguages(): LanguageConfig[] {
    return Object.values(LANGUAGES);
  }

  /**
   * Check if language is RTL
   */
  isRTL(language?: SupportedLanguage): boolean {
    const lang = language || this.getCurrentLanguage();
    return LANGUAGES[lang].rtl;
  }

  /**
   * Get fallback language hierarchy for current language
   */
  getFallbackHierarchy(language?: SupportedLanguage): SupportedLanguage[] {
    const lang = language || this.getCurrentLanguage();
    
    // Move current language to front, keep others in default order
    const hierarchy = [lang, ...FALLBACK_HIERARCHY.filter(l => l !== lang)];
    return hierarchy;
  }

  /**
   * Get text with fallback logic
   */
  getTextWithFallback(
    translations: Partial<Record<SupportedLanguage, string>>,
    language?: SupportedLanguage
  ): string {
    const lang = language || this.getCurrentLanguage();
    const hierarchy = this.getFallbackHierarchy(lang);

    // Try each language in fallback hierarchy
    for (const fallbackLang of hierarchy) {
      const text = translations[fallbackLang];
      if (text && text.trim()) {
        return text;
      }
    }

    // If no translation found, return key or empty string
    return Object.values(translations).find(t => t && t.trim()) || '';
  }

  /**
   * Subscribe to language changes
   */
  subscribe(callback: (language: SupportedLanguage) => void): () => void {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Detect browser language preferences
   */
  private detectBrowserLanguage(): SupportedLanguage {
    if (typeof window === 'undefined') {
      return DEFAULT_LANGUAGE;
    }

    try {
      // Get browser language preferences
      const browserLanguages = [
        navigator.language,
        ...(navigator.languages || []),
      ].map(lang => lang.toLowerCase());

      // Check for direct matches first
      for (const browserLang of browserLanguages) {
        const code = browserLang.split('-')[0] as SupportedLanguage;
        if (this.isValidLanguage(code)) {
          return code;
        }
      }

      // Check for partial matches (e.g., 'en-US' → 'en')
      for (const browserLang of browserLanguages) {
        for (const supportedLang of Object.keys(LANGUAGES)) {
          if (browserLang.startsWith(supportedLang)) {
            return supportedLang as SupportedLanguage;
          }
        }
      }

      return DEFAULT_LANGUAGE;
    } catch (error) {
      console.warn('Browser language detection failed:', error);
      return DEFAULT_LANGUAGE;
    }
  }

  /**
   * Get stored language from session storage
   */
  private getStoredLanguage(): SupportedLanguage | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const stored = sessionStorage.getItem(LANGUAGE_STORAGE_KEY);
      
      if (stored && this.isValidLanguage(stored as SupportedLanguage)) {
        return stored as SupportedLanguage;
      }
    } catch (error) {
      console.warn('Failed to read stored language:', error);
    }

    return null;
  }

  /**
   * Store language in session storage
   */
  private storeLanguage(language: SupportedLanguage): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      sessionStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.warn('Failed to store language preference:', error);
    }
  }

  /**
   * Update document direction for RTL support
   */
  private updateDocumentDirection(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const isRtl = this.isRTL();
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = this.currentLanguage;
  }

  /**
   * Check if language code is valid
   */
  private isValidLanguage(language: string): language is SupportedLanguage {
    return language in LANGUAGES;
  }

  /**
   * Notify all listeners about language change
   */
  private notifyListeners(language: SupportedLanguage): void {
    this.listeners.forEach(callback => {
      try {
        callback(language);
      } catch (error) {
        console.error('Language change listener error:', error);
      }
    });
  }

  /**
   * Reset to default language
   */
  reset(): void {
    this.setLanguage(DEFAULT_LANGUAGE);
  }

  /**
   * Get language direction class for CSS
   */
  getDirectionClass(language?: SupportedLanguage): string {
    return this.isRTL(language) ? 'rtl' : 'ltr';
  }

  /**
   * Format text direction for CSS
   */
  getTextDirection(language?: SupportedLanguage): 'rtl' | 'ltr' {
    return this.isRTL(language) ? 'rtl' : 'ltr';
  }

  /**
   * Get language-specific CSS class
   */
  getLanguageClass(language?: SupportedLanguage): string {
    const lang = language || this.getCurrentLanguage();
    return `lang-${lang}`;
  }
}

// Singleton instance
export const languageManager = new LanguageManager();

export default languageManager;