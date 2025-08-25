/**
 * PROJECTDES AI ACADEMY - INTEGRATIONS
 * Email services, payment processing, and external API integrations
 * Version: 1.0.0
 */

'use strict';

// =============================================================================
// EMAIL SERVICE CONFIGURATION
// =============================================================================

const EMAIL_CONFIG = {
    // EmailJS Configuration (Primary)
    emailJS: {
        serviceId: 'service_projectdes',
        templateIds: {
            enrollment: 'template_enrollment',
            contact: 'template_contact'
        },
        publicKey: 'YOUR_EMAILJS_PUBLIC_KEY'
    },
    
    // Formspree Configuration (Fallback)
    formspree: {
        enrollmentEndpoint: 'https://formspree.io/f/YOUR_ENROLLMENT_FORM_ID',
        contactEndpoint: 'https://formspree.io/f/YOUR_CONTACT_FORM_ID'
    },
    
    // Recipient Configuration
    recipients: {
        enrollment: 'admissions@projectdes.ai',
        contact: 'info@projectdes.ai',
        support: 'support@projectdes.ai'
    }
};

// =============================================================================
// PAYMENT CONFIGURATION
// =============================================================================

const PAYMENT_CONFIG = {
    // Stripe Configuration
    stripe: {
        publicKey: 'pk_live_YOUR_STRIPE_PUBLIC_KEY',
        testKey: 'pk_test_YOUR_STRIPE_TEST_KEY',
        mode: 'test', // 'live' for production
        currency: 'USD',
        courses: {
            'no-code-websites': 'price_1234567890',
            'ai-video-avatars': 'price_0987654321',
            'ai-automation': 'price_1122334455',
            'social-media-ads': 'price_5566778899'
        }
    },
    
    // PayPal Configuration
    paypal: {
        clientId: 'YOUR_PAYPAL_CLIENT_ID',
        environment: 'sandbox', // 'production' for live
        currency: 'USD',
        courses: {
            'no-code-websites': { price: 899, name: 'No-Code Website Creation Course' },
            'ai-video-avatars': { price: 699, name: 'AI Video & Avatars Course' },
            'ai-automation': { price: 999, name: 'AI Business Automation Course' },
            'social-media-ads': { price: 599, name: 'Social Media & Ads Course' }
        }
    }
};

// =============================================================================
// EMAIL SERVICE CLASS
// =============================================================================

class EmailService {
    constructor() {
        this.isEmailJSLoaded = false;
        this.loadAttempts = 0;
        this.maxLoadAttempts = 3;
        
        this.init();
    }

    /**
     * Initialize email service
     */
    async init() {
        try {
            await this.loadEmailJS();
            console.log('Email service initialized successfully');
        } catch (error) {
            console.warn('EmailJS failed to load, using fallback service:', error);
        }
    }

