-- Corrected SQL Seed Script matching actual table schema
-- Insert dummy data into all 28 tables

-- 1. Users (basic schema: id, email, passwordHash, emailVerified, role, createdAt, updatedAt, lastLoginAt)
INSERT INTO "User" ("id", "email", "passwordHash", "emailVerified", "role", "lastLoginAt") VALUES
('user-admin-001', 'admin@projectdes.ai', '$2b$12$LQv3c1yqBwlVHpPjrPrJX.VW9ScGV7Z0jW8qyJkV5pJ1mVGvM8J8S', true, 'ADMIN', NOW()),
('user-instr-001', 'instructor@projectdes.ai', '$2b$12$LQv3c1yqBwlVHpPjrPrJX.VW9ScGV7Z0jW8qyJkV5pJ1mVGvM8J8S', true, 'INSTRUCTOR', NOW()),
('user-stud-001', 'student@projectdes.ai', '$2b$12$LQv3c1yqBwlVHpPjrPrJX.VW9ScGV7Z0jW8qyJkV5pJ1mVGvM8J8S', true, 'STUDENT', NOW());

-- 2. UserProfiles (minimal data for existing schema)
INSERT INTO "UserProfile" ("userId") VALUES
('user-admin-001'),
('user-instr-001'),
('user-stud-001');

-- 3. Sessions  
INSERT INTO "Session" ("userId", "expires") VALUES
('user-admin-001', NOW() + INTERVAL '30 days'),
('user-instr-001', NOW() + INTERVAL '30 days'),
('user-stud-001', NOW() + INTERVAL '30 days');

-- 4. Categories
INSERT INTO "Category" ("id", "name", "description", "slug") VALUES
('cat-ai-001', '{"en": "AI & Machine Learning", "ru": "ИИ и Машинное обучение", "he": "בינה מלאכותית ולמידה אוטומטית"}', '{"en": "AI and ML courses", "ru": "Курсы ИИ и МО", "he": "קורסי בינה מלאכותית"}', 'ai-machine-learning'),
('cat-web-001', '{"en": "Web Development", "ru": "Веб-разработка", "he": "פיתוח אתרים"}', '{"en": "Web development courses", "ru": "Курсы веб-разработки", "he": "קורסי פיתוח אתרים"}', 'web-development');

-- 5. Instructors (need to create before courses)
INSERT INTO "Instructor" ("id") VALUES
('user-instr-001');

-- 6. Courses
INSERT INTO "Course" ("id", "slug", "title", "description", "price", "categoryId", "instructorId", "duration", "status") VALUES
('course-ai-001', 'ai-transformation-manager', '{"en": "AI Transformation Manager", "ru": "Менеджер трансформации ИИ", "he": "מנהל טרנספורמציה דיגיטלית"}', '{"en": "Transform your organization with AI", "ru": "Трансформируйте организацию с ИИ", "he": "הפכו את הארגון עם בינה מלאכותית"}', 1500.00, 'cat-ai-001', 'user-instr-001', 12, 'PUBLISHED'),
('course-web-001', 'no-code-website-development', '{"en": "No-Code Website Development", "ru": "Разработка без кода", "he": "פיתוח ללא קוד"}', '{"en": "Build websites without coding", "ru": "Создавайте сайты без кода", "he": "בנו אתרים ללא תכנות"}', 1000.00, 'cat-web-001', 'user-instr-001', 8, 'PUBLISHED');

-- 7. Modules
INSERT INTO "Module" ("id", "courseId", "title", "description", "order") VALUES
('mod-ai-001', 'course-ai-001', '{"en": "AI Fundamentals", "ru": "Основы ИИ", "he": "יסודות בינה מלאכותית"}', '{"en": "Learn AI basics", "ru": "Изучите основы ИИ", "he": "למדו יסודות בינה מלאכותית"}', 1),
('mod-web-001', 'course-web-001', '{"en": "Design Basics", "ru": "Основы дизайна", "he": "יסודות עיצוב"}', '{"en": "Web design fundamentals", "ru": "Основы веб-дизайна", "he": "יסודות עיצוב אתרים"}', 1);

