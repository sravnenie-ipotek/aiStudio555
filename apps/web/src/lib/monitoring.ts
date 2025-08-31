/**
 * Comprehensive Monitoring Setup for Projectdes AI Academy
 * =========================================================
 * 
 * Error tracking, performance monitoring, and health checks
 */

import * as Sentry from '@sentry/nextjs';
import { CaptureConsole } from '@sentry/integrations';

// Monitoring configuration
export const monitoringConfig = {
  sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    enabled: process.env.NODE_ENV === 'production',
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    debug: process.env.NODE_ENV === 'development',
  },
  uptime: {
    enabled: process.env.NODE_ENV === 'production',
    pingInterval: 60000, // 1 minute
    endpoints: [
      'https://projectdes.ai',
      'https://api.projectdes.ai',
    ],
  },
  healthCheck: {
    interval: 30000, // 30 seconds
    timeout: 5000,
    retries: 3,
  },
};

// Initialize Sentry
export function initializeSentry() {
  if (!monitoringConfig.sentry.enabled || !monitoringConfig.sentry.dsn) {
    console.log('🔍 Sentry disabled (no DSN or not production)');
    return;
  }

  Sentry.init({
    dsn: monitoringConfig.sentry.dsn,
    environment: monitoringConfig.sentry.environment,
    tracesSampleRate: monitoringConfig.sentry.tracesSampleRate,
    debug: monitoringConfig.sentry.debug,
    
    // Performance Monitoring
    integrations: [
      new Sentry.BrowserTracing({
        // Set sampling rate for performance monitoring
        tracingOrigins: ['localhost', 'projectdes.ai', /^\//],
        // Capture interactions
        routingInstrumentation: Sentry.nextRouterInstrumentation,
      }),
      new CaptureConsole({
        levels: ['error', 'warn'],
      }),
      new Sentry.Replay({
        maskAllText: false,
        blockAllMedia: false,
        // Capture 10% of all sessions
        sessionSampleRate: 0.1,
        // Capture 100% of sessions with an error
        errorSampleRate: 1.0,
      }),
    ],
    
    // Release tracking
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
    
    // User context
    initialScope: {
      tags: {
        component: 'frontend',
      },
    },
    
    // Filtering
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      // Random network errors
      'Network request failed',
      'NetworkError',
      'Failed to fetch',
      // Facebook errors
      'fb_xd_fragment',
      // Google Analytics errors
      'gtag is not defined',
      // Console errors from extensions
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
    ],
    
    // Before send hook
    beforeSend(event, hint) {
      // Filter out certain errors
      if (event.exception) {
        const error = hint.originalException;
        
        // Don't send cancelled requests
        if (error?.name === 'AbortError') {
          return null;
        }
        
        // Don't send 404 errors
        if (error?.message?.includes('404')) {
          return null;
        }
      }
      
      // Sanitize sensitive data
      if (event.request) {
        // Remove sensitive headers
        if (event.request.headers) {
          delete event.request.headers['Authorization'];
          delete event.request.headers['Cookie'];
          delete event.request.headers['X-CSRF-Token'];
        }
        
        // Remove sensitive data from URL
        if (event.request.url) {
          event.request.url = event.request.url.replace(/token=[^&]+/, 'token=REDACTED');
          event.request.url = event.request.url.replace(/api_key=[^&]+/, 'api_key=REDACTED');
        }
      }
      
      return event;
    },
    
    // Session tracking
    autoSessionTracking: true,
    
    // Breadcrumbs
    beforeBreadcrumb(breadcrumb) {
      // Filter out noisy breadcrumbs
      if (breadcrumb.category === 'console' && breadcrumb.level === 'debug') {
        return null;
      }
      
      // Sanitize data in breadcrumbs
      if (breadcrumb.data && breadcrumb.data.url) {
        breadcrumb.data.url = breadcrumb.data.url.replace(/token=[^&]+/, 'token=REDACTED');
      }
      
      return breadcrumb;
    },
  });

  console.log('✅ Sentry initialized');
}