    /**
     * Load EmailJS library
     */
    async loadEmailJS() {
        if (this.isEmailJSLoaded || window.emailjs) {
            this.isEmailJSLoaded = true;
            return;
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
            script.async = true;
            
            script.onload = () => {
                if (window.emailjs) {
                    window.emailjs.init(EMAIL_CONFIG.emailJS.publicKey);
                    this.isEmailJSLoaded = true;
                    resolve();
                } else {
                    reject(new Error('EmailJS library not available'));
                }
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load EmailJS'));
            };
            
            document.head.appendChild(script);
        });
    }

    /**
     * Send enrollment form
     */
    async sendEnrollment(formData) {
        const templateParams = {
            to_email: EMAIL_CONFIG.recipients.enrollment,
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            course: formData.course,
            course_name: formData.courseName || 'Course not specified',
            message: formData.message || 'No additional message',
            timestamp: formData.timestamp || new Date().toISOString(),
            language: formData.language || 'ru',
            source: 'Enrollment Form'
        };

        try {
            // Try EmailJS first
            if (this.isEmailJSLoaded && window.emailjs) {
                return await this.sendViaEmailJS(
                    EMAIL_CONFIG.emailJS.templateIds.enrollment,
                    templateParams
                );
            }
            
            // Fallback to Formspree
            return await this.sendViaFormspree(
                EMAIL_CONFIG.formspree.enrollmentEndpoint,
                formData
            );
            
        } catch (error) {
            console.error('Failed to send enrollment email:', error);
            throw new Error('Email service temporarily unavailable');
        }
    }

    /**
     * Send contact form
     */
    async sendContact(formData) {
        const templateParams = {
            to_email: EMAIL_CONFIG.recipients.contact,
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            course: formData.course || 'General inquiry',
            message: formData.message || 'No message provided',
            timestamp: new Date().toISOString(),
            language: getCurrentLanguage() || 'ru',
            source: 'Contact Form'
        };

        try {
            // Try EmailJS first
            if (this.isEmailJSLoaded && window.emailjs) {
                return await this.sendViaEmailJS(
                    EMAIL_CONFIG.emailJS.templateIds.contact,
                    templateParams
                );
            }
            
            // Fallback to Formspree
            return await this.sendViaFormspree(
                EMAIL_CONFIG.formspree.contactEndpoint,
                formData
            );
            
        } catch (error) {
            console.error('Failed to send contact email:', error);
            throw new Error('Email service temporarily unavailable');
        }
    }

    /**
     * Send email via EmailJS
     */
    async sendViaEmailJS(templateId, templateParams) {
        if (!window.emailjs) {
            throw new Error('EmailJS not available');
        }

        const response = await window.emailjs.send(
            EMAIL_CONFIG.emailJS.serviceId,
            templateId,
            templateParams
        );

        if (response.status !== 200) {
            throw new Error(`EmailJS error: ${response.text}`);
        }

        console.log('Email sent successfully via EmailJS');
        return { success: true, service: 'emailjs', response };
    }

    /**
     * Send email via Formspree
     */
    async sendViaFormspree(endpoint, formData) {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                ...formData,
                _subject: `New ${formData.course ? 'enrollment' : 'contact'} from ${formData.name}`,
                _replyto: formData.email
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Formspree error: ${errorData.error || response.statusText}`);
        }

        const data = await response.json();
        
        console.log('Email sent successfully via Formspree');
        return { success: true, service: 'formspree', response: data };
    }

    /**
     * Test email service connectivity
     */
    async testConnection() {
        try {
            const testData = {
                name: 'Test User',
                email: 'test@example.com',
                phone: '+1234567890',
                course: 'test',
                message: 'Connection test',
                timestamp: new Date().toISOString(),
                language: 'en'
            };

            await this.sendContact(testData);
            return { success: true, message: 'Email service is working' };
            
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

// =============================================================================
// PAYMENT SERVICE CLASS
// =============================================================================

class PaymentService {
    constructor() {
        this.stripe = null;
        this.paypal = null;
        this.isStripeLoaded = false;
        this.isPayPalLoaded = false;
        
        this.init();
    }

    /**
     * Initialize payment service
     */
    async init() {
        try {
            await Promise.allSettled([
                this.loadStripe(),
                this.loadPayPal()
            ]);
            
            console.log('Payment services initialized');
        } catch (error) {
            console.error('Error initializing payment services:', error);
        }
    }

    /**
     * Load Stripe
     */
    async loadStripe() {
        if (this.isStripeLoaded || window.Stripe) {
            this.stripe = window.Stripe || this.stripe;
            this.isStripeLoaded = true;
            return;
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            script.async = true;
            
            script.onload = () => {
                if (window.Stripe) {
                    const publicKey = PAYMENT_CONFIG.stripe.mode === 'live' 
                        ? PAYMENT_CONFIG.stripe.publicKey 
                        : PAYMENT_CONFIG.stripe.testKey;
                    
                    this.stripe = window.Stripe(publicKey);
                    this.isStripeLoaded = true;
                    resolve();
                } else {
                    reject(new Error('Stripe library not available'));
                }
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load Stripe'));
            };
            
            document.head.appendChild(script);
        });
    }

    /**
     * Load PayPal
     */
    async loadPayPal() {
        if (this.isPayPalLoaded || window.paypal) {
            this.paypal = window.paypal || this.paypal;
            this.isPayPalLoaded = true;
            return;
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=${PAYMENT_CONFIG.paypal.clientId}&currency=${PAYMENT_CONFIG.paypal.currency}&intent=capture`;
            script.async = true;
            
            script.onload = () => {
                if (window.paypal) {
                    this.paypal = window.paypal;
                    this.isPayPalLoaded = true;
                    resolve();
                } else {
                    reject(new Error('PayPal SDK not available'));
                }
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load PayPal SDK'));
            };
            
            document.head.appendChild(script);
        });
    }

    /**
     * Process Stripe payment
     */
    async processStripePayment(courseId, customerData) {
        if (!this.isStripeLoaded || !this.stripe) {
            throw new Error('Stripe not available');
        }

        const priceId = PAYMENT_CONFIG.stripe.courses[courseId];
        if (!priceId) {
            throw new Error('Course not found');
        }

        try {
            // Redirect to Stripe Checkout
            const { error } = await this.stripe.redirectToCheckout({
                lineItems: [{
                    price: priceId,
                    quantity: 1
                }],
                mode: 'payment',
                successUrl: `${window.location.origin}/success.html?course=${courseId}`,
                cancelUrl: `${window.location.origin}/programs.html?canceled=true`,
                customerEmail: customerData.email,
                metadata: {
                    course_id: courseId,
                    customer_name: customerData.name,
                    customer_phone: customerData.phone
                }
            });

            if (error) {
                throw error;
            }

        } catch (error) {
            console.error('Stripe payment error:', error);
            throw new Error(`Payment failed: ${error.message}`);
        }
    }

    /**
     * Process PayPal payment
     */
    async processPayPalPayment(courseId, customerData) {
        if (!this.isPayPalLoaded || !this.paypal) {
            throw new Error('PayPal not available');
        }

        const course = PAYMENT_CONFIG.paypal.courses[courseId];
        if (!course) {
            throw new Error('Course not found');
        }

        return new Promise((resolve, reject) => {
            this.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                currency_code: PAYMENT_CONFIG.paypal.currency,
                                value: course.price.toString()
                            },
                            description: course.name,
                            custom_id: courseId,
                            reference_id: `course_${courseId}_${Date.now()}`
                        }],
                        application_context: {
                            user_action: 'PAY_NOW',
                            payment_method: {
                                payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
                            }
                        }
                    });
                },
                
                onApprove: async (data, actions) => {
                    try {
                        const details = await actions.order.capture();
                        console.log('PayPal payment successful:', details);
                        
                        // Send confirmation email
                        await this.sendPaymentConfirmation(courseId, customerData, details);
                        
                        resolve({
                            success: true,
                            paymentId: details.id,
                            details: details
                        });
                        
                    } catch (error) {
                        console.error('PayPal capture error:', error);
                        reject(error);
                    }
                },
                
                onError: (err) => {
                    console.error('PayPal payment error:', err);
                    reject(new Error('PayPal payment failed'));
                },
                
                onCancel: () => {
                    console.log('PayPal payment cancelled');
                    reject(new Error('Payment cancelled'));
                }
                
            }).render('#paypal-button-container');
        });
    }

    /**
     * Send payment confirmation email
     */
    async sendPaymentConfirmation(courseId, customerData, paymentDetails) {
        const course = PAYMENT_CONFIG.paypal.courses[courseId];
        
        const confirmationData = {
            name: customerData.name,
            email: customerData.email,
            course: course.name,
            courseId: courseId,
            amount: course.price,
            paymentId: paymentDetails.id,
            timestamp: new Date().toISOString()
        };
        
        // This would typically send to a backend service
        console.log('Payment confirmation:', confirmationData);
        
        // You can integrate this with your email service
        if (window.emailService) {
            await window.emailService.sendPaymentConfirmation(confirmationData);
        }
    }

    /**
     * Get course price
     */
    getCoursePrice(courseId, provider = 'paypal') {
        if (provider === 'paypal') {
            return PAYMENT_CONFIG.paypal.courses[courseId]?.price;
        } else if (provider === 'stripe') {
            return PAYMENT_CONFIG.stripe.courses[courseId];
        }
        
        return null;
    }
}

