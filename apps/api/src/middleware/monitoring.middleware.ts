/**
 * 🟡 PERFORMANCE ENGINEER - Monitoring Middleware
 * Real-time performance tracking and metrics collection
 * Sub-100ms overhead monitoring with comprehensive analytics
 * @module apps/api/middleware/monitoring
 */

import { Request, Response, NextFunction } from 'express';
import { createLogger } from '@aistudio555/utils';

const logger = createLogger('performance-monitor');

/**
 * 🟡 PERFORMANCE METRICS STORE
 * In-memory metrics with sliding window and efficient storage
 */
class MetricsStore {
  private requestMetrics = new Map<string, RequestMetric[]>();
  private errorMetrics = new Map<string, ErrorMetric[]>();
  private systemMetrics: SystemMetric[] = [];
  private readonly maxEntries = 10000; // Keep last 10k requests
  private readonly windowSize = 300000; // 5-minute sliding window

  addRequestMetric(metric: RequestMetric) {
    const key = `${metric.method}:${metric.route}`;
    const metrics = this.requestMetrics.get(key) || [];
    
    metrics.push(metric);
    
    // Sliding window cleanup
    const cutoff = Date.now() - this.windowSize;
    const filtered = metrics.filter(m => m.timestamp > cutoff);
    
    // Size limit
    if (filtered.length > this.maxEntries) {
      filtered.splice(0, filtered.length - this.maxEntries);
    }
    
    this.requestMetrics.set(key, filtered);
  }

  addErrorMetric(metric: ErrorMetric) {
    const key = `${metric.statusCode}`;
    const metrics = this.errorMetrics.get(key) || [];
    
    metrics.push(metric);
    
    // Cleanup
    const cutoff = Date.now() - this.windowSize;
    const filtered = metrics.filter(m => m.timestamp > cutoff);
    
    if (filtered.length > this.maxEntries) {
      filtered.splice(0, filtered.length - this.maxEntries);
    }
    
    this.errorMetrics.set(key, filtered);
  }

  addSystemMetric(metric: SystemMetric) {
    this.systemMetrics.push(metric);
    
    // Keep only recent system metrics
    const cutoff = Date.now() - this.windowSize;
    this.systemMetrics = this.systemMetrics.filter(m => m.timestamp > cutoff);
    
    if (this.systemMetrics.length > 1000) {
      this.systemMetrics.splice(0, this.systemMetrics.length - 1000);
    }
  }

  /**
   * 🟡 PERFORMANCE ANALYTICS
   * Calculate performance statistics for monitoring dashboard
   */
  getRequestStats(route?: string, timeWindow?: number): RequestStats {
    const window = timeWindow || this.windowSize;
    const cutoff = Date.now() - window;
    
    let allMetrics: RequestMetric[] = [];
    
    if (route) {
      const routeMetrics = this.requestMetrics.get(route) || [];
      allMetrics = routeMetrics.filter(m => m.timestamp > cutoff);
    } else {
      // Aggregate all routes
      for (const metrics of this.requestMetrics.values()) {
        allMetrics.push(...metrics.filter(m => m.timestamp > cutoff));
      }
    }

    if (allMetrics.length === 0) {
      return {
        count: 0,
        avgResponseTime: 0,
        p50: 0,
        p95: 0,
        p99: 0,
        errorRate: 0,
        requestsPerMinute: 0,
        timeWindow: window
      };
    }

    // Sort by response time for percentile calculations
    const sortedTimes = allMetrics
      .map(m => m.responseTime)
      .sort((a, b) => a - b);

    const totalRequests = allMetrics.length;
    const errors = allMetrics.filter(m => m.statusCode >= 400).length;
    const windowMinutes = window / (60 * 1000);

    return {
      count: totalRequests,
      avgResponseTime: Math.round(
        allMetrics.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests
      ),
      p50: this.getPercentile(sortedTimes, 0.5),
      p95: this.getPercentile(sortedTimes, 0.95),
      p99: this.getPercentile(sortedTimes, 0.99),
      errorRate: Math.round((errors / totalRequests) * 100 * 100) / 100, // 2 decimal places
      requestsPerMinute: Math.round((totalRequests / windowMinutes) * 100) / 100,
      timeWindow: window
    };
  }

