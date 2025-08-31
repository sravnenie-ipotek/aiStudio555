/**
 * Robots.txt Configuration for Projectdes AI Academy
 * ===================================================
 *
 * SEO crawler instructions and sitemap reference
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://projectdes.ai';

  return {
    rules: [
      {
        // Allow all crawlers by default
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // API routes
          '/admin/',         // Admin panel
          '/_next/',         // Next.js internal
          '/dashboard/',     // User dashboard (private)
          '/settings/',      // User settings (private)
          '/checkout/',      // Checkout process
          '/payment/',       // Payment pages
          '/*.json$',        // JSON files
          '/tmp/',           // Temporary files
          '/private/',       // Private content
        ],
        crawlDelay: 1,      // 1 second delay between requests
      },
      {
        // Specific rules for Googlebot
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/dashboard/',
          '/settings/',
        ],
        crawlDelay: 0,      // No delay for Googlebot
      },
      {
        // Specific rules for Googlebot-Image
        userAgent: 'Googlebot-Image',
        allow: [
          '/',
          '/images/',
          '/assets/',
        ],
        disallow: [
          '/private/',
        ],
      },
      {
        // Block bad bots
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'DotBot',
          'MJ12bot',
          'PetalBot',
        ],
        disallow: '/',      // Block entirely
      },
      {
        // Yandex bot (for Russian market)
        userAgent: 'Yandex',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/dashboard/',
        ],
        crawlDelay: 2,
      },
    ],
    sitemap: [
      `${siteUrl}/sitemap.xml`,
      `${siteUrl}/sitemap-index.xml`,
    ],
    host: siteUrl,
  };
}

// Alternative: Generate robots.txt as string
export function generateRobotsTxt(): string {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://projectdes.ai';

  return `# Robots.txt for Projectdes AI Academy
# Generated: ${new Date().toISOString()}

# Default rules for all crawlers
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /dashboard/
Disallow: /settings/
Disallow: /checkout/
Disallow: /payment/
Disallow: /*.json$
Disallow: /tmp/
Disallow: /private/
Crawl-delay: 1

# Googlebot specific rules
User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /dashboard/
Disallow: /settings/
Crawl-delay: 0

# Googlebot-Image specific rules
User-agent: Googlebot-Image
Allow: /
Allow: /images/
Allow: /assets/
Disallow: /private/

# Yandex bot (Russian market)
User-agent: Yandex
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /dashboard/
Crawl-delay: 2

# Bingbot
User-agent: Bingbot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Crawl-delay: 1

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: PetalBot
Disallow: /

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml
Sitemap: ${siteUrl}/sitemap-index.xml

# Host
Host: ${siteUrl}
`;
}
