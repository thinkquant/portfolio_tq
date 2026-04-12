# IaC + CI/CD Initialization Checklist

Purpose: initialize `portfolio_tq` so infrastructure, environments, identity, CI/CD, and deployment workflows are set up correctly before heavy feature development begins.

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
- Never write sensitive values into docs, comments, examples, commits, or source files; this repository is public.
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

- [x] Create public GitHub repository named `portfolio_tq`.
- [x] Set repo description and topics.
- [x] Add license file.
- [x] Add root `README.md` with short project summary and architecture links.
- [x] Set default branch initially to `main`.
- [x] Create `dev` branch immediately after first scaffold commit.

### 0.3 Protect branches

- [x] Protect `main` with required PRs.
- [ ] Require status checks on `main`.
- [ ] Protect `dev` with at least CI checks once workflows exist.
- [x] Disable force-push to `main`.
- [ ] Decide whether squash merge or rebase merge is the default.

### 0.4 Public workflow hygiene

- [x] Add `.gitignore` for Node, Terraform, Firebase, IDE files, env files.
- [x] Add `.editorconfig`.
- [x] Add commit message convention note in `README.md` or `docs/README.md`.
- [x] Add issue templates for bug, infra task, feature.
- [x] Add pull request template.

### 0.5 Public repo safety guardrails

- [x] Keep `.gitignore` blocking env files, Terraform state, Terraform plans, `.tfvars`, Firebase debug logs, service-account keys, build artifacts, and IDE/system files.
- [x] Add `.dockerignore` ahead of containerization work.
- [x] Add optional `.gcloudignore` ahead of any future source-based gcloud deploy flow.
- [x] Document that ignore files must be reviewed and updated before commits whenever new tooling, deploy flows, or local artifacts are introduced.

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

- [x] Make first scaffold commit on `main`.
- [x] Create `dev` from that commit.
- [x] Continue active setup work on `dev`.

### Section 1 status notes

- Repo verification was completed after following the required reading order listed above.
- The public GitHub repo exists at `thinkquant/portfolio_tq`; the underscore name is intentional and now treated as canonical in repo-facing docs.
- GitHub repo description and topics were set during this pass.
- `main` is protected through the active GitHub ruleset `protect_main`, which blocks deletion, blocks non-fast-forward updates, and requires pull requests with one approval.
- `main` still does not have required status checks, `dev` is now protected from deletion/non-fast-forward updates but not yet with required CI checks, and the default merge method is still undecided, so those checklist items remain open.
- `firebase` was not installed globally on this machine, but it is now available repo-locally via `pnpm exec firebase`.
- Section 1 scaffold verification completed successfully with `pnpm build`, `pnpm lint`, `pnpm typecheck`, and `pnpm test`.

---

## 2. GCP and Firebase bootstrap

Reference docs:

- `docs/architecture/iac-and-cicd.md`
- `docs/specs/technical-spec-overall.md`

### 2.1 Cloud project strategy

- [x] Create one GCP project for `dev`.
- [x] Create one GCP project for `prod`.
- [x] Decide naming convention and document it in `docs/architecture/adr-bootstrapping-notes.md`.
- [x] Enable billing on both.

### 2.2 Required APIs

For both projects:

- [x] Enable Cloud Run API.
- [x] Enable Artifact Registry API.
- [x] Enable Firestore API.
- [x] Enable Secret Manager API.
- [x] Enable Cloud Build API if needed by chosen deploy flow.
- [x] Enable IAM Credentials API if needed.
- [x] Enable Service Usage API.
- [x] Enable Cloud Resource Manager API.
- [x] Enable Logging API.
- [x] Enable Monitoring API.
- [x] Enable Vertex AI API.
- [x] Enable Firebase Management / Hosting related setup as needed.

### 2.3 Firebase setup

- [x] Attach Firebase to `dev` project.
- [x] Attach Firebase to `prod` project.
- [x] Initialize Hosting target structure for the web app.
- [x] Decide site/channel naming convention.
- [x] Document Firebase project aliases.

### 2.4 Firestore mode

- [x] Create Firestore in Native mode for `dev`.
- [x] Create Firestore in Native mode for `prod`.
- [x] Document region choice.

### Section 2 status notes

- GCP project names are `portfolio-tq-dev` and `portfolio-tq-prod`.
- Firebase project names match the GCP project names exactly, with local aliases `dev` and `prod` configured in `.firebaserc`.
- Billing is linked on both projects.
- The active hosting strategy is environment-per-project rather than preview channels: active development deploys to `portfolio-tq-dev`, and milestone releases deploy to `portfolio-tq-prod`.
- Bootstrap API enablement was performed with `gcloud services enable` for `serviceusage.googleapis.com`, `cloudresourcemanager.googleapis.com`, `iam.googleapis.com`, `iamcredentials.googleapis.com`, `sts.googleapis.com`, `run.googleapis.com`, `artifactregistry.googleapis.com`, `secretmanager.googleapis.com`, `firestore.googleapis.com`, `firebase.googleapis.com`, `firebasehosting.googleapis.com`, and `aiplatform.googleapis.com`.
- Live verification on April 12, 2026 also confirmed `logging.googleapis.com` and `monitoring.googleapis.com` are enabled on both projects; `cloudbuild.googleapis.com` is enabled on `portfolio-tq-prod` and is not currently required for the planned direct deploy flow in `dev`.
- Firestore is configured in Native mode in region `nam5`, using named databases `portfolio-tq-dev` and `portfolio-tq-prod` rather than the default database ID.

---

## 3. Terraform foundation

Reference docs:

- `docs/architecture/iac-and-cicd.md`
- `docs/architecture/repo-skeleton.md`
- `docs/architecture/observability-and-dashboards.md`

### 3.1 Terraform root setup

- [x] Create provider configuration pattern.
- [x] Create environment folders:
  - [x] `infra/terraform/environments/dev`
  - [x] `infra/terraform/environments/prod`
- [x] Create module folders listed in the spec.
- [x] Add `versions.tf` in each environment.
- [x] Add `providers.tf` in each environment.
- [x] Add `variables.tf`, `outputs.tf`, `main.tf` in each environment.
- [x] Add `terraform.tfvars.example` in each environment.

### 3.2 Remote state

- [x] Decide remote state backend strategy.
- [x] Create GCS bucket(s) for Terraform state.
- [x] Enable versioning on state bucket(s).
- [x] Enable uniform bucket-level access.
- [x] Set lifecycle rules if desired.
- [x] Wire backend configuration for `dev`.
- [x] Wire backend configuration for `prod`.
- [x] Confirm state is not local-only after bootstrap.

### 3.3 Core modules

Create first-pass Terraform modules for:

- [x] `github_oidc`
- [x] `iam_service_account`
- [x] `artifact_registry`
- [x] `cloud_run_service`
- [x] `firebase_hosting`
- [x] `firestore_indexes`
- [x] `secrets`
- [x] `logging_metrics`
- [x] `monitoring_dashboard`

