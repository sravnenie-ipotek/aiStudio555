/**
 * Style System Exports
 * Design tokens and style utilities
 */

export const colors = {
  primary: {
    blue: '#635bff',
    yellow: '#FFDA17',
  },
  background: {
    light: '#f8fafc',
    dark: '#0f172a',
  },
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    muted: '#94a3b8',
  },
  border: {
    default: '#e2e8f0',
    focus: '#635bff',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
} as const;

export const spacing = {
  xs: '0.5rem', // 8px
  sm: '1rem', // 16px
  md: '1.5rem', // 24px
  lg: '2rem', // 32px
  xl: '3rem', // 48px
  '2xl': '4rem', // 64px
  '3xl': '6rem', // 96px
} as const;

export const typography = {
  fonts: {
    body: 'Rubik, system-ui, sans-serif',
    heading: 'Rubik, system-ui, sans-serif',
    mono: 'ui-monospace, monospace',
  },
  sizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.375rem', // 22px
    '2xl': '1.75rem', // 28px
    '3xl': '2.5rem', // 40px
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.45,
    relaxed: 1.75,
  },
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
} as const;

export const radii = {
  none: '0',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '1rem',
  full: '9999px',
} as const;
