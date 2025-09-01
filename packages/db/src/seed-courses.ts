/**
 * Course Catalog Seed Script
 * =========================
 * 
 * Creates comprehensive sample course data for testing the course catalog page
 * Includes realistic AI courses matching the ProjectDes Academy brand
 */

import { PrismaClient, CourseLevel, CourseStatus, Locale } from '../node_modules/.prisma/client';

const prisma = new PrismaClient();

/**
 * Sample Course Data
 * Based on ProjectDes Academy's AI transformation focus
 */
const sampleCourses = [
  {
    slug: 'ai-transformation-manager',
    title: {
      ru: 'AI Transformation Manager',
      en: 'AI Transformation Manager',
      he: 'מנהל טרנספורמציה AI'
    },
    description: {
      ru: 'Станьте экспертом по внедрению AI в бизнес-процессы. Изучите стратегии цифровой трансформации, управление AI-проектами и построение команд для работы с искусственным интеллектом.',
      en: 'Become an expert in implementing AI in business processes. Learn digital transformation strategies, AI project management, and building teams for artificial intelligence work.',
      he: 'הפכו למומחים ביישום AI בתהליכים עסקיים. למדו אסטרטגיות טרנספורמציה דיגיטלית, ניהול פרויקטי AI ובניית צוותים לעבודה עם בינה מלאכותית.'
    },
    shortDescription: {
      ru: 'Управление AI-трансформацией в компаниях. От стратегии до реализации.',
      en: 'Managing AI transformation in companies. From strategy to implementation.',
      he: 'ניהול טרנספורמציה AI בחברות. מאסטרטגיה ועד מימוש.'
    },
    level: 'INTERMEDIATE' as CourseLevel,
    format: 'ONLINE',
    duration: { weeks: 16, hoursPerWeek: 10, totalHours: 160 },
    pricing: { fullPrice: 1500, discountedPrice: 1200, currency: 'USD' },
    skillsLearned: [
      'AI стратегическое планирование',
      'Управление AI-проектами',
      'Data-driven принятие решений',
      'Построение AI-команд',
      'ROI анализ AI-решений',
      'Change Management'
    ],
    careerOutcomes: [
      'AI Transformation Manager',
      'Digital Innovation Director',
      'Chief AI Officer',
      'AI Strategy Consultant'
    ],
    keyBenefits: [
      'Персональное менторство от экспертов индустрии',
      'Реальные кейсы из Fortune 500 компаний',
      'Сертификация международного образца',
      'Гарантированное трудоустройство'
    ],
    targetAudience: [
      'Руководители среднего звена',
      'Product Managers',
      'IT Directors',
      'Бизнес-аналитики'
    ],
    categoryName: 'AI Transformation',
    instructorName: 'Александр Петров',
    featured: true,
    thumbnailImage: '/images/courses/ai-transformation-manager-thumb.jpg',
    heroImage: '/images/courses/ai-transformation-manager-hero.jpg'
  },
  {
    slug: 'no-code-development',
    title: {
      ru: 'No-Code Разработка Сайтов',
      en: 'No-Code Website Development',
      he: 'פיתוח אתרים ללא קוד'
    },
    description: {
      ru: 'Создавайте профессиональные веб-приложения без программирования. Изучите современные No-Code платформы, автоматизацию бизнес-процессов и монетизацию цифровых продуктов.',
      en: 'Create professional web applications without programming. Learn modern No-Code platforms, business process automation, and digital product monetization.',
      he: 'צרו אפליקציות אינטרנט מקצועיות ללא תכנות. למדו פלטפורמות No-Code מודרניות, אוטומציה של תהליכים עסקיים ומונטיזציה של מוצרים דיגיטליים.'
    },
    shortDescription: {
      ru: 'Создание сайтов и приложений без кода. Быстрый старт в IT.',
      en: 'Creating websites and apps without code. Quick start in IT.',
      he: 'יצירת אתרים ואפליקציות ללא קוד. התחלה מהירה בהיי-טק.'
    },
    level: 'BEGINNER' as CourseLevel,
    format: 'ONLINE',
    duration: { weeks: 12, hoursPerWeek: 8, totalHours: 96 },
    pricing: { fullPrice: 1000, discountedPrice: 799, currency: 'USD' },
    skillsLearned: [
      'Webflow профессиональная разработка',
      'Bubble.io создание веб-приложений',
      'Zapier автоматизация процессов',
      'Airtable базы данных',
      'Figma дизайн интерфейсов',
      'SEO оптимизация'
    ],
    careerOutcomes: [
      'No-Code Developer',
      'Digital Product Manager',
      'Automation Specialist',
      'Freelance Web Developer'
    ],
    keyBenefits: [
      'Портфолио из 5 реальных проектов',
      'Сертификации от ведущих No-Code платформ',
      'Менторство и code review',
      'Помощь в поиске первых заказчиков'
    ],
    targetAudience: [
      'Начинающие в IT',
      'Предприниматели',
      'Маркетологи',
      'Дизайнеры'
    ],
    categoryName: 'No-Code Development',
    instructorName: 'Мария Кузнецова',
    featured: true,
    thumbnailImage: '/images/courses/no-code-development-thumb.jpg',
    heroImage: '/images/courses/no-code-development-hero.jpg'
  },
  {
    slug: 'ai-video-generation',
    title: {
      ru: 'AI Видео и Avatar Генерация',
      en: 'AI Video & Avatar Generation',
      he: 'יצירת וידאו ואווטר AI'
    },
    description: {
      ru: 'Освойте создание AI-видео контента и цифровых аватаров. Изучите современные инструменты генерации видео, анимации персонажей и монетизации контента в digital пространстве.',
      en: 'Master creating AI video content and digital avatars. Learn modern video generation tools, character animation, and content monetization in digital space.',
      he: 'השלטו ביצירת תוכן וידאו AI ואווטרים דיגיטליים. למדו כלי יצירת וידאו מודרניים, אנימציית דמויות ומונטיזציה של תוכן במרחב הדיגיטלי.'
    },
    shortDescription: {
      ru: 'Создание AI-видео и цифровых аватаров. Монетизация контента.',
      en: 'Creating AI videos and digital avatars. Content monetization.',
      he: 'יצירת וידאו AI ואווטרים דיגיטליים. מונטיזציה של תוכן.'
    },
    level: 'ADVANCED' as CourseLevel,
    format: 'HYBRID',
    duration: { weeks: 20, hoursPerWeek: 12, totalHours: 240 },
    pricing: { fullPrice: 1800, discountedPrice: 1399, currency: 'USD' },
    skillsLearned: [
      'Stable Diffusion для видео',
      'RunwayML создание контента',
      'Synthesia AI презентации',
      'D-ID цифровые аватары',
      'After Effects композитинг',
      'Blender 3D анимация'
    ],
    careerOutcomes: [
      'AI Video Producer',
      'Digital Content Creator',
      'AI Animation Specialist',
      'Virtual Influencer Manager'
    ],
    keyBenefits: [
      'Доступ к premium AI-инструментам',
      'Создание собственного цифрового аватара',
      'Партнерство с контент-агентствами',
      'Мастер-классы от топ-креаторов'
    ],
    targetAudience: [
      'Видео-продюсеры',
      'Контент-мейкеры',
      'Digital маркетологи',
      'Creative директоры'
    ],
    categoryName: 'AI Video & Animation',
    instructorName: 'Дмитрий Волков',
    featured: true,
    thumbnailImage: '/images/courses/ai-video-generation-thumb.jpg',
    heroImage: '/images/courses/ai-video-generation-hero.jpg'
  },
  {
    slug: 'machine-learning-fundamentals',
    title: {
      ru: 'Основы Machine Learning',
      en: 'Machine Learning Fundamentals',
      he: 'יסודות Machine Learning'
    },
    description: {
      ru: 'Погрузитесь в мир машинного обучения с практическим подходом. От основ статистики до создания собственных ML-моделей и их внедрения в продакшн.',
      en: 'Dive into the world of machine learning with a practical approach. From statistics basics to creating your own ML models and deploying them to production.',
      he: 'צללו לעולם של machine learning עם גישה מעשית. מיסודות סטטיסטיקה ועד יצירת מודלים ML משלכם והטמעתם בייצור.'
    },
    shortDescription: {
      ru: 'Практический курс по машинному обучению. От теории к продакшн.',
      en: 'Practical machine learning course. From theory to production.',
      he: 'קורס מעשי ב-machine learning. מתיאוריה לייצור.'
    },
    level: 'INTERMEDIATE' as CourseLevel,
    format: 'ONLINE',
    duration: { weeks: 14, hoursPerWeek: 12, totalHours: 168 },
    pricing: { fullPrice: 1400, discountedPrice: 1099, currency: 'USD' },
    skillsLearned: [
      'Python для Data Science',
      'Pandas и NumPy анализ данных',
      'Scikit-learn ML алгоритмы',
      'TensorFlow глубокое обучение',
      'MLOps и деплой моделей',
      'A/B тестирование ML'
    ],
    careerOutcomes: [
      'ML Engineer',
      'Data Scientist',
      'AI Research Engineer',
      'ML Product Manager'
    ],
    keyBenefits: [
      'Hands-on проекты с реальными данными',
      'Kaggle соревнования и портфолио',
      'Код-ревью от Senior ML Engineers',
      'Подготовка к техническим собеседованиям'
    ],
    targetAudience: [
      'Python разработчики',
      'Data Analysts',
      'Математики и физики',
      'Backend Engineers'
    ],
    categoryName: 'Data Science & ML',
    instructorName: 'Анна Смирнова',
    featured: false,
    thumbnailImage: '/images/courses/machine-learning-fundamentals-thumb.jpg',
    heroImage: '/images/courses/machine-learning-fundamentals-hero.jpg'
  },
  {
    slug: 'prompt-engineering-mastery',
    title: {
      ru: 'Мастер Prompt Engineering',
      en: 'Prompt Engineering Mastery',
      he: 'שליטה בהנדסת Prompt'
    },
    description: {
      ru: 'Станьте экспертом по работе с AI моделями. Освойте advanced техники prompt engineering, fine-tuning моделей и создание AI-powered продуктов.',
      en: 'Become an expert in working with AI models. Master advanced prompt engineering techniques, model fine-tuning, and creating AI-powered products.',
      he: 'הפכו למומחים בעבודה עם מודלים AI. השלטו בטכניקות הנדסת prompt מתקדמות, כוונון מודלים ויצירת מוצרים מופעלי AI.'
    },
    shortDescription: {
      ru: 'Профессиональная работа с GPT, Claude и другими AI моделями.',
      en: 'Professional work with GPT, Claude and other AI models.',
      he: 'עבודה מקצועית עם GPT, Claude ומודלים AI אחרים.'
    },
    level: 'ADVANCED' as CourseLevel,
    format: 'ONLINE',
    duration: { weeks: 8, hoursPerWeek: 6, totalHours: 48 },
    pricing: { fullPrice: 899, discountedPrice: 699, currency: 'USD' },
    skillsLearned: [
      'Advanced Prompt Engineering',
      'GPT-4 API интеграция',
      'LangChain фреймворк',
      'Vector databases (Pinecone, Weaviate)',
      'RAG архитектуры',
      'AI продукт менеджмент'
    ],
    careerOutcomes: [
      'Prompt Engineer',
      'AI Product Manager',
      'LLM Integration Specialist',
      'AI Consultant'
    ],
    keyBenefits: [
      'Доступ к premium API ключам',
      'Построение AI стартапа с нуля',
      'Нетворкинг с AI энтузиастами',
      'Сертификат от OpenAI партнеров'
    ],
    targetAudience: [
      'Software Engineers',
      'Product Managers',
      'AI энтузиасты',
      'Технические предприниматели'
    ],
    categoryName: 'AI Engineering',
    instructorName: 'Владимир Козлов',
    featured: false,
    thumbnailImage: '/images/courses/prompt-engineering-mastery-thumb.jpg',
    heroImage: '/images/courses/prompt-engineering-mastery-hero.jpg'
  },
  {
    slug: 'ai-business-automation',
    title: {
      ru: 'AI Автоматизация Бизнеса',
      en: 'AI Business Automation',
      he: 'אוטומציה עסקית AI'
    },
    description: {
      ru: 'Автоматизируйте бизнес-процессы с помощью AI. Изучите RPA, интеллектуальную обработку документов, чат-боты и системы принятия решений на базе ИИ.',
      en: 'Automate business processes with AI. Learn RPA, intelligent document processing, chatbots, and AI-based decision systems.',
      he: 'אוטמטו תהליכים עסקיים עם AI. למדו RPA, עיבוד מסמכים אינטליגנטי, צ׳אטבוטים ומערכות קבלת החלטות מבוססות AI.'
    },
    shortDescription: {
      ru: 'Внедрение AI в бизнес-процессы. RPA и интеллектуальная автоматизация.',
      en: 'Implementing AI in business processes. RPA and intelligent automation.',
      he: 'הטמעת AI בתהליכים עסקיים. RPA ואוטומציה אינטליגנטית.'
    },
    level: 'INTERMEDIATE' as CourseLevel,
    format: 'HYBRID',
    duration: { weeks: 10, hoursPerWeek: 8, totalHours: 80 },
    pricing: { fullPrice: 1200, discountedPrice: 999, currency: 'USD' },
    skillsLearned: [
      'UiPath RPA разработка',
      'Power Platform автоматизация',
      'OpenAI API интеграция',
      'Chatbot разработка',
      'Process Mining',
      'Business Intelligence'
    ],
    careerOutcomes: [
      'RPA Developer',
      'Business Process Analyst',
      'AI Automation Engineer',
      'Digital Transformation Specialist'
    ],
    keyBenefits: [
      'Кейсы из реальных компаний',
      'Сертификации UiPath и Microsoft',
      'ROI калькулятор для автоматизации',
      'Готовые шаблоны процессов'
    ],
    targetAudience: [
      'Бизнес-аналитики',
      'Process Owners',
      'IT консультанты',
      'Operations Managers'
    ],
    categoryName: 'Business Automation',
    instructorName: 'Елена Новикова',
    featured: false,
    thumbnailImage: '/images/courses/ai-business-automation-thumb.jpg',
    heroImage: '/images/courses/ai-business-automation-hero.jpg'
  }
];