### 3.4 Environment composition

- [x] Compose `dev` environment using modules.
- [x] Compose `prod` environment using modules.
- [x] Keep variable names consistent across environments.
- [x] Ensure plans are environment-isolated.

### 3.5 Terraform quality gates

- [x] Add `terraform fmt -check` pass.
- [x] Add `terraform validate` pass.
- [x] Run `plan` cleanly for `dev`.
- [x] Run `plan` cleanly for `prod`.
- [x] Record any unavoidable manual steps.

### Section 3 status notes

- Terraform foundation files now exist under `infra/terraform/modules/*` and `infra/terraform/environments/{dev,prod}` with `versions.tf`, `providers.tf`, `variables.tf`, `main.tf`, `outputs.tf`, and `terraform.tfvars.example` in each environment.
- Remote state uses one GCS bucket per environment: `gs://portfolio-tq-dev-tfstate` and `gs://portfolio-tq-prod-tfstate`.
- Both state buckets were created in `US` with uniform bucket-level access, object versioning, and a lifecycle rule deleting noncurrent object versions after 30 days.
- Both environments were initialized against the `gcs` backend successfully with prefix `terraform/state`.
- Verification completed successfully with `terraform fmt -recursive infra/terraform`, `terraform -chdir=infra/terraform/environments/dev init -reconfigure`, `terraform -chdir=infra/terraform/environments/prod init -reconfigure`, `terraform validate` in both environments, and clean plans for both environments.
- The current first-pass scaffold references the already-existing Firebase Hosting site IDs but does not import or recreate them. Terraform management of those existing default sites can be added later if desired.
- No user-executed manual step was required to complete section 3 during this pass.
- Before future commits or new deployment tooling, re-check `.gitignore`, `.dockerignore`, and `.gcloudignore` so new local artifacts, secrets, plans, or generated files stay excluded from the public repo.

---

## 4. Identity, auth, and secrets for CI/CD

Reference docs:

- `docs/architecture/iac-and-cicd.md`
- `docs/specs/technical-spec-overall.md`

### 4.1 GitHub to GCP auth strategy

- [x] Use GitHub Actions OIDC.
- [x] Do not use long-lived service account keys for deployment.
- [x] Create Workload Identity Pool.
- [x] Create Workload Identity Provider for GitHub.
- [x] Restrict provider conditions to the correct repo.
- [x] Bind deploy service account(s) to workload identity principal.

### 4.2 Service accounts

- [x] Create deploy service account for `dev`.
- [x] Create deploy service account for `prod`.
- [x] Grant minimum required roles for:
  - [x] Cloud Run deploy
  - [x] Artifact Registry push/read
  - [x] Firebase Hosting deploy
  - [x] Secret access where needed
  - [x] Monitoring/logging write if needed
- [x] Avoid broad owner/editor roles.

### 4.3 GitHub secrets and variables

Only store what is still necessary.

- [x] Add GCP project IDs as repo/environment variables.
- [x] Add Firebase project aliases or site IDs if needed.
- [x] Add any non-secret config values as repo variables.
- [x] Store only genuinely required secrets.
- [x] Prefer GitHub Environments for `dev` and `prod`.
- [x] Configure environment approvals for `prod` if desired.

### 4.4 Application secrets strategy

- [x] Define initial Secret Manager secrets:
  - [x] Vertex AI related config if needed
  - [x] app-specific access keys if any
  - [x] optional demo gate secret
- [x] Add Terraform resources for secrets.
- [x] Document which values are set manually after creation.
- [x] Ensure no secret values are committed.

### Section 4 status notes

- Terraform-backed identity resources were applied for `dev` and `prod` with targeted applies limited to `module.github_oidc`, `module.deploy_service_account`, and `module.secrets` so section 4 could be completed without prematurely applying later deploy resources.
- Active Workload Identity Pools now exist in both projects:
  - `projects/932345783663/locations/global/workloadIdentityPools/github-actions-dev`
  - `projects/723738590534/locations/global/workloadIdentityPools/github-actions-prod`
- Active GitHub OIDC providers now exist in both projects and are restricted to `assertion.repository == "thinkquant/portfolio_tq"`.
- Deploy service accounts now exist in both projects:
  - `github-deploy-dev@portfolio-tq-dev.iam.gserviceaccount.com`
  - `github-deploy-prod@portfolio-tq-prod.iam.gserviceaccount.com`
- Deploy service accounts are bound to the workload identity principal set for `thinkquant/portfolio_tq`.
- Deploy service accounts were granted these project roles and no broad `owner` or `editor` roles:
  - `roles/run.admin`
  - `roles/artifactregistry.writer`
  - `roles/datastore.indexAdmin`
  - `roles/firebasehosting.admin`
  - `roles/secretmanager.secretAccessor`
  - `roles/iam.serviceAccountUser`
- Verification confirmed no user-managed service account keys exist for either deploy service account. Google-managed system keys still appear in IAM, which is normal and is not the same as storing long-lived user-managed deploy keys.
- GitHub Environments `dev` and `prod` now exist. Environment-scoped variables were added for project ID, project number, Firebase alias, Firebase site ID, Firestore database ID, workload identity provider, and deploy service account. Repo-level variables `GCP_REGION` and `FIRESTORE_LOCATION` were also added.
- GitHub repository secrets and environment secrets remain empty at this stage, which is intentional because OIDC removes the need for long-lived cloud key secrets.
- Initial Secret Manager secret containers now exist in both projects for `vertex-ai-location` and `demo-access-gate`. No secret versions were created in this pass.
- No app-specific access keys are currently required, so none were defined.
- Secret values still require manual population later through Secret Manager before runtime or deployment steps depend on them. Those values must never be written into the repo, docs, workflow YAML, or local tracked files.
- `prod` environment approvals are now configured with manual approval from `thinkquant`.

---

## 5. Web deployment path

Reference docs:

- `docs/specs/service-web.md`
- `docs/architecture/iac-and-cicd.md`

### 5.1 Web build readiness

- [x] Confirm `apps/web` builds locally.
- [x] Confirm environment variable strategy for web app.
- [x] Separate public frontend env values from backend secrets.
- [x] Add hosting config files.

### 5.2 Firebase Hosting deploy path

- [x] Decide if deploying single site per environment or channels.
- [x] Configure Firebase Hosting for `dev`.
- [x] Configure Firebase Hosting for `prod`.
- [x] Ensure static assets are cache-friendly.
- [x] Ensure SPA rewrite configuration exists if using client-side routing.

### 5.3 Web smoke checks

- [x] Deployed homepage loads.
- [x] Project index route loads.
- [x] Example project page loads.
- [x] No broken route rewrites.

### Section 5 status notes