// Error boundary reporting
export function reportErrorBoundary(error: Error, errorInfo: any) {
  console.error('Error boundary triggered:', error, errorInfo);
  
  if (monitoringConfig.sentry.enabled) {
    Sentry.withScope((scope) => {
      scope.setContext('errorBoundary', errorInfo);
      scope.setLevel('error');
      Sentry.captureException(error);
    });
  }
}

// Manual error reporting
export function reportError(error: Error | string, context?: Record<string, any>) {
  console.error('Error reported:', error, context);
  
  if (monitoringConfig.sentry.enabled) {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('additional', context);
      }
      
      if (typeof error === 'string') {
        Sentry.captureMessage(error, 'error');
      } else {
        Sentry.captureException(error);
      }
    });
  }
}

// Performance monitoring
export function trackPerformance(name: string, duration: number, data?: Record<string, any>) {
  if (monitoringConfig.sentry.enabled) {
    const transaction = Sentry.getCurrentHub().getScope()?.getTransaction();
    
    if (transaction) {
      const span = transaction.startChild({
        op: 'custom',
        description: name,
        data,
      });
      
      setTimeout(() => {
        span.finish();
      }, duration);
    }
  }
  
  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`⚡ Performance: ${name} took ${duration}ms`, data);
  }
}

// User context
export function setUserContext(user: {
  id: string;
  email?: string;
  username?: string;
  role?: string;
}) {
  if (monitoringConfig.sentry.enabled) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });
  }
}

// Clear user context (on logout)
export function clearUserContext() {
  if (monitoringConfig.sentry.enabled) {
    Sentry.setUser(null);
  }
}

// Custom breadcrumb
export function addBreadcrumb(
  message: string,
  category: string,
  level: 'debug' | 'info' | 'warning' | 'error' = 'info',
  data?: Record<string, any>
) {
  if (monitoringConfig.sentry.enabled) {
    Sentry.addBreadcrumb({
      message,
      category,
      level: level as Sentry.SeverityLevel,
      data,
      timestamp: Date.now() / 1000,
    });
  }
}

// Transaction tracking
export function startTransaction(name: string, op: string = 'navigation') {
  if (monitoringConfig.sentry.enabled) {
    return Sentry.startTransaction({
      name,
      op,
    });
  }
  return null;
}

// Health check system
export class HealthCheckMonitor {
  private checks: Map<string, () => Promise<boolean>> = new Map();
  private results: Map<string, { status: boolean; lastCheck: Date; error?: string }> = new Map();
  private interval: NodeJS.Timeout | null = null;

  constructor() {
    this.registerDefaultChecks();
  }

  // Register a health check
  registerCheck(name: string, check: () => Promise<boolean>) {
    this.checks.set(name, check);
  }

  // Register default checks
  private registerDefaultChecks() {
    // API health check
    this.registerCheck('api', async () => {
      try {
        const response = await fetch('/api/health', {
          method: 'GET',
          signal: AbortSignal.timeout(monitoringConfig.healthCheck.timeout),
        });
        return response.ok;
      } catch {
        return false;
      }
    });

    // Database health check
    this.registerCheck('database', async () => {
      try {
        const response = await fetch('/api/health/db', {
          method: 'GET',
          signal: AbortSignal.timeout(monitoringConfig.healthCheck.timeout),
        });
        return response.ok;
      } catch {
        return false;
      }
    });

    // Redis health check
    this.registerCheck('redis', async () => {
      try {
        const response = await fetch('/api/health/redis', {
          method: 'GET',
          signal: AbortSignal.timeout(monitoringConfig.healthCheck.timeout),
        });
        return response.ok;
      } catch {
        return false;
      }
    });

    // Payment gateway health check
    this.registerCheck('payments', async () => {
      try {
        const response = await fetch('/api/health/payments', {
          method: 'GET',
          signal: AbortSignal.timeout(monitoringConfig.healthCheck.timeout),
        });
        return response.ok;
      } catch {
        return false;
      }
    });
  }

