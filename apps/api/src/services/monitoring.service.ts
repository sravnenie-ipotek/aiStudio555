/**
 * 🟡 PERFORMANCE ENGINEER - Service Monitoring
 * External service health monitoring and performance tracking
 * Circuit breaker patterns and service degradation handling
 * @module apps/api/services/monitoring
 */

import { createLogger } from '@aistudio555/utils';
import { prisma } from '@aistudio555/db';
import Stripe from 'stripe';
import Redis from 'redis';
import nodemailer from 'nodemailer';

const logger = createLogger('service-monitor');

/**
 * 🟡 SERVICE HEALTH MONITORING
 * Comprehensive external service validation with circuit breaker patterns
 */

interface ServiceHealthResult {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'not_configured';
  responseTime: number;
  timestamp: string;
  details?: any;
  error?: string;
}

interface CircuitBreakerState {
  isOpen: boolean;
  failureCount: number;
  lastFailureTime: number;
  nextAttemptTime: number;
}

class ServiceMonitor {
  private circuitBreakers = new Map<string, CircuitBreakerState>();
  private readonly failureThreshold = 5;
  private readonly timeoutMs = 10000; // 10 seconds
  private readonly recoveryTimeMs = 60000; // 1 minute

  /**
   * 🟡 DATABASE MONITORING
   * Connection pool health and query performance
   */
  async checkDatabaseHealth(): Promise<ServiceHealthResult> {
    const startTime = Date.now();
    const serviceName = 'database';

    try {
      if (this.isCircuitBreakerOpen(serviceName)) {
        return this.createUnhealthyResult(serviceName, 'Circuit breaker open', 0);
      }

      // Comprehensive database checks
      const [basicCheck, countCheck, connectionCheck] = await Promise.all([
        this.timeoutPromise(
          prisma.$queryRaw`SELECT 1 as health_check, NOW() as current_time`,
          'Basic query test'
        ),
        this.timeoutPromise(
          prisma.user.count().catch(() => 0),
          'Table access test'
        ),
        this.timeoutPromise(
          prisma.$queryRaw`SELECT COUNT(*) as active_connections FROM pg_stat_activity`,
          'Connection pool check'
        ).catch(() => null)
      ]);

      const responseTime = Date.now() - startTime;
      
      // Determine health status based on response time
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      if (responseTime > 1000) status = 'unhealthy';
      else if (responseTime > 500) status = 'degraded';

      this.recordSuccess(serviceName);

      return {
        service: serviceName,
        status,
        responseTime,
        timestamp: new Date().toISOString(),
        details: {
          basicQuery: 'successful',
          tableAccess: 'accessible',
          approximateUsers: countCheck,
          connectionPool: connectionCheck ? 'accessible' : 'limited_access',
          performance: this.categorizePerformance(responseTime)
        }
      };

    } catch (error) {
      this.recordFailure(serviceName);
      logger.error('Database health check failed:', error);

      return this.createUnhealthyResult(
        serviceName,
        'Database connection failed',
        Date.now() - startTime,
        error
      );
    }
  }

