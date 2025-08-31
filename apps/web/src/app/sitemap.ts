/**
 * Dynamic Sitemap Generator for Projectdes AI Academy
 * ====================================================
 *
 * Generates XML sitemap with all pages and courses
 */

import { MetadataRoute } from 'next';

// Define site URL
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://projectdes.ai';

// Static pages with their change frequency and priority
const staticPages = [
  {
    url: '',
    changeFrequency: 'daily' as const,
    priority: 1.0,
    lastModified: new Date(),
  },
  {
    url: '/programs',
    changeFrequency: 'weekly' as const,
    priority: 0.9,
    lastModified: new Date(),
  },
  {
    url: '/about',
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    lastModified: new Date(),
  },
  {
    url: '/contact',
    changeFrequency: 'monthly' as const,
    priority: 0.6,
    lastModified: new Date(),
  },
  {
    url: '/auth/login',
    changeFrequency: 'yearly' as const,
    priority: 0.5,
    lastModified: new Date(),
  },
  {
    url: '/auth/register',
    changeFrequency: 'yearly' as const,
    priority: 0.5,
    lastModified: new Date(),
  },
  {
    url: '/privacy',
    changeFrequency: 'yearly' as const,
    priority: 0.3,
    lastModified: new Date(),
  },
  {
    url: '/terms',
    changeFrequency: 'yearly' as const,
    priority: 0.3,
    lastModified: new Date(),
  },
];

// Course pages (would be fetched from database in production)
const coursePages = [
  {
    slug: 'ai-manager',
    lastModified: new Date(),
    priority: 0.9,
  },
  {
    slug: 'no-code',
    lastModified: new Date(),
    priority: 0.9,
  },
  {
    slug: 'ai-video',
    lastModified: new Date(),
    priority: 0.9,
  },
];

// Language variations
const languages = ['en', 'ru', 'he'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static pages for each language
  languages.forEach(lang => {
    staticPages.forEach(page => {
      const url = lang === 'en' ? `${siteUrl}${page.url}` : `${siteUrl}/${lang}${page.url}`;

      sitemapEntries.push({
        url,
        lastModified: page.lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    });
  });

  // Add course pages for each language
  languages.forEach(lang => {
    coursePages.forEach(course => {
      const url =
        lang === 'en'
          ? `${siteUrl}/programs/${course.slug}`
          : `${siteUrl}/${lang}/programs/${course.slug}`;

      sitemapEntries.push({
        url,
        lastModified: course.lastModified,
        changeFrequency: 'weekly',
        priority: course.priority,
      });
    });
  });

  // In production, you would fetch dynamic pages from the database
  // Example:
  // const courses = await fetchCoursesFromDatabase();
  // courses.forEach(course => {
  //   languages.forEach(lang => {
  //     const url = lang === 'en'
  //       ? `${siteUrl}/programs/${course.slug}`
  //       : `${siteUrl}/${lang}/programs/${course.slug}`;
  //
  //     sitemapEntries.push({
  //       url,
  //       lastModified: course.updatedAt,
  //       changeFrequency: 'weekly',
  //       priority: 0.8,
  //     });
  //   });
  // });

  // Sort by priority (highest first)
  sitemapEntries.sort((a, b) => (b.priority || 0) - (a.priority || 0));

  return sitemapEntries;
}

// Alternative: Generate sitemap.xml file directly
export async function generateSitemapXML(): Promise<string> {
  const sitemapData = await sitemap();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${sitemapData
  .map(
    (entry: any) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified?.toISOString() || new Date().toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency || 'weekly'}</changefreq>
    <priority>${entry.priority || 0.5}</priority>
${languages
  .filter(l => l !== 'en')
  .map(
    lang =>
      `    <xhtml:link rel="alternate" hreflang="${lang}" href="${entry.url.replace(siteUrl, `${siteUrl}/${lang}`)}" />`
  )
  .join('\n')}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return xml;
}

// Sitemap index for large sites (optional)
export async function generateSitemapIndex(): Promise<string> {
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${siteUrl}/sitemap-main.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${siteUrl}/sitemap-courses.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${siteUrl}/sitemap-blog.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${siteUrl}/sitemap-images.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

  return sitemapIndex;
}
