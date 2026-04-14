# Master Checklist

## 0. Foundation
- [x] Create public GitHub repo `portfolio_tq`
- [x] Add license, README, `.gitignore`, editorconfig
- [x] Review `.gitignore`, `.dockerignore`, and `.gcloudignore` before commits whenever new tooling or deployment flows are introduced
- [x] Initialize monorepo tooling
- [x] Create repo skeleton folders
- [x] Add docs skeleton
- [x] Add issue labels/milestones
- [x] Decide branch strategy and contribution rules

## 1. Tooling and quality
- [x] Set up package manager/workspace config
- [x] Set up TypeScript base config
- [x] Set up linting
- [x] Set up formatting
- [x] Set up test runner(s)
- [ ] Set up pre-commit hooks if desired
- [x] Set up shared env loading strategy

## 2. Frontend shell
- [x] Create `apps/web`
- [x] Add routing
- [x] Add global layout/nav/footer
- [x] Add theme/tokens
- [x] Build Home page
- [x] Build About page
- [x] Build Projects index page
- [x] Build Architecture page
- [x] Build Observability page
- [x] Build Repo Workflow page
- [x] Make site responsive

## 3. Shared packages
- [x] `packages/types`
- [x] `packages/schemas`
- [x] `packages/config`
- [x] `packages/ui`
- [x] `packages/agents`
- [x] `packages/tools`
- [x] `packages/evals`

## 4. API service
- [x] Create `apps/api`
- [x] Add health route
- [x] Add shared request/response helpers
- [ ] Add Vertex AI wrapper
- [x] Add logging wrapper
- [x] Add Firestore persistence
- [x] Add evaluation writer
- [x] Add observability endpoints

## 5. Demo project: Payment Exception Review Agent
- [ ] Seed synthetic cases
- [ ] Define schemas
- [ ] Build tools
- [ ] Build orchestrator
- [ ] Build API route
- [ ] Build web demo page
- [ ] Build project detail page
- [ ] Add trace view
- [ ] Add fallback path
- [ ] Add eval integration

## 6. Demo project: Intelligent Investing Operations Copilot
- [ ] Seed synthetic accounts + policy docs
- [ ] Define schemas
- [ ] Build tools
- [ ] Build retrieval path
- [ ] Build orchestrator
- [ ] Build API route
- [ ] Build web demo page
- [ ] Build project detail page
- [ ] Add citations/retrieval trace
- [ ] Add eval integration

## 7. Demo project: Legacy Workflow to AI-Native Adapter
- [ ] Seed input examples
- [ ] Define legacy schema + validation rules
- [ ] Build mock legacy service
- [ ] Build adapter orchestrator
- [ ] Build API route
- [ ] Build web demo page
- [ ] Build project detail page
- [ ] Show before/after payloads
- [ ] Add eval integration

## 8. Demo project: Evaluation + Reliability Console
- [ ] Build aggregate queries
- [ ] Build run table
- [ ] Build run detail page/panel
- [ ] Build charts/cards
- [ ] Build flagged-runs view
- [ ] Build project filters
- [ ] Build prompt version compare
- [ ] Add observability narrative copy

## 9. Infra / Terraform
- [x] Create `infra/terraform`
- [x] Add provider config
- [x] Add dev environment
- [x] Add prod environment
- [x] Add Artifact Registry module
- [x] Add Cloud Run module
- [x] Add Firebase Hosting module
- [x] Add Firestore indexes
- [x] Add Secret Manager config
- [x] Add Monitoring dashboard
- [x] Add GitHub OIDC auth

## 10. CI/CD
- [x] Add PR CI workflow
- [x] Add main deploy workflow
- [x] Add Terraform fmt/validate step
- [x] Add app build step
- [x] Add test step
- [x] Add deploy auth with OIDC
- [ ] Add status badges to README

## 11. Content and polish
- [ ] Write project narratives
- [ ] Create architecture diagrams
- [ ] Add screenshots/gifs where helpful
- [ ] Add README quickstart
- [ ] Add repo architecture docs
- [ ] Add contact / CTA
- [ ] Final pass for broken links/copy

## 12. Showcase workflow
- [ ] Keep commits meaningful
- [ ] Use issues for work tracking
- [ ] Open PRs even if solo
- [ ] Add comments explaining key choices
- [ ] Tag major milestones/releases
- [ ] Keep the public repo scrubbed of secrets, service account keys, `.tfvars`, state files, plans, and sensitive notes in docs or code
