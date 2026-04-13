# Web App Shell Foundation Checklist

Reference docs to read before starting:

- `docs/specs/prd-overall.md`
- `docs/specs/technical-spec-overall.md`
- `docs/specs/service-web.md`
- `docs/architecture/repo-skeleton.md`
- `docs/architecture/observability-and-dashboards.md`
- `README.md`

Goal:

- build the complete frontend foundation for `portfolio-tq`
- establish the responsive portfolio shell, core routes, shared UI primitives, project display pages, observability/dashboard shells, and gated-demo route structure
- finish with a working, navigable web app in `apps/web` that is ready to host the later demo modules

Rules:

- work on `dev`
- do not overbuild final visual polish before the shell is functionally complete
- every route created in this checklist must render cleanly on desktop, tablet, and mobile
- the objective is a real usable shell, not placeholders with no structure

## Agent instructions before starting

Before making changes, read these documents in this order:

1. `docs/architecture/repo-skeleton.md`
2. `docs/specs/technical-spec-overall.md`
3. `docs/architecture/iac-and-cicd.md`
4. `docs/architecture/observability-and-dashboards.md`
5. `docs/specs/service-web.md`
6. `docs/specs/service-api.md`
7. `docs/checklists/master-checklist.md`
8. `docs/checklists/build-checklist-definition-of-done.md`
9. `README.md`
10. `docs/specs/service-web.md`

Agent operating rules:

- Do not invent alternate architecture unless a checklist item explicitly calls for a deviation note.
- Keep all environment names consistent with `dev` and `prod`.
- Prefer Terraform-managed setup over click-ops, except for unavoidable bootstrap steps.
- Never commit secrets, service account keys, `.tfvars`, or local env files.
- Never write sensitive values into docs, comments, examples, commits, or source files; this repository is public.
- If a manual cloud console step is unavoidable, document it in a short markdown note under `docs/architecture/adr-bootstrapping-notes.md`.

---

## 1. Confirm scope and route map

Reference docs:

- `docs/specs/prd-overall.md`
- `docs/specs/service-web.md`

- [x] Review the target route structure and page roles before implementation begins.
- [x] Confirm the minimum route set for this phase:
  - [x] `/`
  - [x] `/about`
  - [x] `/work`
  - [x] `/architecture`
  - [x] `/projects/payment-exception-review`
  - [x] `/projects/investing-ops-copilot`
  - [x] `/projects/legacy-ai-adapter`
  - [x] `/projects/eval-console`
  - [x] `/demo`
  - [x] `/demo/payment-exception-review`
  - [x] `/demo/investing-ops-copilot`
  - [x] `/demo/legacy-ai-adapter`
  - [x] `/demo/eval-console`
- [x] Confirm that demo routes can initially contain structured shells and placeholders, but the project display pages must already explain the problem, architecture, and intended flow credibly.
- [x] Confirm that route naming is stable before implementation.

Definition of done:

- the route map is locked for this phase
- no unnecessary extra top-level routes are introduced

### Section 1 status notes

- Required reading was completed before updating this section, including the development tracker and the web shell checklist reference docs.
- Route naming is locked for this phase with `/work` as the public project index route and `/projects/*` reserved for individual project display pages.
- The minimum route set for this phase is exactly the checked list above.
- Demo routes may start as structured shells with clear empty/loading/error-ready regions and backend-integration notes.
- Project display pages should be substantive from the start: each page must explain the problem, architecture, and intended flow credibly even before the live demo is complete.
- Existing bootstrap support routes `/observability` and `/repo-workflow` remain approved because they are already documented in `docs/specs/service-web.md` and support the public proof-of-work story.
- The older bootstrap `/projects` index route is not the long-term primary index route; when the richer shell is implemented, treat it as a temporary compatibility route or redirect target for `/work` if needed.

---

## 2. Frontend application baseline

Reference docs:

- `docs/specs/service-web.md`
- `docs/architecture/repo-skeleton.md`

- [x] Confirm the web app uses the agreed stack:
  - [x] React
  - [x] TypeScript
  - [x] Tailwind
  - [x] chosen router implementation
