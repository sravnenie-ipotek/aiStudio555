# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## ⚠️ CRITICAL: Architecture Governance & File Organization

**THE `/docs/architecture/` DIRECTORY IS THE SINGLE SOURCE OF TRUTH**

### Strict Rules:

1. **NO CHANGES** to architecture without explicit user approval
2. **ALWAYS CHECK** `/docs/architecture/` before implementing anything
3. **WARN THE USER** if any request conflicts with documented architecture
4. **REQUIRE CONFIRMATION** before deviating from established patterns
5. **MAINTAIN STRICT FILE ORGANIZATION** - Every file must have a clear purpose
   and location

## 📁 CRITICAL: File Organization & Structure

### MANDATORY FILE ORGANIZATION PRINCIPLES:

1. **NO RANDOM FILE PLACEMENT** - Every file must follow the established
   structure
2. **CLEAR NAMING CONVENTIONS** - Use descriptive, searchable names
3. **LOGICAL GROUPING** - Related files must be grouped together
4. **CONSISTENT PATTERNS** - Follow the same organizational patterns throughout
5. **DOCUMENTATION** - Each directory should have a README explaining its
   purpose
6. **DOCS FOLDER IS DOCUMENTATION ONLY** - The `/docs/` directory must contain
   ONLY documentation files (`.md`, `.txt`, images). NO code, config files,
   or executable files. Config examples should be in `.md` format showing code
   blocks, not actual config files

### Project Structure & File Locations:

```
projectdes-academy/
├── apps/                      # Application workspaces
│   ├── web/                  # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/         # Next.js app router pages
│   │   │   ├── components/  # Page-specific components
│   │   │   ├── lib/         # Utility functions
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   ├── styles/      # Global styles
│   │   │   └── types/       # TypeScript types
│   └── api/                  # Express backend API
│       └── src/
│           ├── controllers/  # Route controllers
│           ├── routes/       # API route definitions
│           ├── middleware/   # Express middleware
│           ├── services/     # Business logic
│           ├── utils/        # Utility functions
│           └── config/       # Configuration files
├── packages/                  # Shared packages (monorepo)
│   ├── ui/                   # Shared UI components
│   │   └── src/
│   │       ├── components/  # Reusable UI components
│   │       ├── hooks/       # Shared hooks
│   │       ├── lib/         # UI utilities
│   │       └── styles/      # Shared styles
│   ├── types/                # Shared TypeScript types
│   │   └── src/
│   │       ├── auth.ts      # Authentication types
│   │       ├── user.ts      # User-related types
│   │       ├── course.ts    # Course-related types
│   │       ├── payment.ts   # Payment types
│   │       └── api.ts       # API types
│   ├── db/                   # Database layer (Prisma)
│   │   ├── prisma/          # Prisma schema & migrations
│   │   └── src/             # Database utilities
│   └── utils/                # Shared utilities
│       └── src/
│           ├── validation.ts # Validation utilities
│           ├── formatting.ts # Formatting helpers
│           ├── crypto.ts     # Encryption utilities
│           └── logger.ts     # Logging utilities
├── ai/                        # AI services
│   └── src/
│       ├── agents/          # AI agents
│       ├── chains/          # LangChain configurations
│       ├── prompts/         # AI prompts
│       └── services/        # AI service integrations
├── qa/                        # Quality assurance
│   ├── e2e/                 # End-to-end tests
│   ├── performance/         # Performance tests
│   └── security/            # Security tests
├── docs/                      # Documentation
│   ├── architecture/        # Architecture docs (SOURCE OF TRUTH)
│   │   ├── baseArchitecture/
│   │   ├── db/
│   │   ├── design/
│   │   ├── qa/
│   │   └── cicd/
│   ├── md files/            # General markdown documentation
│   └── examples/            # Code examples
├── scripts/                   # Build & utility scripts
│   ├── setup/              # Setup scripts
│   ├── deploy/             # Deployment scripts
│   └── utils/              # Utility scripts
├── config/                    # Root configuration files
│   ├── nginx/              # Nginx configurations
│   ├── pm2/                # PM2 configurations
│   └── docker/             # Docker configurations
└── TODO/                     # Project task tracking
```

### File Naming Conventions:

- **Components**: PascalCase (e.g., `CourseCard.tsx`, `UserProfile.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`, `validateEmail.ts`)
- **Types**: PascalCase with descriptive suffixes (e.g., `UserProfile.ts`,
  `CourseData.ts`)
- **Configs**: kebab-case (e.g., `webpack.config.js`, `tailwind.config.js`)
- **Documentation**: UPPERCASE for important docs (e.g., `README.md`,
  `CLAUDE.md`)

### STRICT SEARCH & ORGANIZATION RULES:

1. **Before creating ANY file**: Check if similar functionality exists
2. **Use descriptive paths**: `/packages/ui/src/components/cards/CourseCard.tsx`
   NOT `/packages/ui/CourseCard.tsx`
3. **Group by feature**: Keep related files together in feature folders
4. **Maintain index files**: Each package must have proper exports in index.ts
5. **Document new directories**: Add README.md to explain purpose of new
   directories

### When User Requests Conflict with Architecture:

