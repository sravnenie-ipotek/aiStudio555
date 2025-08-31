# AiStudio555 — Monorepo Infrastructure (Local + AI) — Bulletproof Guide

This document is the **authoritative blueprint** for the AiStudio555
**application monorepo** and the **local AI subsystem**. It covers folder
layout, tooling, scripts, environment management, AI provider wiring, local
vector search, Playwright+MCP integration, and day‑to‑day workflows on a
developer machine.

---

## 🎯 Objectives

- Single **monorepo** for web, API, shared packages, QA, and AI
- **Deterministic** local setup (one command to run everything)
- Local **AI stack** with pluggable providers (OpenAI/Claude) and optional
  **RAG** FOR NOW USE LOCAL CLAUDE CODE
- **Testability first**: Cypress (E2E), Playwright + AI audits
- Clear **scripts**, **envs**, and **troubleshooting**

---

## 🧱 Repo Layout (Top Level)

```
/ (repo root)
├─ apps/
│  ├─ web/                # Next.js (TS) client
│  └─ api/                # Node/Express (TS) server
│
├─ packages/
│  ├─ ui/                 # Tailwind + Radix + shadcn/ui components
│  ├─ types/              # Shared TS types + Zod schemas
│  ├─ db/                 # Prisma schema + client + migrations
│  └─ utils/              # Shared helpers (logger, config, fetch)
│
├─ ai/                    # Local AI subsystem (providers, prompts, RAG)
│  ├─ providers/          # openai.ts, anthropic.ts, router.ts (strategy)
│  ├─ prompts/            # system prompts, templates
│  ├─ rag/                # optional vector store & ingestion
│  │  ├─ store/           # sqlite/pgvector adapters
│  │  └─ ingest/          # loaders, chunkers, embedders
│  ├─ middleware/         # rate limiter, guardrails, PII scrubbing
│  ├─ services/           # chat.ts, search.ts, tools/
│  └─ README.md           # usage & examples
│
├─ qa/                    # QA root (Cypress + Playwright + shared)
│  ├─ cypress/
│  ├─ playwright/
│  └─ shared/
│
├─ infra/                 # Local scripts, docker, db seed/reset
│  ├─ docker/             # optional docker-compose (db, redis)
│  └─ scripts/            # seed.ts, reset-db.ts, check-env.ts
│
├─ documentation/         # QA + CI/CD + env docs (kept separate)
│
├─ .github/workflows/     # CI/CD (already covered in CI guide)
├─ package.json           # workspaces & root scripts
├─ turbo.json             # Turborepo pipeline
├─ pnpm-workspace.yaml    # (optional) explicit workspace globs
└─ .env.example           # root example (non-secret), per app also
```

---

## 🧩 Workspaces & Turborepo

**Root `package.json`** (essentials):

```json
{
  "name": "aistudio555",
  "private": true,
  "packageManager": "pnpm@9",
  "workspaces": ["apps/*", "packages/*", "qa/*", "ai"],
  "scripts": {
    "lint": "pnpm -w dlx turbo run lint",
    "build": "pnpm -w dlx turbo run build",
    "test": "pnpm -w dlx turbo run test",
    "dev": "pnpm -w dlx turbo run dev",
    "start:all": "pnpm --filter api start & pnpm --filter web start",
    "db:migrate": "pnpm --filter api prisma migrate deploy",
    "seed": "tsx infra/scripts/seed.ts",
    "qa:cypress": "cypress run",
    "qa:cypress:open": "cypress open",
    "qa:playwright": "playwright test"
  }
}
```

**`turbo.json`** (affected‑only + caching):

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["package.json", "pnpm-lock.yaml"],
  "pipeline": {
    "lint": { "outputs": [] },
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "env": ["CI"]
    },
    "dev": { "cache": false }
  }
}
```

---

## 🔐 Environment & Secrets (Local)

- **Do not** commit secrets. Use `.env.local` files ignored by git.
- Per‑app examples: `apps/web/.env.example`, `apps/api/.env.example`,
  `ai/.env.example`

**Common envs**

```
# apps/api
DATABASE_URL=postgres://...
JWT_SECRET=...

# ai
AI_PROVIDER=openai        # openai|anthropic|openrouter
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
OPENROUTER_API_KEY=...
AI_MODEL=gpt-4o-mini      # override per run if needed
AI_RATE_LIMIT_RPM=60
AI_GUARDRAILS=strict      # strict|moderate|off

