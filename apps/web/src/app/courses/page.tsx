import { Metadata } from 'next';
import { CoursesHero } from '@/components/sections/CoursesHero';
import { CoursesCatalog } from '@/components/sections/CoursesCatalog';
import { ConsultationForm } from '@/components/forms/ConsultationForm';
import { CourseData, CategoryData } from '@/types/course';

// Mock data for demonstration (in production, this would come from an API)
const mockCourses: CourseData[] = [
  {
    id: '1',
    slug: 'ai-transformation-manager',
    title: {
      ru: 'AI Transformation Manager',
      en: 'AI Transformation Manager'
    },
    description: {
      ru: 'Станьте экспертом по внедрению AI в бизнес-процессы. Изучите стратегии цифровой трансформации, управление AI-проектами и методы оценки эффективности искусственного интеллекта в корпоративной среде.',
      en: 'Become an expert in implementing AI in business processes. Learn digital transformation strategies, AI project management and methods for evaluating AI effectiveness in corporate environments.'
    },
    shortDescription: {
      ru: 'Изучите стратегии внедрения AI в бизнес и станьте востребованным специалистом по цифровой трансформации',
      en: 'Learn AI implementation strategies for business and become a sought-after digital transformation specialist'
    },
    thumbnail: '/images/courses/ai-manager.jpg',
    thumbnailImage: '/images/courses/ai-manager.jpg',
    keyBenefits: ['AI Strategy', 'Project Management', 'ROI Analysis'],
    targetAudience: ['Business Analysts', 'Project Managers', 'Executives'],
    careerOutcomes: ['AI Strategy Consultant', 'Digital Transformation Manager', 'AI Project Lead'],
    skillsLearned: ['AI Strategy Development', 'Change Management', 'Data Analytics', 'Project Management'],
    features: [],
    format: 'ONLINE' as const,
    price: 1500,
    currency: 'USD',
    discountPrice: 1200,
    paymentPlans: [{
      id: 'plan-1',
      name: 'Monthly',
      installments: 6,
      price: 200,
      interval: 'month'
    }],
    duration: 240,
    durationWeeks: 12,
    hoursPerWeek: 10,
    totalHours: 120,
    studentCount: 2847,
    averageRating: 4.9,
    level: 'INTERMEDIATE' as const,
    language: 'EN' as const,
    categoryId: 'ai-business',
    category: {
      id: 'ai-business',
      slug: 'ai-business',
      name: { ru: 'AI в бизнесе', en: 'AI in Business' },
      children: [],
      order: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    instructorId: '1',
    instructor: {
      id: '1',
      locale: 'EN',
      name: 'Sarah Johnson',
      company: 'AI Strategy Institute',
      bio: 'Expert in AI transformation',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    modules: [],
    enrollments: [],
    reviews: [],
    testimonials: [],
    status: 'PUBLISHED' as const,
    isActive: true,
    isFeatured: true,
    keywords: ['AI', 'transformation', 'management', 'strategy'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    slug: 'no-code-development',
    title: {
      ru: 'No-Code разработка сайтов',
      en: 'No-Code Website Development'
    },
    description: {
      ru: 'Создавайте профессиональные веб-сайты и приложения без программирования. Изучите современные No-Code платформы, дизайн-системы и методы быстрого прототипирования.',
      en: 'Create professional websites and applications without programming. Learn modern No-Code platforms, design systems and rapid prototyping methods.'
    },
    shortDescription: {
      ru: 'Создавайте сайты и приложения без кода, используя современные No-Code платформы',
      en: 'Build websites and apps without code using modern No-Code platforms'
    },
    thumbnail: '/images/courses/no-code.jpg',
    thumbnailImage: '/images/courses/no-code.jpg',
    keyBenefits: ['Rapid Development', 'No Programming', 'Modern Design'],
    targetAudience: ['Entrepreneurs', 'Designers', 'Non-technical Users'],
    careerOutcomes: ['No-Code Developer', 'Web Designer', 'Product Manager'],
    skillsLearned: ['Webflow', 'Bubble', 'Zapier', 'Design Systems'],
    features: [],
    format: 'ONLINE' as const,
    price: 1200,
    currency: 'USD',
    discountPrice: 899,
    paymentPlans: [{
      id: 'plan-2',
      name: 'Monthly',
      installments: 5,
      price: 180,
      interval: 'month'
    }],
    duration: 200,
    durationWeeks: 10,
    hoursPerWeek: 8,
    totalHours: 80,
    studentCount: 1923,
    averageRating: 4.7,
    level: 'BEGINNER' as const,
    language: 'EN' as const,
    categoryId: 'web-development',
    category: {
      id: 'web-development',
      slug: 'web-development',
      name: { ru: 'Веб-разработка', en: 'Web Development' },
      children: [],
      order: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    instructorId: '2',
    instructor: {
      id: '2',
      locale: 'EN',
      name: 'Mike Chen',
      company: 'No-Code Academy',
      bio: 'No-Code expert and educator',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    modules: [],
    enrollments: [],
    reviews: [],
    testimonials: [],
    status: 'PUBLISHED' as const,
    isActive: true,
    isFeatured: true,
    keywords: ['no-code', 'web development', 'design'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    slug: 'ai-video-generation',
    title: {
      ru: 'AI видео и аватар генерация',
      en: 'AI Video & Avatar Generation'
    },
    description: {
      ru: 'Освойте создание AI-контента для видео и виртуальных аватаров. Изучите современные инструменты генерации видео, технологии deepfake и создание интерактивных цифровых персонажей.',
      en: 'Master creating AI content for video and virtual avatars. Learn modern video generation tools, deepfake technologies and creating interactive digital characters.'
    },
    shortDescription: {
      ru: 'Создавайте AI-видео и виртуальных аватаров с помощью современных технологий',
      en: 'Create AI videos and virtual avatars using cutting-edge technologies'
    },
    thumbnail: '/images/courses/ai-video.jpg',
    thumbnailImage: '/images/courses/ai-video.jpg',
    keyBenefits: ['AI Video Creation', 'Avatar Development', 'Content Generation'],
    targetAudience: ['Content Creators', 'Marketers', 'Video Producers'],
    careerOutcomes: ['AI Video Specialist', 'Avatar Designer', 'Content Producer'],
    skillsLearned: ['AI Video Tools', 'Avatar Creation', 'DeepFake Technology', 'Content Strategy'],
    features: [],
    format: 'ONLINE' as const,
    price: 1800,
    currency: 'USD',
    discountPrice: 1299,
    paymentPlans: [{
      id: 'plan-3',
      name: 'Monthly',
      installments: 7,
      price: 186,
      interval: 'month'
    }],
    duration: 280,
    durationWeeks: 14,
    hoursPerWeek: 12,
    totalHours: 168,
    studentCount: 1456,
    averageRating: 4.8,
    level: 'ADVANCED' as const,
    language: 'EN' as const,
    categoryId: 'ai-creative',
    category: {
      id: 'ai-creative',
      slug: 'ai-creative',
      name: { ru: 'AI и креатив', en: 'AI & Creative' },
      children: [],
      order: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    instructorId: '3',
    instructor: {
      id: '3',
      locale: 'EN',
      name: 'Alex Rivera',
      company: 'Creative AI Labs',
      bio: 'AI creative technologies expert',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    modules: [],
    enrollments: [],
    reviews: [],
    testimonials: [],
    status: 'PUBLISHED' as const,
    isActive: true,
    isFeatured: false,
    keywords: ['AI', 'video', 'avatar', 'generation'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockCategories: CategoryData[] = [
  {
    id: 'ai-business',
    slug: 'ai-business',
    name: { ru: 'AI в бизнесе', en: 'AI in Business' },
    description: { ru: 'Курсы по внедрению AI в бизнес-процессы', en: 'Courses on implementing AI in business processes' },
    children: [],
    order: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'web-development',
    slug: 'web-development', 
    name: { ru: 'Веб-разработка', en: 'Web Development' },
    description: { ru: 'Курсы по созданию веб-сайтов и приложений', en: 'Courses on creating websites and applications' },
    children: [],
    order: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'ai-creative',
    slug: 'ai-creative',
    name: { ru: 'AI и креатив', en: 'AI & Creative' },
    description: { ru: 'Курсы по творческому применению AI', en: 'Courses on creative AI applications' },
    children: [],
    order: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const metadata: Metadata = {
  title: 'AI Курсы Online - Каталог курсов | ProjectDes Academy',
  description: 'Изучайте искусственный интеллект с нуля до профи. Практические курсы от экспертов индустрии с гарантированным трудоустройством. 87% выпускников находят работу.',
  keywords: [
    'AI курсы',
    'курсы искусственного интеллекта',
    'обучение machine learning',
    'Data Science курсы',
    'онлайн образование AI',
    'курсы программирования AI'
  ],
  openGraph: {
    title: 'AI Курсы для карьерного роста - ProjectDes Academy',
    description: 'Практические курсы AI с гарантированным трудоустройством. 12K+ выпускников, 87% трудоустройство.',
    images: ['/images/courses-og-image.jpg'],
    type: 'website'
  },
  alternates: {
    canonical: '/courses'
  }
};

export default function CoursesPage() {
  const heroMetrics = {
    graduateCount: 12000,
    yearsInOperation: 8,
    successRate: 87,
    averageSalaryIncrease: 150
  };

  return (
    <main className="min-h-screen">
      {/* Courses Hero Section */}
      <CoursesHero 
        metrics={heroMetrics}
        className="mb-0"
      />

      {/* Courses Catalog */}
      <CoursesCatalog 
        courses={mockCourses}
        categories={mockCategories}
        className="mb-16"
      />

      {/* Consultation Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Не знаете, какой курс выбрать?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Получите персональную консультацию и узнайте, какой путь в AI подходит именно вам
            </p>
          </div>
          <ConsultationForm />
        </div>
      </section>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'AI Курсы - ProjectDes Academy',
            description: 'Каталог курсов по искусственному интеллекту',
            numberOfItems: mockCourses.length,
            itemListElement: mockCourses.map((course, index) => ({
              '@type': 'Course',
              position: index + 1,
              name: course.title.ru,
              description: course.description.ru,
              provider: {
                '@type': 'Organization',
                name: 'ProjectDes Academy'
              },
              offers: {
                '@type': 'Offer',
                price: course.discountPrice || course.price,
                priceCurrency: course.currency,
                availability: 'https://schema.org/InStock'
              },
              courseMode: course.format === 'ONLINE' ? 'online' : 'blended',
              educationalLevel: course.level.toLowerCase(),
              teaches: course.skillsLearned
            }))
          })
        }}
      />
    </main>
  );
}