#!/bin/bash

# ============================================
# Projectdes Academy - Development Tools Setup
# ============================================
# This script installs all required development tools
# Run with: ./scripts/install-dev-tools.sh

set -e  # Exit on error

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Detect OS
OS="$(uname -s)"
ARCH="$(uname -m)"

# Installation tracking
INSTALL_LOG="install.log"
FAILED_INSTALLS=()

# Function to print colored output
print_status() {
    echo -e "${2}${1}${NC}"
}

print_header() {
    echo ""
    echo -e "${CYAN}${BOLD}═══════════════════════════════════════════${NC}"
    echo -e "${CYAN}${BOLD}  $1${NC}"
    echo -e "${CYAN}${BOLD}═══════════════════════════════════════════${NC}"
}

print_step() {
    echo -e "${BLUE}➤${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Log installation attempt
log_install() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$INSTALL_LOG"
}

# Start installation
clear
print_header "PROJECTDES ACADEMY - DEVELOPMENT ENVIRONMENT SETUP"
echo -e "${CYAN}OS: ${NC}$OS ${CYAN}| ARCH: ${NC}$ARCH"
echo -e "${CYAN}Date: ${NC}$(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# Check for Homebrew (macOS)
if [[ "$OS" == "Darwin" ]]; then
    print_step "Checking for Homebrew..."
    if ! command_exists brew; then
        print_warning "Homebrew not found. Installing..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        
        # Add Homebrew to PATH for Apple Silicon
        if [[ "$ARCH" == "arm64" ]]; then
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
            eval "$(/opt/homebrew/bin/brew shellenv)"
        fi
        print_success "Homebrew installed"
    else
        print_success "Homebrew found"
        brew update
    fi
fi

# ============================================
# 1. NODE.JS INSTALLATION
# ============================================
print_header "1. Node.js v20 LTS"

install_node() {
    if command_exists node; then
        NODE_VERSION=$(node --version)
        if [[ $NODE_VERSION == v20* ]]; then
            print_success "Node.js $NODE_VERSION already installed"
            return 0
        else
            print_warning "Node.js $NODE_VERSION found, but v20 required"
        fi
    fi
    
    print_step "Installing Node.js v20..."
    
    # Install NVM first for better version management
    if ! command_exists nvm; then
        print_step "Installing NVM (Node Version Manager)..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        
        # Load NVM
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        
        # Add to shell profile
        echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
        echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zshrc
    fi
    
    # Install Node.js v20
    nvm install 20
    nvm use 20
    nvm alias default 20
    
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    print_success "Node.js $NODE_VERSION installed"
    print_success "npm $NPM_VERSION installed"
}

install_node

# ============================================
# 2. PNPM INSTALLATION
# ============================================
print_header "2. pnpm v9"

install_pnpm() {
    if command_exists pnpm; then
        PNPM_VERSION=$(pnpm --version)
        if [[ $PNPM_VERSION == 9* ]]; then
            print_success "pnpm $PNPM_VERSION already installed"
            return 0
        else
            print_warning "pnpm $PNPM_VERSION found, but v9 required"
        fi
    fi
    
    print_step "Installing pnpm v9..."
    npm install -g pnpm@9
    
    # Configure pnpm
    print_step "Configuring pnpm..."
    pnpm config set store-dir ~/.pnpm-store
    pnpm config set virtual-store-dir node_modules/.pnpm
    
    PNPM_VERSION=$(pnpm --version)
    print_success "pnpm $PNPM_VERSION installed and configured"
}

install_pnpm

# ============================================
# 3. DOCKER INSTALLATION
# ============================================
print_header "3. Docker Desktop"

