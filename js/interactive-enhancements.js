/**
 * INTERACTIVE ENHANCEMENTS
 * Complete interactive functionality for TeachMeSkills design
 * Including animations, mobile nav, scroll effects, and form handling
 * Version: 2.0.0
 */

'use strict';

class InteractiveEnhancements {
    constructor() {
        this.isInitialized = false;
        this.scrollY = 0;
        this.isMobile = window.innerWidth <= 959;
        this.observers = new Map();
        this.debounceTimers = new Map();
        
        this.init();
    }

    /**
     * Initialize all interactive features
     */
    init() {
        if (this.isInitialized) return;
        
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupFeatures());
            } else {
                this.setupFeatures();
            }
            
            this.isInitialized = true;
            console.log('Interactive enhancements initialized');
        } catch (error) {
            console.error('Failed to initialize interactive enhancements:', error);
        }
    }

    /**
     * Setup all interactive features
     */
    setupFeatures() {
        this.setupScrollEffects();
        this.setupMobileNavigation();
        this.setupSmoothScrolling();
        this.setupAnimationsOnScroll();
        this.setupCardHoverEffects();
        this.setupFormEnhancements();
        this.setupButtonEffects();
        this.setupImageLazyLoading();
        this.setupParallaxEffects();
        this.setupCounterAnimations();
        this.setupTooltips();
        this.bindEvents();
    }

    /**
     * Setup scroll effects for header
     */
    setupScrollEffects() {
        const header = document.querySelector('.header');
        if (!header) return;

        const handleScroll = this.debounce(() => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            this.scrollY = currentScrollY;
        }, 10);

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    /**
     * Setup mobile navigation
     */
    setupMobileNavigation() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const menu = document.querySelector('.nav-menu');
        const overlay = document.createElement('div');
        
        if (!toggle || !menu) return;

        // Create overlay
        overlay.className = 'nav-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 60px;
            left: 0;
            width: 100%;
            height: calc(100vh - 60px);
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 99;
        `;
        document.body.appendChild(overlay);

        const toggleMenu = () => {
            const isOpen = menu.classList.contains('open');
            
            if (isOpen) {
                menu.classList.remove('open');
                overlay.style.opacity = '0';
                overlay.style.visibility = 'hidden';
                document.body.style.overflow = '';
                toggle.setAttribute('aria-expanded', 'false');
            } else {
                menu.classList.add('open');
                overlay.style.opacity = '1';
                overlay.style.visibility = 'visible';
                document.body.style.overflow = 'hidden';
                toggle.setAttribute('aria-expanded', 'true');
            }
        };

        toggle.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        // Close menu on nav link click
        const navLinks = menu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (menu.classList.contains('open')) {
                    toggleMenu();
                }
            });
        });

        // Update on resize
        window.addEventListener('resize', this.debounce(() => {
            this.isMobile = window.innerWidth <= 959;
            if (!this.isMobile && menu.classList.contains('open')) {
                toggleMenu();
            }
        }, 250));
    }

    /**
     * Setup smooth scrolling for anchor links
     */
    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Setup animations on scroll using Intersection Observer
     */
    setupAnimationsOnScroll() {
        const animateElements = document.querySelectorAll('.animate-on-scroll');
        
        if (animateElements.length === 0) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Add staggered animation delay for multiple elements
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    entry.target.style.transitionDelay = `${delay}ms`;
                }
            });
        }, observerOptions);

        animateElements.forEach(el => {
            observer.observe(el);
        });

        this.observers.set('scroll-animations', observer);
    }

    /**
     * Setup card hover effects
     */
    setupCardHoverEffects() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            // Add magnetic hover effect
            card.addEventListener('mousemove', (e) => {
                if (this.isMobile) return;
                
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                card.style.transform = `perspective(1000px) rotateY(${x * 0.02}deg) rotateX(${-y * 0.02}deg) translateZ(20px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });

            // Add click ripple effect
            card.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = card.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: radial-gradient(circle, rgba(255, 218, 23, 0.3) 0%, transparent 70%);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                card.style.position = 'relative';
                card.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple keyframes
        if (!document.querySelector('#ripple-keyframes')) {
            const style = document.createElement('style');
            style.id = 'ripple-keyframes';
            style.textContent = `
                @keyframes ripple {
                    from {
                        transform: scale(0);
                        opacity: 1;
                    }
                    to {
                        transform: scale(1);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Setup form enhancements
     */
    setupFormEnhancements() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            this.setupFloatingLabels(form);
            this.setupFormValidation(form);
            this.setupFormSubmission(form);
        });
    }

    /**
     * Setup floating labels for form inputs
     */
    setupFloatingLabels(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            const label = form.querySelector(`label[for="${input.id}"]`) || 
                         input.previousElementSibling?.tagName === 'LABEL' ? input.previousElementSibling : null;
            
            if (!label) return;

            // Wrap input and label in container
            const container = document.createElement('div');
            container.className = 'floating-label-container';
            container.style.cssText = 'position: relative; margin-bottom: 1rem;';
            
            input.parentNode.insertBefore(container, input);
            container.appendChild(label);
            container.appendChild(input);

            // Style floating label
            label.style.cssText = `
                position: absolute;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                background: white;
                padding: 0 4px;
                color: #6b7280;
                transition: all 0.2s ease;
                pointer-events: none;
                font-size: 16px;
            `;

            const updateLabel = () => {
                if (input.value || input === document.activeElement) {
                    label.style.top = '0';
                    label.style.fontSize = '12px';
                    label.style.color = '#ffda17';
                } else {
                    label.style.top = '50%';
                    label.style.fontSize = '16px';
                    label.style.color = '#6b7280';
                }
            };

            input.addEventListener('focus', updateLabel);
            input.addEventListener('blur', updateLabel);
            input.addEventListener('input', updateLabel);
            
            updateLabel(); // Initial check
        });
    }

    /**
     * Setup real-time form validation
     */
    setupFormValidation(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            let errorElement = null;
            
            const showError = (message) => {
                input.style.borderColor = '#ef4444';
                
                if (!errorElement) {
                    errorElement = document.createElement('div');
                    errorElement.className = 'error-message';
                    errorElement.style.cssText = `
                        color: #ef4444;
                        font-size: 12px;
                        margin-top: 4px;
                        opacity: 0;
                        transition: opacity 0.2s ease;
                    `;
                    input.parentNode.appendChild(errorElement);
                }
                
                errorElement.textContent = message;
                errorElement.style.opacity = '1';
            };
            
            const hideError = () => {
                input.style.borderColor = '';
                if (errorElement) {
                    errorElement.style.opacity = '0';
                }
            };
            
            const validate = () => {
                if (!input.value && input.hasAttribute('required')) {
                    showError('This field is required');
                    return false;
                }
                
                if (input.type === 'email' && input.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        showError('Please enter a valid email address');
                        return false;
                    }
                }
                
                if (input.type === 'tel' && input.value) {
                    const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
                    if (!phoneRegex.test(input.value)) {
                        showError('Please enter a valid phone number');
                        return false;
                    }
                }
                
                hideError();
                return true;
            };
            
            input.addEventListener('blur', validate);
            input.addEventListener('input', this.debounce(validate, 500));
        });
    }

    /**
     * Setup form submission with loading states
     */
    setupFormSubmission(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('[type="submit"]') || form.querySelector('.btn-primary');
            if (!submitBtn) return;
            
            // Validate all fields
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                const event = new Event('blur');
                input.dispatchEvent(event);
                if (input.style.borderColor === 'rgb(239, 68, 68)') {
                    isValid = false;
                }
            });
            
            if (!isValid) return;
            
            // Show loading state
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            try {
                // Simulate form submission (replace with actual API call)
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Show success message
                this.showNotification('Success! Your message has been sent.', 'success');
                form.reset();
                
                // Reset floating labels
                const floatingLabels = form.querySelectorAll('.floating-label-container label');
                floatingLabels.forEach(label => {
                    label.style.top = '50%';
                    label.style.fontSize = '16px';
                    label.style.color = '#6b7280';
                });
                
            } catch (error) {
                this.showNotification('Error! Please try again.', 'error');
            } finally {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }

    /**
     * Setup button click effects
     */
    setupButtonEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.4);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: button-ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add button ripple keyframes
        if (!document.querySelector('#button-ripple-keyframes')) {
            const style = document.createElement('style');
            style.id = 'button-ripple-keyframes';
            style.textContent = `
                @keyframes button-ripple {
                    from {
                        transform: scale(0);
                        opacity: 1;
                    }
                    to {
                        transform: scale(1);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Setup image lazy loading
     */
    setupImageLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (images.length === 0) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            img.style.transition = 'opacity 0.3s ease';
            img.style.opacity = '0';
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
            imageObserver.observe(img);
        });

        this.observers.set('image-loading', imageObserver);
    }

    /**
     * Setup parallax effects
     */
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        if (parallaxElements.length === 0 || this.isMobile) return;

        const handleParallax = this.debounce(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
        }, 10);

        window.addEventListener('scroll', handleParallax, { passive: true });
    }

    /**
     * Setup counter animations for statistics
     */
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        
        if (counters.length === 0) return;

        const animateCounter = (counter) => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '');
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
                }
            };

            updateCounter();
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });

        this.observers.set('counters', counterObserver);
    }

    /**
     * Setup tooltips
     */
    setupTooltips() {
        const tooltips = document.querySelectorAll('[data-tooltip]');
        
        tooltips.forEach(element => {
            element.classList.add('tooltip');
            
            // Enhanced tooltip positioning
            element.addEventListener('mouseenter', (e) => {
                const tooltip = element.querySelector('::before') || element;
                const rect = element.getBoundingClientRect();
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;
                
                // Adjust positioning based on viewport
                if (rect.left < 100) {
                    element.style.setProperty('--tooltip-position', 'left');
                } else if (rect.right > windowWidth - 100) {
                    element.style.setProperty('--tooltip-position', 'right');
                } else if (rect.top < 100) {
                    element.style.setProperty('--tooltip-position', 'bottom');
                }
            });
        });
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    /**
     * Bind additional event listeners
     */
    bindEvents() {
        // Keyboard navigation improvements
        document.addEventListener('keydown', (e) => {
            // Escape key closes mobile menu
            if (e.key === 'Escape') {
                const menu = document.querySelector('.nav-menu.open');
                if (menu) {
                    const toggle = document.querySelector('.mobile-menu-toggle');
                    toggle?.click();
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            this.isMobile = window.innerWidth <= 959;
            
            // Recalculate parallax elements
            if (!this.isMobile) {
                this.setupParallaxEffects();
            }
        }, 250));

        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause animations when tab is hidden
                document.body.style.animationPlayState = 'paused';
            } else {
                // Resume animations when tab is visible
                document.body.style.animationPlayState = 'running';
            }
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
     * Cleanup method
     */
    destroy() {
        // Clean up observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Clear timers
        this.debounceTimers.forEach(timer => clearTimeout(timer));
        this.debounceTimers.clear();
        
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        
        this.isInitialized = false;
        console.log('Interactive enhancements destroyed');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.interactiveEnhancements = new InteractiveEnhancements();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractiveEnhancements;
}