#!/bin/bash

# Context7 MCP Server Setup Script
# This script installs and configures the Context7 MCP server for Claude

set -e

echo "🔧 Setting up Context7 MCP Server..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
fi

# Install Context7 MCP globally
echo "📦 Installing Context7 MCP server..."
npm install -g @upstash/context7-mcp || {
    echo "⚠️  Context7 might already be installed. Checking..."
    which context7-mcp && echo "✅ Context7 MCP is already installed"
}

# Check Claude configuration file
CLAUDE_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"

if [ ! -f "$CLAUDE_CONFIG" ]; then
    echo "❌ Claude configuration file not found at: $CLAUDE_CONFIG"
    echo "Please ensure Claude Desktop is installed."
    exit 1
fi

# Check if Context7 is already configured
if grep -q '"context7"' "$CLAUDE_CONFIG"; then
    echo "✅ Context7 is already configured in Claude"
else
    echo "📝 Adding Context7 to Claude configuration..."
    
    # Backup the original config
    cp "$CLAUDE_CONFIG" "$CLAUDE_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"
    
    # Add Context7 configuration using Python for proper JSON handling
    python3 -c "
import json
import sys

config_file = '$CLAUDE_CONFIG'

with open(config_file, 'r') as f:
    config = json.load(f)

if 'context7' not in config.get('mcpServers', {}):
    if 'mcpServers' not in config:
        config['mcpServers'] = {}
    
    config['mcpServers']['context7'] = {
        'command': 'npx',
        'args': ['-y', '@upstash/context7-mcp'],
        'env': {
            'NODE_ENV': 'production'
        }
    }
    
    with open(config_file, 'w') as f:
        json.dump(config, f, indent=2)
    
    print('✅ Context7 added to Claude configuration')
else:
    print('✅ Context7 already exists in configuration')
"
fi

echo ""
echo "🎉 Context7 MCP Server setup complete!"
echo ""
echo "📚 Context7 provides access to:"
echo "  • Official library documentation"
echo "  • Code examples and patterns"
echo "  • Best practices for popular frameworks"
echo ""
echo "🔄 Please restart Claude Desktop for the changes to take effect."
echo ""
echo "📖 Usage in Claude:"
echo "  • Context7 will automatically provide documentation when you mention libraries"
echo "  • You can explicitly request docs: 'Show me React hooks documentation'"
echo "  • Works with: React, Vue, Angular, Node.js, Python, and many more!"
echo ""
echo "✅ Setup complete!"