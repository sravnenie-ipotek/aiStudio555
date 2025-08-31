UI/UX Bible – Web App Guidelines (Updated 2025)
A developer- & designer-focused reference that’s optimized for contemporary tools, trends, and compliance.
Core Principles
Clarity over cleverness: make the next action obvious.
Consistency in patterns, naming, and layouts.
System-minded constraints: spacing scales, tokens, grid.
Mobile-first, content-first approach.
Inclusive by default (WCAG 2.2 AA, soon 3.0).
Always communicate system status (loading, success, error).
Incorporate AI and personalization thoughtfully—enhance, don’t overwhelm.
UX Planet
+1
uxdesigninstitute.com
+1
Wikipedia
+2
TechRadar
+2
Layout & Spacing
Container: max-width 1280–1440px; padding 24px (desktop), 16px (mobile).
Grid: 12-col desktop, 6-col tablet, 4-col mobile; 16–24px gutters.
Spacing scale: multiples of 4px or 8px.
Vertical rhythm: 48–64px section gaps; card padding 16–24px.
Line length: 50–75 chars on desktop, 28–45 on mobile.
Bold block layouts and vibrant contrast trending this year.
TheeDigital
Typography
Two font families max (headings + body).
Base body: 16px (min 15px), line-height 1.5–1.6.
Hierarchy sizes: H1 (36–40px), H2 (28px), H3 (22px), body (16px), caption (12–14px).
Weights: headings 600–700; body 400–500.
Align left (or right for RTL).
Color & Contrast
Palette: Primary, Neutral (3–5 steps), Success, Warning, Danger, Info, Accent.
Contrast: body text ≥ 4.5:1; large/bold text ≥ 3:1.
Color semantics must be consistent.
Motion, Micro-interactions & Animation
Motion must serve meaning; micro-interactions must have a trigger, clear rules, feedback, loops/modes.
webstacks.com
+7
TheeDigital
+7
Hostinger
+7
Wikipedia
Durations: 100–300ms; easing: ease-in-out.
Honor prefers-reduced-motion.
AI, 3D & Personalization
AI-powered personalization: adaptive layouts, color schemes, microcopy—contextual and empathetic.
UX Planet
+1
Integrate 3D interactive components, spatial navigation, scrollytelling to enhance engagement.
Design Studio
+10
Behance
+10
pg-p.ctme.caltech.edu
+10
Creative motion design, generative design variations, and immersive storytelling should elevate, not distract.
pg-p.ctme.caltech.edu
Accessibility & Compliance
Adhere to WCAG 2.2 AA (and starting to plan for 3.0).
Wikipedia
+1
The European Accessibility Act (EAA) is in effect (from June 28, 2025) with real fines (up to €20k per violation)—so compliance is non-negotiable.
TechRadar
+1
Use inclusive practices: alt text, keyboard nav, color contrast, semantic ARIA, focus visibility.
Audit often, train teams, embed accessibility into your design systems and governance.
Mouseflow
+3
TechRadar
+3
arXiv
+3
Interactive Components & States
Buttons and interactive elements require all states: default, hover, active, focus-visible, disabled, loading, error.
Minimum tap target: 44×44px.
Button labels are verbs (“Save”, “Continue”), not “OK”.
Distinguish links (navigation) from buttons (actions).
Focus ring: 2–3px wide, high contrast.
Forms
Always-visible labels; placeholders only for examples.
Field height: 40–44px.
Real-time validation after blur; clearly explain how to fix issues.
Error handling: red + icon + aria-describedby.
Input types: use correct type or inputmode (email, tel, number) and support autofill.
Keyboard-friendly and accessible.
Navigation
Place consistently; use clear labels; highlight current page.
Breadcrumbs in deep hierarchies.
Persistent search bar with helpful “no results” workflow.
State & Feedback UI
Loading:
<300ms — no spinner
300–800ms — spinner
800ms — skeleton or placeholder
Success: inline + toast (3–5s).
Error: clear messaging + recovery path.
Empty states: informative + CTA.
Responsive & International UX
Breakpoints: xs ≤480px, sm 481–768px, md 769–1024px, lg 1025–1440px, xl ≥1441px.
Touch spacing: min 8–12px.
Support container queries.
Internationalization: RTL mirroring, allow 30–50% text expansion, localize dates/numbers/currency, avoid string concatenation.
Performance UX
Metrics: LCP < 2.5s, CLS < 0.1, INP < 200ms.
Optimize perceived load: skeletons, optimistic UI, reserved image space.
Style Systems & Tokens
Define tokens:
--space-1..8, --radius-sm/md/lg, --color-{semantic}, --font-size-{step}.
Radii: small controls 4–6px; cards/modals 8–12px.
Shadows: layered, subtle.
Dark mode: respect user system preferences, avoid pure black.
Emerging Design Languages
Apple’s Liquid Glass (launched June 2025)—fluid, translucent UI that adapts and responds to context. Useful for gestures-rich, immersive UIs.
Wikipedia
TechRadar
Wikipedia
Review Checklist
Design/Build
 Comply with spacing, contrast, grid, tokens
 Interactive states + keyboard focus
 Responsiveness across breakpoints
 Accessibility checks (WCAG 2.2, keyboard, alt, ARIA)
 Motion respectful of preferences
Pre-Ship
 Performance budgets (LCP, CLS, INP) met
 Accessibility audit included
 AI/3D elements user-tested
 Error handling and feedback solid
 Visual QA across themes (incl. Liquid Glass style if used)
