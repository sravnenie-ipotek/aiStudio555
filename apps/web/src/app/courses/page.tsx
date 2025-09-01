/**
 * Courses Catalog Page - ProjectDes AI Academy
 * ==========================================
 * 
 * High-conversion course catalog page based on TeachMeSkills architecture analysis
 * Features: Authority-first hero, advanced filtering, conversion optimization
 * 
 * Performance Targets:
 * - LCP < 2.5s, FID < 100ms, CLS < 0.1
 * - Mobile score >90, Desktop >95
 * 
 * Conversion Targets:
 * - Course enrollment rate: 5-8%
 * - Consultation request rate: 12-15%
 * - Catalog engagement: 60%+
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Components - Performance: Use dynamic imports for heavy components
import { CoursesHero } from '@/components/sections/CoursesHero';

// Dynamic import for CoursesCatalog - it's heavy with filtering logic
const CoursesCatalog = dynamic(
  () => import('@/components/sections/CoursesCatalog').then(mod => ({ default: mod.CoursesCatalog })),
  {
    loading: () => (
      <div className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200 rounded animate-pulse mb-6 max-w-2xl mx-auto" />
            <div className="h-6 bg-gray-100 rounded animate-pulse max-w-3xl mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 h-96 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    ),
    ssr: false // Client-side only for better initial load performance
  }
);
// import { SocialProofSection } from '@/components/sections/SocialProofSection';
// import { FAQSection } from '@/components/sections/FAQSection';
// import { ConsultationForm } from '@/components/forms/ConsultationForm';

// Types and API
import type { Course } from '@/types/course';
import type { CourseData, CategoryData } from '@aistudio555/types';

// Local type definitions  
interface HeroMetrics {
  graduateCount: number;
  yearsInOperation: number;
  successRate: number;
  averageSalaryIncrease: number;
  coursesAvailable: number;
  partnersCount: number;
}

// Use CourseData for multi-language content
type ExtendedCourse = Course & {
  title: { ru?: string; en?: string; he?: string } | string;
  shortDescription?: { ru?: string; en?: string; he?: string } | string;
  slug?: string;
  pricing?: {
    fullPrice: number;
    discountedPrice?: number;
  };
};

// Loading components
// import { CoursesHeroSkeleton } from '@/components/skeletons/CoursesHeroSkeleton';
// import { CoursesCatalogSkeleton } from '@/components/skeletons/CoursesCatalogSkeleton';

/**
 * SEO Metadata Generation
 * Optimized for Russian, English, and Hebrew markets
 */
export async function generateMetadata(): Promise<Metadata> {
  const coursesCount = await getCourseCount();
  
  return {
    title: `AI Курсы Online - ${coursesCount} программ обучения | ProjectDes Academy`,
    description: 'Изучайте искусственный интеллект с нуля до профи. Практические курсы от экспертов индустрии с гарантированным трудоустройством. 12,000+ выпускников, 87% трудоустройство.',
    
    keywords: [
      'AI курсы',
      'курсы искусственного интеллекта',
      'обучение machine learning',
      'Data Science курсы',
      'онлайн образование AI',
      'курсы программирования AI',
      'AI Transformation Manager',
      'No-Code разработка',
      'AI видео генерация',
      'ProjectDes Academy',
      'трудоустройство IT',
      'персональное менторство'
    ],
    
    openGraph: {
      title: 'AI Курсы для карьерного роста - ProjectDes Academy',
      description: `Практические курсы AI с гарантированным трудоустройством. 12,000+ выпускников, 87% трудоустройство в 5+ странах мира.`,
      images: [
        {
          url: '/images/courses/courses-og-image-1200x630.jpg',
          width: 1200,
          height: 630,
          alt: 'AI Курсы ProjectDes Academy - Практическое обучение с трудоустройством'
        }
      ],
      type: 'website',
      locale: 'ru_RU',
      siteName: 'ProjectDes Academy'
    },
    
    twitter: {
      card: 'summary_large_image',
      title: 'AI Курсы Online - ProjectDes Academy',
      description: 'Изучайте AI с нуля. Гарантированное трудоустройство в 5+ странах. 12K+ выпускников.',
      images: ['/images/courses/courses-twitter-1200x600.jpg']
    },
    
    alternates: {
      canonical: '/courses',
      languages: {
        'ru': '/courses',
        'en': '/en/courses',
        'he': '/he/courses'
      }
    },
    
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default'
    }
  };
}

