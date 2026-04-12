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
  - `roles/datastore.indexAdmin`
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

## API deployment bootstrap
- Artifact Registry repositories created:
  - `us-central1-docker.pkg.dev/portfolio-tq-dev/portfolio-tq-api`
  - `us-central1-docker.pkg.dev/portfolio-tq-prod/portfolio-tq-api`
- Cloud Run services created:
  - `portfolio-tq-api-dev` -> `https://portfolio-tq-api-dev-twgxaiygta-uc.a.run.app`
  - `portfolio-tq-api-prod` -> `https://portfolio-tq-api-prod-gl2p3fjrxa-uc.a.run.app`
- Demo-phase API access decision:
  - ingress stays public
  - unauthenticated invocation is enabled
  - bootstrap CORS policy is permissive for demo use
- Runtime service accounts created:
  - `portfolio-api-runtime-dev@portfolio-tq-dev.iam.gserviceaccount.com`
  - `portfolio-api-runtime-prod@portfolio-tq-prod.iam.gserviceaccount.com`
- The runtime service currently reads the non-sensitive `vertex-ai-location` secret from Secret Manager. An initial version was added in both projects so secret-backed env injection could be verified.
- `demo-access-gate` still has no secret version and is intentionally not wired into the Cloud Run service yet.
- API image build path currently uses `cloudbuild.api.yaml` and Cloud Build remote builds, publishing environment-specific images into each project's Artifact Registry repository.
- The current API image tag deployed to both environments is `portfolio-tq-api:firestore-v1`.
- Cloud Build in both projects currently runs as the default compute service account. To make remote image builds succeed, the bootstrap pass added:
  - bucket-level `roles/storage.objectViewer` on `gs://portfolio-tq-dev_cloudbuild` and `gs://portfolio-tq-prod_cloudbuild`
  - project-level `roles/artifactregistry.writer`
  - project-level `roles/logging.logWriter`
- This works, but it should be revisited later in favor of a more deliberate builder identity or a direct GitHub OIDC image-push path.

## Firestore seed and index bootstrap
- Shared Firestore collection shapes are now defined in `packages/types` for:
  - `projects`
  - `runs`
  - `toolInvocations`
  - `evaluations`
  - `escalations`
  - `promptVersions`
  - `documents`
  - `cases`
  - `users`
  - `accessCodes`
- Synthetic, non-sensitive bootstrap seed payloads now live under `data/seed/**`.
- Dev-only seed command:
  - `pnpm seed:firestore:dev`
- The dev seed script refuses to run unless both the project ID and Firestore database ID end with `-dev`.
- `portfolio-tq-dev` was seeded successfully on April 12, 2026 with synthetic project metadata, cases, prompt versions, run history, evaluations, tool invocations, escalations, users, documents, and a synthetic access-code metadata record.
- `portfolio-tq-prod` was intentionally left unseeded; this keeps production/demo-release data curation deliberate instead of automatic.
- Initial composite indexes were applied through Terraform in both projects for dashboard-style queries on:
  - `runs`
  - `toolInvocations`
  - `evaluations`
  - `escalations`
  - `promptVersions`
  - `cases`
- Runtime service accounts in both projects now also have `roles/datastore.user` so the API can read Firestore directly.
- Firestore-backed API read routes now exist at:
  - `GET /api/projects`
  - `GET /api/runs`
  - `GET /api/evaluations`
  - `GET /api/projects/:projectId/metrics`

## Observability bootstrap
- Structured API logging now flows through `apps/api/src/services/logs.ts`.
- Verified structured log fields now present in Cloud Logging:
  - `projectId`
  - `runId`
  - `environment`
  - `eventType`
  - `timestamp`
  - optional `latencyMs`
  - optional `promptVersionId`
- Verified lifecycle events in both environments on April 12, 2026:
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
- Monitoring dashboards created:
  - `portfolio_tq dev overview` -> `projects/932345783663/dashboards/39e77f9e-f33b-4520-975d-11fed2dbbc82`
  - `portfolio_tq prod overview` -> `projects/723738590534/dashboards/48c02f0a-2476-4b84-aeb6-944bcc3e9944`
- Log-based metrics created in both projects:
  - `fallback-triggered`
  - `run-failures`
- The dashboard feed route for the web app now exists at `GET /api/observability/overview`.
- The public `/observability` route now renders a live shell backed by the environment-specific Cloud Run API.
- Verified smoke commands on April 12, 2026:
  - `pnpm smoke:api:dev`
  - `pnpm smoke:api:prod`
  - `pnpm smoke:web:dev`
  - `pnpm smoke:web:prod`
  - `pnpm smoke:observability:web:dev`
  - `pnpm smoke:observability:web:prod`
- Verified recent Cloud Run traffic through the Monitoring API over the prior 30 minutes on April 12, 2026:
  - `portfolio-tq-api-dev` had nonzero `run.googleapis.com/request_count` on revisions `portfolio-tq-api-dev-00002-sdb` and `portfolio-tq-api-dev-00003-5v9`
  - `portfolio-tq-api-prod` had nonzero `run.googleapis.com/request_count` on revisions `portfolio-tq-api-prod-00002-d5s` and `portfolio-tq-api-prod-00003-229`
- The observability smoke script was adjusted to verify the public page shell and live API response without depending on browser-only module-script execution in `jsdom`.
- During section 8 verification, the `dev` Hosting site briefly served an older `404` release. Rerunning `pnpm deploy:web:dev` corrected it.

## Follow-up note for future infra work
- Current `firebase.json` still references the default Firestore database ID.
- When Firestore rules and indexes are automated, the Firebase/Terraform configuration should be revisited so it explicitly targets the named environment databases created during bootstrap.
- Firebase default hosting sites already exist outside Terraform. In this first-pass Terraform scaffold, the environment configs reference those existing site IDs without creating or importing them.
- Ignore files were strengthened early, but they still need to be reviewed whenever new local tooling, deploy flows, artifact types, or secret-handling patterns are introduced.
