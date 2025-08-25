/**
 * PROJECTDES AI ACADEMY - CONFIGURATION FILE
 * Update these values with your actual API keys and settings
 * Version: 1.0.0
 */

'use strict';

// =============================================================================
// API CONFIGURATION - REPLACE WITH YOUR ACTUAL KEYS
// =============================================================================

const APP_CONFIG = {
    // Contact Information
    contact: {
        whatsappNumber: '+1234567890', // Replace with actual WhatsApp number
        email: 'info@projectdes.ai',
        phone: '+1234567890' // Replace with actual phone number
    },
    
    // Meeting Links
    meetings: {
        zoomMeetingId: 'YOUR_ZOOM_MEETING_ID', // Replace with actual Zoom meeting ID
        googleMeetUrl: 'https://meet.google.com/YOUR_MEETING_CODE', // Replace with actual Google Meet URL
        calendlyUrl: 'https://calendly.com/projectdes-academy' // Replace with actual Calendly URL
    },
    
    // Social Media Links
    social: {
        whatsapp: 'https://wa.me/1234567890', // Replace with actual WhatsApp link
        linkedin: 'https://linkedin.com/company/projectdes',
        instagram: 'https://instagram.com/projectdes',
        tiktok: 'https://tiktok.com/@projectdes'
    },
    
    // Email Service Configuration
    emailService: {
        // EmailJS Configuration
        emailJS: {
            serviceId: 'service_projectdes', // Replace with your EmailJS service ID
            publicKey: 'YOUR_EMAILJS_PUBLIC_KEY', // Replace with your EmailJS public key
            templates: {
                enrollment: 'template_enrollment', // Replace with your enrollment template ID
                contact: 'template_contact' // Replace with your contact template ID
            }
        },
        
        // Formspree Configuration (Backup)
        formspree: {
            enrollmentFormId: 'YOUR_ENROLLMENT_FORM_ID', // Replace with your Formspree form ID
            contactFormId: 'YOUR_CONTACT_FORM_ID' // Replace with your Formspree form ID
        }
    },
    
    // Payment Configuration
    payment: {
        // Stripe Configuration
        stripe: {
            publicKey: 'pk_test_YOUR_STRIPE_PUBLIC_KEY', // Replace with your Stripe public key
            mode: 'test', // Change to 'live' for production
            products: {
                'no-code-websites': 'price_YOUR_PRODUCT_ID',
                'ai-video-avatars': 'price_YOUR_PRODUCT_ID',
                'ai-automation': 'price_YOUR_PRODUCT_ID',
                'social-media-ads': 'price_YOUR_PRODUCT_ID'
            }
        },
        
        // PayPal Configuration
        paypal: {
            clientId: 'YOUR_PAYPAL_CLIENT_ID', // Replace with your PayPal client ID
            environment: 'sandbox', // Change to 'production' for live
            currency: 'USD'
        }
    },
    
    // Analytics Configuration (Optional)
    analytics: {
        // Google Analytics
        googleAnalyticsId: 'G-YOUR_TRACKING_ID', // Replace with your GA tracking ID
        
        // Facebook Pixel
        facebookPixelId: 'YOUR_PIXEL_ID' // Replace with your Facebook Pixel ID
    }
};

// =============================================================================
// COURSE PRICING INFORMATION
// =============================================================================

