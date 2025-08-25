/**
 * PROJECTDES AI ACADEMY - LANGUAGE SWITCHER
 * Multilingual support for Russian and Hebrew
 * Version: 1.0.0
 */

'use strict';

// =============================================================================
// LANGUAGE SWITCHER CLASS
// =============================================================================

class LanguageSwitcher {
    constructor() {
        this.languages = ['ru', 'he'];
        this.currentLang = this.getStoredLanguage() || 'ru';
        this.translations = {};
        this.isLoading = false;
        this.loadingPromises = new Map();
        
        // DOM elements
        this.langButtons = document.querySelectorAll('.lang-btn');
        this.elementsToTranslate = document.querySelectorAll('[data-i18n]');
        this.placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        
        this.init();
    }

    /**
     * Initialize the language switcher
     */
    async init() {
        try {
            // Load translation files
            await this.loadAllTranslations();
            
            // Set initial language
            await this.setLanguage(this.currentLang, false);
            
            // Setup event listeners
            this.setupEventListeners();
            
            console.log('Language switcher initialized successfully');
        } catch (error) {
            console.error('Failed to initialize language switcher:', error);
            this.handleError(error);
        }
    }

    /**
     * Load all translation files
     */
    async loadAllTranslations() {
        const loadPromises = this.languages.map(lang => this.loadTranslation(lang));
        await Promise.all(loadPromises);
    }

    /**
     * Load translation file for specific language
     */
    async loadTranslation(lang) {
        if (this.loadingPromises.has(lang)) {
            return this.loadingPromises.get(lang);
        }

        const loadPromise = this.fetchTranslation(lang);
        this.loadingPromises.set(lang, loadPromise);
        
        try {
            const translations = await loadPromise;
            this.translations[lang] = translations;
            console.log(`Loaded translations for ${lang}`);
        } catch (error) {
            console.error(`Failed to load translations for ${lang}:`, error);
            this.translations[lang] = this.getFallbackTranslations(lang);
        } finally {
            this.loadingPromises.delete(lang);
        }
    }

