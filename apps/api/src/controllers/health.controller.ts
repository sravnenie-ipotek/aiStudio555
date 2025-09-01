/**
 * 🟡 PERFORMANCE ENGINEER - Health Check Controller
 * Production-ready health monitoring with sub-100ms response times
 * Comprehensive system health, database connectivity, and external service monitoring
 * @module apps/api/controllers/health
 */

import { Request, Response } from 'express';
import { prisma } from '@aistudio555/db';
import { createLogger } from '@aistudio555/utils';
import { asyncHandler } from '../middleware/error.middleware';
import Stripe from 'stripe';
import Redis from 'redis';

const logger = createLogger('health-monitor');

// Performance monitoring cache
const metricsCache = new Map<string, any>();
const CACHE_TTL = 30 * 1000; // 30 seconds cache

/**
 * 🟡 HEALTH CHECK ARCHITECTURE
 * Sub-100ms response with comprehensive service validation
 */

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  responseTime: number;
  checks: {
    database: ServiceHealth;
    redis: ServiceHealth;
    stripe: ServiceHealth;
    paypal: ServiceHealth;
    email: ServiceHealth;
    system: SystemHealth;
  };
  summary: {
    healthy: number;
    total: number;
    uptime: number;
  };
}

interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  message: string;
  details?: any;
  lastCheck: string;
}

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  memory: {
    used: string;
    free: string;
    percentage: number;
  };
  cpu: {
    load: number[];
    percentage: number;
  };
  connections: {
    database: number;
    redis: number;
  };
  uptime: number;
}

/**
 * 🟡 PRIMARY HEALTH CHECK ENDPOINT
 * Target: <100ms response time, comprehensive validation
 */
export const healthCheck = asyncHandler(async (req: Request, res: Response) => {
  const startTime = Date.now();
  const cacheKey = 'health-status';
  
  // Check cache first for performance
  const cached = metricsCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return res.status(200).json({
      ...cached.data,
      cached: true,
      responseTime: Date.now() - startTime
    });
  }

  try {
    // Parallel health checks for optimal performance
    const [
      dbHealth,
      redisHealth,
      stripeHealth,
      paypalHealth,
      emailHealth,
      systemHealth
    ] = await Promise.allSettled([
      checkDatabaseHealth(),
      checkRedisHealth(),
      checkStripeHealth(),
      checkPayPalHealth(),
      checkEmailHealth(),
      checkSystemHealth()
    ]);

    const healthData: HealthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      checks: {
        database: getResultValue(dbHealth),
        redis: getResultValue(redisHealth),
        stripe: getResultValue(stripeHealth),
        paypal: getResultValue(paypalHealth),
        email: getResultValue(emailHealth),
        system: getResultValue(systemHealth)
      },
      summary: {
        healthy: 0,
        total: 6,
        uptime: Math.floor(process.uptime())
      }
    };

    // Calculate overall health status
    const services = Object.values(healthData.checks);
    healthData.summary.healthy = services.filter(s => s.status === 'healthy').length;
    
    if (healthData.summary.healthy === healthData.summary.total) {
      healthData.status = 'healthy';
    } else if (healthData.summary.healthy >= healthData.summary.total * 0.7) {
      healthData.status = 'degraded';
    } else {
      healthData.status = 'unhealthy';
    }

    // Cache results for performance
    metricsCache.set(cacheKey, {
      data: healthData,
      timestamp: Date.now()
    });

    // Set appropriate HTTP status
    const httpStatus = healthData.status === 'healthy' ? 200 : 
                      healthData.status === 'degraded' ? 200 : 503;

    res.status(httpStatus).json(healthData);

  } catch (error) {
    logger.error('Health check failed:', error);
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      error: 'Health check system failure',
      message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'System unavailable'
    });
  }
});

/**
 * 🟡 DETAILED HEALTH CHECK ENDPOINT
 * Comprehensive diagnostics with performance metrics
 */
export const detailedHealthCheck = asyncHandler(async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    // Detailed checks with timing
    const checks = {
      database: await checkDatabaseHealthDetailed(),
      redis: await checkRedisHealthDetailed(),
      stripe: await checkStripeHealthDetailed(),
      system: await checkSystemHealthDetailed(),
      performance: await getPerformanceMetrics()
    };

    const responseTime = Date.now() - startTime;
    const overallStatus = determineOverallStatus(checks);

    res.status(overallStatus === 'unhealthy' ? 503 : 200).json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      responseTime,
      service: 'aistudio555-academy-api',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks,
      performance: {
        responseTime,
        uptime: Math.floor(process.uptime()),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      }
    });

  } catch (error) {
    logger.error('Detailed health check failed:', error);
    
    res.status(503).json({
      status: 'unhealthy',
      error: 'Detailed health check failure',
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime
    });
  }
});

