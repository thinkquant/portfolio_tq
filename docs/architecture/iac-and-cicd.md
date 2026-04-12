# IaC and CI/CD Spec

## Repo host recommendation
Use **GitHub**.

Reason:
- Standard GitHub-hosted runners are free for public repositories.
- GitLab.com Free hosted runners consume limited compute minutes for the namespace.

## IaC principle
All cloud resources are provisioned through Terraform from the beginning.

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
- preview builds locally, not paid preview infra
- deploy only `main`
- one dev environment optional; can initially use local dev + one prod GCP environment if cost or speed matters

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
