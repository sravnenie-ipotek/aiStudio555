# Design Fixer Subagent Guide

## ✅ Installation Status

### Successfully Installed:
- ✅ **Figma MCP** (`figma-mcp@0.1.4`) - Design token extraction
- ✅ **Playwright MCP** (`@playwright/mcp@0.0.36`) - Cross-browser testing
- ✅ **axe-core** (`axe-core@4.10.3`) - Accessibility testing library
- ✅ **Storybook a11y addon** (`@storybook/addon-a11y@9.1.3`) - Component accessibility

### Not Available (Using Alternatives):
- ❌ **axe MCP** → Using axe-core directly with custom utilities
- ❌ **Storybook MCP** → Using Storybook CLI and addons
- ❌ **UI/UX MCP** → Using shadcn/ui and custom components

## 🎨 Design Fixer Subagent

The design-fixer subagent is a world-class design professional that:
- Fixes designs WITHOUT changing their core visual style
- Ensures WCAG 2.2 AA/AAA compliance
- Maintains pixel-perfect implementation
- Preserves design system consistency

### Location
```
/.claude/agents/design-fixer.md
```

### Activation
The subagent auto-activates when:
- UI/UX issues are detected
- Accessibility problems found
- Design inconsistencies identified
- Component quality needs improvement

You can also manually invoke it:
```
Use the design-fixer agent to audit and fix the DistanceLearning component
```

## 🛠️ Available Tools & Integration

### 1. Figma Dev Mode MCP
**Status**: ✅ Installed
**Command**: `figma-mcp`
**Configuration**: `/apps/web/.mcp.json`

**Setup Required**:
```bash
# Add to .env.local
FIGMA_ACCESS_TOKEN=your-figma-personal-access-token
FIGMA_FILE_KEY=your-figma-file-key
```

**Usage in Subagent**:
```javascript
// Pull design tokens
"Figma: get tokens from [frame/page]"

// Check spacing
"Figma: verify spacing for [component]"

// Get colors
"Figma: list color styles used in [section]"

// Compare with code
"Figma: compare [component] with code"
```

### 2. Accessibility Testing (axe-core)
**Status**: ✅ Installed as library
**Location**: `/apps/web/src/utils/accessibility.ts`

**Features**:
- WCAG 2.2 AA/AAA compliance checking
- Color contrast validation
- Focus indicator testing
- ARIA label verification
- HTML report generation

**Usage**:
```typescript
import { runAccessibilityAudit, checkColorContrast } from '@/utils/accessibility';

// Run full audit
const report = await runAccessibilityAudit();

// Check specific element
const report = await runAccessibilityAudit('.hero-section');

// Validate color contrast
const contrast = checkColorContrast('#FFDA17', '#000000', 16);
console.log(contrast.passes.aa); // true/false
```

### 3. Playwright MCP
**Status**: ✅ Installed
**Command**: `playwright-mcp`
**Configuration**: `/apps/web/.mcp.json`

**Capabilities**:
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Responsive viewport testing
- Visual regression testing
- Performance metrics (Core Web Vitals)
- Screenshot capture

**Usage in Subagent**:
```javascript
// Test responsive design
"Playwright: test at 360, 768, 1024, 1440px"

// Visual regression
"Playwright: snapshot and compare [page]"

// Interaction testing
"Playwright: verify all buttons clickable"

// Performance metrics
"Playwright: measure Core Web Vitals"
```

### 4. Storybook Integration
**Status**: ✅ Addon installed
**Package**: `@storybook/addon-a11y`

**Features**:
- Component isolation
- Accessibility panel
- Visual testing
- Component documentation

**Usage**:
```bash
# Start Storybook
pnpm storybook

# Build Storybook
pnpm build-storybook
```

### 5. shadcn/ui MCP
**Status**: ✅ Already configured
**Command**: `npx shadcn@latest mcp`

**Usage**:
```bash
# Add components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

## 📋 Design Audit Workflow

When the design-fixer subagent is invoked, it follows this workflow:

### 1. Initial Audit Phase
```yaml
steps:
  1. Pull design tokens from Figma
  2. Run accessibility audit with axe-core
  3. Test viewports with Playwright (360px, 768px, 1024px, 1440px)
  4. Check component consistency
  5. Analyze against design system
