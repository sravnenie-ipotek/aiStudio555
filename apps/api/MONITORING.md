# 🟡 Performance Monitoring & Health Check System

Production-ready monitoring infrastructure for AiStudio555 Academy API with sub-100ms health checks, comprehensive service monitoring, and performance analytics.

## Overview

The monitoring system provides:
- **Real-time Performance Tracking**: Sub-100ms health checks with comprehensive metrics
- **Service Health Monitoring**: Database, Redis, Stripe, PayPal, and email service validation
- **Performance Analytics**: Response time tracking, error rate monitoring, resource utilization
- **Circuit Breaker Protection**: Automatic failure detection and recovery
- **Dashboard Integration**: Complete metrics for operational visibility

## Health Check Endpoints

### Primary Health Check
```
GET /health
GET /health/
```

**Response Time Target**: <100ms
**Response Format**:
```json
{
  "status": "healthy|degraded|unhealthy",
  "timestamp": "2024-09-01T16:00:00.000Z",
  "responseTime": 45,
  "checks": {
    "database": {
      "status": "healthy",
      "responseTime": 25,
      "message": "Database connected (25ms)"
    },
    "redis": { "status": "healthy", "responseTime": 12, "message": "Redis connected (12ms)" },
    "stripe": { "status": "healthy", "responseTime": 234, "message": "Stripe API connected (234ms)" },
    "paypal": { "status": "healthy", "responseTime": 0, "message": "PayPal configured" },
    "email": { "status": "healthy", "responseTime": 0, "message": "Email service configured" },
    "system": {
      "status": "healthy",
      "memory": { "used": "45MB", "free": "83MB", "percentage": 35 },
      "cpu": { "load": [0.5, 0.3, 0.2], "percentage": 0 },
      "connections": { "database": 0, "redis": 0 },
      "uptime": 3600
    }
  },
  "summary": {
    "healthy": 6,
    "total": 6,
    "uptime": 3600
  }
}
```

### Kubernetes Probes
```
GET /health/ready    # Readiness probe
GET /health/live     # Liveness probe
```

### Detailed Health Check
```
GET /health/detailed
```
Comprehensive diagnostics with full service validation and performance metrics.

## Performance Monitoring Endpoints

### Dashboard Metrics
```
GET /health/dashboard
```

Complete metrics package for monitoring dashboard:
```json
{
  "service": "aistudio555-academy-api",
  "version": "1.0.0",
  "environment": "production",
  "timestamp": "2024-09-01T16:00:00.000Z",
  "uptime": 3600,
  "requests": {
    "count": 1250,
    "avgResponseTime": 145,
    "p50": 120,
    "p95": 340,
    "p99": 650,
    "errorRate": 2.4,
    "requestsPerMinute": 4.2,
    "timeWindow": 300000
  },
  "errors": {
    "totalErrors": 30,
    "errorBreakdown": {
      "400": 15,
      "404": 8,
      "500": 7
    },
    "timeWindow": 300000
  },
  "system": {
    "avgMemoryUsage": 128,
    "peakMemoryUsage": 156,
    "currentMemoryUsage": 132,
    "timeWindow": 300000
  },
  "routes": [
    {
      "method": "GET",
      "path": "/api/courses",
      "count": 450,
      "avgResponseTime": 89,
      "errorRate": 1.2,
      "p95": 180
    }
  ],
  "alerts": [
    {
      "level": "warning",
      "type": "performance",
      "message": "High response time: P95 is 1200ms",
      "threshold": 1000,
      "current": 1200
    }
  ]
}
```

### Request Statistics
```
GET /health/metrics/requests?window=300000&route=GET:/api/courses
```

### Error Statistics
```
GET /health/metrics/errors?window=300000
```

### Performance Budget Validation
```
GET /health/budget
```

Performance budget compliance check:
```json
{
  "timestamp": "2024-09-01T16:00:00.000Z",
  "performanceBudget": {
    "maxResponseTime": 1000,
    "maxErrorRate": 5,
    "maxMemoryUsage": 512
  },
  "validation": {
    "withinBudget": true,
    "violations": [],
    "recommendations": [
      "P95 approaching budget threshold: 850ms/1000ms"
    ]
  }
}
```

## System Monitoring Endpoints

### System Status
```
GET /health/status
```

High-level system overview for operations teams.

### System Resources
```
GET /health/system
```

Detailed system resource monitoring:
```json
{
  "timestamp": "2024-09-01T16:00:00.000Z",
  "process": {
    "pid": 12345,
    "uptime": 3600,
    "version": "v18.18.0",
    "platform": "linux",
    "arch": "x64"
  },
  "memory": {
    "rss": "134.5 MB",
    "heapTotal": "89.2 MB",
    "heapUsed": "67.8 MB",
    "external": "12.4 MB"
  },
  "cpu": {
    "user": 125000,
    "system": 45000
  }
}
```

### Configuration Status
```
GET /health/config
```

Non-sensitive configuration validation.

## Alert System

### Alert Endpoints
```
GET /health/alerts
```

Current system alerts with thresholds:
```json
{
  "timestamp": "2024-09-01T16:00:00.000Z",
  "alerts": [
    {
      "level": "warning",
      "type": "performance",
      "message": "High response time: P95 is 1200ms",
      "threshold": 1000,
      "current": 1200
    }
  ],
  "thresholds": {
    "responseTime": { "warning": 1000, "critical": 2000 },
    "errorRate": { "warning": 5, "critical": 10 },
    "memoryUsage": { "warning": 512, "critical": 768 }
  }
}
```