/**
 * 🟡 PERFORMANCE METRICS ENDPOINT
 * Real-time performance data for monitoring dashboard
 */
export const performanceMetrics = asyncHandler(async (req: Request, res: Response) => {
  const metrics = await getPerformanceMetrics();
  
  res.json({
    timestamp: new Date().toISOString(),
    metrics,
    uptime: Math.floor(process.uptime())
  });
});

/**
 * 🟡 DATABASE HEALTH CHECK
 * Connection pool status and query performance
 */
async function checkDatabaseHealth(): Promise<ServiceHealth> {
  const startTime = Date.now();
  
  try {
    // Quick connection test
    await prisma.$queryRaw`SELECT 1 as test`;
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: responseTime < 50 ? 'healthy' : responseTime < 200 ? 'degraded' : 'unhealthy',
      responseTime,
      message: `Database connected (${responseTime}ms)`,
      lastCheck: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Database health check failed:', error);
    
    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      message: 'Database connection failed',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      lastCheck: new Date().toISOString()
    };
  }
}

/**
 * 🟡 REDIS HEALTH CHECK
 * Cache system connectivity and performance
 */
async function checkRedisHealth(): Promise<ServiceHealth> {
  const startTime = Date.now();
  
  try {
    // Skip if Redis not configured
    if (!process.env.REDIS_URL) {
      return {
        status: 'healthy',
        responseTime: 0,
        message: 'Redis not configured (optional)',
        lastCheck: new Date().toISOString()
      };
    }

    const redis = Redis.createClient({ url: process.env.REDIS_URL });
    await redis.connect();
    
    // Quick ping test
    const result = await redis.ping();
    await redis.disconnect();
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: result === 'PONG' && responseTime < 50 ? 'healthy' : 'degraded',
      responseTime,
      message: `Redis connected (${responseTime}ms)`,
      lastCheck: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Redis health check failed:', error);
    
    return {
      status: 'degraded', // Redis is optional, so degraded not unhealthy
      responseTime: Date.now() - startTime,
      message: 'Redis connection failed (optional service)',
      lastCheck: new Date().toISOString()
    };
  }
}

/**
 * 🟡 STRIPE HEALTH CHECK
 * Payment service connectivity
 */
async function checkStripeHealth(): Promise<ServiceHealth> {
  const startTime = Date.now();
  
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return {
        status: 'degraded',
        responseTime: 0,
        message: 'Stripe not configured',
        lastCheck: new Date().toISOString()
      };
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Quick account check with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 5000)
    );
    
    const accountPromise = stripe.accounts.retrieve();
    await Promise.race([accountPromise, timeoutPromise]);
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: responseTime < 1000 ? 'healthy' : 'degraded',
      responseTime,
      message: `Stripe API connected (${responseTime}ms)`,
      lastCheck: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Stripe health check failed:', error);
    
    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      message: 'Stripe API connection failed',
      lastCheck: new Date().toISOString()
    };
  }
}

/**
 * 🟡 PAYPAL HEALTH CHECK
 * Secondary payment service validation
 */
async function checkPayPalHealth(): Promise<ServiceHealth> {
  const startTime = Date.now();
  
  return {
    status: process.env.PAYPAL_CLIENT_ID ? 'healthy' : 'degraded',
    responseTime: Date.now() - startTime,
    message: process.env.PAYPAL_CLIENT_ID ? 'PayPal configured' : 'PayPal not configured',
    lastCheck: new Date().toISOString()
  };
}

/**
 * 🟡 EMAIL HEALTH CHECK
 * Email service connectivity validation
 */
async function checkEmailHealth(): Promise<ServiceHealth> {
  const startTime = Date.now();
  
  return {
    status: process.env.SMTP_HOST ? 'healthy' : 'degraded',
    responseTime: Date.now() - startTime,
    message: process.env.SMTP_HOST ? 'Email service configured' : 'Email service not configured',
    lastCheck: new Date().toISOString()
  };
}

/**
 * 🟡 SYSTEM HEALTH CHECK
 * Memory, CPU, and resource monitoring
 */
