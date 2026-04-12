# IaC + CI/CD Initialization Checklist

Purpose: initialize `portfolio-tq` so infrastructure, environments, identity, CI/CD, and deployment workflows are set up correctly before heavy feature development begins.

This checklist is ordered. Run it top to bottom.

---

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

Agent operating rules:
- Do not invent alternate architecture unless a checklist item explicitly calls for a deviation note.
- Keep all environment names consistent with `dev` and `prod`.
- Prefer Terraform-managed setup over click-ops, except for unavoidable bootstrap steps.
- Never commit secrets, service account keys, `.tfvars`, or local env files.
- If a manual cloud console step is unavoidable, document it in a short markdown note under `docs/architecture/adr-bootstrapping-notes.md`.

---

## Definition of done for initialization

Initialization is complete when all of the following are true:

- The public GitHub repository exists and the default collaboration flow is defined.
- `main` and `dev` branch workflow is in place.
- Monorepo package management, linting, formatting, and typechecking work locally.
- Terraform runs `fmt`, `validate`, and environment-specific `plan` successfully.
- GCP `dev` and `prod` projects exist and are wired to Terraform.
- GitHub Actions can authenticate to GCP through OIDC without long-lived cloud keys.
- Firebase Hosting deployment for `apps/web` is automated.
- Cloud Run deployment for `apps/api` is automated.
- Firestore, Secret Manager, Artifact Registry, logging metrics, and monitoring dashboard resources are represented in Terraform.
- CI runs on pull requests and branch pushes.
- CD runs for `dev` from the `dev` branch and for `prod` from `main`.
- Basic observability smoke checks exist for both environments.

---

## 0. Branching and repo workflow

### 0.1 Decide branch model
- [x] Use `main` as the stable, publicly reviewable branch.
- [x] Use `dev` as the active integration branch for daily work.
- [x] Use short-lived feature branches off `dev` for larger changes if needed.
- [x] Merge to `main` only at clear milestones.

### 0.2 Configure repo defaults
- [ ] Create public GitHub repository named `portfolio-tq`.
- [x] Set repo description and topics.
- [ ] Add license file.
- [x] Add root `README.md` with short project summary and architecture links.
- [x] Set default branch initially to `main`.
- [ ] Create `dev` branch immediately after first scaffold commit.

### 0.3 Protect branches
- [ ] Protect `main` with required PRs.
- [ ] Require status checks on `main`.
- [ ] Protect `dev` with at least CI checks once workflows exist.
- [ ] Disable force-push to `main`.
- [ ] Decide whether squash merge or rebase merge is the default.

### 0.4 Public workflow hygiene
- [x] Add `.gitignore` for Node, Terraform, Firebase, IDE files, env files.
- [x] Add `.editorconfig`.
- [x] Add commit message convention note in `README.md` or `docs/README.md`.
- [x] Add issue templates for bug, infra task, feature.
- [x] Add pull request template.

---

## 1. Local tooling and monorepo bootstrap

Reference docs:
- `docs/architecture/repo-skeleton.md`
- `docs/specs/technical-spec-overall.md`

### 1.1 Toolchain
- [x] Pin Node version with `.nvmrc` or `.tool-versions`.
- [x] Decide package manager: `pnpm` recommended.
- [x] Install Terraform locally.
- [x] Install Google Cloud CLI locally.
- [x] Install Firebase CLI locally.
- [x] Install GitHub CLI locally.

### 1.2 Root workspace setup
- [x] Create root `package.json`.
- [x] Create workspace config (`pnpm-workspace.yaml` if using pnpm).
- [x] Create root `tsconfig.base.json`.
- [x] Create root lint config.
- [x] Create root format config.
- [x] Add root scripts:
  - [x] `dev:web`
  - [x] `dev:api`
  - [x] `build`
  - [x] `lint`
  - [x] `typecheck`
  - [x] `test`
  - [x] `terraform:fmt`
  - [x] `terraform:validate`
  - [x] `terraform:plan:dev`
  - [x] `terraform:plan:prod`