```
⚠️ WARNING: This request conflicts with the documented architecture in /docs/architecture/
- Current architecture specifies: [what the docs say]
- Your request would: [what would change]
- Impact: [potential consequences]

Do you want to:
1. Proceed anyway (requires your explicit approval)
2. Follow the documented architecture
3. Update the architecture documentation first
```

### Architecture Documentation Hierarchy:

1. `/docs/architecture/baseArchitecture/` - Core system design (NEVER override)
2. `/docs/architecture/db/` - Database schema (changes need migration plan)
3. `/docs/architecture/design/` - UI/UX standards (maintain consistency)
4. `/docs/architecture/qa/` - Testing standards (enforce quality)
5. `/docs/architecture/cicd/` - Deployment processes (follow strictly)

## Project Overview

Projectdes AI Academy is an online education platform specializing in practical
AI transformation training. The platform aims to transform working professionals
into certified AI specialists through fast-track, project-based learning
programs.

**Key Business Context:**

- 3 flagship courses: AI Transformation Manager, No-Code Website Development, AI
  Video & Avatar Generation
- Multi-language support (Russian, Hebrew, English)
- International job placement guarantees in 5+ countries
- Pricing: $1,000-$1,500 per course with installment plans

## Architecture & Technology Stack

### Current Implementation Status

This is a **design documentation repository** for the Projectdes AI Academy
platform. The actual implementation is planned with the following architecture:

### Frontend (Planned)

- **Framework**: Next.js with TypeScript (App Router)
- **Styling**: Tailwind CSS v3.4+ with custom configuration
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Query (TanStack)
- **Forms**: React Hook Form + Zod validation
- **Fonts**: Rubik (400, 600, 700 weights)

### Backend (Planned)

- **Runtime**: Node.js + TypeScript
- **Framework**: Express (or NestJS optional)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (access + refresh tokens)
- **Validation**: Zod shared schemas

### Deployment (Planned)

- **Infrastructure**: Dedicated Server (VPS/Bare Metal)
- **Web Server**: Nginx (reverse proxy, SSL termination)
- **Process Manager**: PM2 (Node.js applications)
- **Database**: PostgreSQL (local instance with automated backups)
- **Monitoring**: PM2 monitoring, custom health checks
- **Local QA**: Development and testing on local environment before deployment

## Design System

The design system is thoroughly documented in `/docs/architecture/design/`:

### Core Design Tokens

```css
Primary Blue: #635bff
Primary Yellow: #FFDA17 (brand color)
Background: #f8fafc (light blue-gray)
Dark Background: #0f172a
```

### Typography

- Font: Rubik (Google Fonts)
- Heading sizes: 40px (xxl), 28px (xl), 22px (lg)
- Body text: 16px with 1.45 line-height
- 8px base spacing unit system

### Key Design Documents

- `tailwind.config.js`: Complete Tailwind configuration
- `baseDesign.md`: Design system implementation guide
- `COMPLETE-UI-COMPONENT-LIBRARY.md`: All UI components with Tailwind classes
- `TAILWIND-MIGRATION-GUIDE.md`: CSS to Tailwind conversion reference

## Development Commands

Since this is currently a documentation repository, there are no build/test
commands yet. When implementation begins, use:

```bash
# Future commands (not yet implemented):
pnpm install          # Install dependencies
pnpm dev             # Start development servers
pnpm build           # Build for production
pnpm test            # Run tests
pnpm lint            # Run linting
```

## Payment Integration Requirements

The platform requires integration with:

- **Stripe**: Primary payment processor (live keys required)
- **PayPal**: Secondary payment option
- **Course pricing**: Stored in COURSES database object

## Internationalization (i18n)

Multi-language support requirements:

- **Languages**: Russian (default), Hebrew, English
- **RTL Support**: Required for Hebrew
- **Translation System**: Key-based with localStorage persistence
- **Language Switcher**: Global header component

## Analytics & Tracking

Requires implementation of:

- Google Analytics 4 (GA4)
- Google Tag Manager (GTM)
- Custom event tracking for:
  - Course enrollment clicks
  - Payment completions
  - Form submissions
  - Page engagement (scroll depth, time on page)

## Course Data Structure

```javascript
{
  courseId: string,
  title: string,
  price: number,
  discountedPrice: number,
  duration: string,
  stripePriceId: string,
  paypalItemId: string
}
```

## Security Requirements

- Content Security Policy (CSP) headers
- HTTPS enforcement
- XSS protection
- Input validation on all forms
- Secure payment integration

## Performance Targets

- Lighthouse Score: 90+ Performance
- Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
- Page Weight: <2MB total
- Mobile-first responsive design

## Documentation Structure

- `/docs/projectdes-ai-academy-docs/prd/`: Product requirements and
  specifications
- `/docs/architecture/`: Technical architecture documentation
- `/docs/architecture/design/`: Design system and UI components
- `/docs/examples/`: HTML examples and prototypes

## Important Notes

1. This repository contains documentation and design specifications only - no
   production code yet
2. All payment integrations require proper API keys before implementation
3. The design system uses Tailwind CSS with extensive customization
4. Mobile responsiveness is critical - all components must work on mobile
   devices
5. Accessibility compliance (WCAG 2.1 AA) is required