install_docker() {
    if command_exists docker; then
        DOCKER_VERSION=$(docker --version)
        print_success "Docker already installed: $DOCKER_VERSION"
        
        # Check if Docker daemon is running
        if docker ps >/dev/null 2>&1; then
            print_success "Docker daemon is running"
        else
            print_warning "Docker daemon is not running"
            if [[ "$OS" == "Darwin" ]]; then
                print_step "Starting Docker Desktop..."
                open /Applications/Docker.app
                
                # Wait for Docker to start
                print_step "Waiting for Docker to start (this may take a minute)..."
                for i in {1..30}; do
                    if docker ps >/dev/null 2>&1; then
                        print_success "Docker is now running"
                        break
                    fi
                    sleep 2
                done
            fi
        fi
        return 0
    fi
    
    print_step "Installing Docker..."
    
    if [[ "$OS" == "Darwin" ]]; then
        brew install --cask docker
        print_success "Docker Desktop installed"
        print_warning "Please start Docker Desktop from Applications"
        open /Applications/Docker.app
    else
        print_warning "Please install Docker Desktop manually from docker.com"
        FAILED_INSTALLS+=("Docker")
    fi
}

install_docker

# ============================================
# 4. GIT CONFIGURATION
# ============================================
print_header "4. Git Configuration"

configure_git() {
    if ! command_exists git; then
        print_step "Installing Git..."
        if [[ "$OS" == "Darwin" ]]; then
            brew install git
        else
            sudo apt-get update && sudo apt-get install -y git
        fi
    fi
    
    GIT_VERSION=$(git --version)
    print_success "Git installed: $GIT_VERSION"
    
    # Check if Git is already configured
    if git config --global user.name >/dev/null 2>&1; then
        print_success "Git already configured for $(git config --global user.name)"
    else
        print_step "Configuring Git..."
        read -p "Enter your Git username: " git_username
        read -p "Enter your Git email: " git_email
        
        git config --global user.name "$git_username"
        git config --global user.email "$git_email"
        git config --global init.defaultBranch main
        git config --global pull.rebase false
        git config --global push.autoSetupRemote true
        
        print_success "Git configured for $git_username"
    fi
}

configure_git

# ============================================
# 5. POSTGRESQL CLIENT TOOLS
# ============================================
print_header "5. PostgreSQL Client Tools"

install_postgresql_client() {
    if command_exists psql; then
        PSQL_VERSION=$(psql --version)
        print_success "PostgreSQL client already installed: $PSQL_VERSION"
        return 0
    fi
    
    print_step "Installing PostgreSQL client..."
    
    if [[ "$OS" == "Darwin" ]]; then
        brew install libpq
        brew link --force libpq
        
        # Add to PATH
        echo 'export PATH="/opt/homebrew/opt/libpq/bin:$PATH"' >> ~/.zshrc
        export PATH="/opt/homebrew/opt/libpq/bin:$PATH"
    else
        sudo apt-get update && sudo apt-get install -y postgresql-client
    fi
    
    if command_exists psql; then
        print_success "PostgreSQL client installed"
    else
        print_warning "PostgreSQL client installation may require PATH update"
        FAILED_INSTALLS+=("PostgreSQL client")
    fi
}

install_postgresql_client

# ============================================
# 6. PM2 INSTALLATION
# ============================================
print_header "6. PM2 Process Manager"

install_pm2() {
    if command_exists pm2; then
        PM2_VERSION=$(pm2 --version)
        print_success "PM2 $PM2_VERSION already installed"
        return 0
    fi
    
    print_step "Installing PM2..."
    npm install -g pm2
    
    # Install PM2 log rotate
    print_step "Installing PM2 log rotate..."
    pm2 install pm2-logrotate
    pm2 set pm2-logrotate:max_size 10M
    pm2 set pm2-logrotate:retain 7
    
    PM2_VERSION=$(pm2 --version)
    print_success "PM2 $PM2_VERSION installed"
}

install_pm2

# ============================================
# 7. STRIPE CLI
# ============================================
print_header "7. Stripe CLI"

install_stripe() {
    if command_exists stripe; then
        STRIPE_VERSION=$(stripe --version)
        print_success "Stripe CLI already installed: $STRIPE_VERSION"
        return 0
    fi
    
    print_step "Installing Stripe CLI..."
    
    if [[ "$OS" == "Darwin" ]]; then
        brew install stripe/stripe-cli/stripe
        print_success "Stripe CLI installed"
        print_warning "Run 'stripe login' to authenticate"
    else
        print_warning "Please install Stripe CLI manually from stripe.com/docs/stripe-cli"
        FAILED_INSTALLS+=("Stripe CLI")
    fi
}

install_stripe

# ============================================
# 8. VS CODE
# ============================================
print_header "8. Visual Studio Code"