- `apps/web` now builds a source-controlled static route shell with generated pages for `/`, `/projects`, `/projects/payment-exception-review`, `/architecture`, `/observability`, and `/repo-workflow`.
- Repeatable web deploy commands now exist at the repo root:
  - `pnpm deploy:web:dev`
  - `pnpm deploy:web:prod`
- Repeatable Hosting smoke checks now exist at the repo root:
  - `pnpm smoke:web:dev`
  - `pnpm smoke:web:prod`
- The confirmed frontend env strategy is:
  - no secrets are shipped to the client
  - the current web shell uses no runtime secret configuration
  - any future frontend-exposed values must be explicitly public and build-time only
  - backend-only credentials remain in Secret Manager or CI/CD configuration, never in frontend source or docs
- Firebase Hosting continues to use one live site per environment with no preview channels:
  - `dev` -> `https://portfolio-tq-dev.web.app`
  - `prod` -> `https://portfolio-tq-prod.web.app`
- Hosting config now serves immutable hashed assets from `/assets/**` and uses a catch-all rewrite to `/index.html` for unmatched client-side routes.
- Live verification completed successfully on April 12, 2026 with:
  - `pnpm --filter @portfolio-tq/web build`
  - `pnpm build`
  - `pnpm typecheck`
  - `pnpm deploy:web:dev`
  - `pnpm deploy:web:prod`
  - `pnpm smoke:web:dev`
  - `pnpm smoke:web:prod`
- Smoke verification now confirms:
  - homepage returns `200`
  - `/projects` returns `200`
  - `/projects/payment-exception-review` returns `200`
  - an unmatched route (`/demo/runtime-route-check`) rewrites successfully and returns `200`
  - `/index.html` revalidates and the generated CSS asset is served with `Cache-Control: public, max-age=31536000, immutable`
- Observed Hosting nuance:
  - direct `/index.html` receives the intended no-cache header
  - rewritten `web.app` routes like `/` currently return Firebase's default `Cache-Control: max-age=3600`
  - if stricter cache headers are required on rewritten root routes later, revisit the Hosting/CDN behavior before relying on that assumption

---

## 6. API deployment path

Reference docs:

- `docs/specs/service-api.md`
- `docs/specs/technical-spec-overall.md`
- `docs/architecture/observability-and-dashboards.md`

### 6.1 API build and containerization

- [x] Confirm `apps/api` builds locally.
- [x] Add Dockerfile.
- [x] Add `.dockerignore`.
- [x] Decide port and health endpoint behavior.
- [x] Make health endpoint available early.

### 6.2 Artifact Registry

- [x] Provision Artifact Registry repo in `dev`.
- [x] Provision Artifact Registry repo in `prod`.
- [x] Ensure CI can push images.

### 6.3 Cloud Run setup

- [x] Define Cloud Run service in Terraform.
- [x] Set CPU/memory defaults.
- [x] Set concurrency.
- [x] Set min/max instances.
- [x] Configure env vars.
- [x] Mount or access secrets cleanly.
- [x] Set ingress policy.
- [x] Decide public vs authenticated API access for demo phase.

### 6.4 API smoke checks

- [x] `/health` returns success in `dev`.
- [x] `/health` returns success in `prod`.
- [x] Example demo endpoint deploys cleanly.
- [x] Logs appear in Cloud Logging.

### Section 6 status notes

- `apps/api` is now a real HTTP service instead of a console-only scaffold.
- Live API routes now include:
  - `GET /health`
  - `GET /`
  - `POST /api/demo/payment-exception-review/run`
- The API listens on `process.env.PORT` with a fallback of `8080`, which matches the Cloud Run container port configuration.
- Public demo-phase API access is now the chosen bootstrap posture. Cloud Run ingress is `INGRESS_TRAFFIC_ALL`, unauthenticated invocation is enabled, and the service emits permissive CORS headers for bootstrap demo use.
- `apps/api/Dockerfile` now builds the monorepo API service image from the repo root, and the existing root `.dockerignore` already covers local env files, node modules, build output, Terraform artifacts, Firebase logs, and local credentials.
- Root workspace scripts were corrected to quote pnpm filter globs so Linux/CI shells build the workspaces correctly instead of expanding the filters unexpectedly.
- Artifact Registry repos now exist in both projects:
  - `us-central1-docker.pkg.dev/portfolio-tq-dev/portfolio-tq-api`
  - `us-central1-docker.pkg.dev/portfolio-tq-prod/portfolio-tq-api`
- The current bootstrap image tag deployed to both environments is `portfolio-tq-api:firestore-v1`.
- Cloud Build was used for remote image builds because the local Docker daemon was not available from this environment. To make that work, the project default compute service accounts needed:
  - bucket-level `roles/storage.objectViewer` on the autogenerated `*_cloudbuild` buckets
  - project-level `roles/artifactregistry.writer`
  - project-level `roles/logging.logWriter`
- The current image-build path now works, but future CI/CD hardening should revisit the use of the project default compute service accounts and consider a dedicated builder identity or direct GitHub OIDC push flow.
- Runtime service accounts now exist for both environments:
  - `portfolio-api-runtime-dev@portfolio-tq-dev.iam.gserviceaccount.com`
  - `portfolio-api-runtime-prod@portfolio-tq-prod.iam.gserviceaccount.com`
- Runtime services currently access Secret Manager cleanly through the non-sensitive `vertex-ai-location` secret, which now has an initial version in both projects. The optional `demo-access-gate` secret still has no value/version and is intentionally not wired into the Cloud Run service yet.
- Cloud Run services now exist and are healthy in both environments:
  - `portfolio-tq-api-dev` -> `https://portfolio-tq-api-dev-twgxaiygta-uc.a.run.app`
  - `portfolio-tq-api-prod` -> `https://portfolio-tq-api-prod-gl2p3fjrxa-uc.a.run.app`
- Live verification completed successfully on April 12, 2026 with:
  - `pnpm --filter @portfolio-tq/api build`
  - `pnpm --filter @portfolio-tq/api lint`
  - `pnpm typecheck`
  - `gcloud builds submit . --config=cloudbuild.api.yaml ...` in both projects
  - targeted Terraform applies for Artifact Registry, runtime service accounts, and Cloud Run services in both environments
  - `pnpm smoke:api:dev`
  - `pnpm smoke:api:prod`
  - `gcloud logging read` queries confirming `demo.run.completed` events in both projects
- No user-manual execution was required to complete section 6 from this environment.

---

## 7. Firestore, seed data, and indexes

Reference docs:

- `docs/specs/technical-spec-overall.md`
- `docs/architecture/observability-and-dashboards.md`
- `docs/specs/service-api.md`

### 7.1 Data model initialization

- [x] Define initial collections:
  - [x] `projects`
  - [x] `runs`
  - [x] `toolInvocations`
  - [x] `evaluations`
  - [x] `escalations`
  - [x] `promptVersions`
  - [x] `documents`
  - [x] `cases`
  - [x] `users`
  - [x] `accessCodes`
