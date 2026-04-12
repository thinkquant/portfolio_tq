# Master Checklist

## 0. Foundation
- [ ] Create public GitHub repo `portfolio-tq`
- [ ] Add license, README, `.gitignore`, editorconfig
- [ ] Initialize monorepo tooling
- [ ] Create repo skeleton folders
- [ ] Add docs skeleton
- [ ] Add issue labels/milestones
- [ ] Decide branch strategy and contribution rules

## 1. Tooling and quality
- [ ] Set up package manager/workspace config
- [ ] Set up TypeScript base config
- [ ] Set up linting
- [ ] Set up formatting
- [ ] Set up test runner(s)
- [ ] Set up pre-commit hooks if desired
- [ ] Set up shared env loading strategy

## 2. Frontend shell
- [ ] Create `apps/web`
- [ ] Add routing
- [ ] Add global layout/nav/footer
- [ ] Add theme/tokens
- [ ] Build Home page
- [ ] Build About page
- [ ] Build Projects index page
- [ ] Build Architecture page
- [ ] Build Observability page
- [ ] Build Repo Workflow page
- [ ] Make site responsive

## 3. Shared packages
- [ ] `packages/types`
- [ ] `packages/schemas`
- [ ] `packages/config`
- [ ] `packages/ui`
- [ ] `packages/agents`
- [ ] `packages/tools`
- [ ] `packages/evals`

## 4. API service
- [ ] Create `apps/api`
- [ ] Add health route
- [ ] Add shared request/response helpers
- [ ] Add Vertex AI wrapper
- [ ] Add logging wrapper
- [ ] Add Firestore persistence
- [ ] Add evaluation writer
- [ ] Add observability endpoints

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
- [ ] Create `infra/terraform`
- [ ] Add provider config
- [ ] Add dev environment
- [ ] Add prod environment
- [ ] Add Artifact Registry module
- [ ] Add Cloud Run module
- [ ] Add Firebase Hosting module
- [ ] Add Firestore indexes
- [ ] Add Secret Manager config
- [ ] Add Monitoring dashboard
- [ ] Add GitHub OIDC auth

## 10. CI/CD
- [ ] Add PR CI workflow
- [ ] Add main deploy workflow
- [ ] Add Terraform fmt/validate step
- [ ] Add app build step
- [ ] Add test step
- [ ] Add deploy auth with OIDC
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