# qa
BASE_URL=http://localhost:3000
```

**Secrets storage**: local `.env.local`; CI via GitHub Secrets; dedicated server
environment variables for deploy.

---

## 🧠 Local AI Subsystem

### Provider Strategy (ai/providers)

- `providerRouter.ts` selects provider by `AI_PROVIDER` env
- Each provider implements a **unified interface**:

```ts
export interface ChatRequest {
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  stream?: boolean;
}
export interface ChatResponse {
  text: string;
  usage?: { promptTokens: number; completionTokens: number; costUSD?: number };
}
export interface AIProvider {
  chat(req: ChatRequest): Promise<ChatResponse>;
}
```

- Implementations: `openai.ts`, `anthropic.ts`, `openrouter.ts`

### Guardrails & Rate Limiting (ai/middleware)

- **PII scrubber**: redact emails, phones before send
- **Policy**: block secrets leakage
- **Rate limiter**: token bucket per minute (env‑driven)

### RAG (optional) — ai/rag

- **Store options**:
  - **SQLite local** with `sqlite-vss` (simple, zero‑setup)
  - **PostgreSQL + pgvector** (aligns with app DB)

- **Embeddings**: `text-embedding-3-small` (OpenAI) or equivalent
- **Ingestion**: `ai/rag/ingest` loads markdown/docs → chunks → store
- **Search**: hybrid (BM25 + vector) where possible

### Services (ai/services)

- `chat.ts`: high‑level chat orchestration (system prompt + router)
- `search.ts`: RAG retrieval, source citations
- `tools/`: tool calling (e.g., fetch db record) — **optional**

### Local Run

```
pnpm --filter api dev   # starts API
pnpm --filter web dev   # starts Next.js
# AI is library‑style; imported by API routes (/ai/chat, /ai/search)
```

---

## 🤝 API Integration (Local)

- API exposes:
  - `POST /ai/chat` → streams assistant text
  - `POST /ai/search` → RAG results + sources

- Env‑safe: API reads `AI_*` secrets server‑side only
- Frontend uses **server actions** or API fetch with `NEXT_PUBLIC_API_URL`

---

## 🧪 QA Integration (Cypress + Playwright)

- **Cypress** validates UX flows; runs **locally (GUI)** and **CI (headless)**
- **Playwright** performs AI audits:
  - Capture `page.content()` + `screenshot(base64)`
  - Call `ai/shared/ai-validator.ts` to analyze

- Shared fixtures/utilities in `qa/shared/`

**`qa/shared/ai-validator.ts` contract**

```ts
export type AIIssue = {
  severity: 'high' | 'med' | 'low';
  message: string;
  selector?: string;
};
export async function validateLayoutWithAI(
  dom: string,
  screenshotB64: string,
  ctx: { route: string; viewport: string }
): Promise<{ issues: AIssue[] }> {
  /* ... */
}
```

---

## 🗄️ Database (Local)

- Development: **Local PostgreSQL instance** or **Dockerized Postgres** via
  `infra/docker/docker-compose.yml`
- Production: **Dedicated server PostgreSQL** with proper backup strategy

**`docker-compose.yml` (snippet)**

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: local
      POSTGRES_USER: local
      POSTGRES_DB: aistudio
    ports: ['5432:5432']
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes: { pgdata: {} }
```

Migrations: `pnpm db:migrate` (uses Prisma in `packages/db`)

---

## 🧰 Developer Workflows

### First‑time setup

```
pnpm i
pnpm db:migrate
pnpm --filter api dev & pnpm --filter web dev
```

### Daily dev

```
pnpm dev               # turbo starts dev where affected
pnpm qa:cypress:open   # interactive E2E
pnpm qa:playwright     # AI/visual audits
```

### Seed/reset

```
pnpm seed
tsx infra/scripts/reset-db.ts
```

---

## 🔎 Linting, Formatting, Commits

- ESLint + Prettier in root; share configs via `/tools/eslint-config`
- Conventional Commits enforced via PR template (optional: Husky + commitlint)

---

## ♿ Accessibility & Performance (Local)

- **axe-core** in Cypress on key pages
- Optional **Lighthouse** against `http://localhost:3000` (CLI or CI job)

---

## 🧯 Troubleshooting

- **Port collisions**: change with `PORT` env per app (`3000` web, `4000` api)
- **AI 401/429**: check `AI_*` keys; reduce `AI_RATE_LIMIT_RPM`
- **Playwright missing browsers**: `npx playwright install --with-deps`
- **Prisma**: if schema changed, run `prisma generate` and `db:migrate`
- **CORS**: allow `http://localhost:3000` in API CORS for local

---

## ✅ Definition of Ready (Infra)

- `pnpm i && pnpm dev` starts both **web** and **api** with working DB
- `pnpm qa:cypress:open` runs GUI tests; `pnpm qa:playwright` runs AI audits
- AI provider keys configured; `POST /ai/chat` returns an answer locally
- Prisma migrations deploy cleanly; seed script completes

---

## 📚 Pointers

- QA details: `/documentation/qa/qa-architecture.md`
- CI/CD details: `/documentation/ci-cd/github-workflows.md`
- Env policy: `/documentation/envs/` (create if missing)
