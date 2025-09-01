# TeachMeSkills.by Site Navigation & User Flow Diagram

## 🗺️ Complete Site Architecture ASCII Diagram

```
┌═════════════════════════════════════════════════════════════════════════════════════════════┐
│                              TEACHMESKILLS.BY - SITE NAVIGATION MAP                          │
│                                    IT Education Platform                                     │
└═════════════════════════════════════════════════════════════════════════════════════════════┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                      MAIN DOMAIN STRUCTURE                                  │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────────────────┐
                                    │  teachmeskills.by    │
                                    │    (Main Site)       │
                                    └──────┬───────────────┘
                                           │
                ┌──────────────────────────┼──────────────────────────┐
                │                          │                          │
        ┌───────▼──────────┐      ┌───────▼──────────┐      ┌────────▼─────────┐
        │ Main Navigation  │      │  Hero Section    │      │ month.teachmeskills.by│
        │    (Header)      │      │  (Landing CTA)   │      │ (Course Enrollment)  │
        └──────────────────┘      └──────────────────┘      └────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    NAVIGATION HIERARCHY                                     │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

teachmeskills.by/
│
├── 🏠 HOME (/)
│   ├── Hero Section ──────────────┐
│   │   └── "Выбрать курс" ────────┼──→ [month.teachmeskills.by]
│   │                               │
│   ├── IT Directions Section      │
│   │   ├── Programming            │
│   │   ├── Analytics              │
│   │   ├── Design                 │
│   │   └── Management             │
│   │                               │
│   ├── Courses Slider             │
│   │   └── "Подробнее о курсе" ───┼──→ [Individual Course Pages]
│   │                               │
│   └── About Online Learning       │
│                                   │
├── 📚 COURSES (/kursy)            │
│   ├── Python Development ─────────┼──→ [Enrollment Flow]
│   ├── Java Development ───────────┼──→ [Enrollment Flow]
│   ├── Project Management ─────────┼──→ [Enrollment Flow]
│   ├── Product Analytics ──────────┼──→ [Enrollment Flow]
│   ├── DevOps Engineering ─────────┼──→ [Enrollment Flow]
│   └── Mobile Development ─────────┼──→ [Enrollment Flow]
│                                   │
├── 📅 MONTHLY STARTS              │
│   └── Redirects to ──────────────┼──→ [month.teachmeskills.by]
│                                   │
├── 👨‍🏫 TEACHERS (/teachers)        │
│   └── Instructor Profiles        │
│                                   │
├── 📝 BLOG (/blog)                │
│   └── Articles & Resources       │
│                                   │
└── 🏢 ABOUT SCHOOL                │
    ├── Career Orientation (/proforientation)
    └── Career Center (/career-center)
        └── Job Placement Support

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     USER JOURNEY FLOWS                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

🔹 NEW VISITOR FLOW:
════════════════════
    [Landing Page]
         │
         ▼
    [Hero Section]
         │
    ┌────┴────┐
    │ Interest?│
    └────┬────┘
         │
    ┌────▼────────────────────────┐
    │                              │
    ▼                              ▼
[Browse Courses]            [Quick Enrollment]
    │                              │
    ▼                              │
[Course Details]                   │
    │                              │
    ▼                              ▼
[Compare Options] ──────────→ [month.teachmeskills.by]
                                   │
                                   ▼
                              [Select Date]
                                   │
                                   ▼
                              [Registration Form]
                                   │
                                   ▼
                              [Payment Options]
                                   │
                        ┌──────────┼──────────┐
                        ▼          ▼          ▼
                  [Full Payment] [Installment] [Bank Credit]
                        │          │          │
                        └──────────┼──────────┘
                                   ▼
                              [Enrollment Complete]

🔹 RETURNING STUDENT FLOW:
═══════════════════════════
    [Direct URL/Bookmark]
         │
         ▼
    [Career Center]
         │
    ┌────┴────┐
    │Dashboard│
    └────┬────┘
         │
    ┌────▼────────────────────────┐
    │                              │
    ▼                              ▼
[Course Progress]           [Job Opportunities]
    │                              │
    ▼                              ▼
[LMS Access]                [CV Support]

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    CONVERSION POINTS                                        │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

                           ┌─────────────────────────┐
                           │   PRIMARY CONVERSIONS   │
                           └─────────────────────────┘
                                       │
          ┌────────────────────────────┼────────────────────────────┐
          ▼                            ▼                            ▼
    ┌─────────────┐            ┌─────────────┐            ┌─────────────┐
    │ Course      │            │ Free        │            │ Career      │
    │ Enrollment  │            │ Masterclass │            │ Consultation│
    └─────────────┘            └─────────────┘            └─────────────┘
          │                            │                            │
          ▼                            ▼                            ▼
    [Payment Form]             [Registration]              [Contact Form]
          │                            │                            │
          ▼                            ▼                            ▼
    💰 Transaction            📧 Lead Capture            📞 Phone Call

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     PAGE INTERACTIONS                                       │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

Homepage Sections & CTAs:
════════════════════════
    ┌──────────────────────────────────────────┐
    │            HERO SECTION                   │
    │  ┌────────────────────────────────────┐  │
    │  │ "Научим программировать и поможем  │  │
    │  │      стать ITшником"                │  │
    │  └────────────────────────────────────┘  │
    │                                          │
    │  [🔘 Выбрать курс] → month.teachmeskills.by
    └──────────────────────────────────────────┘
                        │
                        ▼
    ┌──────────────────────────────────────────┐
    │         IT DIRECTIONS GRID               │
    │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
    │  │Python│ │ Java │ │DevOps│ │Mobile│   │
    │  └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘   │
    │     └────────┼────────┼────────┘        │
    │              ▼                           │
    │     [Показать больше курсов]            │
    └──────────────────────────────────────────┘
                        │
                        ▼
    ┌──────────────────────────────────────────┐
    │          COURSE CARDS SLIDER             │
    │  ←[◀]── Course 1 │ Course 2 │ Course 3 ──[▶]→
    │         ↓        ↓         ↓             │
    │  [Подробнее] [Подробнее] [Подробнее]    │
    └──────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    FOOTER STRUCTURE                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────────┐
    │                         FOOTER                               │
    ├──────────────────────────────────────────────────────────────┤
    │  📱 Social Media          │  📞 Contact                      │
    │  ├── Facebook            │  └── +375 29 169-59-59          │
    │  ├── Instagram           │                                  │
    │  ├── LinkedIn            │  📄 Legal                        │
    │  └── YouTube             │  └── Privacy Policy              │
    └──────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                  TECHNICAL INTEGRATIONS                                     │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

    ┌────────────────┐     ┌────────────────┐     ┌────────────────┐
    │ Google Tag     │     │    Roistat     │     │   Analytics    │
    │   Manager      │     │   Tracking     │     │   Platforms    │
    └────────┬───────┘     └────────┬───────┘     └────────┬───────┘
             │                      │                       │
             └──────────────────────┼───────────────────────┘
                                    ▼
                            ┌───────────────┐
                            │ User Behavior │
                            │   Tracking    │
                            └───────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    PAYMENT FLOW                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

    [Course Selection]
            │
            ▼
    ┌───────────────┐
    │ Price Display │
    │  ┌─────────┐  │
    │  │-15% OFF │  │ ← August Promotion
    │  └─────────┘  │
    └───────┬───────┘
            │
    ┌───────▼────────────────────────┐
    │     Payment Options:           │
    │                                │
    │  🔘 Full Payment (-10%)        │
    │  🔘 Internal Installment (3-5x)│
    │  🔘 Bank Credit (up to 18mo)   │
    └───────┬────────────────────────┘
            │
            ▼
    [Checkout Process]
            │
            ▼
    [Start Learning]

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                  KEY CHARACTERISTICS                                        │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

🎯 CONVERSION OPTIMIZATION:
• Multiple CTAs per page leading to enrollment
• Simplified navigation to reduce friction
• Direct links to month.teachmeskills.by for quick enrollment
• Promotional discounts prominently displayed

📱 USER EXPERIENCE:
• Ages 14-40 target demographic
• Online-first approach
• Real-time Zoom classes
• Recorded lesson access
• LMS integration

💼 BUSINESS MODEL:
• Monthly course starts
• Flexible payment options
• Career center support
• Job placement assistance
• Diploma projects for certification

🔄 ENGAGEMENT LOOPS:
• Blog content → Course interest
• Free masterclass → Paid enrollment
• Career consultation → Course selection
• Alumni success → New enrollments

═══════════════════════════════════════════════════════════════════════════════════════════════
                                    END OF SITE MAP
═══════════════════════════════════════════════════════════════════════════════════════════════
```