  // Run all health checks
  async runChecks(): Promise<Map<string, { status: boolean; lastCheck: Date; error?: string }>> {
    const promises = Array.from(this.checks.entries()).map(async ([name, check]) => {
      try {
        const status = await check();
        this.results.set(name, {
          status,
          lastCheck: new Date(),
        });
        
        // Report to Sentry if check fails
        if (!status && monitoringConfig.sentry.enabled) {
          addBreadcrumb(`Health check failed: ${name}`, 'health', 'warning');
        }
      } catch (error) {
        this.results.set(name, {
          status: false,
          lastCheck: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        
        // Report to Sentry
        if (monitoringConfig.sentry.enabled) {
          reportError(error as Error, { healthCheck: name });
        }
      }
    });

    await Promise.all(promises);
    return this.results;
  }

  // Start periodic health checks
  start() {
    if (this.interval) {
      return;
    }

    // Run initial check
    this.runChecks();

    // Schedule periodic checks
    this.interval = setInterval(() => {
      this.runChecks();
    }, monitoringConfig.healthCheck.interval);
  }

  // Stop health checks
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  // Get current health status
  getStatus(): {
    healthy: boolean;
    checks: Array<{ name: string; status: boolean; lastCheck: Date; error?: string }>;
  } {
    const checks = Array.from(this.results.entries()).map(([name, result]) => ({
      name,
      ...result,
    }));

    const healthy = checks.every(check => check.status);

    return { healthy, checks };
  }
}

// Uptime monitoring
export class UptimeMonitor {
  private endpoints: string[] = [];
  private interval: NodeJS.Timeout | null = null;
  private results: Map<string, { status: boolean; responseTime: number; lastCheck: Date }> = new Map();

  constructor(endpoints: string[] = monitoringConfig.uptime.endpoints) {
    this.endpoints = endpoints;
  }

  // Check endpoint
  async checkEndpoint(url: string): Promise<{ status: boolean; responseTime: number }> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(monitoringConfig.healthCheck.timeout),
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        status: response.ok,
        responseTime,
      };
    } catch {
      return {
        status: false,
        responseTime: Date.now() - startTime,
      };
    }
  }

  // Run all uptime checks
  async runChecks() {
    const promises = this.endpoints.map(async (endpoint) => {
      const result = await this.checkEndpoint(endpoint);
      
      this.results.set(endpoint, {
        ...result,
        lastCheck: new Date(),
      });
      
      // Report to monitoring if endpoint is down
      if (!result.status) {
        reportError(`Endpoint down: ${endpoint}`, {
          responseTime: result.responseTime,
        });
      }
      
      // Report slow response times
      if (result.responseTime > 3000) {
        addBreadcrumb(
          `Slow response from ${endpoint}: ${result.responseTime}ms`,
          'performance',
          'warning'
        );
      }
    });

    await Promise.all(promises);
  }

  // Start uptime monitoring
  start() {
    if (!monitoringConfig.uptime.enabled || this.interval) {
      return;
    }

    // Run initial check
    this.runChecks();

    // Schedule periodic checks
    this.interval = setInterval(() => {
      this.runChecks();
    }, monitoringConfig.uptime.pingInterval);
  }

  // Stop monitoring
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  // Get uptime status
  getStatus() {
    return Array.from(this.results.entries()).map(([endpoint, result]) => ({
      endpoint,
      ...result,
    }));
  }
}

// Initialize monitoring
let healthMonitor: HealthCheckMonitor | null = null;
let uptimeMonitor: UptimeMonitor | null = null;

export function initializeMonitoring() {
  // Initialize Sentry
  initializeSentry();

  // Initialize health checks
  if (typeof window !== 'undefined') {
    healthMonitor = new HealthCheckMonitor();
    healthMonitor.start();

    // Initialize uptime monitoring
    uptimeMonitor = new UptimeMonitor();
    uptimeMonitor.start();
  }

  console.log('✅ Monitoring initialized');
}

// Get monitoring instances
export function getHealthMonitor() {
  return healthMonitor;
}

export function getUptimeMonitor() {
  return uptimeMonitor;
}

// Export everything
export default {
  initializeMonitoring,
  initializeSentry,
  reportErrorBoundary,
  reportError,
  trackPerformance,
  setUserContext,
  clearUserContext,
  addBreadcrumb,
  startTransaction,
  HealthCheckMonitor,
  UptimeMonitor,
  getHealthMonitor,
  getUptimeMonitor,
};