    /**
     * Fetch translation file from server
     */
    async fetchTranslation(lang) {
        const response = await fetch(`locales/${lang}.json`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const translations = await response.json();
        
        if (!translations || typeof translations !== 'object') {
            throw new Error('Invalid translation file format');
        }
        
        return translations;
    }

    /**
     * Get fallback translations for language
     */
    getFallbackTranslations(lang) {
        const fallbacks = {
            ru: {
                'nav.home': 'Главная',
                'nav.programs': 'Программы',
                'nav.about': 'О нас',
                'nav.contacts': 'Контакты',
                'error.translation_failed': 'Ошибка загрузки переводов'
            },
            he: {
                'nav.home': 'בית',
                'nav.programs': 'תוכניות',
                'nav.about': 'אודות',
                'nav.contacts': 'צור קשר',
                'error.translation_failed': 'שגיאה בטעינת התרגומים'
            }
        };
        
        return fallbacks[lang] || fallbacks['ru'];
    }

    /**
     * Setup event listeners for language buttons
     */
    setupEventListeners() {
        this.langButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = button.dataset.lang;
                if (lang && lang !== this.currentLang) {
                    this.switchLanguage(lang);
                }
            });
        });

        // Handle keyboard navigation
        this.langButtons.forEach(button => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    }

    /**
     * Switch to specified language
     */
    async switchLanguage(lang) {
        if (this.isLoading || lang === this.currentLang) {
            return;
        }

        try {
            this.setLoadingState(true);
            
            // Load translation if not already loaded
            if (!this.translations[lang]) {
                await this.loadTranslation(lang);
            }
            
            // Apply language change
            await this.setLanguage(lang, true);
            
            // Store preference
            this.storeLanguage(lang);
            
            // Update URL if needed (optional)
            this.updateURL(lang);
            
            console.log(`Successfully switched to ${lang}`);
            
        } catch (error) {
            console.error(`Failed to switch to ${lang}:`, error);
            this.showError('Failed to switch language');
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Set language and apply translations
     */
    async setLanguage(lang, animate = false) {
        if (!this.translations[lang]) {
            throw new Error(`Translations not loaded for ${lang}`);
        }

        this.currentLang = lang;
        
        // Update document language attributes
        this.updateDocumentLanguage(lang);
        
        // Apply translations with optional animation
        if (animate) {
            await this.animateLanguageChange();
        } else {
            this.applyTranslations();
        }
        
        // Update active button state
        this.updateButtonStates();
    }

    /**
     * Update document language attributes
     */
    updateDocumentLanguage(lang) {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
        
        // Update meta tags if they exist
        const metaLang = document.querySelector('meta[name="language"]');
        if (metaLang) {
            metaLang.setAttribute('content', lang);
        }
    }

    /**
     * Apply translations to DOM elements
     */
    applyTranslations() {
        const translations = this.translations[this.currentLang];
        
        // Translate text content
        this.elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getNestedTranslation(translations, key);
            
            if (translation) {
                element.textContent = translation;
            } else {
                console.warn(`Translation missing for key: ${key}`);
            }
        });
        
        // Translate placeholder attributes
        this.placeholderElements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.getNestedTranslation(translations, key);
            
            if (translation) {
                element.setAttribute('placeholder', translation);
            }
        });
        
        // Handle special cases
        this.handleSpecialTranslations(translations);
    }

    /**
     * Get nested translation value using dot notation
     */
    getNestedTranslation(translations, key) {
        return key.split('.').reduce((obj, prop) => {
            return obj && obj[prop] !== undefined ? obj[prop] : null;
        }, translations);
    }

    /**
     * Handle special translation cases
     */
    handleSpecialTranslations(translations) {
        // Update page titles
        const pageTitle = document.querySelector('title[data-i18n]');
        if (pageTitle) {
            const key = pageTitle.getAttribute('data-i18n');
            const translation = this.getNestedTranslation(translations, key);
            if (translation) {
                document.title = translation;
            }
        }
        
        // Update meta descriptions
        const metaDesc = document.querySelector('meta[name="description"][data-i18n]');
        if (metaDesc) {
            const key = metaDesc.getAttribute('data-i18n');
            const translation = this.getNestedTranslation(translations, key);
            if (translation) {
                metaDesc.setAttribute('content', translation);
            }
        }
        
        // Update form validation messages
        this.updateValidationMessages(translations);
    }

    /**
     * Update form validation messages
     */
    updateValidationMessages(translations) {
        const formElements = document.querySelectorAll('input[required], textarea[required]');
        formElements.forEach(element => {
            const validationKey = element.getAttribute('data-validation-i18n');
            if (validationKey) {
                const message = this.getNestedTranslation(translations, validationKey);
                if (message) {
                    element.setCustomValidity(message);
                }
            }
        });
    }

    /**
     * Animate language change
     */
    async animateLanguageChange() {
        // Fade out
        document.body.style.opacity = '0.7';
        document.body.style.transition = 'opacity 0.2s ease';
        
        // Wait for fade
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Apply translations
        this.applyTranslations();
        
        // Fade in
        document.body.style.opacity = '1';
        
        // Clean up
        setTimeout(() => {
            document.body.style.transition = '';
        }, 200);
    }

    /**
     * Update language button states
     */
    updateButtonStates() {
        this.langButtons.forEach(button => {
            const buttonLang = button.dataset.lang;
            
            if (buttonLang === this.currentLang) {
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
            } else {
                button.classList.remove('active');
                button.setAttribute('aria-pressed', 'false');
            }
        });
    }

    /**
     * Set loading state
     */
    setLoadingState(isLoading) {
        this.isLoading = isLoading;
        
        this.langButtons.forEach(button => {
            button.disabled = isLoading;
            
            if (isLoading) {
                button.classList.add('loading');
                button.setAttribute('aria-busy', 'true');
            } else {
                button.classList.remove('loading');
                button.setAttribute('aria-busy', 'false');
            }
        });
    }

    /**
     * Store language preference
     */
    storeLanguage(lang) {
        try {
            localStorage.setItem('preferred_language', lang);
        } catch (error) {
            console.warn('Failed to store language preference:', error);
        }
    }

    /**
     * Get stored language preference
     */
    getStoredLanguage() {
        try {
            return localStorage.getItem('preferred_language');
        } catch (error) {
            console.warn('Failed to get stored language preference:', error);
            return null;
        }
    }

    /**
     * Update URL with language parameter (optional)
     */
    updateURL(lang) {
        if (history.replaceState) {
            const url = new URL(window.location);
            url.searchParams.set('lang', lang);
            history.replaceState(null, '', url.toString());
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'language-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(errorElement);
        
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
            }
        }, 5000);
    }

    /**
     * Handle errors gracefully
     */
    handleError(error) {
        console.error('Language switcher error:', error);
        
        // Try to show error in current language
        const translations = this.translations[this.currentLang];
        const errorMessage = translations && translations.error && translations.error.translation_failed
            ? translations.error.translation_failed
            : 'Translation error occurred';
        
        this.showError(errorMessage);
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLang;
    }

    /**
     * Get available languages
     */
    getAvailableLanguages() {
        return [...this.languages];
    }

    /**
     * Get translation for key
     */
    translate(key, lang = null) {
        const targetLang = lang || this.currentLang;
        const translations = this.translations[targetLang];
        
        if (!translations) {
            console.warn(`No translations loaded for ${targetLang}`);
            return key;
        }
        
        return this.getNestedTranslation(translations, key) || key;
    }

    /**
     * Add new translations dynamically
     */
    addTranslations(lang, newTranslations) {
        if (!this.translations[lang]) {
            this.translations[lang] = {};
        }
        
        Object.assign(this.translations[lang], newTranslations);
        
        // Re-apply translations if this is the current language
        if (lang === this.currentLang) {
            this.applyTranslations();
        }
    }

    /**
     * Destroy the language switcher
     */
    destroy() {
        // Remove event listeners
        this.langButtons.forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });
        
        // Clear stored data
        this.translations = {};
        this.loadingPromises.clear();
        
        console.log('Language switcher destroyed');
    }
}

// =============================================================================
// GLOBAL FUNCTIONS
// =============================================================================

/**
 * Global function to switch language (called from HTML)
 */
function switchLanguage(lang) {
    if (window.languageSwitcher) {
        window.languageSwitcher.switchLanguage(lang);
    } else {
        console.error('Language switcher not initialized');
    }
}

/**
 * Global function to get current language
 */
function getCurrentLanguage() {
    return window.languageSwitcher ? window.languageSwitcher.getCurrentLanguage() : 'ru';
}

/**
 * Global function to translate text
 */
function t(key, lang = null) {
    return window.languageSwitcher ? window.languageSwitcher.translate(key, lang) : key;
}

// =============================================================================
// INITIALIZATION
// =============================================================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Create global instance
        window.languageSwitcher = new LanguageSwitcher();
        
        console.log('Language switcher ready');
    } catch (error) {
        console.error('Failed to initialize language switcher:', error);
    }
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    if (window.languageSwitcher) {
        // Save current state or cleanup if needed
        window.languageSwitcher.storeLanguage(window.languageSwitcher.getCurrentLanguage());
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LanguageSwitcher,
        switchLanguage,
        getCurrentLanguage,
        t
    };
}