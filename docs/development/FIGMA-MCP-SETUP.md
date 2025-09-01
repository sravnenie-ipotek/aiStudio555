# Figma MCP Setup Guide for AiStudio555

## ✅ Installation Complete

Figma MCP has been successfully installed and configured!

### Installation Details:
- **Package**: `figma-mcp@0.1.4`
- **Location**: `/opt/homebrew/lib/node_modules/figma-mcp`
- **Config**: Added to `/apps/web/.mcp.json`

## 🔐 Configuration Required

To use Figma MCP, you'll need to provide Figma credentials:

### 1. Get Figma Personal Access Token
1. Go to https://www.figma.com/settings
2. Scroll to "Personal access tokens"
3. Click "Generate new token"
4. Give it a name (e.g., "AiStudio555 MCP")
5. Copy the token

### 2. Add to Environment Variables
```bash
# Add to .env.local
FIGMA_ACCESS_TOKEN=your-figma-personal-access-token
FIGMA_FILE_KEY=your-figma-file-key  # Optional: specific file to work with
```

### 3. Finding Your Figma File Key
The file key is in your Figma file URL:
```
https://www.figma.com/file/[FILE_KEY]/File-Name
                            ^^^^^^^^
                            This part
```

## 🎨 What Figma MCP Can Do

### Design Asset Management
- Export components from Figma
- Sync design tokens
- Generate React components from Figma designs
- Keep designs in sync with code

### Example Commands (via MCP)
```javascript
// Once configured, you can:
// - Export icons from Figma
// - Generate color palettes
// - Create component specifications
// - Sync typography settings
```

## 🚀 Usage with Claude Code

Once configured, Claude Code can:
1. **Export Assets**: Pull images, icons, and graphics from Figma
2. **Generate Components**: Create React components based on Figma designs
3. **Sync Styles**: Keep design tokens synchronized
4. **Update Designs**: Reflect code changes back to Figma

## 📋 Quick Setup Checklist

- [x] Install figma-mcp globally
- [x] Add to .mcp.json configuration
- [ ] Get Figma Personal Access Token
- [ ] Add token to .env.local
- [ ] Find your Figma file key
- [ ] Test connection

## 🔄 Alternative: Direct Figma API Usage

If MCP doesn't work as expected, use the Figma API directly:

```bash
# Install Figma API client
pnpm add figma-api
```

```javascript
// utils/figma.js
import { Figma } from 'figma-api';

const figma = new Figma({
  personalAccessToken: process.env.FIGMA_ACCESS_TOKEN
});

// Get file
const file = await figma.getFile('FILE_KEY');

// Export images
const images = await figma.getImages('FILE_KEY', {
  ids: ['node-id'],
  scale: 2,
  format: 'png'
});
```

## 🎯 Next Steps

1. **Create a Figma Design File** for AiStudio555
2. **Set up design tokens** (colors, typography, spacing)
3. **Design components** that match your current React components
4. **Configure MCP** with your credentials
5. **Start syncing** designs with code

## 📝 Notes

- Figma MCP is still in early development (v0.1.4)
- It may have limited functionality compared to direct API usage
- Consider it experimental for now
- Keep manual exports as backup

## 🤝 Need Help?

If you need assistance:
1. Share your Figma file URL
2. Provide the Personal Access Token (keep it secure!)
3. Tell me what design assets you want to sync

---

**Status**: Figma MCP installed ✅ | Configuration pending ⏳