- [x] Define initial indexes needed for dashboard queries.
- [x] Represent indexes in Terraform or exportable config.

### 7.2 Seed data path

- [x] Create seed script location.
- [x] Define seed command for `dev`.
- [x] Keep `prod` seed strategy intentional and minimal.
- [x] Seed minimal project metadata.
- [x] Seed example case data.
- [x] Seed prompt versions.

### 7.3 Firestore smoke checks

- [x] Seed script runs in `dev`.
- [x] Web or API can read seeded `projects` collection.
- [x] Dashboard query path works with seed data.

### Section 7 status notes

- Shared Firestore collection names and record shapes now live in `packages/types`, covering `projects`, `runs`, `toolInvocations`, `evaluations`, `escalations`, `promptVersions`, `documents`, `cases`, `users`, and `accessCodes`.
- Synthetic, public-safe seed payloads now live under `data/seed/**`. They are intentionally fake bootstrap records only; no secret values, real user data, or live access codes are stored in the repo.
- `firestore.rules` should stay locked down by default. The bootstrap-era open client rule is no longer acceptable as the working baseline for this public repo.
- A guarded dev-only seed path now exists:
  - script: `apps/api/scripts/seed-firestore-dev.ts`
  - root command: `pnpm seed:firestore:dev`
- The seed command refuses to run unless both the project ID and Firestore database ID end with `-dev`, which keeps the prod seed strategy intentionally minimal.
- `dev` was seeded successfully on April 12, 2026 with:
  - 4 `projects`
  - 5 `runs`
  - 5 `toolInvocations`
  - 4 `evaluations`
  - 1 `escalations`
  - 4 `promptVersions`
  - 3 `documents`
  - 4 `cases`
  - 2 `users`
  - 1 synthetic `accessCodes` metadata record
- `prod` was intentionally left unseeded. Live verification of `GET /api/projects` on `portfolio-tq-prod` returned an empty list, which matches the intended minimal prod posture for now.
- Initial dashboard-facing indexes are now represented in both Terraform and exportable config:
  - Terraform source of truth: `infra/terraform/environments/{dev,prod}/main.tf`
  - exportable review file: `firestore.indexes.json`
- Terraform targeted applies completed successfully for both projects to:
  - grant `roles/datastore.user` to the runtime service accounts
  - grant `roles/datastore.indexAdmin` to the deploy service accounts
  - create the initial Firestore composite indexes
  - roll the API to image tag `portfolio-tq-api:firestore-v1`
- The API now exposes Firestore-backed read routes:
  - `GET /api/projects`
  - `GET /api/runs`
  - `GET /api/evaluations`
  - `GET /api/projects/:projectId/metrics`
- Development reminder:
  - expect direct client-side Firestore access to fail unless a feature has been given an explicit narrow rule
  - prefer backend API / Cloud Run / service-account-backed access for sensitive and operational data
  - when a future feature really needs client Firestore access, add only the smallest collection/path rule required and document why
- Live verification completed successfully on April 12, 2026 with:
  - `pnpm install`
  - `pnpm build`
  - `pnpm lint`
  - `pnpm typecheck`
  - `terraform fmt -recursive infra/terraform`
  - `terraform validate` in both environments
  - `gcloud builds submit . --config=cloudbuild.api.yaml ...` in both projects for image tag `firestore-v1`
  - targeted Terraform applies for Firestore IAM/index resources and Cloud Run updates in both environments
  - `pnpm seed:firestore:dev`
  - `pnpm smoke:api:dev`
  - `pnpm smoke:api:prod`
  - `pnpm smoke:firestore:dev`
- Follow-up note:
  - full untargeted `terraform plan` in both environments still shows pending section 8 resources (`logging_metrics` and `monitoring_dashboard`) plus an existing Cloud Run scaling normalization diff, so this pass completed section 7 without claiming the broader environment plans are fully converged yet.

---

## 8. Observability foundation

Reference docs:

- `docs/architecture/observability-and-dashboards.md`
- `docs/specs/service-api.md`
- `docs/specs/service-web.md`

### 8.1 Logging standard

- [x] Implement structured logging fields:
  - [x] `projectId`
  - [x] `runId`
  - [x] `environment`
  - [x] `eventType`
  - [x] `timestamp`
  - [x] optional `latencyMs`
  - [x] optional `promptVersionId`
- [x] Add run lifecycle log helper.
- [x] Add error log helper.

### 8.2 Cloud metrics and dashboards

- [x] Terraform module provisions at least one Cloud Monitoring dashboard.
- [x] Add log-based metric for fallback count or run failures.
- [x] Add latency chart widget.
- [x] Add error count widget.
- [x] Add request count widget.

### 8.3 In-app observability readiness

- [x] Define API endpoint(s) for dashboard feed.
- [x] Confirm `runs` and `evaluations` can feed the web app.
- [x] Ensure at least one sample run can be rendered end to end.

### 8.4 Observability smoke checks

- [x] API request creates logs.
- [x] Cloud Run dashboard shows traffic.
- [x] In-app observability page can load seeded metrics.

### Section 8 status notes

- Structured API logging is now implemented through `apps/api/src/services/logs.ts` and is used by the live demo route in `apps/api/src/index.ts`.
- Verified structured log fields now present in Cloud Logging for both environments:
  - required fields: `projectId`, `runId`, `environment`, `eventType`, `timestamp`
  - optional fields when applicable: `latencyMs`, `promptVersionId`
  - additional public-safe context now included for some events, such as `fallbackTriggered`, `evaluationStatus`, `toolName`, `confidence`, `estimatedCostUsd`, and `persistedToFirestore`
- Verified lifecycle events in both projects on April 12, 2026 by issuing controlled demo requests and reading the resulting Cloud Run logs:
  - `run.created`
  - `run.started`
  - `model.requested`
  - `tool.called`
  - `tool.completed`
  - `model.completed`
  - `schema.validated`
  - `fallback.triggered`
  - `escalation.created`
  - `run.completed`
- Error logging is now centralized through the same helper so request failures emit structured `ERROR` entries rather than ad hoc strings.
- Terraform-backed Monitoring resources are now applied in both environments:
  - `portfolio_tq dev overview` -> `projects/932345783663/dashboards/39e77f9e-f33b-4520-975d-11fed2dbbc82`
  - `portfolio_tq prod overview` -> `projects/723738590534/dashboards/48c02f0a-2476-4b84-aeb6-944bcc3e9944`
- Terraform-backed log-based metrics now exist in both environments:
  - `fallback-triggered`
  - `run-failures`
- The current dashboard JSON now includes:
  - request count chart
  - p95 request latency chart
  - error count chart
  - fallback-triggered chart
  - recent error logs panel
