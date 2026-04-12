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

## Follow-up note for future infra work
- Current `firebase.json` still references the default Firestore database ID.
- When Firestore rules and indexes are automated, the Firebase/Terraform configuration should be revisited so it explicitly targets the named environment databases created during bootstrap.
- Firebase default hosting sites already exist outside Terraform. In this first-pass Terraform scaffold, the environment configs reference those existing site IDs without creating or importing them.
- Ignore files were strengthened early, but they still need to be reviewed whenever new local tooling, deploy flows, artifact types, or secret-handling patterns are introduced.