/**
 * Structured Data for SEO
 * Implements ItemList and Course schema markup for rich results
 * TODO: Fix type mismatches with ExtendedCourse structure
 */
function generateJsonLd(courses: any[], heroMetrics: HeroMetrics) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://projectdes.academy';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI Курсы - ProjectDes Academy',
    description: 'Каталог курсов по искусственному интеллекту с практическими проектами и гарантированным трудоустройством',
    url: `${baseUrl}/courses`,
    numberOfItems: courses.length,
    
    // Organization context
    mainEntity: {
      '@type': 'Organization',
      name: 'ProjectDes Academy',
      description: 'Ведущая академия AI образования с практическими курсами и гарантией трудоустройства',
      url: baseUrl,
      logo: `${baseUrl}/images/logo/projectdes-logo-512x512.png`,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 4.8,
        reviewCount: heroMetrics.graduateCount,
        bestRating: 5
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+7-495-123-45-67',
        contactType: 'customer support',
        availableLanguage: ['Russian', 'English', 'Hebrew']
      }
    },
    
    // Course list items
    itemListElement: courses.map((course, index) => ({
      '@type': 'Course',
      position: index + 1,
      name: typeof course.title === 'string' 
        ? course.title 
        : (course.title.ru || course.title.en || course.slug || ''),
      description: typeof course.shortDescription === 'string'
        ? course.shortDescription
        : (course.shortDescription?.ru || course.shortDescription?.en || ''),
      url: `${baseUrl}/courses/${course.slug}`,
      
      provider: {
        '@type': 'Organization',
        name: 'ProjectDes Academy',
        sameAs: baseUrl
      },
      
      offers: {
        '@type': 'Offer',
        price: course.pricing?.discountedPrice || course.pricing?.fullPrice || 0,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        validFrom: new Date().toISOString(),
        validThrough: course.enrollmentDeadline ? new Date(course.enrollmentDeadline).toISOString() : undefined,
        category: course.category.name.ru || course.category.name.en
      },
      
      courseMode: course.format === 'ONLINE' ? 'online' : 'blended',
      educationalLevel: course.level.toLowerCase(),
      teaches: course.skillsLearned || [],
      timeRequired: `P${course.duration.weeks}W`,
      
      // Additional schema properties
      aggregateRating: course.averageRating ? {
        '@type': 'AggregateRating',
        ratingValue: course.averageRating,
        reviewCount: course.totalStudents,
        bestRating: 5
      } : undefined,
      
      instructor: course.instructor ? {
        '@type': 'Person',
        name: course.instructor.name,
        description: course.instructor.bio || '',
        image: course.instructor.avatar || undefined
      } : undefined
    }))
  };
}

/**
 * Data Fetching Functions
 * Optimized for performance with proper error handling
 */
async function getCourses(): Promise<Course[]> {
  try {
    // Performance: Use proper API endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/courses?limit=50&featured=true`, {
      next: { revalidate: 1800 }, // 30 minutes
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'public, max-age=1800'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.courses || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    // Performance: Return fallback data to prevent empty page
    return [
      {
        id: '1',
        title: { ru: 'AI Transformation Manager', en: 'AI Transformation Manager' },
        shortDescription: { ru: 'Станьте экспертом по внедрению ИИ в бизнес-процессы', en: 'Become an expert in implementing AI in business processes' },
        price: 1000,
        discountedPrice: 800,
        level: 'Beginner',
        duration: { weeks: 12 },
        category: { id: '1', name: { ru: 'AI и Машинное обучение', en: 'AI & Machine Learning' } },
        isActive: true,
        averageRating: 4.8,
        studentCount: 1200,
        createdAt: new Date().toISOString(),
        slug: 'ai-transformation-manager'
      },
      {
        id: '2',
        title: { ru: 'No-Code Website Development', en: 'No-Code Website Development' },
        shortDescription: { ru: 'Создавайте сайты без кода с помощью современных инструментов', en: 'Create websites without code using modern tools' },
        price: 1200,
        level: 'Beginner',
        duration: { weeks: 8 },
        category: { id: '2', name: { ru: 'Веб-разработка', en: 'Web Development' } },
        isActive: true,
        averageRating: 4.7,
        studentCount: 800,
        createdAt: new Date().toISOString(),
        slug: 'no-code-development'
      }
    ];
  }
}