- In-app observability feed routes now exist and are live:
  - `GET /api/observability/overview`
  - `GET /api/projects`
  - `GET /api/runs`
  - `GET /api/evaluations`
  - `GET /api/projects/:projectId/metrics`
- The web route `/observability` now ships a live source-controlled observability shell that reads the correct environment API based on hostname and renders:
  - summary metrics
  - project breakdown
  - latest flagged runs
- Live verification completed successfully on April 12, 2026 with:
  - `pnpm install`
  - `pnpm build`
  - `pnpm lint`
  - `pnpm typecheck`
  - `terraform fmt -recursive infra/terraform`
  - `terraform -chdir=infra/terraform/environments/dev validate`
  - `terraform -chdir=infra/terraform/environments/prod validate`
  - targeted Terraform applies for `module.cloud_run_service`, `module.logging_metrics`, and `module.monitoring_dashboard` in both environments
  - `pnpm seed:firestore:dev`
  - `pnpm smoke:api:dev`
  - `pnpm smoke:api:prod`
  - `pnpm deploy:web:dev`
  - `pnpm deploy:web:prod`
  - `pnpm smoke:web:dev`
  - `pnpm smoke:web:prod`
  - `pnpm smoke:observability:web:dev`
  - `pnpm smoke:observability:web:prod`
- Cloud Run request traffic was also verified directly through the Monitoring API over the prior 30 minutes on April 12, 2026:
  - `portfolio-tq-api-dev` showed nonzero `run.googleapis.com/request_count` points on revisions `portfolio-tq-api-dev-00002-sdb` and `portfolio-tq-api-dev-00003-5v9`
  - `portfolio-tq-api-prod` showed nonzero `run.googleapis.com/request_count` points on revisions `portfolio-tq-api-prod-00002-d5s` and `portfolio-tq-api-prod-00003-229`
- The observability smoke script was tightened so it verifies the public `/observability` shell plus the live dashboard API response without depending on browser-only module-script execution in `jsdom`.
- During verification, `https://portfolio-tq-dev.web.app` briefly served an older `404` release. Rerunning `pnpm deploy:web:dev` corrected it. This was a deploy-state issue, not a code issue.
- No manual user step was required to complete section 8 from this environment.
- Known follow-up note:
  - `prod` remains intentionally sparse in the in-app observability feed because `portfolio-tq-prod` is still intentionally unseeded outside of explicit demo-run traffic

---

## 9. GitHub Actions workflows

Reference docs:

- `docs/architecture/iac-and-cicd.md`
- `docs/specs/service-web.md`
- `docs/specs/service-api.md`

### 9.1 Workflow files

- [x] Create CI workflow for PRs.
- [x] Create deploy workflow for `dev` branch.
- [x] Create deploy workflow for `main` branch.
- [x] Optionally create Terraform plan workflow for PR comments/artifacts.

### 9.2 PR CI jobs

- [x] checkout
- [x] install dependencies
- [x] cache package manager deps
- [x] lint
- [x] typecheck
- [x] unit tests if present
- [x] web build
- [x] api build
- [x] terraform fmt check
- [x] terraform validate

### 9.3 Dev deploy workflow

Triggered from `dev` branch.

- [x] authenticate to GCP with OIDC
- [x] run Terraform plan/apply for `dev` as appropriate
- [x] build web
- [x] deploy web to Firebase `dev`
- [x] build container image
- [x] push to Artifact Registry `dev`
- [x] deploy API to Cloud Run `dev`
- [x] run smoke check(s)

### 9.4 Prod deploy workflow

Triggered from `main` branch.

- [x] authenticate to GCP with OIDC
- [x] run Terraform plan/apply for `prod`
- [x] build web
- [x] deploy web to Firebase `prod`
- [x] build container image
- [x] push to Artifact Registry `prod`
- [x] deploy API to Cloud Run `prod`
- [x] run smoke check(s)

### 9.5 Workflow quality

- [x] Use concurrency control to avoid overlapping deploys.
- [x] Use environment-scoped variables.
- [x] Publish useful artifacts for failures where appropriate.
- [x] Keep logs readable for public-review value.

### Section 9 status notes

- Workflow files now exist under `.github/workflows/`:
  - `ci.yml`
  - `infra-plan.yml`
  - `deploy-dev.yml`
  - `deploy-prod.yml`
- PR/push CI now runs on pushes to `dev`, pull requests to `main`, and manual dispatch, and includes:
  - checkout
  - Node + pnpm setup with cache
  - install
  - lint
  - typecheck
  - test
  - web build
  - API build
  - Terraform fmt
  - Terraform init + validate for `dev` and `prod`
- `infra-plan.yml` now runs on `dev` pushes that touch `infra/**`, pull requests to `main` that touch `infra/**`, and manual dispatch.
- The infra-plan workflow uploads the `dev` plan artifact on `dev` pushes and `dev` + `prod` plan artifacts on same-repository PRs.
- The infra-plan workflow is intentionally limited to same-repository PRs for cloud-authenticated pull-request plan execution so the repo does not attempt cloud-authenticated plan jobs for untrusted fork PRs.
- Branch deploy workflows now exist for both environments:
  - `dev` branch -> `deploy-dev.yml`
  - `main` branch -> `deploy-prod.yml`
- Both deploy workflows use GitHub OIDC through `google-github-actions/auth` and the existing environment-scoped variables:
  - `GCP_PROJECT_ID`
  - `GCP_PROJECT_NUMBER`
  - `FIREBASE_PROJECT_ALIAS`
  - `FIREBASE_SITE_ID`
  - `FIRESTORE_DATABASE_ID`
  - `GCP_WORKLOAD_IDENTITY_PROVIDER`
  - `GCP_DEPLOY_SERVICE_ACCOUNT`
  - shared repo vars `GCP_REGION` and `FIRESTORE_LOCATION`
- The deploy workflows now:
  - build and push the API image directly from the GitHub runner to Artifact Registry using OIDC-backed Google auth
  - run Terraform plan/apply with `cloud_run_container_image` overridden to the commit-specific image URI
  - deploy the web app to the environment-specific Firebase Hosting site
  - run public smoke checks after deployment
- `dev` deploy smoke coverage currently includes:
  - `pnpm smoke:web:dev`
  - `pnpm smoke:observability:web:dev`
  - `pnpm smoke:api:dev`
  - `pnpm smoke:firestore:dev`
- `prod` deploy smoke coverage currently includes:
  - `pnpm smoke:web:prod`
  - `pnpm smoke:observability:web:prod`
  - `pnpm smoke:api:prod`
- Workflow quality measures now in place:
  - concurrency groups prevent overlapping `dev` and `prod` deploys
  - environment-scoped variables are used for cloud project, Firebase alias/site, Firestore DB, workload identity provider, and deploy service account
  - Terraform plan text is uploaded as an artifact in both PR plan and branch deploy workflows
  - step summaries are written to keep public logs readable
