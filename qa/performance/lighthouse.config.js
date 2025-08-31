module.exports = {
  ci: {
    collect: {
      // Where to run Lighthouse CI
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/programs',
        'http://localhost:3000/programs/ai-manager',
        'http://localhost:3000/about',
        'http://localhost:3000/contact',
        'http://localhost:3000/auth/login',
        'http://localhost:3000/auth/register',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/dashboard/courses',
      ],
      numberOfRuns: 3,
      startServerCommand: 'pnpm --filter web dev',
      startServerReadyPattern: 'ready on',
      settings: {
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
        screenEmulation: {
          mobile: false,
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
        },
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:pwa': ['warn', { minScore: 0.7 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
        
        // Additional metrics
        'interactive': ['error', { maxNumericValue: 3800 }],
        'max-potential-fid': ['error', { maxNumericValue: 130 }],
        'server-response-time': ['error', { maxNumericValue: 600 }],
        
        // Resource optimization
        'uses-optimized-images': 'error',
        'uses-text-compression': 'error',
        'uses-rel-preconnect': 'warn',
        'font-display': 'warn',
        'unused-javascript': ['warn', { maxNumericValue: 100000 }],
        'unused-css-rules': ['warn', { maxNumericValue: 50000 }],
        
        // Security
        'is-on-https': 'error',
        'no-vulnerable-libraries': 'error',
        
        // Accessibility
        'aria-valid-attr': 'error',
        'button-name': 'error',
        'color-contrast': 'error',
        'duplicate-id': 'error',
        'heading-order': 'warn',
        'html-lang': 'error',
        'image-alt': 'error',
        'link-name': 'error',
        'meta-viewport': 'error',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    server: {
      // Port for LHCI server
      port: 9001,
      storage: {
        storageMethod: 'sql',
        sqlDatabasePath: './lhci.db',
      },
    },
  },
};