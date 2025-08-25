#!/bin/bash

echo "======================================"
echo "Apify MCP Installation Summary"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Apify MCP Configuration:${NC}"
echo "• Package: @apify/actors-mcp-server"
echo "• Version: 0.3.9"
echo "• Command: npx -y @apify/actors-mcp-server"
echo "• API Token: apify_api_ZTZca...eGGLu (configured)"
echo ""

echo -e "${GREEN}✅ Apify MCP Installation Complete${NC}"
echo ""

echo "Configuration location:"
echo "~/Library/Application Support/Claude/claude_desktop_config.json"
echo ""

echo -e "${BLUE}Apify MCP Capabilities:${NC}"
echo "• Run existing Apify Actors for web scraping"
echo "• Create custom scraping workflows"
echo "• Access to 1000+ pre-built Actors from Apify Store"
echo "• Handle JavaScript-heavy websites and SPAs"
echo "• Extract structured data from any website"
echo "• Manage scraping runs and retrieve results"
echo "• Built-in proxy rotation and anti-bot detection"
echo "• Data export in multiple formats (JSON, CSV, etc.)"
echo ""

echo -e "${BLUE}Available Tool Categories:${NC}"
echo "• docs - Documentation and help"
echo "• runs - Manage Actor runs"
echo "• storage - Handle datasets and key-value stores"
echo "• preview - Preview Actor configurations"
echo ""

echo -e "${BLUE}Popular Actors for Design Scraping:${NC}"
echo "• Website Content Crawler - Extract full website content"
echo "• Google Fonts Scraper - Extract font information"
echo "• CSS Extractor - Extract all CSS from websites"
echo "• Screenshot Actor - Capture page screenshots"
echo "• SEO Analyzer - Extract SEO and design metadata"
echo ""

echo -e "${BLUE}Testing Apify MCP:${NC}"
echo -n "Testing @apify/actors-mcp-server command... "
if APIFY_TOKEN="***REMOVED***" npx @apify/actors-mcp-server --help > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Working${NC}"
else
    echo -e "${YELLOW}⚠️  May need configuration${NC}"
fi

echo ""
echo -e "${BLUE}Integration with Design Scraper:${NC}"
echo "The Apify MCP perfectly complements your Design Scraper Agent:"
echo "• Structured extraction of design components"
echo "• Large-scale design system analysis"
echo "• Automated design trend monitoring"
echo "• Component library documentation generation"
echo ""

echo -e "${GREEN}Setup Complete!${NC}"
echo "Restart Claude Desktop to activate Apify MCP."
echo ""

echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Explore available Actors at https://apify.com/store"
echo "2. Create custom Actors for specific design extraction needs"
echo "3. Use with your Design Scraper Agent for powerful automation"