const COURSE_PRICES = {
    'no-code-websites': {
        price: 899,
        currency: 'USD',
        name: {
            ru: 'Создание сайтов с логикой (без программистов)',
            he: 'יצירת אתרים עם לוגיקה (ללא מתכנתים)'
        }
    },
    'ai-video-avatars': {
        price: 699,
        currency: 'USD',
        name: {
            ru: 'Генерация видео и AI-аватаров',
            he: 'יצירת וידאו ואווטארים של AI'
        }
    },
    'ai-automation': {
        price: 999,
        currency: 'USD',
        name: {
            ru: 'Автоматизация бизнес-процессов через AI',
            he: 'אוטומציה של תהליכים עסקיים דרך AI'
        }
    },
    'social-media-ads': {
        price: 599,
        currency: 'USD',
        name: {
            ru: 'Управление соцсетями и реклама',
            he: 'ניהול רשתות חברתיות ופרסום'
        }
    }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get WhatsApp link with pre-filled message
 */
function getWhatsAppLink(message = '') {
    const phoneNumber = APP_CONFIG.contact.whatsappNumber.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

/**
 * Update all links on the page with configured values
 */
function updateConfigurableLinks() {
    // Update WhatsApp links
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        link.href = getWhatsAppLink();
    });
    
    // Update Zoom links
    const zoomLinks = document.querySelectorAll('a[href*="zoom.us/j/"]');
    zoomLinks.forEach(link => {
        link.href = `https://zoom.us/j/${APP_CONFIG.meetings.zoomMeetingId}`;
    });
    
    // Update Google Meet links
    const gmeetLinks = document.querySelectorAll('a[href*="meet.google.com"]');
    gmeetLinks.forEach(link => {
        link.href = APP_CONFIG.meetings.googleMeetUrl;
    });
    
    // Update email links
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        if (link.href.includes('info@')) {
            link.href = `mailto:${APP_CONFIG.contact.email}`;
        }
    });
    
    // Update social media links
    Object.entries(APP_CONFIG.social).forEach(([platform, url]) => {
        const links = document.querySelectorAll(`a[href*="${platform}"]`);
        links.forEach(link => {
            if (link.href.includes(platform)) {
                link.href = url;
            }
        });
    });
}

// =============================================================================
// PAYMENT BUTTON SETUP
// =============================================================================

/**
 * Add payment buttons to course cards
 */
function setupPaymentButtons() {
    // Check if we're on the programs page
    if (!document.querySelector('.course-grid')) {
        return;
    }
    
    // Add payment buttons to each course card
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        const courseId = card.dataset.courseId;
        if (!courseId || !COURSE_PRICES[courseId]) {
            return;
        }
        
        const courseInfo = COURSE_PRICES[courseId];
        const currentLang = getCurrentLanguage ? getCurrentLanguage() : 'ru';
        
        // Check if payment button container already exists
        let paymentContainer = card.querySelector('.payment-buttons');
        if (!paymentContainer) {
            // Create payment button container
            paymentContainer = document.createElement('div');
            paymentContainer.className = 'payment-buttons';
            
            // Create payment section HTML
            const paymentHTML = `
                <div class="payment-divider">
                    <span data-i18n="programs.payment.or">или</span>
                </div>
                <button class="btn-payment stripe-payment" onclick="initiateStripePayment('${courseId}')" data-i18n="programs.payment.pay_now">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M13 7H7v10h6c3.31 0 6-2.69 6-6s-2.69-6-6-6z" fill="currentColor"/>
                    </svg>
                    <span>Оплатить сейчас</span>
                </button>
                <button class="btn-payment paypal-payment" onclick="initiatePayPalPayment('${courseId}')" data-i18n="programs.payment.paypal">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.648h7.266c2.24 0 3.999.715 5.077 2.061.739.93 1.095 2.073.962 3.26-.022.19-.058.38-.107.568a5.946 5.946 0 0 1-5.402 4.357h-3.351a.64.64 0 0 0-.63.522l-.758 4.788a.64.64 0 0 1-.632.54zm6.326-14.2" fill="currentColor"/>
                    </svg>
                    <span>PayPal</span>
                </button>
            `;
            
            paymentContainer.innerHTML = paymentHTML;
            
            // Insert after the enrollment button
            const enrollButton = card.querySelector('.btn-enroll');
            if (enrollButton) {
                enrollButton.parentNode.insertBefore(paymentContainer, enrollButton.nextSibling);
            }
        }
    });
}

/**
 * Initiate Stripe payment
 */
