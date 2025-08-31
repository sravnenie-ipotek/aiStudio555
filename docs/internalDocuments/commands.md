# =� Projectdes Academy - Complete Commands Reference

This document contains **ALL available commands** for the Projectdes Academy
monorepo. Keep this file updated whenever new commands are added.

**Last Updated:** 2024-12-29  
**Monorepo Structure:** pnpm workspaces + Turborepo

---

## <� Core Development Commands

### Project Management

```bash
# Install all dependencies across the monorepo
pnpm install

# Clean install (remove node_modules and reinstall)
pnpm clean && pnpm install

# Start development servers for all apps
pnpm dev

# Build all applications and packages
pnpm build

# Run all tests across the monorepo
pnpm test

# Clean all build outputs and caches
pnpm clean

# Fresh start (clean + install + reset DB + dev)
pnpm fresh
```

### Individual Workspace Commands

```bash
# Run specific app in development
pnpm web:dev        # Start Next.js web app (port 3000)
pnpm api:dev        # Start Express API server (port 4000)

# Work with specific workspace
pnpm --filter @projectdes/web dev
pnpm --filter @projectdes/api build
pnpm --filter @projectdes/ui test
```

---

## =

Code Quality & Linting

### ESLint Commands

```bash
# Lint all workspaces
pnpm lint

# Lint with auto-fix
pnpm lint --fix

# Lint specific workspace
pnpm --filter @projectdes/web lint
pnpm --filter @projectdes/api lint

# Run ESLint directly
npx eslint . --ext .ts,.tsx,.js,.jsx
npx eslint apps/web --fix
```

### Prettier Commands

```bash
# Format all files
pnpm format

# Check formatting without changes
pnpm format:check

# Format specific file types
pnpm format "**/*.{ts,tsx}"
pnpm format "**/*.{md,json}"

# Format specific directory
npx prettier --write apps/web/
npx prettier --check packages/
```

### TypeScript Commands

```bash
# Type check all workspaces
pnpm typecheck

# Type check specific workspace
pnpm --filter @projectdes/types typecheck
pnpm --filter @projectdes/api typecheck

# Compile TypeScript (build)
pnpm build
```

---

## =� Database Commands

### Prisma Database Management

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database (development)
pnpm db:push

# Run database migrations
pnpm db:migrate          # Production migrations
pnpm db:migrate:dev      # Development migrations
pnpm db:migrate:prod     # Production deployment

# Create new migration
pnpm db:migrate:create

# Seed database with initial data
pnpm db:seed

# Reset database (destructive)
pnpm db:reset

# Open Prisma Studio (database GUI)
pnpm db:studio

# Direct Prisma commands
pnpm --filter @projectdes/db generate
pnpm --filter @projectdes/db studio
```

---

## =3 Docker Commands

### Container Management

```bash
# Start all services (PostgreSQL, Redis)
pnpm docker:up
docker-compose up -d

# Stop all services
pnpm docker:down
docker-compose down

# View service logs
pnpm docker:logs
docker-compose logs -f

# Reset all data (destructive)
pnpm docker:reset
docker-compose down -v && docker-compose up -d

# Individual service management
docker-compose up postgres -d
docker-compose up redis -d
docker-compose restart postgres
```

---

## >� Testing Commands

### Unit & Integration Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch
pnpm --filter @projectdes/api test:watch

# Run tests with coverage
pnpm test:coverage
pnpm --filter @projectdes/utils test:coverage

# Test specific workspace
pnpm --filter @projectdes/types test
pnpm --filter @projectdes/ui test
```

### End-to-End Testing (Cypress & Playwright)

```bash
# Cypress E2E Tests
pnpm --filter @projectdes/e2e cypress:open     # Open Cypress UI
pnpm --filter @projectdes/e2e cypress:run      # Run headless
pnpm --filter @projectdes/e2e cypress:smoke    # Run smoke tests
npx cypress run --spec "qa/e2e/smoke-tests.cy.ts"

# Playwright E2E Tests
pnpm --filter @projectdes/e2e test

# Run E2E tests with UI
pnpm --filter @projectdes/e2e test:ui

# Run E2E tests in headed mode
pnpm --filter @projectdes/e2e test:headed

# Debug E2E tests
pnpm --filter @projectdes/e2e test:debug

# Generate E2E test code
pnpm --filter @projectdes/e2e test:codegen

# View E2E test report
pnpm --filter @projectdes/e2e report

# Cross-browser testing
pnpm --filter @projectdes/e2e test:chrome
pnpm --filter @projectdes/e2e test:firefox
pnpm --filter @projectdes/e2e test:safari
pnpm --filter @projectdes/e2e test:mobile
```