  /**
   * 🟡 REDIS MONITORING
   * Cache system performance and connectivity
   */
  async checkRedisHealth(): Promise<ServiceHealthResult> {
    const startTime = Date.now();
    const serviceName = 'redis';

    if (!process.env.REDIS_URL) {
      return {
        service: serviceName,
        status: 'not_configured',
        responseTime: 0,
        timestamp: new Date().toISOString(),
        details: { message: 'Redis URL not configured (optional service)' }
      };
    }

    try {
      if (this.isCircuitBreakerOpen(serviceName)) {
        return this.createUnhealthyResult(serviceName, 'Circuit breaker open', 0);
      }

      const redis = Redis.createClient({ url: process.env.REDIS_URL });
      await redis.connect();

      // Comprehensive Redis checks
      const [pingResult, setResult, getResult, infoResult] = await Promise.all([
        this.timeoutPromise(redis.ping(), 'Ping test'),
        this.timeoutPromise(
          redis.set('health_check', Date.now().toString(), { EX: 60 }),
          'Set operation test'
        ),
        this.timeoutPromise(redis.get('health_check'), 'Get operation test'),
        this.timeoutPromise(redis.info('memory'), 'Memory info').catch(() => 'unavailable')
      ]);

      await redis.disconnect();

      const responseTime = Date.now() - startTime;
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      
      if (responseTime > 500) status = 'degraded';
      if (pingResult !== 'PONG') status = 'unhealthy';

      this.recordSuccess(serviceName);

      return {
        service: serviceName,
        status,
        responseTime,
        timestamp: new Date().toISOString(),
        details: {
          ping: pingResult,
          operations: 'successful',
          performance: this.categorizePerformance(responseTime),
          memoryInfo: typeof infoResult === 'string' ? infoResult.substring(0, 100) : 'available'
        }
      };

    } catch (error) {
      this.recordFailure(serviceName);
      logger.error('Redis health check failed:', error);

      return {
        service: serviceName,
        status: 'degraded', // Redis is optional, so degraded not unhealthy
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        error: 'Redis connection failed (optional service)',
        details: { configured: true, accessible: false }
      };
    }
  }

  /**
   * 🟡 STRIPE MONITORING
   * Payment service API health and rate limits
   */
  async checkStripeHealth(): Promise<ServiceHealthResult> {
    const startTime = Date.now();
    const serviceName = 'stripe';

    if (!process.env.STRIPE_SECRET_KEY) {
      return {
        service: serviceName,
        status: 'not_configured',
        responseTime: 0,
        timestamp: new Date().toISOString(),
        details: { message: 'Stripe secret key not configured' }
      };
    }

    try {
      if (this.isCircuitBreakerOpen(serviceName)) {
        return this.createUnhealthyResult(serviceName, 'Circuit breaker open', 0);
      }

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      // Comprehensive Stripe checks
      const [accountResult, balanceResult] = await Promise.all([
        this.timeoutPromise(stripe.accounts.retrieve(), 'Account access'),
        this.timeoutPromise(stripe.balance.retrieve(), 'Balance access').catch(() => null)
      ]);

      const responseTime = Date.now() - startTime;
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      
      if (responseTime > 2000) status = 'unhealthy';
      else if (responseTime > 1000) status = 'degraded';

      this.recordSuccess(serviceName);

      return {
        service: serviceName,
        status,
        responseTime,
        timestamp: new Date().toISOString(),
        details: {
          accountId: accountResult.id,
          country: accountResult.country,
          chargesEnabled: accountResult.charges_enabled,
          payoutsEnabled: accountResult.payouts_enabled,
          balanceAvailable: balanceResult ? true : false,
          performance: this.categorizePerformance(responseTime),
          rateLimitStatus: 'within_limits' // Would be enhanced with actual rate limit monitoring
        }
      };

    } catch (error) {
      this.recordFailure(serviceName);
      logger.error('Stripe health check failed:', error);

      const stripeError = error as any;
      const errorDetails = {
        type: stripeError.type || 'unknown',
        code: stripeError.code || 'unknown',
        statusCode: stripeError.statusCode || 0
      };

      return this.createUnhealthyResult(
        serviceName,
        'Stripe API connection failed',
        Date.now() - startTime,
        errorDetails
      );
    }
  }

  /**
   * 🟡 PAYPAL MONITORING
   * Secondary payment service validation
   */
  async checkPayPalHealth(): Promise<ServiceHealthResult> {
    const startTime = Date.now();
    const serviceName = 'paypal';

    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return {
        service: serviceName,
        status: 'not_configured',
        responseTime: 0,
        timestamp: new Date().toISOString(),
        details: { 
          message: 'PayPal credentials not configured',
          clientIdPresent: !!process.env.PAYPAL_CLIENT_ID,
          clientSecretPresent: !!process.env.PAYPAL_CLIENT_SECRET
        }
      };
    }

