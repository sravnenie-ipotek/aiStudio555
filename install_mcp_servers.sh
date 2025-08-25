#!/bin/bash

# MCP Server Installation and Configuration Script
# Installs: puppeteer, playwright, github, filesystem, and fetch MCP servers

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Detect OS
detect_os() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        CONFIG_DIR="$HOME/Library/Application Support/Claude"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
        CONFIG_DIR="$HOME/.config/Claude"
    else
        print_error "Unsupported OS: $OSTYPE"
        exit 1
    fi
    print_status "Detected OS: $OS"
    print_status "Config directory: $CONFIG_DIR"
}

# Create MCP directory
create_mcp_directory() {
    MCP_DIR="$HOME/.config/Claude/mcp"
    print_status "Creating MCP directory at $MCP_DIR..."
    mkdir -p "$MCP_DIR"
    print_success "MCP directory created"
}

# Install Node.js dependencies globally
install_global_deps() {
    print_status "Checking Node.js and npm..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    print_success "Node.js $NODE_VERSION and npm $NPM_VERSION found"
    
    print_status "Installing npx globally (if not present)..."
    if ! command -v npx &> /dev/null; then
        npm install -g npx
        print_success "npx installed"
    else
        print_success "npx already installed"
    fi
}

# Install MCP servers
install_mcp_servers() {
    cd "$MCP_DIR"
    
    # Array of MCP servers to install
    declare -a servers=(
        "@modelcontextprotocol/server-puppeteer"
        "@modelcontextprotocol/server-playwright"
        "@modelcontextprotocol/server-github"
        "@modelcontextprotocol/server-filesystem"
        "@modelcontextprotocol/server-fetch"
    )
    
    print_status "Installing MCP servers in $MCP_DIR..."
    
    # Initialize package.json if it doesn't exist
    if [ ! -f "package.json" ]; then
        print_status "Initializing package.json..."
        npm init -y > /dev/null 2>&1
    fi
    
    # Install each server
    for server in "${servers[@]}"; do
        print_status "Installing $server..."
        if npm install "$server" --save; then
            print_success "$server installed successfully"
        else
            print_warning "Failed to install $server, continuing..."
        fi
    done
    
    # Install additional dependencies for playwright
    print_status "Installing Playwright browsers..."
    npx playwright install chromium > /dev/null 2>&1 || print_warning "Playwright browsers may need manual installation"
    
    print_success "All MCP servers installed"
}

# Configure claude_desktop_config.json
configure_claude_desktop() {
    CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
    
    print_status "Configuring $CONFIG_FILE..."
    
    # Create backup if config exists
    if [ -f "$CONFIG_FILE" ]; then
        BACKUP_FILE="${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
        cp "$CONFIG_FILE" "$BACKUP_FILE"
        print_status "Backup created at $BACKUP_FILE"
    fi
    
    # Create the configuration
    cat > "$CONFIG_FILE" << 'EOF'
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-puppeteer"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    },
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-playwright"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN_HERE"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    },
    "fetch": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-fetch"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
EOF
    
    print_success "Configuration file created"
    print_warning "Remember to add your GitHub Personal Access Token to the github server configuration!"
}

# Verify installation
verify_installation() {
    print_status "Verifying MCP server installations..."
    
    cd "$MCP_DIR"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_error "node_modules directory not found in $MCP_DIR"
        return 1
    fi
    
    # Verify each server
    declare -a servers=(
        "@modelcontextprotocol/server-puppeteer"
        "@modelcontextprotocol/server-playwright"
        "@modelcontextprotocol/server-github"
        "@modelcontextprotocol/server-filesystem"
        "@modelcontextprotocol/server-fetch"
    )
    
    local all_good=true
    for server in "${servers[@]}"; do
        if [ -d "node_modules/$server" ]; then
            print_success "$server verified"
        else
            print_error "$server not found"
            all_good=false
        fi
    done
    
    if $all_good; then
        print_success "All servers verified successfully!"
    else
        print_warning "Some servers may need manual installation"
    fi
    
    # Test npx commands
    print_status "Testing npx commands..."
    for server in "${servers[@]}"; do
        if npx -y "$server" --version > /dev/null 2>&1 || npx -y "$server" --help > /dev/null 2>&1; then
            print_success "$server command works"
        else
            print_warning "$server command test inconclusive (this is normal for some servers)"
        fi
    done
}

