-- Direct SQL Seed Script
-- Insert dummy data into ALL 28 tables as requested

-- Users (3 different roles)
INSERT INTO "User" ("id", "email", "passwordHash", "emailVerified", "role", "firstName", "lastName", "displayName", "phoneNumber", "language", "timezone", "lastActiveAt", "profileImageUrl", "bio", "socialLinks", "metadata", "createdAt", "updatedAt") VALUES
('user-admin-001', 'admin@aistudio555.ai', '$2b$12$LQv3c1yqBwlVHpPjrPrJX.VW9ScGV7Z0jW8qyJkV5pJ1mVGvM8J8S', true, 'ADMIN', 'John', 'Admin', 'Administrator', '+1-555-0100', 'en', 'America/New_York', NOW(), 'https://avatar.com/admin.jpg', 'Platform administrator', '{"linkedin": "linkedin.com/in/admin"}', '{"role": "super_admin"}', NOW(), NOW()),
('user-instr-001', 'instructor@aistudio555.ai', '$2b$12$LQv3c1yqBwlVHpPjrPrJX.VW9ScGV7Z0jW8qyJkV5pJ1mVGvM8J8S', true, 'INSTRUCTOR', 'Sarah', 'Teacher', 'AI Expert Sarah', '+1-555-0200', 'en', 'Europe/London', NOW(), 'https://avatar.com/instructor.jpg', 'Senior AI Instructor', '{"linkedin": "linkedin.com/in/sarah-teacher"}', '{"expertise": ["AI", "ML"]}', NOW(), NOW()),
('user-stud-001', 'student@aistudio555.ai', '$2b$12$LQv3c1yqBwlVHpPjrPrJX.VW9ScGV7Z0jW8qyJkV5pJ1mVGvM8J8S', true, 'STUDENT', 'Mike', 'Johnson', 'Mike J', '+1-555-0300', 'en', 'America/Los_Angeles', NOW(), 'https://avatar.com/student.jpg', 'Aspiring AI specialist', '{"github": "github.com/mike-j"}', '{"goals": ["AI certification"]}', NOW(), NOW());

-- UserProfiles
INSERT INTO "UserProfile" ("userId", "fullName", "birthDate", "gender", "address", "city", "country", "postalCode", "emergencyContact", "educationLevel", "workExperience", "skills", "interests", "goals", "preferences", "accessibility", "createdAt", "updatedAt") VALUES
('user-admin-001', 'John Admin', '1985-06-15', 'male', '123 Admin St', 'New York', 'USA', '10001', '{"name": "Jane Admin", "phone": "+1-555-0101"}', 'MASTERS', 10, '["Leadership", "AI", "Management"]', '["Technology", "Education"]', '["Platform growth"]', '{"notifications": true}', '{"screenReader": false}', NOW(), NOW()),
('user-instr-001', 'Sarah Teacher', '1980-03-22', 'female', '456 Teacher Ave', 'London', 'UK', 'SW1A 1AA', '{"name": "John Teacher", "phone": "+44-20-7123-4567"}', 'PHD', 15, '["AI", "Machine Learning", "Teaching"]', '["AI Research", "Education"]', '["Student success"]', '{"notifications": true}', '{"screenReader": false}', NOW(), NOW()),
('user-stud-001', 'Mike Johnson', '1995-09-10', 'male', '789 Student Blvd', 'Los Angeles', 'USA', '90210', '{"name": "Lisa Johnson", "phone": "+1-555-0301"}', 'BACHELORS', 3, '["Programming", "Analysis"]', '["AI", "Technology"]', '["Career change to AI"]', '{"notifications": true}', '{"screenReader": false}', NOW(), NOW());

-- Sessions
INSERT INTO "Session" ("sessionToken", "userId", "expires", "createdAt", "updatedAt") VALUES
('session-admin-001', 'user-admin-001', NOW() + INTERVAL '30 days', NOW(), NOW()),
('session-instr-001', 'user-instr-001', NOW() + INTERVAL '30 days', NOW(), NOW()),
('session-stud-001', 'user-stud-001', NOW() + INTERVAL '30 days', NOW(), NOW());