install_vscode() {
    if command_exists code; then
        print_success "VS Code already installed"
        
        print_step "Installing VS Code extensions..."
        
        # Essential extensions
        extensions=(
            "dbaeumer.vscode-eslint"
            "esbenp.prettier-vscode"
            "bradlc.vscode-tailwindcss"
            "prisma.prisma"
            "ms-vscode.vscode-typescript-next"
            "christian-kohler.path-intellisense"
            "formulahendry.auto-rename-tag"
            "naumovs.color-highlight"
            "usernamehw.errorlens"
        )
        
        for extension in "${extensions[@]}"; do
            code --install-extension "$extension" >/dev/null 2>&1
            echo -e "  ${GREEN}+${NC} $extension"
        done
        
        print_success "VS Code extensions installed"
        return 0
    fi
    
    print_step "Installing VS Code..."
    
    if [[ "$OS" == "Darwin" ]]; then
        brew install --cask visual-studio-code
        print_success "VS Code installed"
    else
        print_warning "Please install VS Code manually from code.visualstudio.com"
        FAILED_INSTALLS+=("VS Code")
    fi
}

install_vscode

# ============================================
# 9. ADDITIONAL TOOLS
# ============================================
print_header "9. Additional Tools"

install_additional_tools() {
    # Install jq for JSON processing
    if ! command_exists jq; then
        print_step "Installing jq..."
        if [[ "$OS" == "Darwin" ]]; then
            brew install jq
        else
            sudo apt-get install -y jq
        fi
        print_success "jq installed"
    fi
    
    # Install httpie for API testing
    if ! command_exists http; then
        print_step "Installing HTTPie..."
        if [[ "$OS" == "Darwin" ]]; then
            brew install httpie
        else
            pip3 install httpie
        fi
        print_success "HTTPie installed"
    fi
    
    # Install tree for directory visualization
    if ! command_exists tree; then
        print_step "Installing tree..."
        if [[ "$OS" == "Darwin" ]]; then
            brew install tree
        else
            sudo apt-get install -y tree
        fi
        print_success "tree installed"
    fi
}

install_additional_tools

# ============================================
# 10. VERIFICATION
# ============================================
print_header "Installation Verification"

verify_installation() {
    local all_good=true
    
    # Check each tool
    tools=(
        "node:Node.js:node --version"
        "npm:npm:npm --version"
        "pnpm:pnpm:pnpm --version"
        "docker:Docker:docker --version"
        "git:Git:git --version"
        "psql:PostgreSQL client:psql --version"
        "pm2:PM2:pm2 --version"
        "code:VS Code:code --version"
    )
    
    for tool_info in "${tools[@]}"; do
        IFS=':' read -r cmd name version_cmd <<< "$tool_info"
        
        if command_exists "$cmd"; then
            version=$($version_cmd 2>/dev/null | head -n 1)
            print_success "$name: $version"
        else
            print_error "$name: NOT INSTALLED"
            all_good=false
        fi
    done
    
    if $all_good; then
        print_success "All required tools are installed!"
    else
        print_warning "Some tools are missing. Please install them manually."
    fi
    
    # Check for failed installations
    if [ ${#FAILED_INSTALLS[@]} -gt 0 ]; then
        print_warning "The following tools need manual installation:"
        for tool in "${FAILED_INSTALLS[@]}"; do
            echo "  - $tool"
        done
    fi
}

verify_installation

# ============================================
# COMPLETION
# ============================================
print_header "Setup Complete"

echo -e "${GREEN}${BOLD}✨ Development environment setup is complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Restart your terminal to ensure all PATH updates are loaded"
echo "2. Run ${CYAN}docker-compose up -d${NC} to start PostgreSQL and Redis"
echo "3. Create a ${CYAN}.env${NC} file from ${CYAN}.env.example${NC}"
echo "4. Run ${CYAN}pnpm install${NC} to install project dependencies"
echo "5. Run ${CYAN}npm run health${NC} to verify everything is working"
echo ""
echo -e "${YELLOW}Log file: ${NC}$INSTALL_LOG"

# Create timestamp file
echo "Installation completed at $(date)" > .dev-tools-installed

exit 0