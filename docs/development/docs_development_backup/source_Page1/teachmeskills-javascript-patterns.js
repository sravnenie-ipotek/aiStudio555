/**
 * TeachMeSkills JavaScript Patterns & Functionality Analysis
 * Extracted from: https://teachmeskills.by/
 * Date: 2025-08-31
 * Purpose: Reference for ProjectDes Academy development
 */

// ===== CORE FUNCTIONALITY PATTERNS =====

/**
 * Mobile Navigation Toggle
 * Pattern: Simple show/hide with CSS class toggling
 */
class MobileNavigation {
  constructor() {
    this.navToggle = document.querySelector('.tms-nav__toggle');
    this.navMenu = document.querySelector('.tms-nav__menu');
    this.isOpen = false;
    
    this.init();
  }
  
  init() {
    if (this.navToggle && this.navMenu) {
      this.navToggle.addEventListener('click', () => this.toggle());
      
      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!this.navToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
          this.close();
        }
      });
      
      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.close();
        }
      });
    }
  }
  
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  
  open() {
    this.navMenu.classList.add('tms-nav__menu--open');
    this.navToggle.setAttribute('aria-expanded', 'true');
    this.isOpen = true;
  }
  
  close() {
    this.navMenu.classList.remove('tms-nav__menu--open');
    this.navToggle.setAttribute('aria-expanded', 'false');
    this.isOpen = false;
  }
}

/**
 * Smooth Scrolling
 * Pattern: Smooth scroll to anchor links with offset for fixed header
 */
class SmoothScroll {
  constructor(headerHeight = 80) {
    this.headerHeight = headerHeight;
    this.init();
  }
  
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.getBoundingClientRect().top + 
                          window.pageYOffset - this.headerHeight;
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

/**
 * Header Scroll Effects
 * Pattern: Header styling changes on scroll with performance optimization
 */
class HeaderScrollEffects {
  constructor() {
    this.header = document.querySelector('.tms-header');
    this.lastScrollTop = 0;
    this.scrollThreshold = 100;
    this.ticking = false;
    
    this.init();
  }
  
  init() {
    if (this.header) {
      window.addEventListener('scroll', () => this.onScroll());
    }
  }
  
  onScroll() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.updateHeader();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }
  
  updateHeader() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class for styling
    if (scrollTop > this.scrollThreshold) {
      this.header.classList.add('tms-header--scrolled');
    } else {
      this.header.classList.remove('tms-header--scrolled');
    }
    
    // Hide/show header on scroll direction
    if (scrollTop > this.lastScrollTop && scrollTop > this.scrollThreshold) {
      // Scrolling down - hide header
      this.header.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up - show header
      this.header.style.transform = 'translateY(0)';
    }
    
    this.lastScrollTop = scrollTop;
  }
}

/**
 * Course Card Interactions
 * Pattern: Enhanced hover effects and click handling
 */
class CourseCardInteractions {
  constructor() {
    this.cards = document.querySelectorAll('.tms-card');
    this.init();
  }
  
  init() {
    this.cards.forEach(card => {
      // Enhanced hover effects
      card.addEventListener('mouseenter', () => this.onCardHover(card));
      card.addEventListener('mouseleave', () => this.onCardLeave(card));
      
      // Click tracking
      card.addEventListener('click', (e) => this.onCardClick(card, e));
      
      // Keyboard support
      if (card.getAttribute('tabindex') !== null) {
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.onCardClick(card, e);
          }
        });
      }
    });
  }
  
  onCardHover(card) {
    card.style.transform = 'translateY(-8px) scale(1.02)';
    card.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
    
    // Animate card elements
    const title = card.querySelector('.tms-card__title');
    if (title) {
      title.style.color = '#ffda17';
    }
  }
  
  onCardLeave(card) {
    card.style.transform = 'translateY(0) scale(1)';
    card.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    
    const title = card.querySelector('.tms-card__title');
    if (title) {
      title.style.color = '';
    }
  }
  
  onCardClick(card, event) {
    // Analytics tracking
    const cardTitle = card.querySelector('.tms-card__title')?.textContent || 'Unknown Course';
    this.trackCardClick(cardTitle);
    
    // Handle different click targets
    const button = event.target.closest('.tms-btn');
    if (button) {
      this.handleButtonClick(button, cardTitle);
    }
  }
  
  trackCardClick(courseTitle) {
    // Analytics integration
    if (typeof gtag !== 'undefined') {
      gtag('event', 'course_card_click', {
        event_category: 'Course Interest',
        event_label: courseTitle
      });
    }
  }
  
  handleButtonClick(button, courseTitle) {
    // Course enrollment or info request
    console.log(`Button clicked for course: ${courseTitle}`);
    
    // Could trigger modal or redirect
    if (button.textContent.includes('Подробнее')) {
      this.showCourseDetails(courseTitle);
    } else if (button.textContent.includes('Записаться')) {
      this.showEnrollmentForm(courseTitle);
    }
  }
  
  showCourseDetails(courseTitle) {
    // Implementation would show course details modal
    console.log(`Showing details for: ${courseTitle}`);
  }
  
  showEnrollmentForm(courseTitle) {
    // Implementation would show enrollment form modal
    console.log(`Showing enrollment form for: ${courseTitle}`);
  }
}

