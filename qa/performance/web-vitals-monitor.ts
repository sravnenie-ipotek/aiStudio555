import { onCLS, onFCP, onFID, onLCP, onTTFB, onINP, CLSMetric, FCPMetric, FIDMetric, LCPMetric, TTFBMetric, INPMetric } from 'web-vitals';

interface VitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

interface PerformanceReport {
  timestamp: number;
  url: string;
  userAgent: string;
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  };
  memory?: {
    usedJSHeapSize?: number;
    totalJSHeapSize?: number;
    jsHeapSizeLimit?: number;
  };
  vitals: {
    CLS?: VitalMetric;
    FCP?: VitalMetric;
    FID?: VitalMetric;
    LCP?: VitalMetric;
    TTFB?: VitalMetric;
    INP?: VitalMetric;
  };
  resources: {
    scripts: number;
    stylesheets: number;
    images: number;
    fonts: number;
    total: number;
    size: number;
  };
  customMetrics: {
    [key: string]: number;
  };
}

class WebVitalsMonitor {
  private report: PerformanceReport;
  private analyticsEndpoint: string;
  private debug: boolean;
  private thresholds = {
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    FID: { good: 100, poor: 300 },
    LCP: { good: 2500, poor: 4000 },
    TTFB: { good: 800, poor: 1800 },
    INP: { good: 200, poor: 500 },
  };

  constructor(config: { analyticsEndpoint?: string; debug?: boolean } = {}) {
    this.analyticsEndpoint = config.analyticsEndpoint || '/api/analytics/performance';
    this.debug = config.debug || false;
    
    this.report = {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      vitals: {},
      resources: {
        scripts: 0,
        stylesheets: 0,
        images: 0,
        fonts: 0,
        total: 0,
        size: 0,
      },
      customMetrics: {},
    };

    this.collectConnectionInfo();
    this.collectMemoryInfo();
    this.initializeVitalsCollection();
    this.collectResourceMetrics();
    this.setupCustomMetrics();
    this.setupErrorTracking();
  }

  private collectConnectionInfo() {
    const nav = navigator as any;
    if (nav.connection) {
      this.report.connection = {
        effectiveType: nav.connection.effectiveType,
        downlink: nav.connection.downlink,
        rtt: nav.connection.rtt,
      };
    }
  }

  private collectMemoryInfo() {
    const perf = performance as any;
    if (perf.memory) {
      this.report.memory = {
        usedJSHeapSize: perf.memory.usedJSHeapSize,
        totalJSHeapSize: perf.memory.totalJSHeapSize,
        jsHeapSizeLimit: perf.memory.jsHeapSizeLimit,
      };
    }
  }

  private initializeVitalsCollection() {
    // Cumulative Layout Shift
    onCLS((metric: CLSMetric) => {
      this.report.vitals.CLS = this.formatMetric('CLS', metric);
      this.checkThreshold('CLS', metric.value);
      if (this.debug) console.log('CLS:', metric);
    });

    // First Contentful Paint
    onFCP((metric: FCPMetric) => {
      this.report.vitals.FCP = this.formatMetric('FCP', metric);
      this.checkThreshold('FCP', metric.value);
      if (this.debug) console.log('FCP:', metric);
    });

    // First Input Delay
    onFID((metric: FIDMetric) => {
      this.report.vitals.FID = this.formatMetric('FID', metric);
      this.checkThreshold('FID', metric.value);
      if (this.debug) console.log('FID:', metric);
    });

    // Largest Contentful Paint
    onLCP((metric: LCPMetric) => {
      this.report.vitals.LCP = this.formatMetric('LCP', metric);
      this.checkThreshold('LCP', metric.value);
      if (this.debug) console.log('LCP:', metric);
      
      // Send report after LCP (usually the last metric to be collected)
      this.sendReport();
    });

    // Time to First Byte
    onTTFB((metric: TTFBMetric) => {
      this.report.vitals.TTFB = this.formatMetric('TTFB', metric);
      this.checkThreshold('TTFB', metric.value);
      if (this.debug) console.log('TTFB:', metric);
    });

    // Interaction to Next Paint
    onINP((metric: INPMetric) => {
      this.report.vitals.INP = this.formatMetric('INP', metric);
      this.checkThreshold('INP', metric.value);
      if (this.debug) console.log('INP:', metric);
    });
  }

  private formatMetric(name: string, metric: any): VitalMetric {
    return {
      name,
      value: metric.value,
      rating: metric.rating || this.getRating(name, metric.value),
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType || 'navigate',
    };
  }

  private getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = this.thresholds[name as keyof typeof this.thresholds];
    if (!threshold) return 'good';
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private checkThreshold(name: string, value: number) {
    const threshold = this.thresholds[name as keyof typeof this.thresholds];
    if (!threshold) return;

    const rating = this.getRating(name, value);
    
    if (rating === 'poor') {
      console.warn(`⚠️ Poor ${name}: ${value}ms (threshold: ${threshold.poor}ms)`);
      this.triggerAlert(name, value, rating);
    } else if (rating === 'needs-improvement') {
      console.warn(`⚠️ ${name} needs improvement: ${value}ms`);
    }
  }

