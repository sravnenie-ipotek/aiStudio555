# ProjectDes AI Academy — Full Technology Stack (Finalized)

This document consolidates the **complete technology stack** for ProjectDes AI Academy,
an online education platform inspired by TeachMeSkills.by's proven model. It includes 
frontend, backend, database, DevOps, CI/CD, QA, and AI-powered learning features.
This stack supports 10,000+ concurrent students with enterprise-grade reliability.

---

## 🎨 Frontend (Web Client)

- **Framework**: Next.js (TypeScript, App Router)
- **UI Styling**: Tailwind CSS + Radix UI + shadcn/ui
- **State Management**: React Query (TanStack)
- **Forms & Validation**: React Hook Form + Zod
- **Auth Integration**: JWT (access + refresh) ready
- **Testing (unit)**: Vitest + React Testing Library
- **Accessibility**: Radix primitives, axe-core integration
- **Deployment**: Dedicated Server (Nginx + PM2 + local QA)

---

## 🧩 Backend (API)

- **Runtime**: Node.js + TypeScript
- **Framework**: Express (simple, scalable; NestJS optional)
- **Validation**: Zod shared schemas
- **Auth**: JWT + bcrypt + cookie/httpOnly refresh
- **Routing**: `/api/public/*` (open), `/api/private/*` (protected)
- **ORM**: Prisma (typed client, migrations)
- **Testing (unit/integration)**: Vitest + Supertest
- **Deployment**: Dedicated Server (PM2 process manager)

---

## 🗄️ Database

- **DB**: PostgreSQL
- **Provider**: Dedicated Server (PostgreSQL local instance)
- **ORM**: Prisma
- **Migrations**: `prisma migrate deploy`
- **Future Migration**: AWS RDS if scaling or compliance required

---

## 🧰 DevOps & CI/CD

- **Repo**: Monorepo (pnpm workspaces + Turborepo)
- **Branching model**: trunk‑based, protected `main`, RC/prod tags
- **CI/CD Runner**: GitHub Actions
- **PR CI**: lint → build → test → start services → Cypress smoke → Playwright
  AI (optional)
- **Nightly**: full responsiveness + AI audits
- **Deployments**:
  - Dev → auto on `main`
  - Staging → `vX.Y.Z-rc` tags + manual approval
  - Prod → `vX.Y.Z` tags + manual approval

- **Caching**: Turborepo remote cache (Redis local/S3)
- **Secrets**: GitHub Actions secrets + provider envs

---

## 🔐 Auth & Security

- JWT access + refresh
- bcrypt for passwords
- httpOnly refresh cookies (or DB token list)
- Helmet, CORS, rate limiting (Express middleware)
- Secrets: never in repo, `.env.example` only

---

## 📈 Observability

- **Error tracking**: Sentry (web + api)
- **Uptime**: UptimeRobot (ping `/health`)
- **Logs**: PM2 logs (frontend/backend), PostgreSQL logs (database)
- **Performance**: optional Lighthouse CI on staging

---

## 🧪 QA System

### Cypress (primary E2E)

- Tests: flows, forms, auth, tables, errors, responsiveness, a11y
- Viewport matrix: 320, 375, 768, 1024, 1280, 1536
- Local: `cypress open`; CI: `cypress run` headless
- PR CI: smoke + representative viewports
- Nightly: full matrix

### Playwright (supplemental)

- Used for AI/visual validation, DOM audits, multi‑tab, iframes, downloads
- AI Validator: DOM + screenshot → LLM → issues
- Runs locally for dev + optional CI gate

### Shared QA Layer

- `/qa/shared`: fixtures, utils, factories, `ai-validator.ts`
- Deterministic test data, MSW mocks for unstable externals
- Artifacts: screenshots, videos, JUnit/XML reports in CI

---

## 📚 Coding & Testing Standards

- **Selectors**: `data-cy` test IDs for stability
- **Tests**: short, single responsibility, page models for flows
- **Retries**: enabled in CI only
- **Accessibility**: axe-core baseline checks
- **Definition of Done**: new feature → Cypress flow + responsiveness check + AI
  audit if relevant

---

## 🔮 Phase 2 — AI Extensions

- **Chatbot Service**: `/ai/chat`, `/ai/search`
- **LLM Providers**: OpenAI / Anthropic / OpenRouter
- **Vector DB**: Supabase Vector / Qdrant (for RAG)
- **Telemetry**: log token counts, costs, latency
- **Rate limiting**: to protect API budgets
- **Frontend**: chat widget with streaming responses

---

## ✅ Summary

- **Frontend**: Next.js + Tailwind/Radix/shadcn + React Query + Zod
- **Backend**: Node/Express + Prisma + JWT + PostgreSQL (Dedicated Server)
- **CI/CD**: GitHub Actions (PR checks + nightly + staging/prod tags)
- **QA**: Cypress (flows, responsiveness, a11y) + Playwright AI (layout audits)
- **Observability**: Sentry + UptimeRobot + provider logs
- **AI Phase 2**: chatbot, vector DB, RAG, telemetry

AiStudio555 is designed for **clarity, scalability, and testability** with
modern best practices.