/**
 * Form Validation and Handling
 * Pattern: Real-time validation with visual feedback
 */
class FormHandler {
  constructor() {
    this.forms = document.querySelectorAll('form[data-form-type]');
    this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.phoneRegex = /^[\+]?[0-9]{10,15}$/;
    
    this.init();
  }
  
  init() {
    this.forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmit(e, form));
      
      // Real-time validation
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearFieldError(input));
      });
    });
  }
  
  handleSubmit(event, form) {
    event.preventDefault();
    
    if (this.validateForm(form)) {
      this.submitForm(form);
    }
  }
  
  validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type || field.tagName.toLowerCase();
    const isRequired = field.hasAttribute('required');
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (isRequired && !value) {
      isValid = false;
      errorMessage = 'Это поле обязательно для заполнения';
    }
    // Email validation
    else if (fieldType === 'email' && value && !this.emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Введите корректный email адрес';
    }
    // Phone validation
    else if (fieldType === 'tel' && value && !this.phoneRegex.test(value)) {
      isValid = false;
      errorMessage = 'Введите корректный номер телефона';
    }
    // Name validation (no numbers)
    else if (field.name === 'name' && value && /\d/.test(value)) {
      isValid = false;
      errorMessage = 'Имя не должно содержать цифры';
    }
    
    this.showFieldValidation(field, isValid, errorMessage);
    return isValid;
  }
  
  showFieldValidation(field, isValid, errorMessage) {
    const errorElement = field.parentNode.querySelector('.field-error') || 
                        this.createErrorElement(field);
    
    if (isValid) {
      field.classList.remove('field-invalid');
      field.classList.add('field-valid');
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    } else {
      field.classList.remove('field-valid');
      field.classList.add('field-invalid');
      errorElement.textContent = errorMessage;
      errorElement.style.display = 'block';
    }
  }
  
  createErrorElement(field) {
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.cssText = `
      color: #e53e3e;
      font-size: 14px;
      margin-top: 4px;
      display: none;
    `;
    field.parentNode.appendChild(errorElement);
    return errorElement;
  }
  
  clearFieldError(field) {
    field.classList.remove('field-invalid');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }
  
  async submitForm(form) {
    const formData = new FormData(form);
    const formType = form.dataset.formType;
    
    try {
      this.showFormLoading(form, true);
      
      const response = await this.sendFormData(formData, formType);
      
      if (response.success) {
        this.showFormSuccess(form);
        this.trackFormSubmission(formType, 'success');
      } else {
        this.showFormError(form, response.message);
        this.trackFormSubmission(formType, 'error');
      }
    } catch (error) {
      this.showFormError(form, 'Произошла ошибка при отправке формы');
      this.trackFormSubmission(formType, 'error');
    } finally {
      this.showFormLoading(form, false);
    }
  }
  
  async sendFormData(formData, formType) {
    // Integration with EmailJS or backend API
    const endpoint = formType === 'enrollment' ? '/api/enroll' : '/api/contact';
    
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    
    return await response.json();
  }
  
  showFormLoading(form, isLoading) {
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (isLoading) {
      submitButton.disabled = true;
      submitButton.textContent = 'Отправка...';
      submitButton.classList.add('loading');
    } else {
      submitButton.disabled = false;
      submitButton.textContent = submitButton.dataset.originalText || 'Отправить';
      submitButton.classList.remove('loading');
    }
  }
  
  showFormSuccess(form) {
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success-message';
    successMessage.innerHTML = `
      <div style="color: #38a169; padding: 16px; background: #f0fff4; border-radius: 8px; margin-top: 16px;">
        ✅ Спасибо! Ваша заявка отправлена успешно.
      </div>
    `;
    
    form.appendChild(successMessage);
    form.reset();
    
    setTimeout(() => {
      successMessage.remove();
    }, 5000);
  }
  
  showFormError(form, message) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'form-error-message';
    errorMessage.innerHTML = `
      <div style="color: #e53e3e; padding: 16px; background: #fed7d7; border-radius: 8px; margin-top: 16px;">
        ❌ ${message}
      </div>
    `;
    
    form.appendChild(errorMessage);
    
    setTimeout(() => {
      errorMessage.remove();
    }, 5000);
  }
  
  trackFormSubmission(formType, status) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_submit', {
        event_category: 'Form Interaction',
        event_label: `${formType}_${status}`
      });
    }
  }
}

