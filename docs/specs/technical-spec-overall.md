# Technical Spec — Overall System

## Architectural style
- One public React web app
- One backend API/orchestration service
- Shared monorepo packages
- Managed cloud infra via Terraform
- Public GitHub repo + GitHub Actions CI/CD
- Firebase Hosting for frontend
- Cloud Run for API
- Firestore for demo state, logs, traces, eval records
- Vertex AI for model access
- Cloud Logging / Monitoring for infra telemetry
- In-app dashboard pages for application telemetry

## Major runtime components
### Frontend (`apps/web`)
Responsibilities:
- render content pages
- host project detail pages
- host interactive demos
- render trace timelines, eval tables, charts, diagrams
- auth gate demo pages if needed

### API (`apps/api`)
Responsibilities:
- receive demo requests
- orchestrate tool-calling flows
- call Vertex AI
- enforce schemas
- run fallback logic
- persist run data and eval data
- expose observability endpoints and dashboard feeds

### Shared packages
- `packages/ui`: reusable UI components
- `packages/schemas`: zod/json schemas for inputs/outputs
- `packages/agents`: model wrappers and orchestration helpers
- `packages/tools`: mock internal tool clients and contracts
- `packages/evals`: scoring and evaluation utilities
- `packages/types`: shared TypeScript domain types
- `packages/config`: prompt versions, thresholds, routing, environment config

## Environments
- `dev`
- `prod`

`dev` is the default daily environment. `prod` is the public portfolio environment.

## Data model
### Core collections
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

### Shared run record
```ts
type DemoRun = {
  id: string;
  projectId: string;
  status: "queued" | "running" | "completed" | "failed" | "escalated";
  inputRef: string;
  outputRef?: string;
  confidence?: number;
  latencyMs?: number;
  estimatedCostUsd?: number;
  promptVersionId?: string;
  createdAt: string;
  updatedAt: string;
};
```

## Shared API patterns
- `POST /api/demo/:project/run`
- `GET /api/runs`
- `GET /api/runs/:id`
- `GET /api/evaluations`
- `GET /api/projects/:projectId/metrics`
- `POST /api/escalations`

## Security posture
- no sensitive real user data
- seeded and synthetic datasets only
- secrets managed in GCP Secret Manager
- GitHub OIDC for deploy auth
- no long-lived cloud deploy keys in repo
- optional simple access gate for demos

## Performance targets
- project content pages under ~2s interactive on broadband
- demo API median response < 8s for standard run
- each demo page should render usable state before demo execution
- evaluation console query pages should remain usable on seeded dataset size

## Design standards
- clean, modern, low-noise interface
- strong information hierarchy
- diagrams and traces are first-class
- desktop-first review quality, responsive across tablet/mobile
- charts for latency, cost, fallback, confidence, pass/fail

## Public repo standards
- clear commit messages
- docs near code
- meaningful issues/milestones
- architecture decision notes in docs
- no generated junk committed unnecessarily
