# MCP (Model Context Protocol) Setup Guide for AiStudio555

## 📦 MCP Servers Configuration

### Current Status

✅ **Configured in `.mcp.json`**:
- shadcn - UI component library integration
- magicui - Animated sections and hero patterns (pending)
- browserstack - Visual/responsiveness testing (pending)
- canva - Marketing visuals/banners (pending)

### Installation Instructions

#### 1. Shadcn UI (Already Working)
```bash
# This one works with npx, no installation needed
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

#### 2. Magic UI Components
Since `magicui-mcp` doesn't exist as an npm package yet, here are alternatives:

**Option A: Use Magic UI Components Directly**
```bash
# Install Magic UI components library
pnpm add framer-motion clsx tailwind-merge

# For animated components
pnpm add @magic-ui/core
```

**Option B: Create Custom MCP Server**
```javascript
// Create file: apps/web/mcp-servers/magicui.js
module.exports = {
  name: 'magicui',
  commands: {
    'add-hero': () => {
      // Custom hero component generation
    },
    'add-animation': () => {
      // Animation utilities
    }
  }
};
```

#### 3. BrowserStack Integration
For visual testing, use the actual BrowserStack tools:

```bash
# Install BrowserStack Local
npm install -g browserstack-local

# For testing
pnpm add -D @browserstack/webdriver
```

#### 4. Canva Integration
For Canva design integration:

```bash
# Use Canva API directly
# No MCP server available yet
# Consider using Canva Connect API
```

## 🎯 What You Need to Provide

To properly set up these MCP servers, please provide:

1. **API Keys/Credentials**:
   - BrowserStack username and access key
   - Canva API credentials (if using Canva Connect)

2. **Specific Requirements**:
   - Which UI animations do you want (hero patterns, scroll animations, etc.)?
   - Which browsers/devices to test on BrowserStack?
   - What type of marketing visuals from Canva?

3. **Environment Variables**:
   ```env
   # Add to .env.local
   BROWSERSTACK_USERNAME=your_username
   BROWSERSTACK_ACCESS_KEY=your_key
   CANVA_API_KEY=your_api_key
   ```

## 🚀 Alternative Solutions Available Now

### For Animated UI Components
```bash
# Install animation libraries that work today
pnpm add framer-motion
pnpm add react-spring
pnpm add @react-spring/web
pnpm add lottie-react

# For hero patterns and backgrounds
pnpm add hero-patterns
pnpm add tailwindcss-animated
```

### For Visual Testing
```bash
# Install Playwright for visual testing
pnpm add -D @playwright/test

# Create visual tests
npx playwright test --update-snapshots
```

### For Design Assets
```bash
# Use Figma API instead
pnpm add figma-api

# Or use Unsplash for images
pnpm add unsplash-js
```

## 📝 Updated MCP Configuration

Since the npm packages don't exist, here's a working configuration:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  },
  "customServers": {
    "animations": {
      "library": "framer-motion",
      "configured": false
    },
    "testing": {
      "library": "playwright",
      "configured": false
    },
    "assets": {
      "library": "unsplash-js",
      "configured": false
    }
  }
}
```

## 🔧 Immediate Actions You Can Take

1. **Install Working Animation Libraries**:
```bash
cd apps/web
pnpm add framer-motion
pnpm add tailwindcss-animated
```

2. **Set Up Visual Testing**:
```bash
pnpm add -D @playwright/test
npx playwright install
```

3. **Add UI Components**:
```bash
npx shadcn@latest add button card dialog form input
```

## ❓ Questions for You

1. **Priority**: Which feature is most important?
   - Animated UI components
   - Visual/responsive testing
   - Marketing asset generation

2. **Timeline**: When do you need these features?

3. **Budget**: Some services (BrowserStack, Canva API) require paid subscriptions

4. **Custom Development**: Should I create custom MCP-like scripts for these features?

---

**Note**: The MCP ecosystem is still evolving. The servers you mentioned (magicui-mcp, browserstack-mcp, canva-mcp) appear to be conceptual or in development. I recommend using the alternative solutions above which are production-ready and well-documented.

Would you like me to:
1. Set up Framer Motion for animations?
2. Configure Playwright for visual testing?
3. Create custom automation scripts for these features?