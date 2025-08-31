# AiStudio555 — CI/CD Bulletproof Guide (GitHub Actions + Monorepo)

This document is the **single source of truth** for Continuous Integration and
Continuous Deployment of AiStudio555. It covers branch strategy, environments,
secrets, workflows, deployments to **Vercel (web)** and **Railway (API +
PostgreSQL)**, database migrations, rollbacks, caching, and reliability
controls.

---

## 🎯 Objectives

- Deterministic, fast CI using **pnpm + Turborepo** (affected‑only tasks +
  caching)
- Reliable E2E gates (Cypress headless on CI; optional Playwright AI pass)
- Safe, repeatable deploys: **Dev on main**, **Staging/Prod via tags** with
  approvals
- Clear rollback + disaster recovery

---

## 🔁 Branch & Release Model

- **Trunk‑based development**
- Branch naming: `feat/*`, `fix/*`, `chore/*`, `docs/*`
- **Protected**: `main` (no direct pushes; PR only)
- Releases by tags:
  - **Staging (RC)**: `vX.Y.Z-rc.N`
  - **Production**: `vX.Y.Z`

### Environments

- **dev** → auto deploy on merge to `main`
- **staging** → deploy on tag `v*.*.*-rc*` (manual approval via Environment
  protection)
- **prod** → deploy on tag `v*.*.*` (manual approval via Environment protection)

---

## 🔐 Required Protections (GitHub Settings)

- Branch protection on `main`:
  - Require PR reviews (min 1–2)
  - Require status checks to pass: `lint`, `build`, `unit`, `cypress` (and
    `playwright-ai` if enabled)
  - Require PR to be up‑to‑date with `main`
  - Disallow force‑pushes & deletion

- Environments `staging`, `prod`: **Required reviewers** before deployment

---

## 🧰 Monorepo Assumptions

- Package manager: **pnpm** workspaces
- Build orchestrator: **Turborepo**
- Folder layout (abridged):

```
/apps
  /web   # Next.js (Vercel)
  /api   # Node/Express (Railway)
/qa      # Cypress + Playwright suites
```

Root scripts (example):

```json
{
  "scripts": {
    "lint": "pnpm -w dlx turbo run lint",
    "build": "pnpm -w dlx turbo run build",
    "test": "pnpm -w dlx turbo run test",
    "e2e:cypress": "cypress run",
    "e2e:playwright": "playwright test",
    "db:migrate": "pnpm --filter api prisma migrate deploy"
  }
}
```

> Adjust per your apps' start/build commands.

---

## 🔑 Secrets & Variables (GitHub → Settings → Secrets and variables → Actions)

- **Turborepo Remote Cache (optional)**: `TURBO_TOKEN`, `TURBO_TEAM`,
  `TURBO_PROJECT`
- **Vercel (web)**: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- **Railway (api/db)**: `RAILWAY_TOKEN`, optional `RAILWAY_ENV_ID`,
  `RAILWAY_SERVICE_API`
- **Database**: `DATABASE_URL` (used for Prisma migrate deploy)
- **QA / AI** (optional): `OPENAI_API_KEY`
- **Sentry** (optional): `SENTRY_DSN`

**Rules**

- Never commit secrets; keep `.env.example` per app in repo; real values in
  provider envs and GitHub secrets.

---

## 🧪 PR CI — `.github/workflows/ci.yml`

Runs on every PR to `main`: **lint → build → unit → start services → Cypress
smoke** (+ optional Playwright AI). Uses Turborepo cache and only‑affected
logic.

```yaml
name: CI
on:
  pull_request:
    branches: [main]
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
jobs:
  pr:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }

      - uses: pnpm/action-setup@v4
        with: { version: 9 }

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install deps
        run: pnpm install --frozen-lockfile

      - name: Turbo remote cache (optional)
        if: ${{ secrets.TURBO_TOKEN != '' }}
        run: |
          pnpm dlx turbo login --token ${{ secrets.TURBO_TOKEN }}
          pnpm dlx turbo link --team ${{ secrets.TURBO_TEAM }} --project ${{ secrets.TURBO_PROJECT }}

      - name: Lint (affected)
        run: pnpm -w dlx turbo run lint --cache-dir=.turbo

      - name: Build (affected)
        run: pnpm -w dlx turbo run build --cache-dir=.turbo

      - name: Unit tests (affected)
        run: pnpm -w dlx turbo run test --cache-dir=.turbo

      - name: Start web & api for E2E
        run: |
          pnpm --filter api start &
          pnpm --filter web start &
          npx wait-on http://localhost:4000 http://localhost:3000

      - name: Cypress (smoke + responsive samples)
        uses: cypress-io/github-action@v6
        with:
          command: pnpm e2e:cypress
          browser: chrome
        env:
          CYPRESS_baseUrl: http://localhost:3000

      - name: Install Playwright browsers (optional)
        if: ${{ secrets.OPENAI_API_KEY != '' }}
        run: npx playwright install --with-deps

      - name: Playwright AI checks (optional)
        if: ${{ secrets.OPENAI_API_KEY != '' }}
        run: pnpm e2e:playwright
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

**Reliability controls**

- `concurrency` prevents duplicate PR jobs
- `wait-on` ensures servers are ready before E2E
- Cache dir `.turbo` speeds up repeated runs

---

## ⏰ Nightly Full QA — `.github/workflows/nightly.yml`

Runs broader responsiveness + AI checks on a schedule.

```yaml
name: Nightly QA
on:
  schedule:
    - cron: '0 23 * * *'  # 23:00 UTC (~02:00 Asia/Jerusalem)
  workflow_dispatch: {}
