/**
 * Analytics Implementation for Projectdes AI Academy
 * ===================================================
 *
 * Comprehensive analytics tracking with GA4, GTM, and custom events
 */

// Google Analytics 4 types
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

// Analytics configuration
export const analyticsConfig = {
  ga4: {
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
    enabled: process.env.NODE_ENV === 'production',
  },
  gtm: {
    containerId: process.env.NEXT_PUBLIC_GTM_ID || '',
    enabled: process.env.NODE_ENV === 'production',
  },
  facebook: {
    pixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '',
    enabled: process.env.NODE_ENV === 'production',
  },
  debug: process.env.NODE_ENV === 'development',
};

// Initialize Google Analytics
export function initializeGA() {
  if (!analyticsConfig.ga4.enabled || !analyticsConfig.ga4.measurementId) {
    return;
  }

  // Load GA4 script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.ga4.measurementId}`;
  document.head.appendChild(script1);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', analyticsConfig.ga4.measurementId, {
    page_path: window.location.pathname,
    debug_mode: analyticsConfig.debug,
  });
}

// Initialize Google Tag Manager
export function initializeGTM() {
  if (!analyticsConfig.gtm.enabled || !analyticsConfig.gtm.containerId) {
    return;
  }

  // GTM script
  const script = document.createElement('script');
  script.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${analyticsConfig.gtm.containerId}');
  `;
  document.head.appendChild(script);

  // GTM noscript iframe (for body)
  const noscript = document.createElement('noscript');
  noscript.innerHTML = `
    <iframe src="https://www.googletagmanager.com/ns.html?id=${analyticsConfig.gtm.containerId}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>
  `;
  document.body.appendChild(noscript);
}

// Initialize Facebook Pixel
export function initializeFacebookPixel() {
  if (!analyticsConfig.facebook.enabled || !analyticsConfig.facebook.pixelId) {
    return;
  }

  // Facebook Pixel script
  const script = document.createElement('script');
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${analyticsConfig.facebook.pixelId}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);
}

// Track page view
export function trackPageView(url?: string) {
  if (!analyticsConfig.ga4.enabled) return;

  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: url || window.location.pathname,
      page_title: document.title,
      page_location: window.location.href,
    });
  }

  if (window.fbq) {
    window.fbq('track', 'PageView');
  }

  if (analyticsConfig.debug) {
    console.log('📊 Page View:', url || window.location.pathname);
  }
}

// Track custom events
export function trackEvent(
  eventName: string,
  parameters?: Record<string, any>,
) {
  if (!analyticsConfig.ga4.enabled) return;

  if (window.gtag) {
    window.gtag('event', eventName, parameters);
  }

  // Also push to dataLayer for GTM
  if (window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...parameters,
    });
  }

  if (analyticsConfig.debug) {
    console.log(`📊 Event: ${eventName}`, parameters);
  }
}

// E-commerce tracking
export const ecommerce = {
  // View item (course)
  viewItem(item: {
    id: string;
    name: string;
    category?: string;
    price?: number;
    currency?: string;
  }) {
    trackEvent('view_item', {
      currency: item.currency || 'USD',
      value: item.price,
      items: [{
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: 1,
      }],
    });

    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: item.name,
        content_category: item.category,
        content_ids: [item.id],
        content_type: 'product',
        value: item.price,
        currency: item.currency || 'USD',
      });
    }
  },

  // Add to cart
  addToCart(item: {
    id: string;
    name: string;
    category?: string;
    price?: number;
    currency?: string;
  }) {
    trackEvent('add_to_cart', {
      currency: item.currency || 'USD',
      value: item.price,
      items: [{
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: 1,
      }],
    });

    if (window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_name: item.name,
        content_category: item.category,
        content_ids: [item.id],
        content_type: 'product',
        value: item.price,
        currency: item.currency || 'USD',
      });
    }
  },

  // Begin checkout
  beginCheckout(items: Array<{
    id: string;
    name: string;
    category?: string;
    price?: number;
  }>, total: number) {
    trackEvent('begin_checkout', {
      currency: 'USD',
      value: total,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: 1,
      })),
    });

    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_ids: items.map(i => i.id),
        content_type: 'product',
        num_items: items.length,
        value: total,
        currency: 'USD',
      });
    }
  },

  // Purchase
  purchase(transaction: {
    id: string;
    value: number;
    currency?: string;
    items: Array<{
      id: string;
      name: string;
      category?: string;
      price?: number;
    }>;
  }) {
    trackEvent('purchase', {
      transaction_id: transaction.id,
      value: transaction.value,
      currency: transaction.currency || 'USD',
      items: transaction.items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: 1,
      })),
    });

    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        content_ids: transaction.items.map(i => i.id),
        content_type: 'product',
        num_items: transaction.items.length,
        value: transaction.value,
        currency: transaction.currency || 'USD',
      });
    }
  },
};

// User tracking
export const user = {
  // User signup
  signUp(method: string, userId?: string) {
    trackEvent('sign_up', {
      method,
      user_id: userId,
    });

    if (window.fbq) {
      window.fbq('track', 'CompleteRegistration', {
        content_name: 'User Registration',
        status: 'completed',
      });
    }
  },

  // User login
  login(method: string, userId?: string) {
    trackEvent('login', {
      method,
      user_id: userId,
    });
  },

  // Set user properties
  setUserProperties(properties: Record<string, any>) {
    if (window.gtag) {
      window.gtag('set', 'user_properties', properties);
    }
  },
};

// Engagement tracking
export const engagement = {
  // Scroll tracking
  scroll(percentage: number) {
    trackEvent('scroll', {
      percent_scrolled: percentage,
    });
  },

  // Time on page
  timeOnPage(seconds: number) {
    trackEvent('time_on_page', {
      engagement_time_msec: seconds * 1000,
    });
  },

  // Video engagement
  video(action: 'play' | 'pause' | 'complete', videoTitle: string, percentage?: number) {
    trackEvent(`video_${action}`, {
      video_title: videoTitle,
      video_percent: percentage,
    });
  },

  // Form tracking
  form(action: 'start' | 'submit' | 'error', formName: string, fieldName?: string) {
    trackEvent(`form_${action}`, {
      form_name: formName,
      form_field: fieldName,
    });
  },

  // Search
  search(searchTerm: string, resultsCount?: number) {
    trackEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount,
    });
  },

  // Share
  share(method: string, contentType: string, itemId?: string) {
    trackEvent('share', {
      method,
      content_type: contentType,
      item_id: itemId,
    });
  },
};

// Course tracking
export const course = {
  // Course enrollment
  enroll(courseId: string, courseName: string, price?: number) {
    trackEvent('course_enrollment', {
      course_id: courseId,
      course_name: courseName,
      value: price,
    });

    if (window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: courseName,
        content_category: 'Course Enrollment',
        value: price,
        currency: 'USD',
      });
    }
  },

  // Lesson completion
  completeLesson(courseId: string, lessonId: string, lessonName: string, progress: number) {
    trackEvent('lesson_complete', {
      course_id: courseId,
      lesson_id: lessonId,
      lesson_name: lessonName,
      progress_percent: progress,
    });
  },

  // Course completion
  complete(courseId: string, courseName: string) {
    trackEvent('course_complete', {
      course_id: courseId,
      course_name: courseName,
    });

    if (window.fbq) {
      window.fbq('track', 'Achievement', {
        content_name: 'Course Completion',
        content_category: courseName,
      });
    }
  },

  // Certificate earned
  certificate(courseId: string, courseName: string, certificateId: string) {
    trackEvent('certificate_earned', {
      course_id: courseId,
      course_name: courseName,
      certificate_id: certificateId,
    });
  },
};

// Error tracking
export function trackError(error: Error, errorInfo?: any) {
  trackEvent('exception', {
    description: error.message,
    fatal: false,
    error_stack: error.stack,
    error_info: errorInfo,
  });

  if (analyticsConfig.debug) {
    console.error('📊 Error tracked:', error, errorInfo);
  }
}

// Performance tracking
export function trackPerformance() {
  if (typeof window === 'undefined' || !window.performance) return;

  const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  if (perfData) {
    trackEvent('performance_metrics', {
      dns_time: perfData.domainLookupEnd - perfData.domainLookupStart,
      connect_time: perfData.connectEnd - perfData.connectStart,
      ttfb: perfData.responseStart - perfData.requestStart,
      response_time: perfData.responseEnd - perfData.responseStart,
      dom_interactive: perfData.domInteractive - perfData.fetchStart,
      dom_complete: perfData.domComplete - perfData.fetchStart,
      load_complete: perfData.loadEventEnd - perfData.fetchStart,
    });
  }

  // Core Web Vitals
  if ('web-vital' in window) {
    // These would be captured by the web-vitals library
    trackEvent('web_vitals', {
      metric_name: 'custom',
    });
  }
}

// Custom dimensions
export function setCustomDimension(index: number, value: string) {
  if (window.gtag) {
    window.gtag('config', analyticsConfig.ga4.measurementId, {
      custom_map: { [`dimension${index}`]: value },
    });
  }
}

// Enhanced e-commerce tracking
export function trackEnhancedEcommerce(action: string, data: any) {
  if (window.gtag) {
    window.gtag('event', action, {
      ...data,
      send_to: analyticsConfig.ga4.measurementId,
    });
  }
}

// Initialize all analytics
export function initializeAnalytics() {
  if (typeof window === 'undefined') return;

  initializeGA();
  initializeGTM();
  initializeFacebookPixel();

  // Track initial page view
  trackPageView();

  // Track performance metrics after load
  window.addEventListener('load', () => {
    setTimeout(trackPerformance, 0);
  });

  // Track errors
  window.addEventListener('error', (event) => {
    trackError(new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    trackError(new Error(event.reason), {
      type: 'unhandledrejection',
    });
  });
}

export default {
  initializeAnalytics,
  trackPageView,
  trackEvent,
  trackError,
  trackPerformance,
  ecommerce,
  user,
  engagement,
  course,
  setCustomDimension,
  trackEnhancedEcommerce,
};