### 1.3 App and package scaffolding
- [x] Scaffold `apps/web`.
- [x] Scaffold `apps/api`.
- [x] Create packages:
  - [x] `packages/ui`
  - [x] `packages/schemas`
  - [x] `packages/agents`
  - [x] `packages/tools`
  - [x] `packages/evals`
  - [x] `packages/types`
  - [x] `packages/config`
- [x] Ensure local workspace imports resolve.
- [x] Ensure root `build`, `lint`, and `typecheck` run cleanly.

### 1.4 Initial commit
- [ ] Make first scaffold commit on `main`.
- [ ] Create `dev` from that commit.
- [x] Continue active setup work on `dev`.

### Section 1 status notes
- Repo verification was completed after following the required reading order listed above.
- The public GitHub repo exists at `thinkquant/portfolio_tq`; the repo-name item stays open because it uses an underscore instead of `portfolio-tq`.
- GitHub repo description and topics were set during this pass.
- `main` and `dev` are both currently unprotected, and squash, rebase, and merge-commit merges are all enabled, so section 0.3 remains open.
- `firebase` was not installed globally on this machine, but it is now available repo-locally via `pnpm exec firebase`.
- Section 1 scaffold verification completed successfully with `pnpm build`, `pnpm lint`, `pnpm typecheck`, and `pnpm test`.
- The initial scaffold commit items remain open because this pass did not create or move commits.

---

## 2. GCP and Firebase bootstrap

Reference docs:
- `docs/architecture/iac-and-cicd.md`
- `docs/specs/technical-spec-overall.md`

### 2.1 Cloud project strategy
- [ ] Create one GCP project for `dev`.
- [ ] Create one GCP project for `prod`.
- [ ] Decide naming convention and document it in `docs/architecture/adr-bootstrapping-notes.md`.
- [ ] Enable billing on both.

### 2.2 Required APIs
For both projects:
- [ ] Enable Cloud Run API.
- [ ] Enable Artifact Registry API.
- [ ] Enable Firestore API.
- [ ] Enable Secret Manager API.
- [ ] Enable Cloud Build API if needed by chosen deploy flow.
- [ ] Enable IAM Credentials API if needed.
- [ ] Enable Service Usage API.
- [ ] Enable Cloud Resource Manager API.
- [ ] Enable Logging API.
- [ ] Enable Monitoring API.
- [ ] Enable Vertex AI API.
- [ ] Enable Firebase Management / Hosting related setup as needed.

### 2.3 Firebase setup
- [ ] Attach Firebase to `dev` project.
- [ ] Attach Firebase to `prod` project.
- [ ] Initialize Hosting target structure for the web app.
- [ ] Decide site/channel naming convention.
- [ ] Document Firebase project aliases.

### 2.4 Firestore mode
- [ ] Create Firestore in Native mode for `dev`.
- [ ] Create Firestore in Native mode for `prod`.
- [ ] Document region choice.

---

## 3. Terraform foundation

Reference docs:
- `docs/architecture/iac-and-cicd.md`
- `docs/architecture/repo-skeleton.md`
- `docs/architecture/observability-and-dashboards.md`

### 3.1 Terraform root setup
- [ ] Create provider configuration pattern.
- [ ] Create environment folders:
  - [ ] `infra/terraform/environments/dev`
  - [ ] `infra/terraform/environments/prod`
- [ ] Create module folders listed in the spec.
- [ ] Add `versions.tf` in each environment.
- [ ] Add `providers.tf` in each environment.
- [ ] Add `variables.tf`, `outputs.tf`, `main.tf` in each environment.
- [ ] Add `terraform.tfvars.example` in each environment.

### 3.2 Remote state
- [ ] Decide remote state backend strategy.
- [ ] Create GCS bucket(s) for Terraform state.
- [ ] Enable versioning on state bucket(s).
- [ ] Enable uniform bucket-level access.
- [ ] Set lifecycle rules if desired.
- [ ] Wire backend configuration for `dev`.
- [ ] Wire backend configuration for `prod`.
- [ ] Confirm state is not local-only after bootstrap.

