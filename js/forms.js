/**
 * PROJECTDES AI ACADEMY - FORMS MANAGEMENT
 * Form validation, submission, and modal management
 * Version: 1.0.0
 */

'use strict';

// =============================================================================
// FORM VALIDATION CONFIGURATION
// =============================================================================

const VALIDATION_RULES = {
    name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Zа-яА-ЯёЁ\u0590-\u05FF\s\-']+$/,
        message: {
            ru: 'Имя должно содержать только буквы, пробелы и дефисы (2-50 символов)',
            he: 'השם יכול להכיל רק אותיות, רווחים ומקפים (2-50 תווים)'
        }
    },
    phone: {
        required: true,
        pattern: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/,
        message: {
            ru: 'Введите корректный номер телефона',
            he: 'הזן מספר טלפון חוקי'
        }
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: {
            ru: 'Введите корректный email адрес',
            he: 'הזן כתובת אימייל חוקית'
        }
    },
    message: {
        required: false,
        maxLength: 500,
        message: {
            ru: 'Сообщение не должно превышать 500 символов',
            he: 'ההודעה לא יכולה להיות ארוכה מ-500 תווים'
        }
    }
};

// =============================================================================
// ENROLLMENT MODAL CLASS
// =============================================================================

class EnrollmentModal {
    constructor() {
        this.modal = null;
        this.selectedCourse = null;
        this.isOpen = false;
        
        this.courses = {
            'no-code-websites': {
                ru: 'Создание сайтов с логикой (без программистов)',
                he: 'יצירת אתרים עם לוגיקה (ללא מתכנתים)'
            },
            'ai-video-avatars': {
                ru: 'Генерация видео и AI-аватаров',
                he: 'יצירת וידאו ואווטארים של AI'
            },
            'ai-automation': {
                ru: 'Автоматизация бизнес-процессов через AI',
                he: 'אוטומציה של תהליכים עסקיים דרך AI'
            },
            'social-media-ads': {
                ru: 'Управление соцсетями и реклама',
                he: 'ניהול רשתות חברתיות ופרסום'
            }
        };
    }

    /**
     * Open enrollment modal
     */
    open(courseId = null) {
        this.selectedCourse = courseId;
        this.createModal();
        this.showModal();
        this.setupModalEventListeners();
    }

