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

## Definition of done
- every demo run generates trace events
- at least one Cloud Monitoring dashboard exists
- in-app dashboard clearly surfaces failures and fallback behavior
