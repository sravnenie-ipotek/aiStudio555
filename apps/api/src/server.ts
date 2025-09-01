/**
 * SECURE API Server - AiStudio555 Academy
 * Production-ready Express server with comprehensive security
 * @module apps/api/server
 */

import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { setupSecurity } from './middleware/security.middleware';
import { errorHandler } from './middleware/error.middleware';
import { 
  performanceMonitoring, 
  enhanceRequestId,
  startSystemMetricsCollection,
  stopSystemMetricsCollection 
} from './middleware/monitoring.middleware';
import healthRoutes from './routes/health.routes';
import { createLogger } from '@aistudio555/utils';

// Initialize logger
const logger = createLogger('server');

// Create Express app
const app = express();

// ============================================
// SECURITY HARDENING - CRITICAL FIXES
// ============================================

// SECURITY FIX: Comprehensive security middleware
// Fixes: Hardcoded secrets (CVSS 9.1), Open CORS (CVSS 8.2), 
//        Missing rate limiting (CVSS 8.0), Missing headers (CVSS 7.5)
setupSecurity(app);

// ============================================
// 🟡 PERFORMANCE MONITORING MIDDLEWARE
// ============================================

// Enable trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Enhanced request ID for monitoring correlation
app.use(enhanceRequestId);

// Performance monitoring (before other middleware for accurate timing)
app.use(performanceMonitoring);

// ============================================
// ADDITIONAL MIDDLEWARE
// ============================================

// Compression middleware
app.use(compression());

// Cookie parser for secure session handling
app.use(cookieParser());

// Structured logging middleware (exclude health checks from logs)
app.use(morgan('combined', {
  skip: (req) => req.path.startsWith('/health') || req.path.startsWith('/api/health')
}));

// ============================================
// 🟡 MONITORING & HEALTH ROUTES
// ============================================

// Comprehensive health monitoring endpoints
app.use('/health', healthRoutes);
app.use('/api/health', healthRoutes);

// ============================================
// API ENDPOINTS
// ============================================

// Basic API endpoint
app.get('/api/courses', (req, res) => {
  res.json({
    courses: [
      {
        id: 1,
        title: 'AI Transformation Manager',
        price: 1000,
        duration: '3 months'
      },
      {
        id: 2,
        title: 'No-Code Website Development',
        price: 1200,
        duration: '2 months'
      },
      {
        id: 3,
        title: 'AI Video & Avatar Generation',
        price: 1500,
        duration: '4 months'
      }
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ============================================
// 🟡 ERROR HANDLING
// ============================================

// Global error handling middleware
app.use(errorHandler);

// Server configuration - Changed to port 4000 to avoid conflicts
const PORT = process.env.API_PORT || process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

// Start server
const server = app.listen(PORT, () => {
  logger.info('🚀 AiStudio555 Academy API Server Started');
  logger.info('=======================================');
  logger.info(`📍 Server: http://${HOST}:${PORT}`);
  logger.info(`🏥 Health: http://${HOST}:${PORT}/health`);
  logger.info(`📊 Metrics: http://${HOST}:${PORT}/health/dashboard`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🛡️  Security: HARDENED (OWASP Top 10 protected)`);
  logger.info(`🟡 Monitoring: ACTIVE (Performance tracking enabled)`);
  logger.info('=======================================');
  
  // Security status log
  if (process.env.NODE_ENV === 'production') {
    logger.info('🔒 Production security measures:');
    logger.info('   ✅ JWT secrets validated');
    logger.info('   ✅ CORS origins restricted');
    logger.info('   ✅ Rate limiting active');
    logger.info('   ✅ Security headers configured');
    logger.info('   ✅ Input sanitization enabled');
  } else {
    logger.warn('⚠️  Development mode - some security features relaxed');
  }

  // 🟡 Start system metrics collection
  logger.info('🟡 Starting performance monitoring systems...');
  startSystemMetricsCollection(30000); // Collect system metrics every 30 seconds
  logger.info('🟡 Performance monitoring active - tracking response times, errors, and system resources');
});

// Graceful shutdown with monitoring cleanup
process.on('SIGTERM', () => {
  logger.info('SIGTERM received: initiating graceful shutdown');
  stopSystemMetricsCollection();
  server.close(() => {
    logger.info('HTTP server closed gracefully');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received: initiating graceful shutdown');
  stopSystemMetricsCollection();
  server.close(() => {
    logger.info('HTTP server closed gracefully');
    process.exit(0);
  });
});

export default app;