#!/usr/bin/env node
/**
 * Health Monitoring Script for Projectdes AI Academy
 * ===================================================
 * 
 * Continuously monitors application health and sends alerts
 */

const http = require('http');
const https = require('https');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  checks: {
    api: {
      url: 'http://localhost:5000/health',
      timeout: 5000,
      interval: 30000, // 30 seconds
      retries: 3,
    },
    web: {
      url: 'http://localhost:3000/health',
      timeout: 5000,
      interval: 30000,
      retries: 3,
    },
    database: {
      command: 'psql $DATABASE_URL -c "SELECT 1" > /dev/null',
      timeout: 5000,
      interval: 60000, // 1 minute
      retries: 2,
    },
    redis: {
      command: 'redis-cli -a $REDIS_PASSWORD ping > /dev/null',
      timeout: 3000,
      interval: 30000,
      retries: 2,
    },
    disk: {
      path: '/',
      threshold: 90, // percentage
      interval: 300000, // 5 minutes
    },
    memory: {
      threshold: 90, // percentage
      interval: 60000, // 1 minute
    },
    cpu: {
      threshold: 80, // percentage
      interval: 60000, // 1 minute
    },
  },
  alerts: {
    slack: process.env.SLACK_WEBHOOK || '',
    email: process.env.ALERT_EMAIL || '',
    sms: process.env.ALERT_SMS || '',
  },
  log: {
    file: '/var/log/projectdes-academy/monitor.log',
    level: process.env.LOG_LEVEL || 'info',
  },
};

// State tracking
const state = {
  failures: {},
  lastAlert: {},
  metrics: {
    uptime: Date.now(),
    checks: 0,
    failures: 0,
    alerts: 0,
  },
};

// Logging
function log(level, message, data = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...data,
  };
  
  console.log(JSON.stringify(logEntry));
  
  // Write to file
  if (CONFIG.log.file) {
    fs.appendFileSync(
      CONFIG.log.file,
      JSON.stringify(logEntry) + '\n',
      'utf8'
    );
  }
}

// Alert sending
async function sendAlert(service, status, message) {
  const alertKey = `${service}-${status}`;
  const now = Date.now();
  
  // Rate limit alerts (1 per hour per service)
  if (state.lastAlert[alertKey] && now - state.lastAlert[alertKey] < 3600000) {
    return;
  }
  
  state.lastAlert[alertKey] = now;
  state.metrics.alerts++;
  
  const alert = {
    service,
    status,
    message,
    timestamp: new Date().toISOString(),
    hostname: require('os').hostname(),
  };
  
  // Send to Slack
  if (CONFIG.alerts.slack) {
    try {
      const color = status === 'down' ? 'danger' : 'warning';
      await sendSlackAlert(alert, color);
    } catch (error) {
      log('error', 'Failed to send Slack alert', { error: error.message });
    }
  }
  
  // Send email (implement based on your email service)
  if (CONFIG.alerts.email) {
    // await sendEmailAlert(alert);
  }
  
  log('alert', `Alert sent for ${service}`, alert);
}

// Slack notification
function sendSlackAlert(alert, color) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      attachments: [{
        color,
        title: `🚨 ${alert.service} is ${alert.status}`,
        text: alert.message,
        fields: [
          { title: 'Service', value: alert.service, short: true },
          { title: 'Status', value: alert.status, short: true },
          { title: 'Server', value: alert.hostname, short: true },
          { title: 'Time', value: alert.timestamp, short: true },
        ],
      }],
    });
    
    const url = new URL(CONFIG.alerts.slack);
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };
    
    const req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve();
      } else {
        reject(new Error(`Slack API returned ${res.statusCode}`));
      }
    });
    
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// HTTP health check
function checkHttp(name, config) {
  return new Promise((resolve) => {
    const url = new URL(config.url);
    const module = url.protocol === 'https:' ? https : http;
    
    const req = module.get(config.url, { timeout: config.timeout }, (res) => {
      if (res.statusCode === 200) {
        resolve({ success: true, responseTime: Date.now() - startTime });
      } else {
        resolve({ 
          success: false, 
          error: `HTTP ${res.statusCode}`,
          responseTime: Date.now() - startTime 
        });
      }
    });
    
    const startTime = Date.now();
    
    req.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

// Command health check
function checkCommand(name, config) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    exec(config.command, { timeout: config.timeout }, (error, stdout, stderr) => {
      if (error) {
        resolve({ success: false, error: error.message });
      } else {
        resolve({ success: true, responseTime: Date.now() - startTime });
      }
    });
  });
}

// Disk usage check
function checkDisk(name, config) {
  return new Promise((resolve) => {
    exec(`df -h ${config.path} | tail -1 | awk '{print $5}' | sed 's/%//'`, (error, stdout) => {
      if (error) {
        resolve({ success: false, error: error.message });
      } else {
        const usage = parseInt(stdout.trim());
        if (usage > config.threshold) {
          resolve({ 
            success: false, 
            error: `Disk usage ${usage}% exceeds threshold ${config.threshold}%` 
          });
        } else {
          resolve({ success: true, usage });
        }
      }
    });
  });
}

// Memory usage check
function checkMemory(name, config) {
  return new Promise((resolve) => {
    exec("free | grep Mem | awk '{print ($3/$2) * 100}'", (error, stdout) => {
      if (error) {
        resolve({ success: false, error: error.message });
      } else {
        const usage = parseFloat(stdout.trim());
        if (usage > config.threshold) {
          resolve({ 
            success: false, 
            error: `Memory usage ${usage.toFixed(1)}% exceeds threshold ${config.threshold}%` 
          });
        } else {
          resolve({ success: true, usage });
        }
      }
    });
  });
}

// CPU usage check
function checkCpu(name, config) {
  return new Promise((resolve) => {
    exec("top -bn1 | grep 'Cpu(s)' | awk '{print $2}' | cut -d'%' -f1", (error, stdout) => {
      if (error) {
        resolve({ success: false, error: error.message });
      } else {
        const usage = parseFloat(stdout.trim());
        if (usage > config.threshold) {
          resolve({ 
            success: false, 
            error: `CPU usage ${usage.toFixed(1)}% exceeds threshold ${config.threshold}%` 
          });
        } else {
          resolve({ success: true, usage });
        }
      }
    });
  });
}

// Main check function
async function performCheck(name, config) {
  let result;
  
  state.metrics.checks++;
  
  // Determine check type
  if (config.url) {
    result = await checkHttp(name, config);
  } else if (config.command) {
    result = await checkCommand(name, config);
  } else if (config.path) {
    result = await checkDisk(name, config);
  } else if (name === 'memory') {
    result = await checkMemory(name, config);
  } else if (name === 'cpu') {
    result = await checkCpu(name, config);
  }
  
  // Handle result
  if (result.success) {
    // Service recovered
    if (state.failures[name] > 0) {
      log('info', `${name} recovered`, result);
      await sendAlert(name, 'recovered', `${name} is back online`);
    }
    state.failures[name] = 0;
  } else {
    // Service failed
    state.failures[name] = (state.failures[name] || 0) + 1;
    state.metrics.failures++;
    
    log('error', `${name} check failed`, result);
    
    // Send alert after retries exceeded
    if (state.failures[name] >= (config.retries || 1)) {
      await sendAlert(name, 'down', result.error);
    }
  }
  
  return result;
}

// Schedule checks
function scheduleChecks() {
  Object.entries(CONFIG.checks).forEach(([name, config]) => {
    // Initial check
    performCheck(name, config);
    
    // Schedule recurring checks
    setInterval(() => {
      performCheck(name, config);
    }, config.interval);
  });
}

// Metrics endpoint
function startMetricsServer() {
  const server = http.createServer((req, res) => {
    if (req.url === '/metrics') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        ...state.metrics,
        uptime: Date.now() - state.metrics.uptime,
        services: Object.keys(state.failures).reduce((acc, key) => {
          acc[key] = state.failures[key] === 0 ? 'up' : 'down';
          return acc;
        }, {}),
      }));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });
  
  server.listen(9091, '127.0.0.1', () => {
    log('info', 'Metrics server started on port 9091');
  });
}

// Graceful shutdown
function shutdown() {
  log('info', 'Shutting down monitor...');
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start monitoring
log('info', 'Starting health monitor...');
scheduleChecks();
startMetricsServer();

// Keep process alive
process.stdin.resume();