### Performance Testing

```bash
# Run Lighthouse performance audit
pnpm --filter @projectdes/performance lighthouse
npx lhci autorun --config=qa/performance/lighthouse.config.js

# Run performance tests
pnpm --filter @projectdes/performance test

# K6 Load Testing
npx k6 run qa/performance/k6-load-test.js

# Smoke test (minimal load)
pnpm --filter @projectdes/performance test:smoke
npx k6 run qa/performance/k6-load-test.js --env SCENARIO=smoke

# Load test (normal traffic)
pnpm --filter @projectdes/performance test:load
npx k6 run qa/performance/k6-load-test.js --env SCENARIO=load

# Stress test (peak traffic)
pnpm --filter @projectdes/performance test:stress
npx k6 run qa/performance/k6-load-test.js --env SCENARIO=stress

# Spike test (sudden traffic surge)
npx k6 run qa/performance/k6-load-test.js --env SCENARIO=spike

# Web Vitals monitoring
node qa/performance/web-vitals-monitor.js
```

### Security Testing

```bash
# Security audit
pnpm --filter @projectdes/security audit
bash scripts/security/security-audit.sh

# System hardening
sudo bash scripts/security/harden.sh

# Fix security vulnerabilities
pnpm --filter @projectdes/security audit:fix
pnpm audit --fix

# Scan dependencies for vulnerabilities
pnpm --filter @projectdes/security scan:deps
pnpm audit
npm audit --workspaces

# Scan code for security issues
pnpm --filter @projectdes/security scan:code

# Check for secrets in code
pnpm --filter @projectdes/security scan:secrets
grep -r "CHANGE_THIS" --include="*.env*" .

# Check SSL certificates
openssl s_client -connect projectdes.ai:443 -servername projectdes.ai

# Verify security headers
curl -I https://projectdes.ai
```

---

## =� Package Management

### Workspace Management

```bash
# Add dependency to specific workspace
pnpm --filter @projectdes/web add react-query
pnpm --filter @projectdes/api add express cors

# Add dev dependency
pnpm --filter @projectdes/ui add -D storybook
pnpm add -D eslint prettier # Add to root

# Remove dependency
pnpm --filter @projectdes/web remove package-name
pnpm remove package-name # Remove from root

# Update dependencies
pnpm update
pnpm --filter @projectdes/types update

# List outdated packages
pnpm outdated
```

---

## =� Build & Deployment

### Build Commands

```bash
# Build all packages and apps
pnpm build

# Build specific workspace
pnpm --filter @projectdes/ui build
pnpm --filter @projectdes/web build

# Build with dependencies
pnpm --filter @projectdes/web... build

# Clean build artifacts
pnpm clean
pnpm --filter @projectdes/api clean
```

### CI/CD Commands

```bash
# Run CI pipeline locally
pnpm ci

# Version packages (Changesets)
pnpm changeset
pnpm version-packages

# Release packages
pnpm release

# GitHub Actions
act                                  # Run GitHub Actions locally
gh workflow run deploy.yml          # Trigger deployment workflow
gh run list --workflow=deploy.yml   # View workflow runs
```

### Production Deployment

```bash
# Deploy to production
bash scripts/deploy/deploy.sh

# Deploy with specific version
bash scripts/deploy/deploy.sh --version v1.2.3

# Rollback deployment
bash scripts/deploy/deploy.sh --rollback

# PM2 Process Management
pm2 start config/pm2/ecosystem.config.js
pm2 list
pm2 logs
pm2 reload all
pm2 stop all
pm2 delete all
pm2 save
pm2 startup

# Monitor deployment
node scripts/monitor.js
pm2 monit
```

### Production Commands

```bash
# Start production servers
NODE_ENV=production pnpm start
NODE_ENV=production pm2 start ecosystem.config.js

# Run production build
NODE_ENV=production pnpm build
NODE_ENV=production pnpm build:web
NODE_ENV=production pnpm build:api

# Database migrations (production)
NODE_ENV=production pnpm db:migrate:prod
NODE_ENV=production pnpm prisma migrate deploy

# Health checks
curl http://localhost:4000/api/health
curl http://localhost:4000/api/health/db
curl http://localhost:4000/api/health/redis
curl http://localhost:4000/api/health/payments
```

---

## � Development Tools

### Environment Validation

```bash
# Verify development environment
pnpm verify
node scripts/utils/verify-environment.js

# Validate linting setup
node scripts/utils/validate-lint-setup.js

# Run project setup
pnpm setup
./setup.sh
```

### Git Workflow