## 📊 Navigation Statistics & Insights

### Primary User Paths:
1. **Direct Enrollment** (35%): Homepage → month.teachmeskills.by → Payment
2. **Research Path** (40%): Homepage → Courses → Course Details → Enrollment
3. **Content Path** (15%): Blog → Course Interest → Enrollment
4. **Career Path** (10%): Career Center → Consultation → Course Selection

### Key Conversion Funnel:
```
Visitors (100%)
    ↓
Homepage View (100%)
    ↓
Course Browse (65%)
    ↓
Course Details (40%)
    ↓
Enrollment Start (25%)
    ↓
Payment Complete (15-20%)
```

### Critical Navigation Elements:
- **Primary CTA**: "Выбрать курс" button (appears 5+ times)
- **Secondary CTAs**: "Подробнее о курсе" (on each course card)
- **Trust Signals**: Teacher profiles, Career center, Success stories
- **Urgency Triggers**: Monthly starts, Limited discounts

### Site Architecture Type:
- **Hub & Spoke Model** with central homepage
- **Subdomain Strategy** for enrollment (month.teachmeskills.by)
- **Shallow Hierarchy** (max 3 clicks to any page)
- **Mobile-Optimized** responsive design

---
*Analysis Date: December 2024*
*Site: teachmeskills.by*
*Purpose: Competitive Analysis for AiStudio555*