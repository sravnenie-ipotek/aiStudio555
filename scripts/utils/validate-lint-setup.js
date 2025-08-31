#!/usr/bin/env node

/**
 * ESLint & Prettier Setup Validation Script
 * Validates that linting and formatting configurations are working correctly
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COLORS = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
};

const log = {
  info: msg => console.log(`${COLORS.BLUE}ℹ${COLORS.RESET} ${msg}`),
  success: msg => console.log(`${COLORS.GREEN}✅${COLORS.RESET} ${msg}`),
  warn: msg => console.log(`${COLORS.YELLOW}⚠${COLORS.RESET} ${msg}`),
  error: msg => console.log(`${COLORS.RED}❌${COLORS.RESET} ${msg}`),
  title: msg => console.log(`${COLORS.BOLD}${COLORS.BLUE}${msg}${COLORS.RESET}`),
};

function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    log.success(`${description}: ${filePath}`);
    return true;
  } else {
    log.error(`Missing ${description}: ${filePath}`);
    return false;
  }
}

function runCommand(command, description) {
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    log.success(`${description}: Command executed successfully`);
    return true;
  } catch (error) {
    log.error(`${description}: ${error.message}`);
    return false;
  }
}

async function validateSetup() {
  log.title('\n🔧 ESLint & Prettier Setup Validation');
  log.title('=====================================\n');

  let allChecks = true;
  let passedChecks = 0;
  let totalChecks = 0;

  // Check configuration files
  log.info('Checking configuration files...');
  const configChecks = [
    { path: '.eslintrc.js', desc: 'Root ESLint config' },
    { path: '.prettierrc', desc: 'Prettier config' },
    { path: '.prettierignore', desc: 'Prettier ignore file' },
    { path: '.commitlintrc.js', desc: 'Commitlint config' },
    { path: 'apps/web/.eslintrc.js', desc: 'Web app ESLint config' },
    { path: 'apps/api/.eslintrc.js', desc: 'API ESLint config' },
    { path: 'packages/ui/.eslintrc.js', desc: 'UI package ESLint config' },
  ];

  configChecks.forEach(check => {
    totalChecks++;
    if (checkFileExists(check.path, check.desc)) {
      passedChecks++;
    } else {
      allChecks = false;
    }
  });

  // Check Git hooks
  log.info('\nChecking Git hooks...');
  const hookChecks = [
    { path: '.husky/pre-commit', desc: 'Pre-commit hook' },
    { path: '.husky/commit-msg', desc: 'Commit message hook' },
  ];

  hookChecks.forEach(check => {
    totalChecks++;
    if (checkFileExists(check.path, check.desc)) {
      // Check if executable
      try {
        const stats = fs.statSync(check.path);
        if (stats.mode & parseInt('111', 8)) {
          passedChecks++;
        } else {
          log.error(`${check.desc} is not executable`);
          allChecks = false;
        }
      } catch (error) {
        log.error(`Cannot check permissions for ${check.desc}`);
        allChecks = false;
      }
    } else {
      allChecks = false;
    }
  });

  // Check package.json scripts
  log.info('\nChecking package.json scripts...');
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredScripts = ['lint', 'format', 'format:check'];

    requiredScripts.forEach(script => {
      totalChecks++;
      if (packageJson.scripts && packageJson.scripts[script]) {
        log.success(`Script "${script}": ${packageJson.scripts[script]}`);
        passedChecks++;
      } else {
        log.error(`Missing script: ${script}`);
        allChecks = false;
      }
    });
  } catch (error) {
    log.error('Cannot read package.json');
    allChecks = false;
  }

  // Check lint-staged configuration
  log.info('\nChecking lint-staged configuration...');
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    totalChecks++;
    if (packageJson['lint-staged']) {
      log.success('lint-staged configuration found');
      passedChecks++;
    } else {
      log.error('Missing lint-staged configuration');
      allChecks = false;
    }
  } catch (error) {
    log.error('Cannot check lint-staged configuration');
    allChecks = false;
  }

  // Test commands (if dependencies are installed)
  log.info('\nTesting commands...');

  // Check if node_modules exists
  if (fs.existsSync('node_modules')) {
    const commandTests = [
      { cmd: 'npx eslint --version', desc: 'ESLint version check' },
      { cmd: 'npx prettier --version', desc: 'Prettier version check' },
    ];

    commandTests.forEach(test => {
      totalChecks++;
      if (runCommand(test.cmd, test.desc)) {
        passedChecks++;
      } else {
        allChecks = false;
      }
    });
  } else {
    log.warn('Skipping command tests - node_modules not found (run pnpm install first)');
  }

  // Final report
  log.title('\n📊 Validation Report');
  log.title('===================');

  console.log(`${COLORS.BOLD}Total checks:${COLORS.RESET} ${totalChecks}`);
  console.log(`${COLORS.GREEN}${COLORS.BOLD}Passed:${COLORS.RESET} ${passedChecks}`);
  console.log(`${COLORS.RED}${COLORS.BOLD}Failed:${COLORS.RESET} ${totalChecks - passedChecks}`);
  console.log(
    `${COLORS.BLUE}${COLORS.BOLD}Success rate:${COLORS.RESET} ${Math.round((passedChecks / totalChecks) * 100)}%`
  );

  if (allChecks) {
    log.title('\n🎉 All ESLint & Prettier configurations are properly set up!');
    console.log('\nNext steps:');
    console.log('1. Run: pnpm install (if not done already)');
    console.log('2. Run: pnpm lint (to test linting)');
    console.log('3. Run: pnpm format (to test formatting)');
    console.log('4. Test git commit with properly formatted message');
  } else {
    log.title('\n⚠️ Some configurations are missing or incorrect.');
    console.log('\nPlease fix the issues above before proceeding.');
  }

  return allChecks;
}

// Run validation
validateSetup()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    log.error(`Validation failed: ${error.message}`);
    process.exit(1);
  });
