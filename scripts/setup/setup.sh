#!/bin/bash

# ╔══════════════════════════════════════════════════════════════════╗
# ║                  PROJECTDES ACADEMY - MASTER SETUP                ║
# ║                                                                    ║
# ║  One-command setup for the entire development environment         ║
# ║  Run: chmod +x setup.sh && ./setup.sh                            ║
# ╚══════════════════════════════════════════════════════════════════╝

set -e  # Exit on error

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

# Configuration
PROJECT_NAME="Projectdes Academy"
LOG_FILE="setup.log"
START_TIME=$(date +%s)

# ASCII Art Banner
show_banner() {
    clear
    echo -e "${CYAN}${BOLD}"
    cat << "EOF"
    ____                 _           _      _           
   |  _ \ _ __ ___ (_) ___  ___| |_ __| | ___  ___ 
   | |_) | '__/ _ \| |/ _ \/ __| __/ _` |/ _ \/ __|
   |  __/| | | (_) | |  __/ (__| || (_| |  __/\__ \
   |_|   |_|  \___// |\___|\___|\__\__,_|\___||___/
                 |__/                               
           _                    _                      
          / \   ___ __ _  __| | ___ _ __ ___  _   _ 
         / _ \ / __/ _` |/ _` |/ _ \ '_ ` _ \| | | |
        / ___ \ (_| (_| | (_| |  __/ | | | | | |_| |
       /_/   \_\___\__,_|\__,_|\___|_| |_| |_|\__, |
                                               |___/ 
EOF
    echo -e "${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}        Complete Development Environment Setup${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
    echo -e "$1"
}

log_step() {
    log "${BLUE}➤${NC} $1"
}

log_success() {
    log "${GREEN}✓${NC} $1"
}

log_error() {
    log "${RED}✗${NC} $1"
}

log_warning() {
    log "${YELLOW}⚠${NC} $1"
}

log_info() {
    log "${CYAN}ℹ${NC} $1"
}

# Progress bar
show_progress() {
    local progress=$1
    local total=$2
    local width=50
    local percent=$((progress * 100 / total))
    local filled=$((progress * width / total))
    
    printf "\r["
    printf "%${filled}s" | tr ' ' '█'
    printf "%$((width - filled))s" | tr ' ' '░'
    printf "] %3d%% " $percent
}

# Check requirements
check_requirements() {
    log_step "Checking system requirements..."
    
    # Check OS
    OS="$(uname -s)"
    if [[ "$OS" != "Darwin" && "$OS" != "Linux" ]]; then
        log_error "Unsupported OS: $OS"
        log_info "This script supports macOS and Linux only"
        exit 1
    fi
    
    # Check for curl
    if ! command -v curl &> /dev/null; then
        log_error "curl is required but not installed"
        exit 1
    fi
    
    log_success "System requirements met"
}

# Create project structure
create_structure() {
    log_step "Creating project structure..."
    
    directories=(
        "apps/web"
        "apps/api"
        "packages/ui"
        "packages/types"
        "packages/db"
        "packages/utils"
        "ai/providers"
        "ai/prompts"
        "ai/rag"
        "ai/middleware"
        "ai/services"
        "qa/cypress"
        "qa/playwright"
        "qa/shared"
        "infra/docker"
        "infra/db/init"
        "infra/db/backups"
        "infra/scripts"
        "infra/redis"
        "docs"
        "scripts"
        ".vscode"
        ".github/workflows"
    )
    
    total=${#directories[@]}
    current=0
    
    for dir in "${directories[@]}"; do
        mkdir -p "$dir"
        current=$((current + 1))
        show_progress $current $total
    done
    
    echo ""
    log_success "Project structure created"
}

# Install development tools
install_tools() {
    log_step "Installing development tools..."
    
    # Make scripts executable
    chmod +x scripts/install-dev-tools.sh 2>/dev/null || true
    chmod +x scripts/verify-environment.js 2>/dev/null || true
    
    # Run installation script if it exists
    if [ -f "scripts/install-dev-tools.sh" ]; then
        log_info "Running development tools installation..."
        ./scripts/install-dev-tools.sh
    else
        log_warning "Development tools script not found, skipping..."
    fi
}

# Setup environment files
setup_environment() {
    log_step "Setting up environment configuration..."
    
    # Create .env from .env.example
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            log_success ".env file created from .env.example"
            log_warning "Please update .env with your actual values"
        else
            log_warning ".env.example not found"
        fi
    else
        log_info ".env file already exists"
    fi
    
    # Create .gitignore if not exists
    if [ ! -f ".gitignore" ]; then
        cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnpm-store/

# Environment
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
.next/
out/
*.tsbuildinfo

# Logs
logs/
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/
cypress/videos/
cypress/screenshots/
playwright-report/
test-results/

# IDE
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
!.vscode/launch.json
!.vscode/tasks.json
.idea/
*.iml
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
desktop.ini

# Temporary
tmp/
temp/
*.tmp
*.temp

# Database
*.sqlite
*.sqlite3
*.db
prisma/migrations/dev/

# Uploads
uploads/
public/uploads/

# Cache
.turbo/
.cache/
.parcel-cache/

# Misc
.vercel
.netlify
*.pem
.env.production
EOF
        log_success ".gitignore created"
    fi
}

# Setup Docker
setup_docker() {
    log_step "Setting up Docker containers..."
    
    # Check if Docker is running
    if ! docker info &> /dev/null; then
        log_warning "Docker is not running"
        
        if [[ "$OS" == "Darwin" ]]; then
            log_info "Attempting to start Docker Desktop..."
            open /Applications/Docker.app 2>/dev/null || true
            
            # Wait for Docker to start
            log_info "Waiting for Docker to start (up to 60 seconds)..."
            for i in {1..60}; do
                if docker info &> /dev/null; then
                    log_success "Docker is now running"
                    break
                fi
                sleep 1
                show_progress $i 60
            done
            echo ""
        else
            log_error "Please start Docker manually and run this script again"
            exit 1
        fi
    fi
    
    # Start containers
    if [ -f "docker-compose.yml" ]; then
        log_info "Starting Docker containers..."
        docker-compose up -d
        
        # Wait for services to be ready
        log_info "Waiting for services to be ready..."
        sleep 5
        
        # Check PostgreSQL
        if docker exec projectdes-db pg_isready -U projectdes &> /dev/null; then
            log_success "PostgreSQL is running"
        else
            log_error "PostgreSQL failed to start"
        fi
        
        # Check Redis
        if docker exec projectdes-redis redis-cli ping &> /dev/null; then
            log_success "Redis is running"
        else
            log_error "Redis failed to start"
        fi
    else
        log_warning "docker-compose.yml not found"
    fi
}

# Initialize package.json
init_package_json() {
    log_step "Initializing package.json..."
    
    if [ ! -f "package.json" ]; then
        cat > package.json << 'EOF'
{
  "name": "projectdes-academy",
  "version": "1.0.0",
  "private": true,
  "description": "Projectdes AI Academy - Online Education Platform",
  "packageManager": "pnpm@9.0.0",
  "workspaces": [
    "apps/*",
    "packages/*",
    "ai",
    "qa/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "clean": "turbo run clean",
    "typecheck": "turbo run typecheck",
    "setup": "./setup.sh",
    "verify": "node scripts/verify-environment.js",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f",
    "docker:reset": "docker-compose down -v && docker-compose up -d",
    "db:studio": "cd packages/db && npx prisma studio",
    "db:migrate": "cd packages/db && npx prisma migrate dev",
    "db:push": "cd packages/db && npx prisma db push",
    "db:seed": "cd packages/db && npx prisma db seed",
    "db:reset": "cd packages/db && npx prisma migrate reset",
    "fresh": "pnpm clean && pnpm install && pnpm db:reset && pnpm dev"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "eslint": "^8.56.0",
    "prettier": "^3.2.4",
    "turbo": "^1.11.3",
    "typescript": "^5.3.3"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  }
}
EOF
        log_success "package.json created"
    else
        log_info "package.json already exists"
    fi
}

# Initialize pnpm workspace
init_pnpm_workspace() {
    log_step "Initializing pnpm workspace..."
    
    if [ ! -f "pnpm-workspace.yaml" ]; then
        cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
  - 'ai'
  - 'qa/*'
EOF
        log_success "pnpm-workspace.yaml created"
    else
        log_info "pnpm-workspace.yaml already exists"
    fi
}

# Initialize Turborepo
init_turborepo() {
    log_step "Initializing Turborepo..."
    
    if [ ! -f "turbo.json" ]; then
        cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "clean": {
      "cache": false
    }
  }
}
EOF
        log_success "turbo.json created"
    else
        log_info "turbo.json already exists"
    fi
}

# Install dependencies
install_dependencies() {
    log_step "Installing project dependencies..."
    
    if command -v pnpm &> /dev/null; then
        pnpm install || log_warning "Some dependencies failed to install"
    else
        log_warning "pnpm not found, skipping dependency installation"
    fi
}

# Run verification
run_verification() {
    log_step "Running environment verification..."
    
    if [ -f "scripts/verify-environment.js" ]; then
        node scripts/verify-environment.js || true
    else
        log_warning "Verification script not found"
    fi
}

# Show completion message
show_completion() {
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    MINUTES=$((DURATION / 60))
    SECONDS=$((DURATION % 60))
    
    echo ""
    echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}${BOLD}║                    🎉 SETUP COMPLETE! 🎉                        ║${NC}"
    echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}Time taken: ${MINUTES}m ${SECONDS}s${NC}"
    echo ""
    echo -e "${YELLOW}📋 Next Steps:${NC}"
    echo -e "  1. Update ${CYAN}.env${NC} file with your configuration"
    echo -e "  2. Run ${CYAN}pnpm db:migrate${NC} to set up the database"
    echo -e "  3. Run ${CYAN}pnpm db:seed${NC} to add sample data"
    echo -e "  4. Run ${CYAN}pnpm dev${NC} to start development servers"
    echo ""
    echo -e "${YELLOW}🔧 Useful Commands:${NC}"
    echo -e "  • ${CYAN}pnpm verify${NC}     - Verify environment"
    echo -e "  • ${CYAN}pnpm docker:up${NC}  - Start Docker services"
    echo -e "  • ${CYAN}pnpm db:studio${NC}  - Open Prisma Studio"
    echo -e "  • ${CYAN}pnpm dev${NC}        - Start development"
    echo ""
    echo -e "${GREEN}Happy coding! 🚀${NC}"
    echo ""
    echo -e "${MAGENTA}Documentation: docs/${NC}"
    echo -e "${MAGENTA}Support: support@projectdes.ai${NC}"
}

# Error handler
handle_error() {
    log_error "Setup failed at line $1"
    log_info "Check $LOG_FILE for details"
    exit 1
}

# Set error trap
trap 'handle_error $LINENO' ERR

# Main execution
main() {
    show_banner
    
    log_info "Starting setup at $(date)"
    log_info "Log file: $LOG_FILE"
    echo ""
    
    check_requirements
    create_structure
    setup_environment
    init_package_json
    init_pnpm_workspace
    init_turborepo
    install_tools
    setup_docker
    install_dependencies
    run_verification
    
    show_completion
}

# Run main function
main "$@"