/**
 * Scroll Animations
 * Pattern: Intersection Observer for performance-optimized animations
 */
class ScrollAnimations {
  constructor() {
    this.animatedElements = document.querySelectorAll('.tms-fade-in, [data-animate]');
    this.observer = null;
    
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );
      
      this.animatedElements.forEach(element => {
        this.observer.observe(element);
      });
    } else {
      // Fallback for older browsers
      this.animatedElements.forEach(element => {
        element.classList.add('animated');
      });
    }
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        // Stop observing once animated
        this.observer.unobserve(entry.target);
      }
    });
  }
}

/**
 * Performance Utilities
 * Pattern: Common performance optimization functions
 */
class PerformanceUtils {
  static debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  }
  
  static throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function(...args) {
      if (!lastRan) {
        func.apply(this, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }
  
  static preloadImages(imageUrls) {
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }
  
  static lazyLoadImages() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
}

/**
 * Analytics Integration
 * Pattern: Centralized analytics tracking
 */
class Analytics {
  constructor() {
    this.gtag = window.gtag || null;
    this.fbq = window.fbq || null;
    
    this.init();
  }
  
  init() {
    // Track page interactions
    this.trackPageViews();
    this.trackUserEngagement();
    this.trackCourseInteractions();
  }
  
  trackPageViews() {
    // Enhanced page view tracking
    if (this.gtag) {
      this.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }
  
  trackUserEngagement() {
    // Scroll depth tracking
    let maxScroll = 0;
    const throttledScroll = PerformanceUtils.throttle(() => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;
        
        if ([25, 50, 75, 90].includes(scrollPercentage)) {
          this.trackEvent('scroll_depth', {
            event_category: 'User Engagement',
            event_label: `${scrollPercentage}%`
          });
        }
      }
    }, 1000);
    
    window.addEventListener('scroll', throttledScroll);
    
    // Time on page tracking
    let timeOnPage = 0;
    setInterval(() => {
      timeOnPage += 30;
      if ([30, 60, 120, 300].includes(timeOnPage)) {
        this.trackEvent('time_on_page', {
          event_category: 'User Engagement',
          event_label: `${timeOnPage}s`
        });
      }
    }, 30000);
  }
  
  trackCourseInteractions() {
    // Track course card interactions
    document.addEventListener('click', (e) => {
      const courseCard = e.target.closest('.tms-card');
      if (courseCard) {
        const courseTitle = courseCard.querySelector('.tms-card__title')?.textContent;
        
        this.trackEvent('course_interaction', {
          event_category: 'Course Interest',
          event_label: courseTitle || 'Unknown Course'
        });
      }
    });
  }
  
  trackEvent(eventName, parameters) {
    // Google Analytics
    if (this.gtag) {
      this.gtag('event', eventName, parameters);
    }
    
    // Facebook Pixel
    if (this.fbq) {
      this.fbq('track', eventName, parameters);
    }
    
    console.log(`Analytics Event: ${eventName}`, parameters);
  }
  
  trackConversion(conversionType, value = null) {
    const parameters = {
      event_category: 'Conversion',
      event_label: conversionType
    };
    
    if (value) {
      parameters.value = value;
    }
    
    this.trackEvent('conversion', parameters);
  }
}

// ===== INITIALIZATION =====

/**
 * Main Application Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  new MobileNavigation();
  new SmoothScroll();
  new HeaderScrollEffects();
  new CourseCardInteractions();
  new FormHandler();
  new ScrollAnimations();
  new Analytics();
  
  // Performance optimizations
  PerformanceUtils.lazyLoadImages();
  
  // Preload critical images
  const criticalImages = [
    '/assets/images/hero-bg.jpg',
    '/assets/images/course-thumbnails/frontend.jpg',
    '/assets/images/course-thumbnails/python.jpg'
  ];
  PerformanceUtils.preloadImages(criticalImages);
  
  console.log('TeachMeSkills website initialized successfully');
});

// ===== ERROR HANDLING =====

window.addEventListener('error', (event) => {
  console.error('JavaScript Error:', event.error);
  
  // Track errors in analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'exception', {
      description: event.error.message,
      fatal: false
    });
  }
});

// ===== SERVICE WORKER REGISTRATION =====

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

// ===== EXPORT FOR MODULE USAGE =====

export {
  MobileNavigation,
  SmoothScroll,
  HeaderScrollEffects,
  CourseCardInteractions,
  FormHandler,
  ScrollAnimations,
  PerformanceUtils,
  Analytics
};