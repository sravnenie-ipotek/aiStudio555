#!/usr/bin/env node

/**
 * 🟡 PERFORMANCE ENGINEER - Load Testing Script
 * Validates API performance and monitoring system under load
 * Tests response times, error handling, and system stability
 */

const http = require('http');
const { performance } = require('perf_hooks');

// Configuration
const config = {
  host: process.env.TEST_HOST || 'localhost',
  port: process.env.TEST_PORT || 4000,
  duration: parseInt(process.env.TEST_DURATION) || 60, // seconds
  concurrency: parseInt(process.env.TEST_CONCURRENCY) || 10,
  rampUpTime: parseInt(process.env.TEST_RAMP_UP) || 10, // seconds
  endpoints: [
    { path: '/health', weight: 0.4 },
    { path: '/health/metrics', weight: 0.2 },
    { path: '/health/status', weight: 0.2 },
    { path: '/api/courses', weight: 0.2 }
  ]
};

// Metrics collection
const metrics = {
  requests: 0,
  responses: 0,
  errors: 0,
  responseTimes: [],
  errorsByCode: {},
  startTime: 0,
  endTime: 0
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
};

/**
 * Make HTTP request and collect metrics
 */
function makeRequest(endpoint) {
  return new Promise((resolve) => {
    const startTime = performance.now();
    
    const options = {
      hostname: config.host,
      port: config.port,
      path: endpoint.path,
      method: 'GET',
      headers: {
        'User-Agent': 'LoadTester/1.0',
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const responseTime = performance.now() - startTime;
        
        metrics.responses++;
        metrics.responseTimes.push(responseTime);
        
        if (res.statusCode >= 400) {
          metrics.errors++;
          metrics.errorsByCode[res.statusCode] = (metrics.errorsByCode[res.statusCode] || 0) + 1;
        }
        
        resolve({
          statusCode: res.statusCode,
          responseTime,
          endpoint: endpoint.path
        });
      });
    });

    req.on('error', (error) => {
      const responseTime = performance.now() - startTime;
      
      metrics.errors++;
      metrics.errorsByCode['CONNECTION_ERROR'] = (metrics.errorsByCode['CONNECTION_ERROR'] || 0) + 1;
      
      resolve({
        statusCode: 0,
        responseTime,
        endpoint: endpoint.path,
        error: error.message
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      metrics.errors++;
      metrics.errorsByCode['TIMEOUT'] = (metrics.errorsByCode['TIMEOUT'] || 0) + 1;
    });

    req.end();
    metrics.requests++;
  });
}

/**
 * Select random endpoint based on weight
 */
function selectEndpoint() {
  const random = Math.random();
  let cumWeight = 0;
  
  for (const endpoint of config.endpoints) {
    cumWeight += endpoint.weight;
    if (random <= cumWeight) {
      return endpoint;
    }
  }
  
  return config.endpoints[0];
}

/**
 * Calculate percentile from sorted array
 */