-- Categories
INSERT INTO "Category" ("id", "name", "description", "slug", "parentId", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES
('cat-ai-001', '{"en": "AI & Machine Learning", "ru": "ИИ и Машинное обучение", "he": "בינה מלאכותית ולמידה אוטומטית"}', '{"en": "Artificial Intelligence and Machine Learning courses", "ru": "Курсы по искусственному интеллекту и машинному обучению", "he": "קורסי בינה מלאכותית ולמידה אוטומטית"}', 'ai-machine-learning', NULL, true, 1, NOW(), NOW()),
('cat-web-001', '{"en": "Web Development", "ru": "Веб-разработка", "he": "פיתוח אתרים"}', '{"en": "Web development and no-code solutions", "ru": "Веб-разработка и решения без кода", "he": "פיתוח אתרים ופתרונות ללא קוד"}', 'web-development', NULL, true, 2, NOW(), NOW());

-- Courses
INSERT INTO "Course" ("id", "title", "description", "shortDescription", "categoryId", "instructorId", "level", "status", "price", "discountPrice", "currency", "duration", "estimatedHours", "language", "prerequisites", "outcomes", "syllabus", "tags", "thumbnailUrl", "trailerVideoUrl", "isPublished", "publishedAt", "maxEnrollments", "enrollmentStartDate", "enrollmentEndDate", "startDate", "endDate", "certificateTemplate", "metadata", "createdAt", "updatedAt") VALUES
('course-ai-001', '{"en": "AI Transformation Manager", "ru": "Менеджер по трансформации ИИ", "he": "מנהל טרנספורמציה דיגיטלית"}', '{"en": "Transform your organization with AI technology", "ru": "Трансформируйте вашу организацию с помощью технологий ИИ", "he": "הפכו את הארגון שלכם עם טכנולוגיית בינה מלאכותית"}', '{"en": "Become an AI transformation leader", "ru": "Станьте лидером трансформации ИИ", "he": "הפכו למנהיגים בטרנספורמציה דיגיטלית"}', 'cat-ai-001', 'user-instr-001', 'INTERMEDIATE', 'PUBLISHED', 1500, 1200, 'USD', '12 weeks', 120, 'MULTILINGUAL', '["Business experience", "Basic technology knowledge"]', '["AI strategy development", "Team leadership", "Technology implementation"]', '{"modules": ["AI Fundamentals", "Strategy Planning", "Implementation"]}', '["AI", "Management", "Strategy"]', 'https://images.com/ai-course.jpg', 'https://videos.com/ai-trailer.mp4', true, NOW(), 100, NOW(), NOW() + INTERVAL '6 months', NOW() + INTERVAL '1 week', NOW() + INTERVAL '3 months', 'certificate-ai-template', '{"featured": true, "difficulty": 7}', NOW(), NOW()),
('course-web-001', '{"en": "No-Code Website Development", "ru": "Разработка сайтов без кода", "he": "פיתוח אתרים ללא קוד"}', '{"en": "Build professional websites without coding", "ru": "Создавайте профессиональные сайты без программирования", "he": "בנו אתרים מקצועיים ללא תכנות"}', '{"en": "Master no-code web development", "ru": "Освойте веб-разработку без кода", "he": "שלטו בפיתוח אתרים ללא קוד"}', 'cat-web-001', 'user-instr-001', 'BEGINNER', 'PUBLISHED', 1000, 800, 'USD', '8 weeks', 80, 'MULTILINGUAL', '["Basic computer skills"]', '["Website creation", "Design principles", "Business applications"]', '{"modules": ["Design Basics", "No-Code Tools", "Publishing"]}', '["Web Development", "No-Code", "Design"]', 'https://images.com/web-course.jpg', 'https://videos.com/web-trailer.mp4', true, NOW(), 200, NOW(), NOW() + INTERVAL '6 months', NOW() + INTERVAL '1 week', NOW() + INTERVAL '2 months', 'certificate-web-template', '{"featured": true, "difficulty": 4}', NOW(), NOW());

-- Modules
INSERT INTO "Module" ("id", "courseId", "title", "description", "sortOrder", "isPublished", "duration", "estimatedHours", "prerequisites", "objectives", "resources", "createdAt", "updatedAt") VALUES
('mod-ai-001', 'course-ai-001', '{"en": "AI Fundamentals", "ru": "Основы ИИ", "he": "יסודות הבינה המלאכותית"}', '{"en": "Introduction to AI concepts", "ru": "Введение в концепции ИИ", "he": "מבוא למושגי בינה מלאכותית"}', 1, true, '3 weeks', 30, '[]', '["Understand AI basics", "Identify opportunities"]', '["Reading materials", "Video lectures"]', NOW(), NOW()),
('mod-web-001', 'course-web-001', '{"en": "Design Basics", "ru": "Основы дизайна", "he": "יסודות העיצוב"}', '{"en": "Fundamentals of web design", "ru": "Основы веб-дизайна", "he": "יסודות עיצוב אתרים"}', 1, true, '2 weeks', 20, '[]', '["Design principles", "User experience"]', '["Design tools", "Templates"]', NOW(), NOW());

-- Lessons  
INSERT INTO "Lesson" ("id", "moduleId", "title", "description", "content", "type", "sortOrder", "isPublished", "duration", "videoUrl", "resources", "quiz", "assignments", "metadata", "createdAt", "updatedAt") VALUES
('lesson-ai-001', 'mod-ai-001', '{"en": "What is AI?", "ru": "Что такое ИИ?", "he": "מה זה בינה מלאכותית?"}', '{"en": "Introduction to artificial intelligence", "ru": "Введение в искусственный интеллект", "he": "מבוא לבינה מלאכותית"}', '{"en": "Comprehensive overview of AI technology...", "ru": "Полный обзор технологий ИИ...", "he": "סקירה מקיפה של טכנולוגיית בינה מלאכותית..."}', 'VIDEO', 1, true, 45, 'https://videos.com/ai-intro.mp4', '["AI glossary", "Case studies"]', '{"questions": [{"question": "What is AI?", "options": ["Computer program", "Human intelligence", "Machine intelligence"], "correct": 2}]}', '[]', '{"difficulty": 2}', NOW(), NOW()),
('lesson-web-001', 'mod-web-001', '{"en": "Design Principles", "ru": "Принципы дизайна", "he": "עקרונות עיצוב"}', '{"en": "Learn fundamental design principles", "ru": "Изучите основные принципы дизайна", "he": "למדו עקרונות עיצוב בסיסיים"}', '{"en": "Design principles for effective websites...", "ru": "Принципы дизайна для эффективных сайтов...", "he": "עקרונות עיצוב לאתרים יעילים..."}', 'VIDEO', 1, true, 30, 'https://videos.com/design-intro.mp4', '["Design guide", "Examples"]', '{"questions": [{"question": "Key design principle?", "options": ["Simplicity", "Complexity", "Random"], "correct": 0}]}', '[]', '{"difficulty": 1}', NOW(), NOW());

-- Enrollments
INSERT INTO "Enrollment" ("id", "userId", "courseId", "status", "enrolledAt", "startedAt", "completedAt", "progress", "lastAccessedAt", "paymentStatus", "paymentId", "certificateId", "metadata", "createdAt", "updatedAt") VALUES
('enroll-001', 'user-stud-001', 'course-ai-001', 'ACTIVE', NOW(), NOW(), NULL, 25, NOW(), 'PAID', 'payment-001', NULL, '{"preferred_language": "en"}', NOW(), NOW()),
('enroll-002', 'user-stud-001', 'course-web-001', 'COMPLETED', NOW() - INTERVAL '2 months', NOW() - INTERVAL '2 months', NOW() - INTERVAL '2 weeks', 100, NOW() - INTERVAL '2 weeks', 'PAID', 'payment-002', 'cert-001', '{"preferred_language": "en"}', NOW() - INTERVAL '2 months', NOW());

-- Progress
INSERT INTO "Progress" ("id", "userId", "lessonId", "status", "startedAt", "completedAt", "timeSpent", "score", "attempts", "lastAttemptAt", "notes", "metadata", "createdAt", "updatedAt") VALUES
('progress-001', 'user-stud-001', 'lesson-ai-001', 'COMPLETED', NOW() - INTERVAL '1 week', NOW() - INTERVAL '6 days', 45, 85, 1, NOW() - INTERVAL '6 days', 'Great introduction to AI concepts', '{"quiz_score": 85}', NOW() - INTERVAL '1 week', NOW() - INTERVAL '6 days'),
('progress-002', 'user-stud-001', 'lesson-web-001', 'COMPLETED', NOW() - INTERVAL '2 months', NOW() - INTERVAL '7 weeks', 30, 92, 1, NOW() - INTERVAL '7 weeks', 'Excellent design foundation', '{"quiz_score": 92}', NOW() - INTERVAL '2 months', NOW() - INTERVAL '7 weeks');

-- Certificates
INSERT INTO "Certificate" ("id", "userId", "courseId", "certificateNumber", "issuedAt", "expiresAt", "template", "metadata", "createdAt", "updatedAt") VALUES
('cert-001', 'user-stud-001', 'course-web-001', 'CERT-WEB-2024-001', NOW() - INTERVAL '2 weeks', NULL, 'certificate-web-template', '{"grade": "A", "completion_time": "7 weeks"}', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '2 weeks');

-- Payments
INSERT INTO "Payment" ("id", "userId", "amount", "currency", "status", "paymentMethod", "paymentIntentId", "refundId", "metadata", "createdAt", "updatedAt") VALUES
('payment-001', 'user-stud-001', 1200, 'USD', 'COMPLETED', 'STRIPE', 'pi_ai_course_001', NULL, '{"course_id": "course-ai-001", "discount_applied": true}', NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week'),
('payment-002', 'user-stud-001', 800, 'USD', 'COMPLETED', 'PAYPAL', 'pp_web_course_001', NULL, '{"course_id": "course-web-001", "discount_applied": true}', NOW() - INTERVAL '2 months', NOW() - INTERVAL '2 months');

-- Coupons
INSERT INTO "Coupon" ("id", "code", "type", "value", "currency", "description", "usageLimit", "usedCount", "validFrom", "validUntil", "isActive", "applicableCourses", "metadata", "createdAt", "updatedAt") VALUES
('coupon-001', 'EARLY20', 'PERCENTAGE', 20, 'USD', '{"en": "20% off early bird discount", "ru": "Скидка 20% для ранних покупателей", "he": "הנחה של 20% לרכישה מוקדמת"}', 100, 2, NOW() - INTERVAL '1 month', NOW() + INTERVAL '2 months', true, '["course-ai-001", "course-web-001"]', '{"campaign": "early_bird"}', NOW() - INTERVAL '1 month', NOW());

-- Resources
INSERT INTO "Resource" ("id", "title", "description", "type", "fileUrl", "downloadUrl", "fileSize", "mimeType", "isPublic", "tags", "metadata", "createdAt", "updatedAt") VALUES
('resource-001', '{"en": "AI Glossary", "ru": "Словарь ИИ", "he": "מילון בינה מלאכותית"}', '{"en": "Comprehensive AI terminology", "ru": "Полная терминология ИИ", "he": "טרמינולוגיה מקיפה של בינה מלאכותית"}', 'PDF', 'https://files.com/ai-glossary.pdf', 'https://downloads.com/ai-glossary.pdf', 2048000, 'application/pdf', true, '["AI", "Reference", "Glossary"]', '{"language": "multilingual"}', NOW(), NOW()),
('resource-002', '{"en": "Design Templates", "ru": "Шаблоны дизайна", "he": "תבניות עיצוב"}', '{"en": "Professional website templates", "ru": "Профессиональные шаблоны сайтов", "he": "תבניות אתרים מקצועיות"}', 'ZIP', 'https://files.com/design-templates.zip', 'https://downloads.com/design-templates.zip', 15728640, 'application/zip', false, '["Design", "Templates", "Web"]', '{"format": "figma"}', NOW(), NOW());

-- Assignments
INSERT INTO "Assignment" ("id", "lessonId", "title", "description", "instructions", "type", "dueDate", "maxScore", "isRequired", "allowLateSubmission", "metadata", "createdAt", "updatedAt") VALUES
('assign-001', 'lesson-ai-001', '{"en": "AI Analysis", "ru": "Анализ ИИ", "he": "ניתוח בינה מלאכותית"}', '{"en": "Analyze AI use cases", "ru": "Анализ случаев использования ИИ", "he": "ניתוח מקרי שימוש בבינה מלאכותית"}', '{"en": "Research and analyze 3 AI use cases in your industry", "ru": "Исследуйте и проанализируйте 3 случая использования ИИ в вашей отрасли", "he": "חקרו ונתחו 3 מקרי שימוש בבינה מלאכותית בתעשייה שלכם"}', 'ESSAY', NOW() + INTERVAL '1 week', 100, true, false, '{"word_limit": 1500}', NOW(), NOW());

-- Submissions
INSERT INTO "Submission" ("id", "assignmentId", "userId", "content", "attachments", "status", "submittedAt", "score", "feedback", "gradedAt", "gradedBy", "metadata", "createdAt", "updatedAt") VALUES
('subm-001', 'assign-001', 'user-stud-001', '{"content": "My analysis of AI use cases in healthcare, finance, and education..."}', '["https://files.com/submission-001.pdf"]', 'GRADED', NOW() - INTERVAL '3 days', 88, '{"en": "Excellent analysis with good examples", "ru": "Отличный анализ с хорошими примерами", "he": "ניתוח מצוין עם דוגמאות טובות"}', NOW() - INTERVAL '1 day', 'user-instr-001', '{"effort": "high"}', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day');

-- Reviews
INSERT INTO "Review" ("id", "userId", "courseId", "rating", "title", "content", "isPublished", "isVerified", "helpfulVotes", "metadata", "createdAt", "updatedAt") VALUES
('review-001', 'user-stud-001', 'course-web-001', 5, '{"en": "Excellent course!", "ru": "Отличный курс!", "he": "קורס מצוין!"}', '{"en": "This course completely changed my approach to web development. The no-code tools taught here are game-changing.", "ru": "Этот курс полностью изменил мой подход к веб-разработке. Инструменты без кода, которые здесь преподают, революционны.", "he": "הקורס הזה שינה לחלוטין את הגישה שלי לפיתוח אתרים. הכלים ללא קוד שמלמדים כאן משנים את המשחק."}', true, true, 15, '{"completion_verified": true}', NOW() - INTERVAL '2 weeks', NOW());

-- Notifications
INSERT INTO "Notification" ("id", "userId", "type", "title", "message", "actionUrl", "isRead", "readAt", "metadata", "createdAt", "updatedAt") VALUES
('notif-001', 'user-stud-001', 'COURSE_COMPLETION', '{"en": "Course Completed!", "ru": "Курс завершен!", "he": "הקורס הושלם!"}', '{"en": "Congratulations on completing No-Code Website Development", "ru": "Поздравляем с завершением курса разработки сайтов без кода", "he": "ברכות על השלמת הקורס לפיתוח אתרים ללא קוד"}', '/courses/course-web-001', true, NOW() - INTERVAL '2 weeks', '{"course_id": "course-web-001"}', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '2 weeks');

-- PageViews
INSERT INTO "PageView" ("id", "userId", "page", "userAgent", "ipAddress", "referrer", "sessionDuration", "metadata", "createdAt") VALUES
('pv-001', 'user-stud-001', '/courses/course-ai-001', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '192.168.1.100', 'https://aistudio555.ai', 120, '{"device": "desktop"}', NOW() - INTERVAL '2 hours'),
('pv-002', 'user-stud-001', '/courses/course-web-001', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)', '192.168.1.101', 'https://google.com', 300, '{"device": "mobile"}', NOW() - INTERVAL '3 hours');

-- CourseAnalytics
INSERT INTO "CourseAnalytics" ("id", "courseId", "date", "enrollments", "completions", "dropouts", "avgRating", "totalRevenue", "metadata", "createdAt", "updatedAt") VALUES
('ca-001', 'course-ai-001', CURRENT_DATE, 25, 8, 3, 4.6, 30000, '{"trending": true}', NOW(), NOW()),
('ca-002', 'course-web-001', CURRENT_DATE, 45, 38, 2, 4.8, 36000, '{"popular": true}', NOW(), NOW());

-- MediaAssets
INSERT INTO "MediaAsset" ("id", "filename", "originalName", "mimeType", "size", "url", "thumbnailUrl", "altText", "description", "uploadedBy", "tags", "isPublic", "metadata", "createdAt", "updatedAt") VALUES
('media-001', 'ai-course-thumbnail.jpg', 'AI Course Thumbnail.jpg', 'image/jpeg', 245760, 'https://cdn.aistudio555.ai/ai-course-thumbnail.jpg', 'https://cdn.aistudio555.ai/ai-course-thumbnail-sm.jpg', '{"en": "AI Transformation Manager course thumbnail", "ru": "Миниатюра курса менеджера трансформации ИИ", "he": "תמונה ממוזערת של קורס מנהל טרנספורמציה דיגיטלית"}', '{"en": "Course thumbnail image", "ru": "Изображение миниатюры курса", "he": "תמונת ממוזער של הקורס"}', 'user-admin-001', '["course", "thumbnail", "ai"]', true, '{"course_id": "course-ai-001"}', NOW(), NOW());

-- Infrastructure Tables

-- Instructors
INSERT INTO "Instructor" ("id", "userId", "bio", "expertise", "experience", "education", "certifications", "socialLinks", "hourlyRate", "availability", "rating", "totalStudents", "totalCourses", "languages", "timeZone", "isVerified", "isActive", "joinedAt", "metadata", "createdAt", "updatedAt") VALUES
('instr-001', 'user-instr-001', '{"en": "Expert AI instructor with 15+ years experience", "ru": "Эксперт-инструктор по ИИ с опытом работы 15+ лет", "he": "מדריך מומחה בבינה מלאכותית עם ניסיון של 15+ שנים"}', '["Artificial Intelligence", "Machine Learning", "Deep Learning", "Computer Vision"]', 15, '{"degree": "PhD in Computer Science", "university": "MIT", "year": 2008}', '["AWS Certified Machine Learning", "Google Cloud Professional ML Engineer"]', '{"linkedin": "linkedin.com/in/sarah-teacher", "twitter": "twitter.com/sarah_ai"}', 150, '{"days": ["monday", "tuesday", "wednesday"], "hours": "9-17"}', 4.9, 2847, 12, '["en", "ru", "he"]', 'Europe/London', true, true, NOW() - INTERVAL '3 years', '{"featured": true}', NOW() - INTERVAL '3 years', NOW());

-- Partners  
INSERT INTO "Partner" ("id", "name", "description", "type", "logoUrl", "websiteUrl", "contactEmail", "contactPhone", "isActive", "partnershipLevel", "benefits", "contractStartDate", "contractEndDate", "metadata", "createdAt", "updatedAt") VALUES
('partner-001', 'TechCorp Solutions', '{"en": "Leading technology consulting firm", "ru": "Ведущая технологическая консалтинговая фирма", "he": "חברת ייעוץ טכנולוגי מובילה"}', 'CORPORATE', 'https://logos.com/techcorp.png', 'https://techcorp.com', 'partnership@techcorp.com', '+1-800-TECH-CORP', true, 'PREMIUM', '["Job placement", "Internships", "Guest lectures"]', NOW() - INTERVAL '1 year', NOW() + INTERVAL '2 years', '{"discount": 15}', NOW() - INTERVAL '1 year', NOW());

-- Testimonials
INSERT INTO "Testimonial" ("id", "userId", "courseId", "content", "rating", "isPublished", "isFeatured", "position", "company", "avatarUrl", "metadata", "createdAt", "updatedAt") VALUES
('test-001', 'user-stud-001', 'course-web-001', '{"en": "This course transformed my career! I went from zero coding skills to building professional websites in just 8 weeks.", "ru": "Этот курс изменил мою карьеру! Я перешел от нулевых навыков программирования к созданию профессиональных сайтов всего за 8 недель.", "he": "הקורס הזה שינה את הקריירה שלי! עברתי מאפס כישורי תכנות לבניית אתרים מקצועיים ב-8 שבועות בלבד."}', 5, true, true, 'Marketing Manager', 'Digital Solutions Inc', 'https://avatars.com/mike-j.jpg', '{"verified": true, "completion_date": "2024-08"}', NOW() - INTERVAL '1 month', NOW());

-- Events
INSERT INTO "Event" ("id", "title", "description", "type", "startDate", "endDate", "location", "virtualUrl", "maxAttendees", "currentAttendees", "isPublished", "isFree", "price", "currency", "tags", "organizerId", "metadata", "createdAt", "updatedAt") VALUES
('event-001', '{"en": "AI in Business Webinar", "ru": "Вебинар ИИ в бизнесе", "he": "וובינר בינה מלאכותית בעסקים"}', '{"en": "Learn how AI is transforming modern business", "ru": "Узнайте, как ИИ трансформирует современный бизнес", "he": "למדו איך בינה מלאכותית משנה את העסקים המודרניים"}', 'WEBINAR', NOW() + INTERVAL '1 week', NOW() + INTERVAL '1 week' + INTERVAL '2 hours', 'Virtual', 'https://zoom.us/webinar/ai-business', 500, 127, true, true, 0, 'USD', '["AI", "Business", "Webinar"]', 'user-instr-001', '{"recording_available": true}', NOW(), NOW());

-- LegalDocuments
INSERT INTO "LegalDocument" ("id", "title", "content", "type", "version", "effectiveDate", "isActive", "metadata", "createdAt", "updatedAt") VALUES
('legal-001', '{"en": "Terms of Service", "ru": "Условия обслуживания", "he": "תנאי שירות"}', '{"en": "These terms govern your use of our platform...", "ru": "Эти условия регулируют использование нашей платформы...", "he": "התנאים הללו מסדירים את השימוש שלכם בפלטפורמה..."}', 'TERMS_OF_SERVICE', '2.1', NOW() - INTERVAL '6 months', true, '{"approved_by": "legal_team"}', NOW() - INTERVAL '6 months', NOW());

-- Campaigns
INSERT INTO "Campaign" ("id", "name", "description", "type", "status", "startDate", "endDate", "targetAudience", "budget", "spent", "conversions", "ctr", "metadata", "createdAt", "updatedAt") VALUES
('camp-001', 'Early Bird 2024', '{"en": "Early bird discount campaign", "ru": "Кампания скидок для ранних покупателей", "he": "קמפיין הנחות לרוכשים מוקדמים"}', 'DISCOUNT', 'ACTIVE', NOW() - INTERVAL '1 month', NOW() + INTERVAL '2 months', '{"demographics": ["age_25_45"], "interests": ["technology", "career_development"]}', 10000, 6500, 89, 3.2, '{"channel": "email_social"}', NOW() - INTERVAL '1 month', NOW());

-- Announcements
INSERT INTO "Announcement" ("id", "title", "content", "type", "priority", "targetAudience", "isPublished", "publishDate", "expiryDate", "metadata", "createdAt", "updatedAt") VALUES
('ann-001', '{"en": "New AI Course Launch", "ru": "Запуск нового курса ИИ", "he": "השקת קורס בינה מלאכותית חדש"}', '{"en": "We are excited to announce our new AI Transformation Manager course", "ru": "Мы рады объявить о нашем новом курсе менеджера трансформации ИИ", "he": "אנו שמחים להכריז על הקורס החדש שלנו למנהל טרנספורמציה דיגיטלית"}', 'PRODUCT_LAUNCH', 'HIGH', 'ALL', true, NOW() - INTERVAL '2 weeks', NOW() + INTERVAL '1 month', '{"featured": true}', NOW() - INTERVAL '2 weeks', NOW());

-- CareerResources
INSERT INTO "CareerResource" ("id", "title", "description", "type", "content", "fileUrl", "tags", "isPublished", "targetLevel", "metadata", "createdAt", "updatedAt") VALUES
('career-001', '{"en": "AI Career Roadmap", "ru": "Дорожная карта карьеры в ИИ", "he": "מפת דרכים לקריירה בבינה מלאכותית"}', '{"en": "Complete guide to building a career in AI", "ru": "Полное руководство по построению карьеры в ИИ", "he": "מדריך מלא לבניית קריירה בבינה מלאכותית"}', 'GUIDE', '{"en": "Comprehensive roadmap with skills, certifications, and job opportunities in AI field", "ru": "Полная дорожная карта с навыками, сертификациями и возможностями трудоустройства в области ИИ", "he": "מפת דרכים מקיפה עם כישורים, הסמכות והזדמנויות עבודה בתחום הבינה המלאכותית"}', 'https://resources.com/ai-career-roadmap.pdf', '["AI", "Career", "Roadmap", "Skills"]', true, 'BEGINNER', '{"downloads": 1247}', NOW(), NOW());

-- Display confirmation that all tables have been populated
SELECT 'Data insertion completed successfully!' as status;