### Alert Levels

#### ⚠️ Warning (Level 1)
- **Response Time**: P95 > 1000ms
- **Error Rate**: >5%
- **Memory Usage**: >512MB
- **Action**: Monitor closely, consider optimization

#### 🚨 Critical (Level 2)
- **Response Time**: P95 > 2000ms
- **Error Rate**: >10%
- **Memory Usage**: >768MB
- **Action**: Immediate investigation required

#### ❌ Emergency (Level 3)
- **Service Unavailable**: Multiple service failures
- **Database Disconnected**: Primary database unreachable
- **Memory Critical**: >90% memory usage
- **Action**: Emergency response, possible service restart

## Performance Budgets

### Response Time Budget
- **Target**: <500ms average, <1000ms P95
- **Critical**: >2000ms P95
- **Monitoring**: Continuous with 5-minute sliding window

### Error Rate Budget
- **Target**: <1% error rate
- **Warning**: >5% error rate
- **Critical**: >10% error rate

### Resource Budget
- **Memory**: <512MB normal, <768MB warning, <1GB critical
- **CPU**: <70% sustained usage
- **Database Connections**: <80% of pool limit

### Availability Budget
- **Target**: 99.9% uptime (8.7 hours downtime/year)
- **Monitoring**: Continuous health check validation
- **SLA**: 99.5% minimum (43.8 hours downtime/year)

## Integration Guidelines

### Load Balancer Health Checks
```bash
# Use primary health endpoint
curl -f http://api.example.com/health || exit 1
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aistudio555-api
spec:
  template:
    spec:
      containers:
      - name: api
        image: aistudio555/api:latest
        ports:
        - containerPort: 4000
        livenessProbe:
          httpGet:
            path: /health/live
            port: 4000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 4000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Monitoring Tools Integration

#### Prometheus Metrics
The system exposes metrics compatible with Prometheus scraping:
```
# HELP api_request_duration_seconds Request duration in seconds
# TYPE api_request_duration_seconds histogram
api_request_duration_seconds_bucket{method="GET",route="/api/courses",le="0.1"} 450
api_request_duration_seconds_bucket{method="GET",route="/api/courses",le="0.5"} 890
api_request_duration_seconds_bucket{method="GET",route="/api/courses",le="1.0"} 990
api_request_duration_seconds_count{method="GET",route="/api/courses"} 1000
api_request_duration_seconds_sum{method="GET",route="/api/courses"} 123.45
```

#### Grafana Dashboard
Import dashboard configuration from `/health/dashboard` endpoint for real-time visualization.

#### Alertmanager Rules
```yaml
groups:
  - name: aistudio555-api
    rules:
      - alert: HighResponseTime
        expr: api_request_duration_seconds{quantile="0.95"} > 1.0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High API response time"
          description: "P95 response time is {{ $value }}s"
      
      - alert: HighErrorRate
        expr: rate(api_requests_total{status=~"5.."}[5m]) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }}%"
```

## Circuit Breaker System

### Circuit Breaker Configuration
- **Failure Threshold**: 5 consecutive failures
- **Timeout**: 10 seconds per request
- **Recovery Time**: 60 seconds
- **Half-Open Testing**: Automatic recovery attempts

### Circuit Breaker Status
```
GET /health/detailed
```

Check `circuitBreaker` status in response for each service.

## Performance Optimization Recommendations

### Database Optimization
- Connection pooling: Max 25 connections
- Query timeout: 5 seconds
- Index optimization for frequent queries
- Read replica for read-heavy operations

### API Optimization
- Response compression enabled
- Request/response caching with Redis
- Rate limiting: 1000 requests/15 minutes
- Connection keep-alive enabled

### Memory Management
- Heap size monitoring
- Garbage collection optimization
- Memory leak detection
- Process restart at 80% memory usage

### Security Integration
- All monitoring endpoints respect security middleware
- Rate limiting applies to monitoring endpoints
- Authentication required for detailed diagnostics in production
- No sensitive information exposed in monitoring responses

## Deployment Checklist

### Pre-Production
- [ ] All environment variables configured
- [ ] Database connectivity validated
- [ ] External service credentials tested
- [ ] Performance benchmarks established
- [ ] Alert thresholds configured

### Production Deployment
- [ ] Health check endpoints responding <100ms
- [ ] Load balancer health checks configured
- [ ] Monitoring dashboard integrated
- [ ] Alert notifications configured
- [ ] Circuit breakers functional
- [ ] Performance budget compliance verified

### Post-Deployment
- [ ] Monitor performance metrics for 24 hours
- [ ] Validate alert system functionality
- [ ] Confirm service health check accuracy
- [ ] Review error rates and response times
- [ ] Document any performance anomalies

## Troubleshooting Guide

### High Response Times
1. Check `/health/metrics/requests` for slow endpoints
2. Review database query performance
3. Validate external service response times
4. Check system resource utilization

### High Error Rates
1. Review `/health/metrics/errors` for error breakdown
2. Check application logs for error patterns
3. Validate external service connectivity
4. Review recent deployments for changes

### Memory Issues
1. Check `/health/system` for memory utilization
2. Review garbage collection metrics
3. Look for memory leaks in application code
4. Consider increasing memory allocation

### Service Degradation
1. Check circuit breaker status in `/health/detailed`
2. Validate external service connectivity
3. Review service-specific error rates
4. Consider failover to backup services

This monitoring system provides comprehensive operational visibility with minimal performance overhead, ensuring reliable service delivery and proactive issue detection.