function calculatePercentile(sortedArray, percentile) {
  if (sortedArray.length === 0) return 0;
  
  const index = percentile * (sortedArray.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;

  if (upper >= sortedArray.length) return sortedArray[sortedArray.length - 1];
  
  return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
}

/**
 * Generate load test report
 */
function generateReport() {
  const duration = (metrics.endTime - metrics.startTime) / 1000;
  const sortedResponseTimes = metrics.responseTimes.sort((a, b) => a - b);
  
  const avgResponseTime = sortedResponseTimes.length > 0 
    ? sortedResponseTimes.reduce((sum, time) => sum + time, 0) / sortedResponseTimes.length 
    : 0;

  const report = {
    summary: {
      duration: Math.round(duration * 100) / 100,
      totalRequests: metrics.requests,
      totalResponses: metrics.responses,
      requestsPerSecond: Math.round((metrics.responses / duration) * 100) / 100,
      errorCount: metrics.errors,
      errorRate: Math.round((metrics.errors / metrics.responses) * 10000) / 100, // 2 decimal places
      successRate: Math.round(((metrics.responses - metrics.errors) / metrics.responses) * 10000) / 100
    },
    performance: {
      avgResponseTime: Math.round(avgResponseTime * 100) / 100,
      minResponseTime: Math.round((sortedResponseTimes[0] || 0) * 100) / 100,
      maxResponseTime: Math.round((sortedResponseTimes[sortedResponseTimes.length - 1] || 0) * 100) / 100,
      p50: Math.round(calculatePercentile(sortedResponseTimes, 0.5) * 100) / 100,
      p95: Math.round(calculatePercentile(sortedResponseTimes, 0.95) * 100) / 100,
      p99: Math.round(calculatePercentile(sortedResponseTimes, 0.99) * 100) / 100
    },
    errors: metrics.errorsByCode
  };

  return report;
}

/**
 * Display colored test results
 */
function displayReport(report) {
  console.log(`\n${colors.bright}🟡 LOAD TEST RESULTS${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}\n`);

  // Summary
  console.log(`${colors.bright}📊 SUMMARY${colors.reset}`);
  console.log(`   Duration: ${colors.yellow}${report.summary.duration}s${colors.reset}`);
  console.log(`   Total Requests: ${colors.cyan}${report.summary.totalRequests}${colors.reset}`);
  console.log(`   Total Responses: ${colors.cyan}${report.summary.totalResponses}${colors.reset}`);
  console.log(`   Requests/sec: ${colors.green}${report.summary.requestsPerSecond}${colors.reset}`);
  console.log(`   Success Rate: ${report.summary.successRate >= 99 ? colors.green : report.summary.successRate >= 95 ? colors.yellow : colors.red}${report.summary.successRate}%${colors.reset}`);
  console.log(`   Error Rate: ${report.summary.errorRate <= 1 ? colors.green : report.summary.errorRate <= 5 ? colors.yellow : colors.red}${report.summary.errorRate}%${colors.reset}\n`);

  // Performance
  console.log(`${colors.bright}⚡ PERFORMANCE${colors.reset}`);
  console.log(`   Average: ${report.performance.avgResponseTime <= 100 ? colors.green : report.performance.avgResponseTime <= 500 ? colors.yellow : colors.red}${report.performance.avgResponseTime}ms${colors.reset}`);
  console.log(`   Min/Max: ${colors.cyan}${report.performance.minResponseTime}ms${colors.reset} / ${colors.cyan}${report.performance.maxResponseTime}ms${colors.reset}`);
  console.log(`   P50: ${report.performance.p50 <= 100 ? colors.green : report.performance.p50 <= 500 ? colors.yellow : colors.red}${report.performance.p50}ms${colors.reset}`);
  console.log(`   P95: ${report.performance.p95 <= 500 ? colors.green : report.performance.p95 <= 1000 ? colors.yellow : colors.red}${report.performance.p95}ms${colors.reset}`);
  console.log(`   P99: ${report.performance.p99 <= 1000 ? colors.green : report.performance.p99 <= 2000 ? colors.yellow : colors.red}${report.performance.p99}ms${colors.reset}\n`);

  // Errors
  if (Object.keys(report.errors).length > 0) {
    console.log(`${colors.bright}❌ ERRORS${colors.reset}`);
    for (const [code, count] of Object.entries(report.errors)) {
      console.log(`   ${code}: ${colors.red}${count}${colors.reset}`);
    }
    console.log('');
  }

  // Performance Assessment
  console.log(`${colors.bright}🎯 ASSESSMENT${colors.reset}`);
  
  let overallScore = 'EXCELLENT';
  let scoreColor = colors.green;
  
  if (report.summary.errorRate > 5 || report.performance.p95 > 1000) {
    overallScore = 'POOR';
    scoreColor = colors.red;
  } else if (report.summary.errorRate > 1 || report.performance.p95 > 500) {
    overallScore = 'FAIR';
    scoreColor = colors.yellow;
  } else if (report.performance.p95 > 200) {
    overallScore = 'GOOD';
    scoreColor = colors.cyan;
  }

  console.log(`   Overall Performance: ${scoreColor}${overallScore}${colors.reset}`);
  
  // Recommendations
  console.log(`\n${colors.bright}💡 RECOMMENDATIONS${colors.reset}`);
  if (report.performance.p95 > 500) {
    console.log(`   ${colors.yellow}⚠️  Consider API optimization - P95 response time is high${colors.reset}`);
  }
  if (report.summary.errorRate > 1) {
    console.log(`   ${colors.red}❌ Investigate error patterns - error rate above target${colors.reset}`);
  }
  if (report.summary.requestsPerSecond < 100) {
    console.log(`   ${colors.yellow}⚠️  Consider scaling - throughput may be insufficient for production${colors.reset}`);
  }
  if (report.performance.avgResponseTime <= 100 && report.summary.errorRate <= 0.1) {
    console.log(`   ${colors.green}✅ System performing excellently - ready for production load${colors.reset}`);
  }
}

/**
 * Worker function to generate load
 */
async function worker(workerId) {
  const endTime = Date.now() + (config.duration * 1000);
  
  while (Date.now() < endTime) {
    const endpoint = selectEndpoint();
    
    try {
      const result = await makeRequest(endpoint);
      
      // Optional: Log slow requests
      if (result.responseTime > 1000) {
        console.log(`${colors.yellow}⚠️  Slow request: ${result.endpoint} - ${Math.round(result.responseTime)}ms${colors.reset}`);
      }
    } catch (error) {
      console.error(`${colors.red}❌ Worker ${workerId} error:${colors.reset}`, error.message);
    }
    
    // Brief pause to prevent overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

/**
 * Main load test function
 */
async function runLoadTest() {
  console.log(`${colors.bright}🟡 Starting Load Test${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}`);
  console.log(`Target: ${colors.yellow}http://${config.host}:${config.port}${colors.reset}`);
  console.log(`Duration: ${colors.cyan}${config.duration}s${colors.reset}`);
  console.log(`Concurrency: ${colors.cyan}${config.concurrency}${colors.reset}`);
  console.log(`Endpoints: ${colors.cyan}${config.endpoints.length}${colors.reset}`);
  
  // Test connectivity first
  console.log(`\n${colors.bright}🔍 Testing connectivity...${colors.reset}`);
  
  try {
    const testResult = await makeRequest({ path: '/health' });
    if (testResult.statusCode !== 200) {
      console.error(`${colors.red}❌ Server not responding correctly (status: ${testResult.statusCode})${colors.reset}`);
      process.exit(1);
    }
    console.log(`${colors.green}✅ Server connectivity confirmed${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}❌ Cannot connect to server:${colors.reset}`, error.message);
    process.exit(1);
  }

  // Reset metrics
  metrics.requests = 0;
  metrics.responses = 0;
  metrics.errors = 0;
  metrics.responseTimes = [];
  metrics.errorsByCode = {};

  console.log(`\n${colors.bright}🚀 Load test starting...${colors.reset}`);
  
  metrics.startTime = performance.now();

  // Start workers with ramp-up
  const workers = [];
  const rampUpDelay = (config.rampUpTime * 1000) / config.concurrency;
  
  for (let i = 0; i < config.concurrency; i++) {
    setTimeout(() => {
      workers.push(worker(i + 1));
    }, i * rampUpDelay);
  }

  // Progress reporting
  const progressInterval = setInterval(() => {
    const elapsed = (performance.now() - metrics.startTime) / 1000;
    const remaining = config.duration - elapsed;
    const progress = Math.min(100, (elapsed / config.duration) * 100);
    
    process.stdout.write(`\r${colors.cyan}Progress: ${Math.round(progress)}% | Requests: ${metrics.responses} | Errors: ${metrics.errors} | Remaining: ${Math.round(remaining)}s${colors.reset}`);
  }, 1000);

  // Wait for test completion
  setTimeout(() => {
    clearInterval(progressInterval);
    metrics.endTime = performance.now();
    
    // Wait a bit more for pending requests
    setTimeout(() => {
      console.log('\n');
      const report = generateReport();
      displayReport(report);
      
      // Exit code based on results
      const exitCode = (report.summary.errorRate > 5 || report.performance.p95 > 2000) ? 1 : 0;
      process.exit(exitCode);
    }, 2000);
  }, config.duration * 1000);
}

// Handle script interruption
process.on('SIGINT', () => {
  console.log(`\n\n${colors.yellow}⚠️  Load test interrupted${colors.reset}`);
  if (metrics.startTime > 0) {
    metrics.endTime = performance.now();
    const report = generateReport();
    displayReport(report);
  }
  process.exit(0);
});

// Start the load test
if (require.main === module) {
  runLoadTest().catch(error => {
    console.error(`${colors.red}❌ Load test failed:${colors.reset}`, error);
    process.exit(1);
  });
}

module.exports = { runLoadTest, config, metrics };