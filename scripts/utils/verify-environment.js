#!/usr/bin/env node

/**
 * Environment Verification Script
 * Checks all required tools and services for Projectdes Academy
 * Run with: node scripts/verify-environment.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Icons for status
const icons = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
  check: '✓',
  cross: '✗',
  arrow: '➤',
};

// Verification results
const results = {
  tools: [],
  services: [],
  env: [],
  files: [],
  ports: [],
  system: {},
};

// Helper functions
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logHeader(title) {
  console.log('');
  log('═'.repeat(50), colors.cyan);
  log(`  ${title}`, colors.cyan + colors.bright);
  log('═'.repeat(50), colors.cyan);
}

function execCommand(command) {
  try {
    return execSync(command, { encoding: 'utf-8' }).trim();
  } catch (error) {
    return null;
  }
}

function checkCommand(command) {
  try {
    execSync(`which ${command}`, { encoding: 'utf-8' });
    return true;
  } catch {
    return false;
  }
}

function formatBytes(bytes) {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
}

// ============================================
// 1. CHECK DEVELOPMENT TOOLS
// ============================================
function checkTools() {
  logHeader('Development Tools');

  const tools = [
    {
      name: 'Node.js',
      command: 'node',
      versionCmd: 'node --version',
      required: true,
      expectedVersion: 'v20',
    },
    {
      name: 'npm',
      command: 'npm',
      versionCmd: 'npm --version',
      required: true,
      expectedVersion: '10',
    },
    {
      name: 'pnpm',
      command: 'pnpm',
      versionCmd: 'pnpm --version',
      required: true,
      expectedVersion: '9',
    },
    {
      name: 'Docker',
      command: 'docker',
      versionCmd: 'docker --version',
      required: true,
    },
    {
      name: 'Docker Compose',
      command: 'docker-compose',
      versionCmd: 'docker-compose --version',
      required: true,
    },
    {
      name: 'Git',
      command: 'git',
      versionCmd: 'git --version',
      required: true,
    },
    {
      name: 'PostgreSQL Client',
      command: 'psql',
      versionCmd: 'psql --version',
      required: false,
    },
    {
      name: 'PM2',
      command: 'pm2',
      versionCmd: 'pm2 --version',
      required: false,
    },
    {
      name: 'Stripe CLI',
      command: 'stripe',
      versionCmd: 'stripe --version',
      required: false,
    },
    {
      name: 'VS Code',
      command: 'code',
      versionCmd: 'code --version',
      required: false,
    },
  ];

  tools.forEach(tool => {
    const exists = checkCommand(tool.command);
    let status = icons.cross;
    let color = colors.red;
    let version = 'Not installed';

    if (exists) {
      version = execCommand(tool.versionCmd) || 'Unknown version';

      if (tool.expectedVersion && !version.includes(tool.expectedVersion)) {
        status = icons.warning;
        color = colors.yellow;
        version += ` (expected ${tool.expectedVersion})`;
      } else {
        status = icons.check;
        color = colors.green;
      }
    } else if (!tool.required) {
      status = icons.warning;
      color = colors.yellow;
    }

    const result = {
      name: tool.name,
      installed: exists,
      version,
      required: tool.required,
      status: exists ? 'OK' : tool.required ? 'MISSING' : 'OPTIONAL',
    };

    results.tools.push(result);
    log(`${status} ${tool.name.padEnd(20)} ${version}`, color);
  });
}

// ============================================
// 2. CHECK DOCKER SERVICES
// ============================================
function checkServices() {
  logHeader('Docker Services');

  // Check if Docker daemon is running
  const dockerRunning = execCommand('docker ps') !== null;

  if (!dockerRunning) {
    log(`${icons.error} Docker daemon is not running`, colors.red);
    log('  Please start Docker Desktop', colors.yellow);
    return;
  }

  // Check PostgreSQL container
  const pgStatus = execCommand('docker exec projectdes-db pg_isready -U projectdes 2>/dev/null');
  const pgRunning = pgStatus && pgStatus.includes('accepting connections');

  results.services.push({
    name: 'PostgreSQL',
    status: pgRunning ? 'Running' : 'Not running',
    container: 'projectdes-db',
  });

  log(
    `${pgRunning ? icons.check : icons.cross} PostgreSQL Container ${pgRunning ? '(running)' : '(not running)'}`,
    pgRunning ? colors.green : colors.red
  );

  // Check Redis container
  const redisStatus = execCommand('docker exec projectdes-redis redis-cli ping 2>/dev/null');
  const redisRunning = redisStatus === 'PONG';

  results.services.push({
    name: 'Redis',
    status: redisRunning ? 'Running' : 'Not running',
    container: 'projectdes-redis',
  });

  log(
    `${redisRunning ? icons.check : icons.cross} Redis Container ${redisRunning ? '(running)' : '(not running)'}`,
    redisRunning ? colors.green : colors.red
  );

  // Show all running containers
  const containers = execCommand('docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"');
  if (containers) {
    log('\nRunning Containers:', colors.cyan);
    console.log(containers);
  }
}

// ============================================
// 3. CHECK ENVIRONMENT VARIABLES
// ============================================
function checkEnvironment() {
  logHeader('Environment Variables');

  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), '.env.example');

  // Check if .env exists
  if (!fs.existsSync(envPath)) {
    log(`${icons.error} .env file not found`, colors.red);

    if (fs.existsSync(envExamplePath)) {
      log(`  ${icons.info} .env.example found - copy it to .env`, colors.yellow);
    }
    return;
  }

  // Read and check required variables
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const requiredVars = [
    { name: 'DATABASE_URL', pattern: /DATABASE_URL=.+/ },
    { name: 'REDIS_URL', pattern: /REDIS_URL=.+/ },
    { name: 'NODE_ENV', pattern: /NODE_ENV=.+/ },
    { name: 'JWT_SECRET', pattern: /JWT_SECRET=.+/ },
    { name: 'STRIPE_SECRET_KEY', pattern: /STRIPE_SECRET_KEY=.+/, optional: true },
    { name: 'PAYPAL_CLIENT_ID', pattern: /PAYPAL_CLIENT_ID=.+/, optional: true },
  ];

  requiredVars.forEach(varDef => {
    const exists = varDef.pattern.test(envContent);
    const status = exists ? icons.check : varDef.optional ? icons.warning : icons.cross;
    const color = exists ? colors.green : varDef.optional ? colors.yellow : colors.red;

    results.env.push({
      name: varDef.name,
      exists,
      required: !varDef.optional,
    });

    log(
      `${status} ${varDef.name.padEnd(25)} ${exists ? 'Set' : varDef.optional ? 'Not set (optional)' : 'MISSING'}`,
      color
    );
  });
}

// ============================================
// 4. CHECK PROJECT FILES
// ============================================
function checkProjectFiles() {
  logHeader('Project Files');

  const requiredFiles = [
    { path: 'package.json', type: 'Config' },
    { path: 'pnpm-workspace.yaml', type: 'Config' },
    { path: 'docker-compose.yml', type: 'Config' },
    { path: 'turbo.json', type: 'Config' },
    { path: '.gitignore', type: 'Config' },
    { path: 'apps/web/package.json', type: 'App', optional: true },
    { path: 'apps/api/package.json', type: 'App', optional: true },
    { path: 'packages/db/package.json', type: 'Package', optional: true },
  ];

  requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(process.cwd(), file.path));
    const status = exists ? icons.check : file.optional ? icons.warning : icons.cross;
    const color = exists ? colors.green : file.optional ? colors.yellow : colors.red;

    results.files.push({
      path: file.path,
      type: file.type,
      exists,
      required: !file.optional,
    });

    log(
      `${status} ${file.path.padEnd(30)} ${exists ? 'Found' : file.optional ? 'Not found (optional)' : 'MISSING'}`,
      color
    );
  });
}

// ============================================
// 5. CHECK PORTS
// ============================================
function checkPorts() {
  logHeader('Port Availability');

  const ports = [
    { port: 3000, service: 'Next.js Web' },
    { port: 4000, service: 'Express API' },
    { port: 5432, service: 'PostgreSQL' },
    { port: 6379, service: 'Redis' },
  ];

  ports.forEach(portDef => {
    // Check if port is in use
    const inUse = execCommand(`lsof -i :${portDef.port} | grep LISTEN`) !== null;
    const status = inUse ? icons.check : icons.warning;
    const color = inUse ? colors.green : colors.yellow;

    results.ports.push({
      port: portDef.port,
      service: portDef.service,
      inUse,
    });

    log(
      `${status} Port ${String(portDef.port).padEnd(5)} ${portDef.service.padEnd(15)} ${inUse ? '(in use)' : '(available)'}`,
      color
    );
  });
}

// ============================================
// 6. CHECK SYSTEM RESOURCES
// ============================================
function checkSystem() {
  logHeader('System Resources');

  // Check Node.js memory limit
  const nodeMemory = process.memoryUsage();
  log(`${icons.info} Node.js Memory:`, colors.cyan);
  log(`  RSS:      ${formatBytes(nodeMemory.rss)}`);
  log(`  Heap:     ${formatBytes(nodeMemory.heapUsed)} / ${formatBytes(nodeMemory.heapTotal)}`);

  // Check disk space
  const diskSpace = execCommand("df -h . | tail -1 | awk '{print $4}'");
  if (diskSpace) {
    log(`${icons.info} Available Disk Space: ${diskSpace}`, colors.cyan);
  }

  // Check CPU info
  const cpuCount = require('os').cpus().length;
  log(`${icons.info} CPU Cores: ${cpuCount}`, colors.cyan);

  // Check platform
  const platform = process.platform;
  const arch = process.arch;
  log(`${icons.info} Platform: ${platform} (${arch})`, colors.cyan);

  results.system = {
    nodeMemory,
    diskSpace,
    cpuCount,
    platform,
    arch,
  };
}

// ============================================
// 7. GENERATE REPORT
// ============================================
function generateReport() {
  logHeader('Verification Summary');

  let hasErrors = false;
  let hasWarnings = false;

  // Count issues
  const missingTools = results.tools.filter(t => t.required && !t.installed).length;
  const missingEnv = results.env.filter(e => e.required && !e.exists).length;
  const missingFiles = results.files.filter(f => f.required && !f.exists).length;

  if (missingTools > 0 || missingEnv > 0 || missingFiles > 0) {
    hasErrors = true;
  }

  const optionalTools = results.tools.filter(t => !t.required && !t.installed).length;
  if (optionalTools > 0) {
    hasWarnings = true;
  }

  // Print summary
  if (hasErrors) {
    log(`${icons.error} Environment has critical issues:`, colors.red);
    if (missingTools > 0) log(`  - ${missingTools} required tools missing`, colors.red);
    if (missingEnv > 0) log(`  - ${missingEnv} required environment variables missing`, colors.red);
    if (missingFiles > 0) log(`  - ${missingFiles} required files missing`, colors.red);
  } else if (hasWarnings) {
    log(`${icons.warning} Environment is functional with warnings:`, colors.yellow);
    if (optionalTools > 0) log(`  - ${optionalTools} optional tools not installed`, colors.yellow);
  } else {
    log(`${icons.success} Environment is fully configured and ready!`, colors.green);
  }

  // Save report to file
  const reportPath = path.join(process.cwd(), 'environment-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  log(`\n${icons.info} Detailed report saved to: environment-report.json`, colors.cyan);

  // Exit code
  process.exit(hasErrors ? 1 : 0);
}

// ============================================
// MAIN EXECUTION
// ============================================
function main() {
  console.clear();
  log('╔══════════════════════════════════════════════════╗', colors.cyan + colors.bright);
  log('║   PROJECTDES ACADEMY - ENVIRONMENT VERIFICATION   ║', colors.cyan + colors.bright);
  log('╚══════════════════════════════════════════════════╝', colors.cyan + colors.bright);

  checkTools();
  checkServices();
  checkEnvironment();
  checkProjectFiles();
  checkPorts();
  checkSystem();
  generateReport();
}

// Run verification
main();