- Local verification completed successfully on April 12, 2026 with:
  - `npx prettier --check .github/workflows/*.yml`
  - repository/environment variable inspection via `gh variable list`
  - Actions availability verification via `gh api repos/thinkquant/portfolio_tq/actions/permissions`
  - environment existence verification via `gh api repos/thinkquant/portfolio_tq/environments`
- Important limitation:
  - I could not execute these workflows end to end from this local-only state because GitHub cannot run uncommitted workflow files. A commit pushed to `dev` or `main`, or a manual dispatch after commit, is required to fully verify live GitHub Actions execution.
- Manual follow-up recommended after the first successful CI run:
  - update branch protection / rulesets so the real CI check name is required on `main` and `dev`
- Current branch-rule observation from GitHub on April 12, 2026:
  - GitHub Actions is enabled for the repo
  - `dev` and `prod` environments exist
  - only one active repository ruleset is currently visible via API: `protect_main`

---

## 10. Repository standards for public showcase value

Reference docs:

- `docs/specs/technical-spec-overall.md`
- `docs/specs/service-web.md`
- `docs/checklists/master-checklist.md`

### 10.1 Public development visibility

- [x] Keep commits small enough to tell the build story.
- [x] Write meaningful commit messages.
- [x] Use issues or milestone notes for major setup phases.
- [x] Keep docs updated when infra decisions change.

### 10.2 Setup visibility pages

- [x] Add `/repo-workflow` page in the web app later.
- [x] Add architecture diagram placeholders early.
- [x] Add README section describing branch strategy and environments.

### Section 10 status notes

- Current commit history continues to tell the initialization story in section-sized steps rather than one opaque bulk drop. Verified recent commits on April 12, 2026 include:
  - `Section 9 GitHub Actions workflows of iac-cicd init checklist complete.`
  - `Section 8, observability foundation of iac-cicd init checklist complete.`
  - `iac-cicd init checklist section 7 completed.`
  - `iac-cicd init checklist section 6 complete.`
  - `implemented iac-cicd init checklist section 5.`
- The current commit messages are readable and meaningful enough for a public reviewer to follow the bootstrap story, even though future commits should continue aiming for narrow, single-purpose scope.
- Public GitHub tracking is now in place for the initialization phase:
  - milestone: `IaC + CI/CD Initialization`
  - issue: `#1 Track initialization milestone close-out`
- Additional public labels were added for future showcase-facing tracking:
  - `showcase`
  - `architecture`
- Docs were updated again in this pass so repo-facing explanations stay aligned with the implementation:
  - `README.md`
  - `docs/architecture/system-architecture.md`
  - this initialization checklist
- `/repo-workflow` already exists in the web shell and now explicitly surfaces:
  - branch and environment strategy
  - CI/CD pipeline summary
  - frontend env strategy
  - Terraform/public-workflow rationale
- Architecture diagram placeholders now exist early in `docs/architecture/system-architecture.md` for:
  - runtime architecture
  - delivery pipeline
  - data and observability flow
- `README.md` now explicitly names the environment mapping:
  - `dev` -> `portfolio-tq-dev`
  - `prod` -> `portfolio-tq-prod`
  - and notes that the issue tracker/milestone are used for follow-up verification and showcase cleanup
- Local verification completed successfully on April 12, 2026 with:
  - `pnpm --filter @portfolio-tq/web build`
  - `pnpm lint`
  - `pnpm typecheck`
  - direct inspection of the generated `apps/web/dist/repo-workflow/index.html`
  - GitHub issue, label, and milestone verification through `gh`
- No manual user step was required to complete section 10 from this environment.

---

## 11. Final initialization verification

### 11.1 Local verification

- [x] `pnpm install` works from clean clone.
- [x] `pnpm lint` passes.
- [x] `pnpm typecheck` passes.
- [x] `pnpm build` passes.
- [x] Terraform fmt/validate pass.

### 11.2 Dev environment verification

- [x] Terraform plan/apply succeeds for `dev`.
- [x] Web deploy succeeds for `dev`.
- [x] API deploy succeeds for `dev`.
- [x] Firestore accessible in `dev`.
- [x] Cloud logs visible in `dev`.
- [x] One smoke request completes and is logged.

### 11.3 Prod environment verification

- [x] Terraform plan/apply succeeds for `prod`.
- [x] Web deploy succeeds for `prod`.
- [x] API deploy succeeds for `prod`.
- [x] Firestore accessible in `prod`.
- [x] Cloud logs visible in `prod`.
- [x] One smoke request completes and is logged.

### 11.4 GitHub verification

- [ ] PR CI runs successfully.
- [x] Push to `dev` triggers `dev` deploy.
- [ ] Merge to `main` triggers `prod` deploy.
- [ ] Branch protections enforce intended flow.

### Section 11 status notes

- Local verification completed successfully on April 12, 2026 with:
  - `pnpm install --frozen-lockfile`
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm build`
  - `terraform fmt -check -recursive infra/terraform`
  - `terraform -chdir=infra/terraform/environments/dev validate -no-color`
  - `terraform -chdir=infra/terraform/environments/prod validate -no-color`
- The "clean clone" install check was verified from a clean temporary copy of the current working tree with generated artifacts removed before running `pnpm install --frozen-lockfile`. A fresh remote clone was not used because the current section 10 and section 11 changes are still local at this point.
- The root `pnpm build` pass required one repo-local fix during this verification pass: the root recursive build script now runs with `--workspace-concurrency=1`, which avoids a Windows build failure while keeping the same package build coverage.
- Full Terraform verification completed successfully on April 12, 2026 with:
  - `terraform -chdir=infra/terraform/environments/dev init -input=false`
  - `terraform -chdir=infra/terraform/environments/dev plan -input=false -no-color`
  - `terraform -chdir=infra/terraform/environments/dev apply -input=false -auto-approve`
  - `terraform -chdir=infra/terraform/environments/prod init -input=false`
  - `terraform -chdir=infra/terraform/environments/prod plan -input=false -no-color`
  - `terraform -chdir=infra/terraform/environments/prod apply -input=false -auto-approve`
- The current Terraform applies still show recurring provider/API normalization drift on:
  - Cloud Run scaling fields (`manual_instance_count` / `min_instance_count`)
  - Monitoring dashboard JSON layout fields
  - These did not block successful plan/apply during this pass, but they should be cleaned up later so future plans stay quieter.
- Live environment verification completed successfully on April 12, 2026 with:
  - `pnpm smoke:web:dev`
  - `pnpm smoke:web:prod`
  - `pnpm smoke:observability:web:dev`
  - `pnpm smoke:observability:web:prod`
  - `pnpm smoke:api:dev`
  - `pnpm smoke:api:prod`
  - `pnpm smoke:firestore:dev`
- Additional direct API verification during this pass confirmed:
  - `POST https://portfolio-tq-api-dev-twgxaiygta-uc.a.run.app/api/demo/payment-exception-review/run` returned a completed run `payment-exception-review-fd2e5e9f-5585-4d65-8bb9-0e7a31bc8cf2`
  - `POST https://portfolio-tq-api-prod-gl2p3fjrxa-uc.a.run.app/api/demo/payment-exception-review/run` returned a completed run `payment-exception-review-ae377d81-93d0-436f-a71b-aec09e1a833b`
  - `GET https://portfolio-tq-api-prod-gl2p3fjrxa-uc.a.run.app/api/projects` returned `200` with an empty list, which is expected because `prod` remains intentionally unseeded
