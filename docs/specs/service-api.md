# Service Spec — `apps/api`

## Purpose

Backend execution layer for demos, orchestration, retrieval, evaluation, and logs.

## Responsibilities

- execute AI demo workflows
- wrap Vertex AI calls
- expose mock internal tools
- validate structured outputs
- handle retries/fallbacks/escalations
- persist runs and evaluations
- feed frontend dashboard pages

## Runtime baseline

- Node.js + TypeScript
- current server baseline uses Node's built-in `node:http` runtime rather than Express
- shared runtime configuration is loaded centrally from `apps/api/src/config`
- Firestore access is wired through shared config and repository/service modules

## Response conventions

- JSON endpoints use one shared success envelope: `{ "ok": true, "data": ... }`
- JSON errors use one shared error envelope: `{ "ok": false, "error": { ... }, "requestId": "..." }`
- `GET /health` and `GET /ready` follow the same shared envelope instead of returning bare JSON payloads

## Firestore baseline

- the shared API uses the existing environment-specific Firestore databases already attached to the repo infrastructure
- current infra is wired to named database IDs for `dev` and `prod`, not an assumed `(default)` database
- collection names are injected from runtime env instead of hard-coded inside routes

## Health and readiness surfaces

- `GET /health` returns the standard success envelope with service metadata
- `GET /ready` currently reports configured dependency state for Firestore using the standard success envelope
- temporary implementation note: before the shared API runtime milestone is fully closed, `GET /ready` should be upgraded to perform a real Firestore read probe

## Internal modules

- `routes`
- `services/agents`
- `services/tools`
- `services/retrieval`
- `services/evals`
- `services/logs`
- `services/orchestrators`
- `middleware`

## Shared execution flow

1. receive request
2. create run record
3. gather project-specific inputs
4. call orchestrator
5. log tool invocations
6. validate schema
7. apply fallback policy if needed
8. persist output + evaluation
9. return response

## Observability requirements

- request logs
- run lifecycle logs
- tool invocation logs
- model latency + estimated cost
- error logs with project tag
- metrics exportable to dashboards

## Definition of done

- health endpoint
- all demo endpoints working
- structured logs emitted consistently
- run/eval persistence working
- no project bypasses shared wrappers for model calls
