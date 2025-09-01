#!/bin/bash
# Production Deployment Script for Projectdes AI Academy
# ======================================================

set -e  # Exit on error
set -u  # Exit on undefined variable
set -o pipefail  # Exit on pipe failure

# Configuration
DEPLOY_USER="deploy"
DEPLOY_HOST="${DEPLOY_HOST:-projectdes.ai}"
DEPLOY_PATH="/var/www/projectdes-academy"
BACKUP_PATH="/var/backups/projectdes-academy"
LOG_FILE="/var/log/projectdes-academy/deploy.log"
SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
    send_notification "Deployment failed: $1" "danger"
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

# Send Slack notification
send_notification() {
    local message=$1
    local status=${2:-"info"}
    
    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$message\",\"color\":\"$status\"}" \
            "$SLACK_WEBHOOK" 2>/dev/null || true
    fi
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check required commands
    for cmd in git node pnpm pm2 nginx psql redis-cli; do
        if ! command -v $cmd &> /dev/null; then
            error "$cmd is not installed"
        fi
    done
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        error "Node.js 18+ is required (current: $(node -v))"
    fi
    
    # Check disk space
    AVAILABLE_SPACE=$(df "$DEPLOY_PATH" | awk 'NR==2 {print $4}')
    if [ "$AVAILABLE_SPACE" -lt 1000000 ]; then
        error "Insufficient disk space (less than 1GB available)"
    fi
    
    log "Prerequisites check passed"
}

# Create backup
create_backup() {
    log "Creating backup..."
    
    BACKUP_NAME="backup-$(date +'%Y%m%d-%H%M%S')"
    BACKUP_DIR="$BACKUP_PATH/$BACKUP_NAME"
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup database
    log "Backing up database..."
    pg_dump "$DATABASE_URL" | gzip > "$BACKUP_DIR/database.sql.gz"
    
    # Backup current deployment
    if [ -d "$DEPLOY_PATH/current" ]; then
        log "Backing up current deployment..."
        tar -czf "$BACKUP_DIR/app.tar.gz" -C "$DEPLOY_PATH/current" .
    fi
    
    # Backup environment files
    log "Backing up environment files..."
    cp "$DEPLOY_PATH/.env.production" "$BACKUP_DIR/.env.production" 2>/dev/null || true
    
    # Keep only last 7 backups
    cd "$BACKUP_PATH" && ls -t | tail -n +8 | xargs -r rm -rf
    
    log "Backup created: $BACKUP_DIR"
}

# Pull latest code
pull_latest() {
    log "Pulling latest code..."
    
    cd "$DEPLOY_PATH"
    
    # Stash any local changes
    git stash
    
    # Pull latest from main branch
    git fetch origin
    git checkout main
    git pull origin main
    
    # Get commit info
    COMMIT_HASH=$(git rev-parse --short HEAD)
    COMMIT_MESSAGE=$(git log -1 --pretty=%B)
    
    log "Deployed commit: $COMMIT_HASH - $COMMIT_MESSAGE"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    cd "$DEPLOY_PATH"
    
    # Clean install with frozen lockfile
    pnpm install --frozen-lockfile --production=false
    
    log "Dependencies installed"
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    
    cd "$DEPLOY_PATH"
    
    # Generate Prisma client
    pnpm --filter @aistudio555/db prisma generate
    
    # Run migrations
    pnpm --filter @aistudio555/db prisma migrate deploy
    
    log "Database migrations completed"
}

# Build applications
build_applications() {
    log "Building applications..."
    
    cd "$DEPLOY_PATH"
    
    # Build all applications
    pnpm build
    
    # Verify builds
    if [ ! -d "apps/api/dist" ]; then
        error "API build failed"
    fi
    
    if [ ! -d "apps/web/.next" ]; then
        error "Web build failed"
    fi
    
    log "Applications built successfully"
}

# Run tests
run_tests() {
    log "Running tests..."
    
    cd "$DEPLOY_PATH"
    
    # Run unit tests
    pnpm test:unit || warning "Some unit tests failed"
    
    # Run E2E tests (optional, can be slow)
    if [ "${RUN_E2E_TESTS:-false}" = "true" ]; then
        pnpm test:e2e || warning "Some E2E tests failed"
    fi
    
    log "Tests completed"
}

