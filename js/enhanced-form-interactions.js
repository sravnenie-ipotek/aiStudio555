/**
 * ENHANCED FORM INTERACTIONS
 * Advanced form handling with floating labels, validation, and UX improvements
 * Fixes overlapping text issues and provides professional interactions
 * Version: 3.0.0
 */

'use strict';

class EnhancedFormSystem {
    constructor() {
        this.forms = new Map();
        this.toasts = [];
        this.validationRules = new Map();
        this.debounceTimers = new Map();
        this.isInitialized = false;
        
        // Configuration
        this.config = {
            debounceTime: 300,
            toastDuration: 5000,
            validationDelay: 500,
            maxToasts: 3,
            enableFloatingLabels: true,
            enableRealTimeValidation: true,
            enableCharacterCounters: true,
            enableKeyboardShortcuts: true
        };

        this.init();
    }

    /**
     * Initialize the enhanced form system
     */
    init() {
        if (this.isInitialized) return;

        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupSystem());
            } else {
                this.setupSystem();
            }
            
            this.isInitialized = true;
            console.log('Enhanced form system initialized');
        } catch (error) {
            console.error('Failed to initialize enhanced form system:', error);
        }
    }

    /**
     * Setup the entire form system
     */
    setupSystem() {
        this.createToastContainer();
        this.setupValidationRules();
        this.initializeForms();
        this.setupGlobalKeyboardShortcuts();
        this.setupGlobalStyles();
        
        // Setup observers
        this.setupIntersectionObserver();
        this.setupResizeObserver();
    }

    /**
     * Create toast notification container
     */
    createToastContainer() {
        if (document.querySelector('.toast-container')) return;

        const container = document.createElement('div');
        container.className = 'toast-container';
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-label', 'Notifications');
        document.body.appendChild(container);
    }

    /**
     * Setup validation rules
     */
    setupValidationRules() {
        this.validationRules.set('required', {
            validate: (value) => value && value.trim().length > 0,
            message: 'This field is required'
        });

        this.validationRules.set('email', {
            validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Please enter a valid email address'
        });

        this.validationRules.set('phone', {
            validate: (value) => /^[\+]?[(]?[\d\s\-\(\)]{10,}$/.test(value),
            message: 'Please enter a valid phone number'
        });

        this.validationRules.set('minlength', {
            validate: (value, min) => value.length >= parseInt(min),
            message: (min) => `Must be at least ${min} characters`
        });

        this.validationRules.set('maxlength', {
            validate: (value, max) => value.length <= parseInt(max),
            message: (max) => `Must not exceed ${max} characters`
        });

        this.validationRules.set('url', {
            validate: (value) => /^https?:\/\/[^\s]+$/.test(value),
            message: 'Please enter a valid URL'
        });
    }

    /**
     * Initialize all forms on the page
     */
    initializeForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            this.initializeForm(form);
        });
    }

    /**
     * Initialize a single form
     */
    initializeForm(form) {
        if (this.forms.has(form)) return;

        const formData = {
            element: form,
            fields: new Map(),
            isValid: false,
            isSubmitting: false
        };

        // Add form classes
        form.classList.add('enhanced-form');
        
        // Setup form fields
        this.setupFormFields(form, formData);
        
        // Setup form submission
        this.setupFormSubmission(form, formData);
        
        // Store form data
        this.forms.set(form, formData);
        
        console.log('Form initialized:', form);
    }

    /**
     * Setup form fields with enhanced functionality
     */
    setupFormFields(form, formData) {
        const fields = form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => {
            this.setupField(field, formData);
        });
    }

    /**
     * Setup individual field with all enhancements
     */
    setupField(field, formData) {
        const fieldData = {
            element: field,
            isValid: false,
            hasBeenTouched: false,
            errorMessage: '',
            successMessage: ''
        };

        // Setup field container
        this.setupFieldContainer(field);
        
        // Setup floating labels
        if (this.config.enableFloatingLabels) {
            this.setupFloatingLabel(field);
        }
        
        // Setup character counter
        if (this.config.enableCharacterCounters && (field.type === 'textarea' || field.hasAttribute('maxlength'))) {
            this.setupCharacterCounter(field);
        }
        
        // Setup validation
        if (this.config.enableRealTimeValidation) {
            this.setupFieldValidation(field, fieldData);
        }
        
        // Setup field interactions
        this.setupFieldInteractions(field, fieldData);
        
        // Store field data
        formData.fields.set(field, fieldData);
    }

    /**
     * Setup field container structure
     */
    setupFieldContainer(field) {
        let container = field.closest('.form-group');
        
        if (!container) {
            container = document.createElement('div');
            container.className = 'form-group';
            field.parentNode.insertBefore(container, field);
            container.appendChild(field);
            
            // Move label if exists
            const label = document.querySelector(`label[for="${field.id}"]`) ||
                         field.previousElementSibling?.tagName === 'LABEL' ? field.previousElementSibling : null;
            
            if (label && !container.contains(label)) {
                container.insertBefore(label, field);
            }
        }
        
        // Ensure proper field classes
        field.classList.add('form-input');
        if (field.tagName === 'TEXTAREA') {
            field.classList.add('form-textarea');
        }
        if (field.tagName === 'SELECT') {
            field.classList.add('form-select');
        }
    }

    /**
     * Setup floating label functionality
     */
    setupFloatingLabel(field) {
        const container = field.closest('.form-group');
        const label = container.querySelector('label');
        
        if (!label) return;

        // Convert to floating label structure
        container.classList.add('form-floating');
        label.classList.add('form-label');
        
        // Add placeholder for floating label trigger
        if (!field.placeholder) {
            field.placeholder = ' '; // Single space to trigger CSS :not(:placeholder-shown)
        }
        
        // Handle initial state
        this.updateFloatingLabel(field);
        
        // Handle field interactions
        field.addEventListener('focus', () => this.updateFloatingLabel(field));
        field.addEventListener('blur', () => this.updateFloatingLabel(field));
        field.addEventListener('input', () => this.updateFloatingLabel(field));
    }

    /**
     * Update floating label state
     */
    updateFloatingLabel(field) {
        const container = field.closest('.form-group');
        const label = container.querySelector('label');
        
        if (!label) return;

        const hasValue = field.value && field.value.trim().length > 0;
        const isFocused = field === document.activeElement;
        
        if (hasValue || isFocused) {
            container.classList.add('field-has-value');
            label.classList.add('label-floating');
        } else {
            container.classList.remove('field-has-value');
            label.classList.remove('label-floating');
        }
    }

    /**
     * Setup character counter
     */
    setupCharacterCounter(field) {
        const container = field.closest('.form-group');
        const maxLength = field.getAttribute('maxlength');
        
        if (!maxLength) return;

        // Create counter element
        const counter = document.createElement('div');
        counter.className = 'form-counter';
        counter.setAttribute('aria-live', 'polite');
        
        // Update counter
        const updateCounter = () => {
            const current = field.value.length;
            const max = parseInt(maxLength);
            const remaining = max - current;
            
            counter.textContent = `${current}/${max}`;
            
            // Update counter state
            counter.classList.remove('warning', 'error');
            if (remaining < max * 0.1) {
                counter.classList.add('error');
            } else if (remaining < max * 0.2) {
                counter.classList.add('warning');
            }
        };
        
        // Add event listeners
        field.addEventListener('input', updateCounter);
        field.addEventListener('paste', () => setTimeout(updateCounter, 0));
        
        // Add counter to DOM
        container.appendChild(counter);
        
        // Initial update
        updateCounter();
    }

    /**
     * Setup field validation
     */
    setupFieldValidation(field, fieldData) {
        const validateField = this.debounce(() => {
            this.validateField(field, fieldData);
        }, this.config.validationDelay);

        // Validation events
        field.addEventListener('blur', () => {
            fieldData.hasBeenTouched = true;
            this.validateField(field, fieldData);
        });

        field.addEventListener('input', () => {
            if (fieldData.hasBeenTouched) {
                validateField();
            }
        });

        // Special handling for paste events
        field.addEventListener('paste', () => {
            setTimeout(() => {
                if (fieldData.hasBeenTouched) {
                    this.validateField(field, fieldData);
                }
            }, 0);
        });
    }

    /**
     * Validate individual field
     */
    validateField(field, fieldData) {
        const container = field.closest('.form-group');
        const value = field.value.trim();
        
        // Clear previous state
        container.classList.remove('error', 'success');
        this.clearFieldMessage(container);
        
        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Type-based validation (only if field has value)
        if (isValid && value) {
            // Email validation
            if (field.type === 'email') {
                const emailRule = this.validationRules.get('email');
                if (!emailRule.validate(value)) {
                    isValid = false;
                    errorMessage = emailRule.message;
                }
            }
            
            // Phone validation
            if (field.type === 'tel') {
                const phoneRule = this.validationRules.get('phone');
                if (!phoneRule.validate(value)) {
                    isValid = false;
                    errorMessage = phoneRule.message;
                }
            }
            
            // URL validation
            if (field.type === 'url') {
                const urlRule = this.validationRules.get('url');
                if (!urlRule.validate(value)) {
                    isValid = false;
                    errorMessage = urlRule.message;
                }
            }
            
            // Length validation
            const minLength = field.getAttribute('minlength');
            const maxLength = field.getAttribute('maxlength');
            
            if (minLength && value.length < parseInt(minLength)) {
                isValid = false;
                errorMessage = `Must be at least ${minLength} characters`;
            }
            
            if (maxLength && value.length > parseInt(maxLength)) {
                isValid = false;
                errorMessage = `Must not exceed ${maxLength} characters`;
            }
        }
        
        // Custom validation
        const customValidation = field.getAttribute('data-validation');
        if (isValid && customValidation && value) {
            try {
                const validationFn = new Function('value', customValidation);
                if (!validationFn(value)) {
                    isValid = false;
                    errorMessage = field.getAttribute('data-validation-message') || 'Invalid input';
                }
            } catch (e) {
                console.warn('Custom validation error:', e);
            }
        }
        
        // Update field state
        fieldData.isValid = isValid;
        fieldData.errorMessage = errorMessage;
        
        if (isValid) {
            container.classList.add('success');
            this.showFieldMessage(container, 'Valid', 'success');
        } else if (fieldData.hasBeenTouched) {
            container.classList.add('error');
            this.showFieldMessage(container, errorMessage, 'error');
        }
        
        return isValid;
    }

    /**
     * Show field message
     */
    showFieldMessage(container, message, type) {
        this.clearFieldMessage(container);
        
        const messageEl = document.createElement('div');
        messageEl.className = `form-${type}-message`;
        messageEl.textContent = message;
        messageEl.setAttribute('role', type === 'error' ? 'alert' : 'status');
        
        container.appendChild(messageEl);
        
        // Animate in
        requestAnimationFrame(() => {
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateY(0)';
        });
    }

    /**
     * Clear field message
     */
    clearFieldMessage(container) {
        const existingMessages = container.querySelectorAll('.form-error-message, .form-success-message');
        existingMessages.forEach(msg => msg.remove());
    }

    /**
     * Setup field interactions
     */
    setupFieldInteractions(field, fieldData) {
        // Focus enhancement
        field.addEventListener('focus', () => {
            field.closest('.form-group').classList.add('field-focused');
        });
        
        field.addEventListener('blur', () => {
            field.closest('.form-group').classList.remove('field-focused');
        });
        
        // Auto-resize textarea
        if (field.tagName === 'TEXTAREA') {
            this.setupAutoResize(field);
        }
        
        // Format phone numbers
        if (field.type === 'tel') {
            this.setupPhoneFormatting(field);
        }
    }

    /**
     * Setup auto-resize for textarea
     */
    setupAutoResize(textarea) {
        const resize = () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        };
        
        textarea.addEventListener('input', resize);
        textarea.addEventListener('paste', () => setTimeout(resize, 0));
        
        // Initial resize
        resize();
    }

    /**
     * Setup phone number formatting
     */
    setupPhoneFormatting(field) {
        field.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            // Basic international formatting
            if (value.length > 0) {
                if (value.startsWith('972')) {
                    // Israeli number
                    value = value.replace(/^972(\d{2})(\d{3})(\d{4})/, '+972 $1 $2 $3');
                } else if (value.startsWith('1')) {
                    // US/Canada number
                    value = value.replace(/^1(\d{3})(\d{3})(\d{4})/, '+1 ($1) $2-$3');
                } else {
                    // Generic formatting
                    if (value.length > 10) {
                        value = '+' + value;
                    }
                }
            }
            
            e.target.value = value;
        });
    }

    /**
     * Setup form submission handling
     */
    setupFormSubmission(form, formData) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleFormSubmission(form, formData);
        });
    }

    /**
     * Handle form submission
     */
    async handleFormSubmission(form, formData) {
        if (formData.isSubmitting) return;

        // Validate entire form
        const isValid = this.validateForm(formData);
        
        if (!isValid) {
            this.showToast('Please fix the errors before submitting', 'error');
            this.focusFirstError(form);
            return;
        }
        
        // Get submit button
        const submitBtn = form.querySelector('[type="submit"]') || form.querySelector('.btn-primary');
        
        try {
            // Set loading state
            formData.isSubmitting = true;
            this.setButtonLoadingState(submitBtn, true);
            
            // Collect form data
            const data = this.collectFormData(form);
            
            // Show progress
            this.showSubmissionProgress(form);
            
            // Simulate submission (replace with actual API call)
            await this.submitForm(data);
            
            // Success handling
            this.handleSubmissionSuccess(form, formData);
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.handleSubmissionError(form, formData, error);
        } finally {
            // Reset loading state
            formData.isSubmitting = false;
            this.setButtonLoadingState(submitBtn, false);
            this.hideSubmissionProgress(form);
        }
    }

    /**
     * Validate entire form
     */
    validateForm(formData) {
        let isValid = true;
        
        formData.fields.forEach((fieldData, field) => {
            fieldData.hasBeenTouched = true;
            if (!this.validateField(field, fieldData)) {
                isValid = false;
            }
        });
        
        formData.isValid = isValid;
        return isValid;
    }

    /**
     * Focus first error field
     */
    focusFirstError(form) {
        const firstError = form.querySelector('.form-group.error input, .form-group.error textarea, .form-group.error select');
        if (firstError) {
            firstError.focus();
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    /**
     * Set button loading state
     */
    setButtonLoadingState(button, isLoading) {
        if (!button) return;
        
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
            button.setAttribute('aria-busy', 'true');
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            button.setAttribute('aria-busy', 'false');
        }
    }

    /**
     * Show submission progress
     */
    showSubmissionProgress(form) {
        const progress = document.createElement('div');
        progress.className = 'progress-bar';
        progress.innerHTML = '<div class="progress-fill"></div>';
        
        form.appendChild(progress);
        
        // Animate progress
        const fill = progress.querySelector('.progress-fill');
        let width = 0;
        const interval = setInterval(() => {
            width += Math.random() * 30;
            if (width >= 90) {
                clearInterval(interval);
                width = 90;
            }
            fill.style.width = width + '%';
        }, 200);
        
        form._progressInterval = interval;
        form._progressBar = progress;
    }

    /**
     * Hide submission progress
     */
    hideSubmissionProgress(form) {
        if (form._progressInterval) {
            clearInterval(form._progressInterval);
        }
        
        if (form._progressBar) {
            const fill = form._progressBar.querySelector('.progress-fill');
            fill.style.width = '100%';
            
            setTimeout(() => {
                if (form._progressBar) {
                    form._progressBar.remove();
                    form._progressBar = null;
                }
            }, 500);
        }
    }

    /**
     * Collect form data
     */
    collectFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    /**
     * Submit form (replace with actual API call)
     */
    async submitForm(data) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                if (Math.random() > 0.1) {
                    resolve({ success: true, message: 'Form submitted successfully!' });
                } else {
                    reject(new Error('Submission failed. Please try again.'));
                }
            }, 2000);
        });
    }

    /**
     * Handle submission success
     */
    handleSubmissionSuccess(form, formData) {
        this.showToast('Form submitted successfully!', 'success');
        
        // Reset form
        form.reset();
        
        // Reset field states
        formData.fields.forEach((fieldData, field) => {
            fieldData.hasBeenTouched = false;
            fieldData.isValid = false;
            this.clearFieldMessage(field.closest('.form-group'));
            field.closest('.form-group').classList.remove('error', 'success');
            this.updateFloatingLabel(field);
        });
        
        // Trigger custom success event
        form.dispatchEvent(new CustomEvent('form:success', { 
            detail: { form: form } 
        }));
    }

    /**
     * Handle submission error
     */
    handleSubmissionError(form, formData, error) {
        this.showToast(error.message || 'Submission failed. Please try again.', 'error');
        
        // Trigger custom error event
        form.dispatchEvent(new CustomEvent('form:error', { 
            detail: { form: form, error: error } 
        }));
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info', duration = this.config.toastDuration) {
        const container = document.querySelector('.toast-container');
        if (!container) return;

        // Remove oldest toast if at limit
        if (this.toasts.length >= this.config.maxToasts) {
            this.removeToast(this.toasts[0]);
        }

        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        
        const icons = {
            success: '✓',
            error: '⚠',
            warning: '⚠',
            info: 'ℹ'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close notification">×</button>
        `;
        
        // Add event listeners
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.removeToast(toast));
        
        // Auto-remove after duration
        const timeout = setTimeout(() => {
            this.removeToast(toast);
        }, duration);
        
        toast._timeout = timeout;
        
        // Add to container
        container.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Track toast
        this.toasts.push(toast);
    }

    /**
     * Remove toast notification
     */
    removeToast(toast) {
        const index = this.toasts.indexOf(toast);
        if (index > -1) {
            this.toasts.splice(index, 1);
        }
        
        if (toast._timeout) {
            clearTimeout(toast._timeout);
        }
        
        toast.classList.remove('show');
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    /**
     * Setup global keyboard shortcuts
     */
    setupGlobalKeyboardShortcuts() {
        if (!this.config.enableKeyboardShortcuts) return;

        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to submit focused form
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                const activeForm = document.activeElement?.closest('form');
                if (activeForm && this.forms.has(activeForm)) {
                    e.preventDefault();
                    activeForm.dispatchEvent(new Event('submit'));
                }
            }
            
            // Escape to clear all toasts
            if (e.key === 'Escape' && this.toasts.length > 0) {
                this.toasts.slice().forEach(toast => this.removeToast(toast));
            }
        });
    }

    /**
     * Setup global styles
     */
    setupGlobalStyles() {
        if (document.querySelector('#enhanced-form-styles')) return;

        const style = document.createElement('style');
        style.id = 'enhanced-form-styles';
        style.textContent = `
            .enhanced-form {
                position: relative;
            }
            
            .field-focused {
                z-index: 10;
            }
            
            .form-floating .form-label.label-floating {
                transform: scale(0.85);
                transform-origin: left top;
            }
            
            [dir="rtl"] .form-floating .form-label.label-floating {
                transform-origin: right top;
            }
            
            .form-counter.warning {
                color: var(--warning-color, #f59e0b);
            }
            
            .form-counter.error {
                color: var(--error-color, #ef4444);
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * Setup intersection observer for form analytics
     */
    setupIntersectionObserver() {
        if (typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.dispatchEvent(new CustomEvent('form:visible'));
                }
            });
        });

        this.forms.forEach((formData, form) => {
            observer.observe(form);
        });
    }

    /**
     * Setup resize observer for responsive adjustments
     */
    setupResizeObserver() {
        if (typeof ResizeObserver === 'undefined') return;

        const observer = new ResizeObserver((entries) => {
            entries.forEach(entry => {
                const form = entry.target;
                const formData = this.forms.get(form);
                
                if (formData) {
                    // Adjust for mobile/desktop
                    const isMobile = entry.contentRect.width < 640;
                    form.classList.toggle('form-mobile', isMobile);
                    form.classList.toggle('form-desktop', !isMobile);
                }
            });
        });

        this.forms.forEach((formData, form) => {
            observer.observe(form);
        });
    }

    /**
     * Debounce utility function
     */
    debounce(func, wait) {
        const key = func.toString();
        
        return (...args) => {
            if (this.debounceTimers.has(key)) {
                clearTimeout(this.debounceTimers.get(key));
            }
            
            this.debounceTimers.set(key, setTimeout(() => {
                func.apply(this, args);
                this.debounceTimers.delete(key);
            }, wait));
        };
    }

    /**
     * Public API: Add custom validation rule
     */
    addValidationRule(name, rule) {
        this.validationRules.set(name, rule);
    }

    /**
     * Public API: Get form data
     */
    getFormData(form) {
        return this.collectFormData(form);
    }

    /**
     * Public API: Validate form
     */
    validateFormPublic(form) {
        const formData = this.forms.get(form);
        if (formData) {
            return this.validateForm(formData);
        }
        return false;
    }

    /**
     * Public API: Reset form
     */
    resetForm(form) {
        const formData = this.forms.get(form);
        if (formData) {
            form.reset();
            formData.fields.forEach((fieldData, field) => {
                fieldData.hasBeenTouched = false;
                fieldData.isValid = false;
                this.clearFieldMessage(field.closest('.form-group'));
                field.closest('.form-group').classList.remove('error', 'success');
                this.updateFloatingLabel(field);
            });
        }
    }

    /**
     * Cleanup method
     */
    destroy() {
        // Clear all timers
        this.debounceTimers.forEach(timer => clearTimeout(timer));
        this.debounceTimers.clear();
        
        // Remove all toasts
        this.toasts.slice().forEach(toast => this.removeToast(toast));
        
        // Clear forms
        this.forms.clear();
        
        // Remove toast container
        const container = document.querySelector('.toast-container');
        if (container) {
            container.remove();
        }
        
        console.log('Enhanced form system destroyed');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedFormSystem = new EnhancedFormSystem();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedFormSystem;
}