    /**
     * Create modal HTML
     */
    createModal() {
        const currentLang = getCurrentLanguage();
        const translations = this.getTranslations(currentLang);
        
        const modalHTML = `
            <div class="modal-overlay" id="enrollment-modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
                <div class="modal-content" role="document">
                    <button class="modal-close" onclick="closeEnrollmentModal()" aria-label="${translations.close}">×</button>
                    <h2 id="modal-title" data-i18n="enrollment.title">${translations.title}</h2>
                    <form id="enrollment-form" class="enrollment-form" novalidate>
                        <div class="form-group">
                            <label for="enrollment-name" data-i18n="enrollment.name.label">${translations.name.label}</label>
                            <input 
                                type="text" 
                                id="enrollment-name" 
                                name="name" 
                                required 
                                placeholder="${translations.name.placeholder}"
                                data-i18n-placeholder="enrollment.name.placeholder"
                                autocomplete="name"
                                aria-describedby="enrollment-name-error"
                            >
                            <div class="error-message" id="enrollment-name-error" role="alert"></div>
                        </div>
                        
                        <div class="form-group">
                            <label for="enrollment-phone" data-i18n="enrollment.phone.label">${translations.phone.label}</label>
                            <input 
                                type="tel" 
                                id="enrollment-phone" 
                                name="phone" 
                                required 
                                placeholder="${translations.phone.placeholder}"
                                data-i18n-placeholder="enrollment.phone.placeholder"
                                autocomplete="tel"
                                aria-describedby="enrollment-phone-error"
                            >
                            <div class="error-message" id="enrollment-phone-error" role="alert"></div>
                        </div>
                        
                        <div class="form-group">
                            <label for="enrollment-email" data-i18n="enrollment.email.label">${translations.email.label}</label>
                            <input 
                                type="email" 
                                id="enrollment-email" 
                                name="email" 
                                required 
                                placeholder="${translations.email.placeholder}"
                                data-i18n-placeholder="enrollment.email.placeholder"
                                autocomplete="email"
                                aria-describedby="enrollment-email-error"
                            >
                            <div class="error-message" id="enrollment-email-error" role="alert"></div>
                        </div>
                        
                        <div class="form-group">
                            <label for="enrollment-course" data-i18n="enrollment.course.label">${translations.course.label}</label>
                            <select id="enrollment-course" name="course" required aria-describedby="enrollment-course-error">
                                <option value="" data-i18n="enrollment.course.placeholder">${translations.course.placeholder}</option>
                                ${this.getCourseOptions(currentLang)}
                            </select>
                            <div class="error-message" id="enrollment-course-error" role="alert"></div>
                        </div>
                        
                        <div class="form-group">
                            <label for="enrollment-message" data-i18n="enrollment.message.label">${translations.message.label}</label>
                            <textarea 
                                id="enrollment-message" 
                                name="message" 
                                rows="4" 
                                placeholder="${translations.message.placeholder}"
                                data-i18n-placeholder="enrollment.message.placeholder"
                                maxlength="500"
                                aria-describedby="enrollment-message-count"
                            ></textarea>
                            <div class="char-counter">
                                <span id="enrollment-message-count">0</span>/500 <span data-i18n="enrollment.message.chars">${translations.chars}</span>
                            </div>
                        </div>
                        
                        <div class="form-group checkbox-group">
                            <input type="checkbox" id="enrollment-privacy" name="privacy" required>
                            <label for="enrollment-privacy" class="checkbox-label">
                                <span data-i18n="enrollment.privacy.text">${translations.privacy.text}</span> 
                                <a href="#" target="_blank" data-i18n="enrollment.privacy.link">${translations.privacy.link}</a>
                            </label>
                            <div class="error-message" id="enrollment-privacy-error" role="alert"></div>
                        </div>
                        
                        <button type="submit" class="btn-primary" id="enrollment-submit-btn">
                            <span class="btn-text" data-i18n="enrollment.submit">${translations.submit}</span>
                            <span class="btn-loader" style="display: none;">
                                <div class="spinner"></div>
                            </span>
                        </button>
                        
                        <div class="form-success" id="enrollment-success" style="display: none;" role="alert" aria-live="polite">
                            <div class="success-icon">✅</div>
                            <h3 data-i18n="enrollment.success.title">${translations.success.title}</h3>
                            <p data-i18n="enrollment.success.message">${translations.success.message}</p>
                        </div>
                        
                        <div class="form-error" id="enrollment-error" style="display: none;" role="alert" aria-live="assertive">
                            <div class="error-icon">❌</div>
                            <h3 data-i18n="enrollment.error.title">${translations.error.title}</h3>
                            <p data-i18n="enrollment.error.message">${translations.error.message}</p>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Remove existing modal if present
        const existingModal = document.getElementById('enrollment-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('enrollment-modal');
        
        // Set selected course if provided
        if (this.selectedCourse) {
            const courseSelect = document.getElementById('enrollment-course');
            courseSelect.value = this.selectedCourse;
        }
    }

    /**
     * Get course options HTML
     */
    getCourseOptions(lang) {
        return Object.entries(this.courses)
            .map(([id, names]) => `<option value="${id}">${names[lang]}</option>`)
            .join('');
    }

    /**
     * Get translations for current language
     */
    getTranslations(lang) {
        const translations = {
            ru: {
                close: 'Закрыть',
                title: 'Записаться на курс',
                name: { label: 'Ваше имя *', placeholder: 'Введите ваше имя' },
                phone: { label: 'Телефон *', placeholder: '+7 (999) 123-45-67' },
                email: { label: 'Email *', placeholder: 'your.email@example.com' },
                course: { label: 'Выберите курс *', placeholder: 'Выберите курс' },
                message: { label: 'Сообщение', placeholder: 'Расскажите о ваших целях и опыте (необязательно)' },
                chars: 'символов',
                privacy: { text: 'Я согласен с', link: 'политикой конфиденциальности' },
                submit: 'Отправить заявку',
                success: {
                    title: 'Заявка отправлена!',
                    message: 'Спасибо за ваш интерес! Наш специалист свяжется с вами в течение часа.'
                },
                error: {
                    title: 'Ошибка отправки',
                    message: 'Произошла ошибка при отправке формы. Попробуйте еще раз или свяжитесь с нами через WhatsApp.'
                }
            },
            he: {
                close: 'סגור',
                title: 'הרשמה לקורס',
                name: { label: 'השם שלך *', placeholder: 'הזן את שמך' },
                phone: { label: 'טלפון *', placeholder: '+972 50 123 4567' },
                email: { label: 'אימייל *', placeholder: 'your.email@example.com' },
                course: { label: 'בחר קורס *', placeholder: 'בחר קורס' },
                message: { label: 'הודעה', placeholder: 'ספר על המטרות והניסיון שלך (לא חובה)' },
                chars: 'תווים',
                privacy: { text: 'אני מסכים עם', link: 'מדיניות הפרטיות' },
                submit: 'שלח בקשה',
                success: {
                    title: 'הבקשה נשלחה!',
                    message: 'תודה על העניין! המומחה שלנו יצור איתך קשר תוך שעה.'
                },
                error: {
                    title: 'שגיאה בשליחה',
                    message: 'אירעה שגיאה בשליחת הטופס. נסה שוב או צור איתנו קשר דרך WhatsApp.'
                }
            }
        };
        
        return translations[lang] || translations.ru;
    }

    /**
     * Show modal with animation
     */
    showModal() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isOpen = true;
        
        // Focus management
        setTimeout(() => {
            const firstInput = this.modal.querySelector('input:not([type="hidden"])');
            if (firstInput) {
                firstInput.focus();
            }
        }, 300);
    }

    /**
     * Hide modal
     */
    hide() {
        if (!this.isOpen) return;
        
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.isOpen = false;
        
        setTimeout(() => {
            if (this.modal && this.modal.parentNode) {
                this.modal.remove();
            }
        }, 300);
    }

    /**
     * Setup modal event listeners
     */
    setupModalEventListeners() {
        // Close on overlay click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.hide();
            }
        });

        // Form submission
        const form = document.getElementById('enrollment-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Character counter
        const messageField = document.getElementById('enrollment-message');
        const charCounter = document.getElementById('enrollment-message-count');
        if (messageField && charCounter) {
            messageField.addEventListener('input', () => {
                charCounter.textContent = messageField.value.length;
            });
        }

        // Real-time validation
        const inputs = this.modal.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    /**
     * Handle form submission
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form
        if (!this.validateForm(form)) {
            return;
        }
        
        // Show loading state
        this.setSubmitState(true);
        
        try {
            // Submit form data
            await this.submitEnrollment(data);
            
            // Show success message
            this.showSuccess();
            
        } catch (error) {
            console.error('Enrollment submission error:', error);
            this.showError();
        } finally {
            this.setSubmitState(false);
        }
    }

    /**
     * Validate entire form
     */
    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    /**
     * Validate single field
     */
    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const rules = VALIDATION_RULES[fieldName];
        const currentLang = getCurrentLanguage();
        
        // Clear previous error
        this.clearFieldError(field);
        
        if (!rules) {
            return true;
        }
        
        // Required validation
        if (rules.required && !value) {
            this.showFieldError(field, this.getRequiredMessage(fieldName, currentLang));
            return false;
        }
        
        // Skip other validations if field is empty and not required
        if (!value && !rules.required) {
            return true;
        }
        
        // Length validation
        if (rules.minLength && value.length < rules.minLength) {
            this.showFieldError(field, rules.message[currentLang]);
            return false;
        }
        
        if (rules.maxLength && value.length > rules.maxLength) {
            this.showFieldError(field, rules.message[currentLang]);
            return false;
        }
        
        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            this.showFieldError(field, rules.message[currentLang]);
            return false;
        }
        
        return true;
    }

    /**
     * Show field error
     */
    showFieldError(field, message) {
        field.classList.add('error');
        const errorElement = document.getElementById(field.id.replace(field.name, field.name + '-error'));
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    /**
     * Clear field error
     */
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(field.id.replace(field.name, field.name + '-error'));
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    /**
     * Get required message for field
     */
    getRequiredMessage(fieldName, lang) {
        const messages = {
            ru: {
                name: 'Имя обязательно для заполнения',
                phone: 'Телефон обязателен для заполнения',
                email: 'Email обязателен для заполнения',
                course: 'Выберите курс',
                privacy: 'Необходимо согласие с политикой конфиденциальности'
            },
            he: {
                name: 'שם חובה למילוי',
                phone: 'טלפון חובה למילוי',
                email: 'אימייל חובה למילוי',
                course: 'בחר קורס',
                privacy: 'יש צורך בהסכמה למדיניות הפרטיות'
            }
        };
        
        return messages[lang]?.[fieldName] || messages.ru[fieldName] || 'Field is required';
    }

    /**
     * Submit enrollment data
     */
    async submitEnrollment(data) {
        // Add course name for clarity
        if (data.course && this.courses[data.course]) {
            data.courseName = this.courses[data.course][getCurrentLanguage()];
        }
        
        // Add timestamp
        data.timestamp = new Date().toISOString();
        data.language = getCurrentLanguage();
        
        // Submit via email service
        return await window.emailService.sendEnrollment(data);
    }

    /**
     * Set submit button loading state
     */
    setSubmitState(isLoading) {
        const submitBtn = document.getElementById('enrollment-submit-btn');
        const btnText = submitBtn?.querySelector('.btn-text');
        const btnLoader = submitBtn?.querySelector('.btn-loader');
        
        if (submitBtn && btnText && btnLoader) {
            submitBtn.disabled = isLoading;
            
            if (isLoading) {
                submitBtn.classList.add('loading');
                btnText.style.opacity = '0.6';
                btnLoader.style.display = 'inline-block';
            } else {
                submitBtn.classList.remove('loading');
                btnText.style.opacity = '1';
                btnLoader.style.display = 'none';
            }
        }
    }

    /**
     * Show success message
     */
    showSuccess() {
        const form = document.getElementById('enrollment-form');
        const success = document.getElementById('enrollment-success');
        
        if (form && success) {
            form.style.display = 'none';
            success.style.display = 'block';
            
            // Auto-close after 3 seconds
            setTimeout(() => {
                this.hide();
            }, 3000);
        }
    }

    /**
     * Show error message
     */
    showError() {
        const error = document.getElementById('enrollment-error');
        if (error) {
            error.style.display = 'block';
            
            // Hide after 5 seconds
            setTimeout(() => {
                error.style.display = 'none';
            }, 5000);
        }
    }
}

// =============================================================================
// CONTACT FORM MANAGER
// =============================================================================

class ContactFormManager {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.setupEventListeners();
        this.setupCharacterCounter();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    setupCharacterCounter() {
        const messageField = document.getElementById('message');
        const charCounter = document.getElementById('char-count');
        
        if (messageField && charCounter) {
            messageField.addEventListener('input', () => {
                charCounter.textContent = messageField.value.length;
            });
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form
        if (!this.validateForm()) {
            return;
        }
        
        // Show loading state
        this.setSubmitState(true);
        
        try {
            // Submit form data
            await window.emailService.sendContact(data);
            
            // Show success
            this.showSuccess();
            
            // Reset form
            this.form.reset();
            this.resetCharCounter();
            
        } catch (error) {
            console.error('Contact form submission error:', error);
            this.showError();
        } finally {
            this.setSubmitState(false);
        }
    }

    validateForm() {
        let isValid = true;
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(field) {
        const enrollmentModal = new EnrollmentModal();
        return enrollmentModal.validateField(field);
    }

    clearFieldError(field) {
        const enrollmentModal = new EnrollmentModal();
        enrollmentModal.clearFieldError(field);
    }

    showFieldError(field, message) {
        const enrollmentModal = new EnrollmentModal();
        enrollmentModal.showFieldError(field, message);
    }

    setSubmitState(isLoading) {
        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn?.querySelector('.btn-text');
        const btnLoader = submitBtn?.querySelector('.btn-loader');
        
        if (submitBtn && btnText && btnLoader) {
            submitBtn.disabled = isLoading;
            
            if (isLoading) {
                submitBtn.classList.add('loading');
                btnText.style.opacity = '0.6';
                btnLoader.style.display = 'inline-block';
            } else {
                submitBtn.classList.remove('loading');
                btnText.style.opacity = '1';
                btnLoader.style.display = 'none';
            }
        }
    }

    showSuccess() {
        const success = document.getElementById('form-success');
        if (success) {
            success.style.display = 'block';
            setTimeout(() => {
                success.style.display = 'none';
            }, 5000);
        }
        
        Utils.showNotification('Message sent successfully!', 'success');
    }

    showError() {
        const error = document.getElementById('form-error');
        if (error) {
            error.style.display = 'block';
            setTimeout(() => {
                error.style.display = 'none';
            }, 5000);
        }
        
        Utils.showNotification('Failed to send message. Please try again.', 'error');
    }

    resetCharCounter() {
        const charCounter = document.getElementById('char-count');
        if (charCounter) {
            charCounter.textContent = '0';
        }
    }
}

// =============================================================================
// GLOBAL FUNCTIONS
// =============================================================================

/**
 * Open enrollment modal
 */
function openEnrollmentModal(courseId = null) {
    const modal = new EnrollmentModal();
    modal.open(courseId);
    
    // Store modal instance globally for cleanup
    window.currentModal = modal;
}

/**
 * Close enrollment modal
 */
function closeEnrollmentModal() {
    if (window.currentModal) {
        window.currentModal.hide();
        window.currentModal = null;
    }
}

/**
 * Enroll in specific course
 */
function enrollCourse(courseId) {
    openEnrollmentModal(courseId);
}

/**
 * Submit contact form
 */
async function submitContactForm(event) {
    if (event) {
        event.preventDefault();
    }
    
    const contactFormManager = new ContactFormManager();
    await contactFormManager.handleSubmit(event);
}

/**
 * Submit enrollment form  
 */
async function submitEnrollment(event) {
    // This will be handled by the modal's form submission
    console.log('Enrollment form submitted via modal');
}

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact form manager
    new ContactFormManager();
    
    console.log('Forms module initialized');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EnrollmentModal,
        ContactFormManager,
        VALIDATION_RULES,
        openEnrollmentModal,
        closeEnrollmentModal,
        enrollCourse,
        submitContactForm
    };
}