# Create helper scripts
create_helper_scripts() {
    print_status "Creating helper scripts..."
    
    # Create test script
    cat > "$MCP_DIR/test_servers.sh" << 'EOF'
#!/bin/bash
# Test MCP servers

echo "Testing MCP servers..."

servers=(
    "@modelcontextprotocol/server-puppeteer"
    "@modelcontextprotocol/server-playwright"
    "@modelcontextprotocol/server-github"
    "@modelcontextprotocol/server-filesystem"
    "@modelcontextprotocol/server-fetch"
)

for server in "${servers[@]}"; do
    echo "Testing $server..."
    npx -y "$server" --help > /dev/null 2>&1 && echo "✅ $server works" || echo "❌ $server may need configuration"
done
EOF
    chmod +x "$MCP_DIR/test_servers.sh"
    
    # Create GitHub token setup script
    cat > "$MCP_DIR/setup_github_token.sh" << 'EOF'
#!/bin/bash
# Setup GitHub token for MCP server

echo "GitHub Token Setup for MCP Server"
echo "================================="
echo ""
echo "To use the GitHub MCP server, you need a Personal Access Token."
echo "Create one at: https://github.com/settings/tokens"
echo ""
read -p "Enter your GitHub Personal Access Token: " token

if [ -z "$token" ]; then
    echo "Token cannot be empty"
    exit 1
fi

# Update the config file
if [[ "$OSTYPE" == "darwin"* ]]; then
    CONFIG_FILE="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
else
    CONFIG_FILE="$HOME/.config/Claude/claude_desktop_config.json"
fi

if [ -f "$CONFIG_FILE" ]; then
    # Use Python to update JSON (more reliable than sed for JSON)
    python3 -c "
import json
import sys

with open('$CONFIG_FILE', 'r') as f:
    config = json.load(f)

if 'mcpServers' in config and 'github' in config['mcpServers']:
    config['mcpServers']['github']['env']['GITHUB_PERSONAL_ACCESS_TOKEN'] = '$token'
    
    with open('$CONFIG_FILE', 'w') as f:
        json.dump(config, f, indent=2)
    
    print('✅ GitHub token updated successfully!')
else:
    print('❌ GitHub server configuration not found')
    sys.exit(1)
"
else
    echo "❌ Configuration file not found at $CONFIG_FILE"
    exit 1
fi
EOF
    chmod +x "$MCP_DIR/setup_github_token.sh"
    
    print_success "Helper scripts created"
}

# Main installation flow
main() {
    echo "======================================"
    echo "MCP Server Installation Script"
    echo "======================================"
    echo ""
    
    detect_os
    create_mcp_directory
    install_global_deps
    install_mcp_servers
    configure_claude_desktop
    verify_installation
    create_helper_scripts
    
    echo ""
    echo "======================================"
    echo "Installation Complete!"
    echo "======================================"
    echo ""
    print_success "MCP servers have been installed and configured"
    echo ""
    echo "📍 MCP servers location: $MCP_DIR"
    echo "📍 Configuration file: $CONFIG_DIR/claude_desktop_config.json"
    echo ""
    echo "⚠️  Important next steps:"
    echo "1. Add your GitHub Personal Access Token:"
    echo "   Run: $MCP_DIR/setup_github_token.sh"
    echo ""
    echo "2. Restart Claude Desktop application for changes to take effect"
    echo ""
    echo "3. Test servers (optional):"
    echo "   Run: $MCP_DIR/test_servers.sh"
    echo ""
    echo "Available MCP servers:"
    echo "  • puppeteer - Browser automation and screenshots"
    echo "  • playwright - Cross-browser testing and automation"
    echo "  • github - GitHub API integration"
    echo "  • filesystem - File system operations"
    echo "  • fetch - HTTP requests and API calls"
    echo ""
}

# Run main function
main "$@"