### 3.3 Core modules
Create first-pass Terraform modules for:
- [ ] `github_oidc`
- [ ] `iam_service_account`
- [ ] `artifact_registry`
- [ ] `cloud_run_service`
- [ ] `firebase_hosting`
- [ ] `firestore_indexes`
- [ ] `secrets`
- [ ] `logging_metrics`
- [ ] `monitoring_dashboard`

### 3.4 Environment composition
- [ ] Compose `dev` environment using modules.
- [ ] Compose `prod` environment using modules.
- [ ] Keep variable names consistent across environments.
- [ ] Ensure plans are environment-isolated.

### 3.5 Terraform quality gates
- [ ] Add `terraform fmt -check` pass.
- [ ] Add `terraform validate` pass.
- [ ] Run `plan` cleanly for `dev`.
- [ ] Run `plan` cleanly for `prod`.
- [ ] Record any unavoidable manual steps.

---

## 4. Identity, auth, and secrets for CI/CD

Reference docs:
- `docs/architecture/iac-and-cicd.md`
- `docs/specs/technical-spec-overall.md`

### 4.1 GitHub to GCP auth strategy
- [ ] Use GitHub Actions OIDC.
- [ ] Do not use long-lived service account keys for deployment.
- [ ] Create Workload Identity Pool.
- [ ] Create Workload Identity Provider for GitHub.
- [ ] Restrict provider conditions to the correct repo.
- [ ] Bind deploy service account(s) to workload identity principal.

### 4.2 Service accounts
- [ ] Create deploy service account for `dev`.
- [ ] Create deploy service account for `prod`.
- [ ] Grant minimum required roles for:
  - [ ] Cloud Run deploy
  - [ ] Artifact Registry push/read
  - [ ] Firebase Hosting deploy
  - [ ] Secret access where needed
  - [ ] Monitoring/logging write if needed
- [ ] Avoid broad owner/editor roles.

### 4.3 GitHub secrets and variables
Only store what is still necessary.
- [ ] Add GCP project IDs as repo/environment variables.
- [ ] Add Firebase project aliases or site IDs if needed.
- [ ] Add any non-secret config values as repo variables.
- [ ] Store only genuinely required secrets.
- [ ] Prefer GitHub Environments for `dev` and `prod`.
- [ ] Configure environment approvals for `prod` if desired.

### 4.4 Application secrets strategy
- [ ] Define initial Secret Manager secrets:
  - [ ] Vertex AI related config if needed
  - [ ] app-specific access keys if any
  - [ ] optional demo gate secret
- [ ] Add Terraform resources for secrets.
- [ ] Document which values are set manually after creation.
- [ ] Ensure no secret values are committed.

---

## 5. Web deployment path

Reference docs:
- `docs/specs/service-web.md`
- `docs/architecture/iac-and-cicd.md`

### 5.1 Web build readiness
- [ ] Confirm `apps/web` builds locally.
- [ ] Confirm environment variable strategy for web app.
- [ ] Separate public frontend env values from backend secrets.
- [ ] Add hosting config files.

### 5.2 Firebase Hosting deploy path
- [ ] Decide if deploying single site per environment or channels.
- [ ] Configure Firebase Hosting for `dev`.
- [ ] Configure Firebase Hosting for `prod`.
- [ ] Ensure static assets are cache-friendly.
- [ ] Ensure SPA rewrite configuration exists if using client-side routing.

### 5.3 Web smoke checks
- [ ] Deployed homepage loads.
- [ ] Project index route loads.
- [ ] Example project page loads.
- [ ] No broken route rewrites.

---

## 6. API deployment path

Reference docs:
- `docs/specs/service-api.md`
- `docs/specs/technical-spec-overall.md`
- `docs/architecture/observability-and-dashboards.md`

