/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/preline/preline.js',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        lg: '1.5rem',
        xl: '2rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
    },
    extend: {
      // Custom Colors - EXACT from architecture documentation
      colors: {
        // Primary Yellow System - CRITICAL BRAND COLORS
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
        warning: '#FFA500',
        info: '#00B8D4',
        
        // Semantic colors for shadcn/ui compatibility
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      
      // Typography
      fontFamily: {
        rubik: ['Rubik', 'system-ui', 'sans-serif'],
        sans: ['Rubik', 'system-ui', 'sans-serif'],
      },
      
      fontSize: {
        xxs: ['0.625rem', { lineHeight: '0.875rem' }],   // 10px
        xs: ['0.75rem', { lineHeight: '1rem' }],         // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }],     // 14px
        base: ['1rem', { lineHeight: '1.45rem' }],       // 16px
        lg: ['1.125rem', { lineHeight: '1.5rem' }],      // 18px
        xl: ['1.25rem', { lineHeight: '1.625rem' }],     // 20px
        '2xl': ['1.375rem', { lineHeight: '1.75rem' }],  // 22px
        '3xl': ['1.5rem', { lineHeight: '1.875rem' }],   // 24px
        '4xl': ['1.75rem', { lineHeight: '2.125rem' }],  // 28px
        '5xl': ['2rem', { lineHeight: '2.375rem' }],     // 32px
        '6xl': ['2.25rem', { lineHeight: '2.625rem' }],  // 36px
        '7xl': ['2.5rem', { lineHeight: '2.875rem' }],   // 40px
        '8xl': ['2.75rem', { lineHeight: '3.125rem' }],  // 44px
        '9xl': ['3rem', { lineHeight: '3.375rem' }],     // 48px
      },
      
      // 8px unit spacing system (as per architecture)
      spacing: {
        '0': '0px',
        '0.5': '4px',
        '1': '8px',
        '1.5': '12px',
        '2': '16px',
        '2.5': '20px',
        '3': '24px',
        '3.5': '28px',
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
        '18': '144px',
        '20': '160px',
        '24': '192px',
        '28': '224px',
        '32': '256px',
        '36': '288px',
        '40': '320px',
        '44': '352px',
        '48': '384px',
        '52': '416px',
        '56': '448px',
        '60': '480px',
        '64': '512px',
        '72': '576px',
        '80': '640px',
        '96': '768px',
      },
      
      borderRadius: {
        none: '0px',
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
        full: '9999px',
      },
      
      // Animations
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-in-out',
        'fade-out': 'fade-out 0.3s ease-in-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'slide-out': 'slide-out 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-in': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-out': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
      },
      
      // Box shadows
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'card': '0 0 20px rgba(0, 0, 0, 0.1)',
        'button': '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
      },
      
      // Screens for responsive design
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
        '3xl': '1920px',
      },
      
      // Z-index scale
      zIndex: {
        '0': 0,
        '10': 10,
        '20': 20,
        '30': 30,
        '40': 40,
        '50': 50,
        '60': 60,
        '70': 70,
        '80': 80,
        '90': 90,
        '100': 100,
        'dropdown': 1000,
        'sticky': 1020,
        'fixed': 1030,
        'modal-backdrop': 1040,
        'modal': 1050,
        'popover': 1060,
        'tooltip': 1070,
        'notification': 1080,
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
    require('preline/plugin'),
  ],
};