- [x] Confirm app entrypoints and root layout are clean and stable.
- [x] Create or finalize the top-level app structure in `apps/web`.
- [x] Ensure local development command works cleanly for the web app.
- [x] Ensure production build command works cleanly for the web app.
- [x] Ensure no broken imports remain from scaffold-stage files.

Definition of done:

- `apps/web` starts locally without errors
- `apps/web` builds successfully
- the web app has a stable app entry, router, and layout structure

### Section 2 status notes

- `apps/web` now uses a Vite React baseline with TypeScript, Tailwind via `@tailwindcss/vite`, and `react-router-dom` as the chosen router implementation.
- The stable app entrypoints are now `apps/web/index.html` and `apps/web/src/main.tsx`.
- The root layout and router live under `apps/web/src/app/`, with shared styling imported from `apps/web/src/styles/tailwind.css`.
- The shell route table now covers the locked section 1 route map and keeps `/projects` as a compatibility redirect to `/work`.
- The previous static-generator build path was removed from the active app baseline; `pnpm --filter @portfolio-tq/web build` now runs `vite build`.
- Web smoke checks were adjusted for the client-rendered SPA document so the deploy workflows can keep verifying Hosting rewrites and built assets.
- Local verification completed successfully with:
  - `pnpm --filter @portfolio-tq/web typecheck`
  - `pnpm --filter @portfolio-tq/web lint`
  - `pnpm --filter @portfolio-tq/web build`
  - a short Vite dev-server start check against `http://127.0.0.1:5173/`

---

## 3. Shared layout and navigation

Reference docs:

- `docs/specs/prd-overall.md`
- `docs/specs/service-web.md`

- [x] Build the global app shell:
  - [x] top navigation
  - [x] footer
  - [x] content container system
  - [x] page section spacing system
- [x] Implement primary navigation links for all shell routes.
- [x] Ensure navigation is usable on desktop.
- [x] Ensure navigation is usable on tablet.
- [x] Ensure navigation is usable on mobile.
- [x] Add active-route state to navigation.
- [x] Add a lightweight site identity / title treatment aligned with the README and doctrine.
- [x] Ensure navigation does not expose unfinished internal-only routes.

Definition of done:

- a user can move through the site cleanly on all form factors
- navigation is stable, intentional, and not cluttered

### Section 3 status notes

- The shared layout now lives in `apps/web/src/app/RootLayout.tsx` and provides the top navigation, footer, content container, and route-level spacing frame.
- Primary navigation now includes the public top-level shell routes: `/`, `/about`, `/work`, `/demo`, `/architecture`, `/observability`, and `/repo-workflow`.
- Individual project detail routes and individual demo routes are intentionally not exposed as primary nav links yet, so the navigation stays usable and does not advertise unfinished internal-only surfaces.
- Active-route behavior is section-aware: `/projects/*` keeps Work active, and `/demo/*` keeps Demo active.
- Mobile and tablet navigation use a horizontal scrollable pill strip with touch-sized targets; desktop wraps the same links without adding a separate hidden menu.
- The site identity now uses the README doctrine line, "Capture ambiguity. Process chaos. Produce ordered action.", and the footer reiterates the public-safe frontend boundary.
- Local verification completed successfully with:
  - `pnpm --filter @portfolio-tq/web typecheck`
  - `pnpm --filter @portfolio-tq/web lint`
  - `pnpm --filter @portfolio-tq/web build`

---

## 4. Shared UI primitives and design system baseline

Reference docs:

- `docs/specs/service-web.md`
- `README.md`

- [x] Build shared primitives or wrappers for:
  - [x] page heading
  - [x] section heading
  - [x] card
  - [x] badge / proof tag
  - [x] callout
  - [x] metrics tile
  - [x] simple empty state
  - [x] demo launcher panel
  - [x] architecture image/panel frame
- [x] Define a consistent spacing and typography baseline.
- [x] Define consistent card radius, border, and shadow usage.
- [x] Define consistent usage for status colors and feedback states.
- [x] Ensure primitives are reusable across project pages and dashboard pages.

