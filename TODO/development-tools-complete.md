# Complete Development Tools Setup Guide - Projectdes AI Academy

## 🎯 Development Environment Architecture

### System Requirements Analysis

- **OS**: macOS (primary), Linux (Ubuntu 20.04+), Windows (WSL2)
- **RAM**: Minimum 8GB, Recommended 16GB
- **Storage**: 20GB free space minimum
- **CPU**: 4+ cores recommended for parallel builds

---

## 📦 Core Development Tools

### 1. Runtime Environments

#### Node.js v20 LTS

```bash
# macOS (using nvm for version management)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node --version  # Should be v20.x.x
npm --version   # Should be 10.x.x

# Alternative: Homebrew
brew install node@20
brew link node@20
```

**Why Node.js 20?**

- LTS support until April 2026
- Native ESM support
- Built-in test runner
- Performance improvements (10-15% faster than v18)
- Better TypeScript integration

#### pnpm v9 (Package Manager)

```bash
# Install via npm (after Node.js)
npm install -g pnpm@9

# Alternative: standalone installer
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Configure pnpm
pnpm config set store-dir ~/.pnpm-store
pnpm config set virtual-store-dir node_modules/.pnpm
pnpm config set shamefully-hoist true  # For compatibility

# Verify
pnpm --version  # Should be 9.x.x
```

**Why pnpm?**

- 3x faster installations than npm
- 60% less disk space usage
- Strict dependency resolution
- Perfect for monorepos
- Built-in workspace support

### 2. Containerization

#### Docker Desktop

```bash
# Download from docker.com or use Homebrew
brew install --cask docker

# Start Docker Desktop
open /Applications/Docker.app

# Verify installation
docker --version        # Docker version 24.x.x
docker-compose --version # Docker Compose version 2.x.x
docker ps               # Should connect to daemon

# Configure Docker resources (in Docker Desktop preferences)
# - Memory: 4GB minimum, 8GB recommended
# - CPUs: 2 minimum, 4 recommended
# - Disk: 20GB minimum
```

**Docker Configuration File** (`~/.docker/config.json`):

```json
{
  "experimental": "enabled",
  "features": {
    "buildkit": true
  },
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  }
}
```

### 3. Version Control

#### Git Configuration

```bash
# Install latest Git
brew install git

# Global configuration
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
git config --global core.editor "code --wait"
git config --global pull.rebase false
git config --global push.autoSetupRemote true

# Performance optimizations
git config --global core.preloadindex true
git config --global core.fscache true
git config --global gc.auto 256

# Better diff
git config --global diff.algorithm histogram
git config --global merge.conflictstyle diff3

# Aliases for productivity
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'
```

### 4. Code Editor

#### VS Code with Extensions

```bash
# Install VS Code
brew install --cask visual-studio-code

# Install essential extensions via command line
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension prisma.prisma
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension christian-kohler.path-intellisense
code --install-extension formulahendry.auto-rename-tag
code --install-extension naumovs.color-highlight
code --install-extension usernamehw.errorlens
code --install-extension eamodio.gitlens
code --install-extension github.copilot
code --install-extension yoavbls.pretty-ts-errors
code --install-extension meganrogge.template-string-converter
```

**VS Code Settings** (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": "active",
  "editor.suggestSelection": "first",
  "editor.snippetSuggestions": "top",
  "editor.linkedEditing": true,
  "editor.fontSize": 14,
  "editor.fontFamily": "'Fira Code', 'Cascadia Code', monospace",
  "editor.fontLigatures": true,
  "terminal.integrated.fontSize": 14,
  "terminal.integrated.fontFamily": "'MesloLGS NF', monospace",
  "workbench.colorTheme": "One Dark Pro",
  "workbench.iconTheme": "material-icon-theme",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "files.exclude": {
    "**/.git": false,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/.next": true,
    "**/dist": true
  }
}
```

### 5. Database Tools

#### PostgreSQL Client Tools

```bash
# Install PostgreSQL client (without server)
brew install libpq
brew link --force libpq

# Install pgcli (better PostgreSQL CLI)
pip3 install pgcli

# Install TablePlus (GUI)
brew install --cask tableplus

# Alternative: DBeaver (free, multi-database)
brew install --cask dbeaver-community
```

#### Redis Tools

```bash
# Redis CLI
brew install redis

# RedisInsight (GUI)
brew install --cask redisinsight

# redis-cli shortcuts
alias redis-cli='docker exec -it projectdes-redis redis-cli'
```

### 6. API Development Tools

#### HTTP Clients

```bash
# Postman
brew install --cask postman

# Insomnia (lighter alternative)
brew install --cask insomnia

# HTTPie (CLI)
brew install httpie

# curl with better output
brew install curl
```

#### Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Test webhook locally
stripe listen --forward-to localhost:4000/api/webhooks/stripe

# Trigger test events
stripe trigger payment_intent.succeeded
```

### 7. Process Management

#### PM2 (Process Manager)

