# Development Tracker Checklist

Purpose:
- define the build order for completing the full `portfolio-tq` spec pack
- provide a single execution spine for the project after infrastructure and CI/CD initialization
- reference the more detailed implementation checklists in the order they should be completed

Rules:
- do not skip ahead unless an earlier checklist is complete or explicitly blocked for a valid reason
- each referenced checklist should be completed on `dev`, merged to `main` only at milestone boundaries
- every major item below should end with a working, reviewable increment in the dev environment

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

## 0. Foundations

Reference docs:
- `README.md`
- `docs/architecture/iac-and-cicd.md`
- `docs/checklists/iac-cicd-initialization-checklist.md`

- [x] Complete `docs/checklists/iac-cicd-initialization-checklist.md`
- [x] Commit and tag the post-initialization milestone in a clear way
- [x] Confirm `dev` is the active working branch and `main` remains milestone-only
- [x] Confirm Firebase, Firestore, Terraform backends, and GitHub Actions are all operational in `dev`

Definition of done:
- IaC/CI/CD initialization is complete and verified
- repo protections and required checks are active
- the repo is ready for real feature development

---

## 1. Core app shell and shared frontend foundation

Reference docs:
- `docs/specs/prd-overall.md`
- `docs/specs/technical-spec-overall.md`
- `docs/specs/service-web.md`
- `docs/architecture/repo-skeleton.md`
- `docs/architecture/observability-and-dashboards.md`

Detailed implementation checklist:
- `docs/checklists/web-app-shell-foundation-checklist.md`

- [x] Complete `docs/checklists/web-app-shell-foundation-checklist.md`

Expected outcome:
- responsive portfolio shell exists in `apps/web`
- core routing, layout, navigation, project index, project detail page scaffolds, dashboard shell, auth gate shell, and shared UI baseline all work in `dev`

---

## 2. Shared backend platform and demo runtime foundation

Reference docs:
- `docs/specs/technical-spec-overall.md`
- `docs/specs/service-api.md`
- `docs/architecture/observability-and-dashboards.md`

Detailed implementation checklist:
- `docs/checklists/shared-api-runtime-foundation-checklist.md`

- [x] Create `docs/checklists/shared-api-runtime-foundation-checklist.md`
- [x] Complete `docs/checklists/shared-api-runtime-foundation-checklist.md`

Expected outcome:
- `apps/api` exposes working endpoints for health, run logging, trace retrieval, evaluation logging, and seeded data/tool access
- shared packages are wired cleanly into the API layer
- backend foundation supports all later demo modules without duplication

---

## 3. Shared schemas, tools, config, and evaluation backbone

Reference docs:
- `docs/specs/technical-spec-overall.md`
- `docs/specs/service-api.md`
- `docs/specs/service-eval-console.md`
- `docs/architecture/observability-and-dashboards.md`

Detailed implementation checklist:
- `docs/checklists/shared-schemas-tools-evals-checklist.md`

- [x] Create `docs/checklists/shared-schemas-tools-evals-checklist.md`
- [ ] Complete `docs/checklists/shared-schemas-tools-evals-checklist.md`

Expected outcome:
- shared typed contracts exist in `packages/schemas` and `packages/types`
- reusable tool adapters exist in `packages/tools`
- prompt/config/version support exists in `packages/config`
- evaluation helpers and result models exist in `packages/evals`

---

## 4. Legacy Workflow → AI-Native Service Adapter

