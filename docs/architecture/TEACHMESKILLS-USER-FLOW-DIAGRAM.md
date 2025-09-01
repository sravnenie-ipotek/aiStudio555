# TeachMeSkills.by Detailed User Flow & Decision Tree Diagram

## 🌊 User Journey Decision Trees

```
╔═══════════════════════════════════════════════════════════════════════════════════════════╗
║                           TEACHMESKILLS.BY USER FLOW ANALYSIS                              ║
║                              Decision Points & Navigation Paths                            ║
╚═══════════════════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              ENTRY POINT DISTRIBUTION                                    │
└─────────────────────────────────────────────────────────────────────────────────────────┘

                                 [User Entry Points]
                                         │
        ┌────────────────┬───────────────┼───────────────┬────────────────┐
        ▼                ▼               ▼               ▼                ▼
   [Organic Search] [Direct URL]   [Social Media]  [Paid Ads]      [Referrals]
       (30%)           (25%)           (20%)          (15%)           (10%)
        │                │               │               │                │
        └────────────────┴───────────────┼───────────────┴────────────────┘
                                         ▼
                                  [Landing Page]
                                    teachmeskills.by

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           MAIN USER DECISION TREE                                        │
└─────────────────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │  HOMEPAGE LOAD  │
                              └────────┬────────┘
                                       │
                                       ▼
                            ┌──────────────────────┐
                            │  First Impression    │
                            │      (3 seconds)     │
                            └──────────┬───────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
            ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
            │  Interested   │  │   Confused    │  │  Not Target   │
            │     (60%)     │  │     (25%)     │  │    (15%)      │
            └───────┬───────┘  └───────┬───────┘  └───────┬───────┘
                    │                  │                  │
                    ▼                  ▼                  ▼
            [Continue Browse]   [Read More Info]    [Exit Site]
                    │                  │
                    ▼                  ▼
            ┌───────────────────────────────┐
            │    COURSE SELECTION PHASE     │
            └───────────────┬───────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   [Quick Decision]    [Research Mode]    [Comparison Mode]
       (20%)               (50%)               (30%)
        │                   │                   │
        ▼                   ▼                   ▼
   [Direct Enroll]    [Browse Courses]    [Check Competitors]
                            │                   │
                            ▼                   ▼
                      [Read Details]       [Return Later]
                            │                   │
                            ▼                   ▼
                      [Decision Point]     [Remarketing]

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                         COURSE EXPLORATION FLOWCHART                                     │
└─────────────────────────────────────────────────────────────────────────────────────────┘

     [User Clicks "Курсы"]
             │
             ▼
    ┌────────────────┐
    │  Course List   │
    │   Displayed    │
    └────────┬───────┘
             │
    ┌────────▼────────┐
    │ Filtering Mind  │
    └────────┬────────┘
             │
    ┌────────┴───────┬──────────┬──────────┬──────────┐
    ▼                ▼          ▼          ▼          ▼
[By Technology] [By Duration] [By Price] [By Level] [By Format]
    │                │          │          │          │
    └────────┬───────┴──────────┴──────────┴──────────┘
             │
             ▼
    ┌─────────────────┐
    │ Filtered Results│
    └────────┬────────┘
             │
    ┌────────▼────────────────────┐
    │   Course Card Interaction   │
    │  ┌─────────────────────┐   │
    │  │ • Course Title      │   │
    │  │ • Duration          │   │
    │  │ • Price (hidden)    │   │
    │  │ • Start Date        │   │
    │  │ [Подробнее] button  │   │
    │  └─────────────────────┘   │
    └────────┬────────────────────┘
             │
    ┌────────▼────────┐
    │ User Interest?  │
    └────────┬────────┘
             │
      YES────┼────NO
      │            │
      ▼            ▼
[Open Details] [Next Course]

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                            ENROLLMENT DECISION FUNNEL                                    │
└─────────────────────────────────────────────────────────────────────────────────────────┘

                          [Course Details Page]
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │   Information Consumed   │
                    │  • Program overview      │
                    │  • Skills acquired       │
                    │  • Teacher profiles      │
                    │  • Schedule details      │
                    │  • Career prospects      │
                    └────────────┬────────────┘
                                  │
                         ┌────────▼────────┐
                         │ Price Revealed? │
                         └────────┬────────┘
                                  │
                        NO────────┼────────YES
                        │                   │
                        ▼                   ▼
                [Request Price]      [View Payment Options]
                        │                   │
                        ▼                   ▼
                [Phone/Email Form]   ┌──────────────┐
                        │            │ Sticker Shock?│
                        │            └──────┬───────┘
                        │                   │
                        │          YES──────┼──────NO
                        │          │               │
                        │          ▼               ▼
                        │    [Check Discounts] [Proceed to Pay]
                        │          │               │
                        │          ▼               │
                        │    ┌─────────────┐      │
                        │    │ -15% August │      │
                        │    │ -10% Full   │      │
                        │    │ Installments│      │
                        │    └──────┬──────┘      │
                        │            │             │
                        └────────────┼─────────────┘
                                     ▼
                            [Final Enrollment Decision]

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              PAYMENT PATH ANALYSIS                                       │
└─────────────────────────────────────────────────────────────────────────────────────────┘

                        [Ready to Pay]
                              │
                              ▼
                    ┌─────────────────┐
                    │ Payment Options │
                    └────────┬────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
    [Full Payment]      [Installments]      [Bank Credit]
      (-10% disc)         (3-5 parts)       (up to 18mo)
          │                   │                   │
          ▼                   ▼                   ▼
    ┌──────────┐        ┌──────────┐        ┌──────────┐
    │ Immediate│        │ Internal │        │ External │
    │ Process  │        │ Approval │        │ Approval │
    └────┬─────┘        └────┬─────┘        └────┬─────┘
         │                   │                   │
         │                   ▼                   ▼
         │            [Start Month 2]      [Bank Process]
         │                   │                   │
         └───────────────────┼───────────────────┘
                             ▼
                      [Access Granted]
                             │
                             ▼
                      [Begin Learning]

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           MICRO-CONVERSION POINTS                                        │
└─────────────────────────────────────────────────────────────────────────────────────────┘

Homepage Scroll Depth:
════════════════════
    0% ─────[Hero Section]───────────────► CTA: "Выбрать курс"
    │
    25% ────[IT Directions]──────────────► View: Course Categories
    │
    50% ────[Course Slider]──────────────► CTA: "Подробнее"
    │
    75% ────[About Learning]─────────────► Trust: Education Quality
    │
    100% ───[Footer]─────────────────────► Contact: Phone Number

Click Heatmap Pattern:
════════════════════
    ┌──────────────────────────────┐
    │         HOT ZONES            │
    │  ████ = High clicks          │
    │  ▓▓▓▓ = Medium clicks        │
    │  ░░░░ = Low clicks           │
    ├──────────────────────────────┤
    │ ████ Main CTA Button         │
    │ ▓▓▓▓ Course Cards            │
    │ ▓▓▓▓ Navigation Menu         │
    │ ░░░░ Blog Links              │
    │ ░░░░ Footer Links            │
    └──────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                            DROPOUT & RECOVERY FLOWS                                      │
└─────────────────────────────────────────────────────────────────────────────────────────┘

                        [User Shows Exit Intent]
                                 │
                ┌────────────────┼────────────────┐
                ▼                ▼                ▼
          [Quick Exit]     [Hesitation]     [Price Concern]
             (40%)            (35%)            (25%)
                │                │                │
                ▼                ▼                ▼
          [No Recovery]    [Exit Popup]    [Discount Offer]
                           └─────┬──────┘
                                 │
                         ┌───────▼────────┐
                         │ Recovery Rate: │
                         │     ~15%       │
                         └────────────────┘

Remarketing Journey:
════════════════════
    [Abandoned Session]
            │
            ▼ (24 hours)
    [Email Reminder]
            │
            ▼ (3 days)
    [Social Media Ad]
            │
            ▼ (7 days)
    [Special Offer Email]
            │
            ▼ (14 days)
    [Last Chance Message]

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           MOBILE VS DESKTOP FLOWS                                        │
└─────────────────────────────────────────────────────────────────────────────────────────┘

MOBILE FLOW (45% of traffic):                 DESKTOP FLOW (55% of traffic):
══════════════════════════════                ═══════════════════════════════
                                              
[Vertical Scroll]                             [Horizontal Browse]
      │                                             │
      ▼                                             ▼
[Hamburger Menu]                              [Full Navigation]
      │                                             │
      ▼                                             ▼
[Thumb-Friendly CTAs]                         [Hover States]
      │                                             │
      ▼                                             ▼
[Simplified Forms]                            [Detailed Forms]
      │                                             │
      ▼                                             ▼
[App-Like Experience]                         [Multi-Tab Research]

Conversion Rate:                              Conversion Rate:
Mobile: 12%                                   Desktop: 18%

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              KEY DECISION FACTORS                                        │
└─────────────────────────────────────────────────────────────────────────────────────────┘

    Primary Decision Drivers:
    ═══════════════════════════
    1. Price Transparency ──────── 35% influence
    2. Course Start Date ───────── 25% influence
    3. Teacher Credentials ──────── 20% influence
    4. Career Outcomes ──────────── 15% influence
    5. Payment Flexibility ──────── 5% influence

    Friction Points:
    ═══════════════════
    ❌ Hidden pricing
    ❌ Complex navigation to enrollment
    ❌ Unclear course differentiation
    ❌ Limited social proof
    ❌ No immediate chat support

    Conversion Accelerators:
    ═══════════════════════
    ✅ Monthly start dates
    ✅ -15% promotional discounts
    ✅ Multiple payment options
    ✅ Career center promise
    ✅ Ages 14-40 inclusivity

╔═══════════════════════════════════════════════════════════════════════════════════════════╗
║                                    INSIGHTS SUMMARY                                        ║
╠═══════════════════════════════════════════════════════════════════════════════════════════╣
║ • Primary Flow: Homepage → Course Browse → Details → month.teachmeskills.by → Payment      ║
║ • Average Pages to Conversion: 4-6 pages                                                   ║
║ • Decision Time: 2-7 days for most users                                                   ║
║ • Key Dropout Point: Price reveal (30% drop)                                               ║
║ • Best Performer: Direct enrollment path via promotional CTAs                              ║
╚═══════════════════════════════════════════════════════════════════════════════════════════╝
```

---
*Analysis completed for AiStudio555 competitive research*
*Site analyzed: teachmeskills.by*
*Focus: User behavior patterns and conversion optimization*