Definition of done:

- later pages can be built quickly from shared primitives instead of ad hoc styling
- visual baseline is coherent

### Section 4 status notes

- Shared React UI primitives now live in `packages/ui/src/primitives.tsx` and are exported from `@portfolio-tq/ui`.
- The primitive set includes `PageHeading`, `SectionHeading`, `Card`, `ProofTag`, `Callout`, `MetricTile`, `EmptyState`, `DemoLauncherPanel`, and `ArchitecturePanelFrame`.
- `designTokens` centralizes the first spacing, surface, typography, and focus-ring class patterns for later pages.
- Tone maps now provide consistent neutral, accent, success, warning, and danger styling for badges, callouts, and metrics.
- `apps/web/src/app/router.tsx` now consumes the primitives on the shell routes, so the primitives are typechecked and bundled through the real web app instead of existing only as unused exports.
- `packages/ui` now supports TSX and React component exports; its lint script covers both `.ts` and `.tsx`.
- Local verification completed successfully with:
  - `pnpm --filter @portfolio-tq/ui typecheck`
  - `pnpm --filter @portfolio-tq/ui lint`
  - `pnpm --filter @portfolio-tq/web typecheck`
  - `pnpm --filter @portfolio-tq/web lint`
  - `pnpm --filter @portfolio-tq/web build`

---

## 5. Home page implementation

Reference docs:

- `README.md`
- `docs/specs/prd-overall.md`

- [x] Build the home page hero using the core project doctrine and public positioning.
- [x] Add a concise project summary section.
- [x] Add a featured work / flagship modules section.
- [x] Add a proof-of-work / public repo explanation section.
- [x] Add clear navigation paths into Work, Architecture, and About.
- [x] Ensure the home page communicates:
  - [x] this is a real portfolio product
  - [x] this repo is public proof-of-work
  - [x] the site will host AI-native workflow demos and supporting portfolio material

Definition of done:

- the home page stands on its own as a professional front door even before all demos are complete

### Section 5 status notes

