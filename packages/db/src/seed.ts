/**
 * Comprehensive Database Seed Script
 * Inserts dummy data into EVERY table in the correct order
 * Generated: 2025-08-29
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

  try {
    // ============================================
    // 1. MEDIA ASSETS (Independent)
    // ============================================
    console.log('📸 Seeding MediaAssets...');
    const mediaAssets = await Promise.all([
      prisma.mediaAsset.create({
        data: {
          filename: 'instructor-avatar-1.jpg',
          originalName: 'john-doe-avatar.jpg',
          mimeType: 'image/jpeg',
          size: 45632,
          url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
      }),
      prisma.mediaAsset.create({
        data: {
          filename: 'instructor-avatar-2.jpg',
          originalName: 'jane-smith-avatar.jpg',
          mimeType: 'image/jpeg',
          size: 38921,
          url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
      }),
      prisma.mediaAsset.create({
        data: {
          filename: 'partner-logo-1.png',
          originalName: 'tech-corp-logo.png',
          mimeType: 'image/png',
          size: 12843,
          url: 'https://via.placeholder.com/200x100/4F46E5/FFFFFF?text=TechCorp',
        },
      }),
      prisma.mediaAsset.create({
        data: {
          filename: 'student-avatar-1.jpg',
          originalName: 'student-testimonial.jpg',
          mimeType: 'image/jpeg',
          size: 34567,
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
      }),
      prisma.mediaAsset.create({
        data: {
          filename: 'event-cover-1.jpg',
          originalName: 'ai-workshop-cover.jpg',
          mimeType: 'image/jpeg',
          size: 89234,
          url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80',
        },
      }),
      prisma.mediaAsset.create({
        data: {
          filename: 'campaign-banner-1.jpg',
          originalName: 'summer-sale-banner.jpg',
          mimeType: 'image/jpeg',
          size: 76543,
          url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80',
        },
      }),
    ]);
    
    // ============================================
    // 2. USERS & AUTHENTICATION
    // ============================================
    console.log('👥 Seeding Users...');
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'admin@aistudio555.ai',
          passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewrtwUGpQFCBl4v.', // password: admin123
          emailVerified: true,
          role: 'ADMIN',
        },
      }),
      prisma.user.create({
        data: {
          email: 'instructor@aistudio555.ai',
          passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewrtwUGpQFCBl4v.', // password: admin123
          emailVerified: true,
          role: 'INSTRUCTOR',
        },
      }),
      prisma.user.create({
        data: {
          email: 'student1@example.com',
          passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewrtwUGpQFCBl4v.', // password: admin123
          emailVerified: true,
          role: 'STUDENT',
        },
      }),
      prisma.user.create({
        data: {
          email: 'student2@example.com',
          passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewrtwUGpQFCBl4v.', // password: admin123
          emailVerified: false,
          role: 'STUDENT',
        },
      }),
      prisma.user.create({
        data: {
          email: 'support@aistudio555.ai',
          passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewrtwUGpQFCBl4v.', // password: admin123
          emailVerified: true,
          role: 'SUPPORT',
        },
      }),
    ]);

    // ============================================
    // 3. USER PROFILES
    // ============================================
    console.log('👤 Seeding UserProfiles...');
    const userProfiles = await Promise.all([
      prisma.userProfile.create({
        data: {
          userId: users[0].id,
          firstName: 'Admin',
          lastName: 'User',
          phone: '+1-555-0100',
          bio: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "System administrator for AiStudio555 Academy" }] }] },
          locale: 'EN',
          company: 'AiStudio555 Academy',
          position: 'System Administrator',
          linkedin: 'https://linkedin.com/in/admin-user',
        },
      }),
      prisma.userProfile.create({
        data: {
          userId: users[1].id,
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '+1-555-0200',
          bio: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Expert AI instructor with 10+ years experience in machine learning and data science" }] }] },
          locale: 'EN',
          company: 'AI Solutions Ltd',
          position: 'Senior AI Engineer',
          linkedin: 'https://linkedin.com/in/jane-smith-ai',
          github: 'https://github.com/janesmith',
        },
      }),
      prisma.userProfile.create({
        data: {
          userId: users[2].id,
          firstName: 'Alex',
          lastName: 'Johnson',
          phone: '+1-555-0300',
          bio: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Aspiring AI professional looking to transform my career" }] }] },
          locale: 'EN',
          company: 'TechStart Inc',
          position: 'Software Developer',
        },
      }),
      prisma.userProfile.create({
        data: {
          userId: users[3].id,
          firstName: 'Maria',
          lastName: 'Garcia',
          locale: 'RU',
          bio: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Студентка изучающая ИИ и машинное обучение" }] }] },
        },
      }),
      prisma.userProfile.create({
        data: {
          userId: users[4].id,
          firstName: 'Support',
          lastName: 'Team',
          phone: '+1-555-0500',
          bio: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Customer support specialist" }] }] },
          locale: 'EN',
          company: 'AiStudio555 Academy',
          position: 'Support Specialist',
        },
      }),
    ]);

    // ============================================
    // 4. USER SESSIONS
    // ============================================
    console.log('🔐 Seeding Sessions...');
    const sessions = await Promise.all([
      prisma.session.create({
        data: {
          userId: users[0].id,
          token: 'admin_session_token_12345',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      }),
      prisma.session.create({
        data: {
          userId: users[2].id,
          token: 'student_session_token_67890',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }),
    ]);

    // ============================================
    // 5. INSTRUCTORS
    // ============================================
    console.log('🎓 Seeding Instructors...');
    const instructors = await Promise.all([
      prisma.instructor.create({
        data: {
          name: 'Dr. John Anderson',
          locale: 'EN',
          company: 'AI Research Institute',
          bio: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Leading AI researcher with 15+ years experience in neural networks and deep learning. Published over 50 research papers." }] }] },
          avatarId: mediaAssets[0].id,
          linkedin: 'https://linkedin.com/in/john-anderson-ai',
          website: 'https://johnanderson-ai.com',
        },
      }),
      prisma.instructor.create({
        data: {
          name: 'Prof. Sarah Chen',
          locale: 'EN',
          company: 'MIT',
          bio: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Professor of Computer Science specializing in machine learning applications in business." }] }] },
          avatarId: mediaAssets[1].id,
          linkedin: 'https://linkedin.com/in/sarah-chen-mit',
          website: 'https://sarahchen-ml.edu',
        },
      }),
      prisma.instructor.create({
        data: {
          name: 'Dr. Dmitry Volkov',
          locale: 'RU',
          company: 'Moscow Tech University',
          bio: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Профессор компьютерных наук, эксперт в области искусственного интеллекта" }] }] },
          linkedin: 'https://linkedin.com/in/dmitry-volkov',
        },
      }),
    ]);

    // ============================================
    // 6. CATEGORIES
    // ============================================
    console.log('📚 Seeding Categories...');
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          slug: 'artificial-intelligence',
          name: { "en": "Artificial Intelligence", "ru": "Искусственный интеллект", "he": "בינה מלאכותית" },
          description: { "en": "Learn AI fundamentals and advanced applications", "ru": "Изучите основы ИИ и продвинутые применения", "he": "למד יסודות הבינה המלאכותית ויישומים מתקדמים" },
          icon: 'brain',
          order: 1,
        },
      }),
      prisma.category.create({
        data: {
          slug: 'web-development',
          name: { "en": "Web Development", "ru": "Веб-разработка", "he": "פיתוח אתרים" },
          description: { "en": "Build modern web applications", "ru": "Создавайте современные веб-приложения", "he": "בנה אפליקציות אינטרנט מודרניות" },
          icon: 'code',
          order: 2,
        },
      }),
      prisma.category.create({
        data: {
          slug: 'video-production',
          name: { "en": "Video Production", "ru": "Видеопродукция", "he": "הפקת וידאו" },
          description: { "en": "Master video creation and editing", "ru": "Освойте создание и редактирование видео", "he": "השתלט על יצירת ועריכת וידאו" },
          icon: 'video',
          order: 3,
        },
      }),
      // Subcategory
      prisma.category.create({
        data: {
          slug: 'machine-learning',
          name: { "en": "Machine Learning", "ru": "Машинное обучение", "he": "למידת מכונה" },
          description: { "en": "Deep dive into ML algorithms", "ru": "Глубокое погружение в алгоритмы МО", "he": "צלילה עמוקה לאלגוריתמי למידת מכונה" },
          icon: 'chart',
          parentId: '', // Will be updated after creation
          order: 1,
        },
      }),
    ]);

    // Update the subcategory to reference parent
    await prisma.category.update({
      where: { id: categories[3].id },
      data: { parentId: categories[0].id },
    });

    // ============================================
    // 7. COURSES
    // ============================================
    console.log('📖 Seeding Courses...');
    const courses = await Promise.all([
      prisma.course.create({
        data: {
          slug: 'ai-transformation-manager',
          title: { "en": "AI Transformation Manager", "ru": "Менеджер по трансформации ИИ", "he": "מנהל טרנספורמציה של בינה מלאכותית" },
          description: { "en": "Transform businesses with AI implementation strategies", "ru": "Трансформируйте бизнес с помощью стратегий внедрения ИИ", "he": "הפוך עסקים עם אסטרטגיות יישום בינה מלאכותית" },
          thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
          price: 1299.99,
          currency: 'USD',
          discountPrice: 999.99,
          level: 'INTERMEDIATE',
          duration: 120, // hours
          language: 'EN',
          categoryId: categories[0].id,
          instructorId: instructors[0].id,
          status: 'PUBLISHED',
          publishedAt: new Date('2024-01-15'),
          metaTitle: 'AI Transformation Manager Course - Master Business AI Implementation',
          metaDescription: 'Learn to implement AI solutions in business environments with hands-on projects and real-world case studies.',
          keywords: ['AI', 'artificial intelligence', 'business transformation', 'management', 'strategy'],
        },
      }),
      prisma.course.create({
        data: {
          slug: 'nocode-website-development',
          title: { "en": "No-Code Website Development", "ru": "Разработка сайтов без кода", "he": "פיתוח אתרים ללא קוד" },
          description: { "en": "Build professional websites without coding knowledge", "ru": "Создавайте профессиональные сайты без знания программирования", "he": "בנה אתרים מקצועיים ללא ידע בתכנות" },
          thumbnail: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
          price: 899.99,
          currency: 'USD',
          discountPrice: 699.99,
          level: 'BEGINNER',
          duration: 80, // hours
          language: 'EN',
          categoryId: categories[1].id,
          instructorId: instructors[1].id,
          status: 'PUBLISHED',
          publishedAt: new Date('2024-02-01'),
          metaTitle: 'No-Code Website Development Course',
          metaDescription: 'Create stunning websites using modern no-code tools and platforms.',
          keywords: ['no-code', 'website', 'web development', 'visual programming'],
        },
      }),
      prisma.course.create({
        data: {
          slug: 'ai-video-avatar-generation',
          title: { "en": "AI Video & Avatar Generation", "ru": "ИИ видео и создание аватаров", "he": "יצירת וידאו ואווטר על ידי בינה מלאכותית" },
          description: { "en": "Create engaging videos and avatars using AI technology", "ru": "Создавайте увлекательные видео и аватары с помощью технологий ИИ", "he": "צור סרטונים ואווטרים מרתקים באמצעות טכנולוגיית בינה מלאכותית" },
          thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
          price: 1199.99,
          currency: 'USD',
          discountPrice: 899.99,
          level: 'INTERMEDIATE',
          duration: 100, // hours
          language: 'EN',
          categoryId: categories[2].id,
          instructorId: instructors[0].id,
          status: 'PUBLISHED',
          publishedAt: new Date('2024-03-01'),
          metaTitle: 'AI Video & Avatar Generation Course',
          metaDescription: 'Master AI-powered video and avatar creation tools.',
          keywords: ['AI video', 'avatar generation', 'content creation', 'digital media'],
        },
      }),
      prisma.course.create({
        data: {
          slug: 'machine-learning-fundamentals',
          title: { "en": "Machine Learning Fundamentals", "ru": "Основы машинного обучения", "he": "יסודות למידת מכונה" },
          description: { "en": "Master the fundamentals of machine learning algorithms", "ru": "Освойте основы алгоритмов машинного обучения", "he": "השתלט על יסודות אלגוריתמי למידת מכונה" },
          price: 799.99,
          currency: 'USD',
          level: 'BEGINNER',
          duration: 60, // hours
          language: 'EN',
          categoryId: categories[3].id,
          instructorId: instructors[2].id,
          status: 'DRAFT',
          metaTitle: 'Machine Learning Fundamentals',
          metaDescription: 'Start your ML journey with fundamental concepts and practical applications.',
          keywords: ['machine learning', 'ML', 'algorithms', 'data science'],
        },
      }),
    ]);

    // ============================================
    // 8. MODULES
    // ============================================
    console.log('📑 Seeding Modules...');
    const modules = await Promise.all([
      // AI Transformation Manager modules
      prisma.module.create({
        data: {
          courseId: courses[0].id,
          title: { "en": "Introduction to AI in Business", "ru": "Введение в ИИ в бизнесе", "he": "מבוא לבינה מלאכותית בעסקים" },
          description: { "en": "Understanding AI applications in modern business", "ru": "Понимание применения ИИ в современном бизнесе", "he": "הבנת יישומי בינה מלאכותית בעסקים מודרניים" },
          order: 1,
        },
      }),
      prisma.module.create({
        data: {
          courseId: courses[0].id,
          title: { "en": "AI Strategy Development", "ru": "Разработка стратегии ИИ", "he": "פיתוח אסטרטגיית בינה מלאכותית" },
          description: { "en": "Creating comprehensive AI transformation strategies", "ru": "Создание комплексных стратегий трансформации ИИ", "he": "יצירת אסטרטגיות טרנספורמציה מקיפות של בינה מלאכותית" },
          order: 2,
        },
      }),
      prisma.module.create({
        data: {
          courseId: courses[0].id,
          title: { "en": "Implementation and Change Management", "ru": "Внедрение и управление изменениями", "he": "יישום וניהול שינויים" },
          order: 3,
        },
      }),
      // No-Code Website modules
      prisma.module.create({
        data: {
          courseId: courses[1].id,
          title: { "en": "No-Code Fundamentals", "ru": "Основы No-Code", "he": "יסודות ללא קוד" },
          description: { "en": "Introduction to no-code development platforms", "ru": "Введение в платформы разработки без кода", "he": "מבוא לפלטפורמות פיתוח ללא קוד" },
          order: 1,
        },
      }),
      prisma.module.create({
        data: {
          courseId: courses[1].id,
          title: { "en": "Advanced Design Techniques", "ru": "Продвинутые техники дизайна", "he": "טכניקות עיצוב מתקדמות" },
          order: 2,
        },
      }),
    ]);

    // ============================================
    // 9. LESSONS
    // ============================================
    console.log('📝 Seeding Lessons...');
    const lessons = await Promise.all([
      // Module 1 lessons
      prisma.lesson.create({
        data: {
          moduleId: modules[0].id,
          title: { "en": "What is AI and Why It Matters", "ru": "Что такое ИИ и почему это важно", "he": "מה זה בינה מלאכותית ולמה זה חשוב" },
          content: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Artificial Intelligence is revolutionizing how businesses operate. In this lesson, we'll explore the fundamental concepts of AI and its impact on modern enterprises." }] }] },
          videoUrl: 'https://example.com/videos/ai-intro-lesson-1.mp4',
          duration: 25,
          order: 1,
        },
      }),
      prisma.lesson.create({
        data: {
          moduleId: modules[0].id,
          title: { "en": "AI Use Cases Across Industries", "ru": "Применение ИИ в различных отраслях", "he": "מקרי שימוש בבינה מלאכותית בתעשיות שונות" },
          content: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Discover how different industries leverage AI for competitive advantage." }] }] },
          videoUrl: 'https://example.com/videos/ai-use-cases.mp4',
          duration: 30,
          order: 2,
        },
      }),
      prisma.lesson.create({
        data: {
          moduleId: modules[0].id,
          title: { "en": "Building AI-Ready Organizations", "ru": "Создание организаций готовых к ИИ", "he": "בניית ארגונים מוכנים לבינה מלאכותית" },
          content: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Learn how to prepare your organization for AI transformation." }] }] },
          duration: 35,
          order: 3,
        },
      }),
      // Module 2 lessons
      prisma.lesson.create({
        data: {
          moduleId: modules[1].id,
          title: { "en": "Strategic Planning for AI", "ru": "Стратегическое планирование ИИ", "he": "תכנון אסטרטגי לבינה מלאכותית" },
          content: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Develop comprehensive AI strategies aligned with business goals." }] }] },
          videoUrl: 'https://example.com/videos/ai-strategic-planning.mp4',
          duration: 40,
          order: 1,
        },
      }),
      // No-code course lesson
      prisma.lesson.create({
        data: {
          moduleId: modules[3].id,
          title: { "en": "Introduction to No-Code Platforms", "ru": "Введение в No-Code платформы", "he": "מבוא לפלטפורמות ללא קוד" },
          content: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Explore the most popular no-code platforms and their capabilities." }] }] },
          videoUrl: 'https://example.com/videos/nocode-intro.mp4',
          duration: 20,
          order: 1,
        },
      }),
    ]);

    // ============================================
    // 10. ENROLLMENTS
    // ============================================
    console.log('🎓 Seeding Enrollments...');
    const enrollments = await Promise.all([
      prisma.enrollment.create({
        data: {
          userId: users[2].id, // student1
          courseId: courses[0].id, // AI Transformation Manager
          status: 'ACTIVE',
          startedAt: new Date('2024-08-01'),
          progressPercent: 35,
          lastAccessedAt: new Date(),
        },
      }),
      prisma.enrollment.create({
        data: {
          userId: users[2].id, // student1
          courseId: courses[1].id, // No-Code Website
          status: 'COMPLETED',
          startedAt: new Date('2024-06-01'),
          completedAt: new Date('2024-07-15'),
          progressPercent: 100,
          lastAccessedAt: new Date('2024-07-15'),
        },
      }),
      prisma.enrollment.create({
        data: {
          userId: users[3].id, // student2
          courseId: courses[0].id, // AI Transformation Manager
          status: 'ACTIVE',
          startedAt: new Date('2024-08-15'),
          progressPercent: 15,
          lastAccessedAt: new Date(),
        },
      }),
    ]);

    // ============================================
    // 11. PROGRESS TRACKING
    // ============================================
    console.log('📊 Seeding Progress...');
    const progress = await Promise.all([
      prisma.progress.create({
        data: {
          enrollmentId: enrollments[0].id,
          lessonId: lessons[0].id,
          userId: users[2].id,
          status: 'COMPLETED',
          startedAt: new Date('2024-08-01T10:00:00Z'),
          completedAt: new Date('2024-08-01T10:25:00Z'),
          videoProgress: 100,
          attempts: 1,
          score: 95.5,
        },
      }),
      prisma.progress.create({
        data: {
          enrollmentId: enrollments[0].id,
          lessonId: lessons[1].id,
          userId: users[2].id,
          status: 'IN_PROGRESS',
          startedAt: new Date('2024-08-01T11:00:00Z'),
          videoProgress: 65,
          attempts: 1,
        },
      }),
      prisma.progress.create({
        data: {
          enrollmentId: enrollments[2].id,
          lessonId: lessons[0].id,
          userId: users[3].id,
          status: 'COMPLETED',
          startedAt: new Date('2024-08-15T14:00:00Z'),
          completedAt: new Date('2024-08-15T14:30:00Z'),
          videoProgress: 100,
          attempts: 2,
          score: 87.0,
        },
      }),
    ]);

    // ============================================
    // 12. CERTIFICATES
    // ============================================
    console.log('🏆 Seeding Certificates...');
    const certificates = await Promise.all([
      prisma.certificate.create({
        data: {
          enrollmentId: enrollments[1].id, // Completed no-code course
          certificateUrl: 'https://certificates.aistudio555.ai/nocode-12345.pdf',
          issuedAt: new Date('2024-07-15T18:00:00Z'),
          expiresAt: new Date('2026-07-15T18:00:00Z'),
        },
      }),
    ]);

    // ============================================
    // 13. PAYMENTS
    // ============================================
    console.log('💳 Seeding Payments...');
    const payments = await Promise.all([
      prisma.payment.create({
        data: {
          userId: users[2].id,
          courseId: courses[0].id,
          amount: 999.99,
          currency: 'USD',
          status: 'COMPLETED',
          provider: 'STRIPE',
          providerId: 'pi_1234567890abcdef',
          description: 'AI Transformation Manager Course',
          metadata: { "course_slug": "ai-transformation-manager", "discount_applied": true },
          paidAt: new Date('2024-08-01T09:30:00Z'),
        },
      }),
      prisma.payment.create({
        data: {
          userId: users[2].id,
          courseId: courses[1].id,
          amount: 699.99,
          currency: 'USD',
          status: 'COMPLETED',
          provider: 'PAYPAL',
          providerId: 'PAYID-EXAMPLE123',
          description: 'No-Code Website Development Course',
          paidAt: new Date('2024-06-01T14:15:00Z'),
        },
      }),
      prisma.payment.create({
        data: {
          userId: users[3].id,
          courseId: courses[0].id,
          amount: 1299.99,
          currency: 'USD',
          status: 'PENDING',
          provider: 'STRIPE',
          description: 'AI Transformation Manager Course - Full Price',
        },
      }),
    ]);

    // ============================================
    // 14. COUPONS
    // ============================================
    console.log('🎫 Seeding Coupons...');
    const coupons = await Promise.all([
      prisma.coupon.create({
        data: {
          code: 'SUMMER2024',
          discountType: 'PERCENTAGE',
          discountValue: 25.00,
          validFrom: new Date('2024-06-01'),
          validUntil: new Date('2024-09-30'),
          usageLimit: 100,
          usageCount: 23,
          courseIds: [], // All courses
        },
      }),
      prisma.coupon.create({
        data: {
          code: 'AISPECIAL',
          discountType: 'FIXED',
          discountValue: 200.00,
          validFrom: new Date('2024-08-01'),
          validUntil: new Date('2024-12-31'),
          usageLimit: 50,
          usageCount: 7,
          courseIds: [courses[0].id], // Only AI course
        },
      }),
    ]);

    // ============================================
    // 15. RESOURCES
    // ============================================
    console.log('📎 Seeding Resources...');
    const resources = await Promise.all([
      prisma.resource.create({
        data: {
          lessonId: lessons[0].id,
          title: 'AI Business Strategy Template',
          type: 'PDF',
          url: 'https://resources.aistudio555.ai/ai-strategy-template.pdf',
          size: 2048576, // 2MB
        },
      }),
      prisma.resource.create({
        data: {
          lessonId: lessons[0].id,
          title: 'Industry AI Implementation Examples',
          type: 'LINK',
          url: 'https://example.com/ai-implementations',
        },
      }),
      prisma.resource.create({
        data: {
          lessonId: lessons[1].id,
          title: 'AI Use Case Database',
          type: 'CODE',
          url: 'https://github.com/aistudio555/ai-use-cases',
        },
      }),
      prisma.resource.create({
        data: {
          lessonId: lessons[4].id,
          title: 'No-Code Platform Comparison Chart',
          type: 'PDF',
          url: 'https://resources.aistudio555.ai/nocode-comparison.pdf',
          size: 1536000, // 1.5MB
        },
      }),
    ]);

    // ============================================
    // 16. ASSIGNMENTS
    // ============================================
    console.log('📋 Seeding Assignments...');
    const assignments = await Promise.all([
      prisma.assignment.create({
        data: {
          lessonId: lessons[0].id,
          title: { "en": "AI Readiness Assessment", "ru": "Оценка готовности к ИИ", "he": "הערכת מוכנות לבינה מלאכותית" },
          description: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Complete a comprehensive assessment of your organization's AI readiness." }] }] },
          type: 'PROJECT',
          maxScore: 100.0,
          passingScore: 70.0,
          dueDate: new Date('2024-09-15'),
        },
      }),
      prisma.assignment.create({
        data: {
          lessonId: lessons[1].id,
          title: { "en": "AI Use Case Quiz", "ru": "Тест по применению ИИ", "he": "חידון מקרי שימוש בבינה מלאכותית" },
          description: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Test your knowledge of AI applications across different industries." }] }] },
          type: 'QUIZ',
          questions: {
            "questions": [
              {
                "id": "q1",
                "question": "Which industry was among the first to adopt AI for fraud detection?",
                "type": "multiple-choice",
                "options": ["Healthcare", "Banking", "Retail", "Manufacturing"],
                "correct": 1
              },
              {
                "id": "q2",
                "question": "What is the main benefit of AI in supply chain management?",
                "type": "multiple-choice",
                "options": ["Cost reduction", "Demand forecasting", "Inventory optimization", "All of the above"],
                "correct": 3
              }
            ]
          },
          maxScore: 100.0,
          passingScore: 80.0,
        },
      }),
    ]);

    // ============================================
    // 17. SUBMISSIONS
    // ============================================
    console.log('✍️ Seeding Submissions...');
    const submissions = await Promise.all([
      prisma.submission.create({
        data: {
          assignmentId: assignments[0].id,
          userId: users[2].id,
          content: {
            "assessment": {
              "data_quality": 8,
              "technical_infrastructure": 7,
              "organizational_readiness": 9,
              "budget_allocation": 8,
              "leadership_support": 10,
              "summary": "Our organization shows strong leadership support and organizational readiness for AI implementation. Technical infrastructure needs some improvements."
            }
          },
          score: 85.0,
          feedback: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Excellent analysis! Your assessment shows good understanding of AI readiness factors. Consider focusing on improving technical infrastructure." }] }] },
          status: 'GRADED',
          gradedAt: new Date('2024-08-05T16:00:00Z'),
        },
      }),
      prisma.submission.create({
        data: {
          assignmentId: assignments[1].id,
          userId: users[2].id,
          content: {
            "answers": [
              { "question_id": "q1", "selected": 1 },
              { "question_id": "q2", "selected": 3 }
            ]
          },
          score: 100.0,
          status: 'GRADED',
          gradedAt: new Date('2024-08-02T10:30:00Z'),
        },
      }),
    ]);

    // ============================================
    // 18. REVIEWS
    // ============================================
    console.log('⭐ Seeding Reviews...');
    const reviews = await Promise.all([
      prisma.review.create({
        data: {
          courseId: courses[0].id,
          userId: users[2].id,
          rating: 5,
          title: 'Excellent AI Course!',
          content: 'This course completely transformed my understanding of AI implementation in business. The practical examples and hands-on projects were invaluable.',
          isVerified: true,
          isPublished: true,
        },
      }),
      prisma.review.create({
        data: {
          courseId: courses[1].id,
          userId: users[2].id,
          rating: 4,
          title: 'Great for beginners',
          content: 'Perfect introduction to no-code development. Could use more advanced topics but excellent for getting started.',
          isVerified: true,
          isPublished: true,
        },
      }),
      prisma.review.create({
        data: {
          courseId: courses[0].id,
          userId: users[3].id,
          rating: 5,
          title: 'Highly Recommended',
          content: 'Outstanding course content and instructor support. Worth every penny!',
          isVerified: false,
          isPublished: true,
        },
      }),
    ]);

    // ============================================
    // 19. NOTIFICATIONS
    // ============================================
    console.log('🔔 Seeding Notifications...');
    const notifications = await Promise.all([
      prisma.notification.create({
        data: {
          userId: users[2].id,
          type: 'COURSE',
          title: 'New lesson available',
          message: 'A new lesson "Building AI-Ready Organizations" is now available in your AI Transformation Manager course.',
          data: { "course_id": courses[0].id, "lesson_id": lessons[2].id },
          isRead: false,
        },
      }),
      prisma.notification.create({
        data: {
          userId: users[2].id,
          type: 'ACHIEVEMENT',
          title: 'Course completed!',
          message: 'Congratulations! You have successfully completed the No-Code Website Development course.',
          data: { "course_id": courses[1].id, "certificate_id": certificates[0].id },
          isRead: true,
          readAt: new Date('2024-07-16T09:00:00Z'),
        },
      }),
      prisma.notification.create({
        data: {
          userId: users[3].id,
          type: 'PAYMENT',
          title: 'Payment pending',
          message: 'Your payment for the AI Transformation Manager course is still processing. Please check your payment method.',
          data: { "payment_id": payments[2].id },
          isRead: false,
        },
      }),
      prisma.notification.create({
        data: {
          userId: users[0].id,
          type: 'SYSTEM',
          title: 'System maintenance scheduled',
          message: 'Platform maintenance is scheduled for Sunday at 2:00 AM UTC. Expected downtime: 30 minutes.',
          isRead: true,
          readAt: new Date(),
        },
      }),
    ]);

    // ============================================
    // 20. PAGE VIEWS (Analytics)
    // ============================================
    console.log('📈 Seeding PageViews...');
    const pageViews = await Promise.all([
      prisma.pageView.create({
        data: {
          userId: users[2].id,
          sessionId: sessions[1].token,
          path: '/courses/ai-transformation-manager',
          referrer: 'https://google.com',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ipAddress: '192.168.1.101',
          country: 'United States',
        },
      }),
      prisma.pageView.create({
        data: {
          sessionId: 'anonymous_session_123',
          path: '/courses',
          referrer: 'https://aistudio555.ai',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          ipAddress: '192.168.1.102',
          country: 'Canada',
        },
      }),
      prisma.pageView.create({
        data: {
          userId: users[3].id,
          sessionId: 'student2_session_456',
          path: '/dashboard',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15',
          ipAddress: '192.168.1.103',
          country: 'United Kingdom',
        },
      }),
    ]);

    // ============================================
    // 21. COURSE ANALYTICS
    // ============================================
    console.log('📊 Seeding CourseAnalytics...');
    const courseAnalytics = await Promise.all([
      prisma.courseAnalytics.create({
        data: {
          courseId: courses[0].id,
          views: 1250,
          enrollments: 87,
          completions: 23,
          avgRating: 4.8,
          avgProgress: 45.5,
          date: new Date('2024-08-28'),
        },
      }),
      prisma.courseAnalytics.create({
        data: {
          courseId: courses[1].id,
          views: 890,
          enrollments: 156,
          completions: 98,
          avgRating: 4.3,
          avgProgress: 72.1,
          date: new Date('2024-08-28'),
        },
      }),
      prisma.courseAnalytics.create({
        data: {
          courseId: courses[2].id,
          views: 567,
          enrollments: 34,
          completions: 12,
          avgRating: 4.9,
          avgProgress: 38.2,
          date: new Date('2024-08-28'),
        },
      }),
    ]);

    // ============================================
    // 22. PARTNERS
    // ============================================
    console.log('🤝 Seeding Partners...');
    const partners = await Promise.all([
      prisma.partner.create({
        data: {
          locale: 'EN',
          name: 'TechCorp Solutions',
          logoId: mediaAssets[2].id,
          url: 'https://techcorp.com',
          blurb: 'Leading AI implementation partner',
          order: 1,
        },
      }),
      prisma.partner.create({
        data: {
          locale: 'EN',
          name: 'Innovation Labs',
          url: 'https://innovationlabs.ai',
          blurb: 'Cutting-edge research and development',
          order: 2,
        },
      }),
      prisma.partner.create({
        data: {
          locale: 'RU',
          name: 'AI Центр Москва',
          url: 'https://ai-center-moscow.ru',
          blurb: 'Ведущий центр искусственного интеллекта в России',
          order: 1,
        },
      }),
    ]);

    // ============================================
    // 23. TESTIMONIALS
    // ============================================
    console.log('💬 Seeding Testimonials...');
    const testimonials = await Promise.all([
      prisma.testimonial.create({
        data: {
          locale: 'EN',
          studentName: 'Alex Johnson',
          avatarId: mediaAssets[3].id,
          quote: 'The AI Transformation Manager course completely changed my career trajectory. I got promoted to Lead AI Strategist within 3 months of completion!',
          courseId: courses[0].id,
          order: 1,
          isPublished: true,
        },
      }),
      prisma.testimonial.create({
        data: {
          locale: 'EN',
          studentName: 'Maria Rodriguez',
          quote: 'I built my first professional website in just 2 weeks using the no-code techniques from this course. Amazing!',
          courseId: courses[1].id,
          order: 2,
          isPublished: true,
        },
      }),
      prisma.testimonial.create({
        data: {
          locale: 'RU',
          studentName: 'Дмитрий Иванов',
          quote: 'Отличный курс! Теперь я работаю AI-консультантом в крупной компании. Спасибо за качественное обучение!',
          courseId: courses[0].id,
          order: 1,
          isPublished: true,
        },
      }),
    ]);

    // ============================================
    // 24. EVENTS
    // ============================================
    console.log('📅 Seeding Events...');
    const events = await Promise.all([
      prisma.event.create({
        data: {
          locale: 'EN',
          slug: 'ai-transformation-webinar-sep-2024',
          title: 'AI Transformation Strategies for 2025',
          description: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Join our expert panel discussion on upcoming AI trends and transformation strategies for businesses preparing for 2025." }] }] },
          startAt: new Date('2024-09-15T18:00:00Z'),
          endAt: new Date('2024-09-15T19:30:00Z'),
          location: 'Online',
          streamingUrl: 'https://zoom.us/webinar/12345',
          registerUrl: 'https://aistudio555.ai/events/register/ai-2025',
          coverId: mediaAssets[4].id,
          isPublished: true,
        },
      }),
      prisma.event.create({
        data: {
          locale: 'EN',
          slug: 'nocode-masterclass-oct-2024',
          title: 'No-Code Development Masterclass',
          description: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Hands-on workshop covering advanced no-code development techniques and best practices." }] }] },
          startAt: new Date('2024-10-02T16:00:00Z'),
          endAt: new Date('2024-10-02T18:00:00Z'),
          location: 'Online',
          streamingUrl: 'https://zoom.us/webinar/67890',
          registerUrl: 'https://aistudio555.ai/events/register/nocode-masterclass',
          isPublished: true,
        },
      }),
      prisma.event.create({
        data: {
          locale: 'RU',
          slug: 'ai-moscow-conference-2024',
          title: 'Конференция по ИИ - Москва 2024',
          description: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Крупнейшая конференция по искусственному интеллекту в России." }] }] },
          startAt: new Date('2024-11-10T09:00:00Z'),
          endAt: new Date('2024-11-10T18:00:00Z'),
          location: 'Moscow, Russia',
          registerUrl: 'https://aistudio555.ai/events/register/moscow-ai-2024',
          isPublished: false,
        },
      }),
    ]);

    // ============================================
    // 25. LEGAL DOCUMENTS
    // ============================================
    console.log('📜 Seeding LegalDocuments...');
    const legalDocs = await Promise.all([
      prisma.legalDocument.create({
        data: {
          locale: 'EN',
          slug: 'terms-of-service',
          title: 'Terms of Service',
          body: { "type": "doc", "content": [
            { "type": "heading", "attrs": { "level": 1 }, "content": [{ "type": "text", "text": "Terms of Service" }] },
            { "type": "paragraph", "content": [{ "type": "text", "text": "By accessing and using AiStudio555 Academy, you agree to comply with these terms and conditions." }] },
            { "type": "heading", "attrs": { "level": 2 }, "content": [{ "type": "text", "text": "Course Access and Usage" }] },
            { "type": "paragraph", "content": [{ "type": "text", "text": "Course content is provided for educational purposes only and is subject to intellectual property protections." }] }
          ] },
          isPublished: true,
        },
      }),
      prisma.legalDocument.create({
        data: {
          locale: 'EN',
          slug: 'privacy-policy',
          title: 'Privacy Policy',
          body: { "type": "doc", "content": [
            { "type": "heading", "attrs": { "level": 1 }, "content": [{ "type": "text", "text": "Privacy Policy" }] },
            { "type": "paragraph", "content": [{ "type": "text", "text": "This privacy policy describes how we collect, use, and protect your personal information." }] },
            { "type": "heading", "attrs": { "level": 2 }, "content": [{ "type": "text", "text": "Information We Collect" }] },
            { "type": "paragraph", "content": [{ "type": "text", "text": "We collect information you provide directly to us, such as when you create an account or enroll in courses." }] }
          ] },
          isPublished: true,
        },
      }),
      prisma.legalDocument.create({
        data: {
          locale: 'RU',
          slug: 'terms-of-service',
          title: 'Условия использования',
          body: { "type": "doc", "content": [
            { "type": "heading", "attrs": { "level": 1 }, "content": [{ "type": "text", "text": "Условия использования" }] },
            { "type": "paragraph", "content": [{ "type": "text", "text": "Получая доступ к AiStudio555 Academy, вы соглашаетесь соблюдать эти условия." }] }
          ] },
          isPublished: true,
        },
      }),
    ]);

    // ============================================
    // 26. CAMPAIGNS
    // ============================================
    console.log('📢 Seeding Campaigns...');
    const campaigns = await Promise.all([
      prisma.campaign.create({
        data: {
          locale: 'EN',
          slug: 'summer-ai-bootcamp-2024',
          title: 'Summer AI Bootcamp 2024',
          body: { "type": "doc", "content": [
            { "type": "heading", "attrs": { "level": 1 }, "content": [{ "type": "text", "text": "Transform Your Career This Summer!" }] },
            { "type": "paragraph", "content": [{ "type": "text", "text": "Join our intensive 8-week AI bootcamp and become job-ready in artificial intelligence." }] },
            { "type": "bulletList", "content": [
              { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "25% discount on all AI courses" }] }] },
              { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Free 1-on-1 mentoring sessions" }] }] },
              { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Job placement assistance" }] }] }
            ] }
          ] },
          bannerId: mediaAssets[5].id,
          discountPct: 25,
          startsAt: new Date('2024-06-01T00:00:00Z'),
          endsAt: new Date('2024-08-31T23:59:59Z'),
          active: true,
        },
      }),
      prisma.campaign.create({
        data: {
          locale: 'EN',
          slug: 'back-to-school-special',
          title: 'Back to School Special',
          body: { "type": "doc", "content": [
            { "type": "heading", "attrs": { "level": 1 }, "content": [{ "type": "text", "text": "Back to School Special Offer" }] },
            { "type": "paragraph", "content": [{ "type": "text", "text": "Get ready for the new academic year with our comprehensive course bundle." }] }
          ] },
          discountPct: 30,
          startsAt: new Date('2024-08-15T00:00:00Z'),
          endsAt: new Date('2024-09-30T23:59:59Z'),
          active: true,
        },
      }),
    ]);

    // ============================================
    // 27. ANNOUNCEMENTS
    // ============================================
    console.log('📣 Seeding Announcements...');
    const announcements = await Promise.all([
      prisma.announcement.create({
        data: {
          locale: 'EN',
          kind: 'GENERAL',
          title: 'Welcome to AiStudio555 Academy!',
          message: 'We\'re excited to have you join our learning community. Start your AI transformation journey today!',
          startsAt: new Date('2024-08-01T00:00:00Z'),
          priority: 1,
          isPublished: true,
        },
      }),
      prisma.announcement.create({
        data: {
          locale: 'EN',
          kind: 'PROMOTION',
          title: 'Limited Time: 25% Off All Courses',
          message: 'Don\'t miss our summer promotion! Use code SUMMER2024 at checkout to save 25% on any course.',
          startsAt: new Date('2024-08-15T00:00:00Z'),
          endsAt: new Date('2024-09-15T23:59:59Z'),
          priority: 5,
          isPublished: true,
        },
      }),
      prisma.announcement.create({
        data: {
          locale: 'EN',
          kind: 'MAINTENANCE',
          title: 'Scheduled Maintenance',
          message: 'System maintenance scheduled for Sunday, September 1st at 2:00 AM UTC. Expected downtime: 30 minutes.',
          startsAt: new Date('2024-08-25T00:00:00Z'),
          endsAt: new Date('2024-09-02T00:00:00Z'),
          priority: 3,
          isPublished: true,
        },
      }),
    ]);

    // ============================================
    // 28. CAREER RESOURCES
    // ============================================
    console.log('💼 Seeding CareerResources...');
    const careerResources = await Promise.all([
      prisma.careerResource.create({
        data: {
          locale: 'EN',
          kind: 'article',
          title: 'How to Land Your First AI Job',
          description: 'Comprehensive guide covering resume tips, interview preparation, and skill development for AI careers.',
          url: 'https://aistudio555.ai/career/first-ai-job-guide',
          isPublished: true,
          order: 1,
        },
      }),
      prisma.careerResource.create({
        data: {
          locale: 'EN',
          kind: 'template',
          title: 'AI Engineer Resume Template',
          description: 'Professional resume template specifically designed for AI and machine learning positions.',
          url: 'https://aistudio555.ai/downloads/ai-engineer-resume-template.pdf',
          isPublished: true,
          order: 2,
        },
      }),
      prisma.careerResource.create({
        data: {
          locale: 'EN',
          kind: 'link',
          title: 'Top AI Job Boards',
          description: 'Curated list of the best job boards and platforms for finding AI and ML positions.',
          url: 'https://aistudio555.ai/career/ai-job-boards',
          isPublished: true,
          order: 3,
        },
      }),
      prisma.careerResource.create({
        data: {
          locale: 'RU',
          kind: 'article',
          title: 'Карьера в области ИИ в России',
          description: 'Руководство по построению карьеры в сфере искусственного интеллекта в России.',
          url: 'https://aistudio555.ai/career/ai-career-russia',
          isPublished: true,
          order: 1,
        },
      }),
    ]);

    console.log('✅ Database seeding completed successfully!');
    console.log(`
📊 SEEDING SUMMARY:
- 👥 Users: ${users.length}
- 👤 User Profiles: ${userProfiles.length}  
- 🔐 Sessions: ${sessions.length}
- 🎓 Instructors: ${instructors.length}
- 📚 Categories: ${categories.length}
- 📖 Courses: ${courses.length}
- 📑 Modules: ${modules.length}
- 📝 Lessons: ${lessons.length}
- 🎓 Enrollments: ${enrollments.length}
- 📊 Progress: ${progress.length}
- 🏆 Certificates: ${certificates.length}
- 💳 Payments: ${payments.length}
- 🎫 Coupons: ${coupons.length}
- 📎 Resources: ${resources.length}
- 📋 Assignments: ${assignments.length}
- ✍️ Submissions: ${submissions.length}
- ⭐ Reviews: ${reviews.length}
- 🔔 Notifications: ${notifications.length}
- 📈 Page Views: ${pageViews.length}
- 📊 Course Analytics: ${courseAnalytics.length}
- 📸 Media Assets: ${mediaAssets.length}
- 🤝 Partners: ${partners.length}
- 💬 Testimonials: ${testimonials.length}
- 📅 Events: ${events.length}
- 📜 Legal Documents: ${legalDocs.length}
- 📢 Campaigns: ${campaigns.length}
- 📣 Announcements: ${announcements.length}
- 💼 Career Resources: ${careerResources.length}

🎉 ALL 28 TABLES SEEDED WITH COMPREHENSIVE DUMMY DATA!
`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed script failed:', e);
    process.exit(1);
  });