```bash
# Install globally
npm install -g pm2

# Install log rotation module
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true

# Install monitoring dashboard
pm2 install pm2-server-monit
```

### 8. Build Tools

#### Turbo (Monorepo Build System)

```bash
# Installed as dev dependency, but can install globally for CLI
npm install -g turbo

# Enable remote caching (optional)
turbo login
turbo link
```

### 9. Quality Assurance Tools

#### Testing Frameworks

```bash
# Playwright browsers
npx playwright install --with-deps chromium firefox webkit

# Cypress binary
npx cypress install

# Coverage reporters
npm install -g nyc
```

### 10. Security Tools

#### Security Scanning

```bash
# npm audit for vulnerabilities
npm install -g npm-audit-resolver

# Snyk CLI
npm install -g snyk
snyk auth

# GitGuardian CLI
brew tap gitguardian/tap
brew install gitguardian
gitguardian auth login
```

---

## 🔧 Development Environment Setup Script

Create `scripts/setup-dev-env.sh`:

```bash
#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 Setting up Projectdes Academy Development Environment"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to verify version
verify_version() {
    local cmd="$1"
    local version_cmd="$2"
    local expected="$3"

    if command_exists "$cmd"; then
        version=$($version_cmd 2>/dev/null)
        echo -e "${GREEN}✓${NC} $cmd installed: $version"
        return 0
    else
        echo -e "${RED}✗${NC} $cmd not found"
        return 1
    fi
}

echo ""
echo "Checking required tools..."
echo "=========================="

# Check Node.js
verify_version "node" "node --version" "v20"

# Check pnpm
verify_version "pnpm" "pnpm --version" "9"

# Check Docker
verify_version "docker" "docker --version" "Docker version"

# Check Git
verify_version "git" "git --version" "git version"

# Check PostgreSQL client
verify_version "psql" "psql --version" "psql"

# Check PM2
verify_version "pm2" "pm2 --version" "5"

# Check Stripe CLI
verify_version "stripe" "stripe --version" "stripe"

echo ""
echo "Setting up project..."
echo "===================="

# Install dependencies
if [ -f "package.json" ]; then
    echo "Installing dependencies with pnpm..."
    pnpm install
fi

# Create .env file from example
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo -e "${YELLOW}⚠${NC} Please update .env with your actual values"
fi

# Start Docker containers
if [ -f "docker-compose.yml" ]; then
    echo "Starting Docker containers..."
    docker-compose up -d

    # Wait for PostgreSQL to be ready
    echo "Waiting for PostgreSQL to be ready..."
    sleep 5

    # Check PostgreSQL connection
    docker exec projectdes-db pg_isready -U projectdes
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} PostgreSQL is ready"
    else
        echo -e "${RED}✗${NC} PostgreSQL is not ready"
    fi
fi

# Run database migrations
if [ -d "packages/db" ]; then
    echo "Running database migrations..."
    cd packages/db
    npx prisma migrate dev
    cd ../..
fi

echo ""
echo "================================"
echo -e "${GREEN}✓${NC} Development environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Run 'pnpm dev' to start development servers"
echo "3. Open http://localhost:3000 in your browser"
```

Make it executable:

```bash
chmod +x scripts/setup-dev-env.sh
./scripts/setup-dev-env.sh
```

---

## 🔍 Environment Verification

### Health Check Script

Create `scripts/health-check.js`:

```javascript
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const checks = [
  {
    name: 'Node.js',
    command: 'node --version',
    expected: 'v20',
    required: true,
  },
  {
    name: 'pnpm',
    command: 'pnpm --version',
    expected: '9',
    required: true,
  },
  {
    name: 'Docker',
    command: 'docker --version',
    expected: 'Docker',
    required: true,
  },
  {
    name: 'PostgreSQL Client',
    command: 'psql --version',
    expected: 'psql',
    required: false,
  },
  {
    name: 'Git',
    command: 'git --version',
    expected: 'git',
    required: true,
  },
  {
    name: 'PM2',
    command: 'pm2 --version',
    expected: '5',
    required: false,
  },
];

const services = [
  {
    name: 'PostgreSQL Container',
    command: 'docker exec projectdes-db pg_isready -U projectdes',
    expected: 'accepting connections',
  },
  {
    name: 'Redis Container',
    command: 'docker exec projectdes-redis redis-cli ping',
    expected: 'PONG',
  },
];

console.log('🏥 Running health checks...\n');

// Check tools
console.log('📦 Checking development tools:');
console.log('─'.repeat(40));

let hasErrors = false;

checks.forEach(check => {
  try {
    const output = execSync(check.command, { encoding: 'utf-8' }).trim();
    const status = output.includes(check.expected) ? '✅' : '⚠️';
    console.log(`${status} ${check.name}: ${output}`);
  } catch (error) {
    const status = check.required ? '❌' : '⚠️';
    console.log(`${status} ${check.name}: Not installed`);
    if (check.required) hasErrors = true;
  }
});

// Check services
console.log('\n🔌 Checking services:');
console.log('─'.repeat(40));

services.forEach(service => {
  try {
    const output = execSync(service.command, { encoding: 'utf-8' }).trim();
    const status = output.includes(service.expected) ? '✅' : '❌';
    console.log(`${status} ${service.name}: ${output}`);
  } catch (error) {
    console.log(`❌ ${service.name}: Not running`);
    hasErrors = true;
  }
});

// Check environment variables
console.log('\n🔐 Checking environment variables:');
console.log('─'.repeat(40));

const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const requiredEnvVars = [
    'DATABASE_URL',
    'REDIS_URL',
    'JWT_SECRET',
    'NODE_ENV',
  ];

  requiredEnvVars.forEach(varName => {
    const hasVar = envContent.includes(`${varName}=`);
    const status = hasVar ? '✅' : '❌';
    console.log(`${status} ${varName}`);
    if (!hasVar) hasErrors = true;
  });
} else {
  console.log('❌ .env file not found');
  hasErrors = true;
}

// Check disk space
console.log('\n💾 System resources:');
console.log('─'.repeat(40));

try {
  const diskSpace = execSync('df -h . | tail -1', { encoding: 'utf-8' });
  const [, , , used, available] = diskSpace.split(/\s+/);
  console.log(`Disk space: ${used} used, ${available} available`);
} catch (error) {
  console.log('Could not check disk space');
}

// Final status
console.log('\n' + '='.repeat(40));
if (hasErrors) {
  console.log('❌ Some checks failed. Please fix the issues above.');
  process.exit(1);
} else {
  console.log('✅ All checks passed! Your environment is ready.');
  process.exit(0);
}
```

