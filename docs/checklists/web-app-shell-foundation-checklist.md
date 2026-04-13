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

- [ ] Build `/about`
- [ ] Include concise biography / positioning
- [ ] Include operating philosophy
- [ ] Include key skill domains
- [ ] Include linkouts/placeholders for dossiers or background material if desired

### Work

- [ ] Build `/work`
- [ ] Add project index grid/list
- [ ] Add project summaries for the four Orion-aligned demos
- [ ] Add proof tags to each project card
- [ ] Add future-facing placeholder handling for later portfolio expansion

### Architecture

- [ ] Build `/architecture`
- [ ] Explain monorepo shape
- [ ] Explain dev/prod environment split
- [ ] Explain Terraform + CI/CD baseline
- [ ] Explain frontend/backend/shared package split
- [ ] Add room for diagrams or architecture images

Definition of done:

- these pages are real pages, not skeleton placeholders
- they can be shown publicly without apology

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

- [ ] project hero / title
- [ ] problem statement
- [ ] why it matters for Orion / fintech operations
- [ ] architecture overview section
- [ ] workflow summary section
- [ ] demo entry section
- [ ] fallback / safety / evaluation section
- [ ] stack / proof tags
- [ ] “what this proves” section

Definition of done:

- each project page is substantial enough that an employer can understand the intended value before the live demo is complete

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

- [ ] top-level `/demo` index page with demo cards and access messaging
- [ ] individual demo page shells with:
  - [ ] input panel area
  - [ ] output panel area
  - [ ] trace / timeline area
  - [ ] evaluation / metrics area
  - [ ] empty/loading/error states
- [ ] mark clearly where backend integration will land
- [ ] ensure layout is strong enough that later feature work plugs in without redesign

Definition of done:

- demo routes exist and are structurally ready for backend integration
- no route is visually or structurally undefined

---

## 9. Dashboard and observability page shells

Reference docs:

- `docs/architecture/observability-and-dashboards.md`
- `docs/specs/service-eval-console.md`

- [ ] Add a dashboard shell pattern usable by the Evaluation Console.
- [ ] Build reusable metrics row / chart panel placeholders.
- [ ] Build run-list / flagged-runs / detail-panel shell components.
- [ ] Add a route-level shell for the evaluation console demo page that already resembles a real monitoring console.
- [ ] Ensure the visual language supports:
  - [ ] latency
  - [ ] cost
  - [ ] schema validity
  - [ ] fallback rate
  - [ ] confidence flags
  - [ ] prompt/version comparison later

Definition of done:

- the dashboard surfaces are already credible before the backend data wiring starts

---

## 10. Auth gate and access shell

Reference docs:

- `docs/specs/service-web.md`
- `docs/specs/technical-spec-overall.md`

- [ ] Build a lightweight gated-route shell for demo access.
- [ ] Decide and implement the initial access model placeholder:
  - [ ] password gate shell
  - [ ] access code shell
  - [ ] signed-in gate shell
- [ ] Ensure public routes remain public.
- [ ] Ensure demo routes can later be protected without route redesign.
- [ ] Add clear UX for access denied / locked / reviewer entry states.

Definition of done:

- the shell supports a controlled demo-access model later without architectural changes

---

## 11. Basic frontend state, error handling, and data wiring conventions

Reference docs:

- `docs/specs/service-web.md`
- `docs/specs/service-api.md`

- [ ] Establish one consistent client-side pattern for:
  - [ ] loading states
  - [ ] error states
  - [ ] empty states
  - [ ] successful response rendering
- [ ] Establish one consistent location for API client utilities.
- [ ] Establish one consistent route-level data pattern.
- [ ] Avoid hard-coding later backend assumptions directly into UI components.

Definition of done:

- later integration work can proceed predictably without reworking page architecture

---

## 12. Responsive verification and polish baseline

Reference docs:

- `docs/specs/service-web.md`

- [ ] Verify all implemented pages on desktop width.
- [ ] Verify all implemented pages on tablet width.
- [ ] Verify all implemented pages on mobile width.
- [ ] Fix overflow, broken grids, cramped spacing, and unusable touch targets.
- [ ] Ensure typography remains readable across breakpoints.
- [ ] Ensure demo shells remain usable on smaller screens.

Definition of done:

- the shell is responsive and credible on laptop, tablet, and phone

---

## 13. Build verification, commit, and handoff readiness

Reference docs:

- `docs/checklists/build-checklist-definition-of-done.md`

- [ ] Run `pnpm lint`
- [ ] Run `pnpm typecheck`
- [ ] Run `pnpm test`
- [ ] Run `pnpm build`
- [ ] Confirm the app still deploys cleanly to the dev environment
- [ ] Confirm all new routes render in the deployed dev site
- [ ] Confirm CI passes on pushed branch
- [ ] Write a clean milestone commit message
- [ ] Update any relevant docs if the actual route/component structure changed materially

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
