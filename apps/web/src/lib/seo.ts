/**
 * SEO Configuration and Utilities for Projectdes AI Academy
 * ==========================================================
 * 
 * Comprehensive SEO management with multi-language support
 */

import { Metadata } from 'next';

// SEO Configuration
export const seoConfig = {
  siteName: 'Projectdes AI Academy',
  siteUrl: 'https://projectdes.ai',
  defaultTitle: 'Projectdes AI Academy - Transform into an AI Specialist',
  titleTemplate: '%s | Projectdes AI Academy',
  defaultDescription: 'Transform your career with practical AI training. Learn AI Management, No-Code Development, and AI Video Creation with job placement guarantee.',
  defaultImage: 'https://projectdes.ai/og-image.jpg',
  twitterHandle: '@projectdes',
  
  // Multi-language configurations
  locales: {
    ru: {
      title: 'Projectdes AI Academy - Станьте специалистом по ИИ',
      description: 'Трансформируйте свою карьеру с практическим обучением ИИ. Изучайте управление ИИ, разработку без кода и создание ИИ-видео с гарантией трудоустройства.',
      keywords: 'ИИ обучение, искусственный интеллект курсы, no-code разработка, ИИ видео, онлайн образование',
    },
    he: {
      title: 'Projectdes AI Academy - הפוך למומחה AI',
      description: 'שנה את הקריירה שלך עם הכשרת AI מעשית. למד ניהול AI, פיתוח No-Code ויצירת וידאו AI עם הבטחת השמה.',
      keywords: 'הכשרת AI, קורסי בינה מלאכותית, פיתוח no-code, וידאו AI, חינוך מקוון',
    },
    en: {
      title: 'Projectdes AI Academy - Transform into an AI Specialist',
      description: 'Transform your career with practical AI training. Learn AI Management, No-Code Development, and AI Video Creation with job placement guarantee.',
      keywords: 'AI training, artificial intelligence courses, no-code development, AI video, online education',
    },
  },
  
  // Organization structured data
  organization: {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Projectdes AI Academy',
    url: 'https://projectdes.ai',
    logo: 'https://projectdes.ai/logo.png',
    sameAs: [
      'https://www.facebook.com/projectdes',
      'https://www.instagram.com/projectdes',
      'https://www.linkedin.com/company/projectdes',
      'https://www.youtube.com/@projectdes',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-234-567-8900',
      contactType: 'customer service',
      availableLanguage: ['Russian', 'Hebrew', 'English'],
    },
  },
};

// Generate metadata for pages
export function generateMetadata({
  title,
  description,
  image,
  url,
  locale = 'en',
  type = 'website',
  noindex = false,
  keywords,
  author,
  publishedTime,
  modifiedTime,
}: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  locale?: 'ru' | 'he' | 'en';
  type?: 'website' | 'article' | 'course';
  noindex?: boolean;
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const localeConfig = seoConfig.locales[locale];
  const pageTitle = title || localeConfig.title;
  const pageDescription = description || localeConfig.description;
  const pageImage = image || seoConfig.defaultImage;
  const pageUrl = url || seoConfig.siteUrl;
  const pageKeywords = keywords || localeConfig.keywords;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    authors: author ? [{ name: author }] : undefined,
    
    // Open Graph
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: seoConfig.siteName,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      locale: locale === 'ru' ? 'ru_RU' : locale === 'he' ? 'he_IL' : 'en_US',
      type: type as any,
      publishedTime,
      modifiedTime,
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      creator: seoConfig.twitterHandle,
      site: seoConfig.twitterHandle,
    },
    
    // Robots
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Alternate languages
    alternates: {
      canonical: pageUrl,
      languages: {
        'ru': `${seoConfig.siteUrl}/ru`,
        'he': `${seoConfig.siteUrl}/he`,
        'en': `${seoConfig.siteUrl}/en`,
      },
    },
    
    // Verification
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      other: {
        'facebook-domain-verification': process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION || '',
      },
    },
  };
}

// Generate course structured data
export function generateCourseSchema({
  name,
  description,
  provider,
  url,
  image,
  price,
  currency = 'USD',
  duration,
  startDate,
  endDate,
  instructor,
  language = 'en',
  courseMode = 'online',
  rating,
  reviewCount,
}: {
  name: string;
  description: string;
  provider?: string;
  url: string;
  image?: string;
  price: number;
  currency?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  instructor?: {
    name: string;
    description?: string;
    image?: string;
  };
  language?: string;
  courseMode?: 'online' | 'onsite' | 'blended';
  rating?: number;
  reviewCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider || 'Projectdes AI Academy',
      sameAs: seoConfig.siteUrl,
    },
    url,
    image: image || seoConfig.defaultImage,
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode,
      duration,
      startDate,
      endDate,
      inLanguage: language,
      instructor: instructor ? {
        '@type': 'Person',
        name: instructor.name,
        description: instructor.description,
        image: instructor.image,
      } : undefined,
    },
    aggregateRating: rating ? {
      '@type': 'AggregateRating',
      ratingValue: rating.toString(),
      reviewCount: reviewCount?.toString(),
      bestRating: '5',
      worstRating: '1',
    } : undefined,
  };
}

// Generate FAQ structured data
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Generate person structured data (for instructors)
export function generatePersonSchema({
  name,
  description,
  image,
  jobTitle,
  worksFor,
  sameAs,
}: {
  name: string;
  description?: string;
  image?: string;
  jobTitle?: string;
  worksFor?: string;
  sameAs?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    description,
    image,
    jobTitle,
    worksFor: worksFor ? {
      '@type': 'Organization',
      name: worksFor,
    } : undefined,
    sameAs,
  };
}

// Generate local business structured data
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Projectdes AI Academy',
    image: seoConfig.defaultImage,
    '@id': seoConfig.siteUrl,
    url: seoConfig.siteUrl,
    telephone: '+1-234-567-8900',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 AI Street',
      addressLocality: 'Tech City',
      postalCode: '12345',
      addressCountry: 'US',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
      ],
      opens: '09:00',
      closes: '18:00',
    },
    priceRange: '$$',
  };
}

// Generate video structured data
export function generateVideoSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  contentUrl,
  embedUrl,
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  contentUrl?: string;
  embedUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    uploadDate,
    duration,
    contentUrl,
    embedUrl,
    publisher: {
      '@type': 'Organization',
      name: 'Projectdes AI Academy',
      logo: {
        '@type': 'ImageObject',
        url: `${seoConfig.siteUrl}/logo.png`,
      },
    },
  };
}

// Canonical URL generator
export function generateCanonicalUrl(path: string, locale?: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const localePath = locale && locale !== 'en' ? `/${locale}` : '';
  return `${seoConfig.siteUrl}${localePath}${cleanPath}`;
}

// Social meta tags generator
export function generateSocialMeta({
  title,
  description,
  image,
  url,
}: {
  title: string;
  description: string;
  image?: string;
  url: string;
}) {
  return {
    'og:title': title,
    'og:description': description,
    'og:image': image || seoConfig.defaultImage,
    'og:url': url,
    'og:type': 'website',
    'og:site_name': seoConfig.siteName,
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image || seoConfig.defaultImage,
    'twitter:site': seoConfig.twitterHandle,
    'twitter:creator': seoConfig.twitterHandle,
  };
}

export default {
  seoConfig,
  generateMetadata,
  generateCourseSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generatePersonSchema,
  generateLocalBusinessSchema,
  generateVideoSchema,
  generateCanonicalUrl,
  generateSocialMeta,
};