/**
 * Course Categories
 */
const categories = [
  {
    slug: 'ai-transformation',
    name: {
      ru: 'AI Трансформация',
      en: 'AI Transformation',
      he: 'טרנספורמציה AI'
    },
    description: {
      ru: 'Стратегическое внедрение искусственного интеллекта в бизнес',
      en: 'Strategic implementation of artificial intelligence in business',
      he: 'יישום אסטרטגי של בינה מלאכותית בעסקים'
    },
    icon: 'brain',
    color: '#8B5CF6',
    order: 1
  },
  {
    slug: 'no-code-development',
    name: {
      ru: 'No-Code Разработка',
      en: 'No-Code Development',
      he: 'פיתוח ללא קוד'
    },
    description: {
      ru: 'Создание приложений и сайтов без программирования',
      en: 'Creating applications and websites without programming',
      he: 'יצירת אפליקציות ואתרים ללא תכנות'
    },
    icon: 'blocks',
    color: '#10B981',
    order: 2
  },
  {
    slug: 'ai-video-animation',
    name: {
      ru: 'AI Видео и Анимация',
      en: 'AI Video & Animation',
      he: 'וידאו ואנימציה AI'
    },
    description: {
      ru: 'Создание видео контента с помощью искусственного интеллекта',
      en: 'Creating video content using artificial intelligence',
      he: 'יצירת תוכן וידאו באמצעות בינה מלאכותית'
    },
    icon: 'video',
    color: '#F59E0B',
    order: 3
  },
  {
    slug: 'data-science-ml',
    name: {
      ru: 'Data Science и ML',
      en: 'Data Science & ML',
      he: 'Data Science ו-ML'
    },
    description: {
      ru: 'Анализ данных и машинное обучение',
      en: 'Data analysis and machine learning',
      he: 'ניתוח נתונים ולמידת מכונה'
    },
    icon: 'chart',
    color: '#EF4444',
    order: 4
  },
  {
    slug: 'ai-engineering',
    name: {
      ru: 'AI Инженерия',
      en: 'AI Engineering',
      he: 'הנדסת AI'
    },
    description: {
      ru: 'Техническая разработка AI решений',
      en: 'Technical development of AI solutions',
      he: 'פיתוח טכני של פתרונות AI'
    },
    icon: 'cpu',
    color: '#6366F1',
    order: 5
  },
  {
    slug: 'business-automation',
    name: {
      ru: 'Бизнес Автоматизация',
      en: 'Business Automation',
      he: 'אוטומציה עסקית'
    },
    description: {
      ru: 'Автоматизация бизнес-процессов с помощью AI',
      en: 'Automating business processes with AI',
      he: 'אוטומציה של תהליכים עסקיים עם AI'
    },
    icon: 'cog',
    color: '#06B6D4',
    order: 6
  }
];