- The home page now lives in `apps/web/src/features/home/HomePage.tsx` and is mounted as the router index route.
- The hero uses the core doctrine, "Capture ambiguity. Process chaos. Produce ordered action.", with public positioning for the portfolio product.
- The page now includes a concise product summary, four flagship module cards, public repo/proof-of-work framing, and clear paths into `/work`, `/architecture`, and `/about`.
- The page copy states that the portfolio is a real product, that the repo is part of the proof, and that the site is structured around AI-native workflow demos and supporting portfolio material.
- Local verification completed successfully with:
  - `pnpm --filter @portfolio-tq/web typecheck`
  - `pnpm --filter @portfolio-tq/web lint`
  - `pnpm --filter @portfolio-tq/ui typecheck`
  - `pnpm --filter @portfolio-tq/ui lint`
  - `pnpm --filter @portfolio-tq/web build`
  - `pnpm --filter @portfolio-tq/web test` (currently prints the repo's "No tests yet" placeholder)
  - local Vite dev-server start check against `http://127.0.0.1:5179/`

---

## 6. About, Work, and Architecture pages

Reference docs:

- `README.md`
- `docs/specs/prd-overall.md`
- `docs/specs/service-web.md`

### About

- [x] Build `/about`
- [x] Include concise biography / positioning
- [x] Include operating philosophy
- [x] Include key skill domains
- [x] Include linkouts/placeholders for dossiers or background material if desired

### Work

- [x] Build `/work`
- [x] Add project index grid/list
- [x] Add project summaries for the four Orion-aligned demos
- [x] Add proof tags to each project card
- [x] Add future-facing placeholder handling for later portfolio expansion

### Architecture

- [x] Build `/architecture`
- [x] Explain monorepo shape
- [x] Explain dev/prod environment split
- [x] Explain Terraform + CI/CD baseline
- [x] Explain frontend/backend/shared package split
- [x] Add room for diagrams or architecture images

Definition of done:

- these pages are real pages, not skeleton placeholders
- they can be shown publicly without apology

### Section 6 status notes

- `/about` now renders from `apps/web/src/features/about/AboutPage.tsx` with concise positioning, operating philosophy, key skill domains, working principles, and links into `/work` and `/repo-workflow`.
- `/work` now renders from `apps/web/src/features/projects/WorkPage.tsx` with a reusable project index, four Orion-aligned project summaries, proof tags, project/demo route links, and an expansion slot for later portfolio material.
- Shared project metadata now lives in `apps/web/src/features/projects/projectCatalog.ts` so later project pages can build from the same module list.
- `/architecture` now renders from `apps/web/src/features/architecture/ArchitecturePage.tsx` with the monorepo shape, dev/prod environment split, Terraform and CI/CD baseline, frontend/backend/shared package split, and a diagram-ready architecture panel.
- The shared UI primitives and current shell links were tightened to use `8px`-or-less radii and fixed font sizing while these public content pages were being integrated.
- Local verification completed successfully with:
  - `pnpm --filter @portfolio-tq/ui typecheck`
  - `pnpm --filter @portfolio-tq/ui lint`
  - `pnpm --filter @portfolio-tq/web typecheck`
  - `pnpm --filter @portfolio-tq/web lint`
  - `pnpm --filter @portfolio-tq/web build`
  - `pnpm --filter @portfolio-tq/web test` (currently prints the repo's "No tests yet" placeholder)
  - local Vite dev-server route checks returning `200` for `/about`, `/work`, and `/architecture` at `http://127.0.0.1:5180/`
- A full visual responsive browser pass was not performed here; the dedicated responsive verification pass remains tracked in section 12.

---

## 7. Project display pages

Reference docs:

- `docs/specs/service-payment-exception-review.md`
- `docs/specs/service-investing-ops-copilot.md`
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/specs/service-eval-console.md`
- `docs/specs/service-web.md`

For each of these routes:

- `/projects/payment-exception-review`
- `/projects/investing-ops-copilot`
- `/projects/legacy-ai-adapter`
- `/projects/eval-console`

Build:

- [x] project hero / title
- [x] problem statement
- [x] why it matters for Orion / fintech operations
- [x] architecture overview section
- [x] workflow summary section
- [x] demo entry section
- [x] fallback / safety / evaluation section
- [x] stack / proof tags
- [x] “what this proves” section

Definition of done:

- each project page is substantial enough that an employer can understand the intended value before the live demo is complete

### Section 7 status notes

- The four project detail routes now render through `apps/web/src/features/projects/ProjectDetailPage.tsx` instead of generic shell copy:
  - `/projects/payment-exception-review`
  - `/projects/investing-ops-copilot`
  - `/projects/legacy-ai-adapter`
  - `/projects/eval-console`
- `apps/web/src/features/projects/projectCatalog.ts` now carries the shared project-page content for the problem statement, Orion/fintech relevance, architecture overview, workflow steps, safety/evaluation framing, stack tags, and proof statements.
- Each project page now includes a hero/title, problem section, "why it matters" callout, architecture panel, workflow summary, demo-entry panel, fallback/safety/evaluation section, stack/proof tags, and "what this proves" cards.
- Demo links intentionally point to the current demo shells; full interactive demo behavior is still tracked in section 8 and backend/runtime integration checklists.
- Local verification completed successfully with:
  - `pnpm --filter @portfolio-tq/ui typecheck`
  - `pnpm --filter @portfolio-tq/ui lint`
  - `pnpm --filter @portfolio-tq/web typecheck`
  - `pnpm --filter @portfolio-tq/web lint`
  - `pnpm --filter @portfolio-tq/web build`
  - `pnpm --filter @portfolio-tq/web test` (currently prints the repo's "No tests yet" placeholder)
  - local Vite dev-server route checks returning `200` for all four `/projects/*` routes at `http://127.0.0.1:5181/`
- A full visual responsive browser pass was not performed here; the dedicated responsive verification pass remains tracked in section 12.

---

## 8. Demo route shells

Reference docs:

- `docs/specs/service-web.md`
- `docs/specs/service-api.md`
- `docs/architecture/observability-and-dashboards.md`

For each of these routes:

- `/demo`
- `/demo/payment-exception-review`
- `/demo/investing-ops-copilot`
- `/demo/legacy-ai-adapter`
- `/demo/eval-console`

Build:

- [x] top-level `/demo` index page with demo cards and access messaging
- [x] individual demo page shells with:
  - [x] input panel area
  - [x] output panel area
  - [x] trace / timeline area
  - [x] evaluation / metrics area
  - [x] empty/loading/error states
- [x] mark clearly where backend integration will land
- [x] ensure layout is strong enough that later feature work plugs in without redesign

Definition of done:

- demo routes exist and are structurally ready for backend integration
- no route is visually or structurally undefined

### Section 8 status notes

- `/demo` now renders from `apps/web/src/features/demos/DemoIndexPage.tsx` with launch cards for all four demos and clear access messaging that the current surfaces are public-safe shells.
- Individual demo routes now render from `apps/web/src/features/demos/DemoShellPage.tsx`:
  - `/demo/payment-exception-review`
  - `/demo/investing-ops-copilot`
  - `/demo/legacy-ai-adapter`
  - `/demo/eval-console`
- Demo-specific shell content now lives in `apps/web/src/features/demos/demoShellContent.ts`, including input fields, structured output fields, trace/timeline events, evaluation signals, and backend integration notes.
- Each individual demo page now reserves an input panel, output panel, trace/timeline panel, evaluation/metrics panel, and explicit empty/loading/error state language.
- Backend integration landing zones are called out per demo. These pages are still shell-only and intentionally defer live execution, API calls, streaming traces, persistence, and real evaluation hydration to later backend/runtime work.
- Local verification completed successfully with:
  - `pnpm --filter @portfolio-tq/ui typecheck`
  - `pnpm --filter @portfolio-tq/ui lint`
  - `pnpm --filter @portfolio-tq/web typecheck`
  - `pnpm --filter @portfolio-tq/web lint`
  - `pnpm --filter @portfolio-tq/web build`
  - `pnpm --filter @portfolio-tq/web test` (currently prints the repo's "No tests yet" placeholder)
  - local Vite dev-server route checks returning `200` for `/demo` and all four `/demo/*` routes at `http://127.0.0.1:5182/`
- A full visual responsive browser pass was not performed here; the dedicated responsive verification pass remains tracked in section 12.

---

## 9. Dashboard and observability page shells

Reference docs:

- `docs/architecture/observability-and-dashboards.md`
- `docs/specs/service-eval-console.md`

- [x] Add a dashboard shell pattern usable by the Evaluation Console.
- [x] Build reusable metrics row / chart panel placeholders.
- [x] Build run-list / flagged-runs / detail-panel shell components.
- [x] Add a route-level shell for the evaluation console demo page that already resembles a real monitoring console.
- [x] Ensure the visual language supports:
  - [x] latency
  - [x] cost
  - [x] schema validity
  - [x] fallback rate
  - [x] confidence flags
  - [x] prompt/version comparison later

Definition of done:

- the dashboard surfaces are already credible before the backend data wiring starts

### Section 9 status notes

- A reusable dashboard shell pattern now lives in `apps/web/src/features/dashboards/DashboardShell.tsx`.
- Dashboard configuration now lives in `apps/web/src/features/dashboards/dashboardConfigs.ts`, with separate configs for the public observability overview and the Evaluation Console demo route.
- `/observability` now renders from `apps/web/src/features/dashboards/ObservabilityPage.tsx` as a cross-project operational signal shell instead of generic route copy.
- `/demo/eval-console` now renders from `apps/web/src/features/dashboards/EvalConsoleDashboardPage.tsx` and resembles a monitoring console with metrics, chart placeholders, recent runs, flagged runs, and run detail inspection.
- The reusable dashboard pattern includes a metrics row, chart panel placeholders, run-list panel, flagged-runs panel, and detail panel.
- The visual language now explicitly reserves dashboard surfaces for latency, cost, schema validity, fallback rate, confidence flags, and prompt/version comparison.
- These dashboard routes are still shell-only and intentionally defer live API hydration to later backend/runtime work.
- Local verification completed successfully with:
  - `pnpm --filter @portfolio-tq/ui typecheck`
  - `pnpm --filter @portfolio-tq/ui lint`
  - `pnpm --filter @portfolio-tq/web typecheck`
  - `pnpm --filter @portfolio-tq/web lint`
  - `pnpm --filter @portfolio-tq/web build`
  - `pnpm --filter @portfolio-tq/web test` (currently prints the repo's "No tests yet" placeholder)
  - local Vite dev-server route checks returning `200` for `/observability` and `/demo/eval-console` at `http://127.0.0.1:5183/`
- A full visual responsive browser pass was not performed here; the dedicated responsive verification pass remains tracked in section 12.

---

## 10. Auth gate and access shell

Reference docs:

- `docs/specs/service-web.md`
- `docs/specs/technical-spec-overall.md`

- [x] Build a lightweight gated-route shell for demo access.
- [x] Decide and implement the initial access model placeholder:
  - [ ] password gate shell
  - [x] access code shell
  - [ ] signed-in gate shell
- [x] Ensure public routes remain public.
- [x] Ensure demo routes can later be protected without route redesign.
- [x] Add clear UX for access denied / locked / reviewer entry states.

Definition of done:

- the shell supports a controlled demo-access model later without architectural changes

### Section 10 status notes

- The selected initial access model placeholder is an access code shell. Password and signed-in gate shells were intentionally not selected for this phase.
- The demo access wrapper now lives in `apps/web/src/features/access/DemoAccessShell.tsx`.
- The router now wraps only `/demo` and `/demo/*` route elements with the demo access shell, leaving public portfolio routes outside the access wrapper.
- The access shell includes a disabled reviewer access-code entry area, plus explicit reviewer-entry, locked, and access-denied state examples.
- No real auth, client-side secrets, usable access codes, or backend access checks were added in this section.
- Later feature work can move validation behind the API/access-code store without changing the demo route map or demo page components.
- Local verification completed successfully with:
  - `pnpm --filter @portfolio-tq/ui typecheck`
  - `pnpm --filter @portfolio-tq/ui lint`
  - `pnpm --filter @portfolio-tq/web typecheck`
  - `pnpm --filter @portfolio-tq/web lint`
  - `pnpm --filter @portfolio-tq/web build`
  - `pnpm --filter @portfolio-tq/web test` (currently prints the repo's "No tests yet" placeholder)
  - local Vite dev-server route checks returning `200` for `/`, `/about`, `/work`, `/architecture`, `/observability`, `/demo`, and all four `/demo/*` routes at `http://127.0.0.1:5184/`
- A full visual responsive browser pass was not performed here; the dedicated responsive verification pass remains tracked in section 12.

---

## 11. Basic frontend state, error handling, and data wiring conventions

Reference docs:

- `docs/specs/service-web.md`
- `docs/specs/service-api.md`

- [ ] Establish one consistent client-side pattern for:
  - [x] loading states
  - [x] error states
  - [x] empty states
  - [x] successful response rendering
- [x] Establish one consistent location for API client utilities.
- [x] Establish one consistent route-level data pattern.
- [x] Avoid hard-coding later backend assumptions directly into UI components.

Definition of done:

- later integration work can proceed predictably without reworking page architecture

### Section 11 status notes

- Shared API client and route helpers now live under `apps/web/src/lib/api/apiClient.ts`, with `VITE_API_BASE_PATH` support and centralized request/endpoint helpers for later backend wiring.
- Data-bearing routes now use one route-level pattern: React Router loaders return a typed `RouteDataState<T>` envelope from `apps/web/src/app/routeData.ts`, and route components render it through `apps/web/src/app/RouteDataStateView.tsx`.
- The consistent state model now covers loading, error, empty, and success rendering:
  - global route transitions show a shared loading notice from `RootLayout`
  - route content now has one shared state-view wrapper for loading, empty, error, and success handling
- Work, project-detail, demo-index, demo-shell, observability, and eval-console routes now resolve their page models in loaders instead of embedding route data assumptions directly into the components.
- Backend endpoint assumptions were moved out of page components and into shared API helpers plus loader-produced view data, so the UI components stay closer to presentation-only.
- Local verification completed successfully with:
  - `pnpm --filter @portfolio-tq/web typecheck`
  - `pnpm --filter @portfolio-tq/web lint`
  - `pnpm --filter @portfolio-tq/ui typecheck`
  - `pnpm --filter @portfolio-tq/ui lint`
  - `pnpm --filter @portfolio-tq/web build`
  - `pnpm --filter @portfolio-tq/web test` (currently prints the repo's "No tests yet" placeholder)

---

## 12. Responsive verification and polish baseline

Reference docs:

- `docs/specs/service-web.md`

- [x] Verify all implemented pages on desktop width.
- [x] Verify all implemented pages on tablet width.
- [x] Verify all implemented pages on mobile width.
- [x] Fix overflow, broken grids, cramped spacing, and unusable touch targets.
- [x] Ensure typography remains readable across breakpoints.
- [x] Ensure demo shells remain usable on smaller screens.

Definition of done:

- the shell is responsive and credible on laptop, tablet, and phone

### Section 12 status notes

- Responsive verification was completed against the local Vite web app across 15 implemented routes:
  - `/`
  - `/about`
  - `/work`
  - `/architecture`
  - `/observability`
  - `/repo-workflow`
  - `/projects/payment-exception-review`
  - `/projects/investing-ops-copilot`
  - `/projects/legacy-ai-adapter`
  - `/projects/eval-console`
  - `/demo`
  - `/demo/payment-exception-review`
  - `/demo/investing-ops-copilot`
  - `/demo/legacy-ai-adapter`
  - `/demo/eval-console`
- The responsive pass covered three viewport classes:
  - desktop `1440x1200`
  - tablet `834x1112`
  - mobile `390x844`
- Verification used local Playwright-driven screenshots plus DOM layout checks for horizontal overflow, clipped content, and undersized header/footer touch targets.
- One responsive issue was found and fixed during the pass: footer navigation links were updated to use touch-sized interactive targets instead of text-only inline links.
- The final responsive rerun completed with:
  - `45` route/viewport checks total
  - `0` horizontal overflow failures
  - `0` clipped-content failures
  - `0` undersized header/footer target failures
- Supporting code verification also completed successfully with:
  - `pnpm --filter @portfolio-tq/web typecheck`
  - `pnpm --filter @portfolio-tq/web lint`
  - `pnpm --filter @portfolio-tq/ui typecheck`
  - `pnpm --filter @portfolio-tq/ui lint`
  - `pnpm --filter @portfolio-tq/web build`
  - `pnpm --filter @portfolio-tq/web test` (currently prints the repo's "No tests yet" placeholder)

---

## 13. Build verification, commit, and handoff readiness

Reference docs:

- `docs/checklists/build-checklist-definition-of-done.md`

- [x] Run `pnpm lint`
- [x] Run `pnpm typecheck`
- [x] Run `pnpm test`
- [x] Run `pnpm build`
- [x] Confirm the app still deploys cleanly to the dev environment
- [x] Confirm all new routes render in the deployed dev site
- [x] Confirm CI passes on pushed branch
- [x] Write a clean milestone commit message
- [x] Update any relevant docs if the actual route/component structure changed materially

Definition of done:

- the web app shell is complete, deployed in dev, and ready for the next checklist

---

## Final definition of done

This checklist is complete when:

- the portfolio shell is fully navigable
- the route structure is implemented
- project display pages exist and are substantive
- demo route shells exist and are structurally ready
- dashboard/observability shells exist
- auth/access shell exists
- responsive behavior is verified
- the web app passes local checks and CI
- the dev deployment is reviewable and ready for backend/runtime integration