---

## 🎯 Quick Start Commands

Add to your `package.json`:

```json
{
  "scripts": {
    "setup": "./scripts/setup-dev-env.sh",
    "health": "node scripts/health-check.js",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f",
    "docker:clean": "docker-compose down -v",
    "db:studio": "npx prisma studio",
    "db:migrate": "npx prisma migrate dev",
    "db:seed": "npx prisma db seed",
    "db:reset": "npx prisma migrate reset",
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "clean": "turbo run clean && rm -rf node_modules",
    "fresh": "pnpm clean && pnpm install && pnpm db:reset && pnpm dev"
  }
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Port already in use

```bash
# Find process using port
lsof -i :3000
# Kill process
kill -9 <PID>
```

### Issue 2: Docker daemon not running

```bash
# macOS
open /Applications/Docker.app
# Linux
sudo systemctl start docker
```

### Issue 3: pnpm command not found

```bash
# Add to ~/.zshrc or ~/.bashrc
export PNPM_HOME="$HOME/.local/share/pnpm"
export PATH="$PNPM_HOME:$PATH"
source ~/.zshrc
```

### Issue 4: PostgreSQL connection refused

```bash
# Check if container is running
docker ps
# Check logs
docker logs projectdes-db
# Restart container
docker-compose restart postgres
```

### Issue 5: Node version mismatch

```bash
# Use nvm to switch versions
nvm use 20
nvm alias default 20
```

---

## 📊 Performance Optimization

### Development Machine Optimization

1. **Increase file watchers (Linux/macOS)**:

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

2. **VS Code performance settings**:

```json
{
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/*/**": true,
    "**/.next/**": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.next": true
  }
}
```

3. **Docker performance (macOS)**:

- Use VirtioFS for file sharing (faster than gRPC FUSE)
- Enable "Use Rosetta for x86/amd64 emulation" on Apple Silicon

4. **pnpm performance**:

```bash
# Use hard links when possible
pnpm config set node-linker hoisted
# Parallel installation
pnpm config set network-concurrency 16
```

---

## ✅ Development Environment Checklist

- [ ] Node.js v20 LTS installed
- [ ] pnpm v9 configured
- [ ] Docker Desktop running
- [ ] Git configured with user info
- [ ] VS Code with required extensions
- [ ] PostgreSQL client tools installed
- [ ] PM2 installed globally
- [ ] Stripe CLI configured
- [ ] Environment variables set
- [ ] Docker containers running
- [ ] Database migrations applied
- [ ] Health check passing

---

## 📚 Additional Resources

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [pnpm Documentation](https://pnpm.io)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [PostgreSQL Docker Guide](https://hub.docker.com/_/postgres)
- [VS Code Tips](https://code.visualstudio.com/docs/getstarted/tips-and-tricks)

---

## 🚨 Security Considerations

1. **Never commit**:
   - `.env` files
   - `node_modules/`
   - `.DS_Store`
   - API keys or secrets

2. **Use secret management**:
   - Development: `.env.local`
   - Production: Environment variables
   - CI/CD: GitHub Secrets

3. **Regular updates**:

```bash
# Check for vulnerabilities
pnpm audit
# Update dependencies
pnpm update --interactive
```

4. **Git hooks** (optional):

```bash
# Install husky for pre-commit hooks
pnpm add -D husky lint-staged
npx husky install
```

---

Generated: [Current Date] Version: 1.0.0