```

### 2. Design Token Verification
```yaml
checks:
  - Colors: Exact hex/rgb from Figma
  - Typography: Font sizes, weights, line-heights
  - Spacing: 8px grid system compliance
  - Shadows: Blur, spread, color accuracy
  - Border radius: Consistency
  - Z-index: Proper layering
```

### 3. Accessibility Fixes
```yaml
critical:
  - Color contrast < 4.5:1
  - Missing alt text
  - Broken keyboard navigation
  - No focus indicators
  - Missing ARIA labels

high:
  - Screen reader issues
  - Form validation not announced
  - Loading states not communicated
  - Motion without prefers-reduced-motion
```

### 4. Responsive Testing
```yaml
breakpoints:
  mobile: [360px, 390px, 414px]
  tablet: [768px, 834px]
  desktop: [1024px, 1280px, 1440px]
  wide: [1920px, 2560px]

issues:
  - Text overflow
  - Image scaling
  - Touch targets < 44x44px
  - Horizontal scroll
  - Layout shifts
```

## 🎯 Example Commands

### Full Design Audit
```
Use the design-fixer agent to perform a comprehensive audit of the homepage
```

### Component Fix
```
Use the design-fixer agent to fix accessibility issues in the CourseCard component without changing its visual style
```

### Responsive Check
```
Use the design-fixer agent to verify responsive behavior of the navigation menu
```

### Color Contrast Fix
```
Use the design-fixer agent to fix color contrast issues while maintaining the yellow brand color
```

## 📊 Quality Metrics

The design-fixer subagent ensures:

### Visual Fidelity ✓
- Colors match Figma exactly
- Typography matches specs
- Spacing follows 8px grid
- Shadows pixel-perfect
- Icons sized correctly

### Accessibility ✓
- WCAG 2.2 AA compliant
- Keyboard navigation works
- Screen reader tested
- Focus indicators visible
- Motion respects preferences

### Responsiveness ✓
- No horizontal scroll
- Text remains readable
- Touch targets ≥ 44x44px
- Images scale properly
- Layouts adapt smoothly

### Consistency ✓
- All buttons match
- Forms uniform
- Cards consistent
- Navigation patterns same
- Error states match

### Performance ✓
- Core Web Vitals pass
- Images optimized
- Animations smooth (60fps)
- No layout shifts
- Fast interaction response

## 🚀 Quick Start Checklist

1. **Configure Figma Access**:
   ```bash
   # Add to .env.local
   FIGMA_ACCESS_TOKEN=your-token
   FIGMA_FILE_KEY=your-file-key
   ```

2. **Test Accessibility Utilities**:
   ```typescript
   // In your component
   import { runAccessibilityAudit } from '@/utils/accessibility';
   
   useEffect(() => {
     if (process.env.NODE_ENV === 'development') {
       runAccessibilityAudit().then(report => {
         console.log('Accessibility Report:', report);
       });
     }
   }, []);
   ```

3. **Invoke Design Fixer**:
   ```
   Use the design-fixer agent to audit and fix [component/page]
   ```

## 📝 Notes

- The design-fixer subagent preserves existing styles while fixing issues
- It never changes core visual identity or brand colors
- All fixes are validated against design tokens from Figma
- Accessibility is prioritized without sacrificing aesthetics
- Performance optimizations maintain visual quality

## 🔧 Troubleshooting

### Figma MCP Not Connecting
- Verify Personal Access Token is valid
- Check file key is correct
- Ensure you have viewer access to the Figma file

### Playwright MCP Timeout
- Check if browsers are installed: `npx playwright install`
- Verify system has enough resources
- Try reducing concurrent browser instances

### Accessibility Tests Failing
- Ensure axe-core is imported correctly
- Check that DOM is fully loaded before testing
- Verify no conflicting accessibility libraries

### Component Inconsistencies
- Review design system documentation
- Check Tailwind configuration
- Verify component props match design tokens

---

**Status**: Design Fixer System Ready ✅ | All core tools installed and configured