# AiStudio555 Academy - Site Architecture Diagram (Based on TeachMeSkills Structure)

## 🏗️ Complete Site Structure & Navigation Flow

```
╔═══════════════════════════════════════════════════════════════════════════════════════════╗
║                           AISTUDIO555 ACADEMY - SITE ARCHITECTURE                          ║
║                         Based on TeachMeSkills.by Proven Structure                         ║
╚═══════════════════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    DOMAIN STRUCTURE                                      │
└─────────────────────────────────────────────────────────────────────────────────────────┘

                                ┌─────────────────────┐
                                │   aistudio555.ai    │
                                │   (Main Domain)     │
                                └──────────┬──────────┘
                                           │
                ┌──────────────────────────┼──────────────────────────┐
                │                          │                          │
        ┌───────▼──────────┐      ┌───────▼──────────┐      ┌────────▼─────────┐
        │   Main Site      │      │ month.aistudio555.ai│      │   api.           │
        │ (Next.js App)    │      │ (Course Enrollment) │      │ (Express API)    │
        └──────────────────┘      └──────────────────┘      └──────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          HOMEPAGE SECTIONS (ACTUAL ORDER)                                │
└─────────────────────────────────────────────────────────────────────────────────────────┘

Based on page.tsx and TeachMeSkills structure:

/
├── 📍 HEADER/NAVIGATION
│   ├── Logo (AiStudio555)
│   ├── Menu Items:
│   │   ├── Курсы (Courses)
│   │   ├── Старт месяца (Monthly Starts) → month.aistudio555.ai
│   │   ├── Преподаватели (Teachers)
│   │   ├── Блог (Blog)
│   │   └── О школе (About School)
│   │       ├── Профориентация (Career Orientation)
│   │       └── Центр карьеры (Career Center)
│   └── Contact: +375 29 XXX-XX-XX
│
├── 🏠 HOME PAGE SECTIONS (/)
│   │
│   ├── 1️⃣ HERO SECTION (<HeroSection />)
│   │   ├── Headline: "Научим программировать и поможем стать ITшником"
│   │   ├── Subheadline: Educational value proposition
│   │   ├── Background: Dark theme (#000000 - #191919)
│   │   └── Primary CTA: "Выбрать курс" → month.aistudio555.ai
│   │
│   ├── 2️⃣ STATISTICS SECTION (<StatisticsSection />)
│   │   ├── 11,000+ выпускников (Graduates)
│   │   ├── 170+ компаний-партнеров (Partner Companies)
│   │   ├── 95% трудоустройство (Employment Rate)
│   │   └── Средняя зарплата (Average Salary)
│   │
│   ├── 3️⃣ COURSES SECTION (<CoursesSection />)
│   │   ├── Title: "Самые востребованные направления в IT"
│   │   ├── Course Cards (Slider/Grid):
│   │   │   ├── Frontend Developer
│   │   │   ├── Python Developer  
│   │   │   ├── Java Developer
│   │   │   ├── iOS/Android Developer
│   │   │   ├── UX/UI Designer
│   │   │   ├── QA Engineer
│   │   │   ├── DevOps Engineer
│   │   │   └── Data Analyst
│   │   └── "Показать больше курсов" → Expand/Load more
│   │
│   ├── 4️⃣ DISTANCE LEARNING SECTION (<DistanceLearning />)
│   │   ├── Title: "О дистанционном обучении"
│   │   ├── Layout: 2-column grid
│   │   ├── Left: Text content about online education benefits
│   │   ├── Right: Visual element with yellow background (#FFDA17)
│   │   └── CTA: "Узнать больше" → /about-online-learning
│   │
│   ├── 5️⃣ BENEFITS SECTION (<BenefitsSection />)
│   │   ├── Гарантия трудоустройства (Job Guarantee)
│   │   ├── Практические проекты (Practical Projects)
│   │   ├── Менторская поддержка (Mentor Support)
│   │   ├── Гибкий график (Flexible Schedule)
│   │   ├── Сертификат (Certificate)
│   │   └── Карьерная поддержка (Career Support)
│   │
│   ├── 6️⃣ TESTIMONIALS SECTION (<TestimonialsSection />)
│   │   ├── Student Success Stories
│   │   ├── Video Testimonials
│   │   └── Carousel/Slider Component
│   │
│   └── 7️⃣ CTA SECTION (<CTASection />)
│       ├── Final Call-to-Action
│       ├── "Записаться на консультацию" (Get Consultation)
│       └── Contact Form or Phone Number

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              COURSE CATALOG STRUCTURE                                    │
└─────────────────────────────────────────────────────────────────────────────────────────┘

/courses
├── 📚 COURSE LIST PAGE
│   ├── Filters:
│   │   ├── By Direction (Frontend/Backend/Mobile/Design)
│   │   ├── By Duration (3/6/9/12 months)
│   │   ├── By Format (Online/Hybrid)
│   │   └── By Price Range
│   │
│   └── Course Cards:
│       ├── /courses/frontend-developer
│       ├── /courses/python-developer
│       ├── /courses/java-developer
│       ├── /courses/ios-developer
│       ├── /courses/android-developer
│       ├── /courses/ux-ui-designer
│       ├── /courses/qa-engineer
│       ├── /courses/devops-engineer
│       └── /courses/data-analyst

/courses/[course-slug]
├── 📖 INDIVIDUAL COURSE PAGE
│   ├── Course Hero
│   │   ├── Title & Description
│   │   ├── Duration & Format
│   │   └── Start Date
│   ├── Curriculum
│   │   └── Module Breakdown
│   ├── Instructors
│   ├── Projects & Portfolio
│   ├── Career Outcomes
│   ├── Price & Payment Options
│   └── Enrollment CTA → month.aistudio555.ai

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                   USER JOURNEY FLOWS                                     │
└─────────────────────────────────────────────────────────────────────────────────────────┘

🎯 PRIMARY CONVERSION PATH:
═════════════════════════════
    [Homepage Landing]
           │
           ▼
    [Hero CTA: "Выбрать курс"]
           │
    ┌──────┴──────┐
    ▼             ▼
[Direct to      [Browse 
 Enrollment]     Courses First]
    │             │
    │             ▼
    │        [Course Details]
    │             │
    └──────┬──────┘
           ▼
    [month.aistudio555.ai]
           │
           ▼
    [Select Start Date]
           │
           ▼
    [Registration Form]
           │
           ▼
    [Payment Options]
    ├── Full Payment (-10%)
    ├── 3 Installments
    └── 5 Installments
           │
           ▼
    [Enrollment Complete]

🔄 SECONDARY PATHS:
═══════════════════
1. Research Path:
   Home → Courses → Details → Reviews → Enrollment

2. Career Path:
   Home → Career Center → Consultation → Course Selection → Enrollment

3. Content Path:
   Blog → Related Course → Details → Enrollment

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                  NAVIGATION STRUCTURE                                    │
└─────────────────────────────────────────────────────────────────────────────────────────┘

Main Navigation:
════════════════
├── Курсы (Courses)
│   └── Links to /courses
├── Старт месяца (Monthly Starts)
│   └── Redirects to month.aistudio555.ai
├── Преподаватели (Teachers)
│   └── Links to /teachers
├── Блог (Blog)
│   └── Links to /blog
└── О школе (About School)
    ├── Профориентация → /proforientation
    └── Центр карьеры → /career-center

Footer Navigation:
══════════════════
├── Social Media
│   ├── Instagram
│   ├── Facebook
│   ├── LinkedIn
│   ├── YouTube
│   └── TikTok
├── Contact
│   ├── Phone: +375 29 XXX-XX-XX
│   └── Email: info@aistudio555.ai
└── Legal
    ├── Privacy Policy
    └── Terms of Service

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    API ENDPOINTS                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘

/api/
├── /auth
│   ├── POST /login
│   ├── POST /register
│   ├── POST /logout
│   └── GET  /refresh
│
├── /courses
│   ├── GET  /courses (list all)
│   ├── GET  /courses/:slug
│   ├── GET  /courses/categories
│   └── GET  /courses/filters
│
├── /enrollment
│   ├── POST /enrollment/create
│   ├── GET  /enrollment/:id
│   ├── POST /enrollment/payment
│   └── POST /enrollment/installment
│
├── /content
│   ├── GET  /blog/posts
│   ├── GET  /blog/post/:slug
│   ├── GET  /testimonials
│   └── GET  /statistics
│
└── /contact
    ├── POST /contact/consultation
    ├── POST /contact/callback
    └── POST /contact/support

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                  COMPONENT MAPPING                                       │
└─────────────────────────────────────────────────────────────────────────────────────────┘

File Structure to TeachMeSkills Sections:
═════════════════════════════════════════

apps/web/src/components/sections/
├── HeroSection.tsx       → Hero with "Научим программировать..."
├── StatisticsSection.tsx → 11,000+ graduates, stats
├── CoursesSection.tsx    → "Самые востребованные направления в IT"
├── DistanceLearning.tsx  → "О дистанционном обучении" (2-column)
├── BenefitsSection.tsx   → Benefits/advantages grid
├── TestimonialsSection.tsx → Student success stories
└── CTASection.tsx        → Final call-to-action

Missing/To Implement:
├── AboutSchool.tsx      → Detailed school information
├── CourseFilters.tsx    → Advanced filtering system
├── EnrollmentFlow.tsx   → month.aistudio555.ai integration
└── CareerCenter.tsx     → Career support section

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                   KEY DIFFERENCES                                        │
└─────────────────────────────────────────────────────────────────────────────────────────┘

TeachMeSkills Structure → AiStudio555 Implementation:
══════════════════════════════════════════════════════

1. Monthly Enrollment Subdomain:
   - TeachMeSkills: month.teachmeskills.by
   - AiStudio555: month.aistudio555.ai (to implement)

2. Distance Learning Section:
   - TeachMeSkills: Prominent section after courses
   - AiStudio555: ✅ Implemented as DistanceLearning.tsx

3. Course Presentation:
   - TeachMeSkills: Slider with "Show more" button
   - AiStudio555: Grid/Slider hybrid (to optimize)

4. Statistics Placement:
   - TeachMeSkills: Throughout page
   - AiStudio555: Dedicated section after Hero

5. Color Scheme:
   - Both use: Yellow (#FFDA17) as primary
   - Both use: Dark backgrounds (#000000, #191919)

╔═══════════════════════════════════════════════════════════════════════════════════════════╗
║                                    IMPLEMENTATION STATUS                                   ║
╠═══════════════════════════════════════════════════════════════════════════════════════════╣
║ ✅ Implemented:                                                                            ║
║    - Hero Section                                                                          ║
║    - Statistics Section                                                                    ║
║    - Courses Section                                                                       ║
║    - Distance Learning Section                                                             ║
║    - Benefits Section                                                                      ║
║    - Testimonials Section                                                                  ║
║    - CTA Section                                                                          ║
║                                                                                            ║
║ 🚧 To Implement:                                                                          ║
║    - month.aistudio555.ai subdomain                                                       ║
║    - Career Center pages                                                                   ║
║    - Teachers/Instructors page                                                            ║
║    - Advanced course filtering                                                            ║
║    - Student portal/dashboard                                                             ║
╚═══════════════════════════════════════════════════════════════════════════════════════════╝
```

---

## 📋 Quick Reference

### Page Flow
1. **Landing** → Hero → Statistics → Courses → Distance Learning → Benefits → Testimonials → CTA
2. **Enrollment** → Course Selection → month.aistudio555.ai → Payment → Confirmation
3. **Learning** → Portal Login → Dashboard → Lessons → Projects → Certificate

### Key CTAs
- Primary: "Выбрать курс" (Choose Course)
- Secondary: "Узнать больше" (Learn More)
- Tertiary: "Записаться" (Enroll)

### Color Palette
- Primary: #FFDA17 (Yellow)
- Dark: #000000, #191919
- Light: #F4F5F7
- Text: #303030, #7A7A7A

---

*Last Updated: December 2024*  
*Based on: TeachMeSkills.by structure analysis*  
*Project: AiStudio555 Academy*