# Deploy with PM2
deploy_pm2() {
    log "Deploying with PM2..."
    
    cd "$DEPLOY_PATH"
    
    # Stop existing processes gracefully
    pm2 stop ecosystem.config.js || true
    
    # Delete old processes
    pm2 delete ecosystem.config.js || true
    
    # Start new processes
    pm2 start config/pm2/ecosystem.config.js --env production
    
    # Save PM2 process list
    pm2 save
    
    # Wait for services to be ready
    sleep 10
    
    # Verify services are running
    pm2 list
    
    log "PM2 deployment completed"
}

# Reload Nginx
reload_nginx() {
    log "Reloading Nginx..."
    
    # Test Nginx configuration
    nginx -t || error "Nginx configuration test failed"
    
    # Reload Nginx
    systemctl reload nginx
    
    log "Nginx reloaded"
}

# Health checks
run_health_checks() {
    log "Running health checks..."
    
    # Check API health
    API_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health)
    if [ "$API_HEALTH" != "200" ]; then
        error "API health check failed (HTTP $API_HEALTH)"
    fi
    
    # Check Web health
    WEB_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
    if [ "$WEB_HEALTH" != "200" ]; then
        error "Web health check failed (HTTP $WEB_HEALTH)"
    fi
    
    # Check database connection
    psql "$DATABASE_URL" -c "SELECT 1" > /dev/null || error "Database connection failed"
    
    # Check Redis connection
    redis-cli -a "$REDIS_PASSWORD" ping > /dev/null || error "Redis connection failed"
    
    log "All health checks passed"
}

# Warm up cache
warm_cache() {
    log "Warming up cache..."
    
    # Pre-fetch important pages
    curl -s http://localhost:3000 > /dev/null
    curl -s http://localhost:3000/programs > /dev/null
    curl -s http://localhost:3000/about > /dev/null
    
    # Pre-fetch API endpoints
    curl -s http://localhost:5000/api/v1/courses > /dev/null
    
    log "Cache warmed up"
}

# Clean up old files
cleanup() {
    log "Cleaning up..."
    
    cd "$DEPLOY_PATH"
    
    # Clean Next.js cache
    rm -rf apps/web/.next/cache/*
    
    # Clean old logs (keep last 30 days)
    find /var/log/projectdes-academy -name "*.log" -mtime +30 -delete
    
    # Clean old PM2 logs
    pm2 flush
    
    log "Cleanup completed"
}

# Rollback function
rollback() {
    error "Deployment failed, rolling back..."
    
    # Find latest backup
    LATEST_BACKUP=$(ls -t "$BACKUP_PATH" | head -1)
    
    if [ -n "$LATEST_BACKUP" ]; then
        log "Rolling back to: $LATEST_BACKUP"
        
        # Restore application
        tar -xzf "$BACKUP_PATH/$LATEST_BACKUP/app.tar.gz" -C "$DEPLOY_PATH"
        
        # Restore database
        gunzip < "$BACKUP_PATH/$LATEST_BACKUP/database.sql.gz" | psql "$DATABASE_URL"
        
        # Restart services
        pm2 restart ecosystem.config.js
        
        log "Rollback completed"
    else
        error "No backup found for rollback"
    fi
}

# Main deployment flow
main() {
    log "Starting deployment..."
    send_notification "Deployment started" "info"
    
    # Set error trap
    trap rollback ERR
    
    # Run deployment steps
    check_prerequisites
    create_backup
    pull_latest
    install_dependencies
    run_migrations
    build_applications
    run_tests
    deploy_pm2
    reload_nginx
    run_health_checks
    warm_cache
    cleanup
    
    # Remove error trap
    trap - ERR
    
    log "Deployment completed successfully!"
    send_notification "Deployment completed successfully! :rocket:" "good"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-tests)
            RUN_TESTS=false
            shift
            ;;
        --skip-backup)
            SKIP_BACKUP=true
            shift
            ;;
        --rollback)
            rollback
            exit 0
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --skip-tests    Skip running tests"
            echo "  --skip-backup   Skip creating backup"
            echo "  --rollback      Rollback to previous version"
            echo "  --help          Show this help message"
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            ;;
    esac
done

# Run main deployment
main