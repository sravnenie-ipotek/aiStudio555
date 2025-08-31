# AiStudio555 — QA System (Bulletproof Guide)

This document is the **single source of truth** for quality assurance in
AiStudio555. It defines architecture, tools, responsibilities, folder layout,
execution modes (local vs CI), flakiness controls, data/mocks, responsiveness
policy, AI‑assisted validation, and reporting.

---

## 🎯 Goals

- Deterministic, reliable E2E across **Cypress** and **Playwright**
- Clear separation of concerns with a shared utility layer
- Full responsiveness coverage across defined breakpoints
- Fast local authoring (interactive) + robust CI (headless)
- AI‑assisted layout/UX checks without brittle assertions

---

## 🧱 QA Architecture Overview

```
/qa                      ← Root QA folder (isolated from app code)
├─ /cypress              ← Cypress E2E suite (user journeys, responsiveness)
│  ├─ /e2e               ← High‑level specs (flows, auth, forms, tables)
│  ├─ /support           ← Commands, global hooks (before/after), selectors
│  ├─ /fixtures          ← Test data (JSON/YAML)
│  └─ /screenshots       ← Artifacts on failure (CI auto‑upload)
│
├─ /playwright           ← Playwright suite (AI/DOM/visual, multi‑tab/iframe)
│  ├─ /ai                ← AI‑assisted specs (DOM + screenshot → LLM)
│  ├─ /utils             ← Screenshot/DOM capture, AI client, matchers
│  └─ playwright.config.ts
│
├─ /shared               ← Shared layer used by both engines
│  ├─ /fixtures          ← Common factories/seed data
│  ├─ /utils             ← HTTP helpers, date, ids, feature flags
│  ├─ ai-validator.ts    ← **Core AI bridge** (DOM/screenshot → LLM → findings)
│  └─ types.ts           ← DTOs for reports, test config, viewport map
└─ README.md             ← How to run, debug, add tests, coding standards
```

**Separation of responsibilities**

- **Cypress**: canonical E2E for UX flows, routing, auth, forms, tables, basic
  a11y, responsiveness. Runs on PR/CI.
- **Playwright**: supplemental AI/visual/DOM audits, multi‑tab/iframe, advanced
  downloads/uploads. Optional gate on CI; primary for local AI testing.
- **/shared**: zero business logic; only test helpers/types/fixtures.

---

## 🧪 Test Types & Scope

### Cypress (primary E2E)

- **Smoke**: app loads, key nav, health endpoint
- **Auth**: register/login/logout, token refresh, blocked private routes
- **Forms**: Zod validation messages, success path, edge cases
- **RBAC**: role‑specific UI visibility/actions (when enabled)
- **Data views**: tables/lists, filters, sort, pagination
- **Errors**: API 4xx/5xx handling, toasts, retry button
- **A11y**: axe‑core basic checks on key pages
- **Responsiveness**: full viewport matrix (see below)

### Playwright (supplemental)

- **AI layout checks**: DOM + screenshot → `ai-validator.ts` → issues list
- **Visual issues**: overlapping elements, offscreen buttons, contrast hints
- **Complex browser features**: multi‑tab, iframe, file download/upload
- **Tracing**: collect traces/screenshots for difficult repros

---

## 📱 Responsiveness Policy (must pass)

**Viewport matrix**

- `320×640` (small mobile)
- `375×812` (iPhone baseline)
- `768×1024` (tablet portrait)
- `1024×768` (tablet landscape / small laptop)
- `1280×800` (desktop)
- `1536×960` (large desktop)

**What we assert**

- No horizontal scroll on primary pages
- Header/nav visible and usable
- Primary CTA visible above fold where designed
- Key forms usable (labels visible, inputs not clipped)
- Tables/lists adapt (wrap/stack) without content loss

Cypress runs **representative** breakpoints on PR; **full matrix** nightly.

---

## 🧬 Selectors & Testability

- Prefer **data‑testids**: `data-cy="login-submit"`
- Avoid brittle CSS/XPath selectors tied to visuals
- Add lightweight **screen model** helpers per page:
  - `getByCy('login-email')`, `screen.login.submit()`

- Keep assertions business‑oriented (e.g., "order created" toast appears) rather
  than pixel‑perfect

---

## 🧪 Data, Fixtures, and Seeding