// =============================================================================
// CALENDAR INTEGRATION CLASS
// =============================================================================

class CalendarIntegration {
    constructor() {
        this.calendlyUrl = 'https://calendly.com/projectdes-academy';
        this.zoomMeetingId = 'YOUR_ZOOM_MEETING_ID';
        this.googleMeetUrl = 'https://meet.google.com/YOUR_MEETING_CODE';
    }

    /**
     * Open Calendly booking widget
     */
    openCalendlyBooking(eventType = 'consultation') {
        const url = `${this.calendlyUrl}/${eventType}`;
        
        // Try to open in popup first
        const popup = window.open(
            url,
            'calendly',
            'width=800,height=700,scrollbars=yes,resizable=yes'
        );
        
        // Fallback to redirect if popup blocked
        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
            window.location.href = url;
        }
    }

    /**
     * Generate calendar event
     */
    generateCalendarEvent(eventData) {
        const startDate = new Date(eventData.startTime);
        const endDate = new Date(eventData.endTime);
        
        const formatDate = (date) => {
            return date.toISOString().replace(/[:-]|\.\d{3}/g, '');
        };
        
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
            `&text=${encodeURIComponent(eventData.title)}` +
            `&dates=${formatDate(startDate)}/${formatDate(endDate)}` +
            `&details=${encodeURIComponent(eventData.description)}` +
            `&location=${encodeURIComponent(eventData.location || 'Online')}`;
        
        return googleCalendarUrl;
    }

    /**
     * Join Zoom meeting
     */
    joinZoomMeeting() {
        const zoomUrl = `https://zoom.us/j/${this.zoomMeetingId}`;
        window.open(zoomUrl, '_blank');
    }

    /**
     * Join Google Meet
     */
    joinGoogleMeet() {
        window.open(this.googleMeetUrl, '_blank');
    }
}