Reference docs:
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/specs/service-web.md`
- `docs/specs/service-api.md`
- `docs/architecture/observability-and-dashboards.md`

Detailed implementation checklist:
- `docs/checklists/legacy-ai-adapter-checklist.md`

- [ ] Create `docs/checklists/legacy-ai-adapter-checklist.md`
- [ ] Complete `docs/checklists/legacy-ai-adapter-checklist.md`

Expected outcome:
- first complete live demo is working end-to-end
- messy input → structured extraction → deterministic validation → legacy payload transform → final typed output is visible in the UI
- trace and evaluation data are captured

---

## 5. Payment Exception Review Agent

Reference docs:
- `docs/specs/service-payment-exception-review.md`
- `docs/specs/service-web.md`
- `docs/specs/service-api.md`
- `docs/architecture/observability-and-dashboards.md`

Detailed implementation checklist:
- `docs/checklists/payment-exception-review-checklist.md`

- [ ] Create `docs/checklists/payment-exception-review-checklist.md`
- [ ] Complete `docs/checklists/payment-exception-review-checklist.md`

Expected outcome:
- flagship regulated-ops-style demo is fully working
- mixed structured/unstructured intake, tool calls, typed output, confidence handling, and escalation logic are all visible

---

## 6. Intelligent Investing Operations Copilot

Reference docs:
- `docs/specs/service-investing-ops-copilot.md`
- `docs/specs/service-web.md`
- `docs/specs/service-api.md`
- `docs/architecture/observability-and-dashboards.md`

Detailed implementation checklist:
- `docs/checklists/investing-ops-copilot-checklist.md`

- [ ] Create `docs/checklists/investing-ops-copilot-checklist.md`
- [ ] Complete `docs/checklists/investing-ops-copilot-checklist.md`

Expected outcome:
- wealth-operations-aligned copilot is working
- RAG, internal-tool retrieval, source-cited structured outputs, and human-escalation boundaries are visible

---

## 7. Evaluation and Reliability Console

Reference docs:
- `docs/specs/service-eval-console.md`
- `docs/specs/service-web.md`
- `docs/specs/service-api.md`
- `docs/architecture/observability-and-dashboards.md`

Detailed implementation checklist:
- `docs/checklists/eval-console-checklist.md`

- [ ] Create `docs/checklists/eval-console-checklist.md`
- [ ] Complete `docs/checklists/eval-console-checklist.md`

Expected outcome:
- run history, schema validity, latency, cost, fallback rate, flagged runs, and prompt/version comparison are visible and powered by real run data from the other demos

---

## 8. Portfolio content, narrative, and proof pages

Reference docs:
- `README.md`
- `docs/specs/prd-overall.md`
- `docs/specs/service-web.md`

Detailed implementation checklist:
- `docs/checklists/portfolio-content-proof-pages-checklist.md`

- [ ] Create `docs/checklists/portfolio-content-proof-pages-checklist.md`
- [ ] Complete `docs/checklists/portfolio-content-proof-pages-checklist.md`

Expected outcome:
- About, doctrine, work index, architecture, proof-of-work narrative, and selected background/capability content are integrated into the site
- the portfolio reads as a coherent product rather than a collection of demos

---

## 9. Auth gate, access control, and recruiter-safe demo access

Reference docs:
- `docs/specs/service-web.md`
- `docs/specs/service-api.md`
- `docs/specs/technical-spec-overall.md`

Detailed implementation checklist:
- `docs/checklists/demo-access-control-checklist.md`

- [ ] Create `docs/checklists/demo-access-control-checklist.md`
- [ ] Complete `docs/checklists/demo-access-control-checklist.md`

Expected outcome:
- public portfolio remains browseable
- gated/demo-only routes are protected appropriately
- access path for recruiters or reviewers is clear and controlled

---

## 10. Observability polish, dashboards, seed data quality, and hardening

Reference docs:
- `docs/architecture/observability-and-dashboards.md`
- `docs/specs/service-api.md`
- `docs/specs/service-eval-console.md`

Detailed implementation checklist:
- `docs/checklists/observability-hardening-checklist.md`

- [ ] Create `docs/checklists/observability-hardening-checklist.md`
- [ ] Complete `docs/checklists/observability-hardening-checklist.md`

Expected outcome:
- telemetry, seeded scenarios, error states, fallback states, and dashboard views are clean, credible, and demonstrably useful

---

## 11. Production readiness for first public milestone

Reference docs:
- `docs/checklists/build-checklist-definition-of-done.md`
- `docs/architecture/iac-and-cicd.md`
- `docs/specs/technical-spec-overall.md`

Detailed implementation checklist:
- `docs/checklists/public-milestone-release-checklist.md`

- [ ] Create `docs/checklists/public-milestone-release-checklist.md`
- [ ] Complete `docs/checklists/public-milestone-release-checklist.md`

Expected outcome:
- first milestone release is deployed to `prod`
- repo, app, docs, CI, and core demos are all review-ready
- public-facing result is credible to employers and technical reviewers

---

## Final definition of done

The development tracker is complete when:
- all major referenced implementation checklists have been completed
- the web portfolio is fully functional in `prod`
- the repo itself is reviewable as public proof-of-work
- the portfolio demonstrates architecture, systems thinking, AI workflow design, operational discipline, and real execution quality