- **Fixtures** in `/qa/shared/fixtures` (JSON/YAML)
- **Factories** for dynamic data (timestamps, uuids)
- **Seeding**: dedicated script in `/infra/scripts` for dev/staging
- **Determinism**: avoid system clock coupling; inject dates where possible

---

## 🌐 Network & Mocks

- **Local/PR CI**: prefer **MSW** or Cypress intercepts for unstable externals
- **Staging/Nightly**: hit real services where safe; otherwise keep mocks
- **Timeouts**: consistent global timeouts; explicit retries for flaky endpoints

---

## 🧯 Flakiness Controls

- **Auto‑wait**: rely on Cypress implicit waits; add `should()` with reasonable
  timeouts
- **Retries**: enable test retries (Cypress + Playwright) on CI only
- **Isolation**: clear state between tests; no hidden coupling
- **Artifacts**: always save screenshots + videos on failure

---

## 🤖 AI Validator (Playwright)

**Purpose**: offload broad layout/UX sanity checks to an LLM without hundreds of
brittle assertions.

**Contract** (`ai-validator.ts`)

- Input: `dom: string`, `screenshotBase64: string`,
  `context: { route, viewport, flags }`
- Output:
  `{ issues: Array<{severity: 'high'|'med'|'low', message: string, selector?: string}> }`
- Policy: fail spec if any **high** issues; warn/log for med/low

**Spec pattern**

```ts
import { test, expect } from '@playwright/test';
import { validateLayoutWithAI } from '../shared/ai-validator';

test('landing layout (AI)', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(process.env.BASE_URL!);
  const dom = await page.content();
  const screenshot = await page.screenshot({
    encoding: 'base64',
    fullPage: true,
  });
  const report = await validateLayoutWithAI(dom, screenshot, {
    route: '/',
    viewport: '375x812',
  });
  expect(report.issues.filter(i => i.severity === 'high')).toHaveLength(0);
});
```

---

## 🏃 Execution Modes

### Local (developer)

- **Cypress (interactive)**: `pnpm e2e:cypress:open`
- **Cypress (headless)**: `pnpm e2e:cypress`
- **Playwright (AI/visual)**: `pnpm e2e:playwright`

### CI (GitHub Actions)

- PR: lint → build → unit → start services → **Cypress smoke (headless)** →
  Playwright AI (optional)
- Nightly: start services → **Cypress full matrix** → Playwright deep AI

Artifacts from CI: screenshots, videos, JUnit/XML test reports.

---

## 🧩 Coding Standards

- Keep specs **short & single‑responsibility**
- Extract **page models** for reusable flows (login, create entity)
- Prefer **custom commands** (`Cypress.Commands.add`) for repetitive UI steps
- Add **data‑testids** for dynamic elements
- Avoid **test order dependencies**

---

## 🔐 Test Environments & Config

- **BASE_URL** per environment (local/dev/staging)
- Secrets in provider envs + GitHub Secrets (never in repo)
- Feature flags exposed via env (e.g., `CYPRESS_FEATURE_X=true`)

---

## ♿ Accessibility Baseline

- Run **axe-core** on key routes (Cypress plugin)
- Check color contrast via AI hints (Playwright) and/or manual audits

---

## ⚡ Performance & Lighthouse (optional phase)

- Add **Lighthouse CI** against staging on merge to `main`
- Track TTI/LCP budget regressions in PR comments

---

## 🧭 Reporting & Governance

- PR must pass: `lint`, `build`, `unit`, `cypress` (and `playwright-ai` if
  enabled)
- Nightly report posted to Slack/Email: failures summary, flake rate, top issues
- **Ownership**: CODEOWNERS for `/qa/cypress` and `/qa/playwright`

---

## 🧰 Troubleshooting (common pitfalls)

- Flaky due to animations → disable CSS animations under `CYPRESS_RUN_MODE=ci`
- Race conditions → prefer `findByRole`/`data-cy`, add explicit
  `should('be.visible')`
- Network stalls → use MSW/mocks locally; verify real endpoints on staging
- 3rd‑party widgets in iframes → test with Playwright suite instead of Cypress

---

## ✅ Definition of Done (for tests)

- New user‑facing feature includes: E2E spec (Cypress), responsiveness check for
  at least 2 viewports, and (where relevant) one Playwright AI audit
- No skipped tests on `main`
- All specs deterministic locally and on CI