### 6.1 API build and containerization
- [ ] Confirm `apps/api` builds locally.
- [ ] Add Dockerfile.
- [ ] Add `.dockerignore`.
- [ ] Decide port and health endpoint behavior.
- [ ] Make health endpoint available early.

### 6.2 Artifact Registry
- [ ] Provision Artifact Registry repo in `dev`.
- [ ] Provision Artifact Registry repo in `prod`.
- [ ] Ensure CI can push images.

### 6.3 Cloud Run setup
- [ ] Define Cloud Run service in Terraform.
- [ ] Set CPU/memory defaults.
- [ ] Set concurrency.
- [ ] Set min/max instances.
- [ ] Configure env vars.
- [ ] Mount or access secrets cleanly.
- [ ] Set ingress policy.
- [ ] Decide public vs authenticated API access for demo phase.

### 6.4 API smoke checks
- [ ] `/health` returns success in `dev`.
- [ ] `/health` returns success in `prod`.
- [ ] Example demo endpoint deploys cleanly.
- [ ] Logs appear in Cloud Logging.

---

## 7. Firestore, seed data, and indexes

Reference docs:
- `docs/specs/technical-spec-overall.md`
- `docs/architecture/observability-and-dashboards.md`
- `docs/specs/service-api.md`

### 7.1 Data model initialization
- [ ] Define initial collections:
  - [ ] `projects`
  - [ ] `runs`
  - [ ] `toolInvocations`
  - [ ] `evaluations`
  - [ ] `escalations`
  - [ ] `promptVersions`
  - [ ] `documents`
  - [ ] `cases`
  - [ ] `users`
  - [ ] `accessCodes`
- [ ] Define initial indexes needed for dashboard queries.
- [ ] Represent indexes in Terraform or exportable config.

### 7.2 Seed data path
- [ ] Create seed script location.
- [ ] Define seed command for `dev`.
- [ ] Keep `prod` seed strategy intentional and minimal.
- [ ] Seed minimal project metadata.
- [ ] Seed example case data.
- [ ] Seed prompt versions.

### 7.3 Firestore smoke checks
- [ ] Seed script runs in `dev`.
- [ ] Web or API can read seeded `projects` collection.
- [ ] Dashboard query path works with seed data.

---

## 8. Observability foundation

Reference docs:
- `docs/architecture/observability-and-dashboards.md`
- `docs/specs/service-api.md`
- `docs/specs/service-web.md`

### 8.1 Logging standard
- [ ] Implement structured logging fields:
  - [ ] `projectId`
  - [ ] `runId`
  - [ ] `environment`
  - [ ] `eventType`
  - [ ] `timestamp`
  - [ ] optional `latencyMs`
  - [ ] optional `promptVersionId`
- [ ] Add run lifecycle log helper.
- [ ] Add error log helper.

### 8.2 Cloud metrics and dashboards
- [ ] Terraform module provisions at least one Cloud Monitoring dashboard.
- [ ] Add log-based metric for fallback count or run failures.
- [ ] Add latency chart widget.
- [ ] Add error count widget.
- [ ] Add request count widget.

### 8.3 In-app observability readiness
- [ ] Define API endpoint(s) for dashboard feed.
- [ ] Confirm `runs` and `evaluations` can feed the web app.
- [ ] Ensure at least one sample run can be rendered end to end.

### 8.4 Observability smoke checks
- [ ] API request creates logs.
- [ ] Cloud Run dashboard shows traffic.
- [ ] In-app observability page can load seeded metrics.

---

## 9. GitHub Actions workflows

Reference docs:
- `docs/architecture/iac-and-cicd.md`
- `docs/specs/service-web.md`
- `docs/specs/service-api.md`

### 9.1 Workflow files
- [ ] Create CI workflow for PRs.
- [ ] Create deploy workflow for `dev` branch.
- [ ] Create deploy workflow for `main` branch.
- [ ] Optionally create Terraform plan workflow for PR comments/artifacts.

### 9.2 PR CI jobs
- [ ] checkout
- [ ] install dependencies
- [ ] cache package manager deps
- [ ] lint
- [ ] typecheck
- [ ] unit tests if present
- [ ] web build
- [ ] api build
- [ ] terraform fmt check
- [ ] terraform validate

### 9.3 Dev deploy workflow
Triggered from `dev` branch.
- [ ] authenticate to GCP with OIDC
- [ ] run Terraform plan/apply for `dev` as appropriate
- [ ] build web
- [ ] deploy web to Firebase `dev`
- [ ] build container image
- [ ] push to Artifact Registry `dev`
- [ ] deploy API to Cloud Run `dev`
- [ ] run smoke check(s)

### 9.4 Prod deploy workflow
Triggered from `main` branch.
- [ ] authenticate to GCP with OIDC
- [ ] run Terraform plan/apply for `prod`
- [ ] build web
- [ ] deploy web to Firebase `prod`
- [ ] build container image
- [ ] push to Artifact Registry `prod`
- [ ] deploy API to Cloud Run `prod`
- [ ] run smoke check(s)

### 9.5 Workflow quality
- [ ] Use concurrency control to avoid overlapping deploys.
- [ ] Use environment-scoped variables.
- [ ] Publish useful artifacts for failures where appropriate.
- [ ] Keep logs readable for public-review value.

---

## 10. Repository standards for public showcase value

Reference docs:
- `docs/specs/technical-spec-overall.md`
- `docs/specs/service-web.md`
- `docs/checklists/master-checklist.md`

### 10.1 Public development visibility
- [ ] Keep commits small enough to tell the build story.
- [ ] Write meaningful commit messages.
- [ ] Use issues or milestone notes for major setup phases.
- [ ] Keep docs updated when infra decisions change.

### 10.2 Setup visibility pages
- [ ] Add `/repo-workflow` page in the web app later.
- [ ] Add architecture diagram placeholders early.
- [ ] Add README section describing branch strategy and environments.

---

## 11. Final initialization verification

### 11.1 Local verification
- [ ] `pnpm install` works from clean clone.
- [ ] `pnpm lint` passes.
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm build` passes.
- [ ] Terraform fmt/validate pass.

### 11.2 Dev environment verification
- [ ] Terraform plan/apply succeeds for `dev`.
- [ ] Web deploy succeeds for `dev`.
- [ ] API deploy succeeds for `dev`.
- [ ] Firestore accessible in `dev`.
- [ ] Cloud logs visible in `dev`.
- [ ] One smoke request completes and is logged.

### 11.3 Prod environment verification
- [ ] Terraform plan/apply succeeds for `prod`.
- [ ] Web deploy succeeds for `prod`.
- [ ] API deploy succeeds for `prod`.
- [ ] Firestore accessible in `prod`.
- [ ] Cloud logs visible in `prod`.
- [ ] One smoke request completes and is logged.

### 11.4 GitHub verification
- [ ] PR CI runs successfully.
- [ ] Push to `dev` triggers `dev` deploy.
- [ ] Merge to `main` triggers `prod` deploy.
- [ ] Branch protections enforce intended flow.

---

## Suggested milestone commits for setup

1. `chore: initialize public monorepo scaffold`
2. `chore: add workspace tooling lint format typecheck`
3. `infra: scaffold terraform environments and modules`
4. `infra: configure gcp projects firebase and remote state`
5. `ci: add github actions ci workflow`
6. `ci: add oidc-based dev deployment pipeline`
7. `ci: add oidc-based prod deployment pipeline`
8. `infra: provision monitoring logging and secrets baseline`
9. `feat: add api health endpoint and initial web shell`
10. `docs: finalize infra bootstrapping notes and setup status`

---

## Notes on branch strategy

Recommended for this project:
- `main` stays clean and milestone-based.
- `dev` is your integration branch for rapid visible progress.
- Use feature branches off `dev` only when a change is large enough that you do not want to destabilize `dev`.
- Rebase or merge `main` back into `dev` after milestone releases as needed.
- Avoid letting `dev` drift too far from `main` for long periods.

This gives you visible public development without making `main` look chaotic.
