/**
 * UI ENHANCEMENTS - Modern interactions and animations
 * Version: 2.0.0
 */

'use strict';

// =============================================================================
// SCROLL ANIMATIONS OBSERVER
// =============================================================================

class ScrollAnimationObserver {
    constructor() {
        this.options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        this.init();
    }
    
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Optional: unobserve after animation
                    if (entry.target.dataset.observeOnce !== 'false') {
                        this.observer.unobserve(entry.target);
                    }
                }
            });
        }, this.options);
        
        this.observeElements();
    }
    
    observeElements() {
        // Observe all fade-in elements
        const fadeElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .stagger-item');
        fadeElements.forEach(element => {
            this.observer.observe(element);
        });
    }
}

// =============================================================================
// PARALLAX SCROLLING
// =============================================================================

class ParallaxController {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        this.setupParallaxElements();
        this.bindEvents();
    }
    
    setupParallaxElements() {
        // Hero section parallax
        const hero = document.querySelector('.hero');
        if (hero) {
            this.elements.push({
                element: hero,
                speed: 0.5,
                offset: 0
            });
        }
        
        // Add parallax to any element with data-parallax attribute
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(element => {
            this.elements.push({
                element: element,
                speed: parseFloat(element.dataset.parallax) || 0.5,
                offset: element.offsetTop
            });
        });
    }
    
    bindEvents() {
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    }
    
    handleScroll() {
        const scrolled = window.pageYOffset;
        
        this.elements.forEach(item => {
            const { element, speed, offset } = item;
            const yPos = -(scrolled * speed);
            
            requestAnimationFrame(() => {
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// =============================================================================
// SMOOTH NAVIGATION
// =============================================================================

class SmoothNavigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.lastScrollTop = 0;
        this.scrollThreshold = 50;
        
        this.init();
    }
    
    init() {
        this.setupScrollBehavior();
        this.setupSmoothScrolling();
        this.setupActiveNavHighlight();
    }
    
    setupScrollBehavior() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleNavbarScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
    
    handleNavbarScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for navbar styling
        if (scrollTop > this.scrollThreshold) {
            this.navbar?.classList.add('scrolled');
        } else {
            this.navbar?.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > this.lastScrollTop && scrollTop > 100) {
            // Scrolling down
            this.navbar?.classList.add('navbar-hidden');
        } else {
            // Scrolling up
            this.navbar?.classList.remove('navbar-hidden');
        }
        
        this.lastScrollTop = scrollTop;
    }
    
    setupSmoothScrolling() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href && href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offset = 80; // Navbar height
                        const targetPosition = target.offsetTop - offset;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    
    setupActiveNavHighlight() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            let scrollY = window.pageYOffset;
            
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector(`.nav-link[href*="${sectionId}"]`)?.classList.add('active');
                } else {
                    document.querySelector(`.nav-link[href*="${sectionId}"]`)?.classList.remove('active');
                }
            });
        }, { passive: true });
    }
}

// =============================================================================
// CARD 3D EFFECTS
// =============================================================================

class Card3DEffects {
    constructor() {
        this.cards = document.querySelectorAll('.card-3d');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', this.handleMouseMove.bind(this));
            card.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        });
    }
    
    handleMouseMove(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        requestAnimationFrame(() => {
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
    }
    
    handleMouseLeave(e) {
        const card = e.currentTarget;
        requestAnimationFrame(() => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    }
}

// =============================================================================
// LOADING STATES
// =============================================================================

class LoadingStateManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupSkeletonLoaders();
        this.setupButtonLoadingStates();
    }
    
    setupSkeletonLoaders() {
        // Add skeleton loaders for dynamic content
        const dynamicContainers = document.querySelectorAll('[data-skeleton]');
        
        dynamicContainers.forEach(container => {
            const skeletonCount = parseInt(container.dataset.skeleton) || 3;
            
            // Show skeletons initially
            this.showSkeletons(container, skeletonCount);
            
            // Remove skeletons when content loads
            if (container.dataset.skeletonAuto === 'true') {
                setTimeout(() => {
                    this.hideSkeletons(container);
                }, 1500);
            }
        });
    }
    
    showSkeletons(container, count) {
        const skeletonHTML = `
            <div class="skeleton-wrapper">
                ${Array(count).fill().map(() => `
                    <div class="skeleton-card">
                        <div class="skeleton skeleton-text"></div>
                        <div class="skeleton skeleton-text" style="width: 80%"></div>
                        <div class="skeleton skeleton-text" style="width: 60%"></div>
                    </div>
                `).join('')}
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', skeletonHTML);
    }
    
    hideSkeletons(container) {
        const skeletons = container.querySelector('.skeleton-wrapper');
        if (skeletons) {
            skeletons.style.opacity = '0';
            setTimeout(() => skeletons.remove(), 300);
        }
    }
    
    setupButtonLoadingStates() {
        // Add loading state to buttons on click
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
            if (!button.dataset.noLoading) {
                button.addEventListener('click', function(e) {
                    if (this.type === 'submit' || this.dataset.loading === 'true') {
                        this.classList.add('btn-loading');
                    }
                });
            }
        });
    }
}

// =============================================================================
// TOAST NOTIFICATION SYSTEM
// =============================================================================

class ToastNotification {
    constructor() {
        this.container = null;
        this.init();
    }
    
    init() {
        this.createContainer();
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        this.container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(this.container);
    }
    
    show(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = this.getIcon(type);
        
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close">×</button>
        `;
        
        this.container.appendChild(toast);
        
        // Auto remove
        const timeout = setTimeout(() => {
            this.remove(toast);
        }, duration);
        
        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(timeout);
            this.remove(toast);
        });
        
        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('toast-show');
        });
        
        return toast;
    }
    
    remove(toast) {
        toast.classList.add('toast-hide');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
    
    getIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }
}