- Cloud Logging verification during this pass confirmed visible `run.completed` and `request.completed` entries in both projects for the run IDs above, with `persistedToFirestore: true`.
- GitHub verification is only partially complete as of April 12, 2026:
  - the latest real `Deploy Dev` workflow run on push to `dev` was observed at `https://github.com/thinkquant/portfolio_tq/actions/runs/24318866127`
  - that run confirmed the remote `dev` branch is now using the updated pnpm bootstrap in the deploy workflow, because the web job got through setup/install and failed later inside `pnpm deploy:web:dev`
  - the web job now fails on GitHub because the deploy script only builds `@portfolio-tq/web` itself, while the clean runner also needs the workspace dependency builds that `apps/web` imports from `packages/*`; that was fixed locally in this pass by changing the web deploy script to build `@portfolio-tq/web...`
  - the same run still failed in the Terraform plan job even after the deploy-service-account role bootstrap was added; live project IAM now shows the broadened role set is present, but a fresh rerun is still needed to confirm the workflow can successfully use those permissions end to end
  - PR CI success and a successful rerun of the `dev` deploy flow are therefore still not verified from GitHub
  - `main` does not yet expose the workflow files through the GitHub contents API, so merge-to-`main` -> `prod` deploy is not yet verifiable
  - GitHub repository protections improved during this pass:
    - `protect_dev` ruleset now blocks deletion and force-push-style non-fast-forward updates on `dev`
    - `prod` environment now requires manual approval from `thinkquant`
  - branch protections still do not enforce the full intended CI flow end to end because `main` does not yet require CI status checks
- Manual follow-up still required after these local changes are committed:
  - push the workflow fixes to `dev`
  - rerun or trigger GitHub Actions so `ci` and `deploy-dev` can be verified successfully
  - merge the workflow files to `main` so `deploy-prod` can be exercised from the stable branch
  - update GitHub rulesets / branch protection so `dev` is protected and the real CI check names are required on both `dev` and `main`

---

## 12. CI/CD implementation and activation

Reference docs:

- `docs/architecture/iac-and-cicd.md`
- `docs/checklists/build-checklist-definition-of-done.md`
- `docs/specs/technical-spec-overall.md`
- `README.md`

Goal:

- complete CI/CD setup before real feature development
- enforce automated verification on every push to `dev`
- enforce clean milestone promotion from `dev` to `main`
- separate CI from deploy until deploy credentials and environments are fully wired

### 12.1 CI/CD design decisions

- [x] Confirm GitHub Actions is the CI/CD platform for this repository.
- [x] Confirm `.github/workflows/` will hold all workflow YAML files.
- [x] Confirm branch strategy:
  - [x] `dev` = active integration branch
  - [x] `main` = stable milestone branch
- [x] Confirm environment strategy:
  - [x] `dev` branch maps to `portfolio-tq-dev`
  - [x] `main` branch maps to `portfolio-tq-prod`
- [x] Confirm initial deployment policy:
  - [x] CI runs automatically now
  - [x] Terraform apply remains controlled
  - [x] app deploy remains controlled until credentials and environments are fully configured
- [x] Confirm merge policy:
  - [x] all work lands in `dev`
  - [x] milestone-ready work is merged from `dev` to `main`
  - [x] `main` should never be used as a daily working branch

### 12.2 Required GitHub repository settings

- [x] Confirm Actions are enabled for the repository.
- [x] Confirm GitHub Pages is not being used for this project.
- [x] Confirm repository visibility is public.
- [x] Add repository secrets only if immediately required.
- [x] Add repository variables only if immediately required.
- [x] Create GitHub Environments:
  - [x] `dev`
  - [x] `prod`
- [x] Add environment protection rules:
  - [x] `dev` = no manual approval required
  - [x] `prod` = manual approval required before deploy/apply jobs later
- [ ] Update branch protection on `main`:
  - [x] require PR before merge
  - [ ] require CI status checks
  - [ ] require branch to be up to date before merge
  - [x] disable force push
  - [x] disable deletion
- [ ] Update branch handling on `dev`:
  - [ ] CI must run on push to `dev`
  - [x] force push disabled
  - [x] PRs optional for solo work, but CI must stay green

### 12.3 Workflow files to create

Create these files under `.github/workflows/`:

- [x] `ci.yml`
- [x] `infra-plan.yml`
- [x] `deploy-dev.yml` placeholder or real workflow
- [x] `deploy-prod.yml` placeholder or real workflow

Notes:

- `ci.yml` is mandatory now.
- `infra-plan.yml` is mandatory now.
- deploy workflows may begin as placeholders if OIDC / secrets / environment gating are not finished yet.

### 12.4 Implement `ci.yml`

Purpose:

- run automated verification on every push to `dev`
- run automated verification on every PR to `main`

Trigger rules:

- [x] trigger on push to `dev`
- [x] trigger on pull request to `main`

Jobs to include:

- [x] checkout repository
- [x] setup Node using repo-pinned version
- [x] setup pnpm
- [x] install dependencies
- [x] restore/cache pnpm store if desired
- [x] run `pnpm lint`
- [x] run `pnpm typecheck`
- [x] run `pnpm test`
- [x] run `pnpm build`

Success criteria:

- [ ] workflow passes on current repo state
- [ ] workflow appears in GitHub Actions tab
- [ ] workflow status is visible on commits/PRs
- [x] workflow name is stable and readable, e.g. `ci`

### 12.5 Implement `infra-plan.yml`

Purpose:

- validate Terraform changes continuously before any apply step is introduced

Trigger rules:

- [x] trigger on push to `dev` when files under `infra/**` change
- [x] trigger on pull request to `main` when files under `infra/**` change

Jobs to include:

- [x] checkout repository
- [x] setup Terraform
- [x] run `terraform fmt -check -recursive infra/terraform`
- [x] run `terraform init` for `infra/terraform/environments/dev`
- [x] run `terraform validate` for `infra/terraform/environments/dev`
- [x] run `terraform plan` for `infra/terraform/environments/dev`
- [x] add prod validation/plan later if safe and credentials are ready
- [x] artifact or log output should make failures understandable

Rules:

- [x] do not auto-apply in this workflow yet
- [x] do not target prod apply from initialization-phase CI
- [x] keep planning safe, readable, and deterministic

Success criteria:

- [ ] workflow passes against current Terraform scaffold
- [x] Terraform formatting issues fail the workflow
- [x] invalid Terraform fails the workflow
- [ ] plan runs successfully for dev

### 12.6 Implement deployment workflow placeholders

Purpose:

- make the intended CD path explicit before live deployment is activated

For `deploy-dev.yml`:

- [x] create file
- [x] add trigger comments or disabled trigger
- [ ] document intended future flow:
  - [x] auth to GCP via GitHub OIDC
  - [x] optional Terraform apply to dev
  - [x] deploy web app to Firebase Hosting dev project
  - [x] deploy API to Cloud Run dev project

For `deploy-prod.yml`:

- [x] create file
- [x] add trigger comments or disabled trigger
- [ ] document intended future flow:
  - [x] PR/merge gated from `main`
  - [x] auth to GCP via GitHub OIDC
  - [x] Terraform plan/apply for prod with approval gate
  - [x] deploy web app to Firebase Hosting prod project
  - [x] deploy API to Cloud Run prod project

- even if CD is not active yet, the structure should already exist.

### 12.7 Local developer workflow requirements

Before every push to `dev`, run locally:

- [x] `pnpm lint`
- [x] `pnpm typecheck`
- [x] `pnpm test`
- [x] `pnpm build`

Rules:

- [x] local checks do not replace GitHub CI
- [x] GitHub CI is the public source of truth
- [x] do not push knowingly broken builds to `dev`

### 12.8 GitHub Actions quality standards

- [x] workflow names are readable
- [x] step names are readable
- [x] no hard-coded secrets in YAML
- [x] no project credentials committed to repo
- [x] workflows fail loudly and clearly
- [x] workflow files are formatted and commented where useful
- [x] path filters are used where appropriate
- [ ] CI remains fast enough for active development

### 12.9 Status checks and enforcement

After `ci.yml` is passing:

- [ ] add `ci` as a required status check on `main`
- [ ] add `infra-plan` as a required status check on `main` once stable
- [x] optionally require `ci` on `dev` through branch protection or team discipline
- [ ] verify PR to `main` is blocked when CI fails

### 12.10 Visibility and public proof-of-work

- [x] confirm Actions tab is publicly visible on the repo
- [x] confirm workflow run history is visible
- [ ] confirm commit history shows CI activity
- [x] confirm repo demonstrates real engineering discipline, not just code volume

### 12.11 Definition of done for CI/CD initialization

CI/CD initialization is complete when:

- [ ] `.github/workflows/ci.yml` exists and passes
- [ ] `.github/workflows/infra-plan.yml` exists and passes
- [x] deploy workflow placeholders or real deploy workflows exist
- [ ] pushes to `dev` automatically run CI
- [ ] PRs to `main` automatically run CI
- [ ] `main` requires CI status checks before merge
- [x] no secrets are hard-coded in workflow files
- [x] local workflow and branch workflow are documented
- [ ] the repo is ready to begin real feature development under enforced automated verification

### Section 12 status notes

- GitHub Actions is the confirmed CI/CD platform for this repository, and `.github/workflows/` remains the single source location for workflow YAML files.
- Local workflow structure was tightened again in this pass:
  - `ci.yml` now targets pushes to `dev`, pull requests to `main`, and manual dispatch
  - `terraform-plan.yml` was renamed to `infra-plan.yml`
  - `infra-plan.yml` now targets `dev` pushes affecting `infra/**`, pull requests to `main` affecting `infra/**`, and manual dispatch
  - `infra-plan.yml` now includes Terraform fmt + validate before plan
- GitHub currently shows a mixed activation state:
  - the remote `dev` branch now includes the updated `ci.yml` and pnpm-fixed deploy workflows
  - GitHub's workflow registry still only exposes `Deploy Dev`, which is consistent with `main` still lacking the workflow files
  - the `infra-plan.yml` rename plus the latest clean-runner fixes are still local and unpushed
- Verified live GitHub repository settings on April 12, 2026:
  - Actions enabled: yes
  - GitHub Pages in use: no
  - Repository visibility: public
  - Repo vars remain minimal: `GCP_REGION`, `FIRESTORE_LOCATION`
  - GitHub environments exist: `dev`, `prod`
  - `dev` environment has no manual approval gate
  - `prod` environment now requires manual approval from `thinkquant`
  - active repository rulesets now visible via API:
    - `protect_main`
    - `protect_dev`
- Verified live branch/ruleset posture on April 12, 2026:
  - `protect_main` currently requires pull requests and blocks deletion/non-fast-forward updates on the default branch
  - `protect_dev` now blocks deletion and non-fast-forward updates on `dev`
  - `main` still does not require CI status checks
  - `main` still does not require the branch to be up to date before merge because required status checks are not configured yet
- Verified deploy-environment bootstrap updates in this pass:
  - the deploy service accounts in both projects were granted additional bootstrap roles needed for full Terraform plan/apply from GitHub Actions:
    - `roles/iam.workloadIdentityPoolAdmin`
    - `roles/resourcemanager.projectIamAdmin`
    - `roles/secretmanager.admin`
    - `roles/logging.configWriter`
    - `roles/monitoring.editor`
  - those roles were also added to the Terraform environment definitions so future apply operations keep the role set aligned with the live bootstrap
- Section 11 remains only partially resolved from GitHub's perspective:
  - latest observed remote `dev` deploy run: `https://github.com/thinkquant/portfolio_tq/actions/runs/24318866127`
  - that run confirms the remote deploy workflow has the pnpm bootstrap fix, but it still fails later in web deploy and Terraform plan
  - the clean-runner web deploy issue is now fixed locally by making the web deploy script build `@portfolio-tq/web` together with its workspace dependencies
  - the deploy-service-account role bootstrap is now confirmed live in both projects, but a fresh rerun is still required to verify the GitHub Terraform job succeeds with those permissions
  - because of that, the remaining live activation items stay open until the next push:
    - `ci` run on push to `dev`
    - `ci` run on PR to `main`
    - `infra-plan` run on `infra/**` changes
    - successful rerun of `deploy-dev`
    - any verification of `deploy-prod`
    - required CI status checks on `main`
- Manual follow-up still required to finish section 12 end to end:
  - push the current local workflow changes so GitHub receives the new `infra-plan.yml` file plus the latest clean-runner fixes
  - rerun/observe the next `dev` push so `ci`, `infra-plan`, and `deploy-dev` can be verified live
  - merge the workflow files to `main` so PR-to-`main` CI and `deploy-prod` can be verified
  - after the first successful live runs, add required status checks for `ci` and then `infra-plan` on `main`
  - verify with a real PR that failed CI blocks merge to `main`

### 12.12 Post-initialization next step

After this section is complete:

- begin real development work on `dev`
- keep CI green throughout implementation
- introduce OIDC auth and real deployment workflows next, before first live dev deployment

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