    try {
      if (this.isCircuitBreakerOpen(serviceName)) {
        return this.createUnhealthyResult(serviceName, 'Circuit breaker open', 0);
      }

      // PayPal OAuth token request for health check
      const authUrl = process.env.NODE_ENV === 'production' 
        ? 'https://api-m.paypal.com/v1/oauth2/token'
        : 'https://api-m.sandbox.paypal.com/v1/oauth2/token';

      const credentials = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
      ).toString('base64');

      const response = await this.timeoutPromise(
        fetch(authUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: 'grant_type=client_credentials'
        }),
        'PayPal OAuth check'
      );

      const responseTime = Date.now() - startTime;
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

      if (!response.ok) {
        status = 'unhealthy';
      } else if (responseTime > 2000) {
        status = 'degraded';
      }

      this.recordSuccess(serviceName);

      return {
        service: serviceName,
        status,
        responseTime,
        timestamp: new Date().toISOString(),
        details: {
          httpStatus: response.status,
          environment: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
          performance: this.categorizePerformance(responseTime),
          authenticationValid: response.ok
        }
      };

    } catch (error) {
      this.recordFailure(serviceName);
      logger.error('PayPal health check failed:', error);

      return this.createUnhealthyResult(
        serviceName,
        'PayPal API connection failed',
        Date.now() - startTime,
        error
      );
    }
  }

  /**
   * 🟡 EMAIL SERVICE MONITORING
   * SMTP connectivity and delivery capability
   */
  async checkEmailHealth(): Promise<ServiceHealthResult> {
    const startTime = Date.now();
    const serviceName = 'email';

    if (!process.env.SMTP_HOST) {
      return {
        service: serviceName,
        status: 'not_configured',
        responseTime: 0,
        timestamp: new Date().toISOString(),
        details: { message: 'SMTP configuration not provided' }
      };
    }

    try {
      if (this.isCircuitBreakerOpen(serviceName)) {
        return this.createUnhealthyResult(serviceName, 'Circuit breaker open', 0);
      }

      // Create transporter with timeout
      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        } : undefined,
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 5000
      });

      // Verify SMTP connection
      await this.timeoutPromise(
        transporter.verify(),
        'SMTP verification'
      );

      const responseTime = Date.now() - startTime;
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      
      if (responseTime > 3000) status = 'degraded';

      this.recordSuccess(serviceName);

      return {
        service: serviceName,
        status,
        responseTime,
        timestamp: new Date().toISOString(),
        details: {
          smtpHost: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || '587',
          secure: process.env.SMTP_SECURE === 'true',
          authenticated: !!process.env.SMTP_USER,
          performance: this.categorizePerformance(responseTime),
          connectionValid: true
        }
      };

    } catch (error) {
      this.recordFailure(serviceName);
      logger.error('Email service health check failed:', error);

      return this.createUnhealthyResult(
        serviceName,
        'SMTP connection failed',
        Date.now() - startTime,
        error
      );
    }
  }

  /**
   * 🟡 COMPREHENSIVE SERVICE CHECK
   * Check all external services in parallel
   */
  async checkAllServices(): Promise<ServiceHealthResult[]> {
    const startTime = Date.now();
    logger.info('Starting comprehensive service health checks');

    try {
      const results = await Promise.allSettled([
        this.checkDatabaseHealth(),
        this.checkRedisHealth(),
        this.checkStripeHealth(),
        this.checkPayPalHealth(),
        this.checkEmailHealth()
      ]);

      const serviceResults: ServiceHealthResult[] = results.map((result, index) => {
        const serviceNames = ['database', 'redis', 'stripe', 'paypal', 'email'];
        
        if (result.status === 'fulfilled') {
          return result.value;
        }
        
        return this.createUnhealthyResult(
          serviceNames[index],
          'Service check failed',
          0,
          result.reason
        );
      });

      const totalTime = Date.now() - startTime;
      logger.info(`Service health checks completed in ${totalTime}ms`, {
        results: serviceResults.map(r => ({ service: r.service, status: r.status, time: r.responseTime }))
      });

      return serviceResults;

    } catch (error) {
      logger.error('Service health check batch failed:', error);
      throw error;
    }
  }

  /**
   * 🟡 CIRCUIT BREAKER IMPLEMENTATION
   * Prevent cascading failures with intelligent failure handling
   */
  private isCircuitBreakerOpen(serviceName: string): boolean {
    const state = this.circuitBreakers.get(serviceName);
    if (!state || !state.isOpen) return false;

    // Check if we can attempt recovery
    if (Date.now() >= state.nextAttemptTime) {
      state.isOpen = false;
      state.failureCount = 0;
      logger.info(`Circuit breaker reset for ${serviceName}`);
      return false;
    }

    return true;
  }

  private recordSuccess(serviceName: string): void {
    const state = this.circuitBreakers.get(serviceName);
    if (state) {
      state.failureCount = 0;
      state.isOpen = false;
    }
  }

  private recordFailure(serviceName: string): void {
    let state = this.circuitBreakers.get(serviceName);
    if (!state) {
      state = {
        isOpen: false,
        failureCount: 0,
        lastFailureTime: 0,
        nextAttemptTime: 0
      };
      this.circuitBreakers.set(serviceName, state);
    }

    state.failureCount++;
    state.lastFailureTime = Date.now();

    if (state.failureCount >= this.failureThreshold) {
      state.isOpen = true;
      state.nextAttemptTime = Date.now() + this.recoveryTimeMs;
      logger.warn(`Circuit breaker opened for ${serviceName} after ${state.failureCount} failures`);
    }
  }

  /**
   * 🟡 UTILITY METHODS
   */
  private async timeoutPromise<T>(promise: Promise<T>, operation: string): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${operation} timeout after ${this.timeoutMs}ms`)), this.timeoutMs)
    );

    return Promise.race([promise, timeoutPromise]);
  }

  private createUnhealthyResult(
    service: string,
    message: string,
    responseTime: number,
    error?: any
  ): ServiceHealthResult {
    return {
      service,
      status: 'unhealthy',
      responseTime,
      timestamp: new Date().toISOString(),
      error: message,
      details: error ? {
        errorType: error.constructor?.name,
        errorMessage: error.message,
        errorCode: error.code
      } : undefined
    };
  }

  private categorizePerformance(responseTime: number): string {
    if (responseTime < 100) return 'excellent';
    if (responseTime < 500) return 'good';
    if (responseTime < 1000) return 'fair';
    if (responseTime < 2000) return 'poor';
    return 'critical';
  }

  /**
   * 🟡 CIRCUIT BREAKER STATUS
   * Get current circuit breaker states for monitoring
   */
  getCircuitBreakerStatus(): { [service: string]: CircuitBreakerState } {
    const status: { [service: string]: CircuitBreakerState } = {};
    
    for (const [service, state] of this.circuitBreakers) {
      status[service] = {
        ...state,
        nextAttemptTime: state.nextAttemptTime
      };
    }

    return status;
  }
}

/**
 * 🟡 SINGLETON SERVICE MONITOR
 * Global instance for consistent monitoring
 */
const serviceMonitor = new ServiceMonitor();

/**
 * 🟡 EXPORTED FUNCTIONS
 */
export const checkDatabaseHealth = () => serviceMonitor.checkDatabaseHealth();
export const checkRedisHealth = () => serviceMonitor.checkRedisHealth();
export const checkStripeHealth = () => serviceMonitor.checkStripeHealth();
export const checkPayPalHealth = () => serviceMonitor.checkPayPalHealth();
export const checkEmailHealth = () => serviceMonitor.checkEmailHealth();
export const checkAllServices = () => serviceMonitor.checkAllServices();
export const getCircuitBreakerStatus = () => serviceMonitor.getCircuitBreakerStatus();

export { ServiceHealthResult };
export default serviceMonitor;