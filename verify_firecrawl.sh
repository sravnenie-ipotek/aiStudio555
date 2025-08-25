#!/bin/bash

echo "======================================"
echo "Firecrawl MCP Configuration Summary"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Configuration Details:${NC}"
echo "• MCP Server Name: firecrawl"
echo "• Command: npx -y firecrawl-mcp"
echo "• API Key: ***REMOVED*** (configured)"
echo ""

echo -e "${GREEN}✅ Firecrawl MCP has been successfully added to Claude Desktop${NC}"
echo ""

echo "Configuration location:"
echo "~/Library/Application Support/Claude/claude_desktop_config.json"
echo ""

echo -e "${YELLOW}Important Notes:${NC}"
echo "1. Restart Claude Desktop for the changes to take effect"
echo "2. The Firecrawl MCP server will be available in Claude"
echo "3. Your API key has been configured and will be used automatically"
echo ""

echo "Firecrawl MCP capabilities:"
echo "• Web scraping with JavaScript rendering"
echo "• Content extraction in multiple formats (Markdown, HTML, Screenshots)"
echo "• Automatic handling of dynamic content"
echo "• Clean, structured data extraction"
echo "• Integration with Claude for design scraping workflows"
echo ""

echo -e "${GREEN}Setup complete!${NC} Restart Claude Desktop to use Firecrawl MCP."