function initiateStripePayment(courseId) {
    const courseInfo = COURSE_PRICES[courseId];
    if (!courseInfo) {
        Utils.showNotification('Course not found', 'error');
        return;
    }
    
    // Check if payment service is initialized
    if (!window.paymentService) {
        Utils.showNotification('Payment service not available. Please try again later.', 'error');
        return;
    }
    
    // Get customer data from form or prompt
    const customerData = {
        email: prompt('Enter your email for payment:'),
        name: prompt('Enter your name:'),
        phone: prompt('Enter your phone number:')
    };
    
    if (!customerData.email || !customerData.name) {
        Utils.showNotification('Please provide all required information', 'warning');
        return;
    }
    
    // Process payment
    window.paymentService.processStripePayment(courseId, customerData)
        .catch(error => {
            console.error('Payment error:', error);
            Utils.showNotification('Payment failed. Please try again.', 'error');
        });
}

/**
 * Initiate PayPal payment
 */
function initiatePayPalPayment(courseId) {
    const courseInfo = COURSE_PRICES[courseId];
    if (!courseInfo) {
        Utils.showNotification('Course not found', 'error');
        return;
    }
    
    // Create PayPal button container if it doesn't exist
    let paypalContainer = document.getElementById('paypal-button-container');
    if (!paypalContainer) {
        paypalContainer = document.createElement('div');
        paypalContainer.id = 'paypal-button-container';
        paypalContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 10000;
            min-width: 300px;
        `;
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
        `;
        closeButton.onclick = () => paypalContainer.remove();
        
        paypalContainer.appendChild(closeButton);
        document.body.appendChild(paypalContainer);
    }
    
    // Get customer data
    const customerData = {
        email: prompt('Enter your email for payment:'),
        name: prompt('Enter your name:'),
        phone: prompt('Enter your phone number:')
    };
    
    if (!customerData.email || !customerData.name) {
        Utils.showNotification('Please provide all required information', 'warning');
        paypalContainer.remove();
        return;
    }
    
    // Process PayPal payment
    if (window.paymentService) {
        window.paymentService.processPayPalPayment(courseId, customerData)
            .then(result => {
                Utils.showNotification('Payment successful!', 'success');
                paypalContainer.remove();
            })
            .catch(error => {
                console.error('PayPal payment error:', error);
                Utils.showNotification('Payment failed. Please try again.', 'error');
                paypalContainer.remove();
            });
    } else {
        Utils.showNotification('PayPal service not available', 'error');
        paypalContainer.remove();
    }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

// Update links when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    updateConfigurableLinks();
    setupPaymentButtons();
    
    // Update email configuration if EmailJS is loaded
    if (window.emailService && EMAIL_CONFIG) {
        EMAIL_CONFIG.emailJS.publicKey = APP_CONFIG.emailService.emailJS.publicKey;
        EMAIL_CONFIG.emailJS.serviceId = APP_CONFIG.emailService.emailJS.serviceId;
        EMAIL_CONFIG.emailJS.templateIds = APP_CONFIG.emailService.emailJS.templates;
    }
    
    // Update payment configuration if payment service is loaded
    if (window.paymentService && PAYMENT_CONFIG) {
        PAYMENT_CONFIG.stripe.publicKey = APP_CONFIG.payment.stripe.publicKey;
        PAYMENT_CONFIG.stripe.mode = APP_CONFIG.payment.stripe.mode;
        PAYMENT_CONFIG.stripe.courses = APP_CONFIG.payment.stripe.products;
        PAYMENT_CONFIG.paypal.clientId = APP_CONFIG.payment.paypal.clientId;
        PAYMENT_CONFIG.paypal.environment = APP_CONFIG.payment.paypal.environment;
    }
    
    console.log('Configuration applied successfully');
});

// Make functions globally available
window.APP_CONFIG = APP_CONFIG;
window.COURSE_PRICES = COURSE_PRICES;
window.getWhatsAppLink = getWhatsAppLink;
window.initiateStripePayment = initiateStripePayment;
window.initiatePayPalPayment = initiatePayPalPayment;