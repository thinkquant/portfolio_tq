# IaC and CI/CD Spec

## Repo host recommendation
Use **GitHub**.

Reason:
- Standard GitHub-hosted runners are free for public repositories.
- GitLab.com Free hosted runners consume limited compute minutes for the namespace.

## Repository identity
- GitHub repo: `thinkquant/portfolio_tq`
- Repo-facing automation should use `portfolio_tq` as the canonical repository name.

## IaC principle
All cloud resources are provisioned through Terraform from the beginning.

## Public repo safety
- This repository is public, so docs, code comments, examples, and commit history must stay free of secrets and sensitive operational values.
- Never commit Terraform state, Terraform plans, real `.tfvars`, local env files, service account keys, or debug logs.
- Keep `terraform.tfvars.example`, never real `terraform.tfvars`.
- Before commits and before adding new tooling or deploy flows, review `.gitignore`, `.dockerignore`, and `.gcloudignore` so newly introduced local artifacts stay excluded.

## Environment mapping
- `dev`
  GCP project: `portfolio-tq-dev`
  Firebase project: `portfolio-tq-dev`
  Firebase alias: `dev`
- `prod`
  GCP project: `portfolio-tq-prod`
  Firebase project: `portfolio-tq-prod`
  Firebase alias: `prod`

## Firebase and deployment strategy
- Use separate Firebase/GCP projects for `dev` and `prod`.
- Do not use Firebase preview channels for this project.
- Use one live Hosting site per environment, with deploys going directly to `portfolio-tq-dev` for active validation and to `portfolio-tq-prod` for milestone-grade releases.
- Keep the Firebase Hosting config in the repo root `firebase.json`, with `apps/web/dist` as the deploy artifact directory.
- Keep HTML responses revalidating on each request while serving hashed static assets under `/assets/**` with long-lived immutable caching.
- The web app must never receive backend secrets. The current frontend build ships no runtime secrets; any future client-exposed values must be explicitly public, build-time only, and clearly named as such.
- Deploy active integration work and preview-style validation to `portfolio-tq-dev`.
- Deploy milestone releases to `portfolio-tq-prod`.
- Keep the branch-to-environment mapping simple:
  - `dev` branch -> `portfolio-tq-dev`
  - `main` branch -> `portfolio-tq-prod`

## Bootstrap record
- Billing is linked for both cloud projects.
- Firestore is already provisioned in Native mode in region `nam5`.
- Firestore database IDs are named per environment and match the project IDs, rather than using the default database ID.
- The detailed bootstrap record lives in `docs/architecture/adr-bootstrapping-notes.md`.

## Managed resources
- GCP project references (existing or manually created once)
- service accounts
- IAM bindings
- Firebase Hosting site config
- Cloud Run service for API
- Artifact Registry
- Firestore database/indexes
- Secret Manager secrets
- Monitoring dashboard
- log-based metrics
- GitHub OIDC workload identity integration

## Terraform directory pattern
- `infra/terraform/modules/*`
- `infra/terraform/environments/dev/*`
- `infra/terraform/environments/prod/*`

## Remote state strategy
- Use Google Cloud Storage as the Terraform backend.
- Keep state isolated per environment with one bucket per project:
  - `gs://portfolio-tq-dev-tfstate`
  - `gs://portfolio-tq-prod-tfstate`
- Use the backend prefix `terraform/state` in each environment.
- Enable bucket versioning and uniform bucket-level access on both state buckets.
- Apply a lifecycle rule that deletes noncurrent state object versions after 30 days.

## Ignore files to maintain
- `.gitignore` should continue blocking env files, `.local` files, Terraform state, `.tfvars`, `.tfplan`, `.terraform/`, Firebase debug logs, service-account key files, build output, `node_modules`, and IDE/system files.
- `.dockerignore` should exclude env files, git metadata, `node_modules`, build artifacts, logs, Terraform files not needed in images, Firebase debug logs, and local credentials.
- `.gcloudignore` is staged in advance for any future source-based `gcloud` deploy flow and should be reviewed if that path is introduced.

## CI strategy
### Pull requests
- install deps
- lint
- typecheck
- run unit tests
- run Terraform fmt/validate
- optionally build web + api

### Main branch
- run full CI
- deploy dev or prod depending on branch strategy
- use GitHub OIDC to auth to GCP
- no static service account keys committed or stored as long-lived GitHub secrets if avoidable

## Branch strategy
Keep simple:
- `main` = deployable public branch
- feature branches for work
- PRs required before merge once repo stabilizes

## Suggested free-friendly flow
- no Firebase preview channels
- deploy `dev` to `portfolio-tq-dev`
- deploy `main` to `portfolio-tq-prod`
- use the `dev` project as the active validation environment for ongoing work

## Base Terraform modules
- `artifact_registry`
- `cloud_run_service`
- `firebase_hosting`
- `firestore_indexes`
- `iam_service_account`
- `logging_metrics`
- `monitoring_dashboard`
- `github_oidc`
- `secrets`

## Definition of done
- `terraform fmt` clean
- `terraform validate` passes
- `main` deploy is automated
- no click-ops dependence beyond unavoidable initial project/bootstrap steps
