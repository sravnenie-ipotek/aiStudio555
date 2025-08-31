# Tailwind Configuration Example

This file contains the Tailwind configuration that should be placed in your project root or config folder.

## Installation Location

Place this configuration at one of these locations:
- `/apps/web/tailwind.config.js` (for Next.js app)
- `/config/tailwind.config.js` (for shared configuration)
- `/packages/ui/tailwind.config.js` (for UI package in monorepo)

## Configuration Content

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom Colors - EXACT from baseDesign.md
      colors: {
        // Primary Yellow System
        'primary-yellow': '#FFDA17',
        'primary-yellow-alt': '#FFDF17',
        'yellow-light': '#FDDD09',
        'yellow-dark': '#FFBD00',
        'yellow-hover': '#E2C528',
        'nav-yellow': '#FBDC0C',

        // Dark Colors
        'dark-pure': '#000000',
        'dark-header': '#111111',
        'dark-secondary': '#191919',
        'dark-footer': '#212426',
        'dark-gray': '#303030',

        // Light Colors
        'light-bg': '#F4F5F7',
        white: '#FFFFFF',

        // Text Colors
        'text-primary': '#070707',
        'text-secondary': '#333333',
        'text-gray': '#7A7A7A',
        'text-light': '#A1A1A1',

        // UI Colors
        'border-gray': '#BFC2C5',
        'border-light': '#DFE3E5',
        'surface-gray': '#DFE3E5',
        'surface-light': '#EEEEEE',

        // Accent Colors
        'accent-blue': '#5EA0FF',
        'accent-light-blue': '#C7D2E9',
        success: '#00B67A',
        error: '#FF3B30',
      },

      // Typography
      fontFamily: {
        'rubik': ['Rubik', 'system-ui', 'sans-serif'],
      },
      
      fontSize: {
        'xxs': ['0.625rem', { lineHeight: '0.875rem' }],   // 10px
        'xs': ['0.75rem', { lineHeight: '1rem' }],         // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],     // 14px
        'base': ['1rem', { lineHeight: '1.45rem' }],       // 16px
        'lg': ['1.125rem', { lineHeight: '1.5rem' }],      // 18px
        'xl': ['1.25rem', { lineHeight: '1.625rem' }],     // 20px
        '2xl': ['1.375rem', { lineHeight: '1.75rem' }],    // 22px
        '3xl': ['1.5rem', { lineHeight: '1.875rem' }],     // 24px
        '4xl': ['1.75rem', { lineHeight: '2.125rem' }],    // 28px
        '5xl': ['2rem', { lineHeight: '2.375rem' }],       // 32px
        '6xl': ['2.25rem', { lineHeight: '2.625rem' }],    // 36px
        '7xl': ['2.5rem', { lineHeight: '2.875rem' }],     // 40px
        '8xl': ['2.75rem', { lineHeight: '3.125rem' }],    // 44px
        '9xl': ['3rem', { lineHeight: '3.375rem' }],       // 48px
      },

      // 8px unit spacing system
      spacing: {
        '0': '0px',
        '1': '8px',
        '2': '16px',
        '3': '24px',
        '4': '32px',
        '5': '40px',
        '6': '48px',
        '7': '56px',
        '8': '64px',
        '9': '72px',
        '10': '80px',
        '11': '88px',
        '12': '96px',
        '13': '104px',
        '14': '112px',
        '15': '120px',
        '16': '128px',
        '20': '160px',
        '24': '192px',
        '32': '256px',
        '40': '320px',
        '48': '384px',
        '56': '448px',
        '64': '512px',
      },

      // Other configuration continues...
    },
  },
  plugins: [],
}
```

## Important Notes

1. This configuration must be in the actual project code, NOT in the documentation folder
2. The `/docs/` folder should only contain markdown documentation
3. Update paths in the `content` array to match your project structure
4. Install Tailwind CSS and its dependencies in your project before using this config