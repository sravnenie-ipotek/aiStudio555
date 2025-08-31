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

      // Typography - Rubik Font
      fontFamily: {
        rubik: ['Rubik', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Arial', 'sans-serif'],
        sans: ['Rubik', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Arial', 'sans-serif'],
      },

      // Font Sizes - EXACT from design
      fontSize: {
        10: '10px',
        11: '11px',
        12: '12px',
        14: '14px',
        16: '16px',
        18: '18px',
        20: '20px',
        24: '24px',
        26: '26px',
        28: '28px',
        33: '33px',
        36: '36px',
        40: '40px',
        48: '48px',
      },

      // Line Heights
      lineHeight: {
        'tight-ultra': '0.95',
        compact: '1.1',
        heading: '1.2',
        'relaxed-heading': '1.3',
        normal: '1.4',
        body: '1.45',
        loose: '1.5',
        paragraph: '1.6',
      },

      // Spacing - 8px base unit system
      spacing: {
        0: '0px',
        1: '8px', // Base unit
        2: '16px', // 2 units
        3: '24px', // 3 units
        4: '32px', // 4 units
        5: '40px', // 5 units
        6: '48px', // 6 units
        7: '56px', // 7 units
        8: '64px', // 8 units
        9: '72px', // 9 units
        10: '80px', // 10 units
        11: '88px', // 11 units
        12: '96px', // 12 units

        // Custom spacing values
        '14px': '14px', // Button padding
        '32px': '32px', // Button padding
        '48px': '48px', // Min height
        '56px': '56px', // Large button height
        1160: '1160px', // Container width
        1200: '1200px', // Wide container
      },

      // Border Radius - EXACT values
      borderRadius: {
        none: '0',
        sm: '4px',
        base: '6px',
        md: '8px',
        lg: '12px',
        xl: '15px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
        full: '9999px',
      },

      // Box Shadows - Custom shadows
      boxShadow: {
        card: '0px 0px 10px 0px rgba(89, 88, 88, 0.1)',
        'card-hover': '0px 5px 20px 0px rgba(89, 88, 88, 0.15)',
        'button-hover': '0 6px 20px rgba(255, 218, 23, 0.4)',
        'button-dark': '0 6px 20px rgba(0, 0, 0, 0.2)',
        'focus-yellow': '0 0 0 3px rgba(255, 218, 23, 0.1)',
        'focus-error': '0 0 0 3px rgba(255, 59, 48, 0.1)',
      },

      // Min Heights
      minHeight: {
        36: '36px',
        44: '44px', // Touch target
        48: '48px', // Standard button
        56: '56px', // Large button
      },

      // Max Widths
      maxWidth: {
        420: '420px', // Form width
        620: '620px', // Content width
        960: '960px', // Medium content
        1160: '1160px', // Main container
        1200: '1200px', // Wide container
      },

      // Transitions
      transitionDuration: {
        100: '100ms',
        200: '200ms', // Default
        300: '300ms',
        500: '500ms',
        800: '800ms',
      },

      // Animations
      animation: {
        slideIn: 'slideIn 0.2s ease-in-out',
        fadeIn: 'fadeIn 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        skeleton: 'skeleton 1.5s ease-in-out infinite',
        focusBounce: 'focusBounce 0.3s ease-out',
      },

      keyframes: {
        slideIn: {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        skeleton: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        focusBounce: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.01)' },
          '100%': { transform: 'scale(1)' },
        },
      },

      // Background Gradients
      backgroundImage: {
        'yellow-gradient': 'linear-gradient(160deg, #FFDA17 0%, #FFBD00 100%)',
        'dark-gradient': 'linear-gradient(135deg, #111111 0%, #191919 100%)',
        'card-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #F4F5F7 100%)',
      },

      // Z-Index
      zIndex: {
        1: '1',
        10: '10',
        20: '20',
        30: '30',
        40: '40',
        50: '50',
        100: '100',
        1000: '1000',
      },
    },

    // Responsive breakpoints - EXACT from design
    screens: {
      xs: '480px', // Small Mobile
      sm: '640px', // Mobile
      md: '960px', // Tablet
      lg: '1200px', // Desktop
      xl: '1440px', // Large Desktop
      '2xl': '1920px', // Wide Screen
    },
  },

  plugins: [
    // Custom plugin for additional utilities
    function ({ addUtilities, addComponents, theme }) {
      // Button component styles
      addComponents({
        '.btn-primary': {
          padding: '14px 32px',
          minHeight: '48px',
          backgroundColor: theme('colors.primary-yellow'),
          color: theme('colors.text-primary'),
          fontSize: '16px',
          fontWeight: '700',
          borderRadius: '12px',
          transition: 'all 0.2s ease-in-out',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: 'none',
          '&:hover': {
            backgroundColor: theme('colors.yellow-hover'),
            transform: 'translateY(-2px)',
            boxShadow: theme('boxShadow.button-hover'),
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
            transform: 'none',
          },
        },

        '.btn-secondary': {
          padding: '14px 32px',
          minHeight: '48px',
          backgroundColor: theme('colors.dark-gray'),
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: '700',
          borderRadius: '12px',
          transition: 'all 0.2s ease-in-out',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: 'none',
          '&:hover': {
            backgroundColor: theme('colors.dark-secondary'),
            transform: 'translateY(-2px)',
            boxShadow: theme('boxShadow.button-dark'),
          },
        },

        '.course-card': {
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid transparent',
          boxShadow: theme('boxShadow.card'),
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme('boxShadow.card-hover'),
            borderColor: theme('colors.primary-yellow'),
          },
        },

        '.form-input': {
          width: '100%',
          padding: '12px 16px',
          minHeight: '48px',
          fontSize: '16px',
          lineHeight: '1.4',
          backgroundColor: '#FFFFFF',
          border: `2px solid ${theme('colors.border-light')}`,
          borderRadius: '8px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: theme('colors.border-gray'),
          },
          '&:focus': {
            borderColor: theme('colors.primary-yellow'),
            boxShadow: theme('boxShadow.focus-yellow'),
            outline: 'none',
          },
          '&:disabled': {
            backgroundColor: theme('colors.light-bg'),
            opacity: '0.6',
            cursor: 'not-allowed',
          },
        },
      });

      // Custom utilities
      addUtilities({
        '.text-balance': {
          textWrap: 'balance',
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.touch-target': {
          minHeight: '44px',
          minWidth: '44px',
        },
      });
    },
  ],
};
