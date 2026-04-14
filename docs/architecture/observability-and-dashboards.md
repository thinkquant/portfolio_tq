# Observability and Dashboards

## Observability layers
### 1. Application-level
Stored in Firestore and shown in the in-app console:
- run lifecycle
- tool invocation trace
- schema validation results
- confidence
- fallback
- escalation
- estimated cost
- prompt version

### 2. Platform-level
Sent to Google Cloud Logging / Monitoring:
- Cloud Run request counts
- latency
- errors
- deployment metadata
- container revision info

## Logging standard
Every log entry should include:
- `projectId`
- `runId`
- `environment`
- `eventType`
- `timestamp`
- optional `latencyMs`
- optional `promptVersionId`

## Core event types
- `run.created`
- `run.started`
- `model.requested`
- `model.completed`
- `tool.called`
- `tool.completed`
- `schema.validated`
- `fallback.triggered`
- `escalation.created`
- `run.completed`
- `run.failed`

## Dashboard pages in the web app
### `/observability`
Cross-project portfolio overview.

### `/projects/:projectId`
Each project page shows project-local metrics.

### `/demo/eval-console`
Operational evaluation console.

## GCP dashboards to provision
- Cloud Run latency + error rate
- request counts
- top error logs
- optional log-based metric for fallback count

## Current bootstrap status
- Structured API logs are emitted from `apps/api/src/services/logs.ts` and used by the live API route handlers.
- Verified structured fields now present in Cloud Logging:
  - `projectId`
  - `runId`
  - `environment`
  - `eventType`
  - `timestamp`
  - optional `latencyMs`
  - optional `promptVersionId`
- Verified request lifecycle logging now includes `request.received`, `request.completed`, and `request.failed` events with correlated `requestId` values so browser and backend debugging can be matched up across Cloud Run logs.
- Verified lifecycle events now emitted by demo runs:
  - `run.created`
  - `run.started`
  - `model.requested`
  - `model.completed`
  - `tool.called`
  - `tool.completed`
  - `schema.validated`
  - `fallback.triggered`
  - `escalation.created`
  - `run.completed`
  - `run.failed`
- Live dashboard-feed routes now exist:
  - `GET /api/observability/overview`
  - `GET /api/projects`
  - `GET /api/runs`
  - `GET /api/evaluations`
  - `GET /api/projects/:projectId/metrics`
- The current shared runtime also exposes Firestore-backed route surfaces for runs, evaluations, tool invocations, seed data, and mock internal tools, so the observability console can read from real shared records rather than process-local state.
- The public web route `/observability` now renders a live observability shell backed by the environment-specific API.
- Monitoring resources currently provisioned:
  - `portfolio_tq dev overview`
  - `portfolio_tq prod overview`
- Log-based metrics currently provisioned:
  - `fallback-triggered`
  - `run-failures`
- The current Monitoring dashboard layout includes:
  - request count
  - p95 request latency
  - error count
  - fallback-triggered count
  - recent API error logs

## Smoke commands
- `pnpm smoke:api:dev`
- `pnpm smoke:api:prod`
- `pnpm smoke:web:dev`
- `pnpm smoke:web:prod`
- `pnpm smoke:observability:web:dev`
- `pnpm smoke:observability:web:prod`

## Public repo note
- Keep observability docs, dashboard JSON, log examples, and seed data free of secrets, personal data, real customer identifiers, or internal-only operational values.

## Definition of done
- every demo run generates trace events
- at least one Cloud Monitoring dashboard exists
- in-app dashboard clearly surfaces failures and fallback behavior