async function getCategories(): Promise<any[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/courses/categories`, {
      next: { revalidate: 3600 }, // 1 hour
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Performance: Return fallback categories
    return [
      { id: '1', name: { ru: 'AI и Машинное обучение', en: 'AI & Machine Learning' } },
      { id: '2', name: { ru: 'Веб-разработка', en: 'Web Development' } },
      { id: '3', name: { ru: 'Дизайн', en: 'Design' } }
    ];
  }
}

async function getCourseCount(): Promise<number> {
  try {
    const courses = await getCourses();
    return courses.length;
  } catch (error) {
    return 25; // Fallback count for SEO
  }
}

/**
 * Hero Metrics Configuration
 * Based on business requirements and analytics data
 */
const heroMetrics: HeroMetrics = {
  graduateCount: 12000,
  yearsInOperation: 8,
  successRate: 87,
  averageSalaryIncrease: 150,
  coursesAvailable: 25,
  partnersCount: 50
};

/**
 * Main Courses Page Component
 * Server-side rendered with performance optimizations
 */
export default async function CoursesPage() {
  // Parallel data fetching for optimal performance
  const [courses, categories] = await Promise.all([
    getCourses(),
    getCategories()
  ]);

  // Generate structured data
  const structuredData = generateJsonLd(courses, heroMetrics);

  return (
    <main className="min-h-screen bg-white">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      {/* Hero Section - Above the fold priority */}
      <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
        <CoursesHero 
          metrics={heroMetrics}
          className="animate-fade-in-up"
        />
      </Suspense>

      {/* Course Catalog - Main content area - Performance: Dynamic loading */}
      <Suspense fallback={
        <div className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="h-12 bg-gray-200 rounded animate-pulse mb-6 max-w-2xl mx-auto" />
              <div className="h-6 bg-gray-100 rounded animate-pulse max-w-3xl mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-100 h-96 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      }>
        <CoursesCatalog 
          courses={courses}
          categories={categories}
          className="animate-fade-in-up animation-delay-200"
        />
      </Suspense>

      {/* Social Proof Section - Builds trust and credibility */}
      {/* <Suspense fallback={<div className="h-64 bg-gray-50 animate-pulse" />}>
        <SocialProofSection 
          metrics={heroMetrics}
          className="animate-fade-in-up animation-delay-400"
        />
      </Suspense> */}

      {/* FAQ Section - Handles objections and builds trust */}
      {/* <Suspense fallback={<div className="h-96 bg-white animate-pulse" />}>
        <FAQSection className="animate-fade-in-up animation-delay-600" />
      </Suspense> */}

      {/* Consultation Form - Conversion-optimized lead capture */}
      <section 
        id="consultation-form" 
        className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50 animate-fade-in-up animation-delay-800"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Не нашли подходящий курс?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Получите персональную консультацию и подберем программу обучения под ваши цели и опыт
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
              {/* <ConsultationForm 
                source="courses_page"
                variant="detailed"
                className="max-w-2xl mx-auto"
              /> */}
              <p className="text-center text-gray-500">Consultation form will be added soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prefetch critical resources for performance */}
      <link
        rel="preload"
        href="/fonts/rubik-variable.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
    </main>
  );
}

/**
 * Page Configuration for Next.js
 * Optimizes runtime behavior and caching
 */
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
// Performance: Optimize caching strategy
export const dynamic = 'force-static'; // Static generation for performance
export const revalidate = 1800; // Revalidate every 30 minutes

// Performance budget warnings
if (process.env.NODE_ENV === 'development') {
  console.log('🟡 Performance targets for courses page:');
  console.log('   LCP < 2.5s, FID < 100ms, CLS < 0.1');
  console.log('   Bundle size budget: <170KB JS (gzipped)');
  console.log('   API response time: <200ms p95');
}