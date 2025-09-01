/**
 * 🟡 PERFORMANCE ENGINEER - Health Check Tests
 * Validates health monitoring endpoints and performance requirements
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/server';

const API_BASE = '';

describe('🟡 Health Monitoring System', () => {
  let server: any;

  beforeAll(async () => {
    // Start server for testing
    server = app.listen(0); // Use random available port
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for startup
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  describe('Basic Health Checks', () => {
    it('should respond to /health with <100ms', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(100);
      
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('responseTime');
      expect(response.body).toHaveProperty('checks');
      expect(response.body).toHaveProperty('summary');
      
      // Validate response structure
      expect(['healthy', 'degraded', 'unhealthy']).toContain(response.body.status);
      expect(response.body.checks).toHaveProperty('database');
      expect(response.body.checks).toHaveProperty('system');
    });

    it('should respond to /health/ready for readiness probe', async () => {
      const response = await request(app)
        .get('/health/ready')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'ready');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should respond to /health/live for liveness probe', async () => {
      const response = await request(app)
        .get('/health/live')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'alive');
      expect(response.body).toHaveProperty('uptime');
    });

    it('should respond to legacy health check', async () => {
      const response = await request(app)
        .get('/health/')
        .expect(200);
      
      expect(response.body).toHaveProperty('status');
    });
  });

  describe('Detailed Health Diagnostics', () => {
    it('should provide detailed health information', async () => {
      const response = await request(app)
        .get('/health/detailed')
        .expect(200);
      
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('service', 'aistudio555-academy-api');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('checks');
      expect(response.body).toHaveProperty('performance');
      
      // Validate comprehensive checks
      const checks = response.body.checks;
      expect(checks).toHaveProperty('database');
      expect(checks).toHaveProperty('system');
      
      if (checks.redis) {
        expect(checks.redis).toHaveProperty('status');
      }
    });

    it('should provide system resource information', async () => {
      const response = await request(app)
        .get('/health/system')
        .expect(200);
      
      expect(response.body).toHaveProperty('process');
      expect(response.body).toHaveProperty('memory');
      expect(response.body).toHaveProperty('cpu');
      
      expect(response.body.process).toHaveProperty('pid');
      expect(response.body.process).toHaveProperty('uptime');
      expect(response.body.process).toHaveProperty('version');
      
      expect(response.body.memory).toHaveProperty('heapUsed');
      expect(response.body.memory).toHaveProperty('heapTotal');
    });

    it('should provide configuration status', async () => {
      const response = await request(app)
        .get('/health/config')
        .expect(200);
      
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('features');
      expect(response.body).toHaveProperty('security');
      expect(response.body).toHaveProperty('monitoring');
      
      // Security features should be enabled
      expect(response.body.security).toHaveProperty('cors', 'enabled');
      expect(response.body.security).toHaveProperty('helmet', 'enabled');
      expect(response.body.security).toHaveProperty('rateLimiting', 'enabled');
    });
  });

  describe('Performance Metrics', () => {
    it('should provide request metrics', async () => {
      const response = await request(app)
        .get('/health/metrics/requests')
        .expect(200);
      
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('stats');
      
      const stats = response.body.stats;
      expect(stats).toHaveProperty('count');
      expect(stats).toHaveProperty('avgResponseTime');
      expect(stats).toHaveProperty('p50');
      expect(stats).toHaveProperty('p95');
      expect(stats).toHaveProperty('p99');
      expect(stats).toHaveProperty('errorRate');
      expect(stats).toHaveProperty('requestsPerMinute');
    });

    it('should provide error metrics', async () => {
      const response = await request(app)
        .get('/health/metrics/errors')
        .expect(200);
      
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('errors');
      
      const errors = response.body.errors;
      expect(errors).toHaveProperty('totalErrors');
      expect(errors).toHaveProperty('errorBreakdown');
      expect(errors).toHaveProperty('timeWindow');
    });

    it('should provide dashboard metrics', async () => {
      const response = await request(app)
        .get('/health/dashboard')
        .expect(200);
      
      expect(response.body).toHaveProperty('service', 'aistudio555-academy-api');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('requests');
      expect(response.body).toHaveProperty('errors');
      expect(response.body).toHaveProperty('system');
      expect(response.body).toHaveProperty('routes');
      expect(response.body).toHaveProperty('alerts');
    });

    it('should validate performance budget', async () => {
      const response = await request(app)
        .get('/health/budget')
        .expect(200);
      
      expect(response.body).toHaveProperty('performanceBudget');
      expect(response.body).toHaveProperty('validation');
      
      const budget = response.body.performanceBudget;
      expect(budget).toHaveProperty('maxResponseTime', 1000);
      expect(budget).toHaveProperty('maxErrorRate', 5);
      expect(budget).toHaveProperty('maxMemoryUsage', 512);
      
      const validation = response.body.validation;
      expect(validation).toHaveProperty('withinBudget');
      expect(validation).toHaveProperty('violations');
      expect(validation).toHaveProperty('recommendations');
      
      expect(Array.isArray(validation.violations)).toBe(true);
      expect(Array.isArray(validation.recommendations)).toBe(true);
    });
  });

  describe('Monitoring System Status', () => {
    it('should provide system status overview', async () => {
      const response = await request(app)
        .get('/health/status')
        .expect(200);
      
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('service', 'aistudio555-academy-api');
      expect(response.body).toHaveProperty('performance');
      expect(response.body).toHaveProperty('resources');
      expect(response.body).toHaveProperty('errors');
      
      // Status should be valid
      expect(['healthy', 'degraded', 'unhealthy']).toContain(response.body.status);
      
      // Performance metrics should be present
      const performance = response.body.performance;
      expect(performance).toHaveProperty('requestCount');
      expect(performance).toHaveProperty('avgResponseTime');
      expect(performance).toHaveProperty('p95ResponseTime');
      expect(performance).toHaveProperty('errorRate');
      expect(performance).toHaveProperty('requestsPerMinute');
      
      // Resource metrics should be present
      const resources = response.body.resources;
      expect(resources).toHaveProperty('memoryUsage');
      expect(resources).toHaveProperty('memoryTotal');
      expect(resources).toHaveProperty('memoryPercentage');
    });

    it('should provide alerts information', async () => {
      const response = await request(app)
        .get('/health/alerts')
        .expect(200);
      
      expect(response.body).toHaveProperty('alerts');
      expect(response.body).toHaveProperty('thresholds');
      
      expect(Array.isArray(response.body.alerts)).toBe(true);
      
      const thresholds = response.body.thresholds;
      expect(thresholds).toHaveProperty('responseTime');
      expect(thresholds).toHaveProperty('errorRate');
      expect(thresholds).toHaveProperty('memoryUsage');
      
      expect(thresholds.responseTime).toHaveProperty('warning');
      expect(thresholds.responseTime).toHaveProperty('critical');
    });
  });

  describe('Performance Requirements', () => {
    it('should maintain response time budget for health checks', async () => {
      const iterations = 10;
      const responseTimes: number[] = [];
      
      for (let i = 0; i < iterations; i++) {
        const startTime = Date.now();
        
        await request(app)
          .get('/health')
          .expect(200);
        
        const responseTime = Date.now() - startTime;
        responseTimes.push(responseTime);
      }
      
      // Calculate statistics
      const avgResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
      const maxResponseTime = Math.max(...responseTimes);
      const p95ResponseTime = responseTimes.sort((a, b) => a - b)[Math.floor(responseTimes.length * 0.95)];
      
      // Performance assertions
      expect(avgResponseTime).toBeLessThan(50); // Average < 50ms
      expect(maxResponseTime).toBeLessThan(100); // Max < 100ms
      expect(p95ResponseTime).toBeLessThan(75); // P95 < 75ms
      
      console.log(`🟡 Health Check Performance:
        Average: ${Math.round(avgResponseTime)}ms
        Max: ${maxResponseTime}ms  
        P95: ${p95ResponseTime}ms`);
    });

    it('should handle concurrent requests efficiently', async () => {
      const concurrentRequests = 20;
      const startTime = Date.now();
      
      const promises = Array.from({ length: concurrentRequests }, () =>
        request(app)
          .get('/health')
          .expect(200)
      );
      
      const responses = await Promise.all(promises);
      const totalTime = Date.now() - startTime;
      
      // All requests should succeed
      expect(responses).toHaveLength(concurrentRequests);
      responses.forEach(response => {
        expect(response.body).toHaveProperty('status');
      });
      
      // Should handle concurrent load efficiently
      const avgTimePerRequest = totalTime / concurrentRequests;
      expect(avgTimePerRequest).toBeLessThan(50); // < 50ms per request on average
      
      console.log(`🟡 Concurrent Load Test:
        Requests: ${concurrentRequests}
        Total Time: ${totalTime}ms
        Avg per Request: ${Math.round(avgTimePerRequest)}ms`);
    });

    it('should maintain system stability under load', async () => {
      // Generate some load to test system metrics
      const loadRequests = 50;
      const promises: Promise<any>[] = [];
      
      for (let i = 0; i < loadRequests; i++) {
        promises.push(
          request(app)
            .get(i % 2 === 0 ? '/health' : '/health/metrics')
            .expect(200)
        );
        
        // Stagger requests slightly
        if (i % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }
      
      await Promise.all(promises);
      
      // Check system health after load
      const response = await request(app)
        .get('/health/system')
        .expect(200);
      
      // System should still be responsive
      expect(response.body).toHaveProperty('memory');
      expect(response.body).toHaveProperty('process');
      
      // Memory usage should be reasonable (adjust based on your environment)
      const memoryMB = parseInt(response.body.memory.heapUsed.split(' ')[0]);
      expect(memoryMB).toBeLessThan(200); // < 200MB for test environment
      
      console.log(`🟡 System Health After Load:
        Memory Used: ${response.body.memory.heapUsed}
        Uptime: ${response.body.process.uptime}s`);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid endpoints gracefully', async () => {
      const response = await request(app)
        .get('/health/nonexistent')
        .expect(404);
      
      expect(response.body).toHaveProperty('error', 'Not found');
    });

    it('should provide structured error responses', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);
      
      expect(response.body).toHaveProperty('error');
    });
  });
});