-- 8. Lessons
INSERT INTO "Lesson" ("id", "moduleId", "title", "content", "type", "order", "duration") VALUES
('lesson-ai-001', 'mod-ai-001', '{"en": "What is AI?", "ru": "Что такое ИИ?", "he": "מה זה בינה מלאכותית?"}', '{"en": "Introduction to AI", "ru": "Введение в ИИ", "he": "מבוא לבינה מלאכותית"}', 'VIDEO', 1, 45),
('lesson-web-001', 'mod-web-001', '{"en": "Design Principles", "ru": "Принципы дизайна", "he": "עקרונות עיצוב"}', '{"en": "Learn design principles", "ru": "Изучите принципы дизайна", "he": "למדו עקרונות עיצוב"}', 'VIDEO', 1, 30);

-- 9. Enrollments
INSERT INTO "Enrollment" ("id", "userId", "courseId", "status", "enrolledAt") VALUES
('enroll-001', 'user-stud-001', 'course-ai-001', 'ACTIVE', NOW()),
('enroll-002', 'user-stud-001', 'course-web-001', 'COMPLETED', NOW() - INTERVAL '2 months');

-- 10. Progress
INSERT INTO "Progress" ("id", "userId", "lessonId", "status", "startedAt", "completedAt", "score") VALUES
('progress-001', 'user-stud-001', 'lesson-ai-001', 'COMPLETED', NOW() - INTERVAL '1 week', NOW() - INTERVAL '6 days', 85),
('progress-002', 'user-stud-001', 'lesson-web-001', 'COMPLETED', NOW() - INTERVAL '2 months', NOW() - INTERVAL '7 weeks', 92);

-- 11. Certificates
INSERT INTO "Certificate" ("id", "courseId", "certificateNumber", "issuedAt") VALUES
('cert-001', 'course-web-001', 'CERT-WEB-2024-001', NOW() - INTERVAL '2 weeks');

-- 12. Payments  
INSERT INTO "Payment" ("id", "userId", "amount", "currency", "status") VALUES
('payment-001', 'user-stud-001', 1200.00, 'USD', 'COMPLETED'),
('payment-002', 'user-stud-001', 800.00, 'USD', 'COMPLETED');

-- 13. Coupons
INSERT INTO "Coupon" ("id", "code", "discount", "description", "usageLimit", "validFrom", "validUntil", "isActive") VALUES
('coupon-001', 'EARLY20', 20, '{"en": "20% early bird discount", "ru": "Скидка 20%", "he": "הנחה של 20%"}', 100, NOW() - INTERVAL '1 month', NOW() + INTERVAL '2 months', true);

-- 14. Resources
INSERT INTO "Resource" ("id", "title", "type", "url", "isPublic") VALUES
('resource-001', '{"en": "AI Glossary", "ru": "Словарь ИИ", "he": "מילון בינה מלאכותית"}', 'PDF', 'https://files.com/ai-glossary.pdf', true),
('resource-002', '{"en": "Design Templates", "ru": "Шаблоны дизайна", "he": "תבניות עיצוב"}', 'ZIP', 'https://files.com/templates.zip', false);

-- 15. Assignments
INSERT INTO "Assignment" ("id", "lessonId", "title", "description", "type", "dueDate", "maxScore") VALUES
('assign-001', 'lesson-ai-001', '{"en": "AI Analysis", "ru": "Анализ ИИ", "he": "ניתוח בינה מלאכותית"}', '{"en": "Analyze AI use cases", "ru": "Анализ ИИ", "he": "ניתוח בינה מלאכותית"}', 'ESSAY', NOW() + INTERVAL '1 week', 100);

-- 16. Submissions
INSERT INTO "Submission" ("id", "assignmentId", "userId", "content", "status", "submittedAt", "score") VALUES
('subm-001', 'assign-001', 'user-stud-001', '{"content": "My AI analysis..."}', 'GRADED', NOW() - INTERVAL '3 days', 88);

-- 17. Reviews
INSERT INTO "Review" ("id", "userId", "courseId", "rating", "title", "content", "isPublished") VALUES
('review-001', 'user-stud-001', 'course-web-001', 5, '{"en": "Excellent!", "ru": "Отлично!", "he": "מצוין!"}', '{"en": "Great course", "ru": "Отличный курс", "he": "קורס מצוין"}', true);