  getErrorStats(timeWindow?: number): ErrorStats {
    const window = timeWindow || this.windowSize;
    const cutoff = Date.now() - window;
    
    const errorBreakdown = new Map<number, number>();
    let totalErrors = 0;

    for (const [statusCode, metrics] of this.errorMetrics) {
      const recentErrors = metrics.filter(m => m.timestamp > cutoff);
      if (recentErrors.length > 0) {
        errorBreakdown.set(parseInt(statusCode), recentErrors.length);
        totalErrors += recentErrors.length;
      }
    }

    return {
      totalErrors,
      errorBreakdown: Object.fromEntries(errorBreakdown),
      timeWindow: window
    };
  }

  getSystemStats(timeWindow?: number): SystemStats {
    const window = timeWindow || this.windowSize;
    const cutoff = Date.now() - window;
    
    const recentMetrics = this.systemMetrics.filter(m => m.timestamp > cutoff);
    
    if (recentMetrics.length === 0) {
      return {
        avgMemoryUsage: 0,
        avgCpuUsage: 0,
        peakMemoryUsage: 0,
        currentMemoryUsage: this.getCurrentMemoryUsage(),
        currentCpuUsage: 0,
        timeWindow: window
      };
    }

    const memoryUsages = recentMetrics.map(m => m.memoryUsage);
    
    return {
      avgMemoryUsage: Math.round(
        memoryUsages.reduce((sum, usage) => sum + usage, 0) / memoryUsages.length
      ),
      avgCpuUsage: 0, // Placeholder - would need more advanced CPU monitoring
      peakMemoryUsage: Math.max(...memoryUsages),
      currentMemoryUsage: this.getCurrentMemoryUsage(),
      currentCpuUsage: 0,
      timeWindow: window
    };
  }

  private getPercentile(sortedArray: number[], percentile: number): number {
    if (sortedArray.length === 0) return 0;
    
    const index = percentile * (sortedArray.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;

    if (upper >= sortedArray.length) return sortedArray[sortedArray.length - 1];
    
    return Math.round(
      sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight
    );
  }

  private getCurrentMemoryUsage(): number {
    return Math.round(process.memoryUsage().heapUsed / 1024 / 1024); // MB
  }

  /**
   * 🟡 MONITORING DASHBOARD DATA
   * Complete metrics for dashboard visualization
   */
  getDashboardMetrics(): DashboardMetrics {
    const currentTime = new Date().toISOString();
    const uptime = Math.floor(process.uptime());
    
    return {
      timestamp: currentTime,
      uptime,
      requests: this.getRequestStats(),
      errors: this.getErrorStats(),
      system: this.getSystemStats(),
      routes: this.getRouteBreakdown(),
      alerts: this.generateAlerts()
    };
  }

  private getRouteBreakdown(): RouteMetrics[] {
    const routes: RouteMetrics[] = [];
    
    for (const [route, metrics] of this.requestMetrics) {
      const recentMetrics = metrics.filter(m => m.timestamp > Date.now() - this.windowSize);
      if (recentMetrics.length === 0) continue;

      const [method, path] = route.split(':');
      const responseTimes = recentMetrics.map(m => m.responseTime);
      const errors = recentMetrics.filter(m => m.statusCode >= 400).length;

      routes.push({
        method,
        path,
        count: recentMetrics.length,
        avgResponseTime: Math.round(
          responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
        ),
        errorRate: Math.round((errors / recentMetrics.length) * 100 * 100) / 100,
        p95: this.getPercentile([...responseTimes].sort((a, b) => a - b), 0.95)
      });
    }

    return routes.sort((a, b) => b.count - a.count);
  }

  private generateAlerts(): Alert[] {
    const alerts: Alert[] = [];
    const stats = this.getRequestStats();
    const systemStats = this.getSystemStats();
    
    // Performance alerts
    if (stats.p95 > 1000) {
      alerts.push({
        level: 'warning',
        type: 'performance',
        message: `High response time: P95 is ${stats.p95}ms`,
        threshold: 1000,
        current: stats.p95
      });
    }
    
    if (stats.errorRate > 5) {
      alerts.push({
        level: 'critical',
        type: 'error_rate',
        message: `High error rate: ${stats.errorRate}%`,
        threshold: 5,
        current: stats.errorRate
      });
    }

    // System alerts
    if (systemStats.currentMemoryUsage > 512) {
      alerts.push({
        level: 'warning',
        type: 'memory',
        message: `High memory usage: ${systemStats.currentMemoryUsage}MB`,
        threshold: 512,
        current: systemStats.currentMemoryUsage
      });
    }

    return alerts;
  }
}

/**
 * 🟡 GLOBAL METRICS INSTANCE
 * Singleton pattern for consistent metrics collection
 */
const metricsStore = new MetricsStore();

/**
 * 🟡 PERFORMANCE MONITORING MIDDLEWARE
 * High-performance request tracking with minimal overhead
 */
export function performanceMonitoring(req: Request, res: Response, next: NextFunction) {
  const startTime = process.hrtime.bigint();
  const requestId = req.id || 'unknown';
  
  // Skip monitoring for health checks to avoid noise
  if (req.path === '/health' || req.path === '/health/ready' || req.path === '/health/live') {
    return next();
  }

  // Capture original res.end to measure response time
  const originalEnd = res.end;
  
  res.end = function(chunk?: any, encoding?: any, cb?: any) {
    // Calculate response time in milliseconds
    const endTime = process.hrtime.bigint();
    const responseTime = Number((endTime - startTime) / BigInt(1000000)); // Convert to ms

    // Create request metric
    const requestMetric: RequestMetric = {
      requestId,
      method: req.method,
      route: getRoutePattern(req),
      statusCode: res.statusCode,
      responseTime,
      timestamp: Date.now(),
      userAgent: req.get('User-Agent') || '',
      ip: req.ip || 'unknown'
    };

    // Add to metrics store
    metricsStore.addRequestMetric(requestMetric);

    // Log errors and slow requests
    if (res.statusCode >= 400) {
      const errorMetric: ErrorMetric = {
        requestId,
        statusCode: res.statusCode,
        method: req.method,
        route: getRoutePattern(req),
        timestamp: Date.now(),
        error: res.statusMessage || 'Unknown error',
        ip: req.ip || 'unknown'
      };
      
      metricsStore.addErrorMetric(errorMetric);
      
      logger.warn(`HTTP ${res.statusCode}`, {
        method: req.method,
        route: getRoutePattern(req),
        responseTime,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
    }

    if (responseTime > 1000) {
      logger.warn(`Slow request: ${responseTime}ms`, {
        method: req.method,
        route: getRoutePattern(req),
        responseTime,
        ip: req.ip
      });
    }

    // Restore original end method and call it
    res.end = originalEnd;
    return res.end(chunk, encoding, cb);
  };

  next();
}

/**
 * 🟡 SYSTEM METRICS COLLECTION
 * Periodic system resource monitoring
 */
let systemMetricsInterval: NodeJS.Timeout;

export function startSystemMetricsCollection(intervalMs: number = 30000) {
  if (systemMetricsInterval) {
    clearInterval(systemMetricsInterval);
  }

  systemMetricsInterval = setInterval(() => {
    const memUsage = process.memoryUsage();
    
    const systemMetric: SystemMetric = {
      timestamp: Date.now(),
      memoryUsage: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
      cpuUsage: 0, // Placeholder - would need more advanced monitoring
      activeConnections: 0 // Placeholder - would need server connection tracking
    };

    metricsStore.addSystemMetric(systemMetric);
  }, intervalMs);

  logger.info(`System metrics collection started (interval: ${intervalMs}ms)`);
}

export function stopSystemMetricsCollection() {
  if (systemMetricsInterval) {
    clearInterval(systemMetricsInterval);
    logger.info('System metrics collection stopped');
  }
}

/**
 * 🟡 METRICS ACCESS FUNCTIONS
 * API for accessing collected metrics
 */
export function getMetricsStore(): MetricsStore {
  return metricsStore;
}

export function getRequestStats(route?: string, timeWindow?: number): RequestStats {
  return metricsStore.getRequestStats(route, timeWindow);
}

export function getErrorStats(timeWindow?: number): ErrorStats {
  return metricsStore.getErrorStats(timeWindow);
}

export function getDashboardMetrics(): DashboardMetrics {
  return metricsStore.getDashboardMetrics();
}

/**
 * 🟡 UTILITY FUNCTIONS
 */
function getRoutePattern(req: Request): string {
  // Extract route pattern from request
  const route = (req as any).route;
  if (route && route.path) {
    return `${req.method}:${route.path}`;
  }
  
  // Fallback to URL path with parameter normalization
  let path = req.path;
  
  // Replace common ID patterns
  path = path.replace(/\/\d+/g, '/:id');
  path = path.replace(/\/[a-f0-9]{24}/g, '/:id'); // MongoDB ObjectIds
  path = path.replace(/\/[a-f0-9-]{36}/g, '/:uuid'); // UUIDs
  
  return `${req.method}:${path}`;
}

/**
 * 🟡 TYPE DEFINITIONS
 * TypeScript interfaces for metrics data
 */
interface RequestMetric {
  requestId: string;
  method: string;
  route: string;
  statusCode: number;
  responseTime: number;
  timestamp: number;
  userAgent: string;
  ip: string;
}

interface ErrorMetric {
  requestId: string;
  statusCode: number;
  method: string;
  route: string;
  timestamp: number;
  error: string;
  ip: string;
}

interface SystemMetric {
  timestamp: number;
  memoryUsage: number; // MB
  cpuUsage: number; // Percentage
  activeConnections: number;
}

interface RequestStats {
  count: number;
  avgResponseTime: number;
  p50: number;
  p95: number;
  p99: number;
  errorRate: number;
  requestsPerMinute: number;
  timeWindow: number;
}

interface ErrorStats {
  totalErrors: number;
  errorBreakdown: { [statusCode: number]: number };
  timeWindow: number;
}

interface SystemStats {
  avgMemoryUsage: number;
  avgCpuUsage: number;
  peakMemoryUsage: number;
  currentMemoryUsage: number;
  currentCpuUsage: number;
  timeWindow: number;
}

interface RouteMetrics {
  method: string;
  path: string;
  count: number;
  avgResponseTime: number;
  errorRate: number;
  p95: number;
}

interface Alert {
  level: 'info' | 'warning' | 'critical';
  type: 'performance' | 'error_rate' | 'memory' | 'cpu' | 'disk';
  message: string;
  threshold: number;
  current: number;
}

export interface DashboardMetrics {
  timestamp: string;
  uptime: number;
  requests: RequestStats;
  errors: ErrorStats;
  system: SystemStats;
  routes: RouteMetrics[];
  alerts: Alert[];
}

/**
 * 🟡 REQUEST ID ENHANCEMENT
 * Add unique request ID for correlation
 */
export function enhanceRequestId(req: Request, res: Response, next: NextFunction) {
  if (!req.id) {
    req.id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Add to response headers for client tracking
  res.setHeader('X-Request-ID', req.id);
  
  next();
}

/**
 * 🟡 PERFORMANCE BUDGET VALIDATION
 * Automatic performance threshold monitoring
 */
interface PerformanceBudget {
  maxResponseTime: number;
  maxErrorRate: number;
  maxMemoryUsage: number;
  alertThreshold: number;
}

const PERFORMANCE_BUDGET: PerformanceBudget = {
  maxResponseTime: 1000, // 1 second
  maxErrorRate: 5, // 5%
  maxMemoryUsage: 512, // 512MB
  alertThreshold: 0.8 // 80% of budget
};

export function validatePerformanceBudget(): {
  withinBudget: boolean;
  violations: string[];
  recommendations: string[];
} {
  const stats = metricsStore.getRequestStats();
  const systemStats = metricsStore.getSystemStats();
  
  const violations: string[] = [];
  const recommendations: string[] = [];
  
  // Response time budget
  if (stats.p95 > PERFORMANCE_BUDGET.maxResponseTime) {
    violations.push(`P95 response time (${stats.p95}ms) exceeds budget (${PERFORMANCE_BUDGET.maxResponseTime}ms)`);
    recommendations.push('Consider database query optimization or caching implementation');
  } else if (stats.p95 > PERFORMANCE_BUDGET.maxResponseTime * PERFORMANCE_BUDGET.alertThreshold) {
    recommendations.push(`P95 approaching budget threshold: ${stats.p95}ms/${PERFORMANCE_BUDGET.maxResponseTime}ms`);
  }
  
  // Error rate budget
  if (stats.errorRate > PERFORMANCE_BUDGET.maxErrorRate) {
    violations.push(`Error rate (${stats.errorRate}%) exceeds budget (${PERFORMANCE_BUDGET.maxErrorRate}%)`);
    recommendations.push('Investigate error patterns and implement better error handling');
  }
  
  // Memory usage budget
  if (systemStats.currentMemoryUsage > PERFORMANCE_BUDGET.maxMemoryUsage) {
    violations.push(`Memory usage (${systemStats.currentMemoryUsage}MB) exceeds budget (${PERFORMANCE_BUDGET.maxMemoryUsage}MB)`);
    recommendations.push('Consider memory optimization or increasing server resources');
  }
  
  return {
    withinBudget: violations.length === 0,
    violations,
    recommendations
  };
}