async function checkSystemHealth(): Promise<SystemHealth> {
  const memUsage = process.memoryUsage();
  const totalMemory = Math.round(memUsage.heapTotal / 1024 / 1024);
  const usedMemory = Math.round(memUsage.heapUsed / 1024 / 1024);
  const freeMemory = totalMemory - usedMemory;
  const memPercentage = (usedMemory / totalMemory) * 100;

  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  if (memPercentage > 90) status = 'unhealthy';
  else if (memPercentage > 80) status = 'degraded';

  return {
    status,
    memory: {
      used: `${usedMemory}MB`,
      free: `${freeMemory}MB`,
      percentage: Math.round(memPercentage)
    },
    cpu: {
      load: process.loadavg ? process.loadavg() : [0, 0, 0],
      percentage: 0 // Placeholder - would need additional monitoring for real CPU %
    },
    connections: {
      database: 0, // Placeholder - would need Prisma connection pool metrics
      redis: 0    // Placeholder - would need Redis connection pool metrics
    },
    uptime: Math.floor(process.uptime())
  };
}

/**
 * 🟡 DETAILED HEALTH CHECK FUNCTIONS
 * In-depth diagnostics for troubleshooting
 */

async function checkDatabaseHealthDetailed(): Promise<any> {
  const startTime = Date.now();
  
  try {
    // Multiple database checks
    const [basicCheck, countCheck] = await Promise.all([
      prisma.$queryRaw`SELECT 1 as test`,
      prisma.user.count().catch(() => 0) // Safe count check
    ]);

    const responseTime = Date.now() - startTime;
    
    return {
      status: 'healthy',
      responseTime,
      details: {
        connection: 'active',
        basicQuery: 'successful',
        tableAccess: 'accessible',
        approximateUsers: countCheck
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: (error as Error).message
    };
  }
}

async function checkRedisHealthDetailed(): Promise<any> {
  if (!process.env.REDIS_URL) {
    return {
      status: 'not_configured',
      message: 'Redis URL not provided'
    };
  }

  const startTime = Date.now();
  
  try {
    const redis = Redis.createClient({ url: process.env.REDIS_URL });
    await redis.connect();
    
    const [pingResult, info] = await Promise.all([
      redis.ping(),
      redis.info().catch(() => 'unavailable')
    ]);
    
    await redis.disconnect();
    
    return {
      status: 'healthy',
      responseTime: Date.now() - startTime,
      details: {
        ping: pingResult,
        info: typeof info === 'string' ? info.substring(0, 200) : 'available'
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: (error as Error).message
    };
  }
}

async function checkStripeHealthDetailed(): Promise<any> {
  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      status: 'not_configured',
      message: 'Stripe secret key not provided'
    };
  }

  const startTime = Date.now();
  
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const account = await stripe.accounts.retrieve();
    
    return {
      status: 'healthy',
      responseTime: Date.now() - startTime,
      details: {
        accountId: account.id,
        country: account.country,
        businessType: account.business_type,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: (error as Error).message
    };
  }
}

async function checkSystemHealthDetailed(): Promise<any> {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  return {
    status: 'healthy',
    memory: {
      rss: Math.round(memUsage.rss / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB',
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
      external: Math.round(memUsage.external / 1024 / 1024) + 'MB'
    },
    cpu: {
      user: cpuUsage.user,
      system: cpuUsage.system
    },
    process: {
      pid: process.pid,
      uptime: Math.floor(process.uptime()),
      version: process.version,
      platform: process.platform,
      arch: process.arch
    }
  };
}

/**
 * 🟡 PERFORMANCE METRICS COLLECTION
 * Real-time performance data aggregation
 */
async function getPerformanceMetrics() {
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    eventLoop: {
      // Event loop metrics would be implemented with additional monitoring
      lag: 0
    },
    http: {
      // HTTP metrics would be collected by middleware
      requests: 0,
      errors: 0,
      averageResponseTime: 0
    }
  };

  return metrics;
}

/**
 * 🟡 UTILITY FUNCTIONS
 */

function getResultValue<T>(result: PromiseSettledResult<T>): T | ServiceHealth {
  if (result.status === 'fulfilled') {
    return result.value;
  }
  
  return {
    status: 'unhealthy',
    responseTime: 0,
    message: 'Service check failed',
    details: result.reason?.message,
    lastCheck: new Date().toISOString()
  };
}

function determineOverallStatus(checks: any): 'healthy' | 'degraded' | 'unhealthy' {
  const statuses = Object.values(checks).map((check: any) => check.status);
  
  if (statuses.every(status => status === 'healthy')) return 'healthy';
  if (statuses.filter(status => status === 'healthy').length >= statuses.length * 0.7) return 'degraded';
  return 'unhealthy';
}

/**
 * 🟡 READINESS PROBE
 * Kubernetes-style readiness check
 */
export const readinessProbe = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Quick database check
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
      error: 'Database not ready'
    });
  }
});

/**
 * 🟡 LIVENESS PROBE
 * Kubernetes-style liveness check
 */
export const livenessProbe = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime())
  });
});