-- 18. Notifications
INSERT INTO "Notification" ("id", "userId", "type", "title", "message", "isRead") VALUES
('notif-001', 'user-stud-001', 'COURSE_COMPLETION', '{"en": "Course Completed!", "ru": "Курс завершен!", "he": "הקורס הושלם!"}', '{"en": "Congratulations", "ru": "Поздравляем", "he": "ברכות"}', true);

-- 19. PageViews  
INSERT INTO "PageView" ("id", "userId", "path", "userAgent", "ipAddress") VALUES
('pv-001', 'user-stud-001', '/courses/ai-transformation', 'Mozilla/5.0', '192.168.1.100'),
('pv-002', 'user-stud-001', '/courses/web-development', 'Mozilla/5.0', '192.168.1.101');

-- 20. CourseAnalytics
INSERT INTO "CourseAnalytics" ("id", "courseId", "date", "enrollments", "completions", "revenue") VALUES
('ca-001', 'course-ai-001', CURRENT_DATE, 25, 8, 30000.00),
('ca-002', 'course-web-001', CURRENT_DATE, 45, 38, 36000.00);

-- 21. MediaAssets
INSERT INTO "MediaAsset" ("id", "filename", "originalName", "mimeType", "size", "url", "uploadedBy") VALUES
('media-001', 'ai-thumbnail.jpg', 'AI Course Thumbnail.jpg', 'image/jpeg', 245760, 'https://cdn.projectdes.ai/ai-thumbnail.jpg', 'user-admin-001');

-- 22. Partners
INSERT INTO "Partner" ("id", "name", "type", "logoUrl", "websiteUrl", "isActive") VALUES
('partner-001', 'TechCorp Solutions', 'CORPORATE', 'https://logos.com/techcorp.png', 'https://techcorp.com', true);

-- 23. Testimonials
INSERT INTO "Testimonial" ("id", "userId", "courseId", "content", "rating", "isPublished", "isFeatured") VALUES
('test-001', 'user-stud-001', 'course-web-001', '{"en": "Amazing course!", "ru": "Потрясающий курс!", "he": "קורס מדהים!"}', 5, true, true);

-- 24. Events
INSERT INTO "Event" ("id", "title", "description", "startDate", "endDate", "isPublished") VALUES
('event-001', '{"en": "AI Webinar", "ru": "Вебинар ИИ", "he": "וובינר בינה מלאכותית"}', '{"en": "Learn AI in business", "ru": "ИИ в бизнесе", "he": "בינה מלאכותית בעסקים"}', NOW() + INTERVAL '1 week', NOW() + INTERVAL '1 week' + INTERVAL '2 hours', true);

-- 25. LegalDocuments
INSERT INTO "LegalDocument" ("id", "title", "type", "version") VALUES
('legal-001', '{"en": "Terms of Service", "ru": "Условия", "he": "תנאי שירות"}', 'TERMS_OF_SERVICE', '2.1');

-- 26. Campaigns
INSERT INTO "Campaign" ("id", "description", "type", "status", "startDate", "endDate", "budget") VALUES
('camp-001', '{"en": "Early Bird Campaign", "ru": "Кампания", "he": "קמפיין"}', 'DISCOUNT', 'ACTIVE', NOW() - INTERVAL '1 month', NOW() + INTERVAL '2 months', 10000.00);

-- 27. Announcements
INSERT INTO "Announcement" ("id", "title", "type", "priority", "isPublished") VALUES
('ann-001', '{"en": "New Course Launch", "ru": "Новый курс", "he": "קורס חדש"}', 'PRODUCT_LAUNCH', 'HIGH', true);

-- 28. CareerResources
INSERT INTO "CareerResource" ("id", "title", "description", "content", "isPublished") VALUES
('career-001', '{"en": "AI Career Guide", "ru": "Карьерный путь ИИ", "he": "מדריך קריירה בבינה מלאכותית"}', '{"en": "Complete AI career roadmap", "ru": "Карьерная карта ИИ", "he": "מפת דרכים לקריירה בבינה מלאכותית"}', '{"en": "AI career guide content...", "ru": "Содержание гида...", "he": "תוכן המדריך..."}', true);

-- Success message
SELECT 'All 28 tables populated successfully with dummy data!' as result;