// =============================================================================
// MICRO INTERACTIONS
// =============================================================================

class MicroInteractions {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupRippleEffect();
        this.setupMagneticButtons();
        this.setupHoverEffects();
    }
    
    setupRippleEffect() {
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        // Add ripple animation
        if (!document.querySelector('#ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupMagneticButtons() {
        const magneticButtons = document.querySelectorAll('[data-magnetic]');
        
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    setupHoverEffects() {
        // Add subtle hover effects to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .card');
        
        interactiveElements.forEach(element => {
            if (!element.classList.contains('no-hover')) {
                element.style.transition = 'transform 0.3s ease';
            }
        });
    }
}

// =============================================================================
// FORM ENHANCEMENTS
// =============================================================================

class FormEnhancements {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupFloatingLabels();
        this.setupFormValidation();
        this.setupPasswordVisibility();
    }
    
    setupFloatingLabels() {
        // Convert form groups to floating labels
        document.querySelectorAll('.form-group').forEach(group => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('label');
            
            if (input && label && !group.classList.contains('no-float')) {
                group.classList.add('floating-label');
                input.placeholder = ' '; // Required for CSS :not(:placeholder-shown)
            }
        });
    }
    
    setupFormValidation() {
        // Add real-time validation feedback
        document.querySelectorAll('input[required], textarea[required]').forEach(field => {
            field.addEventListener('blur', () => {
                if (field.validity.valid) {
                    field.parentElement.classList.add('success');
                    field.parentElement.classList.remove('error');
                } else {
                    field.parentElement.classList.add('error');
                    field.parentElement.classList.remove('success');
                }
            });
            
            field.addEventListener('input', () => {
                if (field.parentElement.classList.contains('error')) {
                    field.parentElement.classList.remove('error');
                }
            });
        });
    }
    
    setupPasswordVisibility() {
        document.querySelectorAll('input[type="password"]').forEach(passwordField => {
            const wrapper = passwordField.parentElement;
            const toggleButton = document.createElement('button');
            toggleButton.type = 'button';
            toggleButton.className = 'password-toggle';
            toggleButton.innerHTML = '👁';
            toggleButton.style.cssText = `
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                cursor: pointer;
                padding: 5px;
            `;
            
            wrapper.style.position = 'relative';
            wrapper.appendChild(toggleButton);
            
            toggleButton.addEventListener('click', () => {
                const type = passwordField.type === 'password' ? 'text' : 'password';
                passwordField.type = type;
                toggleButton.innerHTML = type === 'password' ? '👁' : '👁‍🗨';
            });
        });
    }
}

// =============================================================================
// PERFORMANCE OPTIMIZATION
// =============================================================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.lazyLoadImages();
        this.deferNonCriticalCSS();
        this.optimizeAnimations();
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                    
                    // Add fade-in effect
                    img.style.opacity = '0';
                    img.addEventListener('load', () => {
                        img.style.transition = 'opacity 0.3s';
                        img.style.opacity = '1';
                    });
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    deferNonCriticalCSS() {
        // Move non-critical CSS to load after page render
        const nonCritical = document.querySelectorAll('link[data-defer]');
        
        nonCritical.forEach(link => {
            link.media = 'print';
            link.onload = function() {
                this.media = 'all';
            };
        });
    }
    
    optimizeAnimations() {
        // Pause animations when not visible
        const animatedElements = document.querySelectorAll('[data-animation]');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                } else {
                    entry.target.style.animationPlayState = 'paused';
                }
            });
        });
        
        animatedElements.forEach(el => animationObserver.observe(el));
    }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all enhancement modules
    const modules = {
        scrollAnimations: new ScrollAnimationObserver(),
        parallax: new ParallaxController(),
        smoothNav: new SmoothNavigation(),
        card3D: new Card3DEffects(),
        loading: new LoadingStateManager(),
        toast: new ToastNotification(),
        microInteractions: new MicroInteractions(),
        formEnhancements: new FormEnhancements(),
        performance: new PerformanceOptimizer()
    };
    
    // Make toast globally available
    window.toast = modules.toast;
    
    // Override Utils.showNotification to use new toast system
    if (window.Utils) {
        window.Utils.showNotification = (message, type, duration) => {
            modules.toast.show(message, type, duration);
        };
    }
    
    console.log('UI Enhancements initialized');
});

// Add navbar hide/show styles
const navbarStyle = document.createElement('style');
navbarStyle.textContent = `
    .navbar-hidden {
        transform: translateY(-100%);
    }
    
    .toast-show {
        animation: slideInRight 0.3s ease-out;
    }
    
    .toast-hide {
        animation: slideOutRight 0.3s ease-out;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(navbarStyle);