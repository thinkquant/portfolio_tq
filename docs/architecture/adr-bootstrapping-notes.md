# Bootstrap Notes

## Scope
This note records the manual and semi-manual bootstrap decisions that were necessary before Terraform and CI/CD can manage the rest of the stack.

## Repository identity
- GitHub repository: `thinkquant/portfolio_tq`
- Repo name uses an underscore: `portfolio_tq`
- Product-facing naming in docs may still use `portfolio-tq`, but repo-facing automation should treat `portfolio_tq` as canonical.
- Public repo rule: do not record secrets, sensitive operational values, or local-only credentials in docs, code comments, examples, or commit history.

## Environment and project mapping
- `dev`
  GCP project: `portfolio-tq-dev`
  Firebase project: `portfolio-tq-dev`
  Firebase alias: `dev`
- `prod`
  GCP project: `portfolio-tq-prod`
  Firebase project: `portfolio-tq-prod`
  Firebase alias: `prod`

## Hosting and release strategy
- This project does not use Firebase preview channels.
- Active development, testing, and preview-style validation happen by deploying to `portfolio-tq-dev`.
- Milestone releases are promoted to `portfolio-tq-prod`.
- This strategy matches the long-lived branch model: `dev` for integration and `main` for milestone-grade releases.

## Billing
- Billing is linked for both `portfolio-tq-dev` and `portfolio-tq-prod`.

## API bootstrap command
The initial API enablement command used for both projects was:

```powershell
gcloud services enable `
  serviceusage.googleapis.com `
  cloudresourcemanager.googleapis.com `
  iam.googleapis.com `
  iamcredentials.googleapis.com `
  sts.googleapis.com `
  run.googleapis.com `
  artifactregistry.googleapis.com `
  secretmanager.googleapis.com `
  firestore.googleapis.com `
  firebase.googleapis.com `
  firebasehosting.googleapis.com `
  aiplatform.googleapis.com `
  --project=<portfolio-tq-dev or portfolio-tq-prod>
```

## API verification snapshot
Verified on April 12, 2026:

- Both projects have `run.googleapis.com`, `artifactregistry.googleapis.com`, `secretmanager.googleapis.com`, `firestore.googleapis.com`, `firebase.googleapis.com`, `firebasehosting.googleapis.com`, `iamcredentials.googleapis.com`, `serviceusage.googleapis.com`, `cloudresourcemanager.googleapis.com`, `logging.googleapis.com`, `monitoring.googleapis.com`, and `aiplatform.googleapis.com` enabled.
- `cloudbuild.googleapis.com` is enabled on `portfolio-tq-prod`.
- The current planned deploy flow does not require Cloud Build in `dev`, because deploys are intended to run directly from GitHub Actions rather than through Cloud Build.

## Firestore bootstrap
- Firestore mode: Native
- Region: `nam5`
- Database IDs are environment-specific and match the project IDs:
  - `portfolio-tq-dev`
  - `portfolio-tq-prod`

## Firebase CLI availability
- Firebase tooling was installed through npm in the repo workspace.
- Agents and local automation should use `pnpm exec firebase` unless a global installation is intentionally preferred.

## Terraform remote state bootstrap
- Remote state backend strategy: one GCS bucket per environment, colocated with that environment's project.
- Dev backend bucket: `gs://portfolio-tq-dev-tfstate`
- Prod backend bucket: `gs://portfolio-tq-prod-tfstate`
- Both buckets were created in location `US`.
- Both buckets have uniform bucket-level access enabled.
- Both buckets have object versioning enabled.
- Both buckets have a lifecycle rule that deletes noncurrent object versions after 30 days.
- Terraform environments are configured to use the `gcs` backend with prefix `terraform/state`.

## Identity and CI/CD auth bootstrap
- GitHub Actions auth strategy: OIDC through Google Workload Identity Federation.
- Dev workload identity provider:
  - Pool: `projects/932345783663/locations/global/workloadIdentityPools/github-actions-dev`
  - Provider: `projects/932345783663/locations/global/workloadIdentityPools/github-actions-dev/providers/github-dev`
- Prod workload identity provider:
  - Pool: `projects/723738590534/locations/global/workloadIdentityPools/github-actions-prod`
  - Provider: `projects/723738590534/locations/global/workloadIdentityPools/github-actions-prod/providers/github-prod`
- Both providers restrict access to the GitHub repository `thinkquant/portfolio_tq`.
- Deploy service accounts:
  - `github-deploy-dev@portfolio-tq-dev.iam.gserviceaccount.com`
  - `github-deploy-prod@portfolio-tq-prod.iam.gserviceaccount.com`
- Deploy role set currently granted to each environment-specific service account:
  - `roles/run.admin`
  - `roles/artifactregistry.writer`
  - `roles/firebasehosting.admin`
  - `roles/secretmanager.secretAccessor`
  - `roles/iam.serviceAccountUser`
- No user-managed service account keys were created for these deploy service accounts.

## GitHub environments and variables bootstrap
- GitHub Environments created:
  - `dev`
  - `prod`
- Repo variables created:
  - `GCP_REGION`
  - `FIRESTORE_LOCATION`
- Environment variables created in both `dev` and `prod`:
  - `GCP_PROJECT_ID`
  - `GCP_PROJECT_NUMBER`
  - `FIREBASE_PROJECT_ALIAS`
  - `FIREBASE_SITE_ID`
  - `FIRESTORE_DATABASE_ID`
  - `GCP_WORKLOAD_IDENTITY_PROVIDER`
  - `GCP_DEPLOY_SERVICE_ACCOUNT`
- GitHub repository secrets and environment secrets were intentionally left empty at this stage.
- `prod` environment approvals were not configured yet.

## Secret Manager bootstrap
- Secret containers created in both projects:
  - `vertex-ai-location`
  - `demo-access-gate`
- No secret versions or values were created during bootstrap.
- Secret values must be populated manually later in Secret Manager and must never be committed to the public repository or copied into docs.

## Web Hosting bootstrap
- Firebase Hosting serves the static output from `apps/web/dist`.
- The web deployment path currently uses one live site per environment rather than preview channels.
- Deploy command pattern:
  - `pnpm deploy:web:dev`
  - `pnpm deploy:web:prod`
- Smoke check command pattern:
  - `pnpm smoke:web:dev`
  - `pnpm smoke:web:prod`
- Current frontend env strategy:
  - No runtime secrets are shipped to the client.
  - If future public frontend config is introduced, keep it explicitly public and build-time only.
  - Backend secrets remain in Secret Manager or CI/CD environment configuration, never in frontend source or docs.
- Live smoke checks were verified for `dev` and `prod` on `/`, `/projects`, `/projects/payment-exception-review`, and an unmatched route that exercises the rewrite behavior.
- Direct `/index.html` receives `Cache-Control: public, max-age=0, must-revalidate`, while rewritten `web.app` routes currently return `Cache-Control: max-age=3600`. If stricter HTML caching is needed later, re-check Firebase Hosting CDN behavior before assuming rewritten routes inherit the exact same header policy.

## Follow-up note for future infra work
- Current `firebase.json` still references the default Firestore database ID.
- When Firestore rules and indexes are automated, the Firebase/Terraform configuration should be revisited so it explicitly targets the named environment databases created during bootstrap.
- Firebase default hosting sites already exist outside Terraform. In this first-pass Terraform scaffold, the environment configs reference those existing site IDs without creating or importing them.
- Ignore files were strengthened early, but they still need to be reviewed whenever new local tooling, deploy flows, artifact types, or secret-handling patterns are introduced.
