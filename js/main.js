/**
 * PROJECTDES AI ACADEMY - MAIN JAVASCRIPT
 * Core functionality and utilities for the website
 * Version: 1.0.0
 */

'use strict';

// =============================================================================
// GLOBAL CONSTANTS AND CONFIGURATION
// =============================================================================

const CONFIG = {
    // Animation settings
    ANIMATION_DURATION: 300,
    SCROLL_THRESHOLD: 50,
    TYPING_SPEED: 50,
    
    // API endpoints
    API_BASE_URL: 'https://api.projectdes.ai',
    
    // Form settings
    FORM_TIMEOUT: 10000,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    
    // Performance settings
    DEBOUNCE_DELAY: 300,
    THROTTLE_DELAY: 100
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const Utils = {
    /**
     * Debounce function to limit function calls
     */
    debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    },

    /**
     * Throttle function to limit function calls
     */
    throttle(func, delay) {
        let lastCall = 0;
        return (...args) => {
            const now = new Date().getTime();
            if (now - lastCall >= delay) {
                func.apply(null, args);
                lastCall = now;
            }
        };
    },

    /**
     * Check if element is in viewport
     */
    isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return (
            rect.top <= windowHeight - threshold &&
            rect.bottom >= threshold
        );
    },

    /**
     * Smooth scroll to element
     */
    scrollToElement(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const targetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },

    /**
     * Generate unique ID
     */
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Format currency
     */
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    /**
     * Validate email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate phone number
     */
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/;
        return phoneRegex.test(phone);
    },

    /**
     * Show notification
     */
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
        
        return notification;
    },

    /**
     * Local storage helpers
     */
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Error saving to localStorage:', error);
                return false;
            }
        },

        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('Error reading from localStorage:', error);
                return defaultValue;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Error removing from localStorage:', error);
                return false;
            }
        }
    }
};

// =============================================================================
// NAVIGATION MANAGEMENT
// =============================================================================

class NavigationManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isMenuOpen = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollBehavior();
        this.setActiveLink();
    }

    setupEventListeners() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                }
                
                // Handle smooth scrolling for hash links
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(link.getAttribute('href'));
                    if (target) {
                        Utils.scrollToElement(target, 80);
                    }
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.navMenu.contains(e.target) && 
                !this.navToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.navMenu.classList.add('active');
        this.navToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isMenuOpen = true;
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = '';
        this.isMenuOpen = false;
    }

    setupScrollBehavior() {
        let lastScrollY = window.scrollY;
        
        const handleScroll = Utils.throttle(() => {
            const currentScrollY = window.scrollY;
            
            // Add/remove scrolled class
            if (currentScrollY > CONFIG.SCROLL_THRESHOLD) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll (optional)
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                this.navbar.classList.add('nav-hidden');
            } else {
                this.navbar.classList.remove('nav-hidden');
            }
            
            lastScrollY = currentScrollY;
        }, CONFIG.THROTTLE_DELAY);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPage = link.getAttribute('href').split('/').pop();
            
            if (linkPage === currentPage || 
                (currentPage === '' && linkPage === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
}

// =============================================================================
// SCROLL ANIMATIONS
// =============================================================================

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.animate-on-scroll');
        this.observer = null;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.observeElements();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    }

    observeElements() {
        this.elements.forEach(element => {
            this.observer.observe(element);
        });
    }

    animateElement(element) {
        element.classList.add('in-view');
        
        // Add stagger delay for child elements
        const children = element.querySelectorAll('.stagger-child');
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('animate');
            }, index * 100);
        });
    }
}

// =============================================================================
// STATISTICS COUNTER
// =============================================================================

class StatisticsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat[data-counter]');
        this.observer = null;
        this.init();
    }

    init() {
        this.setupObserver();
    }

    setupObserver() {
        const options = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        this.counters.forEach(counter => {
            this.observer.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseFloat(element.dataset.counter);
        const duration = 2000;
        const stepTime = 50;
        const steps = duration / stepTime;
        const stepValue = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += stepValue;
            
            if (current >= target) {
                element.textContent = target % 1 === 0 ? target : target.toFixed(1);
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }
}

// =============================================================================
// IMAGE LAZY LOADING
// =============================================================================

class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.observer = null;
        this.init();
    }

    init() {
        this.setupObserver();
    }

    setupObserver() {
        const options = {
            threshold: 0,
            rootMargin: '50px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        this.images.forEach(img => {
            this.observer.observe(img);
        });
    }

    loadImage(img) {
        const tempImg = new Image();
        
        tempImg.onload = () => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        };
        
        tempImg.onerror = () => {
            img.classList.add('error');
            console.error('Failed to load image:', img.dataset.src);
        };
        
        tempImg.src = img.dataset.src;
    }
}

// =============================================================================
// FAQ FUNCTIONALITY
// =============================================================================

class FAQManager {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => this.toggleFAQ(item));
            }
        });
    }

    toggleFAQ(item) {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQ items
        this.faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        if (isActive) {
            item.classList.remove('active');
        } else {
            item.classList.add('active');
        }
    }
}

// =============================================================================
// PERFORMANCE MONITORING
// =============================================================================

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        this.measurePageLoad();
        this.setupErrorTracking();
    }

    measurePageLoad() {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            
            this.metrics = {
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                totalLoadTime: perfData.loadEventEnd - perfData.navigationStart
            };
            
            console.log('Performance Metrics:', this.metrics);
            
            // Send to analytics if needed
            if (window.gtag) {
                gtag('event', 'page_load_time', {
                    value: this.metrics.totalLoadTime
                });
            }
        });
    }

    setupErrorTracking() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript Error:', e.error);
            
            // Send to error tracking service if needed
            if (window.gtag) {
                gtag('event', 'exception', {
                    description: e.message,
                    fatal: false
                });
            }
        });
    }
}

// =============================================================================
// ACCESSIBILITY ENHANCEMENTS
// =============================================================================

class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupScreenReaderSupport();
    }

    setupKeyboardNavigation() {
        // Handle Tab navigation for custom elements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupFocusManagement() {
        // Ensure modal focus management
        document.addEventListener('focusin', (e) => {
            const modal = document.querySelector('.modal-overlay.active');
            if (modal && !modal.contains(e.target)) {
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusableElements.length > 0) {
                    focusableElements[0].focus();
                }
            }
        });
    }

    setupScreenReaderSupport() {
        // Add ARIA labels for dynamic content
        const dynamicElements = document.querySelectorAll('[data-dynamic]');
        dynamicElements.forEach(element => {
            if (!element.getAttribute('aria-live')) {
                element.setAttribute('aria-live', 'polite');
            }
        });
    }
}

// =============================================================================
// GLOBAL FUNCTIONS
// =============================================================================

/**
 * Navigate to programs page
 */
function navigateToPrograms() {
    window.location.href = 'programs.html';
}

/**
 * Toggle FAQ item
 */
function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    if (faqItem) {
        faqItem.classList.toggle('active');
    }
}

/**
 * Scroll to top
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Projectdes AI Academy - Website Loaded');
    
    // Initialize all modules
    try {
        new NavigationManager();
        new ScrollAnimations();
        new StatisticsCounter();
        new LazyLoader();
        new FAQManager();
        new PerformanceMonitor();
        new AccessibilityManager();
        
        console.log('All modules initialized successfully');
    } catch (error) {
        console.error('Error initializing modules:', error);
    }
    
    // Set up back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    backToTopButton.onclick = scrollToTop;
    document.body.appendChild(backToTopButton);
    
    // Show/hide back to top button based on scroll
    window.addEventListener('scroll', Utils.throttle(() => {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }, CONFIG.THROTTLE_DELAY), { passive: true });
});

// =============================================================================
// SERVICE WORKER REGISTRATION (Optional)
// =============================================================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Utils,
        NavigationManager,
        ScrollAnimations,
        StatisticsCounter,
        LazyLoader,
        FAQManager,
        PerformanceMonitor,
        AccessibilityManager
    };
}