  private triggerAlert(metric: string, value: number, rating: string) {
    // Send alert to monitoring service
    if (window.gtag) {
      window.gtag('event', 'performance_alert', {
        metric_name: metric,
        metric_value: value,
        metric_rating: rating,
        page_url: window.location.href,
      });
    }
  }

  private collectResourceMetrics() {
    if (!performance.getEntriesByType) return;

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    let totalSize = 0;

    resources.forEach(resource => {
      const size = resource.transferSize || 0;
      totalSize += size;

      if (resource.name.includes('.js')) {
        this.report.resources.scripts++;
      } else if (resource.name.includes('.css')) {
        this.report.resources.stylesheets++;
      } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)/i)) {
        this.report.resources.images++;
      } else if (resource.name.match(/\.(woff|woff2|ttf|otf)/i)) {
        this.report.resources.fonts++;
      }
    });

    this.report.resources.total = resources.length;
    this.report.resources.size = totalSize;

    // Check for performance issues
    if (resources.length > 100) {
      console.warn(`⚠️ High resource count: ${resources.length} resources loaded`);
    }
    if (totalSize > 5000000) { // 5MB
      console.warn(`⚠️ Large page size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
    }
  }

  private setupCustomMetrics() {
    // Time to Interactive
    if (performance.timing) {
      const timing = performance.timing;
      this.report.customMetrics.domContentLoaded = 
        timing.domContentLoadedEventEnd - timing.navigationStart;
      this.report.customMetrics.loadComplete = 
        timing.loadEventEnd - timing.navigationStart;
    }

    // Long tasks
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.warn(`⚠️ Long task detected: ${entry.duration}ms`);
              this.report.customMetrics.longTaskCount = 
                (this.report.customMetrics.longTaskCount || 0) + 1;
              this.report.customMetrics.totalLongTaskTime = 
                (this.report.customMetrics.totalLongTaskTime || 0) + entry.duration;
            }
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long task observer not supported
      }
    }

    // Custom timing marks
    this.measureCustomTiming('app-init', 'app-ready');
    this.measureCustomTiming('data-fetch-start', 'data-fetch-end');
    this.measureCustomTiming('render-start', 'render-end');
  }

  private measureCustomTiming(startMark: string, endMark: string) {
    try {
      if (performance.getEntriesByName(startMark).length && 
          performance.getEntriesByName(endMark).length) {
        performance.measure(`${startMark}-to-${endMark}`, startMark, endMark);
        const measure = performance.getEntriesByName(`${startMark}-to-${endMark}`)[0];
        this.report.customMetrics[`${startMark}-to-${endMark}`] = measure.duration;
      }
    } catch (e) {
      // Marks not available
    }
  }

  private setupErrorTracking() {
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.report.customMetrics.jsErrors = 
        (this.report.customMetrics.jsErrors || 0) + 1;
      
      if (this.debug) {
        console.error('JS Error tracked:', event.error);
      }
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.report.customMetrics.unhandledRejections = 
        (this.report.customMetrics.unhandledRejections || 0) + 1;
      
      if (this.debug) {
        console.error('Unhandled rejection tracked:', event.reason);
      }
    });
  }

  private async sendReport() {
    if (this.debug) {
      console.log('Performance Report:', this.report);
    }

    // Send to analytics endpoint
    try {
      await fetch(this.analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.report),
      });
    } catch (error) {
      if (this.debug) {
        console.error('Failed to send performance report:', error);
      }
    }

    // Send to Google Analytics if available
    if (window.gtag) {
      Object.entries(this.report.vitals).forEach(([key, metric]) => {
        window.gtag('event', 'web_vitals', {
          metric_name: key,
          metric_value: metric.value,
          metric_rating: metric.rating,
          metric_delta: metric.delta,
        });
      });
    }
  }

  public getReport(): PerformanceReport {
    return this.report;
  }

  public printReport() {
    console.group('📊 Performance Report');
    console.table(this.report.vitals);
    console.table(this.report.resources);
    console.table(this.report.customMetrics);
    console.groupEnd();
  }

  // Public method to manually trigger specific measurements
  public mark(name: string) {
    performance.mark(name);
  }

  public measure(name: string, startMark: string, endMark?: string) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      this.report.customMetrics[name] = measure.duration;
      return measure.duration;
    } catch (e) {
      console.error(`Failed to measure ${name}:`, e);
      return null;
    }
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  const monitor = new WebVitalsMonitor({
    debug: process.env.NODE_ENV === 'development',
    analyticsEndpoint: process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || '/api/analytics/performance',
  });

  // Expose to window for debugging
  (window as any).performanceMonitor = monitor;
}

export default WebVitalsMonitor;
export type { PerformanceReport, VitalMetric };