/**
 * Instructors
 */
const instructors = [
  {
    locale: 'RU' as Locale,
    name: 'Александр Петров',
    bio: {
      ru: 'Эксперт по AI трансформации с 12+ лет опыта в Fortune 500 компаниях. Бывший директор по инновациям в Сбербанке.',
      en: 'AI transformation expert with 12+ years of experience in Fortune 500 companies. Former Innovation Director at Sberbank.',
      he: 'מומחה טרנספורמציה AI עם ניסיון של 12+ שנים בחברות Fortune 500. לשעבר מנהל חדשנות בסברבנק.'
    },
    company: 'Ex-Sberbank',
    linkedin: 'https://linkedin.com/in/alexandr-petrov-ai',
    website: 'https://petrov-ai.com'
  },
  {
    locale: 'RU' as Locale,
    name: 'Мария Кузнецова',
    bio: {
      ru: 'No-Code евангелист и серийный предприниматель. Создала 15+ успешных продуктов без единой строки кода.',
      en: 'No-Code evangelist and serial entrepreneur. Created 15+ successful products without a single line of code.',
      he: 'אוונגליסטית No-Code ויזמת סדרתית. יצרה 15+ מוצרים מוצלחים ללא שורת קוד אחת.'
    },
    company: 'NoCode Ventures',
    linkedin: 'https://linkedin.com/in/maria-kuznetsova-nocode',
    website: 'https://nocode-ventures.com'
  },
  {
    locale: 'RU' as Locale,
    name: 'Дмитрий Волков',
    bio: {
      ru: 'Пионер AI-видео индустрии. Создал виральные кампании для Netflix, Disney, и других медиа-гигантов.',
      en: 'Pioneer of the AI video industry. Created viral campaigns for Netflix, Disney, and other media giants.',
      he: 'חלוץ בתעשיית הווידאו AI. יצר קמפיינים ויראליים עבור Netflix, Disney ועוד ענקי מדיה.'
    },
    company: 'AI Video Studios',
    linkedin: 'https://linkedin.com/in/dmitry-volkov-ai-video',
    website: 'https://aivideo.studio'
  }
];