// =============================================================================
// ANALYTICS INTEGRATION CLASS
// =============================================================================

class AnalyticsIntegration {
    constructor() {
        this.gtag = window.gtag;
        this.fbq = window.fbq;
        this.init();
    }

    /**
     * Initialize analytics
     */
    init() {
        this.setupGoogleAnalytics();
        this.setupFacebookPixel();
        this.trackPageLoad();
    }

    /**
     * Setup Google Analytics
     */
    setupGoogleAnalytics() {
        if (typeof this.gtag === 'function') {
            console.log('Google Analytics initialized');
        }
    }

    /**
     * Setup Facebook Pixel
     */
    setupFacebookPixel() {
        if (typeof this.fbq === 'function') {
            console.log('Facebook Pixel initialized');
        }
    }

    /**
     * Track page load
     */
    trackPageLoad() {
        if (typeof this.gtag === 'function') {
            this.gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href
            });
        }
    }

    /**
     * Track enrollment
     */
    trackEnrollment(courseId, customerData) {
        // Google Analytics
        if (typeof this.gtag === 'function') {
            this.gtag('event', 'enrollment_started', {
                course_id: courseId,
                course_name: customerData.courseName || courseId,
                method: 'form',
                engagement_time_msec: 1000
            });
        }

        // Facebook Pixel
        if (typeof this.fbq === 'function') {
            this.fbq('track', 'Lead', {
                content_name: customerData.courseName || courseId,
                content_category: 'Course Enrollment',
                value: 0,
                currency: 'USD'
            });
        }
    }

    /**
     * Track payment
     */
    trackPayment(courseId, amount, paymentMethod = 'unknown') {
        // Google Analytics
        if (typeof this.gtag === 'function') {
            this.gtag('event', 'purchase', {
                transaction_id: `course_${courseId}_${Date.now()}`,
                value: amount,
                currency: 'USD',
                items: [{
                    item_id: courseId,
                    item_name: `Course ${courseId}`,
                    category: 'Education',
                    quantity: 1,
                    price: amount
                }]
            });
        }

        // Facebook Pixel
        if (typeof this.fbq === 'function') {
            this.fbq('track', 'Purchase', {
                value: amount,
                currency: 'USD',
                content_type: 'course',
                content_ids: [courseId]
            });
        }
    }

    /**
     * Track contact
     */
    trackContact(formType = 'contact') {
        // Google Analytics
        if (typeof this.gtag === 'function') {
            this.gtag('event', 'contact', {
                method: formType
            });
        }

        // Facebook Pixel
        if (typeof this.fbq === 'function') {
            this.fbq('track', 'Contact');
        }
    }
}

// =============================================================================
// GLOBAL FUNCTIONS
// =============================================================================

/**
 * Initiate payment for course
 */
async function initiatePayment(courseId, paymentMethod = 'stripe', customerData) {
    if (!window.paymentService) {
        throw new Error('Payment service not initialized');
    }
    
    try {
        if (paymentMethod === 'stripe') {
            return await window.paymentService.processStripePayment(courseId, customerData);
        } else if (paymentMethod === 'paypal') {
            return await window.paymentService.processPayPalPayment(courseId, customerData);
        } else {
            throw new Error('Invalid payment method');
        }
    } catch (error) {
        console.error('Payment initiation failed:', error);
        throw error;
    }
}

/**
 * Book consultation
 */
function bookConsultation(type = 'general') {
    if (window.calendarIntegration) {
        window.calendarIntegration.openCalendlyBooking(type);
    }
}

/**
 * Join meeting
 */
function joinMeeting(platform = 'zoom') {
    if (window.calendarIntegration) {
        if (platform === 'zoom') {
            window.calendarIntegration.joinZoomMeeting();
        } else if (platform === 'gmeet') {
            window.calendarIntegration.joinGoogleMeet();
        }
    }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Initialize all integration services
        window.emailService = new EmailService();
        window.paymentService = new PaymentService();
        window.calendarIntegration = new CalendarIntegration();
        window.analyticsIntegration = new AnalyticsIntegration();
        
        console.log('All integration services initialized');
        
        // Test email service connectivity (optional)
        if (window.location.search.includes('test=email')) {
            const result = await window.emailService.testConnection();
            console.log('Email service test:', result);
        }
        
    } catch (error) {
        console.error('Error initializing integration services:', error);
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EmailService,
        PaymentService,
        CalendarIntegration,
        AnalyticsIntegration,
        EMAIL_CONFIG,
        PAYMENT_CONFIG,
        initiatePayment,
        bookConsultation,
        joinMeeting
    };
}