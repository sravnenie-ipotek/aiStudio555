# AiStudio555 — Complete Technology Stack

**Purpose**: Comprehensive technology stack for AiStudio555 platform  
**Last Updated**: December 2024  
**Status**: Production Ready

This document consolidates the complete technology stack for AiStudio555, an
online education platform specializing in career transformation through
practical, employment-focused AI and technology education. This stack supports
10,000+ concurrent students with enterprise-grade reliability.

---

## 📋 Table of Contents

1. [Frontend Stack](#frontend-stack)
2. [Backend Stack](#backend-stack)
3. [Database Layer](#database-layer)
4. [Monorepo Architecture](#monorepo-architecture)
5. [AI Subsystem](#ai-subsystem)
6. [DevOps & CI/CD](#devops-cicd)
7. [Quality Assurance](#quality-assurance)
8. [Authentication & Security](#authentication-security)
9. [Deployment Infrastructure](#deployment-infrastructure)
10. [Observability & Monitoring](#observability-monitoring)
11. [Development Workflow](#development-workflow)

---

## 🎨 Frontend Stack

### Core Framework

- **Framework**: Next.js 14.1.0 (TypeScript, App Router)
- **Runtime**: Node.js 20+ LTS
- **Package Manager**: pnpm 9.0+
- **Build System**: Turborepo for monorepo orchestration

### UI & Styling

- **CSS Framework**: Tailwind CSS v3.4+
- **Component Library**: Radix UI primitives + shadcn/ui components
- **Icons**: Lucide React
- **Fonts**: Rubik (Google Fonts) - 400, 600, 700 weights

### State & Data Management

- **State Management**: React Query (TanStack Query v5)
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Caching**: React Query with persistent cache

### Development Tools

- **TypeScript**: Full type safety across frontend
- **Linting**: ESLint with custom configuration
- **Formatting**: Prettier with automated formatting
- **Testing**: Vitest + React Testing Library

### Build & Performance

- **Build Tool**: Next.js built-in bundler (Turbopack in dev)
- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Bundle Analysis**: @next/bundle-analyzer
- **Performance**: Core Web Vitals monitoring

### Accessibility

- **Standards**: WCAG 2.2 AA compliance (minimum 90%+)
- **Tools**: Radix primitives for keyboard navigation
- **Testing**: axe-core integration in Cypress
- **Focus Management**: Focus-visible for keyboard users

---

## 🧩 Backend Stack

### Core Framework

- **Runtime**: Node.js 20+ (TypeScript)
- **Framework**: Express.js (simple, scalable)
- **Process Manager**: PM2 for production clustering
- **Alternative**: NestJS (optional for complex domains)

### API Architecture

- **API Design**: RESTful with consistent patterns
- **Validation**: Zod shared schemas (frontend + backend)
- **Routing Strategy**:
  - `/api/public/*` - Open endpoints
  - `/api/private/*` - Protected endpoints
- **Middleware**: CORS, Helmet, Rate Limiting

### Database Integration

- **ORM**: Prisma (typed client, migrations)
- **Connection**: PgBouncer connection pooling
- **Migrations**: `prisma migrate deploy` for production
- **Seeding**: Automated seed scripts for development

### Development & Testing

- **Testing**: Vitest + Supertest for integration tests
- **Development**: Hot reload with tsx
- **Debugging**: Built-in Node.js debugger support
- **Logging**: Structured logging with correlation IDs

---

## 🗄️ Database Layer

### Primary Database

- **Database**: PostgreSQL 14+
- **Development**: Local PostgreSQL or Docker
- **Production**: Dedicated server PostgreSQL
- **Connection Pooling**: PgBouncer (1000 client connections, 25 pool size)

### Performance Optimization

- **Indexing Strategy**: Composite indexes for common queries
- **Configuration**: Optimized for 32GB RAM servers
  - `shared_buffers = 8GB`
  - `effective_cache_size = 24GB`
  - `max_connections = 200`
  - `work_mem = 10485kB`

### Data Management

- **Migrations**: Prisma migrate with versioning
- **Backup Strategy**: Daily automated snapshots
- **Scaling**: Read replicas for heavy read workloads
- **Future Migration**: AWS RDS if compliance required

### Extensions

- **pgvector**: For AI/ML vector operations (future)
- **pg_stat_statements**: Query performance monitoring
- **pg_repack**: Online table maintenance

---

## 🏗️ Monorepo Architecture

### Repository Structure

```
/ (repo root)
├─ apps/
│  ├─ web/                # Next.js frontend
│  └─ api/                # Express backend
├─ packages/
│  ├─ ui/                 # Shared UI components
│  ├─ types/              # Shared TypeScript types
│  ├─ db/                 # Prisma schema + client
│  └─ utils/              # Shared utilities
├─ ai/                    # Local AI subsystem
├─ qa/                    # Testing infrastructure
└─ infra/                 # Scripts and Docker configs
```

### Workspace Management

- **Package Manager**: pnpm workspaces
- **Build System**: Turborepo with caching
- **Dependency Management**: Shared dependencies in root
- **Version Control**: Unified versioning with Changesets

### Shared Packages

- **@aistudio555/ui**: Tailwind + Radix components
- **@aistudio555/types**: Zod schemas + TypeScript types
- **@aistudio555/db**: Prisma client + migrations
- **@aistudio555/utils**: Logger, validators, helpers

### Build Pipeline

```json
{
  "pipeline": {
    "lint": { "outputs": [] },
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
    "test": { "dependsOn": ["^build"], "outputs": ["coverage/**"] },
    "dev": { "cache": false }
  }
}
```

---

## 🧠 AI Subsystem

### Architecture Overview

- **Location**: `/ai` directory in monorepo
- **Integration**: Library-style imports in API routes
- **Strategy**: Pluggable provider system

### Provider Support

- **Primary**: OpenAI (GPT-4, GPT-4o-mini)
- **Secondary**: Anthropic Claude
- **Fallback**: OpenRouter for model diversity
- **Local**: Claude Code MCP integration

### Core Components

```typescript
interface AIProvider {
  chat(req: ChatRequest): Promise<ChatResponse>;
}

interface ChatRequest {
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  stream?: boolean;
}
```

### Services

- **Chat Service**: `/ai/chat` endpoint with streaming
- **Search Service**: `/ai/search` with RAG capabilities
- **Vector Store**: SQLite-vss or PostgreSQL + pgvector
- **Guardrails**: PII scrubbing, rate limiting, content filtering

### Environment Configuration

```env
AI_PROVIDER=openai
OPENAI_API_KEY=...
AI_MODEL=gpt-4o-mini
AI_RATE_LIMIT_RPM=60
AI_GUARDRAILS=strict
```

---

## 🧰 DevOps & CI/CD

### Repository & Branching

- **Strategy**: Trunk-based development
- **Protection**: Protected `main` branch
- **Releases**: RC/prod tags for deployment
- **Monorepo**: Turborepo with selective builds

### CI/CD Pipeline

- **Platform**: GitHub Actions
- **PR Workflow**: lint → build → test → E2E → deploy preview
- **Deployment**:
  - Dev: Auto on `main` push
  - Staging: `vX.Y.Z-rc` tags + manual approval
  - Production: `vX.Y.Z` tags + manual approval

### Build Optimization

- **Caching**: Turborepo remote cache (Redis/S3)
- **Parallelization**: Affected packages only
- **Docker**: Multi-stage builds for production
- **Artifacts**: Build outputs cached between jobs

### Security

- **Secrets**: GitHub Actions secrets + environment variables
- **Scanning**: Dependabot for dependency vulnerabilities
- **SAST**: CodeQL for static analysis
- **Container**: Docker image scanning

---

## 🧪 Quality Assurance

### Testing Strategy

- **Unit Tests**: Vitest (frontend + backend)
- **Integration Tests**: Supertest for API endpoints
- **E2E Tests**: Cypress for user workflows
- **Visual Tests**: Playwright + AI validation

### Cypress Configuration

- **Viewports**: 320px, 375px, 768px, 1024px, 1280px, 1536px
- **Test Types**: Flows, forms, auth, tables, errors, responsiveness
- **Execution**:
  - Local: `cypress open` (GUI)
  - CI: `cypress run` (headless)
  - PR: Smoke tests + key viewports
  - Nightly: Full test matrix

### Playwright AI Validation

- **Purpose**: Layout validation, accessibility, visual regression
- **Process**: DOM capture + screenshot → AI analysis → issue reporting
- **Integration**: Custom `ai-validator.ts` service
- **Output**: Structured issue reports with severity levels

### Code Quality

- **Coverage**: 80%+ unit test coverage
- **Accessibility**: axe-core integration
- **Performance**: Lighthouse CI on staging
- **Standards**: ESLint, Prettier, TypeScript strict mode

---

## 🔐 Authentication & Security

### Authentication System

- **Strategy**: JWT (access + refresh tokens)
- **Password Hashing**: bcryptjs with salt
- **Token Storage**:
  - Access: Memory/localStorage (frontend)
  - Refresh: httpOnly cookies (secure)

### Authorization

- **Model**: Role-Based Access Control (RBAC)
- **Roles**: Student, Instructor, Admin
- **Permissions**: Resource-based permissions
- **Middleware**: Express middleware for route protection

### Security Measures

- **Headers**: Helmet.js for security headers
- **CORS**: Configured for specific origins
- **Rate Limiting**: express-rate-limit
- **Input Validation**: Zod schemas on all inputs
- **SQL Injection**: Prisma ORM prevents SQL injection

### Additional Security

- **2FA**: TOTP-based two-factor authentication
- **Session Management**: Secure session handling
- **Audit Logging**: Security events tracking
- **Password Policy**: Strong password requirements

---

## 🖥️ Deployment Infrastructure

### Server Architecture

- **Strategy**: Dedicated server deployment
- **OS**: Ubuntu 22.04 LTS
- **Web Server**: Nginx (reverse proxy + SSL termination)
- **Process Manager**: PM2 with cluster mode
- **SSL**: Let's Encrypt via Certbot

### Production Specifications

```yaml
Application Server:
  CPU: 8 vCPUs (Intel Xeon/AMD EPYC)
  RAM: 32GB DDR4
  Storage: 500GB NVMe SSD
  Network: 1Gbps bandwidth

Database Server:
  CPU: 4 vCPUs
  RAM: 16GB DDR4
  Storage: 1TB NVMe SSD (RAID 10)
  Backup: Daily snapshots
```

### PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'aistudio555-web',
      script: 'npm',
      args: 'start',
      instances: 2,
      exec_mode: 'cluster',
      env: { NODE_ENV: 'production', PORT: 3000 },
    },
    {
      name: 'aistudio555-api',
      script: 'npm',
      args: 'start',
      instances: 2,
      exec_mode: 'cluster',
      env: { NODE_ENV: 'production', PORT: 4000 },
    },
  ],
};
```

### Nginx Configuration

- **Reverse Proxy**: Routes to PM2 processes
- **SSL Termination**: TLS 1.2+ with strong ciphers
- **Gzip Compression**: Assets and API responses
- **Static Assets**: Direct serving with caching headers
- **Rate Limiting**: Application-level protection

---

## 📈 Observability & Monitoring

### Error Tracking

- **Frontend**: Sentry for client-side errors
- **Backend**: Sentry for server-side exceptions
- **Integration**: Automatic error reporting with context

### Uptime Monitoring

- **Service**: UptimeRobot pinging `/health` endpoint
- **Alerts**: Email/SMS for downtime events
- **SLA**: 99.9% uptime target (8.7h/year downtime)

### Performance Monitoring

- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **API Response**: <200ms for standard endpoints
- **Database**: Query performance monitoring
- **Lighthouse**: Automated performance testing in CI

### Logging Strategy

- **Structured Logs**: JSON format with correlation IDs
- **Storage**: PM2 logs with log rotation
- **Aggregation**: Centralized logging (future: ELK stack)
- **Retention**: 30 days application logs, 7 days debug logs

### Analytics

- **User Analytics**: Google Analytics 4
- **Tag Management**: Google Tag Manager
- **Conversion**: Custom event tracking
- **Performance**: Real User Monitoring (RUM)

---

## 💻 Development Workflow

### Environment Setup

```bash
# First-time setup
pnpm install
pnpm db:migrate
pnpm dev

# Daily development
pnpm dev                 # Turborepo starts all services
pnpm test               # Run all tests
pnpm qa:cypress:open    # Interactive E2E testing
pnpm qa:playwright      # AI/visual validation
```

### Scripts Reference

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "db:migrate": "prisma migrate deploy",
    "db:seed": "tsx infra/scripts/seed.ts",
    "qa:cypress": "cypress run",
    "qa:playwright": "playwright test"
  }
}
```

### Code Standards

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with custom rules
- **Formatting**: Prettier with automated formatting
- **Commits**: Conventional commits format
- **Testing**: Test-driven development encouraged

### Performance Targets

- **Build Time**: <3 minutes for full build
- **Dev Startup**: <10 seconds for all services
- **Hot Reload**: <200ms for code changes
- **Test Suite**: <2 minutes for full test run

---

## 🚀 Phase 2 Extensions

### AI Enhancements

- **Chatbot Service**: Enhanced conversational AI
- **Vector Database**: Qdrant or Supabase Vector
- **RAG System**: Knowledge base integration
- **Telemetry**: Token usage and cost tracking

### Scaling Considerations

- **Microservices**: Service decomposition
- **Container Orchestration**: Kubernetes migration
- **CDN**: CloudFlare for global distribution
- **Caching**: Redis for session and data caching

### Advanced Features

- **Real-time**: WebSocket support for live features
- **Mobile**: React Native mobile app
- **Offline**: PWA capabilities
- **Analytics**: Advanced learning analytics

---

## ✅ Technology Stack Summary

**Core Philosophy**: Modern, scalable, maintainable architecture with emphasis
on developer experience and production reliability.

### Key Strengths

- **Type Safety**: Full TypeScript coverage
- **Performance**: Sub-3s load times, 99.9% uptime
- **Developer Experience**: Fast builds, hot reload, comprehensive tooling
- **Quality**: 80%+ test coverage, automated quality gates
- **Security**: Enterprise-grade authentication and security
- **Scalability**: Monorepo architecture supporting 10,000+ users

### Technology Choices Rationale

- **Next.js**: React framework with excellent DX and performance
- **Express**: Simple, proven backend framework
- **PostgreSQL**: Reliable, feature-rich database
- **Tailwind**: Utility-first CSS for rapid development
- **Prisma**: Type-safe database access with excellent DX
- **PM2**: Production-grade process management

**AiStudio555 is architected for clarity, scalability, and testability with
modern best practices throughout.**