```bash
# Git hooks are automatic, but you can run manually:
npx lint-staged                    # Run linting on staged files
npx commitlint --edit $1           # Validate commit message

# Conventional commit examples:
git commit -m "feat: add user authentication"
git commit -m "fix: resolve database connection issue"
git commit -m "docs: update API documentation"
```

---

## =' Turborepo Commands

### Cache Management

```bash
# Clear Turbo cache
npx turbo clean
rm -rf .turbo

# Build with cache info
npx turbo build --summarize

# Run with specific scope
npx turbo build --scope=@projectdes/web
npx turbo test --scope=packages/*
```

### Pipeline Execution

```bash
# Run specific pipeline
npx turbo run lint
npx turbo run typecheck
npx turbo run test --parallel

# Force rebuild (ignore cache)
npx turbo run build --force
```

---

## <� Troubleshooting Commands

### Common Issues

```bash
# Node modules issues
rm -rf node_modules
pnpm clean
pnpm install

# TypeScript issues
pnpm --filter @projectdes/types typecheck
npx tsc --noEmit

# Database connection issues
pnpm docker:reset
pnpm db:push

# Port conflicts
lsof -ti:3000 | xargs kill -9  # Kill process on port 3000
lsof -ti:4000 | xargs kill -9  # Kill process on port 4000
```

### Reset Everything

```bash
# Nuclear option - reset everything
pnpm clean
rm -rf node_modules
pnpm docker:down
docker system prune -f
pnpm install
pnpm docker:up
pnpm db:push
pnpm dev
```

---

## =� Quick Reference

### Most Used Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start development
pnpm build            # Build everything
pnpm lint             # Check code quality
pnpm format           # Format code
pnpm test             # Run tests
pnpm clean            # Clean build artifacts
pnpm fresh            # Fresh start
```

### Emergency Commands

```bash
pnpm docker:reset     # Reset database
pnpm clean && pnpm install  # Clean reinstall
node scripts/utils/verify-environment.js  # Check setup
```

---

## � Important Notes

1. **Always run from project root** unless specified otherwise
2. **Use pnpm**, not npm or yarn
3. **Check Docker services** are running before database commands
4. **Run `pnpm install`** after pulling changes
5. **Update this file** when adding new commands

---

## 📊 Monitoring & Analytics Commands

### Application Monitoring

```bash
# Sentry monitoring
sentry-cli releases new v1.0.0
sentry-cli releases finalize v1.0.0
sentry-cli sourcemaps upload ./apps/web/.next

# Health monitoring
curl http://localhost:3000/api/health
curl http://localhost:3000/api/health/db
curl http://localhost:3000/api/health/redis

# Uptime monitoring
node apps/web/src/lib/monitoring.ts
```

### Analytics Commands

```bash
# View Google Analytics dashboard
open https://analytics.google.com

# View GTM container
open https://tagmanager.google.com

# Test analytics events
gtag('event', 'test_event', { 'event_category': 'testing' })
```

---

## 🔧 Server Management Commands

### Nginx Commands

```bash
# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo nginx -s reload

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Enable site configuration
sudo ln -s /path/to/config/nginx/projectdes-academy.conf /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### Docker Production Commands

```bash
# Build production images
docker-compose -f docker-compose.production.yml build

# Start production stack
docker-compose -f docker-compose.production.yml up -d

# View production logs
docker-compose -f docker-compose.production.yml logs -f

# Scale services
docker-compose -f docker-compose.production.yml up -d --scale api=3

# Health check
docker-compose -f docker-compose.production.yml ps
docker stats
```

### SSL/Certificate Commands

```bash
# Generate SSL certificate with Let's Encrypt
sudo certbot --nginx -d projectdes.ai -d www.projectdes.ai

# Renew SSL certificate
sudo certbot renew --dry-run
sudo certbot renew

# Check certificate expiry
echo | openssl s_client -servername projectdes.ai -connect projectdes.ai:443 2>/dev/null | openssl x509 -noout -dates
```

---

## 💾 Backup & Maintenance Commands

### Database Backup & Restore

```bash
# Backup database
pg_dump projectdes_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
psql projectdes_prod < backup_20240101_120000.sql

# Backup with Docker
docker exec postgres pg_dump -U projectdes projectdes_prod > backup.sql

# Automated backup
bash scripts/backup.sh
```

### Log Management

```bash
# View application logs
pm2 logs
pm2 logs api --lines 100
pm2 logs web --err

# Clear logs
pm2 flush

# Rotate logs
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Application logs
tail -f apps/api/logs/error.log
tail -f apps/web/.next/trace
```

---

**=� Need Help?**  
Check the main README.md or infrastructure documentation in
`/docs/architecture/`

**Last Updated:** 2024-12-29 (Added Phase 6-8 commands)