concurrency:
  group: nightly
  cancel-in-progress: true
jobs:
  full:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm -w dlx turbo run build --cache-dir=.turbo
      - run: pnpm --filter api start & pnpm --filter web start & npx wait-on http://localhost:4000 http://localhost:3000
      - name: Cypress (full responsiveness)
        uses: cypress-io/github-action@v6
        with:
          command: pnpm e2e:cypress
          browser: chrome
        env:
          CYPRESS_RUN_MODE: nightly
      - name: Playwright (AI deep)
        if: ${{ secrets.OPENAI_API_KEY != '' }}
        run: pnpm e2e:playwright
        env: { OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }} }
```

---

## 🚀 Deployments — `.github/workflows/deploy.yml`

- **Dev** → on push to `main`
- **Staging** → on tag `v*.*.*-rc*` (approval)
- **Prod** → on tag `v*.*.*` (approval)

```yaml
name: Deploy
on:
  push:
    branches: [ main ]
  push:
    tags:
      - 'v*.*.*'
      - 'v*.*.*-rc*'

jobs:
  dev:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: dev
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile

      - name: Prisma migrate (Dev)
        run: pnpm db:migrate
        env: { DATABASE_URL: ${{ secrets.DATABASE_URL }} }

      - name: Deploy API to Railway
        run: |
          npm i -g @railway/cli
          railway login --token ${{ secrets.RAILWAY_TOKEN }}
          railway up --service ${{ secrets.RAILWAY_SERVICE_API }} --detach

      - name: Deploy Web to Vercel (if not auto)
        run: |
          npm i -g vercel
          vercel pull --yes --environment=preview --token ${{ secrets.VERCEL_TOKEN }}
          vercel deploy --prebuilt --token ${{ secrets.VERCEL_TOKEN }}

  staging:
    if: startsWith(github.ref, 'refs/tags/v') && contains(github.ref, '-rc')
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - name: Prisma migrate (Staging)
        run: pnpm db:migrate
        env: { DATABASE_URL: ${{ secrets.DATABASE_URL }} }
      - name: Railway deploy (API)
        run: |
          npm i -g @railway/cli
          railway login --token ${{ secrets.RAILWAY_TOKEN }}
          railway up --service ${{ secrets.RAILWAY_SERVICE_API }} --detach
      - name: Vercel deploy (Web, staging)
        run: |
          npm i -g vercel
          vercel pull --yes --environment=preview --token ${{ secrets.VERCEL_TOKEN }}
          vercel deploy --prebuilt --token ${{ secrets.VERCEL_TOKEN }}

  prod:
    if: startsWith(github.ref, 'refs/tags/v') && !contains(github.ref, '-rc')
    runs-on: ubuntu-latest
    environment: prod
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - name: Prisma migrate (Prod)
        run: pnpm db:migrate
        env: { DATABASE_URL: ${{ secrets.DATABASE_URL }} }
      - name: Railway deploy (API)
        run: |
          npm i -g @railway/cli
          railway login --token ${{ secrets.RAILWAY_TOKEN }}
          railway up --service ${{ secrets.RAILWAY_SERVICE_API }} --detach
      - name: Vercel deploy (Web, prod)
        run: |
          npm i -g vercel
          vercel pull --yes --environment=production --token ${{ secrets.VERCEL_TOKEN }}
          vercel deploy --prebuilt --prod --token ${{ secrets.VERCEL_TOKEN }}
```

**Notes**

- Prefer Vercel Git Integration for automatic web deploys; use CLI when you need
  explicit control in workflow.
- Ensure Railway service names/IDs match secrets.

---

## 🧯 Rollbacks & DR

- **Web (Vercel)**: rollback via UI or `vercel rollback <deployment>`
- **API (Railway)**: redeploy previous build from Railway UI or pin prior image
- **DB**: enable automated snapshots in Railway; test restore periodically

**Blue/Green (optional)**

- Use separate Railway environments for `staging` vs `prod`.

---

## 📈 Observability Hooks

- **Sentry** init in web/api; DSNs via secrets
- **UptimeRobot** monitors `/health`
- **Provider logs**: Vercel & Railway dashboards for build/runtime logs

---

## 🧪 Test Policy in CI

- PR: Cypress **smoke** + responsive samples; optional Playwright AI gate
- Nightly: full viewport matrix; AI deep checks
- Artifacts: screenshots/videos on failure; JUnit/XML test reports

---

## ⚠️ Gotchas & Best Practices (Honest)

- Do **not** run `prisma migrate dev` in CI; only `migrate deploy`
- Keep E2E **deterministic** (mock flaky externals with MSW)
- Don’t over‑parallelize servers; start once per job
- Use **`concurrency`** to cancel stale runs on PR updates
- Keep `DATABASE_URL` per environment; never point CI at prod
- Track free‑tier limits on Railway; set alerts for CPU/disk

---

## 📚 Index

- QA strategy: `/documentation/qa/qa-architecture.md`
- This guide: `/documentation/ci-cd/github-workflows.md`