/**
 * Main seeding function
 */
async function main() {
  console.log('🎓 Starting Course Catalog seeding...');

  try {
    // Create categories
    console.log('📚 Creating course categories...');
    const createdCategories = [];
    
    for (const categoryData of categories) {
      const category = await prisma.category.create({
        data: {
          slug: categoryData.slug,
          name: categoryData.name,
          description: categoryData.description,
          icon: categoryData.icon,
          order: categoryData.order,
          isActive: true
        }
      });
      createdCategories.push(category);
    }

    // Create instructors
    console.log('👨‍🏫 Creating instructors...');
    const createdInstructors = [];
    
    for (const instructorData of instructors) {
      const instructor = await prisma.instructor.create({
        data: {
          locale: instructorData.locale,
          name: instructorData.name,
          bio: instructorData.bio,
          company: instructorData.company,
          linkedin: instructorData.linkedin,
          website: instructorData.website
        }
      });
      createdInstructors.push(instructor);
    }

    // Create courses
    console.log('🎯 Creating courses...');
    
    for (let i = 0; i < sampleCourses.length; i++) {
      const courseData = sampleCourses[i];
      
      // Find category and instructor
      const category = createdCategories.find(cat => cat.slug === courseData.slug.split('-')[0] + '-' + courseData.slug.split('-')[1] || cat.name.en.toLowerCase().includes(courseData.categoryName.toLowerCase()));
      const instructor = createdInstructors.find(inst => inst.name === courseData.instructorName) || createdInstructors[i % createdInstructors.length];

      // Generate realistic metrics
      const baseStudents = Math.floor(Math.random() * 3000) + 500;
      const rating = 4.2 + Math.random() * 0.8; // 4.2 - 5.0
      const completionRate = 0.6 + Math.random() * 0.3; // 60-90%

      const course = await prisma.course.create({
        data: {
          slug: courseData.slug,
          title: courseData.title,
          description: courseData.description,
          thumbnail: courseData.thumbnailImage,
          price: courseData.pricing.fullPrice,
          discountPrice: courseData.pricing.discountedPrice,
          currency: courseData.pricing.currency,
          level: courseData.level,
          duration: courseData.duration.totalHours,
          language: 'RU' as Locale,
          
          // Extended fields for course catalog
          shortDescription: courseData.shortDescription,
          format: courseData.format,
          skillsLearned: courseData.skillsLearned,
          careerOutcomes: courseData.careerOutcomes,
          keyBenefits: courseData.keyBenefits,
          targetAudience: courseData.targetAudience,
          features: courseData.keyBenefits,
          
          // Course scheduling
          nextStartDate: new Date(Date.now() + (Math.floor(Math.random() * 4) + 1) * 7 * 24 * 60 * 60 * 1000),
          enrollmentDeadline: new Date(Date.now() + (Math.floor(Math.random() * 30) + 7) * 24 * 60 * 60 * 1000),
          maxStudents: Math.floor(Math.random() * 100) + 20,
          
          // Marketing content
          heroImage: courseData.heroImage,
          thumbnailImage: courseData.thumbnailImage,
          
          // Computed metrics
          totalStudents: baseStudents,
          averageRating: Math.round(rating * 10) / 10,
          completionRate: Math.round(completionRate * 100) / 100,
          
          // Flags
          isFeatured: courseData.featured,
          isPopular: Math.random() > 0.6,
          
          // Relations
          categoryId: category?.id || createdCategories[0].id,
          instructorId: instructor.id,
          
          status: 'PUBLISHED' as CourseStatus,
          publishedAt: new Date(),
          
          // SEO
          metaTitle: `${courseData.title.ru} | ProjectDes Academy`,
          metaDescription: courseData.shortDescription.ru,
          keywords: courseData.skillsLearned.slice(0, 5)
        }
      });

      // Create sample modules and lessons
      for (let moduleIndex = 0; moduleIndex < 4; moduleIndex++) {
        const module = await prisma.module.create({
          data: {
            courseId: course.id,
            title: {
              ru: `Модуль ${moduleIndex + 1}: ${courseData.skillsLearned[moduleIndex] || 'Практические навыки'}`,
              en: `Module ${moduleIndex + 1}: ${courseData.skillsLearned[moduleIndex] || 'Practical Skills'}`,
              he: `מודול ${moduleIndex + 1}: ${courseData.skillsLearned[moduleIndex] || 'כישורים מעשיים'}`
            },
            description: {
              ru: `Изучение ${courseData.skillsLearned[moduleIndex]?.toLowerCase() || 'основных концепций'} с практическими заданиями`,
              en: `Learning ${courseData.skillsLearned[moduleIndex]?.toLowerCase() || 'core concepts'} with practical assignments`,
              he: `לימוד ${courseData.skillsLearned[moduleIndex]?.toLowerCase() || 'מושגי הליבה'} עם משימות מעשיות`
            },
            order: moduleIndex + 1
          }
        });

        // Create 3-5 lessons per module
        const lessonsCount = Math.floor(Math.random() * 3) + 3;
        for (let lessonIndex = 0; lessonIndex < lessonsCount; lessonIndex++) {
          await prisma.lesson.create({
            data: {
              moduleId: module.id,
              title: {
                ru: `Урок ${lessonIndex + 1}: Практическое применение`,
                en: `Lesson ${lessonIndex + 1}: Practical Application`,
                he: `שיעור ${lessonIndex + 1}: יישום מעשי`
              },
              content: {
                ru: 'Содержание урока будет загружено позже',
                en: 'Lesson content will be loaded later',
                he: 'תוכן השיעור יוטען מאוחר יותר'
              },
              videoUrl: `https://example.com/lessons/${course.slug}-${moduleIndex}-${lessonIndex}.mp4`,
              duration: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
              order: lessonIndex + 1
            }
          });
        }
      }

      // Create sample testimonials
      if (Math.random() > 0.5) {
        await prisma.testimonial.create({
          data: {
            locale: 'RU' as Locale,
            studentName: `Студент ${i + 1}`,
            quote: `Отличный курс! Получил все необходимые навыки для карьеры в ${courseData.careerOutcomes[0]}. Рекомендую!`,
            courseId: course.id,
            order: i,
            isPublished: true
          }
        });
      }

      console.log(`✅ Created course: ${courseData.title.ru}`);
    }

    console.log('🎉 Course catalog seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding courses:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });