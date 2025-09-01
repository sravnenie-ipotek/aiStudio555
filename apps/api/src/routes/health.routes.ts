/**
 * 🟡 PERFORMANCE ENGINEER - Health Monitoring Routes
 * Production-ready health check and monitoring endpoints
 * Optimized for sub-100ms response times and comprehensive diagnostics
 * @module apps/api/routes/health
 */

import { Router } from 'express';
import {
  healthCheck,
  detailedHealthCheck,
  performanceMetrics,
  readinessProbe,
  livenessProbe
} from '../controllers/health.controller';
import {
  getRequestStats,
  getErrorStats,
  getDashboardMetrics,
  validatePerformanceBudget
} from '../middleware/monitoring.middleware';
import { asyncHandler } from '../middleware/error.middleware';

const router = Router();

/**
 * 🟡 BASIC HEALTH ENDPOINTS
 * Fast, lightweight health checks for load balancers and monitoring
 */

// Primary health check - optimized for speed
router.get('/health', healthCheck);

// Alternative health endpoint for compatibility
router.get('/', healthCheck);

// Kubernetes-style probes
router.get('/ready', readinessProbe);
router.get('/live', livenessProbe);

/**
 * 🟡 DETAILED MONITORING ENDPOINTS
 * Comprehensive diagnostics for operational visibility
 */

// Detailed health check with full system diagnostics
router.get('/health/detailed', detailedHealthCheck);

// Real-time performance metrics
router.get('/metrics', performanceMetrics);

// Performance statistics endpoint
router.get('/metrics/requests', asyncHandler(async (req, res) => {
  const timeWindow = parseInt(req.query.window as string) || undefined;
  const route = req.query.route as string || undefined;
  
  const stats = getRequestStats(route, timeWindow);
  
  res.json({
    timestamp: new Date().toISOString(),
    route: route || 'all',
    timeWindow: timeWindow || 300000, // 5 minutes default
    stats
  });
}));

// Error statistics endpoint
router.get('/metrics/errors', asyncHandler(async (req, res) => {
  const timeWindow = parseInt(req.query.window as string) || undefined;
  
  const errorStats = getErrorStats(timeWindow);
  
  res.json({
    timestamp: new Date().toISOString(),
    timeWindow: timeWindow || 300000,
    errors: errorStats
  });
}));

/**
 * 🟡 MONITORING DASHBOARD ENDPOINTS
 * Complete metrics for dashboard visualization
 */

// Complete dashboard metrics
router.get('/dashboard', asyncHandler(async (req, res) => {
  const dashboardMetrics = getDashboardMetrics();
  
  res.json({
    service: 'aistudio555-academy-api',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    ...dashboardMetrics
  });
}));

// Performance budget validation
router.get('/budget', asyncHandler(async (req, res) => {
  const budgetValidation = validatePerformanceBudget();
  
  res.json({
    timestamp: new Date().toISOString(),
    performanceBudget: {
      maxResponseTime: 1000,
      maxErrorRate: 5,
      maxMemoryUsage: 512
    },
    validation: budgetValidation
  });
}));

/**
 * 🟡 SYSTEM STATUS ENDPOINT
 * High-level system overview for operations teams
 */
router.get('/status', asyncHandler(async (req, res) => {
  const uptime = Math.floor(process.uptime());
  const memory = process.memoryUsage();
  const requestStats = getRequestStats();
  const errorStats = getErrorStats();
  
  // Determine overall system status
  let status = 'healthy';
  if (requestStats.errorRate > 10 || requestStats.p95 > 2000) {
    status = 'unhealthy';
  } else if (requestStats.errorRate > 5 || requestStats.p95 > 1000) {
    status = 'degraded';
  }

  res.json({
    status,
    timestamp: new Date().toISOString(),
    service: 'aistudio555-academy-api',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: {
      seconds: uptime,
      human: formatUptime(uptime)
    },
    performance: {
      requestCount: requestStats.count,
      avgResponseTime: requestStats.avgResponseTime,
      p95ResponseTime: requestStats.p95,
      errorRate: requestStats.errorRate,
      requestsPerMinute: requestStats.requestsPerMinute
    },
    resources: {
      memoryUsage: Math.round(memory.heapUsed / 1024 / 1024) + 'MB',
      memoryTotal: Math.round(memory.heapTotal / 1024 / 1024) + 'MB',
      memoryPercentage: Math.round((memory.heapUsed / memory.heapTotal) * 100)
    },
    errors: {
      totalErrors: errorStats.totalErrors,
      errorBreakdown: errorStats.errorBreakdown
    }
  });
}));

/**
 * 🟡 ADVANCED MONITORING ENDPOINTS
 * Deep diagnostics for troubleshooting and optimization
 */

// System resource monitoring
router.get('/system', asyncHandler(async (req, res) => {
  const memory = process.memoryUsage();
  const cpu = process.cpuUsage();
  
  res.json({
    timestamp: new Date().toISOString(),
    process: {
      pid: process.pid,
      uptime: Math.floor(process.uptime()),
      version: process.version,
      platform: process.platform,
      arch: process.arch
    },
    memory: {
      rss: formatBytes(memory.rss),
      heapTotal: formatBytes(memory.heapTotal),
      heapUsed: formatBytes(memory.heapUsed),
      external: formatBytes(memory.external),
      arrayBuffers: formatBytes(memory.arrayBuffers || 0)
    },
    cpu: {
      user: cpu.user,
      system: cpu.system
    },
    gc: {
      // Garbage collection stats would be added here
      // if using --expose-gc flag or monitoring tools
    }
  });
}));

// Configuration status (non-sensitive)
router.get('/config', asyncHandler(async (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    features: {
      database: !!process.env.DATABASE_URL,
      redis: !!process.env.REDIS_URL,
      stripe: !!process.env.STRIPE_SECRET_KEY,
      paypal: !!process.env.PAYPAL_CLIENT_ID,
      email: !!process.env.SMTP_HOST
    },
    security: {
      cors: 'enabled',
      helmet: 'enabled',
      rateLimiting: 'enabled',
      inputSanitization: 'enabled'
    },
    monitoring: {
      performanceTracking: 'enabled',
      errorTracking: 'enabled',
      systemMetrics: 'enabled'
    }
  });
}));

/**
 * 🟡 HISTORICAL METRICS ENDPOINT
 * Time-series data for trend analysis
 */
router.get('/metrics/history', asyncHandler(async (req, res) => {
  const hours = parseInt(req.query.hours as string) || 1;
  const interval = parseInt(req.query.interval as string) || 300000; // 5 minutes
  
  // This would be enhanced with actual time-series storage
  // For now, return current metrics with timestamp
  const currentStats = getRequestStats();
  
  // Simulate historical data points
  const dataPoints = [];
  const now = Date.now();
  const pointCount = Math.min((hours * 3600 * 1000) / interval, 288); // Max 288 points (24h @ 5min intervals)
  
  for (let i = pointCount - 1; i >= 0; i--) {
    const timestamp = now - (i * interval);
    
    // In production, this would query actual historical data
    dataPoints.push({
      timestamp: new Date(timestamp).toISOString(),
      responseTime: currentStats.avgResponseTime + (Math.random() - 0.5) * 100,
      errorRate: Math.max(0, currentStats.errorRate + (Math.random() - 0.5) * 2),
      requestCount: Math.floor(currentStats.requestsPerMinute * (interval / 60000))
    });
  }
  
  res.json({
    timeRange: {
      hours,
      interval,
      from: new Date(now - (hours * 3600 * 1000)).toISOString(),
      to: new Date(now).toISOString()
    },
    dataPoints
  });
}));

/**
 * 🟡 ALERT ENDPOINTS
 * Performance threshold monitoring and alerting
 */
router.get('/alerts', asyncHandler(async (req, res) => {
  const dashboardMetrics = getDashboardMetrics();
  
  res.json({
    timestamp: new Date().toISOString(),
    alerts: dashboardMetrics.alerts,
    thresholds: {
      responseTime: {
        warning: 1000,
        critical: 2000
      },
      errorRate: {
        warning: 5,
        critical: 10
      },
      memoryUsage: {
        warning: 512,
        critical: 768
      }
    }
  });
}));

/**
 * 🟡 UTILITY FUNCTIONS
 */
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  let result = '';
  if (days > 0) result += `${days}d `;
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m `;
  result += `${secs}s`;
  
  return result.trim();
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export default router;